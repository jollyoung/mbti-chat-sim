import { SCENE } from "../constants/sceneIDs";
import { LOCATION } from "../constants/locations";

const INFP = {
  [SCENE.CONTACT_DECISION]: [
    {
      type: "choice",
      question: "먼저 연락해볼까요?",
      options: [
        { label: "먼저 인사해보기", next: SCENE.CONTACT_START, tone: "Neutral", intent: "Self-disclosure" },
        { label: "상대가 먼저 연락오길 기다리기", next: SCENE.CONTACT_START, tone: "Neutral", intent: "Probing" }
      ]
    }
  ],

  [SCENE.CONTACT_START]: [
    { role: "npc", text: "안녕하세요! 소개받아서 연락드렸어요 :)", location: LOCATION.DEFAULT },
    {
      type: "choice",
      question: "답장을 보내볼까요?",
      options: [
        { label: "안녕하세요! 반가워요!", next: SCENE.MEETING_PLAN, tone: "Warm", intent: "Supportive" },
        { label: "소개받게 된 이유가 궁금하네요!", next: SCENE.MEETING_PLAN, tone: "Neutral", intent: "Probing" },
        { label: "오늘 일정 괜찮으세요?", next: SCENE.MEETING_PLAN, tone: "Dry", intent: "Probing" }
      ]
    }
  ],

  [SCENE.MEETING_PLAN]: [
    { role: "npc", text: "혹시 이번 주에 한 번 뵐까요?", location: LOCATION.DEFAULT },
    {
      type: "choice",
      options: [
        { label: "카페에서 차 한 잔 어떠세요?", next: SCENE.FIRST_MEET_CAFE, tone: "Warm", intent: "Supportive" },
        { label: "산책하면서 얘기해도 좋을 것 같아요!", next: SCENE.FIRST_MEET_STREET, tone: "Neutral", intent: "Probing" },
        { label: "편하신 데 알려주시면 맞출게요!", next: SCENE.FIRST_MEET_CAFE, tone: "Warm", intent: "Supportive" }
      ]
    }
  ],

  // 장소 선택 분기
  [SCENE.FIRST_MEET_CAFE]: [
    { role: "npc", text: "저 여기 도착했어요! 혹시 어디 계세요?", location: LOCATION.CAFE },
    {
      type: "choice",
      options: [
        { label: "저도 방금 도착했어요! 찾아갈게요 :)", next: SCENE.FIRST_CHAT, tone: "Warm", intent: "Supportive" },
        { label: "어디에 앉아계세요?", next: SCENE.FIRST_CHAT, tone: "Neutral", intent: "Probing" },
        { label: "잠시만요. 금방 갈게요.", next: SCENE.FIRST_CHAT, tone: "Dry", intent: "Self-disclosure" }
      ]
    }
  ],

  [SCENE.FIRST_MEET_STREET]: [
    { role: "npc", text: "저 여기 도착했어요! 혹시 어디 계세요?", location: LOCATION.STREET },
    {
      type: "choice",
      options: [
        { label: "저도 방금 도착했어요 :)", next: SCENE.FIRST_CHAT, tone: "Warm", intent: "Supportive" },
        { label: "혹시 어디 계신가요?", next: SCENE.FIRST_CHAT, tone: "Neutral", intent: "Probing" },
        { label: "잠시만요. 금방 갈게요.", next: SCENE.FIRST_CHAT, tone: "Dry", intent: "Self-disclosure" }
      ]
    }
  ],

  // 첫 대화
  [SCENE.FIRST_CHAT]: [
    { role: "npc", text: "오셨네요! 분위기 괜찮나요?", location: LOCATION.CAFE, delay: 1500 },
    { role: "player", text: "그러게요! 아늑하네요 :)", delay: 900 },
    { role: "npc", text: "제가 이런 조용한 카페 좋아하거든요.", delay: 1200 },
    { role: "player", text: "저도요! 편한 느낌!", delay: 900 },
    { role: "npc", text: "취향이 비슷하네요 😊", delay: 1000 },
    {
      type: "choice",
      question: "대화의 방향을 잡아볼까요?",
      options: [
        { label: "칭찬 중심으로!", tone: "Warm", intent: "Supportive", next: SCENE.BRIGHT_FLOW },
        { label: "상대에 대한 관심 위주!", tone: "Neutral", intent: "Probing", next: SCENE.CURIOUS_FLOW }
      ]
    }
  ],

  [SCENE.BRIGHT_FLOW]: [
    { role: "npc", text: "좋은 인연일지도 몰라요 :)" },
    { role: "player", text: "저도 같은 생각이에요!" },
    { next: SCENE.CURIOUS_FLOW }
  ],

  [SCENE.CURIOUS_FLOW]: [
    { role: "npc", text: "오늘 하루는 어떠셨어요?" },
    { role: "player", text: "지금은 즐겁네요!" },
    { next: SCENE.COMMON_AFTER_BRANCH }
  ],

  [SCENE.COMMON_AFTER_BRANCH]: [
    { role: "npc", text: "취미가 어떻게 되세요?" },
    {
      type: "choice",
      options: [
        { label: "카페 가는 거 좋아해요!", next: SCENE.INTEREST_DISCUSSION, tone: "Warm", intent: "Self-disclosure" },
        { label: "다양하게 시도 중이에요!", next: SCENE.INTEREST_DISCUSSION, tone: "Neutral", intent: "Self-disclosure" }
      ]
    }
  ],

  [SCENE.INTEREST_DISCUSSION]: [
    { role: "npc", text: "좋아하시는 것 있으세요?" },
    {
      type: "choice",
      options: [
        { label: "산책 좋아해요!", next: SCENE.VALUE_TALK, tone: "Warm", intent: "Self-disclosure" },
        { label: "아직 탐색 중이에요", next: SCENE.VALUE_TALK, tone: "Neutral", intent: "Self-disclosure" }
      ]
    }
  ],

  // 엔딩: 감정 톤은 하나, 하지만 과정은 다양
  [SCENE.VALUE_TALK]: [
    { role: "npc", text: "좋아요! 정말 대화 즐거웠어요." },
    {
      type: "choice",
      question: "마무리 인사해볼까요?",
      options: [
        { label: "오늘 즐거웠어요. 또 이야기해요 😊", next: null, tone: "Warm", intent: "Supportive" },
        { label: "연락해요!", next: null, tone: "Neutral", intent: "Supportive" },
        { label: "다음 기회에 또 봬요!", next: null, tone: "Dry", intent: "Supportive" }
      ]
    }
  ]
};

export default INFP;
