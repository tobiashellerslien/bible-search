import hashlib
import html as _html
import re
import time
from datetime import datetime, timezone

import requests as _requests

from flask import Blueprint, current_app, jsonify, render_template, request, send_from_directory

from .services.bible import (
    SLUG_TO_USFM,
    USFM_TO_ABBREV_NO,
    USFM_TO_ALIASES,
    USFM_TO_ENG,
    USFM_TO_NAME,
    USFM_TO_ORDER,
    USFM_TO_SLUG,
    USFM_TO_TESTAMENT,
    build_canonical_path,
    get_search_stats,
    identify_book,
    is_reference_query,
    linkify_dictionary_refs,
    parse_canonical_path,
    parse_query,
    parse_search_query,
    quick_search,
    ref_label,
    resolve_block,
    search_commentaries,
    search_leksikon,
    search_text,
    strip_scope_from_query,
)

# Canonical version for /bibel/... URLs (and the dynamic sitemap). Other
# translations get a <link rel="canonical"> pointing to this version's URL,
# so Google indexes one URL per chapter instead of N copies.
CANONICAL_VERSION_ID = 102  # NB88 — Norsk Bibel 88/07

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


def _canonical_version_id(bible_data):
    """ID of the version used for canonical URLs / sitemap (NB88 if available)."""
    if CANONICAL_VERSION_ID in bible_data.translations:
        return CANONICAL_VERSION_ID
    return next(iter(bible_data.translations), None)


def _seo_for_block(bible_data, version_id, block, resolved):
    """Build SEO metadata + a template-friendly prerendered structure for the
    given resolved block. resolved is the dict returned by resolve_block()."""
    label = resolved.get("label") or ""
    verses = resolved.get("verses") or []
    headings = resolved.get("headings") or []
    version_name = bible_data.translations.get(version_id, {}).get("name", "")

    verse_text_joined = " ".join(v.get("text", "") for v in verses).strip()
    description = verse_text_joined
    if len(description) > 300:
        description = description[:297] + "…"
    if version_name:
        description = f"{description} ({version_name})" if description else f"Les {label} i {version_name}."

    og_title = f"{label} – Bibelsøk" if label else "Bibelsøk"
    canonical_path = build_canonical_path(block) or "/"
    canonical_version = _canonical_version_id(bible_data)
    # Canonical URL always points to the canonical version, without a ?v= param
    # when the caller is already viewing it — duplicates funnel to one URL.
    canonical_url = f"https://xn--bibelsk-v1a.no{canonical_path}"

    # Headings are positional ("render before verse N"). Group them with verses
    # for clean template rendering.
    headings_by_pos = {}
    for h in headings:
        key = (h.get("chapter"), h.get("verse"))
        headings_by_pos.setdefault(key, []).append(h.get("text", ""))
    rendered_verses = []
    for v in verses:
        key = (v.get("chapter"), v.get("num"))
        rendered_verses.append({
            "chapter": v.get("chapter"),
            "num": v.get("num"),
            "text": v.get("text", ""),
            "headings": headings_by_pos.pop(key, []),
        })

    prerendered = {
        "label": label,
        "book": resolved.get("book"),
        "verses": rendered_verses,
        "is_chapter": resolved.get("is_chapter", False),
    }

    return {
        "og_title": og_title,
        "og_description": description or "Les Bibelen — fritt søk, kart, kommentarer og leksikon.",
        "og_url": canonical_url,
        "canonical_url": canonical_url,
        "prerendered_block": prerendered,
        "is_canonical_version": (version_id == canonical_version),
    }


@bp.get("/")
def index():
    og_title = "Bibelsøk – Les, søk og studér Bibelen"
    og_description = "Gratis verktøy for bibelsøk og bibelstudie. Søk i Bibelen 2011, Norsk Bibel 88/07, Bibelen Guds Ord, ESV m.fl. Interaktivt bibelkart, kommentarer, leksikon og mer."
    og_url = "https://xn--bibelsk-v1a.no/"
    query = request.args.get("q", "").strip()

    # If the query is a simple, single-block reference that maps cleanly to a
    # canonical /bibel/<slug>/<ch>[/<vs>] URL, 301-redirect there so all
    # incoming traffic (shared links, OG previews) funnels to the canonical
    # form. Multi-block (;) and multi-chapter ranges stay on /?q=.
    if query and is_reference_query(query) and ";" not in query:
        try:
            parsed_blocks = parse_query(query)
            if len(parsed_blocks) == 1 and "error" not in parsed_blocks[0]:
                canonical_path = build_canonical_path(parsed_blocks[0])
                if canonical_path:
                    from flask import redirect
                    v = request.args.get("v")
                    target = canonical_path + (f"?v={v}" if v else "")
                    return redirect(target, code=301)
        except Exception:
            pass

    if query and is_reference_query(query):
        try:
            bible_data = _bible_data()
            version_id = _resolve_version_id(bible_data, request.args.get("v"))
            blocks = parse_query(query)
            if blocks:
                block = resolve_block(bible_data, version_id, blocks[0])
                label = block.get("label", "")
                verses = block.get("verses", [])
                if label and verses:
                    verse_text = " ".join(v.get("text", "") for v in verses).strip()
                    if len(verse_text) > 300:
                        verse_text = verse_text[:297] + "…"
                    version_name = bible_data.translations.get(version_id, {}).get("name", "")
                    og_title = f"{label} – Bibelsøk"
                    og_description = f"{verse_text} ({version_name})" if version_name else verse_text
                    og_url = f"https://xn--bibelsk-v1a.no/?q={request.args.get('q', '')}"
                    if request.args.get("v"):
                        og_url += f"&v={request.args.get('v')}"
        except Exception:
            pass
    return render_template(
        "index.html",
        og_title=og_title,
        og_description=og_description,
        og_url=og_url,
        canonical_url=og_url,
        prerendered_block=None,
        is_canonical_version=True,
        boot_query=None,
        boot_version=None,
        robots_noindex=False,
        boot_study=None,
    )


@bp.get("/bibel/<book_slug>/<int:chapter>")
@bp.get("/bibel/<book_slug>/<int:chapter>/<range_str>")
def bibel_path(book_slug, chapter, range_str=None):
    """Canonical path URL for a chapter / verse / verse range.
    Examples: /bibel/joh/3, /bibel/joh/3/16, /bibel/joh/3/16-18.
    Multi-chapter ranges and multi-block (;) queries are not expressible here
    and stay on /?q=."""
    block = parse_canonical_path(book_slug, chapter, range_str)
    if block is None:
        from flask import abort
        abort(404)
    bible_data = _bible_data()
    # Default to canonical version (NB88) for /bibel/... URLs when no ?v= is
    # specified — this is what shared links and Google index point to.
    raw_v = request.args.get("v")
    if raw_v:
        version_id = _resolve_version_id(bible_data, raw_v)
    else:
        version_id = _canonical_version_id(bible_data)
    if version_id is None:
        from flask import abort
        abort(503)

    # Validate chapter / verse exist for the requested version, before resolving.
    book = block["book"]
    max_ch = bible_data.book_chapters.get(version_id, {}).get(book, 0)
    target_ch = block.get("chapter") or 1
    if target_ch < 1 or target_ch > max_ch:
        from flask import abort
        abort(404)
    max_v = bible_data.book_verse_counts.get(version_id, {}).get(book, {}).get(target_ch, 0)
    if block["type"] == "single_verse":
        if block["verse"] < 1 or block["verse"] > max_v:
            from flask import abort
            abort(404)
    elif block["type"] == "verse_range":
        if block["vs_start"] < 1 or block["vs_end"] > max_v:
            from flask import abort
            abort(404)

    resolved = resolve_block(bible_data, version_id, block)
    if resolved.get("error"):
        from flask import abort
        abort(404)

    seo = _seo_for_block(bible_data, version_id, block, resolved)
    # The SPA looks at boot_query / boot_version to seed its initial render
    # without an extra /api/search round-trip. boot_version is only set when
    # the caller passed ?v= explicitly — otherwise the SPA falls back to its
    # localStorage-stored default version (so the canonical NB88 used for
    # SEO/pre-rendering doesn't overwrite the user's preferred translation).
    boot_query = block.get("label", "")
    return render_template(
        "index.html",
        og_title=seo["og_title"],
        og_description=seo["og_description"],
        og_url=seo["og_url"],
        canonical_url=seo["canonical_url"],
        prerendered_block=seo["prerendered_block"],
        is_canonical_version=seo["is_canonical_version"],
        boot_query=boot_query,
        boot_version=(version_id if raw_v else None),
        robots_noindex=False,
        boot_study=None,
    )


@bp.get("/sok")
def sok():
    """Text-search results page. Renders the same SPA shell but with
    robots noindex — search-result pages don't belong in Google's index."""
    return render_template(
        "index.html",
        og_title="Søk – Bibelsøk",
        og_description="Søk i Bibelen — fritt tekstsøk, kart, kommentarer og leksikon.",
        og_url="https://xn--bibelsk-v1a.no/sok",
        canonical_url=None,
        prerendered_block=None,
        is_canonical_version=True,
        boot_query=request.args.get("q", ""),
        boot_version=None,
        robots_noindex=True,
        boot_study=None,
    )


@bp.get("/studie")
def studie():
    """Study-data view (commentary / topics / leksikon search, or a single
    topic drilldown). Renders the same SPA shell with a study boot payload so
    the page can be reloaded / shared / restored directly. noindex — these are
    result pages, not canonical content."""
    scope = request.args.get("scope", "")
    topic = request.args.get("topic", "")
    sg = request.args.get("sg", "")
    return render_template(
        "index.html",
        og_title="Studiesøk – Bibelsøk",
        og_description="Søk i bibelkommentarer, bibelleksikon og temaregister.",
        og_url="https://xn--bibelsk-v1a.no/studie",
        canonical_url=None,
        prerendered_block=None,
        is_canonical_version=True,
        boot_query=None,
        boot_version=None,
        robots_noindex=True,
        boot_study={
            "scope": scope,
            "q": request.args.get("q", ""),
            "topic": topic,
            "sg": sg,
        },
    )


@bp.get("/robots.txt")
def robots_txt():
    return send_from_directory(current_app.static_folder, "robots.txt")


@bp.get("/sitemap.xml")
def sitemap_xml():
    """Dynamic sitemap listing every chapter URL in the canonical version.
    ~1189 URLs (66 books × per-book chapter counts), well under the 50 000-URL
    sitemap limit."""
    from flask import Response
    bible_data = _bible_data()
    cvid = _canonical_version_id(bible_data)
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    base = "https://xn--bibelsk-v1a.no"

    parts = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        f'  <url><loc>{base}/</loc><lastmod>{today}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>',
    ]

    if cvid is not None:
        # Iterate books in canonical order so the sitemap is human-scannable.
        books = bible_data.version_books.get(cvid, [])
        chapter_map = bible_data.book_chapters.get(cvid, {})
        for book_usfm in books:
            slug = USFM_TO_SLUG.get(book_usfm)
            if not slug:
                continue
            n_chapters = chapter_map.get(book_usfm, 0)
            for ch in range(1, n_chapters + 1):
                parts.append(
                    f'  <url><loc>{base}/bibel/{slug}/{ch}</loc>'
                    f'<lastmod>{today}</lastmod>'
                    f'<changefreq>yearly</changefreq>'
                    f'<priority>0.8</priority></url>'
                )

    parts.append('</urlset>')
    return Response("\n".join(parts), mimetype="application/xml")


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
    local_names = bible_data.book_names.get(version_id, {})
    books_list = [
        {
            "code": code,
            "name": USFM_TO_NAME.get(code, code),
            "name_en": USFM_TO_ENG.get(code, code),
            "name_local": local_names.get(code),
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
        # Compare-mode: when the caller passes ?src_version=<id> different from
        # ?version=<id>, the reference was authored in src_version's vsf and we
        # need to remap it to target vsf before resolving (e.g. NB88 Joel 3:1
        # → NIV Joel 2:28). Only convert when src_version was explicitly given —
        # _resolve_version_id falls back to the first translation otherwise.
        src_raw = request.args.get("src_version")
        src_version_id = _resolve_version_id(bible_data, src_raw) if src_raw else None
        if src_version_id is not None and src_version_id != version_id:
            src_books = bible_data.book_verse_counts.get(src_version_id, {})
            blocks = [
                bible_data.vsf.convert_translation_block(
                    b, src_version_id, version_id,
                    src_max_verses=src_books.get(b.get("book")),
                )
                if "error" not in b else b
                for b in blocks
            ]
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
    src_raw = request.args.get("src_version")
    src_version_id = _resolve_version_id(bible_data, src_raw) if src_raw else None
    src_books = bible_data.book_verse_counts.get(src_version_id, {}) if src_version_id else {}
    all_results = {}
    for vid, meta in bible_data.translations.items():
        # Low-key Vietnamese versions are excluded from the "all versions" aggregate.
        if meta.get("language") == "vi":
            continue
        per_version_blocks = blocks
        if src_version_id is not None and src_version_id != vid:
            per_version_blocks = [
                bible_data.vsf.convert_translation_block(
                    b, src_version_id, vid,
                    src_max_verses=src_books.get(b.get("book")),
                )
                if "error" not in b else b
                for b in blocks
            ]
        all_results[vid] = [resolve_block(bible_data, vid, block) for block in per_version_blocks]
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
    for version_id, meta in bible_data.translations.items():
        if meta.get("language") == "vi":
            continue
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
            label = ref_label(nb, nc, nv_s, nv_e)
            nav_book, nav_ch, nav_vs = nb, nc, nv_s
            nav_vs_end, nav_ch_end = nv_e, None
        else:
            nb, nc, nv_s, _ = bible_data.normalize_reference(version_id, to_book, to_ch, to_vs_start)
            label = ref_label(nb, nc, nv_s)
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
    # Map each entry's coordinates back from the commentary's vsf to the user's
    # display vsf, so labels and marked-verse matching line up with the verse
    # numbers actually on screen (e.g. NB88 Joel 3:1, not the commentary's eng
    # Joel 2:28). Chapter-level entries (verse_start is None) anchor on verse 1.
    if src_vsf != dst_vsf:
        conv = []
        for e in entries:
            ech, evs, eve = e.get("chapter"), e.get("verse_start"), e.get("verse_end")
            if evs is None:
                _, c, _ = bible_data.vsf.convert(dst_vsf, src_vsf, book, ech, 1)
                conv.append({**e, "chapter": c})
                continue
            _, c1, v1 = bible_data.vsf.convert(dst_vsf, src_vsf, book, ech, evs)
            if eve is None:
                conv.append({**e, "chapter": c1, "verse_start": v1})
            else:
                _, _c2, v2 = bible_data.vsf.convert(dst_vsf, src_vsf, book, ech, eve)
                conv.append({**e, "chapter": c1, "verse_start": v1, "verse_end": v2})
        entries = conv
    payload = {"commentary": bible_data.commentaries[cid], "entries": entries}
    if request.args.get("include_intro") in ("1", "true", "yes"):
        # Books in the queried range — commentary range stays within a single
        # book here (the API always queries by `book`), but keep the list shape
        # so we can extend later for cross-book requests.
        payload["intros"] = bible_data.get_commentary_intros(cid, [q_book])
    return jsonify(payload)


@bp.get("/api/dictionaries")
def api_dictionaries():
    bible_data = _bible_data()
    return jsonify({"dictionaries": list(bible_data.dictionaries.values())})


@bp.get("/api/leksikon")
def api_leksikon():
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
    if chapter is None:
        return jsonify({"error": "Missing chapter"}), 400
    chapter_end = _maybe_int("chapter_end")
    verse_start = _maybe_int("verse_start")
    verse_end = _maybe_int("verse_end")

    # Dictionary refs (Easton/Smith) are eng vsf. Translate the user-vsf
    # window to eng before lookup, then remap each entry's triggered_by refs
    # back to the user's vsf so chip labels match the displayed verses.
    version_id = _resolve_version_id(bible_data, request.args.get("version"))
    tx_vsf = bible_data.vsf.translation_vsf(version_id) if version_id is not None else "eng"
    non_eng = (tx_vsf != "eng")

    ch_end_eff = chapter_end if chapter_end is not None else chapter
    if non_eng:
        s_v = verse_start if verse_start is not None else 1
        e_v = verse_end if verse_end is not None else 999
        _, q_ch_s, q_vs_s = bible_data.vsf.to_eng(tx_vsf, book, chapter, s_v)
        _, q_ch_e, q_vs_e = bible_data.vsf.to_eng(tx_vsf, book, ch_end_eff, e_v)
        # Widen the eng window: any eng-vs that, when mapped back, may fall
        # inside the user window. Use whole-chapter window between endpoints.
        lo_ch, hi_ch = min(q_ch_s, q_ch_e), max(q_ch_s, q_ch_e)
        entries = bible_data.get_dictionary_entries_for_range(
            book, lo_ch, None, hi_ch, None,
        )
    else:
        entries = bible_data.get_dictionary_entries_for_range(
            book, chapter, verse_start, chapter_end, verse_end,
        )

    if non_eng:
        # Remap each triggered_by ref eng→tx_vsf and filter to user window.
        ch_s_user = chapter
        ch_e_user = ch_end_eff
        for entry in entries:
            kept = []
            for t in entry.get("triggered_by", []):
                ch = t.get("chapter")
                ch_e = t.get("chapter_end") if t.get("chapter_end") is not None else ch
                vs_s = t.get("verse_start")
                vs_e = t.get("verse_end") if t.get("verse_end") is not None else vs_s
                _, m_ch_s, m_vs_s = bible_data.vsf.from_eng(tx_vsf, book, ch, vs_s)
                _, m_ch_e, m_vs_e = bible_data.vsf.from_eng(tx_vsf, book, ch_e, vs_e)
                # Overlap test in user vsf (verse-resolution chapter*1000+verse)
                a = m_ch_s * 1000 + m_vs_s
                b = m_ch_e * 1000 + m_vs_e
                u_s = ch_s_user * 1000 + (verse_start if verse_start is not None else 0)
                u_e = ch_e_user * 1000 + (verse_end if verse_end is not None else 999)
                if min(a, b) > u_e or max(a, b) < u_s:
                    continue
                kept.append({
                    "chapter": m_ch_s,
                    "verse_start": m_vs_s,
                    "verse_end": m_vs_e,
                    "chapter_end": m_ch_e,
                })
            entry["triggered_by"] = kept
        entries = [e for e in entries if e.get("triggered_by")]

    # Wrap inline scripture refs (Easton/Smith prose) in anchors so the
    # frontend can render the same verse-preview popup as commentaries.
    for entry in entries:
        entry["body"] = linkify_dictionary_refs(entry.get("body"))

    return jsonify({"entries": entries})


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

    # Single-verse mode (legacy) is just a 1-verse range.
    if verse_start is None and chapter_end is None and verse is not None:
        verse_start = verse_end = verse

    # Range mode: subjects (with their triggered subgroups), sorted by verse-count.
    ch_start = chapter
    ch_end = chapter_end if chapter_end is not None else chapter
    tx_vsf = bible_data.vsf.translation_vsf(version_id) if version_id is not None else "eng"
    non_eng = (tx_vsf != "eng")
    eb_s, ec_s, ev_s = book, ch_start, verse_start
    eb_e, ec_e, ev_e = book, ch_end, verse_end
    if non_eng:
        # Convert window to eng. When verses are absent, use the translation's
        # actual chapter bounds so the eng window matches the user's window
        # exactly (no over-fetch causing false matches in Joel/Mal/Ps).
        try:
            verse_counts = bible_data.book_verse_counts.get(version_id, {}).get(book, {})
            s_v = verse_start if verse_start is not None else 1
            e_v = verse_end if verse_end is not None else verse_counts.get(ch_end, 999)
            eb_s, ec_s, ev_s = bible_data.vsf.to_eng(tx_vsf, book, ch_start, s_v)
            _eb2, ec_e, ev_e = bible_data.vsf.to_eng(tx_vsf, book, ch_end, e_v)
        except Exception:
            pass
    topics = bible_data.get_topics_for_range(eb_s, ec_s, ev_s, ec_e, ev_e)

    if non_eng:
        # Clamp each triggered_by to the eng query window, then remap eng→user
        # vsf so chip labels match the rendered verses. Drops any subgroup whose
        # triggers all fall outside the window, and any subject left empty.
        eng_lo = ec_s * 1000 + ev_s
        eng_hi = ec_e * 1000 + ev_e
        verse_counts = bible_data.book_verse_counts.get(version_id, {}).get(book, {})
        u_lo = ch_start * 1000 + (verse_start if verse_start is not None else 1)
        u_hi = ch_end * 1000 + (verse_end if verse_end is not None else verse_counts.get(ch_end, 999))
        def _remap_trig(t):
            ch = t["chapter"]
            vs_s = t["verse_start"]
            vs_e = t["verse_end"] if t.get("verse_end") is not None else vs_s
            t_lo = max(ch * 1000 + vs_s, eng_lo)
            t_hi = min(ch * 1000 + vs_e, eng_hi)
            if t_lo > t_hi:
                return None
            e_ch_s, e_vs_s = divmod(t_lo, 1000)
            e_ch_e, e_vs_e = divmod(t_hi, 1000)
            _, m_ch_s, m_vs_s = bible_data.vsf.from_eng(tx_vsf, book, e_ch_s, e_vs_s)
            _, m_ch_e, m_vs_e = bible_data.vsf.from_eng(tx_vsf, book, e_ch_e, e_vs_e)
            # Drop chips that don't actually fall inside the user's vsf window
            # (translation storage may not match its declared vsf perfectly).
            a = m_ch_s * 1000 + m_vs_s
            b = m_ch_e * 1000 + m_vs_e
            if min(a, b) > u_hi or max(a, b) < u_lo:
                return None
            return {
                "chapter": m_ch_s,
                "verse_start": m_vs_s,
                "verse_end": m_vs_e if (m_ch_e != m_ch_s or m_vs_e != m_vs_s) else None,
            }
        kept_topics = []
        for topic in topics:
            kept_sgs = []
            for sg in topic.get("triggered_subgroups", []):
                kept = []
                for t in sg.get("triggered_by", []):
                    r = _remap_trig(t)
                    if r is not None:
                        kept.append(r)
                if kept:
                    sg["triggered_by"] = kept
                    kept_sgs.append(sg)
            if kept_sgs:
                topic["triggered_subgroups"] = kept_sgs
                topic["triggered_count"] = sum(len(sg["triggered_by"]) for sg in kept_sgs)
                kept_topics.append(topic)
        # Re-sort: remapping may have dropped triggers, changing relevance order.
        kept_topics.sort(key=lambda x: (-x.get("triggered_count", 0),
                                        -x.get("verse_count", 0), x["name"]))
        topics = kept_topics

    return jsonify({"topics": topics, "mode": "range"})


@bp.get("/api/topic/<int:topic_id>")
def api_topic_detail(topic_id):
    bible_data = _bible_data()
    topic = bible_data.get_topic(topic_id)
    if not topic:
        return jsonify({"error": "Topic not found"}), 404
    return jsonify(topic)


# ── Study-data search (commentary / topics / leksikon) ──────────────────────
# Redirect a text query into one of the study datasets. All three share the
# bible-search query syntax (AND/OR/"phrase"/-exclude) via FTS5. English-only
# (source data is English).

@bp.get("/api/search/commentary")
def api_search_commentary():
    bible_data = _bible_data()
    query = request.args.get("q", "")
    if not query.strip():
        return jsonify({"type": "commentary_search", "results": [], "query": query})
    rows = search_commentaries(bible_data, query)
    # Group commentary → book, preserving relevance order of first appearance.
    comm_order, comm_map = [], {}
    for r in rows:
        cid = r["commentary_id"]
        cgroup = comm_map.get(cid)
        if cgroup is None:
            cgroup = {"commentary": bible_data.commentaries.get(cid, {"id": cid}),
                      "_books": {}, "_order": []}
            comm_map[cid] = cgroup
            comm_order.append(cid)
        book = r["book_usfm"]
        bgroup = cgroup["_books"].get(book)
        if bgroup is None:
            bgroup = {"book": book, "name": USFM_TO_NAME.get(book, book), "entries": []}
            cgroup["_books"][book] = bgroup
            cgroup["_order"].append(book)
        bgroup["entries"].append({
            "chapter": r["chapter"], "verse_start": r["verse_start"],
            "verse_end": r["verse_end"], "ref_label": r["ref_label"],
            "is_intro": r["is_intro"], "kind": r["kind"], "snippet": r["snippet"],
        })
    results = []
    for cid in comm_order:
        # Books in canonical order; entries within each book in chapter:verse
        # order (intros at chapter 0 sort first). Relevance order is dropped so
        # the listing reads top-to-bottom like the Bible.
        books = sorted(comm_map[cid]["_books"].values(),
                       key=lambda b: USFM_TO_ORDER.get(b["book"], 99))
        for b in books:
            b["entries"].sort(key=lambda e: (e["chapter"], e["verse_start"] or 0))
        results.append({"commentary": comm_map[cid]["commentary"], "books": books})
    return jsonify({"type": "commentary_search", "results": results,
                    "query": query, "total": len(rows)})


@bp.get("/api/search/leksikon")
def api_search_leksikon():
    bible_data = _bible_data()
    query = request.args.get("q", "")
    if not query.strip():
        return jsonify({"type": "leksikon_search", "results": [], "query": query})
    rows = search_leksikon(bible_data, query)
    # Group by headword; each box lists which dictionaries have an entry.
    order, by_hw = [], {}
    for r in rows:
        hw = r["headword"]
        g = by_hw.get(hw)
        if g is None:
            g = {"headword": hw, "title": r["title"], "entries": []}
            by_hw[hw] = g
            order.append(hw)
        dmeta = bible_data.dictionaries.get(r["dictionary_id"], {})
        g["entries"].append({
            "dictionary_id": r["dictionary_id"],
            "dictionary_code": dmeta.get("code"),
            "dictionary_short_name": dmeta.get("short_name"),
            "dictionary_name": dmeta.get("name"),
            "title": r["title"],
            "body": linkify_dictionary_refs(r["body"]),
        })
    for g in by_hw.values():
        g["entries"].sort(key=lambda e: e["dictionary_id"])
    # Headwords present in the most dictionaries first (stable: ties keep
    # relevance/insertion order).
    results = sorted((by_hw[h] for h in order),
                     key=lambda g: -len(g["entries"]))
    return jsonify({"type": "leksikon_search", "results": results,
                    "query": query, "total": len(rows)})


@bp.get("/api/search/topics")
def api_search_topics():
    bible_data = _bible_data()
    query = request.args.get("q", "")
    if not query.strip():
        return jsonify({"type": "topic_search", "results": [], "query": query})
    results = bible_data.search_topics_by_name(query)
    return jsonify({"type": "topic_search", "results": results,
                    "query": query, "total": len(results)})


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


_FEEDBACK_CATEGORIES = {
    "bug": "🐛 Bug",
    "feature": "✨ Ny funksjon",
    "change": "🔧 Endring",
    "other": "💬 Annet",
}
_FEEDBACK_RATE_LIMIT_SEC = 30
_FEEDBACK_LAST_SUBMIT: dict[str, float] = {}
_EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


@bp.post("/api/feedback")
def api_feedback():
    token = current_app.config.get("TELEGRAM_BOT_TOKEN") or ""
    chat_id = current_app.config.get("TELEGRAM_CHAT_ID") or ""
    if not token or not chat_id:
        return jsonify({"ok": False, "error": "feedback_not_configured"}), 503

    data = request.get_json(silent=True) or {}
    category = (data.get("category") or "").strip().lower()
    email = (data.get("email") or "").strip()
    message = (data.get("message") or "").strip()

    if category not in _FEEDBACK_CATEGORIES:
        return jsonify({"ok": False, "error": "invalid_category"}), 400
    if not message:
        return jsonify({"ok": False, "error": "empty_message"}), 400
    if len(message) > 4000:
        return jsonify({"ok": False, "error": "message_too_long"}), 400
    if email and not _EMAIL_RE.match(email):
        return jsonify({"ok": False, "error": "invalid_email"}), 400

    ip = (request.headers.get("X-Forwarded-For", request.remote_addr or "") or "").split(",")[0].strip()
    ip_hash = hashlib.sha256(ip.encode("utf-8")).hexdigest()[:16] if ip else "anon"
    now = time.time()
    for k in [k for k, v in _FEEDBACK_LAST_SUBMIT.items() if now - v >= _FEEDBACK_RATE_LIMIT_SEC]:
        del _FEEDBACK_LAST_SUBMIT[k]
    last = _FEEDBACK_LAST_SUBMIT.get(ip_hash, 0)
    if now - last < _FEEDBACK_RATE_LIMIT_SEC:
        wait = int(_FEEDBACK_RATE_LIMIT_SEC - (now - last))
        return jsonify({"ok": False, "error": "rate_limited", "retry_after": wait}), 429

    user_agent = request.headers.get("User-Agent", "")[:300]
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    text = (
        f"🆕 <b>Tilbakemelding</b> — {_FEEDBACK_CATEGORIES[category]}\n"
        f"📧 {_html.escape(email) if email else '<i>ingen</i>'}\n"
        f"🕒 {ts}\n"
        f"🖥 {_html.escape(user_agent)}\n"
        "━━━━━━━━━━━━\n"
        f"{_html.escape(message)}"
    )

    try:
        resp = _requests.post(
            f"https://api.telegram.org/bot{token}/sendMessage",
            json={"chat_id": chat_id, "text": text, "parse_mode": "HTML", "disable_web_page_preview": True},
            timeout=5,
        )
        if resp.status_code != 200:
            return jsonify({"ok": False, "error": "telegram_failed", "detail": resp.text[:200]}), 502
    except Exception as e:
        return jsonify({"ok": False, "error": "telegram_exception", "detail": str(e)[:200]}), 502

    _FEEDBACK_LAST_SUBMIT[ip_hash] = now
    return jsonify({"ok": True})
