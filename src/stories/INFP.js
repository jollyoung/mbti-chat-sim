const INFP = {
  intro: [
    {
      role: "npc",
      text: "안녕하세요! 소개받고 연락드렸어요. 지금 잠깐 괜찮으세요?",
      location: "default"
    },
    {
      type: "choice",
      question: "답장을 보내볼까요?",
      location: "default",
      options: [
        { label: "네, 시간 괜찮아요!", next: "scene_2" },
        { label: "조금 바쁘긴 한데, 말씀해보세요!", next: "scene_2" },
        { label: "천천히 괜찮아요 :)", next: "scene_2" }
      ]
    }
  ],

  scene_2: [
    {
      role: "npc",
      text: "오늘 하루는 어떠셨어요? 저는 정신 없었는데, 이렇게 얘기하니까 좀 풀리는 느낌이에요.",
      location: "default"
    },
    {
      type: "choice",
      question: "어떤 대답을 할까요?",
      location: "default",
      options: [
        { label: "바빴지만 괜찮았어요!", next: "scene_3" },
        { label: "평범했어요.", next: "scene_3" },
        { label: "조금 피곤했는데… 이렇게 얘기하니 좋네요.", next: "scene_3", affection: +1 }
      ]
    }
  ],

  scene_3: [
    {
      role: "npc",
      text: "혹시… 커피 한 잔 하실래요? 너무 급하면 부담 안 가지셔도 되고요!",
      location: "cafe"
    },
    {
      type: "choice",
      question: "커피?",
      location: "cafe",
      options: [
        { label: "좋아요! 가보죠.", next: "scene_4", affection: +1 },
        { label: "짧게 한 잔 괜찮아요.", next: "scene_4" },
        { label: "사주시는 거죠? ㅎㅎ", next: "scene_4", affection: +1 }
      ]
    }
  ],

  scene_4: [
    {
      role: "npc",
      text: "여기 분위기 좋네요. 이런 시간 오랜만이에요.",
      location: "cafe"
    },
    {
      type: "choice",
      question: "뭐라고 할까요?",
      location: "cafe",
      options: [
        { label: "저도 좋아요, 편하네요.", next: "scene_5", affection: +1 },
        { label: "괜찮은 카페네요.", next: "scene_5" },
        { label: "잘 초대해주셨어요.", next: "scene_5", affection: +2 }
      ]
    }
  ],

  scene_5: [
    {
      role: "npc",
      text: "이제 집 가셔야 할 시간 아니에요? 제가 근처까지 같이 걸어드릴까요?",
      location: "home"
    },
    {
      type: "choice",
      question: "마무리 멘트!",
      location: "home",
      options: [
        { label: "같이 가요. 괜찮으시면.", next: "CHECK_END", affection: +2 },
        { label: "네, 조금만 같이 걸어요!", next: "CHECK_END", affection: +1 },
        { label: "아 오늘은 괜찮아요! 연락드릴게요 :)", next: "CHECK_END" }
      ]
    }
  ],

  end_A: [
    { role: "npc", text: "오늘 편했어요. 다음에 또 봐요!" },
    { type: "end" }
  ],
  end_B: [
    { role: "npc", text: "좋은 시간 감사해요. 조심히 들어가세요!" },
    { type: "end" }
  ],
  end_C: [
    { role: "npc", text: "연락은 계속해요 :)" },
    { type: "end" }
  ],
  end_D: [
    { role: "npc", text: "들어가셔서 쉬세요!" },
    { type: "end" }
  ]
};

export default INFP;
