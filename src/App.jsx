import { useState } from "react";
import ChatContainer from "./components/ChatContainer.jsx";
import ChoiceModal from "./components/ChoiceModal.jsx";
import useChatEngine from "./hooks/useChatEngine.jsx";
import "./index.css";

function App() {
  const [userInfo, setUserInfo] = useState(null);
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
        <h1>내 MBTI를 공략해보자!</h1>

        <form onSubmit={handleStart} className="info-form">
          <label>성별</label>
          <select name="sex" required>
            <option value="">선택하세요</option>
            <option value="남성">남성</option>
            <option value="여성">여성</option>
          </select>

          <label>나이</label>
          <input type="number" name="age" min="10" max="100" required />

          <label>나의 MBTI</label>
          <select name="mbti" required>
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

          <button type="submit" className="start-btn">시작하기</button>
        </form>
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
