import { useEffect, useRef, useState } from "react";
import ChatBubble from "./ChatBubble.jsx";

export default function ChatContainer({ messages, npcProfile, currentLocation }) {
  const bottomRef = useRef(null);
  const [displayLocation, setDisplayLocation] = useState("default");
  const [transitionStage, setTransitionStage] = useState("idle");

  // 🔥 장소 전환 애니메이션 실행
  useEffect(() => {
    if (currentLocation === displayLocation) return;
    setTransitionStage("out");
    const outTimer = setTimeout(() => {
      setDisplayLocation(currentLocation);
      setTransitionStage("in");
    }, 250);
    const inTimer = setTimeout(() => setTransitionStage("idle"), 600);

    return () => {
      clearTimeout(outTimer);
      clearTimeout(inTimer);
    };
  }, [currentLocation, displayLocation]);

  const transitionClass =
    transitionStage === "out" ? "location-change-out" :
    transitionStage === "in" ? "location-change-in" : "";

  // 🔥 메시지 변경 시 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={`chat-wrapper ${transitionClass} ${
      displayLocation === "cafe" ? "cafe-bg" :
      displayLocation === "restaurant" ? "restaurant-bg" :
      displayLocation === "street" ? "street-bg" :
      displayLocation === "home" ? "home-bg" : "default-bg"
    }`}>

      <div className="chat-header">
        <img src={npcProfile} className="npc-avatar" />
        <div className="npc-info">
          <div className="npc-name">상대방</div>
        </div>
      </div>

      <div className="chat-body">
        {messages.map((msg, i) => (
          <ChatBubble
            key={i}
            role={msg.role}
            text={msg.text}
            npcProfile={npcProfile}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
