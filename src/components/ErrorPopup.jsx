export default function ErrorPopup({ message, onClose }) {
  // 2초 뒤 자동 닫힘
  setTimeout(onClose, 1800);

  return (
    <div className="error-overlay">
      <div className="error-box animate-error">
        <div className="error-icon">⚠️</div>
        <div className="error-text">{message}</div>
      </div>
    </div>
  );
}
