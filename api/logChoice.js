// /api/logChoice.js

import {
  appendRow,
  createSheetsClient,
  ensureEnvironment,
  ensureSheetExists,
} from "./utils/sheets.js";
import { validateChoicePayload } from "./utils/validation.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "POST only" });

  const { data, error } = validateChoicePayload(req.body);
  if (error) return res.status(400).json({ error });

  try {
    ensureEnvironment();
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
        data.intent,
        new Date(data.timestamp).toISOString(),
        data.sex || "",
        data.age || "",
      ]],
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Sheets Error:", err);
    return res.status(502).json({ error: "Failed to write" });
  }
}
