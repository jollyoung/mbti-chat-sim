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

export default function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [selectedGender, setSelectedGender] = useState("");
  const [age, setAge] = useState(""); // 빈 문자열 허용
  const [errorMessage, setErrorMessage] = useState("");

  // 🔥 storyEngine 현재 상태 받아오기
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
    if (!age || age === "") {
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
        <form onSubmit={handleStart} className="intro-card">

          {/* 성별 */}
          <div className="form-group">
            <label>성별</label>
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
            <select name="mbti" className="input-box" required>
              <option value="">선택하세요</option>
              {Object.keys(MBTI_PROFILE_MAP).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
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
      <div className="ending-page animate-fadeup">
        <div className="ending-card">
          <h2 className="ending-title">{currentMBTI} 시나리오 종료 🎉</h2>

          <p className="ending-text">
            대화가 모두 종료되었어요! <br />
            다른 MBTI라면 또 다른 방식으로 반응할 수도 있어요 👀
          </p>

          <div className="ending-buttons">
            <button className="restart-btn" onClick={restartSameMBTI}>
              다시 시도하기 🔁
            </button>

            <button className="home-btn" onClick={resetToIntro}>
              다른 MBTI 선택하기 ✨
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3) 일반 대화 화면
  return (
    <>
      <ChatContainer
        messages={history}
        npcProfile={userInfo.npcProfile}
      />

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
