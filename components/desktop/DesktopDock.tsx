"use client"

import React from "react"
import { Dock, DockIcon } from "@/components/ui/dock"
import {
    AboutIcon,
    ProjectsIcon,
    SkillsIcon,
    ContactIcon,
    ShortenLinkIcon,
    TerminalIcon,
} from "./DesktopIcons"
import { ResponsiveConfig } from "@/lib/responsive"
import { DockApp, WindowAppType } from "./types"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const dockApps: DockApp[] = [
    { id: "about", name: "About", icon: "about", appType: "about" },
    { id: "projects", name: "Projects", icon: "projects", appType: "projects" },
    { id: "skills", name: "Skills", icon: "skills", appType: "skills" },
    { id: "contact", name: "Contact", icon: "contact", appType: "contact" },
    { id: "terminal", name: "Terminal", icon: "terminal", appType: "terminal" },
    { id: "shorten", name: "Shorten Link", icon: "shorten", appType: "shorten" },
]

interface DesktopDockProps {
    openWindows: Record<WindowAppType, boolean>
    responsiveConfig: ResponsiveConfig
    width: number
    onAppClick: (app: DockApp, rect: DOMRect) => void
    items?: DockApp[]
}

const DesktopDock: React.FC<DesktopDockProps> = ({
    openWindows,
    responsiveConfig,
    width,
    onAppClick,
    items,
}) => {
    const appsToRender = items || dockApps;

    return (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50">
           <TooltipProvider>
            <Dock magnification={80} distance={100} iconSize={56} layout className="border border-zinc-300 dark:border-zinc-700 bg-white/90 dark:bg-zinc-900 backdrop-blur-sm shadow-lg dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)] min-w-[300px] flex items-center justify-center">
              {appsToRender.map((app) => {
                 const isOpen = openWindows[app.appType as WindowAppType];
                 return (
                  <DockIcon key={app.id} className="bg-zinc-200/80 dark:bg-black/20 p-3 rounded-full size-10 sm:size-12 md:size-14">
                     <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                              className="size-full flex items-center justify-center cursor-pointer relative"
                              onClick={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  onAppClick(app, rect);
                              }}
                          >
                           <div className="size-8">
                            {app.icon === "about" && <AboutIcon />}
                            {app.icon === "projects" && <ProjectsIcon />}
                            {app.icon === "skills" && <SkillsIcon />}
                            {app.icon === "contact" && <ContactIcon />}
                            {app.icon === "terminal" && <TerminalIcon />}
                            {app.icon === "shorten" && <ShortenLinkIcon />}
                           </div>
                           {/* Active Indicator */}
                            {isOpen && (
                                <div className="absolute -bottom-2 w-1 h-1 bg-zinc-600 dark:bg-white/80 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.3)] dark:shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{app.name}</p>
                        </TooltipContent>
                      </Tooltip>
                  </DockIcon>
                )
              })}
            </Dock>
          </TooltipProvider>
        </div>
    )
}

export default DesktopDock
