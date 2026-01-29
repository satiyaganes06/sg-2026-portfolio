"use client";

import React from "react";

interface ExperienceCardProps {
  title: string;
  company: string;
  duration: string;
  location?: string;
  description: string;
  tech?: string[];
  achievements?: string[];
  isCurrent?: boolean;
}

export default function ExperienceCard({
  title,
  company,
  duration,
  location,
  description,
  tech,
  achievements,
  isCurrent = false,
}: ExperienceCardProps) {
  return (
    <div className="py-2 group">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
        <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">{title}</h3>
        <div className="text-zinc-500 text-sm font-mono">{duration}</div>
      </div>
      <div className="mb-3 text-zinc-400 font-medium text-sm flex flex-wrap items-center gap-x-2 gap-y-1">
        {company}
        {location && <span className="text-zinc-500">· {location}</span>}
        {isCurrent && (
            <span className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold">
                Current
            </span>
        )}
      </div>
      
      <p className="text-zinc-400 leading-relaxed mb-4 text-sm max-w-3xl">{description}</p>
      
      {tech && tech.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
           {tech.map((t, i) => (
             <span key={i} className="text-xs text-zinc-600 font-mono">
               #{t}
             </span>
           ))}
        </div>
      )}
      
      {achievements && achievements.length > 0 && (
        <ul className="space-y-1 mt-2">
          {achievements.map((achievement, index) => (
            <li key={index} className="text-zinc-400 text-sm flex items-start gap-2 pl-2 border-l border-zinc-800">
              <span className="leading-relaxed">{achievement}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
