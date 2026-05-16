/* AppModuleHost — mobile bottom-sheet that hosts ONE module at a time.
   Replaces the old multi-module AppDrawer. ≤700px only. */
window.AppModuleHost = (() => {
    const MOBILE_BP = 701;
    function isMobile() { return window.innerWidth < MOBILE_BP; }

    const state = {
        active: null,           // {id, def, ctx}
        modules: new Map(),     // id → def
    };

    function hostEl() { return document.getElementById('moduleHost'); }
    function bodyEl() { return document.getElementById('moduleHostBody'); }

    function setOpen(open) {
        const h = hostEl();
        if (h) {
            h.setAttribute('data-state', open ? 'open' : 'closed');
            h.setAttribute('aria-hidden', open ? 'false' : 'true');
        }
        document.body.classList.toggle('module-open', open);
    }

    function register(def) {
        if (!def || !def.id) return;
        state.modules.set(def.id, def);
    }

    function makeCtx() {
        return {
            jumpToVerse(spec) { if (window.scrollToBlockIdx) window.scrollToBlockIdx(spec); },
            getBlock(idx) { return window.mainData ? window.mainData[idx] : null; },
            getFocus() { return null; },
            // Delegate to AppSidebar's event bus so mobile modules receive the
            // same 'mainBlockChanged' notifications the desktop sidebar gets.
            // Without this, modules mounted on mobile never rebind on navigation.
            subscribe(event, fn) {
                if (window.AppSidebar && typeof window.AppSidebar.subscribe === 'function') {
                    return window.AppSidebar.subscribe(event, fn);
                }
                return () => {};
            },
        };
    }

    function mountModule(def) {
        const body = bodyEl();
        if (!body) return null;
        const ctx = makeCtx();
        try { def.mount(body, ctx); } catch (e) { console.error('module mount', def.id, e); }
        return ctx;
    }

    function unmountActive() {
        if (!state.active) return;
        const prev = state.active;
        state.active = null;
        try { if (prev.def.unmount) prev.def.unmount(); } catch {}
        try { if (prev.def.clearAll) prev.def.clearAll(); } catch {}
        const body = bodyEl();
        if (body) body.innerHTML = '';
        if (typeof window.refreshPinButtons === 'function') window.refreshPinButtons();
        try { window.AppModuleBus && window.AppModuleBus.setActive(prev.id, false); } catch {}
    }

    function openModule(id, originBlockIdx) {
        if (!isMobile()) return;
        const def = state.modules.get(id);
        if (!def) return;
        const body = bodyEl();
        if (!body) return;
        // Fall back to AppModuleBus.pending if caller didn't pass an origin.
        const pc = window.AppModuleBus && window.AppModuleBus.getPendingContext
            ? window.AppModuleBus.getPendingContext() : null;
        const origin = (originBlockIdx != null) ? originBlockIdx : (pc ? pc.origin : null);
        const source = pc ? pc.source : null;

        // Same module already active: just ensure host is visible.
        if (state.active && state.active.id === id) {
            if (hostEl() && hostEl().getAttribute('data-state') !== 'open') setOpen(true);
            try { window.AppModuleBus && window.AppModuleBus.setActive(id, true, origin, source); } catch {}
            return;
        }

        // Switching modules: crossfade content, container stays put.
        if (state.active) {
            body.style.transition = 'opacity 0.15s ease';
            body.style.opacity = '0';
            const swap = () => {
                unmountActive();
                const ctx = mountModule(def);
                if (ctx) state.active = { id, def, ctx };
                try { window.AppModuleBus && window.AppModuleBus.setActive(id, true, origin, source); } catch {}
                requestAnimationFrame(() => { body.style.opacity = '1'; });
            };
            setTimeout(swap, 160);
            return;
        }

        // First open: mount, then slide host up.
        body.style.transition = '';
        body.style.opacity = '1';
        const ctx = mountModule(def);
        if (ctx) state.active = { id, def, ctx };
        try { window.AppModuleBus && window.AppModuleBus.setActive(id, true, origin, source); } catch {}
        // Force a layout flush so the slide animation runs from the closed transform.
        void (hostEl() && hostEl().offsetHeight);
        setOpen(true);
    }

    function closeModule() {
        if (!state.active && !document.body.classList.contains('module-open')) return;
        const h = hostEl();
        // Drop body.module-open immediately so MVB regains its swipe handle the
        // moment the close starts (otherwise the handle is missing during the
        // 0.32s slide-out and pops back in afterwards). The module-host slides
        // behind MVB via its own z-index / overflow clipping, not via the
        // module-open class.
        setOpen(false);
        const cleanup = () => { unmountActive(); };
        if (h) {
            const onEnd = (ev) => {
                if (ev.target !== h || ev.propertyName !== 'transform') return;
                h.removeEventListener('transitionend', onEnd);
                cleanup();
            };
            h.addEventListener('transitionend', onEnd);
            // Fallback if transitionend never fires (e.g. reduced-motion).
            setTimeout(() => { if (!state.active) cleanup(); }, 500);
        } else {
            cleanup();
        }
    }

    function isOpen() { return !!state.active; }
    function getActiveId() { return state.active ? state.active.id : null; }

    // ── Drag on the handle: drag down > 60px closes; <60px springs back. ──
    function initDrag() {
        const handle = document.getElementById('moduleHostHandle');
        if (!handle) return;
        let dragging = false, startY = 0, lastDy = 0;

        handle.addEventListener('pointerdown', (e) => {
            if (!isMobile() || !state.active) return;
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            dragging = true;
            startY = e.clientY;
            lastDy = 0;
            try { handle.setPointerCapture(e.pointerId); } catch {}
            e.preventDefault();
            const h = hostEl();
            if (h) h.style.transition = 'none';
        });

        handle.addEventListener('pointermove', (e) => {
            if (!dragging) return;
            e.preventDefault();
            const dy = e.clientY - startY;
            lastDy = Math.max(0, dy);
            const h = hostEl();
            if (h) h.style.transform = `translateY(${lastDy}px)`;
        });

        function endDrag(e) {
            if (!dragging) return;
            dragging = false;
            try { handle.releasePointerCapture(e.pointerId); } catch {}
            const h = hostEl();
            if (h) { h.style.transition = ''; h.style.transform = ''; }
            if (lastDy > 60) closeModule();
        }
        handle.addEventListener('pointerup', endDrag);
        handle.addEventListener('pointercancel', endDrag);
    }

    function init() {
        initDrag();
        window.addEventListener('resize', () => {
            if (!isMobile() && state.active) closeModule();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        register,
        openModule,
        closeModule,
        isOpen,
        getActiveId,
        isMobile,
    };
})();
