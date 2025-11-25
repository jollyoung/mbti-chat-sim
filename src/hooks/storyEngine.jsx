import { useState } from "react";
import storyTable from "../stories/storyTable.js";
import { logChoiceToSheet } from "../utils/logChoice.js";

export default function useStoryEngine() {
  const [history, setHistory] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [currentScene, setCurrentScene] = useState(null);
  const [pendingChoice, setPendingChoice] = useState(null);
  const [currentMBTI, setCurrentMBTI] = useState(null);
  const [isEnding, setIsEnding] = useState(false);

  // 시나리오 시작
  const startScenario = (mbti) => {
    const scenario = storyTable[mbti];
    if (!scenario) return;

    setCurrentMBTI(mbti);
    setCurrentScenario(scenario);
    setCurrentScene("intro");
    setHistory([]);
    setIsEnding(false);

    playScene(scenario["intro"]);
  };

  // 장면 재생
  const playScene = (scene) => {
    let output = [];

    for (let line of scene) {
      if (line.type === "choice") {
        setPendingChoice(line);
        setHistory((h) => [...h, ...output]);
        return;
      } else {
        output.push({ role: line.role, text: line.text });
      }
    }

    setHistory((h) => [...h, ...output]);
    setPendingChoice(null);

    // 🚩 끝 장면인지 확인
    if (scene[scene.length - 1].end === true) {
      setIsEnding(true);
    }
  };

  // 선택 처리
  const choose = async (option) => {
    setPendingChoice(null);

    await logChoiceToSheet({
      mbti: currentMBTI,
      scene: currentScene,
      choice: option.label,
      tone: option.tone,
      emotion: option.emotion,
      comm: option.comm
    });

    const next = option.next;
    setCurrentScene(next);

    playScene(currentScenario[next]);
  };

  const restart = () => {
    startScenario(currentMBTI);
  };

  const resetMBTI = () => {
    setHistory([]);
    setCurrentScenario(null);
    setPendingChoice(null);
    setIsEnding(false);
    setCurrentMBTI(null);
  };

  return {
    history,
    pendingChoice,
    isEnding,
    currentMBTI,
    startScenario,
    choose,
    restart,
    resetMBTI
  };
}
