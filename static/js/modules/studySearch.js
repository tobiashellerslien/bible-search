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
            const hasExpandAll = grp.books.length > 1;
            parts.push(`<details class="study-comm-group"${onlyComm ? ' open' : ''}>`);
            parts.push(`<summary class="study-comm-name"><span>${esc(cname)}`
                + `<span class="book-group-count">(${total})</span></span>`
                + (hasExpandAll ? `<button type="button" class="study-comm-expand-all">${esc(tFn('searchResults.expandAll'))}</button>` : '')
                + `</summary>`);
            parts.push(`<div class="study-comm-books">`);
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
            const btn = group.querySelector(':scope > summary > .study-comm-expand-all');
            if (!btn) return;
            const books = () => group.querySelectorAll(':scope > .study-comm-books > .study-comm-book');
            const sync = () => {
                const anyClosed = Array.from(books()).some(b => !b.open);
                btn.textContent = anyClosed ? tFn('searchResults.expandAll') : tFn('searchResults.collapseAll');
            };
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                const anyClosed = Array.from(books()).some(b => !b.open);
                if (anyClosed) group.open = true;
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
    //  TOPICS  (subject boxes → subgroups via shared TopicSubgroups)
    // ════════════════════════════════════════════════════════════════
    const _topicDetailCache = new Map();
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

    function topicNumsHtml(node) {
        const vc = node.verse_count != null ? node.verse_count : 0;
        const sgN = node.subgroup_count || (node.subgroups ? node.subgroups.length : 0);
        let h = `<span class="topic-num topic-num--vers" title="${esc(tFn('sidebar.topics.versesCountTitle'))}">`
            + esc(tFn('sidebar.topics.versesCount', vc)) + `</span>`;
        if (sgN > 0) {
            h += `<span class="topic-num topic-num--sg" title="${esc(tFn('sidebar.topics.subgroupCountTitle'))}">↳ ${sgN}</span>`;
        }
        return `<span class="topic-nums">${h}</span>`;
    }

    function topicNodeHtml(node, open) {
        return `<details class="topic-node" data-topic-id="${node.id}" data-loaded="0"${open ? ' open' : ''}>`
            + `<summary>`
            + `<span class="topic-name">${esc(node.name)}</span>`
            + topicNumsHtml(node)
            + `</summary>`
            + `<div class="topic-body">`
            + `<div class="topic-subgroups"></div>`
            + `</div>`
            + `</details>`;
    }

    function subgroupCtx() {
        return {
            version: getVersion(_topicCtx),
            triggered: null,
            book: null,
            onVerseClick: (label) => { if (typeof window.searchFromXref === 'function') window.searchFromXref(label); },
            onSeeAlso: (id, sgid) => openSeeAlso(id, sgid),
        };
    }

    // Nearest scrollable ancestor, so "Se også" → Back can restore scroll pos.
    function scrollParentOf(el) {
        let n = el && el.parentElement;
        while (n) {
            const oy = getComputedStyle(n).overflowY;
            if ((oy === 'auto' || oy === 'scroll') && n.scrollHeight > n.clientHeight + 2) return n;
            n = n.parentElement;
        }
        return null;
    }

    // "Se også" inside study-search results: stack a single-topic view on top of
    // the current view (results list or a previous topic) with a Back button that
    // restores the previous view and scroll position — mirrors the Topics module.
    async function openSeeAlso(topicId, subgroupId) {
        if (!_topicRoot || !_topicRoot.isConnected) {
            return showTopic(topicId, { push: true, subgroupId });
        }
        let detail;
        try { detail = await fetchTopicDetail(topicId); }
        catch (e) { return; }
        const sp = scrollParentOf(_topicRoot);
        const savedTop = sp ? sp.scrollTop : window.scrollY;
        const prevChildren = Array.from(_topicRoot.children);
        const prevDisplay = prevChildren.map(el => el.style.display);
        prevChildren.forEach(el => { el.style.display = 'none'; });

        const view = document.createElement('div');
        view.className = 'study-seealso-view';
        view.innerHTML =
            `<button type="button" class="topics-back">${esc(tFn('sidebar.topics.back'))}</button>`
            + `<div class="study-topics study-topics-single">${topicNodeHtml(detail, true)}</div>`;
        _topicRoot.appendChild(view);

        const wrap = view.querySelector('.study-topics');
        wireTopicNodes(wrap);
        const det = wrap.querySelector('.topic-node');
        if (det) {
            await loadTopicNode(det);
            if (subgroupId != null && window.TopicSubgroups && window.TopicSubgroups.focusSubgroup) {
                const sgEl = det.querySelector('.topic-subgroups');
                if (sgEl) window.TopicSubgroups.focusSubgroup(sgEl, subgroupId);
            }
        }
        const back = view.querySelector('.topics-back');
        if (back) back.addEventListener('click', () => {
            view.remove();
            prevChildren.forEach((el, i) => { el.style.display = prevDisplay[i] || ''; });
            if (sp) sp.scrollTop = savedTop; else window.scrollTo(0, savedTop);
        });
    }

    async function loadTopicNode(det) {
        if (!det || det.dataset.loaded === '1') return;
        det.dataset.loaded = '1';
        const id = Number(det.dataset.topicId);
        let detail;
        try {
            detail = await fetchTopicDetail(id);
        } catch (e) {
            det.dataset.loaded = '0';
            return;
        }
        const body = det.querySelector(':scope > .topic-body');
        if (!body) return;
        const sgEl = body.querySelector(':scope > .topic-subgroups');
        const subgroups = (detail && detail.subgroups) || [];
        if (sgEl) window.TopicSubgroups.renderInto(sgEl, subgroups, subgroupCtx());
    }

    function wireTopicNodes(scopeEl) {
        scopeEl.querySelectorAll(':scope > .topic-node').forEach(det => {
            if (det.dataset.wired === '1') return;
            det.dataset.wired = '1';
            det.addEventListener('toggle', () => { if (det.open) loadTopicNode(det); });
        });
    }

    function renderTopics(data, container, ctx) {
        _topicCtx = ctx;
        _topicRoot = container;
        const html = data.results.map(r => topicNodeHtml(r, false)).join('');
        container.innerHTML = `<div class="study-topics">${html}</div>`;
        const topicsWrap = container.querySelector('.study-topics');
        wireTopicNodes(topicsWrap);
    }

    // Open a single topic alone in the study view (from a "Se også" link).
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
        _topicRoot.innerHTML = `<div class="study-topics study-topics-single">${topicNodeHtml(detail, true)}</div>`;
        const wrap = _topicRoot.querySelector('.study-topics');
        wireTopicNodes(wrap);
        const det = wrap.querySelector('.topic-node');
        if (det) {
            await loadTopicNode(det);
            // "Se også" can target a specific subgroup — open + scroll to it.
            if (opts.subgroupId != null && window.TopicSubgroups && window.TopicSubgroups.focusSubgroup) {
                const sgEl = det.querySelector('.topic-subgroups');
                if (sgEl) window.TopicSubgroups.focusSubgroup(sgEl, opts.subgroupId);
            }
        }
        if (opts.push !== false) {
            try {
                history.pushState({ studyNav: {
                    kind: 'topic', id: topicId, type: 'topics', subgroupId: opts.subgroupId,
                    q: _topicCtx && _topicCtx.query, version: _topicCtx && _topicCtx.version,
                } }, '', location.href);
            } catch { /* ignore */ }
        }
    }

    // Restore a single-topic view from a popstate (no new history entry).
    function restoreTopic(id, ctx) {
        _topicCtx = ctx || _topicCtx;
        if (typeof window.buildStudyScaffold === 'function') {
            _topicRoot = window.buildStudyScaffold('topics', ctx && ctx.query);
        }
        showTopic(id, { push: false, subgroupId: ctx && ctx.subgroupId });
    }

    // ════════════════════════════════════════════════════════════════
    function render(type, data, container, ctx) {
        if (!data || !Array.isArray(data.results)) { container.innerHTML = ''; return; }
        if (type === 'commentary') return renderCommentary(data, container, ctx);
        if (type === 'leksikon') return renderLeksikon(data, container, ctx);
        if (type === 'topics') return renderTopics(data, container, ctx);
        container.innerHTML = '';
    }

    window.StudySearch = { render, showTopic, restoreTopic };
})();
