import "./MarkerTable.css";

// Marker reference limits for calculating status chip
const MARKER_THRESHOLDS = {
  total_bilirubin: {
    label: "Total Bilirubin",
    unit: "mg/dL",
    refRange: "0.2 – 1.2 mg/dL",
    desc: "Bile pigment cleared by hepatocytes",
    evaluate: (v) => {
      const n = parseFloat(v);
      if (Number.isNaN(n)) return "Normal";
      if (n > 2.0) return "Abnormal";
      if (n > 1.2) return "Borderline";
      return "Normal";
    },
  },
  direct_bilirubin: {
    label: "Direct Bilirubin",
    unit: "mg/dL",
    refRange: "0.0 – 0.3 mg/dL",
    desc: "Conjugated water-soluble fraction",
    evaluate: (v) => {
      const n = parseFloat(v);
      if (Number.isNaN(n)) return "Normal";
      if (n > 0.6) return "Abnormal";
      if (n > 0.3) return "Borderline";
      return "Normal";
    },
  },
  alkphos: {
    label: "Alkaline Phosphatase (ALP)",
    unit: "IU/L",
    refRange: "30 – 120 IU/L",
    desc: "Bile duct and canalicular enzyme",
    evaluate: (v) => {
      const n = parseFloat(v);
      if (Number.isNaN(n)) return "Normal";
      if (n > 180) return "Abnormal";
      if (n > 120) return "Borderline";
      return "Normal";
    },
  },
  sgpt: {
    label: "Alanine Aminotransferase (ALT / SGPT)",
    unit: "IU/L",
    refRange: "7 – 56 IU/L",
    desc: "Primary enzyme for liver cellular injury",
    evaluate: (v) => {
      const n = parseFloat(v);
      if (Number.isNaN(n)) return "Normal";
      if (n > 100) return "Abnormal";
      if (n > 56) return "Borderline";
      return "Normal";
    },
  },
  sgot: {
    label: "Aspartate Aminotransferase (AST / SGOT)",
    unit: "IU/L",
    refRange: "10 – 40 IU/L",
    desc: "Mitochondrial & cytoplasmic enzyme",
    evaluate: (v) => {
      const n = parseFloat(v);
      if (Number.isNaN(n)) return "Normal";
      if (n > 80) return "Abnormal";
      if (n > 40) return "Borderline";
      return "Normal";
    },
  },
  total_proteins: {
    label: "Total Protein",
    unit: "g/dL",
    refRange: "6.0 – 8.3 g/dL",
    desc: "Total serum albumin and globulins",
    evaluate: (v) => {
      const n = parseFloat(v);
      if (Number.isNaN(n)) return "Normal";
      if (n < 5.5 || n > 9.0) return "Abnormal";
      if (n < 6.0 || n > 8.3) return "Borderline";
      return "Normal";
    },
  },
  albumin: {
    label: "Albumin",
    unit: "g/dL",
    refRange: "3.5 – 5.0 g/dL",
    desc: "Major protein synthesized by functional liver",
    evaluate: (v) => {
      const n = parseFloat(v);
      if (Number.isNaN(n)) return "Normal";
      if (n < 3.0) return "Abnormal";
      if (n < 3.5) return "Borderline";
      return "Normal";
    },
  },
  ag_ratio: {
    label: "A/G Ratio",
    unit: "ratio",
    refRange: "1.0 – 2.5",
    desc: "Albumin to Globulin balance",
    evaluate: (v) => {
      const n = parseFloat(v);
      if (Number.isNaN(n)) return "Normal";
      if (n < 1.0) return "Abnormal";
      if (n < 1.2) return "Borderline";
      return "Normal";
    },
  },
  platelet_count: {
    label: "Platelet Count",
    unit: "x10³/µL",
    refRange: "150 – 450 x10³/µL",
    desc: "Thrombocyte count (portal pressure proxy)",
    evaluate: (v) => {
      const n = parseFloat(v);
      if (Number.isNaN(n)) return "Normal";
      if (n < 100) return "Abnormal";
      if (n < 150) return "Borderline";
      return "Normal";
    },
  },
  age: {
    label: "Age",
    unit: "years",
    refRange: "18 – 85 years",
    desc: "Patient age",
    evaluate: () => "Normal",
  },
  gender: {
    label: "Gender",
    unit: "",
    refRange: "Male / Female",
    desc: "Biological sex",
    evaluate: () => "Normal",
  },
};

export default function MarkerTable({ labValues = {} }) {
  const entries = Object.entries(labValues).filter(([k]) => MARKER_THRESHOLDS[k]);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="marker-table-card">
      <div className="marker-table-header">
        <h3 className="marker-table-title">Biomarker Analysis & Clinical Ranges</h3>
        <p className="marker-table-subtitle">
          Submitted blood values compared against standard laboratory reference intervals.
        </p>
      </div>

      <div className="table-responsive-box">
        <table className="markers-data-table">
          <thead>
            <tr>
              <th scope="col">Laboratory Marker</th>
              <th scope="col">Your Value</th>
              <th scope="col">Reference Interval</th>
              <th scope="col">Evaluation</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([key, rawValue]) => {
              const def = MARKER_THRESHOLDS[key];
              const status = def.evaluate(rawValue);
              const statusLower = status.toLowerCase();

              return (
                <tr key={key} className={`marker-row row-${statusLower}`}>
                  <td className="marker-col-name">
                    <span className="marker-label-text">{def.label}</span>
                    <span className="marker-subtext">{def.desc}</span>
                  </td>

                  <td className="marker-col-value">
                    <strong className="value-number">{rawValue}</strong>
                    {def.unit && <span className="value-unit">{def.unit}</span>}
                  </td>

                  <td className="marker-col-ref">
                    <span className="ref-range-badge">{def.refRange}</span>
                  </td>

                  <td className="marker-col-status">
                    <span className={`status-badge chip-${statusLower}`}>
                      {status === "Normal" && <span className="chip-icon">✓</span>}
                      {status === "Borderline" && <span className="chip-icon">▲</span>}
                      {status === "Abnormal" && <span className="chip-icon">!</span>}
                      <span className="chip-text">{status}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

