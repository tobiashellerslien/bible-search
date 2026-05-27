// ── Map sidebar/drawer module ──
// Registers as an AppSidebar module (PC) and AppModuleHost module (mobile).
// One Leaflet instance, lazily created. DOM lives inside .map-module-root,
// which can be moved into #mapFullscreen for the fullscreen experience.
(function () {
    const FOCUS_MAX_ZOOM = 8;
    // 20-colour palette: medium-bright hues (HSL L≈58, S≈70) that stay readable
    // when overlapping translucent fills stack on satellite imagery.
    const PALETTE = [
        '#ff6b6b','#ffa94d','#ffd43b','#a9e34b','#69db7c',
        '#38d9a9','#3bc9db','#4dabf7','#748ffc','#9775fa',
        '#da77f2','#f783ac','#ff8787','#ffb86b','#ffe066',
        '#c0eb75','#8ce99a','#63e6be','#66d9e8','#74c0fc'
    ];
    // Blue-only palette used for waters/rivers so they read as water on the map.
    const WATER_PALETTE = [
        '#4dabf7','#74c0fc','#3bc9db','#66d9e8','#228be6',
        '#1c7ed6','#15aabf','#5c7cfa','#4263eb','#22b8cf'
    ];

    // ── state ──
    let _places = [];
    let _visibility = new Map();   // id → bool
    let _focusId = null;
    let _activeBook = null;        // book usfm of source block; used for verse highlight
    let _map = null;
    let _layerGroup = null;
    let _entries = [];             // [{place, layer, role, isPolygon, isPoint, isLine, area}]
    let _selectedId = null;
    let _hoveredId = null;         // currently hovered place id (any kind)
    let _isFullscreen = false;
    let _container = null;
    let _rootEl = null;
    let _moduleHost = null;
    let _unsubMainBlock = null;    // teardown for ctx.subscribe('mainBlockChanged')
    let _hasBeenShown = false;     // true once showForBlock has run; controls auto-close vs empty-state
    let _selectToken = 0;          // increments on each selectPlace; finish() bails if its token is stale

    // ── helpers ──
    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
            ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]);
    }
    function attr(s) { return esc(s); }

    function isWaterKind(kind) { return kind === 'water' || kind === 'path' || kind === 'waterpoint'; }
    function colorForPlace(place) {
        // Backward-compat: accept either a place object or a bare id (older sites
        // we haven't migrated still pass place.id). Bare ids fall back to the
        // generic palette since we don't know the kind.
        const isObj = place && typeof place === 'object';
        const id = isObj ? place.id : place;
        const palette = (isObj && isWaterKind(place.kind)) ? WATER_PALETTE : PALETTE;
        return palette[((id|0) % palette.length + palette.length) % palette.length];
    }
    // lighter version for verse-highlight backgrounds in text
    function colorAlpha(hex, alpha) {
        const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!m) return hex;
        const r = parseInt(m[1],16), g = parseInt(m[2],16), b = parseInt(m[3],16);
        return `rgba(${r},${g},${b},${alpha})`;
    }
    // darkened version for text on light backgrounds — clamps HSL lightness to 42%
    function darkenForText(hex) {
        const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!m) return hex;
        let r = parseInt(m[1],16)/255, g = parseInt(m[2],16)/255, b = parseInt(m[3],16)/255;
        const max = Math.max(r,g,b), min = Math.min(r,g,b);
        let h = 0, s = 0, l = (max+min)/2;
        if (max !== min) {
            const d = max-min;
            s = l > 0.5 ? d/(2-max-min) : d/(max+min);
            switch(max) {
                case r: h = ((g-b)/d + (g<b?6:0))/6; break;
                case g: h = ((b-r)/d + 2)/6; break;
                case b: h = ((r-g)/d + 4)/6; break;
            }
        }
        if (l <= 0.55) return hex;
        l = 0.42;
        const hue2rgb = (p,q,t) => { if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p; };
        const q2 = l < 0.5 ? l*(1+s) : l+s-l*s, p2 = 2*l-q2;
        const toHex = x => Math.round(x*255).toString(16).padStart(2,'0');
        return `#${toHex(hue2rgb(p2,q2,h+1/3))}${toHex(hue2rgb(p2,q2,h))}${toHex(hue2rgb(p2,q2,h-1/3))}`;
    }

    function kindGroup(kind) {
        if (kind === 'region') return 'regions';
        if (kind === 'water' || kind === 'path') return 'waters';
        return 'points';
    }
    function semanticLabel(t) { return t || ''; }

    // ── icons ──
    // Inline SVG pin (filled with place colour) — used for map markers, menu rows
    // and the popup header so symbols are consistent everywhere.
    function pinSvg(color, size = 18) {
        const w = size, h = Math.round(size * 36 / 28);
        return `<svg class="place-icon place-icon-pin" viewBox="0 0 28 36" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M14 1 C7 1 2 6 2 13 c0 9 12 22 12 22 s12 -13 12 -22 c0 -7 -5 -12 -12 -12 z"
                fill="${color}" stroke="#222" stroke-width="1.4"/>
            <circle cx="14" cy="13" r="4.5" fill="#fff" stroke="#222" stroke-width="1"/>
        </svg>`;
    }
    function regionSvg(color, size = 18) {
        return `<svg class="place-icon place-icon-region" viewBox="0 0 24 24" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <polygon points="4,8 10,3 18,5 21,12 17,20 8,21 3,14"
                fill="${colorAlpha(color, 0.35)}" stroke="${color}" stroke-width="1.8" stroke-linejoin="round"/>
        </svg>`;
    }
    function waterSvg(color, size = 18) {
        return `<svg class="place-icon place-icon-water" viewBox="0 0 24 14" width="${size}" height="${Math.round(size*14/24)}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M1 5 Q5 1 9 5 T17 5 T23 5" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round"/>
            <path d="M1 10 Q5 6 9 10 T17 10 T23 10" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" opacity="0.65"/>
        </svg>`;
    }
    function placeIconHtml(place, size = 18) {
        const c = colorForPlace(place);
        if (place.kind === 'region') return regionSvg(c, size);
        if (place.kind === 'water' || place.kind === 'path' || place.kind === 'waterpoint') return waterSvg(c, size);
        return pinSvg(c, size);
    }
    function buildPinIcon(place) {
        return L.divIcon({
            className: 'map-pin-marker',
            html: pinSvg(colorForPlace(place), 28),
            iconSize: [28, 36],
            iconAnchor: [14, 34],
            popupAnchor: [0, -30],
        });
    }

    // ── geometry helpers ──
    function geometryCentroid(g) {
        if (!g) return null;
        if (g.type === 'Point') return [g.coordinates[1], g.coordinates[0]];
        if (g.type === 'LineString' && g.coordinates.length) {
            const mid = g.coordinates[Math.floor(g.coordinates.length/2)];
            return [mid[1], mid[0]];
        }
        if (g.type === 'Polygon' && g.coordinates[0]?.length) {
            const ring = g.coordinates[0];
            let sx=0, sy=0;
            ring.forEach(c => { sx+=c[0]; sy+=c[1]; });
            return [sy/ring.length, sx/ring.length];
        }
        if (g.type === 'GeometryCollection' && g.geometries.length) {
            return geometryCentroid(g.geometries[0]);
        }
        return null;
    }
    function geometryType(g) {
        if (!g) return null;
        if (g.type === 'GeometryCollection') {
            const types = g.geometries.map(x => x.type);
            if (types.includes('Polygon')) return 'Polygon';
            if (types.includes('LineString')) return 'LineString';
            if (types.includes('Point')) return 'Point';
            return null;
        }
        return g.type;
    }
    function pointInRing(lng, lat, ring) {
        let inside = false;
        for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
            const xi = ring[i][0], yi = ring[i][1];
            const xj = ring[j][0], yj = ring[j][1];
            const intersect = ((yi > lat) !== (yj > lat)) &&
                (lng < (xj - xi) * (lat - yi) / (yj - yi + 1e-12) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }
    function geometryContains(g, lat, lng) {
        if (!g) return false;
        if (g.type === 'Polygon') return pointInRing(lng, lat, g.coordinates[0]);
        if (g.type === 'GeometryCollection') return g.geometries.some(x => geometryContains(x, lat, lng));
        return false;
    }
    function polygonArea(g) {
        // signed area on lat/lng — fine for comparison-only "smallest first"
        let total = 0;
        function ringArea(ring) {
            let a = 0;
            for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
                a += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
            }
            return Math.abs(a / 2);
        }
        if (!g) return 0;
        if (g.type === 'Polygon') return ringArea(g.coordinates[0] || []);
        if (g.type === 'GeometryCollection') {
            g.geometries.forEach(x => total += polygonArea(x));
            return total;
        }
        return 0;
    }

    // ── map ──
    function ensureMap(canvasEl) {
        if (_map) {
            if (canvasEl && _map.getContainer().parentNode !== canvasEl) {
                canvasEl.appendChild(_map.getContainer());
                requestAnimationFrame(() => _map.invalidateSize());
            }
            return _map;
        }
        if (typeof L === 'undefined') return null;
        _map = L.map(canvasEl, {
            minZoom: 2,
            maxZoom: 19,
            zoomControl: true,
            scrollWheelZoom: true,
        });
        L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            { attribution: 'Tiles &copy; Esri', maxZoom: 19 }
        ).addTo(_map);
        L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
            { attribution: '', maxZoom: 19, opacity: 0.95 }
        ).addTo(_map);

        // All paths share Leaflet's default overlayPane + default renderer.
        // Custom panes for paths trigger a zoom-animation transform bug where
        // polygons visually fly away from their map position during flyTo and
        // snap back when the animation ends. Markers go to the default
        // markerPane (z=600), which sits above overlayPane (z=400), so points
        // stay above polygons/lines without any extra pane setup. Z-order
        // between regions and lines is controlled by render order in
        // renderLayers() (regions added first, lines second).

        _map.setView([31.78, 35.22], 7);
        _layerGroup = L.layerGroup().addTo(_map);

        _map.on('popupclose', (ev) => {
            // Identify which place's popup just closed. When the user clicks
            // a new place while another popup is open, Leaflet closes the OLD
            // popup before opening the new one — so popupclose fires for the
            // previous place after _selectedId has already been moved to the
            // new place. If we blindly reset state on _selectedId we'd wipe
            // the freshly-applied selection style (visible as the pin snapping
            // back to base size right as the popup opens).
            const closedLayer = ev && ev.popup && ev.popup._source;
            let closedId = null;
            if (closedLayer) {
                const closedEntry = _entries.find(e => e.role === 'main' && e.layer === closedLayer);
                if (closedEntry) closedId = closedEntry.place.id;
            }
            const ownedByCurrentSelection = closedId !== null && closedId === _selectedId;

            // Always clear the verse highlight tied to the closed popup.
            // Tying this to ownedByCurrentSelection alone leaked the highlight
            // when re-clicking the same place: the old popup closes inside
            // openPopup, which nulls _selectedId; popupopen then re-applies
            // the highlight, but the next outside-click popupclose no longer
            // matches and the highlight gets stranded.
            if (closedId !== null) clearVerseHighlight(closedId);
            else if (ownedByCurrentSelection) clearVerseHighlight(null);
            else if (_selectedId !== null) {
                // Defensive: outside-click closures may emit popupclose with
                // an unrecognized source. Clear whatever highlight the active
                // selection owns, and reset selection state so a subsequent
                // click on the same place opens cleanly.
                clearVerseHighlight(_selectedId);
                const e = mainEntry(_selectedId);
                if (e) { resetStyle(e); setMarkerState(e, ''); }
                _selectedId = null;
                highlightMenu(null);
            }

            if (ownedByCurrentSelection) {
                const e = mainEntry(_selectedId);
                if (e) {
                    resetStyle(e);
                    setMarkerState(e, '');
                }
                _selectedId = null;
                highlightMenu(null);
            }
            // Sub-popup is anchored to whichever popup just closed — always close
            // it so its outside-click listener doesn't leak across opens.
            closeSubPopup({ silent: true });
        });

        // Map-level mousemove for nested-region hover-through.
        _map.on('mousemove', (e) => {
            if (!_entries.length) return;
            // Non-polygon hover (point/line) is managed by per-layer
            // mouseover/mouseout handlers. Bail so this handler doesn't
            // clobber that state on every pixel of movement.
            if (_hoveredId !== null) {
                const cur = mainEntry(_hoveredId);
                if (cur && !cur.isPolygon) return;
            }
            const { lat, lng } = e.latlng;
            const candidates = _entries.filter(en =>
                en.role === 'main' && en.isPolygon &&
                _visibility.get(en.place.id) !== false &&
                geometryContains(en.place.geometry, lat, lng)
            );
            let targetId = null;
            if (candidates.length) {
                // smallest containing wins
                let bestArea = Infinity;
                candidates.forEach(en => {
                    if (en.area < bestArea) { bestArea = en.area; targetId = en.place.id; }
                });
            }
            if (targetId !== _hoveredId) {
                if (_hoveredId !== null && _hoveredId !== _selectedId) {
                    const prev = mainEntry(_hoveredId);
                    if (prev) resetStyle(prev);
                }
                _hoveredId = targetId;
                if (targetId !== null && targetId !== _selectedId) {
                    const cur = mainEntry(targetId);
                    if (cur) applyHoverStyle(cur);
                }
                reassertSelectionFront();
            }
        });
        _map.on('mouseout', () => {
            if (_hoveredId !== null && _hoveredId !== _selectedId) {
                const prev = mainEntry(_hoveredId);
                if (prev) resetStyle(prev);
            }
            _hoveredId = null;
            reassertSelectionFront();
        });

        return _map;
    }

    function mainEntry(id) { return _entries.find(e => e.role === 'main' && e.place.id === id); }

    // Selected polygon/line lost its top-of-stack position whenever a different
    // region was brought to front on hover. Call this whenever hover clears so
    // the selected outline stays on top while no other region is being hovered.
    function reassertSelectionFront() {
        if (_selectedId === null) return;
        if (_hoveredId !== null && _hoveredId !== _selectedId) return;
        const sel = mainEntry(_selectedId);
        if (sel && sel.layer && sel.layer.bringToFront) sel.layer.bringToFront();
    }

    // ── styles (note: weight is what creates "thickness"; no scale transforms on geometry) ──
    function stylePolyBase(place)     { const c = colorForPlace(place); return { color:c, weight:2, fillColor:c, fillOpacity:0.22 }; }
    function stylePolyHover(place)    { const c = colorForPlace(place); return { color:c, weight:3, fillColor:c, fillOpacity:0.32 }; }
    function stylePolySelected(place) { const c = colorForPlace(place); return { color:c, weight:4, fillColor:c, fillOpacity:0.45 }; }
    function styleLineBase(place)     { const c = colorForPlace(place); return { color:c, weight:4, opacity:0.95 }; }
    function styleLineHover(place)    { const c = colorForPlace(place); return { color:c, weight:6, opacity:1 }; }
    function styleLineSelected(place) { const c = colorForPlace(place); return { color:c, weight:6, opacity:1 }; }
    function styleHitLine()           { return { color:'#000', weight:18, opacity:0, interactive:true }; }

    function applySelectionStyle(entry) {
        if (entry.isPolygon && entry.layer.setStyle) {
            entry.layer.setStyle(stylePolySelected(entry.place));
            entry.layer.bringToFront && entry.layer.bringToFront();
        }
        if (entry.isLine && entry.layer.setStyle) {
            entry.layer.setStyle(styleLineSelected(entry.place));
            entry.layer.bringToFront && entry.layer.bringToFront();
        }
        setMarkerState(entry, 'selected');
    }
    function applyHoverStyle(entry) {
        if (entry.isPolygon && entry.layer.setStyle) {
            entry.layer.setStyle(stylePolyHover(entry.place));
            entry.layer.bringToFront && entry.layer.bringToFront();
        }
        if (entry.isLine && entry.layer.setStyle) entry.layer.setStyle(styleLineHover(entry.place));
        setMarkerState(entry, 'hovered');
    }
    function resetStyle(entry) {
        if (entry.isPolygon && entry.layer.setStyle) entry.layer.setStyle(stylePolyBase(entry.place));
        if (entry.isLine && entry.layer.setStyle)    entry.layer.setStyle(styleLineBase(entry.place));
        setMarkerState(entry, '');
    }
    function setMarkerState(entry, state) {
        if (!entry.isPoint) return;
        const el = entry.layer.getElement && entry.layer.getElement();
        if (!el) return;
        el.classList.remove('map-pin-hovered', 'map-pin-selected');
        if (state === 'hovered')  el.classList.add('map-pin-hovered');
        if (state === 'selected') el.classList.add('map-pin-selected');
    }

    // ── popup ──
    // attribution icons: Info icons created by Stockio - Flaticon
    function buildPopupHtml(place) {
        const c = colorForPlace(place);
        const rawArticle = place.preceding_article || '';
        const article = rawArticle ? rawArticle.charAt(0).toUpperCase() + rawArticle.slice(1) : '';
        const namePart = article ? `${esc(article)} ${esc(place.name)}` : esc(place.name);

        let html = `<div class="map-popup" data-place-id="${place.id}" style="--place-color:${c};--place-color-text:${darkenForText(c)}">`;
        html += `<div class="popup-header">
            <span class="popup-kind-icon">${placeIconHtml(place, 20)}</span>
            <div class="popup-header-text">
                <div class="popup-name">${namePart}</div>`;
        if (place.semantic_type) {
            html += `<div class="popup-semantic">${esc(translateType(place.semantic_type))}</div>`;
        }
        html += `</div></div>`;

        if (place.comment) {
            html += `<div class="popup-comment">${esc(place.comment)}</div>`;
        }

        const aliases = (place.aliases || []).filter(a => a && a !== place.name);
        const hasDetails = !!(
            (place.placemark && place.placemark !== place.name) ||
            aliases.length > 0 ||
            place.semantic_type ||
            place.confidence != null
        );
        const hasLinks = !!(geometryCentroid(place.geometry) || place.wikidata_id || place.wikipedia_url);
        const totalRefs = place.total_refs ?? (place.refs ? place.refs.length : 0);
        const hasStats = totalRefs > 1;

        const dis = (cond) => cond ? '' : ' disabled aria-disabled="true"';
        html += `<div class="popup-actions">`;
        html += `<button class="popup-pill" data-act="stats" type="button"${dis(hasStats)}><img src="/static/images/stats.png" class="popup-pill-icon" alt="" aria-hidden="true"> Andre bibelsteder</button>`;
        html += `<button class="popup-pill" data-act="details" type="button"${dis(hasDetails)}><img src="/static/images/info.png" class="popup-pill-icon" alt="" aria-hidden="true"> Detaljer</button>`;
        html += `<button class="popup-pill" data-act="links" type="button"${dis(hasLinks)}><img src="/static/images/external.png" class="popup-pill-icon" alt="" aria-hidden="true"> Lenker</button>`;
        html += `</div>`;

        // Refs within current block — each ref is a button so the user can jump to that verse.
        if (place.refs && place.refs.length) {
            const maxShown = 12;
            html += `<div class="popup-refs"><span class="popup-label">Nevnt:</span> `;
            const btns = place.refs.slice(0, maxShown).map(r =>
                `<button class="popup-ref" type="button" data-act="goto-ref" data-chapter="${r.chapter}" data-verse="${r.verse}">${r.chapter}:${r.verse}</button>`
            );
            html += btns.join(', ');
            if (place.refs.length > maxShown) html += ` <span class="popup-refs-more">+${place.refs.length - maxShown}</span>`;
            html += `</div>`;
        }

        html += `</div>`;
        return html;
    }

    // ── tooltip (hover preview: icon + name) ──
    function buildTooltipHtml(place) {
        const c = colorForPlace(place);
        return `<span class="map-tooltip-inner" style="--place-color:${c}">`
             + `<span class="map-tooltip-icon">${placeIconHtml(place, 16)}</span>`
             + `<span class="map-tooltip-name">${esc(place.name)}</span>`
             + `</span>`;
    }

    // Delegated click handler — one listener for all popup pills, attached once.
    // Avoids re-binding per popupopen, which is fragile when Leaflet recreates
    // the popup DOM (handlers were silently lost between opens).
    document.addEventListener('click', (e) => {
        const btn = e.target.closest && e.target.closest('.popup-pill');
        if (!btn) return;
        const root = btn.closest('.map-popup');
        if (!root) return;
        e.stopPropagation();
        if (btn.disabled || btn.getAttribute('aria-disabled') === 'true') return;
        const id = Number(root.dataset.placeId);
        const place = _places.find(p => p.id === id);
        if (!place) return;
        const act = btn.dataset.act;
        if (act === 'stats')   { openPlaceStats(id); return; }
        if (act === 'details') { openSubPopup('details', place, btn); return; }
        if (act === 'links')   { openSubPopup('links',   place, btn); return; }
    });

    // Clicking a verse ref inside the "Nevnt:" row jumps to that verse:
    // close map (on mobile) + clear current marks, then mark the target verse so MVB reopens around it.
    document.addEventListener('click', (e) => {
        const btn = e.target.closest && e.target.closest('.popup-ref');
        if (!btn) return;
        const root = btn.closest('.map-popup');
        if (!root) return;
        e.stopPropagation();
        const chapter = parseInt(btn.dataset.chapter, 10);
        const verse = parseInt(btn.dataset.verse, 10);
        const book = _activeBook;
        if (!book || !Number.isFinite(chapter) || !Number.isFinite(verse)) return;
        if (window.AppModuleHost && window.AppModuleHost.isMobile() && window.AppModuleHost.isOpen()) {
            window.AppModuleHost.closeModule();
        }
        if (typeof window.clearHighlightAndMarked === 'function') window.clearHighlightAndMarked();
        // Wait for module-host slide-out + MVB clear before scrolling + re-marking, so
        // layout (mvb-h, body padding) is settled when scrollIntoView fires.
        setTimeout(() => {
            const sel = `.verse-text-clickable[data-book="${CSS.escape(book)}"][data-chapter="${chapter}"][data-verse="${verse}"]`;
            const el = document.querySelector(sel);
            if (!el) return;
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Click to mark — small delay so the scroll settles first.
            setTimeout(() => el.click(), 220);
        }, 140);
    });

    // ── sub-popup (floating mini panel near the action pill) ──
    let _activeSubPopup = null;
    function closeSubPopup(opts) {
        if (_activeSubPopup) {
            _activeSubPopup.remove();
            _activeSubPopup = null;
            document.removeEventListener('click', _onSubPopupOutside, true);
            // After the details panel is dismissed by user action (X click,
            // outside-click, or main-popup click), pan the map so the main
            // popup is fully visible again. Skip when called from teardown
            // paths (popupclose, rebind) where opts.silent=true.
            if (!(opts && opts.silent)) recenterMainPopup();
        }
    }
    function _onSubPopupOutside(e) {
        if (!_activeSubPopup) return;
        if (_activeSubPopup.contains(e.target)) return;
        // Allow clicking the originating pill to toggle off
        if (e.target.closest('.popup-pill')) return;
        closeSubPopup();
    }

    // Pan the map so the currently-open main popup is fully visible.
    // No-op if no popup or it's already in view (within padding).
    function recenterMainPopup() {
        if (!_map || _selectedId == null) return;
        const entry = mainEntry(_selectedId);
        if (!entry || !entry.layer || !entry.layer._popup) return;
        const popupEl = entry.layer._popup.getElement && entry.layer._popup.getElement();
        if (!popupEl) return;
        const mapRect = _map.getContainer().getBoundingClientRect();
        const pr = popupEl.getBoundingClientRect();
        const pad = 16;
        let dx = 0, dy = 0;
        if (pr.right > mapRect.right - pad) dx = pr.right - (mapRect.right - pad);
        else if (pr.left < mapRect.left + pad) dx = pr.left - (mapRect.left + pad);
        if (pr.bottom > mapRect.bottom - pad) dy = pr.bottom - (mapRect.bottom - pad);
        else if (pr.top < mapRect.top + pad) dy = pr.top - (mapRect.top + pad);
        if (dx !== 0 || dy !== 0) _map.panBy([dx, dy], { animate: true });
    }

    // Size the Leaflet popup to the current map viewport so it never grows
    // taller/wider than the map on small/low-resolution screens. Leaflet adds
    // an internal scroll wrapper (.leaflet-popup-scrolled) when content exceeds
    // maxHeight, so the whole popup stays inside the map and is fully readable.
    function applyPopupSizing(popup) {
        if (!_map || !popup) return;
        const sz = _map.getSize();
        popup.options.maxWidth = Math.round(Math.min(300, Math.max(200, sz.x - 24)));
        popup.options.maxHeight = Math.round(Math.max(120, sz.y - 96));
    }

    // Pan the map so the freshly-opened sub-popup is fully visible. When the
    // main popup + sub-popup together fit inside the map we bring the combined
    // bbox into view; otherwise we prioritise the sub-popup (the new panel) so
    // it is always fully readable even if the main popup gets pushed off.
    function fitSubPopupIntoView() {
        if (!_map || !_activeSubPopup) return;
        const mapRect = _map.getContainer().getBoundingClientRect();
        const pad = 12;
        const availW = mapRect.width - pad * 2;
        const availH = mapRect.height - pad * 2;
        const subRect = _activeSubPopup.getBoundingClientRect();
        const popupEl = _activeSubPopup.closest('.leaflet-popup');
        let minX = subRect.left, minY = subRect.top, maxX = subRect.right, maxY = subRect.bottom;
        if (popupEl) {
            const pr = popupEl.getBoundingClientRect();
            minX = Math.min(minX, pr.left);
            minY = Math.min(minY, pr.top);
            maxX = Math.max(maxX, pr.right);
            maxY = Math.max(maxY, pr.bottom);
        }
        // If the combined bbox can't fit, target the sub-popup alone.
        if ((maxX - minX) > availW || (maxY - minY) > availH) {
            minX = subRect.left; minY = subRect.top; maxX = subRect.right; maxY = subRect.bottom;
        }
        let dx = 0, dy = 0;
        if (maxX > mapRect.right - pad) dx = maxX - (mapRect.right - pad);
        else if (minX < mapRect.left + pad) dx = minX - (mapRect.left + pad);
        if (maxY > mapRect.bottom - pad) dy = maxY - (mapRect.bottom - pad);
        else if (minY < mapRect.top + pad) dy = minY - (mapRect.top + pad);
        if (dx !== 0 || dy !== 0) _map.panBy([dx, dy], { animate: true });
    }
    // Translation tables for casual-user readability.
    // Norwegian-only UI — translate openbible's English vocabulary.
    const TYPE_NO = {
        'settlement': 'bosetning',
        'region': 'område',
        'river': 'elv',
        'mountain': 'fjell',
        'mountain range': 'fjellkjede',
        'mountain ridge': 'fjellrygg',
        'mountain pass': 'fjellpass',
        'body of water': 'vannmasse',
        'spring': 'kilde',
        'well': 'brønn',
        'pool': 'dam',
        'wadi': 'wadi (tørrelv)',
        'valley': 'dal',
        'hill': 'høyde',
        'island': 'øy',
        'forest': 'skog',
        'field': 'mark',
        'campsite': 'leirplass',
        'altar': 'alter',
        'gate': 'port',
        'tree': 'tre',
        'rock': 'klippe',
        'cliff': 'klippe',
        'road': 'vei',
        'ford': 'vadested',
        'fortification': 'festning',
        'garden': 'hage',
        'mine': 'gruve',
        'people group': 'folkegruppe',
        'natural area': 'naturområde',
        'promontory': 'odde',
        'structure': 'bygning',
        'stone heap': 'steinrøys',
        'settlement and spring': 'bosetning og kilde',
        'district in settlement': 'bydel',
        'hall': 'hall',
        'room': 'rom',
        'canal': 'kanal',
    };
    const PRECISION_NO = {
        'point in modern settlement': 'punkt i moderne bosetning',
        'point in mountain range': 'punkt i fjellkjede',
        'point in region': 'punkt i området',
        'archaeological site': 'arkeologisk sted',
        'point in modern village': 'punkt i moderne landsby',
        'point in modern city': 'punkt i moderne by',
        'general area': 'omtrentlig område',
        'terrain feature': 'terrengtrekk',
    };
    function translateType(s) {
        if (!s) return s;
        return TYPE_NO[s.toLowerCase()] || s;
    }
    function translatePrecision(s) {
        if (!s) return s;
        return PRECISION_NO[s.toLowerCase()] || s;
    }
    function openSubPopup(kind, place, anchorEl) {
        closeSubPopup({ silent: true });
        const c = colorForPlace(place);
        const aliases = (place.aliases || []).filter(a => a && a !== place.name);
        const div = document.createElement('div');
        div.className = 'map-subpopup';
        div.style.setProperty('--place-color', c);
        div.style.setProperty('--place-color-text', darkenForText(c));
        const t = (kind === 'details') ? place.thumb : null;
        const hasThumb = !!(t && t.file);
        let inner = `<div class="map-subpopup-header">
            <span class="map-subpopup-title">${kind === 'details' ? 'Detaljer' : 'Lenker'}</span>
            <button class="map-subpopup-close" type="button" aria-label="Lukk">&times;</button>
        </div><div class="map-subpopup-body${hasThumb ? ' map-subpopup-body--with-thumb' : ''}">`;
        if (kind === 'details') {
            if (hasThumb) {
                const bg = t.placeholder
                    ? `background:linear-gradient(${t.placeholder.split(',').map(c => c.trim()).join(',')});`
                    : '';
                const altSafe = attr(t.description || place.name || '');
                const creditHtml = t.credit
                    ? (t.credit_url
                        ? `<a href="${attr(t.credit_url)}" target="_blank" rel="noopener">${esc(t.credit)}</a>`
                        : esc(t.credit))
                    : '';
                const satBadge = t.is_satellite ? '<span class="thumb-sat-badge" title="Satellittbilde">Satellitt</span>' : '';
                inner += `<div class="map-subpopup-thumb" style="${bg}">
                    <img loading="lazy" src="${attr(t.file)}" alt="${altSafe}" onerror="this.style.display='none'">
                    <div class="map-subpopup-thumb-credit">${creditHtml}${satBadge}</div>
                </div>`;
            }
            inner += `<div class="map-subpopup-rows">`;
            if (place.placemark && place.placemark !== place.name) {
                inner += `<div class="map-subpopup-row"><span class="map-subpopup-label" title="Opprinnelig stedsnavn fra OpenBible KMZ">Opprinnelig navn</span><div>${esc(place.placemark)}</div></div>`;
            }
            if (aliases.length) {
                inner += `<div class="map-subpopup-row"><span class="map-subpopup-label" title="Stavemåter fra bibeloversettelser">Andre navn</span><div>${esc(aliases.join(', '))}</div></div>`;
            }
            if (place.semantic_type) {
                inner += `<div class="map-subpopup-row"><span class="map-subpopup-label">Type</span><div>${esc(translateType(place.semantic_type))}</div></div>`;
            }
            const isPolygonKind = place.kind === 'region' || place.kind === 'water';
            if (!isPolygonKind && place.precision && place.precision.meters != null) {
                const m = place.precision.meters;
                const descRaw = place.precision.description;
                const desc = descRaw ? ` <span class="map-subpopup-dim">(${esc(translatePrecision(descRaw))})</span>` : '';
                const human = m >= 1000 ? `±${(m / 1000).toFixed(m % 1000 === 0 ? 0 : 1)} km` : `±${m} m`;
                inner += `<div class="map-subpopup-row"><span class="map-subpopup-label" title="Anslagsvis nøyaktighet for koordinaten">Presisjon</span><div>${human}${desc}</div></div>`;
            }
            if (place.confidence != null) {
                const conf = Number(place.confidence);
                const disputed = conf < 0;
                const pct = Math.round(Math.abs(conf) / 10);
                const votes = place.confidence_votes ? ` <span class="map-subpopup-dim">(${place.confidence_votes} stemmer)</span>` : '';
                // Hue scales 0→120 (red→green) across the 0–100% range.
                // Disputed entries (negative score) are forced red.
                const hue = disputed ? 0 : Math.round(Math.max(0, Math.min(100, pct)) * 1.2);
                const numColor = `hsl(${hue}, 75%, 42%)`;
                const numHtml = `<span class="map-subpopup-conf-num" style="color:${numColor}">${pct}%</span>`;
                const label = disputed ? `Omstridt — ${numHtml}` : numHtml;
                inner += `<div class="map-subpopup-row"><span class="map-subpopup-label">Sikkerhet</span><div class="${disputed ? 'map-subpopup-disputed' : ''}">${label}${votes}</div></div>`;
            }
            inner += `</div>`; // close .map-subpopup-rows
        } else {
            const links = [];
            const center = geometryCentroid(place.geometry);
            if (center) links.push(`<a href="https://www.google.com/maps/search/?api=1&query=${center[0]},${center[1]}" target="_blank" rel="noopener">Google Maps</a>`);
            if (place.wikidata_id) links.push(`<a href="https://www.wikidata.org/wiki/${attr(place.wikidata_id)}" target="_blank" rel="noopener">Wikidata</a>`);
            if (place.wikipedia_url) links.push(`<a href="${attr(place.wikipedia_url)}" target="_blank" rel="noopener">Wikipedia</a>`);
            inner += `<div class="map-subpopup-links">${links.join('')}</div>`;
        }
        inner += `</div>`;
        div.innerHTML = inner;
        // Attach inside the parent leaflet popup so the sub-popup inherits the
        // popup's transform — it then follows the map on drag/zoom instead of
        // detaching to viewport coordinates. Fallback to <body> if not found.
        const popup = anchorEl.closest('.leaflet-popup');
        const a = anchorEl.getBoundingClientRect();
        if (popup) {
            popup.appendChild(div);
        } else {
            document.body.appendChild(div);
        }
        // Constrain the sub-popup to the map viewport so it can never grow
        // larger than the map on small/low-resolution screens — the body
        // scrolls instead (see .map-subpopup-body in CSS).
        const mapRect = _map ? _map.getContainer().getBoundingClientRect() : null;
        if (mapRect) {
            div.style.maxWidth = Math.max(200, mapRect.width - 24) + 'px';
            div.style.maxHeight = Math.max(140, mapRect.height - 24) + 'px';
        }
        // Measure actual rendered width (CSS may scale up to 460px when thumb +
        // PC), then clamp into the map — not the full window, since the map may
        // be a narrow sidebar.
        const pw = div.offsetWidth || 260;
        const boundLeft  = mapRect ? mapRect.left + 8 : 8;
        const boundRight = mapRect ? mapRect.right - 8 : window.innerWidth - 8;
        if (popup) {
            const p = popup.getBoundingClientRect();
            const absLeft = Math.max(boundLeft, Math.min(boundRight - pw, a.left));
            div.style.left = (absLeft - p.left) + 'px';
            div.style.top  = (a.bottom - p.top + 6) + 'px';
        } else {
            const left = Math.max(boundLeft, Math.min(boundRight - pw, a.left));
            div.style.left = left + 'px';
            div.style.top  = (a.bottom + window.scrollY + 6) + 'px';
        }
        _activeSubPopup = div;
        div.querySelector('.map-subpopup-close').addEventListener('click', () => closeSubPopup());
        // Stop pointer events so they don't bubble to the map (which would close
        // the parent leaflet popup or start a pan).
        div.addEventListener('mousedown', (ev) => ev.stopPropagation());
        div.addEventListener('click', (ev) => ev.stopPropagation());
        div.addEventListener('pointerdown', (ev) => ev.stopPropagation());
        div.addEventListener('touchstart', (ev) => ev.stopPropagation(), { passive: true });
        // Outside-close listener uses 'click' (not 'mousedown') so dragging the
        // map to see the rest of a tall details panel doesn't dismiss it —
        // click only fires when the mouse didn't move significantly between
        // down and up. Deferred so the originating click finishes bubbling.
        setTimeout(() => document.addEventListener('click', _onSubPopupOutside, true), 0);
        // Pan the map so the sub-popup + main popup are fully visible. rAF lets
        // the browser commit the new layout before we measure.
        requestAnimationFrame(() => fitSubPopupIntoView());
    }

    // ── verse highlight in text while popup open ──
    function highlightVerses(place) {
        if (!_activeBook || !place || !place.refs) return;
        // Defensive clear in case a previous popup left stragglers.
        clearVerseHighlight(null);
        const color = colorForPlace(place);
        const bg = colorAlpha(color, 0.35);
        const border = colorAlpha(color, 0.85);
        place.refs.forEach(r => {
            const sel = `.verse-text-clickable[data-book="${CSS.escape(_activeBook)}"][data-chapter="${r.chapter}"][data-verse="${r.verse}"]`;
            document.querySelectorAll(sel).forEach(el => {
                el.dataset.mapHighlight = String(place.id);
                el.style.setProperty('--map-hl-bg', bg);
                el.style.setProperty('--map-hl-border', border);
                el.classList.add('map-verse-highlight');
            });
        });
        // Scroll first ref into view
        const first = place.refs[0];
        if (first) {
            const sel = `.verse-text-clickable[data-book="${CSS.escape(_activeBook)}"][data-chapter="${first.chapter}"][data-verse="${first.verse}"]`;
            const el = document.querySelector(sel);
            if (el && !isElementInViewport(el)) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
    function clearVerseHighlight(placeId) {
        document.querySelectorAll('.map-verse-highlight').forEach(el => {
            if (placeId == null || el.dataset.mapHighlight === String(placeId)) {
                el.classList.remove('map-verse-highlight');
                el.style.removeProperty('--map-hl-bg');
                el.style.removeProperty('--map-hl-border');
                delete el.dataset.mapHighlight;
            }
        });
    }
    function isElementInViewport(el) {
        const r = el.getBoundingClientRect();
        return r.top >= 0 && r.bottom <= window.innerHeight;
    }

    // ── layer construction ──
    function buildLayersFor(place) {
        const out = [];
        if (!place.geometry) return out;
        const type = geometryType(place.geometry);
        if (type === 'Point') {
            const c = geometryCentroid(place.geometry);
            if (!c) return out;
            const m = L.marker(c, { icon: buildPinIcon(place) });
            out.push({ layer: m, role:'main', isPoint: true });
        } else if (type === 'LineString') {
            const main = L.geoJSON(place.geometry, { style: () => styleLineBase(place) });
            const hit  = L.geoJSON(place.geometry, { style: styleHitLine });
            out.push({ layer: main, role:'main', isLine: true });
            out.push({ layer: hit,  role:'hit',  isLine: true });
        } else if (type === 'Polygon') {
            const poly = L.geoJSON(place.geometry, { style: () => stylePolyBase(place) });
            out.push({ layer: poly, role:'main', isPolygon: true });
        } else if (place.geometry.type === 'GeometryCollection') {
            place.geometry.geometries.forEach(sub => {
                buildLayersFor({ ...place, geometry: sub }).forEach(x => out.push(x));
            });
        }
        return out;
    }

    function renderLayers() {
        if (!_layerGroup) return;
        _layerGroup.clearLayers();
        _entries = [];

        // Order: regions first (largest first), then lines, then points.
        // Adding largest region first means smaller ones render on top.
        const sorted = _places.slice().sort((a, b) => {
            const ar = a.kind === 'region' ? 0 : (a.kind === 'water' || a.kind === 'path' ? 1 : 2);
            const br = b.kind === 'region' ? 0 : (b.kind === 'water' || b.kind === 'path' ? 1 : 2);
            if (ar !== br) return ar - br;
            if (ar === 0) {
                // largest area first → smaller on top
                return polygonArea(b.geometry) - polygonArea(a.geometry);
            }
            return 0;
        });

        sorted.forEach(p => {
            const specs = buildLayersFor(p);
            const area = polygonArea(p.geometry);
            specs.forEach(spec => {
                const entry = {
                    place: p,
                    layer: spec.layer,
                    role: spec.role,
                    isPolygon: !!spec.isPolygon,
                    isLine: !!spec.isLine,
                    isPoint: !!spec.isPoint,
                    area,
                };
                _entries.push(entry);

                spec.layer.on('click', (ev) => {
                    if (ev && ev.originalEvent) L.DomEvent.stopPropagation(ev);
                    let targetId = p.id;
                    if (entry.isPolygon && ev && ev.latlng) {
                        // pick smallest containing polygon (nested regions)
                        let bestArea = Infinity;
                        _entries.forEach(en => {
                            if (en.role !== 'main' || !en.isPolygon) return;
                            if (_visibility.get(en.place.id) === false) return;
                            if (geometryContains(en.place.geometry, ev.latlng.lat, ev.latlng.lng) && en.area < bestArea) {
                                bestArea = en.area;
                                targetId = en.place.id;
                            }
                        });
                    }
                    // selectPlace opens the popup itself after the camera
                    // animation finishes (see finish() in selectPlace). We
                    // suppress bindPopup's own click-open below so the popup
                    // doesn't open mid-animation and trigger autoPan that
                    // fights our fitBounds.
                    selectPlace(targetId, { fromLatLng: ev?.latlng, openPopup: true, keepZoom: true });
                });

                // Point hover handlers — points are not detected by map mousemove.
                if (entry.isPoint) {
                    spec.layer.on('mouseover', () => {
                        if (_selectedId === p.id) return;
                        _hoveredId = p.id;
                        applyHoverStyle(entry);
                    });
                    spec.layer.on('mouseout', () => {
                        if (_hoveredId === p.id && _selectedId !== p.id) {
                            _hoveredId = null;
                            resetStyle(entry);
                            reassertSelectionFront();
                        }
                    });
                }
                // Line hover handlers (the hit layer triggers them via main below).
                if (entry.isLine && spec.role === 'hit') {
                    spec.layer.on('mouseover', () => {
                        if (_selectedId === p.id) return;
                        const main = mainEntry(p.id);
                        if (main) { _hoveredId = p.id; applyHoverStyle(main); }
                    });
                    spec.layer.on('mouseout', () => {
                        if (_hoveredId === p.id && _selectedId !== p.id) {
                            const main = mainEntry(p.id);
                            if (main) { resetStyle(main); }
                            _hoveredId = null;
                            reassertSelectionFront();
                        }
                    });
                }

                if (spec.role === 'main') {
                    spec.layer.bindPopup(buildPopupHtml(p), {
                        maxWidth: 300,
                        // Tall popups (header + pills + refs) need generous top padding
                        // so autoPan keeps the whole popup inside the viewport, not just
                        // the anchor point.
                        autoPanPaddingTopLeft: [24, 80],
                        autoPanPaddingBottomRight: [24, 24],
                        className: 'map-popup-wrap',
                    });
                    // bindPopup adds an internal click handler that auto-opens
                    // the popup. We want to control timing (open only after
                    // camera animation finishes), so disable the auto-open.
                    if (spec.layer._openPopup) {
                        spec.layer.off('click', spec.layer._openPopup, spec.layer);
                    }
                    spec.layer.on('popupopen', () => {
                        // Tooltip and popup must not coexist on the same place.
                        spec.layer.closeTooltip && spec.layer.closeTooltip();
                        if (entry.isLine) {
                            const hit = _entries.find(en => en.role === 'hit' && en.place.id === p.id);
                            if (hit && hit.layer.closeTooltip) hit.layer.closeTooltip();
                        }
                        // On mobile the map covers the text anyway — skip the underline + auto-scroll
                        // and let the user jump explicitly via the "Nevnt:" ref buttons in the popup.
                        if (window.AppModuleHost && window.AppModuleHost.isMobile()) return;
                        highlightVerses(p);
                    });
                }

                // Hover tooltip — bound on whichever layer actually receives
                // hover events: main for points/polygons, hit for lines.
                const tooltipHere =
                    (spec.role === 'main' && (entry.isPoint || entry.isPolygon)) ||
                    (entry.isLine && spec.role === 'hit');
                if (tooltipHere) {
                    spec.layer.bindTooltip(buildTooltipHtml(p), {
                        direction: entry.isPoint ? 'top' : 'auto',
                        sticky: !entry.isPoint,
                        className: 'map-tooltip',
                        opacity: 1,
                        offset: entry.isPoint ? L.point(0, -28) : L.point(0, 0),
                    });
                    // Suppress tooltip while this place's popup is open.
                    spec.layer.on('tooltipopen', () => {
                        if (_selectedId === p.id) spec.layer.closeTooltip();
                    });
                }

                if (_visibility.get(p.id) !== false) spec.layer.addTo(_layerGroup);
            });
        });
    }

    // ── selection / navigation ──
    function selectPlace(placeId, opts = {}) {
        const entry = mainEntry(placeId);
        if (!entry) return;
        const myToken = ++_selectToken;

        // Reset previous
        if (_selectedId !== null && _selectedId !== placeId) {
            const prev = mainEntry(_selectedId);
            if (prev) { resetStyle(prev); }
            clearVerseHighlight(_selectedId);
        }
        // Clear hover state since we're switching to selection
        if (_hoveredId !== null && _hoveredId !== placeId) {
            const ph = mainEntry(_hoveredId);
            if (ph) resetStyle(ph);
            _hoveredId = null;
        }
        _selectedId = placeId;
        highlightMenu(placeId);

        // Apply marker-only selection style immediately so the click gives
        // instant visual feedback (scale 1.35). Polygon/line setStyle stays
        // deferred to `finish()` since restyling a path mid-animation causes
        // the visual-drift bug documented below.
        if (entry.isPoint) setMarkerState(entry, 'selected');

        const bounds = entry.layer.getBounds && entry.layer.getBounds();
        const center = geometryCentroid(entry.place.geometry);
        const popupLatLng = opts.fromLatLng || center;

        // Defer style + popup until the camera animation finishes. Calling
        // setStyle / bringToFront / openPopup before or during flyToBounds is
        // what causes the polygon to visually drift during the zoom: re-styling
        // or DOM-reordering a path while the renderer is mid-zoom-animation
        // forces the path to re-render against an intermediate transform that
        // doesn't match its true map position.
        const finish = () => {
            // Stale-callback guard: if rebindToMainBlock or another selectPlace ran
            // before this animation's moveend fired, our entry's layer was destroyed
            // by _layerGroup.clearLayers() and we'd be applying state to a detached
            // layer / opening a popup that's no longer wired to anything.
            if (myToken !== _selectToken) return;
            if (!_entries.includes(entry)) return;
            applySelectionStyle(entry);
            if (opts.openPopup !== false && popupLatLng) {
                const pop = entry.layer.getPopup && entry.layer.getPopup();
                if (pop) applyPopupSizing(pop);
                entry.layer.openPopup(popupLatLng);
            }
        };

        // fitBounds / setView use the standard single-step zoom animation that
        // applies a CSS transform to the renderer's SVG container once and
        // snaps paths to new coords at zoomend. flyTo runs frame-by-frame
        // with per-frame transform updates, which empirically causes polygons
        // to visually drift / scale incorrectly mid-animation.
        //
        // To leave room for the popup without disturbing the zoom level,
        // compute a normal zoom that fits bounds (symmetric padding), then
        // shift the target center DOWN in pixel space by half the popup
        // reserve. Result: same zoom as a normal fit, region sits in the
        // lower half of the viewport, popup appears above without needing
        // its own autoPan animation.
        const mapSize = _map.getSize();
        const POPUP_RESERVE = Math.min(260, Math.max(60, mapSize.y * 0.45));
        const shift = POPUP_RESERVE / 2;

        // Cap zoom lower on mobile / small viewports. On larger maps,
        // getBoundsZoom returns a higher value (more pixels to fill), so the
        // same region zooms in further than on a PC sidebar. Bring the cap
        // down so mobile feels comparable to PC.
        const isMobile = !!(window.AppModuleHost && window.AppModuleHost.isMobile());
        const effectiveMaxZoom = isMobile ? Math.max(2, FOCUS_MAX_ZOOM - 2) : FOCUS_MAX_ZOOM;

        let animated = false;
        let targetZoom = _map.getZoom();
        let targetCenter = null;

        if (entry.isPolygon || entry.isLine) {
            if (bounds && bounds.isValid()) {
                targetCenter = bounds.getCenter();
                if (opts.keepZoom) {
                    targetZoom = _map.getZoom();
                } else {
                    targetZoom = Math.min(
                        effectiveMaxZoom,
                        _map.getBoundsZoom(bounds, false, L.point(40, 40))
                    );
                }
            }
        } else if (center) {
            targetZoom = Math.max(_map.getZoom(), effectiveMaxZoom);
            targetCenter = L.latLng(center[0], center[1]);
        }

        if (targetCenter) {
            const pt = _map.project(targetCenter, targetZoom);
            const offsetCenter = _map.unproject(pt.subtract([0, shift]), targetZoom);

            // If the requested view is essentially identical to the current one,
            // Leaflet's setView is a no-op and never fires `moveend`. That used to
            // leave `finish()` stranded — the old popup never closed, the new one
            // never opened, and a later user drag would fire the stale callback,
            // making the popup pop in only after panning. Detect the no-op case
            // and skip the listener entirely.
            const curPt = _map.project(_map.getCenter(), targetZoom);
            const tgtPt = _map.project(offsetCenter, targetZoom);
            const noMoveNeeded = _map.getZoom() === targetZoom
                && Math.abs(curPt.x - tgtPt.x) < 2
                && Math.abs(curPt.y - tgtPt.y) < 2;

            if (noMoveNeeded) {
                animated = false;
            } else {
                _map.setView(offsetCenter, targetZoom, { animate: true });
                animated = true;
            }
        }

        if (animated) {
            // Belt-and-suspenders: register `moveend` for the normal animated
            // path, but also schedule a timeout in case Leaflet never fires it
            // (interrupted animation, reduced-motion, etc.). Both routes share
            // a `done` flag so `finish()` runs exactly once.
            let done = false;
            const runOnce = () => { if (done) return; done = true; finish(); };
            _map.once('moveend', runOnce);
            setTimeout(runOnce, 450);
        } else {
            finish();
        }
    }

    function highlightMenu(placeId) {
        if (!_rootEl) return;
        _rootEl.querySelectorAll('.map-menu-item').forEach(el => {
            el.classList.toggle('active', Number(el.dataset.placeId) === placeId);
        });
    }

    // ── menu hover handling (persistent while hovering) ──
    function menuHoverEnter(placeId) {
        if (_selectedId === placeId) return;
        const entry = mainEntry(placeId);
        if (!entry) return;
        if (_visibility.get(placeId) === false) return;
        if (_hoveredId !== null && _hoveredId !== placeId) {
            const prev = mainEntry(_hoveredId);
            if (prev) resetStyle(prev);
        }
        _hoveredId = placeId;
        applyHoverStyle(entry);
    }
    function menuHoverLeave(placeId) {
        if (_hoveredId !== placeId) return;
        if (_selectedId === placeId) { _hoveredId = null; return; }
        const entry = mainEntry(placeId);
        if (entry) resetStyle(entry);
        _hoveredId = null;
        reassertSelectionFront();
    }

    // ── menu ──
    function renderMenu() {
        if (!_rootEl) return;
        const listEl = _rootEl.querySelector('.map-menu-list');
        if (!listEl) return;

        const groups = { points: [], regions: [], waters: [] };
        _places.forEach(p => { groups[kindGroup(p.kind)].push(p); });
        const order = [
            { key: 'points',  label: 'Steder' },
            { key: 'regions', label: 'Regioner' },
            { key: 'waters',  label: 'Vann og elver' },
        ];

        let html = '';
        order.forEach(grp => {
            const arr = groups[grp.key];
            if (!arr.length) return;
            arr.sort((a,b) => a.name.localeCompare(b.name));
            html += `<div class="map-menu-group"><div class="map-menu-group-label">${esc(grp.label)} <span class="map-menu-group-count">${arr.length}</span></div>`;
            arr.forEach(p => {
                const visible = _visibility.get(p.id) !== false;
                const c = colorForPlace(p);
                const sub = p.comment ? `<span class="map-menu-item-sub">${esc(p.comment)}</span>` : '';
                html += `<div class="map-menu-item${visible ? '' : ' map-menu-item-hidden'}" data-place-id="${p.id}"
                        style="--place-color:${c}"
                        role="button" tabindex="0">
                    <span class="map-menu-icon">${placeIconHtml(p, 18)}</span>
                    <span class="map-menu-item-text">
                        <span class="map-menu-item-name">${esc(p.name)}</span>
                        ${sub}
                    </span>
                    <button class="map-menu-eye${visible ? '' : ' map-menu-eye-off'}" type="button" data-eye="${p.id}" title="${visible?'Skjul':'Vis'}" aria-label="${visible?'Skjul':'Vis'}">
                        ${visible ? ICON_EYE_OPEN : ICON_EYE_OFF}
                    </button>
                </div>`;
            });
            html += `</div>`;
        });
        if (!html) html = `<div class="map-menu-empty">Ingen steder.</div>`;
        listEl.innerHTML = html;

        const bulk = _rootEl.querySelector('[data-act="toggle-all"]');
        if (bulk) {
            const anyVisible = _places.some(p => _visibility.get(p.id) !== false);
            bulk.innerHTML = anyVisible ? ICON_EYE_OPEN : ICON_EYE_OFF;
            bulk.title = anyVisible ? 'Skjul alle' : 'Vis alle';
            bulk.classList.toggle('map-menu-action-off', !anyVisible);
        }

        listEl.querySelectorAll('.map-menu-item').forEach(el => {
            const id = Number(el.dataset.placeId);
            el.addEventListener('click', (e) => {
                if (e.target.closest('.map-menu-eye')) return;
                if (_visibility.get(id) === false) setVisibility(id, true);
                selectPlace(id);
            });
            el.addEventListener('mouseenter', () => menuHoverEnter(id));
            el.addEventListener('mouseleave', () => menuHoverLeave(id));
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectPlace(id); }
            });
        });
        listEl.querySelectorAll('.map-menu-eye').forEach(btn => {
            const id = Number(btn.dataset.eye);
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                setVisibility(id, _visibility.get(id) === false);
            });
        });
    }

    function setVisibility(id, visible) {
        _visibility.set(id, visible);
        _entries.filter(e => e.place.id === id).forEach(en => {
            if (visible) { if (!_layerGroup.hasLayer(en.layer)) en.layer.addTo(_layerGroup); }
            else _layerGroup.removeLayer(en.layer);
        });
        renderMenu();
        if (_selectedId === id) highlightMenu(id);
    }
    function setAllVisibility(visible) {
        _places.forEach(p => _visibility.set(p.id, visible));
        _entries.forEach(en => {
            if (visible) { if (!_layerGroup.hasLayer(en.layer)) en.layer.addTo(_layerGroup); }
            else _layerGroup.removeLayer(en.layer);
        });
        renderMenu();
    }
    function fitAll() {
        if (!_map) return;
        const visible = _entries
            .filter(e => e.role === 'main' && _visibility.get(e.place.id) !== false)
            .map(e => e.layer);
        if (!visible.length) return;
        const group = L.featureGroup(visible);
        if (group.getBounds().isValid()) {
            _map.flyToBounds(group.getBounds(), { padding:[30,30], maxZoom:FOCUS_MAX_ZOOM, duration:0.5 });
        }
    }

    // ── stats ──
    async function openPlaceStats(placeId) {
        try {
            const resp = await fetch(`/api/place/${placeId}`);
            if (!resp.ok) return;
            const data = await resp.json();
            if (!data.place) return;
            renderPlaceStats(data.place);
            closeSubPopup({ silent: true });
            const modal = document.getElementById('statsModal');
            if (modal) modal.classList.add('open');
        } catch {}
    }
    function renderPlaceStats(place) {
        const title = document.getElementById('statsModalTitle');
        if (title) title.textContent = `Andre bibelsteder: ${place.name}`;
        const modeSel = document.getElementById('statsModeSelect');
        if (modeSel) modeSel.style.display = 'none';

        const refs = place.refs || [];
        const perBook = new Map();
        refs.forEach(r => perBook.set(r.book_usfm, (perBook.get(r.book_usfm) || 0) + 1));
        const perChap = new Map();
        refs.forEach(r => {
            const k = r.book_usfm + '|' + r.chapter;
            perChap.set(k, (perChap.get(k) || 0) + 1);
        });

        const booksList = window.booksData || [];
        const bookOrder = booksList.length ? booksList.map(b => b.code) : Array.from(perBook.keys());
        const lang = (window.versionLang && window.versionSelect)
            ? window.versionLang(window.versionSelect.value) : 'no';
        function nameOf(code) {
            const b = booksList.find(x => x.code === code);
            if (!b) return code;
            return lang === 'en' ? (b.name_en || b.name) : b.name;
        }
        const totalHits = refs.length;
        const otTest = window.isOTBook || (() => false);
        let ot=0, nt=0;
        perBook.forEach((c, code) => { if (otTest(code)) ot+=c; else nt+=c; });

        let html = `<div class="stats-summary">
            <div class="stats-card"><div class="stats-card-label">Antall referanser</div><div class="stats-card-value">${totalHits}</div></div>
            <div class="stats-card"><div class="stats-card-label">Bøker</div><div class="stats-card-value">${perBook.size}</div></div>
            <div class="stats-card"><div class="stats-card-label">GT</div><div class="stats-card-value">${ot}</div></div>
            <div class="stats-card"><div class="stats-card-label">NT</div><div class="stats-card-value">${nt}</div></div>
        </div>`;
        html += `<div class="place-stats-section-label">Bøker <span class="place-stats-section-hint">— åpner alle versene i boken</span></div>`;
        html += `<div class="place-stats-books">`;
        bookOrder.forEach(code => {
            const cnt = perBook.get(code) || 0;
            if (!cnt) return;
            html += `<button class="place-stats-book" type="button" data-book="${attr(code)}">
                <span class="place-stats-book-name">${esc(nameOf(code))}</span>
                <span class="place-stats-book-count">${cnt}</span>
            </button>`;
        });
        html += `</div>`;

        if (perChap.size) {
            html += `<div class="place-stats-distribution"><div class="place-stats-section-label">Per kapittel <span class="place-stats-section-hint">— åpner ett kapittel</span></div>`;
            bookOrder.forEach(code => {
                if (!perBook.get(code)) return;
                const items = [];
                perChap.forEach((cnt, k) => { const [bk, ch] = k.split('|'); if (bk === code) items.push({ ch:Number(ch), cnt }); });
                items.sort((a,b) => a.ch - b.ch);
                html += `<div class="place-stats-dist-row"><span class="place-stats-dist-book">${esc(nameOf(code))}</span><span class="place-stats-dist-chs">`;
                items.forEach(e => {
                    html += `<button class="place-stats-chapter" type="button" data-book="${attr(code)}" data-chapter="${e.ch}">${e.ch}${e.cnt>1?`<sup>${e.cnt}</sup>`:''}</button>`;
                });
                html += `</span></div>`;
            });
            html += `</div>`;
        }

        const body = document.getElementById('statsBody');
        if (body) {
            body.innerHTML = html;
            body.querySelectorAll('.place-stats-book').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const code = btn.dataset.book;
                    document.getElementById('statsModal').classList.remove('open');
                    if (_isFullscreen) exitFullscreen();
                    const version = window.versionSelect ? window.versionSelect.value : null;
                    const bookRefs = refs.filter(r => r.book_usfm === code);
                    if (window.insertBlocksIntoView && bookRefs.length) {
                        const bName = nameOf(code);
                        const specs = bookRefs.map(r => ({
                            book: code,
                            ch_start: r.chapter, vs_start: r.verse,
                            ch_end: r.chapter,   vs_end: r.verse,
                            version,
                            label: window.fmtVerseRef(code, bName, r.chapter, r.verse),
                        }));
                        // New search — replace existing view rather than append.
                        await window.insertBlocksIntoView(specs, { replace: true });
                    } else if (window.goChapter) {
                        window.goChapter(code, 1, nameOf(code));
                    }
                });
            });
            body.querySelectorAll('.place-stats-chapter').forEach(btn => {
                btn.addEventListener('click', () => {
                    const code = btn.dataset.book;
                    const ch = Number(btn.dataset.chapter);
                    document.getElementById('statsModal').classList.remove('open');
                    if (_isFullscreen) exitFullscreen();
                    // Highlight the verses in this chapter that mention the place
                    // (same mechanism as the verse→chapter expand path).
                    const keys = refs
                        .filter(r => r.book_usfm === code && r.chapter === ch)
                        .map(r => `${r.chapter}:${r.verse}`)
                        .join(',');
                    if (window.readChapter) {
                        window.readChapter(code, ch, nameOf(code), keys || null);
                    } else if (window.goChapter) {
                        window.goChapter(code, ch, nameOf(code));
                    }
                });
            });
        }
    }

    // ── fullscreen ──
    function enterFullscreen() {
        if (_isFullscreen) return;
        const fs = document.getElementById('mapFullscreen');
        if (!fs || !_rootEl) return;
        _moduleHost = _rootEl.parentNode;
        _isFullscreen = true;
        _rootEl.dataset.fullscreen = 'true';
        _rootEl.dataset.desktop = window.innerWidth > 700 ? 'true' : 'false';
        // Force-open menu in fullscreen
        const menu = _rootEl.querySelector('.map-menu');
        if (menu) menu.dataset.collapsed = 'false';
        fs.appendChild(_rootEl);
        fs.hidden = false;
        document.body.classList.add('map-fullscreen-on');
        requestAnimationFrame(() => requestAnimationFrame(() => { if (_map) _map.invalidateSize(); }));
        document.addEventListener('keydown', _onFsKey, true);
    }
    function exitFullscreen() {
        if (!_isFullscreen) return;
        _isFullscreen = false;
        const fs = document.getElementById('mapFullscreen');
        if (fs) fs.hidden = true;
        if (_rootEl) {
            _rootEl.dataset.fullscreen = 'false';
            _rootEl.removeAttribute('data-desktop');
            if (_moduleHost) _moduleHost.appendChild(_rootEl);
        }
        document.body.classList.remove('map-fullscreen-on');
        document.removeEventListener('keydown', _onFsKey, true);
        requestAnimationFrame(() => { if (_map) _map.invalidateSize(); });
    }
    function _onFsKey(e) {
        if (e.key === 'Escape') { e.stopPropagation(); exitFullscreen(); }
    }

    // ── module DOM ──
    const ICON_MINIMIZE = `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path d="M2 6 L2 2 L6 2 M14 6 L14 2 L10 2 M2 10 L2 14 L6 14 M14 10 L14 14 L10 14"
            fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    const ICON_FULLSCREEN = `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path d="M2 6 L2 2 L6 2 M14 6 L14 2 L10 2 M2 10 L2 14 L6 14 M14 10 L14 14 L10 14"
            fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
            transform="scale(-1,1) translate(-16,0)"/>
    </svg>`;
    const ICON_EYE_OPEN = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
    </svg>`;
    const ICON_EYE_OFF = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>`;
    const ICON_FIT = `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 5 L8 1 M8 1 L5.5 3.5 M8 1 L10.5 3.5"/>
            <path d="M8 11 L8 15 M8 15 L5.5 12.5 M8 15 L10.5 12.5"/>
            <path d="M5 8 L1 8 M1 8 L3.5 5.5 M1 8 L3.5 10.5"/>
            <path d="M11 8 L15 8 M15 8 L12.5 5.5 M15 8 L12.5 10.5"/>
        </g>
    </svg>`;

    function buildRoot() {
        const root = document.createElement('div');
        root.className = 'map-module-root';
        root.dataset.fullscreen = 'false';
        root.innerHTML = `
            <div class="map-menu" data-collapsed="false">
                <div class="map-menu-header" role="button" tabindex="0" aria-label="Vis/skjul stedsliste">
                    <span class="map-menu-title">Steder</span>
                    <button class="map-menu-action" type="button" data-act="toggle-all" title="Vis/skjul alle">${ICON_EYE_OPEN}</button>
                    <span class="map-menu-chevron" aria-hidden="true">
                        <svg viewBox="0 0 12 12"><path d="M2 4 L6 8 L10 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                    <button class="map-menu-close" type="button" data-act="close-module" title="Lukk kart" aria-label="Lukk kart">✕</button>
                </div>
                <div class="map-menu-body">
                    <div class="map-menu-list"></div>
                </div>
            </div>
            <div class="map-menu-resize" role="separator" aria-orientation="vertical" title="Dra for å endre størrelse"></div>
            <div class="map-canvas-wrap">
                <div class="map-canvas"></div>
                <div class="map-canvas-tools">
                    <button class="map-tool-btn" type="button" data-act="fullscreen" title="Fullskjerm">⛶</button>
                    <button class="map-tool-btn map-tool-btn-back" type="button" data-act="exit-fullscreen" title="Minimer">${ICON_MINIMIZE}</button>
                    <button class="map-tool-btn" type="button" data-act="fit" title="Tilpass til alle">${ICON_FIT}</button>
                </div>
            </div>
        `;

        const menu = root.querySelector('.map-menu');
        const header = menu.querySelector('.map-menu-header');
        // Collapse allowed everywhere EXCEPT desktop fullscreen (the desktop
        // fullscreen layout uses the menu as a permanent left rail).
        const canCollapse = () => !(root.dataset.fullscreen === 'true' && root.dataset.desktop === 'true');
        header.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            if (!canCollapse()) return;
            menu.dataset.collapsed = menu.dataset.collapsed === 'true' ? 'false' : 'true';
        });
        header.addEventListener('keydown', (e) => {
            if (e.target.closest('button')) return;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!canCollapse()) return;
                menu.dataset.collapsed = menu.dataset.collapsed === 'true' ? 'false' : 'true';
            }
        });
        menu.querySelector('[data-act="toggle-all"]').addEventListener('click', (e) => {
            e.stopPropagation();
            const anyVisible = _places.some(p => _visibility.get(p.id) !== false);
            setAllVisibility(!anyVisible);
        });
        const closeBtn = menu.querySelector('[data-act="close-module"]');
        if (closeBtn) closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (_isFullscreen) exitFullscreen();
            if (window.AppModuleHost && window.AppModuleHost.isOpen()) {
                window.AppModuleHost.closeModule();
            }
        });

        const tools = root.querySelector('.map-canvas-tools');
        tools.querySelector('[data-act="fullscreen"]').addEventListener('click', enterFullscreen);
        tools.querySelector('[data-act="exit-fullscreen"]').addEventListener('click', exitFullscreen);
        tools.querySelector('[data-act="fit"]').addEventListener('click', fitAll);

        // Pointer-drag resize for the menu sidebar — only active in PC fullscreen.
        const handle = root.querySelector('.map-menu-resize');
        handle.addEventListener('pointerdown', (e) => {
            if (root.dataset.fullscreen !== 'true' || root.dataset.desktop !== 'true') return;
            if (e.button !== 0) return;
            e.preventDefault();
            try { handle.setPointerCapture(e.pointerId); } catch {}
            document.body.style.userSelect = 'none';
            const rootRect = root.getBoundingClientRect();
            const onMove = (ev) => {
                const w = Math.max(200, Math.min(rootRect.width - 200, ev.clientX - rootRect.left));
                root.style.setProperty('--map-menu-width', w + 'px');
                if (_map) _map.invalidateSize();
            };
            const onUp = () => {
                document.body.style.userSelect = '';
                window.removeEventListener('pointermove', onMove);
                window.removeEventListener('pointerup', onUp);
                window.removeEventListener('pointercancel', onUp);
            };
            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', onUp);
            window.addEventListener('pointercancel', onUp);
        });

        return root;
    }

    function mountInto(container) {
        if (_rootEl && _rootEl.parentNode === container) return;
        if (!_rootEl) _rootEl = buildRoot();
        container.appendChild(_rootEl);
        const canvas = _rootEl.querySelector('.map-canvas');
        const map = ensureMap(canvas);
        if (map) requestAnimationFrame(() => map.invalidateSize());
    }

    // ── public entry ──
    // opts.verseFilter = [{chapter, verse}, ...] → load all places for the block but only
    // show those whose refs hit one of the listed verses. focusId still wins if provided.
    //
    // Module binding rule: modules always operate on mainData[0]. If a caller
    // requests a non-top block, we isolate that block first (replacing the
    // view), then proceed with the now-top block. This keeps the rule simple
    // and avoids per-card module state.
    async function showForBlock(blockIdx, focusId, opts) {
        if (blockIdx !== 0 && typeof window.isolateToBlock === 'function') {
            await window.isolateToBlock(blockIdx);
            blockIdx = 0;
        }
        const reg = window.blockPlacesRegistry || {};
        const places = reg[blockIdx] || [];
        if (!places.length) return;

        // Source block book code (used for verse highlight)
        const block = (window.mainData && window.mainData[blockIdx]) || null;
        _activeBook = block && (block.book || block.book_usfm) || null;

        _places = places.slice();
        _visibility = new Map();
        const verseFilter = opts && Array.isArray(opts.verseFilter) ? opts.verseFilter : null;
        if (focusId != null) {
            _places.forEach(p => _visibility.set(p.id, p.id === focusId));
            _focusId = focusId;
        } else if (verseFilter && verseFilter.length) {
            const filterSet = new Set(verseFilter.map(v => `${v.chapter}:${v.verse}`));
            _places.forEach(p => {
                const refs = p.refs || [];
                const visible = refs.some(r => filterSet.has(`${r.chapter}:${r.verse}`));
                _visibility.set(p.id, visible);
            });
            _focusId = null;
        } else {
            _places.forEach(p => _visibility.set(p.id, true));
            _focusId = null;
        }
        _selectedId = null;
        _hoveredId = null;
        _hasBeenShown = true;
        clearEmptyState();

        if (window.AppModuleHost && window.AppModuleHost.isMobile()) {
            window.AppModuleHost.openModule('map');
        } else if (window.AppSidebar) {
            // Mount-on-demand: only this module mounts, not every registered one.
            if (typeof window.AppSidebar.openModule === 'function') {
                window.AppSidebar.openModule('map');
            } else {
                window.AppSidebar.ensureOpen();
            }
        }

        requestAnimationFrame(() => {
            if (_layerGroup) {
                renderLayers();
                renderMenu();
                if (focusId != null) selectPlace(focusId);
                else setTimeout(fitAll, 60);
            }
        });
    }

    // Re-bind module content to the current mainData[0]. Called when the
    // user navigates/expands/collapses card-0, or when isolation promotes a
    // new block to the top. Loads all places for the new block (no
    // verseFilter — marked verses are cleared by navigation anyway). If the
    // new block has no places, swaps the module to an empty state instead
    // of auto-closing — _hasBeenShown keeps the sidebar open.
    function rebindToMainBlock() {
        const md = window.mainData;
        const newBlock = (md && md.length) ? md[0] : null;
        const reg = window.blockPlacesRegistry || {};
        const places = newBlock ? (reg[0] || []) : [];

        // Invalidate any pending selectPlace finish() callback before tearing down
        // layers — its captured entry would otherwise apply style / openPopup on a
        // detached layer when the next moveend fires.
        _selectToken++;
        closeSubPopup({ silent: true });
        clearVerseHighlight(null);

        if (!places.length) {
            // Empty new block — keep the module mounted but show empty state.
            // (Per request: don't auto-close the sidebar; let the user see that
            // the current text has no places.)
            _places = [];
            _visibility = new Map();
            _focusId = null;
            _selectedId = null;
            _hoveredId = null;
            _activeBook = newBlock && (newBlock.book || newBlock.book_usfm) || null;
            if (_layerGroup) _layerGroup.clearLayers();
            _entries = [];
            renderEmptyState();
            return;
        }

        _activeBook = newBlock && (newBlock.book || newBlock.book_usfm) || null;
        _places = places.slice();
        _visibility = new Map();
        _places.forEach(p => _visibility.set(p.id, true));
        _focusId = null;
        _selectedId = null;
        _hoveredId = null;
        _hasBeenShown = true;

        clearEmptyState();
        if (_layerGroup) {
            renderLayers();
            renderMenu();
            setTimeout(fitAll, 60);
        }
    }

    // Empty state rendered when the active text has no places. Replaces both
    // the menu list and overlays the canvas with a centered message.
    function renderEmptyState() {
        if (!_rootEl) return;
        const list = _rootEl.querySelector('.map-menu-list');
        if (list) list.innerHTML = `<div class="map-menu-empty">Ingen steder å vise i denne teksten.</div>`;
        const wrap = _rootEl.querySelector('.map-canvas-wrap');
        if (wrap && !wrap.querySelector('.map-empty-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'map-empty-overlay';
            overlay.innerHTML = `<div class="map-empty-overlay-inner">Ingen steder å vise i denne teksten.</div>`;
            wrap.appendChild(overlay);
        }
    }
    function clearEmptyState() {
        if (!_rootEl) return;
        const overlay = _rootEl.querySelector('.map-empty-overlay');
        if (overlay) overlay.remove();
    }

    const moduleDef = {
        id: 'map',
        title: 'Kart',
        icon: '<img src="/static/images/map.png" alt="" class="sidebar-module-icon-img">',
        mount(container, ctx) {
            _container = container;
            mountInto(container);
            if (ctx && ctx.subscribe) {
                ctx.subscribe('opened', () => {
                    setTimeout(() => { if (_map) _map.invalidateSize(); }, 50);
                    setTimeout(() => { if (_map) _map.invalidateSize(); }, 380);
                });
                // Re-bind whenever the top text block changes. Stored on the
                // entry so unmount can detach it.
                _unsubMainBlock = ctx.subscribe('mainBlockChanged', () => {
                    if (!_places.length && !(window.blockPlacesRegistry && window.blockPlacesRegistry[0])) return;
                    rebindToMainBlock();
                });
            }
            setTimeout(() => { if (_map) _map.invalidateSize(); }, 380);
            if (_places.length) { renderLayers(); renderMenu(); }
        },
        unmount() {
            if (_unsubMainBlock) { try { _unsubMainBlock(); } catch {} _unsubMainBlock = null; }
            if (!_isFullscreen && _rootEl && _rootEl.parentNode) {
                _rootEl.parentNode.removeChild(_rootEl);
            }
            _container = null;
        },
        // _hasBeenShown gates auto-close: once the user has opened the map,
        // the module stays mounted (with an empty state) when navigating to
        // texts without places, instead of collapsing the sidebar.
        isEmpty() { return !_hasBeenShown; },
        clearAll() {
            _selectToken++;
            _places = [];
            _visibility = new Map();
            _focusId = null;
            _selectedId = null;
            _hoveredId = null;
            _activeBook = null;
            _hasBeenShown = false;
            if (_layerGroup) _layerGroup.clearLayers();
            _entries = [];
            clearVerseHighlight(null);
            closeSubPopup({ silent: true });
            clearEmptyState();
            if (_isFullscreen) exitFullscreen();
            const list = _rootEl && _rootEl.querySelector('.map-menu-list');
            if (list) list.innerHTML = '';
        },
    };

    window.MapModule = { moduleDef, showForBlock, openPlaceStats };

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
