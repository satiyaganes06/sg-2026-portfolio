"use client";

import React, { useCallback } from "react";
import Terminal from "@/components/terminal/Terminal";

interface TerminalWindowProps {
  onZenModeChange: (enabled: boolean) => void;
  zenMode: boolean;
  onExit?: () => void; // callback to close the terminal window
}

export default function TerminalWindow({ onZenModeChange, zenMode, onExit }: TerminalWindowProps) {
  // We want the terminal to look like it's part of the window, 
  // so we use embedded=true and handle chrome in the window title bar if needed,
  // but standard AppWindow has its own chrome. 
  // However, the user wants it to look like a terminal.
  // The Terminal component has `chrome` prop which renders "satiyaganes@sg — zsh".
  // Let's keep chrome=true for the inner look, or false if we want the window title to be enough.
  // Usually terminals have the shell info inside.
  
  return (
    <div className="w-full h-full bg-zinc-950 text-zinc-200 flex flex-col">
       <div className="flex-1 min-h-0">
          <Terminal 
            embedded={true}
            chrome={false} // usage inside window, maybe we don't need double chrome
            showBanner={true}
            showFooter={true}
            scrollMode="internal"
            scrollHeightClass="h-full"
            // Pass the zen mode handler via a custom prop we will add to Terminal
            onZenModeChange={onZenModeChange}
            zenMode={zenMode}
            onExit={onExit}
          />
       </div>
    </div>
  );
}
