"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { ImageIcon, Link2 } from "lucide-react";
import { getProfile } from "@/lib/data";

const PHOTO_QR_ASSET = "/my_photo.jpg";

type Tab = "shorten" | "photoQr";

export default function ShortenLinkWindow() {
  const [tab, setTab] = useState<Tab>("shorten");
  const [url, setUrl] = useState("");
  const [short, setShort] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [qrUrl, setQrUrl] = useState("");
  const [qrError, setQrError] = useState<string | null>(null);
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const qrInstanceRef = useRef<QRCodeStyling | null>(null);
  const qrUrlRef = useRef(qrUrl);
  qrUrlRef.current = qrUrl;

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

  const buildPhotoQr = useCallback((data: string) => {
    if (!qrContainerRef.current) return;
    qrContainerRef.current.innerHTML = "";
    const root = typeof window !== "undefined" ? window.location.origin : "";
    const imageSrc = `${root}${PHOTO_QR_ASSET}`;
    const qr = new QRCodeStyling({
      width: 280,
      height: 280,
      type: "canvas",
      data,
      margin: 4,
      qrOptions: { errorCorrectionLevel: "H" },
      image: imageSrc,
      imageOptions: { hideBackgroundDots: true, imageSize: 0.32, margin: 6, crossOrigin: "anonymous" },
      dotsOptions: { type: "square", color: "#000000" },
      backgroundOptions: { color: "#ffffff" },
      cornersSquareOptions: { type: "square", color: "#000000" },
      cornersDotOptions: { type: "square", color: "#000000" },
    });
    qr.append(qrContainerRef.current);
    qrInstanceRef.current = qr;
  }, []);

  const generatePhotoQr = () => {
    const trimmed = qrUrl.trim();
    if (!trimmed) {
      setQrError("Enter a URL");
      return;
    }
    if (!isValidUrl(trimmed)) {
      setQrError("Invalid URL (use http:// or https://)");
      return;
    }
    setQrError(null);
    buildPhotoQr(trimmed);
  };

  useEffect(() => {
    if (tab !== "photoQr") return;
    const defaultUrl =
      (typeof window !== "undefined" ? window.location.origin : "") || getProfile().socials.github;
    setQrUrl((prev) => prev.trim() || defaultUrl);
    const id = window.setTimeout(() => {
      const u = qrUrlRef.current.trim() || defaultUrl;
      if (isValidUrl(u)) buildPhotoQr(u);
    }, 120);
    return () => clearTimeout(id);
  }, [tab, buildPhotoQr]);

  const downloadQr = () => {
    qrInstanceRef.current?.download({ name: "photo-qr", extension: "png" });
  };

  return (
    <div className="h-full flex flex-col relative z-50">
      <div className="shrink-0 flex gap-1 p-2 border-b border-white/10">
        {(
          [
            ["shorten", "Shorten", Link2],
            ["photoQr", "Photo QR", ImageIcon],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            type="button"
            onClick={() => { setTab(id); setError(null); setQrError(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === id ? "bg-red-500/20 text-red-400 border border-red-500/30" : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide flex items-start sm:items-center justify-center">
        {tab === "shorten" ? (
          <div className="w-full max-w-lg mx-auto space-y-6">
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold text-white tracking-tight">Shorten Link</h1>
              <p className="text-zinc-500 text-sm">Paste a URL to create a short link</p>
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
                type="button"
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
                  <a href={short} target="_blank" rel="noopener noreferrer" className="flex-1 truncate text-green-500 hover:text-green-400 text-sm font-mono">
                    {short}
                  </a>
                  <button type="button" onClick={copy} className="shrink-0 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-medium border border-white/10 transition-colors">
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="text-zinc-600 text-xs">Visiting this link redirects to the original URL.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full max-w-lg mx-auto space-y-5">
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold text-white tracking-tight">Photo QR</h1>
              <p className="text-zinc-500 text-sm">Scannable QR with your photo in the center — points to any URL</p>
            </div>
            <div className="space-y-3">
              <input
                type="url"
                placeholder="https://your-link.com"
                value={qrUrl}
                onChange={(e) => setQrUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generatePhotoQr()}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/30 transition-colors"
              />
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={generatePhotoQr} className="flex-1 min-w-[120px] py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium border border-red-500/30 hover:border-red-500/50 transition-all">
                  Update QR
                </button>
                <button type="button" onClick={downloadQr} className="flex-1 min-w-[120px] py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-200 font-medium border border-white/10 transition-all">
                  Download PNG
                </button>
              </div>
            </div>
            {qrError && <p className="text-red-400/90 text-sm text-center">{qrError}</p>}
            <div className="flex justify-center p-4 rounded-xl bg-white border border-white/10 shadow-inner">
              <div ref={qrContainerRef} className="inline-block [&_canvas]:max-w-full [&_canvas]:h-auto" />
            </div>
            <p className="text-zinc-600 text-xs text-center">Uses high error correction so the code still scans with the center image. Photo: <code className="text-zinc-500">{PHOTO_QR_ASSET}</code></p>
          </div>
        )}
      </div>
    </div>
  );
}
