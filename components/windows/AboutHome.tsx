"use client";

import React, { useEffect, useState } from "react";
import ExperienceCard from "./ExperienceCard";
import { getAllExperience, getResume, getProfile, getHobbies, getAwards } from "@/lib/data";
import { motion } from "motion/react";

export type OpenAppFn = (app: "about" | "projects" | "skills" | "contact") => void;

type View = "about" | "experience";

export default function AboutHome({ onOpen }: { onOpen: OpenAppFn }) {
  const [currentView, setCurrentView] = useState<View>("about");

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Load Google Fonts dynamically
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Bevan:ital@0;1&family=Rammetto+One&family=Roboto+Slab:wght@400..900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const renderAbout = () => {
    const resume = getResume();
    const profile = getProfile();

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05 // Faster stagger
        }
      }
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 10 }, // Reduced y distance for subtler pop-in
      visible: { opacity: 1, y: 0 }
    };

    return (
      <div className="flex flex-col relative z-50 pb-6">
        {/* Header with CTA buttons */}
        <div className={`sticky top-0 z-50 flex ${isMobile ? 'flex-col gap-3 items-start' : 'flex-row items-center justify-between'} px-6 py-4 border-b border-white/10 bg-[#0d0d0d]/80 backdrop-blur-md`}>
          <h1 className="text-2xl font-bold text-white">About</h1>
          <div className={`flex flex-row ${isMobile ? 'overflow-x-auto w-full pb-1 scrollbar-hide' : 'gap-2'}`}>
            <motion.button
              onClick={() => setCurrentView("experience")}
              className={`text-zinc-400 hover:text-white px-3 py-1.5 transition-colors font-medium text-sm whitespace-nowrap ${isMobile ? 'bg-white/5 rounded-full mr-2' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Experience
            </motion.button>

            <motion.button
              onClick={() => onOpen("projects")}
              className={`text-zinc-400 hover:text-white px-3 py-1.5 transition-colors font-medium text-sm whitespace-nowrap ${isMobile ? 'bg-white/5 rounded-full mr-2' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Projects
            </motion.button>

            <motion.button
              onClick={() => onOpen("skills")}
              className={`text-zinc-400 hover:text-white px-3 py-1.5 transition-colors font-medium text-sm whitespace-nowrap ${isMobile ? 'bg-white/5 rounded-full mr-2' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Skills
            </motion.button>

            <motion.button
              onClick={() => onOpen("contact")}
              className={`text-zinc-400 hover:text-white px-3 py-1.5 transition-colors font-medium text-sm whitespace-nowrap ${isMobile ? 'bg-white/5 rounded-full' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className={isMobile ? "p-4" : "p-6"}>
          <motion.div
            className="max-w-4xl mx-auto space-y-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Hero Welcome */}
            <motion.div
              variants={itemVariants}
              className={isMobile ? "pl-0" : "pl-2"}
            >
                <div className="mb-6">
                  <h2 className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-black text-white mb-4 tracking-tight`}>Hi, I&apos;m {profile.name}!</h2>
                  <p className={`${isMobile ? 'text-xl' : 'text-2xl'} text-zinc-400 font-light max-w-2xl`}>{profile.tagline}</p>
                </div>

                <p className="text-zinc-400 leading-relaxed text-lg mb-8 max-w-2xl">
                  {profile.about}
                </p>

                <div className="flex flex-col sm:flex-row gap-6 mt-8 border-t border-white/5 pt-8">
                    <motion.a
                        href={resume.url}
                        download={resume.filename}
                        className="group relative inline-flex items-center gap-3 px-8 py-3 bg-white text-black rounded-full font-bold tracking-wide overflow-hidden hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-zinc-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download CV
                        </span>
                    </motion.a>

                    <a
                      href={`mailto:${profile.contact.email_masked}`}
                      className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors self-center font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {profile.contact.email_masked}
                    </a>
                </div>
            </motion.div>

            {/* About Me Section */}
            <motion.div variants={itemVariants} className={isMobile ? "ml-0" : "pl-2 border-l-2 border-white/10 ml-1"}>
              <div className={isMobile ? "pl-0 space-y-4" : "pl-6 space-y-4"}>
                  <h2 className="text-2xl font-bold text-white mb-4">My Journey</h2>
                  <div className="space-y-4 text-zinc-400 leading-relaxed max-w-3xl">
                    <p>{profile.education.summary}</p>
                  </div>
              </div>
            </motion.div>

            {/* Hobbies & Interests */}
            <motion.div variants={itemVariants} className={isMobile ? "pl-0" : "pl-2"}>
              <h2 className="text-2xl font-bold text-white mb-6">What I Love To Do</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 max-w-3xl">
                {getHobbies().map((hobby, i) => (
                  <div key={i} className="group">
                    <h4 className="font-medium text-zinc-200 mb-1 flex items-center gap-2 group-hover:text-red-400 transition-colors">
                      <span>{["☕", "📖", "🎵", "🎬", "✨"][i] ?? "•"}</span> {hobby}
                    </h4>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Awards */}
            <motion.div variants={itemVariants} className={isMobile ? "pl-0" : "pl-2"}>
              <h2 className="text-2xl font-bold text-white mb-6">Awards</h2>
              <ul className="space-y-3 max-w-3xl">
                {getAwards().map((a, i) => (
                  <li key={i} className="text-zinc-400 text-sm pl-2 border-l-2 border-white/10">
                    <span className="text-zinc-200 font-medium">{a.title}</span>
                    {a.subtitle && <p className="mt-0.5 text-zinc-500">{a.subtitle}</p>}
                  </li>
                ))}
              </ul>
            </motion.div>

          </motion.div>
        </div>
      </div>
    );
  };


  const renderExperience = () => {
    const experience = getAllExperience();

    return (
      <div className="flex flex-col relative z-50 pb-6">
        <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0d0d]/80 backdrop-blur-md">
          <h2 className="text-xl font-bold text-white">Experience</h2>
          <button
            className="text-zinc-400 hover:text-white transition-colors text-sm font-medium"
            onClick={() => setCurrentView("about")}
          >
            ← Back
          </button>
        </div>

        <div className={isMobile ? "p-4" : "p-6"}>
          <div className="max-w-4xl mx-auto space-y-4">
            {experience.map((exp, index) => (
              <ExperienceCard
                key={index}
                title={exp.title}
                company={exp.company}
                duration={exp.period}
                location={exp.location}
                description={exp.description}
                achievements={exp.achievements}
                isCurrent={exp.period.includes("Present")}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full">
      {currentView === "about" && renderAbout()}
      {currentView === "experience" && renderExperience()}
    </div>
  );
}
