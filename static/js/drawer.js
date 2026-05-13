/* AppDrawer — mobile bottom-sheet module system (≤700px only) */
window.AppDrawer = (() => {
    const MOBILE_BP = 701;

    function isMobile() { return window.innerWidth < MOBILE_BP; }

    let state = {
        phase: 'closed', // 'closed' | 'collapsed' | 'expanded'
        modules: [],     // registered module defs
        mounted: {}      // id → {container, def}
    };

    const phaseListeners = [];
    function setPhase(p) {
        if (state.phase === p) return;
        state.phase = p;
        document.body.classList.remove('drawer-closed', 'drawer-collapsed', 'drawer-expanded');
        document.body.classList.add('drawer-' + p);
        refreshHandleLabel();
        phaseListeners.forEach(fn => { try { fn(p); } catch {} });
    }
    function onPhaseChange(fn) { phaseListeners.push(fn); }

    function refreshHandleLabel() {
        const el = document.getElementById('drawerHandleLabel');
        if (!el) return;
        const active = state.modules.filter(def => !def.isEmpty || !def.isEmpty());
        const parts = active.map(def => `${def.icon || ''} ${def.title || def.id}`.trim());
        el.textContent = parts.join('  ·  ');
    }

    const drawerEl = () => document.getElementById('appDrawer');
    const modulesEl = () => document.getElementById('drawerModules');

    function escapeHtml(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[c]);
    }

    function mountAll() {
        const el = modulesEl();
        if (!el) return;
        el.innerHTML = '';
        state.mounted = {};
        for (const def of state.modules) {
            // Reuse sidebar-module class so styling, animations, and chevron are consistent
            // with the desktop sidebar. drawer-module-card stays for drawer-specific tweaks.
            const card = document.createElement('section');
            card.className = 'sidebar-module drawer-module-card';
            card.dataset.moduleId = def.id;
            card.dataset.collapsed = 'false';

            const header = document.createElement('div');
            header.className = 'sidebar-module-header drawer-module-header';
            header.innerHTML = `
                ${def.icon ? `<span class="sidebar-module-icon" aria-hidden="true">${def.icon}</span>` : ''}
                <span class="sidebar-module-title">${escapeHtml(def.title || def.id)}</span>
                <span class="sidebar-module-actions"></span>
                <span class="sidebar-module-collapse" aria-hidden="true">
                    <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4 L6 8 L10 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
            `;
            header.addEventListener('click', (e) => {
                if (e.target.closest('.sidebar-module-actions, button')) return;
                const cur = card.dataset.collapsed === 'true';
                card.dataset.collapsed = cur ? 'false' : 'true';
            });

            const body = document.createElement('div');
            body.className = 'sidebar-module-body drawer-module-body';

            card.appendChild(header);
            card.appendChild(body);
            el.appendChild(card);

            const ctx = makeCtx(def);
            try { def.mount(body, ctx); } catch (e) { console.error('drawer mount error', def.id, e); }
            state.mounted[def.id] = { card, body, def };
        }
    }

    function unmountAll() {
        for (const id of Object.keys(state.mounted)) {
            const m = state.mounted[id];
            try { if (m.def.unmount) m.def.unmount(); } catch {}
        }
        state.mounted = {};
        const el = modulesEl();
        if (el) el.innerHTML = '';
    }

    function makeCtx(def) {
        return {
            jumpToVerse(spec) { if (window.scrollToBlockIdx) window.scrollToBlockIdx(spec); },
            getBlock(idx) { return window.mainData ? window.mainData[idx] : null; },
            getFocus() { return null; },
            subscribe() {}
        };
    }

    function open() {
        if (!isMobile()) return;
        if (state.phase !== 'closed') return;
        const el = drawerEl();
        if (!el) return;
        // Mount on open so modules are pre-rendered behind the handle and ready when user drags up.
        if (Object.keys(state.mounted).length === 0) mountAll();
        el.classList.remove('drawer-expanded');
        el.classList.add('drawer-collapsed');
        setPhase('collapsed');
    }

    function expand() {
        if (!isMobile()) return;
        if (state.phase === 'expanded') return;
        const el = drawerEl();
        if (state.phase === 'closed' && el) {
            // Pre-position at collapsed so the slide-up runs from the visible handle, not offscreen.
            if (Object.keys(state.mounted).length === 0) mountAll();
            el.classList.add('drawer-collapsed');
            void el.offsetHeight;
        }
        if (el) {
            el.classList.remove('drawer-collapsed');
            el.classList.add('drawer-expanded');
        }
        setPhase('expanded');
    }

    function collapse() {
        if (!isMobile()) return;
        if (state.phase === 'closed') return;
        const el = drawerEl();
        if (el) { el.classList.remove('drawer-expanded'); el.classList.add('drawer-collapsed'); }
        setPhase('collapsed');
    }

    function close() {
        if (state.phase === 'closed') return;
        const el = drawerEl();
        if (el) el.classList.remove('drawer-collapsed', 'drawer-expanded');
        setPhase('closed');
        // Wait for slide-out before unmounting so content doesn't pop while animating.
        const cleanup = () => {
            unmountAll();
            for (const def of state.modules) {
                try { if (def.clearAll) def.clearAll(); } catch {}
            }
            if (window.refreshPinButtons) window.refreshPinButtons();
        };
        if (el) {
            const onEnd = (ev) => {
                if (ev.target !== el || ev.propertyName !== 'transform') return;
                el.removeEventListener('transitionend', onEnd);
                cleanup();
            };
            el.addEventListener('transitionend', onEnd);
            setTimeout(() => { if (state.phase === 'closed') cleanup(); }, 500);
        } else {
            cleanup();
        }
    }

    function ensureOpen() {
        if (!isMobile()) return;
        if (state.phase === 'closed') open();
        else refreshHandleLabel();
    }

    function checkAutoClose() {
        if (!isMobile()) return;
        const allModulesEmpty = state.modules.every(def => !def.isEmpty || def.isEmpty());
        if (allModulesEmpty && state.phase !== 'closed') close();
        else refreshHandleLabel();
    }

    function register(moduleDef) {
        if (state.modules.find(m => m.id === moduleDef.id)) return;
        state.modules.push(moduleDef);
    }

    // ── Drag gesture on handle area ──
    function initDrag() {
        const handle = document.getElementById('drawerHandleArea');
        if (!handle) return;
        let startY = 0, startPhase = 'closed', dragging = false;

        function getMvbH() {
            const v = getComputedStyle(document.documentElement).getPropertyValue('--mvb-h').trim();
            return parseFloat(v) || 0;
        }
        function getSafeAreaBottom() {
            if (document.body.classList.contains('mvb-on')) return 0;
            const v = getComputedStyle(document.documentElement).getPropertyValue('--safe-area-bottom').trim();
            return parseFloat(v) || 0;
        }
        function getCollapsedH() {
            // Read the live CSS var so JS stays in sync with CSS (MVB-on overrides it).
            const v = getComputedStyle(document.documentElement).getPropertyValue('--drawer-collapsed-h').trim();
            return parseFloat(v) || 64;
        }
        function collapsedTranslatePx(h) {
            return Math.max(0, h - getCollapsedH() - getSafeAreaBottom() - getMvbH());
        }

        handle.addEventListener('pointerdown', e => {
            if (!isMobile()) return;
            dragging = true;
            startY = e.clientY;
            startPhase = state.phase;
            handle.setPointerCapture(e.pointerId);
            e.preventDefault();
            const el = drawerEl();
            if (el) el.style.transition = 'none'; // 1:1 follow during drag
        });

        handle.addEventListener('pointermove', e => {
            if (!dragging) return;
            e.preventDefault();
            const el = drawerEl();
            if (!el) return;
            const dy = e.clientY - startY;
            const h = el.offsetHeight;
            const startTranslate = startPhase === 'collapsed'
                ? collapsedTranslatePx(h)
                : startPhase === 'expanded' ? 0 : h;
            const clamped = Math.max(0, Math.min(h, startTranslate + dy));
            el.style.transform = `translateY(${clamped}px)`;
            // Sync MVB opacity: fully visible at collapsedTranslate, fading to 0 as drawer reaches expanded.
            const bar = document.getElementById('markedVersesBar');
            if (bar && bar.classList.contains('mvb-visible')) {
                const collapsedT = collapsedTranslatePx(h);
                if (collapsedT > 0) {
                    const ratio = Math.max(0, Math.min(1, (collapsedT - clamped) / collapsedT));
                    bar.style.opacity = String(1 - ratio);
                }
            }
        });

        function endDrag(e) {
            if (!dragging) return;
            dragging = false;
            try { handle.releasePointerCapture(e.pointerId); } catch {}
            const el = drawerEl();
            if (el) {
                el.style.transition = ''; // restore CSS transition
                el.style.transform = '';   // hand back to class
            }
            const bar = document.getElementById('markedVersesBar');
            if (bar) bar.style.opacity = '';
            const dy = e.clientY - startY;
            const tap = Math.abs(dy) < 8;
            if (startPhase === 'collapsed') {
                if (tap) expand();
                else if (dy < -40) expand();
                else if (dy > 40) close();
            } else if (startPhase === 'expanded') {
                if (tap) collapse();
                else if (dy > 60) collapse();
            } else if (startPhase === 'closed') {
                if (tap || dy < -20) open();
            }
        }
        handle.addEventListener('pointerup', endDrag);
        handle.addEventListener('pointercancel', endDrag);
    }

    function init() {
        initDrag();

        const closeBtn = document.getElementById('drawerCloseBtn');
        if (closeBtn) closeBtn.addEventListener('click', () => close());

        window.addEventListener('resize', () => {
            if (!isMobile() && state.phase !== 'closed') {
                unmountAll();
                const el = drawerEl();
                if (el) el.classList.remove('drawer-collapsed', 'drawer-expanded');
                setPhase('closed');
            }
        });
        // Initialize body class
        document.body.classList.add('drawer-closed');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        register,
        open,
        expand,
        collapse,
        close,
        ensureOpen,
        checkAutoClose,
        onPhaseChange,
        isOpen: () => state.phase !== 'closed',
        isExpanded: () => state.phase === 'expanded',
        isMobile,
        getPhase: () => state.phase
    };
})();
