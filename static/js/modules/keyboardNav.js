// ── Keyboard navigation (hotkeys + chapter/verse arrow nav) ──
let _arrowNavInFlight = false;
let _arrowNavPending = null; // 'prev' | 'next' — only the most recent press is kept
async function queueArrowNav(dir) {
    _arrowNavPending = dir;
    if (_arrowNavInFlight) return;
    _arrowNavInFlight = true;
    try {
        while (_arrowNavPending) {
            const d = _arrowNavPending;
            _arrowNavPending = null;
            if (!currentChapterInfo) break;
            const { book, chapter, bookName: bName, isVerseView, firstVerse, lastVerse } = currentChapterInfo;
            const maxCh = (_booksMap.get(book) || {}).chapters || 0;
            if (isVerseView) {
                if (d === 'prev') await goVerse(book, chapter, firstVerse, bName, 'prev');
                else await goVerse(book, chapter, lastVerse, bName, 'next');
            } else {
                if (d === 'prev' && chapter > 1) await goChapter(book, chapter - 1, bName, 'prev');
                else if (d === 'next' && chapter < maxCh) await goChapter(book, chapter + 1, bName, 'next');
            }
        }
    } finally {
        _arrowNavInFlight = false;
    }
}

document.addEventListener('keydown', e => {
    const inInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
    const autocompleteDropdown = document.getElementById('autocompleteDropdown');
    const searchInput = document.getElementById('searchInput');

    if (e.key === 'Escape') {
        if (document.getElementById('importantInfoModal').classList.contains('open')) document.getElementById('importantInfoClose').click();
        else if (document.getElementById('helpModal').classList.contains('open')) document.getElementById('helpModal').classList.remove('open');
        else if (document.getElementById('statsModal').classList.contains('open')) document.getElementById('statsModal').classList.remove('open');
        else if (document.getElementById('settingsModal').classList.contains('open')) document.getElementById('settingsModal').classList.remove('open');
        else if (autocompleteDropdown.classList.contains('open')) closeAutocomplete();
        else if (inInput) searchInput.blur();
        return;
    }

    if (e.key === 'q' && e.ctrlKey) { e.preventDefault(); setQuickMode(!quickMode); return; }

    if (inInput) return;

    if (e.key === '/') { e.preventDefault(); searchInput.focus(); searchInput.select(); return; }
    if (e.key === '?') { document.getElementById('helpModal').classList.toggle('open'); return; }

    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && currentChapterInfo) {
        e.preventDefault();
        queueArrowNav(e.key === 'ArrowLeft' ? 'prev' : 'next');
        return;
    }

    if (e.key === '[' || e.key === ']') {
        e.preventDefault();
        const idx = allVersionsList.findIndex(v => String(v.id) === window.versionSelect.value);
        if (e.key === '[' && idx > 0) { window.versionSelect.value = String(allVersionsList[idx - 1].id); window.versionSelect.dispatchEvent(new Event('change')); }
        else if (e.key === ']' && idx < allVersionsList.length - 1) { window.versionSelect.value = String(allVersionsList[idx + 1].id); window.versionSelect.dispatchEvent(new Event('change')); }
    }
});
