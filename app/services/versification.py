"""TVTMS-driven versification mapping between traditions.

The internal "standard" representation is English/KJV (vsf='eng'), matching the
versification used by:
  - the cross_references table (OpenBible TSK)
  - BSB outlines and topical index
  - the scofield and mhenry commentaries

Each translation, commentary, outline source, and topic source is tagged with
its versification ('eng', 'heb', 'lat', 'grk'). The Versifier converts a
verse reference between any pair of traditions by routing through 'eng'.

Mappings come from versification_map, populated by migrations/import_tvtms.py
from the STEPBible TVTMS expanded section. Mapping is verse-granular only;
sub-verse splits (e.g. 3Jn.1:14a / 1:14b) are collapsed to the verse level.
"""


class Versifier:
    def __init__(self, db):
        self.db = db
        # forward[(vsf, book, ch, v)] = (book, ch, v)  — to eng
        self._forward: dict = {}
        # inverse[(vsf, book, ch, v)] = (book, ch, v)  — from eng to vsf
        self._inverse: dict = {}
        self._translation_vsf: dict = {}     # tid -> vsf
        self._commentary_vsf: dict = {}       # commentary_id -> vsf
        self._outline_vsf: dict = {}          # book_usfm -> vsf  (outlines is per-book)
        self._topic_source_vsf: dict = {}     # source -> vsf
        self._load()

    def _load(self):
        for src_vsf, sb, sc, sv, db_, dc, dv in self.db.execute(
            """SELECT src_vsf, src_book, src_chapter, src_verse,
                      dst_book, dst_chapter, dst_verse
               FROM versification_map WHERE dst_vsf='eng'"""
        ):
            self._forward[(src_vsf, sb, sc, sv)] = (db_, dc, dv)
            # First-write wins for inverse (concatenations have N→1, we keep first)
            self._inverse.setdefault((src_vsf, db_, dc, dv), (sb, sc, sv))

        for tid, vsf in self.db.execute(
            "SELECT id, COALESCE(versification,'eng') FROM translations"
        ):
            self._translation_vsf[tid] = vsf

        try:
            for cid, vsf in self.db.execute(
                "SELECT id, COALESCE(versification,'eng') FROM commentaries"
            ):
                self._commentary_vsf[cid] = vsf
        except Exception:
            pass
        try:
            for book, vsf in self.db.execute(
                "SELECT book_usfm, COALESCE(versification,'eng') FROM outlines"
            ):
                self._outline_vsf[book] = vsf
        except Exception:
            pass
        try:
            for src, vsf in self.db.execute(
                "SELECT source, COALESCE(versification,'eng') FROM topic_sources"
            ):
                self._topic_source_vsf[src] = vsf
        except Exception:
            pass

        n = len(self._forward)
        print(f"Loaded {n} versification mappings.")

    # ── Lookups for resource versification ────────────────────────────────────
    def translation_vsf(self, translation_id):
        return self._translation_vsf.get(translation_id, "eng")

    def commentary_vsf(self, commentary_id):
        return self._commentary_vsf.get(commentary_id, "eng")

    def outline_vsf(self, book_usfm):
        return self._outline_vsf.get(book_usfm, "eng")

    def topic_source_vsf(self, source):
        return self._topic_source_vsf.get(source, "eng")

    # ── Core: convert a single verse between vsf and eng ──────────────────────
    def to_eng(self, src_vsf, book, ch, verse):
        """Translate (book, ch, verse) from src_vsf to eng. Returns (book, ch, verse)."""
        if src_vsf == "eng":
            return (book, ch, verse)
        return self._forward.get((src_vsf, book, ch, verse), (book, ch, verse))

    def from_eng(self, dst_vsf, book, ch, verse):
        """Translate (book, ch, verse) from eng to dst_vsf."""
        if dst_vsf == "eng":
            return (book, ch, verse)
        return self._inverse.get((dst_vsf, book, ch, verse), (book, ch, verse))

    def convert(self, src_vsf, dst_vsf, book, ch, verse):
        if src_vsf == dst_vsf:
            return (book, ch, verse)
        eb, ec, ev = self.to_eng(src_vsf, book, ch, verse)
        return self.from_eng(dst_vsf, eb, ec, ev)

    # ── Range conversion (vs_start..vs_end within a single chapter) ───────────
    def convert_range(self, src_vsf, dst_vsf, book, ch_start, vs_start, ch_end=None, vs_end=None):
        """Convert a verse range. For ranges we map endpoints independently.
        Returns (book, ch_start, vs_start, ch_end, vs_end).

        Limitations: if the range crosses a chapter boundary in the source vsf
        but not in the destination, the result is best-effort (endpoints only).
        """
        if ch_end is None:
            ch_end = ch_start
        if vs_end is None:
            vs_end = vs_start

        b1, c1, v1 = self.convert(src_vsf, dst_vsf, book, ch_start, vs_start)
        b2, c2, v2 = self.convert(src_vsf, dst_vsf, book, ch_end, vs_end)
        # Books should always match; if mapping flipped them, prefer the start's.
        return (b1, c1, v1, c2, v2)

    # ── Convenience wrappers using translation_id directly ────────────────────
    def translation_to_eng(self, translation_id, book, ch, verse):
        return self.to_eng(self.translation_vsf(translation_id), book, ch, verse)

    def eng_to_translation(self, translation_id, book, ch, verse):
        return self.from_eng(self.translation_vsf(translation_id), book, ch, verse)
