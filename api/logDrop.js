// /api/logDrop.js

import {
  appendRow,
  createSheetsClient,
  ensureEnvironment,
  ensureSheetExists,
} from "./utils/sheets.js";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "POST only" });

  try {
    ensureEnvironment();
    const sheets = createSheetsClient();

    await ensureSheetExists({
      sheets,
      spreadsheetId: process.env.SHEET_ID,
      sheetName: "Sheet1",
    });

    const {
      sessionId,
      attemptIndex,
      mbti,
      scene,
      timestamp,
      sex,
      age,
    } = req.body;

    await appendRow({
      sheets,
      spreadsheetId: process.env.SHEET_ID,
      range: "Sheet1!A1",
      values: [[
        sessionId,
        attemptIndex,
        mbti,
        scene,
        "[DROP_UNLOAD]",
        "", // tone 없음
        "", // intent 없음
        false, // next_exists 항상 false
        true,  // drop
        new Date(timestamp).toISOString(),
        sex || "",
        age || "",
      ]],
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Drop log error:", err);
    return res.status(502).json({ error: "Failed to write drop" });
  }
}
