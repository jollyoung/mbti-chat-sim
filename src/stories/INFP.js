import { SCENE } from "../constants/sceneIDs";
import { LOCATION } from "../constants/locations";

const INFP = {
  [SCENE.CONTACT_DECISION]: [
    {
      type: "choice",
      location: LOCATION.DEFAULT,
      question: "먼저 연락해볼까요?",
      options: [
        {
          label: "먼저 인사해보기",
          next: SCENE.CONTACT_START,
          tone: "Neutral",
          intent: "Self-disclosure"
        },
        {
          label: "상대가 먼저 연락오길 기다리기",
          next: SCENE.CONTACT_START,
          tone: "Neutral",
          intent: "Probing"
        }
      ]
    }
  ],

  [SCENE.CONTACT_START]: [
    {
      role: "npc",
      location: LOCATION.DEFAULT,
      text: "안녕하세요! 소개받아서 연락드렸어요 :)",
    },
    {
      type: "choice",
      question: "답장을 보내볼까요?",
      options: [
        {
          label: "안녕하세요! 반가워요!",
          next: SCENE.MEETING_PLAN,
          tone: "Warm",
          intent: "Supportive"
        },
        {
          label: "소개받게 된 이유가 궁금하네요!",
          next: SCENE.MEETING_PLAN,
          tone: "Neutral",
          intent: "Probing"
        },
        {
          label: "오늘 일정 괜찮으세요?",
          next: SCENE.MEETING_PLAN,
          tone: "Dry",
          intent: "Probing"
        }
      ]
    }
  ],

  [SCENE.MEETING_PLAN]: [
    {
      role: "npc",
      location: LOCATION.DEFAULT,
      text: "혹시 이번 주에 한 번 뵐까요?",
    },
    {
      type: "choice",
      question: "어디가 편하신가요?",
      options: [
        {
          label: "카페에서 차 한 잔 어떠세요?",
          next: SCENE.FIRST_MEET_CAFE,
          tone: "Warm",
          intent: "Supportive"
        },
        {
          label: "산책하면서 얘기해도 좋을 것 같아요!",
          next: SCENE.FIRST_MEET_STREET,
          tone: "Neutral",
          intent: "Probing"
        },
        {
          label: "편하신 데 알려주시면 맞출게요!",
          next: SCENE.FIRST_MEET_CAFE,
          tone: "Warm",
          intent: "Supportive"
        }
      ]
    }
  ],

  // 🏡 장소 분기 된 scene들
  [SCENE.FIRST_MEET_CAFE]: [
    {
      role: "npc",
      location: LOCATION.CAFE,
      text: "저 여기 도착했어요! 혹시 어디 계세요?",
    },
    {
      type: "choice",
      question: "어떻게 응대할까요?",
      options: [
        {
          label: "저도 방금 도착했어요! 바로 찾아갈게요 :)",
          next: SCENE.FIRST_CHAT,
          tone: "Warm",
          intent: "Supportive"
        },
        {
          label: "어디에 앉아계세요? 바로 갈게요!",
          next: SCENE.FIRST_CHAT,
          tone: "Neutral",
          intent: "Probing"
        },
        {
          label: "잠시만요. 금방 갈게요.",
          next: SCENE.FIRST_CHAT,
          tone: "Dry",
          intent: "Self-disclosure"
        }
      ]
    }
  ],

  [SCENE.FIRST_MEET_STREET]: [
    {
      role: "npc",
      location: LOCATION.STREET,
      text: "저 여기 도착했어요! 혹시 어디 계세요?",
    },
    {
      type: "choice",
      question: "어떻게 응대할까요?",
      options: [
        {
          label: "저도 방금 도착했어요! 바로 찾아갈게요 :)",
          next: SCENE.FIRST_CHAT,
          tone: "Warm",
          intent: "Supportive"
        },
        {
          label: "혹시 어디 계신가요?",
          next: SCENE.FIRST_CHAT,
          tone: "Neutral",
          intent: "Probing"
        },
        {
          label: "잠시만요. 금방 갈게요.",
          next: SCENE.FIRST_CHAT,
          tone: "Dry",
          intent: "Self-disclosure"
        }
      ]
    }
  ],

  [SCENE.FIRST_CHAT]: [
    {
      role: "npc",
      location: LOCATION.CAFE,
      text: "오셨네요! 생각보다 분위기 괜찮지 않나요?",
    },
    {
      role: "player",
      text: "그러게요! 은근히 아늑한 느낌이에요 :)",
    },
    {
      role: "npc",
      text: "제가 이런 조용한 카페를 좋아하거든요. 너무 시끄러운 곳은 곤란해서.",
    },
    {
      role: "player",
      text: "저도 그래요! 사람 많은 곳 보다, 이런 곳이 더 편해요.",
    },
    {
      role: "npc",
      text: "오! 취향이 비슷하네요? 소개해준 친구한테 고마워해야겠어요. 😄",
    },
    {
      type: "choice",
      question: "대화의 방향을 정해볼까요?",
      options: [
        {
          label: "조금 더 밝고 칭찬 중심으로 이어가기",
          tone: "Warm",
          intent: "Supportive",
          next: SCENE.BRIGHT_FLOW
        },
        {
          label: "상대에 대한 관심 중심으로 이어가기",
          tone: "Neutral",
          intent: "Probing",
          next: SCENE.CURIOUS_FLOW
        }
      ]
    }
  ],

  [SCENE.BRIGHT_FLOW]: [
    {
      role: "npc",
      text: "맞아요. 좋은 인연 같아요! 오늘 기분이 좋네요."
    },
    {
      role: "player",
      text: "저도요! 좋은 첫 인상이네요 :)",
    },
    {
      next: SCENE.CURIOUS_FLOW
    }
  ],

  [SCENE.CURIOUS_FLOW]: [
    {
      role: "npc",
      text: "관심 가져주셔서 감사해요! 오늘 어떠셨어요? 바쁘지 않으셨어요?"
    },
    {
      role: "player",
      text: "조금 정신 없는 날이었는데, 지금은 여유롭네요!"
    },
    {
      next: SCENE.COMMON_AFTER_BRANCH
    }
  ],

  [SCENE.COMMON_AFTER_BRANCH]: [
    {
      role: "npc",
      text: "혹시 좋아하시는 취미 있어요? 저는 일기 쓰는 걸 좋아해요."
    },
    {
      type: "choice",
      options: [
        {
          label: "일기라니 멋져요! 저도 궁금해요",
          next: SCENE.INTEREST_DISCUSSION,
          tone: "Warm",
          intent: "Supportive"
        },
        {
          label: "와.. 어떤 걸 기록하세요?",
          next: SCENE.INTEREST_DISCUSSION,
          tone: "Neutral",
          intent: "Probing"
        }
      ]
    }
  ],
  

  [SCENE.INTEREST_DISCUSSION]: [
    {
      role: "npc",
      location: LOCATION.DEFAULT,
      text: "혹시 좋아하시는 것 있나요? 취미 같은 거요!",
    },
    {
      type: "choice",
      question: "어떤 취미인지?",
      options: [
        {
          label: "저는 산책하거나 카페 가는 걸 좋아해요! 편해지더라고요",
          next: SCENE.VALUE_TALK,
          tone: "Warm",
          intent: "Self-disclosure"
        },
        {
          label: "요즘은 이것저것 다양하게 해보고 있어요!",
          next: SCENE.VALUE_TALK,
          tone: "Neutral",
          intent: "Self-disclosure"
        },
        {
          label: "아직 취미를 정하지는 못했어요.",
          next: SCENE.VALUE_TALK,
          tone: "Dry",
          intent: "Self-disclosure"
        }
      ]
    }
  ],

  [SCENE.VALUE_TALK]: [
    {
      role: "npc",
      location: LOCATION.DEFAULT,
      text: "좋아요! 그런 취향 멋져요. 저는 가끔 스스로 생각 정리하는 걸 좋아해요.",
    },
    {
      type: "choice",
      question: "대화를 이어갑니다",
      options: [
        {
          label: "혼자만의 시간도 필요한 것 같아요. 공감돼요!",
          next: null,
          tone: "Warm",
          intent: "Supportive"
        },
        {
          label: "어떤 생각들을 정리하시나요?",
          next: null,
          tone: "Neutral",
          intent: "Probing"
        },
        {
          label: "저는 사람 만나는 게 더 편한 편이에요.",
          next: null,
          tone: "Dry",
          intent: "Self-disclosure"
        }
      ]
    }
  ]
};

export default INFP;
