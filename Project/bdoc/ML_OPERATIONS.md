# ML Operations Specification

Liver Cirrhosis Risk Prediction System: everything about the machine-learning side in one place.

> **Disclaimer:** The model produces an educational risk estimate. It does not diagnose cirrhosis or any liver disease.

---

## 1. Problem definition
| Item | Definition |
| --- | --- |
| Task | Binary classification on tabular blood-test data |
| Output | Probability (0 to 1) of liver disease, mapped to Low / Moderate / High |
| Positive class (1) | Liver disease present in the dataset label |
| Negative class (0) | No liver disease |
| Primary goal | High **recall** for the positive class (screening: avoid missed cases) while keeping false positives manageable |

**Important limitation:** ILPD labels *liver patient vs non-patient*. It does **not** label cirrhosis specifically, so the output must always be worded as "liver disease/cirrhosis risk", never as a cirrhosis diagnosis.

## 2. Dataset
- **Primary:** Indian Liver Patient Dataset (ILPD), about 583 records, roughly 71% liver patients and 29% non-patients (imbalanced), about 76% male (gender-imbalanced), a few missing A/G ratio values.
- **Raw columns:** Age, Gender, Total_Bilirubin, Direct_Bilirubin, Alkaline_Phosphotase, Alamine_Aminotransferase (SGPT), Aspartate_Aminotransferase (SGOT), Total_Protiens, Albumin, Albumin_and_Globulin_Ratio, Dataset (target; 1 = patient, 2 = non-patient).
- **Target recoding:** `1 -> 1` (disease), `2 -> 0` (no disease).
- **Optional features** (platelets, PT, INR, GGT) are **not in ILPD**. They can be used by the model only if a dataset containing them is added. Until then the API may accept them for display and validation, but the model must not use them.
- Store raw files in `data/raw/` (never edited), cleaned files in `data/processed/`.
- Document source, collection years, population, and licence in `docs/` and on the About Model page.

## 3. Features
Model input order (saved to `models/feature_order.json` and must be identical at training and inference):

`age, gender, total_bilirubin, direct_bilirubin, alkphos, sgpt, sgot, total_proteins, albumin, ag_ratio`

| Feature | Type | Notes |
| --- | --- | --- |
| age | numeric | years |
| gender | categorical | M = 1, F = 0 (mapping saved with model) |
| bilirubins, ALP, SGPT, SGOT | numeric, right-skewed | consider `log1p` transform (decide in EDA, apply identically at inference) |
| total_proteins, albumin, ag_ratio | numeric | roughly symmetric |

Optional engineered features (test in EDA, keep only if validation improves): AST/ALT ratio, direct/total bilirubin ratio, albumin minus total-protein gap.

## 4. Data preparation
1. **Load and inspect:** shape, types, duplicates, class balance, per-feature summary.
2. **Duplicates:** check and remove exact duplicate rows (document how many).
3. **Missing values:** impute A/G ratio with the **training-set median** (or `albumin / (total_proteins - albumin)` if that is shown to match). Fit imputer on training data only.
4. **Outliers:** keep clinically possible extremes (they are real signal in liver disease). Remove only impossible values (negative, or out of the hard ranges in `bmod3`). Use log transform or robust scaling instead of deleting extremes.
5. **Encoding:** encode gender with a fixed mapping.
6. **Scaling:** `StandardScaler` (required for Logistic Regression and SVM; harmless for trees). Fit on training data only.
7. **Pipeline:** wrap imputer, transforms, scaler, and model in one scikit-learn `Pipeline` so the same steps run at inference.

## 5. Data splitting
| Split | Share | Purpose |
| --- | --- | --- |
| Train | 60% | fit models |
| Validation | 20% | tune hyperparameters, choose threshold, choose model |
| Test | 20% | final one-time evaluation |

- Use **stratified** splitting on the target (consider stratifying on target + gender).
- Use a fixed `random_state` and record it.
- Split **before** any imputation, scaling, or feature selection.
- With only about 583 rows, prefer **stratified 5-fold cross-validation on train+validation** for tuning, and keep the test set untouched. Use repeated CV for more stable estimates.

## 6. Models to train
| # | Model | Role | Key settings |
| --- | --- | --- | --- |
| 1 | Logistic Regression | Baseline, easy to explain | `class_weight="balanced"`, `solver="liblinear"` or `lbfgs`, tune `C` in {0.01, 0.1, 1, 10} |
| 2 | Random Forest | Non-linear, robust | `class_weight="balanced"`, `n_estimators` 200 to 500, `max_depth` 3 to 10, `min_samples_leaf` 3 to 10 |
| 3 | XGBoost | Gradient boosting | `scale_pos_weight` = negatives / positives, `max_depth` 2 to 4, `learning_rate` 0.03 to 0.1, `n_estimators` 100 to 400, `subsample` and `colsample_bytree` 0.7 to 1, early stopping on validation |
| 4 | **SVM (optional)** | Margin-based, good on small tabular data | see 6.1 |

### 6.1 SVM details
- Always put `StandardScaler` before the SVM in the pipeline.
- `class_weight="balanced"`.
- Kernels to try: `linear` (explainable) and `rbf`.
- Grid: `C` in {0.1, 1, 10, 100}; `gamma` in {`scale`, 0.01, 0.1, 1} (rbf only).
- **Probabilities:** use `SVC(probability=True)` or, preferably, wrap with `CalibratedClassifierCV(method="sigmoid", cv=5)` so outputs are usable as probabilities.
- Explainability: linear SVM uses coefficients; rbf SVM uses permutation importance (SHAP is slow and approximate here).

### 6.2 Model selection
Pick the model that, on **validation/CV** data, gives the best ROC-AUC and PR-AUC among those meeting the recall target, and shows a small train-validation gap. If two models are close, choose the **simpler or more explainable** one. Never choose using test results.

## 7. Class imbalance
- Use class weights (`balanced`, `scale_pos_weight`) first.
- SMOTE or other resampling is optional, applied **only inside training folds** (use `imblearn.pipeline.Pipeline`), never before splitting.
- Judge results by recall, precision, PR-AUC, and F1, not accuracy alone.

## 8. Evaluation
| Metric | Use |
| --- | --- |
| Accuracy | reported, never used alone |
| Precision | false-alarm control |
| **Recall (sensitivity)** | main screening metric for the disease class |
| Specificity | how well healthy people are cleared |
| F1-score | balance of precision and recall |
| ROC-AUC | ranking ability across thresholds |
| PR-AUC | more informative with imbalance |
| Brier score / calibration curve | whether probabilities can be trusted |
| Confusion matrix | TP, FP, TN, FN counts |

Report mean and standard deviation across CV folds, then the single final test-set result. Include a 95% confidence interval (bootstrap) for recall and ROC-AUC because the dataset is small.

## 9. Threshold and risk categories
1. Compute probabilities on the validation set.
2. Choose the **high-risk threshold** as the highest threshold that still reaches the recall target (project default: **recall of at least 0.90** for the disease class), then check precision and false-positive rate are acceptable.
3. Save the threshold in `models/metrics.json`.

| Probability | Category (initial values, tune on validation) |
| --- | --- |
| below 0.35 | Low |
| 0.35 to below high-risk threshold | Moderate |
| at or above high-risk threshold | High |

The frontend shows the **probability** along with the category. Categories are decision aids, not diagnoses.

## 10. Calibration
- Check the calibration curve on validation data.
- If probabilities are poorly calibrated (common for Random Forest, XGBoost, SVM), apply Platt (sigmoid) or isotonic calibration fitted on training/validation folds, never on test data.
- Re-check the Brier score after calibration.

## 11. Bias, fairness, and subgroups
- Report recall, precision, and false-positive rate separately for **gender** and **age bands** (for example under 30, 30 to 50, over 50).
- ILPD is mostly male and from one region; state that the model may not generalise to women, children, or other populations.
- Do not let gender act as a shortcut: compare performance with and without gender. If removing gender barely changes results, **drop it** from the model.
- Flag any subgroup whose recall is more than about 10 percentage points below the overall recall.
- Document findings in `metrics.json` (`subgroup_metrics`) and show them on the About Model page.

## 12. Overfitting and underfitting
| Situation | Check | Action |
| --- | --- | --- |
| Overfitting | train score much higher than validation/test (gap above about 0.10 in ROC-AUC) | simpler model, stronger regularisation, smaller trees, fewer features, more CV |
| Underfitting | train and validation both poor | better features, transformations, non-linear model, check target definition and encoding |
| Leakage | scores suspiciously high | confirm splits, preprocessing fitted on training only, no target-derived features |

Plot learning curves (score vs training size) for the final candidates.

## 13. Explainability
- **Global:** feature importance (SHAP summary for tree models, coefficients for linear models, permutation importance for SVM rbf).
- **Local (per prediction):** top 3 to 5 contributing features with direction (increased or decreased risk), turned into plain sentences by `bmod5` (for example "Low albumin increased the estimated risk").
- Check that important features are medically plausible (albumin, bilirubin, ALT/AST, ALP). Investigate before deployment if not.
- Use wording such as "contributed to the estimate", never "caused" or "proves".

## 14. Artifacts saved by training
| File | Content |
| --- | --- |
| `models/trained_model.pkl` | final fitted pipeline (or model) saved with joblib |
| `models/scaler.pkl` | fitted scaler (if kept separate from the pipeline) |
| `models/feature_order.json` | exact feature order and gender mapping |
| `models/metrics.json` | metrics, confusion matrix, threshold, subgroup metrics, class balance, dataset size, model type, hyperparameters, `random_state`, training date, library versions, model version |
| `models/model_card.md` | intended use, data, limits, fairness notes |

Record scikit-learn, XGBoost, and Python versions; loading a pickle under a different version can break or change results.

## 15. Inference (bmod4)
1. Load model, scaler, feature order, and threshold **once at startup**; refuse to start if any is missing or mismatched.
2. Receive validated, user-confirmed values from `bmod3`.
3. Build the feature vector in the saved order, encode gender, apply the same imputation and scaling.
4. Predict probability, apply the threshold and risk bands, return `risk_category` and `probability`.
5. Pass the vector to `bmod5` for the top factors.
6. Never log lab values or Patient IDs.

Only load model files from a trusted location (pickle files can run code when loaded).

## 16. Testing the ML code
- Unit tests: preprocessing gives the same output at train and inference time.
- Regression test: a fixed sample returns the expected probability (within a small tolerance).
- Invalid input tests: missing, negative, or text values never reach the model.
- Extreme-value test: very high bilirubin and very low albumin give a High category; typical healthy values give a Low category.

## 17. Monitoring and retraining
- Retrain only when new data is available or performance drops; document the data change and compare old and new metrics before replacing the model.
- Keep previous model versions for rollback.
- If prediction history is stored, track the share of Low/Moderate/High over time and flag large shifts.
- Never train on user submissions without explicit consent and verified labels.

## 18. Deployment approval checklist
- [ ] Test ROC-AUC is acceptable (project target: at least 0.75).
- [ ] High-risk recall meets the target (at least 0.90) with manageable false positives.
- [ ] Train, validation, and test gaps are small.
- [ ] Calibration is reasonable.
- [ ] Subgroup performance is reviewed and documented.
- [ ] Top features are medically plausible.
- [ ] `metrics.json`, feature order, and model card are saved.
- [ ] The UI states the result is **not a diagnosis** and shows model limitations.

## 19. Suggested file layout
```
backend/bmod4-ml-engine/
|-- train.py          # full training and selection workflow
|-- evaluate.py       # metrics, CI, subgroup and calibration reports
|-- preprocess.py     # shared preprocessing used by train and inference
|-- engine.py         # load artifacts, predict, categorise
|-- thresholds.py     # threshold and risk-band logic
backend/bmod5-explainability/
|-- explain.py, messages.py, shap_utils.py
notebooks/
|-- 01_eda.ipynb, 02_training_experiments.ipynb
```

## 20. Training script outline
```python
# 1 load + recode target  ->  2 stratified split (train/val/test)
# 3 pipeline: imputer -> (log1p) -> scaler -> model
# 4 for each model in [LogReg, RandomForest, XGBoost, SVM]:
#       GridSearchCV / RandomizedSearchCV with StratifiedKFold(5), scoring="roc_auc" (also track recall)
# 5 calibrate if needed  ->  6 choose model + threshold on validation data
# 7 evaluate ONCE on test set  ->  8 subgroup + calibration + learning curves
# 9 save model, feature_order.json, metrics.json, model_card.md
```
