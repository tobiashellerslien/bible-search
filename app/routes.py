from flask import Blueprint, current_app, jsonify, render_template, request, send_from_directory

from .services.bible import (
    USFM_TO_ABBREV_NO,
    USFM_TO_ALIASES,
    USFM_TO_ENG,
    USFM_TO_NAME,
    USFM_TO_TESTAMENT,
    get_search_stats,
    identify_book,
    is_reference_query,
    parse_query,
    parse_search_query,
    quick_search,
    resolve_block,
    search_text,
    strip_scope_from_query,
)

bp = Blueprint("main", __name__)


def _bible_data():
    return current_app.config["BIBLE_DATA"]


def _resolve_version_id(bible_data, raw):
    """Parse version param (integer string) → int ID, falling back to first available."""
    try:
        vid = int(raw)
        if vid in bible_data.translations:
            return vid
    except (TypeError, ValueError):
        pass
    return next(iter(bible_data.translations), None)


@bp.get("/")
def index():
    return render_template("index.html")


@bp.get("/sw.js")
def service_worker():
    import os
    static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "js")
    response = send_from_directory(static_dir, "sw.js")
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Service-Worker-Allowed"] = "/"
    return response



@bp.get("/api/versions")
def api_versions():
    versions = list(_bible_data().translations.values())
    return jsonify({"versions": versions})


@bp.get("/api/books")
def api_books():
    bible_data = _bible_data()
    version_id = _resolve_version_id(bible_data, request.args.get("version"))
    if version_id is None:
        return jsonify({"books": [], "version": None})
    books_list = [
        {
            "code": code,
            "name": USFM_TO_NAME.get(code, code),
            "name_en": USFM_TO_ENG.get(code, code),
            "abbrev_no": USFM_TO_ABBREV_NO.get(code, code),
            "testament": USFM_TO_TESTAMENT.get(code, "OT"),
            "chapters": bible_data.book_chapters.get(version_id, {}).get(code, 0),
            "verse_counts": bible_data.book_verse_counts.get(version_id, {}).get(code, {}),
            "aliases": USFM_TO_ALIASES.get(code, []),
        }
        for code in bible_data.version_books.get(version_id, [])
    ]
    return jsonify({"books": books_list, "version": version_id})


@bp.get("/api/search")
def api_search():
    bible_data = _bible_data()
    query = request.args.get("q", "")
    if not query:
        return jsonify({"error": "No search query provided"}), 400
    version_id = _resolve_version_id(bible_data, request.args.get("version"))
    if version_id is None:
        return jsonify({"error": "No Bible versions available"}), 400

    if is_reference_query(query):
        blocks = parse_query(query)
        results = [resolve_block(bible_data, version_id, block) for block in blocks]
        return jsonify({"type": "reference", "results": results, "version": version_id})

    # Bare book name (e.g. "1. mosebok") — looks like an incomplete reference,
    # not a text search. Return a friendly error instead of letting FTS5 choke
    # on the unmatched book tokens.
    first_part = query.split(";")[0].strip()
    book_code, remainder = identify_book(first_part)
    if book_code and not remainder.strip():
        return jsonify({
            "type": "text_search",
            "error": {"code": "missing_reference", "name": USFM_TO_NAME.get(book_code, book_code)},
            "results": [],
            "query": query,
            "version": version_id,
        })

    parsed = parse_search_query(query)
    if parsed.get('error'):
        return jsonify({
            "type": "text_search",
            "error": parsed['error'],
            "results": [],
            "query": query,
            "version": version_id,
        })

    book_filter = request.args.get("book") or None
    try:
        results, book_totals = search_text(bible_data, version_id, query, book_filter=book_filter)
    except Exception as e:
        return jsonify({
            "type": "text_search",
            "error": {"code": "invalid_query", "detail": str(e)},
            "results": [],
            "query": query,
            "version": version_id,
        })
    return jsonify({
        "type": "text_search",
        "results": results,
        "book_totals": book_totals,
        "book_filter": book_filter,
        "query": query,
        "version": version_id,
    })


@bp.get("/api/quick_search")
def api_quick_search():
    bible_data = _bible_data()
    query = request.args.get("q", "")
    version_id = _resolve_version_id(bible_data, request.args.get("version"))
    if version_id is None:
        return jsonify({"results": [], "truncated": False, "query": query, "version": None})
    try:
        limit = max(1, min(100, int(request.args.get("limit", 25))))
    except (TypeError, ValueError):
        limit = 25
    results, truncated = quick_search(bible_data, version_id, query, limit=limit)
    return jsonify({
        "results": results,
        "truncated": truncated,
        "limit": limit,
        "query": query,
        "version": version_id,
    })


@bp.get("/api/all_versions")
def api_all_versions():
    bible_data = _bible_data()
    query = request.args.get("q", "")
    if not query:
        return jsonify({"error": "No query provided"}), 400
    blocks = parse_query(query)
    all_results = {
        version_id: [resolve_block(bible_data, version_id, block) for block in blocks]
        for version_id in bible_data.translations
    }
    return jsonify({"results": all_results, "query": query})


@bp.get("/api/stats")
def api_stats():
    bible_data = _bible_data()
    query = request.args.get("q", "")
    if not query:
        return jsonify({"error": "No query provided"}), 400
    version_id = _resolve_version_id(bible_data, request.args.get("version"))
    if version_id is None:
        return jsonify({"error": "No Bible versions available"}), 400
    bare_query, scope_label = strip_scope_from_query(query)
    stats = get_search_stats(bible_data, version_id, bare_query)
    total = sum(s['count'] for s in stats)
    return jsonify({
        "stats": stats, "total": total, "version": version_id,
        "query": bare_query, "original_query": query, "scope_label": scope_label,
    })


@bp.get("/api/all_text_search")
def api_all_text_search():
    bible_data = _bible_data()
    query = request.args.get("q", "")
    if not query:
        return jsonify({"error": "No query provided"}), 400
    all_results = {}
    for version_id in bible_data.translations:
        results, _ = search_text(bible_data, version_id, query, per_book=None)
        if results:
            all_results[version_id] = results
    return jsonify({"results": all_results, "query": query})


@bp.get("/api/crossrefs")
def api_crossrefs():
    bible_data = _bible_data()
    book = request.args.get("book", "")
    try:
        chapter = int(request.args.get("chapter", 0))
        verse   = int(request.args.get("verse",   0))
    except ValueError:
        return jsonify({"error": "Invalid chapter/verse"}), 400
    if not book or not chapter or not verse:
        return jsonify({"error": "Missing book, chapter, or verse"}), 400

    version_id = _resolve_version_id(bible_data, request.args.get("version"))
    try:
        limit = int(request.args.get("limit", "5"))
    except ValueError:
        limit = 5

    # Remap translation verse → KJV verse before querying the cross-refs table,
    # which uses KJV versification (e.g. Psalms with verse-0 superscriptions).
    kjv_book, kjv_chapter, kjv_verse = bible_data.verse_to_kjv(version_id, book, chapter, verse)

    rows = bible_data.db.execute(
        """SELECT to_book, to_chapter, to_verse_start, to_verse_end, to_chapter_end, votes
           FROM cross_references
           WHERE from_book=? AND from_chapter=? AND from_verse=?
           ORDER BY votes DESC""",
        [kjv_book, kjv_chapter, kjv_verse],
    ).fetchall()

    total = len(rows)
    display_rows = rows if limit <= 0 else rows[:limit]

    refs = []
    for to_book, to_ch, to_vs_start, to_vs_end, to_ch_end, votes in display_rows:
        if to_ch_end is not None:
            nb_s, nc_s, nv_s, _ = bible_data.normalize_reference(version_id, to_book, to_ch, to_vs_start)
            nb_e, nc_e, nv_e, _ = bible_data.normalize_reference(version_id, to_book, to_ch_end, to_vs_end)
            label = f"{USFM_TO_NAME.get(nb_s, nb_s)} {nc_s}:{nv_s}-{nc_e}:{nv_e}"
            nav_book, nav_ch, nav_vs = nb_s, nc_s, nv_s
            nav_vs_end, nav_ch_end = nv_e, nc_e
        elif to_vs_end is not None:
            nb, nc, nv_s, nv_e = bible_data.normalize_reference(version_id, to_book, to_ch, to_vs_start, to_vs_end)
            label = f"{USFM_TO_NAME.get(nb, nb)} {nc}:{nv_s}-{nv_e}"
            nav_book, nav_ch, nav_vs = nb, nc, nv_s
            nav_vs_end, nav_ch_end = nv_e, None
        else:
            nb, nc, nv_s, _ = bible_data.normalize_reference(version_id, to_book, to_ch, to_vs_start)
            label = f"{USFM_TO_NAME.get(nb, nb)} {nc}:{nv_s}"
            nav_book, nav_ch, nav_vs = nb, nc, nv_s
            nav_vs_end, nav_ch_end = None, None

        if nav_vs_end is not None and nav_ch_end is None:
            # single-chapter range: fetch all verses in range
            preview_rows = bible_data.db.execute(
                "SELECT text FROM verses WHERE translation_id=? AND book_usfm=? AND chapter=? AND verse BETWEEN ? AND ? ORDER BY verse",
                [version_id, nav_book, nav_ch, nav_vs, nav_vs_end],
            ).fetchall()
            preview = " ".join(r[0] for r in preview_rows) if preview_rows else ""
        elif nav_vs_end is not None and nav_ch_end is not None:
            # multi-chapter range: fetch from start chapter through end chapter
            preview_rows = bible_data.db.execute(
                """SELECT text FROM verses
                   WHERE translation_id=? AND book_usfm=?
                     AND ((chapter=? AND verse>=?) OR (chapter>? AND chapter<?) OR (chapter=? AND verse<=?))
                   ORDER BY chapter, verse""",
                [version_id, nav_book, nav_ch, nav_vs, nav_ch, nav_ch_end, nav_ch_end, nav_vs_end],
            ).fetchall()
            preview = " ".join(r[0] for r in preview_rows) if preview_rows else ""
        else:
            preview_row = bible_data.db.execute(
                "SELECT text FROM verses WHERE translation_id=? AND book_usfm=? AND chapter=? AND verse=?",
                [version_id, nav_book, nav_ch, nav_vs],
            ).fetchone()
            preview = preview_row[0] if preview_row else ""

        refs.append({
            "label": label,
            "book": nav_book,
            "chapter": nav_ch,
            "verse_start": nav_vs,
            "verse_end": nav_vs_end,
            "chapter_end": nav_ch_end,
            "preview": preview,
            "votes": votes,
        })

    return jsonify({"refs": refs, "total": total})


@bp.get("/api/places")
def api_places():
    """Places mentioned in a verse / verse range / chapter / chapter range.
    Required: book. Optional: chapter, verse_start, chapter_end, verse_end.
    If no chapter is given, returns places for the whole book."""
    bible_data = _bible_data()
    book = request.args.get("book", "").upper()
    if not book:
        return jsonify({"error": "Missing book"}), 400

    def _maybe_int(name):
        raw = request.args.get(name)
        if raw is None or raw == "":
            return None
        try:
            return int(raw)
        except ValueError:
            return None

    chapter = _maybe_int("chapter")
    chapter_end = _maybe_int("chapter_end")
    verse_start = _maybe_int("verse_start")
    verse_end = _maybe_int("verse_end")
    version_id = _resolve_version_id(bible_data, request.args.get("version"))

    if chapter is None:
        # Whole book — gather min/max chapter from any version
        max_ch = 0
        for vbooks in bible_data.book_chapters.values():
            max_ch = max(max_ch, vbooks.get(book, 0))
        if max_ch == 0:
            return jsonify({"places": []})
        places = bible_data.get_places_for_range(book, 1, None, max_ch, None, translation_id=version_id)
    else:
        places = bible_data.get_places_for_range(
            book, chapter, verse_start, chapter_end or chapter, verse_end,
            translation_id=version_id,
        )
    return jsonify({"places": places})


@bp.get("/api/place/<int:place_id>")
def api_place(place_id):
    """Full data for a single place, including every place_verses reference
    across the whole Bible. Used by the map popup's stats + details panels."""
    bible_data = _bible_data()
    place = bible_data.get_place_full(place_id)
    if place is None:
        return jsonify({"error": "Place not found"}), 404
    return jsonify({"place": place})


@bp.get("/api/commentaries")
def api_commentaries():
    bible_data = _bible_data()
    return jsonify({"commentaries": list(bible_data.commentaries.values())})


def _commentary_id_from_arg(bible_data, raw):
    """Accepts either numeric id or commentary code (e.g. 'scofield')."""
    if raw is None:
        return None
    try:
        cid = int(raw)
        if cid in bible_data.commentaries:
            return cid
    except (TypeError, ValueError):
        pass
    for c in bible_data.commentaries.values():
        if c["code"] == raw:
            return c["id"]
    return None


@bp.get("/api/commentary")
def api_commentary():
    bible_data = _bible_data()
    cid = _commentary_id_from_arg(bible_data, request.args.get("commentary"))
    if cid is None:
        return jsonify({"error": "Unknown commentary"}), 400
    book = request.args.get("book", "").upper()
    if not book:
        return jsonify({"error": "Missing book"}), 400

    def _maybe_int(name):
        v = request.args.get(name)
        if v in (None, ""):
            return None
        try:
            return int(v)
        except ValueError:
            return None

    chapter = _maybe_int("chapter")
    if chapter is None:
        return jsonify({"error": "Missing chapter"}), 400
    chapter_end = _maybe_int("chapter_end")
    verse_start = _maybe_int("verse_start")
    verse_end = _maybe_int("verse_end")

    # Translate user-vsf (translation) -> commentary's vsf before querying.
    version_id = _resolve_version_id(bible_data, request.args.get("version"))
    src_vsf = bible_data.vsf.translation_vsf(version_id) if version_id is not None else "eng"
    dst_vsf = bible_data.vsf.commentary_vsf(cid)
    q_book, q_ch, q_vs, q_ch_end, q_vs_end = book, chapter, verse_start, chapter_end, verse_end
    if src_vsf != dst_vsf:
        if verse_start is not None:
            q_book, q_ch, q_vs = bible_data.vsf.convert(src_vsf, dst_vsf, book, chapter, verse_start)
        if (chapter_end is not None) or (verse_end is not None):
            ce = chapter_end if chapter_end is not None else chapter
            ve = verse_end if verse_end is not None else (verse_start if verse_start is not None else 1)
            _, q_ch_end, q_vs_end = bible_data.vsf.convert(src_vsf, dst_vsf, book, ce, ve)

    entries = bible_data.get_commentary_entries(
        cid, q_book, q_ch, q_vs, q_ch_end, q_vs_end
    )
    payload = {"commentary": bible_data.commentaries[cid], "entries": entries}
    if request.args.get("include_intro") in ("1", "true", "yes"):
        # Books in the queried range — commentary range stays within a single
        # book here (the API always queries by `book`), but keep the list shape
        # so we can extend later for cross-book requests.
        payload["intros"] = bible_data.get_commentary_intros(cid, [q_book])
    return jsonify(payload)


@bp.get("/api/topics")
def api_topics():
    bible_data = _bible_data()
    book = request.args.get("book", "").upper()
    if not book:
        return jsonify({"error": "Missing book"}), 400

    def _maybe_int(name):
        v = request.args.get(name)
        if v in (None, ""):
            return None
        try:
            return int(v)
        except ValueError:
            return None

    chapter = _maybe_int("chapter")
    verse = _maybe_int("verse")            # legacy: single-verse mode
    chapter_end = _maybe_int("chapter_end")
    verse_start = _maybe_int("verse_start")
    verse_end = _maybe_int("verse_end")
    if chapter is None:
        return jsonify({"error": "Missing chapter"}), 400

    # All known topic sources currently use eng vsf, so we translate user input
    # to eng before lookup.
    version_id = _resolve_version_id(bible_data, request.args.get("version"))

    # Single-verse mode (legacy): /api/topics?book=&chapter=&verse=
    if verse_start is None and chapter_end is None and verse is not None:
        if version_id is not None:
            eb, ec, ev = bible_data.vsf.translation_to_eng(version_id, book, chapter, verse)
            topics = bible_data.get_topics_for_verse(eb, ec, ev)
        else:
            topics = bible_data.get_topics_for_verse(book, chapter, verse)
        return jsonify({"topics": topics})

    # Range mode: returns aggregated tree sorted by descendant verse-count.
    ch_start = chapter
    ch_end = chapter_end if chapter_end is not None else chapter
    eb_s, ec_s, ev_s = book, ch_start, verse_start
    eb_e, ec_e, ev_e = book, ch_end, verse_end
    if version_id is not None:
        try:
            if verse_start is not None:
                eb_s, ec_s, ev_s = bible_data.vsf.translation_to_eng(version_id, book, ch_start, verse_start)
            if verse_end is not None:
                _eb2, ec_e, ev_e = bible_data.vsf.translation_to_eng(version_id, book, ch_end, verse_end)
        except Exception:
            pass
    tree = bible_data.aggregate_topics_for_range(eb_s, ec_s, ev_s, ec_e, ev_e)
    return jsonify({"topics": tree, "mode": "range"})


@bp.get("/api/topic/<int:topic_id>")
def api_topic_detail(topic_id):
    bible_data = _bible_data()
    topic = bible_data.get_topic(topic_id)
    if not topic:
        return jsonify({"error": "Topic not found"}), 404
    return jsonify(topic)


@bp.get("/api/outline")
def api_outline():
    bible_data = _bible_data()
    book = request.args.get("book", "").upper()
    if not book:
        return jsonify({"error": "Missing book"}), 400
    outline = bible_data.get_outline(book)
    if not outline:
        return jsonify({"error": "No outline available"}), 404

    # Translate outline refs from outline-vsf -> user-translation-vsf so the
    # frontend can navigate using the labels the user expects.
    version_id = _resolve_version_id(bible_data, request.args.get("version"))
    src_vsf = bible_data.vsf.outline_vsf(book)
    dst_vsf = bible_data.vsf.translation_vsf(version_id) if version_id is not None else "eng"
    if src_vsf != dst_vsf:
        def _walk(nodes):
            for n in nodes:
                refs = n.get("refs") or []
                for r in refs:
                    b1, c1, v1 = bible_data.vsf.convert(src_vsf, dst_vsf, r["book"], r["ch_start"], r["vs_start"])
                    _, c2, v2 = bible_data.vsf.convert(src_vsf, dst_vsf, r["book"], r["ch_end"], r["vs_end"])
                    r["book"] = b1
                    r["ch_start"], r["vs_start"] = c1, v1
                    r["ch_end"], r["vs_end"] = c2, v2
                _walk(n.get("children") or [])
        _walk(outline.get("tree", []))
    return jsonify(outline)


@bp.get("/api/heartbeat")
def api_heartbeat():
    return jsonify({"ok": True})
