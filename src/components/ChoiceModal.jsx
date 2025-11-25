import { useState } from "react";

export default function ChoiceModal({ question, options, onSelect }) {
  const [locked, setLocked] = useState(false);

  const handleClick = (opt) => {
    if (locked) return;
    setLocked(true);
    onSelect(opt);
  };

  return (
    <div className="choice-overlay">
      <div className="choice-popup animate-popup">
        <div className="choice-title">{question}</div>

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
