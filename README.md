# Bible Search

A fast and powerful Bible search app. Look up verses by reference, search the full text with advanced operators, and compare translations side by side. Uses local copies of Bibles. Inspired by [biblegateway.com](https://biblegateway.com).

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

- **Search** - search across the entire bible, with search syntax, autofill and filters
- **Quick search** — find a verse quickly
- **Map** — view all places mentioned in an interactive map
- **Cross references** - ~340,000 cross references, based mainly on TSK
- **Compare** — view two translations simultaneously
- **Stats** — word frequency chart across all books
- **Resource links** — BibleHub for Hebrew/Greek, and BibleRef for commentary
- **Appearance** — options in settings
