// ── Shared topic-subgroup renderer ──
// A Nave's topic (subject) is a flat list of *subgroups* — each a labelled group
// of scripture references (e.g. "Lineage of", "Marriage of"). Subgroups are NOT
// standalone topics; they only exist under their parent subject. This module
// renders a subject's subgroups for BOTH the Topics sidebar module and the
// study-search results, so the two stay in sync.
//
// "Triggered" subgroups (matched by the in-view passage) float to the top, get
// accent styling, open by default, and show trigger-chips that jump+highlight
// the verse in the main view. Verse previews load lazily (IntersectionObserver),
// reusing the cross-reference visual pattern (.xr-item / .xr-ref / .xr-preview).
//
// Entry point: window.TopicSubgroups.renderInto(container, subgroups, ctx)
//   subgroups : detail.subgroups from /api/topic/<id>
//   ctx : {
//     version,                              // selected Bible version (labels + preview)
//     triggered,    // Map<subgroupId, [{chapter,verse_start,verse_end}]> | null
//     book,         // passage book usfm, for trigger-chip labels (when triggered)
//     onTriggerJump(book, ch, vsStart, vsEnd),  // chip click (scroll+flash | navigate)
//     onVerseClick(label),                  // verse-row click (navigate)
//     onSeeAlso(topicId),                   // "Se også" link click (open that topic)
//   }
(function () {
    'use strict';

    const SUBGROUP_PREVIEW_INITIAL = 3;   // 1–3 preview verses, then "Vis alle"

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, c => (
            { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
        ));
    }
    function tFn(key, ...args) {
        return (typeof window.t === 'function') ? window.t(key, ...args) : key;
    }

    // ── Lazy verse-preview (shared cache + single observer) ──
    const _previewCache = new Map();
    let _observer = null;
    const _queue = [];
    let _working = false;
    let _curVersion = '';

    function ensureObserver() {
        if (_observer) return _observer;
        _observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                const it = entry.target;
                _observer.unobserve(it);
                if (it.dataset.previewQueued === '1') continue;
                it.dataset.previewQueued = '1';
                _queue.push(it);
                pump();
            }
        }, { rootMargin: '120px 0px' });
        return _observer;
    }

    async function fetchPreview(label, version) {
        const key = `${version || ''}|${label}`;
        if (_previewCache.has(key)) return _previewCache.get(key);
        const params = new URLSearchParams();
        params.set('q', label);
        if (version) params.set('version', version);
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

    async function pump() {
        if (_working) return;
        _working = true;
        try {
            while (_queue.length) {
                const it = _queue.shift();
                if (!it.isConnected) continue;
                const preview = await fetchPreview(it.dataset.label, it.dataset.version || _curVersion);
                const previewEl = it.querySelector('.topic-verse-preview');
                if (previewEl) previewEl.textContent = preview || '';
            }
        } finally {
            _working = false;
        }
    }

    // ── Label helpers (respect the selected version's language) ──
    function vlang(version) {
        return (typeof window.versionLang === 'function') ? window.versionLang(version) : 'no';
    }
    function bname(usfm, version) {
        const l = vlang(version);
        return (typeof window.bookName === 'function') ? window.bookName(usfm, l) : usfm;
    }
    function verseLabel(v, version) {
        const bn = bname(v.book_usfm, version);
        if (v.whole_chapter) return window.fmtVerseRef(v.book_usfm, bn, v.chapter);
        return window.fmtVerseRef(v.book_usfm, bn, v.chapter, v.verse_start, v.verse_end);
    }
    function triggerLabel(book, t, version) {
        const bn = bname(book, version);
        const vsEnd = (t.verse_end && t.verse_end !== t.verse_start) ? t.verse_end : t.verse_start;
        return window.fmtVerseRef(book, bn, t.chapter, t.verse_start, vsEnd);
    }

    // ── Verse rows (lazy preview) ──
    function renderVerseRows(versesEl, verses, version, showAll, onVerseClick) {
        const limit = showAll ? verses.length : Math.min(SUBGROUP_PREVIEW_INITIAL, verses.length);
        const visible = verses.slice(0, limit);
        const remaining = verses.length - limit;
        let html = visible.map(v => {
            const label = verseLabel(v, version);
            return `<div class="xr-item topic-verse-item" data-label="${esc(label)}" data-version="${esc(version || '')}">`
                + `<span class="xr-ref">${esc(label)}</span>`
                + `<span class="xr-preview topic-verse-preview"></span>`
                + `</div>`;
        }).join('');
        if (remaining > 0) {
            html += `<button type="button" class="topics-show-all">`
                + esc(tFn('sidebar.topics.showAll', remaining)) + `</button>`;
        }
        versesEl.innerHTML = html;
        const obs = ensureObserver();
        versesEl.querySelectorAll('.topic-verse-item').forEach(it => {
            it.addEventListener('click', () => {
                if (typeof onVerseClick === 'function') onVerseClick(it.dataset.label);
            });
            obs.observe(it);
        });
        const more = versesEl.querySelector('.topics-show-all');
        if (more) more.addEventListener('click', (e) => {
            e.stopPropagation();
            renderVerseRows(versesEl, verses, version, true, onVerseClick);
        });
    }

    function triggerChipsHtml(book, triggeredBy, version) {
        if (!book || !triggeredBy || !triggeredBy.length) return '';
        const seen = new Set();
        const chips = [];
        for (const t of triggeredBy) {
            const vsEnd = (t.verse_end && t.verse_end !== t.verse_start) ? t.verse_end : t.verse_start;
            const key = `${t.chapter}.${t.verse_start}.${vsEnd}`;
            if (seen.has(key)) continue;
            seen.add(key);
            chips.push(
                `<button type="button" class="topic-trigger-chip"`
                + ` data-book="${esc(book)}" data-chapter="${t.chapter}"`
                + ` data-verse-start="${t.verse_start}" data-verse-end="${vsEnd}"`
                + ` title="${esc(tFn('sidebar.topics.jumpToTrigger'))}">`
                + esc(triggerLabel(book, t, version)) + `</button>`
            );
        }
        return `<span class="topic-trigger-chips">${chips.join('')}</span>`;
    }

    function seeAlsoHtml(sg) {
        // Only resolved cross-refs (a real topic id) become links; unresolved
        // ones are sent as null by the backend and simply don't render.
        if (!sg.see_also || sg.see_also.id == null) return '';
        const lead = esc(tFn('sidebar.topics.seeAlso'));
        const sgAttr = sg.see_also.subgroup_id != null
            ? ` data-seealso-sgid="${sg.see_also.subgroup_id}"` : '';
        // Deep-links to a subgroup show "Topic, Subgroup" so the target is clear.
        const target = sg.see_also.subgroup_label
            ? `${esc(sg.see_also.name)}, ${esc(sg.see_also.subgroup_label)}`
            : esc(sg.see_also.name);
        return `<a href="#" class="topic-seealso" data-seealso-id="${sg.see_also.id}"${sgAttr}>`
            + `→ ${lead}: ${target}</a>`;
    }

    function subgroupHtml(sg, ctx) {
        const triggered = !!(ctx.triggered && ctx.triggered.has(sg.id));
        const tb = triggered ? ctx.triggered.get(sg.id) : null;
        const verses = sg.verses || [];
        const hasVerses = verses.length > 0;
        const labelText = sg.label || (hasVerses ? verseLabel(verses[0], ctx.version) : '');
        const chips = triggered ? triggerChipsHtml(ctx.book, tb, ctx.version) : '';
        const see = seeAlsoHtml(sg);
        const wrapCls = `topic-subgroup${triggered ? ' topic-subgroup--triggered' : ''}`;

        // Pure cross-reference or label-only subgroup: a static row, nothing to expand.
        if (!hasVerses) {
            return `<div class="${wrapCls}">`
                + `<div class="topic-subgroup-head topic-subgroup-head--static">`
                + (labelText ? `<span class="topic-subgroup-label">${esc(labelText)}</span>` : '')
                + chips + see
                + `</div></div>`;
        }
        const count = `<span class="topic-subgroup-count">${verses.length}</span>`;
        return `<div class="${wrapCls}" data-sgid="${sg.id}">`
            + `<details class="topic-subgroup-det"${triggered ? ' open' : ''}>`
            + `<summary>`
            + `<span class="topic-subgroup-label">${esc(labelText)}</span>`
            + count + chips + see
            + `</summary>`
            + `<div class="topic-subgroup-body topic-verses xr-panel-inner" data-loaded="0"></div>`
            + `</details></div>`;
    }

    function renderInto(container, subgroups, ctx) {
        ctx = ctx || {};
        _curVersion = ctx.version || '';
        let sgs = (subgroups || []).slice();
        // Triggered subgroups first; stable sort preserves source order within groups.
        if (ctx.triggered && ctx.triggered.size) {
            sgs = sgs
                .map((sg, i) => [sg, i])
                .sort((a, b) => {
                    const ta = ctx.triggered.has(a[0].id) ? 0 : 1;
                    const tb = ctx.triggered.has(b[0].id) ? 0 : 1;
                    return (ta - tb) || (a[1] - b[1]);
                })
                .map(pair => pair[0]);
        }
        if (!sgs.length) {
            container.innerHTML = `<div class="topics-empty">${esc(tFn('sidebar.topics.empty'))}</div>`;
            return;
        }
        container.innerHTML = sgs.map(sg => subgroupHtml(sg, ctx)).join('');
        wire(container, sgs, ctx);
    }

    function wire(container, sgs, ctx) {
        const byId = new Map(sgs.map(s => [String(s.id), s]));
        container.querySelectorAll('.topic-subgroup[data-sgid]').forEach(wrap => {
            const det = wrap.querySelector(':scope > .topic-subgroup-det');
            if (!det) return;
            const sg = byId.get(wrap.dataset.sgid);
            const body = det.querySelector(':scope > .topic-subgroup-body');
            const load = () => {
                if (!body || body.dataset.loaded === '1' || !sg) return;
                body.dataset.loaded = '1';
                renderVerseRows(body, sg.verses || [], ctx.version, false, ctx.onVerseClick);
            };
            if (det.open) load();
            det.addEventListener('toggle', () => { if (det.open) load(); });
        });
        container.querySelectorAll('.topic-trigger-chip').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const book = btn.dataset.book;
                const ch = Number(btn.dataset.chapter);
                const vs = Number(btn.dataset.verseStart);
                const ve = Number(btn.dataset.verseEnd) || vs;
                if (typeof ctx.onTriggerJump === 'function') ctx.onTriggerJump(book, ch, vs, ve);
            });
        });
        container.querySelectorAll('.topic-seealso[data-seealso-id]').forEach(a => {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const sgid = a.dataset.seealsoSgid != null ? Number(a.dataset.seealsoSgid) : null;
                if (typeof ctx.onSeeAlso === 'function') ctx.onSeeAlso(Number(a.dataset.seealsoId), sgid);
            });
        });
    }

    // Open + scroll to + briefly highlight a specific subgroup (used when a
    // "Se også" link targets a particular subgroup, e.g. "God, knowledge of").
    function focusSubgroup(container, sgid) {
        if (!container || sgid == null) return false;
        const wrap = container.querySelector(`.topic-subgroup[data-sgid="${sgid}"]`);
        if (!wrap) return false;
        const det = wrap.querySelector(':scope > .topic-subgroup-det');
        if (det && !det.open) det.open = true;
        requestAnimationFrame(() => {
            wrap.scrollIntoView({ block: 'center', behavior: 'smooth' });
            wrap.classList.add('topic-subgroup--focus');
            setTimeout(() => wrap.classList.remove('topic-subgroup--focus'), 2600);
        });
        return true;
    }

    window.TopicSubgroups = { renderInto, verseLabel, focusSubgroup };
})();
