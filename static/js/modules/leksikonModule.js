// ── Leksikon module (PC sidebar + mobile module host) ──
// Bible dictionary lookups (Easton, Smith, Hitchcock) for the text in view
// (study tray) or for marked verses (MVB). UI = per-source tabs in one card;
// Hitchcock piggybacks on Easton/Smith headword matches server-side.
(function () {
    let _container = null;
    let _ctx = null;
    let _unsubMainBlock = null;

    // Scope:
    //   source: 'tray' | 'mvb-pc' | 'mvb-mobile'
    //   range:  { book, ch_start, vs_start, ch_end, vs_end, version, label }
    //   markedVerses: [{book, chapter, verse}, ...] (mvb-* sources only)
    let _scope = null;
    let _activeSource = null;
    let _hasBeenShown = false;
    let _isMobile = false;

    // {scope-key -> entries[]}
    const _entriesCache = new Map();

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, c => (
            { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
        ));
    }

    function tFn(key, ...args) {
        if (typeof window.t === 'function') return window.t(key, ...args);
        return key;
    }

    function isMobileNow() {
        return !!(window.AppModuleHost && window.AppModuleHost.isMobile && window.AppModuleHost.isMobile());
    }

    // ── DOM ─────────────────────────────────────────────────────────
    function buildScaffold() {
        if (!_container) return;
        _container.innerHTML = `
            <div class="leksikon-module">
                <div class="leksikon-scope-label"></div>
                <div class="leksikon-tabs" role="tablist"></div>
                <div class="leksikon-entries"></div>
            </div>
        `;
    }

    function setScopeLabel(text, opts) {
        const el = _container && _container.querySelector('.leksikon-scope-label');
        if (!el) return;
        el.innerHTML = '';
        if (!text) return;
        const span = document.createElement('span');
        span.className = 'leksikon-scope-text';
        span.textContent = text;
        el.appendChild(span);
        if (opts && opts.showExpand) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'leksikon-expand-btn';
            btn.textContent = tFn('sidebar.leksikon.expandToChapter');
            btn.title = tFn('sidebar.leksikon.expandToChapter');
            btn.addEventListener('click', expandMvbToChapter);
            el.appendChild(btn);
        }
    }

    function setStatus(html) {
        const el = _container && _container.querySelector('.leksikon-entries');
        if (el) el.innerHTML = html;
    }

    // ── Scope ───────────────────────────────────────────────────────
    function rangeFromBlock(block) {
        if (!block || !block.verses || !block.verses.length) return null;
        const verses = block.verses;
        const ch_start = verses[0].chapter;
        const vs_start = verses[0].num;
        const ch_end = verses[verses.length - 1].chapter;
        const vs_end = verses[verses.length - 1].num;
        const version = (window.versionSelect && String(window.versionSelect.value)) || '';
        const lang = (typeof window.versionLang === 'function')
            ? window.versionLang(version) : 'no';
        const bName = (typeof window.bookName === 'function')
            ? window.bookName(block.book, lang) : block.book;
        let label;
        if (block.is_chapter && ch_start === ch_end) {
            label = `${bName} ${ch_start}`;
        } else if (ch_start === ch_end && vs_start === vs_end) {
            label = `${bName} ${ch_start}:${vs_start}`;
        } else if (ch_start === ch_end) {
            label = `${bName} ${ch_start}:${vs_start}-${vs_end}`;
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

    // ── Fetch ───────────────────────────────────────────────────────
    async function fetchEntries(range) {
        const params = new URLSearchParams();
        params.set('book', range.book);
        params.set('chapter', String(range.ch_start));
        if (range.ch_end != null && range.ch_end !== range.ch_start) {
            params.set('chapter_end', String(range.ch_end));
        }
        if (range.vs_start != null) params.set('verse_start', String(range.vs_start));
        if (range.vs_end != null) params.set('verse_end', String(range.vs_end));
        if (range.version) params.set('version', range.version);
        const resp = await fetch('/api/leksikon?' + params.toString());
        if (!resp.ok) throw new Error('leksikon fetch failed: ' + resp.status);
        const data = await resp.json();
        return data.entries || [];
    }

    // ── Rendering helpers ───────────────────────────────────────────
    function renderBody(body) {
        if (!body) return '';
        // The server wraps inline scripture refs in <a class="leksikon-ref"
        // data-ref="USFM.CH.VS"> anchors. Protect them from escaping (trusted
        // HTML), escape the rest, apply italics/paragraphs, then restore.
        const anchors = [];
        const work = body.replace(/<a class="leksikon-ref"[^>]*>[\s\S]*?<\/a>/g, (m) => {
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

    function groupBySource(entries) {
        const groups = new Map();
        for (const e of entries) {
            const code = e.dictionary_code;
            if (!groups.has(code)) {
                groups.set(code, {
                    code,
                    short_name: e.dictionary_short_name,
                    entries: [],
                });
            }
            groups.get(code).entries.push(e);
        }
        return groups;
    }

    function renderTabs(groups) {
        const tabs = _container && _container.querySelector('.leksikon-tabs');
        if (!tabs) return;
        const ORDER = ['easton', 'smith', 'hitchcock'];
        const sorted = Array.from(groups.values()).sort((a, b) => {
            const ia = ORDER.indexOf(a.code); const ib = ORDER.indexOf(b.code);
            return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
        });
        if (!sorted.length) { tabs.innerHTML = ''; return; }
        if (!_activeSource || !groups.has(_activeSource)) {
            _activeSource = sorted[0].code;
        }
        tabs.innerHTML = sorted.map(g => {
            const active = g.code === _activeSource ? ' active' : '';
            const suffix = g.code === 'hitchcock'
                ? ` <span class="leksikon-tab-note">(navneforklaring)</span>`
                : '';
            return `<button type="button" class="leksikon-tab${active}" data-source="${esc(g.code)}" role="tab">`
                + `${esc(g.short_name)}${suffix} <span class="leksikon-tab-count">${g.entries.length}</span>`
                + `</button>`;
        }).join('');
        tabs.querySelectorAll('.leksikon-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                const code = btn.dataset.source;
                if (code === _activeSource) return;
                _activeSource = code;
                renderActiveEntries(groups);
                tabs.querySelectorAll('.leksikon-tab').forEach(b => {
                    b.classList.toggle('active', b.dataset.source === _activeSource);
                });
            });
        });
    }

    function entryOverlapsMarked(entry, markedVerses) {
        // Dictionary entries don't carry per-ref verse info in the payload, so
        // we can't filter on the client. Mobile-MVB filtering is approximate:
        // keep everything (the server already narrowed by the marked-verse range).
        return true; // eslint-disable-line no-unused-vars
    }

    // CCEL Easton spells the Æ ligature as "AE" ("AEnon"). Reorder comma-
    // suffixed titles ("Sea, The" / "Serpent, Fiery" / "Solomon, Song of" /
    // "Isaiah, The Book of") so the qualifier leads. Alternate-name forms
    // ("Mary, Or Miriam") are kept as-is.
    function prettyTitle(t) {
        if (!t) return t;
        t = t.replace(/^AE(?=[a-z])/, 'Ae');
        if (/,\s+[Oo]r\s/.test(t)) return t;
        const m = /^(.+?),\s+(.+)$/.exec(t);
        if (m) {
            const head = m[1].trim();
            let lead = m[2].trim();
            lead = lead.charAt(0).toUpperCase() + lead.slice(1);
            return `${lead} ${head}`;
        }
        return t;
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
            const label = (vsEnd !== t.verse_start)
                ? `${bAbbr} ${t.chapter}:${t.verse_start}-${vsEnd}`
                : `${bAbbr} ${t.chapter}:${t.verse_start}`;
            items.push(
                `<button type="button" class="leksikon-trigger-chip"`
                + ` data-book="${esc(book)}" data-chapter="${t.chapter}"`
                + ` data-verse-start="${t.verse_start}" data-verse-end="${vsEnd}"`
                + ` title="Gå til verset som utløste dette oppslaget">${esc(label)}</button>`
            );
        }
        return `<div class="leksikon-trigger-chips">${items.join('')}</div>`;
    }

    function renderActiveEntries(groups) {
        const g = groups.get(_activeSource);
        if (!g || !g.entries.length) {
            setStatus(`<div class="leksikon-empty">${esc(tFn('sidebar.leksikon.empty'))}</div>`);
            return;
        }
        const html = g.entries.map((e) => {
            return `<details class="leksikon-box">`
                + `<summary>`
                  + `<span class="leksikon-headword">${esc(prettyTitle(e.title || e.headword))}</span>`
                + `</summary>`
                + `<div class="leksikon-box-body">`
                  + buildTriggerChips(e)
                  + renderBody(e.body)
                + `</div>`
                + `</details>`;
        }).join('');
        setStatus(html);
        attachTriggerHandlers();
        attachRefPreviewHandlers();
    }

    // Navigate the main view to a reference, then reopen the leksikon there —
    // mirrors commentaryModule's openRefTarget.
    async function openRefTarget(ref, label) {
        if (typeof window.searchFromXref !== 'function') return;
        const q = label || (window.RefPreviewPopup ? window.RefPreviewPopup.refLabel(ref) : ref);
        // Mobile: the module overlay covers the reading area, so close it first
        // to reveal the verse the user navigated to.
        if (isMobileNow() && window.AppModuleHost && typeof window.AppModuleHost.closeModule === 'function') {
            window.AppModuleHost.closeModule();
            await window.searchFromXref(q);
            return;
        }
        await window.searchFromXref(q);
        await showForBlock(0);
    }

    // Inline scripture references in dictionary bodies: click — and hover on
    // PC — opens the shared verse-preview popup with an "open" button.
    function attachRefPreviewHandlers() {
        if (!_container || !window.RefPreviewPopup) return;
        window.RefPreviewPopup.bind(_container, 'a.leksikon-ref', {
            getVersion: () => (_scope && _scope.range && _scope.range.version) || '',
            onOpen: (ref, label) => openRefTarget(ref, label),
        });
    }

    function attachTriggerHandlers() {
        if (!_container) return;
        _container.querySelectorAll('.leksikon-trigger-chip').forEach(btn => {
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
                    found[0].scrollIntoView({ block: 'center', behavior: 'smooth' });
                    found.forEach(el => {
                        el.classList.add('topic-trigger-flash');
                        setTimeout(() => el.classList.remove('topic-trigger-flash'), 3000);
                    });
                } else {
                    const lang = (typeof window.versionLang === 'function' && _scope && _scope.range)
                        ? window.versionLang(_scope.range.version) : 'no';
                    const bName = (typeof window.bookName === 'function')
                        ? window.bookName(book, lang) : book;
                    const label = (vsEnd !== vsStart)
                        ? `${bName} ${chapter}:${vsStart}-${vsEnd}`
                        : `${bName} ${chapter}:${vsStart}`;
                    if (typeof window.searchFromXref === 'function') window.searchFromXref(label);
                }
            });
        });
    }

    // ── Load + render ───────────────────────────────────────────────
    async function loadAndRender() {
        if (!_scope || !_scope.range) {
            setScopeLabel('');
            setStatus('');
            const tabs = _container && _container.querySelector('.leksikon-tabs');
            if (tabs) tabs.innerHTML = '';
            return;
        }

        const isMvb = (_scope.source === 'mvb-pc' || _scope.source === 'mvb-mobile');
        const scopeLabel = isMvb
            ? tFn('sidebar.leksikon.scope.mvb')
            : tFn('sidebar.leksikon.scope.tray', _scope.range.label);
        setScopeLabel(scopeLabel, { showExpand: isMvb });

        let entries = _entriesCache.get(scopeKey(_scope));
        if (!entries) {
            setStatus(`<div class="leksikon-loading">${esc(tFn('sidebar.leksikon.loading'))}</div>`);
            try {
                entries = await fetchEntries(_scope.range);
                _entriesCache.set(scopeKey(_scope), entries);
            } catch (e) {
                console.error(e);
                setStatus(`<div class="leksikon-empty">${esc(tFn('sidebar.leksikon.empty'))}</div>`);
                return;
            }
        }

        if (!entries.length) {
            const tabs = _container && _container.querySelector('.leksikon-tabs');
            if (tabs) tabs.innerHTML = '';
            setStatus(`<div class="leksikon-empty">${esc(tFn('sidebar.leksikon.empty'))}</div>`);
            return;
        }

        _hasBeenShown = true;
        const groups = groupBySource(entries);
        renderTabs(groups);
        renderActiveEntries(groups);
    }

    // ── Expand MVB scope to chapter ─────────────────────────────────
    async function expandMvbToChapter() {
        if (!_scope) return;
        if (_scope.source !== 'mvb-pc' && _scope.source !== 'mvb-mobile') return;
        const r = _scope.range;

        // Find the card whose block contains the marked-verses chapter and
        // trigger chapter expand — mirrors commentaryModule's flow.
        const md = window.mainData || [];
        let targetIdx = -1;
        for (let i = 0; i < md.length; i++) {
            const b = md[i];
            if (!b || b.book !== r.book) continue;
            const hit = (b.verses || []).some(v => v.chapter >= r.ch_start && v.chapter <= r.ch_end);
            if (hit) { targetIdx = i; break; }
        }
        if (targetIdx >= 0 && !isMobileNow() && typeof window.toggleChapterExpand === 'function') {
            const bar = document.querySelector(`.chapter-expand-bar[data-card-idx="${targetIdx}"]`);
            const alreadyExpanded = bar && bar.getAttribute('data-expanded') === 'true';
            if (!alreadyExpanded) {
                // Demote to tray scope so the upcoming mainBlockChanged re-fetches
                // for the new full-chapter block.
                _scope = { source: 'tray', range: _scope.range, markedVerses: [] };
                await window.toggleChapterExpand(targetIdx);
                return;
            }
        }

        // Already chapter-expanded (or no matching card) — just widen locally.
        const lang = (typeof window.versionLang === 'function')
            ? window.versionLang(r.version) : 'no';
        const bName = (typeof window.bookName === 'function')
            ? window.bookName(r.book, lang) : r.book;
        const label = (r.ch_start === r.ch_end)
            ? `${bName} ${r.ch_start}`
            : `${bName} ${r.ch_start}-${r.ch_end}`;
        _scope = {
            source: 'tray',
            range: {
                book: r.book,
                ch_start: r.ch_start,
                vs_start: null,
                ch_end: r.ch_end,
                vs_end: null,
                version: r.version,
                label,
            },
            markedVerses: [],
        };
        loadAndRender();
    }

    // ── Rebind to main block on text-in-view change ─────────────────
    function rebindToMainBlock() {
        const ns = scopeFromMainBlock();
        if (!ns) {
            if (_scope && _scope.source === 'tray') {
                _scope = null;
                loadAndRender();
            }
            return;
        }
        if (!_scope) {
            _scope = ns;
            loadAndRender();
            return;
        }
        if (_scope.source === 'tray') {
            if (scopeKey(ns) === scopeKey(_scope)) return;
            _scope = ns;
            loadAndRender();
            return;
        }
        // MVB scope: stay pinned as long as the marked verses are still in
        // view on the top block. Once the user navigates away the marked
        // verses go out of scope; drop MVB and rebind to the new top block.
        const block = window.mainData && window.mainData[0];
        if (!block) return;
        const stillRelevant = _scope.markedVerses.some(mv =>
            mv.book === block.book
            && (block.verses || []).some(v => v.chapter === mv.chapter && v.num === mv.verse)
        );
        if (!stillRelevant) {
            _scope = ns;
            loadAndRender();
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
        _hasBeenShown = true;

        if (isMobileNow()) {
            if (window.AppModuleHost) window.AppModuleHost.openModule('leksikon');
        } else if (window.AppSidebar) {
            if (typeof window.AppSidebar.openModule === 'function') {
                window.AppSidebar.openModule('leksikon');
            } else {
                window.AppSidebar.ensureOpen();
            }
        }
        await loadAndRender();
    }

    async function showForMarkedVerses(markedVerses) {
        if (!markedVerses || !markedVerses.length) return;
        const sorted = markedVerses.slice().sort((a, b) =>
            (a.chapter - b.chapter) || (a.verse - b.verse));
        const first = sorted[0], last = sorted[sorted.length - 1];
        const version = (window.versionSelect && String(window.versionSelect.value)) || '';
        const lang = (typeof window.versionLang === 'function')
            ? window.versionLang(version) : 'no';
        const bName = (typeof window.bookName === 'function')
            ? window.bookName(first.book, lang) : first.book;
        const label = (first.chapter === last.chapter && first.verse === last.verse)
            ? `${bName} ${first.chapter}:${first.verse}`
            : (first.chapter === last.chapter
                ? `${bName} ${first.chapter}:${first.verse}-${last.verse}`
                : `${bName} ${first.chapter}:${first.verse}-${last.chapter}:${last.verse}`);
        const range = {
            book: first.book,
            ch_start: first.chapter, vs_start: first.verse,
            ch_end: last.chapter, vs_end: last.verse,
            version, label,
        };
        _scope = {
            source: isMobileNow() ? 'mvb-mobile' : 'mvb-pc',
            range,
            markedVerses: markedVerses.map(v => ({ book: v.book, chapter: v.chapter, verse: v.verse })),
        };
        _hasBeenShown = true;

        if (isMobileNow()) {
            if (window.AppModuleHost) window.AppModuleHost.openModule('leksikon');
        } else if (window.AppSidebar) {
            if (typeof window.AppSidebar.openModule === 'function') {
                window.AppSidebar.openModule('leksikon');
            } else {
                window.AppSidebar.ensureOpen();
            }
        }
        await loadAndRender();
    }

    // ── Module def ──────────────────────────────────────────────────
    const moduleDef = {
        id: 'leksikon',
        title: 'Leksikon',
        icon: '<img src="/static/images/lexicon.png" alt="" class="sidebar-module-icon-img">',
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
            _container = null;
            _ctx = null;
        },
        isEmpty() { return !_hasBeenShown; },
        clearAll() {
            _scope = null;
            _activeSource = null;
            _hasBeenShown = false;
            _entriesCache.clear();
            if (window.RefPreviewPopup) window.RefPreviewPopup.hide();
            if (_container) {
                const entriesEl = _container.querySelector('.leksikon-entries');
                if (entriesEl) entriesEl.innerHTML = '';
                const tabs = _container.querySelector('.leksikon-tabs');
                if (tabs) tabs.innerHTML = '';
                setScopeLabel('');
            }
        },
    };

    window.LeksikonModule = { moduleDef, showForBlock, showForMarkedVerses };

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
