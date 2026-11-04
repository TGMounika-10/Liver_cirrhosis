import { useState, useEffect } from "react";
import "./FilePreview.css";

export default function FilePreview({ file, onRemove, disabled }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  const isImage = file.type.startsWith("image/");
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

  useEffect(() => {
    let url = null;
    if (isImage) {
      url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [file, isImage]);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="file-preview-card">
      <div className="preview-media-container">
        {isImage && previewUrl ? (
          <img src={previewUrl} alt={`Thumbnail preview of ${file.name}`} className="preview-image" />
        ) : (
          <div className="preview-pdf-badge" aria-label="PDF Document">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
              <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z" />
            </svg>
            <span className="pdf-label">PDF</span>
          </div>
        )}
      </div>

      <div className="preview-info">
        <p className="preview-filename" title={file.name}>
          {file.name}
        </p>
        <span className="preview-filesize">{formatFileSize(file.size)}</span>
        <span className="preview-ready-badge">Ready for extraction</span>
      </div>

      <button
        type="button"
        className="preview-remove-btn"
        onClick={onRemove}
        disabled={disabled}
        aria-label="Remove selected file"
        title="Remove selected file"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

