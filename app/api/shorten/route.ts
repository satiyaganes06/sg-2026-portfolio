import { NextRequest, NextResponse } from "next/server";
import { createLink } from "@/lib/shorten-db";

function isValidUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = typeof body?.url === "string" ? body.url.trim() : "";
    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { error: "Invalid URL (use http:// or https://)" },
        { status: 400 }
      );
    }
    const { id } = await createLink(url);
    const base = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const shortUrl = `${base.replace(/\/$/, "")}/shorten/${id}`;
    return NextResponse.json({ shortUrl, id });
  } catch (e) {
    console.error("POST /api/shorten", e);
    return NextResponse.json({ error: "Failed to shorten" }, { status: 500 });
  }
}
