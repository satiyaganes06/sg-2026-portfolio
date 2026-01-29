"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { commands, aliases, type CommandHandler, type Env, type ThemeName } from "@/components/terminal/commands";
import { generateUUID } from "@/lib/utils";

type HistoryItem = {
  id: string;
  command: string;
  output?: React.ReactNode;
};

import { Banner, Prompt } from "@/components/terminal/TerminalUI";

type TerminalProps = {
  embedded?: boolean;
  chrome?: boolean;
  externalCommand?: string | null;
  onExternalConsumed?: () => void;
  showBanner?: boolean;
  scrollHeightClass?: string; // applies to the scroll area height when embedded
  showFooter?: boolean; // controls bottom hint/footer
  sessionKey?: string; // when this changes, the terminal clears history (new session)
  scrollMode?: 'internal' | 'page'; // 'internal' uses an inner scroll container; 'page' lets the whole page scroll
  onZenModeChange?: (enabled: boolean) => void;
  zenMode?: boolean;
  onExit?: () => void; // callback to close the terminal window
};

export default function Terminal({ embedded = false, chrome = true, externalCommand = null, onExternalConsumed, showBanner = true, scrollHeightClass, showFooter = true, sessionKey, scrollMode = 'internal', onZenModeChange, zenMode = false, onExit }: TerminalProps) {
  const [history, setHistory] = useState<HistoryItem[]>(() => []);
  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [theme, setTheme] = useState<ThemeName>("default");
  const [bannerVisible, setBannerVisible] = useState(showBanner);
  const [prompt, setPrompt] = useState<string>("satiyaganes@sg:~");
  const [autoScroll, setAutoScroll] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const envRef = useRef<Env | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial focus
    inputRef.current?.focus();

    // Global keydown listener to auto-focus terminal input
    const onGlobalKeyDown = (e: KeyboardEvent) => {
      // If already focused on our input, do nothing
      if (document.activeElement === inputRef.current) return;

      // If focused on some other interactive element, do nothing
      if (
        document.activeElement?.tagName === "INPUT" || 
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.tagName === "SELECT" ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }
      
      // Ignore modifier keys
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      
      // Focus input for printable keys, Backspace, or Enter
      if (e.key.length === 1 || e.key === "Backspace" || e.key === "Enter") {
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onGlobalKeyDown);
    return () => window.removeEventListener("keydown", onGlobalKeyDown);
  }, []);

  useEffect(() => {
    setBannerVisible(showBanner);
  }, [showBanner]);

  const scrollToBottom = useCallback(() => {
    // In page scroll mode, ensure the input (cursor) is brought into view
    if (scrollMode === 'page') {
      const target = inputRef.current ?? bottomRef.current;
      try {
        target?.scrollIntoView({ block: 'end' });
        return;
      } catch { }
      try {
        const doc = document.documentElement;
        window.scrollTo({ top: doc.scrollHeight });
        return;
      } catch { }
    }
    // Internal scroll mode: use the sentinel within the scroll container
    if (bottomRef.current) {
      try {
        bottomRef.current.scrollIntoView({ block: "end" });
        return;
      } catch { }
    }
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [scrollMode]);

  const onScroll = useCallback(() => {
    if (scrollMode === 'page') {
      const doc = document.documentElement;
      const nearBottom = (window.scrollY + window.innerHeight) >= (doc.scrollHeight - 10);
      // Auto-scroll state updated
      setAutoScroll(nearBottom);
      return;
    }
    const el = containerRef.current;
    if (!el) return;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
    // Auto-scroll state updated
    setAutoScroll(nearBottom);
  }, [scrollMode]);

  useEffect(() => {
    if (autoScroll) scrollToBottom();
  }, [history.length, bannerVisible, autoScroll, scrollToBottom]);

  useEffect(() => {
    const onResize = () => scrollToBottom();
    window.addEventListener("resize", onResize);
    if (scrollMode === 'page') {
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    return () => {
      window.removeEventListener("resize", onResize);
      if (scrollMode === 'page') {
        window.removeEventListener('scroll', onScroll);
      }
    };
  }, [scrollToBottom, scrollMode, onScroll]);

  // Reset session when sessionKey changes
  useEffect(() => {
    if (sessionKey === undefined) return;
    setHistory([]);
    setInput("");
    setHistoryIndex(null);
  }, [sessionKey]);

  const historyCommands = useMemo(() => history.map(h => h.command).filter(Boolean), [history]);

  const env: Env = useMemo(() => ({
    setTheme,
    setBannerVisible,
    setZenMode: onZenModeChange,
    zenMode,
    setPrompt,
    open: (url: string) => {
      try {
        const u = url.startsWith("http") ? url : `https://${url}`;
        window.open(u, "_blank", "noopener,noreferrer");
      } catch { }
    },
    run: (cmd: string) => {
      run(cmd);
      inputRef.current?.focus();
    },
    onExit,
    theme,
    prompt,
    bannerVisible,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [theme, prompt, bannerVisible, onZenModeChange, zenMode, onExit]);

  const run = useCallback((raw: string) => {
    const id = generateUUID();
    const text = raw.trim();
    if (!text) return;

    const [cmd, ...args] = text.split(/\s+/);
    let key = cmd.toLowerCase();
    if (!commands[key] && aliases[key]) key = aliases[key];

    if (key === "clear") {
      setHistory([]);
      // ensure next input is visible
      setAutoScroll(true);
      requestAnimationFrame(() => scrollToBottom());
      return;
    }


    const handler: CommandHandler | undefined = commands[key];
    const ctx = envRef.current ?? env;
    const output = handler ? handler(args, ctx) : (
      <div className="text-red-500 font-medium">
        Command not found: <span className="font-bold text-red-600">{cmd}</span>. Type <span className="text-green-500 font-bold">help</span>.
      </div>
    );

    setHistory(prev => [...prev, { id, command: text, output }]);
    // Force auto-scroll to show the newest output immediately
    setAutoScroll(true);
    requestAnimationFrame(() => scrollToBottom());
  }, [env, scrollToBottom]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = input;
      setInput("");
      setHistoryIndex(null);
      run(val);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!historyCommands.length) return;
      setHistoryIndex(prev => {
        const next = prev === null ? historyCommands.length - 1 : Math.max(0, prev - 1);
        setInput(historyCommands[next] ?? "");
        return next;
      });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const next = Math.min(historyCommands.length - 1, historyIndex + 1);
      setHistoryIndex(next);
      setInput(historyCommands[next] ?? "");
    } else if (e.key === "c" && (e.ctrlKey || e.metaKey)) {
      // Simulate ^C to cancel current line
      e.preventDefault();
      setInput("");
    } else if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
      // Cmd+L (Mac) or Ctrl+L (Windows/Linux) to clear terminal
      e.preventDefault();
      setHistory([]);
      setInput("");
      setAutoScroll(true);
      requestAnimationFrame(() => scrollToBottom());
    }
  };

  const frameStyle = theme === "mocha"
    ? { borderColor: "#45475a", backgroundColor: "rgba(30,30,46,0.85)" }
    : {};

  // keep envRef pointing to latest env
  useEffect(() => { envRef.current = env; }, [env]);

  // consume external command requests
  useEffect(() => {
    if (externalCommand && externalCommand.trim()) {
      run(externalCommand);
      onExternalConsumed?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalCommand]);

  // Embedded: render body only (no outer overlay/chrome)
  if (embedded) {
    return (
      <div className="relative w-full h-full flex flex-col min-h-0">
        {chrome && (
          <div className="flex items-center gap-2 pb-2">
            <span className="ml-3 text-xs" style={{ color: "#a6adc8" }}>satiyaganes@sg — zsh</span>
          </div>
        )}
        <div
          ref={containerRef}
          className={`${scrollMode === 'internal' ? 'overscroll-contain overflow-y-auto' : 'overflow-visible'} font-mono text-base md:text-sm flex-1 min-h-0 ${scrollHeightClass ?? ""}`}
          style={{ color: "#e4e4e7" }}
          onScroll={scrollMode === 'internal' ? onScroll : undefined}
          onClick={() => inputRef.current?.focus()}
        >
          <div className="sticky top-0 z-20 bg-zinc-950 px-3 pt-2 pb-1">
            <Banner visible={bannerVisible} />
            <div className="my-3 border-t border-zinc-800" />
          </div>
          <div className="px-3">
            {history.map(item => (
              <div key={item.id} className="mb-2">
                <div className="flex items-start gap-2">
                  <Prompt text={prompt} />
                  <span className="whitespace-pre-wrap break-words">{item.command}</span>
                </div>
                {item.output && <div className="mt-1 pl-6 break-words">{item.output}</div>}
              </div>
            ))}
            {/* Live input as part of the scrollable flow */}
            <div className="mt-2 mb-4 flex items-center gap-2 font-mono text-sm md:text-sm">
              <Prompt text={prompt} />
              <input
                ref={inputRef}
                className="flex-1 bg-transparent outline-none placeholder-zinc-600 text-base md:text-sm text-zinc-300"
                placeholder="type a command… (try: help)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                aria-label="Terminal command input"
                autoComplete="off"
                spellCheck={false}
                autoCapitalize="none"
                autoCorrect="off"
                enterKeyHint="go"
                style={{ caretColor: "#a6e3a1" }}
              />
            </div>
            <div ref={bottomRef} />
          </div>
        </div>
        {showFooter && (
          <div className="mt-2 text-[10px]" style={{ color: "#a6adc8" }}>Type &apos;clear&apos; to clear the screen.</div>
        )}
      </div>
    );
  }

  // Standalone fallback
  return (
    <div className="relative z-40 w-full max-w-4xl mx-auto">
      <div className="pointer-events-auto rounded-lg border backdrop-blur p-3" style={frameStyle}>
        {chrome && (
          <div className="flex items-center gap-2 pb-2">
            <span className="ml-3 text-xs" style={{ color: "#a6adc8" }}>satiyaganes@sg — zsh</span>
          </div>
        )}

        <div 
          ref={containerRef} 
          className="h-[70vh] md:h-[70vh] overscroll-contain overflow-y-auto font-mono text-base md:text-sm" 
          style={{ color: "#e4e4e7" }} 
          onScroll={onScroll}
          onClick={() => inputRef.current?.focus()}
        >
          <div className="sticky top-0 z-20 px-3 pt-2 pb-1" style={{ backgroundColor: theme === "mocha" ? "#1e1e2e" : "#000000" }}>
            <Banner visible={bannerVisible} />
            <div className="my-3 border-t" style={{ borderColor: "#313244" }} />
          </div>
          <div className="px-3">
            {history.map(item => (
              <div key={item.id} className="mb-2">
                <div className="flex items-start gap-2">
                  <Prompt text={prompt} />
                  <span className="whitespace-pre-wrap break-words">{item.command}</span>
                </div>
                {item.output && <div className="mt-1 pl-6 break-words">{item.output}</div>}
              </div>
            ))}
            {/* Live input as part of the scrollable flow */}
            <div className="mt-2 mb-4 flex items-center gap-2 font-mono text-sm md:text-sm">
              <Prompt text={prompt} />
              <input
                ref={inputRef}
                className="flex-1 bg-transparent outline-none placeholder-zinc-600 text-base md:text-sm text-zinc-300"
                placeholder="type a command… (try: help)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                aria-label="Terminal command input"
                autoComplete="off"
                spellCheck={false}
                autoCapitalize="none"
                autoCorrect="off"
                enterKeyHint="go"
                style={{ caretColor: "#a6e3a1" }}
              />
            </div>
            <div ref={bottomRef} />
          </div>
        </div>

        {showFooter && (
          <div className="mt-2 text-[10px]" style={{ color: "#a6adc8" }}>Type &apos;clear&apos; to clear the screen.</div>
        )}
      </div>
    </div>
  );
}

