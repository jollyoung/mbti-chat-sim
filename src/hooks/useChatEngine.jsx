import { useState, useEffect } from "react";

export default function useChatEngine() {
  const [messages, setMessages] = useState([]);
  const [pendingChoice, setPendingChoice] = useState(null);

  const [scene, setScene] = useState(null);
  const [index, setIndex] = useState(0);
  const [currentStory, setCurrentStory] = useState(null);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const pushMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  // ⭐ 유저가 입력을 끝냈을 때 호출 — MBTI로 시작
  const start = async (mbti) => {
    const scenario = storyTable[mbti];

    if (!scenario) {
      console.error("❌ 없는 MBTI 시나리오입니다:", mbti);
      return;
    }

    setCurrentStory(scenario);
    setScene("intro");
    setIndex(0);
    setMessages([]);
  };

  // ⭐ 씬/인덱스에 따라 다음 메시지 출력
  const playNext = async (storyObj, curScene, curIndex) => {
    const block = storyObj[curScene][curIndex];
    if (!block) return;

    // 선택지면 → 렌더링 후 멈춤
    if (block.type === "choice") {
      setTimeout(() => {
        setPendingChoice(block);
      }, 800);
      return;
    }

    // 일반 메시지면 출력
    pushMessage({ role: block.role, text: block.text });
    await delay(1000);

    setIndex(curIndex + 1);
  };

  // index/scene 변경 시 자동 호출
  useEffect(() => {
    if (!currentStory || scene === null) return;
    const storyObj = currentStory;

    // 현재 scene에 해당하는 배열이 없으면 종료
    if (!storyObj[scene]) return;

    playNext(storyObj, scene, index);
  }, [currentStory, scene, index]);


  // ⭐ 유저 선택 처리
  const choose = async (option) => {
    setPendingChoice(null);

    // 유저 말풍선
    pushMessage({ role: "user", text: option.label });

    await delay(500);

    setScene(option.next); // 다음 scene 이동
    setIndex(0);
  };

  return {
    history: messages,
    pendingChoice,
    currentChoices: pendingChoice?.options || [],
    start,
    choose,
  };
}
