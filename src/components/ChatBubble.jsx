export default function ChatBubble({ role, text }) {
  const isNPC = role === "npc";

  return (
    <div className={`chat-row ${isNPC ? "left" : "right"}`}>
      {/* 프로필은 NPC 메시지에서만 표시 */}
      {isNPC && (
        <img src="/profile_npc.png" className="bubble-avatar" />
      )}

      <div className={`bubble-box ${isNPC ? "npc-bubble" : "user-bubble"}`}>
        <div className="bubble-text">{text}</div>
        <div className="bubble-tail" />
      </div>
    </div>
  );
}
