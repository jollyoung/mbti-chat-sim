import { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble.jsx";

export default function ChatContainer({ messages, npcProfile }) {
  const bottomRef = useRef(null);

  // 🔥 메시지 업데이트 시 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-wrapper">
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

        {/* 🔥 자동 스크롤 anchor */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
