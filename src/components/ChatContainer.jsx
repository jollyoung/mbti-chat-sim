import { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble.jsx";

export default function ChatContainer({ messages, npcProfile, currentLocation }) {
  const bottomRef = useRef(null);

  // 🔥 메시지 업데이트 시 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const locationStyles = {
    default: "#efefef",
    cafe: "#d8c4a0",
    home: "#cfd8ff",
  };

  const bgColor = locationStyles[currentLocation] || locationStyles.default;


  return (
    <div className="chat-wrapper" >
      <div className="chat-header">
        <img src={npcProfile} className="npc-avatar" />
        <div className="npc-info">
          <div className="npc-name">상대방</div>
        </div>
      </div>

      <div className={`chat-wrapper ${
        currentLocation === "cafe" ? "cafe-bg" :
        currentLocation === "street" ? "street-bg" :
        currentLocation === "home" ? "home-bg" :
        "default-bg"
      }`}>
        {messages.map((msg, i) => (
          <ChatBubble
            key={i}
            role={msg.role}
            text={msg.text}
            npcProfile={npcProfile}
          />
        ))}

        {/* 🔥 자동 스크롤 anchor */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
