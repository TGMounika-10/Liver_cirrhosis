import "./NextStepsCard.css";

export default function NextStepsCard({ category = "Moderate" }) {
  const isHighOrModerate = category === "High" || category === "Moderate";

  return (
    <section className="next-steps-card" aria-labelledby="next-steps-heading">
      <div className="next-steps-header">
        <div className="next-steps-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="var(--blue)">
            <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" />
          </svg>
        </div>
        <div>
          <h3 id="next-steps-heading" className="next-steps-title">
            Recommended Clinical Next Steps
          </h3>
          <p className="next-steps-subtitle">
            What to do with these laboratory findings
          </p>
        </div>
      </div>

      {/* Primary recommendation: Consult a doctor */}
      <div className={`consult-doctor-banner ${isHighOrModerate ? "prominent" : ""}`}>
        <div className="consult-icon" aria-hidden="true">
          <svg viewBox="0 0 20 20" width="22" height="22" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="consult-text">
          <strong>Schedule a Clinical Consultation with Your Doctor</strong>
          <p>
            Share this report and your original laboratory results with a qualified physician or gastroenterologist.
            Doctors use comprehensive evaluations, physical exams, and ultrasound or elastography (FibroScan) to assess liver health.
          </p>
        </div>
      </div>

      <div className="steps-guidance-grid">
        <div className="guidance-box routine">
          <h4>Questions to Ask Your Doctor</h4>
          <ul>
            <li>What could be causing elevated enzyme or bilirubin levels?</li>
            <li>Do I need follow-up blood tests or an abdominal ultrasound?</li>
            <li>Should I review my current prescription medications or supplements?</li>
            <li>Are there lifestyle changes or dietary modifications you recommend?</li>
          </ul>
        </div>

        {/* Urgent red warning box per f7 & f4 specs */}
        <div className="guidance-box urgent" role="alert">
          <h4>
            <span className="urgent-badge">Urgent</span> Seek Immediate Medical Care If You Experience:
          </h4>
          <ul>
            <li>Vomiting blood or material resembling dark coffee grounds</li>
            <li>Black, tarry, or bloody stools</li>
            <li>New confusion, disorientation, severe sleepiness, or slurred speech</li>
            <li>Rapidly swelling abdomen (ascites) accompanied by severe pain or fever</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

