"use client";

import React from "react";
import { motion } from "motion/react";
import { getAllSkills, NOT_MY_STACK } from "@/lib/data";

/**
 * Skill label -> file in public/tech svg/. Anything unmapped renders as a
 * plain text chip, which is the common case for packages without a logo.
 */
const ICONS: Record<string, string> = {
  Flutter: "Flutter.svg",
  Dart: "Dart.svg",
  Kotlin: "Kotlin.svg",
  Java: "Java.svg",
  PHP: "PHP.svg",
  Zimperium: "Zimperium.svg",
  Laravel: "Laravel.svg",
  Livewire: "Livewire.svg",
  Oracle: "Oracle.svg",
  PostgreSQL: "PostgresSQL.svg",
  MySQL: "MySQL.svg",
  "SQL Server": "Microsoft-SQL-Server.svg",
  Firebase: "Firebase.svg",
  SQLite: "SQLite.svg",
  Docker: "Docker.svg",
  Linux: "Linux.svg",
  Nginx: "NGINX.svg",
  Git: "Git.svg",
  GitHub: "GitHub.svg",
  GitLab: "GitLab.svg",
  Postman: "Postman.svg",
  Swagger: "Swagger.svg",
  "React 18": "React.svg",
  TypeScript: "TypeScript.svg",
  JavaScript: "JavaScript.svg",
  Vite: "Vite.svg",
  "Tailwind CSS": "Tailwind-CSS.svg",
  HTML5: "HTML5.svg",
  CSS: "CSS3.svg",
  Bootstrap: "Bootstrap.svg",
  Jira: "Jira.svg",
  Trello: "Trello.svg",
};

/** The stack everything else hangs off — shown larger, up top. */
const CORE = ["Flutter", "Dart", "Laravel", "PHP", "Zimperium", "Docker"];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

function SkillChip({ label }: { label: string }) {
  const icon = ICONS[label];
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 pl-2 pr-3 py-1.5 text-[12.5px] text-zinc-700 hover:border-zinc-300 hover:bg-white transition-colors">
      {icon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/tech svg/${icon}`}
          alt=""
          aria-hidden="true"
          className="w-4 h-4 object-contain shrink-0"
        />
      ) : (
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 shrink-0 ml-1" />
      )}
      {label}
    </span>
  );
}

export default function SkillsWindow() {
  const categories = getAllSkills();
  const total = categories.reduce((n, c) => n + c.skills.length, 0);

  return (
    <div className="h-full flex flex-col relative z-50">
      <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-hide">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight mb-2">
              Skills &amp; Technologies
            </h2>
            <p className="text-zinc-600">
              {total} tools across {categories.length} disciplines — weighted toward Flutter on the
              front and Laravel on the back.
            </p>
          </motion.div>

          {/* Core stack */}
          <motion.div variants={fadeUp} className="mb-10">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {CORE.map((label) => (
                <div
                  key={label}
                  className="group flex flex-col items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 hover:border-red-200 hover:bg-white hover:-translate-y-1 transition-all duration-300"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/tech svg/${ICONS[label]}`}
                    alt=""
                    aria-hidden="true"
                    className="w-8 h-8 object-contain opacity-85 group-hover:opacity-100 transition-opacity"
                  />
                  <span className="text-[11px] font-medium text-zinc-600 group-hover:text-zinc-900 transition-colors text-center leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Categories */}
          <div className="space-y-8">
            {categories.map((cat) => (
              <motion.section key={cat.title} variants={fadeUp}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-4">
                  <h3 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-zinc-500">
                    {cat.title}
                  </h3>
                  {cat.note && <span className="text-[12px] text-zinc-400">{cat.note}</span>}
                  <div className="flex-1 h-px bg-zinc-200 min-w-8" />
                  <span className="text-[11px] font-mono text-zinc-400">{cat.skills.length}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((s) => (
                    <SkillChip key={s} label={s} />
                  ))}
                </div>
              </motion.section>
            ))}
          </div>

          {/* Honest limits */}
          {/* <motion.section
            variants={fadeUp}
            className="mt-12 rounded-2xl border border-zinc-200 bg-zinc-50 p-6"
          >
            <h3 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-zinc-500 mb-2">
              Not my stack
            </h3>
            <p className="text-[13px] text-zinc-600 leading-relaxed mb-4">
              Listed so the rest of this page stays credible. I have not worked seriously with
              these, and would rather say so than have you find out in an interview.
            </p>
            <div className="flex flex-wrap gap-2">
              {NOT_MY_STACK.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center rounded-full border border-dashed border-zinc-300 px-3 py-1.5 text-[12.5px] text-zinc-400"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.section> */}
        </motion.div>
      </div>
    </div>
  );
}
