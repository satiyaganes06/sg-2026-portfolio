"use client";

import React, { useState } from "react";

export default function ShortenLinkWindow() {
  const [url, setUrl] = useState("");
  const [short, setShort] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const isValidUrl = (s: string) => {
    try {
      const u = new URL(s);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  const shorten = async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Enter a URL");
      setShort(null);
      return;
    }
    if (!isValidUrl(trimmed)) {
      setError("Invalid URL (use http:// or https://)");
      setShort(null);
      return;
    }
    setError(null);
    setShort(null);
    setLoading(true);
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Failed to shorten");
        return;
      }
      setShort(data.shortUrl ?? null);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!short) return;
    try {
      await navigator.clipboard.writeText(short);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Copy failed");
    }
  };

  return (
    <div className="h-full flex flex-col relative z-50">
      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide flex items-start sm:items-center justify-center">
        <div className="w-full max-w-lg mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">Shorten Link</h1>
            <p className="text-zinc-500 text-sm">Paste a URL to create a short link (stored in SQLite)</p>
          </div>
          <div className="space-y-3">
            <input
              type="url"
              placeholder="https://example.com/page"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && shorten()}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/30 transition-colors"
              disabled={loading}
            />
            <button
              onClick={shorten}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium border border-red-500/30 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Shortening…" : "Shorten"}
            </button>
          </div>
          {error && <p className="text-red-400/90 text-sm text-center">{error}</p>}
          {short && (
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 space-y-3">
              <p className="text-zinc-500 text-xs uppercase tracking-wider">Short link</p>
              <div className="flex gap-2">
                <a
                  href={short}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 truncate text-green-500 hover:text-green-400 text-sm font-mono"
                >
                  {short}
                </a>
                <button
                  onClick={copy}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-medium border border-white/10 transition-colors"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="text-zinc-600 text-xs">Visiting this link redirects to the original URL.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
