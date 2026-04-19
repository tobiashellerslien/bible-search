    // ── State ──
    let compareMode = false;
    let lastQuery = '';
    let mainData = null;
    let compareData = null;
    let currentView = 'normal'; // 'normal', 'text_search', 'all_versions'
    let booksData = [];
    let previousState = null; // for back button
    let allVersionsCache = null; // {results, label} for re-rendering
    let textSearchCache = null; // {results, query} for re-rendering
    let bookLang = localStorage.getItem('bookLang') || 'no'; // 'no' or 'en'
    let collapsed = true; // default: search results grouped by book

    // ── BibleHub interlinear URL mapping ──
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

    // ── Book name language helper ──
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

    function bookName(code) {
        if (bookLang === 'en' && ENG_NAMES[code]) return ENG_NAMES[code];
        const b = booksData.find(x => x.code === code);
        return b ? b.name : code;
    }

    // Translate a label like "Johannes 3:16" or "2. Samuelsbok 16:23" to current language
    function translateLabel(label, bookCode) {
        if (!bookCode) return label;
        const newName = bookName(bookCode);
        // Find the Norwegian name for this book to strip it from the label
        const b = booksData.find(x => x.code === bookCode);
        const norwName = b ? b.name : null;
        if (norwName && label.startsWith(norwName)) {
            return newName + label.slice(norwName.length);
        }
        // Fallback: try English name
        const engName = ENG_NAMES[bookCode];
        if (engName && label.startsWith(engName)) {
            return newName + label.slice(engName.length);
        }
        return label;
    }

    function interlinearUrl(bookCode, chapter, verseNum) {
        const slug = BIBLEHUB_SLUGS[bookCode];
        if (!slug) return null;
        if (verseNum != null) {
            return `https://biblehub.com/interlinear/${slug}/${chapter}-${verseNum}.htm`;
        }
        return `https://biblehub.com/interlinear/${slug}/${chapter}.htm`;
    }

    // ── Elements ──
    const searchInput = document.getElementById('searchInput');
    const versionSelect = document.getElementById('versionSelect');
    const searchBtn = document.getElementById('searchBtn');
    const compareBtn = document.getElementById('compareBtn');
    const toggleVerseNums = document.getElementById('toggleVerseNums');
    const toggleNewlines = document.getElementById('toggleNewlines');
    const resultsWrapper = document.getElementById('resultsWrapper');
    const compareVersionSelect = document.getElementById('compareVersionSelect');
    const emptyState = document.getElementById('emptyState');
    const emptyStateHtml = emptyState.outerHTML;
    const toast = document.getElementById('toast');
    const bookSelect = document.getElementById('bookSelect');
    const chapterSelect = document.getElementById('chapterSelect');

    // ── Version display names (folder name → display name) ──
    const VERSION_DISPLAY = {
        'NB88': 'NB88/07',
    };
    function versionLabel(v) { return VERSION_DISPLAY[v] || v; }

    // ── Init ──
    async function init() {
        const resp = await fetch('/api/versions');
        const data = await resp.json();
        data.versions.forEach(v => {
            versionSelect.add(new Option(versionLabel(v), v));
            compareVersionSelect.add(new Option(versionLabel(v), v));
        });
        // Default to NB88 if available
        if (data.versions.includes('NB88')) {
            versionSelect.value = 'NB88';
        }
        if (data.versions.length > 1) {
            compareVersionSelect.value = data.versions.find(v => v !== versionSelect.value) || data.versions[1];
        }
        loadBooks();
    }
    init();

    async function loadBooks() {
        const version = versionSelect.value || '';
        const resp = await fetch(`/api/books?version=${encodeURIComponent(version)}`);
        const data = await resp.json();
        booksData = data.books;
        refreshBookDropdown();
    }

    function refreshBookDropdown() {
        const prev = bookSelect.value;
        bookSelect.innerHTML = '<option value="">-- Book --</option>';
        booksData.forEach(b => {
            const name = bookLang === 'en' ? b.name_en : b.name;
            bookSelect.add(new Option(name, b.code));
        });
        bookSelect.value = prev;
        chapterSelect.innerHTML = '<option value="">-- Ch --</option>';
        chapterSelect.disabled = true;
    }

    versionSelect.addEventListener('change', () => {
        loadBooks();
        if (lastQuery) doSearch();
    });

    bookSelect.addEventListener('change', () => {
        const code = bookSelect.value;
        chapterSelect.innerHTML = '<option value="">-- Ch --</option>';
        if (!code) { chapterSelect.disabled = true; return; }
        const book = booksData.find(b => b.code === code);
        if (!book) return;
        for (let i = 1; i <= book.chapters; i++) {
            chapterSelect.add(new Option(i, i));
        }
        chapterSelect.disabled = false;
    });

    chapterSelect.addEventListener('change', () => {
        const code = bookSelect.value;
        const ch = chapterSelect.value;
        if (!code || !ch) return;
        const book = booksData.find(b => b.code === code);
        if (!book) return;
        searchInput.value = `${book.name} ${ch}`;
        doSearch();
    });

    // ── Heartbeat ──
    setInterval(() => fetch('/api/heartbeat').catch(() => {}), 3000);

    // ── Search ──
    searchBtn.addEventListener('click', doSearch);
    searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });

    async function doSearch() {
        const query = searchInput.value.trim();
        if (!query) return;
        lastQuery = query;
        previousState = null;
        currentView = 'normal';

        const version = versionSelect.value;
        try {
            const resp = await fetch(`/api/search?q=${encodeURIComponent(query)}&version=${encodeURIComponent(version)}`);
            const data = await resp.json();
            if (data.error) {
                resultsWrapper.innerHTML = errorCardHtml('Error', data.error);
                return;
            }

            if (data.type === 'text_search') {
                currentView = 'text_search';
                renderTextSearch(data.results, data.query);
                return;
            }

            mainData = data.results;
            if (compareMode) {
                await fetchCompareData(query);
            } else {
                compareData = null;
            }
            renderAll();
        } catch (err) {
            resultsWrapper.innerHTML = errorCardHtml('Error', 'Failed to connect to server.');
        }
    }

    async function fetchCompareData(query) {
        const version = compareVersionSelect.value;
        try {
            const resp = await fetch(`/api/search?q=${encodeURIComponent(query)}&version=${encodeURIComponent(version)}`);
            const data = await resp.json();
            if (data.type === 'reference' && !data.error) {
                compareData = data.results;
            } else {
                compareData = null;
            }
        } catch { compareData = null; }
    }

    // ── Compare toggle ──
    compareBtn.addEventListener('click', async () => {
        compareMode = !compareMode;
        compareBtn.classList.toggle('active', compareMode);
        if (compareMode && lastQuery && currentView === 'normal') {
            await fetchCompareData(lastQuery);
        } else {
            compareData = null;
        }
        if (currentView === 'normal') renderAll();
    });

    compareVersionSelect.addEventListener('change', async () => {
        if (compareMode && lastQuery && currentView === 'normal') {
            await fetchCompareData(lastQuery);
            renderAll();
        }
    });

    // ── Re-render on toggle change ──
    function onToggleChange() {
        if (currentView === 'normal' && mainData) renderAll();
        else if (currentView === 'all_versions' && allVersionsCache) renderAllVersions(allVersionsCache.results, allVersionsCache.label);
    }
    toggleVerseNums.addEventListener('change', onToggleChange);
    toggleNewlines.addEventListener('change', onToggleChange);

    // ── Render reference results ──
    function renderAll() {
        if (!mainData || mainData.length === 0) {
            resultsWrapper.innerHTML = emptyStateHtml;
            return;
        }

        const showNums = toggleVerseNums.checked;
        const showNewlines = toggleNewlines.checked;
        const showCompare = compareMode && compareData;
        let html = '';

        if (previousState) {
            html += '<div class="back-bar"><button class="back-btn" onclick="goBack()">&larr; Back</button></div>';
        }

        if (showCompare) {
            html += `<div class="compare-columns-header">
                <div class="column-label">${escHtml(versionLabel(versionSelect.value))}</div>
                <div class="column-label"><select id="compareVersionInline"></select></div>
            </div>`;
        }

        const count = Math.max(mainData.length, showCompare ? compareData.length : 0);

        for (let idx = 0; idx < count; idx++) {
            const mainBlock = idx < mainData.length ? mainData[idx] : null;
            const compBlock = showCompare && idx < compareData.length ? compareData[idx] : null;

            if (showCompare) {
                html += '<div class="verse-row">';
                html += buildCardHtml(mainBlock, idx, false, showNums, showNewlines);
                html += buildCardHtml(compBlock, idx, true, showNums, showNewlines);
                html += '</div>';
            } else {
                html += buildCardHtml(mainBlock, idx, false, showNums, showNewlines);
            }
        }

        resultsWrapper.innerHTML = html;

        // Wire up inline compare version dropdown
        if (showCompare) {
            const inline = document.getElementById('compareVersionInline');
            if (inline) {
                Array.from(compareVersionSelect.options).forEach(o => {
                    inline.add(new Option(o.text, o.value));
                });
                inline.value = compareVersionSelect.value;
                inline.addEventListener('change', () => {
                    compareVersionSelect.value = inline.value;
                    compareVersionSelect.dispatchEvent(new Event('change'));
                });
            }
        }
    }

    function buildCardHtml(block, idx, isCompare, showNums, showNewlines) {
        if (!block) return '<div class="verse-card" style="visibility:hidden;"></div>';
        if (block.error) {
            const lbl = block.book ? translateLabel(block.label || 'Error', block.book) : (block.label || 'Error');
            return `<div class="verse-card error-card">
                <div class="verse-card-header">
                    <span class="verse-card-label">${escHtml(lbl)}</span>
                </div>
                <div class="error-message">${escHtml(block.error)}</div>
            </div>`;
        }

        const displayLabel = translateLabel(block.label, block.book);
        const cardId = isCompare ? `compare-card-${idx}` : `card-${idx}`;
        let html = `<div class="verse-card" id="${cardId}">
            <div class="verse-card-header">
                <span class="verse-card-label">${escHtml(displayLabel)}</span>
                <button class="copy-btn" onclick="copyBlock(${idx}, ${isCompare})">Copy</button>
            </div>
            <div class="verse-text">`;

        html += renderVerseTextHtml(block.verses, showNums, showNewlines);
        html += '</div>';

        // Footer buttons
        if (!isCompare && block.book && block.verses.length > 0) {
            const ch = block.verses[0].chapter;
            const bName = bookName(block.book);
            const isSingleVerse = block.verses.length === 1;
            const ilUrl = interlinearUrl(block.book, ch, isSingleVerse ? block.verses[0].num : null);

            html += `<div class="verse-card-footer">
                <button class="card-action-btn" onclick="readChapter('${escAttr(block.book)}', ${ch}, '${escAttr(bName)}')">Read ${escHtml(bName)} ${ch}</button>
                <button class="card-action-btn" onclick="showAllVersions('${escAttr(block.label)}')">All versions</button>`;
            if (ilUrl) {
                html += `<a class="card-action-btn" href="${ilUrl}" target="_blank" rel="noopener" style="text-decoration:none;">Interlinear (biblehub.com)</a>`;
            }
            html += `</div>`;
        }

        html += '</div>';
        return html;
    }

    function renderVerseTextHtml(verses, showNums, showNewlines) {
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

            if (showNewlines && vi > 0 && v.chapter === lastChapter) html += '<br>';
            if (showNums) html += `<span class="verse-num">${v.num}</span>`;
            html += escHtml(v.text) + ' ';
            lastChapter = v.chapter;
        });
        return html;
    }

    // ── Text search results ──
    function renderTextSearch(results, query) {
        textSearchCache = { results, query };
        let html = '';
        if (results.length === 0) {
            html = `<div class="empty-state"><h2>No results</h2><p>No verses found matching "${escHtml(query)}".</p></div>`;
            resultsWrapper.innerHTML = html;
            return;
        }

        const total = results.length >= 150 ? '150+' : results.length;
        html += `<div class="search-controls">
            <div class="search-result-count" style="margin:0">${total} result${results.length !== 1 ? 's' : ''} for "${escHtml(query)}"</div>
            <button class="card-action-btn" onclick="toggleCollapse()">${collapsed ? 'Expand all' : 'Collapse by book'}</button>
        </div>`;

        if (collapsed) {
            // Group by book
            const groups = [];
            const bookOrder = [];
            const groupMap = {};
            results.forEach(r => {
                if (!groupMap[r.book]) {
                    groupMap[r.book] = [];
                    bookOrder.push(r.book);
                }
                groupMap[r.book].push(r);
            });

            bookOrder.forEach(code => {
                const items = groupMap[code];
                const bName = bookName(code);
                html += `<div class="book-group">
                    <div class="book-group-header" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')">
                        <span>${escHtml(bName)}<span class="book-group-count">(${items.length})</span></span>
                        <span class="chevron">&#9654;</span>
                    </div>
                    <div class="book-group-items">`;
                items.forEach(r => {
                    const ref = translateLabel(r.ref, r.book);
                    html += `<div class="search-result-item" onclick="goToVerse('${escAttr(r.ref)}')">
                        <div class="search-result-ref">${escHtml(ref)}</div>
                        <div class="search-result-text">${highlightWords(escHtml(r.text), query)}</div>
                    </div>`;
                });
                html += '</div></div>';
            });
        } else {
            results.forEach(r => {
                const ref = translateLabel(r.ref, r.book);
                html += `<div class="search-result-item" onclick="goToVerse('${escAttr(r.ref)}')">
                    <div class="search-result-ref">${escHtml(ref)}</div>
                    <div class="search-result-text">${highlightWords(escHtml(r.text), query)}</div>
                </div>`;
            });
        }

        resultsWrapper.innerHTML = html;
    }

    window.toggleCollapse = function() {
        collapsed = !collapsed;
        if (textSearchCache) renderTextSearch(textSearchCache.results, textSearchCache.query);
    };

    function highlightWords(htmlText, query) {
        const words = query.toLowerCase().split(/\s+/).filter(Boolean);
        words.forEach(w => {
            const regex = new RegExp(`(${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            htmlText = htmlText.replace(regex, '<b style="color:var(--accent)">$1</b>');
        });
        return htmlText;
    }

    window.goToVerse = function(ref) {
        searchInput.value = ref;
        doSearch();
    };

    // ── Read chapter ──
    window.readChapter = async function(bookCode, chapter, bookName) {
        previousState = { query: lastQuery, mainData, compareData, view: currentView };
        const query = `${bookName} ${chapter}`;
        searchInput.value = query;
        lastQuery = query;
        currentView = 'normal';

        const version = versionSelect.value;
        try {
            const resp = await fetch(`/api/search?q=${encodeURIComponent(query)}&version=${encodeURIComponent(version)}`);
            const data = await resp.json();
            if (data.type === 'reference' && !data.error) {
                mainData = data.results;
                compareData = null;
                if (compareMode) await fetchCompareData(query);
                renderAll();
            }
        } catch {}
    };

    // ── All versions ──
    window.showAllVersions = async function(label) {
        previousState = { query: lastQuery, mainData, compareData, view: currentView };
        currentView = 'all_versions';

        try {
            const resp = await fetch(`/api/all_versions?q=${encodeURIComponent(label)}`);
            const data = await resp.json();
            if (data.error) {
                resultsWrapper.innerHTML = errorCardHtml('Error', data.error);
                return;
            }
            renderAllVersions(data.results, label);
        } catch {
            resultsWrapper.innerHTML = errorCardHtml('Error', 'Failed to fetch versions.');
        }
    };

    function renderAllVersions(allResults, label) {
        allVersionsCache = { results: allResults, label };
        const showNums = toggleVerseNums.checked;
        const showNewlines = toggleNewlines.checked;

        // Get book code from first result to translate label
        const firstBlocks = Object.values(allResults)[0] || [];
        const bCode = firstBlocks[0]?.book;
        const displayLabel = bCode ? translateLabel(label, bCode) : label;

        let html = `<div class="back-bar"><button class="back-btn" onclick="goBack()">&larr; Back</button></div>`;
        html += `<div class="all-versions-block">
            <div class="verse-card-header" style="border-bottom:none;padding-bottom:0;margin-bottom:4px;">
                <span class="verse-card-label" style="font-size:1.15rem;">${escHtml(displayLabel)}</span>
            </div>`;

        for (const [versionName, blocks] of Object.entries(allResults)) {
            const verses = blocks.flatMap(b => b.verses || []);
            if (verses.length === 0) continue;

            html += `<div style="margin-bottom:18px;">
                <div class="version-label">${escHtml(versionName)}</div>
                <div class="verse-text">${renderVerseTextHtml(verses, showNums, showNewlines)}</div>
            </div>`;
        }

        html += '</div>';
        resultsWrapper.innerHTML = html;
    }

    window.goHome = function() {
        lastQuery = '';
        mainData = null;
        compareData = null;
        previousState = null;
        currentView = 'normal';
        textSearchCache = null;
        allVersionsCache = null;
        searchInput.value = '';
        resultsWrapper.innerHTML = emptyStateHtml;
    };

    window.goBack = function() {
        if (previousState) {
            lastQuery = previousState.query;
            mainData = previousState.mainData;
            compareData = previousState.compareData;
            currentView = previousState.view || 'normal';
            searchInput.value = lastQuery;
            previousState = null;
            if (currentView === 'normal') renderAll();
        }
    };

    // ── Copy ──
    window.copyBlock = function(blockIdx, isCompare) {
        const source = isCompare ? compareData : mainData;
        if (!source || !source[blockIdx]) return;
        const block = source[blockIdx];
        const showNums = toggleVerseNums.checked;
        const showNewlines = toggleNewlines.checked;

        let text = '';
        let lastChapter = null;
        const isMultiChapter = block.verses.some(x => x.chapter !== block.verses[0]?.chapter);

        block.verses.forEach((v, vi) => {
            if (isMultiChapter && v.chapter !== lastChapter) {
                if (vi > 0) text += '\n';
                text += `Chapter ${v.chapter}\n`;
                lastChapter = v.chapter;
            } else if (lastChapter === null) {
                lastChapter = v.chapter;
            }
            if (showNewlines && vi > 0 && v.chapter === lastChapter) text += '\n';
            if (showNums) text += `${v.num} `;
            text += v.text + ' ';
            lastChapter = v.chapter;
        });

        navigator.clipboard.writeText(text.trim()).then(() => showToast('Copied to clipboard!'));
    };

    function errorCardHtml(label, message) {
        return `<div class="verse-card error-card">
            <div class="verse-card-header"><span class="verse-card-label">${escHtml(label)}</span></div>
            <div class="error-message">${escHtml(message)}</div>
        </div>`;
    }

    // ── Toast ──
    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }

    // ── Language toggle ──
    const langToggle = document.getElementById('langToggle');
    function applyLang(lang) {
        bookLang = lang;
        langToggle.textContent = lang === 'en' ? 'EN' : 'NO';
        localStorage.setItem('bookLang', lang);
        refreshBookDropdown();
        // Re-render current view with new names
        if (currentView === 'normal' && mainData) renderAll();
        else if (currentView === 'text_search' && textSearchCache) renderTextSearch(textSearchCache.results, textSearchCache.query);
        else if (currentView === 'all_versions' && allVersionsCache) renderAllVersions(allVersionsCache.results, allVersionsCache.label);
    }
    langToggle.addEventListener('click', () => {
        applyLang(bookLang === 'en' ? 'no' : 'en');
    });
    langToggle.textContent = bookLang === 'en' ? 'EN' : 'NO';

    // ── Dark mode ──
    const darkToggle = document.getElementById('darkToggle');
    function applyTheme(dark) {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        darkToggle.innerHTML = dark ? '&#9788;' : '&#9790;';
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    }
    darkToggle.addEventListener('click', () => {
        applyTheme(document.documentElement.getAttribute('data-theme') !== 'dark');
    });
    applyTheme(localStorage.getItem('theme') === 'dark');

    // ── Utils ──
    function escHtml(s) {
        const d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
    }
    function escAttr(s) {
        return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    }
