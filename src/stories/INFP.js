import { SCENE } from "../constants/sceneIDs";
import { LOCATION } from "../constants/locations";

const INFP = {

  // 00. 프로필 소개 (프롤로그)
  [SCENE.PROLOGUE]: [
    {
      role: "system",
      systemType: "notice",
      delay: 1500,
      text:
        "✨ 오늘의 매칭 상대 프로필\n\n" +
        "이름: 서지은\n" +
        "성향: INFP\n\n" +
        "차분한 분위기를 선호하며\n" +
        "대화는 서서히 편해지는 타입입니다.\n\n" +
        "회사 업무 특성상 퇴근 시간이 일정하지 않을 수 있고,\n" +
        "퇴근 후에는 가볍고 부담 없는 대화를 편안하게 느끼는 편입니다.\n\n" +
        "일상 이야기나 취향에 관한 대화를 좋아하며,\n" +
        "조용한 공간에서의 만남을 선호하는 편입니다."
    },
    { next: SCENE.CONTACT_DECISION }
  ],

  // 00. 연락할지 말지
  [SCENE.CONTACT_DECISION]: [
    {
      type: "choice",
      question: "지은 씨에게 먼저 연락해볼까?",
      options: [
        {
          label: "먼저 연락하기",
          silent: true,
          tone: "neutral",
          intent: "engaged",
          next: SCENE.CONTACT_START,
          actionText: (nickname) =>
            `안녕하세요. 연우씨 통해 소개받은 ${nickname}입니다 :)`
        },
        {
          label: "기다리기",
          silent: true,
          tone: "neutral",
          intent: "rapport",
          next: SCENE.CONTACT_START
        }
      ]
    }
  ],

  // 01. 첫 메시지
  [SCENE.CONTACT_START]: [
    { role: "npc", text: "안녕하세요. 소개 받기로 한 서지은입니다 :)" },
    { role: "npc", text: "지금 일이 끝나서 늦게 답장드려서 죄송해요" },

    { role: "player", text: "지금 퇴근하신 거면 오늘 많이 바쁘셨나 봐요" },
    { role: "npc", text: "오늘 잔업이 조금 있어서 퇴근이 늦어졌네요" },

    {
      type: "choice",
      question: "약속을 어떻게 잡아볼까?",
      options: [
        {
          label: "퇴근 시간 먼저 여쭤보기",
          silent: true,
          tone: "neutral",
          intent: "engaged",
          next: SCENE.CONTACT_SCHEDULING
        },
        {
          label: "지은씨 의견 기다리기",
          silent: true,
          tone: "warm",
          intent: "rapport",
          next: SCENE.CONTACT_SCHEDULING_WAIT
        }
      ]
    }
  ],

  // 02A. 유저가 먼저 약속 조율
  [SCENE.CONTACT_SCHEDULING]: [
    { role: "player", text: "평소엔 몇 시쯤 퇴근하세요?" },
    { role: "npc", text: "보통 6시쯤이요! 오늘만 조금 늦었어요" },

    { 
      role: "player", 
      text: "그럼 제가 회사 근처에 괜찮은 식당 하나 찾아볼게요. 괜찮으세요?" 
    },
    { role: "npc", text: "네 좋죠. 그렇게 해주시면 저야 감사하죠." },

    { next: SCENE.DINNER_MEET }
  ],

  // 02B. NPC가 시간 제안
  [SCENE.CONTACT_SCHEDULING_WAIT]: [
    { role: "npc", text: "제가 내일까지는 조금 늦게 끝날 것 같고…" },
    { role: "npc", text: "목요일 저녁 괜찮으실까요?" },
    { role: "player", text: "좋아요. 6시 반쯤 괜찮으세요?" },
    { role: "npc", text: "네! 그 시간 좋아요" },
    { role: "player", text: "혹시 가고 싶은 식당 있으세요? 아니면 제가 찾아볼까요?" },
    { role: "npc", text: "저희 회사 근처면 괜찮은 파스타 집이 있어요." },
    { role: "npc", text: "거기 분위기도 조용하고 좋더라고요." },
    { role: "npc", text: "양식 괜찮으시면 그쪽으로 가볼까요?" },
    { role: "player", text: "네, 좋아요!" },

    { next: SCENE.DINNER_MEET }
  ],

  // 03. 저녁 식사 도착
  [SCENE.DINNER_MEET]: [
    {
      role: "npc",
      location: LOCATION.RESTAURANT,
      text: "오셨네요! 찾기 어렵진 않으셨어요?"
    },
    { role: "player", text: "괜찮았어요. 분위기 좋은 곳이네요." },
    { role: "npc", text: "편하게 앉으세요. 메뉴도 같이 골라요." },

    { next: SCENE.DINNER_TALK }
  ],

  // 04. 저녁 대화
  [SCENE.DINNER_TALK]: [
    { role: "npc", text: "여기 파스타가 맛있어요." },
    { role: "npc", text: "어떤 파스타 좋아하세요?" },
    { role: "player", text: "저는 알리오올리오 좋아해요." },
    { role: "npc", text: "오 저도요! 그러면 그걸로 2개 주문할게요 ㅎㅎ" },

    {
      type: "choice",
      question: "어떤 분위기로 대화를 이어갈까?",
      options: [
        {
          label: "취향 맞춰주기",
          silent: true,
          tone: "warm",
          intent: "rapport",
          next: SCENE.DINNER_FLOW
        },
        {
          label: "가벼운 농담 섞기",
          silent: true,
          tone: "playful",
          intent: "friendly",
          next: SCENE.DINNER_FLOW
        },
        {
          label: "INFP의 감성 엉뚱함 끌어내기",
          silent: true,
          tone: "neutral",
          intent: "explore",
          next: SCENE.DINNER_INFP_MOMENT
        }
      ]
    }
  ],

  // 04-A: 자연스럽게 이어지는 저녁 대화
  [SCENE.DINNER_FLOW]: [
    { role: "npc", text: "평소엔 외식 자주 하세요?" },
    { role: "player", text: "가끔이요. 분위기 좋은 데 좋아해요." },
    { role: "npc", text: "저도요. 조용하면 괜히 마음 편해지고요." },

    {
      role: "system",
      text: "지은이와의 대화가 자연스럽게 이어지고 있다 (+2)"
    },

    { next: SCENE.CAFE_MOVE }
  ],

  // 04-B: INFP 엉뚱 모먼트
  [SCENE.DINNER_INFP_MOMENT]: [
    { role: "player", text: "지은씨는 식당 어떻게 골라요? 계획형이에요? 즉흥형이에요?" },
    { role: "npc", text: "완전 즉흥형이에요. 사실… 이 가게도 간판 색깔 보고 들어왔다가 찾았어요."},
    { role: "player", text: "간판 색깔을요?" },
    { role: "npc", text: "네… 비오는 날이었는데, 뭔가 간판 색깔이 따뜻해 보여서 끌리더라구요 ㅎㅎ" },

    {
      role: "system",
      text: "지은의 은은한 감성이 드러났다 (+3)"
    },

    { next: SCENE.CAFE_MOVE }
  ],

  // 05. 식사 후 카페 이동
  [SCENE.CAFE_MOVE]: [
    { role: "player", text: "식사 맛있었어요. 근처에 예쁜 카페 하나 있던데 가볼까요?" },
    { role: "npc", text: "좋아요! 예쁜 카페 가는 거 좋아해요 :)" },

    { 
      role: "system",
      text: "조용한 분위기로 자연스럽게 이동했다 (+2)" 
    },

    { next: SCENE.CAFE_TALK }
  ],

  // 06. 카페 대화
  [SCENE.CAFE_TALK]: [
    {
      role: "npc",
      location: LOCATION.CAFE,
      text: "조용하면서 잔잔하게 예쁜 곳이네요. 이런 분위기 좋아하세요?"
    },
    { role: "player", text: "네. 대화하기 편하고요." },
    { role: "npc", text: "저는 조용한 카페 오면 생각이 정리되는 느낌이 있어요." },

    {
      type: "choice",
      question: "대화를 어떻게 이어갈까?",
      options: [
        {
          label: "지은의 감성에 공감하기",
          tone: "warm",
          intent: "rapport",
          next: SCENE.CAFE_FLOW
        },
        {
          label: "지은의 감성 언어를 더 끌어내기",
          tone: "neutral",
          intent: "explore",
          next: SCENE.CAFE_INFP_MOMENT
        }
      ]
    }
  ],

  // 06-A: 자연스러운 카페 대화
  [SCENE.CAFE_FLOW]: [
    { role: "npc", text: "주말엔 뭐 하면서 쉬세요?" },
    { role: "player", text: "산책하거나 카페 가요. 조용한 데 좋아해서요." },
    { role: "npc", text: "저랑 비슷하시네요. 그런 시간 좋아요." },

    {
      role: "system",
      text: "대화가 한층 편안해졌다 (+2)"
    },

    { next: SCENE.WALK_SUGGEST }
  ],

  // 06-B: 카페 INFP 엉뚱 모먼트
  [SCENE.CAFE_INFP_MOMENT]: [
    { role: "player", text: "생각 정리된다는 느낌은 어떤 건데요?" },
    { role: "npc", text: "음… 머릿속이 잠깐 멈췄다가 다시 켜지는 느낌? 말하면서도 조금 이상하긴 한데요." },
    { role: "player", text: "아뇨, 그런 표현 좋은데요." },
    { role: "npc", text: "저도 정확한 단어 없을 때 그냥 느낌으로 말하게 돼요." },

    {
      role: "system",
      text: "지은의 내적 감성이 은은하게 드러났다 (+3)"
    },

    { next: SCENE.WALK_SUGGEST }
  ],

  // 07. 산책 제안
  [SCENE.WALK_SUGGEST]: [
    { role: "player", text: "근처에 조용한 길 있던데 잠깐 걸을까요?" },
    { role: "npc", text: "좋아요. 너무 멀지만 않으면 괜찮아요." },

    { 
      role: "system",
      text: "차분하고 자연스러운 분위기로 이어진다 (+2)"
    },

    { next: SCENE.WALK_TALK }
  ],

  // 08. 산책 대화
  [SCENE.WALK_TALK]: [
    { role: "npc", text: "이 길 좋네요. 생각보다 한적해요." },
    { role: "player", text: "그러게요. 산책하기 좋네요." },
    { role: "npc", text: "가끔 이런 시간 보내면 하루가 조금 정리되는 것 같아요." },

    {
      role: "npc",
      text: "저는 산책할 때 가끔 ‘이 장면에 음악 깔리면 어떨까’ 이런 생각도 해요."
    },

    {
      type: "choice",
      question: "지은의 말에 어떻게 반응할까?",
      options: [
        {
          label: "가볍게 공감하기",
          tone: "warm",
          intent: "rapport",
          next: SCENE.ENDING_ONE
        },
        {
          label: "어떤 음악일 것 같은지 물어보기",
          tone: "neutral",
          intent: "explore",
          next: SCENE.ENDING_ONE
        }
      ]
    }
  ],

  // 09. 마무리
  [SCENE.ENDING_ONE]: [
    { role: "npc", text: "오늘 좋은 시간이었어요. 조심히 들어가세요 :)" },
    {
      type: "choice",
      question: "마무리 인사",
      options: [
        { label: "저도 즐거웠습니다. 연락드릴게요", tone: "warm", intent: "friendly", next: null },
        { label: "오늘 감사합니다. 잘 들어가세요", tone: "neutral", intent: "rapport", next: null }
      ]
    }
  ]

};

export default INFP;
