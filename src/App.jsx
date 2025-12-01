import { useState } from "react";
import ChatContainer from "./components/ChatContainer.jsx";
import ChoiceModal from "./components/ChoiceModal.jsx";
import { useStoryEngine } from "./hooks/storyEngine.jsx";
import ErrorPopup from "./components/ErrorPopup.jsx";
import ResultPage from "./components/ResultPage.jsx";
import "./index.css";
import { STRINGS } from "./constants/strings.js";

/* MBTI별 프로필 매핑 */
const MBTI_PROFILE_MAP = {
  // 기본 프로필 그룹
  ISTJ: "basic_profile.jpg",
  INTJ: "basic_profile.jpg",
  ISTP: "basic_profile.jpg",

  // 반려동물 그룹
  INFP: "basic_profile.jpg",
  ISFJ: "basic_profile.jpg",

  // 감성 사진 그룹
  INFJ: "mood_profile.png",
  ISFP: "mood_profile.png",
  // 밈(meme) 그룹
  INTP: "/public/meme_profile.png",
  ENTP: "/public/meme_profile.png",

  // 포멀(정장) 그룹
  ESTJ: "formal_profile.png",
  ENTJ: "formal_profile.png",
  // 화려한 셀카 그룹
  ENFJ: "selfie_profile.png",
  ENFP: "selfie_profile.png",
  ESFJ: "selfie_profile.png",
  // 여행 그룹
  ESTP: "travel_profile.png",
  ESFP: "travel_profile.png",
};

const DEFAULT_NPC_PROFILE = "profile_npc.png";

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [selectedGender, setSelectedGender] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [age, setAge] = useState("");

  const {
    history,
    pendingChoice,
    start,
    choose,
    isEnding,
    reset,
    engineError,
    clearEngineError,
  } = useStoryEngine();

  const handleStart = (e) => {
    e.preventDefault();

    const sex = e.target.sex.value;
    const mbti = e.target.mbti.value;

    if (!sex) {
      setErrorMessage(STRINGS.genderRequired);
      return;
    }

    if (!mbti) {
      setErrorMessage(STRINGS.mbtiRequired);
      return;
    }

    if (age === "") {
      setErrorMessage(STRINGS.ageRequired);
      return;
    }

    // 🔥 MBTI별 NPC 프로필 자동 결정
    let npcProfile = DEFAULT_NPC_PROFILE;

    if (MBTI_PROFILE_MAP[mbti]) {
      npcProfile = MBTI_PROFILE_MAP[mbti];
    }

    setUserInfo({ sex, age, mbti, npcProfile });
    start(mbti, { sex, age, mbti, npcProfile });
  };

  return (
    <>
      {/* 1️⃣ 아직 시작 전 → 인트로 화면 */}
      {!userInfo ? (
        <div className="intro-page animate-fadeup">
          <div className="intro-title">{STRINGS.introTitle}</div>
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
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setAge("");
                    return;
                  }
                  setAge(Number(val));
                }}
                className="input-box"
                placeholder="나이를 입력하세요"
              />
            </div>

            {/* MBTI 선택 */}
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

          {errorMessage && (
            <ErrorPopup
              message={errorMessage}
              onClose={() => setErrorMessage("")}
            />
          )}
        </div>
      ) : isEnding ? (
        /* 결과 페이지 */
        <ResultPage
          mbti={userInfo.mbti}
          onSelectOther={() => {
            reset();
            setUserInfo(null);
          }}
        />
      ) : (
        /* 3️⃣ 진행중 → 채팅 화면 */
        <>
          <ChatContainer
            messages={history}
            npcProfile={userInfo.npcProfile}
            currentLocation={currentLocation}
          />

          {pendingChoice && (
            <ChoiceModal
              question={pendingChoice.question}
              options={pendingChoice.options}
              onSelect={choose}
            />
          )}
        </>
      )}
      {engineError && (
        <ErrorPopup
          message={engineError}
          onClose={clearEngineError}
        />
      )}
    </>
  );
}

export default App;