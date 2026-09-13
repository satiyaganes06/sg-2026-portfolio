"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Github,
  Lock,
  Play,
} from "lucide-react";
import { PROJECTS, type Project } from "@/lib/data";

/* --------------------------------------------------------------- helpers */

/** Deterministic hue per project, so placeholders stay stable across renders. */
function hueFor(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) % 360;
  return h;
}

function initialsFor(name: string): string {
  return name
    .replace(/[—–-].*$/, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/**
 * Screenshot with a generated fallback. Project images live in
 * public/projects/<slug>/ — until they exist, this paints a themed panel
 * instead of a broken image icon.
 */
function ProjectImage({
  project,
  src,
  className = "",
}: {
  project: Project;
  src?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const hue = hueFor(project.slug);

  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 ${className}`}
        style={{
          background: `linear-gradient(135deg, hsl(${hue} 42% 17%), hsl(${(hue + 45) % 360} 38% 9%))`,
        }}
      >
        <span className="text-3xl font-black tracking-tight text-white/25">
          {initialsFor(project.name)}
        </span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-white/20">
          {project.tech[0]}
        </span>
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={project.name}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
      loading="lazy"
    />
  );
}

function TechChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-1 text-[11px] text-zinc-600">
      {children}
    </span>
  );
}

function LinkButton({
  href,
  label,
  icon: Icon,
  primary = false,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-colors no-underline ${
        primary
          ? "bg-zinc-900 text-white hover:bg-zinc-800"
          : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
      <ArrowUpRight className="w-3 h-3 opacity-60" />
    </a>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap gap-2">
      {project.demo && <LinkButton href={project.demo} label="Preview" icon={Play} primary />}
      {project.repo && <LinkButton href={project.repo} label="Source" icon={Github} />}
      {project.links?.map((l) => (
        <LinkButton key={l.href} href={l.href} label={l.label} icon={Github} />
      ))}
      {project.sourcePrivate && (
        <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-[13px] text-zinc-400">
          <Lock className="w-3.5 h-3.5" />
          Private source
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ list */

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

function FeaturedCard({ project, onSelect }: { project: Project; onSelect: () => void }) {
  return (
    <motion.button
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      onClick={onSelect}
      className="group w-full text-left rounded-2xl border border-zinc-200 bg-zinc-50 overflow-hidden hover:border-red-200 transition-colors"
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-[42%] h-44 md:h-auto overflow-hidden shrink-0">
          <ProjectImage
            project={project}
            src={project.images?.[0]}
            className="w-full h-full min-h-[176px] group-hover:scale-[1.04] transition-transform duration-500"
          />
        </div>
        <div className="flex-1 p-5 md:p-6 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded-full bg-red-50 text-red-600 px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold">
              Featured
            </span>
            {project.period && (
              <span className="text-[11px] font-mono text-zinc-400">{project.period}</span>
            )}
          </div>
          <h3 className="text-zinc-900 font-bold text-lg mb-1.5 group-hover:text-red-600 transition-colors">
            {project.name}
          </h3>
          {project.role && <p className="text-[12px] text-zinc-500 mb-2.5">{project.role}</p>}
          <p className="text-[13.5px] text-zinc-600 leading-relaxed mb-4">{project.desc}</p>
          <div className="flex flex-wrap gap-1.5">
            {project.tech.slice(0, 5).map((t) => (
              <TechChip key={t}>{t}</TechChip>
            ))}
            {project.tech.length > 5 && <TechChip>+{project.tech.length - 5}</TechChip>}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function GridCard({ project, onSelect }: { project: Project; onSelect: () => void }) {
  return (
    <motion.button
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      onClick={onSelect}
      className="group text-left rounded-2xl border border-zinc-200 bg-zinc-50 overflow-hidden hover:border-red-200 transition-colors flex flex-col"
    >
      <div className="h-32 overflow-hidden">
        <ProjectImage
          project={project}
          src={project.images?.[0]}
          className="w-full h-full group-hover:scale-[1.06] transition-transform duration-500"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-zinc-900 font-bold text-[14.5px] mb-1 group-hover:text-red-600 transition-colors leading-snug">
          {project.name}
        </h3>
        {project.period && (
          <p className="text-[11px] font-mono text-zinc-400 mb-2">{project.period}</p>
        )}
        <p className="text-[12.5px] text-zinc-600 leading-relaxed mb-3 flex-1">{project.desc}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tech.slice(0, 3).map((t) => (
            <TechChip key={t}>{t}</TechChip>
          ))}
        </div>
      </div>
    </motion.button>
  );
}

function ListView({ onSelect }: { onSelect: (p: Project) => void }) {
  const featured = PROJECTS.filter((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);

  return (
    <motion.div
      key="list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex-1 overflow-y-auto scrollbar-hide"
    >
      <div className="p-6 md:p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight mb-2">
            Selected Work
          </h2>
          <p className="text-zinc-600">
            {PROJECTS.length} projects — government platforms, banking security, and things I built
            on my own. Click any one for the detail.
          </p>
        </div>

        <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4 mb-10">
          {featured.map((p) => (
            <FeaturedCard key={p.slug} project={p} onSelect={() => onSelect(p)} />
          ))}
        </motion.div>

        <div className="flex items-center gap-3 mb-5">
          <h3 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-zinc-600">
            Everything else
          </h3>
          <div className="flex-1 h-px bg-zinc-200" />
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {rest.map((p) => (
            <GridCard key={p.slug} project={p} onSelect={() => onSelect(p)} />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ---------------------------------------------------------------- detail */

function Gallery({ project }: { project: Project }) {
  const images = project.images ?? [];
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const go = (delta: number) => {
    setDirection(delta);
    setIndex((i) => (i + delta + images.length) % images.length);
  };

  const multiple = images.length > 1;

  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden border border-zinc-200 bg-black aspect-[16/9]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 40 : direction < 0 ? -40 : 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <ProjectImage project={project} src={images[index]} className="w-full h-full" />
          </motion.div>
        </AnimatePresence>

        {multiple && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full bg-black/60 border border-white/15 text-white hover:bg-black/85 transition-colors backdrop-blur-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full bg-black/60 border border-white/15 text-white hover:bg-black/85 transition-colors backdrop-blur-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 right-3 rounded-full bg-black/70 border border-white/10 px-2.5 py-1 text-[11px] font-mono text-zinc-300 backdrop-blur-sm">
              {index + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {multiple && (
        <div className="flex gap-2 mt-3">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className={`h-14 w-20 rounded-lg overflow-hidden border transition-all ${
                i === index
                  ? "border-red-500/60 opacity-100"
                  : "border-zinc-200 opacity-50 hover:opacity-85"
              }`}
            >
              <ProjectImage project={project} src={img} className="w-full h-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DetailView({ project, onBack }: { project: Project; onBack: () => void }) {
  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex-1 overflow-y-auto scrollbar-hide"
    >
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-zinc-200 px-6 md:px-8 py-3.5">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[13px] text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All projects
        </button>
      </div>

      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            {project.period && (
              <span className="text-[11px] font-mono text-zinc-500">{project.period}</span>
            )}
            {project.role && (
              <>
                <span className="text-zinc-300">·</span>
                <span className="text-[12px] text-zinc-500">{project.role}</span>
              </>
            )}
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight mb-3">
            {project.name}
          </h2>
          <p className="text-[15px] text-zinc-600 leading-relaxed">
            {project.summary ?? project.desc}
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <Gallery project={project} />
        </motion.div>

        {project.highlights && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <h3 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-zinc-600">
                What I built
              </h3>
              <div className="flex-1 h-px bg-zinc-200" />
            </div>
            <ul className="space-y-3">
              {project.highlights.map((h, i) => (
                <li key={i} className="flex gap-3.5">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                  <span className="text-[14px] text-zinc-600 leading-relaxed">{h}</span>
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <h3 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-zinc-600">
              Built with
            </h3>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <TechChip key={t}>{t}</TechChip>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border-t border-zinc-200 pt-7"
        >
          <ProjectLinks project={project} />
        </motion.section>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ root */

export default function ProjectsWindow() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <div className="h-full flex flex-col relative z-50">
      <AnimatePresence mode="wait">
        {active ? (
          <DetailView project={active} onBack={() => setActive(null)} />
        ) : (
          <ListView onSelect={setActive} />
        )}
      </AnimatePresence>
    </div>
  );
}
