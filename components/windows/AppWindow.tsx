"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useDragControls } from "motion/react";

// Set NEXT_PUBLIC_DEBUG_UI=1 to outline windows for debugging
const DEBUG_UI = process.env.NEXT_PUBLIC_DEBUG_UI === "1" || process.env.NEXT_PUBLIC_DEBUG_UI === "true";

export type WindowProps = {
  id?: string;
  title: string;
  open?: boolean;
  fullscreen?: boolean;
  minimized?: boolean;
  zIndex?: number;
  customSize?: { width: number; height: number };
  initialSize?: { width: number; height: number };
  disableMinimize?: boolean;
  hidePadding?: boolean;
  hideTitleBar?: boolean;
  origin?: DOMRect;
  onClose?: () => void;
  onMinimize?: () => void;
  onToggleFullscreen?: () => void;
  titleBarColor?: string;
  borderColor?: string;
  backgroundColor?: string;
  children: React.ReactNode;
};

export default function AppWindow({
  id,
  title,
  fullscreen = false,
  minimized = false,
  zIndex = 40,
  customSize,
  initialSize,
  disableMinimize = false,
  hidePadding = false,
  hideTitleBar = false,
  origin,
  onClose,
  onMinimize,
  onToggleFullscreen,
  titleBarColor,
  borderColor,
  backgroundColor,
  children,
}: WindowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  // Enable full layout animation only briefly on fullscreen toggle to avoid content update lag
  const [fsAnim, setFsAnim] = useState(false);
  useEffect(() => {
    setFsAnim(true);
    const t = setTimeout(() => setFsAnim(false), 250);
    return () => clearTimeout(t);
  }, [fullscreen]);

  // Local size state for windowed mode
  const [size, setSize] = useState<{ w: number; h: number }>(
    customSize
      ? { w: customSize.width, h: customSize.height }
      : initialSize
        ? { w: initialSize.width, h: initialSize.height }
        : { w: 900, h: 560 }
  );

  // Responsive default size on mount
  useEffect(() => {
    if (!customSize && !initialSize) {
      // Default to 70% of screen dimensions to feel like a "window"
      // But cap at a reasonable maximum (900x600) and ensure it fits
      const isMobile = window.innerWidth < 768;
      const targetW = isMobile
        ? Math.min(window.innerWidth - 32, 600) // Full width minus padding on mobile
        : Math.min(900, window.innerWidth * 0.70);

      const targetH = isMobile
        ? Math.min(window.innerHeight - 100, 800) // Taller on mobile
        : Math.min(600, window.innerHeight * 0.70);

      // Ensure it's not too small
      const finalW = Math.max(300, targetW);
      const finalH = Math.max(240, targetH);

      setSize({ w: finalW, h: finalH });
    }
  }, [customSize, initialSize]);
  const [savedSize, setSavedSize] = useState<{ w: number; h: number } | null>(null);
  const prevFsRef = useRef(fullscreen);

  // Sync save/restore size when toggling fullscreen
  useEffect(() => {
    const prev = prevFsRef.current;
    if (!prev && fullscreen) {
      // entering fullscreen, save windowed size
      setSavedSize(size);
    } else if (prev && !fullscreen) {
      // leaving fullscreen, restore windowed size if saved
      if (savedSize) setSize(savedSize);
    }
    prevFsRef.current = fullscreen;
  }, [fullscreen, savedSize, size]);

  // Check for mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Disable dragging when fullscreen or on mobile
  const dragProps = useMemo(
    () =>
      fullscreen || isMobile
        ? { drag: false as const }
        : {
          drag: true as const,
          dragListener: false,
          dragControls,
          dragMomentum: false,
          dragElastic: 0.08,
          dragConstraints: containerRef,
        },
    [fullscreen, dragControls, isMobile]
  );

  // Resize handler (bottom-right corner)
  const startResize = (e: React.PointerEvent) => {
    if (fullscreen || customSize) return;
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = size.w;
    const startH = size.h;

    const bounds = containerRef.current?.getBoundingClientRect();
    const maxW = (bounds?.width || window.innerWidth) - 32; // padding allowance
    const maxH = (bounds?.height || window.innerHeight) - 32;

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const nextW = Math.min(Math.max(360, startW + dx), maxW);
      const nextH = Math.min(Math.max(240, startH + dy), maxH);
      setSize({ w: nextW, h: nextH });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  // Compute animation variants based on origin
  const variants = useMemo(() => {
    if (!origin) {
      // Fallback default animation
      return {
        initial: { opacity: 0, y: 16, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 20, scale: 0.96 },
      };
    }

    // Window center is viewport center
    const winCenterX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
    const winCenterY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;

    // Origin center
    const originCenterX = origin.left + origin.width / 2;
    const originCenterY = origin.top + origin.height / 2;

    // Delta from center to origin
    const deltaX = originCenterX - winCenterX;
    const deltaY = originCenterY - winCenterY;

    return {
      initial: { opacity: 0, x: deltaX, y: deltaY, scale: 0.2 },
      animate: { opacity: 1, x: 0, y: 0, scale: 1 },
      exit: { opacity: 0, x: deltaX, y: deltaY, scale: 0.2 },
    };
  }, [origin]);

  // Don't render if minimized
  if (minimized) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 p-4 pointer-events-none" style={{ zIndex }}>
      <motion.div
        data-testid={id ? `window-${id}` : undefined}
        layout={fsAnim ? true : "position"}
        layoutId={id}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className={
          (fullscreen || isMobile
            ? "pointer-events-auto absolute inset-0"
            : "pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2") +
          " rounded-lg border flex flex-col font-mono text-sm shadow-[0_10px_30px_rgba(0,0,0,0.4)]" +
          (customSize || hidePadding ? " p-0" : " p-3")
        }
        style={{
          borderColor: borderColor || (DEBUG_UI ? "#89b4fa" : "#27272a"), // zinc-800
          backgroundColor: backgroundColor || "#0d0d0d", // solid hex
          // On mobile, use margin to constrain it slightly if not fullscreen, or just fill
          // But "inset-0" class handles position, so we just need size adjustments
          width: (fullscreen || isMobile) ? "auto" : size.w,
          height: (fullscreen || isMobile) ? "auto" : size.h,
          right: isMobile ? 0 : undefined, // Ensure it stretches
          left: isMobile ? 0 : undefined,
          margin: isMobile ? "0.5rem" : undefined, // Add small margin on mobile
          marginTop: isMobile ? "4rem" : undefined, // Space from top
          marginBottom: isMobile ? "5rem" : undefined, // Space from bottom/dock
          outline: DEBUG_UI ? "1px dashed #89b4fa" : undefined,
          boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 20px 50px -12px rgba(0,0,0,0.7)",
        }}
        {...dragProps}
      >
        {!hideTitleBar && (
        <div
          className="flex items-center gap-2 pb-2 px-4 pt-3 cursor-move select-none group/window-controls"
          onDoubleClick={onToggleFullscreen || undefined}
          onPointerDown={(e) => dragControls.start(e)}
        >
          <div className="flex gap-2.5">
            <button
              type="button"
              title="Close"
              aria-label="Close"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={onClose}
              className="w-4 h-4 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/90 border border-[#e0443e] flex items-center justify-center text-black/50 opacity-100 hover:text-black/80 transition-all font-bold p-0 leading-none group-hover/window-controls:opacity-100"
            >
              <span className="opacity-0 group-hover/window-controls:opacity-100 transition-opacity text-[11px] relative top-[0.5px]">×</span>
            </button>
            <button
              type="button"
              title={disableMinimize ? "Minimize disabled" : "Minimize"}
              aria-label={disableMinimize ? "Minimize disabled" : "Minimize"}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={disableMinimize ? undefined : onMinimize}
              className={`w-4 h-4 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/90 border border-[#dea123] flex items-center justify-center text-black/50 opacity-100 hover:text-black/80 transition-all font-bold p-0 leading-none group-hover/window-controls:opacity-100 ${disableMinimize ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              <span className="opacity-0 group-hover/window-controls:opacity-100 transition-opacity text-[10px] relative bottom-[0.5px]">−</span>
            </button>
            <button
              type="button"
              title={onToggleFullscreen ? "Toggle fullscreen" : "Fullscreen disabled"}
              aria-label={onToggleFullscreen ? "Toggle fullscreen" : "Fullscreen disabled"}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={onToggleFullscreen}
              className={`w-4 h-4 rounded-full flex items-center justify-center text-black/50 opacity-100 hover:text-black/80 transition-all font-bold p-0 leading-none group-hover/window-controls:opacity-100 ${
                onToggleFullscreen 
                  ? 'bg-[#27c93f] hover:bg-[#27c93f]/90 border border-[#1aab29] cursor-pointer' 
                  : 'bg-zinc-600 border border-zinc-500 cursor-not-allowed opacity-40 hover:bg-zinc-600'
              }`}
            >
               <span className="opacity-0 group-hover/window-controls:opacity-100 transition-opacity rotate-45 transform origin-center flex items-center justify-center h-full w-full relative left-[0.5px] top-[0.5px]">
                  <svg width="8" height="8" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.5 3L5.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    <path d="M3 0.5L3 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
               </span>
            </button>
          </div>
          <span className="ml-4 text-[15px] font-medium text-zinc-300">
            {title}
          </span>
        </div>
        )}
        <div className={`flex-1 min-h-0 overflow-y-auto overscroll-contain scrollbar-hide ${customSize || hidePadding ? "" : "pr-2"}`} style={{ color: "#cdd6f4" }}>
          {children}
        </div>

        {/* Resize corner handle */}
        {!fullscreen && !customSize && (
          <div
            onPointerDown={startResize}
            className="absolute bottom-2 right-2 h-3 w-3 rounded-sm border border-zinc-600 bg-zinc-500 cursor-se-resize"
          />
        )}
      </motion.div>
    </div>
  );
}
