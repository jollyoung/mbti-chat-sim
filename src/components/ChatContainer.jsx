import { useEffect, useRef, useState } from "react";
import ChatBubble from "./ChatBubble.jsx";

export default function ChatContainer({ messages, npcProfile, currentLocation }) {
  const bottomRef = useRef(null);
  const [displayLocation, setDisplayLocation] = useState("default");
  const [transitionStage, setTransitionStage] = useState("idle");


  useEffect(() => {
    if (currentLocation === displayLocation) return;
    setTransitionStage("out");                // 기존 배경 페이드아웃
    const outTimer = setTimeout(() => {
      setDisplayLocation(currentLocation);    // 배경 스위치
      setTransitionStage("in");               // 새 배경 페이드인
    }, 250);
    const inTimer = setTimeout(() => setTransitionStage("idle"), 500);
    return () => {
      clearTimeout(outTimer);
      clearTimeout(inTimer);
    };
  }, [currentLocation, displayLocation]);

  
  // 🔥 메시지 업데이트 시 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  
  const transitionClass = 
    transitionStage === "out" ? "fade-out" :
    transitionStage === "in" ? "fade-in" : "";


  return (
    <div className={`chat-wrapper ${
      displayLocation === "cafe" ? "cafe-bg" : 
      displayLocation === "street"? "street-bg" : 
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
          <ChatBubble key={i} role={msg.role} text={msg.text} npcProfile={npcProfile} />
        ))}

        {/* 🔥 자동 스크롤 anchor */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
