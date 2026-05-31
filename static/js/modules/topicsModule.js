// ── Topics module (PC sidebar + mobile module host) ──
// Surfaces Nave's topics that overlap the in-view passage (study tray) or the
// marked verses (MVB). A topic (subject) is shown as a box; opening it reveals
// its *subgroups* (labelled groups of refs) via the shared TopicSubgroups
// renderer — triggered subgroups float to the top with accent styling and chips
// back to the verse(s) that surfaced them. Subgroups are not standalone topics.
(function () {
    let _container = null;
    let _unsubMainBlock = null;
    let _ctx = null;

    let _scope = null;                  // {source, range, markedVerses}
    const _dataCache = new Map();       // scopeKey -> topics[]
    const _topicDetailCache = new Map();// topic_id -> /api/topic/<id> payload
    let _hasBeenShown = false;
    let _isMobile = false;

    let _currentTopics = null;          // last rendered topics[] (subjects)

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
        if (block.is_chapter && ch_start === ch_end) label = window.fmtVerseRef(block.book, bName, ch_start);
        else if (ch_start === ch_end) label = window.fmtVerseRef(block.book, bName, ch_start, vs_start, vs_end);
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

    // ── Scope label ──────────────────────────────────────────────────
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

    // ── Trigger-chip jump: scroll to + flash the verse(s) in the main view ──
    // The verses are in the current main view (it's why the topic showed up), so
    // we locate the existing DOM nodes rather than re-navigating.
    function jumpToTrigger(book, chapter, vsStart, vsEnd) {
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
            const bName = (typeof window.bookName === 'function') ? window.bookName(book, lang) : book;
            const label = window.fmtVerseRef(book, bName, chapter, vsStart, vsEnd);
            if (typeof window.searchFromXref === 'function') window.searchFromXref(label);
        }
    }

    function subgroupCtx() {
        return {
            version: _scope && _scope.range ? _scope.range.version : '',
            book: _scope && _scope.range ? _scope.range.book : null,
            onTriggerJump: jumpToTrigger,
            onVerseClick: (label) => { if (typeof window.searchFromXref === 'function') window.searchFromXref(label); },
            onSeeAlso: (id, sgid) => openSeeAlso(id, sgid),
        };
    }

    // Nearest scrollable ancestor, so "Se også" → Back can restore scroll pos.
    function scrollParent(el) {
        let n = el && el.parentElement;
        while (n) {
            const oy = getComputedStyle(n).overflowY;
            if ((oy === 'auto' || oy === 'scroll') && n.scrollHeight > n.clientHeight + 2) return n;
            n = n.parentElement;
        }
        return null;
    }

    // ── Render the topic list (subjects) ─────────────────────────────
    // Three descriptive numbers: ref (passage refs that hit this topic — the
    // relevance), vers (total verses in the topic — the size), and ↳ N subgroups.
    function topicNumsHtml(topic) {
        const trig = topic.triggered_count || 0;
        const sgN = topic.subgroup_count
            || (topic.subgroups ? topic.subgroups.length : 0);
        const parts = [];
        if (trig > 0) {
            parts.push(`<span class="topic-num topic-num--ref" title="${esc(tFn('sidebar.topics.refCountTitle'))}">`
                + esc(tFn('sidebar.topics.refCount', trig)) + `</span>`);
        }
        parts.push(`<span class="topic-num topic-num--vers" title="${esc(tFn('sidebar.topics.versesCountTitle'))}">`
            + esc(tFn('sidebar.topics.versesCount', topic.verse_count || 0)) + `</span>`);
        if (sgN > 0) {
            parts.push(`<span class="topic-num topic-num--sg" title="${esc(tFn('sidebar.topics.subgroupCountTitle'))}">`
                + `↳ ${sgN}</span>`);
        }
        return `<span class="topic-nums">${parts.join('')}</span>`;
    }

    function topicNodeHtml(topic) {
        return `<details class="topic-node" data-topic-id="${topic.id}">`
            + `<summary>`
            + `<span class="topic-name">${esc(topic.name)}</span>`
            + topicNumsHtml(topic)
            + `</summary>`
            + `<div class="topic-body" data-loaded="0"></div>`
            + `</details>`;
    }

    function renderTree(topics) {
        _currentTopics = topics;
        if (!topics || !topics.length) {
            setTreeHtml(`<div class="topics-empty">${esc(tFn('sidebar.topics.empty'))}</div>`);
            return;
        }
        const openIds = captureOpenTopicIds();
        setTreeHtml(`<div class="topics-list">${topics.map(topicNodeHtml).join('')}</div>`);
        restoreOpenTopicIds(openIds);
        attachHandlers();
    }

    function captureOpenTopicIds() {
        if (!_container) return new Set();
        const ids = new Set();
        _container.querySelectorAll('.topic-node[open]').forEach(el => {
            const tid = Number(el.dataset.topicId);
            if (tid) ids.add(tid);
        });
        return ids;
    }

    function restoreOpenTopicIds(ids) {
        if (!_container || !ids || !ids.size) return;
        ids.forEach(tid => {
            const el = _container.querySelector(`.topic-node[data-topic-id="${tid}"]`);
            if (el) el.open = true;
        });
    }

    function triggeredMapFor(topic) {
        const m = new Map();
        for (const sg of (topic.triggered_subgroups || [])) {
            m.set(sg.id, sg.triggered_by || []);
        }
        return m;
    }

    async function loadTopicBody(det) {
        const body = det.querySelector(':scope > .topic-body');
        const tid = Number(det.dataset.topicId);
        if (!body || body.dataset.loaded === '1') return;
        body.dataset.loaded = '1';
        const topic = (_currentTopics || []).find(t => t.id === tid);
        try {
            const detail = await fetchTopicDetail(tid);
            const ctx = subgroupCtx();
            ctx.triggered = topic ? triggeredMapFor(topic) : null;
            window.TopicSubgroups.renderInto(body, detail.subgroups || [], ctx);
        } catch (err) {
            console.error(err);
            body.innerHTML = '';
            body.dataset.loaded = '0';
        }
    }

    function attachHandlers() {
        if (!_container) return;
        _container.querySelectorAll('.topic-node').forEach(det => {
            const summary = det.querySelector(':scope > summary');
            const body = det.querySelector(':scope > .topic-body');
            // Render subgroups *before* the panel animates open so content is
            // already in place (avoids a flicker / double layout shift).
            if (summary) {
                summary.addEventListener('click', async (e) => {
                    if (det.open || !body || body.dataset.loaded === '1') return;
                    e.preventDefault();
                    await loadTopicBody(det);
                    det.open = true;
                });
            }
            det.addEventListener('toggle', () => { if (det.open) loadTopicBody(det); });
        });
    }

    // ── "Se også" cross-reference: show one topic alone, with a back link ──
    // The list is hidden (not destroyed) and its scroll position saved, so Back
    // returns the user exactly where they were — open topics and all.
    async function openSeeAlso(topicId, subgroupId) {
        let detail;
        try {
            detail = await fetchTopicDetail(topicId);
        } catch (e) {
            return;
        }
        const treeEl = _container && _container.querySelector('.topics-tree');
        if (!treeEl) return;
        const listEl = treeEl.querySelector('.topics-list');
        const sp = scrollParent(treeEl);
        const restore = { listEl, sp, top: sp ? sp.scrollTop : 0 };
        if (listEl) listEl.style.display = 'none';
        const prev = treeEl.querySelector('.topics-seealso-view');
        if (prev) prev.remove();

        const view = document.createElement('div');
        view.className = 'topics-seealso-view';
        view.innerHTML =
            `<button type="button" class="topics-back">${esc(tFn('sidebar.topics.back'))}</button>`
            + `<div class="topic-node topic-node--single" data-topic-id="${detail.id}">`
            + `<div class="topic-single-head"><span class="topic-name">${esc(detail.name)}</span>`
            + topicNumsHtml(detail) + `</div>`
            + `<div class="topic-body"></div></div>`;
        treeEl.appendChild(view);

        const backBtn = view.querySelector('.topics-back');
        if (backBtn) backBtn.addEventListener('click', () => {
            view.remove();
            if (restore.listEl) restore.listEl.style.display = '';
            if (restore.sp) restore.sp.scrollTop = restore.top;
        });

        const body = view.querySelector('.topic-node--single > .topic-body');
        const ctx = subgroupCtx();
        ctx.triggered = null;
        window.TopicSubgroups.renderInto(body, detail.subgroups || [], ctx);
        if (subgroupId != null && window.TopicSubgroups.focusSubgroup) {
            window.TopicSubgroups.focusSubgroup(body, subgroupId);
        }
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
            const bar = document.querySelector(`.chapter-expand-bar[data-card-idx="${targetIdx}"]`);
            const expandedViaBar = bar && bar.getAttribute('data-expanded') === 'true';
            const alreadyChapter = !!(targetBlock && targetBlock.is_chapter);
            if (!expandedViaBar && !alreadyChapter) {
                _scope = { source: 'tray', range: _scope.range, markedVerses: [] };
                await window.toggleChapterExpand(targetIdx);
                return;
            }
        }

        const lang = (typeof window.versionLang === 'function') ? window.versionLang(r.version) : 'no';
        const bName = (typeof window.bookName === 'function') ? window.bookName(r.book, lang) : r.book;
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
        let topics = _dataCache.get(key);
        if (!topics) {
            setTreeHtml(`<div class="topics-loading">${esc(tFn('sidebar.topics.loading'))}</div>`);
            try {
                topics = await fetchTopicsTree(_scope.range, _scope.markedVerses);
                _dataCache.set(key, topics);
            } catch (e) {
                console.error(e);
                setTreeHtml(`<div class="topics-empty">${esc(tFn('sidebar.topics.empty'))}</div>`);
                return;
            }
        }
        _hasBeenShown = true;
        renderTree(topics);
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
        const label = (first.chapter === last.chapter)
            ? window.fmtVerseRef(first.book, bName, first.chapter, first.verse, last.verse)
            : `${bName} ${first.chapter}:${first.verse}-${last.chapter}:${last.verse}`;
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
        const ns = scopeFromMainBlock();
        if (!ns) {
            // Entered a search/empty view — drop stale topics, stay mounted empty.
            if (_scope) { _scope = null; setScopeLabel(''); renderTree(null); }
            return;
        }
        if (!_scope) { _scope = ns; loadAndRender(); return; }
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
        icon: '<img src="/static/images/themes.png" alt="" class="sidebar-module-icon-img">',
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
            _currentTopics = null;
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
