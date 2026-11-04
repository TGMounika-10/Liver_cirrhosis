/**
 * Clinical reference metadata, units, and validation boundaries for liver panel blood-test markers.
 * Shared across fmod2-upload-report and fmod3-manual-entry.
 */

export const LAB_FIELDS = [
  {
    key: "age",
    label: "Age",
    shortLabel: "Age",
    unit: "years",
    required: true,
    min: 1,
    max: 120,
    normalRange: "18 – 85 years",
    description: "Patient age in years",
  },
  {
    key: "gender",
    label: "Gender",
    shortLabel: "Gender",
    unit: "M / F",
    required: true,
    type: "select",
    options: [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
    ],
    description: "Biological sex assigned at birth",
  },
  {
    key: "total_bilirubin",
    label: "Total Bilirubin",
    shortLabel: "T. Bilirubin",
    unit: "mg/dL",
    required: true,
    min: 0.1,
    max: 80,
    normalRange: "0.2 – 1.2 mg/dL",
    description: "Yellow breakdown pigment cleared by the liver",
  },
  {
    key: "direct_bilirubin",
    label: "Direct Bilirubin (Conjugated)",
    shortLabel: "D. Bilirubin",
    unit: "mg/dL",
    required: true,
    min: 0.0,
    max: 40,
    normalRange: "0.0 – 0.3 mg/dL",
    description: "Water-soluble conjugated bilirubin fraction",
  },
  {
    key: "alkphos",
    label: "Alkaline Phosphatase (ALP)",
    shortLabel: "ALP",
    unit: "IU/L",
    required: true,
    min: 10,
    max: 3000,
    normalRange: "30 – 120 IU/L",
    description: "Enzyme associated with bile ducts and bone",
  },
  {
    key: "sgpt",
    label: "Alanine Aminotransferase (SGPT / ALT)",
    shortLabel: "SGPT (ALT)",
    unit: "IU/L",
    required: true,
    min: 1,
    max: 5000,
    normalRange: "7 – 56 IU/L",
    description: "Enzyme released during hepatocellular injury",
  },
  {
    key: "sgot",
    label: "Aspartate Aminotransferase (SGOT / AST)",
    shortLabel: "SGOT (AST)",
    unit: "IU/L",
    required: true,
    min: 1,
    max: 5000,
    normalRange: "10 – 40 IU/L",
    description: "Enzyme found in liver, heart, and muscle tissue",
  },
  {
    key: "total_proteins",
    label: "Total Protein",
    shortLabel: "T. Protein",
    unit: "g/dL",
    required: true,
    min: 2.0,
    max: 12.0,
    normalRange: "6.0 – 8.3 g/dL",
    description: "Total circulating albumin and globulin proteins",
  },
  {
    key: "albumin",
    label: "Albumin",
    shortLabel: "Albumin",
    unit: "g/dL",
    required: true,
    min: 0.5,
    max: 7.0,
    normalRange: "3.5 – 5.0 g/dL",
    description: "Main protein synthesized by functional hepatocytes",
  },
  {
    key: "ag_ratio",
    label: "Albumin/Globulin Ratio (A/G Ratio)",
    shortLabel: "A/G Ratio",
    unit: "ratio",
    required: true,
    min: 0.1,
    max: 4.0,
    normalRange: "1.0 – 2.5",
    description: "Ratio of albumin to total globulin proteins",
  },
  {
    key: "platelet_count",
    label: "Platelet Count",
    shortLabel: "Platelets",
    unit: "x10³/µL",
    required: false,
    min: 5,
    max: 1000,
    normalRange: "150 – 450 x10³/µL",
    description: "Optional secondary marker for portal hypertension",
  },
];

/**
 * Validates a dictionary of lab values against clinical rules.
 * Returns { isValid, errors: Record<string, string>, warnings: Record<string, string> }
 */
export function validateLabValues(values) {
  const errors = {};
  const warnings = {};

  // Check each field definition
  LAB_FIELDS.forEach((field) => {
    const rawVal = values[field.key];
    const isPresent = rawVal !== undefined && rawVal !== null && rawVal !== "";

    if (field.required && !isPresent) {
      errors[field.key] = `${field.label} is required.`;
      return;
    }

    if (isPresent) {
      if (field.type === "select") {
        if (!["Male", "Female", "M", "F"].includes(rawVal)) {
          errors[field.key] = "Please select Male or Female.";
        }
      } else {
        const num = parseFloat(rawVal);
        if (Number.isNaN(num)) {
          errors[field.key] = `${field.label} must be a valid number.`;
        } else if (num < field.min || num > field.max) {
          errors[field.key] = `Value must be between ${field.min} and ${field.max} ${field.unit}.`;
        }
      }
    }
  });

  // Cross-field physiological sanity checks (bmod3 & frontend_rules)
  const totalBilirubin = parseFloat(values.total_bilirubin);
  const directBilirubin = parseFloat(values.direct_bilirubin);
  if (!Number.isNaN(totalBilirubin) && !Number.isNaN(directBilirubin)) {
    if (directBilirubin > totalBilirubin) {
      errors.direct_bilirubin = "Direct bilirubin cannot be greater than Total bilirubin.";
    }
  }

  const totalProteins = parseFloat(values.total_proteins);
  const albumin = parseFloat(values.albumin);
  if (!Number.isNaN(totalProteins) && !Number.isNaN(albumin)) {
    if (albumin > totalProteins) {
      errors.albumin = "Albumin cannot exceed Total Protein.";
    }
  }

  const agRatio = parseFloat(values.ag_ratio);
  if (!Number.isNaN(totalProteins) && !Number.isNaN(albumin) && !Number.isNaN(agRatio)) {
    const globulin = totalProteins - albumin;
    if (globulin > 0) {
      const calculatedRatio = albumin / globulin;
      // Soft check if ratio differs substantially
      if (Math.abs(calculatedRatio - agRatio) > 0.8) {
        warnings.ag_ratio = `Calculated A/G ratio (${calculatedRatio.toFixed(2)}) differs from entered value. Please verify with lab report.`;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}

