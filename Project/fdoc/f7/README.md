# fmod7-home-awareness  (NEW)

**Purpose:** Public landing page that teaches people what liver cirrhosis is and how to **identify** its signs, then sends them to sign up and check their blood-test values.

## Sections (top to bottom)
| # | Section | What it shows | Visual |
| --- | --- | --- | --- |
| 1 | Hero | "Know the signs of liver cirrhosis early" + Sign up / Login buttons | Large liver illustration |
| 2 | What is cirrhosis? | Plain explanation: long-term damage replaces healthy liver tissue with scar tissue; scarring is permanent, but progression can often be slowed by treating the cause | Healthy vs cirrhotic liver |
| 3 | How the liver gets damaged | Four-stage progression: healthy, fatty liver, fibrosis, cirrhosis | Four liver illustrations with a progress arrow |
| 4 | Identify the signs | Early signs vs advanced signs, tied to the body area they appear in | Body map with numbered markers + two symptom lists |
| 5 | Common causes | Long-term alcohol use, fatty liver disease linked to obesity/diabetes, hepatitis B and C, bile-duct and autoimmune diseases, some medicines and inherited conditions | Cause cards with icons |
| 6 | Who is at higher risk | Heavy alcohol use, obesity, type 2 diabetes, viral hepatitis, family history | Chips |
| 7 | What blood tests can show | Bilirubin, ALT/AST, ALP, albumin, platelets, INR, with one-line meanings (matches the model features) | Colour-coded marker strip |
| 8 | Protect your liver | Vaccination for hepatitis A/B, limit alcohol, healthy weight, safe medicine use, regular check-ups | Checklist |
| 9 | When to get help | Routine visit signs vs **urgent signs** (vomiting blood, black stools, confusion, severe belly swelling with pain/fever) | Amber and red callouts |
| 10 | Call to action | "Create an account to check your lab values" | Button |

## Behaviour
- Route `/` is public. Logged-in users see "Go to Upload" and "Manual Entry" buttons instead of Sign up.
- All images are inline SVG (no external image files, fast, work offline, scale cleanly). Every SVG has a `<title>` and the page has text equivalents for screen readers.
- Content is kept in a `content.js` data object so doctors/reviewers can edit text without touching layout.
- Disclaimer banner appears directly under the hero.

## Content rules
- Educational wording only: "can be a sign of", "may", "talk to a doctor".
- No claim that symptoms equal diagnosis; many people have **no symptoms** in early cirrhosis, so say that clearly.
- Avoid statistics unless a cited source is added to the page.
- Content should be reviewed by a qualified clinician before release.

## Files
`HomePage.jsx` (included), `HomePage.css` (included), `content.js` (move the arrays out of HomePage.jsx when ready)

## Done when
- Page is readable at 360 px and keyboard navigable.
- Both urgent-sign and routine-sign boxes are present.
- Sign up and Login buttons route to `/signup` and `/login`.
