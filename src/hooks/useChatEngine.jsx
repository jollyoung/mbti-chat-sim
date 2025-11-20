import { useState, useEffect } from "react";
import { story } from "../story/storyEngine";

export default function useChatEngine() {
  const [messages, setMessages] = useState([]);
  const [scene, setScene] = useState("intro");
  const [index, setIndex] = useState(0);

  const [choiceVisible, setChoiceVisible] = useState(false);
  const [currentChoices, setCurrentChoices] = useState([]);

  // 메시지 추가
  const pushMessage = (msg) => {
    setMessages(prev => [...prev, msg]);
  };

  // NPC 메시지 출력
  const playNext = async () => {
    const block = story[scene][index];
    if (!block) return;

    // 선택지가 나오면 멈추고 선택창 표시
    if (block.type === "choice") {
      setCurrentChoices(block.options);
      setChoiceVisible(true);
      return;
    }

    // 일반 메시지 출력
    pushMessage({ role: block.role, text: block.text });

    // 다음 메시지까지 1초 대기
    await new Promise(res => setTimeout(res, 1000));

    setIndex(prev => prev + 1);
  };

  // 처음 시작
  useEffect(() => {
    playNext();
  }, [index, scene]);

  // 선택 처리
  const handleChoice = (opt) => {
    // 유저 메시지 추가
    pushMessage({ role: "user", text: opt.label });
    setChoiceVisible(false);

    // 다음 scene으로 이동
    setScene(opt.next);
    setIndex(0);

    // 약간 쉬고 다음 장면 시작
    setTimeout(() => playNext(), 500);
  };

  return {
    messages,
    choiceVisible,
    currentChoices,
    handleChoice
  };
}
