// ── Swipe navigation on verse cards ──
(function() {
    const resultsWrapper = document.getElementById('resultsWrapper');
    let activeCard = null;
    let startX = 0, startY = 0, startTime = 0;
    let isDragging = false;
    let indicatorLeft = null, indicatorRight = null;
    let isAnimating = false;

    function resetArrow(el) {
        if (!el) return;
        el.style.opacity = '';
        el.style.color = '';
    }

    function cleanup() {
        if (activeCard) {
            activeCard.classList.remove('swiping');
            activeCard.classList.remove('snap-back');
            activeCard.style.transform = '';
        }
        resetArrow(indicatorLeft);
        resetArrow(indicatorRight);
        activeCard = null;
        isDragging = false;
    }

    resultsWrapper.addEventListener('touchstart', function(e) {
        if (isAnimating) return;
        if (e.target.closest('.study-tray-inner')) return;
        const card = e.target.closest('.verse-card');
        if (!card || !card.dataset.swipeBook) return;
        activeCard = card;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTime = Date.now();
        isDragging = false;
        const swipeWrap = card.closest('.card-swipe-wrap') || card;
        indicatorLeft = swipeWrap.querySelector('.side-nav-prev');
        indicatorRight = swipeWrap.querySelector('.side-nav-next');
    }, { passive: true });

    resultsWrapper.addEventListener('touchmove', function(e) {
        if (!activeCard) return;
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;

        if (!isDragging) {
            if (Math.abs(dx) < 8) return;
            if (Math.abs(dy) > Math.abs(dx)) { activeCard = null; return; }
            isDragging = true;
            activeCard.classList.add('swiping');
        }

        e.preventDefault();

        const hasPrev = activeCard.dataset.swipeHasPrev === '1';
        const hasNext = activeCard.dataset.swipeHasNext === '1';
        const clampedDx = (dx < 0 && !hasNext) ? Math.max(dx, -12)
                        : (dx > 0 && !hasPrev) ? Math.min(dx, 12)
                        : dx * 0.92;

        activeCard.style.transform = `translateX(${clampedDx}px)`;

        const cardW = activeCard.offsetWidth || 300;
        const threshold = Math.min(cardW * 0.28, 80);
        const progress = Math.min(Math.abs(clampedDx) / threshold, 1);
        const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent') || '';

        if (indicatorRight) {
            if (dx < 0 && hasNext) {
                indicatorRight.style.opacity = String(progress);
                indicatorRight.style.color = accent;
            } else {
                indicatorRight.style.opacity = '0';
                indicatorRight.style.color = '';
            }
        }
        if (indicatorLeft) {
            if (dx > 0 && hasPrev) {
                indicatorLeft.style.opacity = String(progress);
                indicatorLeft.style.color = accent;
            } else {
                indicatorLeft.style.opacity = '0';
                indicatorLeft.style.color = '';
            }
        }
    }, { passive: false });

    async function commitSwipe(card, direction) {
        isAnimating = true;
        resetArrow(indicatorLeft);
        resetArrow(indicatorRight);

        const book = card.dataset.swipeBook;
        const ch = parseInt(card.dataset.swipeCh, 10);
        const firstV = parseInt(card.dataset.swipeFirstV, 10);
        const lastV = parseInt(card.dataset.swipeLastV, 10);
        const bName = card.dataset.swipeBname;
        const isVerse = card.dataset.swipeIsVerse === '1';

        const m = (card.id || '').match(/^card-(\d+)$/);
        const cardIdx = m ? parseInt(m[1], 10) : undefined;
        if (isVerse) {
            await goVerse(book, ch, direction === 'next' ? lastV : firstV, bName, direction, cardIdx);
        } else {
            await goChapter(book, direction === 'next' ? ch + 1 : ch - 1, bName, direction, cardIdx);
        }
        isAnimating = false;
    }

    function snapBack(card) {
        card.classList.remove('swiping');
        card.classList.add('snap-back');
        card.style.transform = '';
        resetArrow(indicatorLeft);
        resetArrow(indicatorRight);
        setTimeout(() => { if (card) card.classList.remove('snap-back'); }, 220);
    }

    resultsWrapper.addEventListener('touchend', function(e) {
        if (!activeCard || !isDragging) { activeCard = null; isDragging = false; return; }
        const card = activeCard;
        activeCard = null;
        isDragging = false;

        const dx = e.changedTouches[0].clientX - startX;
        const dt = Date.now() - startTime;
        const velocity = Math.abs(dx) / Math.max(dt, 1);
        const cardW = card.offsetWidth || 300;
        const threshold = Math.min(cardW * 0.28, 80);
        const hasPrev = card.dataset.swipeHasPrev === '1';
        const hasNext = card.dataset.swipeHasNext === '1';

        if ((dx < -threshold || (velocity > 0.3 && dx < -30)) && hasNext) {
            commitSwipe(card, 'next');
        } else if ((dx > threshold || (velocity > 0.3 && dx > 30)) && hasPrev) {
            commitSwipe(card, 'prev');
        } else {
            snapBack(card);
        }
    }, { passive: true });

    resultsWrapper.addEventListener('touchcancel', function() {
        if (activeCard && isDragging) snapBack(activeCard);
        activeCard = null;
        isDragging = false;
    }, { passive: true });
})();
