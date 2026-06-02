"""TVTMS-driven versification mapping between traditions.

The internal "standard" representation is English/KJV (vsf='eng'), matching the
versification used by:
  - the cross_references table (OpenBible TSK)
  - BSB outlines and topical index
  - the scofield and mhenry commentaries

Each translation, commentary, and outline source is tagged with its
versification ('eng', 'heb', 'lat', 'grk'). The Versifier converts a
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

        pass

    # ── Lookups for resource versification ────────────────────────────────────
    def translation_vsf(self, translation_id):
        return self._translation_vsf.get(translation_id, "eng")

    def commentary_vsf(self, commentary_id):
        return self._commentary_vsf.get(commentary_id, "eng")

    def outline_vsf(self, book_usfm):
        return self._outline_vsf.get(book_usfm, "eng")

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

    # ── Parsed-block conversion (for compare across translations) ─────────────
    def convert_block(self, block, src_vsf, dst_vsf, src_max_verses=None):
        """Return a new block dict with chapter/verse endpoints translated from
        src_vsf to dst_vsf. May promote a verse_range to cross_chapter if the
        mapping splits the range across chapters in dst. Returns the same block
        unchanged when vsfs match or the block has no verse-level coordinates
        (whole_chapter / chapter_range, where boundaries can't be precisely
        relocated without verse anchors)."""
        if src_vsf == dst_vsf:
            return block
        btype = block.get("type")
        if btype in ("single_verse",):
            _, c, v = self.convert(src_vsf, dst_vsf, block["book"], block["chapter"], block["verse"])
            return {**block, "chapter": c, "verse": v}
        if btype == "verse_range":
            book = block["book"]
            _, c1, v1 = self.convert(src_vsf, dst_vsf, book, block["chapter"], block["vs_start"])
            _, c2, v2 = self.convert(src_vsf, dst_vsf, book, block["chapter"], block["vs_end"])
            if c1 == c2:
                return {**block, "chapter": c1, "vs_start": v1, "vs_end": v2}
            return {**block, "type": "cross_chapter", "ch_start": c1, "vs_start": v1,
                    "ch_end": c2, "vs_end": v2}
        if btype == "verse_range_to_end":
            book = block["book"]
            _, c1, v1 = self.convert(src_vsf, dst_vsf, book, block["chapter"], block["vs_start"])
            if c1 == block["chapter"]:
                return {**block, "chapter": c1, "vs_start": v1}
            # Endpoint shifted to a different dst chapter — leave as verse_range_to_end
            # using the new chapter; resolver fills vs_end from translation's max verse.
            return {**block, "chapter": c1, "vs_start": v1}
        if btype == "cross_chapter":
            book = block["book"]
            _, c1, v1 = self.convert(src_vsf, dst_vsf, book, block["ch_start"], block["vs_start"])
            _, c2, v2 = self.convert(src_vsf, dst_vsf, book, block["ch_end"], block["vs_end"])
            if c1 == c2:
                return {**block, "type": "verse_range", "chapter": c1,
                        "vs_start": v1, "vs_end": v2,
                        "ch_start": None, "ch_end": None}
            return {**block, "ch_start": c1, "vs_start": v1, "ch_end": c2, "vs_end": v2}
        if btype in ("whole_chapter", "chapter_range"):
            # Anchor on the src translation's actual chapter bounds so the dst
            # span covers exactly the user-visible passage. Always produce a
            # cross_chapter (or verse_range) range; the conservative bound
            # avoids over-fetching when the src chapter is a subset of dst's.
            book = block["book"]
            if btype == "whole_chapter":
                ch_s = ch_e = block["chapter"]
            else:
                ch_s = block["ch_start"]
                ch_e = block["ch_end"]
            max_v_e = (src_max_verses or {}).get(ch_e) or 999
            _, c1, v1 = self.convert(src_vsf, dst_vsf, book, ch_s, 1)
            _, c2, v2 = self.convert(src_vsf, dst_vsf, book, ch_e, max_v_e)
            # The chapter span didn't move: the whole src chapter(s) still live in
            # the same dst chapter(s). For a whole-chapter / chapter-range request
            # the *internal* verse renumbering is irrelevant (the user sees the
            # entire chapter either way, and the renumbering is visible in the
            # verse text itself), so keep the block as-is. This preserves the clean
            # "Gen 1" / "Salmene 3" label and avoids tripping the compare-mode
            # "different versification" hint when there's no chapter-boundary shift
            # (e.g. Psalm superscriptions: NB88 3:1-9 ↔ KJV 3:0-8, same chapter).
            # Only an actual boundary crossing (c1/c2 land in a different chapter,
            # e.g. Joel) falls through to a verse_range / cross_chapter.
            if c1 == ch_s and c2 == ch_e:
                return block
            if c1 == c2:
                return {
                    **block,
                    "type": "verse_range",
                    "chapter": c1, "vs_start": v1, "vs_end": v2,
                }
            return {
                **block,
                "type": "cross_chapter",
                "ch_start": c1, "vs_start": v1,
                "ch_end": c2, "vs_end": v2,
            }
        return block

    def convert_translation_block(self, block, src_translation_id, dst_translation_id,
                                  src_max_verses=None):
        return self.convert_block(
            block,
            self.translation_vsf(src_translation_id),
            self.translation_vsf(dst_translation_id),
            src_max_verses=src_max_verses,
        )
