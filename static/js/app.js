// ── i18n ──
const I18N = {
    en: {
        'header.help': 'Help & info — press ? anytime',
        'header.settings': 'Settings',
        'header.darkMode': 'Toggle dark mode',
        'search.placeholder': 'Search the Bible...',
        'search.clear': 'Clear search',
        'search.button': 'Search',
        'display.toggleLabel': 'browse & display',
        'display.browse': 'Browse:',
        'display.bookPlaceholder': '-- Book --',
        'display.chapterPlaceholder': '-- Ch --',
        'toggle.verseNums': 'Verse numbers',
        'toggle.newlines': 'New line per verse',
        'toggle.headings': 'Headings',
        'toggle.annotations': 'Annotations †§',
        'toggle.copyHint': 'Verse numbers & new line affect copy formatting',
        'toggle.copyHintAria': 'Formatting info',
        'modal.helpInfo': '// Help & info',
        'modal.tab.help': 'Help',
        'modal.tab.info': 'Info',
        'help.section.refLookup': 'Reference lookup',
        'help.row.singleVerse': 'Single verse',
        'help.row.wholeChapter': 'Whole chapter',
        'help.row.verseRange': 'Verse range',
        'help.row.crossChapter': 'Cross-chapter range',
        'help.row.multiPassages': 'Multiple passages (context carries)',
        'help.row.abbrevs': 'Abbreviations & English names work',
        'help.section.textSearch': 'Text search operators (can be combined)',
        'help.row.allWords': 'All verses containing word (also within words, like "trofast")',
        'help.row.exactWord': 'All verses containing exact word',
        'help.row.exactPhrase': 'Exact phrase',
        'help.row.exclude': 'Exclude word with -',
        'help.row.either': 'Either word (OR must be uppercase)',
        'help.row.bothWords': 'Both words (AND, implicit)',
        'help.section.applyFilters': 'Apply filters',
        'help.row.gt': 'Old Testament (also: GT:)',
        'help.row.nt': 'New Testament',
        'help.row.pentateuch': 'Genesis – Deuteronomy (also: pentateuch:, torah:)',
        'help.row.historical': 'Joshua – Esther (also: historical:)',
        'help.row.poetic': 'Job, Psalms, Prov, Eccl, Song (also: wisdom:, poetic:)',
        'help.row.prophets': 'Isaiah – Malachi (also: prophets:)',
        'help.row.majorProphets': 'Isa, Jer, Lam, Ezek, Dan (also: major prophets:)',
        'help.row.minorProphets': 'Hosea – Malachi (also: minor prophets:)',
        'help.row.gospels': 'Matt, Mark, Luke, John (also: gospels:)',
        'help.row.synoptic': 'Matt, Mark, Luke (also: synoptic:)',
        'help.row.epistles': 'All NT letters (also: epistles:, letters:)',
        'help.row.pauline': 'Romans – Philemon (also: pauline:)',
        'help.row.general': 'Hebrews – Jude (also: general epistles:)',
        'help.row.johannine': 'John, 1–3 John, Rev (also: johannine:)',
        'help.row.apocalyptic': 'Daniel, Revelation (also: apocalyptic:)',
        'help.row.kingsChron': '1–2 Kings, 1–2 Chr (also: kings and chronicles:)',
        'help.row.multiVolume': 'Every multi-volume book has its own group — books of samuel, books of kings, books of chronicles, corinthian letters, thessalonian letters, letters to timothy, letters of peter, letters of john',
        'help.row.bookScope': 'BookName: text — search within a single book',
        'help.section.shortcuts': 'Keyboard shortcuts',
        'help.row.focusSearch': 'Focus search',
        'help.row.blurSearch': 'Blur search / close modal',
        'help.row.openHelp': 'Open/close help',
        'help.row.prevNextChVs': 'Prev / next chapter (or verse when viewing a verse)',
        'help.row.prevNextVer': 'Previous / next Bible version',
        'help.row.tabAccept': 'Accept first autocomplete suggestion',
        'help.row.tabBookSearch': 'Search within completed book name',
        'help.row.acNav': 'Navigate autocomplete suggestions',
        'info.about.title': 'About',
        'info.about.text': "A fast and powerful Bible search tool, designed for personal Bible study and connecting with God's Word. Quickly look up references, search for words and phrases across the whole Bible or using filters, view stats and data for searches, explore cross-references, and compare translations. View help section for how to use.",
        'info.bibleText.title': 'Bible text',
        'info.bibleText.text': 'Bible text is sourced from <a href="https://www.bible.com" target="_blank" rel="noopener">YouVersion / bible.com</a> and stored locally to enable fast lookups and advanced full-text search. All rights to the Bible translations belong to their respective copyright holders and publishers. This tool is intended for personal use and Bible study only — not for redistribution.',
        'info.crossRefs.title': 'Cross-references',
        'info.crossRefs.text': 'Cross-reference data (~345,000 references) comes from <a href="https://www.openbible.info/labs/cross-references/" target="_blank" rel="noopener">OpenBible.info\'s cross-reference project</a>, which is primarily sourced from the Treasury of Scripture Knowledge (TSK). Used under Creative Commons Attribution 4.0.',
        'info.openSource.title': 'Open source',
        'info.openSource.text': 'This project is open source under the MIT license — <a href="https://github.com/tobiashellerslien/bible-search" target="_blank" rel="noopener">github.com/tobiashellerslien/bible-search</a>.',
        'info.openSource.competition': 'link to the competition',
        'info.feedback.title': 'Feedback',
        'info.feedback.text': 'Questions, suggestions, or found a bug? Reach out at <a href="mailto:tobias@hellerslien.net">tobias@hellerslien.net</a>.',
        'modal.stats': '// Stats',
        'stats.totalHits': 'Total hits',
        'stats.perChapter': 'Per chapter',
        'stats.perVerse': 'Per verse',
        'stats.booksHit': 'Books hit',
        'stats.gtHits': 'OT hits',
        'stats.ntHits': 'NT hits',
        'stats.topGT': 'Top OT',
        'stats.topNT': 'Top NT',
        'stats.distribution': 'Distribution shown for entire Bible (filtered to: {0})',
        'stats.modalTitle': '// Stats: "{0}"',
        'stats.goToResults': 'Go to results',
        'stats.unitHits': '{0} hits',
        'stats.unitChapter': '{0} / ch',
        'stats.unitVerse': '{0} / vs',
        'modal.settings': '// Settings',
        'settings.appearance': 'Appearance',
        'settings.darkMode': 'Dark mode',
        'settings.uiFont': 'UI font',
        'settings.uiLang': 'UI language',
        'settings.fontMono': 'Mono',
        'settings.fontSans': 'Sans',
        'settings.fontSerif': 'Serif',
        'settings.accentColor': 'Accent color',
        'settings.verseFontSize': 'Verse font size',
        'settings.defaults': 'Default',
        'settings.bibleVersion': 'Bible version',
        'settings.savedDefault': 'Default version saved',
        'empty.title': 'Search the Bible',
        'empty.tagline': 'References, full-text search, cross-references and stats — across many translations.',
        'empty.label.reference': 'Reference',
        'empty.label.text': 'Text',
        'empty.label.filter': 'Filter',
        'empty.btn.help': '? Search syntax',
        'empty.btn.about': 'ⓘ About',
        'empty.btn.settings': '⚙ Settings',
        'card.copyTxt': 'copy txt',
        'card.copyTxt.title': 'Copy text only',
        'card.copyRef': 'copy w/ ref',
        'card.copyRef.title': 'Copy with reference',
        'card.compare': 'compare',
        'card.compare.title': 'Compare versions',
        'card.allVersionsOption': '— All versions —',
        'card.more': 'More',
        'card.more.interlinear': 'interlinear',
        'card.more.commentary': 'commentary',
        'card.more.source': 'source',
        'card.more.shareLink': 'share link',
        'card.compareLoading': 'Loading...',
        'card.compareNotFound': 'Not found',
        'card.compareFailed': 'Failed to load',
        'card.dismissHighlight': 'Dismiss highlight',
        'annot.fnTitle': 'Footnote',
        'annot.xrTitle': 'Cross-references',
        'annot.loadingRefs': 'Loading references…',
        'annot.loadError': 'Error loading.',
        'annot.noRefs': 'No cross-references found.',
        'annot.showAll': 'Show all {0} ↓',
        'annot.openAll': 'Open all in view →',
        'annot.loading': 'Loading…',
        'annot.error': 'Error',
        'chip.verseSingle': 'verse {0}',
        'chip.verseRange': 'verses {0}–{1}',
        'chip.verseCrossCh': 'verses {0}:{1}–{2}:{3}',
        'chapterNav.prevCh': 'Previous chapter',
        'chapterNav.nextCh': 'Next chapter',
        'chapterNav.prevVs': 'Previous verse',
        'chapterNav.nextVs': 'Next verse',
        'verseNum.titleFmt': '{0} {1}:{2}',
        'toast.copied': 'Copied!',
        'toast.copiedRef': 'Copied with reference!',
        'toast.linkCopied': 'Link copied!',
        'toast.copyFailed': 'Copy failed',
        'toast.clipboardUnavailable': 'Clipboard unavailable',
        'toast.statsError': 'Stats error: {0}',
        'toast.statsFailed': 'Failed to load stats.',
        'searchResults.text.noResults': 'No results',
        'searchResults.text.noResultsBody': 'No verses found for "{0}" in {1}.',
        'searchResults.searchAllVersions': 'Search in all versions',
        'searchResults.allVersions.noResultsBody': 'No verses found for "{0}" in any version.',
        'searchResults.count': '{0} result for "{1}"',
        'searchResults.countPlural': '{0} results for "{1}"',
        'searchResults.allVersionsCountSingular': '{0} result across {1} version for "{2}"',
        'searchResults.allVersionsCountVPlural': '{0} result across {1} versions for "{2}"',
        'searchResults.allVersionsCountRPlural': '{0} results across {1} version for "{2}"',
        'searchResults.allVersionsCountAllPlural': '{0} results across {1} versions for "{2}"',
        'searchResults.expandAll': 'expand all',
        'searchResults.collapseAll': 'collapse all',
        'searchResults.statsBtn': '📊 stats',
        'loading.errorGeneric': 'Error',
        'loading.errorBody': 'Failed to connect to server.',
        'loading.searchingTitle': 'Searching...',
        'loading.searchingBody': 'Searching all versions for "{0}"',
        'allVersions.failed': 'Failed to fetch versions.',
        'ac.filter': 'filter',
        'ac.searchInBook': 'search in book',
        'verse.chapterHeading': 'Chapter {0}',
    },
    no: {
        'header.help': 'Hjelp & info — trykk ? når som helst',
        'header.settings': 'Innstillinger',
        'header.darkMode': 'Veksle mørk modus',
        'search.placeholder': 'Søk i Bibelen...',
        'search.clear': 'Tøm søk',
        'search.button': 'Søk',
        'display.toggleLabel': 'bla & vis',
        'display.browse': 'Bla:',
        'display.bookPlaceholder': '-- Bok --',
        'display.chapterPlaceholder': '-- Kap --',
        'toggle.verseNums': 'Versnummer',
        'toggle.newlines': 'Linjeskift per vers',
        'toggle.headings': 'Overskrifter',
        'toggle.annotations': 'Annotasjoner †§',
        'toggle.copyHint': 'Versnummer og linjeskift påvirker kopiering',
        'toggle.copyHintAria': 'Formateringsinfo',
        'modal.helpInfo': '// Hjelp & info',
        'modal.tab.help': 'Hjelp',
        'modal.tab.info': 'Info',
        'help.section.refLookup': 'Henvisninger',
        'help.row.singleVerse': 'Enkelt vers',
        'help.row.wholeChapter': 'Helt kapittel',
        'help.row.verseRange': 'Vers-område',
        'help.row.crossChapter': 'Område over flere kapitler',
        'help.row.multiPassages': 'Flere passasjer (kontekst videreføres)',
        'help.row.abbrevs': 'Forkortelser og engelske navn fungerer',
        'help.section.textSearch': 'Tekstsøk-operatorer (kan kombineres)',
        'help.row.allWords': 'Alle vers som inneholder ord (også i ord, som «trofast»)',
        'help.row.exactWord': 'Alle vers med eksakt ord',
        'help.row.exactPhrase': 'Eksakt frase',
        'help.row.exclude': 'Ekskluder ord med -',
        'help.row.either': 'Enten/eller-ord (OR må være store bokstaver)',
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
        'help.row.prevNextChVs': 'Forrige/neste kapittel (eller vers ved versvisning)',
        'help.row.prevNextVer': 'Forrige/neste bibeloversettelse',
        'help.row.tabAccept': 'Godta første autofullføring',
        'help.row.tabBookSearch': 'Søk innenfor fullført boknavn',
        'help.row.acNav': 'Naviger autofullføringer',
        'info.about.title': 'Om',
        'info.about.text': 'Et raskt og kraftig bibelsøkverktøy, laget for personlig bibelstudie og for å bli bedre kjent med Guds ord. Raskt slå opp vers, søk etter ord og fraser i hele Bibelen eller ved bruk av filtre, se statistikk for søk, utforsk kryssreferanser og sammenlign oversettelser. Se hjelp-fanen for hvordan dette brukes.',
        'info.bibleText.title': 'Bibeltekst',
        'info.bibleText.text': 'Bibelteksten er hentet fra <a href="https://www.bible.com" target="_blank" rel="noopener">YouVersion / bible.com</a> og lagret lokalt for raske oppslag og avansert fulltekstsøk. Alle rettigheter til oversettelsene tilhører deres respektive opphavsrettighetsinnehavere og forlag. Verktøyet er ment for personlig bruk og bibelstudium — ikke for videredistribusjon.',
        'info.crossRefs.title': 'Kryssreferanser',
        'info.crossRefs.text': 'Kryssreferanser (~345 000 referanser) kommer fra <a href="https://www.openbible.info/labs/cross-references/" target="_blank" rel="noopener">OpenBible.info sitt kryssreferanseprosjekt</a>, hovedsakelig basert på Treasury of Scripture Knowledge (TSK). Brukt under Creative Commons Attribution 4.0.',
        'info.openSource.title': 'Åpen kildekode',
        'info.openSource.text': 'Dette prosjektet er åpen kildekode under MIT-lisensen — <a href="https://github.com/tobiashellerslien/bible-search" target="_blank" rel="noopener">github.com/tobiashellerslien/bible-search</a>.',
        'info.openSource.competition': 'lenke til konkurransen',
        'info.feedback.title': 'Tilbakemelding',
        'info.feedback.text': 'Spørsmål, forslag eller funnet en bug? Ta kontakt på <a href="mailto:tobias@hellerslien.net">tobias@hellerslien.net</a>.',
        'modal.stats': '// Statistikk',
        'stats.totalHits': 'Totalt treff',
        'stats.perChapter': 'Per kapittel',
        'stats.perVerse': 'Per vers',
        'stats.booksHit': 'Bøker med treff',
        'stats.gtHits': 'GT-treff',
        'stats.ntHits': 'NT-treff',
        'stats.topGT': 'Topp GT',
        'stats.topNT': 'Topp NT',
        'stats.distribution': 'Fordeling vises for hele Bibelen (filtrert til: {0})',
        'stats.modalTitle': '// Statistikk: «{0}»',
        'stats.goToResults': 'Gå til resultater',
        'stats.unitHits': '{0} treff',
        'stats.unitChapter': '{0} / kap',
        'stats.unitVerse': '{0} / vs',
        'modal.settings': '// Innstillinger',
        'settings.appearance': 'Utseende',
        'settings.darkMode': 'Mørk modus',
        'settings.uiFont': 'UI-skrift',
        'settings.uiLang': 'UI-språk',
        'settings.fontMono': 'Mono',
        'settings.fontSans': 'Sans',
        'settings.fontSerif': 'Serif',
        'settings.accentColor': 'Aksentfarge',
        'settings.verseFontSize': 'Versskrift-størrelse',
        'settings.defaults': 'Standard',
        'settings.bibleVersion': 'Bibeloversettelse',
        'settings.savedDefault': 'Standardoversettelse lagret',
        'empty.title': 'Søk i Bibelen',
        'empty.tagline': 'Henvisninger, fulltekstsøk, kryssreferanser og statistikk — på tvers av oversettelser.',
        'empty.label.reference': 'Henvisning',
        'empty.label.text': 'Tekst',
        'empty.label.filter': 'Filter',
        'empty.btn.help': '? Søkesyntaks',
        'empty.btn.about': 'ⓘ Om',
        'empty.btn.settings': '⚙ Innstillinger',
        'card.copyTxt': 'kopier tekst',
        'card.copyTxt.title': 'Kopier kun tekst',
        'card.copyRef': 'kopier m/ ref',
        'card.copyRef.title': 'Kopier med henvisning',
        'card.compare': 'sammenlign',
        'card.compare.title': 'Sammenlign oversettelser',
        'card.allVersionsOption': '— Alle oversettelser —',
        'card.more': 'Mer',
        'card.more.interlinear': 'interlineær',
        'card.more.commentary': 'kommentar',
        'card.more.source': 'kilde',
        'card.more.shareLink': 'del lenke',
        'card.compareLoading': 'Laster...',
        'card.compareNotFound': 'Ikke funnet',
        'card.compareFailed': 'Lasting feilet',
        'card.dismissHighlight': 'Fjern markering',
        'annot.fnTitle': 'Fotnote',
        'annot.xrTitle': 'Kryssreferanser',
        'annot.loadingRefs': 'Laster referanser…',
        'annot.loadError': 'Feil ved lasting.',
        'annot.noRefs': 'Ingen kryssreferanser funnet.',
        'annot.showAll': 'Vis alle {0} ↓',
        'annot.openAll': 'Åpne alle →',
        'annot.loading': 'Laster…',
        'annot.error': 'Feil',
        'chip.verseSingle': 'vers {0}',
        'chip.verseRange': 'vers {0}–{1}',
        'chip.verseCrossCh': 'vers {0}:{1}–{2}:{3}',
        'chapterNav.prevCh': 'Forrige kapittel',
        'chapterNav.nextCh': 'Neste kapittel',
        'chapterNav.prevVs': 'Forrige vers',
        'chapterNav.nextVs': 'Neste vers',
        'verseNum.titleFmt': '{0} {1}:{2}',
        'toast.copied': 'Kopiert!',
        'toast.copiedRef': 'Kopiert med henvisning!',
        'toast.linkCopied': 'Lenke kopiert!',
        'toast.copyFailed': 'Kopiering feilet',
        'toast.clipboardUnavailable': 'Utklippstavle ikke tilgjengelig',
        'toast.statsError': 'Statistikkfeil: {0}',
        'toast.statsFailed': 'Kunne ikke laste statistikk.',
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
        'searchResults.statsBtn': '📊 statistikk',
        'loading.errorGeneric': 'Feil',
        'loading.errorBody': 'Kunne ikke koble til server.',
        'loading.searchingTitle': 'Søker...',
        'loading.searchingBody': 'Søker i alle oversettelser etter «{0}»',
        'allVersions.failed': 'Kunne ikke hente oversettelser.',
        'ac.filter': 'filter',
        'ac.searchInBook': 'søk i bok',
        'verse.chapterHeading': 'Kapittel {0}',
    },
};

let uiLang = (localStorage.getItem('uiLang') === 'no' || localStorage.getItem('uiLang') === 'en')
    ? localStorage.getItem('uiLang')
    : (navigator.language && navigator.language.toLowerCase().startsWith('no') ? 'no' : 'en');

function t(key, ...args) {
    let s = (I18N[uiLang] && I18N[uiLang][key]) || (I18N.en && I18N.en[key]) || key;
    args.forEach((a, i) => { s = s.split(`{${i}}`).join(String(a)); });
    return s;
}

function applyI18n() {
    document.documentElement.lang = uiLang;
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
    const ver = allVersionsList.find(x => String(x.id) === String(v));
    return ver ? ver.name : String(v);
}
function versionLang(v) {
    const ver = allVersionsList.find(x => String(x.id) === String(v));
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
    const b = booksData.find(x => x.code === code);
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

const FONT_SIZES = [null, '0.85rem', '1.0rem', '1.1rem', '1.3rem', '1.5rem'];

function bookChapterCount(code) {
    const b = booksData.find(x => x.code === code);
    return b ? (b.chapters || 0) : 0;
}
function bookTotalVerses(code) {
    const b = booksData.find(x => x.code === code);
    if (!b || !b.verse_counts) return 0;
    return Object.values(b.verse_counts).reduce((a, n) => a + n, 0);
}

const COLOR_PRESETS = [
    { name: 'Blue',   l: '#2870e8', lh: '#1d5cc8', ld: 'rgba(40,112,232,0.12)',   d: '#5aafff', dh: '#4a9eee', dd: 'rgba(90,175,255,0.12)' },
    { name: 'Green',  l: '#16a34a', lh: '#15803d', ld: 'rgba(22,163,74,0.12)',    d: '#4ade80', dh: '#22c55e', dd: 'rgba(74,222,128,0.12)' },
    { name: 'Red',    l: '#b53232', lh: '#922222', ld: 'rgba(181,50,50,0.12)',    d: '#e06060', dh: '#c94444', dd: 'rgba(224,96,96,0.12)' },
    { name: 'Purple', l: '#7c3aed', lh: '#6d28d9', ld: 'rgba(124,58,237,0.12)',  d: '#a78bfa', dh: '#8b5cf6', dd: 'rgba(167,139,250,0.12)' },
    { name: 'Orange', l: '#c97a06', lh: '#a86205', ld: 'rgba(201,122,6,0.12)',   d: '#fbbf24', dh: '#f59e0b', dd: 'rgba(251,191,36,0.12)' },
    { name: 'Teal',   l: '#0d9488', lh: '#0f766e', ld: 'rgba(13,148,136,0.12)',  d: '#2dd4bf', dh: '#14b8a6', dd: 'rgba(45,212,191,0.12)' },
];

// ── State ──
let lastQuery = '';
let mainData = null;
let currentView = 'normal';
let booksData = [];
let allVersionsCache = null;
let textSearchCache = null;
let allVersionsTextCache = null;
let currentChapterInfo = null;
let allVersionsList = [];
let currentAccentIdx = parseInt(localStorage.getItem('accentColor') || '0');
let lastTextSearchQuery = '';
const cardCompare = {};  // { [idx]: { version, data, visible } }
let currentHighlightVerses = null; // { keys: Set<"chapter:verse"> } | null
let _preserveHighlight = false;
let lastStatsData = null;
let statsNormMode = 'total';
let showAnnotations = localStorage.getItem('showAnnotations') !== 'false';
let showFootnotes = showAnnotations;
let showXrefs = showAnnotations;
const xrefCache = new Map();

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
const emptyStateHtml = emptyState.outerHTML;
const toast = document.getElementById('toast');
const bookSelect = document.getElementById('bookSelect');
const chapterSelect = document.getElementById('chapterSelect');
const autocompleteDropdown = document.getElementById('autocompleteDropdown');
const chartTooltip = document.getElementById('chartTooltip');

// ── Init ──
async function init() {
    history.scrollRestoration = 'manual';
    const resp = await fetch('/api/versions');
    const data = await resp.json();
    allVersionsList = data.versions; // [{id, name, full_name, language}, ...]
    data.versions.forEach(v => {
        versionSelect.add(new Option(v.name, String(v.id)));
    });
    const savedDefault = localStorage.getItem('defaultVersion');
    const idStrings = data.versions.map(v => String(v.id));
    if (savedDefault && idStrings.includes(savedDefault)) {
        versionSelect.value = savedDefault;
    } else {
        const nb88 = data.versions.find(v => v.name === 'NB88/07');
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
    const ver = allVersionsList.find(x => String(x.id) === vid);
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
    refreshBookDropdown();
}

function refreshBookDropdown() {
    const lang = versionLang(versionSelect.value);
    const prev = bookSelect.value;
    bookSelect.innerHTML = '<option value="">-- Book --</option>';
    booksData.forEach(b => {
        bookSelect.add(new Option(bookName(b.code, lang), b.code));
    });
    bookSelect.value = prev;
    chapterSelect.innerHTML = '<option value="">-- Ch --</option>';
    chapterSelect.disabled = true;
}

versionSelect.addEventListener('change', () => {
    updateVersionPickerDisplay();
    loadBooks();
    if (currentView === 'text_search' && textSearchCache) {
        searchInput.value = textSearchCache.query;
        updateSearchHighlight();
        doSearch(false);
    } else if (currentView !== 'text_search_all' && lastQuery) {
        doSearch(false);
    }
});

bookSelect.addEventListener('change', () => {
    const code = bookSelect.value;
    chapterSelect.innerHTML = '<option value="">-- Ch --</option>';
    if (!code) { chapterSelect.disabled = true; return; }
    const book = booksData.find(b => b.code === code);
    if (!book) return;
    for (let i = 1; i <= book.chapters; i++) chapterSelect.add(new Option(i, i));
    chapterSelect.disabled = false;
});

chapterSelect.addEventListener('change', () => {
    const code = bookSelect.value;
    const ch = chapterSelect.value;
    if (!code || !ch) return;
    const book = booksData.find(b => b.code === code);
    if (!book) return;
    searchInput.value = `${book.name} ${ch}`;
    updateSearchHighlight();
    doSearch();
});

setInterval(() => fetch('/api/heartbeat').catch(() => {}), 30000);

// ── URL / History ──
function buildURL(q, version, mode) {
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (version) p.set('v', version);
    if (mode && mode !== 'normal') p.set('mode', mode);
    const qs = p.toString();
    return qs ? `?${qs}` : '/';
}

function pushState(q, version, mode) {
    const url = buildURL(q, version, mode);
    history.pushState({ q, version, mode: mode || 'normal' }, '', url);
}

function restoreFromURL() {
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
    if (e.state) {
        const { q, version, mode, openXref } = e.state;
        if (version && allVersionsList.some(x => String(x.id) === version)) versionSelect.value = version;
        if (q) {
            searchInput.value = q;
            updateSearchHighlight();
            if (mode === 'allversions') await executeAllVersions(q);
            else await doSearch(false, false);
            restoreOpenXrefPanel(openXref);
        } else {
            goHome(false);
        }
    } else {
        restoreFromURL();
    }
});

// ── Search ──
searchBtn.addEventListener('click', doSearch);
searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && acSelectedIndex < 0) doSearch();
});

async function doSearch(pushHistory = true, resetAC = true) {
    if (resetAC) closeAutocomplete();
    if (!_preserveHighlight) currentHighlightVerses = null;
    _preserveHighlight = false;
    const query = searchInput.value.trim();
    if (!query) return;
    lastQuery = query;
    currentView = 'normal';
    currentChapterInfo = null;
    Object.keys(cardCompare).forEach(k => delete cardCompare[k]);
    const version = versionSelect.value;
    if (pushHistory) pushState(query, version);
    updateSearchHighlight();

    try {
        const resp = await fetch(`/api/search?q=${encodeURIComponent(query)}&version=${encodeURIComponent(version)}`);
        const data = await resp.json();
        if (data.error) { resultsWrapper.innerHTML = errorCardHtml(t('loading.errorGeneric'), data.error); return; }

        if (data.type === 'text_search') {
            currentView = 'text_search';
            lastTextSearchQuery = data.query;
            textSearchCache = { results: data.results, query: data.query };
            renderTextSearch(data.results, data.query);
            return;
        }

        mainData = data.results;
        detectChapterInfo(mainData);
        renderAll();
        window.scrollTo(0, 0);
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
    else if (currentView === 'text_search' && textSearchCache) renderTextSearch(textSearchCache.results, textSearchCache.query);
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

document.getElementById('copyHintBtn').addEventListener('click', function() {
    this.classList.toggle('open');
    document.addEventListener('click', function hide(e) {
        if (e.target !== document.getElementById('copyHintBtn')) {
            document.getElementById('copyHintBtn').classList.remove('open');
            document.removeEventListener('click', hide);
        }
    });
});

// ── Render reference results ──
function renderAll() {
    if (!mainData || mainData.length === 0) { resultsWrapper.innerHTML = emptyStateHtml; applyI18n(); return; }
    const showNums = toggleVerseNums.checked;
    const showNewlines = toggleNewlines.checked;
    const showHeadings = toggleHeadings.checked;
    const mainLang = versionLang(versionSelect.value);
    let html = '';

    mainData.forEach((block, idx) => {
        html += buildCardHtml(block, idx, showNums, showNewlines, showHeadings, mainLang, versionSelect.value);
    });

    resultsWrapper.innerHTML = html;
    Object.keys(cardCompare).forEach(idx => {
        if (cardCompare[idx] && cardCompare[idx].visible) renderCompareBody(idx);
    });
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
    const defaultCompareVer = allVersionsList.find(v => String(v.id) !== ver);
    const compareVer = cs ? cs.version : (defaultCompareVer ? String(defaultCompareVer.id) : ver);

    const hasHighlight = currentHighlightVerses && block.verses.some(v =>
        currentHighlightVerses.keys.has(`${v.chapter}:${v.num}`));
    const chipHtml = hasHighlight
        ? `<button class="copy-btn highlight-dismiss-btn" onclick="clearHighlight()" title="${escAttr(t('card.dismissHighlight'))}">${escHtml(buildHighlightChipLabel())} &times;</button>`
        : '';

    let html = `<div class="verse-card" id="${cardId}">
        <div class="verse-card-header">
            <div class="verse-card-header-left">
                <span class="verse-card-label">${escHtml(displayLabel)}</span>
                ${chipHtml}
            </div>
            <div class="verse-card-header-actions">
                <button class="copy-btn" onclick="copyBlockText(${idx})" title="${escAttr(t('card.copyTxt.title'))}">${escHtml(t('card.copyTxt'))}</button>
                <button class="copy-btn" onclick="copyBlockRef(${idx})" title="${escAttr(t('card.copyRef.title'))}">${escHtml(t('card.copyRef'))}</button>
                <button class="copy-btn compare-header-btn${compareVisible ? ' active' : ''}" onclick="toggleCardCompare(${idx})" title="${escAttr(t('card.compare.title'))}">${escHtml(t('card.compare'))}</button>
            </div>
        </div>
        <div class="verse-text">`;

    html += renderVerseTextHtml(block.verses, showNums, showNewlines, showHeadings, block.book, lang, ver, block.headings || [], block.footnotes || []);
    html += '</div>';

    if (block.book && block.verses.length > 0) {
        const ch = block.verses[0].chapter;
        const bName = bookRefName(block.book);
        const maxCh = (booksData.find(b => b.code === block.book) || {}).chapters || 0;
        const isSingleVerse = block.verses.length === 1;
        const ilUrl = interlinearUrl(block.book, ch, isSingleVerse ? block.verses[0].num : null);
        const allSameCh = block.verses.every(v => v.chapter === ch);

        // Compare section sits between verse text and footer
        const isAllMode = cs && cs.mode === 'all';
        html += `<div class="card-compare-section${compareVisible ? ' visible' : ''}" id="compare-section-${idx}">
            <div class="card-compare-header">
                <select class="card-compare-select" id="compare-select-${idx}" onchange="changeCardCompareVersion(${idx})">`;
        allVersionsList.forEach(v => {
            const vid = String(v.id);
            html += `<option value="${escAttr(vid)}"${vid === compareVer && !isAllMode ? ' selected' : ''}>${escHtml(v.name)}</option>`;
        });
        html += `<option value="__all__"${isAllMode ? ' selected' : ''}>${escHtml(t('card.allVersionsOption'))}</option>`;
        html += `</select></div>
            <div class="card-compare-body" id="compare-body-${idx}"></div></div>`;

        const verseKeysStr = block.verses.map(v => `${v.chapter}:${v.num}`).join(',');
        const crUrl = biblerefUrl(block.book, ch, isSingleVerse ? block.verses[0].num : null);
        const yvUrl = youversionUrl(block.book, ch, block.verses, ver, !!block.is_chapter);
        html += `<div class="verse-card-footer">
            <button class="card-action-btn" onclick="readChapter('${escAttr(block.book)}', ${ch}, '${escAttr(bName)}', '${verseKeysStr}')">&#128214; ${escHtml(bookNameSingular(block.book, lang))} ${ch}</button>`;
        if (ilUrl || crUrl || yvUrl) {
            html += `<div class="card-more-wrap">
                <button class="card-action-btn card-more-btn" onclick="toggleCardMore(${idx})" title="${escAttr(t('card.more'))}">&#8943;</button>
                <div class="card-more-menu" id="card-more-${idx}">`;
            if (ilUrl) html += `<a class="card-more-item" href="${ilUrl}" target="_blank" rel="noopener"><img src="/static/biblehub.png" alt=""> ${escHtml(t('card.more.interlinear'))}</a>`;
            if (crUrl) html += `<a class="card-more-item" href="${crUrl}" target="_blank" rel="noopener"><img src="/static/bibleref.png" alt=""> ${escHtml(t('card.more.commentary'))}</a>`;
            if (yvUrl) html += `<a class="card-more-item" href="${yvUrl}" target="_blank" rel="noopener">${escHtml(t('card.more.source'))}</a>`;
            html += `<button class="card-more-item" onclick="shareLink()">${escHtml(t('card.more.shareLink'))}</button>`;
            html += `</div></div>`;
        }
        if (allSameCh && maxCh > 0) {
            const isVerseView = !block.is_chapter;
            html += `<div class="chapter-nav">`;
            if (isVerseView) {
                const firstV = block.verses[0].num;
                const lastV = block.verses[block.verses.length - 1].num;
                const maxV = maxVerseInChapter(block.book, ch);
                const hasPrev = firstV > 1 || ch > 1;
                const hasNext = (maxV && lastV < maxV) || ch < maxCh;
                const prevLabel = firstV > 1 ? firstV - 1 : (ch > 1 ? `${ch - 1}:${maxVerseInChapter(block.book, ch - 1) || '?'}` : null);
                const nextLabel = (maxV && lastV < maxV) ? lastV + 1 : (ch < maxCh ? `${ch + 1}:1` : null);
                if (hasPrev && prevLabel !== null) html += `<button class="card-action-btn" onclick="goVerse('${escAttr(block.book)}', ${ch}, ${firstV}, '${escAttr(bName)}', 'prev')" title="${escAttr(t('chapterNav.prevVs'))}">&#8592; ${prevLabel}</button>`;
                if (hasNext && nextLabel !== null) html += `<button class="card-action-btn" onclick="goVerse('${escAttr(block.book)}', ${ch}, ${lastV}, '${escAttr(bName)}', 'next')" title="${escAttr(t('chapterNav.nextVs'))}">${nextLabel} &#8594;</button>`;
            } else {
                if (ch > 1) html += `<button class="card-action-btn" onclick="goChapter('${escAttr(block.book)}', ${ch - 1}, '${escAttr(bName)}', 'prev')" title="${escAttr(t('chapterNav.prevCh'))}">&#8592; ${ch - 1}</button>`;
                if (ch < maxCh) html += `<button class="card-action-btn" onclick="goChapter('${escAttr(block.book)}', ${ch + 1}, '${escAttr(bName)}', 'next')" title="${escAttr(t('chapterNav.nextCh'))}">${ch + 1} &#8594;</button>`;
            }
            html += `</div>`;
        }
        html += `</div>`;
    }

    html += '</div>';
    return html;
}

// ── Card compare ──
function renderCompareBody(idx) {
    const cs = cardCompare[idx];
    const body = document.getElementById(`compare-body-${idx}`);
    if (!body || !cs) return;
    const showNums = toggleVerseNums.checked;
    const showNewlines = toggleNewlines.checked;
    const showHeadings = toggleHeadings.checked;

    if (cs.mode === 'all') {
        if (!cs.allData) { body.innerHTML = `<span class="compare-loading">${escHtml(t('card.compareLoading'))}</span>`; return; }
        let html = '';
        let first = true;
        for (const [vName, blocks] of Object.entries(cs.allData)) {
            const verses = blocks.flatMap(b => b.verses || []);
            if (verses.length === 0) continue;
            const headings = blocks.flatMap(b => b.headings || []);
            const blockFootnotes = blocks.flatMap(b => b.footnotes || []);
            const vLang = versionLang(vName);
            const bCode = blocks[0]?.book;
            if (!first) html += '<hr class="version-separator">';
            first = false;
            html += `<div><div class="version-label">${escHtml(versionLabel(vName))}</div>
                <div class="verse-text">${renderVerseTextHtml(verses, showNums, showNewlines, showHeadings, bCode, vLang, vName, headings, blockFootnotes)}</div></div>`;
        }
        body.innerHTML = html;
        return;
    }

    if (!cs.data) { body.innerHTML = `<span class="compare-loading">${escHtml(t('card.compareLoading'))}</span>`; return; }
    if (cs.data.error) {
        body.innerHTML = `<span style="color:var(--error);font-size:0.85rem;">${escHtml(cs.data.error)}</span>`;
        return;
    }
    const compLang = versionLang(cs.version);
    body.innerHTML = `<div class="verse-text">${renderVerseTextHtml(cs.data.verses, showNums, showNewlines, showHeadings, cs.data.book, compLang, cs.version, cs.data.headings || [], cs.data.footnotes || [])}</div>`;
}

window.toggleCardCompare = async function(idx) {
    const section = document.getElementById(`compare-section-${idx}`);
    const headerBtn = document.querySelector(`#card-${idx} .compare-header-btn`);
    if (!cardCompare[idx]) {
        const defaultVer = allVersionsList.find(v => String(v.id) !== versionSelect.value) || allVersionsList[0];
        cardCompare[idx] = { version: String(defaultVer.id), data: null, visible: true, mode: 'single', allData: null };
        if (section) {
            section.classList.add('visible');
            if (headerBtn) headerBtn.classList.add('active');
            renderCompareBody(idx);
        }
        await loadCardCompareData(idx);
        renderCompareBody(idx);
    } else {
        cardCompare[idx].visible = !cardCompare[idx].visible;
        if (section) {
            section.classList.toggle('visible', cardCompare[idx].visible);
            if (headerBtn) headerBtn.classList.toggle('active', cardCompare[idx].visible);
        }
    }
};

window.changeCardCompareVersion = async function(idx) {
    const sel = document.getElementById(`compare-select-${idx}`);
    if (!sel || !cardCompare[idx]) return;
    if (sel.value === '__all__') {
        cardCompare[idx].mode = 'all';
        cardCompare[idx].allData = null;
        renderCompareBody(idx);
        await loadCardCompareAllData(idx);
        renderCompareBody(idx);
    } else {
        cardCompare[idx].mode = 'single';
        cardCompare[idx].version = sel.value;
        cardCompare[idx].data = null;
        renderCompareBody(idx);
        await loadCardCompareData(idx);
        renderCompareBody(idx);
    }
};

async function loadCardCompareData(idx) {
    if (!mainData || !mainData[idx] || !cardCompare[idx]) return;
    const block = mainData[idx];
    const version = cardCompare[idx].version;
    try {
        const resp = await fetch(`/api/search?q=${encodeURIComponent(block.label)}&version=${encodeURIComponent(version)}`);
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
    try {
        const resp = await fetch(`/api/all_versions?q=${encodeURIComponent(block.label)}`);
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
    if (!wasOpen) menu.classList.add('open');
};
document.addEventListener('click', e => {
    if (!e.target.closest('.card-more-wrap')) {
        document.querySelectorAll('.card-more-menu.open').forEach(m => m.classList.remove('open'));
    }
});

window.shareLink = function() {
    const url = window.location.origin + window.location.pathname + window.location.search;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url)
            .then(() => showToast(t('toast.linkCopied')))
            .catch(() => showToast(t('toast.copyFailed')));
    } else {
        showToast(t('toast.clipboardUnavailable'));
    }
    document.querySelectorAll('.card-more-menu.open').forEach(m => m.classList.remove('open'));
};

function isVerseHighlighted(v) {
    return !!(currentHighlightVerses && currentHighlightVerses.keys.has(`${v.chapter}:${v.num}`));
}

function renderVerseTextHtml(verses, showNums, showNewlines, showHeadings, bookCode, lang, ver, headings = [], footnotes = []) {
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

    let html = '';
    let lastChapter = null;
    const isMultiChapter = verses.some(x => x.chapter !== verses[0]?.chapter);

    verses.forEach((v, vi) => {
        if (isMultiChapter && v.chapter !== lastChapter) {
            if (vi > 0 && showNewlines) html += '<br>';
            html += `<div class="chapter-heading">${escHtml(t('verse.chapterHeading', v.chapter))}</div>`;
            lastChapter = v.chapter;
        } else if (lastChapter === null) {
            lastChapter = v.chapter;
        }

        const headingText = showHeadings ? (headingMap[v.chapter]?.[v.num] ?? null) : null;
        if (headingText) {
            html += `<div class="verse-heading">${escHtml(headingText)}</div>`;
        } else if (showNewlines && vi > 0 && v.chapter === lastChapter) {
            html += '<br>';
        }

        const bookCodeSafe = bookCode ? escAttr(bookCode) : '';
        const refName = bookCode ? escAttr(bookRefName(bookCode)) : '';

        const highlighted = isVerseHighlighted(v);
        const prevHighlighted = vi > 0 && isVerseHighlighted(verses[vi - 1]);
        const nextHighlighted = vi < verses.length - 1 && isVerseHighlighted(verses[vi + 1]);

        // Open wrapper before the first verse in a highlighted run
        if (highlighted && !prevHighlighted) html += '<span class="verse-highlight-wrap">';

        html += `<span class="verse-line">`;
        if (showNums) {
            html += `<span class="verse-num" onclick="openSingleVerse('${bookCodeSafe}',${v.chapter},${v.num},'${refName}')" title="${escAttr(bookRefName(bookCode))} ${v.chapter}:${v.num}">${v.num}</span>`;
        }
        html += escHtml(v.text);

        const fnText = footnoteMap[v.chapter]?.[v.num];
        if (showFootnotes && fnText) {
            html += `<button class="verse-btn fn-btn" onclick="toggleFootnotePanel(this)" title="${escAttr(t('annot.fnTitle'))}">†</button>`;
        }
        if (showXrefs && bookCodeSafe) {
            html += `<button class="verse-btn xr-btn" data-book="${bookCodeSafe}" data-chapter="${v.chapter}" data-verse="${v.num}" onclick="toggleXrefPanel(this)" title="${escAttr(t('annot.xrTitle'))}">§</button>`;
        }

        html += `</span> `;

        // Close wrapper after the last verse in a highlighted run
        if (highlighted && !nextHighlighted) html += '</span>';

        // Panels are block siblings of verse-line (display:none = no layout impact when closed)
        if (showFootnotes && fnText) {
            html += `<div class="verse-panel fn-panel" style="display:none;max-height:0;opacity:0"><div class="fn-panel-inner">${escHtml(fnText)}</div></div>`;
        }
        if (showXrefs && bookCodeSafe) {
            html += `<div class="verse-panel xr-panel" style="display:none;max-height:0;opacity:0"><div class="xr-panel-inner"></div></div>`;
        }

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
    const version = versionSelect.value;
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
    doSearch();
};

function clearChapterTransition() {
    resultsWrapper.style.transition = '';
    resultsWrapper.style.opacity = '';
    resultsWrapper.style.transform = '';
}

async function slideTransition(direction, work) {
    if (!direction) { await work(); return; }
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
        setTimeout(clearChapterTransition, 250);
    } catch (e) {
        clearChapterTransition();
        throw e;
    }
}

window.goChapter = async function(bookCode, chapter, bName, direction) {
    currentHighlightVerses = null;
    await slideTransition(direction, async () => {
        searchInput.value = `${bName} ${chapter}`;
        updateSearchHighlight();
        await doSearch();
    });
};

window.openSingleVerse = function(bookCode, chapter, verse, bName) {
    searchInput.value = `${bName} ${chapter}:${verse}`;
    updateSearchHighlight();
    doSearch();
};

// ── Text search ──
function renderTextSearch(results, query) {
    textSearchCache = { results, query };
    const hlQuery = stripScopePrefix(query);
    let html = '';
    if (results.length === 0) {
        html = `<div class="empty-state">
            <h2>${escHtml(t('searchResults.text.noResults'))}</h2>
            <p>${escHtml(t('searchResults.text.noResultsBody', query, versionLabel(versionSelect.value)))}</p>
            <button class="btn btn-secondary all-versions-search-btn" onclick="searchAllVersionsText('${escAttr(query)}')">${escHtml(t('searchResults.searchAllVersions'))}</button>
        </div>`;
        resultsWrapper.innerHTML = html;
        return;
    }

    const countKey = results.length === 1 ? 'searchResults.count' : 'searchResults.countPlural';
    html += `<div class="search-controls">
        <div class="search-result-count">${escHtml(t(countKey, results.length, query))}</div>
        <button class="card-action-btn" id="expandCollapseBtn" onclick="toggleGroups()">${escHtml(t('searchResults.expandAll'))}</button>
        <button class="stats-btn" onclick="openStats('${escAttr(query)}')">${escHtml(t('searchResults.statsBtn'))}</button>
    </div>`;

    const lang = versionLang(versionSelect.value);
    const groupMap = {};
    const bookOrder = [];
    results.forEach(r => {
        if (!groupMap[r.book]) { groupMap[r.book] = []; bookOrder.push(r.book); }
        groupMap[r.book].push(r);
    });
    const autoExpand = bookOrder.length === 1;
    bookOrder.forEach(code => {
        const items = groupMap[code];
        const bName = bookName(code, lang);
        html += `<div class="book-group" data-book="${escHtml(code)}">
            <div class="book-group-header${autoExpand ? ' open' : ''}" onclick="toggleGroup(this)">
                <span>${escHtml(bName)}<span class="book-group-count">(${items.length})</span></span>
                <span class="chevron">&#9654;</span>
            </div>
            <div class="book-group-items${autoExpand ? ' open' : ''}">`;
        items.forEach(r => {
            const ref = translateLabel(r.ref, r.book, lang);
            html += `<div class="search-result-item" onclick="goToVerse('${escAttr(r.ref)}')">
                <div class="search-result-ref">${escHtml(ref)}</div>
                <div class="search-result-text">${highlightWords(escHtml(r.text), hlQuery)}</div>
            </div>`;
        });
        html += '</div></div>';
    });

    resultsWrapper.innerHTML = html;
    fixOpenGroupHeights();
}

function animateGroupItem(itemsEl, open) {
    if (open) {
        itemsEl.classList.add('open');
        itemsEl.style.height = itemsEl.scrollHeight + 'px';
    } else {
        itemsEl.style.height = itemsEl.offsetHeight + 'px';
        itemsEl.offsetHeight; // force reflow before changing target
        itemsEl.classList.remove('open');
        itemsEl.style.height = '0';
    }
}

// Called after DOM re-renders to give already-open groups an explicit height
function fixOpenGroupHeights() {
    resultsWrapper.querySelectorAll('.book-group-items.open').forEach(el => {
        if (!el.style.height) el.style.height = 'auto';
    });
}

window.toggleGroup = function(headerEl) {
    const itemsEl = headerEl.nextElementSibling;
    const isOpen = headerEl.classList.contains('open');
    headerEl.classList.toggle('open');
    animateGroupItem(itemsEl, !isOpen);
    updateExpandCollapseBtn();
};

window.toggleGroups = function() {
    const headers = [...resultsWrapper.querySelectorAll('.book-group-header')];
    const anyOpen = headers.some(h => h.classList.contains('open'));
    headers.forEach(h => {
        const itemsEl = h.nextElementSibling;
        h.classList.toggle('open', !anyOpen);
        animateGroupItem(itemsEl, !anyOpen);
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
    // Plain words → substring match (mirrors backend behavior)
    // Strip -"phrase" exclusions, complete quoted pairs, then lone quotes.
    const q2 = query.replace(/-"[^"]*"/g, '').replace(/"[^"]+"/g, '').replace(/"/g, '');
    for (const w of q2.split(/\s+/)) {
        if (!w || w.toUpperCase() === 'OR' || w.startsWith('-')) continue;
        const esc = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        try {
            htmlText = htmlText.replace(new RegExp('(' + esc + ')', 'gi'), '<b style="color:var(--highlight)">$1</b>');
        } catch {}
    }
    return htmlText;
}

window.goToVerse = function(ref) {
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
        if (data.error) { resultsWrapper.innerHTML = errorCardHtml(t('loading.errorGeneric'), data.error); return; }
        allVersionsTextCache = { results: data.results, query: data.query };
        renderAllVersionsTextSearch(data.results, data.query);
    } catch {
        resultsWrapper.innerHTML = errorCardHtml(t('loading.errorGeneric'), t('loading.errorBody'));
    }
};

function renderAllVersionsTextSearch(results, query) {
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
                <span class="chevron">&#9654;</span>
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
    if (allVersionsList.some(v => String(v.id) === version)) versionSelect.value = version;
    searchInput.value = ref;
    updateSearchHighlight();
    doSearch();
};

// ── Read chapter ──
window.readChapter = async function(bookCode, chapter, bName, highlightKeys) {
    if (highlightKeys) {
        currentHighlightVerses = { keys: new Set(highlightKeys.split(',')) };
    }
    _preserveHighlight = true;
    searchInput.value = `${bName} ${chapter}`;
    updateSearchHighlight();
    await doSearch();
    if (currentHighlightVerses) {
        requestAnimationFrame(() => {
            const el = resultsWrapper.querySelector('.verse-highlight-wrap');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
};

window.clearHighlight = function() {
    const wraps = resultsWrapper.querySelectorAll('.verse-highlight-wrap');
    const chips = resultsWrapper.querySelectorAll('.highlight-dismiss-btn');
    if (wraps.length === 0 && chips.length === 0) {
        currentHighlightVerses = null;
        renderAll();
        return;
    }
    wraps.forEach(w => w.classList.add('fading-out'));
    chips.forEach(c => c.classList.add('fading-out'));
    setTimeout(() => {
        currentHighlightVerses = null;
        renderAll();
    }, 180);
};

function buildHighlightChipLabel() {
    if (!currentHighlightVerses) return '';
    const keys = [...currentHighlightVerses.keys].map(k => {
        const [c, v] = k.split(':').map(Number);
        return { c, v };
    }).sort((a, b) => a.c - b.c || a.v - b.v);
    if (keys.length === 0) return '';
    const first = keys[0], last = keys[keys.length - 1];
    if (keys.length === 1) return t('chip.verseSingle', first.v);
    if (first.c === last.c) return t('chip.verseRange', first.v, last.v);
    return t('chip.verseCrossCh', first.c, first.v, last.c, last.v);
}

// ── All versions (reference) ──
async function executeAllVersions(label) {
    currentView = 'all_versions';
    try {
        const resp = await fetch(`/api/all_versions?q=${encodeURIComponent(label)}`);
        const data = await resp.json();
        if (data.error) { resultsWrapper.innerHTML = errorCardHtml(t('loading.errorGeneric'), data.error); return; }
        renderAllVersions(data.results, label);
    } catch { resultsWrapper.innerHTML = errorCardHtml(t('loading.errorGeneric'), t('allVersions.failed')); }
}

function renderAllVersions(allResults, label) {
    allVersionsCache = { results: allResults, label };
    const showNums = toggleVerseNums.checked;
    const showNewlines = toggleNewlines.checked;
    const showHeadings = toggleHeadings.checked;
    const firstBlocks = Object.values(allResults)[0] || [];
    const bCode = firstBlocks[0]?.book;
    const mainLang = versionLang(versionSelect.value);
    const displayLabel = bCode ? translateLabel(label, bCode, mainLang) : label;

    let html = `<div class="all-versions-block">
        <div class="verse-card-header" style="border-bottom:none;padding-bottom:0;margin-bottom:8px;">
            <span class="verse-card-label" style="font-size:1rem;">${escHtml(displayLabel)}</span>
        </div>`;
    let firstVersion = true;
    for (const [versionName, blocks] of Object.entries(allResults)) {
        const verses = blocks.flatMap(b => b.verses || []);
        if (verses.length === 0) continue;
        const headings = blocks.flatMap(b => b.headings || []);
        const blockFootnotes = blocks.flatMap(b => b.footnotes || []);
        const vLang = versionLang(versionName);
        if (!firstVersion) html += '<hr class="version-separator">';
        firstVersion = false;
        html += `<div>
            <div class="version-label">${escHtml(versionLabel(versionName))}</div>
            <div class="verse-text">${renderVerseTextHtml(verses, showNums, showNewlines, showHeadings, bCode, vLang, versionName, headings, blockFootnotes)}</div>
        </div>`;
    }
    html += '</div>';
    resultsWrapper.innerHTML = html;
}

// ── Copy ──
function buildCopyText(verses) {
    const showNums = toggleVerseNums.checked;
    const showNewlines = toggleNewlines.checked;
    if (showNewlines) {
        return verses.map(v => (showNums ? `${v.num} ` : '') + v.text).join('\n');
    } else {
        return verses.map(v => (showNums ? `${v.num} ` : '') + v.text).join(' ').trim();
    }
}

window.copyBlockText = function(blockIdx) {
    if (!mainData || !mainData[blockIdx]) return;
    const block = mainData[blockIdx];
    const text = buildCopyText(block.verses);
    navigator.clipboard.writeText(text).then(() => showToast(t('toast.copied')));
};

window.copyBlockRef = function(blockIdx) {
    if (!mainData || !mainData[blockIdx]) return;
    const block = mainData[blockIdx];
    const ver = versionSelect.value;
    const lang = versionLang(ver);
    const text = buildCopyText(block.verses);
    const label = translateLabel(block.label, block.book, lang);
    const full = `"${text}"\n\n${label} ${versionLabel(ver)}`;
    navigator.clipboard.writeText(full).then(() => showToast(t('toast.copiedRef')));
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
    currentHighlightVerses = null;
    Object.keys(cardCompare).forEach(k => delete cardCompare[k]);
    searchInput.value = '';
    updateSearchHighlight();
    resultsWrapper.innerHTML = emptyStateHtml;
    applyI18n();
    if (pushHistory) history.pushState({}, '', '/');
};

// ── Search clear button ──
const searchClearBtn = document.getElementById('searchClearBtn');
searchClearBtn.addEventListener('click', () => {
    searchInput.value = '';
    updateSearchHighlight();
    closeAutocomplete();
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
        } else if (text.slice(i, i + 2) === 'OR' && (i + 2 >= text.length || /[\s;]/.test(text[i + 2]))) {
            // Standalone OR operator
            result += `<span class="qs">OR</span>`;
            i += 2;
        } else {
            // Collect a run of plain characters to minimize span count
            let j = i + 1;
            while (j < text.length) {
                const c = text[j];
                if (c === '"' || c === ';') break;
                if (c === '-' && j + 1 < text.length && text[j + 1] !== ' ') break;
                if (text.slice(j, j + 2) === 'OR' && (j + 2 >= text.length || /[\s;]/.test(text[j + 2]))) break;
                j++;
            }
            result += escHtmlFast(text.slice(i, j));
            i = j;
        }
    }
    return result;
}

// ── Stats ──
window.openStats = async function(query) {
    const version = versionSelect.value;
    try {
        const resp = await fetch(`/api/stats?q=${encodeURIComponent(query)}&version=${encodeURIComponent(version)}`);
        const data = await resp.json();
        if (data.error) { showToast(t('toast.statsError', data.error)); return; }
        document.getElementById('statsModeSelect').value = statsNormMode;
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
    lastStatsData = data;
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
    const lang = versionLang(versionSelect.value);

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
            let tip = `<strong>${bar.dataset.name}</strong>${bar.dataset.count} hits`;
            if (statsNormMode === 'per_chapter') tip += ` (${nc.toFixed(2)}/ch)`;
            else if (statsNormMode === 'per_verse') tip += ` (${nc.toFixed(4)}/vs)`;
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
    statsNormMode = this.value;
    if (lastStatsData) renderStatsModal(lastStatsData);
});

// ── Help & info (tabbed modal) ──
function showHelpTab(tab) {
    document.querySelectorAll('#helpModal .modal-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.querySelectorAll('#helpModal [data-tab-content]').forEach(c => c.hidden = (c.dataset.tabContent !== tab));
}
window.openHelp = function(tab) {
    if (tab) showHelpTab(tab);
    document.getElementById('helpModal').classList.add('open');
};
document.getElementById('helpToggle').addEventListener('click', () => document.getElementById('helpModal').classList.toggle('open'));
document.getElementById('helpClose').addEventListener('click', () => document.getElementById('helpModal').classList.remove('open'));
document.getElementById('helpModal').addEventListener('click', e => {
    if (e.target === document.getElementById('helpModal')) document.getElementById('helpModal').classList.remove('open');
});
document.querySelectorAll('#helpModal .modal-tab').forEach(tab => {
    tab.addEventListener('click', () => showHelpTab(tab.dataset.tab));
});

// ── Settings ──
window.openSettings = function() { document.getElementById('settingsModal').classList.add('open'); };
document.getElementById('settingsToggle').addEventListener('click', () => document.getElementById('settingsModal').classList.toggle('open'));
document.getElementById('settingsClose').addEventListener('click', () => document.getElementById('settingsModal').classList.remove('open'));
document.getElementById('settingsModal').addEventListener('click', e => {
    if (e.target === document.getElementById('settingsModal')) document.getElementById('settingsModal').classList.remove('open');
});

// ── Autocomplete ──
let acItems = [];
let acSelectedIndex = -1;

searchInput.addEventListener('input', () => {
    handleAutocomplete();
    // Use RAF so scrollLeft is read after the browser scrolls the input to follow the cursor
    requestAnimationFrame(updateSearchHighlight);
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

// ── Hotkeys ──
document.addEventListener('keydown', e => {
    const inInput = ['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName);

    if (e.key === 'Escape') {
        if (document.getElementById('helpModal').classList.contains('open')) document.getElementById('helpModal').classList.remove('open');
        else if (document.getElementById('statsModal').classList.contains('open')) document.getElementById('statsModal').classList.remove('open');
        else if (document.getElementById('settingsModal').classList.contains('open')) document.getElementById('settingsModal').classList.remove('open');
        else if (autocompleteDropdown.classList.contains('open')) closeAutocomplete();
        else if (inInput) searchInput.blur();
        return;
    }

    if (inInput) return;

    if (e.key === '/' || e.key === 'f') { e.preventDefault(); searchInput.focus(); searchInput.select(); return; }
    if (e.key === '?') { document.getElementById('helpModal').classList.toggle('open'); return; }

    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && currentChapterInfo) {
        e.preventDefault();
        const { book, chapter, bookName: bName, isVerseView, firstVerse, lastVerse } = currentChapterInfo;
        const maxCh = (booksData.find(b => b.code === book) || {}).chapters || 0;
        if (isVerseView) {
            if (e.key === 'ArrowLeft') goVerse(book, chapter, firstVerse, bName, 'prev');
            else goVerse(book, chapter, lastVerse, bName, 'next');
        } else {
            if (e.key === 'ArrowLeft' && chapter > 1) goChapter(book, chapter - 1, bName, 'prev');
            else if (e.key === 'ArrowRight' && chapter < maxCh) goChapter(book, chapter + 1, bName, 'next');
        }
        return;
    }

    if (e.key === '[' || e.key === ']') {
        e.preventDefault();
        const idx = allVersionsList.findIndex(v => String(v.id) === versionSelect.value);
        if (e.key === '[' && idx > 0) { versionSelect.value = String(allVersionsList[idx - 1].id); versionSelect.dispatchEvent(new Event('change')); }
        else if (e.key === ']' && idx < allVersionsList.length - 1) { versionSelect.value = String(allVersionsList[idx + 1].id); versionSelect.dispatchEvent(new Event('change')); }
    }
});

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

function applyAccent(idx) {
    const c = COLOR_PRESETS[idx] || COLOR_PRESETS[0];
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const accent = isDark ? c.d : c.l;
    const hover  = isDark ? c.dh : c.lh;
    const dim    = isDark ? c.dd : c.ld;
    const root   = document.documentElement;
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--accent-hover', hover);
    root.style.setProperty('--accent-dim', dim);
    root.style.setProperty('--verse-num', accent);
    document.querySelectorAll('.color-swatch').forEach((sw, i) => sw.classList.toggle('active', i === idx));
}

function applyTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    darkToggle.innerHTML = dark ? '&#9728;' : '&#9790;';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    applyAccent(currentAccentIdx);
}

// Build color swatches
(function() {
    const picker = document.getElementById('colorPicker');
    COLOR_PRESETS.forEach((c, i) => {
        const sw = document.createElement('button');
        sw.className = 'color-swatch' + (i === currentAccentIdx ? ' active' : '');
        sw.style.background = c.l;
        sw.title = c.name;
        sw.setAttribute('aria-label', c.name + ' accent');
        sw.addEventListener('click', () => {
            currentAccentIdx = i;
            localStorage.setItem('accentColor', i);
            applyAccent(i);
        });
        picker.appendChild(sw);
    });
})();

darkToggle.addEventListener('click', () => applyTheme(document.documentElement.getAttribute('data-theme') !== 'dark'));
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
applyFontUI(localStorage.getItem('fontUI') || 'mono');

// ── UI language ──
function applyUILang(val) {
    if (val !== 'en' && val !== 'no') val = 'en';
    uiLang = val;
    localStorage.setItem('uiLang', val);
    document.querySelectorAll('#uiLangCtrl .font-ui-btn').forEach(b => b.classList.toggle('active', b.dataset.val === val));
    applyI18n();
    rerenderCurrentView();
}
document.getElementById('uiLangCtrl').addEventListener('click', e => {
    const btn = e.target.closest('.font-ui-btn');
    if (btn) applyUILang(btn.dataset.val);
});
function rerenderCurrentView() {
    if (currentView === 'normal' && mainData) renderAll();
    else if (currentView === 'all_versions' && allVersionsCache) renderAllVersions(allVersionsCache.results, allVersionsCache.label);
    else if (currentView === 'text_search' && textSearchCache) renderTextSearch(textSearchCache.results, textSearchCache.query);
    else if (currentView === 'text_search_all' && allVersionsTextCache) renderAllVersionsTextSearch(allVersionsTextCache.results, allVersionsTextCache.query);
}
// Mark current language button as active on load
document.querySelectorAll('#uiLangCtrl .font-ui-btn').forEach(b => b.classList.toggle('active', b.dataset.val === uiLang));
applyI18n();


// ── Name helpers ──
function bookName(code, lang) {
    if (!code) return '';
    const effectiveLang = lang || versionLang(versionSelect.value);
    if (effectiveLang === 'en' && ENG_NAMES[code]) return ENG_NAMES[code];
    const override = BOOK_DISPLAY_OVERRIDES_NO[code];
    if (override) return override;
    const b = booksData.find(x => x.code === code);
    return b ? b.name : code;
}

function bookNameSingular(code, lang) {
    if (!code) return '';
    const effectiveLang = lang || versionLang(versionSelect.value);
    if (effectiveLang === 'en') return BOOK_DISPLAY_OVERRIDES_EN_SINGULAR[code] || ENG_NAMES[code] || code;
    const b = booksData.find(x => x.code === code);
    return b ? b.name : code;
}

function bookRefName(code) {
    if (!code) return '';
    const b = booksData.find(x => x.code === code);
    return b ? b.name : code;
}

function translateLabel(label, bookCode, lang) {
    if (!bookCode) return label;
    const effectiveLang = lang || versionLang(versionSelect.value);
    if (effectiveLang === 'no') return label;
    const engName = BOOK_DISPLAY_OVERRIDES_EN_SINGULAR[bookCode] || ENG_NAMES[bookCode];
    if (!engName) return label;
    const b = booksData.find(x => x.code === bookCode);
    const norwName = b ? b.name : null;
    if (norwName && label.startsWith(norwName)) return engName + label.slice(norwName.length);
    return label;
}

function maxVerseInChapter(bookCode, chapter) {
    const b = booksData.find(x => x.code === bookCode);
    return b && b.verse_counts ? (b.verse_counts[chapter] || 0) : 0;
}

window.goVerse = async function(bookCode, chapter, verse, bName, direction) {
    const maxCh = (booksData.find(b => b.code === bookCode) || {}).chapters || 0;
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
    await slideTransition(direction, async () => {
        searchInput.value = `${bName} ${targetCh}:${targetVerse}`;
        updateSearchHighlight();
        await doSearch();
    });
};

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

function toggleDisplayOptions() {
    const panel = document.getElementById('displayPanel');
    const btn = document.getElementById('displayOptionsBtn');
    const isOpen = panel.classList.toggle('open');
    const arrow = btn.querySelector('.display-arrow');
    if (arrow) arrow.innerHTML = isOpen ? '&#9660;' : '&#9658;';
}
