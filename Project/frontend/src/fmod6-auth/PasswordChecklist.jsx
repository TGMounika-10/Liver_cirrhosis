import "./PasswordChecklist.css";

export default function PasswordChecklist({
  isIdValid = false,
  hasLength = false,
  hasLetter = false,
  hasNumber = false,
  passwordsMatch = false,
}) {
  const items = [
    { label: "Valid Patient ID (4–20 characters, no spaces)", valid: isIdValid },
    { label: "Between 8 and 64 characters", valid: hasLength },
    { label: "At least one letter (a-z, A-Z)", valid: hasLetter },
    { label: "At least one number (0-9)", valid: hasNumber },
    { label: "Passwords match", valid: passwordsMatch },
  ];

  return (
    <div className="checklist-box" aria-live="polite">
      <span className="checklist-title">Requirements Checklist:</span>
      <ul className="checklist-items">
        {items.map((item, idx) => (
          <li key={idx} className={`checklist-item ${item.valid ? "is-valid" : "is-invalid"}`}>
            <span className="check-icon">{item.valid ? "✓" : "○"}</span>
            <span className="check-text">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

