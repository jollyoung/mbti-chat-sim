export const SCENE = {
  CONTACT_DECISION: "scene_contact_decision", // scene_0: 먼저 연락할지?
  CONTACT_START: "scene_contact_start",       // scene_1 or scene_1_1: 인사 주고받기
  MEETING_PLAN: "scene_meeting_plan",         // scene_2: 언제/어디서 만날지
  FIRST_MEET_CAFE: "scene_first_meet_cafe",   // scene_4~5: 도착/첫 인사 준비
  FIRST_MEET_STREET: "scene_first_meet_street", // scene_4_1~5_1: 도착/첫 인사 준비 (야외)
  FIRST_CHAT: "scene_first_chat",             // scene_6: 첫 대화
  BRIGHT_FLOW: "scene_bright_flow",           // scene_7: 밝고 칭찬 중심 대화
  CURIOUS_FLOW: "scene_curious_flow",       // scene_7_1: 호기심 질문 중심 대화
  COMMON_AFTER_BRANCH: "scene_common_after_branch", // scene_7_2: 분기 후 공통 대화
  INTEREST_DISCUSSION: "scene_interest_discussion", // scene_7: 취향 탐색
  VALUE_TALK: "scene_value_talk",              // scene_8: 가치관 얘기 시작
  END_A: "end_A",                           // 해피엔딩
  END_B: "end_B",                           // 세미해피엔딩
  END_C: "end_C",                           // 뉴트럴엔딩
  END_D: "end_D"                            // 배드엔딩
};
