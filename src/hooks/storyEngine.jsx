// src/hooks/storyEngine.jsx

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

const saveChoiceData = (data) => {
  const prev = JSON.parse(localStorage.getItem("choiceLogs") || "[]");
  prev.push({ ...data, timestamp: Date.now() });
  localStorage.setItem("choiceLogs", JSON.stringify(prev));
};


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
  const [history, setHistory] = useState([]);       // 화면에 표시되는 대화 히스토리
  const [currentScenario, setCurrentScenario] = useState(null); 
  const [currentScene, setCurrentScene] = useState("intro");
  const [pendingChoice, setPendingChoice] = useState(null); // ChoiceModal에 전달할 선택지


  /** 시나리오 시작 */
  const start = (mbti) => {
    const scenario = storyTable[mbti];

    setCurrentScenario(scenario);
    setHistory([]);
    setCurrentScene("intro");
    runScene(scenario, "intro");
  };


  /** 현재 씬 실행 */
  const runScene = (scenario, sceneName) => {
    const scene = scenario[sceneName];
    if (!scene) return;

    scene.forEach((item) => {
      if (item.role === "npc") {
        setHistory((prev) => [...prev, { role: "npc", text: item.text }]);
      }

      if (item.type === "choice") {
        // 선택지가 있다면 일시 정지 → Modal 띄우기
        setPendingChoice({
          question: item.question,
          options: item.options
        });
      }
    });
  };


  /** 선택지 클릭 */
  const choose = (option) => {

    saveChoiceData({
      mbti: currentScenario.mbti || "UNKNOWN",
      scene: currentScene,
      userChoice: option.label,
      tone: option.tone || null,
      emotion: option.emotion || null,
      comm: option.comm || null,
    });

    setHistory((prev) => [
      ...prev,
      { role: "user", text: option.label }
    ]);

    setPendingChoice(null);

    // 다음 씬으로 이동
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
  };
}
