import ChatBubble from "./ChatBubble";

export default function ChatContainer({ history }) {
  return (
    <div className="chat-container">
      <div className="chat-body">
        {history.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} text={msg.text} />
        ))}
      </div>
    </div>
  );
}
