# fmod2-upload-report

## Purpose
Upload blood-test reports (PDF or image), send them to the extraction parser, and allow patients to inspect, edit, and confirm extracted values before generating a statistical risk estimate.

## Flow
1. **File Selection & Dropzone (`UploadDropzone.jsx`)**:
   - Accepts PDF, JPG, JPEG, and PNG up to 10 MB.
   - Rejects unsupported MIME types and oversized files with explicit error alerts.
2. **Preview Card (`FilePreview.jsx`)**:
   - Renders image thumbnail via object URL or PDF document badge with filename and formatted size.
   - Allows removing or replacing the file prior to parsing.
3. **Extraction & Progress (`UploadProgress.jsx`)**:
   - Posts `multipart/form-data` to `POST /api/report/upload` with Bearer auth token.
   - Shows progress bar and status steps ("Uploading", "Reading report", "Extracting values").
4. **Editable Review Table (`ExtractedValuesTable.jsx`)**:
   - Renders each lab marker, unit, reference range, and extracted value.
   - Highlights missing required fields in amber with empty inputs.
   - Flags physiological inconsistencies (e.g. Direct > Total Bilirubin, Albumin > Total Protein) with inline error text beside the field.
   - Displays backend extraction notices and unit conversion warnings.
5. **Confirmation Gate (`ConfirmCheckbox.jsx`)**:
   - User ticks "I have checked and confirmed these values."
   - Predict button remains disabled until all required fields are valid and confirmation is checked.
6. **Prediction**:
   - Submits confirmed JSON payload to `POST /api/predict/manual`.
   - Navigates to `/result` dashboard with response data and submitted markers.

## Key Rules Followed
- **No Early Prediction**: Never calls the prediction endpoint before user confirms.
- **Privacy & Memory Only**: Uploaded files and reports are held in component state only; never persisted to `localStorage` or `sessionStorage`.
- **No Silent Imputation**: Missing values stay empty and highlighted; they are never filled silently.
- **Graceful Error Recovery**: If parsing fails, users are shown an explicit alert and a direct button to switch to Manual Entry (`/manual`).
- **Correction Support**: Any misrecognized OCR field can be edited in the table and the user's corrected figure is what gets passed to the model.

