"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function MenuBar({ hidden = false, title = "SG", showSystemMenu = false, terminalHref = "/terminal", shutdownHref = "/gui" }: { hidden?: boolean; title?: string; showSystemMenu?: boolean; terminalHref?: string; shutdownHref?: string }) {
  const { theme, setTheme } = useTheme();
  const [now, setNow] = useState<string>("");
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const update = () => setNow(new Date().toLocaleString());
    update();
    const t = setInterval(update, 1000 * 30);
    return () => clearInterval(t);
  }, []);

  // close when clicking outside
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleAction = (action: "shutdown" | "terminal" | "restart") => {
    setOpen(false);
    if (action === "terminal") router.push(terminalHref);
    if (action === "shutdown") router.push(shutdownHref);
    if (action === "restart") window.location.reload();
  };

  return (
    <div
      className={`fixed top-0 inset-x-0 h-8 px-3 flex items-center justify-between text-xs z-50 transition-opacity ${
        hidden ? "opacity-0 pointer-events-none" : "opacity-100"
      } bg-zinc-100 dark:bg-[#0d0d0d] border-b border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300`}
    >
      <div className="flex items-center gap-3" ref={menuRef}>
        {showSystemMenu && <span className="font-bold">{title}</span>}
        {/* <span className="font-semibold hidden sm:inline">{title}</span> */}
      </div>
      <div className="flex items-center gap-2">
        {/* <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button> */}
        <span className="text-zinc-500 dark:text-zinc-400" suppressHydrationWarning>{now}</span>
      </div>
    </div>
  );
}
