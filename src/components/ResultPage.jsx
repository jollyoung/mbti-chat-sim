// src/components/ResultPage.jsx
export default function ResultPage({ mbti, onRetry, onReset }) {
  return (
    <div className="result-wrapper">
      <div className="result-card animate-fadeup">
        <h2 className="result-title">{mbti} 시나리오 종료 🎉</h2>

        <p className="result-text">
          대화가 모두 종료되었어요!<br />
          다른 MBTI라면 또 다른 방식으로 반응할지도 몰라요 👀
        </p>

        <div className="result-buttons">
          <button className="retry-btn" onClick={onRetry}>
            다시하기
          </button>
          <button className="reset-btn" onClick={onReset}>
            다른 MBTI 선택하기
          </button>
        </div>
      </div>
    </div>
  );
}
