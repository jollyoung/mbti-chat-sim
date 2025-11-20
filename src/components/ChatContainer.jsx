import ChatBubble from "./ChatBubble";

export default function ChatContainer({ messages }) {
  if (!Array.isArray(messages)) return null;

  return (
    <div className="chat-container">
      {messages.map((msg, i) => (
        <ChatBubble key={i} {...msg} />
      ))}
    </div>
  );
}
