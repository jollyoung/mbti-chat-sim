import { useState, useEffect } from "react";
import { story } from "../story/storyEngine";

export default function useChatEngine() {
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState(0);
  const [choiceVisible, setChoiceVisible] = useState(false);
  const [currentChoices, setCurrentChoices] = useState([]);

  // ✅ 메시지 추가 헬퍼
  const pushMessage = (sender, text) => {
    setMessages(prev => [...prev, { sender, text }]);
  };

  // ✅ NPC 메시지를 1초 간격으로 출력하는 함수
  const pushNPCMessagesSequentially = async (npcLines) => {
    for (let i = 0; i < npcLines.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 지연
      pushMessage("npc", npcLines[i]);
    }
  };

  // 첫 시작
  useEffect(() => {
    const firstNPC = story[0].npc;
    
    // npc가 배열이면 → 순차 출력
    if (Array.isArray(firstNPC)) {
      pushNPCMessagesSequentially(firstNPC);
    } else {
      pushMessage("npc", firstNPC);
    }

    setCurrentChoices(story[0].choices);
    setChoiceVisible(true);
  }, []);

  // 유저 선택 처리
  const handleChoice = (choiceText) => {
    pushMessage("user", choiceText);
    setChoiceVisible(false);

    const next = story[step + 1];
    if (!next) return;

    setStep(prev => prev + 1);

    // NPC 대사 출력
    if (Array.isArray(next.npc)) {
      pushNPCMessagesSequentially(next.npc);
    } else {
      pushMessage("npc", next.npc);
    }

    // 다음 선택지가 있다면 제시
    if (next.choices) {
      setTimeout(() => {
        setCurrentChoices(next.choices);
        setChoiceVisible(true);
      }, 1000 * (Array.isArray(next.npc) ? next.npc.length : 1));
    }
  };

  return {
    messages,
    choiceVisible,
    currentChoices,
    handleChoice
  };
}
