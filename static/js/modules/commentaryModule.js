// ── Commentary module (PC sidebar + mobile module host) ──
// Renders Bible commentaries (Scofield, Matthew Henry, …) for the text in
// view (study tray) or for marked verses (MVB). Per-commentary scope-aware
// fetch + render, with book intros, Scofield ref-previews, Matthew Henry
// markdown with collapsible H2 sections.
(function () {
    let _container = null;
    let _unsubMainBlock = null;
    let _ctx = null;

    let _commentaries = [];           // [{id,code,name,short_name,granularity,format}, ...]
    let _selectedId = null;
    let _commentariesLoaded = false;

    // Scope: where the user opened the module from.
    //   source: 'tray' | 'mvb-pc' | 'mvb-mobile'
    //   range:  { book, ch_start, vs_start, ch_end, vs_end, version, label }
    //   markedVerses: [{book, chapter, verse}, ...] (only for mvb-* sources)
    let _scope = null;

    // {commentary_id -> {scope-key -> payload}}
    const _entriesCache = new Map();
    // {commentary_id+entry-key -> bool} — remember per-entry open state across
    // refresh of the same commentary; cleared when switching commentary.
    let _expansionState = new Map();
    // {book.ch.vs[-vs] -> preview text} for Scofield ref previews
    const _previewCache = new Map();

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
            <div class="commentary-module">
                <div class="commentary-header">
                    <select class="commentary-select" aria-label="${esc(tFn('sidebar.commentary.title'))}"></select>
                </div>
                <div class="commentary-scope-label"></div>
                <div class="commentary-entries"></div>
            </div>
        `;
        const sel = _container.querySelector('.commentary-select');
        sel.addEventListener('change', () => {
            const newId = Number(sel.value);
            if (newId === _selectedId) return;
            // Preserve scroll position when switching commentary.
            const entriesEl = _container.querySelector('.commentary-entries');
            const scrollTop = entriesEl ? entriesEl.scrollTop : 0;
            _selectedId = newId;
            _expansionState = new Map();  // entries differ across commentaries
            loadAndRender().then(() => {
                const newEntriesEl = _container.querySelector('.commentary-entries');
                if (newEntriesEl) newEntriesEl.scrollTop = scrollTop;
            });
        });
    }

    function fillDropdown() {
        if (!_container) return;
        const sel = _container.querySelector('.commentary-select');
        if (!sel) return;
        sel.innerHTML = _commentaries.map(c =>
            `<option value="${c.id}">${esc(c.name)}</option>`
        ).join('');
        if (_selectedId != null) sel.value = String(_selectedId);
    }

    async function ensureCommentariesLoaded() {
        if (_commentariesLoaded) { fillDropdown(); return; }
        try {
            const resp = await fetch('/api/commentaries');
            const data = await resp.json();
            _commentaries = data.commentaries || [];
            _commentariesLoaded = true;
            // Default: scofield if available, else first.
            const scof = _commentaries.find(c => c.code === 'scofield');
            _selectedId = scof ? scof.id : (_commentaries[0] && _commentaries[0].id);
        } catch (e) {
            console.error('Failed to load commentaries:', e);
        }
        fillDropdown();
    }

    // ── Scope derivation ────────────────────────────────────────────
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

    // ── API fetch ───────────────────────────────────────────────────
    async function fetchEntries(commentaryId, range) {
        const params = new URLSearchParams();
        params.set('commentary', String(commentaryId));
        params.set('book', range.book);
        params.set('chapter', String(range.ch_start));
        if (range.ch_end != null && range.ch_end !== range.ch_start) {
            params.set('chapter_end', String(range.ch_end));
        }
        if (range.vs_start != null) params.set('verse_start', String(range.vs_start));
        if (range.vs_end != null) params.set('verse_end', String(range.vs_end));
        if (range.version) params.set('version', range.version);
        params.set('include_intro', '1');
        const resp = await fetch('/api/commentary?' + params.toString());
        if (!resp.ok) throw new Error('commentary fetch failed: ' + resp.status);
        return resp.json();
    }

    function cachedFor(scope, commentaryId) {
        const byId = _entriesCache.get(commentaryId);
        if (!byId) return null;
        return byId.get(scopeKey(scope)) || null;
    }

    function cacheStore(scope, commentaryId, payload) {
        if (!_entriesCache.has(commentaryId)) _entriesCache.set(commentaryId, new Map());
        _entriesCache.get(commentaryId).set(scopeKey(scope), payload);
    }

    // ── Render ──────────────────────────────────────────────────────
    function setScopeLabel(text, opts) {
        const el = _container && _container.querySelector('.commentary-scope-label');
        if (!el) return;
        el.innerHTML = '';
        if (!text) return;
        const span = document.createElement('span');
        span.className = 'commentary-scope-text';
        span.textContent = text;
        el.appendChild(span);
        if (opts && opts.showExpand) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'commentary-expand-btn';
            btn.textContent = tFn('sidebar.commentary.expandToChapter');
            btn.title = tFn('sidebar.commentary.expandToChapter');
            btn.addEventListener('click', expandMvbToChapter);
            el.appendChild(btn);
        }
    }

    async function expandMvbToChapter() {
        if (!_scope) return;
        if (_scope.source !== 'mvb-pc' && _scope.source !== 'mvb-mobile') return;
        const r = _scope.range;

        // Find the card whose block contains the chapter holding the marked verses,
        // then trigger the same chapter-expand the in-card arrow uses. That clears
        // marked verses and fires mainBlockChanged, which rebinds this module to
        // the new chapter-wide tray scope automatically.
        const md = window.mainData || [];
        let targetIdx = -1;
        for (let i = 0; i < md.length; i++) {
            const b = md[i];
            if (!b || b.book !== r.book) continue;
            const hit = (b.verses || []).some(v => v.chapter >= r.ch_start && v.chapter <= r.ch_end);
            if (hit) { targetIdx = i; break; }
        }
        // Mobile: module covers the text anyway, so leave the page alone and just
        // widen the commentary scope to the chapter — no toggleChapterExpand call.
        if (targetIdx >= 0 && !isMobileNow() && typeof window.toggleChapterExpand === 'function') {
            const bar = document.querySelector(`.chapter-expand-bar[data-card-idx="${targetIdx}"]`);
            const alreadyExpanded = bar && bar.getAttribute('data-expanded') === 'true';
            if (!alreadyExpanded) {
                // Demote scope to 'tray' up-front so the mainBlockChanged that
                // fires at the end of toggleChapterExpand rebinds (and re-fetches)
                // for the new full-chapter block in the same paint.
                _scope = { source: 'tray', range: _scope.range, markedVerses: [] };
                await window.toggleChapterExpand(targetIdx);
                return;
            }
        }

        // Already chapter-expanded (or no matching card) — just widen scope locally.
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

    function setStatus(html) {
        const el = _container && _container.querySelector('.commentary-entries');
        if (el) el.innerHTML = html;
    }

    function commentaryById(id) {
        return _commentaries.find(c => c.id === id) || null;
    }

    function escAttrLocal(s) { return esc(s); }

    // Render a Scofield body to HTML. Bodies (from migrate_scofield_osis.py)
    // carry inline `<a class="scofield-ref" data-ref="USFM.CH.VS">` reference
    // anchors, `**bold**` catchwords, `_italic_`, `_(See Scofield "X")_`
    // cross-note pointers and blank-line paragraphs. Protect the trusted ref
    // anchors from escaping, escape the rest, then linkify pointers + emphasis.
    function renderScofieldBody(text) {
        if (!text) return '';
        // Protect inline reference anchors before escaping. The @@Rn@@ sentinel
        // passes through esc() untouched and never collides with real text.
        const anchors = [];
        let work = text.replace(/<a class="scofield-ref"[^>]*>[\s\S]*?<\/a>/g, (m) => {
            anchors.push(m);
            return '@@R' + (anchors.length - 1) + '@@';
        });
        let html = esc(work);
        // "See Scofield" pointers (post-escape, quotes are &quot;)
        html = html.replace(
            /_?\(?See Scofield &quot;([^&]+?)&quot;\)?_?/g,
            (_m, ref) => {
                // Scofield may separate book name and chapter:verse with a
                // non-breaking space (U+00A0); normalise so the reference parser
                // recognises e.g. "2 Samuel 7:16" instead of erroring.
                const normRef = ref.replace(/\u00a0/g, ' ').trim();
                const safeRef = normRef.replace(/'/g, '&#39;');
                return `<a class="scofield-see-link" data-see-ref="${safeRef}" href="#" `
                    + `title="Åpne Scofield-note for ${safeRef}">`
                    + `📖 Se Scofield: ${safeRef}</a>`;
            }
        );
        // Bold catchwords, then remaining `_..._` italics (single line).
        html = html.replace(/\*\*([^*\n]+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/_([^_\n]+?)_/g, '<em>$1</em>');
        // Restore the protected reference anchors (trusted HTML).
        html = html.replace(/@@R(\d+)@@/g, (_m, i) => anchors[Number(i)] || '');
        // Paragraph breaks
        const paragraphs = html.split(/\n{2,}/).map(p => p.replace(/\n/g, '<br>'));
        return paragraphs.map(p => `<p>${p}</p>`).join('');
    }

    function refLabel(refStr) {
        // refStr like "GEN.1.27" or "MAT.19.4-6" or "GEN.1" (whole chapter)
        const parts = refStr.split('.');
        const book = parts[0];
        const abbrev = (typeof window.bookAbbrev === 'function')
            ? window.bookAbbrev(book) : book;
        if (parts.length === 1) return abbrev;
        if (parts.length === 2) return `${abbrev} ${parts[1]}`;
        // Has at least book.chapter.verse(-verse)
        return `${abbrev} ${parts[1]}:${parts.slice(2).join('.')}`;
    }

    // Fetch up to two verses of preview text for a reference. Result cached as
    // { label, verses:[{num,text}], more }.
    async function fetchVersePreview(refStr) {
        if (_previewCache.has(refStr)) return _previewCache.get(refStr);
        const version = _scope && _scope.range && _scope.range.version;
        const params = new URLSearchParams();
        params.set('q', refLabel(refStr));
        if (version) params.set('version', version);
        const out = { label: refLabel(refStr), verses: [], more: false };
        try {
            const resp = await fetch('/api/search?' + params.toString());
            const data = await resp.json();
            if (data && data.type === 'reference' && Array.isArray(data.results)) {
                const first = data.results[0];
                if (first) {
                    if (first.label) out.label = first.label;
                    const vs = first.verses || [];
                    out.verses = vs.slice(0, 2).map(v => ({ num: v.num, text: v.text }));
                    out.more = vs.length > 2;
                }
            }
        } catch { /* leave empty */ }
        _previewCache.set(refStr, out);
        return out;
    }

    // Markdown render with collapsible H2 sections (Matthew Henry).
    function renderMarkdownWithCollapsibleH2(md) {
        if (!md) return '';
        const marked = window.marked;
        // Split body on H2 boundaries. Anything before the first H2 is a
        // pre-section; each H2 + following content becomes a collapsible block.
        const lines = md.split('\n');
        const sections = [];
        let preface = [];
        let current = null;
        for (const line of lines) {
            const h2 = line.match(/^##\s+(.+?)\s*$/);
            if (h2 && !line.startsWith('###')) {
                if (current) sections.push(current);
                else if (preface.length) sections.push({ heading: null, lines: preface });
                preface = [];
                current = { heading: h2[1], lines: [] };
            } else {
                if (current) current.lines.push(line);
                else preface.push(line);
            }
        }
        if (current) sections.push(current);
        else if (preface.length) sections.push({ heading: null, lines: preface });

        const parse = (text) => {
            if (!marked) return `<pre class="commentary-plain">${esc(text)}</pre>`;
            try { return marked.parse(text, { breaks: true, gfm: true }); }
            catch { return `<pre class="commentary-plain">${esc(text)}</pre>`; }
        };

        let html = '';
        for (const sec of sections) {
            const body = sec.lines.join('\n').trim();
            if (sec.heading == null) {
                if (body) html += `<div class="commentary-md">${parse(body)}</div>`;
                continue;
            }
            const bodyHtml = body ? parse(body) : '';
            html += `<details class="commentary-md-h2">`
                + `<summary>${esc(sec.heading)}</summary>`
                + `<div class="commentary-md-h2-body">${bodyHtml}</div>`
                + `</details>`;
        }
        return html;
    }

    function entryKey(entry) {
        return `${entry.chapter}.${entry.verse_start || 0}.${entry.verse_end || 0}`;
    }

    function buildIntroHtml(commentary, intro) {
        const lang = (typeof window.versionLang === 'function' && _scope && _scope.range)
            ? window.versionLang(_scope.range.version) : 'no';
        const bName = (typeof window.bookName === 'function')
            ? window.bookName(intro.book, lang) : intro.book;
        const title = tFn('sidebar.commentary.intro', bName);
        let bodyHtml;
        if (commentary.format === 'markdown') {
            bodyHtml = renderMarkdownWithCollapsibleH2(intro.body);
        } else {
            bodyHtml = `<div class="commentary-plain commentary-scofield">${renderScofieldBody(intro.body)}</div>`;
        }
        // Intro boxes always start collapsed.
        return `<details class="commentary-box intro-box" data-key="intro:${esc(intro.book)}">`
            + `<summary>${esc(title)}</summary>`
            + `<div class="commentary-box-body">${bodyHtml}</div>`
            + `</details>`;
    }

    function buildEntryHtml(commentary, entry, opts) {
        const range = _scope.range;
        const lang = (typeof window.versionLang === 'function')
            ? window.versionLang(range.version) : 'no';
        const bName = (typeof window.bookName === 'function')
            ? window.bookName(range.book, lang) : range.book;
        let title;
        if (entry.verse_start == null) {
            title = `${bName} ${entry.chapter}`;
        } else if (entry.verse_end == null || entry.verse_end === entry.verse_start) {
            title = `${bName} ${entry.chapter}:${entry.verse_start}`;
        } else {
            title = `${bName} ${entry.chapter}:${entry.verse_start}-${entry.verse_end}`;
        }
        let bodyHtml;
        if (commentary.format === 'markdown') {
            bodyHtml = renderMarkdownWithCollapsibleH2(entry.body);
        } else {
            bodyHtml = `<div class="commentary-plain commentary-scofield">${renderScofieldBody(entry.body)}</div>`;
        }
        const openAttr = opts && opts.open ? ' open' : '';
        return `<details class="commentary-box entry-box"${openAttr} data-key="${esc(entryKey(entry))}">`
            + `<summary>${esc(title)}</summary>`
            + `<div class="commentary-box-body">${bodyHtml}</div>`
            + `</details>`;
    }

    function entryOverlapsMarked(entry, markedVerses) {
        if (!markedVerses || !markedVerses.length) return false;
        if (entry.verse_start == null) {
            // Chapter-level entry: overlap if any marked verse shares the chapter.
            return markedVerses.some(v => v.chapter === entry.chapter);
        }
        const vs = entry.verse_start;
        const ve = entry.verse_end == null ? vs : entry.verse_end;
        return markedVerses.some(v => v.chapter === entry.chapter && v.verse >= vs && v.verse <= ve);
    }

    async function loadAndRender() {
        if (!_scope || !_scope.range || _selectedId == null) {
            setScopeLabel('');
            setStatus('');
            return;
        }
        const commentary = commentaryById(_selectedId);
        if (!commentary) return;

        // Label
        const isMvbScope = (_scope.source === 'mvb-pc' || _scope.source === 'mvb-mobile');
        const scopeLabel = isMvbScope
            ? tFn('sidebar.commentary.scope.mvb')
            : tFn('sidebar.commentary.scope.tray', _scope.range.label);
        setScopeLabel(scopeLabel, { showExpand: isMvbScope });

        // Fetch (cache or network)
        let payload = cachedFor(_scope, _selectedId);
        if (!payload) {
            setStatus(`<div class="commentary-loading">${esc(tFn('sidebar.commentary.loading'))}</div>`);
            try {
                payload = await fetchEntries(_selectedId, _scope.range);
                cacheStore(_scope, _selectedId, payload);
            } catch (e) {
                console.error(e);
                setStatus(`<div class="commentary-empty">${esc(tFn('sidebar.commentary.loading'))}</div>`);
                return;
            }
        }

        _hasBeenShown = true;

        const intros = payload.intros || [];
        let entries = payload.entries || [];

        // Mobile MVB: filter entries to only those overlapping marked verses.
        if (_scope.source === 'mvb-mobile' && _scope.markedVerses.length) {
            entries = entries.filter(e => entryOverlapsMarked(e, _scope.markedVerses));
        }

        // Open-state rules:
        //   intros: always closed
        //   non-intro entries: open if only one, else closed
        //   MVB (PC and mobile): entries overlapping marked verses are open
        const nonIntro = entries;
        const onlyOne = nonIntro.length === 1;
        const isMvb = (_scope.source === 'mvb-pc' || _scope.source === 'mvb-mobile');

        let html = '';
        for (const intro of intros) html += buildIntroHtml(commentary, intro);

        for (const entry of nonIntro) {
            let open = false;
            if (onlyOne) open = true;
            if (isMvb && entryOverlapsMarked(entry, _scope.markedVerses)) open = true;
            html += buildEntryHtml(commentary, entry, { open });
        }

        if (!intros.length && !nonIntro.length) {
            html = `<div class="commentary-empty">${esc(tFn('sidebar.commentary.empty'))}</div>`;
        }

        setStatus(html);
        attachRefPreviewHandlers();
    }

    // ── Inline reference preview popup (shared by Scofield + M. Henry refs) ──
    let _refPopupEl = null;
    let _refPopupHideT = null;
    let _refPopupShowT = null;
    let _refPopupToken = 0;
    let _refPopupAnchor = null;
    // Pinned = opened by click; stays put until an outside click / another ref.
    // Transient = opened by hover; auto-hides when the pointer leaves.
    let _refPopupPinned = false;
    const _refHoverCapable = !!(window.matchMedia && window.matchMedia('(hover: hover)').matches);

    function ensureRefPopup() {
        if (_refPopupEl) return _refPopupEl;
        const el = document.createElement('div');
        el.className = 'ref-preview-popup';
        el.style.display = 'none';
        el.innerHTML = '<div class="ref-popup-label"></div>'
            + '<div class="ref-popup-body"></div>'
            + '<button type="button" class="ref-popup-open"></button>';
        document.body.appendChild(el);
        el.addEventListener('mouseenter', () => {
            if (_refPopupHideT) { clearTimeout(_refPopupHideT); _refPopupHideT = null; }
        });
        el.addEventListener('mouseleave', () => { if (!_refPopupPinned) scheduleHideRefPopup(); });
        // Dismiss on outside-click / scroll / resize (attached once).
        document.addEventListener('click', (e) => {
            if (!_refPopupEl || _refPopupEl.style.display === 'none') return;
            if (_refPopupEl.contains(e.target)) return;
            if (e.target.closest && e.target.closest('a.scofield-ref, a.mh-ref')) return;
            hideRefPopup();
        }, true);
        window.addEventListener('scroll', (e) => {
            // Scrolling inside the popup body (to read more verses) must not
            // dismiss a pinned popup; outer scrolling still does.
            if (_refPopupEl && _refPopupEl.contains(e.target)) return;
            hideRefPopup();
        }, true);
        window.addEventListener('resize', hideRefPopup);
        _refPopupEl = el;
        return el;
    }

    function positionRefPopup(pop, anchor) {
        const r = anchor.getBoundingClientRect();
        const vw = window.innerWidth, vh = window.innerHeight, margin = 12;
        // Keep clear of the sidebar's vertical scrollbar on the right so it
        // doesn't bleed through the popup when the ref sits near the edge.
        const rightPad = margin + 14;
        pop.style.maxWidth = Math.min(360, vw - margin - rightPad) + 'px';
        const pr = pop.getBoundingClientRect();
        // Prefer left-aligning to the ref; if that overflows the (scrollbar-
        // padded) right edge, shift left so the full width stays on-screen.
        let left = r.left;
        const rightLimit = vw - pr.width - rightPad;
        if (left > rightLimit) left = rightLimit;
        if (left < margin) left = margin;
        let top = r.bottom + 6;
        if (top + pr.height > vh - margin) {
            top = r.top - pr.height - 6;            // flip above the ref
            if (top < margin) top = Math.max(margin, vh - pr.height - margin);
        }
        pop.style.left = left + 'px';
        pop.style.top = top + 'px';
    }

    function hideRefPopup() {
        if (_refPopupHideT) { clearTimeout(_refPopupHideT); _refPopupHideT = null; }
        if (_refPopupEl) _refPopupEl.style.display = 'none';
        _refPopupAnchor = null;
        _refPopupPinned = false;
    }

    function scheduleHideRefPopup() {
        if (_refPopupHideT) clearTimeout(_refPopupHideT);
        _refPopupHideT = setTimeout(hideRefPopup, 220);
    }

    // Navigate the main view to a reference, then reopen the commentary there.
    async function openRefTarget(ref) {
        if (!ref || typeof window.searchFromXref !== 'function') return;
        // Mobile: the module overlay covers the reading area, so closing it
        // reveals the verse the user just navigated to instead of stacking the
        // commentary back on top.
        if (isMobileNow() && window.AppModuleHost && typeof window.AppModuleHost.closeModule === 'function') {
            window.AppModuleHost.closeModule();
            await window.searchFromXref(refLabel(ref));
            return;
        }
        const keepId = _selectedId;
        await window.searchFromXref(refLabel(ref));
        _selectedId = keepId;
        await showForBlock(0);
    }

    async function showRefPopup(anchor, pinned) {
        const ref = anchor && anchor.dataset && anchor.dataset.ref;
        if (!ref) return;
        const pop = ensureRefPopup();
        _refPopupAnchor = anchor;
        _refPopupPinned = !!pinned;
        if (_refPopupHideT) { clearTimeout(_refPopupHideT); _refPopupHideT = null; }
        const token = ++_refPopupToken;
        const labelEl = pop.querySelector('.ref-popup-label');
        const bodyEl = pop.querySelector('.ref-popup-body');
        const openBtn = pop.querySelector('.ref-popup-open');
        labelEl.textContent = (anchor.textContent || '').trim() || refLabel(ref);
        bodyEl.textContent = tFn('sidebar.commentary.loadingPreview');
        bodyEl.classList.remove('is-empty');
        openBtn.textContent = tFn('sidebar.commentary.openVerse');
        openBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); hideRefPopup(); openRefTarget(ref); };
        pop.style.display = '';
        positionRefPopup(pop, anchor);
        const data = await fetchVersePreview(ref);
        if (token !== _refPopupToken) return;        // superseded by a newer hover/click
        labelEl.textContent = data.label || refLabel(ref);
        if (data.verses && data.verses.length) {
            bodyEl.innerHTML = data.verses.map(v =>
                `<span class="ref-popup-verse"><b>${esc(String(v.num))}</b>${esc(v.text)}</span>`
            ).join(' ') + (data.more ? ' …' : '');
        } else {
            bodyEl.textContent = tFn('sidebar.commentary.empty');
            bodyEl.classList.add('is-empty');
        }
        positionRefPopup(pop, anchor);
    }

    function attachRefPreviewHandlers() {
        if (!_container) return;
        // "See Scofield" cross-note pointers navigate to the referenced Scofield
        // note (then reopen the commentary there) on PC and mobile alike.
        _container.querySelectorAll('.scofield-see-link').forEach(el => {
            el.addEventListener('click', async (e) => {
                e.preventDefault();
                const ref = el.dataset.seeRef;
                if (!ref || typeof window.searchFromXref !== 'function') return;
                const keepId = _selectedId;
                await window.searchFromXref(ref);
                _selectedId = keepId;
                await showForBlock(0);
            });
        });
        // Inline scripture references (Scofield + Matthew Henry full): click —
        // and hover on PC — opens a verse-preview popup with an "open" button.
        _container.querySelectorAll('a.scofield-ref, a.mh-ref').forEach(a => {
            // Click pins the popup open: it stays until an outside click or
            // another ref. Clicking the same ref again keeps it open (never a
            // toggle-close), so a hover-then-click never collapses the popup.
            a.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (_refPopupShowT) { clearTimeout(_refPopupShowT); _refPopupShowT = null; }
                showRefPopup(a, true);
            });
            if (_refHoverCapable) {
                a.addEventListener('mouseenter', () => {
                    if (_refPopupShowT) clearTimeout(_refPopupShowT);
                    _refPopupShowT = setTimeout(() => {
                        // Don't downgrade an already-pinned popup on the same ref.
                        const keepPinned = _refPopupPinned && _refPopupAnchor === a;
                        showRefPopup(a, keepPinned);
                    }, 140);
                });
                a.addEventListener('mouseleave', () => {
                    if (_refPopupShowT) { clearTimeout(_refPopupShowT); _refPopupShowT = null; }
                    if (!_refPopupPinned) scheduleHideRefPopup();
                });
            }
        });
    }

    // ── Public API for triggers ─────────────────────────────────────
    // Open module for a card's full block (study tray button).
    async function showForBlock(blockIdx) {
        // Isolate to block when not block 0 (same pattern as MapModule).
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
            if (window.AppModuleHost) window.AppModuleHost.openModule('commentary');
        } else if (window.AppSidebar) {
            if (typeof window.AppSidebar.openModule === 'function') {
                window.AppSidebar.openModule('commentary');
            } else {
                window.AppSidebar.ensureOpen();
            }
        }
        await ensureCommentariesLoaded();
        await loadAndRender();
    }

    // Open module for marked verses (MVB 🖋️ button).
    async function showForMarkedVerses(markedVerses) {
        if (!markedVerses || !markedVerses.length) return;
        // Compute encompassing range across marked verses.
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
            if (window.AppModuleHost) window.AppModuleHost.openModule('commentary');
        } else if (window.AppSidebar) {
            if (typeof window.AppSidebar.openModule === 'function') {
                window.AppSidebar.openModule('commentary');
            } else {
                window.AppSidebar.ensureOpen();
            }
        }
        await ensureCommentariesLoaded();
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
        // MVB scope: stay pinned as long as marked verses still overlap the
        // current top block. When the user navigates elsewhere (which clears
        // marked verses) drop MVB scope and rebind to the new top block.
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
        id: 'commentary',
        title: 'Kommentar',
        icon: '<img src="/static/images/pen.png" alt="" class="sidebar-module-icon-img">',
        async mount(container, ctx) {
            _container = container;
            _ctx = ctx;
            _isMobile = isMobileNow();
            buildScaffold();
            await ensureCommentariesLoaded();
            // If no scope yet but a top block exists, fall back to it.
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
            _expansionState = new Map();
            // Keep _commentaries metadata (cheap to reuse). Wipe entries cache
            // so a fresh open re-fetches with current versification.
            _entriesCache.clear();
            _previewCache.clear();
            hideRefPopup();
            if (_container) {
                const entriesEl = _container.querySelector('.commentary-entries');
                if (entriesEl) entriesEl.innerHTML = '';
                setScopeLabel('');
            }
        },
    };

    window.CommentaryModule = { moduleDef, showForBlock, showForMarkedVerses };

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
