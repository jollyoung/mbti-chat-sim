const baseScenario = {
  intro: [
    { role: "npc", text: "안녕하세요 :)" },
    {
      type: "choice",
      question: "답장하기",
      options: [
        { label: "반가워요!", next: "start1" },
        { label: "누구세요?", next: "start1" }
      ]
    }
  ],
  start1: [
    { role: "npc", text: "이야기 나눠보고 싶어서 연락드렸어요." },
    { type: "end" }
  ]
};

export default baseScenario;
