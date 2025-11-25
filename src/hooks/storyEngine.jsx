import { useState } from "react";

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

export default function useStoryEngine() {
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
    setCurrentScene("intro");

    runScene(scenario, "intro");
  };

  /** 🔥 씬 실행 (NPC 메시지 + 선택지 지연 출력) */
  const runScene = async (scenario, sceneName) => {
    const scene = scenario[sceneName];
    if (!scene) return;

    for (const item of scene) {

      // 💬 NPC 대사 출력 (1200ms 딜레이)
      if (item.role === "npc") {
        await new Promise((res) => setTimeout(res, 1200));
        setHistory((prev) => [...prev, { role: "npc", text: item.text }]);
      }

      // ❗ 선택지 출력 (각 메시지 이후 1000ms 후 등장)
      if (item.type === "choice") {
        await new Promise((res) => setTimeout(res, 1000));
        setPendingChoice({
          question: item.question,
          options: item.options
        });
      }
    }
  };

  /** 🔥 선택지 클릭 */
  const choose = async (option) => {
  // 1) 구글 시트 저장
  await fetch("/api/logChoice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      mbti: currentMBTI,
      scene: currentScene,
      userChoice: option.label,
      tone: option.tone || null,
      emotion: option.emotion || null,
      comm: option.comm || null,
      timestamp: Date.now()
    })
  });

  // 2) 유저 선택 history 에 기록
  setHistory((prev) => [...prev, { role: "user", text: option.label }]);
  setPendingChoice(null);

  // 3) 종료 처리
  if (option.next === "END") {
    setIsEnding(true);      // ← 끝났음을 표시 (새 state 필요)
    return;
  }

  // 4) 다음 씬 실행
  if (option.next) {
    setCurrentScene(option.next);
    runScene(currentScenario, option.next);
  }
};


  return {
    history,
    pendingChoice,
    start,
    choose,
    isEnding   // ← App.jsx에서 읽을 수 있게 전달
  };

}