export default function ResultPage({ mbti, onRestart, onSelectOther }) {
  return (
    <div className="result-page">
      <h2>{mbti} 시나리오 종료 🎉</h2>

      <p>대화가 모두 종료되었습니다!</p>
      <p>다른 MBTI라면 또 다른 방식으로 반응할 수도 있어요 👀</p>

      <div className="result-buttons">
        
        <button className="other-btn" onClick={onSelectOther}>
          다른 MBTI 선택하기 ✨
        </button>
      </div>
    </div>
  );
}
