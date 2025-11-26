import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const {
      sessionId,
      step,
      mbti,
      scene,
      userChoice,
      tone,
      emotion,
      comm,
      timestamp,
    } = req.body;

    if (!sessionId || !mbti || !scene || !userChoice) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Google 인증
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_KEY),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = process.env.SHEET_ID;
    const range = "Sheet1!A1";

    const values = [
      [
        sessionId,
        step,
        mbti,
        scene,
        userChoice,
        tone || "",
        emotion || "",
        comm || "",
        new Date(timestamp).toISOString(),
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });

    return res.status(200).json({ message: "Logged successfully" });
  } catch (err) {
    console.error("Google Sheets Append Error:", err);
    return res.status(500).json({ error: "Google Sheets Error" });
  }
}
