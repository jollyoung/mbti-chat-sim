import { useRef, useState } from "react";
import { STRINGS } from "../constants/strings.js";

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

const API_KEY = import.meta.env.VITE_API_KEY;

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

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// UUID 생성기
function createSessionId() {
  return crypto.randomUUID();
}

function getChoiceQueue() {
  return JSON.parse(localStorage.getItem("choiceLogs") || "[]");
}

function setChoiceQueue(queue) {
  localStorage.setItem("choiceLogs", JSON.stringify(queue));
}

export default function useStoryEngine() {
  const sessionIdRef = useRef(createSessionId());
  const sessionEndLoggedRef = useRef(false);
  const abortRef = useRef(false);
  const stepRef = useRef(0);
  const lastPendingChoiceRef = useRef(null);

  const [history, setHistory] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [currentScene, setCurrentScene] = useState("intro");
  const [pendingChoice, setPendingChoice] = useState(null);
  const [currentMBTI, setCurrentMBTI] = useState(null);
  const [isEnding, setIsEnding] = useState(false);
  const [engineError, setEngineError] = useState("");

  const clearEngineError = () => setEngineError("");

  const saveChoiceData = (data) => {
    const queue = getChoiceQueue();
    queue.push({ ...data, timestamp: Date.now() });
    setChoiceQueue(queue);
  };

  const sendChoicePayload = async (payload) => {
    const response = await fetch("/api/logChoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(API_KEY ? { "x-api-key": API_KEY } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to log choice: ${response.status}`);
    }
  };

  const flushChoiceQueue = async () => {
    const queued = getChoiceQueue();
    if (!queued.length) return;

    const remaining = [...queued];
    for (const entry of queued) {
      await sendChoicePayload(entry);
      remaining.shift();
      setChoiceQueue(remaining);
    }
  };

  const logSessionEnd = async () => {
    if (sessionEndLoggedRef.current) return;

    try {
      const response = await fetch("/api/logSessionEnd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(API_KEY ? { "x-api-key": API_KEY } : {}),
        },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          mbti: currentMBTI,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to log session end: ${response.status}`);
      }

      sessionEndLoggedRef.current = true;
    } catch (error) {
      setEngineError(STRINGS.sessionEndLogError);
    }
  };

  /** 🔥 시나리오 시작 */
  const start = (mbti) => {
    const scenario = storyTable[mbti];
    if (!scenario) return;

    abortRef.current = false;
    sessionEndLoggedRef.current = false;
    setEngineError("");

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
  const runScene = async (scenario, sceneName) => {
    const activeSessionId = sessionIdRef.current;
    const scene = scenario?.[sceneName];
    if (!scene || abortRef.current) return;

    for (const item of scene) {
      if (abortRef.current || sessionIdRef.current !== activeSessionId) return;

      // 💬 NPC 대사 출력 (800ms 딜레이)
      if (item.role === "npc") {
        await delay(800);
        if (abortRef.current || sessionIdRef.current !== activeSessionId) return;
        setHistory((prev) => [...prev, { role: "npc", text: item.text }]);
      }

      // END 이벤트 처리
      if (item.type === "end") {
        await delay(1000);
        if (abortRef.current || sessionIdRef.current !== activeSessionId) return;
        await logSessionEnd();
        if (abortRef.current || sessionIdRef.current !== activeSessionId) return;
        setIsEnding(true);
        return;
      }

      // ❗ 선택지 출력 (각 메시지 이후 800ms 후 등장)
      if (item.type === "choice") {
        await delay(800);
        if (abortRef.current || sessionIdRef.current !== activeSessionId) return;
        const choicePayload = {
          question: item.question,
          options: item.options,
        };
        lastPendingChoiceRef.current = choicePayload;
        setPendingChoice(choicePayload);
      }
    }
  };

  const choose = async (option) => {
    if (abortRef.current) return;
    const activeSessionId = sessionIdRef.current;

    setPendingChoice(null);
    setHistory((prev) => [...prev, { role: "user", text: option.label }]);

    // 🔥 step 증가
    const nextStep = stepRef.current + 1;
    stepRef.current = nextStep;

    const payload = {
      sessionId: sessionIdRef.current,
      step: nextStep,
      mbti: currentMBTI,
      scene: currentScene,
      userChoice: option.label,
      tone: option.tone || null,
      emotion: option.emotion || null,
      comm: option.comm || null,
    };

    try {
      await flushChoiceQueue();
      await sendChoicePayload(payload);
    } catch (error) {
      saveChoiceData(payload);
      setPendingChoice(lastPendingChoiceRef.current);
      setEngineError(STRINGS.choiceSubmitError);
      return;
    }

    // 🔥 다음 씬으로 이동
    if (option.next === "END") {
      await logSessionEnd();
      if (!abortRef.current && sessionIdRef.current === activeSessionId) {
        setIsEnding(true);
      }
      return;
    } else if (option.next) {
      if (!abortRef.current && sessionIdRef.current === activeSessionId) {
        setCurrentScene(option.next);
        runScene(currentScenario, option.next);
      }
    }
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
    sessionIdRef.current = createSessionId();
    stepRef.current = 0;
  };

  return {
    history,
    pendingChoice,
    start,
    choose,
    isEnding,
    reset,
    engineError,
    clearEngineError,
  };
}
