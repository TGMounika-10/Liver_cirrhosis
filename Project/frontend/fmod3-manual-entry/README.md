# fmod3-manual-entry

## Purpose
Direct manual lab-value entry form with real-time field validation, range boundary verification, unit mismatch hints, and physiological consistency checks.

## Fields & Accepted Ranges
| Field | Required | Unit | Typical Range | Hard Bound |
| --- | --- | --- | --- | --- |
| Age | Yes | years | 18 – 85 | 1 – 120 |
| Gender | Yes | M / F | select | Male / Female |
| Total Bilirubin | Yes | mg/dL | 0.2 – 1.2 | 0.1 – 80 |
| Direct Bilirubin | Yes | mg/dL | 0.0 – 0.3 | 0.0 – 40 |
| Alkaline Phosphatase (ALP) | Yes | IU/L | 30 – 120 | 10 – 3000 |
| SGPT / ALT | Yes | IU/L | 7 – 56 | 1 – 5000 |
| SGOT / AST | Yes | IU/L | 10 – 40 | 1 – 5000 |
| Total Protein | Yes | g/dL | 6.0 – 8.3 | 2.0 – 12.0 |
| Albumin | Yes | g/dL | 3.5 – 5.0 | 0.5 – 7.0 |
| A/G Ratio | Yes | ratio | 1.0 – 2.5 | 0.1 – 4.0 |
| Platelet Count | Optional | x10³/µL | 150 – 450 | 5 – 1000 |
| PT / INR / GGT | Optional | s / ratio / IU/L | Validated only if entered | — |

## Physiological & Clinical Checks
- **Direct vs. Total Bilirubin**: Rejects values where Direct Bilirubin > Total Bilirubin.
- **Albumin vs. Total Protein**: Rejects values where Albumin > Total Protein.
- **Unit Mismatch**: Warns if Albumin > 15 g/dL (suggesting g/L conversion, e.g. 35 g/L -> 3.5 g/dL).
- **A/G Inconsistency**: Flags divergence between entered A/G ratio and Albumin / (Total Protein - Albumin).

## Components
- `ManualEntryForm.jsx`: Structured input groups (Demographics, Enzymes, Proteins, Optional).
- `FieldWithHint.jsx`: Input field with expected units, normal clinical reference range, and inline errors beside the field (Frontend Rule 4).
- `useLabValidation.js`: Form state hook managing client-side validation, error states, and server `422` error mapping.

## Done When
- Entering `albumin = -1` immediately flags an error beside the Albumin field and keeps the Predict button disabled.
- Server `422` validation responses map directly back to their corresponding input fields.

