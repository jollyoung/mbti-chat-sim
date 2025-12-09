import { SCENE } from "../constants/sceneIDs";
import { LOCATION } from "../constants/locations";

const INFP = {
  
  // 00. 연락할지 말지 (silent)
  [SCENE.CONTACT_DECISION]: [
    {
      type: "choice",
      question: "먼저 연락해볼까요?",
      options: [
        {
          label: "먼저 연락하기",
          next: SCENE.CONTACT_START,
          silent: true,
          tone: "Neutral",
          intent: "Self-disclosure",
          actionText: (nickname) =>
            `안녕하세요! ${nickname} 통해 소개받은 ${nickname}이라고 합니다.\n반가워요`
        },
        {
          label: "상대 연락 기다리기",
          next: SCENE.CONTACT_START,
          silent: true,
          tone: "Neutral",
          intent: "Probing"
        }
      ]
    }
  ],


  // 01. 첫 연락
  [SCENE.CONTACT_START]: [
    { role: "npc", text: "안녕하세요, 지은이에요. 소개 받았어요 ㅎㅎ" },
    { role: "player", text: "반가워요. 퇴근하고 이제 좀 쉬시는 중이세요?" },
    { role: "npc", text: "네 ㅎㅎ 이제 막 집 들어왔어요" },
    
    {
      type: "choice",
      question: "대화를 어떻게 이어갈까?",
      options: [
        { label: "요즘 드라마 보세요?", next: SCENE.DAY1_INTEREST, tone: "Neutral", intent: "Probing" },
        { label: "카페 자주 가세요?", next: SCENE.DAY1_INTEREST, tone: "Neutral", intent: "Probing" }
      ]
    }
  ],


  // 02. 관심사 공감
  [SCENE.DAY1_INTEREST]: [
    { role: "npc", text: "가끔 집에서 드라마 보면서 쉬어요 ㅎㅎ 조용한 거 좋아해요" },
    { role: "player", text: "저도요. 차분하게 쉬는 게 제일 좋죠" },
    { role: "npc", text: "맞아요 ㅎㅎ" },

    {
      type: "choice",
      question: "어떻게 감정을 건드릴까?",
      options: [
        { label: "요즘 감정선 좋은 드라마 있어요", next: SCENE.DAY1_MEET_INVITE, tone: "Warm", intent: "Self-disclosure" },
        { label: "같이 카페 가면 좋을 것 같네요", next: SCENE.DAY1_MEET_INVITE, tone: "Warm", intent: "Supportive" }
      ]
    }
  ],


  // 03. 주말 만남 제안
  [SCENE.DAY1_MEET_INVITE]: [
    { role: "npc", text: "오 좋네요 그거 ㅎㅎ" },
    { role: "player", text: "이번 주말에 차 한잔 괜찮으세요?" },
    { role: "npc", text: "네 좋아요! 주말 괜찮아요" },
    
    { next: SCENE.DAY2_CHEER }
  ],


  // 04. 다음날 톤 확인
  [SCENE.DAY2_CHEER]: [
    { role: "npc", text: "출근하셨어요? 오늘 너무 힘들지 않으셨으면 좋겠어요" },
    { role: "player", text: "파이팅입니다. 오늘도 무사히 끝나길" },
    { role: "npc", text: "감사해요 ㅎㅎ" },

    { next: SCENE.FIRST_MEET }
  ],


  // 05. 첫 데이트 — 카페
  [SCENE.FIRST_MEET]: [
    { role: "npc", location: LOCATION.CAFE, text: "오다가 괜찮으셨어요?" },
    { role: "player", text: "네, 금방 왔어요. 분위기 좋네요" },
    { role: "npc", text: "저도 여기 좋아해요 ㅎㅎ 자리에 앉아요" },
    
    {
      type: "choice",
      question: "대화를 어떻게 깊여갈까?",
      options: [
        { label: "요즘 어떤 책 좋아하세요?", next: SCENE.EMOTION_SHARE, tone: "Neutral", intent: "Probing" },
        { label: "취향이 궁금한데요", next: SCENE.EMOTION_SHARE, tone: "Warm", intent: "Supportive" }
      ]
    }
  ],


  // 06. 감정 교류
  [SCENE.EMOTION_SHARE]: [
    { role: "npc", text: "대화 잘 통하면 기분 좋지 않아요? 저는 그런 거 좋아하거든요" },
    { role: "player", text: "저도 그래요. 마음 편한 대화 좋은 것 같아요" },
    
    {
      type: "choice",
      question: "가치관을 어떻게 연결할까?",
      options: [
        { label: "오늘 이야기 즐거웠어요", next: SCENE.VALUE_DEEPEN, tone: "Warm", intent: "Supportive" },
        { label: "어떤 순간이 행복하세요?", next: SCENE.VALUE_DEEPEN, tone: "Neutral", intent: "Probing" }
      ]
    }
  ],


  // 07. 가치관 심화
  [SCENE.VALUE_DEEPEN]: [
    { role: "npc", text: "제 이야기 들어주는 사람 만나면 행복해요" },
    { role: "player", text: "오늘 그런 시간이었으면 좋겠네요" },
    { role: "npc", text: "저도요 ㅎㅎ" },

    {
      type: "choice",
      question: "다음 단계?",
      options: [
        { label: "다음에 또 봐요", next: SCENE.ENDING_ONE, tone: "Warm", intent: "Supportive" },
        { label: "편한 시간에 알려주세요", next: SCENE.ENDING_ONE, tone: "Neutral", intent: "Supportive" }
      ]
    }
  ],


  // 08. 엔딩 (단일 엔딩)
  [SCENE.ENDING_ONE]: [
    { role: "npc", text: "오늘 와주셔서 감사합니다. 조심히 들어가세요" }
  ]
};

export default INFP;
