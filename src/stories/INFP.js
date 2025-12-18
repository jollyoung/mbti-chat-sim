import { SCENE } from "../constants/sceneIDs";
import { LOCATION } from "../constants/locations";

const INFP = {

  /* =========================
     00. NPC 프로필 (객관 정보)
     ========================= */
  [SCENE.PROLOGUE]: [
    {
      role: "system",
      systemType: "notice",
      delay: 1200,
      text:
        "매칭 상대 정보\n\n" +
        "서지은 · INFP\n\n" +
        "직업: 회사원(사무직)\n" +
        "업무: 야근/추가 업무가 가끔 있어 \n   퇴근 시간이 유동적일 수 있음\n" +
        "연락: 업무 중 답장이 느릴 수 있음\n" +
        "만남: 시끄러운 곳보단 조용한 공간 선호(카페/산책 등)\n" +
        "스타일: 단정한 캐주얼 (무채색/베이지 톤 선호)\n"
    },
    { next: SCENE.CONTACT_DECISION }
  ],

  /* =========================
     01. 연락 여부 선택
     ========================= */
  [SCENE.CONTACT_DECISION]: [
    {
      type: "choice",
      question: "어떻게 연락을 시작할까?",
      options: [
        {
          label: "먼저 인사한다",
          silent: true,
          tone: "neutral",
          intent: "engaged",
          actionText: (nickname) =>
            `안녕하세요. 연우 씨 통해 소개받은 ${nickname}입니다 :)`,
          next: SCENE.CONTACT_START_SELF
        },
        {
          label: "상대의 연락을 기다린다",
          silent: true,
          tone: "neutral",
          intent: "rapport",
          next: SCENE.CONTACT_START_NPC
        }
      ]
    }
  ],

  /* =========================
     02-A. 유저가 먼저 연락
     ========================= */
  [SCENE.CONTACT_START_SELF]: [
    { role: "npc", delay: 800, text: "안녕하세요! 연락 주셔서 감사해요." },
    { role: "npc", delay: 700, text: "소개 받기로 한 서지은입니다 :)" },
    { next: SCENE.CONTACT_START_COMMON }
  ],

  /* =========================
     02-B. NPC가 먼저 연락
     ========================= */
  [SCENE.CONTACT_START_NPC]: [
    {
      role: "npc",
      delay: 900,
      text: "안녕하세요. 연우 씨 통해 연락처 받았어요."
    },
    {
      role: "npc",
      delay: 700,
      text: "괜찮으실 때 편하게 연락 주셔도 될 것 같아요 :)"
    },
    { next: SCENE.CONTACT_START_COMMON }
  ],

  /* =========================
     03. 공통 첫 대화
     ========================= */
  [SCENE.CONTACT_START_COMMON]: [
    {
      role: "npc",
      delay: 900,
      text: "오늘 일이 조금 늦게 끝나서 답장이 늦었어요."
    },

    {
      type: "choice",
      question: "어떤 식으로 대화를 이어갈까?",
      options: [
        {
          label: "오늘 일정이 어땠는지 묻는다",
          silent: true,
          tone: "neutral",
          intent: "engaged",
          actionText: () => "오늘 많이 바쁘셨나 봐요.",
          next: SCENE.CONTACT_SCHEDULING
        },
        {
          label: "상대 일정에 맞추겠다고 말한다",
          silent: true,
          tone: "warm",
          intent: "rapport",
          actionText: () =>
            "편하실 때 이야기해주셔도 괜찮아요. 일정 맞출게요.",
          next: SCENE.CONTACT_SCHEDULING_WAIT
        }
      ]
    }
  ],

  /* =========================
     04-A. 유저 주도 일정 조율
     ========================= */
  [SCENE.CONTACT_SCHEDULING]: [
    { role: "npc", delay: 800, text: "네, 오늘은 조금 바빴어요." },
    { role: "npc", delay: 700, text: "보통은 6시쯤 퇴근해요." },

    { role: "user", delay: 600, text: "그럼 회사 근처에서 저녁 어떠세요?" },
    { role: "npc", delay: 700, text: "네, 괜찮을 것 같아요." },

    { next: SCENE.DINNER_MEET }
  ],

  /* =========================
     04-B. NPC가 일정 제안
     ========================= */
  [SCENE.CONTACT_SCHEDULING_WAIT]: [
    { role: "npc", delay: 800, text: "제가 내일까지는 조금 늦을 것 같고…" },
    { role: "npc", delay: 700, text: "목요일 저녁은 괜찮으실까요?" },
    { role: "user", delay: 600, text: "네, 그날 좋아요." },

    {
      role: "npc",
      delay: 700,
      text: "회사 근처에 조용한 파스타집이 하나 있어요."
    },
    { role: "npc", delay: 600, text: "거기로 가볼까요?" },

    { next: SCENE.DINNER_MEET }
  ],

  /* =========================
     05. 저녁 식사
     ========================= */
  [SCENE.DINNER_MEET]: [
    {
      role: "npc",
      location: LOCATION.RESTAURANT,
      delay: 900,
      text: "오셨네요. 찾기 어렵진 않으셨어요?"
    },
    { role: "user", delay: 600, text: "괜찮았어요." },
    { role: "npc", delay: 700, text: "편하게 앉으세요." },

    { next: SCENE.DINNER_TALK }
  ],

  /* =========================
     06. 저녁 대화 분기
     ========================= */
  [SCENE.DINNER_TALK]: [
    {
      role: "npc",
      delay: 800,
      text: "여기 파스타가 맛있다고 해서 자주 와요."
    },

    {
      type: "choice",
      question: "대화를 어떻게 이어갈까?",
      options: [
        {
          label: "취향이 비슷한지 이야기한다",
          silent: true,
          tone: "warm",
          intent: "rapport",
          actionText: () => "분위기 조용한 곳 좋아하세요?",
          next: SCENE.DINNER_FLOW
        },
        {
          label: "가게를 고른 이유를 묻는다",
          silent: true,
          tone: "neutral",
          intent: "explore",
          actionText: () => "이 가게는 어떻게 알게 되셨어요?",
          next: SCENE.DINNER_INFP_MOMENT
        }
      ]
    }
  ],

  [SCENE.DINNER_FLOW]: [
    { role: "npc", delay: 700, text: "네, 시끄러운 곳은 조금 피하게 돼요." },
    { role: "npc", delay: 600, text: "이런 분위기가 편하더라고요." },
    { next: SCENE.CAFE_MOVE }
  ],

  [SCENE.DINNER_INFP_MOMENT]: [
    {
      role: "npc",
      delay: 800,
      text: "사실… 간판 색이 마음에 들어서 들어와 봤어요."
    },
    {
      role: "npc",
      delay: 700,
      text: "이상하긴 한데, 그런 기준이 생기더라고요."
    },
    { next: SCENE.CAFE_MOVE }
  ],

  /* =========================
     07. 카페 이동
     ========================= */
  [SCENE.CAFE_MOVE]: [
    { role: "user", delay: 600, text: "근처에 카페 하나 들를까요?" },
    { role: "npc", delay: 700, text: "네, 좋아요." },
    { next: SCENE.CAFE_TALK }
  ],

  /* =========================
     08. 카페 대화
     ========================= */
  [SCENE.CAFE_TALK]: [
    {
      role: "npc",
      location: LOCATION.CAFE,
      delay: 900,
      text: "이런 조용한 카페 좋아해요."
    },
    {
      type: "choice",
      question: "지은의 말에 어떻게 반응할까?",
      options: [
        {
          label: "공감한다",
          tone: "warm",
          intent: "rapport",
          next: SCENE.WALK_SUGGEST
        },
        {
          label: "이유를 더 묻는다",
          tone: "neutral",
          intent: "explore",
          next: SCENE.WALK_SUGGEST
        }
      ]
    }
  ],

  /* =========================
     09. 산책 & 마무리
     ========================= */
  [SCENE.WALK_SUGGEST]: [
    { role: "user", delay: 600, text: "잠깐 산책할까요?" },
    { role: "npc", delay: 700, text: "네, 괜찮아요." },
    { next: SCENE.ENDING_ONE }
  ],

  [SCENE.ENDING_ONE]: [
    { role: "npc", delay: 800, text: "오늘 시간 괜찮았어요." },
    {
      type: "choice",
      question: "마무리 인사",
      options: [
        {
          label: "저도 즐거웠어요. 연락드릴게요",
          tone: "warm",
          intent: "friendly",
          next: null
        },
        {
          label: "오늘 감사합니다. 조심히 들어가세요",
          tone: "neutral",
          intent: "rapport",
          next: null
        }
      ]
    }
  ]
};

export default INFP;
