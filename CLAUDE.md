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
- `static/css/main.css`: CSS variables drive all theming (`:root` + `[data-theme="dark"]`)
- `static/js/app.js`: All frontend state and rendering logic

### Data storage — bible.db (SQLite)

All Bible data lives in `bible.db` (project root). The file is opened once at startup with WAL mode. Key tables:

| Table | Description |
|-------|-------------|
| `translations` | `(id, name, full_name, language)` — Bible versions. `id` is the bible.com ID. |
| `books` | `(usfm, order_num, name_no, name_en, testament)` — 66 books. |
| `verses` | `(translation_id, book_usfm, chapter, verse, text)` — all verse text. |
| `headings` | `(translation_id, book_usfm, chapter, verse, text)` — section headings from source. |
| `footnotes` | `(translation_id, book_usfm, chapter, verse, text)` — translation footnotes (only versions that have them). |
| `cross_references` | `(from_book, from_chapter, from_verse, to_book, to_chapter, to_verse_start, to_verse_end, to_chapter_end, votes)` — ~345k rows from OpenBible.info TSK dataset, sorted by `votes` descending. Version-independent. |
| `verses_fts` | FTS5 virtual table (content=verses) for fast full-text search. |

`migrate_to_db.py` documents the one-time migration from JSON files to SQLite. Do not re-run it.

### bible.py service

- `BibleData` opens `bible.db` with `check_same_thread=False` and loads metadata into memory at startup: `translations` dict, `version_books[tid]`, `book_chapters[tid][usfm]`.
- **Book alias system**: `BOOKS` list defines `(usfm, order, norwegian_name, [aliases])`. `ALIAS_MAP` provides case-insensitive lookup. `SORTED_ALIASES` sorted longest-first for greedy matching. `USFM_TO_ENG` / `USFM_TO_NAME` map codes to display names.
- **Query parser**: `parse_query()` splits on `;` into blocks. Context (book, chapter, had-verse) carries across blocks. `identify_book()` uses longest-match-first.
- **`is_reference_query()`**: returns `True` if the first `;`-part resolves to a known book alias.
- **Text search** (`search_text()`): uses FTS5 via direct SQL for keyword search; supports AND, OR, exclusion, phrases, scoped to book groups.
- **`resolve_block()`**: resolves a parsed query block into `{label, book, verses, headings, footnotes, xrefs}`. Footnotes are fetched inline; xrefs are lazy-loaded via a separate API endpoint.
- **API endpoints**:
  - `GET /api/versions` → `{versions: [{id, name, full_name, language}]}`
  - `GET /api/books?version=<id>` → `{books: [{code, name, name_en, chapters}], version}`
  - `GET /api/search?q=...&version=<id>` → `{type: "reference"|"text_search", results: [...], version}`
  - `GET /api/all_versions?q=...` → reference parse across every loaded version
  - `GET /api/crossrefs?book=JHN&chapter=1&verse=5&version=<id>&limit=5` → `{refs: [{label, preview, book, chapter, ...}], total}`
  - `GET /api/heartbeat` → `{ok: true}`

### index.html + static assets

- All state lives in `app.js`: `currentView` (`normal` | `text_search` | `all_versions`), `mainData`, `allVersionsCache`, `textSearchCache`, `showFootnotes`, `showXrefs`, `xrefCache` (Map).
- **Compare mode**: two `/api/search` calls (one per version), side-by-side render.
- **All versions mode**: one `/api/all_versions` call, one block per version.
- `BIBLEHUB_SLUGS` / `ENG_NAMES` are client-side maps for interlinear links and language toggle.
- `translateLabel(label, bookCode)` replaces the Norwegian book name in a server-returned label with the current language.
- Dark mode: `data-theme="dark"` on `<html>`. Accent color set via CSS variables by `applyAccent()`.
- **Footnote/xref panels**: per-verse `†` and `§` buttons render inline. Clicking opens a collapsible `<div class="verse-panel">` sibling (animated with max-height transition). Xref panel lazy-fetches `/api/crossrefs` and caches results in `xrefCache`. Both toggleable via Settings → Verse annotations.

## Key Patterns

- **New Bible version**: add a row to `translations` table in `bible.db` and import verse/heading/footnote data. Version `id` must match bible.com's ID.
- **New book alias**: add to the alias list in the relevant `BOOKS` tuple in `app/services/bible.py` (lowercase).
- **Theming**: edit CSS variables in `static/css/main.css`. Accent color presets are in `COLOR_PRESETS` array in `app.js`.
- **Adding footnotes for a version**: insert rows into the `footnotes` table with the correct `translation_id`.
