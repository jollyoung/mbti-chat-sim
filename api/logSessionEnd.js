import { appendRow, createSheetsClient, ensureEnvironment } from "./utils/sheets.js";
import { validateSessionEndPayload } from "./utils/validation.js";

const SESSION_LOG_RANGE = process.env.SESSION_LOG_RANGE || "SessionLogs!A1";

function buildErrorResponse(res, status, message) {
  return res.status(status).json({ error: message });
}

function enforceApiKey(req) {
  const expectedKey = process.env.API_SECRET_KEY;
  if (!expectedKey) return true;

  const providedKey = req.headers["x-api-key"];
  return providedKey === expectedKey;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return buildErrorResponse(res, 405, "POST only");
  }

  if (!enforceApiKey(req)) {
    return buildErrorResponse(res, 401, "Unauthorized");
  }

  try {
    ensureEnvironment();
  } catch (error) {
    console.error("Environment validation failed:", error.message);
    return buildErrorResponse(res, 500, error.message);
  }

  const { data, error } = validateSessionEndPayload(req.body);
  if (error) {
    return buildErrorResponse(res, 400, error);
  }

  try {
    const sheets = createSheetsClient();
    await appendRow({
      sheets,
      spreadsheetId: process.env.SHEET_ID,
      range: SESSION_LOG_RANGE,
      values: [[
        data.sessionId,
        data.mbti,
        new Date(data.endedAt).toISOString(),
      ]],
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Google Sheets Session End Error:", err);
    return buildErrorResponse(res, 502, "Failed to write session end to Sheets");
  }
}
