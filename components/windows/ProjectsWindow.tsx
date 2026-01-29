"use client";

import React from "react";
import { PROJECTS } from "@/lib/data";

export default function ProjectsWindow() {
  return (
    <div className="h-full flex flex-col relative z-50">
      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-3 text-white tracking-tight">Showcasing My Work</h2>
            <p className="text-zinc-400 text-lg">A showcase of my recent work and side projects</p>
          </div>
          
          <div className="flex flex-col gap-4">
            {PROJECTS.map((p) => (
            <div key={p.slug} className="group relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-white/10 hover:bg-zinc-900 transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-white font-bold text-lg group-hover:text-red-400 transition-colors">{p.name}</h3>
                </div>
                <p className="text-zinc-400 text-sm mb-4">{p.desc}</p>
                 <div className="flex gap-2">
                    {p.demo && (
                      <a href={p.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-all border border-white/5 hover:border-red-500/30 group/btn">
                        <svg className="w-3.5 h-3.5 text-zinc-400 group-hover/btn:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        <span>Preview</span>
                      </a>
                    )}
                    {p.repo && (
                      <a href={p.repo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-medium transition-all border border-white/5 hover:border-white/20">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                        <span>Source</span>
                      </a>
                    )}
                   </div>
              </div>
              
                <div className="flex flex-wrap lg:justify-end gap-2 w-full lg:w-auto lg:max-w-[300px] shrink-0 lg:ml-auto mt-4 lg:mt-0">
                  {p.tech.map(t => {
                    const iconMap: Record<string, string> = {
                      "Bash": "Bash.svg", "C": "C.svg", "C++": "C++-(CPlusPlus).svg", "Java": "Java.svg",
                      "TypeScript": "TypeScript.svg", "React": "React.svg", "Next.js": "Next.js.svg",
                      "Tailwind": "Tailwind-CSS.svg", "Tailwind CSS": "Tailwind-CSS.svg", "Sass": "Sass.svg",
                      "Three.js": "Three.js.svg", "Node.js": "Node.js.svg", "Express": "Express.svg",
                      "MongoDB": "MongoDB.svg", "MySQL": "MySQL.svg", "SQLite": "SQLite.svg",
                      "Flutter": "Flutter.svg", "Dart": "Dart.svg", "Laravel": "Laravel.svg", "Kotlin": "Kotlin.svg",
                      "PHP": "PHP.svg", "Firebase": "Firebase.svg", "Material-UI": "Material-UI.svg",
                      "Bootstrap": "Bootstrap.svg", "Bootstrap 5": "Bootstrap.svg", "HTML": "HTML5.svg", "HTML5": "HTML5.svg",
                      "CSS": "CSS3.svg", "JavaScript": "JavaScript.svg", "Git": "Git.svg", "GitLab": "GitLab.svg",
                      "Postman": "Postman.svg", "Jest": "Jest.svg", "Vercel": "Vercel.svg", "Netlify": "Netlify.svg",
                      "Tauri": "Tauri.svg", "Electron": "Electron.svg", "AWS": "AWS.svg", "Docker": "Docker.svg",
                      "Linux": "Linux.svg", "Figma": "Figma.svg", "Oracle": "Oracle.svg", "Livewire": "Livewire.svg",
                      "PostgreSQL": "PostgresSQL.svg", "REST API": "JSON.svg", "RESTful API": "JSON.svg",
                    };

                    const iconFile = iconMap[t];
                    // Flexible check for tech names that might vary
                    const resolvedIcon = iconFile || Object.entries(iconMap).find(([k]) => t.includes(k) || k.includes(t))?.[1];

                    const diffIcon = ["Next.js", "Express", "Three.js", "Bash", "AWS", "Vercel", "Netlify", "Flutter", "Dart", "Laravel", "Firebase"].some(k => t.includes(k));

                    if (!resolvedIcon) return null;

                    return (
                        <div key={t} className="w-8 h-8 flex items-center justify-center bg-zinc-900 border border-white/5 rounded-lg hover:border-white/20 transition-all hover:-translate-y-0.5" title={t}>
                            <img 
                              src={`/tech svg/${resolvedIcon}`} 
                              alt={t}
                              className={`w-4 h-4 object-contain ${diffIcon ? "brightness-0 invert" : ""}`}
                            />
                        </div>
                    );
                  })}
               </div>
            </div>
            ))}
            {PROJECTS.length === 0 && (
              <div className="text-gray-400 text-center py-12">No projects yet. Add some in commands.tsx.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
