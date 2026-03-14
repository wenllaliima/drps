# Data Structures

## Global state (`js/state.js`)

| Variable | Type | Description |
|---|---|---|
| `G` | object | Current analysis result (populated by parser) |
| `INST` | string | Active instrument key (`'aot'`, `'copsoq2s'`, `'copsoq2m'`, `'copsoq2a'`, `'copsoq3'`) |
| `fontes` | string[] | Editable source text per factor, one entry per `inst.factors` |
| `selActs` | Set\<number\> | Indices into `ALIB` of selected actions for the report |
| `charts` | object | Chart.js instances keyed by canvas ID (use `dc(id)` to destroy) |
| `logoDataUrl` | string | Base64 company logo from file upload |
| `historyDB` | object[] | In-memory copy of localStorage history |
| `reportDate` | string | Report date string from UI input |
| `sectorActions` | object | AI-generated plans keyed by sector name |
| `activeTemplate` | string | Active template key (default `'ambrac'`) |
| `clinicName` | string | Clinic name — used to save template preference |
| `pdfFiles` | File[] | Queued PDF files pending OCR |
| `pdfRows` | object[] | Parsed OCR results from PDFs |

## The `G` object

```js
G = {
  meta: {
    empresa, ramo, unidade, periodo,
    avaliador, psi,
    totalRef,      // int — reference headcount from UI
    adesaoPct      // float — n/totalRef*100
  },
  inst: 'aot',                         // instrument key
  n: 42,                               // respondent count
  factorScores: [34.2, 67.1, ...],    // one per factor, 0–100
  dimScores: [45.0, ...],             // one per dimension, 0–100
  nps: { det, neu, pro, score, total },
  demo: {
    setor: { 'Almoxarifado': 12, ... },
    faixa: { '18-24': 5, ... },
    sexo:  { 'Feminino': 20, ... },
    civil: { 'Casado': 18, ... },
    escol: { 'Ensino Médio': 15, ... }
  },
  sectorScores: { 'Setor A': [f0score, f1score, ...], ... },
  logo: 'data:image/...',
  timestamp: '2026-...',
  pdfCount: 0,
  xlsxCount: 42
}
```

## `INSTRUMENTS` shape (`js/config.js`)

```js
INSTRUMENTS[key] = {
  name: 'Full name',
  short: 'Short label',       // shown in nav badge
  nQuestions: 41,
  scoring: 'copsoq',          // 'copsoq' | 'likert5_0100'
  factors: [
    {
      name: 'Factor label',
      qs: [0, 1, 2],          // 0-based column indices in spreadsheet
      riskInverted: true,     // protective factor: risk = 100 - score
      alpha: 0.84,            // Cronbach's alpha (optional)
      scale10: true,          // 0–10 scale instead of Likert (optional)
      note: '...'             // display note (optional)
    }
  ],
  dimensions: [
    { name, abbr, factors: [0, 2], color: '#hex', desc }
  ],
  defaultFontes: ['...'],     // one string per factor
  formulaNote: '...',
  citation: '...'             // optional academic reference
}
```

## `ALIB` shape (`js/config.js`)

```js
ALIB[i] = {
  f: 0,              // factor index this action targets
  lv: 'baixa',       // complexity: 'baixa' | 'média' | 'alta'
  type: 'Ergonomia', // category label
  title: 'Action title',
  desc: 'Short description',
  target: 'Operacional' // audience: 'Operacional' | 'Intermediária' | 'Superior'
}
```

## Utility functions (`js/state.js`)

```js
avg(arr)          // mean, returns 0 for empty array
classif(score)    // → 'BAIXO' | 'MODERADO' | 'ALTO'
sevEng(score)     // → 'Insignificante' | 'Baixa' | 'Moderada' | 'Alta' | 'Grave'
rc(score)         // → '#10b981' | '#f59e0b' | '#ef4444'
bc(score)         // → 'bl' | 'bm' | 'bh'  (app badge CSS class)
rb(score)         // → 'rb-lo' | 'rb-mo' | 'rb-hi'  (report badge CSS class)
pct(v)            // → '42.3%'
dc(id)            // destroy Chart.js instance and remove from charts{}
```
