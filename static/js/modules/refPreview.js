// ── Shared inline reference-preview popup ──
// A single floating verse-preview popup, reused by the commentary and leksikon
// modules. Anchors carry a `data-ref="USFM.CH.VS"` attribute; hovering (on
// pointer devices) or clicking one opens a popup with the verse text and an
// "open" button. Click pins the popup until an outside click / another ref;
// hover is transient and auto-hides when the pointer leaves.
(function () {
    let _el = null;
    let _hideT = null;
    let _showT = null;
    let _token = 0;
    let _anchor = null;
    let _pinned = false;          // pinned = opened by click; transient = hover
    let _cfg = null;              // active binding's { getVersion, onOpen }
    const _hoverCapable = !!(window.matchMedia && window.matchMedia('(hover: hover)').matches);
    const _previewCache = new Map();   // `${version}|${ref}` -> { label, verses, more }

    function tFn(key, ...args) {
        if (typeof window.t === 'function') return window.t(key, ...args);
        return key;
    }

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, c => (
            { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
        ));
    }

    function refLabel(refStr) {
        // refStr like "GEN.1.27" or "MAT.19.4-6" or "GEN.1" (whole chapter)
        const parts = String(refStr || '').split('.');
        const book = parts[0];
        const abbrev = (typeof window.bookAbbrev === 'function')
            ? window.bookAbbrev(book) : book;
        if (parts.length === 1) return abbrev;
        const single = typeof window.isSingleChapterBook === 'function'
            && window.isSingleChapterBook(book);
        if (parts.length === 2) return single ? abbrev : `${abbrev} ${parts[1]}`;
        const versePart = parts.slice(2).join('.');
        return single ? `${abbrev} ${versePart}` : `${abbrev} ${parts[1]}:${versePart}`;
    }

    // Fetch up to two verses of preview text for a reference. Result cached as
    // { label, verses:[{num,text}], more }.
    async function fetchVersePreview(refStr, version) {
        const key = `${version || ''}|${refStr}`;
        if (_previewCache.has(key)) return _previewCache.get(key);
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
        _previewCache.set(key, out);
        return out;
    }

    function ensurePopup() {
        if (_el) return _el;
        const el = document.createElement('div');
        el.className = 'ref-preview-popup';
        el.style.display = 'none';
        el.innerHTML = '<div class="ref-popup-label"></div>'
            + '<div class="ref-popup-body"></div>'
            + '<button type="button" class="ref-popup-open"></button>';
        document.body.appendChild(el);
        el.addEventListener('mouseenter', () => {
            if (_hideT) { clearTimeout(_hideT); _hideT = null; }
        });
        el.addEventListener('mouseleave', () => { if (!_pinned) scheduleHide(); });
        // Dismiss on outside-click / scroll / resize (attached once).
        document.addEventListener('click', (e) => {
            if (!_el || _el.style.display === 'none') return;
            if (_el.contains(e.target)) return;
            if (e.target.closest && e.target.closest('a.ref-preview-link')) return;
            hide();
        }, true);
        window.addEventListener('scroll', (e) => {
            // Scrolling inside the popup body (to read more verses) must not
            // dismiss a pinned popup; outer scrolling still does.
            if (_el && _el.contains(e.target)) return;
            hide();
        }, true);
        window.addEventListener('resize', hide);
        _el = el;
        return el;
    }

    function positionPopup(pop, anchor) {
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

    function hide() {
        if (_hideT) { clearTimeout(_hideT); _hideT = null; }
        if (_el) _el.style.display = 'none';
        _anchor = null;
        _pinned = false;
    }

    function scheduleHide() {
        if (_hideT) clearTimeout(_hideT);
        _hideT = setTimeout(hide, 220);
    }

    async function show(anchor, pinned, cfg) {
        const ref = anchor && anchor.dataset && anchor.dataset.ref;
        if (!ref) return;
        _cfg = cfg;
        const pop = ensurePopup();
        _anchor = anchor;
        _pinned = !!pinned;
        if (_hideT) { clearTimeout(_hideT); _hideT = null; }
        const token = ++_token;
        const labelEl = pop.querySelector('.ref-popup-label');
        const bodyEl = pop.querySelector('.ref-popup-body');
        const openBtn = pop.querySelector('.ref-popup-open');
        labelEl.textContent = (anchor.textContent || '').trim() || refLabel(ref);
        bodyEl.textContent = tFn('sidebar.refPreview.loading');
        bodyEl.classList.remove('is-empty');
        openBtn.textContent = tFn('sidebar.refPreview.open');
        openBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            hide();
            if (cfg && typeof cfg.onOpen === 'function') cfg.onOpen(ref, refLabel(ref));
        };
        pop.style.display = '';
        positionPopup(pop, anchor);
        const version = (cfg && typeof cfg.getVersion === 'function') ? cfg.getVersion() : '';
        const data = await fetchVersePreview(ref, version);
        if (token !== _token) return;        // superseded by a newer hover/click
        labelEl.textContent = data.label || refLabel(ref);
        if (data.verses && data.verses.length) {
            bodyEl.innerHTML = data.verses.map(v =>
                `<span class="ref-popup-verse"><b>${esc(String(v.num))}</b>${esc(v.text)}</span>`
            ).join(' ') + (data.more ? ' …' : '');
        } else {
            bodyEl.textContent = tFn('sidebar.refPreview.empty');
            bodyEl.classList.add('is-empty');
        }
        positionPopup(pop, anchor);
    }

    // Bind every anchor matching `selector` inside `container`. `cfg` carries
    //   getVersion(): the bible version to fetch the preview in
    //   onOpen(ref, label): invoked when the popup's open button is clicked
    function bind(container, selector, cfg) {
        if (!container) return;
        container.querySelectorAll(selector).forEach(a => {
            // Shared marker class so the outside-click guard recognises any
            // ref anchor regardless of which module rendered it.
            a.classList.add('ref-preview-link');
            // Click pins the popup open: it stays until an outside click or
            // another ref. Clicking the same ref again keeps it open (never a
            // toggle-close), so a hover-then-click never collapses the popup.
            a.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (_showT) { clearTimeout(_showT); _showT = null; }
                show(a, true, cfg);
            });
            if (_hoverCapable) {
                a.addEventListener('mouseenter', () => {
                    if (_showT) clearTimeout(_showT);
                    _showT = setTimeout(() => {
                        // Don't downgrade an already-pinned popup on the same ref.
                        const keepPinned = _pinned && _anchor === a;
                        show(a, keepPinned, cfg);
                    }, 140);
                });
                a.addEventListener('mouseleave', () => {
                    if (_showT) { clearTimeout(_showT); _showT = null; }
                    if (!_pinned) scheduleHide();
                });
            }
        });
    }

    window.RefPreviewPopup = { bind, hide, refLabel };
})();
