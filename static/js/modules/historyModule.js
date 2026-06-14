// ── Historisk kontekst-modul (PC sidebar + mobile module host) ──
// Ussher's Annals of the World + BibleData Event/Epoch for the passage in view
// (study tray) or marked verses (MVB). Sections:
//   • Refererte perioder — epoch bands (reigns/periods) the referenced years fall
//     in; click a chip to read all entries inside that period (with a back button).
//   • Direkte treff — annals/events whose scripture refs hit the passage (expandable
//     boxes with the year as title).
//   • Omkring i tid — annals/events within ±N years of an anchored year. A passage
//     can reference several eras (e.g. Matt 24 → Noah AND AD 70); those split into
//     "periods" you pick between, so the context isn't one mixed soup. Shown only
//     when a year is anchored in the data (never guessed). Ussher chronology.
(function () {
    let _container = null;
    let _ctx = null;
    let _unsubMainBlock = null;

    // Scope: { source: 'tray'|'mvb-pc'|'mvb-mobile', range:{book,ch_start,…,version,label}, markedVerses:[] }
    let _scope = null;
    let _hasBeenShown = false;
    let _isMobile = false;
    let _window = 10;            // ±-selector (years); persisted in localStorage
    let _nearbyOpen = false;     // remembers expand state across re-fetches
    let _selectedPeriod = 0;     // which anchored-year cluster's nearby is shown

    // Lazy render for the (potentially huge) "Omkring i tid" list: rows are built
    // in batches as the user scrolls, and only once the field is expanded.
    const NEARBY_BATCH = 30;
    let _nearbyList = [];
    let _nearbyCursor = 0;
    let _nearbyObs = null;

    // {scope-key|window -> data}
    const _dataCache = new Map();

    try {
        const w = parseInt(localStorage.getItem('historyWindow'), 10);
        if ([5, 10, 25].includes(w)) _window = w;
    } catch {}

    const WINDOWS = [5, 10, 25];

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, c => (
            { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
        ));
    }

    function isMobileNow() {
        return !!(window.AppModuleHost && window.AppModuleHost.isMobile && window.AppModuleHost.isMobile());
    }

    // ── DOM ─────────────────────────────────────────────────────────
    function buildScaffold() {
        if (!_container) return;
        _container.innerHTML = `
            <div class="history-module">
                <div class="history-source">Annals of the World — James Ussher</div>
                <div class="history-scope-label"></div>
                <div class="history-epochs"></div>
                <div class="history-body"></div>
            </div>
        `;
    }

    function setScopeLabel(text) {
        const el = _container && _container.querySelector('.history-scope-label');
        if (!el) return;
        el.textContent = text || '';
    }

    function setEpochs(html) {
        const el = _container && _container.querySelector('.history-epochs');
        if (el) el.innerHTML = html || '';
    }

    function setBody(html) {
        const el = _container && _container.querySelector('.history-body');
        if (el) el.innerHTML = html || '';
    }

    // ── Scope (mirrors leksikon) ────────────────────────────────────
    function rangeFromBlock(block) {
        if (!block || !block.verses || !block.verses.length) return null;
        const verses = block.verses;
        const ch_start = verses[0].chapter;
        const vs_start = verses[0].num;
        const ch_end = verses[verses.length - 1].chapter;
        const vs_end = verses[verses.length - 1].num;
        const version = (window.versionSelect && String(window.versionSelect.value)) || '';
        const lang = (typeof window.versionLang === 'function') ? window.versionLang(version) : 'no';
        const bName = (typeof window.bookName === 'function') ? window.bookName(block.book, lang) : block.book;
        let label;
        if (block.is_chapter && ch_start === ch_end) {
            label = window.fmtVerseRef(block.book, bName, ch_start);
        } else if (ch_start === ch_end) {
            label = window.fmtVerseRef(block.book, bName, ch_start, vs_start, vs_end);
        } else {
            label = `${bName} ${ch_start}:${vs_start}-${ch_end}:${vs_end}`;
        }
        return { book: block.book, ch_start, vs_start, ch_end, vs_end, version, label };
    }

    function scopeFromMainBlock() {
        if (!_ctx) return null;
        const mb = _ctx.getMainBlock && _ctx.getMainBlock();
        if (!mb || !mb.block) return null;
        const range = rangeFromBlock(mb.block);
        if (!range) return null;
        return { source: 'tray', range, markedVerses: [] };
    }

    function scopeKey(scope) {
        if (!scope) return '';
        const r = scope.range;
        const mv = (scope.markedVerses || []).map(v => `${v.book}.${v.chapter}.${v.verse}`).join(',');
        return [scope.source, r.book, r.ch_start, r.vs_start, r.ch_end, r.vs_end, mv].join('|');
    }

    function cacheKey(scope) {
        return scopeKey(scope) + '|w' + _window;
    }

    // ── Fetch ───────────────────────────────────────────────────────
    async function fetchData(range) {
        const params = new URLSearchParams();
        params.set('book', range.book);
        params.set('chapter', String(range.ch_start));
        if (range.ch_end != null && range.ch_end !== range.ch_start) {
            params.set('chapter_end', String(range.ch_end));
        }
        if (range.vs_start != null) params.set('verse_start', String(range.vs_start));
        if (range.vs_end != null) params.set('verse_end', String(range.vs_end));
        if (range.version) params.set('version', range.version);
        params.set('window', String(_window));
        const resp = await fetch('/api/history?' + params.toString());
        if (!resp.ok) throw new Error('history fetch failed: ' + resp.status);
        return await resp.json();
    }

    // ── Rendering helpers ───────────────────────────────────────────
    function renderBody(body) {
        if (!body) return '';
        // The server wraps inline scripture refs in <a class="history-ref"
        // data-ref="USFM.CH.VS"> anchors — protect them, escape the rest, then
        // apply italics/paragraph breaks and restore.
        const anchors = [];
        const work = body.replace(/<a class="history-ref"[^>]*>[\s\S]*?<\/a>/g, (m) => {
            anchors.push(m);
            return '@@R' + (anchors.length - 1) + '@@';
        });
        let html = esc(work)
            .replace(/_([^_\n]+)_/g, '<em>$1</em>')
            .replace(/\n{2,}/g, '</p><p>')
            .replace(/\n/g, '<br>');
        html = html.replace(/@@R(\d+)@@/g, (_m, i) => anchors[Number(i)] || '');
        return `<p>${html}</p>`;
    }

    function typeChip(etype) {
        return etype ? `<span class="history-type">${esc(etype)}</span>` : '';
    }

    function buildTriggerChips(entry) {
        const tb = entry.triggered_by || [];
        if (!tb.length || !_scope || !_scope.range) return '';
        const book = _scope.range.book;
        const bAbbr = (typeof window.bookAbbrev === 'function') ? window.bookAbbrev(book) : book;
        const seen = new Set();
        const items = [];
        for (const t of tb) {
            const key = `${t.chapter}.${t.verse_start}.${t.verse_end || ''}`;
            if (seen.has(key)) continue;
            seen.add(key);
            const vsEnd = (t.verse_end && t.verse_end !== t.verse_start) ? t.verse_end : t.verse_start;
            const label = window.fmtVerseRef(book, bAbbr, t.chapter, t.verse_start, vsEnd);
            items.push(
                `<button type="button" class="history-trigger-chip"`
                + ` data-book="${esc(book)}" data-chapter="${t.chapter}"`
                + ` data-verse-start="${t.verse_start}" data-verse-end="${vsEnd}"`
                + ` title="Gå til verset som utløste dette">${esc(label)}</button>`
            );
        }
        return `<div class="history-trigger-chips">${items.join('')}</div>`;
    }

    // Expandable box (like leksikon), year as the summary title.
    function entryHtml(e, opts) {
        opts = opts || {};
        const yr = e.year_label
            ? `<span class="history-year">${esc(e.year_label)}</span>`
            : `<span class="history-year history-year--unknown">ukjent år</span>`;
        const delta = (opts.showDelta && typeof e.delta === 'number' && e.delta !== 0)
            ? `<span class="history-delta">${e.delta > 0 ? '+' : ''}${e.delta} år</span>`
            : '';
        const title = e.title ? `<span class="history-entry-title">${esc(e.title)}</span>` : '';
        return `<details class="history-box history-box--${esc(e.kind)}"${opts.open ? ' open' : ''}>`
            + `<summary class="history-box-summary">${yr}${delta}${typeChip(e.event_type)}${title}</summary>`
            + `<div class="history-box-body">`
            + (opts.withChips ? buildTriggerChips(e) : '')
            + `<div class="history-entry-body">${renderBody(e.body)}</div>`
            + `</div></details>`;
    }

    // "Refererte perioder" — reigns/periods whose span contains a referenced year.
    // Clickable: opens a drill-down of every entry inside that period.
    function epochsHtml(epochs) {
        if (!epochs || !epochs.length) return '';
        const chips = epochs.slice(0, 8).map(ep => {
            const t = ep.title ? esc(ep.title) : esc(ep.event_type || 'Epoke');
            const yr = ep.year_label ? ` <span class="history-epoch-years">(${esc(ep.year_label)})</span>` : '';
            return `<button type="button" class="history-epoch-chip" data-epoch-id="${ep.id}" title="Les hendelser i denne perioden">${t}${yr}</button>`;
        }).join('');
        const more = epochs.length > 8 ? `<span class="history-epoch-more">+${epochs.length - 8}</span>` : '';
        return `<div class="history-epochs-inner">`
            + `<span class="history-epochs-label">Refererte perioder:</span>${chips}${more}</div>`;
    }

    function selectorHtml() {
        const btns = WINDOWS.map(w =>
            `<button type="button" class="history-win-btn${w === _window ? ' active' : ''}" data-win="${w}">±${w}</button>`
        ).join('');
        return `<div class="history-window-selector"><span class="history-window-label">Tidsvindu:</span>${btns}</div>`;
    }

    function nearbyHtml(periods) {
        if (!periods || !periods.length) return '';
        const idx = Math.min(_selectedPeriod, periods.length - 1);
        const period = periods[idx] || periods[0];
        const nb = period.nearby || [];
        // Period selector — only when the passage references more than one era.
        let periodSel = '';
        if (periods.length > 1) {
            periodSel = `<div class="history-period-selector"><span class="history-period-label">Periode:</span>`
                + periods.map((p, i) =>
                    `<button type="button" class="history-period-btn${i === idx ? ' active' : ''}" data-period="${i}">${esc(p.label)}</button>`
                ).join('')
                + `</div>`;
        }
        // Rows are filled lazily (in batches) by setupNearby — never built here.
        const periodTag = (periods.length === 1 && period.label)
            ? ` <span class="history-nearby-period">${esc(period.label)}</span>` : '';
        const expandAll = nb.length > 1
            ? `<button type="button" class="history-expand-all">Utvid alle</button>` : '';
        const controls = `<div class="history-nearby-controls">${selectorHtml()}${expandAll}</div>`;
        return `<details class="history-nearby"${_nearbyOpen ? ' open' : ''}>`
            + `<summary><span class="history-nearby-title">Omkring i tid</span>${periodTag}</summary>`
            + `<div class="history-nearby-body">${periodSel}${controls}<div class="history-nearby-rows"></div></div>`
            + `</details>`;
    }

    // ── Navigate from an inline ref, then reopen here (mirrors leksikon) ──
    async function openRefTarget(ref, label) {
        if (typeof window.searchFromXref !== 'function') return;
        const q = label || (window.RefPreviewPopup ? window.RefPreviewPopup.refLabel(ref) : ref);
        if (isMobileNow() && window.AppModuleHost && typeof window.AppModuleHost.closeModule === 'function') {
            window.AppModuleHost.closeModule();
            await window.searchFromXref(q);
            return;
        }
        await window.searchFromXref(q);
        await showForBlock(0);
    }

    function bindRefsIn(el) {
        if (!el || !window.RefPreviewPopup) return;
        window.RefPreviewPopup.bind(el, 'a.history-ref', {
            getVersion: () => (_scope && _scope.range && _scope.range.version) || '',
            onOpen: (ref, label) => openRefTarget(ref, label),
        });
    }

    function attachRefPreviewHandlers() {
        bindRefsIn(_container);
    }

    function attachTriggerHandlers() {
        if (!_container) return;
        _container.querySelectorAll('.history-trigger-chip').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                const book = btn.dataset.book;
                const chapter = Number(btn.dataset.chapter);
                const vsStart = Number(btn.dataset.verseStart);
                const vsEnd = Number(btn.dataset.verseEnd) || vsStart;
                const found = [];
                for (let v = vsStart; v <= vsEnd; v++) {
                    const sel = `.verse-text-clickable[data-book="${book}"][data-chapter="${chapter}"][data-verse="${v}"]`;
                    const el = document.querySelector(sel);
                    if (el) found.push(el);
                }
                if (found.length) {
                    const lines = found.map(el => el.closest('.verse-line')).filter(Boolean);
                    const firstLine = window.applyGroupedFlashToLines
                        ? window.applyGroupedFlashToLines(lines, 3000) : lines[0];
                    if (firstLine) firstLine.scrollIntoView({ block: 'center', behavior: 'smooth' });
                } else {
                    const lang = (typeof window.versionLang === 'function' && _scope && _scope.range)
                        ? window.versionLang(_scope.range.version) : 'no';
                    const bName = (typeof window.bookName === 'function') ? window.bookName(book, lang) : book;
                    const label = window.fmtVerseRef(book, bName, chapter, vsStart, vsEnd);
                    if (typeof window.searchFromXref === 'function') window.searchFromXref(label);
                }
            });
        });
    }

    // Wire an "Utvid alle / Lukk alle" toggle over a set of <details> boxes.
    function wireExpandAll(btn, boxes) {
        if (!btn) return;
        const sync = () => {
            const anyClosed = Array.from(boxes()).some(b => !b.open);
            btn.textContent = anyClosed ? 'Utvid alle' : 'Lukk alle';
        };
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const anyClosed = Array.from(boxes()).some(b => !b.open);
            boxes().forEach(b => { b.open = anyClosed; });
            sync();
        });
        boxes().forEach(b => b.addEventListener('toggle', sync));
        sync();
    }

    // ── "Omkring i tid" field: lazy, in-place rendering ─────────────────
    function disconnectNearbyObs() {
        if (_nearbyObs) { try { _nearbyObs.disconnect(); } catch {} _nearbyObs = null; }
    }

    function currentNearby() {
        const periods = (_lastData && _lastData.periods) || [];
        if (!periods.length) return [];
        const idx = Math.min(_selectedPeriod, periods.length - 1);
        return (periods[idx] && periods[idx].nearby) || [];
    }

    // Append the next batch of nearby rows; (re)place a sentinel that loads more
    // when scrolled near. Returns true if there are still more rows after this.
    function appendNearbyBatch(rowsEl) {
        if (!rowsEl) return false;
        const old = rowsEl.querySelector(':scope > .history-nearby-sentinel');
        if (old) { if (_nearbyObs) _nearbyObs.unobserve(old); old.remove(); }
        const slice = _nearbyList.slice(_nearbyCursor, _nearbyCursor + NEARBY_BATCH);
        const tmp = document.createElement('div');
        tmp.innerHTML = slice.map(e => entryHtml(e, { showDelta: true })).join('');
        bindRefsIn(tmp);                       // bind only this batch's refs
        while (tmp.firstChild) rowsEl.appendChild(tmp.firstChild);
        _nearbyCursor += slice.length;
        if (_nearbyCursor < _nearbyList.length) {
            const sentinel = document.createElement('div');
            sentinel.className = 'history-nearby-sentinel';
            rowsEl.appendChild(sentinel);
            ensureNearbyObs();
            _nearbyObs.observe(sentinel);
            return true;
        }
        return false;
    }

    function ensureNearbyObs() {
        if (_nearbyObs) return;
        _nearbyObs = new IntersectionObserver((entries) => {
            for (const en of entries) {
                if (!en.isIntersecting) continue;
                const rowsEl = en.target.parentElement;
                _nearbyObs.unobserve(en.target);
                appendNearbyBatch(rowsEl);
            }
        }, { rootMargin: '300px 0px' });
    }

    // (Re)build the lazy row state for a nearby field that's already in the DOM.
    function setupNearby(nearbyEl) {
        disconnectNearbyObs();
        _nearbyList = currentNearby();
        _nearbyCursor = 0;
        const rowsEl = nearbyEl.querySelector('.history-nearby-rows');
        if (rowsEl) rowsEl.innerHTML = '';
        if (nearbyEl.open && rowsEl) appendNearbyBatch(rowsEl);
    }

    function nearbyExpandAll(nearbyEl, btn) {
        const rowsEl = nearbyEl.querySelector('.history-nearby-rows');
        if (!rowsEl) return;
        // Need to know whether to expand or collapse from what's rendered so far.
        const anyClosed = Array.from(rowsEl.querySelectorAll('.history-box')).some(b => !b.open)
            || _nearbyCursor < _nearbyList.length;
        if (anyClosed) {
            while (_nearbyCursor < _nearbyList.length) appendNearbyBatch(rowsEl);  // load all
            disconnectNearbyObs();
            rowsEl.querySelectorAll('.history-box').forEach(b => { b.open = true; });
            btn.textContent = 'Lukk alle';
        } else {
            rowsEl.querySelectorAll('.history-box').forEach(b => { b.open = false; });
            btn.textContent = 'Utvid alle';
        }
    }

    // Wire only the "Omkring i tid" field's controls + lazy rows. Kept separate so
    // switching period/window re-renders just this field in place (no scroll jump).
    function attachNearbyHandlers(nearbyEl) {
        if (!nearbyEl) return;
        // ±-selector: re-fetch for the new window, then re-render this field only.
        nearbyEl.querySelectorAll('.history-win-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const w = Number(btn.dataset.win);
                if (w === _window) return;
                changeWindow(w);
            });
        });
        // Period selector: swap which era's nearby shows — re-render this field only.
        nearbyEl.querySelectorAll('.history-period-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const i = Number(btn.dataset.period);
                if (i === _selectedPeriod) return;
                _selectedPeriod = i;
                _nearbyOpen = true;
                renderNearbyOnly();
            });
        });
        const expandBtn = nearbyEl.querySelector('.history-nearby-controls .history-expand-all');
        if (expandBtn) {
            expandBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                nearbyExpandAll(nearbyEl, expandBtn);
            });
        }
        nearbyEl.addEventListener('toggle', () => {
            _nearbyOpen = nearbyEl.open;
            if (nearbyEl.open && _nearbyCursor === 0) {
                appendNearbyBatch(nearbyEl.querySelector('.history-nearby-rows'));
            }
        });
        setupNearby(nearbyEl);
    }

    // Fetch fresh data for the new ±window (window only affects nearby), then
    // re-render the nearby field in place so scroll position is preserved.
    async function changeWindow(w) {
        _window = w;
        _nearbyOpen = true;
        try { localStorage.setItem('historyWindow', String(w)); } catch {}
        let data = _dataCache.get(cacheKey(_scope));
        if (!data) {
            try {
                data = await fetchData(_scope.range);
                _dataCache.set(cacheKey(_scope), data);
            } catch (err) { console.error(err); return; }
        }
        _lastData = data;
        renderNearbyOnly();
    }

    // Rebuild just the nearby field without touching the rest of the body, so the
    // module's scroll position doesn't jump to the top.
    function renderNearbyOnly() {
        if (!_container) return;
        disconnectNearbyObs();
        const periods = (_lastData && _lastData.periods) || [];
        const old = _container.querySelector('details.history-nearby');
        const tmp = document.createElement('div');
        tmp.innerHTML = nearbyHtml(periods);
        const fresh = tmp.firstElementChild;
        if (old && fresh) {
            old.replaceWith(fresh);
            attachNearbyHandlers(fresh);
        } else if (old) {
            old.remove();
        } else if (fresh) {
            const body = _container.querySelector('.history-body');
            if (body) { body.appendChild(fresh); attachNearbyHandlers(fresh); }
        }
    }

    function attachSectionHandlers() {
        if (!_container) return;
        wireExpandAll(_container.querySelector('.history-section-head .history-expand-all'),
            () => _container.querySelectorAll('.history-direct > .history-box'));
        attachNearbyHandlers(_container.querySelector('details.history-nearby'));
    }

    // ── Epoch drill-down: read every entry inside a referenced period ──
    function wireEpochChips() {
        if (!_container) return;
        _container.querySelectorAll('.history-epoch-chip').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openEpoch(Number(btn.dataset.epochId));
            });
        });
    }

    async function openEpoch(epochId) {
        if (!Number.isFinite(epochId)) return;
        setBody(`<div class="history-loading">Laster …</div>`);
        let data;
        try {
            const resp = await fetch('/api/history/epoch/' + epochId);
            if (!resp.ok) throw new Error('epoch fetch failed: ' + resp.status);
            data = await resp.json();
        } catch (err) {
            console.error(err);
            setBody(`<div class="history-empty">Kunne ikke laste perioden.</div>`);
            return;
        }
        const ep = data.epoch || {};
        const entries = data.entries || [];
        const head = `<button type="button" class="history-back">← Tilbake</button>`
            + `<div class="history-epoch-detail-head">`
            + (ep.year_label ? `<span class="history-year">${esc(ep.year_label)}</span>` : '')
            + typeChip(ep.event_type)
            + (ep.title ? `<span class="history-entry-title">${esc(ep.title)}</span>` : '')
            + `</div>`
            + (ep.body ? `<div class="history-entry-body history-epoch-detail-body">${renderBody(ep.body)}</div>` : '');
        const list = entries.length
            ? entries.map(e => entryHtml(e, {})).join('')
            : `<div class="history-empty">Ingen daterte hendelser i denne perioden.</div>`;
        setBody(`<div class="history-epoch-detail">${head}`
            + `<div class="history-section-label">Hendelser i perioden (${entries.length})</div>`
            + `<div class="history-direct">${list}</div></div>`);
        const back = _container.querySelector('.history-back');
        if (back) back.addEventListener('click', () => renderData(_lastData));
        attachRefPreviewHandlers();
    }

    // ── Load + render ───────────────────────────────────────────────
    let _lastData = null;

    function renderData(data) {
        _lastData = data;
        if (!data) { setEpochs(''); setBody(''); return; }
        const direct = data.direct || [];
        const periods = data.periods || [];
        const epochs = data.epochs || [];

        setEpochs(epochsHtml(epochs));
        wireEpochChips();

        const hasNearby = periods.some(p => (p.nearby || []).length);
        if (!direct.length && !hasNearby) {
            setBody(`<div class="history-empty">Ingen historisk forankring for denne teksten.</div>`);
            return;
        }
        let html = '';
        if (direct.length) {
            const expandAll = direct.length > 1
                ? `<button type="button" class="history-expand-all">Lukk alle</button>` : '';
            html += `<div class="history-section-head">`
                + `<span class="history-section-label">Direkte treff</span>${expandAll}</div>`;
            html += `<div class="history-direct">`
                + direct.map(e => entryHtml(e, { withChips: true, open: true })).join('') + `</div>`;
        }
        html += nearbyHtml(periods);
        setBody(html);

        attachTriggerHandlers();
        attachRefPreviewHandlers();
        attachSectionHandlers();
    }

    async function loadAndRender() {
        if (!_scope || !_scope.range) {
            setScopeLabel('');
            setEpochs('');
            setBody('');
            return;
        }
        setScopeLabel(_scope.range.label || '');

        let data = _dataCache.get(cacheKey(_scope));
        if (!data) {
            setBody(`<div class="history-loading">Laster …</div>`);
            try {
                data = await fetchData(_scope.range);
                _dataCache.set(cacheKey(_scope), data);
            } catch (e) {
                console.error(e);
                setBody(`<div class="history-empty">Kunne ikke laste historisk kontekst.</div>`);
                return;
            }
        }
        _hasBeenShown = true;
        renderData(data);
    }

    // ── Rebind to main block on text-in-view change (mirrors leksikon) ──
    function rebindToMainBlock() {
        const ns = scopeFromMainBlock();
        if (!ns) {
            if (_scope && _scope.source === 'tray') { _scope = null; loadAndRender(); }
            return;
        }
        if (!_scope) { _scope = ns; loadAndRender(); return; }
        if (_scope.source === 'tray') {
            if (scopeKey(ns) === scopeKey(_scope)) return;
            _scope = ns;
            _selectedPeriod = 0;
            loadAndRender();
            return;
        }
        const block = window.mainData && window.mainData[0];
        if (!block) return;
        const stillRelevant = _scope.markedVerses.some(mv =>
            mv.book === block.book
            && (block.verses || []).some(v => v.chapter === mv.chapter && v.num === mv.verse));
        if (!stillRelevant) { _scope = ns; _selectedPeriod = 0; loadAndRender(); }
    }

    function openHost() {
        if (isMobileNow()) {
            if (window.AppModuleHost) window.AppModuleHost.openModule('history');
        } else if (window.AppSidebar) {
            if (typeof window.AppSidebar.openModule === 'function') {
                window.AppSidebar.openModule('history');
            } else {
                window.AppSidebar.ensureOpen();
            }
        }
    }

    // ── Public triggers ─────────────────────────────────────────────
    async function showForBlock(blockIdx) {
        if (blockIdx !== 0 && typeof window.isolateToBlock === 'function') {
            await window.isolateToBlock(blockIdx);
            blockIdx = 0;
        }
        const block = (window.mainData && window.mainData[blockIdx]) || null;
        if (!block) return;
        const range = rangeFromBlock(block);
        if (!range) return;
        _scope = { source: 'tray', range, markedVerses: [] };
        _selectedPeriod = 0;
        _hasBeenShown = true;
        openHost();
        await loadAndRender();
    }

    async function showForMarkedVerses(markedVerses) {
        if (!markedVerses || !markedVerses.length) return;
        const sorted = markedVerses.slice().sort((a, b) => (a.chapter - b.chapter) || (a.verse - b.verse));
        const first = sorted[0], last = sorted[sorted.length - 1];
        const version = (window.versionSelect && String(window.versionSelect.value)) || '';
        const lang = (typeof window.versionLang === 'function') ? window.versionLang(version) : 'no';
        const bName = (typeof window.bookName === 'function') ? window.bookName(first.book, lang) : first.book;
        const label = (first.chapter === last.chapter)
            ? window.fmtVerseRef(first.book, bName, first.chapter, first.verse, last.verse)
            : `${bName} ${first.chapter}:${first.verse}-${last.chapter}:${last.verse}`;
        _scope = {
            source: isMobileNow() ? 'mvb-mobile' : 'mvb-pc',
            range: {
                book: first.book, ch_start: first.chapter, vs_start: first.verse,
                ch_end: last.chapter, vs_end: last.verse, version, label,
            },
            markedVerses: markedVerses.map(v => ({ book: v.book, chapter: v.chapter, verse: v.verse })),
        };
        _selectedPeriod = 0;
        _hasBeenShown = true;
        openHost();
        await loadAndRender();
    }

    // ── Module def ──────────────────────────────────────────────────
    // icon attrib: "https://www.flaticon.com/free-icons/hourglass" Hourglass icons created by Those Icons - Flaticon
    const moduleDef = {
        id: 'history',
        title: 'Historie',
        subtitle: 'Annals of the World',
        icon: '<img src="/static/images/history.png" alt="" class="sidebar-module-icon-img">',
        async mount(container, ctx) {
            _container = container;
            _ctx = ctx;
            _isMobile = isMobileNow();
            buildScaffold();
            if (!_scope) {
                const ns = scopeFromMainBlock();
                if (ns) _scope = ns;
            }
            if (_scope) await loadAndRender();
            if (ctx && ctx.subscribe) {
                _unsubMainBlock = ctx.subscribe('mainBlockChanged', () => rebindToMainBlock());
            }
        },
        unmount() {
            if (_unsubMainBlock) { try { _unsubMainBlock(); } catch {} _unsubMainBlock = null; }
            disconnectNearbyObs();
            _container = null;
            _ctx = null;
        },
        isEmpty() { return !_hasBeenShown; },
        clearAll() {
            _scope = null;
            _hasBeenShown = false;
            _nearbyOpen = false;
            _selectedPeriod = 0;
            _lastData = null;
            _nearbyList = [];
            _nearbyCursor = 0;
            disconnectNearbyObs();
            _dataCache.clear();
            if (window.RefPreviewPopup) window.RefPreviewPopup.hide();
            if (_container) { setEpochs(''); setBody(''); setScopeLabel(''); }
        },
    };

    window.HistoryModule = { moduleDef, showForBlock, showForMarkedVerses };

    function tryRegister() {
        if (window.AppSidebar && window.AppSidebar.register) {
            window.AppSidebar.register(moduleDef);
            if (window.AppModuleHost && window.AppModuleHost.register) window.AppModuleHost.register(moduleDef);
        } else {
            setTimeout(tryRegister, 30);
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryRegister);
    } else {
        tryRegister();
    }
})();
