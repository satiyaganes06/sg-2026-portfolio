"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TASKS, type Task } from "@/lib/data";

type Span = { cols?: 1 | 2 | 3; rows?: 1 | 2 | 3 | 4 };
function spanToClasses(span?: Span): string {
  if (!span) return "";
  const cls: string[] = [];
  if (span.cols === 1) cls.push("col-span-1");
  if (span.cols === 2) cls.push("col-span-2");
  if (span.cols === 3) cls.push("col-span-3");
  if (span.rows === 1) cls.push("row-span-1");
  if (span.rows === 2) cls.push("row-span-2");
  if (span.rows === 3) cls.push("row-span-3");
  if (span.rows === 4) cls.push("row-span-4");
  return cls.join(" ");
}

const tasks = TASKS;

export default function TodoWidget({ span }: { span?: Span }) {
  // Start with a deterministic task (0) to prevent hydration mismatch
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Set a random task immediately on client mount
    setCurrentIndex(Math.floor(Math.random() * tasks.length));

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        // Pick a random task different from the current one
        let nextIndex = Math.floor(Math.random() * tasks.length);
        if (tasks.length > 1) {
          while (nextIndex === prev) {
            nextIndex = Math.floor(Math.random() * tasks.length);
          }
        }
        return nextIndex;
      });
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative overflow-hidden rounded-xl border border-zinc-800 bg-[#0d0d0d] shadow-[0_10px_30px_rgba(0,0,0,0.4)] h-full w-full ${spanToClasses(span)}`}>
      <div className="h-full w-full p-4 flex flex-col">
        <div className="text-xs font-mono text-zinc-400 mb-3">My Life in a Nutshell</div>
        <div className="flex-1 flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-full flex items-center justify-center">
              <AnimatePresence>
                <motion.div
                  key={currentIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute text-lg font-bold font-mono text-zinc-200 text-center px-1"
                >
                  {tasks[currentIndex].title.split(" ").map((word, i) => {
                    // Check if word is fully uppercase, has letters, and length > 1 (to avoid I, A)
                    const isUppercase = word === word.toUpperCase() && /[A-Z]/.test(word) && word.length > 1;
                    return (
                      <React.Fragment key={i}>
                        {isUppercase ? (
                          <span className="text-red-500">{word}</span>
                        ) : (
                          word
                        )}
                        {i < tasks[currentIndex].title.split(" ").length - 1 && " "}
                      </React.Fragment>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
        </div>
      </div>
    </div>
  );
}
