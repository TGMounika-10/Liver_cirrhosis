# Machine Learning Rules

1. Split data into training, validation, and test sets before tuning.

2. Fit scalers and encoders only on training data.

3. Use stratified splitting because liver-disease datasets are often imbalanced.

4. Evaluate using accuracy, precision, recall, F1-score, ROC-AUC, and confusion matrix.

5. Prioritize recall for the high-risk class, but monitor false positives.

6. Use stratified k-fold cross-validation.

7. Save the exact feature order used during training.

8. Save the scaler, encoder, model, threshold, and metrics together.

9. Retrain only after documenting data changes and metric differences.

10. Never use test data for feature selection or hyperparameter tuning.

11. Compare at least Logistic Regression, Random Forest, and XGBoost.

12. Select the final model using test-set recall, ROC-AUC, calibration, and explainability—not accuracy alone.

13. Handle class imbalance using class weights, resampling, or threshold tuning.

14. Check feature importance for medical plausibility.

15. Document dataset source, size, class balance, and known limitations.
