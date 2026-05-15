// ── Sidebar foundation (PC only) ──
// In-memory state only — clean slate every visit and on every close.
// Sidebar opens automatically when a module gets content, closes automatically when all modules empty
// (or via user clicking X). Closing clears all module content.
//
// Module API:
//   { id, title, icon,
//     mount(container, ctx),
//     unmount?(),
//     onFocusChange?(focus),
//     onStateChange?(appState),
//     isEmpty?(): boolean,    // used for auto-close detection
//     clearAll?()             // called on sidebar close to wipe module's data
//   }
// ctx: { jumpToVerse(target), getBlock(idx), getMainBlock(), getFocus(), subscribe(event, fn) }
//
// Modules should subscribe to 'mainBlockChanged' to re-bind their content
// whenever mainData[0] changes (navigation, expand/collapse, fresh search).
(function () {
    const DESKTOP_BP = 701;
    const DEFAULT_WIDTH_VW = 40;
    const MIN_WIDTH_VW = 28;
    const MIN_WIDTH_PX_FLOOR = 280;
    const MAX_WIDTH_VW = 57;

    const state = {
        open: false,
        modules: [], // [{def, instance, container, collapsed, mounted, wrap}]
        focus: null,
        observer: null,
        listeners: new Map(),
    };

    function isDesktop() { return window.innerWidth >= DESKTOP_BP; }

    function emit(event, payload) {
        const set = state.listeners.get(event);
        if (set) set.forEach(fn => { try { fn(payload); } catch (e) { console.error(e); } });
    }

    function ctx() {
        return {
            jumpToVerse(target) {
                if (typeof window.scrollToBlockIdx === 'function') window.scrollToBlockIdx(target);
            },
            getBlock(idx) { return (window.mainData && window.mainData[idx]) || null; },
            getMainBlock() {
                const md = window.mainData;
                if (!md || !md.length) return null;
                return { blockIdx: 0, block: md[0] };
            },
            getFocus() { return state.focus; },
            subscribe(event, fn) {
                if (!state.listeners.has(event)) state.listeners.set(event, new Set());
                state.listeners.get(event).add(fn);
                return () => state.listeners.get(event).delete(fn);
            },
        };
    }

    function $(id) { return document.getElementById(id); }

    function escapeHtml(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[c]);
    }

    // ── Module DOM mount/unmount ──
    function mountModuleDOM(entry) {
        if (entry.mounted) return;
        const wrap = document.createElement('section');
        wrap.className = 'sidebar-module';
        wrap.dataset.moduleId = entry.def.id;
        wrap.dataset.collapsed = entry.collapsed ? 'true' : 'false';

        const header = document.createElement('div');
        header.className = 'sidebar-module-header';
        header.innerHTML = `
            <span class="sidebar-module-drag" title="Flytt" aria-label="Flytt">⋮⋮</span>
            ${entry.def.icon ? `<span class="sidebar-module-icon" aria-hidden="true">${entry.def.icon}</span>` : ''}
            <span class="sidebar-module-title">${escapeHtml(entry.def.title || entry.def.id)}</span>
            <span class="sidebar-module-actions">
                <span class="sidebar-module-collapse" aria-hidden="true">
                    <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4 L6 8 L10 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
                <button class="sidebar-module-close" type="button" title="Lukk modul" aria-label="Lukk modul">&times;</button>
            </span>
        `;
        const body = document.createElement('div');
        body.className = 'sidebar-module-body';
        wrap.appendChild(header);
        wrap.appendChild(body);

        // Header click toggles collapse (except on drag handle / close button).
        header.addEventListener('click', (e) => {
            if (e.target.closest('.sidebar-module-drag')) return;
            if (e.target.closest('.sidebar-module-close')) return;
            entry.collapsed = !entry.collapsed;
            wrap.dataset.collapsed = entry.collapsed ? 'true' : 'false';
        });

        // Per-module close X — clears the module's data and lets the sidebar
        // auto-close if every remaining module is empty.
        const closeBtn = header.querySelector('.sidebar-module-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                try { entry.def.clearAll && entry.def.clearAll(); } catch (err) { console.error(err); }
                try { window.refreshPinButtons && window.refreshPinButtons(); } catch {}
                checkAutoClose();
            });
        }

        // Drag handle starts pointer-based reorder.
        const handle = header.querySelector('.sidebar-module-drag');
        if (handle) {
            handle.addEventListener('pointerdown', (e) => {
                if (e.button !== 0) return;
                e.stopPropagation();
                e.preventDefault();
                startDrag(e, entry, wrap);
            });
        }

        entry.container = body;
        entry.wrap = wrap;
        $('sidebarModules').appendChild(wrap);

        try { entry.def.mount(body, ctx()); }
        catch (e) { console.error('Module mount failed:', entry.def.id, e); }
        entry.mounted = true;
    }

    function unmountModuleDOM(entry) {
        if (!entry.mounted) return;
        try { entry.def.unmount && entry.def.unmount(); } catch (e) { console.error(e); }
        if (entry.wrap && entry.wrap.parentNode) entry.wrap.parentNode.removeChild(entry.wrap);
        entry.mounted = false;
        entry.wrap = null;
        entry.container = null;
    }

    // ── Drag-to-reorder ──
    function startDrag(startEvent, entry, wrap) {
        const list = $('sidebarModules');
        if (!list) return;
        const startY = startEvent.clientY;
        let moved = false;
        let dropTarget = null, dropPos = null;

        function clearMarkers() {
            list.querySelectorAll('.drop-before, .drop-after').forEach(el => {
                el.classList.remove('drop-before', 'drop-after');
            });
        }
        function onMove(e) {
            const dy = Math.abs(e.clientY - startY);
            if (!moved && dy < 5) return;
            if (!moved) {
                moved = true;
                wrap.classList.add('dragging');
                document.body.style.userSelect = 'none';
            }
            clearMarkers();
            const items = Array.from(list.querySelectorAll('.sidebar-module'));
            for (const item of items) {
                if (item === wrap) continue;
                const r = item.getBoundingClientRect();
                if (e.clientY >= r.top && e.clientY <= r.bottom) {
                    const mid = r.top + r.height / 2;
                    if (e.clientY < mid) { item.classList.add('drop-before'); dropTarget = item; dropPos = 'before'; }
                    else { item.classList.add('drop-after'); dropTarget = item; dropPos = 'after'; }
                    return;
                }
            }
            dropTarget = null; dropPos = null;
        }
        function onUp() {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('pointercancel', onUp);
            document.body.style.userSelect = '';
            wrap.classList.remove('dragging');
            clearMarkers();
            if (moved && dropTarget && dropPos) {
                if (dropPos === 'before') list.insertBefore(wrap, dropTarget);
                else list.insertBefore(wrap, dropTarget.nextSibling);
                const newOrder = Array.from(list.querySelectorAll('.sidebar-module')).map(el => el.dataset.moduleId);
                state.modules.sort((a, b) => newOrder.indexOf(a.def.id) - newOrder.indexOf(b.def.id));
            }
        }
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
    }

    function sidebarDefaultWidth() {
        return Math.max(MIN_WIDTH_PX_FLOOR, Math.round(window.innerWidth * DEFAULT_WIDTH_VW / 100));
    }

    function setSidebarWidth(px) {
        // Set on :root so body.sidebar-open can read it for padding-right
        document.documentElement.style.setProperty('--sidebar-width', px + 'px');
    }

    function updateSidebarTop() {
        const sidebar = $('appSidebar');
        if (!sidebar) return;
        const header = document.querySelector('.header');
        const h = header ? header.offsetHeight : 0;
        sidebar.style.top = h + 'px';
    }

    // ── Resize handle ──
    function attachResizeHandle() {
        const handle = $('sidebarResizeHandle');
        const sidebar = $('appSidebar');
        if (!handle || !sidebar) return;
        handle.addEventListener('pointerdown', (e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            document.body.classList.add('sidebar-resizing');
            const onMove = (ev) => {
                const w = window.innerWidth - ev.clientX;
                const minPx = Math.max(MIN_WIDTH_PX_FLOOR, Math.round(window.innerWidth * MIN_WIDTH_VW / 100));
                const maxPx = window.innerWidth * (MAX_WIDTH_VW / 100);
                const clamped = Math.max(minPx, Math.min(maxPx, w));
                setSidebarWidth(clamped);
            };
            const onUp = () => {
                document.body.classList.remove('sidebar-resizing');
                window.removeEventListener('pointermove', onMove);
                window.removeEventListener('pointerup', onUp);
                window.removeEventListener('pointercancel', onUp);
            };
            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', onUp);
            window.addEventListener('pointercancel', onUp);
        });
    }

    // ── In-view focus tracking ──
    let pendingFocusRaf = 0;
    function setupObserver() {
        if (state.observer) state.observer.disconnect();
        if (!isDesktop() || !state.open) return;
        const cards = document.querySelectorAll('#resultsWrapper .verse-card');
        if (!cards.length) return;
        const ratios = new Map();
        state.observer = new IntersectionObserver((entries) => {
            entries.forEach(e => { ratios.set(e.target, e.intersectionRatio); });
            if (pendingFocusRaf) cancelAnimationFrame(pendingFocusRaf);
            pendingFocusRaf = requestAnimationFrame(() => {
                pendingFocusRaf = 0;
                let bestEl = null, bestRatio = 0;
                ratios.forEach((r, el) => { if (r > bestRatio) { bestRatio = r; bestEl = el; } });
                if (!bestEl || bestRatio <= 0) return;
                const m = (bestEl.id || '').match(/^card-(\d+)$/);
                if (!m) return;
                const blockIdx = parseInt(m[1], 10);
                if (state.focus && state.focus.blockIdx === blockIdx) return;
                const block = (window.mainData && window.mainData[blockIdx]) || null;
                state.focus = { blockIdx, side: 'main', block };
                document.querySelectorAll('.verse-card.sidebar-focused').forEach(el => el.classList.remove('sidebar-focused'));
                bestEl.classList.add('sidebar-focused');
                state.modules.forEach(entry => {
                    if (entry.mounted && entry.def.onFocusChange) {
                        try { entry.def.onFocusChange(state.focus); } catch (e) { console.error(e); }
                    }
                });
            });
        }, { rootMargin: '-20% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });
        cards.forEach(c => state.observer.observe(c));
    }

    // ── Open / close ──
    function open() {
        if (!isDesktop()) return;
        if (state.open) return;
        state.open = true;
        setSidebarWidth(sidebarDefaultWidth());
        // Mount any registered modules
        state.modules.forEach(mountModuleDOM);
        // Trigger transition on next frame so layout is ready
        requestAnimationFrame(() => {
            document.body.classList.add('sidebar-open');
            setupObserver();
        });
        emit('opened');
    }

    function close() {
        if (!state.open) return;
        state.open = false;
        document.body.classList.remove('sidebar-open');
        // Clear all module content per requirement
        state.modules.forEach(entry => {
            try { entry.def.clearAll && entry.def.clearAll(); } catch (e) { console.error(e); }
        });
        // Unmount after animation completes
        const sidebar = $('appSidebar');
        const cleanup = () => {
            state.modules.forEach(unmountModuleDOM);
            if (state.observer) { state.observer.disconnect(); state.observer = null; }
            document.querySelectorAll('.verse-card.sidebar-focused').forEach(el => el.classList.remove('sidebar-focused'));
            // Reset pin buttons in study tray now that pins are cleared
            try { window.refreshPinButtons && window.refreshPinButtons(); } catch {}
            emit('closed');
        };
        if (sidebar) {
            const onEnd = (e) => {
                if (e.target !== sidebar || e.propertyName !== 'transform') return;
                sidebar.removeEventListener('transitionend', onEnd);
                cleanup();
            };
            sidebar.addEventListener('transitionend', onEnd);
            // Fallback in case transitionend doesn't fire
            setTimeout(() => { if (!state.open) cleanup(); }, 500);
        } else {
            cleanup();
        }
    }

    function toggle() { state.open ? close() : open(); }

    // Auto-close: called by modules after their content shrinks.
    // If every module reports isEmpty, close the sidebar.
    function checkAutoClose() {
        if (!state.open) return;
        if (state.modules.length === 0) { close(); return; }
        const allEmpty = state.modules.every(entry => {
            const fn = entry.def.isEmpty;
            return typeof fn === 'function' ? !!fn() : false;
        });
        if (allEmpty) close();
    }

    function ensureOpen() {
        if (!state.open && isDesktop()) open();
    }

    function register(def) {
        if (!def || !def.id) throw new Error('Module needs id');
        if (state.modules.some(m => m.def.id === def.id)) return;
        const entry = { def, container: null, wrap: null, collapsed: false, mounted: false };
        state.modules.push(entry);
        if (state.open) mountModuleDOM(entry);
    }

    function unregister(id) {
        const idx = state.modules.findIndex(m => m.def.id === id);
        if (idx < 0) return;
        unmountModuleDOM(state.modules[idx]);
        state.modules.splice(idx, 1);
    }

    function refreshObserver() { if (state.open) setupObserver(); }

    // Broadcast that mainData[0] has changed. Modules subscribed to
    // 'mainBlockChanged' re-bind their content; this is the canonical signal
    // that the text the user is reading has changed (navigation, expand/
    // collapse, fresh search, isolation). Fires regardless of sidebar open
    // state so future modules with persistent state can stay in sync.
    function notifyMainBlockChanged() {
        const md = window.mainData;
        const payload = (md && md.length)
            ? { blockIdx: 0, block: md[0] }
            : { blockIdx: 0, block: null };
        emit('mainBlockChanged', payload);
    }

    function notifyStateChange(appState) {
        state.modules.forEach(entry => {
            if (entry.mounted && entry.def.onStateChange) {
                try { entry.def.onStateChange(appState); } catch (e) { console.error(e); }
            }
        });
    }

    function setFocus(focus) {
        state.focus = focus;
        state.modules.forEach(entry => {
            if (entry.mounted && entry.def.onFocusChange) {
                try { entry.def.onFocusChange(focus); } catch (e) { console.error(e); }
            }
        });
    }

    function init() {
        const closeBtn = $('sidebarCloseBtn');
        if (closeBtn) closeBtn.addEventListener('click', close);
        attachResizeHandle();
        updateSidebarTop();
        window.addEventListener('resize', () => {
            if (!isDesktop() && state.open) close();
            updateSidebarTop();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public subscribe — used by AppModuleHost (mobile) so its modules get
    // the same 'mainBlockChanged' / 'opened' / 'closed' events the desktop
    // sidebar ctx exposes. Returns a teardown function.
    function subscribe(event, fn) {
        if (!state.listeners.has(event)) state.listeners.set(event, new Set());
        state.listeners.get(event).add(fn);
        return () => state.listeners.get(event).delete(fn);
    }

    window.AppSidebar = {
        register, unregister,
        open, close, toggle, ensureOpen, checkAutoClose,
        setFocus, refreshObserver, notifyStateChange, notifyMainBlockChanged,
        subscribe,
        getState: () => ({ open: state.open, focus: state.focus }),
        isOpen: () => state.open,
    };
})();
