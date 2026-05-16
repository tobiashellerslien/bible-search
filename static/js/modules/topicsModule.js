// ── Topics module (PC sidebar + mobile module host) ──
// Surfaces BSB topical-index entries that overlap the in-view passage (study
// tray) or the marked verses (MVB). Topics nest as a tree, sorted by total
// descendant verse-count desc; matched leaves carry chips back to the verse(s)
// in the main view that surfaced them. Verse previews load lazily and reuse
// the cross-reference visual pattern (.xr-item / .xr-ref / .xr-preview).
(function () {
    let _container = null;
    let _unsubMainBlock = null;
    let _ctx = null;

    let _scope = null;                  // {source, range, markedVerses}
    const _dataCache = new Map();       // scopeKey -> tree
    const _topicDetailCache = new Map();// topic_id -> /api/topic/<id> payload
    const _previewCache = new Map();    // ref_label -> preview text
    let _hasBeenShown = false;
    let _isMobile = false;

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

    // ── DOM scaffold ────────────────────────────────────────────────
    function buildScaffold() {
        if (!_container) return;
        _container.innerHTML = `
            <div class="topics-module">
                <div class="topics-scope-label"></div>
                <div class="topics-tree"></div>
            </div>
        `;
    }

    // ── Scope derivation (mirrors commentaryModule) ─────────────────
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
        if (block.is_chapter && ch_start === ch_end) label = `${bName} ${ch_start}`;
        else if (ch_start === ch_end && vs_start === vs_end) label = `${bName} ${ch_start}:${vs_start}`;
        else if (ch_start === ch_end) label = `${bName} ${ch_start}:${vs_start}-${vs_end}`;
        else label = `${bName} ${ch_start}:${vs_start}-${ch_end}:${vs_end}`;
        return { book: block.book, ch_start, vs_start, ch_end, vs_end, version, label };
    }

    function scopeFromMainBlock() {
        if (!_ctx) return null;
        const mb = _ctx.getMainBlock();
        if (!mb || !mb.block) return null;
        const range = rangeFromBlock(mb.block);
        if (!range) return null;
        return { source: 'tray', range, markedVerses: [] };
    }

    function scopeKey(scope) {
        if (!scope) return '';
        const r = scope.range;
        const mv = scope.markedVerses.map(v => `${v.book}.${v.chapter}.${v.verse}`).join(',');
        return [scope.source, r.book, r.ch_start, r.vs_start, r.ch_end, r.vs_end, r.version, mv].join('|');
    }

    // ── API ─────────────────────────────────────────────────────────
    async function fetchTopicsTree(range, markedVerses) {
        const params = new URLSearchParams();
        params.set('book', range.book);
        // For MVB scope, narrow to just the marked verses — single-chapter
        // assumption holds (MVB only marks verses in the active chapter).
        if (markedVerses && markedVerses.length) {
            const sorted = markedVerses.slice().sort((a, b) =>
                (a.chapter - b.chapter) || (a.verse - b.verse));
            const first = sorted[0], last = sorted[sorted.length - 1];
            params.set('chapter', String(first.chapter));
            params.set('verse_start', String(first.verse));
            if (last.chapter !== first.chapter) params.set('chapter_end', String(last.chapter));
            params.set('verse_end', String(last.verse));
        } else {
            params.set('chapter', String(range.ch_start));
            if (range.ch_end != null && range.ch_end !== range.ch_start) {
                params.set('chapter_end', String(range.ch_end));
            }
            if (range.vs_start != null) params.set('verse_start', String(range.vs_start));
            if (range.vs_end != null) params.set('verse_end', String(range.vs_end));
        }
        if (range.version) params.set('version', range.version);
        const resp = await fetch('/api/topics?' + params.toString());
        if (!resp.ok) throw new Error('topics fetch failed: ' + resp.status);
        const data = await resp.json();
        return data.topics || [];
    }

    async function fetchTopicDetail(topicId) {
        if (_topicDetailCache.has(topicId)) return _topicDetailCache.get(topicId);
        const resp = await fetch('/api/topic/' + topicId);
        if (!resp.ok) throw new Error('topic detail fetch failed: ' + resp.status);
        const data = await resp.json();
        _topicDetailCache.set(topicId, data);
        return data;
    }

    async function fetchVersePreview(refLabel) {
        if (_previewCache.has(refLabel)) return _previewCache.get(refLabel);
        const version = _scope && _scope.range && _scope.range.version;
        const params = new URLSearchParams();
        params.set('q', refLabel);
        if (version) params.set('version', version);
        try {
            const resp = await fetch('/api/search?' + params.toString());
            const data = await resp.json();
            let preview = '';
            if (data && data.type === 'reference' && Array.isArray(data.results)) {
                const first = data.results[0];
                if (first && first.verses && first.verses.length) {
                    preview = first.verses.slice(0, 3).map(v => v.text).join(' ');
                    if (first.verses.length > 3) preview += ' …';
                }
            }
            _previewCache.set(refLabel, preview);
            return preview;
        } catch {
            _previewCache.set(refLabel, '');
            return '';
        }
    }

    // ── Render ──────────────────────────────────────────────────────
    function setScopeLabel(text, opts) {
        const el = _container && _container.querySelector('.topics-scope-label');
        if (!el) return;
        el.innerHTML = '';
        if (!text) return;
        const span = document.createElement('span');
        span.className = 'topics-scope-text';
        span.textContent = text;
        el.appendChild(span);
        if (opts && opts.showExpand) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'topics-expand-btn';
            btn.textContent = tFn('sidebar.topics.expandToChapter');
            btn.title = tFn('sidebar.topics.expandToChapter');
            btn.addEventListener('click', expandMvbToChapter);
            el.appendChild(btn);
        }
    }

    function setTreeHtml(html) {
        const el = _container && _container.querySelector('.topics-tree');
        if (el) el.innerHTML = html;
    }

    function refLabelForVerse(book, chapter, verse) {
        const lang = (typeof window.versionLang === 'function' && _scope && _scope.range)
            ? window.versionLang(_scope.range.version) : 'no';
        const bName = (typeof window.bookName === 'function')
            ? window.bookName(book, lang) : book;
        return `${bName} ${chapter}:${verse}`;
    }

    function refLabelFromVerseSpec(v) {
        const lang = (typeof window.versionLang === 'function' && _scope && _scope.range)
            ? window.versionLang(_scope.range.version) : 'no';
        const bName = (typeof window.bookName === 'function')
            ? window.bookName(v.book_usfm, lang) : v.book_usfm;
        if (v.verse_end && v.verse_end !== v.verse_start) {
            return `${bName} ${v.chapter}:${v.verse_start}-${v.verse_end}`;
        }
        return `${bName} ${v.chapter}:${v.verse_start}`;
    }

    function buildTriggerChips(node) {
        const tb = node.triggered_by || [];
        if (!tb.length) return '';
        // Dedup by chapter+verse_start
        const seen = new Set();
        const items = [];
        for (const t of tb) {
            const key = `${t.chapter}.${t.verse_start}.${t.verse_end || ''}`;
            if (seen.has(key)) continue;
            seen.add(key);
            const book = _scope.range.book;
            const vsEnd = (t.verse_end && t.verse_end !== t.verse_start) ? t.verse_end : t.verse_start;
            const label = (vsEnd !== t.verse_start)
                ? `${refLabelForVerse(book, t.chapter, t.verse_start)}-${vsEnd}`
                : refLabelForVerse(book, t.chapter, t.verse_start);
            items.push(
                `<button type="button" class="topic-trigger-chip"`
                + ` data-book="${esc(book)}" data-chapter="${t.chapter}"`
                + ` data-verse-start="${t.verse_start}" data-verse-end="${vsEnd}"`
                + ` title="${esc(tFn('sidebar.topics.jumpToTrigger'))}">${esc(label)}</button>`
            );
        }
        return `<span class="topic-trigger-chips">${items.join('')}</span>`;
    }

    function visibleSubtreeCount(node) {
        let n = (typeof node.own_count === 'number') ? node.own_count : 0;
        if (node.children) for (const c of node.children) n += visibleSubtreeCount(c);
        return n;
    }

    function buildTopicNodeHtml(node, depth) {
        const hasChildren = node.children && node.children.length > 0;
        const childHtml = hasChildren
            ? `<div class="topic-children">`
              + node.children.map(c => buildTopicNodeHtml(c, depth + 1)).join('')
              + `</div>`
            : '';
        const triggers = buildTriggerChips(node);
        // Badge = sum of direct verse-rows across this topic + all rendered
        // descendants. That keeps it consistent with what the user can actually
        // see in the tree (parent topics typically have 0 direct rows of their
        // own — all verses live in subtopics). Sort still uses node.verse_count.
        const visibleCount = visibleSubtreeCount(node);
        const count = `<span class="topic-count" title="${esc(tFn('sidebar.topics.countTitle'))}">${visibleCount}</span>`;
        const parentBadge = hasChildren
            ? `<span class="topic-parent-badge" title="${esc(tFn('sidebar.topics.subtopicsCount', node.children.length))}">↳ ${node.children.length}</span>`
            : '';
        const parentClass = hasChildren ? ' has-children' : '';
        return `<details class="topic-node${parentClass}" data-topic-id="${node.id}" data-depth="${depth}">`
            + `<summary>`
              + `<span class="topic-name">${esc(node.name)}</span>`
              + count
              + parentBadge
              + triggers
            + `</summary>`
            + `<div class="topic-body">`
              + `<div class="topic-verses xr-panel-inner" data-loaded="0"></div>`
              + childHtml
            + `</div>`
            + `</details>`;
    }

    const VERSE_PREVIEW_INITIAL = 8;

    // Single shared IntersectionObserver: previews only fetch when the row
    // actually enters the viewport, so a topic with 200 verses doesn't trigger
    // 200 /api/search calls up-front.
    let _previewObserver = null;
    const _previewQueue = [];
    let _previewWorking = false;

    function ensurePreviewObserver() {
        if (_previewObserver) return _previewObserver;
        _previewObserver = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                const it = entry.target;
                _previewObserver.unobserve(it);
                if (it.dataset.previewQueued === '1') continue;
                it.dataset.previewQueued = '1';
                _previewQueue.push(it);
                pumpPreviewQueue();
            }
        }, { rootMargin: '120px 0px' });
        return _previewObserver;
    }

    async function pumpPreviewQueue() {
        if (_previewWorking) return;
        _previewWorking = true;
        try {
            while (_previewQueue.length) {
                const it = _previewQueue.shift();
                if (!it.isConnected) continue;
                const label = it.dataset.label;
                const preview = await fetchVersePreview(label);
                const previewEl = it.querySelector('.topic-verse-preview');
                if (previewEl) previewEl.textContent = preview || '';
            }
        } finally {
            _previewWorking = false;
        }
    }

    function renderVerseRows(versesEl, verses, showAll) {
        const limit = showAll ? verses.length : Math.min(VERSE_PREVIEW_INITIAL, verses.length);
        const visible = verses.slice(0, limit);
        const remaining = verses.length - limit;
        let html = visible.map(v => {
            const label = refLabelFromVerseSpec(v);
            return `<div class="xr-item topic-verse-item" data-label="${esc(label)}">`
                + `<span class="xr-ref">${esc(label)}</span>`
                + `<span class="xr-preview topic-verse-preview"></span>`
                + `</div>`;
        }).join('');
        if (remaining > 0) {
            html += `<button type="button" class="topics-show-all">`
                + esc(tFn('sidebar.topics.showAll', remaining))
                + `</button>`;
        }
        versesEl.innerHTML = html;
        const observer = ensurePreviewObserver();
        versesEl.querySelectorAll('.topic-verse-item').forEach(it => {
            it.addEventListener('click', () => {
                const label = it.dataset.label;
                if (typeof window.searchFromXref === 'function') window.searchFromXref(label);
            });
            observer.observe(it);
        });
        const showAllBtn = versesEl.querySelector('.topics-show-all');
        if (showAllBtn) {
            showAllBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                renderVerseRows(versesEl, verses, true);
            });
        }
    }

    function renderTree(tree) {
        if (!tree || !tree.length) {
            setTreeHtml(`<div class="topics-empty">${esc(tFn('sidebar.topics.empty'))}</div>`);
            return;
        }
        const html = tree.map(n => buildTopicNodeHtml(n, 0)).join('');
        setTreeHtml(html);
        attachHandlers();
    }

    function attachHandlers() {
        if (!_container) return;
        // Lazy-load verses when a topic node opens.
        _container.querySelectorAll('.topic-node').forEach(det => {
            det.addEventListener('toggle', async (e) => {
                if (!det.open) return;
                const versesEl = det.querySelector(':scope > .topic-body > .topic-verses');
                if (!versesEl || versesEl.dataset.loaded === '1') return;
                versesEl.dataset.loaded = '1';
                const tid = Number(det.dataset.topicId);
                versesEl.innerHTML = `<div class="topics-loading">${esc(tFn('sidebar.topics.loading'))}</div>`;
                try {
                    const detail = await fetchTopicDetail(tid);
                    const verses = (detail && detail.verses) || [];
                    if (!verses.length) {
                        versesEl.innerHTML = '';
                        return;
                    }
                    renderVerseRows(versesEl, verses, false);
                } catch (err) {
                    console.error(err);
                    versesEl.innerHTML = `<div class="topics-empty">${esc(tFn('sidebar.topics.loading'))}</div>`;
                }
            });
        });
        // Trigger chips: scroll to + flash every verse in the range that
        // surfaced this topic. Verses are in the current main view (it's why
        // the topic showed up), so we locate existing DOM nodes rather than
        // re-navigating.
        _container.querySelectorAll('.topic-trigger-chip').forEach(btn => {
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
                        setTimeout(() => el.classList.remove('topic-trigger-flash'), 1600);
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

    // ── MVB scope expand-to-chapter (mirrors commentaryModule) ──────
    async function expandMvbToChapter() {
        if (!_scope) return;
        if (_scope.source !== 'mvb-pc' && _scope.source !== 'mvb-mobile') return;
        const r = _scope.range;

        const md = window.mainData || [];
        let targetIdx = -1;
        let targetBlock = null;
        for (let i = 0; i < md.length; i++) {
            const b = md[i];
            if (!b || b.book !== r.book) continue;
            const hit = (b.verses || []).some(v => v.chapter >= r.ch_start && v.chapter <= r.ch_end);
            if (hit) { targetIdx = i; targetBlock = b; break; }
        }
        if (targetIdx >= 0 && !isMobileNow() && typeof window.toggleChapterExpand === 'function') {
            // Only toggle when the block isn't already showing the whole chapter.
            // The expand-bar attribute only exists for verse-isolated cards; chapter
            // queries land directly on a whole_chapter block with no bar — skip
            // there too (block.is_chapter true).
            const bar = document.querySelector(`.chapter-expand-bar[data-card-idx="${targetIdx}"]`);
            const expandedViaBar = bar && bar.getAttribute('data-expanded') === 'true';
            const alreadyChapter = !!(targetBlock && targetBlock.is_chapter);
            if (!expandedViaBar && !alreadyChapter) {
                _scope = { source: 'tray', range: _scope.range, markedVerses: [] };
                await window.toggleChapterExpand(targetIdx);
                return;
            }
        }

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
                ch_start: r.ch_start, vs_start: null,
                ch_end: r.ch_end, vs_end: null,
                version: r.version, label,
            },
            markedVerses: [],
        };
        loadAndRender();
    }

    // ── Main render entry ───────────────────────────────────────────
    async function loadAndRender() {
        if (!_scope || !_scope.range) {
            setScopeLabel('');
            setTreeHtml('');
            return;
        }
        const isMvbScope = (_scope.source === 'mvb-pc' || _scope.source === 'mvb-mobile');
        const scopeLabel = isMvbScope
            ? tFn('sidebar.topics.scope.mvb')
            : tFn('sidebar.topics.scope.tray', _scope.range.label);
        setScopeLabel(scopeLabel, { showExpand: isMvbScope });

        const key = scopeKey(_scope);
        let tree = _dataCache.get(key);
        if (!tree) {
            setTreeHtml(`<div class="topics-loading">${esc(tFn('sidebar.topics.loading'))}</div>`);
            try {
                tree = await fetchTopicsTree(_scope.range, _scope.markedVerses);
                _dataCache.set(key, tree);
            } catch (e) {
                console.error(e);
                setTreeHtml(`<div class="topics-empty">${esc(tFn('sidebar.topics.loading'))}</div>`);
                return;
            }
        }
        _hasBeenShown = true;
        renderTree(tree);
    }

    // ── Public API ──────────────────────────────────────────────────
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
            if (window.AppModuleHost) window.AppModuleHost.openModule('topics');
        } else if (window.AppSidebar) {
            if (typeof window.AppSidebar.openModule === 'function') window.AppSidebar.openModule('topics');
            else window.AppSidebar.ensureOpen();
        }
        await loadAndRender();
    }

    async function showForMarkedVerses(markedVerses) {
        if (!markedVerses || !markedVerses.length) return;
        const sorted = markedVerses.slice().sort((a, b) =>
            (a.chapter - b.chapter) || (a.verse - b.verse));
        const first = sorted[0], last = sorted[sorted.length - 1];
        const version = (window.versionSelect && String(window.versionSelect.value)) || '';
        const lang = (typeof window.versionLang === 'function') ? window.versionLang(version) : 'no';
        const bName = (typeof window.bookName === 'function') ? window.bookName(first.book, lang) : first.book;
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
            if (window.AppModuleHost) window.AppModuleHost.openModule('topics');
        } else if (window.AppSidebar) {
            if (typeof window.AppSidebar.openModule === 'function') window.AppSidebar.openModule('topics');
            else window.AppSidebar.ensureOpen();
        }
        await loadAndRender();
    }

    function rebindToMainBlock() {
        if (!_scope) return;
        const ns = scopeFromMainBlock();
        if (!ns) return;
        if (_scope.source === 'tray') {
            if (scopeKey(ns) === scopeKey(_scope)) return;
            _scope = ns;
            loadAndRender();
            return;
        }
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

    // ── Module def ──────────────────────────────────────────────────
    const moduleDef = {
        id: 'topics',
        title: 'Temaer',
        icon: '🎨',
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
            _hasBeenShown = false;
            _dataCache.clear();
            _topicDetailCache.clear();
            _previewCache.clear();
            if (_container) {
                const tree = _container.querySelector('.topics-tree');
                if (tree) tree.innerHTML = '';
                setScopeLabel('');
            }
        },
    };

    window.TopicsModule = { moduleDef, showForBlock, showForMarkedVerses };

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
