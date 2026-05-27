// ── Pinned-verses strip ──
// Small bottom strip with pills for each pinned verse. Auto-opens when first
// pin is added; auto-closes when empty. In-memory only.
// Spec shape: {book, ch_start, vs_start, ch_end, vs_end, version, label, text, ts}
(function () {
    let _pins = [];
    let stripEl = null, pillsEl = null, openAllBtn = null, clearBtn = null;
    let pinHResizeObserver = null;

    function pinKey(p) {
        return `${p.book}|${p.ch_start}|${p.vs_start}|${p.ch_end}|${p.vs_end}|${p.version}`;
    }

    function isPinned(spec) {
        if (!spec) return false;
        const key = pinKey(spec);
        return _pins.some(p => pinKey(p) === key);
    }

    function add(item) {
        const key = pinKey(item);
        if (_pins.some(p => pinKey(p) === key)) return false;
        _pins.unshift({ ...item, ts: Date.now() });
        notifyChange();
        return true;
    }

    function remove(spec) {
        const key = pinKey(spec);
        const before = _pins.length;
        _pins = _pins.filter(p => pinKey(p) !== key);
        if (_pins.length === before) return false;
        notifyChange();
        return true;
    }

    function toggle(spec) {
        if (isPinned(spec)) { remove(spec); return false; }
        add(spec); return true;
    }

    function clearAll() {
        if (!_pins.length) return;
        _pins = [];
        notifyChange();
    }

    function escapeHtml(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[c]);
    }

    function pillLabel(p) {
        const abbrev = (typeof window.bookAbbrev === 'function')
            ? window.bookAbbrev(p.book)
            : p.book;
        if (p.ch_start === p.ch_end && typeof window.fmtVerseRef === 'function') {
            return window.fmtVerseRef(p.book, abbrev, p.ch_start, p.vs_start, p.vs_end);
        }
        const range = (p.vs_start === p.vs_end && p.ch_start === p.ch_end)
            ? `${p.ch_start}:${p.vs_start}`
            : (p.ch_start === p.ch_end
                ? `${p.ch_start}:${p.vs_start}-${p.vs_end}`
                : `${p.ch_start}:${p.vs_start}–${p.ch_end}:${p.vs_end}`);
        return `${abbrev} ${range}`;
    }

    function closeMobileOverlays() {
        const onMobile = window.AppModuleHost && window.AppModuleHost.isMobile();
        if (!onMobile) return;
        if (window.AppModuleHost && window.AppModuleHost.isOpen()) {
            window.AppModuleHost.closeModule();
        }
        if (typeof window.clearHighlightAndMarked === 'function') {
            window.clearHighlightAndMarked();
        }
    }

    function render() {
        if (!pillsEl) return;
        if (_pins.length === 0) {
            pillsEl.innerHTML = '';
            return;
        }
        let html = '';
        _pins.forEach(p => {
            const key = pinKey(p);
            html += `<button class="pinned-pill" data-key="${escapeHtml(key)}" title="${escapeHtml(p.label || '')}" type="button">
                <span class="pinned-pill-ref">${escapeHtml(pillLabel(p))}</span>
                <span class="pinned-pill-remove" role="button" aria-label="Fjern" tabindex="-1">×</span>
            </button>`;
        });
        pillsEl.innerHTML = html;

        pillsEl.querySelectorAll('.pinned-pill').forEach(el => {
            const key = el.dataset.key;
            const item = _pins.find(p => pinKey(p) === key);
            if (!item) return;
            el.addEventListener('click', (e) => {
                if (e.target.closest('.pinned-pill-remove')) {
                    e.stopPropagation();
                    remove(item);
                    return;
                }
                closeMobileOverlays();
                if (typeof window.openPinnedVerse === 'function') {
                    window.openPinnedVerse(item);
                }
            });
        });
    }

    function setStripState() {
        if (!stripEl) return;
        const open = _pins.length > 0;
        stripEl.setAttribute('data-state', open ? 'open' : 'closed');
        stripEl.setAttribute('aria-hidden', open ? 'false' : 'true');
        document.body.classList.toggle('pin-strip-on', open);
        updatePinHeightVar();
    }

    function updatePinHeightVar() {
        if (!stripEl) return;
        const open = stripEl.getAttribute('data-state') === 'open';
        const h = open ? (stripEl.offsetHeight || 0) : 0;
        document.documentElement.style.setProperty('--pin-h', h + 'px');
    }

    function notifyChange() {
        render();
        setStripState();
        if (typeof window.refreshPinButtons === 'function') window.refreshPinButtons();
    }

    function bindStrip() {
        stripEl = document.getElementById('pinnedStrip');
        pillsEl = document.getElementById('pinnedStripPills');
        openAllBtn = document.getElementById('pinnedStripOpenAll');
        clearBtn = document.getElementById('pinnedStripClear');
        if (!stripEl || !pillsEl) return;

        if (openAllBtn) {
            openAllBtn.addEventListener('click', async () => {
                if (!_pins.length) return;
                openAllBtn.disabled = true;
                try {
                    closeMobileOverlays();
                    if (typeof window.insertBlocksIntoView === 'function') {
                        await window.insertBlocksIntoView(_pins.slice(), { replace: true });
                    }
                } finally {
                    openAllBtn.disabled = false;
                }
            });
        }
        if (clearBtn) {
            clearBtn.addEventListener('click', () => clearAll());
        }

        if ('ResizeObserver' in window) {
            pinHResizeObserver = new ResizeObserver(() => updatePinHeightVar());
            pinHResizeObserver.observe(stripEl);
        }

        render();
        setStripState();
    }

    window.PinnedVerses = {
        toggle, isPinned, add, remove, clearAll,
        list: () => _pins.slice(),
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindStrip);
    } else {
        bindStrip();
    }
})();
