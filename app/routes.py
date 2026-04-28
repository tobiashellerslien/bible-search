from flask import Blueprint, current_app, jsonify, render_template, request, send_from_directory

from .services.bible import (
    USFM_TO_ALIASES,
    USFM_TO_ENG,
    USFM_TO_NAME,
    USFM_TO_TESTAMENT,
    get_search_stats,
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
    results, book_totals = search_text(bible_data, version_id, query, book_filter=book_filter)
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


@bp.get("/api/heartbeat")
def api_heartbeat():
    return jsonify({"ok": True})
