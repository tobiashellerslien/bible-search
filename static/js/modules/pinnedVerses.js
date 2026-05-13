// ── Pinned-verses sidebar module ──
// In-memory only. Cleared whenever sidebar closes.
// Spec shape: {book, ch_start, vs_start, ch_end, vs_end, version, label, text, ts}
(function () {
    let _pins = [];
    const seenKeys = new Set();
    let listEl = null;

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
        if (window.AppDrawer && window.AppDrawer.isMobile()) {
            window.AppDrawer.ensureOpen();
        } else if (window.AppSidebar) {
            window.AppSidebar.ensureOpen();
        }
        return true;
    }

    function remove(spec) {
        const key = pinKey(spec);
        const before = _pins.length;
        _pins = _pins.filter(p => pinKey(p) !== key);
        if (_pins.length === before) return false;
        notifyChange();
        if (window.AppDrawer && window.AppDrawer.isMobile()) {
            window.AppDrawer.checkAutoClose();
        } else if (window.AppSidebar) {
            window.AppSidebar.checkAutoClose();
        }
        return true;
    }

    function toggle(spec) {
        if (isPinned(spec)) { remove(spec); return false; }
        add(spec); return true;
    }

    function escapeHtml(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[c]);
    }

    function versionLabel(verId) {
        if (window.allVersionsList) {
            const v = window.allVersionsList.find(v => String(v.id) === String(verId));
            if (v) return v.name;
        }
        return verId;
    }

    function render() {
        if (!listEl) return;
        if (_pins.length === 0) {
            listEl.innerHTML = `<div class="pinned-empty">Ingen vers er festet ennå. Trykk 📌 i et vers for å feste det.</div>`;
            return;
        }
        const newKeys = [];
        let html = '<div class="pinned-list">';
        _pins.forEach(p => {
            const key = pinKey(p);
            const isNew = !seenKeys.has(key);
            if (isNew) newKeys.push(key);
            html += `<div class="pinned-item${isNew ? ' pinned-item-new' : ''}" data-key="${escapeHtml(key)}" role="button" tabindex="0">
                <div class="pinned-item-content">
                    <div class="pinned-item-ref">${escapeHtml(p.label || '')}</div>
                    <div class="pinned-item-text">${escapeHtml(p.text || '')}</div>
                    <div class="pinned-item-version">${escapeHtml(versionLabel(p.version))}</div>
                </div>
                <button class="pinned-item-remove" title="Fjern" aria-label="Fjern">&times;</button>
            </div>`;
        });
        html += '</div>';
        listEl.innerHTML = html;
        // Update seen-keys set
        const currentKeys = new Set(_pins.map(pinKey));
        for (const k of [...seenKeys]) if (!currentKeys.has(k)) seenKeys.delete(k);
        newKeys.forEach(k => seenKeys.add(k));

        listEl.querySelectorAll('.pinned-item').forEach(el => {
            const key = el.dataset.key;
            const item = _pins.find(p => pinKey(p) === key);
            if (!item) return;
            el.querySelector('.pinned-item-remove').addEventListener('click', (e) => {
                e.stopPropagation();
                remove(item);
            });
            const openItem = () => {
                if (typeof window.openPinnedVerse === 'function') window.openPinnedVerse(item);
                if (window.AppDrawer && window.AppDrawer.isMobile() && window.AppDrawer.isExpanded && window.AppDrawer.isExpanded()) {
                    window.AppDrawer.collapse();
                }
            };
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openItem(); }
            });
            // Combined click + drag handler via pointerdown
            el.addEventListener('pointerdown', (e) => {
                if (e.target.closest('.pinned-item-remove')) return;
                if (e.pointerType === 'mouse' && e.button !== 0) return;
                e.preventDefault(); // suppress native click so we control it in onUp
                try { el.setPointerCapture(e.pointerId); } catch {}
                const startY = e.clientY;
                let moved = false;
                let dropTarget = null, dropPos = null;

                function clearMarkers() {
                    listEl.querySelectorAll('.pinned-drop-before, .pinned-drop-after').forEach(x => {
                        x.classList.remove('pinned-drop-before', 'pinned-drop-after');
                    });
                }
                function onMove(ev) {
                    if (!moved && Math.abs(ev.clientY - startY) < 5) return;
                    if (!moved) {
                        moved = true;
                        el.classList.add('dragging');
                        document.body.style.userSelect = 'none';
                        const list = listEl.querySelector('.pinned-list');
                        if (list) list.classList.add('pinned-list--dragging');
                    }
                    clearMarkers();
                    dropTarget = null; dropPos = null;
                    const items = Array.from(listEl.querySelectorAll('.pinned-item'));
                    for (const it of items) {
                        if (it === el) continue;
                        const r = it.getBoundingClientRect();
                        if (ev.clientY >= r.top && ev.clientY <= r.bottom) {
                            const mid = r.top + r.height / 2;
                            if (ev.clientY < mid) { it.classList.add('pinned-drop-before'); dropTarget = it; dropPos = 'before'; }
                            else { it.classList.add('pinned-drop-after'); dropTarget = it; dropPos = 'after'; }
                            return;
                        }
                    }
                }
                function onUp() {
                    window.removeEventListener('pointermove', onMove);
                    window.removeEventListener('pointerup', onUp);
                    window.removeEventListener('pointercancel', onUp);
                    document.body.style.userSelect = '';
                    el.classList.remove('dragging');
                    const list = listEl.querySelector('.pinned-list');
                    if (list) list.classList.remove('pinned-list--dragging');
                    clearMarkers();
                    if (!moved) {
                        openItem();
                    } else if (dropTarget && dropPos) {
                        // FLIP: record current tops before reordering
                        const oldTops = {};
                        listEl.querySelectorAll('.pinned-item').forEach(item => {
                            oldTops[item.dataset.key] = item.getBoundingClientRect().top;
                        });
                        // Reorder _pins
                        const fromKey = el.dataset.key;
                        const toKey = dropTarget.dataset.key;
                        const fromIdx = _pins.findIndex(p => pinKey(p) === fromKey);
                        const fromItem = _pins[fromIdx];
                        const newPins = _pins.filter((_, i) => i !== fromIdx);
                        const toIdxInNew = newPins.findIndex(p => pinKey(p) === toKey);
                        const insertAt = dropPos === 'before' ? toIdxInNew : toIdxInNew + 1;
                        newPins.splice(insertAt, 0, fromItem);
                        _pins.length = 0;
                        newPins.forEach(p => _pins.push(p));
                        render();
                        // FLIP: animate each item from its old position to its new position
                        requestAnimationFrame(() => {
                            listEl.querySelectorAll('.pinned-item').forEach(item => {
                                const dy = (oldTops[item.dataset.key] ?? null);
                                if (dy === null) return;
                                const newTop = item.getBoundingClientRect().top;
                                const delta = dy - newTop;
                                if (Math.abs(delta) < 1) return;
                                item.style.transition = 'none';
                                item.style.transform = `translateY(${delta}px)`;
                                requestAnimationFrame(() => {
                                    item.style.transition = 'transform 0.22s cubic-bezier(0.2, 0.8, 0.3, 1)';
                                    item.style.transform = '';
                                    item.addEventListener('transitionend', () => {
                                        item.style.transition = '';
                                    }, { once: true });
                                });
                            });
                        });
                    }
                }
                window.addEventListener('pointermove', onMove);
                window.addEventListener('pointerup', onUp);
                window.addEventListener('pointercancel', onUp);
            });
        });
    }

    function notifyChange() {
        render();
        if (typeof window.refreshPinButtons === 'function') window.refreshPinButtons();
    }

    const moduleDef = {
        id: 'pinnedVerses',
        title: 'Festede vers',
        icon: '📌',
        mount(container, ctx) {
            listEl = container;
            render();
            // Inject clear-all + insert-all into whichever module wrapper hosts us
            // (sidebar on PC, drawer card on mobile — both expose .sidebar-module-actions).
            const wrap = container.closest('.sidebar-module, .drawer-module-card');
            if (wrap) {
                const actions = wrap.querySelector('.sidebar-module-actions');
                if (actions && !actions.querySelector('.sidebar-module-clear-all')) {
                    const clearBtn = document.createElement('button');
                    clearBtn.className = 'sidebar-module-clear-all';
                    clearBtn.title = 'Fjern alle festede vers';
                    clearBtn.setAttribute('aria-label', 'Fjern alle festede vers');
                    clearBtn.innerHTML = '&times;';
                    clearBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        _pins = [];
                        seenKeys.clear();
                        notifyChange();
                        if (window.AppDrawer && window.AppDrawer.isMobile()) window.AppDrawer.checkAutoClose();
                        else if (window.AppSidebar) window.AppSidebar.checkAutoClose();
                    });
                    actions.insertBefore(clearBtn, actions.firstChild);

                    const insertBtn = document.createElement('button');
                    insertBtn.className = 'pinned-insert-all-btn';
                    insertBtn.title = 'Åpne alle festede vers som blokker i visningen';
                    insertBtn.setAttribute('aria-label', 'Åpne alle festede vers i visning');
                    insertBtn.innerHTML = `<span>Åpne alle</span>`;
                    insertBtn.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        if (!_pins.length) return;
                        insertBtn.disabled = true;
                        if (typeof window.insertBlocksIntoView === 'function') {
                            await window.insertBlocksIntoView(_pins.slice());
                        }
                        insertBtn.disabled = false;
                        if (window.AppDrawer && window.AppDrawer.isMobile()) {
                            window.AppDrawer.collapse();
                        }
                    });
                    actions.insertBefore(insertBtn, clearBtn);
                }
            }
        },
        unmount() {
            listEl = null;
        },
        isEmpty() { return _pins.length === 0; },
        clearAll() {
            _pins = [];
            seenKeys.clear();
            // No render here — module is being unmounted
        },
    };

    window.PinnedVerses = {
        moduleDef,
        toggle, isPinned, add, remove,
        list: () => _pins.slice(),
    };

    function tryRegister() {
        if (window.AppSidebar && window.AppSidebar.register) {
            window.AppSidebar.register(moduleDef);
            if (window.AppDrawer && window.AppDrawer.register) {
                window.AppDrawer.register(moduleDef);
            }
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
