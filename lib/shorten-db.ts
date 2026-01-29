import path from "node:path";
import fs from "node:fs";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { customAlphabet } from "nanoid";

const dir = path.join(process.cwd(), ".data");
const dbPath = path.join(dir, "shorten.db");

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const nanoid = customAlphabet(alphabet, 8);

async function getDb() {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const db = await open({ filename: dbPath, driver: sqlite3.Database });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS links (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);
  return db;
}

export async function createLink(url: string): Promise<{ id: string; url: string }> {
  const db = await getDb();
  const id = nanoid();
  await db.run("INSERT INTO links (id, url) VALUES (?, ?)", [id, url]);
  await db.close();
  return { id, url };
}

export async function getLinkById(id: string): Promise<string | null> {
  const db = await getDb();
  const row = await db.get<{ url: string }>("SELECT url FROM links WHERE id = ?", [id]);
  await db.close();
  return row?.url ?? null;
}
