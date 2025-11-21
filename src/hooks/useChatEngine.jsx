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
    setMessages((prev) => [...prev, msg]);
  };

  // 다음 메시지 처리 (choice면 멈춤)
  const playNext = async () => {
    const block = story[scene]?.[index];

    if (!block) return;

    // 블록이 선택지라면 → choice UI 보여주고 index 증가하지 않음
    if (block.type === "choice") {
      setCurrentChoices(block.options);
      setChoiceVisible(true);
      return;
    }

    // 일반 NPC 메시지 출력
    pushMessage({ role: block.role, text: block.text });

    // 1초 텀
    await new Promise((res) => setTimeout(res, 1000));

    // 다음 메시지로
    setIndex((prev) => prev + 1);
  };

  // index 또는 scene이 바뀔 때 playNext 실행
  useEffect(() => {
    playNext();
  }, [index, scene]);

  // 유저가 선택했을 때
  const handleChoice = (opt) => {
    pushMessage({ role: "user", text: opt.label });
    setChoiceVisible(false);

    // 다음 시나리오로 이동
    setScene(opt.next);
    setIndex(0);

    // ❌ playNext() 호출 제거!
  };


  return {
    messages,
    choiceVisible,
    currentChoices,
    handleChoice,
  };
}
