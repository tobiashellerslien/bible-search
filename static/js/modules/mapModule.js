// ── Map sidebar/drawer module ──
// Registers as both an AppSidebar module (PC) and AppDrawer module (mobile).
// One Leaflet instance, lazily created. DOM lives inside .map-module-root,
// which can be moved into #mapFullscreen for the fullscreen experience.
(function () {
    const FOCUS_MAX_ZOOM = 6;        // ≈ "see all of Israel"
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
            zoomSnap: 0,
            zoomDelta: 0.5,
            // Tuned to feel like a "normal" map: one notch of mouse-wheel
            // advances ~half a zoom level. Trackpads accumulate the smaller
            // deltas naturally via the debounce window.
            wheelDebounceTime: 40,
            wheelPxPerZoomLevel: 100,
            minZoom: 2,
            maxZoom: 14,
            worldCopyJump: true,
            zoomControl: true,
        });
        L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            { attribution: 'Tiles &copy; Esri', maxZoom: 19 }
        ).addTo(_map);
        L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
            { attribution: '', maxZoom: 19, opacity: 0.95 }
        ).addTo(_map);

        _map.createPane('regionsPane'); _map.getPane('regionsPane').style.zIndex = 400;
        _map.createPane('linesPane');   _map.getPane('linesPane').style.zIndex   = 410;
        _map.createPane('pointsPane');  _map.getPane('pointsPane').style.zIndex  = 420;

        _map.setView([31.78, 35.22], 7);
        _layerGroup = L.layerGroup().addTo(_map);

        _map.on('popupclose', () => {
            if (_selectedId !== null) {
                const e = mainEntry(_selectedId);
                if (e) {
                    resetStyle(e);
                    setMarkerState(e, '');
                }
                _selectedId = null;
            }
            // Always purge every map-highlight from the text — popupclose fires
            // before the next popupopen, so we won't drop a fresh highlight.
            clearVerseHighlight(null);
            highlightMenu(null);
            // Sub-popup is anchored to the popup; closing the popup must close it too,
            // otherwise it lingers and its outside-click listener leaks across opens.
            closeSubPopup();
        });

        // Map-level mousemove for nested-region hover-through.
        _map.on('mousemove', (e) => {
            if (!_entries.length) return;
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
            }
        });
        _map.on('mouseout', () => {
            if (_hoveredId !== null && _hoveredId !== _selectedId) {
                const prev = mainEntry(_hoveredId);
                if (prev) resetStyle(prev);
            }
            _hoveredId = null;
        });

        return _map;
    }

    function mainEntry(id) { return _entries.find(e => e.role === 'main' && e.place.id === id); }

    // ── styles (note: weight is what creates "thickness"; no scale transforms on geometry) ──
    function stylePolyBase(place)     { const c = colorForPlace(place); return { pane:'regionsPane', color:c, weight:2, fillColor:c, fillOpacity:0.22 }; }
    function stylePolyHover(place)    { const c = colorForPlace(place); return { pane:'regionsPane', color:c, weight:3, fillColor:c, fillOpacity:0.32 }; }
    function stylePolySelected(place) { const c = colorForPlace(place); return { pane:'regionsPane', color:c, weight:4, fillColor:c, fillOpacity:0.45 }; }
    function styleLineBase(place)     { const c = colorForPlace(place); return { pane:'linesPane', color:c, weight:4, opacity:0.95 }; }
    function styleLineHover(place)    { const c = colorForPlace(place); return { pane:'linesPane', color:c, weight:6, opacity:1 }; }
    function styleLineSelected(place) { const c = colorForPlace(place); return { pane:'linesPane', color:c, weight:7, opacity:1 }; }
    function styleHitLine()           { return { pane:'linesPane', color:'#000', weight:18, opacity:0, interactive:true }; }

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
    function buildPopupHtml(place) {
        const c = colorForPlace(place);
        const namePart = place.preceding_article ? `${esc(place.preceding_article)} ${esc(place.name)}` : esc(place.name);

        let html = `<div class="map-popup" data-place-id="${place.id}" style="--place-color:${c}">`;
        html += `<div class="popup-header">
            <span class="popup-kind-icon">${placeIconHtml(place, 20)}</span>
            <div class="popup-header-text">
                <div class="popup-name">${namePart}</div>`;
        if (place.semantic_type) {
            html += `<div class="popup-semantic">${esc(place.semantic_type)}</div>`;
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
        html += `<button class="popup-pill" data-act="stats" type="button"${dis(hasStats)}>📊 Statistikk</button>`;
        html += `<button class="popup-pill" data-act="details" type="button"${dis(hasDetails)}>ℹ️ Detaljer</button>`;
        html += `<button class="popup-pill" data-act="links" type="button"${dis(hasLinks)}>🔗 Lenker</button>`;
        html += `</div>`;

        // Refs within current block
        if (place.refs && place.refs.length) {
            const maxShown = 12;
            html += `<div class="popup-refs"><span class="popup-label">Nevnt:</span> `;
            const labels = place.refs.slice(0, maxShown).map(r => `${r.chapter}:${r.verse}`);
            html += esc(labels.join(', '));
            if (place.refs.length > maxShown) html += ` <span class="popup-refs-more">+${place.refs.length - maxShown}</span>`;
            html += `</div>`;
        }

        html += `</div>`;
        return html;
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

    // ── sub-popup (floating mini panel near the action pill) ──
    let _activeSubPopup = null;
    function closeSubPopup() {
        if (_activeSubPopup) {
            _activeSubPopup.remove();
            _activeSubPopup = null;
            document.removeEventListener('mousedown', _onSubPopupOutside, true);
        }
    }
    function _onSubPopupOutside(e) {
        if (!_activeSubPopup) return;
        if (_activeSubPopup.contains(e.target)) return;
        // Allow clicking the originating pill to toggle off
        if (e.target.closest('.popup-pill')) return;
        closeSubPopup();
    }
    function openSubPopup(kind, place, anchorEl) {
        closeSubPopup();
        const c = colorForPlace(place);
        const aliases = (place.aliases || []).filter(a => a && a !== place.name);
        const div = document.createElement('div');
        div.className = 'map-subpopup';
        div.style.setProperty('--place-color', c);
        let inner = `<div class="map-subpopup-header">
            <span class="map-subpopup-title">${kind === 'details' ? 'Detaljer' : 'Lenker'}</span>
            <button class="map-subpopup-close" type="button" aria-label="Lukk">&times;</button>
        </div><div class="map-subpopup-body">`;
        if (kind === 'details') {
            if (place.placemark && place.placemark !== place.name) inner += `<div class="map-subpopup-row"><span class="map-subpopup-label">Placemark</span><div>${esc(place.placemark)}</div></div>`;
            if (place.semantic_type) inner += `<div class="map-subpopup-row"><span class="map-subpopup-label">Type</span><div>${esc(place.semantic_type)}</div></div>`;
            if (aliases.length) inner += `<div class="map-subpopup-row"><span class="map-subpopup-label">Alias</span><div>${esc(aliases.join(', '))}</div></div>`;
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
        document.body.appendChild(div);
        // Position near the pill button
        const r = anchorEl.getBoundingClientRect();
        const pw = 260;
        const left = Math.max(8, Math.min(window.innerWidth - pw - 8, r.left));
        div.style.left = left + 'px';
        div.style.top = (r.bottom + window.scrollY + 6) + 'px';
        _activeSubPopup = div;
        div.querySelector('.map-subpopup-close').addEventListener('click', closeSubPopup);
        // Sub-popup lives on <body>, so clicks must not bubble to the map and
        // close the parent leaflet popup.
        div.addEventListener('mousedown', (ev) => ev.stopPropagation());
        div.addEventListener('click', (ev) => ev.stopPropagation());
        // Defer outside-click handler until after this click finishes bubbling
        setTimeout(() => document.addEventListener('mousedown', _onSubPopupOutside, true), 0);
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
            const m = L.marker(c, { pane:'pointsPane', icon: buildPinIcon(place) });
            out.push({ layer: m, role:'main', isPoint: true });
        } else if (type === 'LineString') {
            const main = L.geoJSON(place.geometry, { pane:'linesPane', style: () => styleLineBase(place) });
            const hit  = L.geoJSON(place.geometry, { pane:'linesPane', style: styleHitLine });
            out.push({ layer: main, role:'main', isLine: true });
            out.push({ layer: hit,  role:'hit',  isLine: true });
        } else if (type === 'Polygon') {
            const poly = L.geoJSON(place.geometry, { pane:'regionsPane', style: () => stylePolyBase(place) });
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
                    // bindPopup already auto-opens on click; tell selectPlace
                    // not to re-open via setTimeout (the double-open would tear
                    // down the popup DOM mid-interaction and silently break the
                    // action buttons on subsequent re-opens).
                    selectPlace(targetId, { fromLatLng: ev?.latlng, openPopup: false });
                });

                // Point hover handlers — points are not detected by map mousemove
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
                        }
                    });
                }
                // Line hover handlers (the hit layer triggers them via main below)
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
                        }
                    });
                }

                if (spec.role === 'main') {
                    spec.layer.bindPopup(buildPopupHtml(p), {
                        maxWidth: 300,
                        autoPanPadding: [20, 20],
                        className: 'map-popup-wrap',
                    });
                    spec.layer.on('popupopen', () => {
                        highlightVerses(p);
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
        applySelectionStyle(entry);
        highlightMenu(placeId);

        const bounds = entry.layer.getBounds && entry.layer.getBounds();
        const center = geometryCentroid(entry.place.geometry);

        if (entry.isPolygon || entry.isLine) {
            if (bounds && bounds.isValid()) {
                _map.flyToBounds(bounds, { maxZoom: FOCUS_MAX_ZOOM, padding: [40,40], duration: 0.5 });
            }
        } else if (center) {
            const z = Math.min(_map.getZoom(), FOCUS_MAX_ZOOM);
            _map.flyTo(center, z, { duration: 0.5 });
        }

        const popupLatLng = opts.fromLatLng || center;
        if (opts.openPopup !== false && popupLatLng) {
            setTimeout(() => entry.layer.openPopup(popupLatLng), 480);
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
                    <button class="map-menu-eye" type="button" data-eye="${p.id}" title="${visible?'Skjul':'Vis'}" aria-label="${visible?'Skjul':'Vis'}">
                        ${visible ? '👁' : '🚫'}
                    </button>
                </div>`;
            });
            html += `</div>`;
        });
        if (!html) html = `<div class="map-menu-empty">Ingen steder.</div>`;
        listEl.innerHTML = html;

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
            closeSubPopup();
            const modal = document.getElementById('statsModal');
            if (modal) modal.classList.add('open');
        } catch {}
    }
    function renderPlaceStats(place) {
        const title = document.getElementById('statsModalTitle');
        if (title) title.textContent = `Statistikk: ${place.name}`;
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
            html += `<div class="place-stats-distribution"><div class="place-stats-section-label">Per kapittel</div>`;
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
                    const version = window.versionSelect ? window.versionSelect.value : null;
                    const bookRefs = refs.filter(r => r.book_usfm === code);
                    if (window.insertBlocksIntoView && bookRefs.length) {
                        const bName = nameOf(code);
                        const specs = bookRefs.map(r => ({
                            book: code,
                            ch_start: r.chapter, vs_start: r.verse,
                            ch_end: r.chapter,   vs_end: r.verse,
                            version,
                            label: `${bName} ${r.chapter}:${r.verse}`,
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
    // (Same outline shape — feels consistent in both states.)

    function buildRoot() {
        const root = document.createElement('div');
        root.className = 'map-module-root';
        root.dataset.fullscreen = 'false';
        root.innerHTML = `
            <div class="map-menu" data-collapsed="false">
                <div class="map-menu-header" role="button" tabindex="0" aria-label="Vis/skjul stedsliste">
                    <span class="map-menu-title">Steder</span>
                    <button class="map-menu-action" type="button" data-act="toggle-all" title="Vis/skjul alle">👁</button>
                    <button class="map-menu-action" type="button" data-act="fit" title="Tilpass til alle">
                        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                            <g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M8 5 L8 1 M8 1 L5.5 3.5 M8 1 L10.5 3.5"/>
                                <path d="M8 11 L8 15 M8 15 L5.5 12.5 M8 15 L10.5 12.5"/>
                                <path d="M5 8 L1 8 M1 8 L3.5 5.5 M1 8 L3.5 10.5"/>
                                <path d="M11 8 L15 8 M15 8 L12.5 5.5 M15 8 L12.5 10.5"/>
                            </g>
                        </svg>
                    </button>
                    <span class="map-menu-chevron" aria-hidden="true">
                        <svg viewBox="0 0 12 12"><path d="M2 4 L6 8 L10 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
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
                </div>
            </div>
        `;

        const menu = root.querySelector('.map-menu');
        const header = menu.querySelector('.map-menu-header');
        header.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            // disabled in fullscreen
            if (root.dataset.fullscreen === 'true') return;
            menu.dataset.collapsed = menu.dataset.collapsed === 'true' ? 'false' : 'true';
        });
        header.addEventListener('keydown', (e) => {
            if (e.target.closest('button')) return;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (root.dataset.fullscreen === 'true') return;
                menu.dataset.collapsed = menu.dataset.collapsed === 'true' ? 'false' : 'true';
            }
        });
        menu.querySelector('[data-act="toggle-all"]').addEventListener('click', (e) => {
            e.stopPropagation();
            const anyVisible = _places.some(p => _visibility.get(p.id) !== false);
            setAllVisibility(!anyVisible);
        });
        menu.querySelector('[data-act="fit"]').addEventListener('click', (e) => {
            e.stopPropagation();
            fitAll();
        });

        const tools = root.querySelector('.map-canvas-tools');
        tools.querySelector('[data-act="fullscreen"]').addEventListener('click', enterFullscreen);
        tools.querySelector('[data-act="exit-fullscreen"]').addEventListener('click', exitFullscreen);

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
    function showForBlock(blockIdx, focusId) {
        const reg = window.blockPlacesRegistry || {};
        const places = reg[blockIdx] || [];
        if (!places.length) return;

        // Source block book code (used for verse highlight)
        const block = (window.mainData && window.mainData[blockIdx]) || null;
        _activeBook = block && (block.book || block.book_usfm) || null;

        _places = places.slice();
        _visibility = new Map();
        if (focusId != null) {
            _places.forEach(p => _visibility.set(p.id, p.id === focusId));
            _focusId = focusId;
        } else {
            _places.forEach(p => _visibility.set(p.id, true));
            _focusId = null;
        }
        _selectedId = null;
        _hoveredId = null;

        if (window.AppDrawer && window.AppDrawer.isMobile()) {
            window.AppDrawer.ensureOpen();
        } else if (window.AppSidebar) {
            window.AppSidebar.ensureOpen();
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

    const moduleDef = {
        id: 'map',
        title: 'Kart',
        icon: '🗺️',
        mount(container, ctx) {
            _container = container;
            mountInto(container);
            if (ctx && ctx.subscribe) {
                ctx.subscribe('opened', () => {
                    setTimeout(() => { if (_map) _map.invalidateSize(); }, 50);
                    setTimeout(() => { if (_map) _map.invalidateSize(); }, 380);
                });
            }
            setTimeout(() => { if (_map) _map.invalidateSize(); }, 380);
            if (_places.length) { renderLayers(); renderMenu(); }
        },
        unmount() {
            if (!_isFullscreen && _rootEl && _rootEl.parentNode) {
                _rootEl.parentNode.removeChild(_rootEl);
            }
            _container = null;
        },
        isEmpty() { return _places.length === 0; },
        clearAll() {
            _places = [];
            _visibility = new Map();
            _focusId = null;
            _selectedId = null;
            _hoveredId = null;
            _activeBook = null;
            if (_layerGroup) _layerGroup.clearLayers();
            _entries = [];
            clearVerseHighlight(null);
            closeSubPopup();
            if (_isFullscreen) exitFullscreen();
            const list = _rootEl && _rootEl.querySelector('.map-menu-list');
            if (list) list.innerHTML = '';
        },
    };

    window.MapModule = { moduleDef, showForBlock, openPlaceStats };

    function tryRegister() {
        if (window.AppSidebar && window.AppSidebar.register) {
            window.AppSidebar.register(moduleDef);
            if (window.AppDrawer && window.AppDrawer.register) window.AppDrawer.register(moduleDef);
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
