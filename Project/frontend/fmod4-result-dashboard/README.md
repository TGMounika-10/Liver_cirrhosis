# fmod4-result-dashboard

## Purpose
Displays the machine-learning-estimated liver disease/cirrhosis risk cleanly, responsibly, and transparently, adhering strictly to clinical screening guidelines and frontend rules.

## Core Sections & Components
1. **Risk Summary (`RiskSummary.jsx`)**:
   - Displays estimated risk category (Low, Moderate, High) and probability formatted as:
     `"Model-estimated liver disease/cirrhosis risk: XX%"`
   - Adheres to **Frontend Rule 1**: Never states "You have cirrhosis".
   - Adheres to **Frontend Rule 8**: Presents result as statistical probability, avoiding definitive certainty.
2. **Semi-Circle Risk Gauge (`RiskGauge.jsx`)**:
   - Visual SVG arc gauge divided into Green (&lt;35%), Amber (35%–52%), and Red (&ge;52%) zones.
   - Rotational needle pointer indicating the model-calculated probability.
3. **Biomarker Table (`MarkerTable.jsx`)**:
   - Renders each submitted lab value alongside standard clinical reference ranges.
   - Features accessible status chips with text + icons:
     - **Normal** (Green badge with checkmark)
     - **Borderline** (Amber badge with warning triangle)
     - **Abnormal** (Red badge with exclamation point)
   - Color is never the sole visual signal.
4. **Explainable Factors (`FactorList.jsx`)**:
   - 3 to 5 plain-language lines explaining how the model weighted individual features upward or downward (SHAP values).
5. **Next Steps Card (`NextStepsCard.jsx`)**:
   - Prominent **"Consult a qualified doctor"** advisory.
   - Outlines routine discussion points for physician consultations.
   - Highlights emergency red warning callouts (vomiting blood, black stools, sudden severe abdominal ascites, confusion).
6. **Permanent Medical Notice (`DisclaimerBlock.jsx`)**:
   - Always visible and non-collapsed (Frontend Rule 2 & 9).
   - Clarifies ILPD training cohort scope and reminds users that the application is not a diagnostic device.
7. **Action Bar & Printing (`ResultPage.jsx`)**:
   - "Start new check" links.
   - "Print / save summary" using a dedicated `@media print` stylesheet that removes navigation and button chrome while formatting a clinical printout.

## Done When
- Low, Moderate, and High sample responses render with appropriate color coding and educational copy.
- Disclaimer and limitations remain permanently visible without user interaction.
- Direct navigation without result state safely redirects to `/manual`.

