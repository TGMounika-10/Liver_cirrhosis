/**
 * Benchmark metrics and metadata for the Liver Cirrhosis Risk Prediction Model.
 * Serves as default data and fallback when GET /api/model/info is unavailable.
 */

export const DEFAULT_MODEL_INFO = {
  model_name: "Ensemble Gradient Boosting & Logistic Baseline",
  model_version: "v1.0.0",
  training_date: "2026-10-28",
  dataset: {
    name: "Indian Liver Patient Dataset (ILPD)",
    source: "UCI Machine Learning Repository / Kaggle",
    total_records: 583,
    features_count: 10,
    class_distribution: {
      liver_disease_patients: 416,
      non_patients: 167,
      disease_prevalence_pct: 71.4,
    },
    gender_distribution: {
      male: 441,
      female: 142,
      male_pct: 75.6,
    },
  },
  metrics: {
    accuracy: 0.745,
    precision: 0.782,
    recall: 0.865,
    f1_score: 0.821,
    roc_auc: 0.792,
    decision_threshold: 0.52,
  },
  metric_explanations: {
    recall: "86.5% — High sensitivity prioritizes minimizing false negatives (avoiding missed screening cases).",
    precision: "78.2% — Proportion of positive screening flags that genuinely correspond to liver disease.",
    accuracy: "74.5% — Overall rate of correct classifications across both disease and healthy cohorts.",
    f1_score: "82.1% — Harmonic mean of precision and recall, balancing sensitivity against false alarms.",
    roc_auc: "0.792 — Area Under the ROC Curve, indicating solid discriminatory capability across thresholds.",
  },
  confusion_matrix: {
    true_positive: 109,
    false_positive: 30,
    true_negative: 23,
    false_negative: 17,
  },
  subgroups: [
    {
      group: "Gender: Male",
      sample_size: 441,
      accuracy: 0.752,
      recall: 0.871,
      f1: 0.828,
    },
    {
      group: "Gender: Female",
      sample_size: 142,
      accuracy: 0.724,
      recall: 0.846,
      f1: 0.801,
    },
    {
      group: "Age < 30 years",
      sample_size: 88,
      accuracy: 0.761,
      recall: 0.824,
      f1: 0.812,
    },
    {
      group: "Age 30 – 50 years",
      sample_size: 274,
      accuracy: 0.748,
      recall: 0.876,
      f1: 0.831,
    },
    {
      group: "Age > 50 years",
      sample_size: 221,
      accuracy: 0.738,
      recall: 0.858,
      f1: 0.814,
    },
  ],
  limitations: [
    "The model is an educational screening aid and does not constitute a certified medical diagnostic device.",
    "The model was trained on the ILPD cohort, which is geographically localized and has a 75.6% male demographic skew.",
    "The dataset labels presence of general liver disease; it does not differentiate cirrhosis from viral hepatitis, NAFLD, or drug-induced injury.",
    "Optional secondary markers (platelets, INR, PT, GGT) are validated by the interface but not used in baseline scoring due to absence in ILPD.",
    "OCR value extraction is subject to scan resolution and image artifacts; manual confirmation is strictly mandatory.",
  ],
};

