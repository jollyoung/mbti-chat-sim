import { useState } from "react";
import { story } from "../story/storyEngine";

export default function useChatEngine() {
  const [history, setHistory] = useState([]);
  const [pendingChoice, setPendingChoice] = useState(null);

  const pushMessage = (msg) => {
    setHistory((prev) => [...prev, msg]);
  };

  const proceedStory = (key) => {
    const sequence = story[key];

    for (let item of sequence) {
      if (item.type === "choice") {
        setPendingChoice(item);
        return;
      } else {
        pushMessage(item);
      }
    }
  };

  const start = () => {
    proceedStory("intro");
  };

  const choose = (option) => {
    pushMessage({ role: "user", text: option.label });
    setPendingChoice(null);
    proceedStory(option.next);
  };

  return { history, pendingChoice, start, choose };
}
