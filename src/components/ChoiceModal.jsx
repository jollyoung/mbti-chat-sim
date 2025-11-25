import { useState } from "react";

export default function ChoiceModal({ question, options, onSelect }) {
  const [locked, setLocked] = useState(false);

  if (!options || !Array.isArray(options)) return null;

  const handleClick = (opt) => {
    if (locked) return;       // 이미 선택했으면 무시
    setLocked(true);
    onSelect(opt);
  };

  return (
    <div className="choice-overlay">
      <div className="choice-popup animate-popup">
        <h3 className="choice-title">{question}</h3>

        <div className="choice-list">
          {options.map((opt, i) => (
            <div
              key={i}
              className="choice-item"
              onClick={() => handleClick(opt)}
            >
              {opt.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
