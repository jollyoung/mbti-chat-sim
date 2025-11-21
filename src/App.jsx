import { useState } from "react";
import ChatContainer from "./components/ChatContainer.jsx";
import ChoiceModal from "./components/ChoiceModal.jsx";
import useChatEngine from "./hooks/useChatEngine.jsx";
import "./index.css";

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const { history, pendingChoice, start, choose } = useChatEngine();

  const handleStart = (e) => {
    e.preventDefault();
    const sex = e.target.sex.value;
    const age = e.target.age.value;
    const mbti = e.target.mbti.value;

    setUserInfo({ sex, age, mbti });
    start(mbti);
  };

  // 🔹 첫 화면
  if (!userInfo) {
    return (
      <div className="intro-page">
        <h1 className="intro-title">내 MBTI를 공략해보자!</h1>

        <form onSubmit={handleStart} className="info-form-card">
          <div className="form-group">
            <label>성별</label>
            <select name="sex" className="input-box" required>
              <option value="">선택하세요</option>
              <option value="남성">남성</option>
              <option value="여성">여성</option>
            </select>
          </div>

          <div className="form-group">
            <label>나이</label>
            <input
              type="number"
              name="age"
              min="10"
              max="40"
              defaultValue="20"
              className="input-box"
              required
            />
          </div>

          <div className="form-group">
            <label>나의 MBTI</label>
            <select name="mbti" className="input-box" required>
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

          <button type="submit" className="start-btn">시작하기</button>
        </form>
      </div>
    );
  }

  // 🔹 두 번째 화면 (메신저 UI)
  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <img src="/profile_npc.png" className="chat-header-img" />
        <span className="chat-header-name">상대방</span>
      </div>

      <ChatContainer history={history} />

      {pendingChoice && (
        <ChoiceModal
          question={pendingChoice.question}
          options={pendingChoice.options}
          onSelect={choose}
        />
      )}
    </div>
  );
}

export default App;
