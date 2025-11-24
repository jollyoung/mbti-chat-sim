export default function ChatBubble({ role, text, npcProfile }) {
  const isNPC = role === "npc";

  return (
    <div className={`chat-row ${isNPC ? "left" : "right"}`}>
      {isNPC && (
        <img src={npcProfile} className="bubble-avatar" />
      )}

      <div className={`bubble-box ${isNPC ? "npc-bubble" : "user-bubble"}`}>
        <div className="bubble-text">{text}</div>
        <div className="bubble-tail" />
      </div>
    </div>
  );
}
