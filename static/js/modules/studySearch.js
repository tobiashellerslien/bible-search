// ── Study-data search results renderer ──
// Renders results for searches redirected into the study datasets
// (commentary / topics / leksikon) into the main results area. Reuses the
// shared verse-preview popup (RefPreviewPopup), the Topics-module + leksikon
// markup/CSS, and navigates via window.searchFromXref / CommentaryModule.openAtRef.
//
// Entry point: window.StudySearch.render(type, data, container, ctx)
//   type      : 'commentary' | 'topics' | 'leksikon'
//   data      : the /api/search/<type> response
//   container : DOM element to render into
//   ctx       : { query, version }
(function () {
    'use strict';

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, c => (
            { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
        ));
    }

    function tFn(key, ...args) {
        if (typeof window.t === 'function') return window.t(key, ...args);
        return key;
    }

    function getVersion(ctx) {
        return (ctx && ctx.version) || (window.versionSelect && String(window.versionSelect.value)) || '';
    }

    // ── Shared inline verse-preview (lazy) for topic verse rows ──
    const _previewCache = new Map();
    let _previewObserver = null;
    const _previewQueue = [];
    let _previewWorking = false;
    let _previewVersion = '';

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

    async function fetchVersePreview(refLabel) {
        const key = `${_previewVersion}|${refLabel}`;
        if (_previewCache.has(key)) return _previewCache.get(key);
        const params = new URLSearchParams();
        params.set('q', refLabel);
        if (_previewVersion) params.set('version', _previewVersion);
        let preview = '';
        try {
            const resp = await fetch('/api/search?' + params.toString());
            const dt = await resp.json();
            if (dt && dt.type === 'reference' && Array.isArray(dt.results)) {
                const first = dt.results[0];
                if (first && first.verses && first.verses.length) {
                    preview = first.verses.slice(0, 3).map(v => v.text).join(' ');
                    if (first.verses.length > 3) preview += ' …';
                }
            }
        } catch { /* leave empty */ }
        _previewCache.set(key, preview);
        return preview;
    }

    async function pumpPreviewQueue() {
        if (_previewWorking) return;
        _previewWorking = true;
        try {
            while (_previewQueue.length) {
                const it = _previewQueue.shift();
                if (!it.isConnected) continue;
                const preview = await fetchVersePreview(it.dataset.label);
                const previewEl = it.querySelector('.topic-verse-preview');
                if (previewEl) previewEl.textContent = preview || '';
            }
        } finally {
            _previewWorking = false;
        }
    }

    // ════════════════════════════════════════════════════════════════
    //  COMMENTARY  (commentary box → book box → entries; native <details>)
    // ════════════════════════════════════════════════════════════════
    function renderCommentarySnippet(raw) {
        if (!raw) return '';
        // Protect the FTS highlight tags, drop the stored anchor/markup tags
        // (keep their inner text) — including any tag fragment the snippet
        // truncated mid-attribute — collapse newlines, escape, then apply
        // markdown emphasis.
        let s = String(raw).replace(/<mark>/g, '@@M@@').replace(/<\/mark>/g, '@@/M@@');
        s = s.replace(/<a\b[^>]*>/gi, '').replace(/<\/a>/gi, '');
        s = s.replace(/<\/?[a-z][^>]*>/gi, '');          // other complete tags
        s = s.replace(/<[^>]*$/, '');                    // dangling open tag at the cut
        s = s.replace(/^[^<>]{0,40}">/, '');             // dangling tag tail at the start
        s = s.replace(/\s*\n+\s*/g, ' ').trim();
        s = esc(s);
        s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/_([^_\n]+)_/g, '<em>$1</em>');
        s = s.replace(/@@M@@/g, '<mark>').replace(/@@\/M@@/g, '</mark>');
        return s;
    }

    function renderCommentary(data, container) {
        const onlyComm = data.results.length === 1;
        const parts = ['<div class="study-commentary">'];
        for (const grp of data.results) {
            const c = grp.commentary || {};
            const cname = c.name || c.short_name || c.code || '';
            const total = grp.books.reduce((a, b) => a + b.entries.length, 0);
            const onlyBook = grp.books.length === 1;
            parts.push(`<details class="study-comm-group"${onlyComm ? ' open' : ''}>`);
            parts.push(`<summary class="study-comm-name"><span>${esc(cname)}`
                + `<span class="book-group-count">(${total})</span></span></summary>`);
            parts.push(`<div class="study-comm-books">`);
            if (grp.books.length > 1) {
                parts.push(`<button type="button" class="study-comm-expand-all">`
                    + `${esc(tFn('searchResults.expandAll'))}</button>`);
            }
            for (const bk of grp.books) {
                parts.push(`<details class="study-comm-book"${onlyBook ? ' open' : ''}>`);
                parts.push(`<summary><span>${esc(bk.name)}`
                    + `<span class="book-group-count">(${bk.entries.length})</span></span></summary>`);
                parts.push(`<div class="study-comm-items">`);
                for (const e of bk.entries) {
                    const tag = e.kind === 'book_intro' ? ' ' + tFn('study.commentary.introTag')
                        : e.kind === 'overview' ? ' ' + tFn('study.commentary.overviewTag')
                        : '';
                    parts.push(
                        `<button type="button" class="study-comm-entry"`
                        + ` data-book="${esc(bk.book)}" data-chapter="${e.chapter}"`
                        + ` data-vs="${e.verse_start == null ? '' : e.verse_start}"`
                        + ` data-ve="${e.verse_end == null ? '' : e.verse_end}"`
                        + ` data-intro="${e.is_intro ? '1' : '0'}"`
                        + ` data-code="${esc(c.code || '')}" data-label="${esc(e.ref_label)}">`
                        + `<span class="study-comm-ref">${esc(e.ref_label)}${esc(tag)}</span>`
                        + `<span class="study-comm-snippet">${renderCommentarySnippet(e.snippet)}</span>`
                        + `</button>`
                    );
                }
                parts.push(`</div></details>`); // items, book
            }
            parts.push(`</div></details>`); // books, comm-group
        }
        parts.push('</div>');
        container.innerHTML = parts.join('');

        // Per-commentary expand/collapse-all of its book boxes.
        container.querySelectorAll('.study-comm-group').forEach(group => {
            const btn = group.querySelector(':scope > .study-comm-books > .study-comm-expand-all');
            if (!btn) return;
            const books = () => group.querySelectorAll(':scope > .study-comm-books > .study-comm-book');
            const sync = () => {
                const anyClosed = Array.from(books()).some(b => !b.open);
                btn.textContent = anyClosed ? tFn('searchResults.expandAll') : tFn('searchResults.collapseAll');
            };
            btn.addEventListener('click', () => {
                const anyClosed = Array.from(books()).some(b => !b.open);
                books().forEach(b => { b.open = anyClosed; });
                sync();
            });
            books().forEach(b => b.addEventListener('toggle', sync));
            sync();
        });

        container.querySelectorAll('.study-comm-entry').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!window.CommentaryModule || typeof window.CommentaryModule.openAtRef !== 'function') {
                    if (typeof window.searchFromXref === 'function') window.searchFromXref(btn.dataset.label);
                    return;
                }
                const vs = btn.dataset.vs === '' ? null : Number(btn.dataset.vs);
                const ve = btn.dataset.ve === '' ? null : Number(btn.dataset.ve);
                window.CommentaryModule.openAtRef({
                    book: btn.dataset.book,
                    chapter: Number(btn.dataset.chapter),
                    verse_start: vs,
                    verse_end: ve,
                    is_intro: btn.dataset.intro === '1',
                    commentaryCode: btn.dataset.code,
                    label: btn.dataset.label,
                });
            });
        });
    }

    // ════════════════════════════════════════════════════════════════
    //  LEKSIKON
    // ════════════════════════════════════════════════════════════════
    const DICT_ORDER = ['easton', 'smith', 'hitchcock'];

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

    function renderLeksikonBody(body) {
        if (!body) return '';
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

    function sortedDictEntries(entries) {
        return entries.slice().sort((a, b) => {
            const ia = DICT_ORDER.indexOf(a.dictionary_code);
            const ib = DICT_ORDER.indexOf(b.dictionary_code);
            return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
        });
    }

    function renderLeksikon(data, container, ctx) {
        const parts = ['<div class="study-leksikon">'];
        data.results.forEach((g, gi) => {
            const entries = sortedDictEntries(g.entries);
            const sourceNames = entries.map(e => e.dictionary_short_name || e.dictionary_code).join(' · ');
            parts.push(`<details class="leksikon-box study-leksikon-box" data-gi="${gi}">`);
            parts.push(`<summary>`
                + `<span class="leksikon-headword">${esc(prettyTitle(g.title || g.headword))}</span>`
                + `<span class="study-leksikon-sources">${esc(sourceNames)}</span>`
                + `</summary>`);
            const tabs = entries.map((e, i) =>
                `<button type="button" class="leksikon-tab${i === 0 ? ' active' : ''}" data-idx="${i}" role="tab">`
                + `${esc(e.dictionary_short_name || e.dictionary_code)}</button>`
            ).join('');
            parts.push(`<div class="leksikon-box-body">`);
            if (entries.length > 1) parts.push(`<div class="leksikon-tabs" role="tablist">${tabs}</div>`);
            parts.push(`<div class="study-leksikon-content">${renderLeksikonBody(entries[0].body)}</div>`);
            parts.push(`</div></details>`);
        });
        parts.push('</div>');
        container.innerHTML = parts.join('');

        container.querySelectorAll('.study-leksikon-box').forEach((box, gi) => {
            const entries = sortedDictEntries(data.results[gi].entries);
            const contentEl = box.querySelector('.study-leksikon-content');
            box.querySelectorAll('.leksikon-tab').forEach(tab => {
                tab.addEventListener('click', (ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    const idx = Number(tab.dataset.idx);
                    box.querySelectorAll('.leksikon-tab').forEach(t => t.classList.toggle('active', t === tab));
                    contentEl.innerHTML = renderLeksikonBody(entries[idx].body);
                    bindLeksikonRefs(contentEl, ctx);
                });
            });
            bindLeksikonRefs(contentEl, ctx);
        });
    }

    function bindLeksikonRefs(scopeEl, ctx) {
        if (!scopeEl || !window.RefPreviewPopup) return;
        window.RefPreviewPopup.bind(scopeEl, 'a.leksikon-ref', {
            getVersion: () => getVersion(ctx),
            onOpen: (ref, label) => {
                if (typeof window.searchFromXref === 'function') window.searchFromXref(label);
            },
        });
    }

    // ════════════════════════════════════════════════════════════════
    //  TOPICS  (mirrors the Topics module's look & behaviour)
    // ════════════════════════════════════════════════════════════════
    const _topicDetailCache = new Map();
    const VERSE_PREVIEW_INITIAL = 8;
    const SMALL_SUBTOPIC = 2;     // hide subtopics with fewer verses behind "show all"
    const SMALL_SUBTOPIC_MIN = 10; // …only when there are this many children
    let _topicCtx = null;
    let _topicRoot = null;

    async function fetchTopicDetail(id) {
        if (_topicDetailCache.has(id)) return _topicDetailCache.get(id);
        const resp = await fetch('/api/topic/' + id);
        if (!resp.ok) throw new Error('topic detail fetch failed: ' + resp.status);
        const dt = await resp.json();
        _topicDetailCache.set(id, dt);
        return dt;
    }

    function topicNodeHtml(node, depth, open) {
        const vc = node.verse_count != null ? node.verse_count
            : (node.verses ? node.verses.length : 0);
        const count = `<span class="topic-count">${vc}</span>`;
        const childN = node.child_count || 0;
        const childBadge = childN > 0
            ? `<span class="topic-parent-badge">↳ ${childN}</span>` : '';
        // Ancestor breadcrumb lives *inside* the box, stacked above the name
        // (only for matched/standalone topics — children never carry ancestors).
        const crumb = crumbHtml(node.ancestors);
        return `<details class="topic-node" data-topic-id="${node.id}" data-depth="${depth}" data-loaded="0"${open ? ' open' : ''}>`
            + `<summary>`
            + `<span class="study-topic-headcol">`
            + crumb
            + `<span class="topic-name">${esc(node.name)}</span>`
            + `</span>`
            + count + childBadge
            + `</summary>`
            + `<div class="topic-body">`
            + `<div class="study-topic-actions"></div>`
            + `<div class="topic-verses xr-panel-inner" data-loaded="0"></div>`
            + `<div class="topic-children"></div>`
            + `</div>`
            + `</details>`;
    }

    function crumbHtml(ancestors) {
        if (!ancestors || !ancestors.length) return '';
        const links = ancestors.map(a =>
            `<a href="#" class="study-crumb" data-id="${a.id}">${esc(a.name)}</a>`
        ).join('<span class="study-crumb-sep"> › </span>');
        return `<div class="study-topic-crumbs">${links}</div>`;
    }

    function verseRowsHtml(verses, showAll) {
        const limit = showAll ? verses.length : Math.min(VERSE_PREVIEW_INITIAL, verses.length);
        const visible = verses.slice(0, limit);
        const remaining = verses.length - limit;
        let html = visible.map(v => {
            const label = v.ref_label || '';
            return `<div class="xr-item topic-verse-item" data-label="${esc(label)}">`
                + `<span class="xr-ref">${esc(label)}</span>`
                + `<span class="xr-preview topic-verse-preview"></span>`
                + `</div>`;
        }).join('');
        if (remaining > 0) {
            html += `<button type="button" class="topics-show-all" data-show-all="1">`
                + esc(tFn('sidebar.topics.showAll', remaining)) + `</button>`;
        }
        return html;
    }

    function renderVerses(versesEl, verses, showAll) {
        versesEl.innerHTML = verseRowsHtml(verses, showAll);
        const observer = ensurePreviewObserver();
        versesEl.querySelectorAll('.topic-verse-item').forEach(it => {
            it.addEventListener('click', () => {
                if (typeof window.searchFromXref === 'function') window.searchFromXref(it.dataset.label);
            });
            observer.observe(it);
        });
        const showBtn = versesEl.querySelector('[data-show-all]');
        if (showBtn) showBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            renderVerses(versesEl, verses, true);
        });
    }

    function renderChildren(childrenEl, children, depth, showSmall) {
        let visible = children, hidden = [];
        if (!showSmall && children.length > SMALL_SUBTOPIC_MIN) {
            visible = children.filter(c => (c.verse_count || 0) >= SMALL_SUBTOPIC);
            hidden = children.filter(c => (c.verse_count || 0) < SMALL_SUBTOPIC);
            if (!visible.length) { visible = children; hidden = []; }
        }
        let html = visible.map(c => topicNodeHtml(c, depth)).join('');
        if (hidden.length) {
            html += `<button type="button" class="topics-show-small" data-show-small="1">`
                + esc(tFn('sidebar.topics.showAllSubtopics', hidden.length)) + `</button>`;
        }
        childrenEl.innerHTML = html;
        wireTopicNodes(childrenEl);
        const btn = childrenEl.querySelector('[data-show-small]');
        if (btn) btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            renderChildren(childrenEl, children, depth, true);
        });
    }

    async function loadTopicNode(det) {
        if (!det || det.dataset.loaded === '1') return;
        det.dataset.loaded = '1';
        const id = Number(det.dataset.topicId);
        const depth = Number(det.dataset.depth || 0);
        let detail;
        try {
            detail = await fetchTopicDetail(id);
        } catch (e) {
            det.dataset.loaded = '0';
            return;
        }
        const body = det.querySelector(':scope > .topic-body');
        if (!body) return;
        const actionsEl = body.querySelector(':scope > .study-topic-actions');
        const versesEl = body.querySelector(':scope > .topic-verses');
        const childrenEl = body.querySelector(':scope > .topic-children');
        const verses = (detail && detail.verses) || [];
        if (versesEl && verses.length) renderVerses(versesEl, verses, false);
        // "Åpne alle" only makes sense with more than one verse.
        if (actionsEl && verses.length > 1) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'study-open-all';
            btn.textContent = tFn('study.openAll');
            btn.title = tFn('study.openAllTitle');
            btn.addEventListener('click', (ev) => {
                ev.stopPropagation();
                const q = verses.map(v => v.ref_label).filter(Boolean).join('; ');
                if (q && typeof window.searchFromXref === 'function') window.searchFromXref(q);
            });
            actionsEl.appendChild(btn);
        }
        const children = (detail && detail.children) || [];
        if (childrenEl && children.length) renderChildren(childrenEl, children, depth + 1, false);
    }

    function wireTopicNodes(scopeEl) {
        scopeEl.querySelectorAll(':scope > .topic-node').forEach(det => {
            if (det.dataset.wired === '1') return;
            det.dataset.wired = '1';
            det.addEventListener('toggle', () => { if (det.open) loadTopicNode(det); });
        });
        scopeEl.querySelectorAll('.study-crumb').forEach(a => {
            if (a.dataset.wired === '1') return;
            a.dataset.wired = '1';
            a.addEventListener('click', (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                showTopic(Number(a.dataset.id), { push: true });
            });
        });
    }

    function renderTopics(data, container, ctx) {
        _topicCtx = ctx;
        _topicRoot = container;
        _previewVersion = getVersion(ctx);
        const html = data.results.map(r => topicNodeHtml(r, 0, false)).join('');
        container.innerHTML = `<div class="study-topics">${html}</div>`;
        const topicsWrap = container.querySelector('.study-topics');
        wireTopicNodes(topicsWrap);
    }

    // Open a single topic alone in the study view (breadcrumb navigation).
    async function showTopic(topicId, opts) {
        opts = opts || {};
        if (!_topicRoot || !_topicRoot.isConnected) {
            if (typeof window.buildStudyScaffold === 'function') {
                _topicRoot = window.buildStudyScaffold('topics');
            }
        }
        if (!_topicRoot) return;
        _topicRoot.innerHTML = `<div class="study-loading">${esc(tFn('searchResults.studyLoading'))}</div>`;
        let detail;
        try {
            detail = await fetchTopicDetail(topicId);
        } catch (e) {
            _topicRoot.innerHTML = '';
            return;
        }
        const node = {
            id: detail.id, name: detail.name, ancestors: detail.ancestors,
            verse_count: detail.verse_count, child_count: detail.child_count,
        };
        _topicRoot.innerHTML = `<div class="study-topics study-topics-single">${topicNodeHtml(node, 0, true)}</div>`;
        const wrap = _topicRoot.querySelector('.study-topics');
        wireTopicNodes(wrap);
        const det = wrap.querySelector('.topic-node');
        if (det) loadTopicNode(det);
        if (opts.push !== false) {
            try {
                history.pushState({ studyNav: {
                    kind: 'topic', id: topicId, type: 'topics',
                    q: _topicCtx && _topicCtx.query, version: _topicCtx && _topicCtx.version,
                } }, '', location.href);
            } catch { /* ignore */ }
        }
    }

    // Restore a single-topic view from a popstate (no new history entry).
    function restoreTopic(id, ctx) {
        _topicCtx = ctx || _topicCtx;
        _previewVersion = getVersion(_topicCtx);
        if (typeof window.buildStudyScaffold === 'function') {
            _topicRoot = window.buildStudyScaffold('topics', ctx && ctx.query);
        }
        showTopic(id, { push: false });
    }

    // ════════════════════════════════════════════════════════════════
    function render(type, data, container, ctx) {
        _previewVersion = getVersion(ctx);
        if (!data || !Array.isArray(data.results)) { container.innerHTML = ''; return; }
        if (type === 'commentary') return renderCommentary(data, container, ctx);
        if (type === 'leksikon') return renderLeksikon(data, container, ctx);
        if (type === 'topics') return renderTopics(data, container, ctx);
        container.innerHTML = '';
    }

    window.StudySearch = { render, showTopic, restoreTopic };
})();
