"use client";

import React from "react";

export default function DateNowWidget() {
  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'short' });
  const monthName = now.toLocaleDateString('en-US', { month: 'short' });
  const dayNumber = now.getDate();

  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-[#0d0d0d] shadow-[0_10px_30px_rgba(0,0,0,0.4)] h-full w-full">
      <div className="h-full w-full p-4 flex flex-col items-center justify-center">
        {/* Day and Month on same line */}
        <div className="text-center mb-3">
          <span className="text-lg font-bold font-mono text-red-500">
            {dayName}
          </span>
          <span className="text-lg font-bold font-mono text-zinc-100 ml-2">
            {monthName}
          </span>
        </div>
        
        {/* Date Number */}
        <div className="text-5xl font-bold text-zinc-100">
          {dayNumber}
        </div>
      </div>
    </div>
  );
}

