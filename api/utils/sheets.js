import { google } from "googleapis";
import { findMissingEnv } from "./validation.js";

export function ensureEnvironment() {
  const missing = findMissingEnv();
  if (missing.length) {
    const message = `Missing environment variables: ${missing.join(", ")}`;
    throw new Error(message);
  }
}

export function createSheetsClient(env = process.env) {
  ensureEnvironment();
  const privateKey = env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n");

  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: "service_account",
      project_id: env.GCP_PROJECT_ID,
      private_key: privateKey,
      client_email: env.GCP_CLIENT_EMAIL,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

export async function appendRow({
  sheets,
  spreadsheetId,
  range,
  values,
  valueInputOption = "USER_ENTERED",
}) {
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption,
    requestBody: { values },
  });
}
