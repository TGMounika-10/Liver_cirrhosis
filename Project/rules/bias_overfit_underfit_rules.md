# Bias, Overfitting, and Underfitting Rules

## Bias Prevention
- Check performance separately for gender and age groups.
- Do not allow gender to become an unfair proxy for disease.
- Document dataset source and population limitations.
- Do not claim the model works for populations not represented in training data.
- Review false-positive and false-negative rates across demographic groups.

## Overfitting Prevention
- Compare training, validation, and test performance.
- If training accuracy is much higher than test accuracy, reduce model complexity.
- Use regularization, pruning, dropout where applicable, or simpler models.
- Use cross-validation.
- Do not tune hyperparameters using the test set.
- Avoid adding too many weak or correlated features.

## Underfitting Prevention
- If both training and test performance are poor, try better features or models.
- Check whether important markers such as albumin, bilirubin, INR, and platelets are available.
- Ensure categorical variables are encoded correctly.
- Confirm that the target label is meaningful and consistently defined.
- Try non-linear models such as Random Forest or XGBoost.

## Deployment Approval Rule
Deploy only if:
- Test ROC-AUC is acceptable.
- Recall for high-risk cases meets the project target.
- Training-validation-test gaps are small.
- Feature importance is medically plausible.
- The UI clearly states that the output is not a diagnosis.
