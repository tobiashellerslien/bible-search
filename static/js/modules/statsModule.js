// ── Stats module ──
(function() {
    const chartTooltip = document.getElementById('chartTooltip');
    const resultsWrapper = document.getElementById('resultsWrapper');

    window.openStats = async function(query) {
        const version = window.versionSelect.value;
        try {
            const resp = await fetch(`/api/stats?q=${encodeURIComponent(query)}&version=${encodeURIComponent(version)}`);
            const data = await resp.json();
            if (data.error) { showToast(t('toast.statsError', data.error)); return; }
            document.getElementById('statsModeSelect').value = statsNormMode;
            document.getElementById('statsModeSelect').style.display = '';
            renderStatsModal(data);
            document.getElementById('statsModal').classList.add('open');
        } catch { showToast(t('toast.statsFailed')); }
    };

    function normalizeCount(count, code) {
        if (statsNormMode === 'per_chapter') return count / (bookChapterCount(code) || 1);
        if (statsNormMode === 'per_verse') return count / (bookTotalVerses(code) || 1);
        return count;
    }

    function renderStatsModal(data) {
        window.lastStatsData = data;
        const { stats, total, query, scope_label } = data;
        const titleQuery = scope_label ? query : data.original_query;
        document.getElementById('statsModalTitle').textContent = t('stats.modalTitle', titleQuery);

        const withHits = stats.filter(s => s.count > 0);
        const otStats = stats.filter(s => isOTBook(s.code));
        const ntStats = stats.filter(s => !isOTBook(s.code));
        const otHits = otStats.reduce((a, s) => a + s.count, 0);
        const ntHits = ntStats.reduce((a, s) => a + s.count, 0);

        const topOverall = withHits.length > 0
            ? withHits.reduce((a, b) => normalizeCount(b.count, b.code) > normalizeCount(a.count, a.code) ? b : a)
            : null;
        const topOT = otStats.filter(s => s.count > 0).reduce(
            (a, b) => b && normalizeCount(b.count, b.code) > (a ? normalizeCount(a.count, a.code) : 0) ? b : a, null);
        const topNT = ntStats.filter(s => s.count > 0).reduce(
            (a, b) => b && normalizeCount(b.count, b.code) > (a ? normalizeCount(a.count, a.code) : 0) ? b : a, null);
        const lang = versionLang(window.versionSelect.value);

        function displayBookName(s) { return bookName(s.code, lang); }

        const maxNorm = topOverall ? normalizeCount(topOverall.count, topOverall.code) : 0;
        const otIsTop = topOT && normalizeCount(topOT.count, topOT.code) === maxNorm && maxNorm > 0;
        const ntIsTop = topNT && normalizeCount(topNT.count, topNT.code) === maxNorm && maxNorm > 0;

        function normLabel(s) {
            const nc = normalizeCount(s.count, s.code);
            if (statsNormMode === 'per_chapter') return t('stats.unitChapter', nc.toFixed(1));
            if (statsNormMode === 'per_verse') return t('stats.unitVerse', nc.toFixed(3));
            return t('stats.unitHits', s.count);
        }

        let html = `<div class="stats-summary">
            <div class="stats-card"><div class="stats-card-label">${escHtml(t('stats.totalHits'))}</div><div class="stats-card-value">${total}</div></div>
            <div class="stats-card"><div class="stats-card-label">${escHtml(t('stats.booksHit'))}</div><div class="stats-card-value">${withHits.length}</div></div>
            <div class="stats-card"><div class="stats-card-label">${escHtml(t('stats.gtHits'))}</div><div class="stats-card-value">${otHits}</div></div>
            <div class="stats-card"><div class="stats-card-label">${escHtml(t('stats.ntHits'))}</div><div class="stats-card-value">${ntHits}</div></div>`;

        if (topOT) {
            html += `<div class="stats-card" style="cursor:pointer${otIsTop ? ';border-color:var(--accent)' : ''}" onclick="navigateToBookInResults('${topOT.code}')" title="${escAttr(t('stats.goToResults'))}">
                <div class="stats-card-label">${otIsTop ? '&#127942; ' : ''}${escHtml(t('stats.topGT'))}</div>
                <div class="stats-card-value" style="font-size:0.85rem;">${escHtml(displayBookName(topOT))}<br><span style="font-size:0.75rem;opacity:0.7">${escHtml(normLabel(topOT))}</span></div>
            </div>`;
        }
        if (topNT) {
            html += `<div class="stats-card" style="cursor:pointer${ntIsTop ? ';border-color:var(--accent)' : ''}" onclick="navigateToBookInResults('${topNT.code}')" title="${escAttr(t('stats.goToResults'))}">
                <div class="stats-card-label">${ntIsTop ? '&#127942; ' : ''}${escHtml(t('stats.topNT'))}</div>
                <div class="stats-card-value" style="font-size:0.85rem;">${escHtml(displayBookName(topNT))}<br><span style="font-size:0.75rem;opacity:0.7">${escHtml(normLabel(topNT))}</span></div>
            </div>`;
        }
        html += `</div>`;

        if (scope_label) {
            html += `<div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:8px;font-family:var(--font-mono);">
                ${escHtml(t('stats.distribution', scope_label))}</div>`;
        }

        html += buildStatsChart(stats, lang);
        document.getElementById('statsBody').innerHTML = html;
        wireChartTooltips();
    }

    function buildStatsChart(stats, lang) {
        if (stats.length === 0) return '';
        const normalized = stats.map(s => ({ ...s, nc: normalizeCount(s.count, s.code) }));
        const maxNc = Math.max(...normalized.map(s => s.nc)) || 1;
        const barW = 10, barGap = 1, chartH = 140, labelH = 22;
        const svgH = chartH + labelH;
        const totalW = stats.length * (barW + barGap);

        let bars = '';
        normalized.forEach((s, i) => {
            const barH = s.nc > 0 ? Math.max(2, Math.round((s.nc / maxNc) * chartH)) : 0;
            const x = i * (barW + barGap);
            const y = chartH - barH;
            const cls = isOTBook(s.code) ? 'ot' : 'nt';
            const tip = escAttr(lang === 'en' ? (s.name_en || s.name) : s.name);
            bars += `<rect class="chart-bar ${cls}" x="${x}" y="${y}" width="${barW}" height="${barH}"
                data-name="${tip}" data-count="${s.count}" data-nc="${s.nc.toFixed(4)}" data-code="${escAttr(s.code)}"
                onclick="navigateToBookInResults('${escAttr(s.code)}')"/>`;
            bars += `<text class="chart-label"
                transform="translate(${x + barW / 2},${chartH + 2}) rotate(90)"
                text-anchor="start" dominant-baseline="middle"
                font-size="7.5" fill="var(--text-muted)">${escHtml(s.code)}</text>`;
        });
        bars += `<line x1="0" y1="${chartH}" x2="${totalW}" y2="${chartH}" stroke="var(--border)" stroke-width="1"/>`;

        return `<div class="chart-wrap">
            <svg class="stats-chart" viewBox="0 0 ${totalW} ${svgH}" preserveAspectRatio="xMinYMin meet"
                style="display:block;width:100%;min-height:${svgH}px">${bars}</svg>
        </div>`;
    }

    function wireChartTooltips() {
        document.querySelectorAll('.chart-bar').forEach(bar => {
            bar.addEventListener('mousemove', e => {
                chartTooltip.classList.add('visible');
                const nc = parseFloat(bar.dataset.nc);
                let tip = `<strong>${escHtml(bar.dataset.name)}</strong>${escHtml(t('stats.unitHits', bar.dataset.count))}`;
                if (statsNormMode === 'per_chapter') tip += ` (${escHtml(t('stats.unitChapter', nc.toFixed(2)))})`;
                else if (statsNormMode === 'per_verse') tip += ` (${escHtml(t('stats.unitVerse', nc.toFixed(4)))})`;
                chartTooltip.innerHTML = tip;
                chartTooltip.style.left = (e.clientX + 14) + 'px';
                chartTooltip.style.top = (e.clientY - 8) + 'px';
            });
            bar.addEventListener('mouseleave', () => chartTooltip.classList.remove('visible'));
        });
    }

    window.navigateToBookInResults = function(bookCode) {
        document.getElementById('statsModal').classList.remove('open');
        const group = resultsWrapper.querySelector(`.book-group[data-book="${bookCode}"]`);
        if (group) {
            group.querySelector('.book-group-header').classList.add('open');
            animateGroupItem(group.querySelector('.book-group-items'), true);
            updateExpandCollapseBtn();
            setTimeout(() => group.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        }
    };

    document.getElementById('statsClose').addEventListener('click', () => document.getElementById('statsModal').classList.remove('open'));
    document.getElementById('statsModal').addEventListener('click', e => {
        if (e.target === document.getElementById('statsModal')) document.getElementById('statsModal').classList.remove('open');
    });
    document.getElementById('statsModeSelect').addEventListener('change', function() {
        window.statsNormMode = this.value;
        if (lastStatsData) renderStatsModal(lastStatsData);
    });
})();
