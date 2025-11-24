// src/components/ChatContainer.jsx
import ChatBubble from "./ChatBubble";
import "../index.css";

export default function ChatContainer({ messages, npcProfile }) {
  return (
    <div className="chat-wrapper">

      {/* 🔥 프로필 + 상단 헤더 */}
      <div className="chat-header">
        <img
          src="/profile_npc.png"
          className="npc-avatar"
          alt="NPC Profile"
        />
        <div className="npc-info">
          <div className="npc-name">상대방</div>
          <div className="npc-status">온라인</div>
        </div>
      </div>

      {/* 🔥 채팅 본문 */}
      <div className="chat-body">
        {messages.map((msg, i) => (
          <ChatBubble
            key={i}
            role={msg.role}
            text={msg.text}
            npcProfile={npcProfile}
          />
        ))}
      </div>
    </div>
  );
}
