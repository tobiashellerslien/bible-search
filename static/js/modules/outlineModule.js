// ── Outline module (PC sidebar + mobile module host) ──
// Renders a book's outline (BSB) as a nested, collapsible list. Each node has
// a label, a hierarchical level (1/a/i/...), and one or more verse ranges that
// open as clickable references.
(function () {
    let _container = null;
    let _ctx = null;
    let _unsubMainBlock = null;

    // {book_usfm -> {tree, source, version}} payload cache (per current version).
    const _cache = new Map();
    let _currentBook = null;
    let _currentVersion = null;
    let _currentTree = null;
    let _hasBeenShown = false;
    // Persisted per-book open-state for <details> nodes, keyed by node path.
    const _openState = new Map(); // book -> Set(path)
    // MVB pinning: when set, render uses this focus instead of the top main
    // block, and we hold it until the user navigates away from the verses.
    // _pinnedFocus: {book, ch_start, vs_start, ch_end, vs_end}
    // _pinnedMarkedVerses: [{book, chapter, verse}, ...]
    let _pinnedFocus = null;
    let _pinnedMarkedVerses = null;

    function isMobileNow() {
        return !!(window.AppModuleHost && window.AppModuleHost.isMobile && window.AppModuleHost.isMobile());
    }

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, c => (
            { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
        ));
    }

    function tFn(key, ...args) {
        if (typeof window.t === 'function') return window.t(key, ...args);
        return key;
    }

    function currentVersion() {
        return (window.versionSelect && String(window.versionSelect.value)) || '';
    }

    function bookDisplay(book) {
        const v = currentVersion();
        const lang = (typeof window.versionLang === 'function') ? window.versionLang(v) : 'no';
        return (typeof window.bookName === 'function') ? window.bookName(book, lang) : book;
    }

    function bookShort(book) {
        return (typeof window.bookAbbrev === 'function') ? window.bookAbbrev(book) : book;
    }

    // Short label (button text) — abbreviated book name to save space on mobile.
    function refLabelShort(ref) {
        const bName = bookShort(ref.book);
        const c1 = ref.ch_start, v1 = ref.vs_start, c2 = ref.ch_end, v2 = ref.vs_end;
        if (c1 === c2) {
            if (v1 === v2) return `${bName} ${c1}:${v1}`;
            return `${bName} ${c1}:${v1}-${v2}`;
        }
        return `${bName} ${c1}:${v1}-${c2}:${v2}`;
    }

    // Navigation label (full book name) — used as the query for searchFromXref.
    function refLabelNav(ref) {
        const bName = bookDisplay(ref.book);
        const c1 = ref.ch_start, v1 = ref.vs_start, c2 = ref.ch_end, v2 = ref.vs_end;
        if (c1 === c2) {
            if (v1 === v2) return `${bName} ${c1}:${v1}`;
            return `${bName} ${c1}:${v1}-${v2}`;
        }
        return `${bName} ${c1}:${v1}-${c2}:${v2}`;
    }

    // ── DOM scaffold ────────────────────────────────────────────────
    function buildScaffold() {
        if (!_container) return;
        _container.innerHTML = `
            <div class="outline-module">
                <div class="outline-header"></div>
                <div class="outline-body"></div>
            </div>
        `;
    }

    function setHeader(text) {
        const el = _container && _container.querySelector('.outline-header');
        if (!el) return;
        el.textContent = text || '';
    }

    function setStatus(html) {
        const el = _container && _container.querySelector('.outline-body');
        if (el) el.innerHTML = html;
    }

    // ── Render ──────────────────────────────────────────────────────
    function rangesOverlap(r, focus) {
        if (!r || !focus) return false;
        if (r.book !== focus.book) return false;
        const aStart = r.ch_start * 1000 + (r.vs_start || 0);
        const aEnd = r.ch_end * 1000 + (r.vs_end || 9999);
        const bStart = focus.ch_start * 1000 + (focus.vs_start || 0);
        const bEnd = focus.ch_end * 1000 + (focus.vs_end || 9999);
        return aStart <= bEnd && bStart <= aEnd;
    }

    function nodeOverlapsFocus(node, focus) {
        if (!focus) return false;
        const refs = node.refs || [];
        if (refs.some(r => rangesOverlap(r, focus))) return true;
        return (node.children || []).some(c => nodeOverlapsFocus(c, focus));
    }

    function focusFromMainBlock() {
        const md = window.mainData || [];
        const block = md[0];
        if (!block || !block.verses || !block.verses.length) return null;
        const verses = block.verses;
        return {
            book: block.book,
            ch_start: verses[0].chapter,
            vs_start: verses[0].num,
            ch_end: verses[verses.length - 1].chapter,
            vs_end: verses[verses.length - 1].num,
        };
    }

    function activeFocus() {
        return _pinnedFocus || focusFromMainBlock();
    }

    // After main block changes, check whether the pinned marked verses still
    // sit inside the top block. If not, the user has navigated away and we
    // should release the pin.
    function pinnedStillRelevant() {
        if (!_pinnedMarkedVerses || !_pinnedMarkedVerses.length) return false;
        const block = window.mainData && window.mainData[0];
        if (!block) return false;
        return _pinnedMarkedVerses.some(mv =>
            mv.book === block.book
            && (block.verses || []).some(v => v.chapter === mv.chapter && v.num === mv.verse)
        );
    }

    function levelClass(level) {
        if (!level) return 'lvl-x';
        if (/^\d+$/.test(level)) return 'lvl-1';
        if (/^[a-z]+$/.test(level)) return 'lvl-a';
        return 'lvl-i';
    }

    function renderRefs(refs) {
        if (!refs || !refs.length) return '';
        const items = refs.map(r => {
            const shortL = refLabelShort(r);
            const navL = refLabelNav(r);
            return `<button type="button" class="outline-ref" data-label="${esc(navL)}" title="${esc(navL)}">${esc(shortL)}</button>`;
        }).join('');
        return `<span class="outline-refs">${items}</span>`;
    }

    function nodePath(parentPath, idx) {
        return parentPath ? `${parentPath}.${idx}` : String(idx);
    }

    function bookOpenSet() {
        if (!_currentBook) return new Set();
        if (!_openState.has(_currentBook)) _openState.set(_currentBook, new Set());
        return _openState.get(_currentBook);
    }

    function renderNodes(nodes, parentPath, focus) {
        if (!nodes || !nodes.length) return '';
        const openSet = bookOpenSet();
        let html = '<ul class="outline-list">';
        nodes.forEach((node, i) => {
            const path = nodePath(parentPath, i);
            const hasChildren = !!(node.children && node.children.length);
            const overlap = nodeOverlapsFocus(node, focus);
            // Initial open: anything overlapping the current focus is auto-opened.
            // Otherwise, respect user-toggled state stored in openSet.
            const userToggled = openSet.has(path);
            const userClosed = openSet.has('!' + path);
            let open = overlap || userToggled;
            if (userClosed) open = false;
            const cls = 'outline-node ' + levelClass(node.level) + (overlap ? ' is-current' : '');
            const lvl = node.level ? esc(node.level) + '.' : '';
            const markerSummary = `<span class="outline-marker"><span class="outline-chevron" aria-hidden="true"></span><span class="outline-level">${lvl}</span></span>`;
            const markerLeaf = `<span class="outline-marker outline-marker-leaf"><span class="outline-level">${lvl}</span></span>`;
            const content = `<span class="outline-content">`
                + `<span class="outline-label">${esc(node.label || '')}</span>`
                + renderRefs(node.refs)
                + `</span>`;
            if (hasChildren) {
                html += `<li class="${cls}"><details data-path="${esc(path)}"${open ? ' open' : ''}>`
                    + `<summary>${markerSummary}${content}</summary>`
                    + renderNodes(node.children, path, focus)
                    + `</details></li>`;
            } else {
                html += `<li class="${cls}">${markerLeaf}${content}</li>`;
            }
        });
        html += '</ul>';
        return html;
    }

    function attachHandlers() {
        if (!_container) return;
        _container.querySelectorAll('.outline-ref').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                const label = btn.dataset.label;
                if (!label) return;
                if (isMobileNow() && window.AppModuleHost && typeof window.AppModuleHost.closeModule === 'function') {
                    window.AppModuleHost.closeModule();
                }
                if (typeof window.searchFromXref === 'function') {
                    window.searchFromXref(label);
                }
            });
        });
        // Persist user toggle state per book so re-renders (focus shift) don't
        // re-collapse what the user expanded — and vice-versa.
        _container.querySelectorAll('details[data-path]').forEach(det => {
            det.addEventListener('toggle', () => {
                const set = bookOpenSet();
                const p = det.dataset.path;
                if (det.open) { set.add(p); set.delete('!' + p); }
                else          { set.add('!' + p); set.delete(p); }
            });
        });
    }

    async function fetchOutline(book) {
        const version = currentVersion();
        const cacheKey = `${book}|${version}`;
        if (_cache.has(cacheKey)) return _cache.get(cacheKey);
        const params = new URLSearchParams();
        params.set('book', book);
        if (version) params.set('version', version);
        const resp = await fetch('/api/outline?' + params.toString());
        if (!resp.ok) {
            if (resp.status === 404) return { tree: [], missing: true };
            throw new Error('outline fetch failed: ' + resp.status);
        }
        const data = await resp.json();
        _cache.set(cacheKey, data);
        return data;
    }

    async function loadAndRender(book, focus) {
        if (!book) {
            setHeader('');
            setStatus('');
            return;
        }
        _currentBook = book;
        _currentVersion = currentVersion();
        setHeader(bookDisplay(book));
        setStatus(`<div class="outline-loading">${esc(tFn('sidebar.outline.loading'))}</div>`);
        let data;
        try {
            data = await fetchOutline(book);
        } catch (e) {
            console.error(e);
            setStatus(`<div class="outline-empty">${esc(tFn('sidebar.outline.error'))}</div>`);
            return;
        }
        if (!data || data.missing || !data.tree || !data.tree.length) {
            _currentTree = null;
            setStatus(`<div class="outline-empty">${esc(tFn('sidebar.outline.empty'))}</div>`);
            return;
        }
        _currentTree = data.tree;
        _hasBeenShown = true;
        const html = renderNodes(_currentTree, '', focus || activeFocus());
        setStatus(html);
        attachHandlers();
        scrollFocusedIntoView();
    }

    function scrollFocusedIntoView() {
        if (!_container) return;
        const all = _container.querySelectorAll('.outline-node.is-current');
        if (!all.length) return;
        // The deepest is-current leaf is the most relevant target.
        const target = all[all.length - 1];
        try {
            target.scrollIntoView({ block: 'nearest', behavior: 'auto' });
        } catch { /* old browser, ignore */ }
    }

    function rebindToMainBlock() {
        if (!_hasBeenShown) return;
        // If MVB-pinned and the user is still on the same verses, freeze.
        // Otherwise drop the pin and rebind to the new top block.
        if (_pinnedFocus) {
            if (pinnedStillRelevant()) return;
            _pinnedFocus = null;
            _pinnedMarkedVerses = null;
        }
        const focus = focusFromMainBlock();
        if (!focus) return;
        if (focus.book !== _currentBook || currentVersion() !== _currentVersion) {
            loadAndRender(focus.book, focus);
            return;
        }
        // Same book — just re-render with new focus to update is-current state.
        if (_currentTree) {
            const html = renderNodes(_currentTree, '', focus);
            setStatus(html);
            attachHandlers();
            scrollFocusedIntoView();
        }
    }

    // ── Public API ──────────────────────────────────────────────────
    function openHost() {
        if (isMobileNow()) {
            if (window.AppModuleHost) window.AppModuleHost.openModule('outline');
        } else if (window.AppSidebar) {
            if (typeof window.AppSidebar.openModule === 'function') {
                window.AppSidebar.openModule('outline');
            } else {
                window.AppSidebar.ensureOpen();
            }
        }
    }

    async function showForBlock(blockIdx) {
        const block = (window.mainData && window.mainData[blockIdx]) || null;
        if (!block || !block.book) return;
        // Study-tray open releases any MVB pin — tray scope follows top block.
        _pinnedFocus = null;
        _pinnedMarkedVerses = null;
        _hasBeenShown = true;
        openHost();
        const verses = block.verses || [];
        const focus = verses.length ? {
            book: block.book,
            ch_start: verses[0].chapter,
            vs_start: verses[0].num,
            ch_end: verses[verses.length - 1].chapter,
            vs_end: verses[verses.length - 1].num,
        } : null;
        await loadAndRender(block.book, focus);
    }

    // Open module with focus pinned to the encompassing range of the marked
    // verses (MVB Outline button). Stays pinned until the user navigates the
    // top block away from those verses.
    async function showForMarkedVerses(markedVerses) {
        if (!markedVerses || !markedVerses.length) return;
        const sorted = markedVerses.slice().sort((a, b) =>
            (a.chapter - b.chapter) || (a.verse - b.verse));
        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        const focus = {
            book: first.book,
            ch_start: first.chapter,
            vs_start: first.verse,
            ch_end: last.chapter,
            vs_end: last.verse,
        };
        _pinnedFocus = focus;
        _pinnedMarkedVerses = markedVerses.map(v => ({
            book: v.book, chapter: v.chapter, verse: v.verse
        }));
        _hasBeenShown = true;
        openHost();
        await loadAndRender(focus.book, focus);
    }

    // ── Module def ──────────────────────────────────────────────────
    const moduleDef = {
        id: 'outline',
        title: 'Outline',
        icon: '<img src="/static/images/outline.png" alt="" class="sidebar-module-icon-img">',
        async mount(container, ctx) {
            _container = container;
            _ctx = ctx;
            buildScaffold();
            if (_hasBeenShown) {
                const focus = activeFocus();
                if (focus) await loadAndRender(focus.book, focus);
            }
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
            _hasBeenShown = false;
            _currentBook = null;
            _currentTree = null;
            _pinnedFocus = null;
            _pinnedMarkedVerses = null;
            _cache.clear();
            _openState.clear();
            if (_container) {
                setHeader('');
                setStatus('');
            }
        },
    };

    window.OutlineModule = { moduleDef, showForBlock, showForMarkedVerses };

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
