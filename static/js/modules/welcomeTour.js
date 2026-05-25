// Welcome tour — Driver.js based onboarding for first-time visitors.
// Also exposes startModule(id) for per-module mini-tours.
(function () {
    const SEEN_KEY = 'welcomeTourSeen';
    const MODULE_SEEN_PREFIX = 'tourSeen.';
    const isMobile = () => window.innerWidth < 701;

    function seen() {
        try { return localStorage.getItem(SEEN_KEY) === '1'; } catch { return false; }
    }
    function markSeen() {
        try { localStorage.setItem(SEEN_KEY, '1'); } catch {}
    }

    function buildMainSteps() {
        const steps = [
            {
                element: '#searchInput',
                popover: {
                    title: '👋 Velkommen til Bibelsøk!',
                    description: 'Skriv en <strong>referanse</strong> (f.eks. <code>Joh 3:16</code>) for oppslag, eller <strong>ord/fraser</strong> for å søke i hele Bibelen. Autofullføring foreslår bøker mens du skriver.',
                    side: 'bottom', align: 'start',
                },
            },
            {
                element: '#searchInput',
                popover: {
                    title: '🔍 Søke-operatorer',
                    description: '<ul class="tour-list">'
                        + '<li><code>tro</code> — vanlig søk matcher alle ord som <em>starter</em> med dette (tro, tror, troen, trofast …)</li>'
                        + '<li><code>"evig liv"</code> — eksakt frase</li>'
                        + '<li><code>nåde -dom</code> — ekskluder ord</li>'
                        + '<li><code>nåde | frelse</code> — enten/eller</li>'
                        + '<li><code>GT: ord</code> — filter på testament</li>'
                        + '<li><code>Johannes: ord</code> — filter på bok</li>'
                        + '</ul><p class="tour-foot">Se hjelp-sida for hele listen.</p>',
                    side: 'bottom', align: 'start',
                },
            },
            {
                element: '#versionPickerBtn',
                popover: {
                    title: '📖 Bytt oversettelse',
                    description: 'Velg mellom flere norske og engelske bibeloversettelser.',
                    side: 'bottom', align: 'center',
                },
            },
            {
                element: '#visningBtn',
                popover: {
                    title: '👁 Visning',
                    description: 'Slå av/på versnummer, overskrifter, fotnoter, kryssreferanser og stedsmarkører (📍).',
                    side: 'bottom', align: 'center',
                },
            },
            {
                element: '#quickModeBtn',
                popover: {
                    title: '⚡ Hurtigsøk',
                    description: 'Slå på for live, feiltolerant søk mens du skriver — best for å finne et vers du nesten husker, raskt.',
                    side: 'bottom', align: 'center',
                },
            },
            {
                element: '#toolbarCompareBtn',
                popover: {
                    title: '⚖️ Sammenlign',
                    description: 'Sammenlign hvilken som helst passasje på tvers av bibeloversettelser side ved side',
                    side: 'bottom', align: 'center',
                },
            },
            {
                element: '#helpToggle',
                popover: {
                    title: '❓ Hjelp',
                    description: 'Full søke-syntaks, hurtigtaster og info. Du kan ta denne touren på nytt herfra.',
                    side: 'bottom', align: 'end',
                },
            },
            {
                element: '#feedbackToggle',
                popover: {
                    title: '💬 Send tilbakemelding',
                    description: 'Funnet en bug? Har du forslag eller ønsker? All tilbakemelding og kritikk settes stor pris på!',
                    side: 'bottom', align: 'end',
                },
            },
            {
                element: '#settingsToggle',
                popover: {
                    title: '⚙ Innstillinger',
                    description: 'Personlig tilpasning: Mørk modus, fonter, farge og standard-oversettelse.',
                    side: 'bottom', align: 'end',
                },
            },
        ];
        if (isMobile()) {
            steps.push({
                popover: {
                    title: '👆 Sveip for å bla',
                    description: 'På mobil kan du sveipe <strong>venstre/høyre</strong> på et åpent kapittel eller vers for å bla videre. Prøv det!',
                },
            });
        }
        steps.push({
            popover: {
                popoverClass: 'driver-popover-wide',
                title: '🎓 Studieverktøy',
                description: 'Når du har et åpent kapittel eller vers får du tilgang til:'
                    + '<ul class="tour-list">'
                    + '<li>🗺️ <strong>Kart</strong> — bibelske steder på satellittkart</li>'
                    + '<li>✒️ <strong>Kommentar</strong> — Scofield + Matthew Henry</li>'
                    + '<li>📕 <strong>Leksikon</strong> — Easton, Smith, Hitchcock</li>'
                    + '<li>🎨 <strong>Temaer</strong> — bibelske temaer som passer teksten</li>'
                    + '<li>📜 <strong>Outline</strong> — strukturert oversikt over boka</li>'
                    + '<li>🔗 <strong>Eksterne</strong> — grunntekst (BibleHub), BibleRef, kilde</li>'
                    + '<li>📌 <strong>Fest</strong> — hold flere passasjer åpne samtidig</li>'
                    + '</ul>'
                    + '<p class="tour-foot"><strong>To måter å åpne verktøyene på:</strong></p>'
                    + '<ul class="tour-list">'
                    + '<li><strong>Marker vers</strong> — klikk/tap på ett eller flere vers, så dukker en verktøylinje opp med knapp for hvert studieverktøy. Best når du vil studere et spesifikt vers eller utvalg.</li>'
                    + '<li><strong>«🎓 Studie»-knappen</strong> på hvert kort — åpner verktøyene for hele kapitlet eller den åpne passasjen.</li>'
                    + '</ul>'
                    + '<p class="tour-foot">På <strong>PC</strong> åpnes verktøyene i sidepanelet til høyre · på <strong>mobil</strong> sklir de opp fra bunnen.</p>',
            },
        });
        steps.push({
            popover: {
                popoverClass: 'driver-popover-wide',
                title: '🙏 Takk for at du tar verktøyet i bruk!',
                description: '<p>Jeg lagde denne appen fordi jeg selv savnet en måte å kunne søke raskt i bibelen på, spesielt i de norske oversettelsene. Håper at dette kan bli til nytte for andre også, både for å kunne finne rett vers i rett tid, som en hjelp til bibelstudie, og ikke minst for å bli bedre kjent med Gud og Hans ord.</p>'
                    + '<p class="tour-foot" style="text-align:right;font-style:italic;">— Tobias</p>',
            },
        });
        return steps;
    }

    function getDriverCtor() {
        if (typeof window.driver === 'function') return window.driver.js && window.driver.js.driver || window.driver;
        if (window.driver && typeof window.driver.driver === 'function') return window.driver.driver;
        if (window.driver && window.driver.js && typeof window.driver.js.driver === 'function') return window.driver.js.driver;
        return null;
    }

    function start(opts) {
        opts = opts || {};
        if (!opts.force && seen()) return;
        const ctor = getDriverCtor();
        if (!ctor) {
            // Driver.js not loaded yet — retry shortly
            if (opts._retry !== false) {
                setTimeout(() => start(Object.assign({}, opts, { _retry: false })), 600);
            }
            return;
        }
        // Filter to steps whose target element exists (skip empty)
        const allSteps = buildMainSteps();
        const steps = allSteps.filter(s => !s.element || document.querySelector(s.element));
        const tour = ctor({
            showProgress: true,
            allowClose: true,
            nextBtnText: 'Neste →',
            prevBtnText: '← Forrige',
            doneBtnText: 'Ferdig',
            progressText: '{{current}} / {{total}}',
            steps,
            onDestroyed: () => { markSeen(); },
        });
        tour.drive();
    }

    window.WelcomeTour = { start };

    // Auto-start on first visit, after DOM is ready and a brief delay so layout settles
    function autoStart() {
        if (seen()) return;
        setTimeout(() => start(), 800);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoStart);
    } else {
        autoStart();
    }
})();
