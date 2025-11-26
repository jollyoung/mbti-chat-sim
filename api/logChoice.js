import { google } from "googleapis";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const {
      mbti,
      scene,
      userChoice,
      tone,
      emotion,
      comm,
      timestamp
    } = req.body;

    // Service account 인증
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: "service_account",
        project_id: process.env.GCP_PROJECT_ID,
        private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, "\n"),
        client_email: process.env.GCP_CLIENT_EMAIL,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });

    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = process.env.SHEET_ID;

    // 데이터 추가
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          mbti,
          scene,
          userChoice,
          tone,
          emotion,
          comm,
          new Date(timestamp).toISOString()
        ]]
      }
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Google Sheets Append Error:", err);
    return res.status(500).json({ error: "Server Error", details: err });
  }
}