import { useEffect, useRef, useState } from "react";
import ChatBubble from "./ChatBubble.jsx";
import SystemNoticeCard from "./SystemNoticeCard";
import SystemDivider from "./SystemDivider";
import SystemStatus from "./SystemStatus";

function renderMessage(msg, npcProfile) {
  if (msg.role === "system") {
    switch (msg.systemType) {
      case "notice":
        return <SystemNoticeCard text={msg.text} />;
      case "divider":
        return <SystemDivider text={msg.text} />;
      case "status":
        return <SystemStatus text={msg.text} />;
      default:
        return null; // 알 수 없는 타입이면 스킵
    }
  }

  return (
    <ChatBubble
      role={msg.role}
      text={msg.text}
      npcProfile={npcProfile}
    />
  );
}


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
          <div key={i}>{renderMessage(msg, npcProfile)}</div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
