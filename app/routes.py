from flask import Blueprint, current_app, jsonify, render_template, request

from .services.bible import (
    BOOK_GROUPS,
    USFM_TO_ALIASES,
    USFM_TO_ENG,
    USFM_TO_NAME,
    get_search_stats,
    is_reference_query,
    parse_query,
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
            "chapters": bible_data.book_chapters.get(version_id, {}).get(code, 0),
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

    results = search_text(bible_data, version_id, query)
    return jsonify({"type": "text_search", "results": results, "query": query, "version": version_id})


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
    all_results = {
        version_id: results
        for version_id in bible_data.translations
        if (results := search_text(bible_data, version_id, query))
    }
    return jsonify({"results": all_results, "query": query})


@bp.get("/api/groups")
def api_groups():
    groups = [{"key": k, "books": v} for k, v in BOOK_GROUPS.items()]
    return jsonify({"groups": groups})


@bp.get("/api/heartbeat")
def api_heartbeat():
    return jsonify({"ok": True})
