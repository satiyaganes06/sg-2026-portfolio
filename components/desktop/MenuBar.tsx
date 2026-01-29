"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Apple, Settings, Power, Info, Command } from "lucide-react";

export default function MenuBar({ hidden = false, title = "SG", showSystemMenu = false, terminalHref = "/terminal", shutdownHref = "/gui" }: { hidden?: boolean; title?: string; showSystemMenu?: boolean; terminalHref?: string; shutdownHref?: string }) {
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
      } bg-[#0d0d0d] border-b border-zinc-800 text-theme-2`}
    >
      <div className="flex items-center gap-3" ref={menuRef}>
        {showSystemMenu && (
             <span className="font-bold">{title}</span>
        )}
        <span className="font-semibold hidden sm:inline">{title}</span>
        <span className="text-zinc-400 hidden sm:inline"></span>

      </div>
      <div className="text-zinc-400" suppressHydrationWarning>{now}</div>
    </div>
  );
}
