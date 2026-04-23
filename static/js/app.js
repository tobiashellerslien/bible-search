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

const OT_BOOKS = new Set(['GEN','EXO','LEV','NUM','DEU','JOS','JDG','RUT','1SA','2SA','1KI','2KI','1CH','2CH','EZR','NEH','EST','JOB','PSA','PRO','ECC','SNG','ISA','JER','LAM','EZK','DAN','HOS','JOL','AMO','OBA','JON','MIC','NAM','HAB','ZEP','HAG','ZEC','MAL']);

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

const BOOK_CHAPTER_COUNTS = {
    'GEN':50,'EXO':40,'LEV':27,'NUM':36,'DEU':34,'JOS':24,'JDG':21,'RUT':4,
    '1SA':31,'2SA':24,'1KI':22,'2KI':25,'1CH':29,'2CH':36,'EZR':10,'NEH':13,
    'EST':10,'JOB':42,'PSA':150,'PRO':31,'ECC':12,'SNG':8,'ISA':66,'JER':52,
    'LAM':5,'EZK':48,'DAN':12,'HOS':14,'JOL':3,'AMO':9,'OBA':1,'JON':4,
    'MIC':7,'NAM':3,'HAB':3,'ZEP':3,'HAG':2,'ZEC':14,'MAL':4,'MAT':28,
    'MRK':16,'LUK':24,'JHN':21,'ACT':28,'ROM':16,'1CO':16,'2CO':13,'GAL':6,
    'EPH':6,'PHP':4,'COL':4,'1TH':5,'2TH':3,'1TI':6,'2TI':4,'TIT':3,'PHM':1,
    'HEB':13,'JAS':5,'1PE':5,'2PE':3,'1JN':5,'2JN':1,'3JN':1,'JUD':1,'REV':22
};
const BOOK_VERSE_COUNTS = {
    'GEN':1533,'EXO':1213,'LEV':859,'NUM':1288,'DEU':959,'JOS':658,'JDG':618,'RUT':85,
    '1SA':811,'2SA':695,'1KI':817,'2KI':719,'1CH':942,'2CH':822,'EZR':280,'NEH':406,
    'EST':167,'JOB':1070,'PSA':2527,'PRO':915,'ECC':222,'SNG':117,'ISA':1291,'JER':1364,
    'LAM':154,'EZK':1273,'DAN':356,'HOS':197,'JOL':73,'AMO':146,'OBA':21,'JON':48,
    'MIC':105,'NAM':47,'HAB':56,'ZEP':53,'HAG':38,'ZEC':211,'MAL':55,'MAT':1071,
    'MRK':678,'LUK':1151,'JHN':879,'ACT':1006,'ROM':433,'1CO':437,'2CO':256,'GAL':149,
    'EPH':155,'PHP':104,'COL':95,'1TH':89,'2TH':47,'1TI':113,'2TI':83,'TIT':46,'PHM':25,
    'HEB':303,'JAS':108,'1PE':105,'2PE':61,'1JN':105,'2JN':13,'3JN':15,'JUD':25,'REV':405
};

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
let currentHighlightVerses = null; // { chapter: number, verses: Set<number> } | null
let _preserveHighlight = false;
let lastStatsData = null;
let statsNormMode = 'total';

// ── Elements ──
const searchInput = document.getElementById('searchInput');
const searchHighlightOverlay = document.getElementById('searchHighlightOverlay');
const searchHighlightContent = document.getElementById('searchHighlightContent');
const versionSelect = document.getElementById('versionSelect');
const searchBtn = document.getElementById('searchBtn');
const toggleVerseNums = document.getElementById('toggleVerseNums');
const toggleNewlines = document.getElementById('toggleNewlines');
const toggleHeadings = document.getElementById('toggleHeadings');
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
        dvSel.value = versionSelect.value;
        dvSel.addEventListener('change', () => {
            localStorage.setItem('defaultVersion', dvSel.value);
            showToast('Default version saved');
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

setInterval(() => fetch('/api/heartbeat').catch(() => {}), 3000);

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

window.addEventListener('popstate', e => {
    if (e.state) {
        const { q, version, mode } = e.state;
        if (version && allVersionsList.some(x => String(x.id) === version)) versionSelect.value = version;
        if (q) {
            searchInput.value = q;
            updateSearchHighlight();
            if (mode === 'allversions') executeAllVersions(q);
            else doSearch(false, false);
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
        if (data.error) { resultsWrapper.innerHTML = errorCardHtml('Error', data.error); return; }

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
    } catch (err) {
        resultsWrapper.innerHTML = errorCardHtml('Error', 'Failed to connect to server.');
    }
}

function detectChapterInfo(results) {
    if (!results || results.length === 0) { currentChapterInfo = null; return; }
    const first = results[0];
    if (!first || !first.book || !first.verses || first.verses.length === 0) { currentChapterInfo = null; return; }
    const ch = first.verses[0].chapter;
    currentChapterInfo = { book: first.book, chapter: ch, bookName: bookRefName(first.book) };
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
    }
}
toggleVerseNums.addEventListener('change', onToggleChange);
toggleNewlines.addEventListener('change', onToggleChange);
toggleHeadings.addEventListener('change', onToggleChange);

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
    if (!mainData || mainData.length === 0) { resultsWrapper.innerHTML = emptyStateHtml; return; }
    const showNums = toggleVerseNums.checked;
    const showNewlines = toggleNewlines.checked;
    const showHeadings = toggleHeadings.checked;
    const mainLang = versionLang(versionSelect.value);
    let html = '';

    mainData.forEach((block, idx) => {
        html += buildCardHtml(block, idx, showNums, showNewlines, showHeadings, mainLang, versionSelect.value);
    });

    resultsWrapper.innerHTML = html;
}

function buildCardHtml(block, idx, showNums, showNewlines, showHeadings, lang, ver) {
    if (!block) return '';
    if (block.error) {
        const lbl = block.book ? translateLabel(block.label || 'Error', block.book, lang) : (block.label || 'Error');
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
        v.chapter === currentHighlightVerses.chapter && currentHighlightVerses.verses.has(v.num));
    const chipHtml = hasHighlight
        ? `<button class="copy-btn highlight-dismiss-btn" onclick="clearHighlight()" title="Fjern markering">${escHtml(buildHighlightChipLabel())} &times;</button>`
        : '';

    let html = `<div class="verse-card" id="${cardId}">
        <div class="verse-card-header">
            <div class="verse-card-header-left">
                <span class="verse-card-label">${escHtml(displayLabel)}</span>
                ${chipHtml}
            </div>
            <div class="verse-card-header-actions">
                <button class="copy-btn" onclick="copyBlockText(${idx})" title="Copy text only">copy txt</button>
                <button class="copy-btn" onclick="copyBlockRef(${idx})" title="Copy with reference">copy w/ ref</button>
                <button class="copy-btn compare-header-btn${compareVisible ? ' active' : ''}" onclick="toggleCardCompare(${idx})" title="Compare versions">compare</button>
            </div>
        </div>
        <div class="verse-text">`;

    html += renderVerseTextHtml(block.verses, showNums, showNewlines, showHeadings, block.book, lang, ver, block.headings || []);
    html += '</div>';

    if (block.book && block.verses.length > 0) {
        const ch = block.verses[0].chapter;
        const bName = bookRefName(block.book);
        const maxCh = (booksData.find(b => b.code === block.book) || {}).chapters || 0;
        const isSingleVerse = block.verses.length === 1;
        const ilUrl = interlinearUrl(block.book, ch, isSingleVerse ? block.verses[0].num : null);
        const allSameCh = block.verses.every(v => v.chapter === ch);

        // Compare section sits between verse text and footer
        html += `<div class="card-compare-section${compareVisible ? ' visible' : ''}" id="compare-section-${idx}">
            <div class="card-compare-header">
                <select class="card-compare-select" id="compare-select-${idx}" onchange="changeCardCompareVersion(${idx})">`;
        allVersionsList.forEach(v => {
            const vid = String(v.id);
            html += `<option value="${escAttr(vid)}"${vid === compareVer ? ' selected' : ''}>${escHtml(v.name)}</option>`;
        });
        html += `</select></div>
            <div class="card-compare-body" id="compare-body-${idx}">`;

        if (compareVisible) {
            if (cs && cs.data) {
                const compLang = versionLang(cs.version);
                html += `<div class="verse-text">${renderVerseTextHtml(cs.data.verses, showNums, showNewlines, showHeadings, cs.data.book, compLang, cs.version, cs.data.headings || [])}</div>`;
            } else {
                html += '<span style="color:var(--text-muted);font-size:0.85rem;">Loading...</span>';
            }
        }

        html += `</div></div>`;

        const verseNumsStr = block.verses.map(v => v.num).join(',');
        html += `<div class="verse-card-footer">
            <button class="card-action-btn" onclick="readChapter('${escAttr(block.book)}', ${ch}, '${escAttr(bName)}', '${verseNumsStr}')">&#128214; ${escHtml(bookNameSingular(block.book, lang))} ${ch}</button>
            <button class="card-action-btn" onclick="showAllVersions('${escAttr(block.label)}')">all versions</button>`;
        if (ilUrl) {
            html += `<a class="card-action-btn" href="${ilUrl}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:4px;"><img src="/static/biblehub.png" style="height:12px;opacity:0.8;" alt=""> interlinear</a>`;
        }
        if (allSameCh && maxCh > 0) {
            html += `<div class="chapter-nav">`;
            if (ch > 1) html += `<button class="card-action-btn" onclick="goChapter('${escAttr(block.book)}', ${ch - 1}, '${escAttr(bName)}')" title="Previous chapter">&#8592; ${ch - 1}</button>`;
            if (ch < maxCh) html += `<button class="card-action-btn" onclick="goChapter('${escAttr(block.book)}', ${ch + 1}, '${escAttr(bName)}')" title="Next chapter">${ch + 1} &#8594;</button>`;
            html += `</div>`;
        }
        html += `</div>`;
    }

    html += '</div>';
    return html;
}

// ── Card compare ──
window.toggleCardCompare = async function(idx) {
    if (!cardCompare[idx]) {
        const defaultVer = allVersionsList.find(v => String(v.id) !== versionSelect.value) || allVersionsList[0];
        cardCompare[idx] = { version: String(defaultVer.id), data: null, visible: true };
        renderAll();
        await loadCardCompareData(idx);
        renderAll();
    } else {
        cardCompare[idx].visible = !cardCompare[idx].visible;
        renderAll();
    }
};

window.changeCardCompareVersion = async function(idx) {
    const sel = document.getElementById(`compare-select-${idx}`);
    if (!sel || !cardCompare[idx]) return;
    cardCompare[idx].version = sel.value;
    cardCompare[idx].data = null;
    renderAll();
    await loadCardCompareData(idx);
    renderAll();
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
            cardCompare[idx].data = { error: data.error || 'Not found', verses: [] };
        }
    } catch {
        cardCompare[idx].data = { error: 'Failed to load', verses: [] };
    }
}

function isVerseHighlighted(v) {
    return !!(currentHighlightVerses
        && v.chapter === currentHighlightVerses.chapter
        && currentHighlightVerses.verses.has(v.num));
}

function renderVerseTextHtml(verses, showNums, showNewlines, showHeadings, bookCode, lang, ver, headings = []) {
    const headingMap = {};
    headings.forEach(h => {
        if (!headingMap[h.chapter]) headingMap[h.chapter] = {};
        headingMap[h.chapter][h.verse] = h.text;
    });

    let html = '';
    let lastChapter = null;
    const isMultiChapter = verses.some(x => x.chapter !== verses[0]?.chapter);

    verses.forEach((v, vi) => {
        if (isMultiChapter && v.chapter !== lastChapter) {
            if (vi > 0 && showNewlines) html += '<br>';
            html += `<div class="chapter-heading">Chapter ${v.chapter}</div>`;
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
            html += `<span class="verse-num" onclick="openSingleVerse('${bookCodeSafe}',${v.chapter},${v.num},'${refName}')" title="${bookRefName(bookCode)} ${v.chapter}:${v.num}">${v.num}</span>`;
        }
        html += escHtml(v.text);
        html += `</span> `;

        // Close wrapper after the last verse in a highlighted run
        if (highlighted && !nextHighlighted) html += '</span>';

        lastChapter = v.chapter;
    });
    return html;
}

window.goChapter = function(bookCode, chapter, bName) {
    currentHighlightVerses = null;
    searchInput.value = `${bName} ${chapter}`;
    updateSearchHighlight();
    doSearch();
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
            <h2>No results</h2>
            <p>No verses found for "${escHtml(query)}" in ${escHtml(versionLabel(versionSelect.value))}.</p>
            <button class="btn btn-secondary all-versions-search-btn" onclick="searchAllVersionsText('${escAttr(query)}')">Search in all versions</button>
        </div>`;
        resultsWrapper.innerHTML = html;
        return;
    }

    html += `<div class="search-controls">
        <div class="search-result-count">${results.length} result${results.length !== 1 ? 's' : ''} for "${escHtml(query)}"</div>
        <button class="card-action-btn" id="expandCollapseBtn" onclick="toggleGroups()">expand all</button>
        <button class="stats-btn" onclick="openStats('${escAttr(query)}')">&#128202; stats</button>
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
}

window.toggleGroup = function(headerEl) {
    headerEl.classList.toggle('open');
    headerEl.nextElementSibling.classList.toggle('open');
    updateExpandCollapseBtn();
};

window.toggleGroups = function() {
    const headers = resultsWrapper.querySelectorAll('.book-group-header');
    const items = resultsWrapper.querySelectorAll('.book-group-items');
    const anyOpen = [...headers].some(h => h.classList.contains('open'));
    headers.forEach(h => h.classList.toggle('open', !anyOpen));
    items.forEach(i => i.classList.toggle('open', !anyOpen));
    updateExpandCollapseBtn();
};

function updateExpandCollapseBtn() {
    const btn = document.getElementById('expandCollapseBtn');
    if (!btn) return;
    const anyOpen = [...resultsWrapper.querySelectorAll('.book-group-header')].some(h => h.classList.contains('open'));
    btn.textContent = anyOpen ? 'collapse all' : 'expand all';
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
    resultsWrapper.innerHTML = '<div class="empty-state"><h2>Searching...</h2><p>Searching all versions for "' + escHtml(query) + '"</p></div>';
    try {
        const resp = await fetch(`/api/all_text_search?q=${encodeURIComponent(query)}`);
        const data = await resp.json();
        if (data.error) { resultsWrapper.innerHTML = errorCardHtml('Error', data.error); return; }
        allVersionsTextCache = { results: data.results, query: data.query };
        renderAllVersionsTextSearch(data.results, data.query);
    } catch {
        resultsWrapper.innerHTML = errorCardHtml('Error', 'Failed to search.');
    }
};

function renderAllVersionsTextSearch(results, query) {
    const versionNames = Object.keys(results);
    if (versionNames.length === 0) {
        resultsWrapper.innerHTML = `<div class="empty-state"><h2>No results</h2><p>No verses found for "${escHtml(query)}" in any version.</p></div>`;
        return;
    }

    let totalCount = 0;
    versionNames.forEach(v => totalCount += results[v].length);

    let html = `<div class="search-controls">
        <div class="search-result-count">${totalCount} result${totalCount !== 1 ? 's' : ''} across ${versionNames.length} version${versionNames.length !== 1 ? 's' : ''} for "${escHtml(query)}"</div>
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
window.readChapter = async function(bookCode, chapter, bName, highlightNums) {
    if (highlightNums) {
        currentHighlightVerses = {
            chapter,
            verses: new Set(highlightNums.split(',').map(Number))
        };
    }
    _preserveHighlight = true;
    searchInput.value = `${bName} ${chapter}`;
    updateSearchHighlight();
    doSearch();
};

window.clearHighlight = function() {
    currentHighlightVerses = null;
    renderAll();
};

function buildHighlightChipLabel() {
    if (!currentHighlightVerses) return '';
    const sorted = [...currentHighlightVerses.verses].sort((a, b) => a - b);
    if (sorted.length === 0) return '';
    if (sorted.length === 1) return `vers ${sorted[0]}`;
    return `vers ${sorted[0]}–${sorted[sorted.length - 1]}`;
}

// ── All versions (reference) ──
async function executeAllVersions(label) {
    currentView = 'all_versions';
    try {
        const resp = await fetch(`/api/all_versions?q=${encodeURIComponent(label)}`);
        const data = await resp.json();
        if (data.error) { resultsWrapper.innerHTML = errorCardHtml('Error', data.error); return; }
        renderAllVersions(data.results, label);
    } catch { resultsWrapper.innerHTML = errorCardHtml('Error', 'Failed to fetch versions.'); }
}

window.showAllVersions = async function(label) {
    pushState(label, versionSelect.value, 'allversions');
    await executeAllVersions(label);
};

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
    for (const [versionName, blocks] of Object.entries(allResults)) {
        const verses = blocks.flatMap(b => b.verses || []);
        if (verses.length === 0) continue;
        const headings = blocks.flatMap(b => b.headings || []);
        const vLang = versionLang(versionName);
        html += `<div style="margin-bottom:16px;">
            <div class="version-label">${escHtml(versionLabel(versionName))}</div>
            <div class="verse-text">${renderVerseTextHtml(verses, showNums, showNewlines, showHeadings, bCode, vLang, versionName, headings)}</div>
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
    navigator.clipboard.writeText(text).then(() => showToast('Copied!'));
};

window.copyBlockRef = function(blockIdx) {
    if (!mainData || !mainData[blockIdx]) return;
    const block = mainData[blockIdx];
    const ver = versionSelect.value;
    const lang = versionLang(ver);
    const text = buildCopyText(block.verses);
    const label = translateLabel(block.label, block.book, lang);
    const full = `"${text}"\n\n${label} ${versionLabel(ver)}`;
    navigator.clipboard.writeText(full).then(() => showToast('Copied with reference!'));
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
        if (data.error) { showToast('Stats error: ' + data.error); return; }
        document.getElementById('statsModeSelect').value = statsNormMode;
        renderStatsModal(data);
        document.getElementById('statsModal').classList.add('open');
    } catch { showToast('Failed to load stats.'); }
};

function normalizeCount(count, code) {
    if (statsNormMode === 'per_chapter') return count / (BOOK_CHAPTER_COUNTS[code] || 1);
    if (statsNormMode === 'per_verse') return count / (BOOK_VERSE_COUNTS[code] || 1);
    return count;
}

function renderStatsModal(data) {
    lastStatsData = data;
    const { stats, total, query, scope_label } = data;
    const titleQuery = scope_label ? query : data.original_query;
    document.getElementById('statsModalTitle').textContent = `// Stats: "${titleQuery}"`;

    const withHits = stats.filter(s => s.count > 0);
    const otStats = stats.filter(s => OT_BOOKS.has(s.code));
    const ntStats = stats.filter(s => !OT_BOOKS.has(s.code));
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
        if (statsNormMode === 'per_chapter') return `${nc.toFixed(1)} / ch`;
        if (statsNormMode === 'per_verse') return `${nc.toFixed(3)} / vs`;
        return `${s.count} hits`;
    }

    let html = `<div class="stats-summary">
        <div class="stats-card"><div class="stats-card-label">Total hits</div><div class="stats-card-value">${total}</div></div>
        <div class="stats-card"><div class="stats-card-label">Books hit</div><div class="stats-card-value">${withHits.length}</div></div>
        <div class="stats-card"><div class="stats-card-label">GT hits</div><div class="stats-card-value">${otHits}</div></div>
        <div class="stats-card"><div class="stats-card-label">NT hits</div><div class="stats-card-value">${ntHits}</div></div>`;

    if (topOT) {
        html += `<div class="stats-card" style="cursor:pointer${otIsTop ? ';border-color:var(--accent)' : ''}" onclick="navigateToBookInResults('${topOT.code}')" title="Go to results">
            <div class="stats-card-label">${otIsTop ? '&#127942; ' : ''}Top GT</div>
            <div class="stats-card-value" style="font-size:0.85rem;">${escHtml(displayBookName(topOT))}<br><span style="font-size:0.75rem;opacity:0.7">${normLabel(topOT)}</span></div>
        </div>`;
    }
    if (topNT) {
        html += `<div class="stats-card" style="cursor:pointer${ntIsTop ? ';border-color:var(--accent)' : ''}" onclick="navigateToBookInResults('${topNT.code}')" title="Go to results">
            <div class="stats-card-label">${ntIsTop ? '&#127942; ' : ''}Top NT</div>
            <div class="stats-card-value" style="font-size:0.85rem;">${escHtml(displayBookName(topNT))}<br><span style="font-size:0.75rem;opacity:0.7">${normLabel(topNT)}</span></div>
        </div>`;
    }
    html += `</div>`;

    if (scope_label) {
        html += `<div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:8px;font-family:var(--font-mono);">
            Distribution shown for entire Bible (filtered to: ${escHtml(scope_label)})</div>`;
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
        const cls = OT_BOOKS.has(s.code) ? 'ot' : 'nt';
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
        group.querySelector('.book-group-items').classList.add('open');
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

// ── Help ──
window.openHelp = function() { document.getElementById('helpModal').classList.add('open'); };
document.getElementById('helpToggle').addEventListener('click', () => document.getElementById('helpModal').classList.toggle('open'));
document.getElementById('helpClose').addEventListener('click', () => document.getElementById('helpModal').classList.remove('open'));
document.getElementById('helpModal').addEventListener('click', e => {
    if (e.target === document.getElementById('helpModal')) document.getElementById('helpModal').classList.remove('open');
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
        return plural === exactToken || singular === exactToken || b.code.toLowerCase() === exactToken;
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
                <span class="ac-badge">filter</span>
                <span class="ac-desc">${escHtml(item.desc)}</span>
            </div>`;
        } else if (item.type === 'scope_book') {
            html += `<div class="ac-item${sel}" data-idx="${i}">
                <span>${escHtml(item.label)}</span>
                <span class="ac-badge">search in book</span>
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
        const { book, chapter, bookName: bName } = currentChapterInfo;
        const maxCh = (booksData.find(b => b.code === book) || {}).chapters || 0;
        if (e.key === 'ArrowLeft' && chapter > 1) goChapter(book, chapter - 1, bName);
        else if (e.key === 'ArrowRight' && chapter < maxCh) goChapter(book, chapter + 1, bName);
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
    document.querySelectorAll('.font-ui-btn').forEach(b => b.classList.toggle('active', b.dataset.val === val));
}
document.getElementById('fontUICtrl').addEventListener('click', e => {
    const btn = e.target.closest('.font-ui-btn');
    if (btn) applyFontUI(btn.dataset.val);
});
applyFontUI(localStorage.getItem('fontUI') || 'mono');


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

function interlinearUrl(bookCode, chapter, verseNum) {
    const slug = BIBLEHUB_SLUGS[bookCode];
    if (!slug) return null;
    return verseNum != null
        ? `https://biblehub.com/interlinear/${slug}/${chapter}-${verseNum}.htm`
        : `https://biblehub.com/interlinear/${slug}/${chapter}.htm`;
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
    const open = panel.hidden;
    panel.hidden = !open;
    btn.innerHTML = (open ? '&#9660;' : '&#9658;') + ' browse &amp; display';
}
