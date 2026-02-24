"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Clipboard, Globe, Github, Linkedin, MapPin, Twitter } from "lucide-react";
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
import { getProfile } from "@/lib/data";
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

  // Role rotator for hero
  const [roleIndex, setRoleIndex] = useState(0);
  useEffect(() => {
    const roles = getProfile().roles ?? [getProfile().tagline.split(" · ")[0]];
    if (roles.length <= 1) return;
    const id = setInterval(() => setRoleIndex(i => (i + 1) % roles.length), 3000);
    return () => clearInterval(id);
  }, []);

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
        className="fixed inset-0 w-full h-full bg-zinc-100 dark:bg-zinc-950 overflow-hidden select-none touch-none desktop-bg-texture"
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
        {/* <DesktopBackground backgroundImage="/Julius-Caesar.webp" overlay={false} /> */}

        Menu Bar - Hidden in Zen Mode
        {!zenMode && (
          <MenuBar title={focusedWindow ? WINDOW_CONFIG[focusedWindow]?.title : "Desktop"} showSystemMenu={true} terminalHref="/terminal" shutdownHref="/" />
        )}

        {/* Hero + Info Cards - Hidden in Zen Mode */}
        {!zenMode && (() => {
          const profile = getProfile();
          const roles = profile.roles ?? [profile.tagline.split(" · ")[0]];
          const currentRole = roles[roleIndex % roles.length];
          const heroTop = width < 768 ? 100 : responsiveConfig.heroTop - 40;
          const copyEmail = () => { navigator.clipboard.writeText(profile.contact.email_masked); };
          const cardClass = "rounded-xl border border-zinc-200/80 dark:border-zinc-700/80 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm p-5 flex items-start gap-3 transition hover:bg-white dark:hover:bg-zinc-900";
          return (
            <div className="absolute z-10 left-1/2 -translate-x-1/2 max-w-2xl w-full px-6 py-2" style={{ top: `${heroTop}px` }}>
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-zinc-200/90 dark:bg-zinc-700/90 px-3 py-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {profile.contact.open_to}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-zinc-200/90 dark:bg-zinc-700/90 px-3 py-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Remote Available
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Hello, I&apos;m {profile.name}.</h1>
              <div className="h-8 overflow-hidden mb-4">
                <AnimatePresence mode="wait">
                  <motion.p key={currentRole} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -24, opacity: 0 }} transition={{ duration: 0.35 }} className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">{currentRole}.</motion.p>
                </AnimatePresence>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-8 max-w-lg">{profile.about.slice(0, 160)}…</p>
              <div className="flex flex-wrap gap-3 mb-8">
                <motion.button onClick={() => openWindow("contact")} className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2.5 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  Connect now <ArrowUpRight className="w-4 h-4" />
                </motion.button>
                <motion.button onClick={copyEmail} className="inline-flex items-center gap-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 px-4 py-2.5 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Clipboard className="w-4 h-4" /> Copy Email
                </motion.button>
              </div>
              {/* Card grid: Open to Work (tall) + 2x2 links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className={`${cardClass} flex-col lg:row-span-2`}>
                  <div className="flex items-center justify-between w-full"><Globe className="w-5 h-5 text-zinc-600 dark:text-zinc-400" /><span className="w-2 h-2 rounded-full bg-emerald-500" /></div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">Open to Work</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{profile.contact.open_to}</p>
                </div>
                <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className={cardClass + " no-underline text-zinc-900 dark:text-zinc-100"}>
                  <Github className="w-5 h-5 shrink-0 text-zinc-600 dark:text-zinc-400" />
                  <div className="min-w-0 flex-1"><p className="font-semibold">GitHub</p><p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">@{profile.handle}</p></div>
                  <ArrowUpRight className="w-4 h-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
                </a>
                {profile.socials.twitter && (
                  <a href={profile.socials.twitter} target="_blank" rel="noopener noreferrer" className={cardClass + " no-underline text-zinc-900 dark:text-zinc-100"}>
                    <Twitter className="w-5 h-5 shrink-0 text-zinc-600 dark:text-zinc-400" />
                    <div className="min-w-0 flex-1"><p className="font-semibold">Twitter/X</p><p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">@{profile.handle}</p></div>
                    <ArrowUpRight className="w-4 h-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
                  </a>
                )}
                <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className={cardClass + " no-underline text-zinc-900 dark:text-zinc-100"}>
                  <Linkedin className="w-5 h-5 shrink-0 text-zinc-600 dark:text-zinc-400" />
                  <div className="min-w-0 flex-1"><p className="font-semibold">LinkedIn</p><p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">/in/{profile.socials.linkedin.split("/in/")[1]?.replace(/\/$/, "") ?? profile.handle}</p></div>
                  <ArrowUpRight className="w-4 h-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
                </a>
                <div className={cardClass}>
                  <MapPin className="w-5 h-5 shrink-0 text-zinc-600 dark:text-zinc-400" />
                  <div className="min-w-0 flex-1 flex items-center justify-between w-full"><span><p className="font-semibold text-zinc-900 dark:text-zinc-100">{profile.location ?? "Remote"}</p><p className="text-sm text-zinc-600 dark:text-zinc-400">Remote Available</p></span><ArrowUpRight className="w-4 h-4 shrink-0 text-zinc-400 dark:text-zinc-500" /></div>
                </div>
              </div>
            </div>
          );
        })()}

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
       pauseOnHover={true}
       className="bg-zinc-800/40 dark:bg-black/30 backdrop-blur-sm text-zinc-900 dark:text-white min-h-[50px] flex items-center"
     />
    </div>
   )}

       

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
