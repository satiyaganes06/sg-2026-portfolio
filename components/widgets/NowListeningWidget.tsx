"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { SONGS, type Song } from "@/lib/data";

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

const songs = SONGS;

export default function NowListeningWidget({ span }: { span?: Span }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Random song on mount only
    setCurrentIndex(Math.floor(Math.random() * songs.length));
  }, []);

  const nextIndex = (currentIndex + 1) % songs.length;
  const prevIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;

  const handleSkipNext = () => {
    setCurrentIndex(nextIndex);
  };

  const handleSkipPrevious = () => {
    setCurrentIndex(prevIndex);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border border-zinc-800 bg-[#0d0d0d] shadow-[0_10px_30px_rgba(0,0,0,0.4)] h-full w-full ${spanToClasses(span)}`}>
      <div className="h-full w-full p-2 flex flex-col relative overflow-hidden">
        {/* Current song */}
        <div className="flex-1 flex flex-col items-center justify-start text-center relative z-10 pt-4 w-full overflow-hidden">
          <div className="text-lg font-bold font-mono text-zinc-200 mb-1 px-3 w-full truncate text-center">
            {songs[currentIndex].title}
          </div>
          <div className="text-xs text-zinc-500 px-3 mb-4 w-full truncate text-center">
            {songs[currentIndex].artist}
          </div>
        </div>

        {/* Visualizer - Fixed position with contained width */}
        <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-1 z-0 pointer-events-none">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="bg-zinc-400 rounded-sm"
              style={{
                width: '3px',
                opacity: isPlaying ? 1 : 0.5
              }}
              animate={isPlaying ? "playing" : "paused"}
              variants={{
                playing: {
                  height: [5, 10 + Math.random() * 15, 5],
                  transition: {
                    duration: 0.3 + i * 0.05,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }
                },
                paused: {
                  height: 5,
                  transition: {
                    duration: 0.2,
                    ease: "easeOut"
                  }
                }
              }}
            />
          ))}
        </div>

        {/* Controls - Fixed at bottom */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-4 z-10">
          <button
            onClick={handleSkipPrevious}
            className="text-zinc-400 hover:text-white transition-colors"
            title="Previous"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
            </svg>
          </button>
          <button
            onClick={handlePlayPause}
            className="text-red-500 hover:text-red-400 transition-colors"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a1 1 0 00-1 1v10a1 1 0 001 1h2a1 1 0 001-1V5a1 1 0 00-1-1H5zM11 4a1 1 0 00-1 1v10a1 1 0 001 1h2a1 1 0 001-1V5a1 1 0 00-1-1h-2z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            )}
          </button>
          <button
            onClick={handleSkipNext}
            className="text-zinc-400 hover:text-white transition-colors"
            title="Next"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
