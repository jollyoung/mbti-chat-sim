import { useState } from "react";

// 🔥 모든 MBTI 시나리오 import
import ESTJScenario from "../stories/ESTJ";
import ESTPScenario from "../stories/ESTP";
import ESFJScenario from "../stories/ESFJ";
import ESFPScenario from "../stories/ESFP";

import ENTJScenario from "../stories/ENTJ";
import ENTPScenario from "../stories/ENTP";
import ENFJScenario from "../stories/ENFJ";
import ENFPScenario from "../stories/ENFP";

import INTJScenario from "../stories/INTJ";
import INTPScenario from "../stories/INTP";
import INFJScenario from "../stories/INFJ";
import INFPScenario from "../stories/INFP";

import ISTJScenario from "../stories/ISTJ";
import ISTPScenario from "../stories/ISTP";
import ISFJScenario from "../stories/ISFJ";
import ISFPScenario from "../stories/ISFP";

// 🔥 storyTable 직접 구성
export const storyTable = {
  ESTJ: ESTJScenario,
  ESTP: ESTPScenario,
  ESFJ: ESFJScenario,
  ESFP: ESFPScenario,

  ENTJ: ENTJScenario,
  ENTP: ENTPScenario,
  ENFJ: ENFJScenario,
  ENFP: ENFPScenario,

  INTJ: INTJScenario,
  INTP: INTPScenario,
  INFJ: INFJScenario,
  INFP: INFPScenario,

  ISTJ: ISTJScenario,
  ISTP: ISTPScenario,
  ISFJ: ISFJScenario,
  ISFP: ISFPScenario,
};


export default function useStoryEngine() {
  const [history, setHistory] = useState([]);
  const [currentMBTI, setCurrentMBTI] = useState(null);
  const [currentScene, setCurrentScene] = useState("intro");
  const [pendingChoice, setPendingChoice] = useState(null);
  const [isEnding, setIsEnding] = useState(false);

  // 🔥 시나리오 시작
  function start(mbti) {
    setCurrentMBTI(mbti);
    setHistory([]);
    setIsEnding(false);
    setCurrentScene("intro");

    const scenario = storyTable[mbti];
    if (!scenario) return;

    playScene(scenario["intro"]);
  }

  // 🔥 다음 장면 렌더링
  function playScene(sceneArray) {
    const normalMessages = sceneArray.filter((m) => m.role === "npc");
    const choiceBlock = sceneArray.find((m) => m.type === "choice");

    // 일반 메시지 추가
    setHistory((prev) => [...prev, ...normalMessages]);

    // 선택지가 없는 장면 = 종료 장면
    if (!choiceBlock) {
      setIsEnding(true);
      return;
    }

    // 선택지 설정
    setPendingChoice({
      question: choiceBlock.question,
      options: choiceBlock.options,
    });
  }

  // 🔥 선택지 처리
  async function choose(option) {
    setPendingChoice(null);

    // 선택지를 히스토리에 추가
    setHistory((prev) => [
      ...prev,
      { role: "user", text: option.label },
    ]);

    const scenario = storyTable[currentMBTI];
    const nextKey = option.next;

    if (!scenario[nextKey]) {
      setIsEnding(true);
      return;
    }

    playScene(scenario[nextKey]);
  }

  // 🔁 같은 MBTI 다시 시작
  function restartSameMBTI() {
    start(currentMBTI);
  }

  // 🔁 초기 화면으로 이동
  function resetToIntro() {
    setCurrentMBTI(null);
    setHistory([]);
    setIsEnding(false);
    setCurrentScene("intro");
  }

  return {
    history,
    pendingChoice,
    start,
    choose,
    isEnding,
    currentMBTI,
    restartSameMBTI,
    resetToIntro,
  };
}
