// ── Color picker (custom accent swatch + HSV popup) ──
(function() {
    const picker = document.getElementById('colorPicker');
    COLOR_PRESETS.forEach((c, i) => {
        const sw = document.createElement('button');
        sw.className = 'color-swatch' + (i === currentAccent ? ' active' : '');
        sw.dataset.idx = String(i);
        sw.style.background = c.l;
        sw.title = c.name;
        sw.setAttribute('aria-label', c.name + ' accent');
        sw.addEventListener('click', () => {
            window.currentAccent = i;
            localStorage.setItem('accentColor', String(i));
            applyAccent(i);
        });
        picker.appendChild(sw);
    });

    // Custom swatch — click opens color picker popup
    const customSw = document.createElement('button');
    customSw.className = 'color-swatch color-swatch-custom' + (currentAccent === 'custom' ? ' active' : '');
    customSw.dataset.idx = 'custom';
    const hasSavedCustom = !!localStorage.getItem('accentCustom');
    if (hasSavedCustom) {
        customSw.style.background = customAccentHex;
        customSw.style.color = _pencilColor(customAccentHex);
        customSw.classList.add('has-color');
    }
    customSw.title = I18N.no['settings.customAccent'];
    customSw.setAttribute('aria-label', 'Custom accent');
    customSw.addEventListener('click', () => {
        window.currentAccent = 'custom';
        localStorage.setItem('accentColor', 'custom');
        applyAccent('custom');
        openColorPopup(customSw);
    });
    picker.appendChild(customSw);

    // ── HSV helpers ──
    function _hexToHsv(hex) {
        const rgb = _hexToRgb(hex); if (!rgb) return { h: 0, s: 0, v: 1 };
        const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
        let h = 0;
        if (d !== 0) {
            switch (max) {
                case r: h = ((g - b) / d) % 6; break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h *= 60; if (h < 0) h += 360;
        }
        const s = max === 0 ? 0 : d / max;
        return { h, s, v: max };
    }
    function _hsvToHex(h, s, v) {
        const c = v * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c;
        let r = 0, g = 0, b = 0;
        if (h < 60) { r = c; g = x; }
        else if (h < 120) { r = x; g = c; }
        else if (h < 180) { g = c; b = x; }
        else if (h < 240) { g = x; b = c; }
        else if (h < 300) { r = x; b = c; }
        else { r = c; b = x; }
        const toHex = n => Math.round((n + m) * 255).toString(16).padStart(2, '0');
        return '#' + toHex(r) + toHex(g) + toHex(b);
    }

    // ── Color picker popup (singleton) ──
    let popupEl = null, popupState = null;
    function buildPopup() {
        const el = document.createElement('div');
        el.className = 'color-popup';
        el.innerHTML = `
            <div class="color-sv"><div class="color-thumb"></div></div>
            <div class="color-hue"><div class="color-thumb"></div></div>
            <div class="color-popup-foot">
                <div class="color-preview"></div>
                <div class="color-hex-wrap"><span>#</span><input class="color-hex-in" maxlength="6" spellcheck="false" autocomplete="off"></div>
            </div>`;
        document.body.appendChild(el);
        const sv = el.querySelector('.color-sv');
        const svThumb = sv.querySelector('.color-thumb');
        const hue = el.querySelector('.color-hue');
        const hueThumb = hue.querySelector('.color-thumb');
        const preview = el.querySelector('.color-preview');
        const hexIn = el.querySelector('.color-hex-in');
        const state = { h: 0, s: 1, v: 1, sv, svThumb, hue, hueThumb, preview, hexIn };

        function render(updateHexField) {
            sv.style.background = `linear-gradient(to top, #000, rgba(0,0,0,0)), linear-gradient(to right, #fff, hsl(${state.h}, 100%, 50%))`;
            const w = sv.clientWidth || 200, h = sv.clientHeight || 140;
            svThumb.style.left = (state.s * w) + 'px';
            svThumb.style.top = ((1 - state.v) * h) + 'px';
            const hw = hue.clientWidth || 200;
            hueThumb.style.left = ((state.h / 360) * hw) + 'px';
            const hex = _hsvToHex(state.h, state.s, state.v);
            preview.style.background = hex;
            if (updateHexField) hexIn.value = hex.slice(1);
            // Live apply
            window.customAccentHex = hex;
            localStorage.setItem('accentCustom', customAccentHex);
            customSw.style.background = customAccentHex;
            customSw.style.color = _pencilColor(customAccentHex);
            customSw.classList.add('has-color');
            applyAccent('custom');
        }
        state.render = render;

        function dragHandler(target, fn) {
            target.addEventListener('pointerdown', e => {
                target.setPointerCapture(e.pointerId);
                const rect = target.getBoundingClientRect();
                const move = ev => fn(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);
                move(e);
                const up = ev => {
                    target.releasePointerCapture(e.pointerId);
                    target.removeEventListener('pointermove', move);
                    target.removeEventListener('pointerup', up);
                    target.removeEventListener('pointercancel', up);
                };
                target.addEventListener('pointermove', move);
                target.addEventListener('pointerup', up);
                target.addEventListener('pointercancel', up);
                e.preventDefault();
            });
        }
        dragHandler(sv, (x, y, w, h) => {
            state.s = Math.max(0, Math.min(1, x / w));
            state.v = Math.max(0, Math.min(1, 1 - y / h));
            render(true);
        });
        dragHandler(hue, (x, y, w) => {
            state.h = Math.max(0, Math.min(359.999, (x / w) * 360));
            render(true);
        });
        hexIn.addEventListener('input', () => {
            let v = hexIn.value.trim().replace(/^#/, '');
            if (!/^[0-9a-fA-F]{6}$/.test(v)) return;
            const hsv = _hexToHsv('#' + v);
            state.h = hsv.h; state.s = hsv.s; state.v = hsv.v;
            render(false);
        });
        hexIn.addEventListener('blur', () => {
            hexIn.value = _hsvToHex(state.h, state.s, state.v).slice(1);
        });
        return state;
    }

    function positionPopup(anchor) {
        const r = anchor.getBoundingClientRect();
        const pw = 248, ph = 220;
        let left = r.left + r.width / 2 - pw / 2;
        let top = r.bottom + 8;
        left = Math.max(8, Math.min(window.innerWidth - pw - 8, left));
        if (top + ph > window.innerHeight - 8) top = r.top - ph - 8;
        popupEl.style.left = left + 'px';
        popupEl.style.top = top + 'px';
    }

    function onDocClick(e) {
        if (!popupEl) return;
        if (popupEl.contains(e.target) || customSw.contains(e.target)) return;
        closeColorPopup();
    }
    function onKey(e) { if (e.key === 'Escape') closeColorPopup(); }

    function openColorPopup(anchor) {
        if (!popupEl) {
            popupState = buildPopup();
            popupEl = popupState.sv.closest('.color-popup');
        }
        const hsv = _hexToHsv(customAccentHex);
        popupState.h = hsv.h; popupState.s = hsv.s; popupState.v = hsv.v;
        popupEl.style.display = 'block';
        positionPopup(anchor);
        requestAnimationFrame(() => popupState.render(true));
        setTimeout(() => {
            document.addEventListener('mousedown', onDocClick);
            document.addEventListener('keydown', onKey);
        }, 0);
    }
    function closeColorPopup() {
        if (!popupEl) return;
        popupEl.style.display = 'none';
        document.removeEventListener('mousedown', onDocClick);
        document.removeEventListener('keydown', onKey);
    }
    window.addEventListener('resize', () => { if (popupEl && popupEl.style.display !== 'none') positionPopup(customSw); });
})();
