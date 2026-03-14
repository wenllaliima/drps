# Scoring & Instruments

## Formulas

| Instrument | Formula | Input |
|---|---|---|
| AOT/DRPS | `(mean − 1) / 4 × 100` | Likert 1–5 |
| COPSOQ II (all versions) | `(mean − 1) × 25` | Likert 1–5 |
| COPSOQ III | `(mean − 1) × 25` | Likert 1–5 |
| Binary questions (Q45–48, copsoq2a) | `mean × 100` | 0 or 1 |
| Scale-10 (Q50, copsoq2a) | `(mean / 10) × 100` | 0–10 |

**Protective factors** (`riskInverted: true`): final risk score = `100 − score`. High raw score = good → low risk.

## Risk thresholds

| Score | Classification | Severity |
|---|---|---|
| 0–9 | BAIXO | Insignificante |
| 10–29 | BAIXO | Baixa |
| 30–49 | BAIXO | Moderada |
| 50–69 | MODERADO | Alta |
| 70–74 | MODERADO | Alta |
| 75–100 | ALTO | Grave |

## Instruments

| Key | Name | Questions | Factors | Scoring |
|---|---|---|---|---|
| `aot` | AOT — Avaliação da Organização do Trabalho | 24 | 12 | `likert5_0100` |
| `copsoq2s` | COPSOQ II Curta | 41 | 15 | `copsoq` |
| `copsoq2m` | COPSOQ II Média | 72 | 24 | `copsoq` |
| `copsoq2a` | COPSOQ II Adaptada (Baixa Escolaridade) | 41 | 20 | `copsoq` + binary + scale10 |
| `copsoq3` | COPSOQ III Brasil (Rodrigues, 2020) | 79 | 7 | `copsoq` |

## Column auto-detection (parser)

`parseXlsxRows` detects columns automatically from the spreadsheet header row:

1. **Question columns** — header matches `^N[.\s]` pattern (e.g. `1. Pergunta`); fallback: find consecutive columns with values in 1–5 range
2. **NPS column** — header contains `"0 a 10"`, `"indica"+"empresa"`, or `"recomendaria"`; fallback: column with 0–10 values including values outside 1–5
3. **Setor column** — header contains `"setor"` or `"sector"`; fallback: non-numeric text column not already claimed

A `#col-notice` warning is shown if fewer than `nQuestions` question columns are found, or if NPS/setor can't be detected.

## NPS segmentation

- Promoters: 9–10
- Neutral: 7–8
- Detractors: 0–6
- Score = `(promoters − detractors) / total × 100`
