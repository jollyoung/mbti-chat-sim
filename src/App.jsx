import { useState } from "react";
import ChatContainer from "./components/ChatContainer.jsx";
import ChoiceModal from "./components/ChoiceModal.jsx";
import useChatEngine from "./hooks/useChatEngine.jsx";
import "./index.css";


function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [selectedGender, setSelectedGender] = useState("");

  const { history, pendingChoice, start, choose } = useChatEngine();

  // 유저 정보 입력 폼 제출
  const handleStart = (e) => {
    e.preventDefault();

    const sex = e.target.sex.value;
    const age = e.target.age.value;
    const mbti = e.target.mbti.value;

    setUserInfo({ sex, age, mbti });

    // 선택한 MBTI 기반 시나리오 시작
    start(mbti);
  };

  // 첫 화면: 사용자 정보 입력
if (!userInfo) {
  return (
    <div className="intro-page">

      <div className="intro-card animate-fadeup">
        <h1 className="intro-title">내 MBTI를 공략해보자! 🔮</h1>

        <form onSubmit={handleStart} className="info-form-card">

          {/* ✨ 성별 버튼 UI */}
          <div className="form-group">
            <label>성별</label>
            <div className="gender-select">
              <input type="hidden" name="sex" value={selectedGender} required />

              <button
                type="button"
                className={`gender-btn ${selectedGender === "남성" ? "active" : ""}`}
                onClick={() => setSelectedGender("남성")}
              >
                남성
              </button>

              <button
                type="button"
                className={`gender-btn ${selectedGender === "여성" ? "active" : ""}`}
                onClick={() => setSelectedGender("여성")}
              >
                여성
              </button>
            </div>
          </div>

          {/* 나이 */}
          <div className="form-group">
            <label>나이</label>
            <select name="age" required defaultValue="20" className="input-box">
              {[...Array(31)].map((_, i) => {
                const age = i + 10;
                return (
                  <option key={age} value={age}>
                    {age}
                  </option>
                );
              })}
            </select>
          </div>

          {/* MBTI */}
          <div className="form-group">
            <label>나의 MBTI</label>
            <select name="mbti" required className="input-box">
              <option value="">선택하세요</option>
              {[
                "INFP","INFJ","INTP","INTJ",
                "ISFP","ISFJ","ISTP","ISTJ",
                "ENFP","ENFJ","ENTP","ENTJ",
                "ESFP","ESFJ","ESTP","ESTJ"
              ].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="start-btn animate-press">
            시작하기 🚀
          </button>
        </form>
      </div>

    </div>
  );
}


  // 두 번째 화면: 메신저 시뮬레이션
  return (
    <>
      <ChatContainer messages={history} />

      {pendingChoice && (
        <ChoiceModal
          question={pendingChoice.question}
          options={pendingChoice.options}
          onSelect={choose}
        />
      )}
    </>
  );
}

export default App;
