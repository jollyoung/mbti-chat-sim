import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "POST only" });
  }

  const { sessionId, step, role, text, mbti, affection } = req.body;

  try {
    // Auth
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = "Logs!A1";

    // Append Row
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            new Date().toISOString(),
            sessionId,
            step,
            role,
            text,
            mbti,
            affection ?? "",
          ],
        ],
      },
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Sheets Append Error:", error);
    return res.status(500).json({ message: "Failed to log" });
  }
}
