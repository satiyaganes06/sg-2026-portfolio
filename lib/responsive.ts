// Responsive Design System for Desktop Page

export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4k';

export interface ResponsiveConfig {
  // Typography
  heroNameSize: string;
  heroTaglineSize: string;
  
  // Spacing
  heroLeft: number;
  heroTop: number;
  
  // Widget scaling
  widgetScale: number;
  widgetMargin: number;
  
  // Dock
  dockIconSize: number;
  dockButtonSize: number;
  dockFontSize: number;
  dockPadding: number;
  dockGap: number;
  
  // TechStackStrip
  techStripWidth: number;
  techStripRight: number;
  techStripBottom: number;
  
  // Layout
  leftMargin: number;
  rightMargin: number;
  topOffset: number;
  verticalGap: number;
  
  // Bento Grid
  gridCols: number;
  gridBaseW: number;
  gridBaseH: number;
  gridGap: number;
}

const breakpoints = {
  xs: 0,     // Small tablets in portrait
  sm: 640,   // Large tablets in portrait  
  md: 768,   // Small tablets in landscape
  lg: 1024,  // Desktop
  xl: 1280,  // Large desktop
  '2xl': 1536, // 2K displays
  '4k': 2560   // 4K displays
};

const configs: Record<ScreenSize, ResponsiveConfig> = {
  xs: {
    heroNameSize: '2rem',
    heroTaglineSize: '0.875rem',
    heroLeft: 12,
    heroTop: 120,
    widgetScale: 0.6,
    widgetMargin: 8,
    dockIconSize: 28,
    dockButtonSize: 36,
    dockFontSize: 6,
    dockPadding: 6,
    dockGap: 3,
    techStripWidth: 400,
    techStripRight: -100,
    techStripBottom: 60,
    leftMargin: 8,
    rightMargin: 8,
    topOffset: 70,
    verticalGap: 60,
    gridCols: 1,
    gridBaseW: 240,
    gridBaseH: 180,
    gridGap: 8,
  },
  
  sm: {
    heroNameSize: '2.25rem',
    heroTaglineSize: '0.9375rem',
    heroLeft: 16,
    heroTop: 140,
    widgetScale: 0.65,
    widgetMargin: 10,
    dockIconSize: 32,
    dockButtonSize: 40,
    dockFontSize: 7,
    dockPadding: 8,
    dockGap: 4,
    techStripWidth: 500,
    techStripRight: -120,
    techStripBottom: 70,
    leftMargin: 12,
    rightMargin: 12,
    topOffset: 75,
    verticalGap: 70,
    gridCols: 1,
    gridBaseW: 260,
    gridBaseH: 190,
    gridGap: 10,
  },
  
  md: {
    heroNameSize: '2.5rem',
    heroTaglineSize: '1rem',
    heroLeft: 20,
    heroTop: 160,
    widgetScale: 0.7,
    widgetMargin: 12,
    dockIconSize: 36,
    dockButtonSize: 44,
    dockFontSize: 7,
    dockPadding: 10,
    dockGap: 6,
    techStripWidth: 600,
    techStripRight: -150,
    techStripBottom: 80,
    leftMargin: 16,
    rightMargin: 16,
    topOffset: 80,
    verticalGap: 80,
    gridCols: 2,
    gridBaseW: 200,
    gridBaseH: 180,
    gridGap: 10,
  },
  
  lg: {
    heroNameSize: '3rem',
    heroTaglineSize: '1.25rem',
    heroLeft: 32,
    heroTop: 180,
    widgetScale: 0.8,
    widgetMargin: 16,
    dockIconSize: 44,
    dockButtonSize: 56,
    dockFontSize: 9,
    dockPadding: 14,
    dockGap: 8,
    techStripWidth: 700,
    techStripRight: -200,
    techStripBottom: 100,
    leftMargin: 24,
    rightMargin: 24,
    topOffset: 96,
    verticalGap: 100,
    gridCols: 2,
    gridBaseW: 240,
    gridBaseH: 200,
    gridGap: 12,
  },
  
  xl: {
    heroNameSize: '5rem',
    heroTaglineSize: '1.5rem',
    heroLeft: 40,
    heroTop: 200,
    widgetScale: 1,
    widgetMargin: 20,
    dockIconSize: 48,
    dockButtonSize: 64,
    dockFontSize: 10,
    dockPadding: 16,
    dockGap: 8,
    techStripWidth: 800,
    techStripRight: -250,
    techStripBottom: 120,
    leftMargin: 32,
    rightMargin: 32,
    topOffset: 112,
    verticalGap: 120,
    gridCols: 3,
    gridBaseW: 260,
    gridBaseH: 220,
    gridGap: 16,
  },
  
  '2xl': {
    heroNameSize: '7rem',
    heroTaglineSize: '1.75rem',
    heroLeft: 48,
    heroTop: 240,
    widgetScale: 1.2,
    widgetMargin: 24,
    dockIconSize: 56,
    dockButtonSize: 72,
    dockFontSize: 11,
    dockPadding: 18,
    dockGap: 10,
    techStripWidth: 1000,
    techStripRight: -300,
    techStripBottom: 140,
    leftMargin: 40,
    rightMargin: 40,
    topOffset: 128,
    verticalGap: 140,
    gridCols: 3,
    gridBaseW: 300,
    gridBaseH: 250,
    gridGap: 20,
  },
  
  '4k': {
    heroNameSize: '9rem',
    heroTaglineSize: '2rem',
    heroLeft: 64,
    heroTop: 300,
    widgetScale: 1.5,
    widgetMargin: 32,
    dockIconSize: 64,
    dockButtonSize: 80,
    dockFontSize: 12,
    dockPadding: 24,
    dockGap: 12,
    techStripWidth: 1200,
    techStripRight: -400,
    techStripBottom: 160,
    leftMargin: 48,
    rightMargin: 48,
    topOffset: 150,
    verticalGap: 160,
    gridCols: 4,
    gridBaseW: 320,
    gridBaseH: 280,
    gridGap: 24,
  },
};

export function getScreenSize(width: number): ScreenSize {
  if (width >= breakpoints['4k']) return '4k';
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
}

export function getResponsiveConfig(width: number, height: number): ResponsiveConfig {
  const screenSize = getScreenSize(width);
  const config = configs[screenSize];
  
  // Height-based adjustments
  if (height < 600) {
    return {
      ...config,
      heroTop: config.heroTop * 0.7,
      topOffset: config.topOffset * 0.8,
      verticalGap: config.verticalGap * 0.8,
      techStripBottom: config.techStripBottom * 0.7,
    };
  } else if (height < 800) {
    return {
      ...config,
      heroTop: config.heroTop * 0.85,
      topOffset: config.topOffset * 0.9,
      verticalGap: config.verticalGap * 0.9,
      techStripBottom: config.techStripBottom * 0.85,
    };
  }
  
  return config;
}

// Utility functions for specific responsive values
export const responsive = {
  fontSize: (config: ResponsiveConfig, type: 'heroName' | 'heroTagline') => {
    return type === 'heroName' ? config.heroNameSize : config.heroTaglineSize;
  },
  
  spacing: (config: ResponsiveConfig, type: 'heroLeft' | 'heroTop' | 'widgetMargin') => {
    switch (type) {
      case 'heroLeft': return config.heroLeft;
      case 'heroTop': return config.heroTop;
      case 'widgetMargin': return config.widgetMargin;
      default: return 0;
    }
  },
  
  widget: (config: ResponsiveConfig, baseWidth: number, baseHeight: number) => ({
    width: baseWidth * config.widgetScale,
    height: baseHeight * config.widgetScale,
    scale: config.widgetScale,
  }),
  
  dock: (config: ResponsiveConfig) => ({
    iconSize: config.dockIconSize,
    buttonSize: config.dockButtonSize,
    fontSize: config.dockFontSize,
    padding: config.dockPadding,
    gap: config.dockGap,
  }),
  
  techStrip: (config: ResponsiveConfig) => ({
    width: config.techStripWidth,
    right: config.techStripRight,
    bottom: config.techStripBottom,
  }),
  
  layout: (config: ResponsiveConfig) => ({
    leftMargin: config.leftMargin,
    rightMargin: config.rightMargin,
    topOffset: config.topOffset,
    verticalGap: config.verticalGap,
  }),
  
  grid: (config: ResponsiveConfig) => ({
    cols: config.gridCols,
    baseW: config.gridBaseW,
    baseH: config.gridBaseH,
    gap: config.gridGap,
  }),
};