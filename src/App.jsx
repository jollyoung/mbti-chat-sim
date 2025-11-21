import ChatContainer from "./components/ChatContainer.jsx";
import ChoiceModal from "./components/ChoiceModal.jsx";
import useChatEngine from "./hooks/useChatEngine.jsx";
import "./index.css";

function App() {
  const {
    messages,
    choiceVisible,
    currentChoices,
    handleChoice
  } = useChatEngine();

  return (
    <>
      {/* 채팅 메시지 표시 */}
      <ChatContainer messages={messages} />

      {/* 선택지 모달 */}
      {choiceVisible && (
        <ChoiceModal
          question="선택해주세요"
          options={currentChoices}
          onSelect={handleChoice}
        />
      )}
    </>
  );
}

export default App;
