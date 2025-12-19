// db/schema.js
import { db } from "./index.js";

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    mbti TEXT,
    sex TEXT,
    age INTEGER,
    nickname TEXT,
    started_at TEXT,
    ended_at TEXT
  );

  CREATE TABLE IF NOT EXISTS choice_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    step INTEGER,
    scene TEXT,
    location TEXT,
    choice_id TEXT,
    choice_label TEXT,
    displayed_user_text TEXT,
    option_tone TEXT,
    option_intent TEXT,
    created_at TEXT
  );
`);

console.log("✅ Tables created");
