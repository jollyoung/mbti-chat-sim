import { useState } from "react";
import ChatContainer from "./components/ChatContainer.jsx";
import ChoiceModal from "./components/ChoiceModal.jsx";
import ErrorPopup from "./components/ErrorPopup.jsx";
import ResultPage from "./components/ResultPage.jsx";

import useStoryEngine from "./hooks/storyEngine.jsx";

function App() {
  const {
    history,
    pendingChoice,
    start,
    choose,
    isEnding,
    currentMBTI,
    restartSameMBTI,
    resetToIntro
  } = useStoryEngine();

  const [selectedGender, setSelectedGender] = useState("");
  const [age, setAge] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleStart = (e) => {
    e.preventDefault();

    if (!selectedGender) return setErrorMessage("성별을 선택해주세요!");
    if (!age) return setErrorMessage("나이를 입력해주세요!");

    const mbti = e.target.mbti.value;
    if (!mbti) return setErrorMessage("MBTI를 선택해주세요!");

    start(mbti);
  };

  return (
    <>
      {!currentMBTI ? (
        <div className="intro-page animate-fadeup">

          {/* 🔥 타이틀 복원 */}
          <h1 className="intro-title">내 MBTI를 공략해보자! ✨</h1>

          <form onSubmit={handleStart} className="intro-card">

            <div className="form-group">
              <label>성별</label>
              <input type="hidden" name="sex" value={selectedGender} />

              <div className="gender-select">
                <button
                  type="button"
                  className={`gender-btn ${
                    selectedGender === "male" ? "active" : ""
                  }`}
                  onClick={() => setSelectedGender("male")}
                >
                  남성
                </button>

                <button
                  type="button"
                  className={`gender-btn ${
                    selectedGender === "female" ? "active" : ""
                  }`}
                  onClick={() => setSelectedGender("female")}
                >
                  여성
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>나이</label>
              <input
                type="number"
                className="input-box"
                name="age"
                value={age}
                placeholder="나이를 입력하세요"
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>나의 MBTI</label>
              <select name="mbti" className="input-box">
                <option value="">선택하세요</option>
                {[
                  "INFP","INFJ","INTP","INTJ",
                  "ENFP","ENFJ","ENTP","ENTJ",
                  "ISFP","ISFJ","ISTP","ISTJ",
                  "ESFP","ESFJ","ESTP","ESTJ",
                ].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
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
      ) : isEnding ? (
        <ResultPage
          currentMBTI={currentMBTI}
          restart={restartSameMBTI}
          reset={resetToIntro}
        />
      ) : (
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
      )}
    </>
  );
}

export default App;
