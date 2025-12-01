import { useEffect, useRef, useState } from "react";
import axios from "axios";

// 시나리오 테이블
import INFP from "../stories/INFP";
import INFJ from "../stories/INFJ";
import INTJ from "../stories/INTJ";
import ISFP from "../stories/ISFP";
import ESTJ from "../stories/ESTJ";
import ENTP from "../stories/ENTP";
import ENTJ from "../stories/ENTJ";
import ESFP from "../stories/ESFP";
import ENFP from "../stories/ENFP";
import ISFJ from "../stories/ISFJ";
import ISTP from "../stories/ISTP";
import ISTJ from "../stories/ISTJ";

// 세션 ID 생성
const createSessionId = () => {
  const prefix = "session-";
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}-${randomPart}`;
};

export function useStoryEngine() {
  const [currentScenario, setCurrentScenario] = useState(null);
  const [currentScene, setCurrentScene] = useState("intro");
  const [history, setHistory] = useState([]);
  const [pendingChoice, setPendingChoice] = useState(null);
  const [currentMBTI, setCurrentMBTI] = useState(null);
  const userInfoRef = useRef(null);
  const [isEnding, setIsEnding] = useState(false);
  const [engineError, setEngineError] = useState("");
  const mbtiRef = useRef(null);

  // 🔥 호감도 추가
  const [affection, setAffection] = useState(0);

  const sessionIdRef = useRef(createSessionId());
  const stepRef = useRef(0);
  const abortRef = useRef(false);

  const storyTable = {
    INFP,
    INFJ,
    INTJ,
    ISFP,
    ESTJ,
    ENTP,
    ENTJ,
    ESFP,
    ENFP,
    ISFJ,
    ISTP,
    ISTJ,
  };

  const logMessage = async (data) => {
    try {
      await axios.post("/api/logMessage", data);
    } catch (err) {
      console.warn("로그 전송 실패:", err.message);
    }
  };

  const logSessionEnd = async () => {
    try {
      await axios.post("/api/logSession", {
        sessionId: sessionIdRef.current,
      });
    } catch (err) {
      console.warn("세션 종료 로그 실패:", err.message);
    }
  };

  const runScene = async (scenario, sceneName) => {
    if (!scenario || !scenario[sceneName]) {
      setEngineError(`시나리오에서 '${sceneName}' 찾을 수 없습니다.`);
      return;
    }

    const sceneArr = scenario[sceneName];

    for (const item of sceneArr) {
      if (abortRef.current) return;

      /** NPC 대사 */
      if (item.role === "npc") {
        await new Promise((resolve) => setTimeout(resolve, 3000)); 
        setHistory((prev) => [...prev, item]);
      }

      /** 엔딩 처리 */
      if (item.type === "end") {
        setHistory(prev => [...prev, item]);  // 엔딩 대사 출력

        if (!abortRef.current && sessionIdRef.current) {
          setTimeout(() => {
            setIsEnding(true); // 👉 마지막 출력 후 엔딩 페이지로
          }, 3000);
        }
        return;
      }

      /** 선택지 표시 */
      if (item.type === "choice") {
        setPendingChoice(item);
        return;
      }
    }
  };

  const choose = async (option) => {
    if (abortRef.current) return;

    const activeSessionId = sessionIdRef.current;
    setPendingChoice(null);

    // 유저 메시지 표시
    setHistory((prev) => [
      ...prev,
      { role: "user", text: option.label || "선택" },
    ]);

    // 로그 저장(선택지)
    stepRef.current += 1;
    await axios.post("/api/logChoice", {
      sessionId: activeSessionId,
      step: stepRef.current,
      mbti: currentMBTI,
      scene: currentScene,
      userChoice: option.label,
      tone: option.tone || "",
      emotion: option.emotion || "",
      comm: option.comm || "",
      timestamp: Date.now(),
      sex: userInfoRef.current?.sex || "",   // ← 수정!
      age: userInfoRef.current?.age || "",   // ← 수정!
    });

    // 🔥 affection 갱신
    let updatedAffection = affection;
    if (typeof option.affection === "number") {
      updatedAffection = affection + option.affection;
      setAffection((prev) => prev + option.affection);
    }

    /** 멀티 엔딩 분기 */
    if (option.next === "CHECK_END") {
      let targetScene = "end_D";

      if (updatedAffection >= 10) targetScene = "end_A";
      else if (updatedAffection >= 5) targetScene = "end_B";
      else if (updatedAffection >= 1) targetScene = "end_C";

      console.log("ENDING LOG PAYLOAD", {
        sessionId: activeSessionId,
        mbti: mbtiRef.current,
        endedAt: Date.now(),
      });

      await axios.post("/api/logSession", {
        sessionId: activeSessionId,
        mbti: mbtiRef.current,
        sex: userInfoRef.current?.sex || "",
        age: userInfoRef.current?.age || "",
        endedAt: Date.now(),
      });


      if (!abortRef.current && sessionIdRef.current === activeSessionId) {
        setCurrentScene(targetScene);
        runScene(currentScenario, targetScene);
      }
      return;
    }

    /** 즉시 END */
    if (option.next === "END") {
      await axios.post("/api/logSession", {
        sessionId: activeSessionId,
        mbti: mbtiRef.current,
        endedAt: Date.now(),
      });

      if (!abortRef.current && sessionIdRef.current === activeSessionId) {
        setCurrentScene("end_D"); // or target ending scene
        runScene(currentScenario, "end_D");
      }
      return;
    }

    /** 일반적 Next 스토리 이동 */
    if (option.next) {
      if (!abortRef.current && sessionIdRef.current === activeSessionId) {
        setCurrentScene(option.next);
        runScene(currentScenario, option.next);
      }
    }
  };


  const start = async (mbti, userInfo) => {
    setCurrentScene("intro");
    setHistory([]);
    setPendingChoice(null);
    mbtiRef.current = mbti;
    setCurrentMBTI(mbti);
    setAffection(0); // 초기화 🔥

    userInfoRef.current = userInfo;

    setIsEnding(false);

    const scenario = storyTable[mbti];
    setCurrentScenario(scenario);

    abortRef.current = false;
    runScene(scenario, "intro");
  };

  const reset = () => {
    abortRef.current = true;
    setHistory([]);
    setCurrentScenario(null);
    setCurrentScene("intro");
    setPendingChoice(null);
    setCurrentMBTI(null);
    setIsEnding(false);
    setEngineError("");
    setAffection(0); // 초기화 🔥

    sessionIdRef.current = createSessionId();
    stepRef.current = 0;
  };

  return {
    history,
    pendingChoice,
    currentScene,
    currentMBTI,
    isEnding,
    engineError,
    start,
    choose,
    reset,
  };
}
