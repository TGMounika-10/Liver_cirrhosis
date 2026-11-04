import { Link } from "react-router-dom";

export default function AboutModelPage() {
  return (
    <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ background: "var(--surface)", padding: "32px", borderRadius: "var(--radius-lg)", border: "1px solid var(--surface-border)", boxShadow: "var(--shadow-sm)" }}>
        <h1 style={{ color: "var(--blue)", marginBottom: "12px", fontSize: "1.85rem" }}>
          About the Risk Prediction Model & Transparency
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", marginBottom: "28px" }}>
          Detailed technical specifications, clinical datasets, performance benchmarks, and known limitations.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          <div style={{ padding: "18px", borderRadius: "var(--radius-md)", background: "var(--bg)", border: "1px solid var(--surface-border)" }}>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--text-light)", fontWeight: 700 }}>Primary Dataset</span>
            <h3 style={{ margin: "4px 0", color: "var(--blue)" }}>ILPD</h3>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>Indian Liver Patient Dataset (583 records, tabular blood-test data).</p>
          </div>
          <div style={{ padding: "18px", borderRadius: "var(--radius-md)", background: "var(--bg)", border: "1px solid var(--surface-border)" }}>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--text-light)", fontWeight: 700 }}>Primary Metric</span>
            <h3 style={{ margin: "4px 0", color: "var(--blue)" }}>High Recall</h3>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>Threshold tuned to prioritize sensitivity to avoid missing potential cases.</p>
          </div>
          <div style={{ padding: "18px", borderRadius: "var(--radius-md)", background: "var(--bg)", border: "1px solid var(--surface-border)" }}>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--text-light)", fontWeight: 700 }}>Model Output</span>
            <h3 style={{ margin: "4px 0", color: "var(--blue)" }}>Probability (0–1)</h3>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>Mapped to Low (&lt;0.35), Moderate, or High risk categories.</p>
          </div>
        </div>

        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.3rem", color: "var(--text)", marginBottom: "12px" }}>Clinical & Technical Limitations</h2>
          <ul style={{ paddingLeft: "24px", color: "var(--text-muted)", lineHeight: "1.7" }}>
            <li>
              <strong>Educational Screening Only:</strong> This software is not a medical device and does not diagnose cirrhosis or any liver pathology.
            </li>
            <li>
              <strong>Dataset Scope:</strong> The model evaluates liver disease broadly based on historical lab records and cannot differentiate specific etiologies without additional imaging and clinical findings.
            </li>
            <li>
              <strong>No Substitute for Clinicians:</strong> Always consult a qualified medical professional for health inquiries and symptom investigations.
            </li>
          </ul>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <Link to="/" className="btn">Back to Awareness</Link>
          <Link to="/upload" className="btn primary">Check Your Lab Values</Link>
        </div>
      </div>
    </div>
  );
}

