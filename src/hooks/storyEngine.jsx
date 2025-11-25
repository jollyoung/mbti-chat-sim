import baseScenario from "../story/base/baseScenario.js";
import ESTJ from "../story/ESTJ.js";
import INFP from "../story/INFP.js";
// ... MBTI 16개 파일 import

export const storyTable = {
  INFP,
  INFJ,
  INTJ,
  INTP,
  ISFP,
  ISFJ,
  ISTP,
  ISTJ,
  ENFP,
  ENFJ,
  ENTP,
  ENTJ,
  ESFP,
  ESFJ,
  ESTP,
  ESTJ,

  // 없는 MBTI는 자동으로 baseScenario 사용하도록 fallback
  DEFAULT: baseScenario
};
