import { useEffect } from "react";

export default function ErrorPopup({ message, onClose }) {
  // 2초 뒤 자동 닫힘
  useEffect(() => {
    const timeoutId = setTimeout(onClose, 1800);

    return () => clearTimeout(timeoutId);
  }, [message, onClose]);

  return (
    <div className="error-overlay">
      <div className="error-box animate-error">
        <div className="error-icon">⚠️</div>
        <div className="error-text">{message}</div>
      </div>
    </div>
  );
}
