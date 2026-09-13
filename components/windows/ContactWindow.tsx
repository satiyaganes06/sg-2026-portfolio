"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  Check,
  Copy,
  Download,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Plane,
} from "lucide-react";
import { getProfile, getResume } from "@/lib/data";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

/** Email / phone row: opens the handler, with a separate copy button. */
function DirectRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — the link still works */
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 hover:border-zinc-300 hover:bg-white transition-colors">
      <Icon className="w-4 h-4 text-zinc-400 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="text-[11px] uppercase tracking-wider text-zinc-400">{label}</div>
        <a
          href={href}
          className="text-[14px] text-zinc-900 font-medium hover:text-red-600 transition-colors no-underline break-all"
        >
          {value}
        </a>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label.toLowerCase()}`}
        className="shrink-0 grid place-items-center w-8 h-8 rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

function ProfileCard({
  icon: Icon,
  name,
  handle,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  handle: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 hover:border-red-200 hover:bg-white hover:-translate-y-0.5 transition-all no-underline"
    >
      <Icon className="w-4 h-4 text-zinc-500 group-hover:text-red-600 transition-colors shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-medium text-zinc-900">{name}</div>
        <div className="text-[12px] text-zinc-500 truncate">{handle}</div>
      </div>
      <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-red-600 transition-colors shrink-0" />
    </a>
  );
}

export default function ContactWindow() {
  const profile = getProfile();
  const resume = getResume();
  const s = profile.socials;

  const profiles = [
    { name: "GitHub", handle: `@${profile.handle}`, href: s.github, icon: Github },
    {
      name: "LinkedIn",
      handle: `/in/${s.linkedin.split("/in/")[1]?.replace(/\/$/, "") ?? profile.handle}`,
      href: s.linkedin,
      icon: Linkedin,
    },
    ...(s.xing ? [{ name: "Xing", handle: `@${profile.handle}`, href: s.xing, icon: Briefcase }] : []),
    ...(s.medium
      ? [{ name: "Medium", handle: s.medium.split("/").pop() ?? "Medium", href: s.medium, icon: BookOpen }]
      : []),
    ...(s.website
      ? [{ name: "Website", handle: s.website.replace(/^https?:\/\//, ""), href: s.website, icon: Globe }]
      : []),
  ];

  const workingLanguage = profile.languages?.find((l) => l.name === "English");

  return (
    <div className="h-full flex flex-col relative z-50">
      <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-hide">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="w-full max-w-2xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="mb-7">
            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight mb-2">
              Get in touch
            </h1>
            <p className="text-zinc-600">
              Actively looking for roles in Germany and the EU. Fastest way to reach me is email — I
              reply to everything.
            </p>
          </motion.div>

          {/* Availability */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-zinc-200 bg-zinc-50 divide-y divide-zinc-200 mb-7"
          >
            <div className="flex items-center gap-3 p-4">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-[14px] text-zinc-900 font-medium">
                {profile.contact.open_to}
              </span>
            </div>
            <div className="flex items-center gap-3 p-4">
              <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
              <span className="text-[14px] text-zinc-700">Based in {profile.location}</span>
            </div>
            <div className="flex items-start gap-3 p-4">
              <Plane className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <span className="text-[14px] text-zinc-700">{profile.locationNote}</span>
            </div>
            {workingLanguage && (
              <div className="flex items-start gap-3 p-4">
                <Globe className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span className="text-[14px] text-zinc-700">
                  Working language: English ({workingLanguage.level})
                  {profile.languages && profile.languages.length > 1 && (
                    <span className="text-zinc-500">
                      {" · also "}
                      {profile.languages
                        .filter((l) => l.name !== "English")
                        .map((l) => `${l.name} ${l.level}`)
                        .join(", ")}
                    </span>
                  )}
                </span>
              </div>
            )}
          </motion.div>

          {/* Direct */}
          <motion.section variants={fadeUp} className="mb-7">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-zinc-500">
                Direct
              </h2>
              <div className="flex-1 h-px bg-zinc-200" />
            </div>
            <div className="space-y-3">
              <DirectRow
                icon={Mail}
                label="Email"
                value={profile.contact.email_masked}
                href={`mailto:${profile.contact.email_masked}`}
              />
            </div>
          </motion.section>

          {/* Profiles */}
          <motion.section variants={fadeUp} className="mb-7">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-zinc-500">
                Elsewhere
              </h2>
              <div className="flex-1 h-px bg-zinc-200" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profiles.map((p) => (
                <ProfileCard key={p.name} {...p} />
              ))}
            </div>
          </motion.section>

          {/* Resume */}
          <motion.section variants={fadeUp} className="border-t border-zinc-200 pt-7">
            <a
              href={resume.url}
              download={resume.filename}
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 text-white px-5 py-2.5 text-[14px] font-bold hover:bg-zinc-800 transition-colors no-underline"
            >
              <Download className="w-4 h-4" />
              Download CV
            </a>
            <p className="text-[12px] text-zinc-400 mt-3">
              PDF · last updated {resume.lastUpdated}
            </p>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}
