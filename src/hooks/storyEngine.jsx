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
  INFP, INFJ, INTJ, INTP,
  ISFP, ISFJ, ISTP, ISTJ,
  ENFP, ENFJ, ENTP, ENTJ,
  ESFP, ESFJ, ESTP, ESTJ
};

export default function useStoryEngine() {
  const [history, setHistory] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [currentScene, setCurrentScene] = useState("intro");
  const [pendingChoice, setPendingChoice] = useState(null);
  const [currentMBTI, setCurrentMBTI] = useState(null);

  const [isEnding, setIsEnding] = useState(false);   // 🔥 추가됨

  /** 🔥 시나리오 시작 */
  const start = (mbti) => {
    const scenario = storyTable[mbti];

    setCurrentMBTI(mbti);
    setCurrentScenario(scenario);
    setHistory([]);
    setCurrentScene("intro");
    setIsEnding(false);   // 🔥 엔딩 초기화

    runScene(scenario, "intro");
  };

  /** 🔥 씬 실행 */
  const runScene = async (scenario, sceneName) => {
    const scene = scenario[sceneName];
    if (!scene) return;

    for (const item of scene) {

      if (item.role === "npc") {
        await new Promise((res) => setTimeout(res, 1200));
        setHistory((prev) => [...prev, { role: "npc", text: item.text }]);
      }

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

    // 서버 저장
    await fetch("/api/logChoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

    // 사용자 메시지 출력
    setHistory((prev) => [...prev, { role: "user", text: option.label }]);
    setPendingChoice(null);

    // 🔥 END 처리
    if (option.next === "END") {
      setIsEnding(true);      // 🔥 엔딩 상태 진입
      return;
    }

    // 다음 씬 이동
    if (option.next) {
      setCurrentScene(option.next);
      runScene(currentScenario, option.next);
    }
  };

  const restartSameMBTI = () => {
    start(currentMBTI);
  };

  const resetToIntro = () => {
    window.location.reload();
  };

  return {
    history,
    pendingChoice,
    start,
    choose,
    isEnding,            // 🔥 App.jsx에서 받게 되는 상태
    currentMBTI,
    restartSameMBTI,
    resetToIntro
  };
}
