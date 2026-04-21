import json
import re
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
BIBLE_DIR = PROJECT_ROOT / "bibles"

BOOKS = [
    ("GEN", 1, "1. Mosebok", [
        "1. mosebok", "1.mosebok", "1 mosebok", "1mosebok",
        "1. mos", "1.mos", "1 mos", "1mos",
        "genesis", "gen", "1mo",
    ]),
    ("EXO", 2, "2. Mosebok", [
        "2. mosebok", "2.mosebok", "2 mosebok", "2mosebok",
        "2. mos", "2.mos", "2 mos", "2mos",
        "exodus", "exo", "exod", "ex", "2mo",
    ]),
    ("LEV", 3, "3. Mosebok", [
        "3. mosebok", "3.mosebok", "3 mosebok", "3mosebok",
        "3. mos", "3.mos", "3 mos", "3mos",
        "leviticus", "lev", "3mo",
    ]),
    ("NUM", 4, "4. Mosebok", [
        "4. mosebok", "4.mosebok", "4 mosebok", "4mosebok",
        "4. mos", "4.mos", "4 mos", "4mos",
        "numbers", "num", "4mo",
    ]),
    ("DEU", 5, "5. Mosebok", [
        "5. mosebok", "5.mosebok", "5 mosebok", "5mosebok",
        "5. mos", "5.mos", "5 mos", "5mos",
        "deuteronomy", "deut", "deu", "5mo",
    ]),
    ("JOS", 6, "Josva", ["josva", "jos", "joshua", "josh"]),
    ("JDG", 7, "Dommerne", ["dommerne", "dom", "judges", "judg", "jdg"]),
    ("RUT", 8, "Rut", ["rut", "ruth"]),
    ("1SA", 9, "1. Samuelsbok", [
        "1. samuelsbok", "1.samuelsbok", "1 samuelsbok", "1samuelsbok",
        "1. sam", "1.sam", "1 sam", "1sam",
        "1. samuel", "1.samuel", "1 samuel", "1samuel", "1sa",
    ]),
    ("2SA", 10, "2. Samuelsbok", [
        "2. samuelsbok", "2.samuelsbok", "2 samuelsbok", "2samuelsbok",
        "2. sam", "2.sam", "2 sam", "2sam",
        "2. samuel", "2.samuel", "2 samuel", "2samuel", "2sa",
    ]),
    ("1KI", 11, "1. Kongebok", [
        "1. kongebok", "1.kongebok", "1 kongebok", "1kongebok",
        "1. kong", "1.kong", "1 kong", "1kong",
        "1. kings", "1.kings", "1 kings", "1kings", "1ki", "1kgs",
    ]),
    ("2KI", 12, "2. Kongebok", [
        "2. kongebok", "2.kongebok", "2 kongebok", "2kongebok",
        "2. kong", "2.kong", "2 kong", "2kong",
        "2. kings", "2.kings", "2 kings", "2kings", "2ki", "2kgs",
    ]),
    ("1CH", 13, "1. Krønikebok", [
        "1. krønikebok", "1.krønikebok", "1 krønikebok", "1krønikebok",
        "1. krøn", "1.krøn", "1 krøn", "1krøn",
        "1. chronicles", "1.chronicles", "1 chronicles", "1chronicles", "1ch", "1chr",
    ]),
    ("2CH", 14, "2. Krønikebok", [
        "2. krønikebok", "2.krønikebok", "2 krønikebok", "2krønikebok",
        "2. krøn", "2.krøn", "2 krøn", "2krøn",
        "2. chronicles", "2.chronicles", "2 chronicles", "2chronicles", "2ch", "2chr",
    ]),
    ("EZR", 15, "Esra", ["esra", "ezr", "ezra"]),
    ("NEH", 16, "Nehemja", ["nehemja", "neh", "nehemiah"]),
    ("EST", 17, "Ester", ["ester", "est", "esther"]),
    ("JOB", 18, "Job", ["job"]),
    ("PSA", 19, "Salme", [
        "salme", "salmene", "sal", "sl",
        "psalms", "psalm", "psa", "ps",
    ]),
    ("PRO", 20, "Ordspråkene", ["ordspråkene", "ordsp", "ords", "proverbs", "prov", "pro"]),
    ("ECC", 21, "Forkynneren", ["forkynneren", "fork", "ecclesiastes", "eccl", "ecc", "eccles"]),
    ("SNG", 22, "Høysangen", [
        "høysangen", "høys",
        "song of solomon", "song of songs", "song", "sng", "sos",
    ]),
    ("ISA", 23, "Jesaja", ["jesaja", "jes", "isaiah", "isa"]),
    ("JER", 24, "Jeremia", ["jeremia", "jer", "jeremiah"]),
    ("LAM", 25, "Klagesangene", ["klagesangene", "klag", "kl", "lamentations", "lam"]),
    ("EZK", 26, "Esekiel", ["esekiel", "esek", "ezekiel", "ezek", "ezk"]),
    ("DAN", 27, "Daniel", ["daniel", "dan"]),
    ("HOS", 28, "Hosea", ["hosea", "hos"]),
    ("JOL", 29, "Joel", ["joel", "jol"]),
    ("AMO", 30, "Amos", ["amos", "amo", "am"]),
    ("OBA", 31, "Obadja", ["obadja", "ob", "oba", "obadiah"]),
    ("JON", 32, "Jona", ["jona", "jonah", "jon"]),
    ("MIC", 33, "Mika", ["mika", "mi", "micah", "mic"]),
    ("NAM", 34, "Nahum", ["nahum", "nah", "na", "nam"]),
    ("HAB", 35, "Habakkuk", ["habakkuk", "hab"]),
    ("ZEP", 36, "Sefanja", ["sefanja", "sef", "zephaniah", "zeph", "zep"]),
    ("HAG", 37, "Haggai", ["haggai", "hag"]),
    ("ZEC", 38, "Sakarja", ["sakarja", "sak", "zechariah", "zech", "zec"]),
    ("MAL", 39, "Malaki", ["malaki", "mal", "malachi"]),
    ("MAT", 40, "Matteus", ["matteus", "matt", "mat", "matthew"]),
    ("MRK", 41, "Markus", ["markus", "mark", "mrk", "mk"]),
    ("LUK", 42, "Lukas", ["lukas", "luk", "lk", "luke"]),
    ("JHN", 43, "Johannes", ["johannes", "joh", "john", "jhn", "jn"]),
    ("ACT", 44, "Apostlenes gjerninger", [
        "apostlenes gjerninger", "apostlenes", "apg", "acts", "act",
    ]),
    ("ROM", 45, "Romerne", ["romerne", "rom", "romans"]),
    ("1CO", 46, "1. Korinterbrev", [
        "1. korinterbrev", "1.korinterbrev", "1 korinterbrev", "1korinterbrev",
        "1. kor", "1.kor", "1 kor", "1kor",
        "1. corinthians", "1.corinthians", "1 corinthians", "1corinthians", "1co", "1cor",
    ]),
    ("2CO", 47, "2. Korinterbrev", [
        "2. korinterbrev", "2.korinterbrev", "2 korinterbrev", "2korinterbrev",
        "2. kor", "2.kor", "2 kor", "2kor",
        "2. corinthians", "2.corinthians", "2 corinthians", "2corinthians", "2co", "2cor",
    ]),
    ("GAL", 48, "Galaterne", ["galaterne", "gal", "galatians"]),
    ("EPH", 49, "Efeserne", ["efeserne", "ef", "efe", "ephesians", "eph"]),
    ("PHP", 50, "Filipperne", ["filipperne", "fil", "philippians", "php", "phil"]),
    ("COL", 51, "Kolosserne", ["kolosserne", "kol", "colossians", "col"]),
    ("1TH", 52, "1. Tessalonikerbrev", [
        "1. tessalonikerbrev", "1.tessalonikerbrev", "1 tessalonikerbrev", "1tessalonikerbrev",
        "1. tess", "1.tess", "1 tess", "1tess",
        "1. thessalonians", "1.thessalonians", "1 thessalonians", "1thessalonians", "1th", "1thess",
    ]),
    ("2TH", 53, "2. Tessalonikerbrev", [
        "2. tessalonikerbrev", "2.tessalonikerbrev", "2 tessalonikerbrev", "2tessalonikerbrev",
        "2. tess", "2.tess", "2 tess", "2tess",
        "2. thessalonians", "2.thessalonians", "2 thessalonians", "2thessalonians", "2th", "2thess",
    ]),
    ("1TI", 54, "1. Timoteus", [
        "1. timoteus", "1.timoteus", "1 timoteus", "1timoteus",
        "1. tim", "1.tim", "1 tim", "1tim",
        "1. timothy", "1.timothy", "1 timothy", "1timothy", "1ti",
    ]),
    ("2TI", 55, "2. Timoteus", [
        "2. timoteus", "2.timoteus", "2 timoteus", "2timoteus",
        "2. tim", "2.tim", "2 tim", "2tim",
        "2. timothy", "2.timothy", "2 timothy", "2timothy", "2ti",
    ]),
    ("TIT", 56, "Titus", ["titus", "tit"]),
    ("PHM", 57, "Filemon", ["filemon", "filem", "philemon", "phlm", "phm"]),
    ("HEB", 58, "Hebreerne", ["hebreerne", "hebr", "heb", "hebrews"]),
    ("JAS", 59, "Jakob", ["jakob", "jak", "james", "jas"]),
    ("1PE", 60, "1. Peter", [
        "1. peter", "1.peter", "1 peter", "1peter",
        "1. pet", "1.pet", "1 pet", "1pet", "1pe",
    ]),
    ("2PE", 61, "2. Peter", [
        "2. peter", "2.peter", "2 peter", "2peter",
        "2. pet", "2.pet", "2 pet", "2pet", "2pe",
    ]),
    ("1JN", 62, "1. Johannesbrev", [
        "1. johannesbrev", "1.johannesbrev", "1 johannesbrev", "1johannesbrev",
        "1. joh", "1.joh", "1 joh", "1joh",
        "1. john", "1.john", "1 john", "1john", "1jn",
    ]),
    ("2JN", 63, "2. Johannesbrev", [
        "2. johannesbrev", "2.johannesbrev", "2 johannesbrev", "2johannesbrev",
        "2. joh", "2.joh", "2 joh", "2joh",
        "2. john", "2.john", "2 john", "2john", "2jn",
    ]),
    ("3JN", 64, "3. Johannesbrev", [
        "3. johannesbrev", "3.johannesbrev", "3 johannesbrev", "3johannesbrev",
        "3. joh", "3.joh", "3 joh", "3joh",
        "3. john", "3.john", "3 john", "3john", "3jn",
    ]),
    ("JUD", 65, "Judas", ["judas", "jud", "jude"]),
    ("REV", 66, "Åpenbaringen", [
        "åpenbaringen", "åpenb", "åp",
        "openbaringen", "openb", "op",
        "revelation", "rev",
    ]),
]

USFM_TO_ENG = {
    "GEN": "Genesis", "EXO": "Exodus", "LEV": "Leviticus", "NUM": "Numbers",
    "DEU": "Deuteronomy", "JOS": "Joshua", "JDG": "Judges", "RUT": "Ruth",
    "1SA": "1 Samuel", "2SA": "2 Samuel", "1KI": "1 Kings", "2KI": "2 Kings",
    "1CH": "1 Chronicles", "2CH": "2 Chronicles", "EZR": "Ezra", "NEH": "Nehemiah",
    "EST": "Esther", "JOB": "Job", "PSA": "Psalms", "PRO": "Proverbs",
    "ECC": "Ecclesiastes", "SNG": "Song of Solomon", "ISA": "Isaiah", "JER": "Jeremiah",
    "LAM": "Lamentations", "EZK": "Ezekiel", "DAN": "Daniel", "HOS": "Hosea",
    "JOL": "Joel", "AMO": "Amos", "OBA": "Obadiah", "JON": "Jonah", "MIC": "Micah",
    "NAM": "Nahum", "HAB": "Habakkuk", "ZEP": "Zephaniah", "HAG": "Haggai",
    "ZEC": "Zechariah", "MAL": "Malachi", "MAT": "Matthew", "MRK": "Mark",
    "LUK": "Luke", "JHN": "John", "ACT": "Acts", "ROM": "Romans",
    "1CO": "1 Corinthians", "2CO": "2 Corinthians", "GAL": "Galatians",
    "EPH": "Ephesians", "PHP": "Philippians", "COL": "Colossians",
    "1TH": "1 Thessalonians", "2TH": "2 Thessalonians",
    "1TI": "1 Timothy", "2TI": "2 Timothy", "TIT": "Titus", "PHM": "Philemon",
    "HEB": "Hebrews", "JAS": "James", "1PE": "1 Peter", "2PE": "2 Peter",
    "1JN": "1 John", "2JN": "2 John", "3JN": "3 John", "JUD": "Jude",
    "REV": "Revelation",
}

ALIAS_MAP = {}
USFM_TO_NAME = {}
USFM_TO_ORDER = {}

for usfm, order, norw_name, aliases in BOOKS:
    USFM_TO_NAME[usfm] = norw_name
    USFM_TO_ORDER[usfm] = order
    ALIAS_MAP[usfm.lower()] = usfm
    ALIAS_MAP[norw_name.lower()] = usfm
    for alias in aliases:
        ALIAS_MAP[alias.lower()] = usfm

SORTED_ALIASES = sorted(ALIAS_MAP.keys(), key=len, reverse=True)

# ── Book groups for scoped search ──

_OT = ['GEN','EXO','LEV','NUM','DEU','JOS','JDG','RUT','1SA','2SA','1KI','2KI',
       '1CH','2CH','EZR','NEH','EST','JOB','PSA','PRO','ECC','SNG',
       'ISA','JER','LAM','EZK','DAN','HOS','JOL','AMO','OBA','JON','MIC',
       'NAM','HAB','ZEP','HAG','ZEC','MAL']
_NT = ['MAT','MRK','LUK','JHN','ACT','ROM','1CO','2CO','GAL','EPH','PHP','COL',
       '1TH','2TH','1TI','2TI','TIT','PHM','HEB','JAS','1PE','2PE','1JN','2JN',
       '3JN','JUD','REV']

BOOK_GROUPS = {
    'gt': _OT,
    'nt': _NT,
    'mosebøkene': ['GEN','EXO','LEV','NUM','DEU'],
    'mosebøker': ['GEN','EXO','LEV','NUM','DEU'],
    'historiske': ['JOS','JDG','RUT','1SA','2SA','1KI','2KI','1CH','2CH','EZR','NEH','EST'],
    'poetiske': ['JOB','PSA','PRO','ECC','SNG'],
    'visdom': ['JOB','PSA','PRO','ECC','SNG'],
    'profetene': ['ISA','JER','LAM','EZK','DAN','HOS','JOL','AMO','OBA','JON','MIC','NAM','HAB','ZEP','HAG','ZEC','MAL'],
    'store profeter': ['ISA','JER','LAM','EZK','DAN'],
    'små profeter': ['HOS','JOL','AMO','OBA','JON','MIC','NAM','HAB','ZEP','HAG','ZEC','MAL'],
    'evangeliene': ['MAT','MRK','LUK','JHN'],
    'brev': ['ROM','1CO','2CO','GAL','EPH','PHP','COL','1TH','2TH','1TI','2TI','TIT','PHM','HEB','JAS','1PE','2PE','1JN','2JN','3JN','JUD'],
    'paulusbrevene': ['ROM','1CO','2CO','GAL','EPH','PHP','COL','1TH','2TH','1TI','2TI','TIT','PHM'],
    'almenne brev': ['HEB','JAS','1PE','2PE','1JN','2JN','3JN','JUD'],
}

SORTED_GROUPS = sorted(BOOK_GROUPS.keys(), key=len, reverse=True)


# ── Bible data loading ──

class BibleData:
    def __init__(self):
        self.versions = {}
        self.version_books = {}
        self.book_chapters = {}
        self._load_all()

    def _load_all(self):
        if not BIBLE_DIR.exists():
            print(f"Warning: {BIBLE_DIR} not found")
            return
        for version_dir in sorted(BIBLE_DIR.iterdir()):
            if not version_dir.is_dir():
                continue
            vname = version_dir.name
            self.versions[vname] = {}
            self.book_chapters[vname] = {}
            codes = []
            for book_file in sorted(version_dir.glob("*.json")):
                parts = book_file.stem.split("_", 2)
                if len(parts) < 2:
                    continue
                code = parts[1]
                try:
                    with open(book_file, "r", encoding="utf-8") as f:
                        self.versions[vname][code] = json.load(f)
                    codes.append(code)
                    max_ch = 0
                    for key in self.versions[vname][code]:
                        kparts = key.split(".")
                        if len(kparts) < 2:
                            continue
                        try:
                            ch = int(kparts[1])
                        except ValueError:
                            continue
                        if ch > max_ch:
                            max_ch = ch
                    self.book_chapters[vname][code] = max_ch
                except Exception as e:
                    print(f"Warning: Failed to load {book_file}: {e}")
            self.version_books[vname] = codes
        print(f"Loaded {len(self.versions)} Bible version(s): {', '.join(self.versions.keys())}")

    def get_verses(self, version, book_code, chapter, verse_start=None, verse_end=None):
        if version not in self.versions:
            return None, f"Version '{version}' not found"
        if book_code not in self.versions[version]:
            return None, f"Book '{book_code}' not found in {version}"
        data = self.versions[version][book_code]
        results = []
        if verse_start is None:
            prefix = f"{book_code}.{chapter}."
            for key, text in data.items():
                if key.startswith(prefix):
                    vs_raw = key.split(".")[2]
                    m = re.match(r'^(\d+)', vs_raw)
                    if not m:
                        continue
                    vs_num = int(m.group(1))
                    results.append((vs_num, text))
            if not results:
                return None, f"Chapter {chapter} not found in {USFM_TO_NAME.get(book_code, book_code)}"
            results.sort(key=lambda x: x[0])
        else:
            end = verse_end if verse_end is not None else verse_start
            for v in range(verse_start, end + 1):
                key = f"{book_code}.{chapter}.{v}"
                if key in data:
                    results.append((v, data[key]))
            if not results:
                ref = f"{chapter}:{verse_start}" + (f"-{verse_end}" if verse_end and verse_end != verse_start else "")
                return None, f"Verses {ref} not found in {USFM_TO_NAME.get(book_code, book_code)}"
        return results, None

    def get_verses_cross_chapter(self, version, book_code, ch_start, vs_start, ch_end, vs_end):
        if version not in self.versions:
            return None, f"Version '{version}' not found"
        if book_code not in self.versions[version]:
            return None, f"Book '{book_code}' not found in {version}"
        data = self.versions[version][book_code]
        results = []
        for ch in range(ch_start, ch_end + 1):
            prefix = f"{book_code}.{ch}."
            chapter_verses = []
            for key, text in data.items():
                if key.startswith(prefix):
                    vs_raw = key.split(".")[2]
                    m = re.match(r'^(\d+)', vs_raw)
                    if not m:
                        continue
                    vs_num = int(m.group(1))
                    chapter_verses.append((vs_num, text, ch))
            chapter_verses.sort(key=lambda x: x[0])
            for vs_num, text, ch_num in chapter_verses:
                if ch_num == ch_start and vs_num < vs_start:
                    continue
                if ch_num == ch_end and vs_num > vs_end:
                    continue
                results.append((vs_num, text, ch_num))
        if not results:
            return None, f"Verses {ch_start}:{vs_start}-{ch_end}:{vs_end} not found"
        return results, None

    def get_chapter_range(self, version, book_code, ch_start, ch_end):
        if version not in self.versions:
            return None, f"Version '{version}' not found"
        if book_code not in self.versions[version]:
            return None, f"Book '{book_code}' not found in {version}"
        data = self.versions[version][book_code]
        results = []
        for ch in range(ch_start, ch_end + 1):
            prefix = f"{book_code}.{ch}."
            for key, text in data.items():
                if key.startswith(prefix):
                    vs_raw = key.split(".")[2]
                    m_vs = re.match(r'^(\d+)', vs_raw)
                    if not m_vs:
                        continue
                    vs_num = int(m_vs.group(1))
                    results.append((vs_num, text, ch))
        if not results:
            return None, f"Chapters {ch_start}-{ch_end} not found in {USFM_TO_NAME.get(book_code, book_code)}"
        results.sort(key=lambda x: (x[2], x[0]))
        return results, None


# ── Search query parser ──

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


def resolve_block(bible_data, version, block):
    if "error" in block:
        return {"label": "Error", "error": block["error"], "verses": []}
    book = block["book"]
    btype = block["type"]
    base = {"label": block["label"], "book": book}

    if btype == "single_verse":
        verses, err = bible_data.get_verses(version, book, block["chapter"], block["verse"])
        if err:
            return {**base, "error": err, "verses": []}
        return {**base, "verses": [{"num": v, "chapter": block["chapter"], "text": t} for v, t in verses]}
    elif btype == "verse_range":
        verses, err = bible_data.get_verses(version, book, block["chapter"], block["vs_start"], block["vs_end"])
        if err:
            return {**base, "error": err, "verses": []}
        return {**base, "verses": [{"num": v, "chapter": block["chapter"], "text": t} for v, t in verses]}
    elif btype == "whole_chapter":
        verses, err = bible_data.get_verses(version, book, block["chapter"])
        if err:
            return {**base, "error": err, "verses": []}
        return {**base, "verses": [{"num": v, "chapter": block["chapter"], "text": t} for v, t in verses]}
    elif btype == "chapter_range":
        verses, err = bible_data.get_chapter_range(version, book, block["ch_start"], block["ch_end"])
        if err:
            return {**base, "error": err, "verses": []}
        return {**base, "verses": [{"num": v, "chapter": ch, "text": t} for v, t, ch in verses]}
    elif btype == "cross_chapter":
        verses, err = bible_data.get_verses_cross_chapter(version, book, block["ch_start"], block["vs_start"], block["ch_end"], block["vs_end"])
        if err:
            return {**base, "error": err, "verses": []}
        return {**base, "verses": [{"num": v, "chapter": ch, "text": t} for v, t, ch in verses]}

    return {"label": block.get("label", "?"), "error": "Unknown block type", "verses": []}


def is_reference_query(query):
    first_part = query.split(";")[0].strip()
    query_lower = first_part.lower()

    # Scoped text searches take priority
    for group_key in SORTED_GROUPS:
        if query_lower.startswith(group_key + ':'):
            return False
    if query_lower.startswith('book:'):
        return False

    book_code, remainder = identify_book(first_part)
    if book_code:
        remainder = remainder.strip()
        if not remainder:
            return False  # bare book name → text search for that word
        if remainder[0].isdigit():
            return True
        return False
    return False


# ── Advanced text search ──

def parse_search_query(query):
    """Parse advanced operators: OR, -exclude, "exact phrase", scope prefixes."""
    scope_codes = None
    query = query.strip()
    query_lower = query.lower()

    # Check group scope: "GT: text", "NT:text", etc.
    for group_key in SORTED_GROUPS:
        pattern = group_key + ':'
        if query_lower.startswith(pattern):
            scope_codes = BOOK_GROUPS[group_key]
            query = query[len(pattern):].strip()
            query_lower = query.lower()
            break

    # Check book: scope: "book:Johannes text"
    if scope_codes is None:
        m = re.match(r'^book:(\S+)\s*(.*)', query, re.IGNORECASE)
        if m:
            code, _ = identify_book(m.group(1))
            if code:
                scope_codes = [code]
                query = m.group(2).strip()
                query_lower = query.lower()

    # Check bookname: text scope: "Johannes: nåde", "Amos: ord"
    if scope_codes is None:
        code, remainder = identify_book(query)
        if code and remainder.startswith(':') and len(remainder) > 1 and not remainder[1:2].isdigit():
            scope_codes = [code]
            query = remainder[1:].strip()
            query_lower = query.lower()

    # Extract exact phrases — compiled with word-boundary anchors so "tro" won't match "troende"
    exact_phrases = [
        re.compile(r'(?<!\w)' + re.escape(p.lower()) + r'(?!\w)')
        for p in re.findall(r'"([^"]+)"', query)
    ]
    query = re.sub(r'"[^"]+"', '', query).strip()

    # Parse excluded words and OR groups
    excluded = []
    tokens_for_or = []
    for token in query.split():
        if token.startswith('-') and len(token) > 1:
            excluded.append(token[1:].lower())
        else:
            tokens_for_or.append(token)

    or_groups = []
    current_group = []
    for token in tokens_for_or:
        if token.upper() == 'OR':
            if current_group:
                or_groups.append([t.lower() for t in current_group])
                current_group = []
        else:
            current_group.append(token)
    if current_group:
        or_groups.append([t.lower() for t in current_group])

    return {
        'scope': scope_codes,
        'exact': exact_phrases,
        'excluded': excluded,
        'or_groups': or_groups,
    }


def matches_parsed_query(text_lower, parsed):
    for exc in parsed['excluded']:
        if exc in text_lower:
            return False
    for pattern in parsed['exact']:
        if not pattern.search(text_lower):
            return False
    if parsed['or_groups']:
        if not any(all(w in text_lower for w in group) for group in parsed['or_groups']):
            return False
    return True


def search_text(bible_data, version, query):
    """Full-text search with advanced operators. No result limit."""
    parsed = parse_search_query(query)
    if not parsed['or_groups'] and not parsed['exact']:
        return []

    scope = parsed['scope']
    if scope:
        available = bible_data.versions.get(version, {})
        books_to_search = [c for c in scope if c in available]
    else:
        books_to_search = bible_data.version_books.get(version, [])

    results = []
    for book_code in books_to_search:
        book_name = USFM_TO_NAME.get(book_code, book_code)
        data = bible_data.versions[version].get(book_code, {})
        for key, text in data.items():
            if matches_parsed_query(text.lower(), parsed):
                kparts = key.split(".")
                if len(kparts) < 3:
                    continue
                try:
                    ch = int(kparts[1])
                except ValueError:
                    continue
                m = re.match(r'^(\d+)', kparts[2])
                if not m:
                    continue
                vs = int(m.group(1))
                results.append({
                    "ref": f"{book_name} {ch}:{vs}",
                    "book": book_code,
                    "chapter": ch,
                    "verse": vs,
                    "text": text,
                })
    return results


def get_search_stats(bible_data, version, query):
    """Return per-book hit counts for a text search query."""
    parsed = parse_search_query(query)
    if not parsed['or_groups'] and not parsed['exact']:
        return []

    stats = []
    for book_code in bible_data.version_books.get(version, []):
        data = bible_data.versions[version].get(book_code, {})
        count = sum(1 for text in data.values() if matches_parsed_query(text.lower(), parsed))
        stats.append({
            'code': book_code,
            'name': USFM_TO_NAME.get(book_code, book_code),
            'name_en': USFM_TO_ENG.get(book_code, book_code),
            'count': count,
            'order': USFM_TO_ORDER.get(book_code, 99),
        })
    return stats


def strip_scope_from_query(query):
    """Strip scope prefix from a search query. Returns (bare_query, scope_label_or_None)."""
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
