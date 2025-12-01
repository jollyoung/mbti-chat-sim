import {
  appendRow,
  createSheetsClient,
  ensureEnvironment,
  ensureSheetExists,
} from "./utils/sheets.js";
import { validateChoicePayload } from "./utils/validation.js";

const rateLimitMap = new Map();
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (Array.isArray(forwarded)) return forwarded[0];
  if (typeof forwarded === "string") return forwarded.split(",")[0];
  return req.socket?.remoteAddress || "unknown";
}

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, start: now };

  if (now - entry.start > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return false;
  }

  entry.count += 1;
  rateLimitMap.set(ip, entry);

  return entry.count > RATE_LIMIT_MAX;
}

function enforceApiKey(req) {
  const expectedKey = process.env.API_SECRET_KEY;
  if (!expectedKey) return true;

  const providedKey = req.headers["x-api-key"];
  return providedKey === expectedKey;
}

function buildErrorResponse(res, status, message) {
  return res.status(status).json({ error: message });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return buildErrorResponse(res, 405, "POST only");
  }

  if (!enforceApiKey(req)) {
    return buildErrorResponse(res, 401, "Unauthorized");
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return buildErrorResponse(res, 429, "Too Many Requests");
  }

  try {
    ensureEnvironment();
  } catch (error) {
    console.error("Environment validation failed:", error.message);
    return buildErrorResponse(res, 500, error.message);
  }

  const { data, error } = validateChoicePayload(req.body);
  if (error) {
    return buildErrorResponse(res, 400, error);
  }

  try {
    const sheets = createSheetsClient();
    await ensureSheetExists({
      sheets,
      spreadsheetId: process.env.SHEET_ID,
      sheetName: "Sheet1",
    });
    await appendRow({
      sheets,
      spreadsheetId: process.env.SHEET_ID,
      range: "Sheet1!A1",
      values: [[
        data.sessionId,
        data.step,
        data.mbti,
        data.scene,
        data.userChoice,
        data.tone,
        data.emotion,
        data.comm,
        new Date(data.timestamp).toISOString(),
        data.sex || "",
        data.age || "",
        typeof data.affection === "number" ? data.affection : "",
      ]],
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Google Sheets Append Error:", err);
    return buildErrorResponse(res, 502, "Failed to write to Sheets");
  }
}
