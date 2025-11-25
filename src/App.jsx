import { useState } from "react";
import ChatContainer from "./components/ChatContainer.jsx";
import ChoiceModal from "./components/ChoiceModal.jsx";
import ErrorPopup from "./components/ErrorPopup.jsx";
import useStoryEngine from "./hooks/storyEngine.jsx";
import "./index.css";

import { MBTI_PROFILE_MAP, DEFAULT_NPC_PROFILE } from "./profileMap.js";

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [selectedGender, setSelectedGender] = useState("");
  const [age, setAge] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    history,
    pendingChoice,
    isEnding,
    currentMBTI,
    startScenario,
    choose,
    restart,
    resetMBTI
  } = useStoryEngine();

  // 시작 버튼 클릭
  const handleStart = (e) => {
    e.preventDefault();

    if (!selectedGender) {
      setErrorMessage("성별을 선택해주세요!");
      return;
    }

    if (!age || age.trim() === "") {
      setErrorMessage("나이를 입력해주세요!");
      return;
    }

    const mbti = e.target.mbti.value;

    if (!mbti) {
      setErrorMessage("MBTI를 선택해주세요!");
      return;
    }

    const npcProfile = MBTI_PROFILE_MAP[mbti] ?? DEFAULT_NPC_PROFILE;

    setUserInfo({ sex: selectedGender, age, mbti, npcProfile });
    startScenario(mbti);
  };

  // 초기 화면
  if (!userInfo) {
    return (
      <div className="intro-page animate-fadeup">
        <h1 className="intro-title">내 MBTI를 공략해보자! ✨</h1>

        <form onSubmit={handleStart} className="intro-card">

          {/* 성별 */}
          <div className="form-group">
            <label>성별</label>
            <input type="hidden" name="sex" value={selectedGender} />
            <div className="gender-select">
              <button
                type="button"
                className={`gender-btn ${selectedGender === "male" ? "active" : ""}`}
                onClick={() => setSelectedGender("male")}
              >
                남성
              </button>
              <button
                type="button"
                className={`gender-btn ${selectedGender === "female" ? "active" : ""}`}
                onClick={() => setSelectedGender("female")}
              >
                여성
              </button>
            </div>
          </div>

          {/* 나이 */}
          <div className="form-group">
            <label>나이</label>
            <input
              type="number"
              name="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="input-box"
              placeholder="나이를 입력하세요"
            />
          </div>

          {/* MBTI */}
          <div className="form-group">
            <label>나의 MBTI</label>
            <select name="mbti" className="input-box">
              <option value="">선택하세요</option>

              <option value="INFP">INFP</option>
              <option value="INFJ">INFJ</option>
              <option value="INTP">INTP</option>
              <option value="INTJ">INTJ</option>

              <option value="ISFP">ISFP</option>
              <option value="ISFJ">ISFJ</option>
              <option value="ISTP">ISTP</option>
              <option value="ISTJ">ISTJ</option>

              <option value="ENFP">ENFP</option>
              <option value="ENFJ">ENFJ</option>
              <option value="ENTP">ENTP</option>
              <option value="ENTJ">ENTJ</option>

              <option value="ESFP">ESFP</option>
              <option value="ESFJ">ESFJ</option>
              <option value="ESTP">ESTP</option>
              <option value="ESTJ">ESTJ</option>
            </select>
          </div>

          <button className="start-btn">시작하기 🚀</button>
        </form>

        {errorMessage && (
          <ErrorPopup
            message={errorMessage}
            onClose={() => setErrorMessage("")}
          />
        )}
      </div>
    );
  }

  // 종료 화면
  if (isEnding) {
    return (
      <div className="end-screen">
        <h2>{currentMBTI} 시나리오 종료 🎉</h2>
        <p>대화가 모두 종료되었어요!</p>
        <p>다른 MBTI라면 다른 방식으로도 반응할 수 있어요 👀</p>

        <div className="end-buttons">
          <button className="retry-btn" onClick={restart}>🔄 다시 시도하기</button>
          <button className="back-btn" onClick={resetMBTI}>✨ 다른 MBTI 선택하기</button>
        </div>
      </div>
    );
  }

  // 대화 화면
  return (
    <>
      <ChatContainer messages={history} npcProfile={userInfo.npcProfile} />

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
