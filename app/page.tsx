"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import BootLog from "@/components/boot/BootLog";
// import HeroSelector from "@/components/boot/HeroSelector";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Boot flow state machine: boot -> grub -> running
  const [phase, setPhase] = useState<"boot" | "grub" | "running">("boot");

  const [progress, setProgress] = useState(0);
  // Simulate loading progress in ~3s, then show GRUB
  useEffect(() => {
    const total = 3000; // fixed 3 seconds
    const interval = 80; // ms per tick
    const steps = Math.max(1, Math.floor(total / interval));
    let current = 0;
    const id = setInterval(() => {
      const base = 100 / steps;
      const jitter = base * 1.0; // steady
      current = Math.min(100, current + jitter);
      setProgress(current);
      if (current >= 100) {
        clearInterval(id);
        // setTimeout(() => setPhase("grub"), 100);
        router.push('/desktop');
      }
    }, interval);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      
      {/* Boot/GRUB overlay (no routing) */}
      <AnimatePresence>
        {phase !== 'running' && (
          <motion.div
            key="boot-overlay"
            className="fixed inset-0 z-[70]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-black" />
            <div className="relative w-full h-full grid place-items-center p-4">
              {phase === 'boot' ? (
                <div className="absolute inset-0">
                  <BootLog progress={progress} />
                </div>
              ) : (
                /*
                <div className="relative w-full flex items-center justify-center">
                  <HeroSelector
                    defaultSeconds={10}
                    onSelect={(m) => {
                      if (m === 'desktop') {
                        router.push('/desktop');
                      } else if (m === 'terminal') {
                        router.push('/terminal');
                      } else if (m === '7sg56') {
                        // TODO: Update this URL when 7sg56.vercel.app is deployed
                        alert('Shatthiya Ganes portfolio');
                      }
                    }}
                  />
                </div>
                */
                null
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
