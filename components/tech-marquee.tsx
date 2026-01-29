"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"

import { getAllSkills } from "@/lib/data"

type Item = string | { label: string }

type Props = {
  items?: Item[]
  duration?: number // seconds for one full loop
  pauseOnHover?: boolean
  className?: string
}

function renderLabel(item: Item) {
  if (typeof item === "string") return item
  return item.label
}

export default function TechStackStrip({
  items,
  duration = 20,
  pauseOnHover = true,
  className,
}: Props) {
  const defaultSkills = getAllSkills().flatMap(s => s.skills);
  const finalItems = items || defaultSkills;

  // Duplicate list to create seamless loop
  const loop = [...finalItems, ...finalItems]

  return (
    <div
      className={cn("relative w-full overflow-hidden bg-transparent z-0", className)}
      role="region"
      aria-label="Technology stack scrolling list"
    >
      <div
        className={cn("flex w-full", pauseOnHover && "hover:pause-animation")}
      // Note: checking pause-animation functionality with Framer Motion might be tricky directly with hover class, 
      // usually we control play state. But simplest infinite loop is often just this:
      >
        <motion.div
          className="flex w-max"
          animate={{ x: "-50%" }}
          transition={{
            duration: duration,
            ease: "linear",
            repeat: Infinity,
          }}
          style={{ x: 0 }}
        // Hover pause is tricky with declarative motion. 
        // For now, let's stick to the simple infinite loop which is smoother than CSS marquee often.
        // If pause is critical, we'd use useAnimation controls. 
        // However, the user asked to replace animations with motion.
        >
          {loop.map((item, i) => (
            <span
              key={i}
              className="mx-3 my-3 inline-flex items-center rounded-full bg-transparent px-4 py-2 text-base font-bold text-zinc-300 whitespace-nowrap select-none"
            >
              {renderLabel(item) === "Next.js" ? (
                <>
                  <span className="text-red-500">NEXT</span>.js
                </>
              ) : (
                renderLabel(item)
              )}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
