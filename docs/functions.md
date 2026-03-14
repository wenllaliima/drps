# Function Index

## `js/upload.js` — upload screen

All wrapped in `initUpload()`, called once from `main.js`.

| Function | Description |
|---|---|
| `selectInst(id, el)` | Set `INST`, toggle `.sel` on instrument buttons |
| `loadLogo(input)` | FileReader → `logoDataUrl` |
| `checkAdesao()` | Show/hide low-adherence warning |
| `acceptXlsx(file)` | Store file in `upFile`, update drop zone UI |
| `addPdfFiles(files)` | Push to `pdfFiles`, re-render list |
| `removePdf(name)` | Remove from `pdfFiles`, re-render |
| `updateBtnGo()` | Enable/disable analyze button |
| `runAnalysis()` | Orchestrate XLSX read + PDF OCR → call parser |
| `showOcrKeyPrompt()` | Inject Groq key input into `#col-notice` |
| `confirmOcrKey()` | Save key to `sessionStorage`, retry `runAnalysis()` |

## `js/ocr.js`

| Function | Description |
|---|---|
| `processPdfOcr(file, apiKey)` | Render PDF pages → JPEG → Groq API → JSON row |

## `js/parser.js` — scoring engine

| Function | Description |
|---|---|
| `parseXlsxRows(rows, extraPdfRows)` | Detect columns, score factors, build `G`, call `buildApp()` |
| `parsePdfOnly(rows)` | Build synthetic xlsx rows from OCR JSON, call `parseXlsxRows` |

## `js/report.js` — report generation

| Function | Description |
|---|---|
| `_commonSections(d, headColor, accentColor, noteBg)` | Returns HTML for all shared report sections |
| `TEMPLATES[key].buildHtml(d)` | Returns full report HTML (cover + `_commonSections`) |

`d` bundle passed to both: `{ G, inst, logoHtml, sigName, sigCrp, repDateDisplay, incDash }`

## `js/dashboard.js`

| Function | Renders |
|---|---|
| `buildDash()` | `#panel-dash` — KPIs, bar chart, NPS doughnut, sector chart, dimension grid |
| `buildFat()` | `#panel-fat` — ranked factor table with score bars and source textareas |
| `buildDemo()` | `#panel-demo` — demographic doughnut + bar breakdowns |

## `js/actions.js`

| Function | Description |
|---|---|
| `buildActPanel()` | Render `#act-filter` + `#act-list` |
| `filtAct(f, btn)` | Filter action list by factor index (`-1` = all) |
| `renderActs(filter)` | Render `.action-item` cards; auto-suggest ★ for top 4 risk factors |
| `togAct(idx)` | Toggle `selActs` membership, update card, rebuild report |
| `generateSectorActionPlan()` | Groq API → 3 interventions per sector → `sectorActions` |
| `confirmApiKey()` | Prompt for Groq key if missing |
| `renderSectorActionPlan()` | Update `#ai-plan-area` with generated plans |
| `sectorActionPlanHtml()` | Return HTML string for report inclusion |

## `js/ui.js` — app shell

| Function | Description |
|---|---|
| `buildApp()` | Hide upload, show app, set nav labels, call all panel builders |
| `buildFontesEd()` | Render `#fontes-ed` — editable textareas for factor sources |
| `updFonte(i, v)` | Update `fontes[i]`, refresh inline report preview |
| `buildTemplateGrid()` | Render `#tpl-grid` — template selector buttons |
| `selectTemplate(id)` | Set `activeTemplate`, rebuild report |
| `saveClinicPref()` | Persist template choice per clinic in `localStorage` (`drps_clinic_prefs`) |
| `loadClinicPref(name)` | Restore template choice for a clinic |
| `buildSectorReportHtml()` | Return factor × sector comparison table HTML |
| `buildReport()` | Assemble full report → inject into `#rep-body` |

## `js/history.js`

| Function | Description |
|---|---|
| `saveHistory()` | Flush `historyDB` to localStorage |
| `saveToHistory()` | Snapshot `G` + `fontes` + `selActs` → push to `historyDB` |
| `buildHistView()` | Render `#hist-list` |
| `loadFromHistory(id)` | Restore snapshot, rebuild all panels |
| `deleteFromHistory(id)` | Remove one entry |
| `clearHistory()` | Wipe all entries |

## `js/main.js` — navigation

| Function | Description |
|---|---|
| `switchTab(name)` | Activate tab + panel; triggers `buildReport()` or `buildHistView()` as needed |
| `backToUpload()` | Reset to upload screen |
| `printReport()` | Copy report into `#print-zone`, call `window.print()` |
