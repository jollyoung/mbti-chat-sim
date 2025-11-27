const INFP = {
  intro: [
    {
      role: "npc",
      text: "안녕하세요…! 소개받아서 이렇게 연락드려요. 혹시 지금 이야기 괜찮으세요?"
    },
    {
      type: "choice",
      question: "어떻게 답할까요?",
      options: [
        { label: "네! 지금 괜찮아요.", next: "scene_2" },
        { label: "지금은 조금 바쁜데요… 어떤 일이신가요?", next: "scene_2" },
        { label: "천천히 말씀하셔도 돼요 :)", next: "scene_2" }
      ]
    }
  ],

  scene_2: [
    {
      role: "npc",
      text: "그럼… 오늘 하루는 어떻게 보내셨어요? 저는 좀 정신 없었는데 이렇게 이야기하니까 편안해지네요."
    },
    {
      type: "choice",
      question: "답변을 선택하세요",
      options: [
        { label: "바빴지만 괜찮았어요.", next: "scene_3" },
        { label: "평범했어요!", next: "scene_3" },
        { label: "조금 지쳤는데… 이야기하니까 좋네요.", next: "scene_3", affection: +1 }
      ]
    }
  ],

  scene_3: [
    {
      role: "npc",
      text: "사실 소개로 연락하는 게 조금 어색해요. 그래도 이야기 나누고 싶었어요."
    },
    {
      type: "choice",
      question: "어떻게 반응할까요?",
      options: [
        { label: "저도 어색하지만 재밌네요.", next: "scene_4" },
        { label: "부담 없이 편하게 이야기해요.", next: "scene_4" },
        { label: "긴장하셨어요? 귀여운데요?", next: "scene_4", affection: +2 }
      ]
    }
  ],

  scene_4: [
    {
      role: "npc",
      text: "덕분에 좀 편해졌어요. 혹시 간단히 서로 소개해볼까요?"
    },
    {
      type: "choice",
      question: "먼저 소개할까요?",
      options: [
        { label: "제가 먼저 소개할게요.", next: "scene_5" },
        { label: "먼저 소개해주실래요?", next: "scene_5" },
        { label: "번갈아서 해볼까요?", next: "scene_5" }
      ]
    }
  ],

  scene_5: [
    {
      role: "npc",
      text: "저는 디자인 관련 일을 해요. 글 쓰는 것도 좋아하고요."
    },
    {
      type: "choice",
      question: "어떻게 이어갈까요?",
      options: [
        { label: "저도 혼자 시간 보내는 거 좋아해요.", next: "scene_6" },
        { label: "저는 활동적인 편이에요!", next: "scene_6" },
        { label: "취향 멋지네요.", next: "scene_6", affection: +1 }
      ]
    }
  ],

  scene_6: [
    {
      role: "npc",
      text: "00님은 쉬는 날 뭐하세요?"
    },
    {
      type: "choice",
      question: "취미를 선택하세요",
      options: [
        { label: "집에서 쉬어요.", next: "scene_7" },
        { label: "운동이나 사람 만나서요!", next: "scene_7" },
        { label: "취미 찾는 중이에요.", next: "scene_7" }
      ]
    }
  ],

  scene_7: [
    {
      role: "npc",
      text: "저는 사람 관계가 금방 친해지는 편은 아니에요… 천천히 알아가도 괜찮죠?"
    },
    {
      type: "choice",
      question: "어떻게 공감할까요?",
      options: [
        { label: "물론이죠.", next: "scene_8" },
        { label: "저도 천천히 알아가는 게 좋아요.", next: "scene_8" },
        { label: "이미 꽤 편한데요?", next: "scene_8", affection: +1 }
      ]
    }
  ],

  scene_8: [
    {
      role: "npc",
      text: "00님한테는 이상하게 편하게 말하게 되네요…"
    },
    {
      type: "choice",
      question: "어떻게 답할까요?",
      options: [
        { label: "저도 그래요.", next: "scene_9" },
        { label: "분위기가 좋아서 그런가 봐요.", next: "scene_9" },
        { label: "그렇게 말해줘서 고마워요.", next: "scene_9" }
      ]
    }
  ],

  scene_9: [
    {
      role: "npc",
      text: "메시지 보내기 전에 고민했어요. 너무 TMI였을까 봐요…"
    },
    {
      type: "choice",
      question: "어떻게 반응해줄까?",
      options: [
        { label: "귀여워요.", next: "scene_10", affection: +2 },
        { label: "전혀 아니에요.", next: "scene_10" },
        { label: "그런 모습도 좋은걸요.", next: "scene_10", affection: +1 }
      ]
    }
  ],

  scene_10: [
    {
      role: "npc",
      text: "혹시… 시간 괜찮을 때 커피 한 잔 하실래요?"
    },
    {
      type: "choice",
      question: "만남 제안에 대한 반응",
      options: [
        { label: "좋아요!", next: "scene_11" },
        { label: "조금 더 얘기하다가 결정해요.", next: "scene_11" },
        { label: "저도 생각하고 있었어요.", next: "scene_11", affection: +1 }
      ]
    }
  ],

  scene_11: [
    {
      role: "npc",
      text: "그럼 이번 주말 낮은 어떠세요?"
    },
    {
      type: "choice",
      options: [
        { label: "주말 좋아요!", next: "scene_12" },
        { label: "평일 오후는 어때요?", next: "scene_12" },
        { label: "다음 주는 어때요?", next: "scene_12" }
      ]
    }
  ],

  scene_12: [
    {
      role: "npc",
      text: "그때 뵈어요. 기대할게요!"
    },
    {
      type: "choice",
      options: [
        { label: "저도 기대돼요.", next: "scene_13" }
      ]
    }
  ],

  scene_13: [
    {
      role: "npc",
      text: "오… 직접 보니까 더 반갑네요."
    },
    {
      type: "choice",
      options: [
        { label: "저도 반가워요!", next: "scene_14" },
        { label: "실물이 더 분위기 좋으신데요?", next: "scene_14", affection: +2 },
        { label: "조금 긴장되네요…", next: "scene_14", affection: +1 }
      ]
    }
  ],

  scene_14: [
    {
      role: "npc",
      text: "여기 라떼 되게 부드러워요. 같이 드실래요?"
    },
    {
      type: "choice",
      options: [
        { label: "좋아요!", next: "scene_15" },
        { label: "저는 차 마실래요.", next: "scene_15" },
        { label: "추천해주시는 걸로요!", next: "scene_15", affection: +1 }
      ]
    }
  ],

  scene_15: [
    {
      role: "npc",
      text: "실제로 만나보니까… 메시지보다 더 편안하네요."
    },
    {
      type: "choice",
      options: [
        { label: "저도 그래요.", next: "scene_16" },
        { label: "분위기 좋아요.", next: "scene_16" },
        { label: "혹시… 호감 좀 있으세요?", next: "scene_16", affection: +2 }
      ]
    }
  ],

  scene_16: [
    {
      role: "npc",
      text: "저… 사실 마음을 쉽게 여는 편은 아닌데 오늘은 자연스럽네요."
    },
    {
      type: "choice",
      options: [
        { label: "믿어주셔서 고마워요.", next: "scene_17" },
        { label: "저도 편해요.", next: "scene_17" },
        { label: "천천히 말해도 돼요.", next: "scene_17" }
      ]
    }
  ],

  scene_17: [
    {
      role: "npc",
      text: "앗… 회사 연락이 와서 잠깐만요!"
    },
    {
      type: "choice",
      options: [
        { label: "괜찮아요!", next: "scene_18" },
        { label: "걱정됐어요.", next: "scene_18", affection: +1 },
        { label: "천천히 다녀오세요.", next: "scene_18", affection: +1 }
      ]
    }
  ],

  scene_18: [
    {
      role: "npc",
      text: "기다리게 해서 죄송해요… 신경 쓰였죠?"
    },
    {
      type: "choice",
      options: [
        { label: "전혀요!", next: "scene_19" },
        { label: "조금 걱정됐어요.", next: "scene_19", affection: +1 },
        { label: "오히려 기다릴 이유가 있었으면…", next: "scene_19", affection: +2 }
      ]
    }
  ],

  scene_19: [
    {
      role: "npc",
      text: "오늘… 너무 좋았어요."
    },
    {
      type: "choice",
      options: [
        { label: "저도요.", next: "scene_20" },
        { label: "행복했어요.", next: "scene_20" },
        { label: "다음도 기대돼요.", next: "scene_20", affection: +2 }
      ]
    }
  ],

  scene_20: [
    {
      role: "npc",
      text: "집 잘 들어가셨어요? 고맙다는 말 꼭 하고 싶었어요."
    },
    {
      type: "choice",
      options: [
        { label: "잘 들어갔어요.", next: "scene_21" },
        { label: "오늘 너무 좋았어요.", next: "scene_21", affection: +1 },
        { label: "다음엔 언제 볼까요?", next: "scene_21", affection: +2 }
      ]
    }
  ],

  scene_21: [
    {
      role: "npc",
      text: "저… 사실 조금 설렜어요."
    },
    {
      type: "choice",
      options: [
        { label: "저도 설렜어요.", next: "scene_22", affection: +2 },
        { label: "걱정 안 해도 돼요.", next: "scene_22" },
        { label: "천천히 예쁘게 알아가요.", next: "scene_22" }
      ]
    }
  ],

  scene_22: [
    {
      role: "npc",
      text: "앞으로 조금 더 가까워지는 거죠?"
    },
    {
      type: "choice",
      question: "마지막 선택",
      options: [
        { label: "네! 잘 부탁드려요 :)", next: "CHECK_END", affection: +2 },
        { label: "저도 기대돼요.", next: "CHECK_END", affection: +1 },
        { label: "예쁘게 알아가면 좋겠어요.", next: "CHECK_END", affection: +1 }
      ]
    }
  ],

  // ---- 엔딩 루트 ----
  end_A: [
    { role: "npc", text: "오늘 정말 많이 설렜어요. 함께하고 싶어요." },
    { type: "end" }
  ],

  end_B: [
    { role: "npc", text: "천천히 더 알아가면 좋겠어요 :)" },
    { type: "end" }
  ],

  end_C: [
    { role: "npc", text: "저는… 친구처럼 편했어요. 괜찮죠?" },
    { type: "end" }
  ],

  end_D: [
    { role: "npc", text: "요즘 정신이 없어서… 연락이 조금 뜸할 수도 있어요." },
    { type: "end" }
  ]
};

export default INFP;
