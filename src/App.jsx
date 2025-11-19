import { useEffect } from "react";
import ChatContainer from "./components/ChatContainer.jsx";
import ChoiceModal from "./components/ChoiceModal.jsx";
import useChatEngine from "./hooks/useChatEngine.jsx";
import "./index.css";

function App() {
  const { history, pendingChoice, start, choose } = useChatEngine();

  useEffect(() => {
    start();
  }, []);

  return (
    <>
      <ChatContainer history={history} />

      {pendingChoice && (
        <ChoiceModal
          question={pendingChoice.question}
          options={pendingChoice.options}
          onSelect={choose}
        />
      )}
    </>
  );
}

export default App;
