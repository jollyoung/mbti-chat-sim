export const REQUIRED_ENV_VARS = [
  "GCP_PROJECT_ID",
  "GCP_PRIVATE_KEY",
  "GCP_CLIENT_EMAIL",
  "SHEET_ID"
];

export function findMissingEnv(env = process.env) {
  return REQUIRED_ENV_VARS.filter((key) => !env[key]);
}

export function validateChoicePayload(body = {}) {
  const { mbti, scene, userChoice, tone = null, intent = null, sex = null, age = null } = body;

  if (!mbti || !scene || !userChoice) {
    return { error: "mbti, scene, and userChoice are required." };
  }

  return {
    data: {
      mbti,
      scene,
      userChoice,
      tone,
      intent,
      timestamp: Date.now(),
      sessionId: body.sessionId || null,
      step: body.step ?? null,
      next_exists: body.next_exists ?? null,
      drop: body.drop ?? null,
      sex: body.sex || null,
      age: body.age || null,
    }
  };
}

export function validateSessionEndPayload(data) {
  if (!data.sessionId) {
    return { error: "sessionId required" };
  }
  if (!data.mbti) {
    return { error: "mbti required" };
  }
  if (!data.endedAt) {
    return { error: "endedAt required" };
  }
  return { data };
}

