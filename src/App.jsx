import { useState } from "react";
import ChatContainer from "./components/ChatContainer.jsx";
import ChoiceModal from "./components/ChoiceModal.jsx";
import ErrorPopup from "./components/ErrorPopup.jsx";
import useStoryEngine from "./hooks/storyEngine.jsx";
import "./index.css";

/* MBTI별 프로필 매핑 */
const MBTI_PROFILE_MAP = {
  INFP: "/profile_INFP.png",
  INFJ: "/mood_profile.png",
  INTP: "/profile_INTP.png",
  INTJ: "/basic_profile.jpg",

  ENFP: "/profile_ENFP.png",
  ENFJ: "/profile_ENFJ.png",
  ENTP: "/profile_ENTP.png",
  ENTJ: "/formal_profile.png",

  ISFP: "/mood_profile.png",
  ISFJ: "/profile_ISFJ.png",
  ISTP: "/basic_profile.jpg",
  ISTJ: "/basic_profile.jpg",

  ESFP: "/profile_ESFP.png",
  ESFJ: "/profile_ESFJ.png",
  ESTP: "/profile_ESTP.png",
  ESTJ: "/formal_profile.png",
};

const DEFAULT_NPC_PROFILE = "/profile_default.png";

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [selectedGender, setSelectedGender] = useState("");
  const [age, setAge] = useState("");              // 빈 문자열 허용
  const [errorMessage, setErrorMessage] = useState("");

  // 🔥 storyEngine 훅 (isEnding 사용)
  const {
    history,
    pendingChoice,
    start,
    choose,
    isEnding,
    currentMBTI,
    restartSameMBTI,
    resetToIntro,
  } = useStoryEngine();

  // ==========================
  //     시작하기 버튼 처리
  // ==========================
  const handleStart = (e) => {
    e.preventDefault();

    const sex = selectedGender;
    const mbti = e.target.mbti.value;

    if (!sex) {
      setErrorMessage("성별을 선택해주세요!");
      return;
    }

    if (!age || age.trim() === "") {
      setErrorMessage("나이를 입력해주세요!");
      return;
    }

    if (!mbti) {
      setErrorMessage("MBTI를 선택해주세요!");
      return;
    }

    // NPC 프로필 결정
    const npcProfile = MBTI_PROFILE_MAP[mbti] || DEFAULT_NPC_PROFILE;

    setUserInfo({ sex, age, mbti, npcProfile });
    start(mbti);
  };

  // ==========================
  //      UI 렌더 구간
  // ==========================

  // 1) 초기화면 (userInfo 없음)
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

        {/* 오류 팝업 */}
        {errorMessage && (
          <ErrorPopup
            message={errorMessage}
            onClose={() => setErrorMessage("")}
          />
        )}
      </div>
    );
  }

  // 2) 🔥 엔딩 화면 (시나리오 종료됨)
  if (isEnding) {
    return (
      <div className="end-screen">
        <h2>{currentMBTI} 시나리오 종료 🎉</h2>

        <p>대화가 모두 종료되었어요!</p>
        <p>다른 MBTI라면 또 다른 방식으로 반응할 수도 있어요 👀</p>

        <div className="end-buttons">
          <button className="retry-btn" onClick={restartSameMBTI}>
            🔄 다시 시도하기
          </button>

          <button className="back-btn" onClick={resetToIntro}>
            ✨ 다른 MBTI 선택하기
          </button>
        </div>
      </div>
    );
  }

  // 3) 일반 대화 화면
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
