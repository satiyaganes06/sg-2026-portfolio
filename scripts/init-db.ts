import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!url) {
  console.error("DATABASE_URL or POSTGRES_URL is required. Add it to .env.local");
  process.exit(1);
}

const sql = neon(url);

async function init() {
  await sql`
    CREATE TABLE IF NOT EXISTS shorten_link (
      id TEXT PRIMARY KEY,
      link TEXT NOT NULL,
      timestamp TIMESTAMPTZ DEFAULT NOW(),
      user_browser TEXT
    )
  `;
  console.log("✓ shorten_link table ready");

  await sql`CREATE TABLE IF NOT EXISTS comments (comment TEXT)`;
  console.log("✓ comments table ready");

  console.log("Done.");
}

init().catch((e) => {
  console.error(e);
  process.exit(1);
});
