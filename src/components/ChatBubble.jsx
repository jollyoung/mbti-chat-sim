export default function ChatBubble({ role, text }) {
  return (
    <div className={`bubble fade-in ${role === "npc" ? "bubble-npc" : "bubble-user"}`}>
      {text}
    </div>
  );
}
