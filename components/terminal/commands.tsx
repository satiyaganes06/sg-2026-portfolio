"use client";

import React from "react";
import dynamic from "next/dynamic";
import { MINECRAFT_MODELS, type MinecraftKind } from "@/components/three/constants";
import {
  getProject,
  getAllProjects,
  getAllExperience,
  getResume,
  getProfile,
  getProjectsCount,
  getAllSkills,
  getHobbies
} from "@/lib/data";

// Lazy load the 3D component with no SSR to avoid blocking hydration/initial render
const DynamicMinecraftSpawn = dynamic(() => import("./MinecraftSpawn"), {
  ssr: false,
  loading: () => <div className="text-zinc-500 text-sm">Loading 3D Module...</div>
});

// Lazy load the StarBlade game
const DynamicStarBladeGame = dynamic(() => import("./StarBladeGame"), {
  ssr: false,
  loading: () => <div className="text-zinc-500 text-sm">Loading StarBlade...</div>
});

export type ThemeName = "default" | "mocha";

export type Env = {
  setTheme: (name: ThemeName) => void;
  setZenMode?: (enabled: boolean) => void;
  zenMode?: boolean;
  setBannerVisible: (v: boolean) => void;
  setPrompt: (p: string) => void;
  open: (url: string) => void;
  run: (cmd: string) => void; // programmatically run a command from clickable UI
  onExit?: () => void; // callback to close the terminal window
  theme: ThemeName;
  prompt: string;
  bannerVisible: boolean;
};

export type CommandHandler = (args: string[], env: Env) => React.ReactNode;

// Data is now imported from centralized lib/data.ts

const Skills = () => {
  const skills = getAllSkills();

  return (
    <div className="space-y-1">
      <div className="text-zinc-100">Skills</div>
      <ul className="list-disc pl-6 text-zinc-300">
        {skills.map((category) => (
          <li key={category.title}>
            <span className="text-zinc-200">{category.title}:</span> {category.skills.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

function link(href: string, text?: string) {
  return (
    <a className="text-green-400 underline" href={href} target="_blank" rel="noreferrer">
      {text ?? href}
    </a>
  );
}

export const aliases: Record<string, string> = {
  work: "exp",
  play: "starblade",
  game: "starblade",
};

export const commands: Record<string, CommandHandler> = {
  help: () => (
    <div className="space-y-2">
      <div className="grid grid-cols-[140px_1fr] gap-x-4 gap-y-1 font-mono text-sm">
        <div className="text-green-400">help</div>
        <div>List all commands</div>
        <div className="text-green-400">about</div>
        <div>Who Am I? (use -f for full)</div>
        <div className="text-green-400">exp</div>
        <div>Places I have worked</div>
        <div className="text-green-400">skills</div>
        <div>My Tech Stack</div>
        <div className="text-green-400">projects</div>
        <div>View my projects (use -f for details)</div>
        <div className="text-green-400">contact</div>
        <div>Get in touch with me</div>
        <div className="text-green-400">resume</div>
        <div>View my resume</div>
        <div className="text-green-400">starblade</div>
        <div>Play StarBlade - Space Shooter</div>
        <div className="text-green-400">spawn</div>
        <div>It&#39;s a secret</div>
        <div className="text-green-400">clear</div>
        <div>Clear terminal (Ctrl/Cmd+L)</div>
        <div className="text-green-400">zen</div>
        <div>Toggle Zen Mode</div>
        <div className="text-green-400">exit</div>
        <div>Close terminal window</div>
      </div>
    </div>
  ),

  zen: (_args, env) => {
    if (env.setZenMode) {
        const newState = !env.zenMode;
        env.setZenMode(newState);
        return <div className="text-zinc-400">{newState ? "Entering Zen Mode... (Type 'zen' to exit)" : "Exiting Zen Mode..."}</div>;
    }
    return <div className="text-red-400">Zen Mode not available in this environment.</div>;
  },

  // about with optional -f flag for full details
  about: (args) => {
    const profile = getProfile();
    const fullMode = args.includes("-f") || args.includes("--full");
    
    if (fullMode) {
      return (
        <div className="space-y-2">
          <div className="text-zinc-100 font-semibold">{profile.name}</div>
          <div className="text-zinc-300">{profile.tagline}</div>
          <div className="text-zinc-400 whitespace-pre-wrap">{profile.about}</div>
          <div className="mt-3 space-y-1">
            <div className="text-zinc-100">Education</div>
            <div className="text-zinc-300">{profile.education.summary}</div>
          </div>
          <div className="mt-2 space-y-1">
            <div className="text-zinc-100">Status</div>
            <div className="text-zinc-300">{profile.contact.open_to}</div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-1">
        <div className="text-zinc-100 font-semibold">{profile.name}</div>
        <div className="text-zinc-300">{profile.tagline}</div>
        <div className="text-zinc-400">Use <span className="text-green-400">about -f</span> for full details</div>
      </div>
    );
  },

  // exp (experience) - alias: work
  exp: () => (
    <div className="space-y-1">
      <div className="text-zinc-100">Experience</div>
      <ul className="list-disc pl-6 text-zinc-300 space-y-1">
        {getAllExperience().map((exp, index) => (
          <li key={index}>
            <span className="text-zinc-200">{exp.company}</span> — {exp.title} ({exp.period})
          </li>
        ))}
        <li>Open-source / Personal projects — {getProjectsCount()}+ projects, focusing on web apps and tooling</li>
      </ul>
    </div>
  ),

  // skills (keep existing component)
  skills: () => <Skills />,

  // projects with -f flag for full details, or projects view <slug>
  projects: (args) => {
    const hasFullFlag = args.includes("-f") || args.includes("--full");
    const sub = (args[0] || "").toLowerCase();
    
    // Handle "projects view <slug>" command
    if (sub === "view") {
      const key = (args[1] || "").toLowerCase();
      const p = getProject(key);
      if (!p) return <div className="text-red-300">Usage: projects view &lt;slug|#&gt;</div>;
      return (
        <div className="space-y-1">
          <div className="text-zinc-100 font-semibold">{p.name}</div>
          <div className="text-zinc-300">{p.desc}</div>
          <div className="text-zinc-400">Tech: {p.tech.join(", ")}</div>
          <div className="space-x-3">
            {p.demo && link(p.demo, "demo")}
            {p.repo && link(p.repo, "repo")}
          </div>
        </div>
      );
    }
    
    // Full mode: show descriptions
    if (hasFullFlag) {
      return (
        <div className="space-y-1">
          <div className="text-zinc-100">Projects ({getProjectsCount()})</div>
          <ul className="list-disc pl-6 space-y-2">
            {getAllProjects().map((p, i) => (
              <li key={p.slug}>
                <div className="text-zinc-200 font-semibold">[{i + 1}] {p.name}</div>
                <div className="text-zinc-400">{p.desc}</div>
                <div className="text-zinc-500 text-sm">Tech: {p.tech.join(", ")}</div>
                <div className="space-x-3 mt-1">
                  {p.demo && link(p.demo, "demo")}
                  {p.repo && link(p.repo, "repo")}
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    
    // Default: simple list
    return (
      <div className="space-y-1">
        <div className="text-zinc-100">Projects ({getProjectsCount()})</div>
        <ul className="list-disc pl-6 space-y-1">
          {getAllProjects().map((p, i) => (
            <li key={p.slug}>
              <span className="text-zinc-200">[{i + 1}] {p.name}</span>{" "}
              {p.demo && link(p.demo, "demo")}
              {p.repo && <span className="ml-2">{link(p.repo, "repo")}</span>}
            </li>
          ))}
        </ul>
        <div className="text-zinc-500 text-sm mt-1">Use <span className="text-green-400">projects -f</span> for details or <span className="text-green-400">projects view &lt;slug&gt;</span></div>
      </div>
    );
  },

  // contact
  contact: () => {
    const profile = getProfile();
    const s = profile.socials;
    const lines = [
      <div key="gh">GitHub: {link(s.github)}</div>,
      <div key="li">LinkedIn: {link(s.linkedin)}</div>,
      ...(s.twitter ? [<div key="tw">Twitter/X: {link(s.twitter)}</div>] : []),
      ...(s.portfolio ? [<div key="pf">Portfolio: {link(s.portfolio)}</div>] : []),
      ...(s.resume ? [<div key="cv">Resume: {link(s.resume)}</div>] : []),
      ...(s.medium ? [<div key="md">Medium: {link(s.medium)}</div>] : []),
      ...(s.stackoverflow ? [<div key="so">Stack Overflow: {link(s.stackoverflow)}</div>] : []),
      ...(s.discord ? [<div key="dc">Discord: {link(s.discord)}</div>] : []),
      <div key="em">Email: {link(profile.contact.email_masked)}</div>,
      <div key="ph">Phone: {profile.contact.phone_masked}</div>,
    ];
    return (
      <div className="space-y-1">
        <div className="mt-2">
          <div className="text-zinc-100 text-sm">Socials & Contact</div>
          {lines}
        </div>
      </div>
    );
  },

  // resume: open in new tab
  resume: () => {
    const resume = getResume();
    const url = resume.url.startsWith("http") ? resume.url : `/${resume.url.replace(/^\/+/, "")}`;
    try {
      window.open(url, "_blank", "noopener,noreferrer");
    } catch { }
    return (
      <div className="space-y-1">
        <div className="text-zinc-100">Resume</div>
        <div>Opening resume in new tab...</div>
        <div className="text-zinc-500 text-sm">Last updated: {resume.lastUpdated}</div>
        <div className="mt-1">{link(url, "Click here if it didn't open")}</div>
      </div>
    );
  },

  // spawn: random or specific minecraft character
  spawn: (args) => {
    const arg = (args[0] || "").toLowerCase();
    const asKind = (MINECRAFT_MODELS as readonly string[]).includes(arg) ? (arg as MinecraftKind) : null;
    // Use dynamic component here
    return <DynamicMinecraftSpawn forcedKind={asKind} />;
  },

  // starblade: interactive space shooter game
  starblade: (_args, env) => {
    return <DynamicStarBladeGame onExit={() => env.run("clear")} />;
  },

  // exit: close the terminal window
  exit: (_args, env) => {
    if (env.onExit) {
      // If in zen mode, exit zen mode first to restore the desktop
      if (env.zenMode && env.setZenMode) {
        env.setZenMode(false);
      }
      // Small delay to show the message and allow zen mode to exit before closing
      setTimeout(() => env.onExit?.(), 300);
      return <div className="text-zinc-400">Closing terminal...</div>;
    }
    return <div className="text-red-400">Exit not available in this environment.</div>;
  },
};
