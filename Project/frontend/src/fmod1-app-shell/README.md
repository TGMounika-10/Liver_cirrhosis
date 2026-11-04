# fmod1-app-shell

## Purpose
Base React application implementing routing, global layout, theme tokens, header, footer, responsive mobile layout, medical disclaimers, and route protection.

## Implemented Pages and Routes
| Route | Component | Access Control |
| --- | --- | --- |
| `/` | `HomePage` (fmod7) | Public |
| `/login` | `LoginPage` (fmod6) | Public (redirects to `/upload` if authenticated) |
| `/signup` | `SignupPage` (fmod6) | Public (redirects to `/upload` if authenticated) |
| `/upload` | `UploadPage` (fmod2) | **Protected** (redirects unauthenticated users to `/login`) |
| `/manual` | `ManualEntryPage` (fmod3) | **Protected** (redirects unauthenticated users to `/login`) |
| `/result` | `ResultPage` (fmod4) | **Protected** (redirects unauthenticated users to `/login`) |
| `/about-model` | `AboutModelPage` (fmod5) | Public |

## Adherence to Specifications & Frontend Rules
- **Rule 1 (Language):** Never displays "You have cirrhosis." Displays "Model-estimated liver disease/cirrhosis risk."
- **Rule 2 & 14 (Medical Disclaimer):** Global disclaimer banner is permanently visible on `/result` with "Consult a qualified doctor" guidance, and dismissible on Home (`/`).
- **Rule 5 & 11 (Color & Contrast):** High-contrast tokens meeting WCAG AA standards. Blue for primary actions, red strictly as an accent for errors/high risk, amber for warnings/moderate risk, green for success/low risk.
- **Rule 10 (Environment Configuration):** API base URL is resolved via `import.meta.env.VITE_API_BASE_URL` with fallback to `http://localhost:8000`.
- **Rule 15 (Responsiveness):** Fluid layout supporting mobile devices from 360 px upward, tablets, and desktop displays with responsive hamburger menu navigation.

## Key Files
- `App.jsx`: Global shell wrapping header, disclaimer banner, routed main view, and footer.
- `routes.jsx`: React Router v6 route configuration with `ProtectedRoute` and `PublicOnlyRoute`.
- `ProtectedRoute.jsx`: Authentication gate guarding lab upload, manual entry, and result dashboards.
- `Header.jsx` & `Header.css`: Sticky responsive header with navigation links, auth status pill, and mobile toggle.
- `Footer.jsx` & `Footer.css`: Semantic footer with medical disclaimer and model transparency links.
- `DisclaimerBanner.jsx` & `DisclaimerBanner.css`: Medical disclaimer banner with route-aware permanence on `/result`.
- `theme.css`: Design tokens, WCAG AA accessible contrast, keyboard `:focus-visible` styling, and typography.
- `api/client.js`: Shared Axios client with Bearer token injection and automatic 401 logout interception.

