#!/usr/bin/env python3
"""
Migrate all-most-likely.kmz (OpenBible.info place identifications) into bible.db.
Run once from the project root: python migrate_places.py
"""

import json
import re
import sqlite3
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
KMZ_PATH = BASE_DIR / "all-most-likely.kmz"
DB_PATH = BASE_DIR / "bible.db"

NS = {"k": "http://www.opengis.net/kml/2.2"}

KMZ_BOOK_MAP = {
    "Gen": "GEN", "Exod": "EXO", "Lev": "LEV", "Num": "NUM", "Deut": "DEU",
    "Josh": "JOS", "Judg": "JDG", "Ruth": "RUT", "1Sam": "1SA", "2Sam": "2SA",
    "1Kgs": "1KI", "2Kgs": "2KI", "1Chr": "1CH", "2Chr": "2CH",
    "Ezra": "EZR", "Neh": "NEH", "Esth": "EST", "Job": "JOB", "Ps": "PSA",
    "Prov": "PRO", "Eccl": "ECC", "Song": "SNG", "Isa": "ISA", "Jer": "JER",
    "Lam": "LAM", "Ezek": "EZK", "Dan": "DAN", "Hos": "HOS", "Joel": "JOL",
    "Amos": "AMO", "Obad": "OBA", "Jonah": "JON", "Mic": "MIC", "Nah": "NAM",
    "Hab": "HAB", "Zeph": "ZEP", "Hag": "HAG", "Zech": "ZEC", "Mal": "MAL",
    "Matt": "MAT", "Mark": "MRK", "Luke": "LUK", "John": "JHN", "Acts": "ACT",
    "Rom": "ROM", "1Cor": "1CO", "2Cor": "2CO", "Gal": "GAL", "Eph": "EPH",
    "Phil": "PHP", "Col": "COL", "1Thess": "1TH", "2Thess": "2TH",
    "1Tim": "1TI", "2Tim": "2TI", "Titus": "TIT", "Phlm": "PHM", "Heb": "HEB",
    "Jas": "JAS", "1Pet": "1PE", "2Pet": "2PE", "1John": "1JN", "2John": "2JN",
    "3John": "3JN", "Jude": "JUD", "Rev": "REV",
}

REF_RE = re.compile(r"search=([A-Za-z0-9]+)\.(\d+)\.(\d+)")
STYLE_RE = re.compile(r"#(.+)$")


def split_name(folder_name):
    """'Abel-beth-maacah (Abel Beth Maakah, Abel)' -> ('Abel-beth-maacah', ['Abel Beth Maakah','Abel'])"""
    m = re.match(r"^(.+?)\s*\((.+)\)\s*$", folder_name.strip())
    if m:
        canonical = m.group(1).strip()
        aliases = [a.strip() for a in m.group(2).split(",") if a.strip()]
        return canonical, aliases
    return folder_name.strip(), []


def parse_coords(text):
    """KML coordinates: 'lon,lat[,alt] lon,lat[,alt] ...' -> [[lon,lat], ...]"""
    out = []
    for tok in text.split():
        parts = tok.split(",")
        if len(parts) >= 2:
            try:
                out.append([float(parts[0]), float(parts[1])])
            except ValueError:
                pass
    return out


def placemark_geometry(placemark):
    """Return GeoJSON geometry dict for a single Placemark, or None."""
    pt = placemark.find("k:Point/k:coordinates", NS)
    if pt is not None and pt.text:
        coords = parse_coords(pt.text)
        if coords:
            return {"type": "Point", "coordinates": coords[0]}

    ls = placemark.find("k:LineString/k:coordinates", NS)
    if ls is not None and ls.text:
        coords = parse_coords(ls.text)
        if coords:
            return {"type": "LineString", "coordinates": coords}

    poly = placemark.find("k:Polygon/k:outerBoundaryIs/k:LinearRing/k:coordinates", NS)
    if poly is not None and poly.text:
        coords = parse_coords(poly.text)
        if coords:
            return {"type": "Polygon", "coordinates": [coords]}

    return None


def style_to_kind(style_url):
    if not style_url:
        return "unknown"
    m = STYLE_RE.search(style_url)
    return m.group(1) if m else "unknown"


def folder_geometry_and_kind(folder):
    """Combine all placemarks of a folder; return (geometry, kind)."""
    geoms = []
    kinds = []
    for pm in folder.findall("k:Placemark", NS):
        g = placemark_geometry(pm)
        if g is None:
            continue
        geoms.append(g)
        style = pm.find("k:styleUrl", NS)
        kinds.append(style_to_kind(style.text if style is not None else None))

    if not geoms:
        return None, None

    if len(geoms) == 1:
        return geoms[0], kinds[0]

    geom = {"type": "GeometryCollection", "geometries": geoms}
    kind = kinds[0] if len(set(kinds)) == 1 else "mixed"
    return geom, kind


def folder_placemark_label(folder):
    """First Placemark's name — useful display label like 'Abana / Barada River'."""
    pm = folder.find("k:Placemark", NS)
    if pm is None:
        return None
    n = pm.find("k:name", NS)
    return n.text.strip() if n is not None and n.text else None


def folder_verses(folder):
    """Extract (book_usfm, chapter, verse) tuples from folder description CDATA."""
    desc = folder.find("k:description", NS)
    if desc is None or not desc.text:
        return []
    out = []
    seen = set()
    for abbrev, ch, vs in REF_RE.findall(desc.text):
        usfm = KMZ_BOOK_MAP.get(abbrev)
        if not usfm:
            continue
        try:
            key = (usfm, int(ch), int(vs))
        except ValueError:
            continue
        if key in seen:
            continue
        seen.add(key)
        out.append(key)
    return out


def main():
    if not KMZ_PATH.exists():
        raise SystemExit(f"KMZ not found: {KMZ_PATH}")
    if not DB_PATH.exists():
        raise SystemExit(f"DB not found: {DB_PATH}. Run migrate_to_db.py first.")

    with zipfile.ZipFile(KMZ_PATH, "r") as zf:
        with zf.open("doc.kml") as f:
            tree = ET.parse(f)

    root = tree.getroot()
    document = root.find("k:Document", NS)
    folders = document.findall("k:Folder", NS)
    print(f"Found {len(folders)} folders in KMZ")

    db = sqlite3.connect(str(DB_PATH))
    db.executescript(
        """
        DROP TABLE IF EXISTS place_verses;
        DROP TABLE IF EXISTS places;

        CREATE TABLE places (
            id          INTEGER PRIMARY KEY,
            name        TEXT NOT NULL,
            aliases     TEXT,
            placemark   TEXT,
            kind        TEXT NOT NULL,
            geometry    TEXT NOT NULL
        );
        CREATE INDEX places_name_idx ON places(name);

        CREATE TABLE place_verses (
            place_id    INTEGER NOT NULL REFERENCES places(id),
            book_usfm   TEXT NOT NULL,
            chapter     INTEGER NOT NULL,
            verse       INTEGER NOT NULL,
            PRIMARY KEY (place_id, book_usfm, chapter, verse)
        );
        CREATE INDEX place_verses_loc_idx ON place_verses(book_usfm, chapter, verse);
        """
    )

    inserted = 0
    skipped_no_geom = 0
    total_verse_rows = 0
    unknown_abbrevs = set()

    for folder in folders:
        name_el = folder.find("k:name", NS)
        if name_el is None or not name_el.text:
            continue
        canonical, aliases = split_name(name_el.text)
        geometry, kind = folder_geometry_and_kind(folder)
        if geometry is None:
            skipped_no_geom += 1
            continue
        placemark_label = folder_placemark_label(folder)
        verses = folder_verses(folder)

        # Track unknown abbrevs for diagnostics
        desc = folder.find("k:description", NS)
        if desc is not None and desc.text:
            for abbrev, _, _ in REF_RE.findall(desc.text):
                if abbrev not in KMZ_BOOK_MAP:
                    unknown_abbrevs.add(abbrev)

        cur = db.execute(
            "INSERT INTO places (name, aliases, placemark, kind, geometry) VALUES (?,?,?,?,?)",
            (
                canonical,
                json.dumps(aliases, ensure_ascii=False),
                placemark_label,
                kind,
                json.dumps(geometry, ensure_ascii=False),
            ),
        )
        place_id = cur.lastrowid
        inserted += 1

        if verses:
            db.executemany(
                "INSERT OR IGNORE INTO place_verses (place_id, book_usfm, chapter, verse) VALUES (?,?,?,?)",
                [(place_id, b, c, v) for (b, c, v) in verses],
            )
            total_verse_rows += len(verses)

    db.commit()
    db.close()

    print(f"Inserted {inserted} places, skipped {skipped_no_geom} (no geometry)")
    print(f"Inserted {total_verse_rows} place_verses rows")
    if unknown_abbrevs:
        print(f"WARNING: unknown book abbreviations encountered: {sorted(unknown_abbrevs)}")


if __name__ == "__main__":
    main()
