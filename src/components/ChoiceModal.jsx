import { useState } from "react";

export default function ChoiceModal({ question, options, onSelect }) {
  const [locked, setLocked] = useState(false);

  const handleClick = (option) => {
    if (locked) return;
    setLocked(true);
    onSelect(option);
  };

  return (
    <div className="modal-backdrop">
      <div className="choice-modal">
        <p className="choice-question">{question}</p>

        {options.map((opt, idx) => (
          <button
            key={idx}
            className="choice-btn"
            onClick={() => handleClick(opt)}
            disabled={locked}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
