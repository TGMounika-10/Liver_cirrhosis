# Liver Cirrhosis Risk Prediction System

An educational full-stack screening tool that estimates liver disease/cirrhosis risk from uploaded blood-test reports or manually entered lab values. Users sign up with a **Patient ID and password**.

## Disclaimer
This project is not a medical device and does not provide a diagnosis. Always consult a qualified healthcare professional for medical advice.

## Features
- Public awareness home page: what cirrhosis is, stages, how to identify signs, causes, prevention (with illustrations)
- Sign up and login with Patient ID and password
- Blood-test report upload with PDF/image value extraction and user confirmation
- Manual lab-value entry
- ML-based liver disease/cirrhosis risk prediction
- Explainable result dashboard
- Model performance and limitations page

## Tech Stack
- Frontend: React, React Router, Axios, Recharts or Chart.js
- Backend: Python, FastAPI, Pydantic, SQLite/PostgreSQL (accounts), bcrypt, PyJWT
- Machine Learning: scikit-learn, XGBoost, joblib, SHAP
- Report Parsing: pdfplumber, pytesseract

## Modules (each folder has its own README.md)
### Frontend
| Module | Purpose |
| --- | --- |
| [fmod1-app-shell](frontend/fmod1-app-shell/README.md) | Routing, layout, theme, protected routes |
| [fmod2-upload-report](frontend/fmod2-upload-report/README.md) | Upload and confirm extracted values |
| [fmod3-manual-entry](frontend/fmod3-manual-entry/README.md) | Manual lab-value form |
| [fmod4-result-dashboard](frontend/fmod4-result-dashboard/README.md) | Risk result, markers, factors |
| [fmod5-model-info](frontend/fmod5-model-info/README.md) | Metrics, dataset, limitations |
| [fmod6-auth](frontend/fmod6-auth/README.md) | **New:** Login and Sign up |
| [fmod7-home-awareness](frontend/fmod7-home-awareness/README.md) | **New:** Home page with symptom identification |

### Backend
| Module | Purpose |
| --- | --- |
| [bmod1-api-core](backend/bmod1-api-core/README.md) | FastAPI app, config, CORS, errors |
| [bmod2-report-parser](backend/bmod2-report-parser/README.md) | PDF/image extraction |
| [bmod3-validation-rules](backend/bmod3-validation-rules/README.md) | Input validation |
| [bmod4-ml-engine](backend/bmod4-ml-engine/README.md) | Model loading and prediction |
| [bmod5-explainability](backend/bmod5-explainability/README.md) | Plain-language explanations |
| [bmod6-auth](backend/bmod6-auth/README.md) | **New:** Patient ID accounts, JWT |

## Request flow
Home (public) → Sign up / Login → Upload or Manual Entry → (confirm values) → `/api/predict/manual` → Result Dashboard

## Setup
1. Clone the repository.
2. Create a Python virtual environment.
3. Install backend dependencies (`pip install -r requirements.txt`).
4. Train the model using the training script.
5. Copy `.env.example` to `.env` and set `SECRET_KEY`.
6. Start the FastAPI server (`uvicorn backend.bmod1-api-core.main:app` or your chosen package path).
7. Install frontend dependencies (`npm install`).
8. Start the React development server (`npm run dev`).
9. Open the application in a browser.

## Environment Variables
- VITE_API_BASE_URL=http://localhost:8000
- MODEL_PATH=models/trained_model.pkl
- SCALER_PATH=models/scaler.pkl
- SECRET_KEY=change-me-to-a-long-random-string
- DATABASE_URL=sqlite:///./app.db
- ALLOWED_ORIGINS=http://localhost:5173
- MAX_UPLOAD_MB=10

## Model Metrics
Document accuracy, precision, recall, F1-score, ROC-AUC, and confusion matrix after final testing.

## Limitations
- The model is trained on a limited dataset and may not generalize to all populations.
- It does not replace clinical diagnosis.
- OCR extraction may require user verification.
- No password recovery in v1; Patient ID is a self-chosen login name.
