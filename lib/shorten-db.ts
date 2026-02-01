import { neon } from "@neondatabase/serverless";
import { customAlphabet } from "nanoid";

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!connectionString) throw new Error("DATABASE_URL or POSTGRES_URL is required");

const sql = neon(connectionString);

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const nanoid = customAlphabet(alphabet, 8);

export async function createLink(url: string, userBrowser?: string): Promise<{ id: string; url: string }> {
  await sql`
    CREATE TABLE IF NOT EXISTS shorten_link (
      id TEXT PRIMARY KEY,
      link TEXT NOT NULL,
      timestamp TIMESTAMPTZ DEFAULT NOW(),
      user_browser TEXT
    )
  `;
  const id = nanoid();
  await sql`INSERT INTO shorten_link (id, link, user_browser) VALUES (${id}, ${url}, ${userBrowser ?? null})`;
  return { id, url };
}

export async function getLinkById(id: string): Promise<string | null> {
  const rows = await sql`SELECT link FROM shorten_link WHERE id = ${id}`;
  return (rows[0] as { link: string } | undefined)?.link ?? null;
}
