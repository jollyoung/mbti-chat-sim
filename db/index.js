// db/index.js
import Database from "better-sqlite3";

export const db = new Database("db/dev.db");

// 확인용 로그
console.log("✅ SQLite DB connected");
