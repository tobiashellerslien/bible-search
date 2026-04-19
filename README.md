# Tobias' Bible Search Tool

A fast and powerful Bible search app. Look up multiple verses by reference, do fast and advanced search, and compare versions. Uses local copies of bibles stored as JSON files, and includes some Norwegian and English translations. Inspired by [biblegateway.com](https://biblegateway.com)

## Run locally

```bash
pip install -r requirements.txt
python main.py
```

Runs website on `http://localhost:8421`

## Search examples

- `Johannes 3:16` — single verse
- `1. Mosebok 1:1-3` — verse range
- `Salme 23` — whole chapter
- `Joh 3:16;17` — multiple passages (semicolon-separated, context carries over)
- `nåde` — full-text search across the entire Bible

Abbreviations and English book names work too: `joh`, `1. mos`, `rom`, `genesis`.

## Adding a Bible version

Drop a folder into `bible_versions/` containing 66 JSON files named `NN_USFM_BookName.json` (e.g. `43_JHN_Johannes.json`). Each file maps `BOOK.CHAPTER.VERSE` keys to verse text:

```json
{
  "JHN.1.1": "I begynnelsen var Ordet...",
  "JHN.1.2": "Han var i begynnelsen hos Gud."
}
```

The server auto-discovers the new version on next start. Add an entry to `VERSION_DISPLAY` in `static/js/app.js` if the folder name needs a prettier display label. Take a look at my bible-scraper repo to scrape your own versions to this format.
