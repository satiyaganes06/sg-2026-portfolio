import React from "react";
import { User, FolderGit2, Cpu, Mail, Link2, SquareTerminal } from "lucide-react";

export const AboutIcon = () => (
    <User className="size-full text-zinc-100" strokeWidth={1.5} />
);

export const SkillsIcon = () => (
    <Cpu className="size-full text-zinc-300" strokeWidth={1.5} />
);

export const ContactIcon = () => (
    <Mail className="size-full text-zinc-100" strokeWidth={1.5} />
);

export const ShortenLinkIcon = () => (
    <Link2 className="size-full text-zinc-300" strokeWidth={1.5} />
);

export const ProjectsIcon = () => (
    <FolderGit2 className="size-full text-zinc-100" strokeWidth={1.5} />
);

export const TerminalIcon = () => (
    <SquareTerminal className="size-full text-zinc-300" strokeWidth={1.5} />
);
