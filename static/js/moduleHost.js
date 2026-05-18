/* AppModuleHost — mobile bottom-sheet that hosts ONE module at a time.
   Replaces the old multi-module AppDrawer. ≤700px only. */
window.AppModuleHost = (() => {
    const MOBILE_BP = 701;
    function isMobile() { return window.innerWidth < MOBILE_BP; }

    const state = {
        active: null,           // {id, def, ctx}
        modules: new Map(),     // id → def
    };
    // Cancels an in-flight close (pending transitionend + fallback timer) so a
    // rapid open-after-close doesn't get clobbered by the stale cleanup.
    let pendingCloseCancel = null;

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
        // If a close is in flight, cancel its pending cleanup first so the
        // stale transitionend can't tear down the module we're about to mount.
        // Only unmount the old module if we're switching to a different one —
        // for a same-module re-open, the caller (e.g. showForMarkedVerses) has
        // already updated module state synchronously, and running clearAll()
        // here would wipe it (causing a white/empty re-open).
        if (pendingCloseCancel) {
            const cancel = pendingCloseCancel;
            pendingCloseCancel = null;
            cancel();
            if (state.active && state.active.id !== id) {
                unmountActive();
            }
        }
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
        // Clear active state immediately so the tray button highlight reflects
        // the close at once rather than waiting for the slide-out to finish.
        if (state.active) {
            try { window.AppModuleBus && window.AppModuleBus.setActive(state.active.id, false); } catch {}
        }
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
                pendingCloseCancel = null;
                cleanup();
            };
            h.addEventListener('transitionend', onEnd);
            // Fallback if transitionend never fires (e.g. reduced-motion).
            const fallback = setTimeout(() => {
                pendingCloseCancel = null;
                h.removeEventListener('transitionend', onEnd);
                cleanup();
            }, 500);
            pendingCloseCancel = () => {
                h.removeEventListener('transitionend', onEnd);
                clearTimeout(fallback);
            };
        } else {
            cleanup();
        }
    }

    function isOpen() { return !!state.active; }
    function getActiveId() { return state.active ? state.active.id : null; }

    // ── Drag-to-dismiss: drag down > 60px closes; <60px springs back. ──
    // Active anywhere in the upper zone of the host (handle + header text/buttons),
    // so users have a much larger target than the thin grab bar.
    function initDrag() {
        const handle = document.getElementById('moduleHostHandle');
        const host = hostEl();
        if (!handle || !host) return;

        // Height (px) from the top of the host within which a downward swipe
        // initiates dismissal. Covers the handle (~36px) plus the typical
        // module header row (scope label + buttons).
        const TOP_ZONE = 110;
        const ACTIVATE_DY = 8; // px of downward travel before we hijack the gesture

        let dragging = false;     // actively translating the host
        let arming = false;       // pointer down in zone, waiting to see direction
        let startY = 0, startX = 0, lastDy = 0;
        let activePointerId = null;
        let capturedOn = null;

        function inTopZone(clientY) {
            const rect = host.getBoundingClientRect();
            return clientY >= rect.top && clientY <= rect.top + TOP_ZONE;
        }

        function beginArm(e, fromHandle) {
            if (!isMobile() || !state.active) return false;
            if (e.pointerType === 'mouse' && e.button !== 0) return false;
            if (!fromHandle && !inTopZone(e.clientY)) return false;
            arming = true;
            dragging = fromHandle; // handle starts dragging immediately
            startY = e.clientY;
            startX = e.clientX;
            lastDy = 0;
            activePointerId = e.pointerId;
            if (fromHandle) {
                try { handle.setPointerCapture(e.pointerId); capturedOn = handle; } catch {}
                e.preventDefault();
                host.style.transition = 'none';
            }
            return true;
        }

        function onMove(e) {
            if (!arming || e.pointerId !== activePointerId) return;
            const dy = e.clientY - startY;
            const dx = e.clientX - startX;
            if (!dragging) {
                // Only hijack on a clearly downward gesture; let upward/lateral
                // gestures (scroll, button drag-cancel) behave normally.
                if (dy > ACTIVATE_DY && Math.abs(dy) > Math.abs(dx)) {
                    dragging = true;
                    try { host.setPointerCapture(e.pointerId); capturedOn = host; } catch {}
                    host.style.transition = 'none';
                } else if (dy < -ACTIVATE_DY || Math.abs(dx) > ACTIVATE_DY) {
                    // Cancel arming — user is doing something else.
                    arming = false;
                    return;
                } else {
                    return;
                }
            }
            e.preventDefault();
            lastDy = Math.max(0, dy);
            host.style.transform = `translateY(${lastDy}px)`;
        }

        function endDrag(e) {
            if (!arming || e.pointerId !== activePointerId) return;
            const wasDragging = dragging;
            arming = false;
            dragging = false;
            if (capturedOn) {
                try { capturedOn.releasePointerCapture(e.pointerId); } catch {}
                capturedOn = null;
            }
            activePointerId = null;
            if (wasDragging) {
                host.style.transition = '';
                host.style.transform = '';
                if (lastDy > 60) closeModule();
            }
        }

        handle.addEventListener('pointerdown', (e) => { beginArm(e, true); });
        host.addEventListener('pointerdown', (e) => {
            if (e.target.closest && e.target.closest('#moduleHostHandle')) return;
            beginArm(e, false);
        });
        host.addEventListener('pointermove', onMove);
        host.addEventListener('pointerup', endDrag);
        host.addEventListener('pointercancel', endDrag);
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
