const ESTJScenario = {
  intro: [
    { role: "npc", text: "안녕하세요. 소개받아서 연락드립니다." },
    { role: "npc", text: "지금 잠깐 이야기 가능한가요?" },
    {
      type: "choice",
      question: "어떻게 답할까요?",
      options: [
        { 
          label: "네, 지금 가능합니다.",
          next: "estj_start",
          tone: "neutral",
          emotion: "calm",
          comm: "polite"
        },
        { 
          label: "지금은 어렵습니다. 무슨 일인가요?",
          next: "estj_start",
          tone: "neutral",
          emotion: "calm",
          comm: "direct"
        }
      ]
    }
  ],

  estj_start: [
    { role: "npc", text: "좋습니다. 간단히 이야기 나누죠." },
    { role: "npc", text: "먼저 서로 소개부터 하는 게 좋을 것 같네요." },
    {
      type: "choice",
      question: "어떻게 소개할까요?",
      options: [
        { 
          label: "제가 먼저 소개드릴게요.",
          next: "estj_intro",
          tone: "warm",
          emotion: "cheerful",
          comm: "polite"
        },
        { 
          label: "먼저 소개 부탁드립니다.",
          next: "estj_intro",
          tone: "neutral",
          emotion: "calm",
          comm: "direct"
        }
      ]
    }
  ]
};

export default ESTJScenario;
