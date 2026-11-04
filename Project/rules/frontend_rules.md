# Frontend Rules

1. Never display “You have cirrhosis.”  
   Use: “Model-estimated liver disease/cirrhosis risk.”

2. Always show a medical disclaimer on result screens.

3. Never send a prediction request before the user reviews extracted report values.

4. Show validation errors beside the relevant input field.

5. Use accessible color contrast for red, amber, green, and blue.

6. Never store uploaded reports in localStorage by default.

7. Disable the Predict button until required fields are valid.

8. Display confidence as a probability, not as certainty.

9. Show model limitations on the result page.

10. Keep the API base URL in an environment variable.

11. Use blue for primary actions, red only for high risk/errors, amber for moderate risk, and green for normal/low risk.

12. Provide clear loading states for upload, parsing, validation, and prediction.

13. Allow users to correct OCR-extracted values before prediction.

14. Do not show a result screen without a disclaimer and “Consult a doctor” recommendation.

15. Make the UI responsive for mobile, tablet, and desktop.
