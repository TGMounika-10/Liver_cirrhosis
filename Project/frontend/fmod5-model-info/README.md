# fmod5-model-info

## Purpose
Public transparency portal providing audit records for dataset distribution, architecture, classification metrics, confusion matrix, demographic subgroups, and clinical limitations.

## Data Source & Architecture
- **Dataset**: Indian Liver Patient Dataset (ILPD), 583 total records (416 liver disease, 167 control).
- **Endpoint**: Fetches live specifications from `GET /api/model/info` with graceful fallback to benchmark specs and retry mechanism.
- **Model Version**: v1.0.0.

## Components
- `MetricCards.jsx`: Displays Accuracy (74.5%), Precision (78.2%), Recall (86.5%), F1-Score (82.1%), and ROC-AUC (0.792) with plain-language explanations.
- `ConfusionMatrix.jsx`: 2x2 grid displaying True Positives (109), False Positives (30), True Negatives (23), and False Negatives (17).
- `ClassBalanceChart.jsx`: Visual representation of cohort class proportions and training imbalance mitigation.
- `SubgroupTable.jsx`: Demographic performance audit broken down by sex (Male vs Female) and age bands (&lt;30, 30–50, &gt;50).
- `LimitationsList.jsx`: Clear disclosure highlighting that the tool is an educational screening aid and not a diagnostic device.
- `AboutModelPage.jsx`: Top-level public view with metadata pills and quick navigation links.

## Done When
- Metrics match recorded benchmarks with no rounding manipulation.
- Network or server failures produce a user-friendly error with an interactive retry button.
- The page is publicly accessible without requiring account login.

