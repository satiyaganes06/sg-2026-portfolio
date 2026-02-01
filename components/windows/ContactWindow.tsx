"use client";

import { getProfile } from "@/lib/data";

export default function ContactWindow() {
  const profile = getProfile();
  const s = profile.socials;

  const socialLinks = [
    { name: "GitHub", url: s.github },
    { name: "LinkedIn", url: s.linkedin },
    ...(s.twitter ? [{ name: "Twitter", url: s.twitter }] : []),
    ...(s.instagram ? [{ name: "Instagram", url: s.instagram }] : []),
    ...(s.resume ? [{ name: "Resume", url: s.resume }] : []),
    { name: "Email", url: `mailto:${profile.contact.email_masked}` },
  ];

  return (
    <div className="h-full flex flex-col relative z-50">
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide flex items-start sm:items-center justify-center">
        <div className="w-full max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2 mt-8 sm:mt-0">
            <h1 className="text-3xl font-black text-white tracking-tight">Get in Touch</h1>
            <p className="text-zinc-400 text-base">Just say Hello to collaborate! I&apos;m available for Freelancing.</p>
          </div>

          {/* Social Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {socialLinks.map((link) => {
               const isPhone = link.name === "Phone";
               const href = isPhone ? `tel:${link.url}` : link.url;
               return (
                <a
                   key={link.name}
                   href={href}
                   {...(!isPhone && { target: "_blank", rel: "noopener noreferrer" })}
                   className="flex items-center justify-between p-4 rounded-xl bg-[#0d0d0d] border border-white/5 hover:border-red-500/30 group transition-all hover:-translate-y-0.5 h-[58px]"
                >
                  <span className="text-zinc-300 font-medium group-hover:text-white transition-colors">{link.name}</span>
                  <span className="text-red-500/50 group-hover:text-red-400 transition-colors">↗</span>
                </a>
               );
             })}
          </div>

           <div className="text-center pt-4">
               <p className="text-zinc-500 text-sm">
                   Prefer email? <a href={`mailto:${profile.contact.email_masked}`} className="text-red-400 hover:text-red-300 font-medium transition-colors">Send me a message</a>
               </p>
           </div>
        </div>
      </div>
    </div>
  );
}
