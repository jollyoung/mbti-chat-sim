export default function ResultPage({ mbti, onSelectOther }) {
  return (
    <div className="result-wrapper">

      <div className="result-card animate-fadeup">

        <h2 className="result-title">
          {mbti} 시나리오 종료 🎉
        </h2>

        <p className="result-desc">
          대화를 모두 마쳤어요! <br />
          다른 MBTI였다면 또 다른 방식으로 반응했을지도 몰라요 👀
        </p>

        <button className="result-btn" onClick={onSelectOther}>
          다른 MBTI 선택하기 ✨
        </button>

      </div>
    </div>
  );
}
