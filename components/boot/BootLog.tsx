"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function BootLog({ progress, title = "Booting Shatthiya’s Portfolio…", onComplete }: { progress: number; title?: string; onComplete?: () => void }) {
  const lines = useMemo(
    () => [
      "SG BIOS v2.0   © 2023 Satiya Ganes",
      "Primary Master:  Flutter SSD  2TB  LBA",
      "Primary Slave :  Laravel Framework  1TB",
      "Secondary Mast:  Dart CD-ROM",
      "Secondary Slav:  Tailwind CSS Cache",
      "Video BIOS:     WebGL Compatible, 4GB",
      "Memory Test:    16GB OK + 8GB VRAM OK",
      "Keyboard:       Detected",
      "Mouse:          Web Compatible",
      "Network:        Vercel CDN Ready",
      "",
      "Detecting IDE Primary Master...    Flutter SSD",
      "Detecting IDE Secondary Master...  Dart CD-ROM",
      "",
      "Tech Device Listing...",
      " Bus  Dev  Fun  Vendor  Device  Class   IRQ",
      " 00   01   00   Flutter 3.x    UI      --",
      " 00   02   00   Laravel 10.x   Backend 14",
      " 00   02   01   Framer  Motion  Anim    11",
      " 00   02   02   Tailwind CSS   Styles  10",
      " 00   09   00   Firebase DB    Backend 12",
      "",
      "Press DEL to enter SETUP, F12 for Boot Menu",
      "Verifying DMI Pool Data............. OK",
      "Boot from CD-ROM Sector 1 :  ...",
      "Boot from Desktop Environment...",
      "",
      "Loading OS...",
      "Initializing modules: about, projects, skills, contact, shorten-link",
      "Mounting desktop directory... OK",
      "Starting widgets: todo, now-listening, date-now... OK",
      "Loading tech stack: Flutter, Laravel, Dart, Tailwind... OK",
      "Initializing responsive system... OK",
      "Target: Desktop Interface (default)",
      "",
      "Handing off to desktop environment...",
    ],
    []
  );

  const [visible, setVisible] = useState(2);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (visible >= lines.length) {
      if (onComplete) {
        const timer = setTimeout(onComplete, 800);
        return () => clearTimeout(timer);
      }
      return;
    }
    const jitter = (min: number, max: number) => Math.random() * (max - min) + min;
    // Calculate timing to complete in max 2 seconds
    const totalTime = 2000; // 2 seconds in milliseconds
    const timePerLine = totalTime / lines.length;
    const timer = setTimeout(() => setVisible((v) => Math.min(lines.length, v + 1)), jitter(10, 50));
    return () => clearTimeout(timer);
  }, [visible, lines.length, onComplete]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [visible]);

  const pct = Math.max(0, Math.min(100, Math.round(progress)));
  const barWidth = 28;
  const filled = Math.round((pct / 100) * barWidth);
  const empty = barWidth - filled;

  return (
    <div className="relative w-full h-full bg-black">
      {/* Scrollable terminal body with sticky top title and sticky bottom progress */}
      <div className="absolute inset-0 overflow-auto crt-flicker">
        <div className="relative min-h-full font-mono text-green-200 text-xs md:text-sm leading-relaxed">
          {/* Sticky top line (title as part of the log) */}
          <div className="sticky top-0 z-10 bg-black/85 px-4 py-1.5">
            <span className="crt-glow">[ OS ] {title}</span>
          </div>

          {/* Log content */}
          <div className="px-4 py-3 pb-14">
            <AnimatePresence initial={false}>
              {lines.slice(0, visible).map((line, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.08 }}>
                  {line}
                </motion.div>
              ))}
            </AnimatePresence>
            <span className="inline-block w-2 h-4 align-text-top bg-green-300 ml-1 animate-pulse" />
            <div ref={endRef} />
          </div>
        </div>
      </div>

      {/* Always-on-bottom ASCII progress bar (outside scroll area) */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/85 px-4 py-2">
        <span className="text-green-400 font-mono text-xs">[
          <span className="text-green-400">{"█".repeat(filled)}</span>
          <span className="text-green-900">{"░".repeat(empty)}</span>
        ] {pct}%</span>
      </div>

      {/* Subtle scanline and vignette effects */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "repeating-linear-gradient(180deg, rgba(16,255,106,0.12) 0, rgba(16,255,106,0.12) 1px, transparent 2px)",
      }} />
      <div className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(80% 80% at 50% 50%, transparent 62%, rgba(0,0,0,0.45) 100%)"
      }} />
      <div className="crt-scanline" />
    </div>
  );
}
