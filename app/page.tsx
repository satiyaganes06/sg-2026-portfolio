"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import ScrubVideo from "@/components/mainframe/ScrubVideo";
import { useTypewriter } from "@/components/mainframe/useTypewriter";
import MenuBar from "@/components/desktop/MenuBar";
import DesktopDock, { dockApps } from "@/components/desktop/DesktopDock";
import DesktopWindows, { WINDOW_TITLES } from "@/components/desktop/DesktopWindows";
import { useWindowManager } from "@/components/desktop/useWindowManager";
import { useViewportSize } from "@/components/desktop/useViewportSize";
import { getResponsiveConfig } from "@/lib/responsive";
import { getProfile, getResume } from "@/lib/data";
import BootLog from "@/components/boot/BootLog";

const TYPED_TEXT = "Full Stack Mobile Developer, Specialist in Mobile Security.";

const PILL_BASE =
  "inline-flex items-center justify-center rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap transition-colors duration-200";

function CopyIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1" />
      <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export default function Home() {
  const profile = getProfile();
  const resume = getResume();
  const email = profile.contact.email_masked;

  const { displayed, done } = useTypewriter(TYPED_TEXT);

  // Boot sequence state
  const [bootComplete, setBootComplete] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);

  useEffect(() => {
    // Check if user has already booted
    if (typeof window !== "undefined") {
      const hasBooted = localStorage.getItem("portfolio-booted");
      if (hasBooted) {
        setBootComplete(true);
      }
    }
  }, []);

  const handleBootComplete = () => {
    setBootComplete(true);
    localStorage.setItem("portfolio-booted", "true");
  };

  // Simulate boot progress
  useEffect(() => {
    if (!bootComplete && bootProgress < 100) {
      const timer = setTimeout(() => {
        setBootProgress((p) => Math.min(100, p + Math.random() * 40));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [bootProgress, bootComplete]);

  // Content reveals on its own timer, independent of the typing animation.
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 400);
    return () => clearTimeout(t);
  }, []);

  const copyEmail = () => {
    try {
      navigator.clipboard.writeText(email);
    } catch {}
  };

  // Desktop shell: same menu bar, dock and windows as /desktop.
  const manager = useWindowManager();
  const { openWindows, focusedWindow, zenMode, handleDockAppClick } = manager;
  const { width, height } = useViewportSize();
  const responsiveConfig = getResponsiveConfig(width, height);

  const links = [
    { label: "GitHub", href: profile.socials.github },
    { label: "LinkedIn", href: profile.socials.linkedin },
    ...(profile.socials.xing ? [{ label: "Xing", href: profile.socials.xing }] : []),
    ...(profile.socials.medium ? [{ label: "Medium", href: profile.socials.medium }] : []),
    { label: "Résumé", href: resume.url },
  ];

  // Show boot sequence first
  if (!bootComplete) {
    return (
      <div className="w-full h-screen">
        <BootLog
          progress={bootProgress}
          title="Booting Shatthiya's Portfolio…"
          onComplete={handleBootComplete}
        />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen" style={{ fontFamily: "var(--font-body)" }}>
      <ScrubVideo />

      {/* Left scrim so the copy stays legible over any frame of the video. */}
      <div
        className="fixed inset-0 pointer-events-none bg-gradient-to-r from-black/85 via-black/55 to-transparent"
        style={{ zIndex: 1 }}
      />

      {!zenMode && (
        <MenuBar
          title={focusedWindow ? WINDOW_TITLES[focusedWindow] : "sG"}
          showSystemMenu={true}
          terminalHref="/terminal"
          shutdownHref="/"
        />
      )}

      <section
        className="relative min-h-screen flex flex-col justify-end pb-28 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 pt-16 md:pt-10"
        style={{ zIndex: 2, display: zenMode ? "none" : undefined }}
      >
        <div className="max-w-xl lg:max-w-2xl relative">
          {/* Availability */}
          <div
            className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-4 text-[13px] sm:text-[15px] text-white/70"
            style={{
              opacity: revealed ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          >
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {profile.contact.open_to}
            </span>
            <span className="text-white/30">·</span>
            <span>{profile.locationNote}</span>
          </div>

          {/* Name */}
          <h1
            className="text-white tracking-tight mb-2"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(34px, 7vw, 60px)",
              lineHeight: 1.05,
            }}
          >
            Hi, I&apos;m Satiya Ganes
          </h1>

          {/* Typewriter tagline */}
          <p
            className="text-white mb-6 sm:mb-7"
            style={{
              fontSize: "clamp(17px, 3.6vw, 24px)",
              lineHeight: 1.35,
              fontWeight: 400,
              minHeight: "54px",
            }}
          >
            {displayed}
            {!done && (
              <span
                className="inline-block w-[2px] h-[1.1em] bg-white align-middle ml-[2px]"
                style={{ animation: "blink 1s step-end infinite" }}
              />
            )}
          </p>

          {/* Summary */}
          <p
            className="mb-6 sm:mb-7 text-[14px] sm:text-[15px] text-white/80 leading-relaxed"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            {profile.about}
          </p>

          {/* Actions */}
          <div
            className="flex flex-wrap gap-y-1"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${PILL_BASE} gap-1.5 sm:gap-2 bg-white text-black border border-black/10 hover:bg-black hover:text-white no-underline`}
              >
                {l.label}
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              </a>
            ))}

            <button
              type="button"
              onClick={copyEmail}
              className={`${PILL_BASE} gap-2 sm:gap-3 text-white bg-transparent border border-white hover:bg-white hover:text-black`}
            >
              <span className="underline underline-offset-1">{email}</span>
              <CopyIcon />
            </button>
          </div>
        </div>
      </section>

      {!zenMode && (
        <DesktopDock
          openWindows={openWindows}
          responsiveConfig={responsiveConfig}
          width={width}
          onAppClick={handleDockAppClick}
          items={
            width < 768
              ? dockApps.filter((app) =>
                  ["about", "projects", "skills", "contact", "terminal", "shorten"].includes(app.appType)
                )
              : undefined
          }
        />
      )}

      <DesktopWindows manager={manager} width={width} height={height} />
    </main>
  );
}
