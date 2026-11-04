import { useState, useRef } from "react";
import "./UploadDropzone.css";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];
const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
];

export default function UploadDropzone({ onFileSelected, disabled }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);

  const validateAndHandleFile = (file) => {
    setErrorMessage("");

    if (!file) return;

    // Check size limit
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setErrorMessage(`File exceeds the 10 MB limit (Current size: ${sizeMb} MB). Please choose a smaller file.`);
      return;
    }

    // Check extension and mime type
    const lowerName = file.name.toLowerCase();
    const hasValidExt = ACCEPTED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
    const hasValidMime = ACCEPTED_MIME_TYPES.includes(file.type);

    if (!hasValidExt && !hasValidMime) {
      setErrorMessage(
        `Unsupported file type "${file.name}". Please upload a PDF document or a clear image (JPG, PNG).`
      );
      return;
    }

    onFileSelected(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndHandleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndHandleFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className="dropzone-wrapper">
      <div
        className={`dropzone-area ${isDragOver ? "is-dragover" : ""} ${disabled ? "is-disabled" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload laboratory report. Drag and drop file here, or press enter to browse."
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileInputChange}
          style={{ display: "none" }}
          disabled={disabled}
        />

        <div className="dropzone-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="12" y2="12" />
            <line x1="15" y1="15" x2="12" y2="12" />
          </svg>
        </div>

        <div className="dropzone-text">
          <p className="dropzone-title">
            Drag & drop your lab report here, or <span className="browse-link">browse files</span>
          </p>
          <p className="dropzone-specs">
            Supports PDF, JPG, PNG (Maximum file size: 10 MB)
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="dropzone-error" role="alert">
          <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}

