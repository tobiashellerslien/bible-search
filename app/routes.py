from flask import Blueprint, current_app, jsonify, render_template, request

from .services.bible import (
    BOOK_GROUPS,
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


@bp.get("/")
def index():
    return render_template("index.html")


@bp.get("/api/versions")
def api_versions():
    versions = list(_bible_data().versions.keys())
    return jsonify({"versions": versions})


@bp.get("/api/books")
def api_books():
    bible_data = _bible_data()
    version = request.args.get("version", "")
    if not version or version not in bible_data.versions:
        version = list(bible_data.versions.keys())[0] if bible_data.versions else ""
    books_list = []
    for code in bible_data.version_books.get(version, []):
        books_list.append({
            "code": code,
            "name": USFM_TO_NAME.get(code, code),
            "name_en": USFM_TO_ENG.get(code, code),
            "chapters": bible_data.book_chapters.get(version, {}).get(code, 0),
        })
    return jsonify({"books": books_list, "version": version})


@bp.get("/api/search")
def api_search():
    bible_data = _bible_data()
    query = request.args.get("q", "")
    version = request.args.get("version", "")
    if not query:
        return jsonify({"error": "No search query provided"}), 400
    if not version or version not in bible_data.versions:
        version = list(bible_data.versions.keys())[0] if bible_data.versions else ""
    if not version:
        return jsonify({"error": "No Bible versions available"}), 400

    if is_reference_query(query):
        blocks = parse_query(query)
        results = [resolve_block(bible_data, version, block) for block in blocks]
        return jsonify({"type": "reference", "results": results, "version": version})

    results = search_text(bible_data, version, query)
    return jsonify({"type": "text_search", "results": results, "query": query, "version": version})


@bp.get("/api/all_versions")
def api_all_versions():
    bible_data = _bible_data()
    query = request.args.get("q", "")
    if not query:
        return jsonify({"error": "No query provided"}), 400
    all_results = {}
    blocks = parse_query(query)
    for version_name in bible_data.versions:
        resolved = [resolve_block(bible_data, version_name, block) for block in blocks]
        all_results[version_name] = resolved
    return jsonify({"results": all_results, "query": query})


@bp.get("/api/stats")
def api_stats():
    bible_data = _bible_data()
    query = request.args.get("q", "")
    version = request.args.get("version", "")
    if not query:
        return jsonify({"error": "No query provided"}), 400
    if not version or version not in bible_data.versions:
        version = list(bible_data.versions.keys())[0] if bible_data.versions else ""
    # Strip scope so stats always show whole-bible distribution
    bare_query, scope_label = strip_scope_from_query(query)
    stats = get_search_stats(bible_data, version, bare_query)
    total = sum(s['count'] for s in stats)
    return jsonify({
        "stats": stats, "total": total, "version": version,
        "query": bare_query, "original_query": query, "scope_label": scope_label,
    })


@bp.get("/api/all_text_search")
def api_all_text_search():
    bible_data = _bible_data()
    query = request.args.get("q", "")
    if not query:
        return jsonify({"error": "No query provided"}), 400
    all_results = {}
    for version_name in bible_data.versions:
        results = search_text(bible_data, version_name, query)
        if results:
            all_results[version_name] = results
    return jsonify({"results": all_results, "query": query})


@bp.get("/api/groups")
def api_groups():
    groups = [{"key": k, "books": v} for k, v in BOOK_GROUPS.items()]
    return jsonify({"groups": groups})


@bp.get("/api/heartbeat")
def api_heartbeat():
    return jsonify({"ok": True})
