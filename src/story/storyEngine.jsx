export const story = {
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
    { role: "npc", text: "그럼 간단하게 자기소개 먼저 할까요?" }
  ],

  cold: [
    { role: "npc", text: "괜찮아요! 편하실 때 이야기해요 😊" }
  ]
};
