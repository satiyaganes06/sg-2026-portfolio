"use client";

import React from "react";

export function Banner({ visible }: { visible: boolean }) {
    if (!visible) return null;

    return (
        <div className="text-zinc-300 animate-in fade-in slide-in-from-top-4 duration-1000 mb-6">
            {/* <div className="relative overflow-hidden group py-6">
                <img 
                    src="/banner-name.svg" 
                    alt="Banner" 
                    className="w-[75%] h-auto max-w-3xl filter invert opacity-85 select-none pointer-events-none crt-flicker"
                    draggable={false}
                />
            </div> */}
            <div className="mt-2 text-xs md:text-sm opacity-80 space-y-1" style={{ color: "#a6adc8" }}>
                <div>
                   Built by <a href="https://github.com/satiyaganes06" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 font-bold underline decoration-green-400/30 underline-offset-4">Shatthiya Ganes</a>.
                </div>
                <div>
                   Type <span className="text-green-400 font-bold text-base mx-1 crt-glow">help</span> to see available commands.
                </div>
            </div>
        </div>
    );
}

export function Prompt({ text }: { text: string }) {
    const [user, host, path] = React.useMemo(() => {
        const match = text.match(/^(.*)@(.*):(.*)$/);
        return match ? [match[1], match[2], match[3]] : [text, "", ""];
    }, [text]);
    return (
        <span className="shrink-0 select-none font-bold">
            <span className="text-green-400">{user}</span>
            <span className="text-zinc-500 font-normal">@</span>
            <span className="text-blue-400 crt-glow">{host}</span>
            <span className="text-zinc-400 font-normal">:</span>
            <span className="text-blue-300">{path}</span>
            <span className="text-zinc-400 font-normal">$</span>
        </span>
    );
}
