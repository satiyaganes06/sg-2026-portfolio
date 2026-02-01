"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import MenuBar from "@/components/desktop/MenuBar";
import DesktopBackground from "@/components/desktop/DesktopBackground";
import AppWindow from "@/components/windows/AppWindow";
import SkillsWindow from "@/components/windows/SkillsWindow";
import ContactWindow from "@/components/windows/ContactWindow";
import ProjectsWindow from "@/components/windows/ProjectsWindow";
import AboutHome from "@/components/windows/AboutHome";
import ShortenLinkWindow from "@/components/windows/ShortenLinkWindow";
import TerminalWindow from "@/components/windows/TerminalWindow";
import TodoWidget from "@/components/widgets/TodoWidget";
import NowListeningWidget from "@/components/widgets/NowListeningWidget";
import DateNowWidget from "@/components/widgets/DateNowWidget";
import TechStackStrip from "@/components/tech-marquee";
import { getResponsiveConfig } from "@/lib/responsive";
import AnimatedRoleText from "@/components/desktop/AnimatedRoleText";
import DesktopDock, { dockApps } from "@/components/desktop/DesktopDock";
import { WindowAppType, WidgetType, DesktopItem, DockApp } from "@/components/desktop/types";

export default function DesktopOSPage() {

  // track which windows are open and a z-order stack for layering
  const [openWindows, setOpenWindows] = useState<Record<WindowAppType, boolean>>({
    about: false,
    projects: false,
    skills: false,
    contact: false,
    shorten: false,
    terminal: false,
  });

  // Window dimensions - use consistent initial values to prevent hydration mismatch
  const [width, setWidth] = useState(1440);
  const [height, setHeight] = useState(900);
  const [windowStack, setWindowStack] = useState<WindowAppType[]>([]);
  const [focusedWindow, setFocusedWindow] = useState<WindowAppType | null>(null);

  // Responsive configuration
  const responsiveConfig = useMemo(() => getResponsiveConfig(width, height), [width, height]);

  // Track fullscreen state per window
  const [fullscreenWindows, setFullscreenWindows] = useState<Record<WindowAppType, boolean>>({
    about: false,
    projects: false,
    skills: false,
    contact: false,
    shorten: false,
    terminal: false,
  });

  // Track minimized state per window
  const [minimizedWindows, setMinimizedWindows] = useState<Record<WindowAppType, boolean>>({
    about: false,
    projects: false,
    skills: false,
    contact: false,
    shorten: false,
    terminal: false,
  });

  // Update window dimensions after hydration to prevent hydration mismatch
  useEffect(() => {
    const updateDimensions = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);





  // Window helpers
  const bringToFront = useCallback((appType: WindowAppType) => {
    setWindowStack(prev => [...prev.filter(w => w !== appType), appType]);
    setFocusedWindow(appType);
  }, []);

  const openWindow = useCallback((appType: WindowAppType) => {
    setOpenWindows(prev => ({ ...prev, [appType]: true }));
    setWindowStack(prev => [...prev.filter(w => w !== appType), appType]);
    setFocusedWindow(appType);
  }, []);

  const closeWindow = useCallback((appType: WindowAppType) => {
    setOpenWindows(prev => ({ ...prev, [appType]: false }));
    setMinimizedWindows(prev => ({ ...prev, [appType]: false }));
    setWindowStack(prev => prev.filter(w => w !== appType));
    setFocusedWindow(prev => (prev === appType ? null : prev));
  }, []);

  const minimizeWindow = useCallback((appType: WindowAppType) => {
    setMinimizedWindows(prev => ({ ...prev, [appType]: true }));
    setFocusedWindow(prev => (prev === appType ? null : prev));
  }, []);

  const toggleFullscreen = useCallback((appType: WindowAppType) => {
    if (appType === 'shorten') return;
    setFullscreenWindows(prev => ({ ...prev, [appType]: !prev[appType] }));
    bringToFront(appType);
  }, [bringToFront]);

  // Track window origins for dock animations
  const [dockOrigins, setDockOrigins] = useState<Record<WindowAppType, DOMRect | null>>({
    about: null,
    projects: null,
    skills: null,
    contact: null,
    shorten: null,
    terminal: null,
  });

  // Dock app click
  const handleDockAppClick = useCallback((app: DockApp, rect: DOMRect) => {
    const appType = app.appType as WindowAppType;

    // Update origin
    setDockOrigins(prev => ({ ...prev, [appType]: rect }));

    if (app.appType in openWindows) {
      if (minimizedWindows[appType]) {
        // Restore minimized window
        setMinimizedWindows(prev => ({ ...prev, [appType]: false }));
        bringToFront(appType);
      } else {
        // Open or focus window
        openWindow(appType);
      }
    }
  }, [openWindow, openWindows, minimizedWindows, bringToFront]);

  const clearSelection = useCallback(() => { }, []);

  // Zen mode for terminal
  const [zenMode, setZenMode] = useState(false);

  // Widget Layout - Using Responsive System
  const desktopItems: DesktopItem[] = useMemo(() => {
    // Hide widgets in zen mode
    if (zenMode) return [];

    // Base dimensions (unscaled)
    const baseTodoWidth = 310;
    const baseTodoHeight = 150;
    const baseSmallWidth = 150;
    const baseSmallHeight = 150;

    // Scale factor from config
    const scale = responsiveConfig.widgetScale;
    const margin = responsiveConfig.widgetMargin;

    // Computed scaled dimensions for layout positioning
    const scaledTodoWidth = baseTodoWidth * scale;
    const scaledTodoHeight = baseTodoHeight * scale;
    const scaledSmallWidth = baseSmallWidth * scale;

    // Consistent top spacing for all screen sizes (same as 13" MacBook)
    const topSpacing = 46;

    return [
      {
        id: "todo-widget",
        name: "Things I Be Doing",
        icon: "",
        type: "widget",
        widgetType: "todo",
        // TOP-RIGHT CORNER - Consistent spacing
        x: width - scaledTodoWidth - margin,
        y: topSpacing,
        widthPx: baseTodoWidth, // Pass unscaled width
        heightPx: baseTodoHeight, // Pass unscaled height
        scale: scale, // Pass scale factor
      },
      {
        id: "now-listening-widget",
        name: "Now Listening",
        icon: "",
        type: "widget",
        widgetType: "now-listening",
        // BOTTOM-LEFT CORNER
        x: margin,
        y: height - (160 * scale),
        widthPx: baseSmallWidth,
        heightPx: baseSmallHeight,
        scale: scale,
      },
      {
        id: "date-now-widget",
        name: "Date Now",
        icon: "",
        type: "widget",
        widgetType: "date-now",
        // BOTTOM-RIGHT - Position below todo widget with consistent gap
        x: width - scaledSmallWidth - margin,
        y: topSpacing + scaledTodoHeight + 10,
        widthPx: baseSmallWidth,
        heightPx: baseSmallHeight,
        scale: scale,
      },
    ];
  }, [width, height, responsiveConfig, zenMode]);

  // Widget renderer - direct widgets
  const renderWidget = (widgetType: WidgetType) => {
    switch (widgetType) {
      case "todo":
        return <TodoWidget />;
      case "now-listening":
        return <NowListeningWidget />;
      case "date-now":
        return <DateNowWidget />;
      default:
        return null;
    }
  };


  // Window descriptors to remove JSX duplication
  const WINDOW_CONFIG: Record<WindowAppType, { title: string; render: () => React.JSX.Element }> = {
    about: { title: "About", render: () => <AboutHome onOpen={(app) => openWindow(app as WindowAppType)} /> },
    projects: { title: "Projects", render: () => <ProjectsWindow /> },
    skills: { title: "Skills", render: () => <SkillsWindow /> },
    contact: { title: "Contact / Socials", render: () => <ContactWindow /> },
    shorten: { title: "Shorten Link", render: () => <ShortenLinkWindow /> },
    terminal: { 
      title: "Terminal", 
      render: () => (
        <TerminalWindow 
          zenMode={zenMode}
          onZenModeChange={(enabled) => {
            setZenMode(enabled);
            // If zen mode is enabled, we need to ensure this window is active and probably maximized if not already
            if (enabled) {
              setFullscreenWindows(prev => ({ ...prev, terminal: true }));
              bringToFront('terminal');
            } else {
              setFullscreenWindows(prev => ({ ...prev, terminal: false }));
            }
          }}
          onExit={() => closeWindow('terminal')}
        />
      ) 
    },
  } as const;

  const zBase = 100; // base z-index for windows

  return (
    <div>
      {/* Actual desktop UI - Visible on all screens now */}
      <div
        className="fixed inset-0 w-full h-full bg-black overflow-hidden select-none touch-none"
        role="application"
        aria-label="Desktop environment"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            clearSelection();
            setFocusedWindow(null);
          }
        }}
      >
        {/* Desktop Background */}
        <DesktopBackground backgroundImage="/Julius-Caesar.webp" overlay={false} />

        {/* Menu Bar - Hidden in Zen Mode */}
        {!zenMode && (
          <MenuBar title={focusedWindow ? WINDOW_CONFIG[focusedWindow]?.title : "Desktop"} showSystemMenu={true} terminalHref="/terminal" shutdownHref="/" />
        )}

        {/* Hero Text - Hidden in Zen Mode */}
        {!zenMode && (
         <div
          className="absolute z-10"
          style={{
            left: `${width < 768 ? 20 : responsiveConfig.heroLeft}px`,
            top: `${width < 768 ? 100 : responsiveConfig.heroTop - 40}px`
          }}
         >
          <div className="space-y-2">
            <div className="text-white space-y-4 lg:space-y-6">
              {/* Main Name - Responsive Size */}
              <h1
                className="tracking-tight font-walter font-black"
                style={{
                  fontSize: width < 768 ? '3rem' : responsiveConfig.heroNameSize,
                  lineHeight: '0.9'
                }}
              >
                <span className="text-red-500">S</span>atiya <span className="text-red-500">G</span>anes
              </h1>

              {/* Tagline - Responsive */}
              <div
                className="font-light leading-relaxed"
                style={{
                  fontSize: width < 768 ? '1rem' : responsiveConfig.heroTaglineSize
                }}
              >
                <span className="text-gray-300">I build </span>
                <span className="text-gray-200 mx-2">digital experiences </span>
                <span className="text-gray-300">with</span>
                <br />
                <span className="text-gray-400">passion, precision and</span>
                <AnimatedRoleText />
              </div>
            </div>
          </div>
         </div>
        )}

        {/* TechStackStrip - Hidden in Zen Mode and Mobile */}
        {!zenMode && width >= 768 && (
         <div
          className="absolute z-0 origin-center"
          style={{
            bottom: `${responsiveConfig.techStripBottom}px`,
            right: `${responsiveConfig.techStripRight}px`,
            transform: 'rotate(-35deg)',
            width: `${responsiveConfig.techStripWidth}px`
          }}
         >
          <TechStackStrip
            items={[
              "Flutter",
              "Laravel",
              "Dart",
              "Tailwind CSS",
              "PHP",  
              "Getx",
              "Provider",
              "Riverpod",
              "Kotlin",
              "Java",
              "MySQL",
              "PostgreSQL",
              "Oracle",
              "Firebase",
              "Git",
              "GitHub",
              "GitLab",
              "Docker",
              "Postman",
              "Java SE",
              "C"
            ]}
            duration={25}
            pauseOnHover={false}
            className="bg-black/30 backdrop-blur-sm text-white min-h-[50px] flex items-center"
          />
         </div>
        )}

        {/* Desktop Widgets - Hidden on Mobile */}
        {width >= 768 && desktopItems.map((item) => {
          if (item.type !== "widget" || !item.widgetType) return null;
          return (
            <motion.div
              key={item.id}
              className="absolute pointer-events-auto border border-gray-700/50 rounded-xl bg-black/20 backdrop-blur-sm"
              style={{
                left: item.x,
                top: item.y,
                width: item.widthPx,
                height: item.heightPx,
                transformOrigin: "top left",
                scale: item.scale || 1
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: item.scale || 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {renderWidget(item.widgetType)}
            </motion.div>
          );
        })}


        {/* Custom Dock - Hidden in Zen Mode */}
        {!zenMode && (
         <DesktopDock
          openWindows={openWindows}
          responsiveConfig={responsiveConfig}
          width={width}
          onAppClick={handleDockAppClick}
          items={width < 768 ? dockApps.filter(app => ['about', 'projects', 'skills', 'contact'].includes(app.appType)) : undefined}
         />
        )}

        {/* Windows */}
        <AnimatePresence>
          {(Object.keys(WINDOW_CONFIG) as WindowAppType[]).map((appType) => {
            if (!openWindows[appType]) return null;
            // In Zen Mode, only show the terminal, and hide others
            if (zenMode && appType !== 'terminal') return null;

            const orderIndex = Math.max(0, windowStack.indexOf(appType));
            const { title, render } = WINDOW_CONFIG[appType];
            const isMinimized = minimizedWindows[appType];
            
            // If Zen Mode is active, force fullscreen for terminal, and ensure it's not minimized
            const isFullscreen = (zenMode && appType === 'terminal') ? true : fullscreenWindows[appType];
            
            return (
              <AppWindow
                key={appType}
                title={title}
                onClose={() => {
                   if (zenMode && appType === 'terminal') {
                     setZenMode(false);
                   }
                   closeWindow(appType);
                }}
                onMinimize={() => minimizeWindow(appType)}
                onToggleFullscreen={(appType === 'contact' || appType === 'shorten') ? undefined : () => toggleFullscreen(appType)}
                fullscreen={isFullscreen}
                minimized={isMinimized}
                origin={dockOrigins[appType] || undefined}
                zIndex={zBase + orderIndex}
                // Hide window controls if in Zen Mode and pass explicit style overrides for terminal
                hideTitleBar={zenMode && appType === 'terminal'}
                borderColor={appType === 'terminal' ? "#3f3f46" : undefined} // zinc-700 for distinct border, or match standard
                backgroundColor={appType === 'terminal' ? "#09090b" : undefined} // zinc-950 for terminal background
                
                initialSize={
                  appType === 'shorten' ? { width: Math.min(440, width * 0.9), height: Math.min(420, height * 0.7) } : 
                  undefined
                }
                hidePadding={appType === 'shorten' || (appType === 'terminal')} // Terminal handles its own padding
                disableMinimize={zenMode} // Cannot minimize in Zen Mode
              >
                {render()}
              </AppWindow>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
