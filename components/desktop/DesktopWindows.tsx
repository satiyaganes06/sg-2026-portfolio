"use client";

import React from "react";
import { AnimatePresence } from "motion/react";
import AppWindow from "@/components/windows/AppWindow";
import AboutHome from "@/components/windows/AboutHome";
import ProjectsWindow from "@/components/windows/ProjectsWindow";
import SkillsWindow from "@/components/windows/SkillsWindow";
import ContactWindow from "@/components/windows/ContactWindow";
import ShortenLinkWindow from "@/components/windows/ShortenLinkWindow";
import TerminalWindow from "@/components/windows/TerminalWindow";
import { WindowAppType } from "./types";
import type { WindowManager } from "./useWindowManager";

export const WINDOW_TITLES: Record<WindowAppType, string> = {
  about: "About",
  projects: "Projects",
  skills: "Skills",
  contact: "Contact / Socials",
  shorten: "Shorten & Photo QR",
  terminal: "Terminal",
};

const Z_BASE = 100;

type DesktopWindowsProps = {
  manager: WindowManager;
  width: number;
  height: number;
};

export default function DesktopWindows({
  manager,
  width,
  height,
}: DesktopWindowsProps) {
  const {
    openWindows,
    fullscreenWindows,
    minimizedWindows,
    windowStack,
    dockOrigins,
    zenMode,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleFullscreen,
    applyZenMode,
  } = manager;

  const renderBody = (appType: WindowAppType): React.ReactNode => {
    switch (appType) {
      case "about":
        return <AboutHome onOpen={(app) => openWindow(app as WindowAppType)} />;
      case "projects":
        return <ProjectsWindow />;
      case "skills":
        return <SkillsWindow />;
      case "contact":
        return <ContactWindow />;
      case "shorten":
        return <ShortenLinkWindow />;
      case "terminal":
        return (
          <TerminalWindow
            zenMode={zenMode}
            onZenModeChange={applyZenMode}
            onExit={() => closeWindow("terminal")}
          />
        );
    }
  };

  return (
    <AnimatePresence>
      {(Object.keys(WINDOW_TITLES) as WindowAppType[]).map((appType) => {
        if (!openWindows[appType]) return null;
        // Zen mode shows the terminal and nothing else.
        if (zenMode && appType !== "terminal") return null;

        const orderIndex = Math.max(0, windowStack.indexOf(appType));
        const isFullscreen =
          zenMode && appType === "terminal" ? true : fullscreenWindows[appType];

        return (
          <AppWindow
            key={appType}
            title={WINDOW_TITLES[appType]}
            onClose={() => {
              if (zenMode && appType === "terminal") applyZenMode(false);
              closeWindow(appType);
            }}
            onMinimize={() => minimizeWindow(appType)}
            onToggleFullscreen={
              appType === "contact" || appType === "shorten"
                ? undefined
                : () => toggleFullscreen(appType)
            }
            fullscreen={isFullscreen}
            minimized={minimizedWindows[appType]}
            origin={dockOrigins[appType] || undefined}
            zIndex={Z_BASE + orderIndex}
            hideTitleBar={zenMode && appType === "terminal"}
            initialSize={
              appType === "shorten"
                ? {
                    width: Math.min(440, width * 0.9),
                    height: Math.min(640, height * 0.78),
                  }
                : undefined
            }
            hidePadding={appType === "shorten" || appType === "terminal"}
            disableMinimize={zenMode}
          >
            {renderBody(appType)}
          </AppWindow>
        );
      })}
    </AnimatePresence>
  );
}
