# DRPS

Browser-only psychosocial risk assessment tool for Brazilian NR-1 compliance. No backend, no build step — deployed on GitHub Pages. UI and content in Portuguese (PT-BR).

## File map

| File | Purpose |
|---|---|
| `index.html` | HTML shell only — no inline JS or CSS |
| `css/styles.css` | Dark theme UI styles |
| `js/config.js` | `INSTRUMENTS` data + `ALIB` action library (static, no DOM) |
| `js/state.js` | Shared globals (`G`, `INST`, `fontes`, `selActs`, …) + utility fns |
| `js/history.js` | localStorage history (key: `drps_hist`, max 50 entries) |
| `js/upload.js` | Upload screen — file drop, instrument select, `runAnalysis()` |
| `js/ocr.js` | `processPdfOcr()` — Groq API call, key in `sessionStorage` |
| `js/parser.js` | `parseXlsxRows()` + `parsePdfOnly()` — scoring engine |
| `js/report.js` | `_commonSections()` + `TEMPLATES` (4 report designs) |
| `js/dashboard.js` | `buildDash()`, `buildFat()`, `buildDemo()` |
| `js/actions.js` | Actions panel + `generateSectorActionPlan()` (Groq AI) |
| `js/ui.js` | `buildApp()`, `buildReport()`, template selector, fontes editor |
| `js/main.js` | `switchTab()`, `backToUpload()`, `printReport()`, calls `initUpload()` |

Scripts load in the order listed above — plain globals, no modules.

## Key references

- [docs/data.md](docs/data.md) — `G` object schema, `INSTRUMENTS` shape, `ALIB` shape, global state vars
- [docs/functions.md](docs/functions.md) — function index by file
- [docs/scoring.md](docs/scoring.md) — scoring formulas, risk thresholds, instrument details

## Common edit locations

- New instrument → `INSTRUMENTS` in `js/config.js`
- New report template → `TEMPLATES` in `js/report.js`
- Report section content → `_commonSections()` in `js/report.js`
- Scoring logic → `parseXlsxRows()` in `js/parser.js`
- Dashboard panels → `js/dashboard.js`
- New action suggestion → `ALIB` in `js/config.js`
