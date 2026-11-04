import { Link } from "react-router-dom";
import { useAuth } from "../fmod6-auth/useAuth";
import "./HomePage.css";

/* ---------- Illustrations (inline SVG) ---------- */
const LIVER = "M12 62C12 30 62 10 112 14c50 4 84 26 80 60-4 32-40 50-80 46-26-2-44-12-66-22C26 90 12 80 12 62Z";

function Liver({ stage = 0, size = 200 }) {
  const fill = ["#C9605A", "#D9A94E", "#A8504B", "#7A3B36"][stage];
  const nodules = [
    [60, 50], [90, 38], [125, 44], [155, 58], [75, 78], [110, 72],
    [145, 86], [95, 98], [55, 70], [130, 100], [165, 78], [40, 60],
  ];
  const titles = [
    "Healthy liver",
    "Fatty liver",
    "Fibrosis (scarring begins)",
    "Cirrhosis (nodules and scarring)",
  ];

  return (
    <svg viewBox="0 0 204 134" width={size} role="img" aria-label={titles[stage]}>
      <title>{titles[stage]}</title>
      <path d={LIVER} fill={fill} stroke="#5b2824" strokeWidth="2" />
      {stage === 0 && (
        <path
          d="M40 50C80 32 130 36 170 58"
          stroke="#E7A09B"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {stage === 1 &&
        nodules.slice(0, 8).map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="6" fill="#F3D98B" opacity=".85" />
        ))}
      {stage === 2 && (
        <g stroke="#5b2824" strokeWidth="2" fill="none" opacity=".6">
          <path d="M40 60C70 50 90 70 120 58" />
          <path d="M70 92C100 80 130 98 160 80" />
          <path d="M95 30C100 55 92 70 100 100" />
        </g>
      )}
      {stage === 3 &&
        nodules.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={7 + (i % 3)}
            fill="#5C2A26"
            stroke="#3a1815"
            opacity=".9"
          />
        ))}
      <path
        d="M118 112c6 14 22 16 28 6"
        stroke="#2E7D32"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BodyMap() {
  const marks = [
    [100, 28, "1", "#F9A825"],
    [100, 78, "2", "#C62828"],
    [100, 132, "3", "#C62828"],
    [66, 150, "4", "#F9A825"],
    [100, 236, "5", "#C62828"],
  ];

  return (
    <svg
      viewBox="0 0 200 290"
      width="220"
      role="img"
      aria-label="Body map showing where signs of cirrhosis can appear"
    >
      <title>Body map of cirrhosis signs</title>
      <g fill="#E6EEF8" stroke="#1565C0" strokeWidth="2">
        <circle cx="100" cy="30" r="22" />
        <path d="M62 66h76l14 90-20 8-6 58H74l-6-58-20-8Z" />
        <path d="M74 222l-8 60h24l8-60Zm52 0 8 60h-24l-8-60Z" />
      </g>
      <ellipse cx="108" cy="132" rx="22" ry="14" fill="#C9605A" opacity=".8" />
      {marks.map(([x, y, n, c]) => (
        <g key={n}>
          <circle cx={x} cy={y} r="11" fill={c} />
          <text
            x={x}
            y={y + 4}
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill={n === "1" || n === "4" ? "#1F2937" : "#fff"}
          >
            {n}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ---------- Content Data ---------- */
const stages = [
  ["Healthy liver", "Smooth tissue; filters blood, makes bile and proteins."],
  ["Fatty liver", "Extra fat builds up. Often silent and can improve with lifestyle change."],
  ["Fibrosis", "Long-term injury creates scar tissue. The liver still works."],
  ["Cirrhosis", "Widespread scarring and lumps. The liver struggles to do its jobs."],
];

const bodyAreas = [
  ["1", "Eyes and skin", "Yellow colour (jaundice), itching"],
  ["2", "Upper chest and palms", "Spider-like blood vessels, red palms"],
  ["3", "Belly", "Swelling from fluid (ascites), pain on the right side"],
  ["4", "Skin", "Easy bruising or bleeding"],
  ["5", "Legs and ankles", "Swelling"],
];

const early = [
  "Tiredness and weakness",
  "Loss of appetite",
  "Nausea",
  "Unplanned weight loss",
  "Often no symptoms at all",
];

const advanced = [
  "Yellow eyes and skin",
  "Dark urine, pale stools",
  "Swollen belly or legs",
  "Easy bruising and bleeding",
  "Confusion or sleepiness",
  "Itchy skin",
];

const causes = [
  ["Alcohol", "Long-term heavy drinking"],
  ["Fatty liver", "Linked to obesity and type 2 diabetes"],
  ["Hepatitis B / C", "Viral infections of the liver"],
  ["Other", "Bile-duct and autoimmune disease, some medicines, inherited conditions"],
];

const tests = [
  ["Bilirubin", "Yellow pigment; high when the liver cannot clear it", "#F9A825"],
  ["ALT / AST", "Enzymes that leak out of injured liver cells", "#C62828"],
  ["ALP", "Linked to bile flow", "#F9A825"],
  ["Albumin", "Protein made by the liver; low in long-term disease", "#1565C0"],
  ["Platelets / INR", "Clotting-related; can change in advanced disease", "#2E7D32"],
];

const protect = [
  "Get hepatitis A and B vaccines",
  "Limit or avoid alcohol",
  "Keep a healthy weight and stay active",
  "Use medicines and supplements only as advised",
  "Get regular check-ups if you are at risk",
];

/* ---------- Page Component ---------- */
export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="home">
      <section className="hero">
        <div>
          <h1>Know the signs of liver cirrhosis early</h1>
          <p>
            Cirrhosis often develops quietly over years. Learn what to look for, then check your liver blood-test values with an educational risk estimate.
          </p>
          <div className="actions">
            {isAuthenticated ? (
              <>
                <Link className="btn primary" to="/upload">
                  Upload a report
                </Link>
                <Link className="btn" to="/manual">
                  Enter values
                </Link>
              </>
            ) : (
              <>
                <Link className="btn primary" to="/signup">
                  Sign up
                </Link>
                <Link className="btn" to="/login">
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
        <Liver stage={0} size={280} />
      </section>

      <section>
        <h2>What is cirrhosis?</h2>
        <p className="lead">
          Cirrhosis is advanced scarring of the liver. Repeated damage replaces healthy tissue with scar tissue. The scarring is permanent, but treating the cause early can often slow or stop it getting worse.
        </p>
      </section>

      <section>
        <h2>How a liver changes over time</h2>
        <ol className="stages">
          {stages.map(([t, d], i) => (
            <li key={t}>
              <Liver stage={i} size={150} />
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
        <div className="progress" aria-hidden="true">
          <span>Healthier</span>
          <i />
          <span>More damage</span>
        </div>
      </section>

      <section>
        <h2>Identify the signs</h2>
        <p className="lead">
          Many people have no symptoms until the liver is badly damaged. Signs can appear in different parts of the body.
        </p>
        <div className="signs">
          <BodyMap />
          <ul className="areas">
            {bodyAreas.map(([n, a, d]) => (
              <li key={n}>
                <b>{n}</b>
                <span>
                  <strong>{a}</strong>
                  <br />
                  {d}
                </span>
              </li>
            ))}
          </ul>
          <div className="cols">
            <div className="card amber">
              <h3>Early signs</h3>
              <ul>
                {early.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="card red">
              <h3>Later signs</h3>
              <ul>
                {advanced.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Common causes</h2>
        <div className="grid">
          {causes.map(([t, d]) => (
            <div className="card" key={t}>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
        <div className="chips">
          <span>Higher risk factors:</span>
          {["Heavy alcohol use", "Obesity", "Type 2 diabetes", "Viral hepatitis", "Family history"].map((c) => (
            <span key={c} className="chip">
              {c}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2>What liver blood tests can show</h2>
        <ul className="tests">
          {tests.map(([n, d, c]) => (
            <li key={n} style={{ borderLeftColor: c }}>
              <strong>{n}</strong>
              <span>{d}</span>
            </li>
          ))}
        </ul>
        <p className="note">
          Blood tests can raise suspicion but cannot confirm cirrhosis. Doctors also use clinical examination, ultrasound or elastography, and sometimes biopsy.
        </p>
      </section>

      <section>
        <h2>Protect your liver</h2>
        <ul className="checks">
          {protect.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>

      <section className="help">
        <div className="card amber">
          <h3>See a doctor soon if you notice</h3>
          <p>
            Yellow eyes or skin, ongoing tiredness, swelling in belly or legs, dark urine, easy bruising, or unexplained weight loss.
          </p>
        </div>
        <div className="card red">
          <h3>Get emergency care for</h3>
          <p>
            Vomiting blood, black or bloody stools, new confusion or extreme drowsiness, or a swollen belly with pain or fever.
          </p>
        </div>
      </section>

      <section className="cta">
        <h2>Check your liver blood-test values</h2>
        <p style={{ margin: "10px 0 20px" }}>
          Upload an existing report or enter key laboratory metrics to view an educational risk estimate.
        </p>
        <Link className="btn primary" to={isAuthenticated ? "/upload" : "/signup"}>
          {isAuthenticated ? "Start a check" : "Create an account"}
        </Link>
      </section>
    </main>
  );
}

