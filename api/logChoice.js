// api/logChoice.js
import { google } from "googleapis";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const body = await req.json();

    const {
      sessionId,
      step,
      mbti,
      scene,
      userChoice,
      tone,
      emotion,
      comm,
      timestamp
    } = body;

    // ---- Google Auth ----
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = process.env.SHEET_ID;
    const range = "Sheet1!A1";

    // ---- Append Row ----
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            sessionId,   // 🔥 추가됨
            step,        // 🔥 추가됨
            mbti,
            scene,
            userChoice,
            tone,
            emotion,
            comm,
            new Date(timestamp).toISOString()
          ],
        ],
      },
    });

    return new Response(
      JSON.stringify({ message: "Success" }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
