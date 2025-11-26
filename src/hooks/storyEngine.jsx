import { useRef, useState } from "react";

import INFP from "../stories/INFP.js";
import INFJ from "../stories/INFJ.js";
import INTJ from "../stories/INTJ.js";
import INTP from "../stories/INTP.js";
import ISFP from "../stories/ISFP.js";
import ISFJ from "../stories/ISFJ.js";
import ISTP from "../stories/ISTP.js";
import ISTJ from "../stories/ISTJ.js";

import ENFP from "../stories/ENFP.js";
import ENFJ from "../stories/ENFJ.js";
import ENTP from "../stories/ENTP.js";
import ENTJ from "../stories/ENTJ.js";

import ESFP from "../stories/ESFP.js";
import ESFJ from "../stories/ESFJ.js";
import ESTP from "../stories/ESTP.js";
import ESTJ from "../stories/ESTJ.js";

// MBTI별 시나리오 테이블
const storyTable = {
  INFP,
  INFJ,
  INTJ,
  INTP,
  ISFP,
  ISFJ,
  ISTP,
  ISTJ,
  ENFP,
  ENFJ,
  ENTP,
  ENTJ,
  ESFP,
  ESFJ,
  ESTP,
  ESTJ
};

// UUID 생성기
function createSessionId() {
  return crypto.randomUUID();
}

export default function useStoryEngine() {
  const sessionIdRef = useRef(createSessionId());
  const stepRef = useRef(0);
  const [history, setHistory] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [currentScene, setCurrentScene] = useState("intro");
  const [pendingChoice, setPendingChoice] = useState(null);
  const [currentMBTI, setCurrentMBTI] = useState(null);
  const [isEnding, setIsEnding] = useState(false);

  // localStorage 저장 기능
  const saveChoiceData = (data) => {
    const prev = JSON.parse(localStorage.getItem("choiceLogs") || "[]");
    prev.push({ ...data, timestamp: Date.now() });
    localStorage.setItem("choiceLogs", JSON.stringify(prev));
  };

  /** 🔥 시나리오 시작 */
  const start = (mbti) => {
    const scenario = storyTable[mbti];

    setCurrentMBTI(mbti);
    setCurrentScenario(scenario);
    setHistory([]);
    setPendingChoice(null);
    setCurrentScene("intro");
    setIsEnding(false);

    // 세션 리셋
    sessionIdRef.current = createSessionId();
    stepRef.current = 0;

    runScene(scenario, "intro");
  };

  /** 🔥 씬 실행 (NPC 메시지 + 선택지 지연 출력) */
  const choose = async (option) => {
    setPendingChoice(null);
    setHistory((prev) => [...prev, { role: "user", text: option.label }]);

    // 🔥 step 증가
    const nextStep = stepRef.current + 1;
    stepRef.current = nextStep;

    // 🔥 구글 시트 저장
    await fetch("/api/logChoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: sessionIdRef.current,
        step: nextStep,
        mbti: currentMBTI,
        scene: currentScene,
        userChoice: option.label,
        tone: option.tone || null,
        emotion: option.emotion || null,
        comm: option.comm || null,
        timestamp: Date.now()
      })
    });

    // 🔥 다음 씬으로 이동
    if (option.next === "END") {
      setIsEnding(true);
      return;
    } else if (option.next) {
      setCurrentScene(option.next);
      runScene(currentScenario, option.next);
    }
  };


  const reset = () => {
    setHistory([]);
    setCurrentScenario(null);
    setCurrentScene("intro");
    setPendingChoice(null);
    setCurrentMBTI(null);
    setIsEnding(false);
    sessionIdRef.current = createSessionId();
    stepRef.current = 0;
  };


  return {
    history,
    pendingChoice,
    start,
    choose,
    isEnding,
    reset
  };

}