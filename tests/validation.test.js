import test from "node:test";
import assert from "node:assert/strict";
import { findMissingEnv, validateChoicePayload, validateSessionEndPayload } from "../api/utils/validation.js";

const cleanEnv = {
  GCP_PROJECT_ID: "project",
  GCP_PRIVATE_KEY: "key",
  GCP_CLIENT_EMAIL: "email",
  SHEET_ID: "sheet",
};

test("findMissingEnv returns empty array when all variables exist", () => {
  assert.deepEqual(findMissingEnv(cleanEnv), []);
});

test("findMissingEnv reports missing variables", () => {
  const missing = findMissingEnv({ ...cleanEnv, SHEET_ID: "" });
  assert.deepEqual(missing, ["SHEET_ID"]);
});

test("validateChoicePayload requires mbti, scene, and userChoice", () => {
  const { error } = validateChoicePayload({ mbti: "INFP" });
  assert.equal(error, "mbti, scene, and userChoice are required.");
});

test("validateChoicePayload normalizes optional fields and timestamp", () => {
  const { data, error } = validateChoicePayload({
    mbti: "INFP",
    scene: "intro",
    userChoice: "Hi",
  });
  assert.equal(error, undefined);
  assert.equal(data.tone, null);
  assert.equal(data.intent, null);
  assert.equal(typeof data.timestamp, "number");
});

test("validateSessionEndPayload requires sessionId and mbti", () => {
  const { error } = validateSessionEndPayload({ sessionId: "123" });
  assert.equal(error, "sessionId and mbti are required.");
});

test("validateSessionEndPayload returns server timestamp", () => {
  const { data } = validateSessionEndPayload({ sessionId: "123", mbti: "INTJ" });
  assert.equal(data.sessionId, "123");
  assert.equal(data.mbti, "INTJ");
  assert.equal(typeof data.endedAt, "number");
});
