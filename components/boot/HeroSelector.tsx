"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";

export default function HeroSelector({ defaultSeconds = 10, onSelect }: { defaultSeconds?: number; onSelect: (mode: "desktop" | "terminal" | "7sg56") => void }) {
  const [seconds, setSeconds] = useState(defaultSeconds);
  
  const items = useMemo(
    () => [
      { key: "7sg56" as const, label: "7sg56", desc: "Curated for Professionals", disabled: false },
      { key: "desktop" as const, label: "Desktop OS", desc: "Interactive Portfolio", isDefault: true, disabled: false },
    ],
    []
  );
  const [index, setIndex] = useState(1); // default selection: Desktop OS

  // Retro roles with typewriter effect
  const roles = useMemo(() => [
    "FullStack Dev",
    "Game Designer",
    "LeetCoder",
    "Creative Coder",
  ], []);
  const [roleIdx, setRoleIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);
  
  useEffect(() => {
    const full = roles[roleIdx];
    let delay = deleting ? 55 : 95;
    if (!deleting && typed === full) delay = 1000;
    if (deleting && typed === "") delay = 450;
    const id = setTimeout(() => {
      if (!deleting) {
        if (typed === full) setDeleting(true);
        else setTyped(full.slice(0, typed.length + 1));
      } else {
        if (typed === "") {
          setDeleting(false);
          setRoleIdx((i) => (i + 1) % roles.length);
        } else setTyped(full.slice(0, typed.length - 1));
      }
    }, delay);
    return () => clearTimeout(id);
  }, [typed, deleting, roleIdx, roles]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (paused || seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [paused, seconds]);

  // Auto-boot
  useEffect(() => {
    if (!paused && seconds === 0) {
      onSelect("desktop");
    }
  }, [paused, seconds, onSelect]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setIndex((i) => {
          let newIndex = (i - 1 + items.length) % items.length;
          while (items[newIndex]?.disabled && newIndex !== i) {
            newIndex = (newIndex - 1 + items.length) % items.length;
          }
          return newIndex;
        });
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setIndex((i) => {
          let newIndex = (i + 1) % items.length;
          while (items[newIndex]?.disabled && newIndex !== i) {
            newIndex = (newIndex + 1) % items.length;
          }
          return newIndex;
        });
      } else if (e.key === "Enter") {
        e.preventDefault();
        const it = items[index];
        if (!it.disabled) {
          onSelect(it.key);
        }
      } else if (e.key.toLowerCase() === "p" || e.key === " ") {
        setPaused((p) => !p);
      }
    },
    [index, items, onSelect]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full px-4 sm:px-6"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative mx-auto w-full max-w-3xl"
      >
        {/* Boot Menu Header */}
        <div className="border border-green-500/30 bg-black/95">
          {/* Title Bar */}
          <div className="border-b border-green-500/30 bg-green-500/10 px-3 sm:px-4 py-2">
            <div className="font-mono text-xs sm:text-sm text-green-400">
              GNU GRUB version 2.06
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* System Info */}
            <div className="text-center space-y-2 sm:space-y-3">
              <div className="font-mono text-lg sm:text-xl md:text-2xl text-green-400">
                Shatthiya Ganes
              </div>
              <div className="font-mono text-xs sm:text-sm text-green-500/80">
                &gt; {typed}
                <span className="animate-pulse">_</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <a 
                  href="https://firebasestorage.googleapis.com/v0/b/mad-mini-project-c822d.appspot.com/o/cv.pdf?alt=media&token=4400d475-c64c-4299-bbd4-a42c069e9798" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs px-3 py-1 border border-green-500/40 text-green-400 hover:bg-green-500/10 transition-colors"
                >
                  [Resume]
                </a>
                <a 
                  href="https://github.com/satiyaganes06" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-mono text-xs px-3 py-1 border border-green-500/40 text-green-400 hover:bg-green-500/10 transition-colors"
                >
                  [GitHub]
                </a>
              </div>
            </div>

            {/* Boot Options */}
            <div className="space-y-2">
              {items.map((it, i) => {
                const selected = i === index;
                const isDisabled = it.disabled;
                return (
                  <button
                    key={it.key}
                    onClick={() => {
                      if (!isDisabled) {
                        onSelect(it.key);
                      }
                    }}
                    onMouseEnter={() => {
                      if (!isDisabled) {
                        setIndex(i);
                      }
                    }}
                    disabled={isDisabled}
                    className={`
                      w-full text-left font-mono text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-3
                      ${selected && !isDisabled ? "bg-green-500/20 text-green-300" : "text-green-400/70"}
                      ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-green-500/10 cursor-pointer"}
                      transition-colors
                    `}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="mt-0.5 flex-shrink-0">
                        {selected && !isDisabled ? "►" : " "}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="font-semibold">{it.label}</span>
                          {it.isDefault && (
                            <span className="text-green-500/60 text-xs">(default)</span>
                          )}
                        </div>
                        <div className="text-xs text-green-500/60 mt-0.5">
                          {it.desc}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Status Bar */}
            <div className="border-t border-green-500/30 pt-3 sm:pt-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-xs font-mono text-green-500/70 text-center sm:text-left">
                  {paused ? (
                    <span className="text-yellow-500">⏸ Paused</span>
                  ) : (
                    <span>Booting in {seconds}s...</span>
                  )}
                </div>
                <button
                  onClick={() => setPaused((p) => !p)}
                  className="px-4 py-2 border border-green-500/40 bg-green-500/10 hover:bg-green-500/20 text-green-400 font-mono text-xs transition-colors active:bg-green-500/30"
                >
                  {paused ? "▶ Resume" : "⏸ Pause"}
                </button>
              </div>
              <div className="text-xs font-mono text-green-500/50 text-center">
                Use ↑↓ arrows to select • Press [Enter] to boot
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
