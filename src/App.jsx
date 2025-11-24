import { useState } from "react";
import ChatContainer from "./components/ChatContainer.jsx";
import ChoiceModal from "./components/ChoiceModal.jsx";
import useChatEngine from "./hooks/useChatEngine.jsx";
import ErrorPopup from "./components/ErrorPopup.jsx";
import "./index.css";

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [selectedGender, setSelectedGender] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { history, pendingChoice, start, choose } = useChatEngine();

  const handleStart = (e) => {
    e.preventDefault();

    const sex = e.target.sex.value;
    const age = e.target.age.value;
    const mbti = e.target.mbti.value;

    if (!sex) {
      setErrorMessage("성별을 선택해주세요!");
      return;
    }

    if (!mbti) {
      setErrorMessage("MBTI를 선택해주세요!");
      return;
    }

    // MBTI별 NPC 프로필 이미지 결정
    let npcProfile = "/profile_npc.png"; // 기본값

    if (mbti === "INTJ" || mbti === "ISTJ") {
      npcProfile = "/basic_profile.jpg";  // 업로드한 이미지 사용
    }

      setUserInfo({ sex, age, mbti, npcProfile });
      start(mbti);
    };

  return (
    <>
      {!userInfo ? (
        <div className="intro-page animate-fadeup">
          <form onSubmit={handleStart} className="intro-card">
            {/* 성별 버튼들 */}
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
              <select name="age" className="input-box">
                <option value="20">20</option>
              </select>
            </div>

            {/* MBTI */}
            <div className="form-group">
              <label>나의 MBTI</label>
              <select name="mbti" className="input-box" required>
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

          {/* 🔥 오류 메시지 팝업 */}
          {errorMessage && (
            <ErrorPopup
              message={errorMessage}
              onClose={() => setErrorMessage("")}
            />
          )}
        </div>
      ) : (
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
      )}
    </>
  );
}

export default App;
