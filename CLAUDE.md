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
Tables: `translations(id,name,full_name,language)`, `books(usfm,order_num,name_no,name_en,testament)`, `verses(translation_id,book_usfm,chapter,verse,text)`, `headings`, `footnotes`, `cross_references(from_book,from_chapter,from_verse,to_book,to_chapter,to_verse_start,to_verse_end,to_chapter_end,votes)` (~345k rows, OpenBible TSK), `verses_fts` (FTS5 virtual table), `places(id,name,aliases,placemark,kind,geometry)` (~1336 rows, GeoJSON in `geometry`), `place_verses(place_id,book_usfm,chapter,verse)` (~8.7k rows, OpenBible "most-likely" KMZ).

`migrate_to_db.py` and `migrate_places.py` = one-time migrations, do not re-run.

## bible.py service
- `BibleData` opens db once, loads metadata: `translations`, `version_books[tid]`, `book_chapters[tid][usfm]`
- Book aliases: `BOOKS` list → `ALIAS_MAP` (case-insensitive) → `SORTED_ALIASES` (longest-first). `USFM_TO_ENG`/`USFM_TO_NAME` for display.
- `parse_query()` splits on `;`, carries context. `is_reference_query()` → True if first block is a book alias.
- `search_text()` → FTS5; AND/OR/exclusion/phrases/book-group scope. Concordance use case.
- `quick_search()` → FTS5 prefix-AND (`tok*`) + `bm25` ranking, OR-fallback on zero hits, hard-capped. Live-typing use case.
- `resolve_block()` → `{label, book, verses, headings, footnotes, xrefs, places}`; xrefs lazy-loaded; places eager via `BibleData.get_places_for_range(book, ch_start, vs_start, ch_end, vs_end)`

## API endpoints
- `GET /api/versions` → `{versions:[{id,name,full_name,language}]}`
- `GET /api/books?version=<id>` → `{books:[...]}`
- `GET /api/search?q=&version=<id>` → `{type:"reference"|"text_search", results, version}`
- `GET /api/quick_search?q=&version=<id>&limit=<n>` → `{results, truncated, limit, version}` (live single-verse finder)
- `GET /api/all_versions?q=` → reference across all versions
- `GET /api/crossrefs?book=&chapter=&verse=&version=&limit=` → `{refs,total}`
- `GET /api/places?book=&chapter=&verse_start=&verse_end=&chapter_end=` → `{places:[{id,name,aliases,placemark,kind,geometry,refs}]}` (lazy lookup; reference responses already include `places` per block)
- `GET /api/heartbeat` → `{ok:true}`

## Frontend (app.js)
State: `currentView` (`normal`|`text_search`|`all_versions`|`quick_search`), `mainData`, caches, `showFootnotes`, `showXrefs`, `xrefCache`, `quickMode` (persisted in localStorage).
- Quick mode: ⚡ toggle next to search input; debounced fetch (150ms, min 3 chars) with AbortController; results in `.quick-row` (ref + verse-serif text); click → standard reference lookup.
- Compare mode: two `/api/search` calls. All-versions: one `/api/all_versions` call.
- `translateLabel(label, bookCode)` swaps Norwegian book name per UI language.
- Dark mode via `data-theme="dark"`; accent via `applyAccent()` / CSS vars.
- Footnote/xref panels: `†`/`§` buttons → collapsible `<div class="verse-panel">`; xrefs lazy-fetched and cached.
- Places (Leaflet 1.9.4 via CDN): inline `📍` chips per verse (gated by `showPlaces`, default off, `togglePlaces` in *bla & vis*) + per-block `🗺️ Map` button always visible when `block.places.length > 0`. `blockPlacesRegistry[idx]` keyed by card index; `openMap(places, focusId)` opens `#mapModal`. Esri World Imagery + OSM as base layers. Custom panes `regionsPane`(400) / `linesPane`(410) / `pointsPane`(420) ensure points always render above polygons. Sidebar (`#mapSidebar`) lists all places; clicking flies/opens popup. Clicking a region runs `pointInRing` against every other polygon's geometry to populate "Also here:" links in the popup.

## Key patterns
- **New version**: insert into `translations`, import verse/heading/footnote rows. `id` must match bible.com's ID.
- **New book alias**: add lowercase alias to the relevant `BOOKS` tuple in `bible.py`.
- **Theming**: CSS vars in `main.css`; accent presets in `COLOR_PRESETS` in `app.js`.
- **New footnotes**: insert into `footnotes` with correct `translation_id`.
- **New places**: insert into `places` (geometry as GeoJSON string) + `place_verses` rows for each `(book, chapter, verse)` mention. Place styling driven by `kind` (`landpoint`/`waterpoint`/`region`/`water`/`path`/`landrepresentativepoint`/`mixed`).
