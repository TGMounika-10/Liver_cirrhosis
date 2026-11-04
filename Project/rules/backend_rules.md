# Backend Rules

1. Validate every input before model inference.

2. Never trust OCR output blindly; return extracted fields for user confirmation.

3. Use Pydantic for request and response validation.

4. Return structured errors:
```json
{
  "status": "error",
  "code": "INVALID_INPUT",
  "message": "Albumin value is invalid."
}
```

5. Do not store raw medical reports unless explicitly required and secured.

6. Log technical events, not patient-identifying information.

7. Load the ML model and scaler once at application startup.

8. Use the same preprocessing pipeline during training and inference.

9. Return both probability and risk category.

10. Provide a `/api/health` endpoint.

11. Use CORS only for the approved React frontend origin.

12. Reject invalid file types and oversized uploads.

13. Return warnings for missing optional fields instead of failing silently.

14. Do not modify user-entered medical values without user confirmation.

15. Keep API versioning, for example `/api/v1/`.
