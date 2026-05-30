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
- `static/js/sidebar.js` — `window.AppSidebar` PC-only right-side sidebar manager (register/open/close/ensureOpen/checkAutoClose/refreshObserver). State is in-memory only.
- `static/js/modules/pinnedVerses.js` — pin-verse module (`window.PinnedVerses`); in-memory only, cleared on sidebar close.
- `static/js/modules/leksikonModule.js` — sidebar module showing Easton/Smith/Hitchcock dictionary entries relevant to the current top block. Auto-triggers on `mainBlockChanged`; UI is per-source tabs in one card.
- `static/js/modules/studySearch.js` — `window.StudySearch.render(type, data, container, ctx)` renders study-data search results (`commentary`|`topics`|`leksikon`) into the main results area. Reuses `RefPreviewPopup`, leksikon body/tab markup, lazy verse-preview. Topic boxes lazy-load `/api/topic/<id>` (verses + child stubs + "Åpne alle"); a matched top-level topic with a parent shows a "Foreldretema" link that opens that parent alone via `showTopic()`. Commentary hits call `CommentaryModule.openAtRef(...)`. Driven by the scope picker in `app.js` (`currentView='study_search'`, `studySearchType`, `doStudySearch()`); non-persistent (a fresh search resets to bible search).

## Database (`bible.db`, SQLite, WAL mode)
Tables: `translations(id,name,full_name,language)`, `books(usfm,order_num,name_no,name_en,testament)`, `verses(translation_id,book_usfm,chapter,verse,text)`, `headings`, `footnotes`, `cross_references(from_book,from_chapter,from_verse,to_book,to_chapter,to_verse_start,to_verse_end,to_chapter_end,votes)` (~345k rows, OpenBible TSK), `verses_fts` (FTS5 virtual table), `places(id,name,aliases,placemark,kind,geometry,confidence,confidence_votes,comment,semantic_type,preceding_article,wikidata_id,wikipedia_url)` (~1336 rows, GeoJSON in `geometry`; `confidence` is OpenBible.info max `modern_associations[*].score` 0–1000 — negative for disputed identifications. `name` ends with "1"/"2"/… when several biblical places share a name (e.g. "Ai 1" Joshua's Ai vs "Ai 2" in Moab) — UI should display `name` + `comment` (e.g. "Achzib 1" + "in Judah") rather than the bare suffix. `semantic_type` is openbible's logical type (settlement/river/region/mountain/…) and differs from `kind` which controls map styling. `aliases` is a JSON array of openbible `translation_name_counts` spellings, used for search alongside `name`.), `place_verses(place_id,book_usfm,chapter,verse)` (~8.7k rows, OpenBible "most-likely" KMZ).

Study tables: `commentaries(id,code,name,short_name,granularity,format)`, `commentary_entries(commentary_id,book_usfm,chapter,verse_start,verse_end,body)` (scofield ~3.2k verse-level + 59 book intros at chapter=0 + mhenry/mhenry-full markdown; scofield bodies carry inline `<a class="scofield-ref" data-ref="USFM.CH.VS">` reference anchors, `**bold**` catchwords, `_italic_`, and `_(See Scofield "Book c:v")_` cross-note pointers — regenerated from the SWORD OSIS module by `migrations/migrate_scofield_osis.py`, which supersedes the old trailing `[ref:...]` list. mhenry-full uses `<a class="mh-ref" data-ref="…">` inline refs. Both inline-ref kinds render a hover/click verse-preview popup in commentaryModule.js), `topics(id,parent_id,name,source,sort_order)` + `topic_verses(topic_id,book_usfm,chapter,verse_start,verse_end,sort_order)` (~53k topics / ~117k verses from BSB topical index; hierarchy auto-built from `: `-prefix in topic names, `source` is catalog Top/Nav/TTT only on leaf), `outlines(book_usfm,source,tree_json)` (66 BSB book outlines, refs pre-parsed into JSON nodes `{label, level, refs:[{book,ch_start,vs_start,ch_end,vs_end}], children}`).

Dictionary (leksikon) tables: `dictionaries(id,code,name,short_name,format)`, `dictionary_entries(id,dictionary_id,headword,title,body)` (Easton 3961 + Smith 4561 + Hitchcock 2612; headword UPPERCASE-normalised), `dictionary_entry_refs(entry_id,book_usfm,chapter,verse_start,verse_end,chapter_end)` (~39k ref rows; Hitchcock has none — it piggybacks on Easton/Smith headword matches in the lookup). Bodies are plain prose with `_italics_` markdown and inline scripture refs like `(Exod.6.20)`. Decoded from SWORD modules via `temp_resources/leksikon/decode_sword_ld.py` (RawLD modules require cp1252-fallback for legacy modules like Smith).

BLB (Berean Literal Bible) is a local-only translation (id=9001), not on bible.com.

Study-search FTS5 indexes (built by `migrations/migrate_search_fts.py`, idempotent): `commentary_fts` (external content over `commentary_entries.body`, implicit rowid), `dictionary_fts` (over `dictionary_entries.headword`, content_rowid=`id` — leksikon search matches headword only), `topics_fts` (over `topics.name`, content_rowid=`id`). All `tokenize='unicode61'` like `verses_fts`.

`migrate_to_db.py`, `migrate_places.py`, and `migrations/*.py` = one-time migrations, do not re-run.

## bible.py service
- `BibleData` opens db once, loads metadata: `translations`, `version_books[tid]`, `book_chapters[tid][usfm]`, `commentaries[id]`
- Book aliases: `BOOKS` list → `ALIAS_MAP` (case-insensitive) → `SORTED_ALIASES` (longest-first). `USFM_TO_ENG`/`USFM_TO_NAME` for display.
- `parse_query()` splits on `;`, carries context. `is_reference_query()` → True if first block is a book alias.
- `search_text()` → FTS5; AND/OR/exclusion/phrases/book-group scope. Concordance use case.
- `quick_search()` → FTS5 prefix-AND (`tok*`) + `bm25` ranking, OR-fallback on zero hits, hard-capped. Live-typing use case.
- `build_fts_match_expr()` / `study_match_expr()` → reuse `parse_search_query` to build one FTS5 MATCH expr (positive AND-terms per OR-group joined with `OR`, `NOT` exclusions) for study-data search. `search_commentaries()` (snippet+bm25 over `commentary_fts`), `search_leksikon()` (headword via `dictionary_fts`), `BibleData.search_topics_by_name()` (over `topics_fts`, returns path + parent + counts). All English-only.
- `resolve_block()` → `{label, book, verses, headings, footnotes, xrefs, places}`; xrefs lazy-loaded; places eager via `BibleData.get_places_for_range(book, ch_start, vs_start, ch_end, vs_end)`

## API endpoints
- `GET /api/versions` → `{versions:[{id,name,full_name,language}]}`
- `GET /api/books?version=<id>` → `{books:[...]}`
- `GET /api/search?q=&version=<id>` → `{type:"reference"|"text_search", results, version}`
- `GET /api/quick_search?q=&version=<id>&limit=<n>` → `{results, truncated, limit, version}` (live single-verse finder)
- `GET /api/all_versions?q=` → reference across all versions
- `GET /api/crossrefs?book=&chapter=&verse=&version=&limit=` → `{refs,total}`
- `GET /api/places?book=&chapter=&verse_start=&verse_end=&chapter_end=` → `{places:[{id,name,aliases,placemark,kind,geometry,refs}]}` (lazy lookup; reference responses already include `places` per block)
- `GET /api/commentaries` → `{commentaries:[{id,code,name,short_name,granularity,format}]}`
- `GET /api/commentary?commentary=<code|id>&book=&chapter=&verse_start=&verse_end=&chapter_end=` → `{commentary, entries:[{chapter,verse_start,verse_end,body}]}`
- `GET /api/topics?book=&chapter=&verse=` → `{topics:[{id,name,source,path:[...]}]}` (path is parent chain from root to leaf)
- `GET /api/topic/<id>` → `{id,name,source,path,verses:[{book_usfm,chapter,verse_start,verse_end,ref_label}],children:[{id,name}]}`
- `GET /api/outline?book=<usfm>` → `{book,source,tree:[...]}`
- `GET /api/dictionaries` → `{dictionaries:[{id,code,name,short_name,format}]}`
- `GET /api/leksikon?book=&chapter=&verse_start=&verse_end=&chapter_end=` → `{entries:[{entry_id,dictionary_id,dictionary_code,dictionary_short_name,headword,title,body}]}` (overlap lookup on Easton/Smith refs + Hitchcock piggyback by headword)
- `GET /api/search/commentary?q=&version=` → `{type:"commentary_search", results:[{commentary, books:[{book,name,entries:[{chapter,verse_start,verse_end,ref_label,is_intro,snippet}]}]}], total}` (FTS over commentary bodies, grouped commentary→book)
- `GET /api/search/leksikon?q=` → `{type:"leksikon_search", results:[{headword,title,entries:[{dictionary_code,dictionary_short_name,title,body}]}], total}` (headword FTS, grouped per headword; bodies linkified)
- `GET /api/search/topics?q=` → `{type:"topic_search", results:[{id,name,path,parent:{id,name}|null,own_count,verse_count}], total}` (topic-name FTS)
- `GET /api/topic/<id>` now also returns `parent:{id,name}|null`, `ancestors:[{id,name}]` (root→parent, for clickable breadcrumbs), `verse_count`/`own_count`/`child_count`, and children carry `verse_count`/`own_count`/`child_count` sorted by subtree verse-count (used for the Topics-module-style study-search rendering + parent navigation)
- `GET /api/heartbeat` → `{ok:true}`

## Frontend (app.js)
State: `currentView` (`normal`|`text_search`|`all_versions`|`quick_search`), `mainData`, caches, `showFootnotes`, `showXrefs`, `xrefCache`, `quickMode` (persisted in localStorage).
- Quick mode: ⚡ toggle next to search input; debounced fetch (150ms, min 3 chars) with AbortController; results in `.quick-row` (ref + verse-serif text); click → standard reference lookup.
- Compare mode: two `/api/search` calls. All-versions: one `/api/all_versions` call.
- UI is Norwegian-only. `I18N.no` (in `app.js`) holds all UI strings, looked up via `t(key)` and applied to `[data-i18n*]` attributes by `applyI18n()`.
- `translateLabel(label, bookCode)` swaps Norwegian book name to English when the *selected Bible version* is English (e.g. KJV) — not a UI-language toggle.
- Dark mode via `data-theme="dark"`; accent via `applyAccent()` / CSS vars.
- Footnote/xref panels: `†`/`§` buttons → collapsible `<div class="verse-panel">`; xrefs lazy-fetched and cached.
- Sidebar (PC ≥701px, `window.AppSidebar`): `<aside id="appSidebar">` is `position: fixed` from top-to-bottom on the right; `body.sidebar-open` sets `padding-right: var(--sidebar-width)` so header/search/results all slide left. Drag left edge to resize (320px–70vw). **No toggle button** — sidebar opens automatically when a module gains content (`AppSidebar.ensureOpen()`) and closes when all modules report `isEmpty()` (`AppSidebar.checkAutoClose()`) or when user clicks the close X. **Closing clears all module data** via each module's `clearAll()` hook and resets pin buttons. Modules register via `AppSidebar.register({id, title, icon, mount(container, ctx), unmount?, onFocusChange?, onStateChange?, isEmpty?, clearAll?})`. `ctx`: `jumpToVerse(spec|idx)`, `getBlock(idx)`, `getFocus()`, `subscribe(event, fn)`. Each module renders as a card-style box with header (drag-handle + icon + title + collapse-chevron); clicking anywhere on the header toggles collapse, drag handle starts pointer-based reorder. IntersectionObserver on `.verse-card` (rootMargin `-20% 0 -50% 0`) emits focus changes via rAF. MutationObserver on `#resultsWrapper` re-attaches observer after every render path. **No persistence** — every reload and every close starts clean. Mobile (≤700px): sidebar and pin button hidden. Pin button (`📌 Fest`) in study tray; `togglePinForBlock(idx)` pins the entire block (chapter or verse range), spec shape `{book, ch_start, vs_start, ch_end, vs_end, version, label, text, ts}`.
- Places (Leaflet 1.9.4 via CDN): inline `📍` chips per verse (gated by `showPlaces`, default off, `togglePlaces` in *bla & vis*) + per-block `🗺️ Map` button always visible when `block.places.length > 0`. `blockPlacesRegistry[idx]` keyed by card index; `openMap(places, focusId)` opens `#mapModal`. Esri World Imagery + OSM as base layers. Custom panes `regionsPane`(400) / `linesPane`(410) / `pointsPane`(420) ensure points always render above polygons. Sidebar (`#mapSidebar`) lists all places; clicking flies/opens popup. Clicking a region runs `pointInRing` against every other polygon's geometry to populate "Also here:" links in the popup.

## Key patterns
- **New version**: insert into `translations`, import verse/heading/footnote rows. `id` must match bible.com's ID.
- **New book alias**: add lowercase alias to the relevant `BOOKS` tuple in `bible.py`.
- **Theming**: CSS vars in `main.css`; accent presets in `COLOR_PRESETS` in `app.js`.
- **New footnotes**: insert into `footnotes` with correct `translation_id`.
- **New places**: insert into `places` (geometry as GeoJSON string) + `place_verses` rows for each `(book, chapter, verse)` mention. Place styling driven by `kind` (`landpoint`/`waterpoint`/`region`/`water`/`path`/`landrepresentativepoint`/`mixed`).
