import json
import re
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parents[2] / "bible.db"

# ── Book metadata (used by query parser — kept in-process for speed) ──────────

BOOKS = [
    ("GEN", 1,  "1. Mosebok",            ["1. mosebok","1.mosebok","1 mosebok","1mosebok","1. mos","1.mos","1 mos","1mos","genesis","gen","1mo"]),
    ("EXO", 2,  "2. Mosebok",            ["2. mosebok","2.mosebok","2 mosebok","2mosebok","2. mos","2.mos","2 mos","2mos","exodus","exo","exod","ex","2mo"]),
    ("LEV", 3,  "3. Mosebok",            ["3. mosebok","3.mosebok","3 mosebok","3mosebok","3. mos","3.mos","3 mos","3mos","leviticus","lev","3mo"]),
    ("NUM", 4,  "4. Mosebok",            ["4. mosebok","4.mosebok","4 mosebok","4mosebok","4. mos","4.mos","4 mos","4mos","numbers","num","4mo"]),
    ("DEU", 5,  "5. Mosebok",            ["5. mosebok","5.mosebok","5 mosebok","5mosebok","5. mos","5.mos","5 mos","5mos","deuteronomy","deut","deu","5mo"]),
    ("JOS", 6,  "Josva",                 ["josva","jos","joshua","josh"]),
    ("JDG", 7,  "Dommerne",              ["dommerne","dom","judges","judg","jdg"]),
    ("RUT", 8,  "Rut",                   ["rut","ruth"]),
    ("1SA", 9,  "1. Samuelsbok",         ["1. samuelsbok","1.samuelsbok","1 samuelsbok","1samuelsbok","1. sam","1.sam","1 sam","1sam","1. samuel","1.samuel","1 samuel","1samuel","1sa"]),
    ("2SA", 10, "2. Samuelsbok",         ["2. samuelsbok","2.samuelsbok","2 samuelsbok","2samuelsbok","2. sam","2.sam","2 sam","2sam","2. samuel","2.samuel","2 samuel","2samuel","2sa"]),
    ("1KI", 11, "1. Kongebok",           ["1. kongebok","1.kongebok","1 kongebok","1kongebok","1. kong","1.kong","1 kong","1kong","1. kings","1.kings","1 kings","1kings","1ki","1kgs"]),
    ("2KI", 12, "2. Kongebok",           ["2. kongebok","2.kongebok","2 kongebok","2kongebok","2. kong","2.kong","2 kong","2kong","2. kings","2.kings","2 kings","2kings","2ki","2kgs"]),
    ("1CH", 13, "1. Krønikebok",         ["1. krønikebok","1.krønikebok","1 krønikebok","1krønikebok","1. krøn","1.krøn","1 krøn","1krøn","1. chronicles","1.chronicles","1 chronicles","1chronicles","1ch","1chr"]),
    ("2CH", 14, "2. Krønikebok",         ["2. krønikebok","2.krønikebok","2 krønikebok","2krønikebok","2. krøn","2.krøn","2 krøn","2krøn","2. chronicles","2.chronicles","2 chronicles","2chronicles","2ch","2chr"]),
    ("EZR", 15, "Esra",                  ["esra","ezr","ezra"]),
    ("NEH", 16, "Nehemja",               ["nehemja","neh","nehemiah"]),
    ("EST", 17, "Ester",                 ["ester","est","esther"]),
    ("JOB", 18, "Job",                   ["job"]),
    ("PSA", 19, "Salme",                 ["salme","salmene","sal","sl","psalms","psalm","psa","ps"]),
    ("PRO", 20, "Ordspråkene",           ["ordspråkene","ordsp","ords","proverbs","prov","pro"]),
    ("ECC", 21, "Forkynneren",           ["forkynneren","fork","ecclesiastes","eccl","ecc","eccles"]),
    ("SNG", 22, "Høysangen",             ["høysangen","høys","song of solomon","song of songs","song","sng","sos"]),
    ("ISA", 23, "Jesaja",                ["jesaja","jes","isaiah","isa"]),
    ("JER", 24, "Jeremia",               ["jeremia","jer","jeremiah"]),
    ("LAM", 25, "Klagesangene",          ["klagesangene","klag","kl","lamentations","lam"]),
    ("EZK", 26, "Esekiel",               ["esekiel","esek","ezekiel","ezek","ezk"]),
    ("DAN", 27, "Daniel",                ["daniel","dan"]),
    ("HOS", 28, "Hosea",                 ["hosea","hos"]),
    ("JOL", 29, "Joel",                  ["joel","jol"]),
    ("AMO", 30, "Amos",                  ["amos","amo","am"]),
    ("OBA", 31, "Obadja",                ["obadja","ob","oba","obadiah"]),
    ("JON", 32, "Jona",                  ["jona","jonah","jon"]),
    ("MIC", 33, "Mika",                  ["mika","mi","micah","mic"]),
    ("NAM", 34, "Nahum",                 ["nahum","nah","na","nam"]),
    ("HAB", 35, "Habakkuk",              ["habakkuk","hab"]),
    ("ZEP", 36, "Sefanja",               ["sefanja","sef","zephaniah","zeph","zep"]),
    ("HAG", 37, "Haggai",                ["haggai","hag"]),
    ("ZEC", 38, "Sakarja",               ["sakarja","sak","zechariah","zech","zec"]),
    ("MAL", 39, "Malaki",                ["malaki","mal","malachi"]),
    ("MAT", 40, "Matteus",               ["matteus","matt","mat","matthew"]),
    ("MRK", 41, "Markus",                ["markus","mark","mrk","mk"]),
    ("LUK", 42, "Lukas",                 ["lukas","luk","lk","luke"]),
    ("JHN", 43, "Johannes",              ["johannes","joh","john","jhn","jn"]),
    ("ACT", 44, "Apostlenes gjerninger", ["apostlenes gjerninger","apostlenes","apg","acts","act"]),
    ("ROM", 45, "Romerne",               ["romerne","rom","romans"]),
    ("1CO", 46, "1. Korinterbrev",       ["1. korinterbrev","1.korinterbrev","1 korinterbrev","1korinterbrev","1. kor","1.kor","1 kor","1kor","1. corinthians","1.corinthians","1 corinthians","1corinthians","1co","1cor"]),
    ("2CO", 47, "2. Korinterbrev",       ["2. korinterbrev","2.korinterbrev","2 korinterbrev","2korinterbrev","2. kor","2.kor","2 kor","2kor","2. corinthians","2.corinthians","2 corinthians","2corinthians","2co","2cor"]),
    ("GAL", 48, "Galaterne",             ["galaterne","gal","galatians"]),
    ("EPH", 49, "Efeserne",              ["efeserne","ef","efe","ephesians","eph"]),
    ("PHP", 50, "Filipperne",            ["filipperne","fil","philippians","php","phil"]),
    ("COL", 51, "Kolosserne",            ["kolosserne","kol","colossians","col"]),
    ("1TH", 52, "1. Tessalonikerbrev",   ["1. tessalonikerbrev","1.tessalonikerbrev","1 tessalonikerbrev","1tessalonikerbrev","1. tess","1.tess","1 tess","1tess","1. thessalonians","1.thessalonians","1 thessalonians","1thessalonians","1th","1thess"]),
    ("2TH", 53, "2. Tessalonikerbrev",   ["2. tessalonikerbrev","2.tessalonikerbrev","2 tessalonikerbrev","2tessalonikerbrev","2. tess","2.tess","2 tess","2tess","2. thessalonians","2.thessalonians","2 thessalonians","2thessalonians","2th","2thess"]),
    ("1TI", 54, "1. Timoteus",           ["1. timoteus","1.timoteus","1 timoteus","1timoteus","1. tim","1.tim","1 tim","1tim","1. timothy","1.timothy","1 timothy","1timothy","1ti"]),
    ("2TI", 55, "2. Timoteus",           ["2. timoteus","2.timoteus","2 timoteus","2timoteus","2. tim","2.tim","2 tim","2tim","2. timothy","2.timothy","2 timothy","2timothy","2ti"]),
    ("TIT", 56, "Titus",                 ["titus","tit"]),
    ("PHM", 57, "Filemon",               ["filemon","filem","philemon","phlm","phm"]),
    ("HEB", 58, "Hebreerne",             ["hebreerne","hebr","heb","hebrews"]),
    ("JAS", 59, "Jakob",                 ["jakob","jak","james","jas"]),
    ("1PE", 60, "1. Peter",              ["1. peter","1.peter","1 peter","1peter","1. pet","1.pet","1 pet","1pet","1pe"]),
    ("2PE", 61, "2. Peter",              ["2. peter","2.peter","2 peter","2peter","2. pet","2.pet","2 pet","2pet","2pe"]),
    ("1JN", 62, "1. Johannesbrev",       ["1. johannesbrev","1.johannesbrev","1 johannesbrev","1johannesbrev","1. joh","1.joh","1 joh","1joh","1. john","1.john","1 john","1john","1jn"]),
    ("2JN", 63, "2. Johannesbrev",       ["2. johannesbrev","2.johannesbrev","2 johannesbrev","2johannesbrev","2. joh","2.joh","2 joh","2joh","2. john","2.john","2 john","2john","2jn"]),
    ("3JN", 64, "3. Johannesbrev",       ["3. johannesbrev","3.johannesbrev","3 johannesbrev","3johannesbrev","3. joh","3.joh","3 joh","3joh","3. john","3.john","3 john","3john","3jn"]),
    ("JUD", 65, "Judas",                 ["judas","jud","jude"]),
    ("REV", 66, "Åpenbaringen",          ["åpenbaringen","åpenb","åp","openbaringen","openb","op","revelation","rev"]),
]

USFM_TO_ENG = {
    "GEN":"Genesis","EXO":"Exodus","LEV":"Leviticus","NUM":"Numbers","DEU":"Deuteronomy",
    "JOS":"Joshua","JDG":"Judges","RUT":"Ruth","1SA":"1 Samuel","2SA":"2 Samuel",
    "1KI":"1 Kings","2KI":"2 Kings","1CH":"1 Chronicles","2CH":"2 Chronicles",
    "EZR":"Ezra","NEH":"Nehemiah","EST":"Esther","JOB":"Job","PSA":"Psalms",
    "PRO":"Proverbs","ECC":"Ecclesiastes","SNG":"Song of Solomon","ISA":"Isaiah",
    "JER":"Jeremiah","LAM":"Lamentations","EZK":"Ezekiel","DAN":"Daniel","HOS":"Hosea",
    "JOL":"Joel","AMO":"Amos","OBA":"Obadiah","JON":"Jonah","MIC":"Micah",
    "NAM":"Nahum","HAB":"Habakkuk","ZEP":"Zephaniah","HAG":"Haggai","ZEC":"Zechariah",
    "MAL":"Malachi","MAT":"Matthew","MRK":"Mark","LUK":"Luke","JHN":"John",
    "ACT":"Acts","ROM":"Romans","1CO":"1 Corinthians","2CO":"2 Corinthians",
    "GAL":"Galatians","EPH":"Ephesians","PHP":"Philippians","COL":"Colossians",
    "1TH":"1 Thessalonians","2TH":"2 Thessalonians","1TI":"1 Timothy","2TI":"2 Timothy",
    "TIT":"Titus","PHM":"Philemon","HEB":"Hebrews","JAS":"James","1PE":"1 Peter",
    "2PE":"2 Peter","1JN":"1 John","2JN":"2 John","3JN":"3 John","JUD":"Jude",
    "REV":"Revelation",
}

ALIAS_MAP = {}
USFM_TO_NAME = {}
USFM_TO_ORDER = {}

for _usfm, _order, _name, _aliases in BOOKS:
    USFM_TO_NAME[_usfm] = _name
    USFM_TO_ORDER[_usfm] = _order
    ALIAS_MAP[_usfm.lower()] = _usfm
    ALIAS_MAP[_name.lower()] = _usfm
    for _a in _aliases:
        ALIAS_MAP[_a.lower()] = _usfm

SORTED_ALIASES = sorted(ALIAS_MAP.keys(), key=len, reverse=True)
USFM_TO_ALIASES = {u: al for u, _, _, al in BOOKS}

_OT = ["GEN","EXO","LEV","NUM","DEU","JOS","JDG","RUT","1SA","2SA","1KI","2KI",
       "1CH","2CH","EZR","NEH","EST","JOB","PSA","PRO","ECC","SNG",
       "ISA","JER","LAM","EZK","DAN","HOS","JOL","AMO","OBA","JON","MIC",
       "NAM","HAB","ZEP","HAG","ZEC","MAL"]
_NT = ["MAT","MRK","LUK","JHN","ACT","ROM","1CO","2CO","GAL","EPH","PHP","COL",
       "1TH","2TH","1TI","2TI","TIT","PHM","HEB","JAS","1PE","2PE","1JN","2JN",
       "3JN","JUD","REV"]
USFM_TO_TESTAMENT = {**{c: "OT" for c in _OT}, **{c: "NT" for c in _NT}}

BOOK_GROUPS = {
    "gt": _OT,
    "nt": _NT,
    "mosebøkene": ["GEN","EXO","LEV","NUM","DEU"],
    "mosebøker":  ["GEN","EXO","LEV","NUM","DEU"],
    "historiske": ["JOS","JDG","RUT","1SA","2SA","1KI","2KI","1CH","2CH","EZR","NEH","EST"],
    "poetiske":   ["JOB","PSA","PRO","ECC","SNG"],
    "visdom":     ["JOB","PSA","PRO","ECC","SNG"],
    "profetene":  ["ISA","JER","LAM","EZK","DAN","HOS","JOL","AMO","OBA","JON","MIC","NAM","HAB","ZEP","HAG","ZEC","MAL"],
    "store profeter": ["ISA","JER","LAM","EZK","DAN"],
    "små profeter":   ["HOS","JOL","AMO","OBA","JON","MIC","NAM","HAB","ZEP","HAG","ZEC","MAL"],
    "evangeliene":    ["MAT","MRK","LUK","JHN"],
    "synoptiske":     ["MAT","MRK","LUK"],
    "brev": ["ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM","HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD"],
    "paulusbrevene":   ["ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM"],
    "fangenskapsbrev": ["EPH","PHP","COL","PHM"],
    "pastorale brev":  ["1TI","2TI","TIT"],
    "almenne brev":    ["HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD"],
    "johanneisk":      ["JHN","1JN","2JN","3JN","REV"],
    "apokalyptiske":   ["DAN","REV"],
    "samuelsbøkene":   ["1SA","2SA"],
    "kongebøkene":     ["1KI","2KI"],
    "krønikebøkene":   ["1CH","2CH"],
    "korinterbrevene": ["1CO","2CO"],
    "tessalonikerbrevene": ["1TH","2TH"],
    "timoteusbrevene": ["1TI","2TI"],
    "petersbrevene":   ["1PE","2PE"],
    "johannesbrevene": ["1JN","2JN","3JN"],
    # Combined group
    "konger og krøniker": ["1KI","2KI","1CH","2CH"],
    # English aliases — all resolve to the same book sets
    "ot":                 _OT,
    "old testament":      _OT,
    "new testament":      _NT,
    "pentateuch":         ["GEN","EXO","LEV","NUM","DEU"],
    "torah":              ["GEN","EXO","LEV","NUM","DEU"],
    "law":                ["GEN","EXO","LEV","NUM","DEU"],
    "historical":         ["JOS","JDG","RUT","1SA","2SA","1KI","2KI","1CH","2CH","EZR","NEH","EST"],
    "historical books":   ["JOS","JDG","RUT","1SA","2SA","1KI","2KI","1CH","2CH","EZR","NEH","EST"],
    "poetic":             ["JOB","PSA","PRO","ECC","SNG"],
    "poetry":             ["JOB","PSA","PRO","ECC","SNG"],
    "wisdom":             ["JOB","PSA","PRO","ECC","SNG"],
    "wisdom books":       ["JOB","PSA","PRO","ECC","SNG"],
    "prophets":           ["ISA","JER","LAM","EZK","DAN","HOS","JOL","AMO","OBA","JON","MIC","NAM","HAB","ZEP","HAG","ZEC","MAL"],
    "major prophets":     ["ISA","JER","LAM","EZK","DAN"],
    "minor prophets":     ["HOS","JOL","AMO","OBA","JON","MIC","NAM","HAB","ZEP","HAG","ZEC","MAL"],
    "gospels":            ["MAT","MRK","LUK","JHN"],
    "synoptic":           ["MAT","MRK","LUK"],
    "synoptic gospels":   ["MAT","MRK","LUK"],
    "epistles":           ["ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM","HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD"],
    "letters":            ["ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM","HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD"],
    "pauline":            ["ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM"],
    "pauline epistles":   ["ROM","1CO","2CO","GAL","EPH","PHP","COL","1TH","2TH","1TI","2TI","TIT","PHM"],
    "prison epistles":    ["EPH","PHP","COL","PHM"],
    "pastoral":           ["1TI","2TI","TIT"],
    "pastoral epistles":  ["1TI","2TI","TIT"],
    "general epistles":   ["HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD"],
    "catholic epistles":  ["HEB","JAS","1PE","2PE","1JN","2JN","3JN","JUD"],
    "johannine":          ["JHN","1JN","2JN","3JN","REV"],
    "johannine literature":["JHN","1JN","2JN","3JN","REV"],
    "apocalyptic":        ["DAN","REV"],
    "books of samuel":    ["1SA","2SA"],
    "books of kings":     ["1KI","2KI"],
    "books of chronicles":["1CH","2CH"],
    "corinthian letters": ["1CO","2CO"],
    "thessalonian letters":["1TH","2TH"],
    "letters to timothy": ["1TI","2TI"],
    "letters of peter":   ["1PE","2PE"],
    "letters of john":    ["1JN","2JN","3JN"],
    "kings and chronicles":["1KI","2KI","1CH","2CH"],
}

SORTED_GROUPS = sorted(BOOK_GROUPS.keys(), key=len, reverse=True)

# ── Versification remapping ───────────────────────────────────────────────────
# Some translations (Norwegian/Hebrew-based) use MT chapter/verse numbering,
# which differs from the English "standard" versification used by the TSK cross-
# reference dataset.  When a verse lookup fails, these rules let us retry with
# the correct MT coordinates.
#
# Format: { (book_usfm, eng_chapter): [(eng_v_min, eng_v_max, heb_chapter, heb_v_offset)] }
# Remapped verse = eng_verse + heb_v_offset  (in heb_chapter)
_VERSIFICATION_REMAP = {
    # Joel: Eng 2:28-32 → Heb 3:1-5;  Eng 3:1-21 → Heb 3:6-26
    ("JOL", 2): [(28, 32,  3, -27)],
    ("JOL", 3): [( 1, 21,  3,   5)],
    # Leviticus: Eng 6:1-7 → Heb 5:20-26;  Eng 6:8-30 → Heb 6:1-23
    ("LEV", 6): [( 1,  7,  5,  19), (8, 30, 6, -7)],
    # Zechariah: Eng 1:18-21 → Heb 2:1-4;  Eng 2:1-13 → Heb 2:5-17
    ("ZEC", 1): [(18, 21,  2, -17)],
    ("ZEC", 2): [( 1, 13,  2,   4)],
    # Ezekiel: Eng 20:45-49 → Heb 21:1-5;  Eng 21:1-32 → Heb 21:6-37
    ("EZK", 20): [(45, 49, 21, -44)],
    ("EZK", 21): [( 1, 32, 21,   5)],
}

# Sentinel checks to detect MT versification per translation.
# Format: { book_usfm: (sentinel_book, sentinel_ch, comparison, threshold) }
# 'lte': max_verse ≤ threshold  →  translation uses MT versification for that book
# 'gte': max_verse ≥ threshold  →  translation uses MT versification for that book
_VERSIFICATION_SENTINELS = {
    "JOL": ("JOL", 2, "lte", 27),
    "LEV": ("LEV", 5, "gte", 20),
    "ZEC": ("ZEC", 1, "lte", 17),
    "EZK": ("EZK", 20, "lte", 44),
}


# ── Bible data (SQLite-backed) ────────────────────────────────────────────────

class BibleData:
    def __init__(self, db_path=None):
        path = str(db_path or DB_PATH)
        self.db = sqlite3.connect(path, check_same_thread=False)
        self.db.execute("PRAGMA journal_mode=WAL")
        self.db.execute("PRAGMA foreign_keys=ON")
        self._load_metadata()

    def _load_metadata(self):
        self.translations = {}
        for row in self.db.execute(
            "SELECT id, name, full_name, language FROM translations ORDER BY id"
        ):
            self.translations[row[0]] = {
                "id": row[0], "name": row[1],
                "full_name": row[2], "language": row[3],
            }

        self.version_books = {}
        for tid, book_usfm in self.db.execute(
            """SELECT DISTINCT v.translation_id, v.book_usfm
               FROM verses v JOIN books b ON v.book_usfm = b.usfm
               ORDER BY v.translation_id, b.order_num"""
        ):
            self.version_books.setdefault(tid, []).append(book_usfm)

        self.book_chapters = {}
        for tid, book_usfm, max_ch in self.db.execute(
            "SELECT translation_id, book_usfm, MAX(chapter) FROM verses GROUP BY translation_id, book_usfm"
        ):
            self.book_chapters.setdefault(tid, {})[book_usfm] = max_ch

        self.book_verse_counts = {}
        for tid, book_usfm, chapter, max_v in self.db.execute(
            "SELECT translation_id, book_usfm, chapter, MAX(verse) FROM verses GROUP BY translation_id, book_usfm, chapter"
        ):
            self.book_verse_counts.setdefault(tid, {}).setdefault(book_usfm, {})[chapter] = max_v

        # Cache sentinel max-verses for versification detection
        self._versification_cache: dict = {}
        for _book, (_sb, _sc, _, _) in _VERSIFICATION_SENTINELS.items():
            for _tid, _mv in self.db.execute(
                "SELECT translation_id, MAX(verse) FROM verses WHERE book_usfm=? AND chapter=? GROUP BY translation_id",
                [_sb, _sc],
            ):
                self._versification_cache[(_tid, _sb, _sc)] = _mv

        names = ", ".join(t["name"] for t in self.translations.values())
        print(f"Loaded {len(self.translations)} Bible version(s): {names}")

    # ── Versification helpers ─────────────────────────────────────────────────

    def _uses_mt_versification(self, translation_id, book_usfm):
        if book_usfm not in _VERSIFICATION_SENTINELS:
            return False
        sent_book, sent_ch, comp, threshold = _VERSIFICATION_SENTINELS[book_usfm]
        mv = self._versification_cache.get((translation_id, sent_book, sent_ch))
        if mv is None:
            return False
        return (mv <= threshold) if comp == "lte" else (mv >= threshold)

    def _remap_verse(self, translation_id, book_usfm, chapter, verse):
        """Return (book, chapter, verse) remapped to MT versification, or None."""
        if not self._uses_mt_versification(translation_id, book_usfm):
            return None
        for v_min, v_max, heb_ch, offset in _VERSIFICATION_REMAP.get((book_usfm, chapter), []):
            if v_min <= verse <= v_max:
                return (book_usfm, heb_ch, verse + offset)
        return None

    def normalize_verse(self, translation_id, book_usfm, chapter, verse):
        """Return (book, chapter, verse) for this translation, remapping if needed."""
        remapped = self._remap_verse(translation_id, book_usfm, chapter, verse)
        return remapped if remapped else (book_usfm, chapter, verse)

    def normalize_reference(self, translation_id, book_usfm, chapter, verse_start, verse_end=None):
        """Remap English-versification coordinates to MT coordinates for this translation.
        Returns (book, chapter, verse_start, verse_end).
        """
        r_start = self._remap_verse(translation_id, book_usfm, chapter, verse_start)
        if r_start is None:
            return (book_usfm, chapter, verse_start, verse_end)
        rb, rc, rv = r_start
        if verse_end is not None:
            r_end = self._remap_verse(translation_id, book_usfm, chapter, verse_end)
            rv_end = r_end[2] if r_end is not None else rv + (verse_end - verse_start)
        else:
            rv_end = None
        return (rb, rc, rv, rv_end)

    # ── Verse retrieval ───────────────────────────────────────────────────────

    def get_verses(self, version_id, book_code, chapter, verse_start=None, verse_end=None):
        if version_id not in self.translations:
            return None, f"Version '{version_id}' not found"
        if book_code not in self.version_books.get(version_id, []):
            return None, f"Book '{book_code}' not found in version {version_id}"

        if verse_start is None:
            rows = self.db.execute(
                "SELECT verse, text FROM verses WHERE translation_id=? AND book_usfm=? AND chapter=? ORDER BY verse",
                [version_id, book_code, chapter],
            ).fetchall()
            if not rows:
                return None, f"Chapter {chapter} not found in {USFM_TO_NAME.get(book_code, book_code)}"
            return list(rows), None

        end = verse_end if verse_end is not None else verse_start
        rows = self.db.execute(
            """SELECT verse, text FROM verses
               WHERE translation_id=? AND book_usfm=? AND chapter=? AND verse>=? AND verse<=?
               ORDER BY verse""",
            [version_id, book_code, chapter, verse_start, end],
        ).fetchall()
        if not rows:
            ref = f"{chapter}:{verse_start}" + (f"-{verse_end}" if verse_end and verse_end != verse_start else "")
            return None, f"Verses {ref} not found in {USFM_TO_NAME.get(book_code, book_code)}"
        return list(rows), None

    def get_verses_cross_chapter(self, version_id, book_code, ch_start, vs_start, ch_end, vs_end):
        if version_id not in self.translations:
            return None, f"Version '{version_id}' not found"
        if book_code not in self.version_books.get(version_id, []):
            return None, f"Book '{book_code}' not found in version {version_id}"

        rows = self.db.execute(
            """SELECT verse, text, chapter FROM verses
               WHERE translation_id=? AND book_usfm=?
               AND chapter BETWEEN ? AND ?
               AND NOT (chapter=? AND verse<?)
               AND NOT (chapter=? AND verse>?)
               ORDER BY chapter, verse""",
            [version_id, book_code, ch_start, ch_end, ch_start, vs_start, ch_end, vs_end],
        ).fetchall()
        if not rows:
            return None, f"Verses {ch_start}:{vs_start}-{ch_end}:{vs_end} not found"
        return list(rows), None

    def get_footnotes(self, translation_id, book_usfm, ch_start, ch_end=None, vs_start=None, vs_end=None):
        if ch_end is None:
            ch_end = ch_start
        rows = self.db.execute(
            """SELECT chapter, verse, text FROM footnotes
               WHERE translation_id=? AND book_usfm=? AND chapter BETWEEN ? AND ?
               ORDER BY chapter, verse""",
            [translation_id, book_usfm, ch_start, ch_end],
        ).fetchall()
        result = []
        for ch, v, t in rows:
            if ch == ch_start and vs_start is not None and v < vs_start:
                continue
            if ch == ch_end and vs_end is not None and v > vs_end:
                continue
            result.append({"chapter": ch, "verse": v, "text": t})
        return result

    def get_headings(self, version_id, book_code, ch_start, ch_end, vs_start=None, vs_end=None):
        rows = self.db.execute(
            """SELECT chapter, verse, text FROM headings
               WHERE translation_id=? AND book_usfm=? AND chapter BETWEEN ? AND ?
               ORDER BY chapter, verse""",
            [version_id, book_code, ch_start, ch_end],
        ).fetchall()
        result = []
        for ch, v, t in rows:
            if ch == ch_start and vs_start is not None and v < vs_start:
                continue
            if ch == ch_end and vs_end is not None and v > vs_end:
                continue
            result.append({"chapter": ch, "verse": v, "text": t})
        return result

    def get_places_for_range(self, book_usfm, ch_start, vs_start=None, ch_end=None, vs_end=None):
        """Distinct places mentioned in a verse/chapter range. ch_end defaults to ch_start.
        If vs_start is None: whole chapter(s). Otherwise restricts first/last chapter to verse window.
        Returns list of {id, name, aliases, placemark, kind, geometry, refs} where refs is the list
        of (chapter, verse) hits within the queried range (used by the frontend to attach chips)."""
        if ch_end is None:
            ch_end = ch_start

        where = ["pv.book_usfm = ?", "pv.chapter BETWEEN ? AND ?"]
        params = [book_usfm, ch_start, ch_end]
        if vs_start is not None:
            where.append("NOT (pv.chapter = ? AND pv.verse < ?)")
            params.extend([ch_start, vs_start])
        if vs_end is not None:
            where.append("NOT (pv.chapter = ? AND pv.verse > ?)")
            params.extend([ch_end, vs_end])

        sql = (
            "SELECT p.id, p.name, p.aliases, p.placemark, p.kind, p.geometry, "
            "       pv.chapter, pv.verse "
            "FROM place_verses pv JOIN places p ON p.id = pv.place_id "
            f"WHERE {' AND '.join(where)} "
            "ORDER BY p.name, pv.chapter, pv.verse"
        )

        by_id = {}
        order = []
        for pid, name, aliases, placemark, kind, geometry, ch, vs in self.db.execute(sql, params):
            if pid not in by_id:
                by_id[pid] = {
                    "id": pid,
                    "name": name,
                    "aliases": json.loads(aliases) if aliases else [],
                    "placemark": placemark,
                    "kind": kind,
                    "geometry": json.loads(geometry),
                    "refs": [],
                }
                order.append(pid)
            by_id[pid]["refs"].append({"chapter": ch, "verse": vs})
        return [by_id[pid] for pid in order]

    def get_chapter_range(self, version_id, book_code, ch_start, ch_end):
        if version_id not in self.translations:
            return None, f"Version '{version_id}' not found"
        if book_code not in self.version_books.get(version_id, []):
            return None, f"Book '{book_code}' not found in version {version_id}"

        rows = self.db.execute(
            """SELECT verse, text, chapter FROM verses
               WHERE translation_id=? AND book_usfm=? AND chapter>=? AND chapter<=?
               ORDER BY chapter, verse""",
            [version_id, book_code, ch_start, ch_end],
        ).fetchall()
        if not rows:
            return None, f"Chapters {ch_start}-{ch_end} not found in {USFM_TO_NAME.get(book_code, book_code)}"
        return list(rows), None


# ── Query parser ──────────────────────────────────────────────────────────────

def identify_book(text):
    text_lower = text.lower().strip()
    for alias in SORTED_ALIASES:
        if text_lower.startswith(alias):
            rest = text_lower[len(alias):]
            if rest and rest[0].isalpha():
                continue
            return ALIAS_MAP[alias], text[len(alias):].strip()
    return None, text


def parse_reference(ref_str):
    ref_str = ref_str.strip()
    if not ref_str:
        return None
    m = re.match(r'^(\d+):(\d+)\s*-\s*(\d+):(\d+)$', ref_str)
    if m:
        return {"type": "cross_chapter", "ch_start": int(m.group(1)), "vs_start": int(m.group(2)), "ch_end": int(m.group(3)), "vs_end": int(m.group(4))}
    m = re.match(r'^(\d+):(\d+)\s*-\s*(\d+)$', ref_str)
    if m:
        return {"type": "verse_range", "chapter": int(m.group(1)), "vs_start": int(m.group(2)), "vs_end": int(m.group(3))}
    m = re.match(r'^(\d+):(\d+)$', ref_str)
    if m:
        return {"type": "single_verse", "chapter": int(m.group(1)), "verse": int(m.group(2))}
    m = re.match(r'^(\d+)\s*-\s*(\d+)$', ref_str)
    if m:
        return {"type": "chapter_range", "ch_start": int(m.group(1)), "ch_end": int(m.group(2))}
    m = re.match(r'^(\d+)$', ref_str)
    if m:
        return {"type": "number", "value": int(m.group(1))}
    return None


def parse_query(query):
    parts = [p.strip() for p in query.split(";") if p.strip()]
    blocks = []
    ctx_book = None
    ctx_chapter = None
    ctx_had_verse = False

    for part in parts:
        book_code, remainder = identify_book(part)
        if book_code:
            ctx_book = book_code
            ctx_chapter = None
            ctx_had_verse = False
        elif ctx_book is None:
            blocks.append({"error": f"Could not identify book in '{part}'"})
            continue

        ref = parse_reference(remainder) if remainder.strip() else None
        book = ctx_book
        book_name = USFM_TO_NAME.get(book, book)

        if ref is None and remainder.strip() == "":
            if book_code:
                blocks.append({"book": book, "label": book_name, "type": "whole_chapter", "chapter": 1, "is_single_chapter_book": True})
                ctx_chapter = 1
                ctx_had_verse = False
            else:
                blocks.append({"error": f"No reference provided in '{part}'"})
            continue

        if ref is None:
            blocks.append({"error": f"Could not parse reference '{part}'"})
            continue

        if ref["type"] == "cross_chapter":
            label = f"{book_name} {ref['ch_start']}:{ref['vs_start']}-{ref['ch_end']}:{ref['vs_end']}"
            blocks.append({"book": book, "label": label, "type": "cross_chapter", "ch_start": ref["ch_start"], "vs_start": ref["vs_start"], "ch_end": ref["ch_end"], "vs_end": ref["vs_end"]})
            ctx_chapter = ref["ch_end"]
            ctx_had_verse = True
        elif ref["type"] == "verse_range":
            label = f"{book_name} {ref['chapter']}:{ref['vs_start']}-{ref['vs_end']}"
            blocks.append({"book": book, "label": label, "type": "verse_range", "chapter": ref["chapter"], "vs_start": ref["vs_start"], "vs_end": ref["vs_end"]})
            ctx_chapter = ref["chapter"]
            ctx_had_verse = True
        elif ref["type"] == "single_verse":
            label = f"{book_name} {ref['chapter']}:{ref['verse']}"
            blocks.append({"book": book, "label": label, "type": "single_verse", "chapter": ref["chapter"], "verse": ref["verse"]})
            ctx_chapter = ref["chapter"]
            ctx_had_verse = True
        elif ref["type"] == "chapter_range":
            label = f"{book_name} {ref['ch_start']}-{ref['ch_end']}"
            blocks.append({"book": book, "label": label, "type": "chapter_range", "ch_start": ref["ch_start"], "ch_end": ref["ch_end"]})
            ctx_chapter = ref["ch_end"]
            ctx_had_verse = False
        elif ref["type"] == "number":
            val = ref["value"]
            if ctx_had_verse and ctx_chapter is not None:
                label = f"{book_name} {ctx_chapter}:{val}"
                blocks.append({"book": book, "label": label, "type": "single_verse", "chapter": ctx_chapter, "verse": val})
            else:
                label = f"{book_name} {val}"
                blocks.append({"book": book, "label": label, "type": "whole_chapter", "chapter": val})
                ctx_chapter = val
                ctx_had_verse = False

    return blocks


def resolve_block(bible_data, version_id, block):
    if "error" in block:
        return {"label": "Error", "error": block["error"], "verses": [], "headings": [], "footnotes": [], "xrefs": [], "places": []}
    book = block["book"]
    btype = block["type"]
    is_chapter = btype in ("whole_chapter", "chapter_range")
    base = {"label": block["label"], "book": book, "is_chapter": is_chapter, "footnotes": [], "xrefs": []}

    if btype == "single_verse":
        verses, err = bible_data.get_verses(version_id, book, block["chapter"], block["verse"])
        if err:
            return {**base, "error": err, "verses": [], "headings": [], "places": []}
        headings = bible_data.get_headings(version_id, book, block["chapter"], block["chapter"], block["verse"], block["verse"])
        footnotes = bible_data.get_footnotes(version_id, book, block["chapter"], block["chapter"], block["verse"], block["verse"])
        places = bible_data.get_places_for_range(book, block["chapter"], block["verse"], block["chapter"], block["verse"])
        return {**base, "verses": [{"num": v, "chapter": block["chapter"], "text": t} for v, t in verses], "headings": headings, "footnotes": footnotes, "places": places}
    elif btype == "verse_range":
        verses, err = bible_data.get_verses(version_id, book, block["chapter"], block["vs_start"], block["vs_end"])
        if err:
            return {**base, "error": err, "verses": [], "headings": [], "places": []}
        result_verses = [{"num": v, "chapter": block["chapter"], "text": t} for v, t in verses]
        if result_verses:
            a, z = result_verses[0]["num"], result_verses[-1]["num"]
            ch = block["chapter"]
            book_name = USFM_TO_NAME.get(book, book)
            base = {**base, "label": f"{book_name} {ch}:{a}" if a == z else f"{book_name} {ch}:{a}-{z}"}
        headings = bible_data.get_headings(version_id, book, block["chapter"], block["chapter"], block["vs_start"], block["vs_end"])
        footnotes = bible_data.get_footnotes(version_id, book, block["chapter"], block["chapter"], block["vs_start"], block["vs_end"])
        places = bible_data.get_places_for_range(book, block["chapter"], block["vs_start"], block["chapter"], block["vs_end"])
        return {**base, "verses": result_verses, "headings": headings, "footnotes": footnotes, "places": places}
    elif btype == "whole_chapter":
        verses, err = bible_data.get_verses(version_id, book, block["chapter"])
        if err:
            return {**base, "error": err, "verses": [], "headings": [], "places": []}
        headings = bible_data.get_headings(version_id, book, block["chapter"], block["chapter"])
        footnotes = bible_data.get_footnotes(version_id, book, block["chapter"])
        places = bible_data.get_places_for_range(book, block["chapter"])
        return {**base, "verses": [{"num": v, "chapter": block["chapter"], "text": t} for v, t in verses], "headings": headings, "footnotes": footnotes, "places": places}
    elif btype == "chapter_range":
        verses, err = bible_data.get_chapter_range(version_id, book, block["ch_start"], block["ch_end"])
        if err:
            return {**base, "error": err, "verses": [], "headings": [], "places": []}
        headings = bible_data.get_headings(version_id, book, block["ch_start"], block["ch_end"])
        footnotes = bible_data.get_footnotes(version_id, book, block["ch_start"], block["ch_end"])
        places = bible_data.get_places_for_range(book, block["ch_start"], None, block["ch_end"], None)
        return {**base, "verses": [{"num": v, "chapter": ch, "text": t} for v, t, ch in verses], "headings": headings, "footnotes": footnotes, "places": places}
    elif btype == "cross_chapter":
        verses, err = bible_data.get_verses_cross_chapter(version_id, book, block["ch_start"], block["vs_start"], block["ch_end"], block["vs_end"])
        if err:
            return {**base, "error": err, "verses": [], "headings": [], "places": []}
        result_verses = [{"num": v, "chapter": ch, "text": t} for v, t, ch in verses]
        if result_verses:
            fa, fz = result_verses[0]["chapter"], result_verses[0]["num"]
            la, lz = result_verses[-1]["chapter"], result_verses[-1]["num"]
            book_name = USFM_TO_NAME.get(book, book)
            if fa == la and fz == lz:
                base = {**base, "label": f"{book_name} {fa}:{fz}"}
            elif fa == la:
                base = {**base, "label": f"{book_name} {fa}:{fz}-{lz}"}
            else:
                base = {**base, "label": f"{book_name} {fa}:{fz}-{la}:{lz}"}
        headings = bible_data.get_headings(version_id, book, block["ch_start"], block["ch_end"], block["vs_start"], block["vs_end"])
        footnotes = bible_data.get_footnotes(version_id, book, block["ch_start"], block["ch_end"])
        places = bible_data.get_places_for_range(book, block["ch_start"], block["vs_start"], block["ch_end"], block["vs_end"])
        return {**base, "verses": result_verses, "headings": headings, "footnotes": footnotes, "places": places}

    return {"label": block.get("label", "?"), "error": "Unknown block type", "verses": [], "headings": [], "footnotes": [], "xrefs": [], "places": []}


def is_reference_query(query):
    first_part = query.split(";")[0].strip()
    query_lower = first_part.lower()
    for group_key in SORTED_GROUPS:
        if query_lower.startswith(group_key + ":"):
            return False
    if query_lower.startswith("book:"):
        return False
    book_code, remainder = identify_book(first_part)
    if book_code:
        remainder = remainder.strip()
        if not remainder:
            return False
        if remainder[0].isdigit():
            return True
        return False
    return False


# ── Text search ───────────────────────────────────────────────────────────────

def _tokenize_query(text):
    i = 0
    text = text.strip()
    while i < len(text):
        c = text[i]
        if c == ' ':
            i += 1
        elif c == '"':
            j = text.find('"', i + 1)
            if j == -1:
                i += 1
            else:
                phrase = text[i + 1:j]
                i = j + 1
                if phrase.strip():
                    yield ('phrase', phrase.strip())
        elif c == '-':
            if i + 1 < len(text) and text[i + 1] == '"':
                j = text.find('"', i + 2)
                if j == -1:
                    i += 2
                else:
                    phrase = text[i + 2:j]
                    i = j + 1
                    if phrase.strip():
                        yield ('exclude_phrase', phrase.strip())
            else:
                j = i + 1
                while j < len(text) and text[j] != ' ':
                    j += 1
                word = text[i + 1:j]
                i = j
                if word:
                    yield ('exclude', word)
        else:
            j = i
            while j < len(text) and text[j] not in (' ', '"'):
                j += 1
            word = text[i:j]
            i = j
            if not word:
                continue
            elif word == 'OR':
                yield ('OR',)
            else:
                yield ('word', word)


def parse_search_query(query):
    scope_codes = None
    query = query.strip()
    query_lower = query.lower()

    for group_key in SORTED_GROUPS:
        pattern = group_key + ':'
        if query_lower.startswith(pattern):
            scope_codes = BOOK_GROUPS[group_key]
            query = query[len(pattern):].strip()
            query_lower = query.lower()
            break

    if scope_codes is None:
        m = re.match(r'^book:(\S+)\s*(.*)', query, re.IGNORECASE)
        if m:
            code, _ = identify_book(m.group(1))
            if code:
                scope_codes = [code]
                query = m.group(2).strip()
                query_lower = query.lower()

    if scope_codes is None:
        code, remainder = identify_book(query)
        if code and remainder.startswith(':') and len(remainder) > 1 and not remainder[1:2].isdigit():
            scope_codes = [code]
            query = remainder[1:].strip()
            query_lower = query.lower()

    # Detect unknown group prefix (e.g. "tro: jesus" where "tro" is not a recognized group/book)
    if scope_codes is None:
        m_pfx = re.match(r'^([a-zA-ZæøåÆØÅ][a-zA-ZæøåÆØÅ ]*?):\s', query + ' ')
        if m_pfx:
            return {
                'scope': None, 'excluded': [], 'or_groups': [],
                'raw_terms': {'or_groups': [], 'excluded': []},
                'error': {'code': 'unknown_prefix', 'name': m_pfx.group(1).strip()},
            }

    # Empty query after scope strip
    if not query:
        return {
            'scope': scope_codes, 'or_groups': [],
            'raw_terms': {'or_groups': [], 'excluded': []},
            'error': {'code': 'empty_query'},
        }

    excluded_raw = []
    or_groups_raw = []
    current_and_raw = []

    for tok in _tokenize_query(query):
        kind = tok[0]
        if kind == 'exclude':
            excluded_raw.append(('word', tok[1]))
        elif kind == 'exclude_phrase':
            excluded_raw.append(('phrase', tok[1]))
        elif kind == 'OR':
            if current_and_raw:
                or_groups_raw.append(current_and_raw)
                current_and_raw = []
        elif kind == 'phrase':
            current_and_raw.append(('phrase', tok[1]))
        else:
            current_and_raw.append(('word', tok[1]))

    if current_and_raw:
        or_groups_raw.append(current_and_raw)

    return {
        'scope': scope_codes,
        'or_groups': or_groups_raw,
        'raw_terms': {'or_groups': or_groups_raw, 'excluded': excluded_raw},
    }


def _fts_escape(term):
    """Escape \" inside an FTS5 phrase literal."""
    return term.replace('"', '""')


def _like_escape(s):
    """Escape % and _ in LIKE patterns."""
    return s.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")


def _build_group_sql(group_raw, excluded_raw, version_id, books, select_cols):
    """Build (sql, params) for one OR-group.
    Quoted phrases use FTS5 MATCH (word-boundary). Bare words use LIKE (substring).
    Excluded phrases use FTS5 NOT when the group joins FTS, else NOT LIKE.
    Excluded words use NOT LIKE."""
    phrases = [v for k, v in group_raw if k == 'phrase']
    words = [v for k, v in group_raw if k == 'word']
    excl_phrases = [v for k, v in excluded_raw if k == 'phrase']
    excl_words = [v for k, v in excluded_raw if k == 'word']

    placeholders = ','.join('?' * len(books))
    where = ["v.translation_id = ?", f"v.book_usfm IN ({placeholders})"]
    params = [version_id, *books]

    if phrases:
        # Use IN-subquery so SQLite drives the search from FTS (cheap inverted index)
        # rather than scanning all verses for the translation and calling MATCH per row.
        match_parts = [f'"{_fts_escape(p)}"' for p in phrases]
        for ep in excl_phrases:
            match_parts.append(f'NOT "{_fts_escape(ep)}"')
        where.append("v.id IN (SELECT rowid FROM verses_fts WHERE verses_fts MATCH ?)")
        params.append(" ".join(match_parts))
    else:
        # No required phrases — fall back to NOT LIKE for excluded phrases (substring).
        for ep in excl_phrases:
            where.append("LOWER(v.text) NOT LIKE ? ESCAPE '\\'")
            params.append(f"%{_like_escape(ep.lower())}%")

    for w in words:
        where.append("LOWER(v.text) LIKE ? ESCAPE '\\'")
        params.append(f"%{_like_escape(w.lower())}%")

    for w in excl_words:
        where.append("LOWER(v.text) NOT LIKE ? ESCAPE '\\'")
        params.append(f"%{_like_escape(w.lower())}%")

    sql = f"SELECT {select_cols} FROM verses v WHERE {' AND '.join(where)}"
    return sql, params


def search_text(bible_data, version_id, query, per_book=20, book_filter=None):
    """Returns (results, book_totals).
    `per_book` caps verses per book in the returned list (None = uncapped).
    `book_filter` restricts the search to a single USFM code and bypasses the cap.
    `book_totals` always reports the true (uncapped) hit count per book."""
    parsed = parse_search_query(query)
    if not parsed['or_groups']:
        return [], {}

    scope = parsed['scope']
    books_to_search = bible_data.version_books.get(version_id, [])
    if scope:
        scope_set = set(scope)
        books_to_search = [c for c in books_to_search if c in scope_set]
    if book_filter:
        books_to_search = [c for c in books_to_search if c == book_filter]

    if not books_to_search:
        return [], {}

    or_groups_raw = parsed['raw_terms']['or_groups']
    excluded_raw = parsed['raw_terms']['excluded']

    seen = set()
    rows_by_book = {}
    for grp_raw in or_groups_raw:
        sql, params = _build_group_sql(
            grp_raw, excluded_raw, version_id, books_to_search,
            "v.book_usfm, v.chapter, v.verse, v.text",
        )
        for book_usfm, chapter, verse, text in bible_data.db.execute(sql, params):
            key = (book_usfm, chapter, verse)
            if key in seen:
                continue
            seen.add(key)
            rows_by_book.setdefault(book_usfm, []).append((chapter, verse, text))

    book_totals = {b: len(rs) for b, rs in rows_by_book.items()}
    # Bypass cap when search is scoped to a single book (explicit book_filter,
    # `book:` prefix, or `Joh:` style scope all collapse to one book).
    single_book = len(books_to_search) == 1
    cap = None if (book_filter or single_book or per_book is None) else per_book

    results = []
    for book_usfm in sorted(rows_by_book, key=lambda b: USFM_TO_ORDER.get(b, 99)):
        rows = sorted(rows_by_book[book_usfm], key=lambda r: (r[0], r[1]))
        if cap is not None:
            rows = rows[:cap]
        for chapter, verse, text in rows:
            results.append({
                "ref": f"{USFM_TO_NAME.get(book_usfm, book_usfm)} {chapter}:{verse}",
                "book": book_usfm,
                "chapter": chapter,
                "verse": verse,
                "text": text,
            })

    return results, book_totals


_QUICK_TOKEN_RE = re.compile(r"[\wÀ-ÿ]+", re.UNICODE)


def quick_search(bible_data, version_id, query, limit=25):
    """Fast live-search for finding a single half-remembered verse.

    Tokenizes on word chars, lower-cases, builds an FTS5 prefix-AND query
    (`tok1* tok2* ...`), ranks by bm25. Falls back to OR if AND returns nothing.
    Returns (results, truncated)."""
    tokens = [t.lower() for t in _QUICK_TOKEN_RE.findall(query or "")]
    # Drop tokens shorter than 2 chars except the last (so "lov" still works while typing).
    if len(tokens) > 1:
        tokens = [t for i, t in enumerate(tokens) if len(t) >= 2 or i == len(tokens) - 1]
    tokens = [t for t in tokens if t]
    if not tokens:
        return [], False
    if version_id not in bible_data.translations:
        return [], False

    def _run(match_expr):
        sql = (
            "SELECT v.book_usfm, v.chapter, v.verse, v.text "
            "FROM verses_fts fts "
            "JOIN verses v ON v.id = fts.rowid "
            "WHERE verses_fts MATCH ? AND v.translation_id = ? "
            "ORDER BY bm25(verses_fts), v.book_usfm, v.chapter, v.verse "
            "LIMIT ?"
        )
        return list(bible_data.db.execute(sql, (match_expr, version_id, limit + 1)))

    and_expr = " ".join(f'"{_fts_escape(t)}"*' for t in tokens)
    rows = _run(and_expr)

    if not rows and len(tokens) > 1:
        # Fallback: OR-of-prefixes catches single-typo / wrong-word cases.
        or_expr = " OR ".join(f'"{_fts_escape(t)}"*' for t in tokens)
        rows = _run(or_expr)

    truncated = len(rows) > limit
    rows = rows[:limit]
    results = [
        {
            "ref": f"{USFM_TO_NAME.get(book_usfm, book_usfm)} {chapter}:{verse}",
            "book": book_usfm,
            "chapter": chapter,
            "verse": verse,
            "text": text,
        }
        for book_usfm, chapter, verse, text in rows
    ]
    return results, truncated


def get_search_stats(bible_data, version_id, query):
    parsed = parse_search_query(query)
    if not parsed['or_groups']:
        return []

    books_all = bible_data.version_books.get(version_id, [])
    if not books_all:
        return []

    or_groups_raw = parsed['raw_terms']['or_groups']
    excluded_raw = parsed['raw_terms']['excluded']

    seen = set()
    hit_counts = {}
    for grp_raw in or_groups_raw:
        sql, params = _build_group_sql(
            grp_raw, excluded_raw, version_id, books_all,
            "v.book_usfm, v.chapter, v.verse",
        )
        for book_usfm, chapter, verse in bible_data.db.execute(sql, params):
            key = (book_usfm, chapter, verse)
            if key in seen:
                continue
            seen.add(key)
            hit_counts[book_usfm] = hit_counts.get(book_usfm, 0) + 1

    return [
        {
            'code': usfm,
            'name': USFM_TO_NAME.get(usfm, usfm),
            'name_en': USFM_TO_ENG.get(usfm, usfm),
            'count': hit_counts.get(usfm, 0),
            'order': USFM_TO_ORDER.get(usfm, 99),
        }
        for usfm in books_all
    ]


def strip_scope_from_query(query):
    q = query.strip()
    q_lower = q.lower()
    for group_key in SORTED_GROUPS:
        pattern = group_key + ':'
        if q_lower.startswith(pattern):
            return q[len(pattern):].strip(), group_key
    if q_lower.startswith('book:'):
        m = re.match(r'^book:(\S+)\s*(.*)', q, re.IGNORECASE)
        if m:
            code, _ = identify_book(m.group(1))
            if code:
                return m.group(2).strip(), USFM_TO_NAME.get(code, m.group(1))
    code, remainder = identify_book(q)
    if code and remainder.startswith(':') and len(remainder) > 1 and not remainder[1:2].isdigit():
        return remainder[1:].strip(), USFM_TO_NAME.get(code, code)
    return q, None
