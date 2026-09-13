"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Award as AwardIcon,
  Download,
  GraduationCap,
  Languages as LanguagesIcon,
  Mail,
  MapPin,
} from "lucide-react";
import {
  getAllExperience,
  getAwards,
  getEducation,
  getFocusAreas,
  getHobbies,
  getProfile,
  getResume,
  getStats,
  getWorkingStyle,
} from "@/lib/data";

export type OpenAppFn = (app: "about" | "projects" | "skills" | "contact") => void;

type View = "overview" | "experience" | "credentials";

const TABS: { id: View; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "experience", label: "Experience" },
  { id: "credentials", label: "Credentials" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

/** Small uppercase section heading with a hairline rule. */
function SectionTitle({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      {Icon && <Icon className="w-4 h-4 text-red-500/80 shrink-0" />}
      <h3 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-zinc-600">
        {children}
      </h3>
      <div className="flex-1 h-px bg-zinc-200" />
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-1 text-[11px] text-zinc-600">
      {children}
    </span>
  );
}

export default function AboutHome({ onOpen }: { onOpen: OpenAppFn }) {
  const [view, setView] = useState<View>("overview");
  const [isMobile, setIsMobile] = useState(false);

  const profile = getProfile();
  const resume = getResume();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const pad = isMobile ? "px-4 py-6" : "px-8 py-10";

  return (
    <div className="h-full w-full relative z-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur-md">
        <div className={`flex items-center justify-between gap-4 ${isMobile ? "px-4" : "px-8"} py-3.5`}>
          <h1 className="text-lg font-bold text-zinc-900 shrink-0">About</h1>
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                className={`px-3 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
                  view === t.id
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={pad}>
        <div className="max-w-3xl mx-auto">
          {view === "overview" && (
            <Overview
              isMobile={isMobile}
              onOpen={onOpen}
              profile={profile}
              resumeUrl={resume.url}
              resumeFilename={resume.filename}
            />
          )}
          {view === "experience" && <ExperienceView />}
          {view === "credentials" && <CredentialsView />}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Overview */

function Overview({
  isMobile,
  onOpen,
  profile,
  resumeUrl,
  resumeFilename,
}: {
  isMobile: boolean;
  onOpen: OpenAppFn;
  profile: ReturnType<typeof getProfile>;
  resumeUrl: string;
  resumeFilename: string;
}) {
  const stats = getStats();
  const focusAreas = getFocusAreas();
  const workingStyle = getWorkingStyle();
  const hobbies = getHobbies();

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-12">
      {/* Identity */}
      <motion.section variants={fadeUp}>
        <div className={`flex ${isMobile ? "flex-col" : "flex-row items-end"} gap-6 mb-7`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/my_photo.png"
            alt={profile.name}
            className={`${
              isMobile ? "w-24 h-24" : "w-36 h-36"
            } rounded-2xl object-cover border border-zinc-200 shadow-2xl shrink-0`}
            loading="eager"
          />
          <div className="min-w-0">
            <h2
              className={`${
                isMobile ? "text-3xl" : "text-[42px]"
              } font-black text-zinc-900 tracking-tight leading-[1.05] mb-2`}
            >
              Hi, I&apos;m Satiya Ganes
            </h2>
            <p className="text-lg text-zinc-700 mb-3">
              Full Stack Mobile Developer, Specialist in Mobile Security.
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-zinc-500">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {profile.location}
              </span>
              <span className="text-zinc-300">·</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {profile.contact.open_to}
              </span>
            </div>
          </div>
        </div>

        <p className="text-zinc-600 leading-relaxed text-[15px] max-w-2xl">{profile.about}</p>
      </motion.section>

      {/* Stats */}
      <motion.section variants={fadeUp}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-200 border border-zinc-200 rounded-2xl overflow-hidden">
          {stats.map((s) => (
            <div key={s.label} className="bg-white p-4 md:p-5">
              <div className="text-2xl md:text-3xl font-black text-zinc-900 mb-1">{s.value}</div>
              <div className="text-[11px] text-zinc-500 leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* What I do */}
      <motion.section variants={fadeUp}>
        <SectionTitle>What I do</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {focusAreas.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-zinc-200 bg-zinc-50 p-5 hover:border-red-200 hover:bg-zinc-100 transition-colors"
            >
              <h4 className="text-zinc-900 font-bold mb-2 group-hover:text-red-600 transition-colors">
                {f.title}
              </h4>
              <p className="text-[13px] text-zinc-600 leading-relaxed mb-4">{f.summary}</p>
              <div className="flex flex-wrap gap-1.5">
                {f.tools.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* How I work */}
      <motion.section variants={fadeUp}>
        <SectionTitle>How I work</SectionTitle>
        <ul className="space-y-3.5">
          {workingStyle.map((w, i) => (
            <li key={i} className="flex gap-3.5">
              <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
              <span className="text-[14px] text-zinc-600 leading-relaxed">{w}</span>
            </li>
          ))}
        </ul>
      </motion.section>

      {/* Languages */}
      {profile.languages && (
        <motion.section variants={fadeUp}>
          <SectionTitle icon={LanguagesIcon}>Languages</SectionTitle>
          <div className="flex flex-wrap gap-2.5">
            {profile.languages.map((l) => (
              <div
                key={l.name}
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5"
              >
                <div className="text-[14px] text-zinc-900 font-medium">{l.name}</div>
                <div className="text-[11px] text-zinc-500">{l.level}</div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Away from the keyboard */}
      <motion.section variants={fadeUp}>
        <SectionTitle>Away from the keyboard</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {hobbies.map((h, i) => (
            <span
              key={i}
              className="rounded-full border border-zinc-200 bg-zinc-50 px-3.5 py-1.5 text-[13px] text-zinc-600"
            >
              {["🧱", "🧩", "🪵", "⚽", "🏸"][i] ?? "•"} {h}
            </span>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section variants={fadeUp} className="border-t border-zinc-200 pt-8">
        <div className="flex flex-wrap gap-3 mb-6">
          <a
            href={resumeUrl}
            download={resumeFilename}
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 text-white px-5 py-2.5 text-[14px] font-bold hover:bg-zinc-800 transition-colors no-underline"
          >
            <Download className="w-4 h-4" />
            Download CV
          </a>
          <a
            href={`mailto:${profile.contact.email_masked}`}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-300 text-zinc-700 px-5 py-2.5 text-[14px] font-medium hover:bg-zinc-100 hover:text-zinc-900 transition-colors no-underline"
          >
            <Mail className="w-4 h-4" />
            {profile.contact.email_masked}
          </a>
        </div>

        <div className="flex flex-wrap gap-2">
          {(["projects", "skills", "contact"] as const).map((app) => (
            <button
              key={app}
              onClick={() => onOpen(app)}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-4 py-2 text-[13px] text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 transition-colors capitalize"
            >
              Open {app}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}

/* -------------------------------------------------------------- Experience */

function ExperienceView() {
  const experience = getAllExperience();

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="relative">
      {/* Timeline rail */}
      <div className="absolute left-[5px] top-2 bottom-2 w-px bg-zinc-200 hidden sm:block" />

      <div className="space-y-10">
        {experience.map((exp, i) => (
          <motion.article key={i} variants={fadeUp} className="relative sm:pl-8 group">
            {/* Node */}
            <span
              className={`absolute left-0 top-[7px] h-[11px] w-[11px] rounded-full border-2 hidden sm:block ${
                exp.current
                  ? "bg-red-500 border-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.15)]"
                  : "bg-white border-zinc-300 group-hover:border-red-400 transition-colors"
              }`}
            />

            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1.5">
              <h3 className="text-[17px] font-bold text-zinc-900 group-hover:text-red-600 transition-colors">
                {exp.title}
              </h3>
              <span className="text-[12px] text-zinc-500 font-mono shrink-0">{exp.period}</span>
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-zinc-600 mb-3">
              <span className="font-medium text-zinc-700">{exp.company}</span>
              {exp.location && (
                <>
                  <span className="text-zinc-300">·</span>
                  <span className="text-zinc-500">{exp.location}</span>
                </>
              )}
              {exp.current && (
                <span className="rounded-full bg-red-50 text-red-600 px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold">
                  Current
                </span>
              )}
            </div>

            <p className="text-[14px] text-zinc-600 leading-relaxed mb-4">{exp.description}</p>

            {exp.achievements && (
              <ul className="space-y-2 mb-4">
                {exp.achievements.map((a, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="mt-[7px] h-1 w-1 rounded-full bg-zinc-300 shrink-0" />
                    <span className="text-[13.5px] text-zinc-600 leading-relaxed">{a}</span>
                  </li>
                ))}
              </ul>
            )}

            {exp.tech && (
              <div className="flex flex-wrap gap-1.5">
                {exp.tech.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------- Credentials */

function CredentialsView() {
  const education = getEducation();
  const awards = getAwards();

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-12">
      <motion.section variants={fadeUp}>
        <SectionTitle icon={GraduationCap}>Education</SectionTitle>
        <div className="space-y-4">
          {education.map((e) => (
            <div
              key={e.degree}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 hover:border-zinc-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1.5">
                <h4 className="text-zinc-900 font-bold text-[15px]">{e.degree}</h4>
                <span className="text-[12px] text-zinc-500 font-mono shrink-0">{e.period}</span>
              </div>
              <p className="text-[13px] text-zinc-600">{e.institution}</p>
              {e.note && <p className="text-[12px] text-zinc-400 mt-1">{e.note}</p>}
              {e.thesis && (
                <p className="text-[13px] text-zinc-500 mt-3 pl-3 border-l border-zinc-200 leading-relaxed">
                  <span className="text-zinc-400">Thesis — </span>
                  {e.thesis}
                </p>
              )}
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section variants={fadeUp}>
        <SectionTitle icon={AwardIcon}>Honours &amp; Awards</SectionTitle>
        <div className="space-y-3">
          {awards.map((a, i) => (
            <div
              key={i}
              className="group flex gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 hover:border-red-200 transition-colors"
            >
              <div className="text-[11px] font-mono text-zinc-400 pt-1 shrink-0 w-9">{a.year}</div>
              <div className="min-w-0">
                <h4 className="text-zinc-900 font-bold text-[14.5px] group-hover:text-red-600 transition-colors">
                  {a.title}
                </h4>
                {a.subtitle && (
                  <p className="text-[13px] text-zinc-500 mt-1 leading-relaxed">{a.subtitle}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
