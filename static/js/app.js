// ── i18n ──
const I18N = {
    no: {
        'header.help': 'Hjelp & om — trykk ? når som helst',
        'header.feedback': 'Send tilbakemelding',
        'header.settings': 'Innstillinger',
        'header.darkMode': 'Veksle mørk modus',
        'search.placeholder': 'Søk i Bibelen...',
        'search.clear': 'Tøm søk',
        'search.button': 'Søk',
        'display.browse': 'Oppslag:',
        'display.bookPlaceholder': '-- Bok --',
        'display.chapterPlaceholder': '-- Kap --',
        'toggle.verseNums': 'Versnummer',
        'toggle.newlines': 'Linjeskift per vers',
        'toggle.headings': 'Overskrifter',
        'toggle.annotations': 'Kryssreferanser og fotnoter †§',
        'toggle.places': 'Steder i tekst 📍',
        'modal.helpInfo': 'Hjelp & om',
        'help.section.search': 'Søk',
        'help.searchIntro': 'Skriv en <strong>referanse</strong> for oppslag (f.eks. <code>Joh 3:16</code>), eller <strong>ord/fraser</strong> for tekstsøk. Operatorene under kan kombineres. Autofullføring foreslår bøker mens du skriver.',
        'help.section.operators': 'Operatorer for tekstsøk',
        'help.section.searchGroups': 'Søkegrupper / filtre',
        'help.restartTour': '👋 Ta velkomst-touren på nytt',
        'help.openFeedback': '💬 Send tilbakemelding',
        'help.section.refLookup': 'Referanser',
        'help.row.singleVerse': 'Enkelt vers',
        'help.row.wholeChapter': 'Helt kapittel',
        'help.row.verseRange': 'Vers-område',
        'help.row.crossChapter': 'Område over flere kapitler',
        'help.row.verseToEnd': 'Fra et vers til slutten av kapittelet',
        'help.row.multiPassages': 'Flere passasjer (kontekst videreføres)',
        'help.row.abbrevs': 'Forkortelser og engelske navn fungerer',
        'help.section.textSearch': 'Tekstsøk-operatorer (kan kombineres)',
        'help.row.allWords': 'Prefix-søk — matcher tro, tror, troen, …',
        'help.row.substring': 'Inneholder «tro» (f.eks. Jetro)',
        'help.row.exactWord': 'Eksakt ord',
        'help.row.exactPhrase': 'Eksakt frase',
        'help.row.exclude': 'Ekskluder ord med -',
        'help.row.either': 'Enten/eller (også: |)',
        'help.row.bothWords': 'Begge ord (AND, implisitt)',
        'help.section.applyFilters': 'Bruk filter',
        'help.row.gt': 'Gamle Testamentet (også: OT:)',
        'help.row.nt': 'Nye Testamentet',
        'help.row.pentateuch': '1.–5. Mosebok (også: pentateuch:, torah:)',
        'help.row.historical': 'Josva – Ester (også: historical:)',
        'help.row.poetic': 'Job, Salme, Ordsp, Fork, Høys (også: visdom:, wisdom:)',
        'help.row.prophets': 'Jesaja – Malaki (også: prophets:)',
        'help.row.majorProphets': 'Jes, Jer, Klag, Esek, Dan (også: major prophets:)',
        'help.row.minorProphets': 'Hosea – Malaki (også: minor prophets:)',
        'help.row.gospels': 'Matt, Mark, Luk, Joh (også: gospels:)',
        'help.row.synoptic': 'Matt, Mark, Luk (også: synoptic:)',
        'help.row.epistles': 'Alle NT-brev (også: epistles:, letters:)',
        'help.row.pauline': 'Romerne – Filemon (også: pauline:)',
        'help.row.general': 'Hebreerne – Judas (også: general epistles:)',
        'help.row.johannine': 'Joh, 1–3 Joh, Åp (også: johannine:)',
        'help.row.apocalyptic': 'Daniel, Åpenbaringen (også: apocalyptic:)',
        'help.row.kingsChron': '1–2 Kong, 1–2 Krøn (også: kings and chronicles:)',
        'help.row.multiVolume': 'Hver flerbindsbok har sin egen gruppe — samuelsbøkene, kongebøkene, krønikebøkene, korinterbrevene, tessalonikerbrevene, timoteusbrevene, petersbrevene, johannesbrevene',
        'help.row.bookScope': 'BokNavn: tekst — søk innenfor én bok',
        'help.section.shortcuts': 'Hurtigtaster',
        'help.row.focusSearch': 'Fokuser søkefelt',
        'help.row.blurSearch': 'Avbryt fokus / lukk modal',
        'help.row.openHelp': 'Åpne/lukk hjelp',
        'help.row.prevNextChVs': 'Forrige/neste kapittel (eller vers ved enkeltvers-visning)',
        'help.row.swipeMobile': 'Sveip høyre/venstre for å navigere kapitler eller vers (mobil)',
        'help.row.prevNextVer': 'Forrige/neste bibeloversettelse',
        'help.row.tabAccept': 'Godta første autofullføring',
        'help.row.tabBookSearch': 'Søk innenfor fullført boknavn',
        'help.row.acNav': 'Naviger autofullføringer',
        'help.row.toggleQuick': 'Slå hurtigsøk av/på',
        'info.aboutMe.title': 'Om meg',
        // Fyll inn din bio nedenfor. HTML støttes (f.eks. <a href="..."> lenker).
        'info.aboutMe.text': 'Jeg heter Tobias, og er en kristen student i Trondheim. Jeg lagde denne appen fordi jeg selv savnet en måte å kunne søke raskt i bibelen på, spesielt i de norske oversettelsene. Håper nå at dette kan bli til nytte for andre også, både for å kunne finne rett vers i rett tid, som en hjelp til bibelstudie, og for å bli bedre kjent med Gud og Hans ord.',
        'info.aboutMe.favorites': 'Mine favorittvers',
        'info.license.title': 'Kilder & lisens',
        'info.license.text':
            '<li>Bibeltekst: <a href="https://www.bible.com" target="_blank" rel="noopener">YouVersion / bible.com</a> — lagret lokalt for rask søk. Alle rettigheter tilhører oversettelsenes opphavsrettighetsinnehavere; verktøyet er for personlig bruk.</li>'
            + '<li>Kryssreferanser &amp; stedsdata: <a href="https://www.openbible.info/" target="_blank" rel="noopener">OpenBible.info</a> (CC-BY 4.0). Stedene viser kun mest sannsynlige plassering — «There are almost certainly errors.»</li>'
            + '<li>Outlines &amp; temaer: <a href="https://berean.bible/" target="_blank" rel="noopener">Berean Bible (BSB)</a> sitt topical/outline-prosjekt.</li>'
            + '<li>Leksikon (Easton, Smith, Hitchcock): klassiske oppslagsverk i public domain.</li>'
            + '<li>Kart: satellittbilder © <a href="https://www.esri.com" target="_blank" rel="noopener">Esri</a> · gatekart © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> · rendering med <a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>.</li>'
            + '<li>Åpen kildekode (MIT): <a href="https://github.com/tobiashellerslien/bible-search" target="_blank" rel="noopener">github.com/tobiashellerslien/bible-search</a> · <a href="https://bibel.tjelle.net/" target="_blank" rel="noopener" style="color:var(--text-muted)">konkurrerende tjeneste</a>.</li>',
        'feedback.title': 'Send tilbakemelding',
        'feedback.intro': 'Alle tilbakemeldinger og kritikk settes stor pris på! Jeg ønsker at dette verktøyet skal bli best mulig. Meldingen din havner rett på mobilen min.',
        'feedback.category': 'Kategori',
        'feedback.cat.bug': '🐛 Feil',
        'feedback.cat.feature': '✨ Ny funksjon',
        'feedback.cat.change': '🔧 Endring',
        'feedback.cat.other': '💬 Annet',
        'feedback.emailLabel': 'E-post (valgfri)',
        'feedback.emailPlaceholder': 'valgfri — om du vil bli kontaktet',
        'feedback.messageLabel': 'Melding',
        'feedback.messagePlaceholder': 'Skriv tilbakemelding her…',
        'feedback.send': 'Send',
        'modal.stats': 'Statistikk',
        'stats.totalHits': 'Totalt treff',
        'stats.perChapter': 'Per kapittel',
        'stats.perVerse': 'Per vers',
        'stats.booksHit': 'Bøker med treff',
        'stats.gtHits': 'GT-treff',
        'stats.ntHits': 'NT-treff',
        'stats.topGT': 'Topp GT',
        'stats.topNT': 'Topp NT',
        'stats.distribution': 'Fordeling vises for hele Bibelen (søk var filtrert til: {0})',
        'stats.modalTitle': 'Statistikk: «{0}»',
        'stats.goToResults': 'Gå til resultater',
        'stats.unitHits': '{0} treff',
        'stats.unitChapter': '{0} / kap',
        'stats.unitVerse': '{0} / vs',
        'modal.settings': 'Innstillinger',
        'settings.appearance': 'Utseende',
        'settings.darkMode': 'Mørk modus',
        'settings.uiFont': 'Font',
        'settings.fontMono': 'Mono',
        'settings.fontSans': 'Sans',
        'settings.fontSerif': 'Serif',
        'settings.accentColor': 'Farge',
        'settings.customAccent': 'Egendefinert',
        'settings.verseFontSize': 'Skriftstørrelse (bibeltekst)',
        'settings.defaults': 'Standard',
        'settings.bibleVersion': 'Bibeloversettelse',
        'settings.savedDefault': 'Standardoversettelse lagret',
        'empty.title': 'Søk i Bibelen',
        'empty.tagline': 'Oppslag, søk og studieverktøy — på tvers av oversettelser.',
        'empty.verse.text': 'Hele Skriften er innåndet av Gud og nyttig til lærdom, til overbevisning, til rettledning, til opptuktelse i rettferdighet, for at Guds menneske kan være fullkomment, satt i stand til all god gjerning.',
        'empty.verse.ref': '2. Timoteus 3:16–17',
        'empty.btn.help': '? Hjelp',
        'empty.btn.about': 'ⓘ Om',
        'empty.btn.settings': '⚙ Innstillinger',
        'card.copy.title': 'Kopier',
        'card.compare': '⚖️ Sammenlign',
        'card.compare.title': 'Sammenlign oversettelser',
        'card.alignVerses': 'juster',
        'card.alignVerses.title': 'Juster vers side ved side',
        'card.allVersionsOption': '— Alle oversettelser —',
        'card.mapBtn.title': 'Se {0} sted(er) på kart',
        'card.study': '🎓 Studie',
        'card.study.title': 'Vis/skjul studie-verktøy',
        'card.study.map': '🗺️ Kart',
        'card.study.map.empty': 'Ingen steder i denne teksten',
        'card.study.commentary': '🖋️ Kommentar',
        'card.study.leksikon': '📕 Leksikon',
        'card.study.outline': '📜 Outline',
        'sidebar.outline.title': 'Outline',
        'sidebar.outline.loading': 'Laster outline…',
        'sidebar.outline.empty': 'Ingen outline for denne boka',
        'sidebar.outline.error': 'Kunne ikke laste outline',
        'sidebar.commentary.title': 'Kommentar',
        'sidebar.commentary.empty': 'Ingen kommentarer for denne teksten',
        'sidebar.commentary.loading': 'Laster kommentar…',
        'sidebar.commentary.intro': 'Intro til {0}',
        'sidebar.commentary.overview': 'Oversikt',
        'sidebar.commentary.refsTitle': 'Referanser',
        'sidebar.commentary.loadingPreview': 'Laster…',
        'sidebar.commentary.openVerse': 'Åpne',
        'sidebar.refPreview.loading': 'Laster…',
        'sidebar.refPreview.open': 'Åpne',
        'sidebar.refPreview.empty': 'Fant ikke verset',
        'sidebar.commentary.scope.tray': 'Kommentar til {0}',
        'sidebar.commentary.scope.mvb': 'Kommentar til markerte vers',
        'sidebar.commentary.expandToChapter': 'Vis for hele kapittelet',
        'mvb.commentary.title': 'Kommentar til markerte vers',
        'card.study.topics': '🎨 Temaer',
        'card.study.topics.empty': 'Ingen temaer for denne teksten',
        'sidebar.topics.title': 'Temaer',
        'sidebar.topics.empty': 'Ingen temaer for denne teksten',
        'sidebar.topics.loading': 'Laster temaer…',
        'sidebar.topics.scope.tray': 'Temaer i {0}',
        'sidebar.topics.scope.mvb': 'Temaer for markerte vers',
        'sidebar.topics.expandToChapter': 'Vis for hele kapittelet',
        'sidebar.topics.countTitle': 'Antall vers',
        'sidebar.topics.refCount': 'ref: {0}',
        'sidebar.topics.refCountTitle': 'Antall referanser i gjeldende tekst',
        'sidebar.topics.versesCount': 'vers: {0}',
        'sidebar.topics.versesCountTitle': 'Antall vers totalt i temaet',
        'sidebar.topics.subgroupCountTitle': 'Antall undergrupper',
        'sidebar.topics.jumpToTrigger': 'Gå til verset som utløste denne undergruppen',
        'sidebar.topics.showAll': 'Vis alle ({0} til)',
        'sidebar.topics.seeAlso': 'Se også',
        'sidebar.topics.back': '← Tilbake',
        'sidebar.leksikon.title': 'Leksikon',
        'sidebar.leksikon.empty': 'Ingen leksikon-oppslag for denne teksten',
        'sidebar.leksikon.loading': 'Laster leksikon…',
        'sidebar.leksikon.scope.tray': 'Leksikon for {0}',
        'sidebar.leksikon.scope.mvb': 'Leksikon for markerte vers',
        'sidebar.leksikon.expandToChapter': 'Vis for hele kapittelet',
        'mvb.leksikon.title': 'Leksikon for markerte vers',
        'mvb.topics.title': 'Temaer for markerte vers',
        'card.expandChapter': 'Vis hele kapittelet',
        'card.collapseChapter': 'Tilbake til vers',
        'card.navPrev': 'Forrige',
        'card.navNext': 'Neste',
        'card.compareLoading': 'Laster...',
        'card.compareNotFound': 'Ikke funnet',
        'card.compareFailed': 'Lasting feilet',
        'compare.mappedTooltip': 'Ulik versinndeling – versene er justert posisjonelt',
        'annot.fnTitle': 'Fotnote',
        'annot.xrTitle': 'Referanser',
        'annot.loadingRefs': 'Laster referanser…',
        'annot.loadError': 'Feil ved lasting.',
        'annot.noRefs': 'Ingen kryssreferanser funnet.',
        'annot.showAll': 'Vis alle {0} ↓',
        'annot.openAll': 'Åpne alle →',
        'annot.loading': 'Laster…',
        'annot.error': 'Feil',
        'chapterNav.prevCh': 'Forrige kapittel',
        'chapterNav.nextCh': 'Neste kapittel',
        'chapterNav.prevVs': 'Forrige vers',
        'chapterNav.nextVs': 'Neste vers',
        'toast.copied': 'Kopiert!',
        'toast.linkCopied': 'Lenke kopiert!',
        'toast.copyFailed': 'Kopiering feilet',
        'toast.clipboardUnavailable': 'Utklippstavle ikke tilgjengelig',
        'toast.statsError': 'Statistikkfeil: {0}',
        'toast.statsFailed': 'Kunne ikke laste statistikk.',
        'search.unknownPrefix': 'Ukjent filter: «{0}». Bruk en gyldig gruppe (f.eks. GT:, NT:, evangeliene:) eller et boknavn.',
        'search.emptyQuery': 'Skriv inn et søkeord etter filteret.',
        'search.missingReference': 'Skriv kapittel og evt. vers (f.eks. «{0} 1:1»), eller et søkeord.',
        'search.invalidQuery': 'Ugyldig søk. Sjekk skrivemåten og prøv igjen.',
        'searchResults.text.noResults': 'Ingen treff',
        'searchResults.text.noResultsBody': 'Ingen vers funnet for «{0}» i {1}.',
        'searchResults.searchAllVersions': 'Søk i alle oversettelser',
        'searchResults.allVersions.noResultsBody': 'Ingen vers funnet for «{0}» i noen oversettelse.',
        'searchResults.count': '{0} treff for «{1}»',
        'searchResults.countPlural': '{0} treff for «{1}»',
        'searchResults.allVersionsCountSingular': '{0} treff fordelt på {1} oversettelse for «{2}»',
        'searchResults.allVersionsCountVPlural': '{0} treff fordelt på {1} oversettelser for «{2}»',
        'searchResults.allVersionsCountRPlural': '{0} treff fordelt på {1} oversettelse for «{2}»',
        'searchResults.allVersionsCountAllPlural': '{0} treff fordelt på {1} oversettelser for «{2}»',
        'searchResults.expandAll': 'utvid alle',
        'searchResults.collapseAll': 'skjul alle',
        'searchResults.showAll': 'vis alle {0}',
        'searchResults.loadingAll': 'laster…',
        'searchResults.statsBtn': 'statistikk',
        'search.scope.button': 'søk i…',
        'search.scope.studyButton': 'Søk i kommentar, tema eller leksikon',
        'search.scope.title': 'Søk i en annen datakilde',
        'search.scope.bible': 'Bibeltekst',
        'search.scope.commentary': 'Bibelkommentar',
        'search.scope.topics': 'Temaer',
        'search.scope.leksikon': 'Leksikon',
        'search.scope.englishOnly': 'Disse søkene fungerer kun på engelsk.',
        'searchResults.studyLoading': 'Søker…',
        'searchResults.studyCount': '{0} treff',
        'searchResults.studyNoResults': 'Ingen treff',
        'searchResults.studyNoResultsBody': 'Fant ingen treff for «{0}». Husk at disse søkene kun fungerer på engelsk.',
        'study.commentary.snippetMore': 'Åpne kommentaren',
        'study.commentary.introTag': '(intro)',
        'study.commentary.overviewTag': '(oversikt)',
        'study.leksikon.sources': 'Treff i: {0}',
        'loading.errorGeneric': 'Feil',
        'loading.errorBody': 'Kunne ikke koble til server.',
        'loading.searchingTitle': 'Søker...',
        'loading.searchingBody': 'Søker i alle oversettelser etter «{0}»',
        'allVersions.failed': 'Kunne ikke hente oversettelser.',
        'ac.filter': 'filter',
        'ac.searchInBook': 'søk i bok',
        'verse.chapterHeading': 'Kapittel {0}',
        'quickSearch.toggle': 'Hurtigsøk — direkte treff mens du skriver',
        'quickSearch.hint': 'Hurtigsøk — skriv minst 3 tegn',
        'quickSearch.none': 'Ingen treff.',
        'quickSearch.truncated': 'Viser første {0} — skriv mer for å smalne inn.',
        'map.disclaimer': 'Mange av plasseringene er omtrentlige og kan inneholde feil. Se <a href="https://openbible.info/geo/" target="_blank" rel="noopener">openbible.info/geo</a> for kilder og alternative plasseringer.',
    },
};

// ───────────────────────────────────────────────────────────────
// FAVORITTVERS — fyll inn referanser her, separert med semikolon.
// Format: samme som søkefeltet aksepterer.
// Eksempler: 'Joh 3:16', 'Salme 23', '1. Mos 1:1-3', 'Rom 8:28;31-39'
// ───────────────────────────────────────────────────────────────
const FAVORITE_VERSES = [
    'Ef 2:8-9',
    'Apg 16:30-31',
    'Joh 10:28-29',
    'Joh 5:24',
    'Apg 17:11',
    '2. Tim 3:16-17',
    '2. Tim 2:11-13',
    'Salme 27:4',
    'Matt 6:25-34',
    'Jes 46:9-11'
];

function t(key, ...args) {
    let s = (I18N.no && I18N.no[key]) || key;
    args.forEach((a, i) => { s = s.split(`{${i}}`).join(String(a)); });
    return s;
}

function applyI18n() {
    document.documentElement.lang = 'no';
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
    document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    document.querySelectorAll('[data-i18n-tooltip]').forEach(el => { el.setAttribute('data-tooltip', t(el.dataset.i18nTooltip)); });
}

// ── Constants ──
// allVersionsList is populated in init() — [{id, name, full_name, language}, ...]
// versionSelect values are String(id) throughout the app.
function versionLabel(v) {
    const ver = _versionsMap.get(String(v));
    return ver ? ver.name : String(v);
}
function versionLang(v) {
    const ver = _versionsMap.get(String(v));
    return ver ? ver.language : 'no';
}

const BIBLEHUB_SLUGS = {
    GEN:'genesis',EXO:'exodus',LEV:'leviticus',NUM:'numbers',DEU:'deuteronomy',
    JOS:'joshua',JDG:'judges',RUT:'ruth',
    '1SA':'1_samuel','2SA':'2_samuel','1KI':'1_kings','2KI':'2_kings',
    '1CH':'1_chronicles','2CH':'2_chronicles',
    EZR:'ezra',NEH:'nehemiah',EST:'esther',JOB:'job',PSA:'psalms',
    PRO:'proverbs',ECC:'ecclesiastes',SNG:'songs',
    ISA:'isaiah',JER:'jeremiah',LAM:'lamentations',EZK:'ezekiel',DAN:'daniel',
    HOS:'hosea',JOL:'joel',AMO:'amos',OBA:'obadiah',JON:'jonah',MIC:'micah',
    NAM:'nahum',HAB:'habakkuk',ZEP:'zephaniah',HAG:'haggai',ZEC:'zechariah',MAL:'malachi',
    MAT:'matthew',MRK:'mark',LUK:'luke',JHN:'john',ACT:'acts',ROM:'romans',
    '1CO':'1_corinthians','2CO':'2_corinthians',
    GAL:'galatians',EPH:'ephesians',PHP:'philippians',COL:'colossians',
    '1TH':'1_thessalonians','2TH':'2_thessalonians',
    '1TI':'1_timothy','2TI':'2_timothy',TIT:'titus',PHM:'philemon',
    HEB:'hebrews',JAS:'james',
    '1PE':'1_peter','2PE':'2_peter',
    '1JN':'1_john','2JN':'2_john','3JN':'3_john',
    JUD:'jude',REV:'revelation'
};

const ENG_NAMES = {
    GEN:'Genesis',EXO:'Exodus',LEV:'Leviticus',NUM:'Numbers',DEU:'Deuteronomy',
    JOS:'Joshua',JDG:'Judges',RUT:'Ruth',
    '1SA':'1 Samuel','2SA':'2 Samuel','1KI':'1 Kings','2KI':'2 Kings',
    '1CH':'1 Chronicles','2CH':'2 Chronicles',
    EZR:'Ezra',NEH:'Nehemiah',EST:'Esther',JOB:'Job',PSA:'Psalms',
    PRO:'Proverbs',ECC:'Ecclesiastes',SNG:'Song of Solomon',
    ISA:'Isaiah',JER:'Jeremiah',LAM:'Lamentations',EZK:'Ezekiel',DAN:'Daniel',
    HOS:'Hosea',JOL:'Joel',AMO:'Amos',OBA:'Obadiah',JON:'Jonah',MIC:'Micah',
    NAM:'Nahum',HAB:'Habakkuk',ZEP:'Zephaniah',HAG:'Haggai',ZEC:'Zechariah',MAL:'Malachi',
    MAT:'Matthew',MRK:'Mark',LUK:'Luke',JHN:'John',ACT:'Acts',ROM:'Romans',
    '1CO':'1 Corinthians','2CO':'2 Corinthians',
    GAL:'Galatians',EPH:'Ephesians',PHP:'Philippians',COL:'Colossians',
    '1TH':'1 Thessalonians','2TH':'2 Thessalonians',
    '1TI':'1 Timothy','2TI':'2 Timothy',TIT:'Titus',PHM:'Philemon',
    HEB:'Hebrews',JAS:'James',
    '1PE':'1 Peter','2PE':'2 Peter',
    '1JN':'1 John','2JN':'2 John','3JN':'3 John',
    JUD:'Jude',REV:'Revelation'
};

const BOOK_DISPLAY_OVERRIDES_NO = { PSA: 'Salmene' };
const BOOK_DISPLAY_OVERRIDES_EN_SINGULAR = { PSA: 'Psalm' };

function isOTBook(code) {
    const b = _booksMap.get(code);
    return b ? b.testament === 'OT' : false;
}

// Each entry has no (Norwegian) and en (English) variants.
// The label is inserted into the search box and sent to the backend.
// Backend recognises both Norwegian and English keys.
const SEARCH_GROUPS = [
    { no: { label: 'GT:',               desc: 'Det Gamle Testamente' },    en: { label: 'OT:',                desc: 'Old Testament' } },
    { no: { label: 'NT:',               desc: 'Det Nye Testamente' },      en: { label: 'NT:',                desc: 'New Testament' } },
    { no: { label: 'mosebøkene:',       desc: '1.–5. Mosebok' },           en: { label: 'pentateuch:',        desc: 'Genesis – Deuteronomy' } },
    { no: { label: 'historiske:',       desc: 'Josva – Ester' },           en: { label: 'historical:',        desc: 'Joshua – Esther' } },
    { no: { label: 'poetiske:',         desc: 'Job, Salme, Ordsp, Fork, Høys' }, en: { label: 'poetic:',    desc: 'Job, Psalms, Prov, Eccl, Song' } },
    { no: { label: 'profetene:',        desc: 'Jesaja – Malaki' },          en: { label: 'prophets:',          desc: 'Isaiah – Malachi' } },
    { no: { label: 'store profeter:',   desc: 'Jes, Jer, Klag, Esek, Dan' }, en: { label: 'major prophets:', desc: 'Isa, Jer, Lam, Ezek, Dan' } },
    { no: { label: 'små profeter:',     desc: 'Hosea – Malaki' },           en: { label: 'minor prophets:',   desc: 'Hosea – Malachi' } },
    { no: { label: 'evangeliene:',      desc: 'Matt, Mark, Luk, Joh' },    en: { label: 'gospels:',           desc: 'Matt, Mark, Luke, John' } },
    { no: { label: 'synoptiske:',       desc: 'Matt, Mark, Luk' },          en: { label: 'synoptic:',          desc: 'Matt, Mark, Luke' } },
    { no: { label: 'brev:',             desc: 'Alle NT-brev' },             en: { label: 'epistles:',          desc: 'All NT letters' } },
    { no: { label: 'paulusbrevene:',    desc: 'Romerne – Filemon' },        en: { label: 'pauline:',           desc: 'Romans – Philemon' } },
    { no: { label: 'almenne brev:',     desc: 'Hebr – Judas' },             en: { label: 'general epistles:',  desc: 'Hebrews – Jude' } },
    { no: { label: 'fangenskapsbrev:',  desc: 'Ef, Fil, Kol, Filem' },      en: { label: 'prison epistles:',   desc: 'Eph, Phil, Col, Phlm' } },
    { no: { label: 'pastorale brev:',   desc: '1–2 Tim, Tit' },             en: { label: 'pastoral:',          desc: '1–2 Tim, Titus' } },
    { no: { label: 'johanneisk:',       desc: 'Joh, 1–3 Joh, Åp' },        en: { label: 'johannine:',         desc: 'John, 1–3 John, Rev' } },
    { no: { label: 'apokalyptiske:',    desc: 'Dan, Åp' },                  en: { label: 'apocalyptic:',       desc: 'Dan, Rev' } },
    { no: { label: 'konger og krøniker:',   desc: '1–2 Kong, 1–2 Krøn' },      en: { label: 'kings and chronicles:',  desc: '1–2 Kings, 1–2 Chr' } },
    { no: { label: 'samuelsbøkene:',        desc: '1–2 Samuel' },               en: { label: 'books of samuel:',       desc: '1–2 Samuel' } },
    { no: { label: 'kongebøkene:',          desc: '1–2 Kongebok' },             en: { label: 'books of kings:',        desc: '1–2 Kings' } },
    { no: { label: 'krønikebøkene:',        desc: '1–2 Krønikebok' },           en: { label: 'books of chronicles:',   desc: '1–2 Chronicles' } },
    { no: { label: 'korinterbrevene:',      desc: '1–2 Korinterbrev' },         en: { label: 'corinthian letters:',    desc: '1–2 Corinthians' } },
    { no: { label: 'tessalonikerbrevene:',  desc: '1–2 Tessalonikerbrev' },     en: { label: 'thessalonian letters:',  desc: '1–2 Thessalonians' } },
    { no: { label: 'timoteusbrevene:',      desc: '1–2 Timoteus' },             en: { label: 'letters to timothy:',    desc: '1–2 Timothy' } },
    { no: { label: 'petersbrevene:',        desc: '1–2 Peter' },                en: { label: 'letters of peter:',      desc: '1–2 Peter' } },
    { no: { label: 'johannesbrevene:',      desc: '1–3 Johannesbrev' },         en: { label: 'letters of john:',       desc: '1–3 John' } },
];

const VALID_GROUP_PREFIXES = new Set([
    'gt','nt',
    'mosebøkene','mosebøker','historiske','poetiske','visdom',
    'profetene','store profeter','små profeter',
    'evangeliene','synoptiske','brev','paulusbrevene',
    'fangenskapsbrev','pastorale brev','almenne brev','johanneisk','apokalyptiske',
    'samuelsbøkene','kongebøkene','krønikebøkene','korinterbrevene',
    'tessalonikerbrevene','timoteusbrevene','petersbrevene','johannesbrevene',
    'konger og krøniker',
    'ot','old testament','new testament','pentateuch','torah','law',
    'historical','historical books','poetic','poetry','wisdom','wisdom books',
    'prophets','major prophets','minor prophets',
    'gospels','synoptic','synoptic gospels',
    'epistles','letters','pauline','pauline epistles','prison epistles',
    'pastoral','pastoral epistles','general epistles','catholic epistles',
    'johannine','johannine literature','apocalyptic',
    'books of samuel','books of kings','books of chronicles',
    'corinthian letters','thessalonian letters','letters to timothy',
    'letters of peter','letters of john','kings and chronicles',
]);

const FONT_SIZES = [null, '0.85rem', '1.0rem', '1.1rem', '1.3rem', '1.5rem'];

function bookChapterCount(code) {
    const b = _booksMap.get(code);
    return b ? (b.chapters || 0) : 0;
}
function bookTotalVerses(code) {
    const b = _booksMap.get(code);
    if (!b || !b.verse_counts) return 0;
    return Object.values(b.verse_counts).reduce((a, n) => a + n, 0);
}

const COLOR_PRESETS = [
    { name: 'Blue',   l: '#2870e8', lh: '#1d5cc8', ld: 'rgba(40,112,232,0.12)',   d: '#5aafff', dh: '#4a9eee', dd: 'rgba(90,175,255,0.12)' },
    { name: 'Red',    l: '#b53232', lh: '#922222', ld: 'rgba(181,50,50,0.12)',    d: '#e06060', dh: '#c94444', dd: 'rgba(224,96,96,0.12)' },
    { name: 'Purple', l: '#7c3aed', lh: '#6d28d9', ld: 'rgba(124,58,237,0.12)',  d: '#a78bfa', dh: '#8b5cf6', dd: 'rgba(167,139,250,0.12)' },
];

// ── Page title ──
const DEFAULT_TITLE = document.title;
function setPageTitle(text) {
    document.title = text ? `${text} — Bibelsøk` : DEFAULT_TITLE;
}

// ── State ──
let lastQuery = '';
let mainData = null;
// Study tray is session-global: once user opens it, it stays open across
// navigation/searches until they close it. Not persisted across sessions.
let studyTrayOpen = false;
// Per-card UI state (keyed by card index in mainData) — runtime only, not persisted
let cardExpandedState = {};    // idx -> { originalBlock } when expanded from verse to chapter
let currentView = 'normal';
// Study-data search scope: null = ordinary bible search, otherwise one of
// 'commentary' | 'topics' | 'leksikon'. Non-persistent — reset on every fresh
// search from the search box.
let studySearchType = null;
let booksData = [];
let _booksMap = new Map();
let allVersionsCache = null;
let textSearchCache = null;
let textSearchGroupData = {};
let allVersionsTextCache = null;
let currentChapterInfo = null;
let allVersionsList = [];
let _versionsMap = new Map();
let currentAccent = (() => {
    const raw = localStorage.getItem('accentColor');
    if (raw === 'custom') return 'custom';
    const n = parseInt(raw || '0');
    if (isNaN(n) || n < 0 || n >= COLOR_PRESETS.length) return 0;
    return n;
})();
let customAccentHex = (() => {
    const v = localStorage.getItem('accentCustom') || '#2870e8';
    return /^#[0-9a-fA-F]{6}$/.test(v) ? v : '#2870e8';
})();
let lastTextSearchQuery = '';
const cardCompare = {};  // { [idx]: { version, data, visible } }
let compareIntent = false; // user's explicit compare on/off preference
let lastStatsData = null;
let statsNormMode = 'total';
let showAnnotations = localStorage.getItem('showAnnotations') !== 'false';
let showFootnotes = showAnnotations;
let showXrefs = showAnnotations;
let showPlaces = localStorage.getItem('showPlaces') === 'true';
const xrefCache = new Map();
const blockPlacesRegistry = {}; // { [cardIdx]: places[] }
window.blockPlacesRegistry = blockPlacesRegistry;
// Marked verses: key = `${book}.${chapter}.${verse}` → {book, chapter, verse, hasFn, hasXr, blockIdx, text}
const markedVerses = new Map();

// ── Elements ──
const searchInput = document.getElementById('searchInput');
const searchHighlightOverlay = document.getElementById('searchHighlightOverlay');
const searchHighlightContent = document.getElementById('searchHighlightContent');
const versionSelect = document.getElementById('versionSelect');
const searchBtn = document.getElementById('searchBtn');
const toggleVerseNums = document.getElementById('toggleVerseNums');
const toggleNewlines = document.getElementById('toggleNewlines');
const toggleHeadings = document.getElementById('toggleHeadings');
const toggleAnnotations = document.getElementById('toggleAnnotations');
const resultsWrapper = document.getElementById('resultsWrapper');
const emptyState = document.getElementById('emptyState');
// emptyState may be present-but-hidden when the server pre-renders a block.
// Capture the markup minus the `hidden` attribute so goHome() can restore the
// empty state as visible later.
const emptyStateHtml = emptyState
    ? emptyState.outerHTML.replace(/\s+hidden(="[^"]*")?/g, '')
    : '';
const toast = document.getElementById('toast');
const autocompleteDropdown = document.getElementById('autocompleteDropdown');
const searchWarningEl = document.getElementById('searchWarning');

function showSearchWarning(msg) {
    searchWarningEl.textContent = msg;
    searchWarningEl.style.display = 'block';
}
function clearSearchWarning() {
    searchWarningEl.style.display = 'none';
    searchWarningEl.textContent = '';
}

function getUnknownPrefix(query) {
    const q = query.trim();
    const m = q.match(/^([a-zA-ZæøåÆØÅ][a-zA-ZæøåÆØÅ ]*?):\s?/);
    if (!m) return null;
    const prefix = m[1].trim().toLowerCase();
    if (prefix === 'book') return null;
    if (VALID_GROUP_PREFIXES.has(prefix)) return null;
    const lang = versionLang(versionSelect.value);
    const isBook = booksData.some(b =>
        (b.aliases && b.aliases.some(a => a === prefix)) ||
        bookName(b.code, lang).toLowerCase() === prefix ||
        bookName(b.code, 'en').toLowerCase() === prefix
    );
    if (isBook) return null;
    return prefix;
}

// True when the query reads as a bible reference (a book name/alias followed by
// a chapter number, e.g. "Joh 3", "1 Mos 1:1"). Used so that typing a reference
// while a study-search scope is active jumps to the bible text instead of
// running a fruitless study search.
function looksLikeBibleReference(query) {
    const q = (query || '').trim().toLowerCase();
    if (!q || !/\d/.test(q)) return false;          // a reference needs a chapter number
    const lang = versionLang(versionSelect.value);
    for (const b of booksData) {
        const names = [];
        if (b.aliases) names.push(...b.aliases);
        names.push(bookName(b.code, lang).toLowerCase());
        names.push(bookName(b.code, 'en').toLowerCase());
        for (const n of names) {
            if (!n) continue;
            if (q.startsWith(n)) {
                const rest = q.slice(n.length);
                if (/^[\s:.,]*\d/.test(rest)) return true;   // book then chapter digit
            }
        }
    }
    return false;
}

// ── Init ──
async function init() {
    history.scrollRestoration = 'manual';
    const resp = await fetch('/api/versions');
    const data = await resp.json();
    const VERSION_ORDER = ['NB88','B2011','BGO','B1930','ESV','NASB','NKJV','KJV','NIV','BLB'];
    data.versions.sort((a, b) => {
        const ia = VERSION_ORDER.indexOf(a.name);
        const ib = VERSION_ORDER.indexOf(b.name);
        if (ia === -1 && ib === -1) return 0;
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
    });
    allVersionsList = data.versions; // [{id, name, full_name, language}, ...]
    _versionsMap = new Map(allVersionsList.map(v => [String(v.id), v]));
    data.versions.forEach(v => {
        versionSelect.add(new Option(v.name, String(v.id)));
    });
    const savedDefault = localStorage.getItem('defaultVersion');
    const idStrings = data.versions.map(v => String(v.id));
    if (savedDefault && idStrings.includes(savedDefault)) {
        versionSelect.value = savedDefault;
    } else {
        const nb88 = data.versions.find(v => v.name === 'NB88');
        if (nb88) versionSelect.value = String(nb88.id);
    }
    const dvSel = document.getElementById('defaultVersionSelect');
    if (dvSel) {
        data.versions.forEach(v => dvSel.add(new Option(v.name, String(v.id))));
        dvSel.value = (savedDefault && idStrings.includes(savedDefault)) ? savedDefault : versionSelect.value;
        dvSel.addEventListener('change', () => {
            localStorage.setItem('defaultVersion', dvSel.value);
            showToast(t('settings.savedDefault'));
        });
    }
    buildVersionPicker();
    await loadBooks();
    restoreFromURL();
}
init();

// ── Version picker (desktop) ──────────────────────────────────────────────────
function buildVersionPicker() {
    const list = document.getElementById('versionPickerList');
    if (!list) return;
    list.innerHTML = '';
    allVersionsList.forEach(v => {
        const el = document.createElement('div');
        el.className = 'vp-item';
        el.dataset.id = String(v.id);
        el.innerHTML = `<span class="vp-name">${escHtml(v.name)}</span><span class="vp-full">${escHtml(v.full_name)}</span>`;
        el.addEventListener('click', () => {
            versionSelect.value = String(v.id);
            versionSelect.dispatchEvent(new Event('change'));
            closeVersionPicker();
        });
        list.appendChild(el);
    });
    updateVersionPickerDisplay();
}

function updateVersionPickerDisplay() {
    const vid = versionSelect.value;
    const ver = _versionsMap.get(vid);
    const nameEl = document.getElementById('versionPickerName');
    if (nameEl) nameEl.textContent = ver ? ver.name : '—';
    document.querySelectorAll('#versionPickerList .vp-item').forEach(el => {
        el.classList.toggle('active', el.dataset.id === vid);
    });
}

function toggleVersionPicker() {
    document.getElementById('versionPicker').classList.toggle('open');
}

function closeVersionPicker() {
    const p = document.getElementById('versionPicker');
    if (p) p.classList.remove('open');
}

document.addEventListener('click', e => {
    if (!e.target.closest('#versionPicker')) closeVersionPicker();
});

async function loadBooks() {
    const version = versionSelect.value || '';
    const resp = await fetch(`/api/books?version=${encodeURIComponent(version)}`);
    const data = await resp.json();
    booksData = data.books;
    _booksMap = new Map(booksData.map(b => [b.code, b]));
    refreshBookDropdown();
}

function refreshBookDropdown() {
    // Re-render Bla panel if it's currently showing book/chapter list — book names
    // and chapter counts can change with version. Validates blaBook still exists.
    if (blaBook && !_booksMap.has(blaBook)) {
        blaBook = null;
        if (blaStep === 'chapter') blaStep = 'book';
    }
    if (document.getElementById('blaPanel')?.classList.contains('open')) renderBlaPanel();
}

versionSelect.addEventListener('change', () => {
    updateVersionPickerDisplay();
    loadBooks();
    updateMvbExternalLinks();
    if (quickMode && searchInput.value.trim().length >= 3) {
        runQuickSearch();
    } else if (currentView === 'text_search' && textSearchCache) {
        searchInput.value = textSearchCache.query;
        updateSearchHighlight();
        doSearch(false);
    } else if (currentView !== 'text_search_all' && lastQuery) {
        doSearch(false);
    }
});

// ── Bla (browse) panel state ──
let blaStep = 'testament';   // 'testament' | 'book' | 'chapter'
let blaTestament = null;     // 'OT' | 'NT'
let blaBook = null;          // book code
let blaCurrentChapter = null; // chapter to highlight on the chapter grid

function _topmostVisibleContext() {
    const cards = document.querySelectorAll('#resultsWrapper .verse-card');
    const offset = 80;
    for (const card of cards) {
        const rect = card.getBoundingClientRect();
        if (rect.bottom <= offset || rect.top >= window.innerHeight) continue;
        const verses = card.querySelectorAll('.verse-text-clickable[data-book]');
        for (const v of verses) {
            const vr = v.getBoundingClientRect();
            if (vr.bottom > offset) {
                const ch = parseInt(v.dataset.chapter, 10);
                if (v.dataset.book && Number.isFinite(ch)) {
                    return { book: v.dataset.book, chapter: ch };
                }
                break;
            }
        }
        const m = card.id.match(/^card-(\d+)$/);
        if (m && window.mainData) {
            const block = window.mainData[parseInt(m[1], 10)];
            if (block && block.book && block.verses && block.verses[0]) {
                return { book: block.book, chapter: block.verses[0].chapter };
            }
        }
        return null;
    }
    return null;
}

function renderBlaPanel() {
    const inner = document.getElementById('blaStepper');
    if (!inner) return;
    if (blaStep === 'testament' || !blaTestament) {
        blaStep = 'testament';
        inner.innerHTML =
            '<div class="bla-grid bla-grid-testaments">' +
                '<button type="button" class="bla-tile bla-tile-testament" data-bla-testament="OT">Gamle Testamentet</button>' +
                '<button type="button" class="bla-tile bla-tile-testament" data-bla-testament="NT">Nye Testamentet</button>' +
            '</div>';
    } else if (blaStep === 'book') {
        const lang = versionLang(versionSelect.value);
        const filtered = booksData.filter(b => b.testament === blaTestament);
        const tiles = filtered.map(b =>
            `<button type="button" class="bla-tile bla-tile-book" data-bla-book="${escAttr(b.code)}">${escHtml(bookName(b.code, lang))}</button>`
        ).join('');
        const label = blaTestament === 'OT' ? 'Gamle Testamentet' : 'Nye Testamentet';
        inner.innerHTML =
            `<div class="bla-breadcrumb"><button type="button" class="bla-back" data-bla-back="testament">← ${escHtml(label)}</button></div>` +
            `<div class="bla-grid bla-grid-books">${tiles}</div>`;
    } else if (blaStep === 'chapter') {
        const lang = versionLang(versionSelect.value);
        const book = _booksMap.get(blaBook);
        if (!book) { blaStep = 'book'; renderBlaPanel(); return; }
        let tiles = '';
        for (let i = 1; i <= book.chapters; i++) {
            const cur = (blaCurrentChapter === i) ? ' bla-tile-current' : '';
            tiles += `<button type="button" class="bla-tile bla-tile-chapter${cur}" data-bla-chapter="${i}">${i}</button>`;
        }
        inner.innerHTML =
            `<div class="bla-breadcrumb"><button type="button" class="bla-back" data-bla-back="book">← ${escHtml(bookName(book.code, lang))}</button></div>` +
            `<div class="bla-grid bla-grid-chapters">${tiles}</div>`;
    }
}

document.getElementById('blaStepper')?.addEventListener('click', e => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.blaTestament) {
        blaTestament = t.dataset.blaTestament;
        blaStep = 'book';
        renderBlaPanel();
    } else if (t.dataset.blaBook) {
        blaBook = t.dataset.blaBook;
        blaCurrentChapter = null;
        blaStep = 'chapter';
        renderBlaPanel();
    } else if (t.dataset.blaChapter) {
        const book = _booksMap.get(blaBook);
        if (!book) return;
        searchInput.value = `${book.name} ${t.dataset.blaChapter}`;
        updateSearchHighlight();
        doSearch();
        _setPanel('blaPanel', 'blaBtn', false);
    } else if (t.dataset.blaBack) {
        if (t.dataset.blaBack === 'testament') { blaTestament = null; blaStep = 'testament'; }
        else if (t.dataset.blaBack === 'book') { blaStep = 'book'; }
        renderBlaPanel();
    }
});

setInterval(() => fetch('/api/heartbeat').catch(() => {}), 300000);

// ── URL / History ──
// USFM → URL slug. Mirror of USFM_TO_SLUG in app/services/bible.py.
// Used to build canonical /bibel/<slug>/<ch>[/<vs>|<a-b>] URLs after a search.
const USFM_TO_SLUG = {
    GEN:'1mos',EXO:'2mos',LEV:'3mos',NUM:'4mos',DEU:'5mos',
    JOS:'jos',JDG:'dom',RUT:'rut','1SA':'1sam','2SA':'2sam',
    '1KI':'1kong','2KI':'2kong','1CH':'1kron','2CH':'2kron',
    EZR:'esra',NEH:'neh',EST:'est',JOB:'job',PSA:'salme',
    PRO:'ord',ECC:'fork',SNG:'hoys',ISA:'jes',
    JER:'jer',LAM:'klag',EZK:'esek',DAN:'dan',HOS:'hos',
    JOL:'joel',AMO:'amos',OBA:'obad',JON:'jona',MIC:'mika',
    NAM:'nah',HAB:'hab',ZEP:'sef',HAG:'hag',ZEC:'sak',
    MAL:'mal',MAT:'matt',MRK:'mark',LUK:'luk',JHN:'joh',
    ACT:'apg',ROM:'rom','1CO':'1kor','2CO':'2kor',
    GAL:'gal',EPH:'ef',PHP:'fil',COL:'kol',
    '1TH':'1tess','2TH':'2tess','1TI':'1tim','2TI':'2tim',
    TIT:'tit',PHM:'filem',HEB:'heb',JAS:'jak','1PE':'1pet',
    '2PE':'2pet','1JN':'1joh','2JN':'2joh','3JN':'3joh',JUD:'jud',
    REV:'ap',
};
const CANONICAL_VERSION_ID = '102'; // NB88

// Derive canonical path from a resolved block (the .results entries returned by
// /api/search type="reference"). Returns null if the block can't be expressed
// as a clean path (cross-chapter, no verses, error, …).
function canonicalPathFromBlock(block) {
    if (!block || block.error) return null;
    const slug = USFM_TO_SLUG[block.book];
    if (!slug) return null;
    const verses = block.verses || [];
    if (!verses.length) return null;
    const chs = new Set(verses.map(v => v.chapter));
    if (chs.size > 1) return null;
    const ch = verses[0].chapter;
    if (block.is_chapter) return `/bibel/${slug}/${ch}`;
    const a = verses[0].num;
    const b = verses[verses.length - 1].num;
    return a === b ? `/bibel/${slug}/${ch}/${a}` : `/bibel/${slug}/${ch}/${a}-${b}`;
}

// Build URL for a reference search. Prefers canonical /bibel/... path-form when
// the search resolves to a single, simple block; falls back to /?q= otherwise
// (text search, multi-block, cross-chapter). Caller may pass a `block`
// (resolved result) to enable path-form; otherwise uses /?q= path.
function buildURL(q, version, mode, block) {
    if (block && (!mode || mode === 'normal')) {
        const path = canonicalPathFromBlock(block);
        if (path) {
            return version && String(version) !== CANONICAL_VERSION_ID
                ? `${path}?v=${encodeURIComponent(version)}`
                : path;
        }
    }
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (version) p.set('v', version);
    if (mode && mode !== 'normal') p.set('mode', mode);
    const qs = p.toString();
    // Always return an absolute path. A bare "?q=..." would be resolved
    // *relative* to the current path, which appends instead of replacing when
    // the user is already on /bibel/<slug>/<ch> (giving URLs like
    // /bibel/joh/3?q=Rom+5).
    return qs ? `/?${qs}` : '/';
}

function pushState(q, version, mode, block) {
    const url = buildURL(q, version, mode, block);
    history.pushState({ q, version, mode: mode || 'normal' }, '', url);
}

// Build the URL for a study-data view. A study *search* is
// /studie?scope=<type>&q=<query>; a single-topic drilldown additionally
// carries &topic=<id>[&sg=<subgroupId>]. Unlike bible references these have
// their own URL (instead of reusing location.href) so reload / share / Back
// all restore the exact study view.
function buildStudyURL(type, q, version, topicId, sgId) {
    const p = new URLSearchParams();
    if (type) p.set('scope', type);
    if (q) p.set('q', q);
    if (topicId != null && topicId !== '') p.set('topic', String(topicId));
    if (sgId != null && sgId !== '') p.set('sg', String(sgId));
    if (version) p.set('v', String(version));
    const qs = p.toString();
    return qs ? `/studie?${qs}` : '/studie';
}
window.buildStudyURL = buildStudyURL;

// Cache of study-search responses keyed by `${type}|${query}|${version}` so a
// Back/Forward into a study search (or a scope re-toggle) restores instantly
// instead of re-hitting the API and losing scroll/expansion state.
const studyResultCache = new Map();
function studyCacheKey(type, q, version) { return `${type}|${q}|${version}`; }

// Read server-injected boot state (set on /bibel/... and /sok routes). Returns
// {q, v, noindex} or null if absent.
function readBootState() {
    const el = document.getElementById('bootState');
    if (!el) return null;
    try { return JSON.parse(el.textContent || '{}'); } catch { return null; }
}

// Render a study view (search or single-topic drilldown) from a restored URL,
// then stamp the matching studyNav state onto the current history entry so
// Back / modal balancing have a consistent base to work from.
function restoreStudyView(study, v) {
    if (!study || !study.scope) { goHome(false); return; }
    if (v && allVersionsList.some(x => String(x.id) === String(v))) {
        versionSelect.value = String(v);
    }
    searchInput.value = study.q || '';
    updateSearchHighlight();
    const version = versionSelect.value;
    if (study.topic) {
        const sgId = study.sg || null;
        if (window.StudySearch && typeof window.StudySearch.restoreTopic === 'function') {
            window.StudySearch.restoreTopic(Number(study.topic), { query: study.q, version, subgroupId: sgId });
        }
        try {
            history.replaceState({ studyNav: { kind: 'topic', id: Number(study.topic), type: 'topics', subgroupId: sgId, q: study.q, version } }, '', location.href);
        } catch {}
    } else {
        doStudySearch(study.scope, false);
        try {
            history.replaceState({ studyNav: { kind: 'search', type: study.scope, q: study.q, version } }, '', location.href);
        } catch {}
    }
}

function restoreFromURL() {
    try {
        // Server-rendered routes inject a bootState script. Trust it over URL
        // parsing — the server already resolved the label and version.
        const boot = readBootState();
        // Study view (search or topic drilldown) — own URL /studie?... . Prefer
        // the live URL params over the (initial-render) bootState, so a
        // null-state popstate back onto /studie restores the right view.
        if (window.location.pathname === '/studie') {
            const p = new URLSearchParams(window.location.search);
            const study = (boot && boot.study) || {
                scope: p.get('scope') || '', q: p.get('q') || '',
                topic: p.get('topic') || '', sg: p.get('sg') || '',
            };
            restoreStudyView(study, p.get('v') || (boot && boot.v) || '');
            return;
        }
        if (boot && boot.q) {
            if (boot.v && allVersionsList.some(x => String(x.id) === String(boot.v))) {
                versionSelect.value = String(boot.v);
            }
            searchInput.value = boot.q;
            updateSearchHighlight();
            doSearch(false, false);
            return;
        }
        const p = new URLSearchParams(window.location.search);
        const q = p.get('q') || '';
        const v = p.get('v') || '';
        const mode = p.get('mode') || 'normal';
        if (q) {
            if (v && allVersionsList.some(x => String(x.id) === v)) versionSelect.value = v;
            searchInput.value = q;
            updateSearchHighlight();
            if (mode === 'allversions') executeAllVersions(q);
            else doSearch(false, false);
        }
    } catch (e) {
        console.error('restoreFromURL error:', e);
    }
}

function restoreOpenXrefPanel(openXref) {
    if (!openXref) return;
    requestAnimationFrame(() => {
        const sel = `.xr-btn[data-book="${openXref.book}"][data-chapter="${openXref.chapter}"][data-verse="${openXref.verse}"]`;
        const btn = document.querySelector(sel);
        if (btn) {
            toggleXrefPanel(btn);
            requestAnimationFrame(() => {
                const verseLine = btn.closest('.verse-line');
                if (verseLine) verseLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        }
    });
}

window.addEventListener('popstate', async e => {
    if (e.state && e.state.modal) return;
    // A modal open/close drives history itself (see the modal↔history block at
    // the bottom of this file). Let it consume the pop so closing a modal (e.g.
    // statistics) doesn't fall through and needlessly re-run the search.
    if (typeof window.__handleModalPop === 'function' && window.__handleModalPop()) return;
    if (e.state && e.state.studyNav) {
        const nav = e.state.studyNav;
        if (nav.q != null) { searchInput.value = nav.q; updateSearchHighlight(); }
        if (nav.version && allVersionsList.some(x => String(x.id) === String(nav.version))) {
            versionSelect.value = String(nav.version);
        }
        // Returning to a study search closes any sidebar module (e.g. the
        // commentary opened from a hit) so the results aren't covered/pushed.
        if (window.AppSidebar && typeof window.AppSidebar.close === 'function') window.AppSidebar.close();
        if (window.AppModuleHost && typeof window.AppModuleHost.closeModule === 'function') window.AppModuleHost.closeModule();
        if (nav.kind === 'topic' && window.StudySearch && typeof window.StudySearch.restoreTopic === 'function') {
            window.StudySearch.restoreTopic(nav.id, { query: nav.q, version: nav.version, subgroupId: nav.subgroupId });
        } else {
            await doStudySearch(nav.type, false);
        }
        // Restore the scroll position stamped on this entry when we left it
        // (study results are cached, so the layout is back instantly).
        const savedScroll = e.state.scrollY;
        if (savedScroll != null) {
            requestAnimationFrame(() => window.scrollTo({ top: savedScroll, behavior: 'instant' }));
            setTimeout(() => window.scrollTo({ top: savedScroll, behavior: 'instant' }), 150);
        }
        return;
    }
    if (e.state) {
        const { q, version, mode, openXref, savedTextSearch, scrollY: savedScroll } = e.state;
        if (version && allVersionsList.some(x => String(x.id) === version)) versionSelect.value = version;
        if (q) {
            searchInput.value = q;
            updateSearchHighlight();
            if (mode === 'allversions') await executeAllVersions(q);
            else await doSearch(false, false);
            restoreOpenXrefPanel(openXref);
            if (savedTextSearch && currentView === 'text_search') {
                const { openBooks, scrollY: savedScrollY } = savedTextSearch;
                if (openBooks && openBooks.length > 0) {
                    openBooks.forEach(book => {
                        const group = resultsWrapper.querySelector(`.book-group[data-book="${book}"]`);
                        if (group) {
                            group.querySelector('.book-group-header')?.classList.add('open');
                            group.querySelector('.book-group-items')?.classList.add('open');
                        }
                    });
                    updateExpandCollapseBtn();
                    fixOpenGroupHeights();
                }
                if (savedScrollY != null) setTimeout(() => window.scrollTo({ top: savedScrollY, behavior: 'instant' }), 300);
            } else if (savedScroll != null) {
                // Restore scroll for normal/reference + all-versions views. Two
                // passes: once right after render, once after late layout
                // (images, lazily-loaded compare bodies) settles.
                requestAnimationFrame(() => window.scrollTo({ top: savedScroll, behavior: 'instant' }));
                setTimeout(() => window.scrollTo({ top: savedScroll, behavior: 'instant' }), 150);
            }
        } else {
            goHome(false);
        }
    } else {
        restoreFromURL();
    }
});

// ── Search ──
// Routes to study search if a scope is active and results are showing,
// otherwise falls through to normal bible search.
function triggerSearch() {
    // A bible reference typed while a study scope is active should jump to the
    // bible text, not be (vainly) searched within the study dataset.
    if (studySearchType && currentView === 'study_search'
        && !looksLikeBibleReference(searchInput.value)) {
        doStudySearch(studySearchType);
    } else {
        doSearch();
    }
}
searchBtn.addEventListener('click', triggerSearch);
searchInput.addEventListener('keydown', e => {
    if (quickMode && acSelectedIndex < 0 && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        const rows = [...resultsWrapper.querySelectorAll('.quick-row')];
        if (!rows.length) return;
        e.preventDefault();
        let idx = rows.findIndex(r => r.classList.contains('selected'));
        idx = e.key === 'ArrowDown'
            ? (idx < 0 ? 0 : Math.min(rows.length - 1, idx + 1))
            : (idx <= 0 ? rows.length - 1 : idx - 1);
        rows.forEach(r => r.classList.remove('selected'));
        rows[idx].classList.add('selected');
        rows[idx].scrollIntoView({ block: 'nearest' });
        return;
    }
    if (e.key === 'Enter' && acSelectedIndex < 0) {
        if (quickMode) {
            const selected = resultsWrapper.querySelector('.quick-row.selected');
            const target = selected || resultsWrapper.querySelector('.quick-row');
            if (target) target.click();
            return;
        }
        triggerSearch();
    }
});

async function doSearch(pushHistory = true, resetAC = true) {
    if (resetAC) closeAutocomplete();
    clearAllMarkedVerses();
    const query = searchInput.value.trim();
    if (!query) return;

    const unknownPrefix = getUnknownPrefix(query);
    if (unknownPrefix) {
        showSearchWarning(t('search.unknownPrefix', unknownPrefix));
        return;
    }
    clearSearchWarning();

    lastQuery = query;
    currentView = 'normal';
    studySearchType = null;   // fresh search defaults back to bible search
    currentChapterInfo = null;
    Object.keys(cardCompare).forEach(k => delete cardCompare[k]);
    if (typeof updateWideMode === 'function') updateWideMode();
    const version = versionSelect.value;
    // Snapshot the outgoing scroll/URL/state so the entry we're about to leave
    // gets stamped with its scroll position (restored on Back via popstate).
    const _outScrollY = window.scrollY;
    const _outUrl = window.location.pathname + window.location.search;
    const _outState = history.state;
    // History entry is deferred until after the API responds so we can land on
    // the canonical /bibel/<slug>/<ch>[/<vs>] path directly — no brief flash of
    // the /?q=... form in the address bar before replaceState corrects it.
    // Tradeoff: pressing Back mid-fetch won't undo this search (which never
    // produced a history entry), but mid-fetch back is a rare case.
    updateSearchHighlight();

    try {
        const resp = await fetch(`/api/search?q=${encodeURIComponent(query)}&version=${encodeURIComponent(version)}`);
        const data = await resp.json();
        if (data.error) {
            const err = data.error;
            if (err && err.code === 'unknown_prefix') {
                showSearchWarning(t('search.unknownPrefix', err.name || '?'));
            } else if (err && err.code === 'empty_query') {
                showSearchWarning(t('search.emptyQuery'));
            } else if (err && err.code === 'missing_reference') {
                showSearchWarning(t('search.missingReference', err.name || '?'));
            } else if (err && err.code === 'invalid_query') {
                showSearchWarning(t('search.invalidQuery'));
            } else {
                console.error('Search error:', err);
                resultsWrapper.innerHTML = errorCardHtml(t('loading.errorGeneric'), t('loading.errorBody'));
            }
            return;
        }

        if (data.type === 'text_search') {
            currentView = 'text_search';
            lastTextSearchQuery = data.query;
            textSearchCache = { results: data.results, query: data.query, bookTotals: data.book_totals || {} };
            renderTextSearch(data.results, data.query, data.book_totals || {});
            // Search view → sidebar modules clear stale per-text content.
            try { window.AppSidebar && window.AppSidebar.notifyMainBlockChanged(); } catch {}
            if (pushHistory) {
                const finalUrl = buildURL(query, version);
                const currentUrl = window.location.pathname + window.location.search;
                const state = { q: query, version, mode: 'normal' };
                try {
                    if (finalUrl !== currentUrl) {
                        history.replaceState({ ...(_outState || {}), scrollY: _outScrollY }, '', _outUrl);
                        history.pushState(state, '', finalUrl);
                    } else {
                        // Same URL (e.g. re-running the same query, or landing
                        // where a study view sat): replace in place so we never
                        // stack a duplicate entry or leave a stale studyNav flag.
                        history.replaceState(state, '', finalUrl);
                    }
                } catch {}
            }
            return;
        }

        mainData = data.results;
        // Reset per-card UI state on a fresh search (stale indices would point at wrong blocks)
        cardExpandedState = {};
        detectChapterInfo(mainData);
        renderAll();
        if (compareIntent) mainData.forEach((_, idx) => toggleCardCompare(idx));
        // Fresh forward navigation lands at the top; Back/Forward restores via
        // popstate (pushHistory false), so don't clobber its scroll here.
        if (pushHistory) window.scrollTo(0, 0);
        // Write the URL now that we know whether to use canonical path-form
        // (single block) or /?q= fallback (multi-block / cross-chapter).
        const block = mainData && mainData.length === 1 ? mainData[0] : null;
        const finalUrl = buildURL(query, version, 'normal', block);
        const currentUrl = window.location.pathname + window.location.search;
        const state = { q: query, version, mode: 'normal' };
        try {
            if (pushHistory) {
                if (finalUrl !== currentUrl) {
                    // Stamp the leaving entry with its scroll position first.
                    history.replaceState({ ...(_outState || {}), scrollY: _outScrollY }, '', _outUrl);
                    history.pushState(state, '', finalUrl);
                } else {
                    // Same URL (e.g. a reference that resolves to where a study
                    // view was showing): replace in place so the entry's state
                    // matches the bible view — never leave a stale studyNav flag.
                    history.replaceState(state, '', finalUrl);
                }
            } else {
                // Popstate restore: keep the entry's saved scroll/panel state,
                // but drop any studyNav marker so it reads as a bible view.
                const { studyNav: _drop, ...keep } = (history.state || {});
                history.replaceState({ ...keep, ...state }, '', finalUrl);
            }
        } catch {}
    } catch (err) {
        resultsWrapper.innerHTML = errorCardHtml(t('loading.errorGeneric'), t('loading.errorBody'));
    }
}

function detectChapterInfo(results) {
    if (!results || results.length === 0) { currentChapterInfo = null; return; }
    const first = results[0];
    if (!first || !first.book || !first.verses || first.verses.length === 0) { currentChapterInfo = null; return; }
    const ch = first.verses[0].chapter;
    const isVerseView = !first.is_chapter;
    const firstVerse = first.verses[0].num;
    const lastVerse = first.verses[first.verses.length - 1].num;
    currentChapterInfo = { book: first.book, chapter: ch, bookName: bookRefName(first.book), isVerseView, firstVerse, lastVerse };
}

function onToggleChange() {
    const openBooks = new Set(
        [...resultsWrapper.querySelectorAll('.book-group-header.open')]
            .map(h => h.closest('.book-group')?.dataset.book)
            .filter(Boolean)
    );
    if (currentView === 'normal' && mainData) renderAll();
    else if (currentView === 'all_versions' && allVersionsCache) renderAllVersions(allVersionsCache.results, allVersionsCache.label);
    else if (currentView === 'text_search' && textSearchCache) renderTextSearch(textSearchCache.results, textSearchCache.query, textSearchCache.bookTotals || {});
    else if (currentView === 'text_search_all' && allVersionsTextCache) renderAllVersionsTextSearch(allVersionsTextCache.results, allVersionsTextCache.query);
    if (openBooks.size > 0) {
        openBooks.forEach(book => {
            const group = resultsWrapper.querySelector(`.book-group[data-book="${book}"]`);
            if (group) {
                group.querySelector('.book-group-header')?.classList.add('open');
                group.querySelector('.book-group-items')?.classList.add('open');
            }
        });
        updateExpandCollapseBtn();
        fixOpenGroupHeights();
    }
}
toggleVerseNums.addEventListener('change', onToggleChange);
toggleNewlines.addEventListener('change', onToggleChange);
toggleHeadings.addEventListener('change', onToggleChange);
toggleAnnotations.checked = showAnnotations;
toggleAnnotations.addEventListener('change', () => {
    showAnnotations = toggleAnnotations.checked;
    showFootnotes = showAnnotations;
    showXrefs = showAnnotations;
    localStorage.setItem('showAnnotations', showAnnotations);
    onToggleChange();
});
const togglePlaces = document.getElementById('togglePlaces');
if (togglePlaces) {
    togglePlaces.checked = showPlaces;
    togglePlaces.addEventListener('change', () => {
        showPlaces = togglePlaces.checked;
        localStorage.setItem('showPlaces', showPlaces);
        onToggleChange();
    });
}

document.querySelectorAll('.toggle-item').forEach(item => {
    item.addEventListener('click', e => {
        if (e.target.closest('.toggle-switch')) return;
        const cb = item.querySelector('input[type="checkbox"]');
        if (cb) cb.click();
    });
});

// ── Render reference results ──
function renderAll() {
    clearAllMarkedVerses();
    if (!mainData || mainData.length === 0) { resultsWrapper.innerHTML = emptyStateHtml; applyI18n(); return; }
    setPageTitle(mainData.map(b => b.label).join('; '));
    const showNums = toggleVerseNums.checked;
    const showNewlines = toggleNewlines.checked;
    const showHeadings = toggleHeadings.checked;
    const mainLang = versionLang(versionSelect.value);
    let html = `<div class="search-controls">
        <div class="search-result-count"></div>
    </div>`;

    mainData.forEach((block, idx) => {
        html += buildCardHtml(block, idx, showNums, showNewlines, showHeadings, mainLang, versionSelect.value);
    });

    resultsWrapper.innerHTML = html;
    Object.keys(cardCompare).forEach(idx => {
        if (cardCompare[idx] && cardCompare[idx].visible) renderCompareBody(idx);
    });
    if (typeof updateWideMode === 'function') updateWideMode();
    if (typeof updateToolbarCompareBtn === 'function') updateToolbarCompareBtn();
    try { window.AppSidebar && window.AppSidebar.notifyMainBlockChanged(); } catch {}
    try { refreshModuleActiveDom(); } catch {}
}

function buildCardHtml(block, idx, showNums, showNewlines, showHeadings, lang, ver) {
    if (!block) return '';
    if (block.error) {
        const lbl = block.book ? translateLabel(block.label || t('loading.errorGeneric'), block.book, lang) : (block.label || t('loading.errorGeneric'));
        return `<div class="verse-card error-card">
            <div class="verse-card-header"><div class="verse-card-header-left"><span class="verse-card-label">${escHtml(lbl)}</span></div></div>
            <div class="error-message">${escHtml(block.error)}</div>
        </div>`;
    }

    const displayLabel = translateLabel(block.label, block.book, lang);
    const cardId = `card-${idx}`;
    const cs = cardCompare[idx];
    const compareVisible = !!(cs && cs.visible);
    const defaultCompareVer = allVersionsList.find(v => String(v.id) !== ver); // first != current
    const compareVer = cs ? cs.version : (defaultCompareVer ? String(defaultCompareVer.id) : ver);

    // Compute swipe nav metadata for this card
    let swipeAttrs = '';
    if (block.book && block.verses.length > 0) {
        const _ch = block.verses[0].chapter;
        const _bName = bookRefName(block.book);
        const _maxCh = (_booksMap.get(block.book) || {}).chapters || 0;
        const _isVerseView = !block.is_chapter;
        const _allSameCh = block.verses.every(v => v.chapter === _ch);
        if (_allSameCh && _maxCh > 0) {
            let _hasPrev = false, _hasNext = false;
            let _firstV = block.verses[0].num, _lastV = block.verses[block.verses.length - 1].num;
            if (_isVerseView) {
                const _maxV = maxVerseInChapter(block.book, _ch);
                _hasPrev = _firstV > 1 || _ch > 1;
                _hasNext = (_maxV && _lastV < _maxV) || _ch < _maxCh;
            } else {
                _hasPrev = _ch > 1;
                _hasNext = _ch < _maxCh;
            }
            swipeAttrs = ` data-swipe-book="${escAttr(block.book)}" data-swipe-ch="${_ch}" data-swipe-first-v="${_firstV}" data-swipe-last-v="${_lastV}" data-swipe-bname="${escAttr(_bName)}" data-swipe-is-verse="${_isVerseView ? '1' : '0'}" data-swipe-has-prev="${_hasPrev ? '1' : '0'}" data-swipe-has-next="${_hasNext ? '1' : '0'}"`;
        }
    }

    // Build side-nav (PC: prev/next click; mobile: visible swipe affordance)
    let sideNavHtml = '';
    let cardNavData = null; // populated below if applicable
    if (block.book && block.verses.length > 0) {
        const _ch = block.verses[0].chapter;
        const _bName = bookRefName(block.book);
        const _maxCh = (_booksMap.get(block.book) || {}).chapters || 0;
        const _isVerseView = !block.is_chapter;
        const _allSameCh = block.verses.every(v => v.chapter === _ch);
        if (_allSameCh && _maxCh > 0) {
            const _firstV = block.verses[0].num, _lastV = block.verses[block.verses.length - 1].num;
            let _hasPrev, _hasNext, _prevCall, _nextCall;
            if (_isVerseView) {
                const _maxV = maxVerseInChapter(block.book, _ch);
                _hasPrev = _firstV > 1 || _ch > 1;
                _hasNext = (_maxV && _lastV < _maxV) || _ch < _maxCh;
                _prevCall = `goVerse('${escAttr(block.book)}', ${_ch}, ${_firstV}, '${escAttr(_bName)}', 'prev', ${idx})`;
                _nextCall = `goVerse('${escAttr(block.book)}', ${_ch}, ${_lastV}, '${escAttr(_bName)}', 'next', ${idx})`;
            } else {
                _hasPrev = _ch > 1;
                _hasNext = _ch < _maxCh;
                _prevCall = `goChapter('${escAttr(block.book)}', ${_ch - 1}, '${escAttr(_bName)}', 'prev', ${idx})`;
                _nextCall = `goChapter('${escAttr(block.book)}', ${_ch + 1}, '${escAttr(_bName)}', 'next', ${idx})`;
            }
            cardNavData = { hasPrev: _hasPrev, hasNext: _hasNext };
            sideNavHtml = `<button class="side-nav side-nav-prev" data-disabled="${_hasPrev ? '0' : '1'}" ${_hasPrev ? `onclick="${_prevCall}"` : ''} title="${escAttr(t('chapterNav.prevCh'))}" aria-label="prev"><span class="side-nav-arrow">&#8249;</span></button>
                <button class="side-nav side-nav-next" data-disabled="${_hasNext ? '0' : '1'}" ${_hasNext ? `onclick="${_nextCall}"` : ''} title="${escAttr(t('chapterNav.nextCh'))}" aria-label="next"><span class="side-nav-arrow">&#8250;</span></button>`;
        }
    }

    const isAllMode = !!(cs && cs.mode === 'all');
    const compareActive = compareVisible && !isAllMode;
    const alignMode = !!(cs && cs.alignMode && compareActive);
    const mainShowNewlines = alignMode || showNewlines;

    let compareOptionsHtml = '';
    allVersionsList.forEach(v => {
        const vid = String(v.id);
        compareOptionsHtml += `<option value="${escAttr(vid)}"${vid === compareVer && !isAllMode ? ' selected' : ''}>${escHtml(v.name)}</option>`;
    });
    compareOptionsHtml += `<option value="__all__"${isAllMode ? ' selected' : ''}>${escHtml(t('card.allVersionsOption'))}</option>`;

    const trayOpen = block.book && block.verses.length > 0 ? studyTrayOpen : false;

    // credit copy-icon: https://www.flaticon.com/authors/erix
    // credit study-icon: https://www.flaticon.com/authors/bqlqn 
    // credit share-icon by I Wayan Wika: https://www.flaticon.com/free-icons/share
    // credit pin-icon by meaicon: https://www.flaticon.com/free-icons/pin

    let html = `<div class="card-swipe-wrap">${sideNavHtml}<div class="verse-card${compareActive ? ' compare-active' : ''}" id="${cardId}"${swipeAttrs}>
        <div class="verse-card-header">
            <div class="verse-card-header-main">
                <div class="verse-card-header-left">
                    <span class="verse-card-label">${escHtml(displayLabel)}</span>
                </div>
                <div class="verse-card-header-actions">
                    ${block.book && block.verses.length > 0 ? `<button class="copy-btn block-pin-btn" data-card-idx="${idx}" onclick="pinBlock(${idx})" title="Fest blokk" aria-label="Fest blokk"><img src="/static/images/pin.png" class="copy-icon" alt=""></button>` : ''}
                    <button class="copy-btn" onclick="copyBlock(${idx})" title="${escAttr(t('card.copy.title'))}"><img src="/static/images/copy.png" class="copy-icon" alt="kopier"></button>
                    ${block.book && block.verses.length > 0 ? `<button class="copy-btn" onclick="shareBlock(${idx})" title="Del lenke" aria-label="Del lenke"><img src="/static/images/share.png" class="copy-icon" alt=""></button>` : ''}
                    ${block.book && block.verses.length > 0 ? `<button class="copy-btn study-toggle${trayOpen ? ' open' : ''}" onclick="toggleStudyTray(${idx})" aria-expanded="${trayOpen ? 'true' : 'false'}" title="${escAttr(t('card.study.title'))}"><img src="/static/images/study.png" class="copy-icon study-icon" alt="studie"></button>` : ''}
                </div>
            </div>
            <div class="header-compare-slot">
                <select class="card-compare-select" id="compare-select-header-${idx}" onchange="changeCardCompareVersion(${idx}, 'header')">${compareOptionsHtml}</select>
                <label class="toggle-group align-mode-toggle" title="${escAttr(t('card.alignVerses.title'))}">
                    <span>${escHtml(t('card.alignVerses'))}</span>
                    <span class="toggle-switch"><input type="checkbox" id="align-toggle-${idx}"${alignMode ? ' checked' : ''} onchange="toggleAlignMode(${idx})"><span class="toggle-slider"></span></span>
                </label>
            </div>
        </div>`;

    // Study tray sits between header and body so it appears directly under the
    // study toggle in the header. Built up-front so it can be injected above
    // .verse-card-body while compare-active body still works as a flex row.
    // credit for module icons:
    // "https://www.flaticon.com/free-icons/pen-tool" "pen tool icons" Pen tool icons created by Those Icons - Flaticon
    // "https://www.flaticon.com/free-icons/pin" "pin icons" Pin icons created by Freepik - Flaticon
    // "https://www.flaticon.com/free-icons/theme" "theme icons" Theme icons created by alkhalifi design - Flaticon
    // "https://www.flaticon.com/free-icons/book" "book icons" Book icons created by Freepik - Flaticon
    // "https://www.flaticon.com/free-icons/list" "list icons" List icons created by Chanut - Flaticon

    let studyTrayHtml = '';
    if (block.book && block.verses.length > 0) {
        const placeCount = (block.places || []).length;
        const mapDisabled = placeCount === 0;
        const mapTitle = mapDisabled ? escAttr(t('card.study.map.empty')) : escAttr(t('card.mapBtn.title', placeCount));
        const mapLabel = 'Kart';
        studyTrayHtml = `<div class="study-tray" data-open="${trayOpen ? 'true' : 'false'}" id="study-tray-${idx}">
            <div class="study-tray-row">
                <div class="study-tray-inner">
                    <button class="tray-btn" data-module="map"${mapDisabled ? ' disabled aria-disabled="true"' : ` onclick="openMapForBlock(${idx},null)"`} title="${mapTitle}"><img class="tray-btn-emoji tray-btn-emoji-img" src="/static/images/map.png" alt=""><span class="tray-btn-label">${mapLabel}</span></button>
                    <button class="tray-btn" data-module="commentary" onclick="openCommentaryForBlock(${idx})" title="${escAttr(t('sidebar.commentary.title'))}"><img class="tray-btn-emoji tray-btn-emoji-img" src="/static/images/pen.png" alt=""><span class="tray-btn-label"><span class="tray-label-long">Kommentar</span><span class="tray-label-short">Komment.</span></span></button>
                    <button class="tray-btn" data-module="leksikon" onclick="openLeksikonForBlock(${idx})" title="${escAttr(t('sidebar.leksikon.title'))}"><img class="tray-btn-emoji tray-btn-emoji-img" src="/static/images/lexicon.png" alt=""><span class="tray-btn-label">Leksikon</span></button>
                    <button class="tray-btn" data-module="topics"${block.has_topics ? ` onclick="openTopicsForBlock(${idx})"` : ' disabled aria-disabled="true"'} title="${escAttr(block.has_topics ? t('sidebar.topics.title') : t('card.study.topics.empty'))}"><img class="tray-btn-emoji tray-btn-emoji-img" src="/static/images/themes.png" alt=""><span class="tray-btn-label">Tema</span></button>
                    <button class="tray-btn" data-module="outline" onclick="openOutlineForBlock(${idx})" title="${escAttr(t('sidebar.outline.title'))}"><img class="tray-btn-emoji tray-btn-emoji-img" src="/static/images/outline.png" alt=""><span class="tray-btn-label">Outline</span></button>
                    <button class="tray-btn" data-module="external" onclick="openExternalForBlock(${idx}, this)" title="Eksterne lenker"><img class="tray-btn-emoji tray-btn-emoji-img" src="/static/images/external.png" alt=""><span class="tray-btn-label">Ekstern</span></button>
                </div>
            </div>
        </div>`;
    }

    html += studyTrayHtml;
    html += `<div class="verse-card-body">
        <div class="verse-text" id="main-verse-text-${idx}">`;

    blockPlacesRegistry[idx] = block.places || [];
    html += renderVerseTextHtml(block.verses, showNums, mainShowNewlines, showHeadings, block.book, lang, ver, block.headings || [], block.footnotes || [], block.places || [], idx, alignMode);
    html += '</div>';

    if (block.book && block.verses.length > 0) {
        // Compare section sits inside the body next to the main verse text.
        // Its own header (the select) is hidden via CSS when card is compare-active on PC,
        // because the select is hoisted into .header-compare-slot for verse-baseline alignment.
        html += `<div class="card-compare-section${compareVisible ? ' visible' : ''}" id="compare-section-${idx}">
            <div class="card-compare-header">
                <select class="card-compare-select" id="compare-select-${idx}" onchange="changeCardCompareVersion(${idx}, 'section')">${compareOptionsHtml}</select>
            </div>
            <div class="card-compare-body" id="compare-body-${idx}"></div></div>`;
    }
    html += `</div>`; // close .verse-card-body

    html += '</div></div>'; // close .verse-card and .card-swipe-wrap

    // V-arrow chapter expand/collapse — OUTSIDE the card box, below it.
    // Visible when in verse view, or when chapter view that originated from a verse-expand.
    if (block.book && block.verses.length > 0) {
        const expandState = cardExpandedState[idx];
        const showExpand = !block.is_chapter || (expandState && expandState.originalBlock);
        if (showExpand) {
            const isExpanded = !!(expandState && expandState.originalBlock);
            html += `<button class="chapter-expand-bar" data-card-idx="${idx}" data-expanded="${isExpanded ? 'true' : 'false'}" onclick="toggleChapterExpand(${idx})" title="${escAttr(t(isExpanded ? 'card.collapseChapter' : 'card.expandChapter'))}" aria-label="${escAttr(t(isExpanded ? 'card.collapseChapter' : 'card.expandChapter'))}">
                <span class="chapter-expand-arrow" aria-hidden="true">&#8249;</span>
            </button>`;
        }
    }
    return html;
}

// ── Card compare ──
function renderCompareBody(idx) {
    const cs = cardCompare[idx];
    const body = document.getElementById(`compare-body-${idx}`);
    if (!body || !cs) return;
    const showNums = toggleVerseNums.checked;
    const showHeadings = toggleHeadings.checked;
    const alignMode = !!(cs.alignMode && cs.visible && cs.mode === 'single');
    const showNewlines = alignMode || toggleNewlines.checked;

    if (cs.mode === 'all') {
        if (!cs.allData) { body.innerHTML = `<span class="compare-loading">${escHtml(t('card.compareLoading'))}</span>`; return; }
        let html = '';
        let first = true;
        const orderedAll = allVersionsList
            .map(v => [String(v.id), cs.allData[String(v.id)]])
            .filter(([, b]) => b !== undefined);
        const knownAllIds = new Set(orderedAll.map(([id]) => id));
        const extraAll = Object.entries(cs.allData).filter(([id]) => !knownAllIds.has(id));
        for (const [vName, blocks] of [...orderedAll, ...extraAll]) {
            const verses = blocks.flatMap(b => b.verses || []);
            if (verses.length === 0) continue;
            const headings = blocks.flatMap(b => b.headings || []);
            const blockFootnotes = blocks.flatMap(b => b.footnotes || []);
            const vLang = versionLang(vName);
            const bCode = blocks[0]?.book;
            if (!first) html += '<hr class="version-separator">';
            first = false;
            html += `<div><div class="version-label">${escHtml(versionLabel(vName))}</div>
                <div class="verse-text">${renderVerseTextHtml(verses, showNums, toggleNewlines.checked, showHeadings, bCode, vLang, vName, headings, blockFootnotes)}</div></div>`;
        }
        body.innerHTML = html;
        return;
    }

    if (!cs.data) { body.innerHTML = `<span class="compare-loading">${escHtml(t('card.compareLoading'))}</span>`; return; }
    if (cs.data.error) {
        console.error('Compare error:', cs.data.error);
        body.innerHTML = `<span style="color:var(--error);font-size:0.85rem;">${escHtml(t('card.compareFailed'))}</span>`;
        return;
    }
    const compLang = versionLang(cs.version);
    // Detect cross-vsf mapping: if main and compare bear different reference
    // labels (e.g. main "Joel 3" → compare "Joel 2:28-3:21"), gray out the
    // compare verse numbers + show a small hint so the user isn't misled by
    // mismatched numbering.
    const mainBlock = mainData[idx];
    const isMapped = !!(mainBlock && cs.data.label && mainBlock.label !== cs.data.label);
    const mappedClass = isMapped ? ' compare-mapped' : '';
    const compLabelTranslated = translateLabel(cs.data.label, cs.data.book || mainBlock?.book, compLang);
    const mappedHint = isMapped
        ? `<span class="compare-mapped-hint" data-tip="${escAttr(t('compare.mappedTooltip') || 'Different versification — verses aligned by position')}">↔ ${escHtml(compLabelTranslated)}</span>`
        : '';
    // Float the hint inside .verse-text so it appears in the top-right corner
    // of the compare text without taking its own row (which would offset rows
    // vs the main pane). Verse text flows around it.
    body.innerHTML = `<div class="verse-text${mappedClass}">${mappedHint}${renderVerseTextHtml(cs.data.verses, showNums, showNewlines, showHeadings, cs.data.book, compLang, cs.version, cs.data.headings || [], cs.data.footnotes || [], [], null, alignMode)}</div>`;
    if (alignMode) equalizeVerseHeights(idx);
}

// Per-card .compare-active class drives the side-by-side widening + header split.
// Only single-mode-visible cards get it; all-mode and inactive stay narrow.
function updateWideMode() {
    if (!resultsWrapper) return;
    resultsWrapper.classList.remove('wide'); // legacy
    Object.entries(cardCompare).forEach(([idx, cs]) => {
        const card = document.getElementById(`card-${idx}`);
        if (!card) return;
        const active = !!(cs && cs.visible && cs.mode !== 'all');
        card.classList.toggle('compare-active', active);
    });
}

function _reRenderMainVerseText(idx) {
    const block = mainData && mainData[idx];
    const mainVerseText = document.getElementById(`main-verse-text-${idx}`);
    if (!mainVerseText || !block) return;
    const cs = cardCompare[idx];
    const alignMode = !!(cs && cs.alignMode && cs.visible && cs.mode === 'single');
    const showNums = toggleVerseNums.checked;
    const showHeadings = toggleHeadings.checked;
    const showNewlines = alignMode || toggleNewlines.checked;
    const ver = versionSelect.value;
    const lang = versionLang(ver);
    mainVerseText.innerHTML = renderVerseTextHtml(block.verses, showNums, showNewlines, showHeadings, block.book, lang, ver, block.headings || [], block.footnotes || [], block.places || [], idx, alignMode);
}

function equalizeVerseHeights(idx) {
    if (window.innerWidth < 701 || document.body.classList.contains('tablet-portrait')) return;
    const cs = cardCompare[idx];
    if (!cs || !cs.alignMode || !cs.visible || cs.mode !== 'single') return;
    const card = document.getElementById(`card-${idx}`);
    if (!card) return;

    // Reset all before measuring
    card.querySelectorAll('.verse-align-row, .verse-align-pre').forEach(el => { el.style.minHeight = ''; });

    const mainVerseText = document.getElementById(`main-verse-text-${idx}`);
    const compareBody = document.getElementById(`compare-body-${idx}`);

    const collectRows = (container) => {
        const rows = {}, pres = {};
        if (!container) return { rows, pres };
        container.querySelectorAll('.verse-align-row').forEach(el => {
            rows[el.dataset.key] = el;
            const pre = el.querySelector('.verse-align-pre');
            if (pre) pres[el.dataset.key] = pre;
        });
        return { rows, pres };
    };

    const { rows: mainRows, pres: mainPres } = collectRows(mainVerseText);
    const { rows: compareRows, pres: comparePres } = collectRows(compareBody);

    const allKeys = new Set([...Object.keys(mainRows), ...Object.keys(compareRows)]);

    // Pass 1: equalize pre-areas (headings) so verse text starts at the same position
    allKeys.forEach(key => {
        const mp = mainPres[key];
        const cp = comparePres[key];
        if (mp && cp) {
            const maxH = Math.max(mp.offsetHeight, cp.offsetHeight);
            if (maxH > 0) {
                mp.style.minHeight = maxH + 'px';
                cp.style.minHeight = maxH + 'px';
            }
        }
    });

    // Pass 2: equalize whole rows (handles verse text length differences)
    allKeys.forEach(key => {
        const m = mainRows[key];
        const c = compareRows[key];
        if (m && c) {
            const maxH = Math.max(m.offsetHeight, c.offsetHeight);
            m.style.minHeight = maxH + 'px';
            c.style.minHeight = maxH + 'px';
        }
    });
}

window.toggleAlignMode = function(idx) {
    const cs = cardCompare[idx];
    if (!cs || cs.mode !== 'single' || !cs.visible) return;
    cs.alignMode = !cs.alignMode;

    const cb = document.getElementById(`align-toggle-${idx}`);
    if (cb && cb.checked !== cs.alignMode) cb.checked = cs.alignMode;

    _reRenderMainVerseText(idx);
    renderCompareBody(idx);
};

// Keep both selects (header slot + section header) in sync with the active mode/version.
function syncCardCompareSelects(idx) {
    const cs = cardCompare[idx];
    if (!cs) return;
    const val = cs.mode === 'all' ? '__all__' : cs.version;
    const a = document.getElementById(`compare-select-${idx}`);
    const b = document.getElementById(`compare-select-header-${idx}`);
    if (a && a.value !== val) a.value = val;
    if (b && b.value !== val) b.value = val;
}

function _compareActivateInstant(idx, section) {
    const card = document.getElementById(`card-${idx}`);
    const wrap = card && card.closest('.card-swipe-wrap');
    if (wrap) wrap.style.transition = 'none';
    updateWideMode();
    if (section) {
        void section.offsetHeight;
        section.classList.add('visible');
        renderCompareBody(idx);
    }
    requestAnimationFrame(() => { if (wrap) wrap.style.transition = ''; });
}

window.toggleCardCompare = async function(idx) {
    const section = document.getElementById(`compare-section-${idx}`);
    if (!cardCompare[idx]) {
        const savedVer = localStorage.getItem('lastCompareVersion');
        const savedVerValid = savedVer && allVersionsList.some(v => String(v.id) === savedVer) && savedVer !== versionSelect.value;
        const defaultVer = savedVerValid ? savedVer : (String((allVersionsList.find(v => String(v.id) !== versionSelect.value) || allVersionsList[0]).id));
        cardCompare[idx] = { version: defaultVer, data: null, visible: true, mode: 'single', allData: null, alignMode: false };
        // Suppress the card-swipe-wrap max-width transition so the card jumps instantly
        // to its final width. Without this, the text column temporarily narrows to 50%
        // of the growing card width during the 0.32s animation, causing more line wraps
        // and an ugly height spike. Only the compare section's opacity fade is needed.
        _compareActivateInstant(idx, section);
        syncCardCompareSelects(idx);
        await loadCardCompareData(idx);
        renderCompareBody(idx);
    } else {
        const wasAligned = cardCompare[idx].alignMode;
        cardCompare[idx].alignMode = false;
        const nowVisible = !cardCompare[idx].visible;
        cardCompare[idx].visible = nowVisible;
        if (wasAligned) {
            _reRenderMainVerseText(idx);
            const cb = document.getElementById(`align-toggle-${idx}`);
            if (cb) cb.checked = false;
        }
        if (nowVisible) {
            _compareActivateInstant(idx, section);
        } else {
            // Mirror open: suppress the wrap max-width transition so the card
            // jumps instantly to narrow width, and only the section's opacity fades.
            const card = document.getElementById(`card-${idx}`);
            const wrap = card && card.closest('.card-swipe-wrap');
            const isPcCompareActive = !!(card && card.classList.contains('compare-active') && window.innerWidth >= 701 && !document.body.classList.contains('tablet-portrait'));
            if (isPcCompareActive && wrap) wrap.style.transition = 'none';
            if (section) section.classList.remove('visible');
            updateWideMode();
            if (isPcCompareActive && wrap) {
                requestAnimationFrame(() => { wrap.style.transition = ''; });
            }
        }
    }
};

window.changeCardCompareVersion = async function(idx, source) {
    const sel = document.getElementById(source === 'header' ? `compare-select-header-${idx}` : `compare-select-${idx}`);
    if (!sel || !cardCompare[idx]) return;
    if (sel.value === '__all__') {
        if (cardCompare[idx].alignMode) {
            cardCompare[idx].alignMode = false;
            _reRenderMainVerseText(idx);
        }
        cardCompare[idx].mode = 'all';
        cardCompare[idx].allData = null;
        syncCardCompareSelects(idx);
        updateWideMode(); // remove .compare-active → card narrows, section animates to stacked
        renderCompareBody(idx);
        await loadCardCompareAllData(idx);
        renderCompareBody(idx);
    } else {
        cardCompare[idx].mode = 'single';
        cardCompare[idx].version = sel.value;
        cardCompare[idx].data = null;
        localStorage.setItem('lastCompareVersion', sel.value);
        syncCardCompareSelects(idx);
        const _csec = document.getElementById(`compare-section-${idx}`);
        _compareActivateInstant(idx, _csec); // instant width jump, no height glitch
        await loadCardCompareData(idx);
        renderCompareBody(idx);
    }
};

async function loadCardCompareData(idx) {
    if (!mainData || !mainData[idx] || !cardCompare[idx]) return;
    const block = mainData[idx];
    const version = cardCompare[idx].version;
    // Pass src_version so backend can map the reference across versification
    // traditions (e.g. NB88 Joel 3:1 → NIV Joel 2:28).
    const srcVersion = (window.versionSelect && String(window.versionSelect.value)) || '';
    try {
        const srcParam = srcVersion ? `&src_version=${encodeURIComponent(srcVersion)}` : '';
        const resp = await fetch(`/api/search?q=${encodeURIComponent(block.label)}&version=${encodeURIComponent(version)}${srcParam}`);
        const data = await resp.json();
        if (data.type === 'reference' && !data.error && data.results && data.results[0]) {
            cardCompare[idx].data = data.results[0];
        } else {
            cardCompare[idx].data = { error: data.error || t('card.compareNotFound'), verses: [] };
        }
    } catch {
        cardCompare[idx].data = { error: t('card.compareFailed'), verses: [] };
    }
}

async function loadCardCompareAllData(idx) {
    if (!mainData || !mainData[idx] || !cardCompare[idx]) return;
    const block = mainData[idx];
    const srcVersion = (window.versionSelect && String(window.versionSelect.value)) || '';
    try {
        const srcParam = srcVersion ? `&src_version=${encodeURIComponent(srcVersion)}` : '';
        const resp = await fetch(`/api/all_versions?q=${encodeURIComponent(block.label)}${srcParam}`);
        const data = await resp.json();
        cardCompare[idx].allData = data.results || {};
    } catch {
        cardCompare[idx].allData = {};
    }
}

window.toggleCardMore = function(idx) {
    const menu = document.getElementById(`card-more-${idx}`);
    if (!menu) return;
    const wasOpen = menu.classList.contains('open');
    document.querySelectorAll('.card-more-menu.open').forEach(m => m.classList.remove('open'));
    if (!wasOpen) {
        const wrap = menu.closest('.card-more-wrap') || menu.parentElement;
        const rect = wrap.getBoundingClientRect();
        menu.classList.toggle('menu-up', window.innerHeight - rect.bottom < 200);
        menu.classList.add('open');
    }
};
document.addEventListener('click', e => {
    if (!e.target.closest('.card-more-wrap')) {
        document.querySelectorAll('.card-more-menu.open').forEach(m => m.classList.remove('open'));
    }
    const chip = e.target.closest('.compare-mapped-hint');
    document.querySelectorAll('.compare-mapped-hint.show-tip').forEach(el => {
        if (el !== chip) el.classList.remove('show-tip');
    });
    if (chip) {
        chip.classList.toggle('show-tip');
        if (chip.classList.contains('show-tip')) {
            clearTimeout(chip._tipTimer);
            chip._tipTimer = setTimeout(() => chip.classList.remove('show-tip'), 3000);
        }
    }
});




function renderVerseTextHtml(verses, showNums, showNewlines, showHeadings, bookCode, lang, ver, headings = [], footnotes = [], places = [], cardIdx = null, alignMode = false) {
    const headingMap = {};
    headings.forEach(h => {
        if (!headingMap[h.chapter]) headingMap[h.chapter] = {};
        headingMap[h.chapter][h.verse] = h.text;
    });

    const footnoteMap = {};
    (footnotes || []).forEach(fn => {
        if (!footnoteMap[fn.chapter]) footnoteMap[fn.chapter] = {};
        footnoteMap[fn.chapter][fn.verse] = fn.text;
    });

    // (chapter:verse) -> [{id, name}, ...]
    const placeMap = {};
    (places || []).forEach(p => {
        (p.refs || []).forEach(r => {
            const key = `${r.chapter}:${r.verse}`;
            if (!placeMap[key]) placeMap[key] = [];
            placeMap[key].push(p);
        });
    });

    let html = '';
    let lastChapter = null;
    const isMultiChapter = verses.some(x => x.chapter !== verses[0]?.chapter);

    verses.forEach((v, vi) => {
        // Positional index as align key — works across versifications where
        // chapter:verse coords differ between main and compare (mapped compare).
        if (alignMode) html += `<div class="verse-align-row" data-key="i${vi}"><div class="verse-align-pre">`;

        if (isMultiChapter && v.chapter !== lastChapter) {
            if (vi > 0 && !alignMode && showNewlines) html += '<br>';
            html += `<div class="chapter-heading">${escHtml(t('verse.chapterHeading', v.chapter))}</div>`;
            lastChapter = v.chapter;
        } else if (lastChapter === null) {
            lastChapter = v.chapter;
        }

        const headingText = showHeadings ? (headingMap[v.chapter]?.[v.num] ?? null) : null;
        if (headingText) {
            html += `<div class="verse-heading">${escHtml(headingText)}</div>`;
        } else if (!alignMode && showNewlines && vi > 0 && v.chapter === lastChapter) {
            html += '<br>';
        }

        if (alignMode) html += `</div>`; // close .verse-align-pre

        const bookCodeSafe = bookCode ? escAttr(bookCode) : '';
        const refName = bookCode ? escAttr(bookRefName(bookCode)) : '';

        html += `<span class="verse-line">`;
        if (showNums) {
            html += `<span class="verse-num" onclick="openSingleVerse('${bookCodeSafe}',${v.chapter},${v.num},'${refName}','${escAttr(ver || '')}')" title="${escAttr(fmtVerseRef(bookCode, bookRefName(bookCode), v.chapter, v.num))}">${v.num}</span>`;
        }
        const fnText = footnoteMap[v.chapter]?.[v.num];
        if (bookCodeSafe) {
            const hasFn = !!fnText;
            const hasXr = (v.has_xrefs === undefined) ? true : !!v.has_xrefs;
            const isMarked = markedVerses.has(`${bookCode}.${v.chapter}.${v.num}.${ver || ''}`);
            html += `<span class="verse-text-clickable${isMarked ? ' verse-marked' : ''}" data-book="${bookCodeSafe}" data-chapter="${v.chapter}" data-verse="${v.num}" data-ref="${refName}" data-has-fn="${hasFn ? '1' : '0'}" data-has-xr="${hasXr ? '1' : '0'}" data-version="${escAttr(ver || '')}">${escHtml(v.text)}</span>`;
        } else {
            html += escHtml(v.text);
        }

        if (showFootnotes && fnText) {
            html += `<button class="verse-btn fn-btn" onclick="toggleFootnotePanel(this)" title="${escAttr(t('annot.fnTitle'))}">†</button>`;
        }
        // has_xrefs is set by backend (resolve_block) — only render the § symbol
        // when this verse actually has cross-references. Defaults to true if the
        // field is missing (e.g. lazily-loaded blocks like compare/all_versions
        // that don't go through resolve_block) so we don't silently hide all xrefs.
        const hasXrefs = (v.has_xrefs === undefined) ? true : !!v.has_xrefs;
        if (showXrefs && bookCodeSafe && hasXrefs) {
            html += `<button class="verse-btn xr-btn" data-book="${bookCodeSafe}" data-chapter="${v.chapter}" data-verse="${v.num}" onclick="toggleXrefPanel(this)" title="${escAttr(t('annot.xrTitle'))}">§</button>`;
        }

        if (showPlaces && cardIdx !== null) {
            const verseKey = `${v.chapter}:${v.num}`;
            const versePlaces = placeMap[verseKey];
            if (versePlaces && versePlaces.length) {
                versePlaces.forEach(p => {
                    html += `<button class="place-chip" onclick="openMapForBlock(${cardIdx},${p.id})" title="${escAttr(p.placemark || p.name)}"><span class="place-chip-icon">\u{1F4CD}</span>${escHtml(p.name)}</button>`;
                });
            }
        }

        html += `</span> `;

        // Panels are block siblings of verse-line (display:none = no layout impact when closed)
        if (showFootnotes && fnText) {
            html += `<div class="verse-panel fn-panel" style="display:none;max-height:0;opacity:0"><button class="verse-panel-close" onclick="closePanelFromBtn(this,'fn-panel')" title="Lukk">✕</button><div class="fn-panel-inner">${escHtml(fnText)}</div></div>`;
        }
        if (showXrefs && bookCodeSafe && hasXrefs) {
            html += `<div class="verse-panel xr-panel" style="display:none;max-height:0;opacity:0"><button class="verse-panel-close" onclick="closePanelFromBtn(this,'xr-panel')" title="Lukk">✕</button><div class="xr-panel-inner"></div></div>`;
        }

        if (alignMode) html += `</div>`; // close .verse-align-row

        lastChapter = v.chapter;
    });
    return html;
}

// ── Verse panel (footnote / xref) helpers ────────────────────────────────────

function openVersePanel(panel) {
    panel.style.display = 'block';
    panel.style.maxHeight = '0';
    panel.style.opacity = '0';
    panel.offsetHeight; // force reflow so transition fires
    panel.style.maxHeight = panel.scrollHeight + 'px';
    panel.style.opacity = '1';
}

function closeVersePanel(panel) {
    panel.style.maxHeight = '0';
    panel.style.opacity = '0';
    panel.addEventListener('transitionend', function handler() {
        panel.removeEventListener('transitionend', handler);
        if (panel.style.maxHeight === '0px') panel.style.display = 'none';
    }, { once: true });
}

window.closePanelFromBtn = function(btn, panelClass) {
    const panel = btn.closest('.' + panelClass);
    if (!panel) return;
    closeVersePanel(panel);
    // Deactivate the toggle button by walking backwards among siblings
    let el = panel.previousElementSibling;
    while (el) {
        if (el.classList.contains('verse-line')) {
            const toggleBtn = panelClass === 'fn-panel'
                ? el.querySelector('.fn-btn')
                : el.querySelector('.xr-btn');
            if (toggleBtn) { toggleBtn.classList.remove('active'); break; }
        }
        el = el.previousElementSibling;
    }
};

function findSiblingPanel(verseLine, cls) {
    // Walk forward among parent's children starting after verseLine
    const parent = verseLine.parentElement;
    if (!parent) return null;
    const children = parent.children;
    let found = false;
    for (let i = 0; i < children.length; i++) {
        if (children[i] === verseLine) { found = true; continue; }
        if (!found) continue;
        if (children[i].classList.contains('verse-line')) break; // stop at next verse
        if (children[i].classList.contains(cls)) return children[i];
    }
    return null;
}

window.toggleFootnotePanel = function(btn) {
    const verseLine = btn.closest('.verse-line');
    if (!verseLine) return;
    const panel = findSiblingPanel(verseLine, 'fn-panel');
    if (!panel) return;
    if (panel.style.display === 'none' || !panel.style.display) {
        openVersePanel(panel);
        btn.classList.add('active');
    } else {
        closeVersePanel(panel);
        btn.classList.remove('active');
    }
};

function setOpenXrefState(openXref) {
    const cur = history.state || {};
    const next = {...cur};
    if (openXref) next.openXref = openXref;
    else delete next.openXref;
    try { history.replaceState(next, '', window.location.href); } catch {}
}

window.toggleXrefPanel = async function(btn) {
    const verseLine = btn.closest('.verse-line');
    if (!verseLine) return;
    const panel = findSiblingPanel(verseLine, 'xr-panel');
    if (!panel) return;

    if (panel.style.display !== 'none' && panel.style.display !== '') {
        closeVersePanel(panel);
        btn.classList.remove('active');
        setOpenXrefState(null);
        return;
    }

    btn.classList.add('active');
    const book = btn.dataset.book;
    const chapter = btn.dataset.chapter;
    const verse = btn.dataset.verse;
    // Prefer the version of the verse-line the button lives in (so xrefs from
    // the compare body fetch against the compare version, not the main one).
    const localClickable = verseLine.querySelector('.verse-text-clickable');
    const version = (localClickable && localClickable.dataset.version) || versionSelect.value;
    setOpenXrefState({ book, chapter, verse });
    const cacheKey = `${book}.${chapter}.${verse}.${version}`;

    if (!xrefCache.has(cacheKey)) {
        panel.querySelector('.xr-panel-inner').innerHTML = `<span class="xr-loading">${escHtml(t('annot.loadingRefs'))}</span>`;
        openVersePanel(panel);
        try {
            const resp = await fetch(`/api/crossrefs?book=${encodeURIComponent(book)}&chapter=${chapter}&verse=${verse}&version=${encodeURIComponent(version)}&limit=5`);
            const data = await resp.json();
            xrefCache.set(cacheKey, data);
            renderXrefContent(panel, data, book, chapter, verse, version, false);
        } catch {
            panel.querySelector('.xr-panel-inner').innerHTML = `<span class="xr-loading">${escHtml(t('annot.loadError'))}</span>`;
        }
        panel.style.maxHeight = panel.scrollHeight + 'px';
    } else {
        renderXrefContent(panel, xrefCache.get(cacheKey), book, chapter, verse, version, false);
        openVersePanel(panel);
    }
};

function renderXrefContent(panel, data, book, chapter, verse, version, showAll) {
    const inner = panel.querySelector('.xr-panel-inner');
    if (!data || !data.refs || data.refs.length === 0) {
        inner.innerHTML = `<span class="xr-loading">${escHtml(t('annot.noRefs'))}</span>`;
        return;
    }
    let html = '';
    data.refs.forEach(ref => {
        const navQ = escAttr(ref.label);
        html += `<div class="xr-item" onclick="searchFromXref('${navQ}')">` +
            `<span class="xr-ref">${escHtml(ref.label)}</span>` +
            (ref.preview ? `<span class="xr-preview">${escHtml(ref.preview)}</span>` : '') +
            `</div>`;
    });
    if (!showAll && data.total > data.refs.length) {
        html += `<div class="xr-footer">` +
            `<button class="xr-show-all" onclick="loadAllXrefs(this,'${escAttr(book)}',${chapter},${verse},'${escAttr(version)}')">${escHtml(t('annot.showAll', data.total))}</button>` +
            `<button class="xr-open-all" onclick="openAllXrefs(this,'${escAttr(book)}',${chapter},${verse},'${escAttr(version)}')">${escHtml(t('annot.openAll'))}</button>` +
            `</div>`;
    } else if (showAll) {
        html += `<div class="xr-footer">` +
            `<button class="xr-open-all" onclick="openAllXrefs(this,'${escAttr(book)}',${chapter},${verse},'${escAttr(version)}')">${escHtml(t('annot.openAll'))}</button>` +
            `</div>`;
    }
    inner.innerHTML = html;
}

window.loadAllXrefs = async function(btn, book, chapter, verse, version) {
    const panel = btn.closest('.xr-panel');
    const cacheKeyAll = `${book}.${chapter}.${verse}.${version}.all`;
    let data;
    if (xrefCache.has(cacheKeyAll)) {
        data = xrefCache.get(cacheKeyAll);
    } else {
        btn.textContent = t('annot.loading');
        btn.disabled = true;
        try {
            const resp = await fetch(`/api/crossrefs?book=${encodeURIComponent(book)}&chapter=${chapter}&verse=${verse}&version=${encodeURIComponent(version)}&limit=0`);
            data = await resp.json();
            xrefCache.set(cacheKeyAll, data);
        } catch {
            btn.textContent = t('annot.error');
            return;
        }
    }
    renderXrefContent(panel, data, book, chapter, verse, version, true);
    panel.style.maxHeight = panel.scrollHeight + 'px';
};

window.openAllXrefs = async function(btn, book, chapter, verse, version) {
    const cacheKeyAll = `${book}.${chapter}.${verse}.${version}.all`;
    let data;
    if (xrefCache.has(cacheKeyAll)) {
        data = xrefCache.get(cacheKeyAll);
    } else {
        const origText = btn.textContent;
        btn.textContent = t('annot.loading');
        btn.disabled = true;
        try {
            const resp = await fetch(`/api/crossrefs?book=${encodeURIComponent(book)}&chapter=${chapter}&verse=${verse}&version=${encodeURIComponent(version)}&limit=0`);
            data = await resp.json();
            xrefCache.set(cacheKeyAll, data);
        } catch {
            btn.textContent = origText;
            btn.disabled = false;
            return;
        }
    }
    if (!data || !data.refs || data.refs.length === 0) return;
    const query = data.refs.map(r => r.label).join(';');
    const params = new URLSearchParams();
    params.set('q', query);
    params.set('v', version);
    window.location.assign('?' + params.toString());
};

window.searchFromXref = function(label) {
    searchInput.value = label;
    updateSearchHighlight();
    return doSearch();
};

function clearChapterTransition() {
    resultsWrapper.style.transition = '';
    resultsWrapper.style.opacity = '';
    resultsWrapper.style.transform = '';
}

let _clearTransitionTimer = null;

async function slideTransition(direction, work) {
    if (!direction) { await work(); return; }
    if (_clearTransitionTimer) { clearTimeout(_clearTransitionTimer); _clearTransitionTimer = null; }
    try {
        const dx = direction === 'next' ? -28 : 28;
        resultsWrapper.style.transition = 'opacity 0.14s ease, transform 0.14s ease';
        resultsWrapper.style.opacity = '0';
        resultsWrapper.style.transform = `translateX(${dx}px)`;
        await new Promise(r => setTimeout(r, 150));

        await work();

        const enterDx = direction === 'next' ? 28 : -28;
        resultsWrapper.style.transition = 'none';
        resultsWrapper.style.opacity = '0';
        resultsWrapper.style.transform = `translateX(${enterDx}px)`;
        resultsWrapper.offsetHeight; // force reflow
        resultsWrapper.style.transition = 'opacity 0.14s ease, transform 0.14s ease';
        resultsWrapper.style.opacity = '';
        resultsWrapper.style.transform = '';
        _clearTransitionTimer = setTimeout(clearChapterTransition, 250);
    } catch (e) {
        clearChapterTransition();
        throw e;
    }
}

window.goChapter = async function(bookCode, chapter, bName, direction, cardIdx) {
    if (typeof cardIdx === 'number' && mainData && mainData[cardIdx]) {
        // Per-card navigation: replace only this card's block
        await navigateCardToRef(cardIdx, `${bName} ${chapter}`, direction, /*highlightKeys*/ null);
        return;
    }
    clearAllMarkedVerses();
    updateMarkedVersesBar();
    await slideTransition(direction, async () => {
        searchInput.value = `${bName} ${chapter}`;
        updateSearchHighlight();
        await doSearch();
    });
};

window.openSingleVerse = async function(bookCode, chapter, verse, bName, verToSwitch) {
    clearAllMarkedVerses();
    if (verToSwitch && verToSwitch !== versionSelect.value && allVersionsList.some(v => String(v.id) === verToSwitch)) {
        versionSelect.value = verToSwitch;
        updateVersionPickerDisplay();
        await loadBooks();
    }
    if (currentView === 'text_search') {
        const openBooks = [...resultsWrapper.querySelectorAll('.book-group-header.open')]
            .map(h => h.closest('.book-group')?.dataset.book)
            .filter(Boolean);
        const cur = history.state || {};
        try { history.replaceState({ ...cur, savedTextSearch: { openBooks, scrollY: window.scrollY } }, '', window.location.href); } catch {}
    }
    searchInput.value = fmtVerseRef(bookCode, bName, chapter, verse);
    updateSearchHighlight();
    await doSearch();
};

// ── Marked verses & Marked Verses Bar (MVB) ──────────────────────────────────
// MVB sits at the bottom on both desktop and mobile. On mobile a module-host
// (AppModuleHost) can expand on top of MVB to show ONE module at a time, with
// a shared swipe-down dismiss: first swipe closes the module, then MVB.

function clearAllMarkedVerses() {
    markedVerses.clear();
    document.querySelectorAll('.verse-marked').forEach(el => el.classList.remove('verse-marked'));
    const bar = document.getElementById('markedVersesBar');
    if (bar) bar.classList.remove('mvb-visible');
    document.body.classList.remove('mvb-on');
    document.documentElement.style.setProperty('--mvb-h', '0px');
}

// Book order lookup: returns a sort key for a USFM code using booksData
function _bookOrder(usfm) {
    const idx = booksData.indexOf(_booksMap.get(usfm));
    return idx >= 0 ? idx : 999;
}

function _getSortedMarkedVerses() {
    return [...markedVerses.values()].sort((a, b) => {
        const oa = _bookOrder(a.book), ob = _bookOrder(b.book);
        if (oa !== ob) return oa - ob;
        if (a.chapter !== b.chapter) return a.chapter - b.chapter;
        return a.verse - b.verse;
    });
}

function getMarkedVersesGroups() {
    const sorted = _getSortedMarkedVerses();
    if (sorted.length === 0) return [];
    const groups = [];
    let cur = null;
    for (const v of sorted) {
        if (cur && cur.book === v.book && cur.chapter === v.chapter && v.verse === cur.vsEnd + 1) {
            cur.vsEnd = v.verse;
            cur.verses.push(v);
        } else {
            cur = { book: v.book, chapter: v.chapter, vsStart: v.verse, vsEnd: v.verse, verses: [v] };
            groups.push(cur);
        }
    }
    return groups;
}

function buildMvbRefString() {
    const sorted = _getSortedMarkedVerses();
    if (sorted.length === 0) return '';
    // Group by book+chapter, build ranges within chapter
    const byBookChap = [];
    let curBook = null, curChap = null, curGroup = null;
    for (const v of sorted) {
        if (v.book !== curBook || v.chapter !== curChap) {
            curBook = v.book; curChap = v.chapter;
            curGroup = { book: v.book, chapter: v.chapter, ranges: [] };
            byBookChap.push(curGroup);
        }
        const ranges = curGroup.ranges;
        if (ranges.length > 0) {
            const last = ranges[ranges.length - 1];
            if (v.verse === last.end + 1) { last.end = v.verse; continue; }
        }
        ranges.push({ start: v.verse, end: v.verse });
    }
    const parts = byBookChap.map(g => {
        const bookName = bookRefName(g.book) || g.book;
        const rangeParts = g.ranges.map(r => r.start === r.end ? String(r.start) : `${r.start}-${r.end}`);
        const joined = rangeParts.join(', ');
        return isSingleChapterBook(g.book) ? `${bookName} ${joined}` : `${bookName} ${g.chapter}:${joined}`;
    });
    return parts.join(' · ');
}

function buildMvbQuery(forCompare) {
    const groups = getMarkedVersesGroups();
    const parts = groups.map(g => {
        const bookName = bookRefName(g.book) || g.book;
        return fmtVerseRef(g.book, bookName, g.chapter, g.vsStart, g.vsEnd);
    });
    return parts.join(';');
}

function _getMvbPinSpecs() {
    const version = String(versionSelect ? versionSelect.value : '');
    return getMarkedVersesGroups().map(g => {
        const bookName = bookRefName(g.book) || g.book;
        const label = fmtVerseRef(g.book, bookName, g.chapter, g.vsStart, g.vsEnd);
        const text = g.verses.map(v => v.text).join(' ').slice(0, 400);
        return {
            book: g.book,
            ch_start: g.chapter, vs_start: g.vsStart,
            ch_end: g.chapter, vs_end: g.vsEnd,
            version, label, text
        };
    });
}

function updateMvbPinButtonState() {
    const pinBtn = document.getElementById('mvbPinTop');
    if (!pinBtn) return;
    const specs = _getMvbPinSpecs();
    const pinned = specs.length > 0 && !!window.PinnedVerses
        && specs.every(s => window.PinnedVerses.isPinned(s));
    pinBtn.classList.toggle('pinned', pinned);
}

function _mvbActiveBlockIdx() {
    if (!markedVerses.size) return null;
    // Use the first marked verse's blockIdx — places are scoped per block.
    const first = markedVerses.values().next().value;
    return first && Number.isFinite(first.blockIdx) ? first.blockIdx : null;
}

function updateMvbMapButtonState() {
    const btn = document.getElementById('mvbMap');
    if (!btn) return;
    const idx = _mvbActiveBlockIdx();
    const reg = window.blockPlacesRegistry || {};
    const places = (idx != null) ? (reg[idx] || []) : [];
    // Disabled (greyed) when no marked verses mention a place — same set of
    // module buttons stays visible, just inert.
    const verseSet = new Set([...markedVerses.values()].map(v => `${v.chapter}:${v.verse}`));
    const hasPlacesForMarked = places.some(p => (p.refs || []).some(r => verseSet.has(`${r.chapter}:${r.verse}`)));
    btn.disabled = !hasPlacesForMarked;
    btn.setAttribute('aria-disabled', hasPlacesForMarked ? 'false' : 'true');
    btn.dataset.blockIdx = String(idx ?? '');
}

function updateMvbTopicsButtonState() {
    const btn = document.getElementById('mvbTopics');
    if (!btn) return;
    const idx = _mvbActiveBlockIdx();
    const block = (idx != null && Array.isArray(window.mainData)) ? window.mainData[idx] : null;
    const enabled = !!(block && block.has_topics);
    btn.disabled = !enabled;
    btn.setAttribute('aria-disabled', enabled ? 'false' : 'true');
    btn.title = enabled ? 'Temaer for markerte vers' : 'Ingen temaer for denne teksten';
}

// Compute external URLs for the current marked-verses scope. Returns
// {ilUrl, crUrl, yvUrl} or null if no scope.
function mvbExternalUrls() {
    const groups = getMarkedVersesGroups();
    const first = groups[0];
    if (!first) return null;
    const ilUrl = typeof interlinearUrl === 'function' ? interlinearUrl(first.book, first.chapter, first.vsStart) : null;
    const crUrl = typeof biblerefUrl === 'function' ? biblerefUrl(first.book, first.chapter, first.vsStart) : null;
    const ver = versionSelect ? versionSelect.value : null;
    const yvVerses = groups.flatMap(g => {
        const vs = [];
        for (let i = g.vsStart; i <= g.vsEnd; i++) vs.push({ chapter: g.chapter, num: i });
        return vs;
    });
    const yvUrl = (typeof youversionUrl === 'function' && ver) ? youversionUrl(first.book, first.chapter, yvVerses, ver, false) : null;
    return { ilUrl, crUrl, yvUrl };
}

function updateMvbExternalLinks() {
    // Layer-2 external links no longer live in the MVB — they're sourced
    // lazily by openExternalPopup() from mvbExternalUrls(). The Ekstern
    // button itself is always visible; disable it if no URLs apply.
    const extBtn = document.getElementById('mvbExternal');
    if (!extBtn) return;
    const urls = mvbExternalUrls();
    const hasAny = !!(urls && (urls.ilUrl || urls.crUrl || urls.yvUrl));
    extBtn.disabled = !hasAny;
    extBtn.setAttribute('aria-disabled', hasAny ? 'false' : 'true');
}

function updateMarkedVersesBar() {
    const bar = document.getElementById('markedVersesBar');
    if (!bar) return;

    const hasVerses = markedVerses.size > 0;

    if (!hasVerses) {
        bar.classList.remove('mvb-visible');
        document.body.classList.remove('mvb-on');
        document.documentElement.style.setProperty('--mvb-h', '0px');
        // MVB context is gone — any module pinned to those verses should close too.
        if (window.AppModuleHost && window.AppModuleHost.isOpen()) {
            window.AppModuleHost.closeModule();
        }
        return;
    }

    document.body.classList.add('mvb-on');
    bar.classList.add('mvb-visible');

    const refEl = document.getElementById('mvbRef');
    if (refEl) refEl.textContent = hasVerses ? buildMvbRefString() : '';

    // Fotnoter / Referanser are now always visible — greyed when the marked
    // verses have nothing to show.
    const anyFn = hasVerses && [...markedVerses.values()].some(v => v.hasFn);
    const anyXr = hasVerses && [...markedVerses.values()].some(v => v.hasXr);
    const fnBtn = document.getElementById('mvbFn');
    const xrBtn = document.getElementById('mvbXr');
    if (fnBtn) { fnBtn.disabled = !anyFn; fnBtn.setAttribute('aria-disabled', anyFn ? 'false' : 'true'); }
    if (xrBtn) { xrBtn.disabled = !anyXr; xrBtn.setAttribute('aria-disabled', anyXr ? 'false' : 'true'); }

    if (hasVerses) { updateMvbExternalLinks(); updateMvbPinButtonState(); updateMvbMapButtonState(); updateMvbTopicsButtonState(); }

    // Measure AFTER content is laid out — first activation populates mvbRef and
    // toggles row visibility, so measuring before would yield a too-small height
    // and park the collapsed drawer behind MVB.
    const measuredH = bar.offsetHeight || 0;
    document.documentElement.style.setProperty('--mvb-h', measuredH + 'px');
}

function _mvbCopyText() {
    const sorted = _getSortedMarkedVerses();
    const text = sorted.map(v => v.text).join(' ').trim();
    const ref = buildMvbRefString();
    const verLabel = versionSelect ? (' ' + (versionSelect.options[versionSelect.selectedIndex]?.text || '')) : '';
    const full = `${text}\n\n${ref}${verLabel}`;
    if (!navigator.clipboard) { showToast(t('toast.clipboardUnavailable')); return; }
    navigator.clipboard.writeText(full).then(() => {
        showToast(t('toast.copied'));
    }).catch(() => showToast(t('toast.copyFailed')));
}

// ── Module active-state plumbing ─────────────────────────────────────
function _isModuleActive(id) {
    return !!(window.AppModuleBus && window.AppModuleBus.isActive(id));
}

// Toggle-off contract for Layer-3 buttons: clicking an already-active
// module's button closes it (mobile → AppModuleHost.closeModule;
// PC → AppSidebar.closeModule(id); map fullscreen has its own path).
function _closeActiveModule(id) {
    if (window.AppModuleHost && window.AppModuleHost.isMobile()
        && window.AppModuleHost.getActiveId() === id) {
        window.AppModuleHost.closeModule();
        return;
    }
    if (window.AppSidebar && typeof window.AppSidebar.closeModule === 'function') {
        window.AppSidebar.closeModule(id);
    }
}

// Reflect AppModuleBus state on UI. Highlight is source-specific:
//   source='mvb'   → MVB module button highlights; no tray highlight.
//   source='tray'  → tray button on origin block highlights; MVB stays neutral.
//   source='external' → only the popup's trigger (MVB or tray, by origin) highlights.
function applyModuleActiveDom(id, active, originBlockIdx, source) {
    const mvbBtn = document.querySelector(`#mvbModules [data-module="${id}"]`);
    // Clear everywhere first
    if (mvbBtn) mvbBtn.removeAttribute('data-active');
    document.querySelectorAll(`.tray-btn[data-module="${id}"]`).forEach(el => {
        el.removeAttribute('data-active');
    });
    if (!active) return;
    if (source === 'mvb') {
        if (mvbBtn) mvbBtn.setAttribute('data-active', '');
    } else if (source === 'tray' && originBlockIdx != null) {
        const trayBtn = document.querySelector(`#study-tray-${originBlockIdx} .tray-btn[data-module="${id}"]`);
        if (trayBtn) trayBtn.setAttribute('data-active', '');
    } else if (source === 'external') {
        // External popup: highlight whichever trigger opened it (mvb or tray).
        if (originBlockIdx == null) {
            if (mvbBtn) mvbBtn.setAttribute('data-active', '');
        } else {
            const trayBtn = document.querySelector(`#study-tray-${originBlockIdx} .tray-btn[data-module="${id}"]`);
            if (trayBtn) trayBtn.setAttribute('data-active', '');
        }
    }
}

// Re-apply active classes after a re-render (called from rerenderCard / renderResults).
function refreshModuleActiveDom() {
    if (!window.AppModuleBus) return;
    const ids = ['map', 'commentary', 'leksikon', 'topics', 'outline', 'external'];
    ids.forEach(id => {
        const active = window.AppModuleBus.isActive(id);
        const origin = window.AppModuleBus.getOrigin(id);
        const source = window.AppModuleBus.getSource(id);
        applyModuleActiveDom(id, active, origin, source);
    });
}
window.refreshModuleActiveDom = refreshModuleActiveDom;

// ── Ekstern popup ────────────────────────────────────────────────────
let _extPopupCtx = null;
function _extUrlsForBlock(idx) {
    const b = (window.mainData && window.mainData[idx]) || null;
    if (!b || !b.verses || !b.verses.length) return null;
    const ch = b.verses[0].chapter;
    const single = b.verses.length === 1;
    const ver = versionSelect ? versionSelect.value : null;
    const ilUrl = typeof interlinearUrl === 'function' ? interlinearUrl(b.book, ch, single ? b.verses[0].num : null) : null;
    const crUrl = typeof biblerefUrl === 'function' ? biblerefUrl(b.book, ch, single ? b.verses[0].num : null) : null;
    const yvUrl = (typeof youversionUrl === 'function' && ver) ? youversionUrl(b.book, ch, b.verses, ver, !!b.is_chapter) : null;
    return { ilUrl, crUrl, yvUrl };
}

function openExternalPopup(opts) {
    const popup = document.getElementById('externalPopup');
    if (!popup) return;
    const urls = (opts && opts.scope === 'block')
        ? _extUrlsForBlock(opts.idx)
        : mvbExternalUrls();
    if (!urls) return;
    const il = document.getElementById('extInterlinear');
    const cr = document.getElementById('extBibleref');
    const sr = document.getElementById('extSource');
    if (il) { il.style.display = urls.ilUrl ? '' : 'none'; if (urls.ilUrl) il.href = urls.ilUrl; }
    if (cr) { cr.style.display = urls.crUrl ? '' : 'none'; if (urls.crUrl) cr.href = urls.crUrl; }
    if (sr) { sr.style.display = urls.yvUrl ? '' : 'none'; if (urls.yvUrl) sr.href = urls.yvUrl; }

    // Position: anchored to trigger on PC (above when there's more room above —
    // MVB sits at the bottom of the viewport so its popup opens upward),
    // bottom-sheet on mobile.
    const isMobile = window.innerWidth <= 700 || document.body.classList.contains('tablet-portrait');
    popup.classList.toggle('external-popup-mobile', isMobile);
    if (!isMobile && opts && opts.anchor) {
        const r = opts.anchor.getBoundingClientRect();
        popup.style.position = 'fixed';
        popup.style.right = '';
        popup.style.bottom = '';
        // Measure popup height by briefly making it visible-but-transparent.
        popup.style.top = '-9999px';
        popup.style.left = '0px';
        popup.setAttribute('data-state', 'open');
        const popupH = popup.offsetHeight || 160;
        const popupW = popup.offsetWidth || 220;
        const spaceBelow = window.innerHeight - r.bottom;
        const spaceAbove = r.top;
        const placeAbove = spaceBelow < popupH + 16 && spaceAbove > spaceBelow;
        const top = placeAbove ? Math.max(8, r.top - popupH - 6) : (r.bottom + 6);
        const left = Math.min(window.innerWidth - popupW - 8, Math.max(8, r.right - popupW));
        popup.style.top = top + 'px';
        popup.style.left = left + 'px';
    } else {
        popup.style.position = '';
        popup.style.left = '';
        popup.style.right = '';
        popup.style.top = '';
        popup.style.bottom = '';
    }
    popup.setAttribute('data-state', 'open');
    popup.setAttribute('aria-hidden', 'false');
    _extPopupCtx = opts || { scope: 'mvb' };
    const originIdx = (opts && opts.scope === 'block') ? opts.idx : null;
    try { window.AppModuleBus && window.AppModuleBus.setActive('external', true, originIdx, 'external'); } catch {}

    // Outside-click dismiss
    setTimeout(() => {
        document.addEventListener('pointerdown', _onExtPopupOutside, true);
    }, 0);
}

function closeExternalPopup() {
    const popup = document.getElementById('externalPopup');
    if (!popup) return;
    popup.setAttribute('data-state', 'closed');
    popup.setAttribute('aria-hidden', 'true');
    _extPopupCtx = null;
    document.removeEventListener('pointerdown', _onExtPopupOutside, true);
    try { window.AppModuleBus && window.AppModuleBus.setActive('external', false); } catch {}
}

function _onExtPopupOutside(ev) {
    const popup = document.getElementById('externalPopup');
    if (!popup) return;
    if (ev.target.closest('#externalPopup')) return;
    if (ev.target.closest('#mvbExternal')) return;
    if (ev.target.closest('.tray-btn[data-module="external"]')) return;
    closeExternalPopup();
}
window.openExternalPopup = openExternalPopup;
window.closeExternalPopup = closeExternalPopup;

// ── Share ───────────────────────────────────────────────────────────
function buildShareUrl() {
    const groups = getMarkedVersesGroups();
    if (!groups.length) return null;
    const refParts = groups.map(g => fmtVerseRef(g.book, bookRefName(g.book), g.chapter, g.vsStart, g.vsEnd));
    const q = refParts.join('; ');
    const v = versionSelect ? versionSelect.value : '';
    // Single marked group → synthesize a block so buildURL produces the
    // canonical /bibel/... path. Multi-group shares stay on /?q=.
    let block = null;
    if (groups.length === 1) {
        const g = groups[0];
        const vs = [];
        if (g.vsStart != null && g.vsEnd != null) {
            for (let n = g.vsStart; n <= g.vsEnd; n++) vs.push({ num: n, chapter: g.chapter });
        }
        block = {
            book: g.book,
            verses: vs,
            is_chapter: g.vsStart == null && g.vsEnd == null,
        };
    }
    return `${window.location.origin}${buildURL(q, v, 'normal', block)}`;
}

async function mvbShare() {
    const url = buildShareUrl();
    if (!url) return;
    const ref = buildMvbRefString();
    if (navigator.share) {
        try {
            await navigator.share({ title: ref, text: ref, url });
            return;
        } catch (e) {
            // User cancelled or share failed — fall through to clipboard fallback.
            if (e && e.name === 'AbortError') return;
        }
    }
    try {
        await navigator.clipboard.writeText(url);
        showToast(t('toast.linkCopied'));
    } catch { showToast(t('toast.copyFailed')); }
}

// Initialize MVB buttons (called once after DOM ready)
function initMarkedVersesBar() {
    // Click outside text/buttons while MVB is open → dismiss.
    // Ignored when pointer is inside MVB, a verse, an interactive control, a modal,
    // an open module host, or the pinned strip.
    document.addEventListener('pointerdown', (ev) => {
        if (!document.body.classList.contains('mvb-on')) return;
        if (ev.target.closest(
            '#markedVersesBar, .verse-card, .verse-text-clickable, .verse-panel, ' +
            'button, a, input, select, textarea, label, ' +
            '.modal-overlay, .module-host, .pinned-strip, ' +
            '.app-sidebar, .map-fullscreen, .autocomplete-dropdown, .vp-list'
        )) return;
        // Clear marks only — keep highlight (it has its own dismiss chip).
        clearAllMarkedVerses();
    });

    // Keep --mvb-h in lockstep with the actual bar height so the collapsed drawer always
    // parks exactly above MVB. Without this, a row showing/hiding (annot row, highlight chip)
    // after the initial measurement can leave the drawer partially behind MVB.
    const barForObs = document.getElementById('markedVersesBar');
    if (barForObs && typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(() => {
            if (!document.body.classList.contains('mvb-on')) return;
            const h = barForObs.offsetHeight || 0;
            document.documentElement.style.setProperty('--mvb-h', h + 'px');
        });
        ro.observe(barForObs);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (window.innerWidth <= 700 || document.body.classList.contains('tablet-portrait')) return; // mobile/tablet-portrait dismisses via swipe
        if (document.body.classList.contains('mvb-on')) {
            clearAllMarkedVerses();
            e.preventDefault();
        }
    });

    const openBtn = document.getElementById('mvbOpen');
    if (openBtn) openBtn.addEventListener('click', async () => {
        const q = buildMvbQuery();
        if (!q) return;
        // Per UX spec: opening the marked verse closes the active module.
        if (window.AppModuleHost && window.AppModuleHost.isOpen()) {
            window.AppModuleHost.closeModule();
        }
        const markedVersions = [...markedVerses.values()].map(v => v.version).filter(Boolean);
        const uniqueVersions = [...new Set(markedVersions)];
        if (uniqueVersions.length === 1 && uniqueVersions[0] !== versionSelect.value
            && allVersionsList.some(v => String(v.id) === uniqueVersions[0])) {
            versionSelect.value = uniqueVersions[0];
            updateVersionPickerDisplay();
            await loadBooks();
        }
        searchInput.value = q;
        updateSearchHighlight();
        doSearch();
    });

    // Sammenlign is now sourced exclusively from the toolbar — removed from MVB.

    const mapBtn = document.getElementById('mvbMap');
    if (mapBtn) mapBtn.addEventListener('click', () => {
        if (mapBtn.disabled) return;
        if (_isModuleActive('map')) { _closeActiveModule('map'); return; }
        const idx = _mvbActiveBlockIdx();
        if (idx == null) return;
        if (!window.MapModule || typeof window.MapModule.showForBlock !== 'function') return;
        const verseFilter = [...markedVerses.values()].map(v => ({ chapter: v.chapter, verse: v.verse }));
        if (window.AppModuleBus) window.AppModuleBus.setPendingContext({ origin: idx, source: 'mvb' });
        try { window.MapModule.showForBlock(idx, null, { verseFilter }); }
        finally { Promise.resolve().then(() => window.AppModuleBus && window.AppModuleBus.clearPendingContext()); }
    });

    const pinBtn = document.getElementById('mvbPinTop');
    if (pinBtn) pinBtn.addEventListener('click', () => {
        if (!window.PinnedVerses) return;
        const specs = _getMvbPinSpecs();
        if (!specs.length) return;
        const allPinned = specs.every(s => window.PinnedVerses.isPinned(s));
        if (allPinned) {
            specs.forEach(s => window.PinnedVerses.remove(s));
        } else {
            specs.forEach(s => { if (!window.PinnedVerses.isPinned(s)) window.PinnedVerses.add(s); });
        }
        updateMvbPinButtonState();
    });

    function _mvbMarkedAsRefs() {
        return [...markedVerses.values()].map(v => ({ book: v.book, chapter: v.chapter, verse: v.verse }));
    }

    function _mvbInvoke(id, openFn) {
        // Per UX: clicking MVB while module is active (from any source) closes it.
        if (_isModuleActive(id)) { _closeActiveModule(id); return; }
        const idx = _mvbActiveBlockIdx();
        if (window.AppModuleBus) window.AppModuleBus.setPendingContext({ origin: idx, source: 'mvb' });
        try { openFn(); } finally {
            Promise.resolve().then(() => window.AppModuleBus && window.AppModuleBus.clearPendingContext());
        }
    }

    const commentaryBtn = document.getElementById('mvbCommentary');
    if (commentaryBtn) commentaryBtn.addEventListener('click', () => {
        if (commentaryBtn.disabled) return;
        if (!window.CommentaryModule || !markedVerses.size) return;
        _mvbInvoke('commentary', () => window.CommentaryModule.showForMarkedVerses(_mvbMarkedAsRefs()));
    });

    const leksikonBtn = document.getElementById('mvbLeksikon');
    if (leksikonBtn) leksikonBtn.addEventListener('click', () => {
        if (leksikonBtn.disabled) return;
        if (!window.LeksikonModule || !markedVerses.size) return;
        _mvbInvoke('leksikon', () => window.LeksikonModule.showForMarkedVerses(_mvbMarkedAsRefs()));
    });

    const topicsBtn = document.getElementById('mvbTopics');
    if (topicsBtn) topicsBtn.addEventListener('click', () => {
        if (topicsBtn.disabled) return;
        if (!window.TopicsModule || !markedVerses.size) return;
        _mvbInvoke('topics', () => window.TopicsModule.showForMarkedVerses(_mvbMarkedAsRefs()));
    });

    const outlineBtn = document.getElementById('mvbOutline');
    if (outlineBtn) outlineBtn.addEventListener('click', () => {
        if (outlineBtn.disabled) return;
        if (!window.OutlineModule || !markedVerses.size) return;
        if (typeof window.OutlineModule.showForMarkedVerses !== 'function') return;
        _mvbInvoke('outline', () => window.OutlineModule.showForMarkedVerses(_mvbMarkedAsRefs()));
    });

    const extBtn = document.getElementById('mvbExternal');
    if (extBtn) extBtn.addEventListener('click', (e) => {
        if (extBtn.disabled) return;
        if (_isModuleActive('external')) { closeExternalPopup(); return; }
        openExternalPopup({ scope: 'mvb', anchor: extBtn });
        e.stopPropagation();
    });

    const shareBtn = document.getElementById('mvbShare');
    if (shareBtn) shareBtn.addEventListener('click', () => mvbShare());

    function _collectAnnotButtons(kind) {
        const btns = [];
        markedVerses.forEach((v) => {
            if (kind === 'fn' && !v.hasFn) return;
            if (kind === 'xr' && !v.hasXr) return;
            const refs = document.querySelectorAll(
                `.verse-text-clickable[data-book="${v.book}"][data-chapter="${v.chapter}"][data-verse="${v.verse}"]`
            );
            // Match the specific version when marked from compare body, so MVB
            // opens the panel in the version the user actually clicked.
            const ref = v.version
                ? ([...refs].find(r => r.dataset.version === v.version) || refs[0])
                : refs[0];
            const verseLine = ref?.closest('.verse-line');
            const btn = kind === 'fn'
                ? verseLine?.querySelector('.fn-btn')
                : verseLine?.querySelector('.xr-btn');
            if (btn) btns.push(btn);
        });
        return btns;
    }

    function _toggleAnnotForMarked(kind, mvbBtn) {
        const btns = _collectAnnotButtons(kind);
        if (btns.length === 0) return;
        const allActive = btns.every(b => b.classList.contains('active'));
        // If all open → close all; otherwise open any not-yet-open
        btns.forEach(b => {
            const isActive = b.classList.contains('active');
            if (allActive && isActive) b.click();
            else if (!allActive && !isActive) b.click();
        });
        if (mvbBtn) mvbBtn.classList.toggle('active', !allActive);
    }

    const fnBtn = document.getElementById('mvbFn');
    if (fnBtn) fnBtn.addEventListener('click', () => _toggleAnnotForMarked('fn', fnBtn));

    const xrBtn = document.getElementById('mvbXr');
    if (xrBtn) xrBtn.addEventListener('click', () => _toggleAnnotForMarked('xr', xrBtn));

    const copyBtn = document.getElementById('mvbCopyBtn');
    if (copyBtn) copyBtn.addEventListener('click', () => _mvbCopyText());

    // Subscribe to AppModuleBus → reflect active-state on MVB module buttons and
    // (for the block the module was opened from) on the per-block study-tray buttons.
    if (window.AppModuleBus && typeof window.AppModuleBus.subscribe === 'function') {
        window.AppModuleBus.subscribe((id, active, originBlockIdx, source) => {
            applyModuleActiveDom(id, active, originBlockIdx, source);
        });
    }

    // Swipe-down anywhere on MVB (except interactive controls / scrollable rows) → dismiss
    const bar = document.getElementById('markedVersesBar');
    if (bar) {
        let dragging = false, startY = 0, startX = 0, lastDy = 0, axisLocked = null;
        bar.addEventListener('pointerdown', (e) => {
            if (e.target.closest('button, a, .mvb-modules, .mvb-row-actions')) return;
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            // When a module is open on top of MVB, only the module-host handle can
            // dismiss things — first swipe closes module, then user can swipe MVB.
            if (document.body.classList.contains('module-open')) return;
            dragging = true;
            startY = e.clientY;
            startX = e.clientX;
            lastDy = 0;
            axisLocked = null;
            try { bar.setPointerCapture(e.pointerId); } catch {}
            // Suppress text selection / native gestures while we decide axis
            e.preventDefault();
        });
        bar.addEventListener('pointermove', (e) => {
            if (!dragging) return;
            const dy = e.clientY - startY;
            const dx = e.clientX - startX;
            if (axisLocked === null && (Math.abs(dy) > 6 || Math.abs(dx) > 6)) {
                axisLocked = Math.abs(dy) > Math.abs(dx) ? 'y' : 'x';
            }
            if (axisLocked !== 'y') return;
            e.preventDefault();
            // First confirmed Y move: switch off transitions so MVB + drawer follow finger 1:1.
            if (!document.body.classList.contains('mvb-dragging')) {
                document.body.classList.add('mvb-dragging');
            }
            lastDy = Math.max(0, dy);
            // Drive both MVB and the collapsed drawer via shared CSS var so they move as one unit.
            document.documentElement.style.setProperty('--mvb-shift', lastDy + 'px');
        });
        function endDrag() {
            if (!dragging) return;
            dragging = false;
            document.body.classList.remove('mvb-dragging');
            bar.style.opacity = '';
            const dismiss = axisLocked === 'y' && lastDy > 60;
            if (dismiss) {
                // Clear only marks — highlight is a separate concept and has its
                // own dismiss chip in MVB. Clearing the highlight here would wipe
                // the user's original navigation context when they swipe away the
                // marks (matches Escape-key dismiss behaviour).
                clearAllMarkedVerses();
                document.documentElement.style.setProperty('--mvb-shift', '0px');
            } else {
                // Rubber-band back into place — MVB and drawer transition together.
                document.documentElement.style.setProperty('--mvb-shift', '0px');
            }
        }
        bar.addEventListener('pointerup', endDrag);
        bar.addEventListener('pointercancel', endDrag);
    }
}

// ── Verse-text click: mark / unmark with underline ───────────────────────────
document.addEventListener('click', (ev) => {
    const target = ev.target.closest('.verse-text-clickable');
    if (!target) return;
    if (ev.target.closest('.verse-btn, .place-chip, .verse-num, a, button')) return;
    ev.stopPropagation();
    const book = target.dataset.book;
    const chapter = parseInt(target.dataset.chapter, 10);
    const verse = parseInt(target.dataset.verse, 10);
    const markedVersion = target.dataset.version || null;
    const key = `${book}.${chapter}.${verse}.${markedVersion || ''}`;
    if (markedVerses.has(key)) {
        markedVerses.delete(key);
        target.classList.remove('verse-marked');
    } else {
        const cardEl = target.closest('[data-card-idx]') || target.closest('.verse-card');
        const blockIdx = cardEl ? parseInt(cardEl.dataset.cardIdx ?? cardEl.id?.replace('card-', '') ?? '0', 10) : 0;
        markedVerses.set(key, {
            book,
            chapter,
            verse,
            hasFn: target.dataset.hasFn === '1',
            hasXr: target.dataset.hasXr === '1',
            blockIdx,
            text: target.textContent.trim(),
            version: markedVersion
        });
        target.classList.add('verse-marked');
    }
    updateMarkedVersesBar();
});

window.addEventListener('resize', () => {
    Object.entries(cardCompare).forEach(([idx, cs]) => {
        if (cs && cs.alignMode && cs.visible && cs.mode === 'single') equalizeVerseHeights(parseInt(idx));
    });
});

// ── Study tray drag-to-scroll (PC only) ──
(function() {
    let trayDragging = false, trayEl = null, trayStartX = 0, trayScrollLeft = 0, trayMoved = false;
    document.addEventListener('pointerdown', (e) => {
        if (window.innerWidth <= 700) return;
        if (e.pointerType === 'touch') return;
        const inner = e.target.closest('.study-tray-inner');
        if (!inner) return;
        if (e.target.closest('button, a')) return;
        trayDragging = true;
        trayEl = inner;
        trayStartX = e.clientX;
        trayScrollLeft = inner.scrollLeft;
        trayMoved = false;
        try { inner.setPointerCapture(e.pointerId); } catch {}
        e.preventDefault();
    }, { passive: false });
    document.addEventListener('pointermove', (e) => {
        if (!trayDragging || !trayEl) return;
        const dx = e.clientX - trayStartX;
        if (Math.abs(dx) > 3) trayMoved = true;
        trayEl.scrollLeft = trayScrollLeft - dx;
    });
    document.addEventListener('pointerup', (e) => {
        if (!trayDragging) return;
        if (trayMoved) e.stopImmediatePropagation();
        trayDragging = false;
        trayEl = null;
    });
    document.addEventListener('pointercancel', () => { trayDragging = false; trayEl = null; });
})();

// ── Text search ──
let textSearchBookTotals = {};

function _renderGroupItems(items, bookCode, hlQuery, lang) {
    let html = '';
    items.forEach(r => {
        const ref = translateLabel(r.ref, r.book, lang);
        html += `<div class="search-result-item" onclick="goToVerse('${escAttr(r.ref)}')">
            <div class="search-result-ref">${escHtml(ref)}</div>
            <div class="search-result-text">${highlightWords(escHtml(r.text), hlQuery)}</div>
        </div>`;
    });
    const total = textSearchBookTotals[bookCode] || items.length;
    if (items.length < total) {
        html += `<button class="show-all-btn" onclick="loadAllForBook('${escAttr(bookCode)}', this)">${escHtml(t('searchResults.showAll', total))}</button>`;
    }
    return html;
}

function materializeGroup(itemsEl, bookCode, hlQuery, lang) {
    if (!itemsEl.dataset.pending) return;
    const items = textSearchGroupData[bookCode] || [];
    itemsEl.innerHTML = _renderGroupItems(items, bookCode, hlQuery, lang);
    delete itemsEl.dataset.pending;
}

window.loadAllForBook = async function(bookCode, btnEl) {
    const original = btnEl.textContent;
    btnEl.textContent = t('searchResults.loadingAll');
    btnEl.disabled = true;
    try {
        const q = lastTextSearchQuery;
        const v = versionSelect.value;
        const resp = await fetch(`/api/search?q=${encodeURIComponent(q)}&version=${encodeURIComponent(v)}&book=${encodeURIComponent(bookCode)}`);
        const data = await resp.json();
        const fullItems = (data.results || []).filter(r => r.book === bookCode);
        textSearchGroupData[bookCode] = fullItems;
        textSearchBookTotals[bookCode] = fullItems.length;
        const group = resultsWrapper.querySelector(`.book-group[data-book="${bookCode}"]`);
        if (!group) return;
        const itemsEl = group.querySelector('.book-group-items');
        const wasOpen = itemsEl.classList.contains('open');
        const hlQuery = stripScopePrefix(lastTextSearchQuery);
        const lang = versionLang(versionSelect.value);
        itemsEl.innerHTML = _renderGroupItems(fullItems, bookCode, hlQuery, lang);
        if (wasOpen) {
            itemsEl.style.height = 'auto';
        }
        // Update count in header
        const countEl = group.querySelector('.book-group-count');
        if (countEl) countEl.textContent = `(${fullItems.length})`;
    } catch {
        btnEl.textContent = original;
        btnEl.disabled = false;
    }
};

function renderTextSearch(results, query, bookTotals) {
    setPageTitle(`"${query}"`);
    textSearchCache = { results, query, bookTotals: bookTotals || {} };
    textSearchGroupData = {};
    textSearchBookTotals = bookTotals || {};
    const hlQuery = stripScopePrefix(query);
    let html = '';
    const totalAcross = Object.keys(textSearchBookTotals).length
        ? Object.values(textSearchBookTotals).reduce((a, b) => a + b, 0)
        : results.length;
    if (results.length === 0) {
        html = `<div class="empty-state">
            <h2>${escHtml(t('searchResults.text.noResults'))}</h2>
            <p>${escHtml(t('searchResults.text.noResultsBody', query, versionLabel(versionSelect.value)))}</p>
            <div class="empty-state-actions">
                <button class="btn btn-secondary" onclick="searchAllVersionsText('${escAttr(query)}')">${escHtml(t('searchResults.searchAllVersions'))}</button>
                ${scopeMenuHtml(null, { excludeBible: true, block: true, triggerLabel: t('search.scope.studyButton') })}
            </div>
        </div>`;
        resultsWrapper.innerHTML = html;
        wireScopeMenu(resultsWrapper);
        return;
    }

    // attribution stats icon: https://www.flaticon.com/free-icons/graph" Graph icons created by Bamicon - Flaticon
    const countKey = totalAcross === 1 ? 'searchResults.count' : 'searchResults.countPlural';
    html += `<div class="search-controls">
        <div class="search-result-count">${escHtml(t(countKey, totalAcross, query))}</div>
        <div class="search-controls-actions">
            <button class="card-action-btn" id="expandCollapseBtn" onclick="toggleGroups()">${escHtml(t('searchResults.expandAll'))}</button>
            <button class="stats-btn" onclick="openStats('${escAttr(query)}')"><img src="/static/images/stats.png" class="stats-icon" alt="" aria-hidden="true"> ${escHtml(t('searchResults.statsBtn'))}</button>
            ${scopeMenuHtml('bible')}
        </div>
    </div>`;

    const lang = versionLang(versionSelect.value);
    const groupMap = {};
    const bookOrder = [];
    results.forEach(r => {
        if (!groupMap[r.book]) { groupMap[r.book] = []; bookOrder.push(r.book); }
        groupMap[r.book].push(r);
    });
    textSearchGroupData = groupMap;
    const autoExpand = bookOrder.length === 1;
    bookOrder.forEach(code => {
        const total = textSearchBookTotals[code] || (groupMap[code] || []).length;
        const bName = bookName(code, lang);
        const openClass = autoExpand ? ' open' : '';
        const pendingAttr = ' data-pending="1"';
        html += `<div class="book-group" data-book="${escHtml(code)}">
            <div class="book-group-header${openClass}" onclick="toggleGroup(this)">
                <span>${escHtml(bName)}<span class="book-group-count">(${total})</span></span>
                <svg class="chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M4 2L8 6L4 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="book-group-items${openClass}"${pendingAttr}></div>
        </div>`;
    });

    resultsWrapper.innerHTML = html;
    wireScopeMenu(resultsWrapper);

    if (autoExpand) {
        const code = bookOrder[0];
        const itemsEl = resultsWrapper.querySelector('.book-group-items');
        materializeGroup(itemsEl, code, hlQuery, lang);
    }
    fixOpenGroupHeights();
}

// ── Study-data search scope (commentary / topics / leksikon) ──────────────
// A small dropdown next to the statistics button lets the user redirect the
// current query into one of the study datasets instead of the bible text.
// Non-persistent: a fresh search resets to bible search.
const STUDY_SCOPES = ['bible', 'commentary', 'topics', 'leksikon'];

// opts: { excludeBible, block, triggerLabel }
//   excludeBible — omit the "Bibeltekst" option (used in the zero-results state,
//                  where the user has already done the bible search).
//   block        — render the trigger as a full-width .btn btn-secondary.
// icon attribution: "https://www.flaticon.com/free-icons/search" Search icons created by Chanut - Flaticon
function scopeMenuHtml(active, opts) {
    opts = opts || {};
    const activeKey = active || 'bible';
    const labels = {
        bible: t('search.scope.bible'),
        commentary: t('search.scope.commentary'),
        topics: t('search.scope.topics'),
        leksikon: t('search.scope.leksikon'),
    };
    const scopes = opts.excludeBible ? ['commentary', 'topics', 'leksikon'] : STUDY_SCOPES;
    const triggerLabel = opts.triggerLabel
        || (activeKey === 'bible' ? t('search.scope.button') : labels[activeKey]);
    const optsHtml = scopes.map(k => {
        const sep = (!opts.excludeBible && k === 'commentary') ? '<div class="scope-separator"></div>' : '';
        return sep + `<button type="button" class="scope-option${k === activeKey ? ' active' : ''}" data-scope="${k}">${escHtml(labels[k])}</button>`;
    }).join('');
    const pickerCls = 'scope-picker'
        + (activeKey !== 'bible' ? ' scope-on' : '')
        + (opts.block ? ' scope-picker-block' : '');
    const triggerCls = 'scope-trigger' + (opts.block ? ' btn btn-secondary' : '');
    return `<div class="${pickerCls}" id="scopePicker">
        <button type="button" class="${triggerCls}" onclick="toggleScopeMenu(event)" title="${escAttr(t('search.scope.title'))}" aria-haspopup="true">
            <img src="/static/images/search.png" class="scope-trigger-icon" alt="" aria-hidden="true">
            <span class="scope-trigger-label">${escHtml(triggerLabel)}</span>
            <svg class="scope-chevron" width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="scope-menu" role="menu">
            ${optsHtml}
            <div class="scope-hint">${escHtml(t('search.scope.englishOnly'))}</div>
        </div>
    </div>`;
}

function toggleScopeMenu(e) {
    if (e) e.stopPropagation();
    const p = document.getElementById('scopePicker');
    if (!p) return;
    const willOpen = !p.classList.contains('open');
    p.classList.toggle('open');
    if (willOpen) positionScopeMenu(p);
}

// Keep the dropdown within the viewport horizontally (it can otherwise spill
// off the left edge on mobile). Block pickers (empty state) span full width.
function positionScopeMenu(p) {
    if (p.classList.contains('scope-picker-block')) return;
    const menu = p.querySelector('.scope-menu');
    if (!menu) return;
    menu.style.left = '0';
    menu.style.right = 'auto';
    const margin = 8;
    let r = menu.getBoundingClientRect();
    if (r.right > window.innerWidth - margin) {
        menu.style.left = (-(r.right - (window.innerWidth - margin))) + 'px';
        r = menu.getBoundingClientRect();
    }
    if (r.left < margin) {
        menu.style.left = (parseFloat(menu.style.left || '0') + (margin - r.left)) + 'px';
    }
}

function wireScopeMenu(root) {
    if (!root) return;
    root.querySelectorAll('.scope-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const p = document.getElementById('scopePicker');
            if (p) p.classList.remove('open');
            selectSearchScope(btn.dataset.scope);
        });
    });
}

// Close the scope dropdown on any outside click (attached once).
document.addEventListener('click', e => {
    if (e.target.closest && e.target.closest('#scopePicker')) return;
    const p = document.getElementById('scopePicker');
    if (p) p.classList.remove('open');
});

function selectSearchScope(type) {
    if (!type || type === studySearchType) return;
    if (type === 'bible') {
        studySearchType = null;
        const q = searchInput.value.trim();
        if (textSearchCache && textSearchCache.query === q) {
            // Re-render the cached text search, but still create a real
            // bible-view history entry (we're leaving the /studie URL) so Back
            // returns to the study search we just switched away from.
            const _outScrollY = window.scrollY;
            const _outUrl = window.location.pathname + window.location.search;
            const _outState = history.state;
            currentView = 'text_search';
            lastTextSearchQuery = textSearchCache.query;
            renderTextSearch(textSearchCache.results, textSearchCache.query, textSearchCache.bookTotals || {});
            try { window.AppSidebar && window.AppSidebar.notifyMainBlockChanged(); } catch {}
            const version = versionSelect.value;
            const targetUrl = buildURL(q, version);
            if (targetUrl !== _outUrl) {
                try {
                    history.replaceState({ ...(_outState || {}), scrollY: _outScrollY }, '', _outUrl);
                    history.pushState({ q, version, mode: 'normal' }, '', targetUrl);
                    window.scrollTo(0, 0);
                } catch {}
            }
        } else {
            doSearch(true);
        }
        return;
    }
    doStudySearch(type);
}

const _STUDY_ENDPOINT = { commentary: 'commentary', topics: 'topics', leksikon: 'leksikon' };

// Build the study-search results scaffold (controls bar + body) and return the
// body element. Sets view state + wires the scope picker. Exposed on window so
// StudySearch can rebuild it after a browser-back into a topic drilldown.
function buildStudyScaffold(type) {
    studySearchType = type;
    currentView = 'study_search';
    // Leaving the readable text → tell sidebar modules to drop stale content.
    try { window.AppSidebar && window.AppSidebar.notifyMainBlockChanged(); } catch {}
    resultsWrapper.innerHTML = `<div class="search-controls">
            <div class="search-result-count"></div>
            <div class="search-controls-actions">${scopeMenuHtml(type)}</div>
        </div>
        <div class="study-results" id="studyResults"></div>`;
    wireScopeMenu(resultsWrapper);
    return resultsWrapper.querySelector('#studyResults');
}
window.buildStudyScaffold = buildStudyScaffold;

// Render a study-search response into the (already-built) scaffold. Bails if
// the user has navigated away while an async fetch was in flight.
function renderStudyResults(type, data, query, version) {
    if (currentView !== 'study_search' || studySearchType !== type) return;
    const total = data.total || 0;
    const cEl = resultsWrapper.querySelector('.search-result-count');
    if (cEl) cEl.textContent = total ? t('searchResults.studyCount', total) : t('searchResults.studyNoResults');
    const body = resultsWrapper.querySelector('#studyResults');
    if (!body) return;
    if (!total) {
        body.innerHTML = `<div class="empty-state"><h2>${escHtml(t('searchResults.studyNoResults'))}</h2>`
            + `<p>${escHtml(t('searchResults.studyNoResultsBody', query))}</p></div>`;
        return;
    }
    if (window.StudySearch && typeof window.StudySearch.render === 'function') {
        window.StudySearch.render(type, data, body, { query, version });
    }
}

async function doStudySearch(type, push = true) {
    const query = searchInput.value.trim();
    if (!query || !_STUDY_ENDPOINT[type]) return;
    setPageTitle(`"${query}"`);
    const version = versionSelect.value;
    // History: a study search has its own /studie?scope=&q= URL. On forward
    // navigation, stamp the leaving entry's scroll then push the study entry so
    // Back returns there with state intact; when the target URL already matches
    // (same-URL re-toggle) just replace so we don't stack a duplicate.
    if (push) {
        try {
            const _outScrollY = window.scrollY;
            const _outUrl = window.location.pathname + window.location.search;
            const _outState = history.state;
            const targetUrl = buildStudyURL(type, query, version);
            const navState = { studyNav: { kind: 'search', type, q: query, version } };
            if (targetUrl !== _outUrl) {
                history.replaceState({ ...(_outState || {}), scrollY: _outScrollY }, '', _outUrl);
                history.pushState(navState, '', targetUrl);
                window.scrollTo(0, 0);
            } else {
                history.replaceState(navState, '', targetUrl);
            }
        } catch { /* ignore */ }
    }
    const bodyEl = buildStudyScaffold(type);

    // Cache hit → render immediately (instant Back / scope re-toggle, no refetch).
    const cached = studyResultCache.get(studyCacheKey(type, query, version));
    if (cached) {
        renderStudyResults(type, cached, query, version);
        return;
    }

    const countEl = resultsWrapper.querySelector('.search-result-count');
    if (countEl) countEl.textContent = t('searchResults.studyLoading');
    bodyEl.innerHTML = `<div class="study-loading">${escHtml(t('searchResults.studyLoading'))}</div>`;

    let data;
    try {
        const resp = await fetch(`/api/search/${_STUDY_ENDPOINT[type]}?q=${encodeURIComponent(query)}&version=${encodeURIComponent(version)}`);
        data = await resp.json();
    } catch (err) {
        const body = resultsWrapper.querySelector('#studyResults');
        if (body) body.innerHTML = errorCardHtml(t('loading.errorGeneric'), t('loading.errorBody'));
        return;
    }
    // The user may have moved on (new search / scope switch) while we awaited.
    if (currentView !== 'study_search' || studySearchType !== type) return;
    studyResultCache.set(studyCacheKey(type, query, version), data);
    renderStudyResults(type, data, query, version);
}

function animateGroupItem(itemsEl, open) {
    if (open) {
        itemsEl.classList.add('open');
        itemsEl.style.height = itemsEl.scrollHeight + 'px';
        const onEnd = (e) => {
            if (e.propertyName !== 'height' || e.target !== itemsEl) return;
            itemsEl.removeEventListener('transitionend', onEnd);
            if (itemsEl.classList.contains('open')) itemsEl.style.height = 'auto';
        };
        itemsEl.addEventListener('transitionend', onEnd);
    } else {
        itemsEl.style.height = itemsEl.offsetHeight + 'px';
        itemsEl.offsetHeight; // force reflow before changing target
        itemsEl.classList.remove('open');
        itemsEl.style.height = '0';
    }
}

// Called after DOM re-renders to give already-open groups an explicit height.
// Also materializes any pending groups that have been marked open.
function fixOpenGroupHeights() {
    const hlQuery = stripScopePrefix(lastTextSearchQuery);
    const lang = versionLang(versionSelect.value);
    resultsWrapper.querySelectorAll('.book-group-items.open').forEach(el => {
        if (el.dataset.pending) {
            const bookCode = el.closest('.book-group')?.dataset.book;
            if (bookCode) materializeGroup(el, bookCode, hlQuery, lang);
        }
        if (!el.style.height) el.style.height = 'auto';
    });
}

window.toggleGroup = function(headerEl) {
    const itemsEl = headerEl.nextElementSibling;
    const isOpen = headerEl.classList.contains('open');
    headerEl.classList.toggle('open');
    if (!isOpen && itemsEl.dataset.pending) {
        const bookCode = headerEl.closest('.book-group').dataset.book;
        const hlQuery = stripScopePrefix(lastTextSearchQuery);
        const lang = versionLang(versionSelect.value);
        materializeGroup(itemsEl, bookCode, hlQuery, lang);
    }
    animateGroupItem(itemsEl, !isOpen);
    updateExpandCollapseBtn();
};

window.toggleGroups = function() {
    const headers = [...resultsWrapper.querySelectorAll('.book-group-header')];
    const anyOpen = headers.some(h => h.classList.contains('open'));
    const hlQuery = stripScopePrefix(lastTextSearchQuery);
    const lang = versionLang(versionSelect.value);
    // Skip per-group height animation when toggling many groups at once —
    // measuring scrollHeight + transitioning N panels causes jank.
    const skipAnim = headers.length > 5;
    headers.forEach(h => {
        const itemsEl = h.nextElementSibling;
        if (!anyOpen && itemsEl.dataset.pending) {
            const bookCode = h.closest('.book-group').dataset.book;
            materializeGroup(itemsEl, bookCode, hlQuery, lang);
        }
        h.classList.toggle('open', !anyOpen);
        if (skipAnim) {
            itemsEl.classList.toggle('open', !anyOpen);
            itemsEl.style.height = !anyOpen ? 'auto' : '0';
        } else {
            animateGroupItem(itemsEl, !anyOpen);
        }
    });
    updateExpandCollapseBtn();
};

function updateExpandCollapseBtn() {
    const btn = document.getElementById('expandCollapseBtn');
    if (!btn) return;
    const anyOpen = [...resultsWrapper.querySelectorAll('.book-group-header')].some(h => h.classList.contains('open'));
    btn.textContent = anyOpen ? t('searchResults.collapseAll') : t('searchResults.expandAll');
}

function stripScopePrefix(query) {
    const ql = query.trimStart().toLowerCase();
    for (const g of SEARCH_GROUPS) {
        for (const entry of [g.no, g.en]) {
            if (ql.startsWith(entry.label.toLowerCase())) {
                return query.slice(entry.label.length).trim();
            }
        }
    }
    // book:BOOKNAME prefix
    const bookM = query.match(/^book:\S+\s*/i);
    if (bookM) return query.slice(bookM[0].length).trim();
    // BookName: prefix (last char before colon must be a letter)
    const scopeM = query.match(/^[^\d:][^:]*[a-zA-ZÆØÅæøå]:\s*/);
    if (scopeM) return query.slice(scopeM[0].length).trim();
    return query;
}

function highlightWords(htmlText, query) {
    const WBL = '(?<![a-zA-ZÀ-ɏ0-9_])';
    const WBR = '(?![a-zA-ZÀ-ɏ0-9_])';
    // Quoted phrases → exact word-boundary match
    for (const m of query.matchAll(/"([^"]+)"/g)) {
        const esc = m[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        try {
            htmlText = htmlText.replace(new RegExp(WBL + '(' + esc + ')' + WBR, 'gi'), '<b style="color:var(--highlight)">$1</b>');
        } catch {}
    }
    // Plain words — strip exclusions, quoted pairs, operators, then apply per-wildcard highlighting.
    const q2 = query.replace(/-"[^"]*"/g, '').replace(/"[^"]+"/g, '').replace(/"/g, '').replace(/[|+]/g, ' ');
    for (const w of q2.split(/\s+/)) {
        if (!w || w.startsWith('-')) continue;
        const hasLeading = w.startsWith('*');
        const hasTrailing = w.endsWith('*') && w.length > 1;
        const core = w.replace(/^\*+|\*+$/g, '');
        if (!core) continue;
        const esc = core.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        try {
            const wc = '[a-zA-ZÀ-ɏ0-9_]';
            let pattern;
            if (hasLeading && hasTrailing) {
                // *tro* → whole word containing core as substring
                pattern = new RegExp(WBL + '(' + wc + '*' + esc + wc + '*)' + WBR, 'gi');
            } else {
                // tro, tro*, *tro → whole word starting with core (prefix)
                pattern = new RegExp(WBL + '(' + esc + wc + '*)' + WBR, 'gi');
            }
            htmlText = htmlText.replace(pattern, '<b style="color:var(--highlight)">$1</b>');
        } catch {}
    }
    return htmlText;
}

window.goToVerse = function(ref) {
    if (currentView === 'text_search') {
        const openBooks = [...resultsWrapper.querySelectorAll('.book-group-header.open')]
            .map(h => h.closest('.book-group')?.dataset.book)
            .filter(Boolean);
        const cur = history.state || {};
        try { history.replaceState({ ...cur, savedTextSearch: { openBooks, scrollY: window.scrollY } }, '', window.location.href); } catch {}
    }
    searchInput.value = ref;
    updateSearchHighlight();
    doSearch();
};

// ── All versions text search (no-results fallback) ──
window.searchAllVersionsText = async function(query) {
    currentView = 'text_search_all';
    resultsWrapper.innerHTML = `<div class="empty-state"><h2>${escHtml(t('loading.searchingTitle'))}</h2><p>${escHtml(t('loading.searchingBody', query))}</p></div>`;
    try {
        const resp = await fetch(`/api/all_text_search?q=${encodeURIComponent(query)}`);
        const data = await resp.json();
        if (data.error) { console.error('All versions text search error:', data.error); resultsWrapper.innerHTML = errorCardHtml(t('loading.errorGeneric'), t('loading.errorBody')); return; }
        allVersionsTextCache = { results: data.results, query: data.query };
        renderAllVersionsTextSearch(data.results, data.query);
        try { window.AppSidebar && window.AppSidebar.notifyMainBlockChanged(); } catch {}
    } catch {
        resultsWrapper.innerHTML = errorCardHtml(t('loading.errorGeneric'), t('loading.errorBody'));
    }
};

function renderAllVersionsTextSearch(results, query) {
    setPageTitle(`"${query}"`);
    const versionNames = Object.keys(results);
    if (versionNames.length === 0) {
        resultsWrapper.innerHTML = `<div class="empty-state"><h2>${escHtml(t('searchResults.text.noResults'))}</h2><p>${escHtml(t('searchResults.allVersions.noResultsBody', query))}</p></div>`;
        return;
    }

    let totalCount = 0;
    versionNames.forEach(v => totalCount += results[v].length);

    const rPlural = totalCount !== 1, vPlural = versionNames.length !== 1;
    const countKey = !rPlural && !vPlural ? 'searchResults.allVersionsCountSingular'
        : !rPlural && vPlural ? 'searchResults.allVersionsCountVPlural'
        : rPlural && !vPlural ? 'searchResults.allVersionsCountRPlural'
        : 'searchResults.allVersionsCountAllPlural';
    let html = `<div class="search-controls">
        <div class="search-result-count">${escHtml(t(countKey, totalCount, versionNames.length, query))}</div>
    </div>`;

    versionNames.forEach(vName => {
        const vResults = results[vName];
        if (vResults.length === 0) return;
        const lang = versionLang(vName);

        html += `<div class="book-group">
            <div class="book-group-header" onclick="toggleGroup(this)">
                <span>${escHtml(versionLabel(vName))}<span class="book-group-count">(${vResults.length})</span></span>
                <svg class="chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M4 2L8 6L4 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="book-group-items">`;

        vResults.forEach(r => {
            const ref = translateLabel(r.ref, r.book, lang);
            html += `<div class="search-result-item" onclick="goToVerseInVersion('${escAttr(r.ref)}', '${escAttr(vName)}')">
                <div class="search-result-ref">${escHtml(ref)}</div>
                <div class="search-result-text">${highlightWords(escHtml(r.text), query)}</div>
            </div>`;
        });

        html += `</div></div>`;
    });

    resultsWrapper.innerHTML = html;
}

window.goToVerseInVersion = function(ref, version) {
    if (allVersionsList.some(v => String(v.id) === version)) {
        versionSelect.value = version;
        updateVersionPickerDisplay();
    }
    searchInput.value = ref;
    updateSearchHighlight();
    doSearch();
};

// ── Study tray (session-global open/closed state) ──
function applyStudyTrayState() {
    const open = studyTrayOpen;
    document.querySelectorAll('.study-tray').forEach(tray => {
        tray.dataset.open = open ? 'true' : 'false';
    });
    document.querySelectorAll('.study-toggle').forEach(btn => {
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.classList.toggle('open', open);
    });
}

function ensureStudyTrayOpen(_idx) {
    studyTrayOpen = true;
    applyStudyTrayState();
}

window.toggleStudyTray = function(_idx) {
    studyTrayOpen = !studyTrayOpen;
    applyStudyTrayState();
};

// ── Re-render a single card in place (without re-running search) ──
function rerenderCard(idx) {
    if (!mainData || !mainData[idx]) return;
    const card = document.getElementById(`card-${idx}`);
    if (!card) { renderAll(); return; }
    const wrap = card.closest('.card-swipe-wrap');
    const topEl = wrap || card;
    const showNums = toggleVerseNums.checked;
    const showNewlines = toggleNewlines.checked;
    const showHeadings = toggleHeadings.checked;
    const mainLang = (typeof versionLang === 'function') ? versionLang(versionSelect.value) : '';
    const tmp = document.createElement('div');
    tmp.innerHTML = buildCardHtml(mainData[idx], idx, showNums, showNewlines, showHeadings, mainLang, versionSelect.value);
    const newTop = tmp.querySelector('.card-swipe-wrap') || tmp.querySelector('.verse-card');
    const newExpand = tmp.querySelector(`.chapter-expand-bar[data-card-idx="${idx}"]`);
    if (!newTop) return;
    const oldExpand = (topEl.nextElementSibling && topEl.nextElementSibling.classList &&
        topEl.nextElementSibling.classList.contains('chapter-expand-bar') &&
        topEl.nextElementSibling.dataset.cardIdx === String(idx))
        ? topEl.nextElementSibling : null;

    // Preserve side-nav buttons across re-renders so :hover state doesn't flicker when
    // user clicks an arrow (the wrap would otherwise be replaced under the cursor).
    const oldHasWrap = wrap && wrap.classList && wrap.classList.contains('card-swipe-wrap');
    const newIsWrap = newTop.classList && newTop.classList.contains('card-swipe-wrap');
    if (oldHasWrap && newIsWrap) {
        const newCard = newTop.querySelector('.verse-card');
        if (newCard) {
            ['side-nav-prev', 'side-nav-next'].forEach(cls => {
                const oldBtn = wrap.querySelector('.' + cls);
                const newBtn = newTop.querySelector('.' + cls);
                if (!oldBtn || !newBtn) return;
                oldBtn.setAttribute('data-disabled', newBtn.getAttribute('data-disabled') || '0');
                const oc = newBtn.getAttribute('onclick');
                if (oc) oldBtn.setAttribute('onclick', oc);
                else oldBtn.removeAttribute('onclick');
                const titleAttr = newBtn.getAttribute('title');
                if (titleAttr != null) oldBtn.setAttribute('title', titleAttr);
            });
            card.replaceWith(newCard);
            if (newExpand) {
                if (oldExpand) oldExpand.replaceWith(newExpand);
                else wrap.parentElement.insertBefore(newExpand, wrap.nextSibling);
            } else if (oldExpand) {
                oldExpand.remove();
            }
            if (cardCompare[idx] && cardCompare[idx].visible) {
                try { renderCompareBody(idx); } catch {}
            }
            if (typeof updateWideMode === 'function') updateWideMode();
            return;
        }
    }
    topEl.replaceWith(newTop);
    if (newExpand) {
        if (oldExpand) oldExpand.replaceWith(newExpand);
        else newTop.parentElement.insertBefore(newExpand, newTop.nextSibling);
    } else if (oldExpand) {
        oldExpand.remove();
    }
    // Restore compare body if this card had compare visible
    if (cardCompare[idx] && cardCompare[idx].visible) {
        try { renderCompareBody(idx); } catch {}
    }
    if (typeof updateWideMode === 'function') updateWideMode();
    try { refreshModuleActiveDom(); } catch {}
}

// ── Chapter expand/collapse (per-card V-arrow) ──
window.toggleChapterExpand = async function(idx) {
    if (!mainData || !mainData[idx]) return;
    const block = mainData[idx];
    const expandState = cardExpandedState[idx];

    // Navigation/scope change — drop any marked verses so MVB doesn't linger over re-rendered DOM.
    clearAllMarkedVerses();

    if (expandState && expandState.originalBlock) {
        // Collapse back to original verses — animate out, then re-render.
        mainData[idx] = expandState.originalBlock;
        delete cardExpandedState[idx];
        if (cardCompare[idx]) { cardCompare[idx].data = null; cardCompare[idx].allData = null; }
        await animateCardHeightChange(idx);
        try { updateUrlFromCards(); } catch {}
        if (idx === 0) {
            try { window.AppSidebar && window.AppSidebar.notifyMainBlockChanged(); } catch {}
        }
        const _csc = cardCompare[idx];
        if (_csc && _csc.visible) {
            if (_csc.mode === 'all') await loadCardCompareAllData(idx);
            else await loadCardCompareData(idx);
            renderCompareBody(idx);
        }
        return;
    }

    // Expand: fetch full chapter for this block and replace
    if (!block.book || !block.verses || block.verses.length === 0) return;
    const ch = block.verses[0].chapter;
    const bName = bookRefName(block.book);
    const ver = versionSelect.value;
    const ref = `${bName} ${ch}`;
    try {
        const resp = await fetch(`/api/search?q=${encodeURIComponent(ref)}&version=${encodeURIComponent(ver)}`);
        const data = await resp.json();
        const newBlock = (data && data.results && data.results[0]) || null;
        if (!newBlock) return;
        cardExpandedState[idx] = { originalBlock: block };
        const verseKeys = new Set(block.verses.map(v => `${v.chapter}:${v.num}`));
        mainData[idx] = newBlock;
        if (cardCompare[idx]) { cardCompare[idx].data = null; cardCompare[idx].allData = null; }
        // Kick off the height animation; rerenderCard runs synchronously inside
        // it, so the new chapter DOM is already in place. Apply the flash now
        // (instant visual feedback) but defer scrollIntoView until the animation
        // settles — otherwise the still-clipped/animating max-height makes the
        // scroll target a moving target and smooth-scroll lands in the wrong spot.
        const animPromise = animateCardHeightChange(idx);
        const card = document.getElementById(`card-${idx}`);
        let firstLine = null;
        if (card) {
            const lines = card.querySelectorAll('.verse-line');
            lines.forEach(line => {
                const tc = line.querySelector('.verse-text-clickable');
                if (!tc) return;
                if (verseKeys.has(`${tc.dataset.chapter}:${tc.dataset.verse}`)) {
                    if (!firstLine) firstLine = line;
                    line.classList.add('topic-trigger-flash');
                    setTimeout(() => line.classList.remove('topic-trigger-flash'), 3000);
                }
            });
        }
        await animPromise;
        if (firstLine) firstLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
        try { updateUrlFromCards(); } catch {}
        if (idx === 0) {
            try { window.AppSidebar && window.AppSidebar.notifyMainBlockChanged(); } catch {}
        }
        const _cse = cardCompare[idx];
        if (_cse && _cse.visible) {
            if (_cse.mode === 'all') await loadCardCompareAllData(idx);
            else await loadCardCompareData(idx);
            renderCompareBody(idx);
        }
    } catch {}
};

// Height-based expand/collapse animation used by chapter expand/collapse.
// Captures the old body height, re-renders, then animates max-height from old → new.
// Returns a Promise that resolves when the height animation has fully settled.
function animateCardHeightChange(idx) {
    return new Promise(resolve => {
        const card = document.getElementById(`card-${idx}`);
        if (!card) { rerenderCard(idx); resolve(); return; }
        const oldBody = card.querySelector('.verse-card-body');
        const oldHeight = oldBody ? oldBody.scrollHeight : card.scrollHeight;

        rerenderCard(idx);

        const newCard = document.getElementById(`card-${idx}`);
        const newBody = newCard && newCard.querySelector('.verse-card-body');
        if (!newBody) { resolve(); return; }

        // Measure target height with content fully laid out.
        newBody.style.maxHeight = '';
        newBody.style.overflow = '';
        const targetHeight = newBody.scrollHeight;

        // Animate height change.
        // EXPAND (small→large): constrain with maxHeight at old size, animate up.
        // COLLAPSE (large→small): new content is already small, so maxHeight alone doesn't
        //   create a visual starting state. Force the body to hold the old (large) height
        //   using minHeight, then animate both minHeight and maxHeight down to targetHeight.
        const isCollapse = oldHeight > targetHeight;
        const animProp = isCollapse ? 'min-height' : 'max-height';

        newBody.style.transition = 'none';
        newBody.style.overflow = 'hidden';
        newBody.style.maxHeight = oldHeight + 'px';
        if (isCollapse) newBody.style.minHeight = oldHeight + 'px';
        void newBody.offsetHeight; // force initial layout

        let done = false;
        const cleanup = () => {
            if (done) return;
            done = true;
            if (newBody) {
                newBody.style.transition = '';
                newBody.style.maxHeight = '';
                newBody.style.minHeight = '';
                newBody.style.overflow = '';
                newBody.removeEventListener('transitionend', onEnd);
            }
            resolve();
        };
        const onEnd = (e) => { if (e.propertyName === animProp) cleanup(); };
        newBody.addEventListener('transitionend', onEnd);
        setTimeout(cleanup, 450); // safety

        requestAnimationFrame(() => {
            const easing = 'cubic-bezier(0.2, 0.8, 0.3, 1)';
            if (isCollapse) {
                newBody.style.transition = `min-height 0.32s ${easing}, max-height 0.32s ${easing}`;
                newBody.style.minHeight = targetHeight + 'px';
            } else {
                newBody.style.transition = `max-height 0.32s ${easing}`;
            }
            newBody.style.maxHeight = targetHeight + 'px';
        });
    });
}
window.clearHighlightAndMarked = function() {
    clearAllMarkedVerses();
};

window.readChapter = async function(bookCode, chapter, bName, highlightKeys) {
    searchInput.value = `${bName} ${chapter}`;
    updateSearchHighlight();
    await doSearch();
    updateMarkedVersesBar();
    if (highlightKeys) {
        const keys = new Set(highlightKeys.split(','));
        requestAnimationFrame(() => {
            const lines = resultsWrapper.querySelectorAll('.verse-line');
            let firstLine = null;
            lines.forEach(line => {
                const tc = line.querySelector('.verse-text-clickable');
                if (!tc) return;
                if (keys.has(`${tc.dataset.chapter}:${tc.dataset.verse}`)) {
                    if (!firstLine) firstLine = line;
                    line.classList.add('topic-trigger-flash');
                    setTimeout(() => line.classList.remove('topic-trigger-flash'), 3000);
                }
            });
            if (firstLine) firstLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
};

// ── All versions (reference) ──
async function executeAllVersions(label) {
    currentView = 'all_versions';
    // Snapshot for history: stamp the leaving entry's scroll, then push a fresh
    // entry below (only on fresh entry, see below) so Back returns to it.
    const _outScrollY = window.scrollY;
    const _outUrl = window.location.pathname + window.location.search;
    const _outState = history.state;
    const _ver = versionSelect.value;
    try {
        const resp = await fetch(`/api/all_versions?q=${encodeURIComponent(label)}`);
        const data = await resp.json();
        if (data.error) { console.error('All versions error:', data.error); resultsWrapper.innerHTML = errorCardHtml(t('loading.errorGeneric'), t('loading.errorBody')); return; }
        renderAllVersions(data.results, label);
        // Search view → sidebar modules clear stale per-text content.
        try { window.AppSidebar && window.AppSidebar.notifyMainBlockChanged(); } catch {}
        // Create a real history entry only on fresh entry — not when this call
        // came from Back/Forward or a reload (the URL already matches the
        // target), so Back returns to the reference we came from.
        try {
            const targetUrl = buildURL(label, _ver, 'allversions');
            if (_outUrl !== targetUrl) {
                history.replaceState({ ...(_outState || {}), scrollY: _outScrollY }, '', _outUrl);
                history.pushState({ q: label, version: _ver, mode: 'allversions' }, '', targetUrl);
                window.scrollTo(0, 0);
            }
        } catch {}
    } catch { resultsWrapper.innerHTML = errorCardHtml(t('loading.errorGeneric'), t('allVersions.failed')); }
}

// ── Modal ↔ history integration ──────────────────────────────────────────────
// Make the browser Back button close an open modal (help / settings / stats /
// feedback / map) instead of navigating the page away. Centralised via a
// MutationObserver so every open/close path (X button, overlay click, Escape,
// programmatic) is covered without touching each call site.
(function () {
    const MODAL_IDS = ['helpModal', 'settingsModal', 'statsModal', 'feedbackModal', 'mapModal'];
    let suppress = false; // true while we mutate history ourselves

    function anyModalOpen() {
        return MODAL_IDS.some(id => {
            const el = document.getElementById(id);
            return el && el.classList.contains('open');
        });
    }
    function closeAllModals() {
        MODAL_IDS.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('open');
        });
    }
    function onModalToggled(isOpen) {
        if (isOpen) {
            // Opened: push a throwaway entry so Back pops back to the page
            // (don't double-push if we're already sitting on a modal entry).
            if (history.state && history.state.modal) return;
            suppress = true;
            try { history.pushState({ ...(history.state || {}), modal: true }, '', location.href); } catch {}
            suppress = false;
        } else if (history.state && history.state.modal && !anyModalOpen()) {
            // Closed by something other than Back (X / overlay / Escape):
            // pop the modal entry we pushed so history stays balanced. The
            // popstate handler below swallows the navigation for this step.
            suppress = true;
            history.back();
        }
    }
    const obs = new MutationObserver(muts => {
        for (const m of muts) {
            if (m.attributeName !== 'class') continue;
            const el = m.target;
            const isOpen = el.classList.contains('open');
            if (isOpen !== (el.__wasOpen === true)) {
                el.__wasOpen = isOpen;
                onModalToggled(isOpen);
            }
        }
    });
    function attach() {
        MODAL_IDS.forEach(id => {
            const el = document.getElementById(id);
            if (el && !el.__modalHistObserved) {
                el.__modalHistObserved = true;
                el.__wasOpen = el.classList.contains('open');
                obs.observe(el, { attributes: true, attributeFilter: ['class'] });
            }
        });
    }
    attach();
    // Some modals (map / stats) may be created lazily — re-attach cheaply.
    document.addEventListener('click', attach, true);

    // The main popstate navigation handler calls this FIRST so a modal open/close
    // never falls through to a search re-run. Returns true when the pop was
    // modal-related (suppressed programmatic close, or a real Back that should
    // just close the open modal) and has been handled here.
    function handleModalPop() {
        if (suppress) { suppress = false; return true; }
        if (anyModalOpen()) { closeAllModals(); return true; }
        return false;
    }
    window.__handleModalPop = handleModalPop;
    // Backstop in capture phase in case the main handler isn't installed yet.
    window.addEventListener('popstate', e => {
        if (suppress) { suppress = false; e.stopImmediatePropagation(); return; }
        if (anyModalOpen()) { closeAllModals(); e.stopImmediatePropagation(); }
    }, true);
}());

function renderAllVersions(allResults, label) {
    setPageTitle(label);
    allVersionsCache = { results: allResults, label };
    const showNums = toggleVerseNums.checked;
    const showNewlines = toggleNewlines.checked;
    const showHeadings = toggleHeadings.checked;
    const firstBlocks = Object.values(allResults)[0] || [];
    const bCode = firstBlocks[0]?.book;
    const mainLang = versionLang(versionSelect.value);
    const displayLabel = bCode ? translateLabel(label, bCode, mainLang) : label;

    let html = `<div class="search-controls">
        <div class="search-result-count"></div>
    </div>
    <div class="all-versions-block">
        <div class="verse-card-header" style="border-bottom:none;padding-bottom:0;margin-bottom:8px;">
            <span class="verse-card-label">${escHtml(displayLabel)}</span>
        </div>
        <div class="all-versions-grid">`;
    const orderedEntries = allVersionsList
        .map(v => [String(v.id), allResults[String(v.id)]])
        .filter(([, b]) => b !== undefined);
    const knownIds = new Set(orderedEntries.map(([id]) => id));
    const extraEntries = Object.entries(allResults).filter(([id]) => !knownIds.has(id));
    for (const [versionName, blocks] of [...orderedEntries, ...extraEntries]) {
        const verses = blocks.flatMap(b => b.verses || []);
        if (verses.length === 0) continue;
        const headings = blocks.flatMap(b => b.headings || []);
        const blockFootnotes = blocks.flatMap(b => b.footnotes || []);
        const vLang = versionLang(versionName);
        html += `<div class="av-column">
            <div class="version-label">${escHtml(versionLabel(versionName))}</div>
            <div class="verse-text">${renderVerseTextHtml(verses, showNums, showNewlines, showHeadings, bCode, vLang, versionName, headings, blockFootnotes)}</div>
        </div>`;
    }
    html += '</div></div>';
    resultsWrapper.innerHTML = html;
    if (typeof updateWideMode === 'function') updateWideMode();
}

// ── Copy ──
window.copyBlock = function(blockIdx) {
    if (!mainData || !mainData[blockIdx]) return;
    const block = mainData[blockIdx];
    const ver = versionSelect.value;
    const lang = versionLang(ver);
    const text = block.verses.map(v => v.text).join(' ').trim();
    const label = translateLabel(block.label, block.book, lang);
    const full = `${text}\n\n${label} ${versionLabel(ver)}`;
    if (!navigator.clipboard) { showToast(t('toast.clipboardUnavailable')); return; }
    navigator.clipboard.writeText(full).then(() => showToast(t('toast.copied'))).catch(() => showToast(t('toast.copyFailed')));
};

function _blockPinSpec(blockIdx) {
    const block = mainData && mainData[blockIdx];
    if (!block || !block.book || !block.verses || !block.verses.length) return null;
    const first = block.verses[0];
    const last = block.verses[block.verses.length - 1];
    const ver = versionSelect ? versionSelect.value : '';
    const lang = versionLang(ver);
    return {
        book: block.book,
        ch_start: first.chapter, vs_start: first.num,
        ch_end: last.chapter, vs_end: last.num,
        version: ver,
        label: translateLabel(block.label, block.book, lang),
        text: block.verses.map(v => v.text).join(' ').trim(),
        ts: Date.now(),
    };
}

window.pinBlock = function(blockIdx) {
    if (!window.PinnedVerses) return;
    const spec = _blockPinSpec(blockIdx);
    if (!spec) return;
    if (window.PinnedVerses.isPinned(spec)) window.PinnedVerses.remove(spec);
    else window.PinnedVerses.add(spec);
    refreshBlockPinButtons();
};

window.shareBlock = function(blockIdx) {
    const block = mainData && mainData[blockIdx];
    if (!block || !block.book || !block.verses || !block.verses.length) return;
    const bName = bookRefName(block.book);
    const ch = block.verses[0].chapter;
    let ref;
    if (block.is_chapter) ref = fmtVerseRef(block.book, bName, ch);
    else {
        const first = block.verses[0].num;
        const last = block.verses[block.verses.length - 1].num;
        ref = fmtVerseRef(block.book, bName, ch, first, last);
    }
    const ver = versionSelect ? versionSelect.value : '';
    const url = `${window.location.origin}${buildURL(ref, ver, 'normal', block)}`;
    if (navigator.share) {
        navigator.share({ title: ref, text: ref, url }).catch(() => {
            navigator.clipboard.writeText(url).then(() => showToast(t('toast.linkCopied'))).catch(() => showToast(t('toast.copyFailed')));
        });
        return;
    }
    navigator.clipboard.writeText(url).then(() => showToast(t('toast.linkCopied'))).catch(() => showToast(t('toast.copyFailed')));
};

function refreshBlockPinButtons() {
    if (!window.PinnedVerses || !mainData) return;
    document.querySelectorAll('.block-pin-btn').forEach(btn => {
        const idx = Number(btn.dataset.cardIdx);
        const spec = _blockPinSpec(idx);
        const pinned = !!(spec && window.PinnedVerses.isPinned(spec));
        btn.classList.toggle('pinned', pinned);
    });
}
window.refreshBlockPinButtons = refreshBlockPinButtons;

// ── Empty state verse link ──
window.goToEmptyVerse = function() {
    const query = '2. Timoteus 3:16-17';
    searchInput.value = query;
    updateSearchHighlight();
    doSearch();
};

// ── Home ──
window.goHome = function(pushHistory = true) {
    lastQuery = '';
    mainData = null;
    currentView = 'normal';
    textSearchCache = null;
    allVersionsCache = null;
    allVersionsTextCache = null;
    currentChapterInfo = null;
    clearAllMarkedVerses();
    Object.keys(cardCompare).forEach(k => delete cardCompare[k]);
    // Empty state should leave no overlays behind — close any open module
    // host (mobile) and sidebar (PC), which also clears each module's data.
    if (window.AppModuleHost && window.AppModuleHost.isOpen()) window.AppModuleHost.closeModule();
    if (window.AppSidebar && window.AppSidebar.isOpen && window.AppSidebar.isOpen()) window.AppSidebar.close();
    searchInput.value = '';
    updateSearchHighlight();
    setPageTitle(null);
    resultsWrapper.innerHTML = emptyStateHtml;
    if (typeof updateWideMode === 'function') updateWideMode();
    if (typeof updateToolbarCompareBtn === 'function') updateToolbarCompareBtn();
    applyI18n();
    if (pushHistory) history.pushState({}, '', '/');
};

// ── Search clear button ──
const searchClearBtn = document.getElementById('searchClearBtn');
searchClearBtn.addEventListener('click', () => {
    searchInput.value = '';
    updateSearchHighlight();
    closeAutocomplete();
    if (quickMode) {
        if (_quickAbortCtrl) _quickAbortCtrl.abort();
        renderQuickHint();
    }
    searchInput.focus();
});

// ── Search input highlighting ──
function updateSearchHighlight() {
    const raw = searchInput.value;
    searchInput.closest('.search-wrap').classList.toggle('has-value', !!raw);
    if (!raw) {
        searchHighlightContent.innerHTML = '';
        searchHighlightContent.style.transform = '';
        return;
    }
    searchHighlightContent.innerHTML = highlightQuery(raw);
    // Sync horizontal scroll: translateX the inner span to follow input scrollLeft
    searchHighlightContent.style.transform = `translateX(${-searchInput.scrollLeft}px)`;
}

// Fast HTML escape that avoids DOM creation (used inside the hot highlight loop)
function escHtmlFast(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightQuery(text) {
    // Split on semicolons, preserving them as tokens
    const parts = text.split(/(;)/);
    return parts.map(part => part === ';' ? `<span class="qs">;</span>` : highlightSegment(part)).join('');
}

function highlightSegment(text) {
    let result = '';
    let i = 0;

    // Scope prefix: "letters_ending_in_letter:" at segment start.
    // Last char before ":" must be a letter, which distinguishes "GT:" from "Joh 3:" (ends in digit).
    const scopeMatch = text.match(/^((?:[A-ZÆØÅa-zæøå0-9. ]*?)?[A-ZÆØÅa-zæøå]:)/);
    if (scopeMatch) {
        result += `<span class="qs">${escHtmlFast(scopeMatch[1])}</span>`;
        i = scopeMatch[1].length;
    }

    while (i < text.length) {
        const ch = text[i];

        if (ch === '"') {
            // Color both opening and closing quote; content inside is plain
            const end = text.indexOf('"', i + 1);
            if (end !== -1) {
                result += `<span class="qs">"</span>${escHtmlFast(text.slice(i + 1, end))}<span class="qs">"</span>`;
                i = end + 1;
            } else {
                // Unclosed quote: color just the opening
                result += `<span class="qs">"</span>`;
                i++;
            }
        } else if (ch === '-' && i + 1 < text.length && /[a-zA-ZÆØÅæøå"]/.test(text[i + 1])) {
            // Exclusion dash — only highlight when followed by a letter, not a digit (verse ranges like 3:16-17)
            result += `<span class="qs">-</span>`;
            i++;
        } else if (ch === '|' || ch === '+') {
            result += `<span class="qs">${escHtmlFast(ch)}</span>`;
            i++;
        } else if (ch === '*') {
            // Only highlight * when it's the *word* substring pattern; trailing/leading-only * is plain.
            const nextIsLetter = i + 1 < text.length && /[a-zA-ZÀ-ɏæøåÆØÅ]/.test(text[i + 1]);
            if (nextIsLetter) {
                let j = i + 1;
                while (j < text.length && /[a-zA-ZÀ-ɏæøåÆØÅ0-9_]/.test(text[j])) j++;
                if (j < text.length && text[j] === '*') {
                    // *word* — highlight both stars, word stays plain
                    result += `<span class="qs">*</span>${escHtmlFast(text.slice(i + 1, j))}<span class="qs">*</span>`;
                    i = j + 1;
                } else {
                    // *word without closing * — treat * as plain
                    result += escHtmlFast('*');
                    i++;
                }
            } else {
                // Trailing * or lone * — plain
                result += escHtmlFast('*');
                i++;
            }
        } else {
            // Collect a run of plain characters to minimize span count
            let j = i + 1;
            while (j < text.length) {
                const c = text[j];
                if (c === '"' || c === ';' || c === '|' || c === '+' || c === '*') break;
                if (c === '-' && j + 1 < text.length && text[j + 1] !== ' ') break;
                j++;
            }
            result += escHtmlFast(text.slice(i, j));
            i = j;
        }
    }
    return result;
}

// ── Help & info (single-tab modal) ──
window.openHelp = function() {
    document.getElementById('helpModal').classList.add('open');
};
document.getElementById('helpToggle').addEventListener('click', () => document.getElementById('helpModal').classList.toggle('open'));
document.getElementById('helpClose').addEventListener('click', () => document.getElementById('helpModal').classList.remove('open'));
document.getElementById('helpModal').addEventListener('click', e => {
    if (e.target === document.getElementById('helpModal')) document.getElementById('helpModal').classList.remove('open');
});
// Restart welcome tour from help
document.addEventListener('click', e => {
    if (e.target && e.target.id === 'restartTourBtn') {
        document.getElementById('helpModal').classList.remove('open');
        if (window.WelcomeTour) window.WelcomeTour.start({ force: true });
    }
});

// ── Settings ──
window.openSettings = function() { document.getElementById('settingsModal').classList.add('open'); };
document.getElementById('settingsToggle').addEventListener('click', () => document.getElementById('settingsModal').classList.toggle('open'));
document.getElementById('settingsClose').addEventListener('click', () => document.getElementById('settingsModal').classList.remove('open'));
document.getElementById('settingsModal').addEventListener('click', e => {
    if (e.target === document.getElementById('settingsModal')) document.getElementById('settingsModal').classList.remove('open');
});

// ── Quick search mode ──
let quickMode = localStorage.getItem('quickMode') === 'true';
let _quickDebounceTimer = null;
let _quickAbortCtrl = null;
let _viewBeforeQuick = null;
const quickModeBtn = document.getElementById('quickModeBtn');

function setQuickModeBtnState() {
    quickModeBtn.setAttribute('aria-pressed', quickMode ? 'true' : 'false');
}

function renderQuickHint() {
    resultsWrapper.innerHTML = `<div class="quick-empty">${escHtmlFast(t('quickSearch.hint'))}</div>`;
}

function renderQuickEmpty() {
    resultsWrapper.innerHTML = `<div class="quick-empty">${escHtmlFast(t('quickSearch.none'))}</div>`;
}

function highlightTokens(text, tokens) {
    if (!tokens.length) return escHtmlFast(text);
    const escaped = tokens.map(tok => tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const re = new RegExp(`(${escaped.join('|')})`, 'gi');
    return escHtmlFast(text).replace(re, '<mark>$1</mark>');
}

function renderQuickSearch(data, tokens) {
    const rows = (data.results || []).map(r => `
        <div class="quick-row" data-ref="${escHtmlFast(r.ref)}" data-book="${escHtmlFast(r.book)}" data-chapter="${r.chapter}" data-verse="${r.verse}">
            <span class="qr-ref">${escHtmlFast(translateLabel(r.ref, r.book))}</span>
            <span class="qr-text">${highlightTokens(r.text, tokens)}</span>
        </div>
    `).join('');
    const footer = data.truncated ? `<div class="quick-footer">${escHtmlFast(t('quickSearch.truncated', data.limit || 25))}</div>` : '';
    resultsWrapper.innerHTML = `<div class="quick-results">${rows}${footer}</div>`;
}

resultsWrapper.addEventListener('click', e => {
    const row = e.target.closest('.quick-row');
    if (!row) return;
    const ref = fmtVerseRef(row.dataset.book, bookRefName(row.dataset.book), Number(row.dataset.chapter), Number(row.dataset.verse));
    setQuickMode(false);
    searchInput.value = ref;
    updateSearchHighlight();
    doSearch();
});

function tokenizeQuick(query) {
    const all = (query.toLowerCase().match(/[\wÀ-ÿ]+/gu) || []);
    if (all.length <= 1) return all;
    return all.filter((t, i) => t.length >= 2 || i === all.length - 1);
}

async function runQuickSearch() {
    const raw = searchInput.value.trim();
    if (raw.length < 3) {
        if (_quickAbortCtrl) _quickAbortCtrl.abort();
        renderQuickHint();
        return;
    }
    if (_quickAbortCtrl) _quickAbortCtrl.abort();
    _quickAbortCtrl = new AbortController();
    const version = versionSelect.value;
    try {
        const resp = await fetch(`/api/quick_search?q=${encodeURIComponent(raw)}&version=${encodeURIComponent(version)}`, { signal: _quickAbortCtrl.signal });
        const data = await resp.json();
        const tokens = tokenizeQuick(raw);
        if (!data.results || data.results.length === 0) {
            renderQuickEmpty();
        } else {
            renderQuickSearch(data, tokens);
        }
    } catch (err) {
        if (err.name === 'AbortError') return;
        // Silent fail — keep prior results visible
    }
}

function setQuickMode(on) {
    if (on === quickMode) return;
    quickMode = on;
    localStorage.setItem('quickMode', on ? 'true' : 'false');
    setQuickModeBtnState();
    if (on) {
        _viewBeforeQuick = currentView;
        closeAutocomplete();
        clearSearchWarning && clearSearchWarning();
        currentView = 'quick_search';
        if (searchInput.value.trim().length >= 3) {
            runQuickSearch();
        } else {
            renderQuickHint();
        }
        searchInput.focus();
    } else {
        if (_quickAbortCtrl) _quickAbortCtrl.abort();
        clearTimeout(_quickDebounceTimer);
        // Restore the view we were on before quick mode was enabled.
        // _viewBeforeQuick may be null (quickMode persisted from localStorage on page load
        // without ever passing through setQuickMode(true)) — fall through to whatever cache
        // we have rather than wiping the screen.
        let target = _viewBeforeQuick;
        if (!target || target === 'quick_search') {
            if (mainData) target = 'normal';
            else if (textSearchCache) target = 'text_search';
            else if (allVersionsCache) target = 'all_versions';
            else if (allVersionsTextCache) target = 'text_search_all';
            else target = 'normal';
        }
        currentView = target;
        if (target === 'normal' && mainData) {
            renderAll();
        } else if (target === 'all_versions' && allVersionsCache) {
            renderAllVersions(allVersionsCache.results, allVersionsCache.label);
        } else if (target === 'text_search' && textSearchCache) {
            renderTextSearch(textSearchCache.results, textSearchCache.query, textSearchCache.bookTotals || {});
        } else if (target === 'text_search_all' && allVersionsTextCache) {
            renderAllVersionsTextSearch(allVersionsTextCache.results, allVersionsTextCache.query);
        } else {
            currentView = 'normal';
            mainData = null;
            resultsWrapper.innerHTML = emptyStateHtml;
            applyI18n();
        }
    }
}

quickModeBtn.addEventListener('click', () => setQuickMode(!quickMode));
setQuickModeBtnState();

// ── Toolbar + MVB compare buttons (synced) ──
const toolbarCompareBtn = document.getElementById('toolbarCompareBtn');
function updateToolbarCompareBtn() {
    const pressed = compareIntent ? 'true' : 'false';
    if (toolbarCompareBtn) toolbarCompareBtn.setAttribute('aria-pressed', pressed);
}
function _toggleCompareAllCards() {
    if (compareIntent) {
        compareIntent = false;
        if (mainData) mainData.forEach((_, idx) => { if (cardCompare[idx] && cardCompare[idx].visible) toggleCardCompare(idx); });
    } else {
        compareIntent = true;
        if (mainData) mainData.forEach((_, idx) => toggleCardCompare(idx));
    }
    updateToolbarCompareBtn();
}
if (toolbarCompareBtn) {
    toolbarCompareBtn.addEventListener('click', _toggleCompareAllCards);
}
if (quickMode && searchInput.value.trim().length >= 3) {
    // Trigger initial quick search if mode persisted with a value (rare)
    runQuickSearch();
}

// ── Autocomplete ──
let acItems = [];
let acSelectedIndex = -1;

let _acDebounceTimer = null;
searchInput.addEventListener('input', () => {
    // Highlight update is cheap — keep it synchronous
    requestAnimationFrame(updateSearchHighlight);
    if (quickMode) {
        clearTimeout(_acDebounceTimer);
        closeAutocomplete();
        clearTimeout(_quickDebounceTimer);
        _quickDebounceTimer = setTimeout(runQuickSearch, 150);
        return;
    }
    // Autocomplete is heavier — debounce to avoid work on every keystroke
    clearTimeout(_acDebounceTimer);
    _acDebounceTimer = setTimeout(handleAutocomplete, 120);
});
searchInput.addEventListener('scroll', updateSearchHighlight);
searchInput.addEventListener('keydown', handleAcKeydown);
document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrap')) closeAutocomplete();
});

function getCurrentToken() {
    const val = searchInput.value;
    const cursor = searchInput.selectionStart || val.length;
    const lastSemi = val.lastIndexOf(';', cursor - 1);
    return val.slice(lastSemi + 1, cursor).trimStart();
}

function handleAutocomplete() {
    const token = getCurrentToken().toLowerCase();
    if (token.length < 1) { closeAutocomplete(); return; }

    // If the token exactly matches a full book name, show only the scoped suggestion.
    // Use trimmed token so a trailing space (e.g. after Tab-completing a book) also triggers this.
    const lang = versionLang(versionSelect.value);
    const exactToken = token.trim();
    const exactBook = exactToken.length > 0 && booksData.find(b => {
        const plural = bookName(b.code, lang).toLowerCase();
        const singular = bookNameSingular(b.code, lang).toLowerCase();
        return plural === exactToken || singular === exactToken;
    });
    if (exactBook) {
        acItems = [{ type: 'scope_book', label: bookName(exactBook.code, lang) + ': ', code: exactBook.code }];
        acSelectedIndex = -1;
        renderAutocomplete();
        return;
    }

    const bookSuggestions = [];
    booksData.forEach(b => {
        const name = (lang === 'en' ? b.name_en : b.name).toLowerCase();
        const code = b.code.toLowerCase();
        const aliasMatch = b.aliases && b.aliases.some(a => a.startsWith(token));
        if (name.startsWith(token) || code === token || aliasMatch) {
            bookSuggestions.push({ type: 'book', label: b.name, labelEn: bookNameSingular(b.code, 'en'), code: b.code });
        }
    });

    if (bookSuggestions.length === 0 && token.length >= 2) {
        booksData.forEach(b => {
            const name = (lang === 'en' ? b.name_en : b.name).toLowerCase();
            const aliasIncludes = b.aliases && b.aliases.some(a => a.includes(token));
            if (name.includes(token) || aliasIncludes) bookSuggestions.push({ type: 'book', label: b.name, labelEn: bookNameSingular(b.code, 'en'), code: b.code });
        });
    }

    const suggestions = [...bookSuggestions];
    SEARCH_GROUPS.forEach(g => {
        const entry = lang === 'en' ? g.en : g.no;
        if (entry.label.toLowerCase().startsWith(token))
            suggestions.push({ type: 'group', label: entry.label, desc: entry.desc });
    });

    acItems = suggestions.slice(0, 8);
    acSelectedIndex = -1;
    renderAutocomplete();
}

function renderAutocomplete() {
    if (acItems.length === 0) { closeAutocomplete(); return; }
    const lang = versionLang(versionSelect.value);
    let html = '';
    acItems.forEach((item, i) => {
        const sel = i === acSelectedIndex ? ' selected' : '';
        if (item.type === 'group') {
            html += `<div class="ac-item${sel}" data-idx="${i}">
                <span>${escHtml(item.label)}</span>
                <span class="ac-badge">${escHtml(t('ac.filter'))}</span>
                <span class="ac-desc">${escHtml(item.desc)}</span>
            </div>`;
        } else if (item.type === 'scope_book') {
            html += `<div class="ac-item${sel}" data-idx="${i}">
                <span>${escHtml(item.label)}</span>
                <span class="ac-badge">${escHtml(t('ac.searchInBook'))}</span>
            </div>`;
        } else {
            const name = lang === 'en' ? item.labelEn : item.label;
            html += `<div class="ac-item${sel}" data-idx="${i}">
                <span>${escHtml(name)}</span>
                <span class="ac-badge">${escHtml(item.code)}</span>
            </div>`;
        }
    });
    autocompleteDropdown.innerHTML = html;
    autocompleteDropdown.classList.add('open');
    autocompleteDropdown.querySelectorAll('.ac-item').forEach(el => {
        el.addEventListener('mousedown', e => { e.preventDefault(); applyAutocomplete(parseInt(el.dataset.idx)); });
    });
}

function handleAcKeydown(e) {
    if (!autocompleteDropdown.classList.contains('open')) {
        if (e.key === 'Tab') {
            e.preventDefault();
            // Second Tab: if current token is exactly a book name, convert to scoped
            const token = getCurrentToken().trim();
            if (token.length > 0) {
                const lang = versionLang(versionSelect.value);
                const matchedBook = booksData.find(b => {
                    const plural = bookName(b.code, lang).toLowerCase();
                    const singular = bookNameSingular(b.code, lang).toLowerCase();
                    return plural === token.toLowerCase() || singular === token.toLowerCase() || b.code.toLowerCase() === token.toLowerCase();
                });
                if (matchedBook) {
                    const displayName = bookName(matchedBook.code, lang);
                    const val = searchInput.value;
                    const cursor = searchInput.selectionStart || val.length;
                    const lastSemi = val.lastIndexOf(';', cursor - 1);
                    const beforeToken = val.slice(0, lastSemi + 1);
                    const afterCursor = val.slice(cursor);
                    const insert = displayName + ': ';
                    const newVal = beforeToken + insert + afterCursor;
                    searchInput.value = newVal;
                    searchInput.setSelectionRange(beforeToken.length + insert.length, beforeToken.length + insert.length);
                    updateSearchHighlight();
                    searchInput.focus();
                }
            }
            return;
        }
        return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); acSelectedIndex = Math.min(acSelectedIndex + 1, acItems.length - 1); renderAutocomplete(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); acSelectedIndex = Math.max(acSelectedIndex - 1, -1); renderAutocomplete(); }
    else if (e.key === 'Tab') { e.preventDefault(); applyAutocomplete(acSelectedIndex >= 0 ? acSelectedIndex : 0); }
    else if (e.key === 'Enter' && acSelectedIndex >= 0) { e.preventDefault(); applyAutocomplete(acSelectedIndex); }
    else if (e.key === 'Escape') closeAutocomplete();
}

function applyAutocomplete(idx) {
    if (idx < 0 || idx >= acItems.length) return;
    const item = acItems[idx];
    const val = searchInput.value;
    const cursor = searchInput.selectionStart || val.length;
    const lastSemi = val.lastIndexOf(';', cursor - 1);
    const beforeToken = val.slice(0, lastSemi + 1);
    const afterCursor = val.slice(cursor);
    const lang = versionLang(versionSelect.value);
    let insert;
    if (item.type === 'group') insert = item.label + ' ';
    else if (item.type === 'scope_book') insert = item.label;
    else insert = (lang === 'en' ? item.labelEn : item.label) + ' ';
    const newVal = beforeToken + insert + afterCursor;
    searchInput.value = newVal;
    searchInput.setSelectionRange(beforeToken.length + insert.length, beforeToken.length + insert.length);
    closeAutocomplete();
    updateSearchHighlight();
    searchInput.focus();
    // After completing a plain book name, immediately show the scoped suggestion
    if (item.type === 'book') handleAutocomplete();
}

function closeAutocomplete() {
    autocompleteDropdown.classList.remove('open');
    acItems = [];
    acSelectedIndex = -1;
}

// ── Font size (5 discrete steps) ──
const fontSizeSlider = document.getElementById('fontSizeSlider');
const savedFontSize = localStorage.getItem('verseFontSize');
if (savedFontSize) { fontSizeSlider.value = savedFontSize; applyFontSize(savedFontSize); }
fontSizeSlider.addEventListener('input', () => {
    applyFontSize(fontSizeSlider.value);
    localStorage.setItem('verseFontSize', fontSizeSlider.value);
});
function applyFontSize(val) {
    const size = FONT_SIZES[parseInt(val)] || '1.1rem';
    document.documentElement.style.setProperty('--verse-font-size', size);
}

// ── Dark mode & accent color ──
const darkToggle = document.getElementById('darkToggle');
const dmLight = document.getElementById('dmLight');
const dmDark = document.getElementById('dmDark');

function _hexToRgb(hex) {
    const h = (hex || '').replace('#', '').trim();
    if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}
function _rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h, s, l };
}
function _hslToHex(h, s, l) {
    let r, g, b;
    if (s === 0) { r = g = b = l; }
    else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1; if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = x => Math.round(Math.max(0, Math.min(1, x)) * 255).toString(16).padStart(2, '0');
    return '#' + toHex(r) + toHex(g) + toHex(b);
}
// Returns '#000' or '#fff' — whichever contrasts better against the given hex background.
function _pencilColor(hex) {
    const rgb = _hexToRgb(hex);
    if (!rgb) return '#ffffff';
    const toLinear = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    const L = 0.2126 * toLinear(rgb.r) + 0.7152 * toLinear(rgb.g) + 0.0722 * toLinear(rgb.b);
    return L > 0.179 ? '#000000' : '#ffffff';
}

// Derive {accent, hover, dim} from a single hex, tuned for light or dark theme.
function deriveAccentFromHex(hex, isDark) {
    const rgb = _hexToRgb(hex);
    if (!rgb) return null;
    const hsl = _rgbToHsl(rgb.r, rgb.g, rgb.b);
    let l = hsl.l;
    if (isDark) {
        // Ensure visible on dark backgrounds: lift dim colors
        if (l < 0.55) l = Math.min(0.72, l + 0.22);
    } else {
        // Avoid washed-out light colors on white backgrounds
        if (l > 0.55) l = Math.max(0.35, l - 0.12);
    }
    const accent = _hslToHex(hsl.h, hsl.s, l);
    const hoverL = Math.max(0, l - (isDark ? 0.06 : 0.08));
    const hover = _hslToHex(hsl.h, hsl.s, hoverL);
    const aRgb = _hexToRgb(accent);
    const dim = `rgba(${aRgb.r},${aRgb.g},${aRgb.b},0.12)`;
    return { accent, hover, dim };
}

function applyAccent(sel) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    let accent, hover, dim;
    if (sel === 'custom') {
        const derived = deriveAccentFromHex(customAccentHex, isDark) || deriveAccentFromHex('#2870e8', isDark);
        accent = derived.accent; hover = derived.hover; dim = derived.dim;
    } else {
        const c = COLOR_PRESETS[sel] || COLOR_PRESETS[0];
        accent = isDark ? c.d : c.l;
        hover  = isDark ? c.dh : c.lh;
        dim    = isDark ? c.dd : c.ld;
    }
    const root = document.documentElement;
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--accent-hover', hover);
    root.style.setProperty('--accent-dim', dim);
    root.style.setProperty('--verse-num', accent);
    document.querySelectorAll('.color-swatch').forEach(sw => {
        const sIdx = sw.dataset.idx;
        const active = (sIdx === 'custom' && sel === 'custom') || (sIdx !== 'custom' && parseInt(sIdx) === sel);
        sw.classList.toggle('active', active);
    });
}

function applyTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    dmLight.classList.toggle('active', !dark);
    dmDark.classList.toggle('active', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    applyAccent(currentAccent);
}


dmLight.addEventListener('click', () => applyTheme(false));
dmDark.addEventListener('click', () => applyTheme(true));
applyTheme(localStorage.getItem('theme') === 'dark');

// ── UI font ──
function applyFontUI(val) {
    document.documentElement.setAttribute('data-font', val);
    localStorage.setItem('fontUI', val);
    document.querySelectorAll('#fontUICtrl .font-ui-btn').forEach(b => b.classList.toggle('active', b.dataset.val === val));
}
document.getElementById('fontUICtrl').addEventListener('click', e => {
    const btn = e.target.closest('.font-ui-btn');
    if (btn) applyFontUI(btn.dataset.val);
});
applyFontUI(localStorage.getItem('fontUI') || 'serif');

applyI18n();

// ── Favorite verses link ──
(function() {
    const link = document.getElementById('favoriteVersesLink');
    const wrap = link && link.closest('p');
    if (!link) return;
    if (!FAVORITE_VERSES.length) { if (wrap) wrap.hidden = true; return; }
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const helpModal = document.getElementById('helpModal');
        if (helpModal) helpModal.classList.remove('open');
        searchInput.value = FAVORITE_VERSES.join('; ');
        updateSearchHighlight();
        doSearch();
    });
})();


// ── Name helpers ──
function bookName(code, lang) {
    if (!code) return '';
    const effectiveLang = lang || versionLang(versionSelect.value);
    if (effectiveLang === 'en' && ENG_NAMES[code]) return ENG_NAMES[code];
    const override = BOOK_DISPLAY_OVERRIDES_NO[code];
    if (override) return override;
    const b = _booksMap.get(code);
    return b ? b.name : code;
}

function bookNameSingular(code, lang) {
    if (!code) return '';
    const effectiveLang = lang || versionLang(versionSelect.value);
    if (effectiveLang === 'en') return BOOK_DISPLAY_OVERRIDES_EN_SINGULAR[code] || ENG_NAMES[code] || code;
    const b = _booksMap.get(code);
    return b ? b.name : code;
}

function bookRefName(code) {
    if (!code) return '';
    const b = _booksMap.get(code);
    return b ? b.name : code;
}

// Books with only one chapter — references drop the chapter and show just the
// verse number (e.g. "Judas 2", not "Judas 1:2").
const SINGLE_CHAPTER_BOOKS = new Set(['OBA', 'PHM', '2JN', '3JN', 'JUD']);
function isSingleChapterBook(code) { return SINGLE_CHAPTER_BOOKS.has(code); }
window.isSingleChapterBook = isSingleChapterBook;

// Build a verse-reference label, collapsing the chapter for single-chapter books.
// `bName` is the already-resolved (and possibly language-swapped) display name;
// pass `vsStart == null` for a whole-book/chapter label.
function fmtVerseRef(bookCode, bName, chapter, vsStart, vsEnd) {
    const single = SINGLE_CHAPTER_BOOKS.has(bookCode);
    if (vsStart == null) return single ? bName : `${bName} ${chapter}`;
    const tail = (vsEnd != null && vsEnd !== vsStart) ? `${vsStart}-${vsEnd}` : `${vsStart}`;
    return single ? `${bName} ${tail}` : `${bName} ${chapter}:${tail}`;
}
window.fmtVerseRef = fmtVerseRef;

window.bookAbbrev = function (code) {
    if (!code) return '';
    const b = _booksMap.get(code);
    return b && b.abbrev_no ? b.abbrev_no : (b ? b.name : code);
};

function translateLabel(label, bookCode, lang) {
    if (!bookCode) return label;
    const effectiveLang = lang || versionLang(versionSelect.value);
    if (effectiveLang === 'no') return label;
    const engName = BOOK_DISPLAY_OVERRIDES_EN_SINGULAR[bookCode] || ENG_NAMES[bookCode];
    if (!engName) return label;
    const b = _booksMap.get(bookCode);
    const norwName = b ? b.name : null;
    if (norwName && label.startsWith(norwName)) return engName + label.slice(norwName.length);
    return label;
}

function maxVerseInChapter(bookCode, chapter) {
    const b = _booksMap.get(bookCode);
    return b && b.verse_counts ? (b.verse_counts[chapter] || 0) : 0;
}

window.goVerse = async function(bookCode, chapter, verse, bName, direction, cardIdx) {
    const maxCh = (_booksMap.get(bookCode) || {}).chapters || 0;
    let targetCh = chapter, targetVerse = verse;
    if (direction === 'prev') {
        if (verse > 1) {
            targetVerse = verse - 1;
        } else if (chapter > 1) {
            targetCh = chapter - 1;
            targetVerse = maxVerseInChapter(bookCode, targetCh) || 1;
        } else {
            return; // at very start
        }
    } else {
        const maxV = maxVerseInChapter(bookCode, chapter);
        if (maxV && verse < maxV) {
            targetVerse = verse + 1;
        } else if (chapter < maxCh) {
            targetCh = chapter + 1;
            targetVerse = 1;
        } else {
            return; // at very end
        }
    }
    const targetRef = fmtVerseRef(bookCode, bName, targetCh, targetVerse);
    if (typeof cardIdx === 'number' && mainData && mainData[cardIdx]) {
        await navigateCardToRef(cardIdx, targetRef, direction, null);
        return;
    }
    await slideTransition(direction, async () => {
        searchInput.value = targetRef;
        updateSearchHighlight();
        await doSearch();
    });
};

// Navigate a single card to a new reference without disturbing other cards.
// Updates URL via history.pushState so back-button + share-link still work.
async function navigateCardToRef(cardIdx, ref, direction) {
    if (!mainData || !mainData[cardIdx]) return;
    // Navigation — drop marked verses so MVB doesn't outlive the verses it points at.
    clearAllMarkedVerses();
    const ver = versionSelect.value;
    // History snapshot: stamp the leaving entry's scroll, then push a new entry
    // below (see updateUrlFromCards) so Back steps through chapter/verse arrows.
    const _outScrollY = window.scrollY;
    const _outUrl = window.location.pathname + window.location.search;
    const _outState = history.state;
    // Kick off the exit animation immediately, in parallel with the fetch,
    // so the card keeps moving instead of pausing while the network resolves.
    const card = document.getElementById(`card-${cardIdx}`);
    const fromSwipe = !!(card && card.classList.contains('swiping'));
    let exitAnimPromise = Promise.resolve();
    if (card && direction) {
        card.classList.remove('swiping');
        const dxOut = fromSwipe
            ? (direction === 'next' ? -(card.offsetWidth + 40) : (card.offsetWidth + 40))
            : (direction === 'next' ? -28 : 28);
        const dur = fromSwipe ? 0.18 : 0.14;
        card.style.transition = `opacity ${dur}s ease, transform ${dur}s ease`;
        // Force a frame so the transition picks up from the current (mid-swipe) transform.
        void card.offsetHeight;
        card.style.opacity = '0';
        card.style.transform = `translateX(${dxOut}px)`;
        exitAnimPromise = new Promise(r => setTimeout(r, fromSwipe ? 190 : 150));
    }
    try {
        const fetchPromise = fetch(`/api/search?q=${encodeURIComponent(ref)}&version=${encodeURIComponent(ver)}`)
            .then(r => r.json());
        const [data] = await Promise.all([fetchPromise, exitAnimPromise]);
        const newBlock = (data && data.results && data.results[0]) || null;
        if (!newBlock) return;
        // If this card had an "expanded chapter" state, drop it (we're navigating elsewhere)
        if (cardExpandedState[cardIdx]) delete cardExpandedState[cardIdx];
        mainData[cardIdx] = newBlock;
        // Reset stale compare data so the new block's reference is fetched after render
        if (cardCompare[cardIdx]) {
            cardCompare[cardIdx].data = null;
            cardCompare[cardIdx].allData = null;
        }
        rerenderCard(cardIdx);
        const newCard = document.getElementById(`card-${cardIdx}`);
        if (newCard && direction) {
            const dxIn = direction === 'next' ? 28 : -28;
            newCard.style.transition = 'none';
            newCard.style.opacity = '0';
            newCard.style.transform = `translateX(${dxIn}px)`;
            void newCard.offsetHeight;
            newCard.style.transition = 'opacity 0.14s ease, transform 0.14s ease';
            newCard.style.opacity = '';
            newCard.style.transform = '';
            setTimeout(() => {
                if (newCard) { newCard.style.transition = ''; }
            }, 200);
        }
        // Push a real history entry so Back/Forward steps through navigation,
        // after stamping the leaving entry with its scroll position.
        try {
            history.replaceState({ ...(_outState || {}), scrollY: _outScrollY }, '', _outUrl);
            updateUrlFromCards(true);
        } catch {}
        if (cardIdx === 0) {
            try { window.AppSidebar && window.AppSidebar.notifyMainBlockChanged(); } catch {}
        }
        // Reload compare data for the new block if compare was visible
        const _cs = cardCompare[cardIdx];
        if (_cs && _cs.visible) {
            if (_cs.mode === 'all') await loadCardCompareAllData(cardIdx);
            else await loadCardCompareData(cardIdx);
            renderCompareBody(cardIdx);
        }
    } catch {}
}

function updateUrlFromCards(push) {
    if (!mainData || mainData.length === 0) return;
    const refs = mainData.map(b => {
        if (!b || !b.book || !b.verses || b.verses.length === 0) return null;
        const bName = bookRefName(b.book);
        const ch = b.verses[0].chapter;
        if (b.is_chapter) return fmtVerseRef(b.book, bName, ch);
        const first = b.verses[0].num;
        const last = b.verses[b.verses.length - 1].num;
        const allSameCh = b.verses.every(v => v.chapter === ch);
        if (!allSameCh) {
            const lastCh = b.verses[b.verses.length - 1].chapter;
            return `${bName} ${ch}:${first}-${lastCh}:${last}`;
        }
        return fmtVerseRef(b.book, bName, ch, first, last);
    }).filter(Boolean);
    if (refs.length === 0) return;
    const composite = refs.join('; ');
    const ver = versionSelect.value;
    // Single card → canonical /bibel/... path. Multi-card composites can't be
    // expressed as path-form, so they stay on /?q= via buildURL fallback.
    const block = mainData.length === 1 ? mainData[0] : null;
    try {
        const url = buildURL(composite, ver, 'normal', block);
        const state = { q: composite, version: ver, mode: 'normal' };
        if (push) history.pushState(state, '', url);
        else history.replaceState(state, '', url);
    } catch {}
}

function interlinearUrl(bookCode, chapter, verseNum) {
    const slug = BIBLEHUB_SLUGS[bookCode];
    if (!slug) return null;
    return verseNum != null
        ? `https://biblehub.com/interlinear/${slug}/${chapter}-${verseNum}.htm`
        : `https://biblehub.com/interlinear/${slug}/${chapter}.htm`;
}

function youversionUrl(bookCode, chapter, verses, versionId, isChapter) {
    if (!bookCode || !versionId) return null;
    const base = `https://www.bible.com/bible/${versionId}/${bookCode}.${chapter}`;
    if (isChapter) return base;
    const allSameCh = verses.every(v => v.chapter === chapter);
    if (!allSameCh || verses.length === 0) return base;
    if (verses.length === 1) return `${base}.${verses[0].num}`;
    return `${base}.${verses[0].num}-${verses[verses.length - 1].num}`;
}

function biblerefUrl(bookCode, chapter, verseNum) {
    const engName = ENG_NAMES[bookCode];
    if (!engName) return null;
    const slug = engName.replace(/ /g, '-');
    return verseNum != null
        ? `https://www.bibleref.com/${slug}/${chapter}/${slug}-${chapter}-${verseNum}.html`
        : `https://www.bibleref.com/${slug}/${chapter}/${slug}-chapter-${chapter}.html`;
}

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

function errorCardHtml(label, message) {
    return `<div class="verse-card error-card">
        <div class="verse-card-header"><div class="verse-card-header-left"><span class="verse-card-label">${escHtml(label)}</span></div></div>
        <div class="error-message">${escHtml(message)}</div>
    </div>`;
}

function escHtml(s) {
    if (s == null) return '';
    const d = document.createElement('div');
    d.textContent = String(s);
    return d.innerHTML;
}

function escAttr(s) {
    if (s == null) return '';
    return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
}


function _setPanel(panelId, btnId, open) {
    const panel = document.getElementById(panelId);
    const btn = document.getElementById(btnId);
    if (!panel || !btn) return false;
    panel.classList.toggle('open', open);
    btn.classList.toggle('open', open);
    return open;
}

function toggleBlaPanel() {
    const panel = document.getElementById('blaPanel');
    const willOpen = !panel.classList.contains('open');
    _setPanel('visningPanel', 'visningBtn', false);
    _setPanel('blaPanel', 'blaBtn', willOpen);
    if (willOpen) {
        const ctx = (currentView === 'normal') ? _topmostVisibleContext() : null;
        if (ctx && _booksMap && _booksMap.has(ctx.book)) {
            const b = _booksMap.get(ctx.book);
            blaTestament = b.testament || blaTestament;
            blaBook = ctx.book;
            blaCurrentChapter = ctx.chapter;
            blaStep = 'chapter';
        } else {
            blaTestament = null;
            blaBook = null;
            blaCurrentChapter = null;
            blaStep = 'testament';
        }
        renderBlaPanel();
    }
}

function toggleVisningPanel() {
    const panel = document.getElementById('visningPanel');
    const willOpen = !panel.classList.contains('open');
    _setPanel('blaPanel', 'blaBtn', false);
    _setPanel('visningPanel', 'visningBtn', willOpen);
}

window.toggleBlaPanel = toggleBlaPanel;
window.toggleVisningPanel = toggleVisningPanel;

// Stop propagation inside panels/buttons so the document click-outside handler
// doesn't see clicks that originated inside (re-render detaches the target node,
// making closest() return null even for valid inside clicks).
['blaPanel', 'visningPanel', 'blaBtn', 'visningBtn'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', e => e.stopPropagation());
});

// Close panels when clicking outside
document.addEventListener('click', () => {
    _setPanel('blaPanel', 'blaBtn', false);
    _setPanel('visningPanel', 'visningBtn', false);
});


// ── Map: delegates to MapModule (see static/js/modules/mapModule.js) ─────────
// Tray-button click → toggle:
//   - if active from THIS tray (same block, source='tray') → close
//   - if active from MVB or another tray → close (any second click closes)
//   - otherwise → open with source='tray', origin=idx
function _trayToggle(id, idx, openFn) {
    if (window.AppModuleBus && window.AppModuleBus.isActive(id)) {
        _closeActiveModule(id);
        return;
    }
    if (window.AppModuleBus) window.AppModuleBus.setPendingContext({ origin: idx, source: 'tray' });
    try { openFn(); } finally {
        Promise.resolve().then(() => window.AppModuleBus && window.AppModuleBus.clearPendingContext());
    }
}

window.openMapForBlock = function(idx, focusId) {
    _trayToggle('map', idx, () => {
        if (window.MapModule && typeof window.MapModule.showForBlock === 'function') {
            window.MapModule.showForBlock(idx, focusId);
        }
    });
};


// ── Commentary: delegates to CommentaryModule (modules/commentaryModule.js) ──
window.openCommentaryForBlock = function(idx) {
    _trayToggle('commentary', idx, () => {
        if (window.CommentaryModule && typeof window.CommentaryModule.showForBlock === 'function') {
            window.CommentaryModule.showForBlock(idx);
        }
    });
};


// ── Leksikon: delegates to LeksikonModule (modules/leksikonModule.js) ────────
window.openLeksikonForBlock = function(idx) {
    _trayToggle('leksikon', idx, () => {
        if (window.LeksikonModule && typeof window.LeksikonModule.showForBlock === 'function') {
            window.LeksikonModule.showForBlock(idx);
        }
    });
};


// ── Topics: delegates to TopicsModule (modules/topicsModule.js) ──────────────
window.openTopicsForBlock = function(idx) {
    _trayToggle('topics', idx, () => {
        if (window.TopicsModule && typeof window.TopicsModule.showForBlock === 'function') {
            window.TopicsModule.showForBlock(idx);
        }
    });
};


// ── Outline: delegates to OutlineModule (modules/outlineModule.js) ───────────
window.openOutlineForBlock = function(idx) {
    _trayToggle('outline', idx, () => {
        if (window.OutlineModule && typeof window.OutlineModule.showForBlock === 'function') {
            window.OutlineModule.showForBlock(idx);
        }
    });
};

// External popup, block-scope (toggle).
window.openExternalForBlock = function(idx, anchor) {
    if (window.AppModuleBus && window.AppModuleBus.isActive('external')
        && window.AppModuleBus.getOrigin('external') === idx) {
        closeExternalPopup();
        return;
    }
    openExternalPopup({ scope: 'block', idx, anchor });
};


// ── Sidebar integration ──
Object.defineProperty(window, 'mainData', { get: () => mainData, configurable: true });
Object.defineProperty(window, 'allVersionsList', { get: () => allVersionsList, configurable: true });

window.bookRefName = bookRefName;
window.versionLang = versionLang;
window.isOTBook = isOTBook;
window.versionSelect = versionSelect;
Object.defineProperty(window, 'booksData', { get: () => booksData, configurable: true });

// ── Shared state for sub-modules ──
Object.defineProperty(window, 'currentView', { get: () => currentView, configurable: true });
Object.defineProperty(window, 'statsNormMode', { get: () => statsNormMode, set: v => { statsNormMode = v; }, configurable: true });
Object.defineProperty(window, 'lastStatsData', { get: () => lastStatsData, set: v => { lastStatsData = v; }, configurable: true });
Object.defineProperty(window, 'currentChapterInfo', { get: () => currentChapterInfo, configurable: true });
Object.defineProperty(window, '_booksMap', { get: () => _booksMap, configurable: true });
Object.defineProperty(window, 'quickMode', { get: () => quickMode, configurable: true });
Object.defineProperty(window, 'currentAccent', { get: () => currentAccent, set: v => { currentAccent = v; }, configurable: true });
Object.defineProperty(window, 'customAccentHex', { get: () => customAccentHex, set: v => { customAccentHex = v; }, configurable: true });
window.COLOR_PRESETS = COLOR_PRESETS;
window.I18N = I18N;

window.scrollToBlockIdx = function(target) {
    // target may be a pinned-verse spec {book, ch_start, vs_start, ch_end, vs_end, version, label} or a numeric idx
    if (typeof target === 'object' && target && target.book) {
        const ref = target.label || (() => {
            const bName = bookRefName(target.book);
            if (target.ch_start === target.ch_end) {
                return fmtVerseRef(target.book, bName, target.ch_start, target.vs_start, target.vs_end);
            }
            return `${bName} ${target.ch_start}:${target.vs_start}-${target.ch_end}:${target.vs_end}`;
        })();
        if (target.version && versionSelect && String(versionSelect.value) !== String(target.version)) {
            versionSelect.value = String(target.version);
        }
        searchInput.value = ref;
        if (typeof updateSearchHighlight === 'function') updateSearchHighlight();
        doSearch();
        return;
    }
    const idx = Number(target);
    if (!Number.isFinite(idx)) return;
    const el = document.getElementById(`card-${idx}`);
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
};

window.openPinnedVerse = function(p) {
    if (!p) return;
    window.scrollToBlockIdx(p);
};

// Build a reference label like "Matt 2:1-12" from a mainData block. Returns
// null if the block is missing required fields. Used by isolateToBlock and
// any module that needs to round-trip a block through /api/search.
window.blockToRefLabel = function(block) {
    if (!block || !block.book || !block.verses || block.verses.length === 0) return null;
    const bName = (typeof bookRefName === 'function') ? bookRefName(block.book) : block.book;
    const ch = block.verses[0].chapter;
    if (block.is_chapter) return fmtVerseRef(block.book, bName, ch);
    const first = block.verses[0].num;
    const last = block.verses[block.verses.length - 1].num;
    const allSameCh = block.verses.every(v => v.chapter === ch);
    if (!allSameCh) {
        const lastCh = block.verses[block.verses.length - 1].chapter;
        return `${bName} ${ch}:${first}-${lastCh}:${last}`;
    }
    return fmtVerseRef(block.book, bName, ch, first, last);
};

// Isolate a block by replacing mainData with just that block. Use this when
// a module is triggered for a non-topmost card (idx > 0) — the rule is that
// modules always bind to mainData[0], so we promote the requested card to
// be the sole/top card. Resolves when the new mainData[0] is rendered and
// notifyMainBlockChanged has fired. No-op when blockIdx is already 0.
window.isolateToBlock = async function(blockIdx) {
    if (!mainData || !mainData[blockIdx]) return;
    if (blockIdx === 0) return;
    const block = mainData[blockIdx];
    const label = window.blockToRefLabel(block);
    if (!label) return;
    await window.insertBlocksIntoView(
        [{ label, version: versionSelect.value }],
        { replace: true }
    );
};

window.insertBlocksIntoView = async function(specs, opts) {
    if (!specs || !specs.length) return;
    const replace = !!(opts && opts.replace);
    const allNewBlocks = [];
    for (const spec of specs) {
        const ref = spec.label;
        const version = spec.version || versionSelect.value;
        if (!ref) continue;
        try {
            const resp = await fetch(`/api/search?q=${encodeURIComponent(ref)}&version=${encodeURIComponent(version)}`);
            const data = await resp.json();
            if (data.type === 'reference' && Array.isArray(data.results)) {
                allNewBlocks.push(...data.results);
            }
        } catch {}
    }
    if (!allNewBlocks.length) return;
    const existing = (!replace && currentView === 'normal' && mainData) ? mainData : [];
    mainData = [...existing, ...allNewBlocks];
    cardExpandedState = {};
    currentView = 'normal';
    detectChapterInfo(mainData);
    renderAll();
};

window.refreshPinButtons = function() {
    if (typeof updateMvbPinButtonState === 'function') updateMvbPinButtonState();
    if (typeof refreshBlockPinButtons === 'function') refreshBlockPinButtons();
};

// Re-observe cards whenever results re-render (covers all render paths: renderAll,
// renderTextSearch, renderAllVersions, etc.) and refresh pin button state.
(function () {
    const wrapper = document.getElementById('resultsWrapper');
    if (!wrapper) return;
    let pending = 0;
    const mo = new MutationObserver(() => {
        if (pending) cancelAnimationFrame(pending);
        pending = requestAnimationFrame(() => {
            pending = 0;
            try { window.AppSidebar && window.AppSidebar.refreshObserver(); } catch {}
            try { window.refreshPinButtons && window.refreshPinButtons(); } catch {}
        });
    });
    mo.observe(wrapper, { childList: true, subtree: false });
})();

// Study tray horizontal wheel scroll
document.addEventListener('wheel', (e) => {
    const inner = e.target.closest('.study-tray-inner');
    if (!inner) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        inner.scrollLeft += e.deltaY;
    }
}, { passive: false });

// Initialize Marked Verses Bar
initMarkedVersesBar();

