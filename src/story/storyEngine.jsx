const baseScenario = {
  intro: [
    { role: "npc", text: "안녕하세요! 소개받아서 연락드렸어요 😊" },
    { role: "npc", text: "혹시 지금 잠깐 이야기 괜찮나요?" },
    {
      type: "choice",
      question: "어떻게 대답할까요?",
      options: [
        { label: "네 좋아요!", next: "friendly" },
        { label: "지금은 조금 바빠요", next: "cold" }
      ]
    }
  ],

  friendly: [
    { role: "npc", text: "오! 다행이에요 😄" },
    { role: "npc", text: "그럼 간단하게 자기소개 먼저 할까요?" },
    {
      type: "choice",
      question: "어떻게 답할까요?",
      options: [
        { label: "좋아요! 먼저 소개할게요", next: "friendly_next" },
        { label: "먼저 소개해주실래요?", next: "friendly_next" }
      ]
    }
  ],

  friendly_next: [
    { role: "npc", text: "좋아요! 편하게 이야기 해주세요 😊" }
  ],

  cold: [
    { role: "npc", text: "괜찮아요! 편하실 때 이야기해요 😊" },
    {
      type: "choice",
      question: "그럼 언제가 좋을까요?",
      options: [
        { label: "저녁쯤 가능해요", next: "cold_next" },
        { label: "내일 괜찮을 것 같아요", next: "cold_next" }
      ]
    }
  ],

  cold_next: [
    { role: "npc", text: "넵! 그때 다시 이야기해요 :)" }
  ]
};

export const storyTable = {
  INFP: baseScenario,
  INFJ: baseScenario,
  INTJ: baseScenario,
  INTP: baseScenario,
  ISFP: baseScenario,
  ISFJ: baseScenario,
  ISTP: baseScenario,
  ISTJ: baseScenario,
  ENFP: baseScenario,
  ENFJ: baseScenario,
  ENTP: baseScenario,
  ENTJ: baseScenario,
  ESFP: baseScenario,
  ESFJ: baseScenario,
  ESTP: baseScenario,
  ESTJ: baseScenario
};
