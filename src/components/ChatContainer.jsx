import ChatBubble from "./ChatBubble.jsx";

export default function ChatContainer({ messages, npcProfile }) {
  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <img src={npcProfile} className="npc-avatar" />
        <div className="npc-info">
          <div className="npc-name">상대방</div>
          <div className="npc-status">온라인</div>
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
      </div>
    </div>
  );
}
