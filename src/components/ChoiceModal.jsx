export default function ChoiceModal({ question, options, onSelect }) {
  if (!options || !Array.isArray(options)) return null; // ← JSX 위로 이동

  return (
    <div className="modal-backdrop">
      <div className="choice-modal">

        <h4>{question}</h4>

        {options.map((opt, i) => (
          <div
            key={i}
            className="choice-btn"
            onClick={() => onSelect(opt)}
          >
            {opt.label}
          </div>
        ))}

      </div>
    </div>
  );
}
