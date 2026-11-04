import { useState, useCallback, useMemo } from "react";

export const FIELD_DEFINITIONS = [
  {
    key: "age",
    label: "Age",
    unit: "years",
    required: true,
    min: 1,
    max: 120,
    normalRange: "18 – 85 years",
    hint: "Patient age in completed years (1 – 120)",
    placeholder: "e.g. 45",
  },
  {
    key: "gender",
    label: "Gender",
    unit: "M / F",
    required: true,
    type: "select",
    options: [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
    ],
    hint: "Biological sex assigned at birth",
  },
  {
    key: "total_bilirubin",
    label: "Total Bilirubin",
    unit: "mg/dL",
    required: true,
    min: 0.1,
    max: 80,
    normalRange: "0.2 – 1.2 mg/dL",
    hint: "Total bilirubin level in blood (0.1 – 80 mg/dL)",
    placeholder: "e.g. 1.0",
  },
  {
    key: "direct_bilirubin",
    label: "Direct Bilirubin",
    unit: "mg/dL",
    required: true,
    min: 0.0,
    max: 40,
    normalRange: "0.0 – 0.3 mg/dL",
    hint: "Conjugated direct bilirubin (0.0 – 40 mg/dL)",
    placeholder: "e.g. 0.2",
  },
  {
    key: "alkphos",
    label: "Alkaline Phosphatase (ALP)",
    unit: "IU/L",
    required: true,
    min: 10,
    max: 3000,
    normalRange: "30 – 120 IU/L",
    hint: "Alkaline phosphatase activity (10 – 3000 IU/L)",
    placeholder: "e.g. 85",
  },
  {
    key: "sgpt",
    label: "SGPT / ALT",
    unit: "IU/L",
    required: true,
    min: 1,
    max: 5000,
    normalRange: "7 – 56 IU/L",
    hint: "Alanine aminotransferase (1 – 5000 IU/L)",
    placeholder: "e.g. 28",
  },
  {
    key: "sgot",
    label: "SGOT / AST",
    unit: "IU/L",
    required: true,
    min: 1,
    max: 5000,
    normalRange: "10 – 40 IU/L",
    hint: "Aspartate aminotransferase (1 – 5000 IU/L)",
    placeholder: "e.g. 32",
  },
  {
    key: "total_proteins",
    label: "Total Protein",
    unit: "g/dL",
    required: true,
    min: 2,
    max: 12,
    normalRange: "6.0 – 8.3 g/dL",
    hint: "Total serum protein concentration (2 – 12 g/dL)",
    placeholder: "e.g. 7.2",
  },
  {
    key: "albumin",
    label: "Albumin",
    unit: "g/dL",
    required: true,
    min: 0.5,
    max: 7,
    normalRange: "3.5 – 5.0 g/dL",
    hint: "Serum albumin level (0.5 – 7 g/dL)",
    placeholder: "e.g. 4.1",
  },
  {
    key: "ag_ratio",
    label: "A/G Ratio",
    unit: "ratio",
    required: true,
    min: 0.1,
    max: 4,
    normalRange: "1.0 – 2.5",
    hint: "Albumin to Globulin ratio (0.1 – 4.0)",
    placeholder: "e.g. 1.2",
  },
  {
    key: "platelet_count",
    label: "Platelet Count",
    unit: "x10³/µL",
    required: false,
    min: 5,
    max: 1000,
    normalRange: "150 – 450 x10³/µL",
    hint: "Optional blood platelet count (5 – 1000)",
    placeholder: "e.g. 250",
  },
  {
    key: "pt",
    label: "Prothrombin Time (PT)",
    unit: "seconds",
    required: false,
    min: 8,
    max: 40,
    normalRange: "11.0 – 13.5 s",
    hint: "Optional clotting time parameter (8 – 40 s)",
    placeholder: "e.g. 12.0",
  },
  {
    key: "inr",
    label: "INR",
    unit: "ratio",
    required: false,
    min: 0.5,
    max: 10,
    normalRange: "0.8 – 1.2",
    hint: "Optional International Normalized Ratio (0.5 – 10)",
    placeholder: "e.g. 1.0",
  },
  {
    key: "ggt",
    label: "GGT",
    unit: "IU/L",
    required: false,
    min: 1,
    max: 1000,
    normalRange: "9 – 48 IU/L",
    hint: "Optional Gamma-glutamyl transferase (1 – 1000 IU/L)",
    placeholder: "e.g. 25",
  },
];

export function useLabValidation(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [serverErrors, setServerErrors] = useState({});

  const validateField = (key, val, allValues) => {
    const def = FIELD_DEFINITIONS.find((d) => d.key === key);
    if (!def) return null;

    const isPresent = val !== undefined && val !== null && val !== "";

    if (def.required && !isPresent) {
      return `${def.label} is required.`;
    }

    if (isPresent) {
      if (def.type === "select") {
        if (!["Male", "Female", "M", "F"].includes(val)) {
          return "Please select Male or Female.";
        }
      } else {
        const num = parseFloat(val);
        if (Number.isNaN(num)) {
          return `${def.label} must be a number.`;
        }
        if (num < def.min || num > def.max) {
          return `Value must be between ${def.min} and ${def.max} ${def.unit}.`;
        }
      }
    }

    // Cross-field checks for physiological validity
    if (key === "direct_bilirubin" || key === "total_bilirubin") {
      const tb = parseFloat(key === "total_bilirubin" ? val : allValues.total_bilirubin);
      const db = parseFloat(key === "direct_bilirubin" ? val : allValues.direct_bilirubin);
      if (!Number.isNaN(tb) && !Number.isNaN(db) && db > tb) {
        if (key === "direct_bilirubin") {
          return "Direct bilirubin cannot exceed total bilirubin.";
        }
      }
    }

    if (key === "albumin" || key === "total_proteins") {
      const tp = parseFloat(key === "total_proteins" ? val : allValues.total_proteins);
      const alb = parseFloat(key === "albumin" ? val : allValues.albumin);
      if (!Number.isNaN(tp) && !Number.isNaN(alb) && alb > tp) {
        if (key === "albumin") {
          return "Albumin cannot exceed total protein.";
        }
      }
    }

    return null;
  };

  const getWarning = (key, val, allValues) => {
    if (val === undefined || val === null || val === "") return null;
    const num = parseFloat(val);
    if (Number.isNaN(num)) return null;

    // Unit mismatch warnings (e.g. g/L instead of g/dL)
    if (key === "albumin" && num > 15) {
      return "Albumin appears very high. If reported in g/L, please convert to g/dL (e.g., 35 g/L = 3.5 g/dL).";
    }
    if (key === "total_proteins" && num > 20) {
      return "Total protein appears very high. If reported in g/L, please convert to g/dL (e.g., 70 g/L = 7.0 g/dL).";
    }

    if (key === "ag_ratio") {
      const tp = parseFloat(allValues.total_proteins);
      const alb = parseFloat(allValues.albumin);
      if (!Number.isNaN(tp) && !Number.isNaN(alb)) {
        const glob = tp - alb;
        if (glob > 0) {
          const calc = alb / glob;
          if (Math.abs(calc - num) > 0.8) {
            return `Calculated ratio is ${calc.toFixed(2)}. Please verify report.`;
          }
        }
      }
    }

    return null;
  };

  // Run validation on all defined fields
  const clientErrors = useMemo(() => {
    const errs = {};
    FIELD_DEFINITIONS.forEach((def) => {
      const err = validateField(def.key, values[def.key], values);
      if (err) {
        errs[def.key] = err;
      }
    });
    return errs;
  }, [values]);

  const warnings = useMemo(() => {
    const warns = {};
    FIELD_DEFINITIONS.forEach((def) => {
      const w = getWarning(def.key, values[def.key], values);
      if (w) {
        warns[def.key] = w;
      }
    });
    return warns;
  }, [values]);

  // Combined errors (server errors take priority if present)
  const combinedErrors = useMemo(() => {
    return { ...clientErrors, ...serverErrors };
  }, [clientErrors, serverErrors]);

  const isValid = Object.keys(clientErrors).length === 0;

  const handleChange = useCallback((key, value) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    // Clear server error for this field upon modification
    setServerErrors((prev) => {
      if (prev[key]) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return prev;
    });
  }, []);

  const handleBlur = useCallback((key) => {
    setTouched((prev) => ({
      ...prev,
      [key]: true,
    }));
  }, []);

  const touchAll = useCallback(() => {
    const allTouched = {};
    FIELD_DEFINITIONS.forEach((d) => {
      allTouched[d.key] = true;
    });
    setTouched(allTouched);
  }, []);

  const setApiErrors = useCallback((fieldErrors) => {
    if (typeof fieldErrors === "object" && fieldErrors !== null) {
      setServerErrors(fieldErrors);
    }
  }, []);

  const resetForm = useCallback((newValues = {}) => {
    setValues(newValues);
    setTouched({});
    setServerErrors({});
  }, []);

  return {
    values,
    setValues,
    errors: combinedErrors,
    warnings,
    touched,
    isValid,
    handleChange,
    handleBlur,
    touchAll,
    setApiErrors,
    resetForm,
  };
}

