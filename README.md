# Tobias' Bible Search Tool

A fast and powerful Bible search app. Look up verses by reference, search the full text with advanced operators, and compare translations side by side. Uses local Bible files stored as JSON. Inspired by [biblegateway.com](https://biblegateway.com).

## Run locally

```bash
pip install -r requirements.txt
python main.py
```

Runs at `http://localhost:8421`

## Search syntax

| Example | What it does |
|---|---|
| `Johannes 3:16` | Single verse |
| `Salme 23` | Whole chapter |
| `1. Mos 1:1-3` | Verse range |
| `Joh 3:16;17` | Multiple passages (context carries) |
| `nåde` | Full-text search (substring) |
| `"tro"` | Exact word only (not "troende") |
| `"evig liv"` | Exact phrase |
| `nåde OR frelse` | Either word |
| `nåde -dom` | Exclude word |
| `GT: frelser` | Scope to OT / NT / book group |
| `Johannes: lys` | Scope to single book |

Abbreviations and English names work: `joh`, `gen`, `1. mos`, `romans`.

## Features

- **Compare** — view two translations simultaneously
- **Stats** — word frequency chart across all books
- **Dark mode** and **accent color** picker in the header
- **Interlinear links** to BibleHub for Hebrew/Greek

## Adding a Bible version

Drop a folder into `bibles/` with 66 JSON files named `NN_USFM_BookName.json` (e.g. `43_JHN_Johannes.json`), each mapping `BOOK.CHAPTER.VERSE` to verse text. The server auto-discovers it on next start. See [bible-scraper](https://github.com/tobiashellerslien/bible-scraper) to scrape versions into this format.
