# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

```bash
# Activate virtualenv first (Windows)
.venv\Scripts\activate

python main.py
```

Starts a Flask dev server at `http://127.0.0.1:8421` with auto-reload. Dependencies are in `requirements.txt` (Flask + Werkzeug + Jinja2 + gunicorn).

## Architecture

**Flask package structure**:
- `main.py`: Entrypoint — reads `PORT`/`HOST` env vars, calls `create_app()`, runs with `debug=True`
- `app/__init__.py`: App factory — instantiates `BibleData`, stores it in `app.config["BIBLE_DATA"]`, registers blueprint
- `app/routes.py`: All HTTP routes; retrieves `BibleData` via `current_app.config["BIBLE_DATA"]`
- `app/services/bible.py`: Book alias map, query parser, search logic, and `BibleData` class
- `templates/index.html`: Single-page frontend (all UI rendered client-side from API responses)
- `static/css/main.css`: CSS variables drive all theming (`：root` + `[data-theme="dark"]`)
- `static/js/app.js`: All frontend state and rendering logic

### bible.py service

- `BibleData` loads all versions from `bibles/` into memory at startup: `versions[vname][usfm_code] = {"BOOK.CH.VS": text}`, `version_books[vname] = [ordered usfm codes]`, `book_chapters[vname][code] = max_chapter`
- **Book alias system**: `BOOKS` list defines `(usfm, order, norwegian_name, [aliases])`. `ALIAS_MAP` provides case-insensitive lookup. `SORTED_ALIASES` is sorted longest-first to enable greedy matching. `USFM_TO_ENG` / `USFM_TO_NAME` map codes to display names.
- **Query parser**: `parse_query()` splits on `;` into blocks. Context (book, chapter, had-verse) carries across blocks — a bare number after `chapter:verse` becomes a verse in the same chapter; a bare number with no prior verse context becomes a chapter. `identify_book()` uses longest-match-first against `SORTED_ALIASES`.
- **`is_reference_query()`**: returns `True` if the first `;`-part resolves to a known book alias; determines whether the search dispatches to reference resolution or text search.
- **Text search** (`search_text()`): case-insensitive substring AND-match across all words, hard-capped at 150 results by default.
- **API endpoints**:
  - `GET /api/versions` → `{versions: [...]}`
  - `GET /api/books?version=NB88` → `{books: [{code, name, name_en, chapters}], version}`
  - `GET /api/search?q=...&version=NB88` → `{type: "reference"|"text_search", results: [...], version}`
  - `GET /api/all_versions?q=...` → reference parse across every loaded version; `{results: {versionName: [blocks]}}`
  - `GET /api/heartbeat` → `{ok: true}` (frontend pings every 3 s; used to detect tab close in some deployment modes)

### index.html + static assets

- All state lives in `app.js`: `currentView` (`normal` | `text_search` | `all_versions`), `compareMode`, `mainData`, `compareData`, `allVersionsCache`, `textSearchCache`, `previousState` (back-navigation), `bookLang` (`no`/`en`, persisted in `localStorage`), `collapsed` (search results grouped by book).
- **Compare mode**: two `/api/search` calls (one per version), side-by-side render.
- **All versions mode**: one `/api/all_versions` call, one column per version.
- `VERSION_DISPLAY` maps folder names to display names (e.g. `NB88` → `NB88/07`); falls back to raw folder name.
- `BIBLEHUB_SLUGS` / `ENG_NAMES` are client-side maps used for interlinear links and language toggle.
- `translateLabel(label, bookCode)` replaces the Norwegian book name in a server-returned label with the current `bookLang` name.
- Dark mode: `data-theme="dark"` on `<html>`.

## Bible Data Format

Each version is a folder under `bibles/` with 66 JSON files named `NN_USFM_BookName.json` (e.g. `43_JHN_Johannes.json`). The USFM code in the filename is the book identifier.

```json
{ "JHN.1.1": "In the beginning was the Word...", "JHN.1.2": "..." }
```

Keys are `BOOK.CHAPTER.VERSE`. All data is loaded into memory at startup.

## Key Patterns

- **New Bible version**: drop a correctly-named folder into `bibles/`; add a `VERSION_DISPLAY` entry in `static/js/app.js` if needed.
- **New book alias**: add to the alias list in the relevant `BOOKS` tuple in `app/services/bible.py` (lowercase).
- **Non-standard USFM code**: if a scraped Bible uses e.g. `NAM` instead of `NAH`, the `BOOKS` entry's first element must match the code in the JSON filenames.
- **Theming**: edit CSS variables in `static/css/main.css`. Accent color is `#a83232` (light) / `#c94444` (dark).
