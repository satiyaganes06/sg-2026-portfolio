"use client";

import { useCallback, useState } from "react";
import { DockApp, WindowAppType } from "./types";

const CLOSED: Record<WindowAppType, boolean> = {
  about: false,
  projects: false,
  skills: false,
  contact: false,
  shorten: false,
  terminal: false,
};

const NO_ORIGINS: Record<WindowAppType, DOMRect | null> = {
  about: null,
  projects: null,
  skills: null,
  contact: null,
  shorten: null,
  terminal: null,
};

export type WindowManager = ReturnType<typeof useWindowManager>;

/**
 * Owns window open/focus/minimize/fullscreen state plus terminal zen mode.
 * Shared by the desktop page and the landing page so there is one implementation.
 */
export function useWindowManager() {
  const [openWindows, setOpenWindows] = useState(CLOSED);
  const [fullscreenWindows, setFullscreenWindows] = useState(CLOSED);
  const [minimizedWindows, setMinimizedWindows] = useState(CLOSED);
  const [windowStack, setWindowStack] = useState<WindowAppType[]>([]);
  const [focusedWindow, setFocusedWindow] = useState<WindowAppType | null>(null);
  const [dockOrigins, setDockOrigins] = useState(NO_ORIGINS);
  const [zenMode, setZenMode] = useState(false);

  const bringToFront = useCallback((appType: WindowAppType) => {
    setWindowStack((prev) => [...prev.filter((w) => w !== appType), appType]);
    setFocusedWindow(appType);
  }, []);

  const openWindow = useCallback((appType: WindowAppType) => {
    setOpenWindows((prev) => ({ ...prev, [appType]: true }));
    setWindowStack((prev) => [...prev.filter((w) => w !== appType), appType]);
    setFocusedWindow(appType);
  }, []);

  const closeWindow = useCallback((appType: WindowAppType) => {
    setOpenWindows((prev) => ({ ...prev, [appType]: false }));
    setMinimizedWindows((prev) => ({ ...prev, [appType]: false }));
    setWindowStack((prev) => prev.filter((w) => w !== appType));
    setFocusedWindow((prev) => (prev === appType ? null : prev));
  }, []);

  const minimizeWindow = useCallback((appType: WindowAppType) => {
    setMinimizedWindows((prev) => ({ ...prev, [appType]: true }));
    setFocusedWindow((prev) => (prev === appType ? null : prev));
  }, []);

  const toggleFullscreen = useCallback(
    (appType: WindowAppType) => {
      if (appType === "shorten") return;
      setFullscreenWindows((prev) => ({ ...prev, [appType]: !prev[appType] }));
      bringToFront(appType);
    },
    [bringToFront]
  );

  const handleDockAppClick = useCallback(
    (app: DockApp, rect: DOMRect) => {
      const appType = app.appType as WindowAppType;
      if (!(appType in CLOSED)) return;

      // Remember where the icon was so the window can animate out of it.
      setDockOrigins((prev) => ({ ...prev, [appType]: rect }));

      if (minimizedWindows[appType]) {
        setMinimizedWindows((prev) => ({ ...prev, [appType]: false }));
        bringToFront(appType);
      } else {
        openWindow(appType);
      }
    },
    [minimizedWindows, bringToFront, openWindow]
  );

  /** Zen mode forces the terminal fullscreen and hides the rest of the shell. */
  const applyZenMode = useCallback(
    (enabled: boolean) => {
      setZenMode(enabled);
      setFullscreenWindows((prev) => ({ ...prev, terminal: enabled }));
      if (enabled) bringToFront("terminal");
    },
    [bringToFront]
  );

  return {
    openWindows,
    fullscreenWindows,
    minimizedWindows,
    windowStack,
    focusedWindow,
    dockOrigins,
    zenMode,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleFullscreen,
    bringToFront,
    handleDockAppClick,
    setFocusedWindow,
    applyZenMode,
  };
}
