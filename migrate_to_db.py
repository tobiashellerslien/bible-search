#!/usr/bin/env python3
"""
Migrate Bible JSON files and cross_references.txt into bible.db (SQLite).
Run once from the project root: python migrate_to_db.py
"""

import json
import os
import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
BIBLE_DIR = BASE_DIR / "bibles"
DB_PATH = BASE_DIR / "bible.db"
XREF_PATH = BIBLE_DIR / "cross_references.txt"

# ── Translation metadata ─────────────────────────────────────────────────────
# (id = bible.com ID, name = display name used in UI and API, full_name, language)
TRANSLATIONS = [
    (1,    "KJV",        "King James Version",                   "en"),
    (29,   "Bibel 2011", "Bibelen 2011",                         "no"),
    (59,   "ESV",        "English Standard Version",             "en"),
    (100,  "NASB 1995",  "New American Standard Bible 1995",     "en"),
    (102,  "NB88/07",    "Norsk Bibel 1988/2007",                "no"),
    (111,  "NIV",        "New International Version",            "en"),
    (114,  "NKJV",       "New King James Version",               "en"),
    (121,  "Bibel 1930", "Bibelen 1930",                         "no"),
    (2216, "BGO",        "Bibelen Guds Ord 2017",                "no"),
]

# ── Books (usfm, order, name_no, name_en, testament) ─────────────────────────
BOOKS = [
    ("GEN", 1,  "1. Mosebok",            "Genesis",          "OT"),
    ("EXO", 2,  "2. Mosebok",            "Exodus",           "OT"),
    ("LEV", 3,  "3. Mosebok",            "Leviticus",        "OT"),
    ("NUM", 4,  "4. Mosebok",            "Numbers",          "OT"),
    ("DEU", 5,  "5. Mosebok",            "Deuteronomy",      "OT"),
    ("JOS", 6,  "Josva",                 "Joshua",           "OT"),
    ("JDG", 7,  "Dommerne",              "Judges",           "OT"),
    ("RUT", 8,  "Rut",                   "Ruth",             "OT"),
    ("1SA", 9,  "1. Samuelsbok",         "1 Samuel",         "OT"),
    ("2SA", 10, "2. Samuelsbok",         "2 Samuel",         "OT"),
    ("1KI", 11, "1. Kongebok",           "1 Kings",          "OT"),
    ("2KI", 12, "2. Kongebok",           "2 Kings",          "OT"),
    ("1CH", 13, "1. Krønikebok",         "1 Chronicles",     "OT"),
    ("2CH", 14, "2. Krønikebok",         "2 Chronicles",     "OT"),
    ("EZR", 15, "Esra",                  "Ezra",             "OT"),
    ("NEH", 16, "Nehemja",               "Nehemiah",         "OT"),
    ("EST", 17, "Ester",                 "Esther",           "OT"),
    ("JOB", 18, "Job",                   "Job",              "OT"),
    ("PSA", 19, "Salme",                 "Psalms",           "OT"),
    ("PRO", 20, "Ordspråkene",           "Proverbs",         "OT"),
    ("ECC", 21, "Forkynneren",           "Ecclesiastes",     "OT"),
    ("SNG", 22, "Høysangen",             "Song of Solomon",  "OT"),
    ("ISA", 23, "Jesaja",                "Isaiah",           "OT"),
    ("JER", 24, "Jeremia",               "Jeremiah",         "OT"),
    ("LAM", 25, "Klagesangene",          "Lamentations",     "OT"),
    ("EZK", 26, "Esekiel",               "Ezekiel",          "OT"),
    ("DAN", 27, "Daniel",                "Daniel",           "OT"),
    ("HOS", 28, "Hosea",                 "Hosea",            "OT"),
    ("JOL", 29, "Joel",                  "Joel",             "OT"),
    ("AMO", 30, "Amos",                  "Amos",             "OT"),
    ("OBA", 31, "Obadja",                "Obadiah",          "OT"),
    ("JON", 32, "Jona",                  "Jonah",            "OT"),
    ("MIC", 33, "Mika",                  "Micah",            "OT"),
    ("NAM", 34, "Nahum",                 "Nahum",            "OT"),
    ("HAB", 35, "Habakkuk",              "Habakkuk",         "OT"),
    ("ZEP", 36, "Sefanja",               "Zephaniah",        "OT"),
    ("HAG", 37, "Haggai",                "Haggai",           "OT"),
    ("ZEC", 38, "Sakarja",               "Zechariah",        "OT"),
    ("MAL", 39, "Malaki",                "Malachi",          "OT"),
    ("MAT", 40, "Matteus",               "Matthew",          "NT"),
    ("MRK", 41, "Markus",                "Mark",             "NT"),
    ("LUK", 42, "Lukas",                 "Luke",             "NT"),
    ("JHN", 43, "Johannes",              "John",             "NT"),
    ("ACT", 44, "Apostlenes gjerninger", "Acts",             "NT"),
    ("ROM", 45, "Romerne",               "Romans",           "NT"),
    ("1CO", 46, "1. Korinterbrev",       "1 Corinthians",    "NT"),
    ("2CO", 47, "2. Korinterbrev",       "2 Corinthians",    "NT"),
    ("GAL", 48, "Galaterne",             "Galatians",        "NT"),
    ("EPH", 49, "Efeserne",              "Ephesians",        "NT"),
    ("PHP", 50, "Filipperne",            "Philippians",      "NT"),
    ("COL", 51, "Kolosserne",            "Colossians",       "NT"),
    ("1TH", 52, "1. Tessalonikerbrev",   "1 Thessalonians",  "NT"),
    ("2TH", 53, "2. Tessalonikerbrev",   "2 Thessalonians",  "NT"),
    ("1TI", 54, "1. Timoteus",           "1 Timothy",        "NT"),
    ("2TI", 55, "2. Timoteus",           "2 Timothy",        "NT"),
    ("TIT", 56, "Titus",                 "Titus",            "NT"),
    ("PHM", 57, "Filemon",               "Philemon",         "NT"),
    ("HEB", 58, "Hebreerne",             "Hebrews",          "NT"),
    ("JAS", 59, "Jakob",                 "James",            "NT"),
    ("1PE", 60, "1. Peter",              "1 Peter",          "NT"),
    ("2PE", 61, "2. Peter",              "2 Peter",          "NT"),
    ("1JN", 62, "1. Johannesbrev",       "1 John",           "NT"),
    ("2JN", 63, "2. Johannesbrev",       "2 John",           "NT"),
    ("3JN", 64, "3. Johannesbrev",       "3 John",           "NT"),
    ("JUD", 65, "Judas",                 "Jude",             "NT"),
    ("REV", 66, "Åpenbaringen",          "Revelation",       "NT"),
]

_OT = [b[0] for b in BOOKS if b[4] == "OT"]
_NT = [b[0] for b in BOOKS if b[4] == "NT"]

# ── Book groups (key, name_no, name_en, [usfm, ...]) ─────────────────────────
BOOK_GROUPS = [
    ("gt",                 "Det Gamle Testamente",    "Old Testament",          _OT),
    ("nt",                 "Det Nye Testamente",       "New Testament",          _NT),
    ("mosebøkene",         "Mosebøkene",              "Pentateuch",             ["GEN","EXO","LEV","NUM","DEU"]),
    ("mosebøker",          "Mosebøkene",              "Pentateuch",             ["GEN","EXO","LEV","NUM","DEU"]),
    ("historiske",         "Historiske bøker",        "Historical Books",       ["JOS","JDG","RUT","1SA","2SA","1KI","2KI","1CH","2CH","EZR","NEH","EST"]),
    ("poetiske",           "Poetiske bøker",           "Poetic Books",           ["JOB","PSA","PRO","ECC","SNG"]),
    ("visdom",             "Visdomsbøkene",            "Wisdom Books",           ["JOB","PSA","PRO","ECC","SNG"]),
    ("profetene",          "Profetene",                "The Prophets",           ["ISA","JER","LAM","EZK","DAN","HOS","JOL","AMO","OBA","JON","MIC","NAM","HAB","ZEP","HAG","ZEC","MAL"]),
    ("store profeter",     "Store profeter",           "Major Prophets",         ["ISA","JER","LAM","EZK","DAN"]),
    ("små profeter",       "Små profeter",             "Minor Prophets",         ["HOS","JOL","AMO","OBA","JON","MIC","NAM","HAB","ZEP","HAG","ZEC","MAL"]),
    ("evangeliene",        "Evangeliene",              "The Gospels",            ["MAT","MRK","LUK","JHN"]),
    ("synoptiske",         "Synoptiske evangelier",    "Synoptic Gospels",       ["MAT","MRK","LUK"]),
    ("brev",               "Brevene",                  "The Epistles",           ["ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM","HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD"]),
    ("paulusbrevene",      "Paulusbrevene",            "Pauline Epistles",       ["ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM"]),
    ("fangenskapsbrev",    "Fangenskapsbrevene",       "Prison Epistles",        ["EPH","PHP","COL","PHM"]),
    ("pastorale brev",     "Pastorale brev",           "Pastoral Epistles",      ["1TI","2TI","TIT"]),
    ("almenne brev",       "Almenne brev",             "General Epistles",       ["HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD"]),
    ("johanneisk",         "Johanneisk litteratur",    "Johannine Literature",   ["JHN","1JN","2JN","3JN","REV"]),
    ("apokalyptiske",      "Apokalyptiske bøker",      "Apocalyptic Books",      ["DAN","REV"]),
    ("samuelsbøkene",      "Samuelsbøkene",            "Books of Samuel",        ["1SA","2SA"]),
    ("kongebøkene",        "Kongebøkene",              "Books of Kings",         ["1KI","2KI"]),
    ("krønikebøkene",      "Krønikebøkene",            "Books of Chronicles",    ["1CH","2CH"]),
    ("korinterbrevene",    "Korinterbrevene",          "Corinthian Letters",     ["1CO","2CO"]),
    ("tessalonikerbrevene","Tessalonikerbrevene",      "Thessalonian Letters",   ["1TH","2TH"]),
    ("timoteusbrevene",    "Timoteusbrevene",          "Letters to Timothy",     ["1TI","2TI"]),
    ("petersbrevene",      "Petersbrevene",            "Letters of Peter",       ["1PE","2PE"]),
    ("johannesbrevene",    "Johannesbrevene",          "Letters of John",        ["1JN","2JN","3JN"]),
    # Combined
    ("konger og krøniker", "Konger og Krøniker",       "Kings and Chronicles",   ["1KI","2KI","1CH","2CH"]),
    # English aliases
    ("ot",                 "Det Gamle Testamente",    "Old Testament",          _OT),
    ("old testament",      "Det Gamle Testamente",    "Old Testament",          _OT),
    ("pentateuch",         "Mosebøkene",              "Pentateuch",             ["GEN","EXO","LEV","NUM","DEU"]),
    ("torah",              "Mosebøkene",              "Torah",                  ["GEN","EXO","LEV","NUM","DEU"]),
    ("law",                "Mosebøkene",              "The Law",                ["GEN","EXO","LEV","NUM","DEU"]),
    ("historical",         "Historiske bøker",        "Historical Books",       ["JOS","JDG","RUT","1SA","2SA","1KI","2KI","1CH","2CH","EZR","NEH","EST"]),
    ("historical books",   "Historiske bøker",        "Historical Books",       ["JOS","JDG","RUT","1SA","2SA","1KI","2KI","1CH","2CH","EZR","NEH","EST"]),
    ("poetic",             "Poetiske bøker",           "Poetic Books",           ["JOB","PSA","PRO","ECC","SNG"]),
    ("poetry",             "Poetiske bøker",           "Poetry",                 ["JOB","PSA","PRO","ECC","SNG"]),
    ("wisdom",             "Visdomsbøkene",            "Wisdom Books",           ["JOB","PSA","PRO","ECC","SNG"]),
    ("wisdom books",       "Visdomsbøkene",            "Wisdom Books",           ["JOB","PSA","PRO","ECC","SNG"]),
    ("prophets",           "Profetene",                "The Prophets",           ["ISA","JER","LAM","EZK","DAN","HOS","JOL","AMO","OBA","JON","MIC","NAM","HAB","ZEP","HAG","ZEC","MAL"]),
    ("major prophets",     "Store profeter",           "Major Prophets",         ["ISA","JER","LAM","EZK","DAN"]),
    ("minor prophets",     "Små profeter",             "Minor Prophets",         ["HOS","JOL","AMO","OBA","JON","MIC","NAM","HAB","ZEP","HAG","ZEC","MAL"]),
    ("gospels",            "Evangeliene",              "The Gospels",            ["MAT","MRK","LUK","JHN"]),
    ("synoptic",           "Synoptiske evangelier",    "Synoptic Gospels",       ["MAT","MRK","LUK"]),
    ("synoptic gospels",   "Synoptiske evangelier",    "Synoptic Gospels",       ["MAT","MRK","LUK"]),
    ("epistles",           "Brevene",                  "The Epistles",           ["ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM","HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD"]),
    ("letters",            "Brevene",                  "The Letters",            ["ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM","HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD"]),
    ("pauline",            "Paulusbrevene",            "Pauline Epistles",       ["ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM"]),
    ("pauline epistles",   "Paulusbrevene",            "Pauline Epistles",       ["ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM"]),
    ("prison epistles",    "Fangenskapsbrevene",       "Prison Epistles",        ["EPH","PHP","COL","PHM"]),
    ("pastoral",           "Pastorale brev",           "Pastoral Epistles",      ["1TI","2TI","TIT"]),
    ("pastoral epistles",  "Pastorale brev",           "Pastoral Epistles",      ["1TI","2TI","TIT"]),
    ("general epistles",   "Almenne brev",             "General Epistles",       ["HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD"]),
    ("catholic epistles",  "Almenne brev",             "Catholic Epistles",      ["HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD"]),
    ("johannine",          "Johanneisk litteratur",    "Johannine Literature",   ["JHN","1JN","2JN","3JN","REV"]),
    ("johannine literature","Johanneisk litteratur",   "Johannine Literature",   ["JHN","1JN","2JN","3JN","REV"]),
    ("apocalyptic",        "Apokalyptiske bøker",      "Apocalyptic Books",      ["DAN","REV"]),
    ("books of samuel",    "Samuelsbøkene",            "Books of Samuel",        ["1SA","2SA"]),
    ("books of kings",     "Kongebøkene",              "Books of Kings",         ["1KI","2KI"]),
    ("books of chronicles","Krønikebøkene",            "Books of Chronicles",    ["1CH","2CH"]),
    ("corinthian letters", "Korinterbrevene",          "Corinthian Letters",     ["1CO","2CO"]),
    ("thessalonian letters","Tessalonikerbrevene",     "Thessalonian Letters",   ["1TH","2TH"]),
    ("letters to timothy", "Timoteusbrevene",          "Letters to Timothy",     ["1TI","2TI"]),
    ("letters of peter",   "Petersbrevene",            "Letters of Peter",       ["1PE","2PE"]),
    ("letters of john",    "Johannesbrevene",          "Letters of John",        ["1JN","2JN","3JN"]),
    ("kings and chronicles","Konger og Krøniker",      "Kings and Chronicles",   ["1KI","2KI","1CH","2CH"]),
]

# ── Cross-reference book name → USFM ─────────────────────────────────────────
XREF_TO_USFM = {
    'Gen': 'GEN', 'Exod': 'EXO', 'Lev': 'LEV', 'Num': 'NUM', 'Deut': 'DEU',
    'Josh': 'JOS', 'Judg': 'JDG', 'Ruth': 'RUT',
    '1Sam': '1SA', '2Sam': '2SA', '1Kgs': '1KI', '2Kgs': '2KI',
    '1Chr': '1CH', '2Chr': '2CH', 'Ezra': 'EZR', 'Neh': 'NEH', 'Esth': 'EST',
    'Job': 'JOB', 'Ps': 'PSA', 'Prov': 'PRO', 'Eccl': 'ECC', 'Song': 'SNG',
    'Isa': 'ISA', 'Jer': 'JER', 'Lam': 'LAM', 'Ezek': 'EZK', 'Dan': 'DAN',
    'Hos': 'HOS', 'Joel': 'JOL', 'Amos': 'AMO', 'Obad': 'OBA', 'Jonah': 'JON',
    'Mic': 'MIC', 'Nah': 'NAM', 'Hab': 'HAB', 'Zeph': 'ZEP', 'Hag': 'HAG',
    'Zech': 'ZEC', 'Mal': 'MAL',
    'Matt': 'MAT', 'Mark': 'MRK', 'Luke': 'LUK', 'John': 'JHN', 'Acts': 'ACT',
    'Rom': 'ROM', '1Cor': '1CO', '2Cor': '2CO', 'Gal': 'GAL', 'Eph': 'EPH',
    'Phil': 'PHP', 'Col': 'COL', '1Thess': '1TH', '2Thess': '2TH',
    '1Tim': '1TI', '2Tim': '2TI', 'Titus': 'TIT', 'Phlm': 'PHM',
    'Heb': 'HEB', 'Jas': 'JAS', '1Pet': '1PE', '2Pet': '2PE',
    '1John': '1JN', '2John': '2JN', '3John': '3JN', 'Jude': 'JUD', 'Rev': 'REV',
}

# ── Schema ────────────────────────────────────────────────────────────────────

SCHEMA = """
PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

CREATE TABLE translations (
    id          INTEGER PRIMARY KEY,
    name        TEXT NOT NULL,
    full_name   TEXT NOT NULL,
    language    TEXT NOT NULL
);

CREATE TABLE books (
    usfm        TEXT PRIMARY KEY,
    order_num   INTEGER NOT NULL,
    name_no     TEXT NOT NULL,
    name_en     TEXT NOT NULL,
    testament   TEXT NOT NULL CHECK(testament IN ('OT','NT'))
);

CREATE TABLE verses (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    translation_id  INTEGER NOT NULL REFERENCES translations(id),
    book_usfm       TEXT NOT NULL REFERENCES books(usfm),
    chapter         INTEGER NOT NULL,
    verse           INTEGER NOT NULL,
    text            TEXT NOT NULL,
    UNIQUE(translation_id, book_usfm, chapter, verse)
);
CREATE INDEX idx_verses_lookup ON verses(translation_id, book_usfm, chapter);

CREATE TABLE headings (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    translation_id  INTEGER NOT NULL REFERENCES translations(id),
    book_usfm       TEXT NOT NULL REFERENCES books(usfm),
    chapter         INTEGER NOT NULL,
    verse           INTEGER NOT NULL,
    text            TEXT NOT NULL
);
CREATE INDEX idx_headings_lookup ON headings(translation_id, book_usfm, chapter);

CREATE TABLE footnotes (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    translation_id  INTEGER NOT NULL REFERENCES translations(id),
    book_usfm       TEXT NOT NULL REFERENCES books(usfm),
    chapter         INTEGER NOT NULL,
    verse           INTEGER NOT NULL,
    text            TEXT NOT NULL
);
CREATE INDEX idx_footnotes_lookup ON footnotes(translation_id, book_usfm, chapter);

CREATE TABLE cross_references (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    from_book       TEXT NOT NULL REFERENCES books(usfm),
    from_chapter    INTEGER NOT NULL,
    from_verse      INTEGER NOT NULL,
    to_book         TEXT NOT NULL REFERENCES books(usfm),
    to_chapter      INTEGER NOT NULL,
    to_verse_start  INTEGER NOT NULL,
    to_verse_end    INTEGER,
    to_chapter_end  INTEGER,
    votes           INTEGER NOT NULL
);
CREATE INDEX idx_xref_lookup ON cross_references(from_book, from_chapter, from_verse);

CREATE TABLE book_groups (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    key     TEXT NOT NULL UNIQUE,
    name_no TEXT NOT NULL,
    name_en TEXT NOT NULL
);

CREATE TABLE book_group_members (
    group_id    INTEGER NOT NULL REFERENCES book_groups(id),
    book_usfm   TEXT NOT NULL REFERENCES books(usfm),
    PRIMARY KEY (group_id, book_usfm)
);

CREATE VIRTUAL TABLE verses_fts USING fts5(
    text,
    content='verses',
    content_rowid='id',
    tokenize='unicode61'
);
"""


def create_schema(conn):
    for statement in SCHEMA.strip().split(';'):
        s = statement.strip()
        if s:
            conn.execute(s)


def insert_static_data(conn):
    conn.executemany(
        "INSERT INTO translations(id, name, full_name, language) VALUES(?,?,?,?)",
        TRANSLATIONS,
    )
    conn.executemany(
        "INSERT INTO books(usfm, order_num, name_no, name_en, testament) VALUES(?,?,?,?,?)",
        BOOKS,
    )
    for key, name_no, name_en, members in BOOK_GROUPS:
        conn.execute(
            "INSERT INTO book_groups(key, name_no, name_en) VALUES(?,?,?)",
            (key, name_no, name_en),
        )
        gid = conn.execute("SELECT id FROM book_groups WHERE key=?", (key,)).fetchone()[0]
        conn.executemany(
            "INSERT OR IGNORE INTO book_group_members(group_id, book_usfm) VALUES(?,?)",
            [(gid, u) for u in members],
        )


def migrate_bibles(conn):
    valid_ids = {row[0] for row in conn.execute("SELECT id FROM translations")}

    verse_rows = []
    heading_rows = []
    footnote_rows = []

    for folder in sorted(BIBLE_DIR.iterdir()):
        if not folder.is_dir() or not folder.name.startswith("bible_"):
            continue
        parts = folder.name.split("_", 2)
        if len(parts) < 2:
            continue
        try:
            bible_id = int(parts[1])
        except ValueError:
            continue
        if bible_id not in valid_ids:
            print(f"  Warning: no entry for id={bible_id} ({folder.name}), skipping")
            continue

        book_count = 0
        for book_file in sorted(folder.glob("*.json")):
            stem_parts = book_file.stem.split("_", 2)
            if len(stem_parts) < 2:
                continue
            book_usfm = stem_parts[1]

            try:
                with open(book_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
            except Exception as e:
                print(f"  Warning: failed to load {book_file}: {e}")
                continue

            headings_raw = data.pop("headings", {})
            footnotes_raw = data.pop("footnotes", {})

            for key, text in data.items():
                if "+" in key:
                    # Combined verse key like PSA.54.2+PSA.54.3 — store under both verse numbers
                    for sub_key in key.split("+"):
                        kp = sub_key.split(".")
                        if len(kp) == 3:
                            try:
                                verse_rows.append((bible_id, book_usfm, int(kp[1]), int(kp[2]), text))
                            except ValueError:
                                pass
                    continue

                kp = key.split(".")
                if len(kp) != 3:
                    continue
                try:
                    verse_rows.append((bible_id, book_usfm, int(kp[1]), int(kp[2]), text))
                except ValueError:
                    pass

            for key, text in headings_raw.items():
                kp = key.split(".")
                if len(kp) == 3:
                    try:
                        heading_rows.append((bible_id, book_usfm, int(kp[1]), int(kp[2]), text))
                    except ValueError:
                        pass

            for key, text in footnotes_raw.items():
                kp = key.split(".")
                if len(kp) == 3:
                    try:
                        footnote_rows.append((bible_id, book_usfm, int(kp[1]), int(kp[2]), text))
                    except ValueError:
                        pass

            book_count += 1

        print(f"  Queued {book_count} books from {folder.name}")

    print(f"Inserting {len(verse_rows):,} verses...")
    conn.executemany(
        "INSERT OR IGNORE INTO verses(translation_id, book_usfm, chapter, verse, text) VALUES(?,?,?,?,?)",
        verse_rows,
    )
    print(f"Inserting {len(heading_rows):,} headings...")
    conn.executemany(
        "INSERT INTO headings(translation_id, book_usfm, chapter, verse, text) VALUES(?,?,?,?,?)",
        heading_rows,
    )
    print(f"Inserting {len(footnote_rows):,} footnotes...")
    conn.executemany(
        "INSERT INTO footnotes(translation_id, book_usfm, chapter, verse, text) VALUES(?,?,?,?,?)",
        footnote_rows,
    )


def _parse_xref_from(ref):
    """'Gen.1.1' → (book_usfm, chapter, verse) or None."""
    parts = ref.split(".")
    if len(parts) != 3:
        return None
    book = XREF_TO_USFM.get(parts[0])
    if not book:
        return None
    try:
        return book, int(parts[1]), int(parts[2])
    except ValueError:
        return None


def _parse_xref_to(ref):
    """'John.1.1' or 'John.1.1-John.1.3' → (book, ch, vs_start, vs_end, ch_end) or None.
    vs_end and ch_end are None for single verses; ch_end is None for same-chapter ranges."""
    dash = ref.find("-")
    if dash == -1:
        parts = ref.split(".")
        if len(parts) != 3:
            return None
        book = XREF_TO_USFM.get(parts[0])
        if not book:
            return None
        try:
            return book, int(parts[1]), int(parts[2]), None, None
        except ValueError:
            return None

    fp = ref[:dash].split(".")
    tp = ref[dash + 1:].split(".")
    if len(fp) != 3 or len(tp) != 3:
        return None
    book = XREF_TO_USFM.get(fp[0])
    if not book:
        return None
    try:
        ch_start, vs_start = int(fp[1]), int(fp[2])
        ch_end_raw, vs_end = int(tp[1]), int(tp[2])
        ch_end = ch_end_raw if ch_end_raw != ch_start else None
        return book, ch_start, vs_start, vs_end, ch_end
    except ValueError:
        return None


def migrate_cross_references(conn):
    if not XREF_PATH.exists():
        print("  cross_references.txt not found, skipping")
        return

    rows = []
    skipped = 0

    with open(XREF_PATH, "r", encoding="utf-8") as f:
        next(f)  # skip header line
        for line in f:
            parts = line.strip().split("\t")
            if len(parts) < 3:
                continue
            from_ref = _parse_xref_from(parts[0])
            to_ref = _parse_xref_to(parts[1])
            try:
                votes = int(parts[2])
            except ValueError:
                skipped += 1
                continue

            if from_ref is None or to_ref is None:
                skipped += 1
                continue

            rows.append((
                from_ref[0], from_ref[1], from_ref[2],
                to_ref[0], to_ref[1], to_ref[2], to_ref[3], to_ref[4],
                votes,
            ))

    # Most relevant first (highest votes)
    rows.sort(key=lambda r: r[8], reverse=True)

    print(f"Inserting {len(rows):,} cross references ({skipped} skipped)...")
    conn.executemany(
        """INSERT INTO cross_references
           (from_book, from_chapter, from_verse,
            to_book, to_chapter, to_verse_start, to_verse_end, to_chapter_end,
            votes)
           VALUES(?,?,?,?,?,?,?,?,?)""",
        rows,
    )


def build_fts_index(conn):
    conn.execute("INSERT INTO verses_fts(verses_fts) VALUES('rebuild')")


def main():
    if DB_PATH.exists():
        DB_PATH.unlink()
        print(f"Deleted existing {DB_PATH.name}")

    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys=ON")

    try:
        print("Creating schema...")
        create_schema(conn)

        print("Inserting static data (translations, books, groups)...")
        insert_static_data(conn)
        conn.commit()

        print("Migrating Bible content...")
        migrate_bibles(conn)
        conn.commit()

        print("Migrating cross references...")
        migrate_cross_references(conn)
        conn.commit()

        print("Building FTS5 index...")
        build_fts_index(conn)
        conn.commit()

        print("\nRow counts:")
        for table in [
            "translations", "books", "verses", "headings",
            "footnotes", "cross_references", "book_groups", "book_group_members",
        ]:
            n = conn.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
            print(f"  {table}: {n:,}")

        size_mb = DB_PATH.stat().st_size / 1024 / 1024
        print(f"\nDone! {DB_PATH.name} = {size_mb:.1f} MB")

    finally:
        conn.close()


if __name__ == "__main__":
    main()
