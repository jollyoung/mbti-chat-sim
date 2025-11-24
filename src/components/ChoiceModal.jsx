export default function ChoiceModal({ question, options, onSelect }) {
  if (!options || !Array.isArray(options)) return null;

  return (
    <div className="choice-overlay">
      <div className="choice-popup animate-popup">
        <h3 className="choice-title">{question}</h3>

        <div className="choice-list">
          {options.map((opt, i) => (
            <div
              key={i}
              className="choice-item"
              onClick={() => onSelect(opt)}
            >
              {opt.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
