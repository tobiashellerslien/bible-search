// Feedback modal — POST to /api/feedback (Telegram bot relay)
(function () {
    const modal = document.getElementById('feedbackModal');
    if (!modal) return;
    const closeBtn = document.getElementById('feedbackClose');
    const sendBtn = document.getElementById('feedbackSendBtn');
    const categoryEl = document.getElementById('feedbackCategory');
    const emailEl = document.getElementById('feedbackEmail');
    const messageEl = document.getElementById('feedbackMessage');
    const statusEl = document.getElementById('feedbackStatus');

    function setStatus(text, cls) {
        statusEl.textContent = text || '';
        statusEl.className = 'feedback-status' + (cls ? ' ' + cls : '');
    }

    function open() {
        setStatus('');
        modal.classList.add('open');
        setTimeout(() => messageEl && messageEl.focus(), 60);
    }
    function close() { modal.classList.remove('open'); }

    async function submit() {
        const category = categoryEl.value;
        const email = (emailEl.value || '').trim();
        const message = (messageEl.value || '').trim();
        if (!message) { setStatus('Skriv en melding først.', 'err'); messageEl.focus(); return; }
        if (message.length > 4000) { setStatus('Meldingen er for lang (maks 4000 tegn).', 'err'); return; }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStatus('Ugyldig e-postadresse.', 'err'); emailEl.focus(); return; }

        sendBtn.disabled = true;
        setStatus('Sender…');
        try {
            const resp = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, email, message }),
            });
            const data = await resp.json().catch(() => ({}));
            if (resp.ok && data.ok) {
                setStatus('Takk! Tilbakemeldingen er sendt.', 'ok');
                messageEl.value = '';
                emailEl.value = '';
                if (typeof window.showToast === 'function') window.showToast('Tilbakemelding sendt — takk!');
                setTimeout(close, 1400);
            } else if (resp.status === 429) {
                setStatus(`Vent ${data.retry_after || 30}s før neste melding.`, 'err');
            } else if (data.error === 'feedback_not_configured') {
                setStatus('Tilbakemeldingstjenesten er ikke konfigurert ennå.', 'err');
            } else {
                setStatus('Klarte ikke å sende. Prøv igjen senere.', 'err');
            }
        } catch (e) {
            setStatus('Nettverksfeil — sjekk tilkoblingen.', 'err');
        } finally {
            sendBtn.disabled = false;
        }
    }

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (sendBtn) sendBtn.addEventListener('click', submit);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) close();
    });

    const headerBtn = document.getElementById('feedbackToggle');
    if (headerBtn) headerBtn.addEventListener('click', open);
    document.addEventListener('click', (e) => {
        const t = e.target;
        if (t && t.id === 'openFeedbackBtn') {
            // close help modal if open
            const help = document.getElementById('helpModal');
            if (help) help.classList.remove('open');
            open();
        }
    });

    window.Feedback = { open, close };
})();
