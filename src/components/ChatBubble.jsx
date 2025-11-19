export default function ChatBubble({ role, text }) {
  return (
    <div className={`bubble ${role === "npc" ? "bubble-npc" : "bubble-user"}`}>
      {text}
    </div>
  );
}