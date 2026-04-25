# CLAUDE.md

## Run
```bash
.venv\Scripts\activate && python main.py
```
Flask dev server at `http://127.0.0.1:8421`. Deps: `requirements.txt`.

## File map
- `main.py` — entrypoint, reads `PORT`/`HOST`, calls `create_app()`
- `app/__init__.py` — app factory, instantiates `BibleData`, registers blueprint
- `app/routes.py` — all HTTP routes
- `app/services/bible.py` — book aliases, query parser, search, `BibleData` class
- `templates/index.html` — single-page frontend
- `static/css/main.css` — CSS variables for theming (`:root` + `[data-theme="dark"]`)
- `static/js/app.js` — all frontend state and rendering

## Database (`bible.db`, SQLite, WAL mode)
Tables: `translations(id,name,full_name,language)`, `books(usfm,order_num,name_no,name_en,testament)`, `verses(translation_id,book_usfm,chapter,verse,text)`, `headings`, `footnotes`, `cross_references(from_book,from_chapter,from_verse,to_book,to_chapter,to_verse_start,to_verse_end,to_chapter_end,votes)` (~345k rows, OpenBible TSK), `verses_fts` (FTS5 virtual table).

`migrate_to_db.py` = one-time migration, do not re-run.

## bible.py service
- `BibleData` opens db once, loads metadata: `translations`, `version_books[tid]`, `book_chapters[tid][usfm]`
- Book aliases: `BOOKS` list → `ALIAS_MAP` (case-insensitive) → `SORTED_ALIASES` (longest-first). `USFM_TO_ENG`/`USFM_TO_NAME` for display.
- `parse_query()` splits on `;`, carries context (book/chapter) across blocks. `identify_book()` uses longest-match-first.
- `is_reference_query()` → True if first block resolves to a book alias
- `search_text()` → FTS5 SQL; supports AND/OR/exclusion/phrases/book-group scope
- `resolve_block()` → `{label, book, verses, headings, footnotes, xrefs}`; xrefs lazy-loaded

## API endpoints
- `GET /api/versions` → `{versions:[{id,name,full_name,language}]}`
- `GET /api/books?version=<id>` → `{books:[{code,name,name_en,chapters}]}`
- `GET /api/search?q=&version=<id>` → `{type:"reference"|"text_search", results, version}`
- `GET /api/all_versions?q=` → reference across all versions
- `GET /api/crossrefs?book=&chapter=&verse=&version=&limit=` → `{refs,total}`
- `GET /api/heartbeat` → `{ok:true}`

## Frontend (app.js)
State: `currentView` (`normal`|`text_search`|`all_versions`), `mainData`, caches, `showFootnotes`, `showXrefs`, `xrefCache` (Map).
- Compare mode: two `/api/search` calls, side-by-side
- All versions mode: one `/api/all_versions` call
- `BIBLEHUB_SLUGS`/`ENG_NAMES` for interlinear links and language toggle
- `translateLabel(label, bookCode)` swaps Norwegian book name per UI language
- Dark mode via `data-theme="dark"` on `<html>`; accent via `applyAccent()` / CSS vars
- Footnote/xref panels: `†`/`§` buttons per verse → collapsible `<div class="verse-panel">` (max-height transition); xrefs lazy-fetch and cache

## Key patterns
- **New version**: insert into `translations`, import verse/heading/footnote rows. `id` must match bible.com's ID.
- **New book alias**: add lowercase alias to the relevant `BOOKS` tuple in `bible.py`.
- **Theming**: CSS vars in `main.css`; accent presets in `COLOR_PRESETS` in `app.js`.
- **New footnotes**: insert into `footnotes` with correct `translation_id`.
