// Centralized data management for portfolio
// This file contains all the data that needs to be updated across the application

export type Project = {
  name: string;
  slug: string;
  desc: string;
  tech: string[];
  repo?: string;
  demo?: string;
};

export type Experience = {
  title: string;
  company: string;
  period: string;
  location?: string;
  description: string;
  type: 'internship' | 'education' | 'volunteer' | 'project' | 'work';
  achievements?: string[];
};

export type Award = {
  title: string;
  subtitle?: string;
  year?: string;
};

export type Resume = {
  url: string;
  filename: string;
  lastUpdated: string;
};

export type SkillCategory = {
  title: string;
  skills: string[];
};

export type Profile = {
  name: string;
  handle: string;
  tagline: string;
  about: string;
  contact: {
    email_masked: string;
    phone_masked: string;
    open_to: string;
  };
  socials: {
    github: string;
    linkedin: string;
    twitter?: string;
    instagram?: string;
    portfolio?: string;
    medium?: string;
    stackoverflow?: string;
    discord?: string;
    resume?: string;
  };
  education: { summary: string };
  roles?: string[];
};

// ===== PROJECTS =====
export const PROJECTS: Project[] = [
  {
    name: "PassAnda - Secure Password Manager",
    slug: "passanda",
    desc: "Secure password manager with max-level protection for storing credentials safely.",
    tech: ["Flutter", "Getx", "Hive", "Laravel", "PHP", "Supabase", "VirusTotal API", "Gemini API"],
  },
  {
    name: "UMPSA SuperApp",
    slug: "umpsa-superapp",
    desc: "Full-stack mobile platform for Universiti Malaysia Pahang Al-Sultan Abdullah. Laravel-based APIs integrated with Flutter app; multiple modules for 20,000+ students and staff.",
    tech: ["Flutter", "Laravel", "FVM", "Provider", "Riverpod", "Laravel Sanctum", "GitLab", "Oracle", "Docker", "Postman", "Laravel Scramble"],
  },
  {
    name: "SISTEM e-IPTS 2.0",
    slug: "e-ipts",
    desc: "Government system under Ministry of Higher Education (KPT). New features, bug fixes, RESTful API integration for functionality and stability.",
    tech: ["Laravel", "GitLab", "Mobaxterm", "Postman"],
  },
  {
    name: "Pendigitalan Sumber dan Operasi Hutan (PSOH)",
    slug: "psoh",
    desc: "Digitalization of Forest Resources and Operations — system to digitally manage forestry activities in Malaysia. iBayar integration for 500+ monthly forestry permit transactions.",
    tech: ["Laravel", "Livewire", "Tailwind", "iBayaq API", "Postman", "HTML", "CSS"],
  },
  {
    name: "MOBE Sistem E-Kilang",
    slug: "mobe-e-kilang",
    desc: "Digital platform to manage and monitor operations of licensed biodiesel and refinery plants under Malaysian Palm Oil Board (MPOB).",
    tech: ["Laravel", "Cyberduck", "SSH", "Pritunl VPN"],
  },
  {
    name: "Platinum IoT & Workflow Management System (PIWMS)",
    slug: "piwms",
    desc: "Web app for IoT devices, job workflows, client info, and asset tracking. Laravel + FilamentPHP.",
    tech: ["Laravel", "FilamentPHP", "MySQL", "Tailwind CSS", "MQTT"],
  },
  {
    name: "MyHSE App",
    slug: "myhse",
    desc: "Mobile app for managing occupational safety and health (OSH) services: subscriptions, profiles, bookings, payments, and reviews.",
    tech: ["Flutter", "Getx", "Laravel", "Laravel Sanctum", "MySQL", "REST API", "Hostinger", "Hive"],
  },
  {
    name: "lastPiece - M-Commerce App",
    slug: "lastpiece",
    desc: "App for UMP students to find and buy second-hand books. Gold Award Final Year Project.",
    tech: ["Kotlin", "Firebase", "Material UI", "Stripe"],
    repo: "https://github.com/satiyaganes06/last-piece-v1.0",
  },
  {
    name: "everBrain - Secure Password Manager",
    slug: "everbrain",
    desc: "Secure password manager; Huawei App Gallery. Winner, UMP Huawei Competition 2023.",
    tech: ["Flutter", "Dart", "Hive", "Firebase", "HMS Core"],
    repo: "https://github.com/satiyaganes06/everbrain-v1.0",
    demo: "https://appgallery.huawei.com/app/C109257151",
  },
  {
    name: "GooLancer - Freelance Platform",
    slug: "goolancer",
    desc: "Mobile platform connecting freelancers with clients. Silver Award, iCE-CInno 2024.",
    tech: ["Flutter", "Dart", "Getx", "Laravel", "PHP", "MySQL", "REST API", "Stripe"],
    demo: "http://tinyurl.com/bdrbwxdv",
  },
];

// ===== EXPERIENCE =====
export const EXPERIENCE: Experience[] = [
  {
    title: "Full Stack Mobile Developer",
    company: "Two Q Alliance Sdn Bhd",
    period: "2025 – Present",
    location: "Conezion Commercial, Putrajaya",
    description: "Lead mobile dev for UMPSA SuperApp; coordinate technical discussions on mobile architecture, server integration, and DB design. Contribute to EIPTS, PSOH, MOBE Sistem E-Kilang, UMPSA SuperApp (100,000+ users).",
    type: "work",
    achievements: [
      "Led team of 8 mobile developers; 15+ technical discussions with clients on architecture, integration, DB design.",
      "Resolved 15+ critical production bugs (data migration, duplication) within 48h SLA; reduced data inconsistencies 90%.",
      "Integrated iBayar (Kedah State Payment Gateway) into PSOH for JPSM; 500+ monthly forestry permit transactions, real-time payments.",
      "Developed 12+ features, integrated 5 third-party APIs; 35% faster response, crash rate 2.5% → 0.3%.",
    ],
  },
  {
    title: "Mobile Security Engineer",
    company: "Vigilant Asia Sdn Bhd",
    period: "Nov 2025 – Apr 2026",
    location: "Remote",
    description: "Zimperium Mobile Threat Defense (MTD): zDefend, zScan, zShield. Real-time threat detection, runtime app protection, malware detection, custom threat monitoring UI.",
    type: "work",
    achievements: [
      "Hands-on Zimperium MTD (zDefend, zScan, zShield); callback-based security SDK architecture.",
      "Integrated runtime app protection and malware detection into production mobile app.",
      "Built custom threat monitoring UI for security events and device risk status.",
      "Exposure to secure mobile app architecture, SDK hardening, security-focused development.",
    ],
  },
  {
    title: "Full Stack Developer (Internship)",
    company: "TriSquare Technology (M) Sdn. Bhd.",
    period: "Jul 2024 – Jan 2025",
    description: "Secure APIs for mobile and web; Laravel back-end, Gemini integration. Production deployment, third-party APIs (e.g. VirusTotal).",
    type: "internship",
    achievements: [
      "Developed secure APIs for mobile and web; seamless integration and data consistency.",
      "Custom back-end solutions with Laravel; Gemini for enhanced features.",
      "Deployed to production; hosting management; VirusTotal and security-focused API integration.",
    ],
  },
  {
    title: "Freelance Developer",
    company: "Self-Employed",
    period: "Feb 2022 – 2025",
    description: "Secure APIs for mobile and web; Flutter, Laravel, FilamentPHP. Real-time data handling; NADI Meditech, Platinums, Femo.",
    type: "work",
    achievements: [
      "Developed secure APIs for mobile and web; seamless integration.",
      "NADI Meditech, Platinums, Femo: user-centric features, robust APIs, role-based access controls.",
      "Collaborated with cross-functional teams; system performance, troubleshooting, client-tailored solutions.",
    ],
  },
  {
    title: "Flutter Developer",
    company: "Mahiran Digital Sdn. Bhd.",
    period: "Oct 2022 – May 2023",
    location: "Pekan, Malaysia",
    description: "API configurations for Flutter apps; Getx and Provider. Clean architecture; high-quality products with Flutter and Dart.",
    type: "work",
    achievements: [
      "API configurations to integrate back-end services with Flutter applications.",
      "State management (Getx, Provider); clean architecture; maintainable, flexible systems.",
      "Collaborated with team to deliver products exceeding client expectations.",
    ],
  },
  {
    title: "Frontend Web Developer (Internship)",
    company: "Zeto Sdn. Bhd.",
    period: "Aug 2021 – Jan 2022",
    location: "Pekan, Malaysia",
    description: "Responsive web pages from client requirements and mockups. HTML, CSS, JavaScript, CMS.",
    type: "internship",
    achievements: ["Recreated and designed responsive web pages from mockups.", "Hands-on HTML, CSS, JavaScript, CMS platforms."],
  },
];

// ===== SKILLS =====
export const SKILLS: SkillCategory[] = [
  { title: "Mobile Development", skills: ["Flutter (3+ years)", "Dart", "GetX", "Bloc", "Provider", "Riverpod", "Kotlin", "Java"] },
  { title: "Web Development", skills: ["PHP", "Laravel", "FilamentPHP", "HTML5", "CSS", "JavaScript", "Bootstrap 5", "Tailwind CSS"] },
  { title: "Backend & API", skills: ["Laravel", "PHP", "RESTful API", "API Documentation"] },
  { title: "Database & Others", skills: ["MySQL", "PostgreSQL", "Oracle", "Firebase"] },
  { title: "Tools & DevOps", skills: ["Git", "GitHub", "GitLab", "Docker", "Postman"] },
  { title: "Architecture", skills: ["MVVM", "Clean Architecture", "Microservices"] },
  { title: "Cybersecurity", skills: ["Zimperium", "zConsole", "zShield", "zKeyBox", "zDefend", "MTD", "zScan"] },
];

// ===== AWARDS =====
export const AWARDS: Award[] = [
  { title: "1st Place, Astro NACSA Coding Challenge 2024", subtitle: "CipherKey secure password manager; award from PM Malaysia Dato Seri Anwar Ibrahim", year: "2024" },
  { title: "Gold Award, Final Year Project", subtitle: "lastPiece M-Commerce app; Diploma in Computer Science", year: "2021" },
  { title: "Winner, UMP Huawei Competition 2023", subtitle: "everBrain mobile app; first place", year: "2023" },
  { title: "Silver Award, iCE-CInno 2024", subtitle: "GooLancer freelance platform; International Competition and Exhibition on Computing Innovation", year: "2024" },
  { title: "Best Project & 5th Place Overall, DICRATHON 2024", subtitle: "MySihat telehealth platform; AI-driven tools for healthcare in rural areas", year: "2024" },
];

// ===== RESUME =====
export const RESUME: Resume = {
  url: "https://firebasestorage.googleapis.com/v0/b/mad-mini-project-c822d.appspot.com/o/cv.pdf?alt=media&token=4400d475-c64c-4299-bbd4-a42c069e9798",
  filename: "Satiya-Ganes-CV.pdf",
  lastUpdated: "2025",
};

// ===== PROFILE =====
export const PROFILE: Profile = {
  name: "Shatthiya Ganes",
  handle: "satiyaganes06",
  tagline: "Software Developer · Flutter · Laravel · API · Mobile Security",
  about: "Software Developer with expertise in Flutter (Android, iOS), Laravel, API development, and Mobile Security. Led backend development for mobile apps and contributed to award-winning projects in coding challenges. Experienced in teaching and improving system efficiency through innovative solutions. Proven ability to work with cross-functional teams to deliver seamless product experiences and manage feature development.",
  contact: {
    email_masked: "sgdevelopercompany@gmail.com",
    phone_masked: "+601163348685",
    open_to: "Open to Freelancing",
  },
  socials: {
    github: "https://github.com/satiyaganes06",
    linkedin: "https://www.linkedin.com/in/satiya-ganes-b0a315209/",
    resume: "https://firebasestorage.googleapis.com/v0/b/mad-mini-project-c822d.appspot.com/o/cv.pdf?alt=media&token=4400d475-c64c-4299-bbd4-a42c069e9798",
    medium: "https://yelwino.medium.com/",
    stackoverflow: "https://stackoverflow.com/users/19209151/ye-lwin-oo",
    discord: "https://discordapp.com/users/809527318632071178",
  },
  education: { summary: "Universiti Malaysia Pahang Al-Sultan Abdullah — Bachelor of Computer Science (Software Engineering) with Honours, CGPA 3.62; Diploma in Computer Science, CGPA 3.62." },
  roles: ["Software Developer", "Flutter Developer", "Laravel Developer", "Mobile Security Engineer", "Full Stack Mobile Developer"],
};

// ===== SONGS (Now Listening Widget) =====
export type Song = {
  title: string;
  artist: string;
};

export const SONGS: Song[] = [
  { title: "My Eyes", artist: "Travis Scott" },
  { title: "No Pole", artist: "Don Toliver" },
  { title: "Dracula", artist: "Tame Impala" },
  { title: "Humble", artist: "Kendrick Lamar" },
  { title: "Softcore", artist: "The Neighbourhood" },
  { title: "Runaway", artist: "Kanye West" },
  { title: "Wildflower", artist: "Billie Eilish" },
  { title: "Sao Paulo", artist: "The Weeknd" },
  { title: "Chanel", artist: "Tyla" },
  { title: "Chihiro", artist: "Billie Eilish" },
  { title: "Sofia", artist: "Clairo" },
  { title: "Guess", artist: "Billie Eilish"},
  { title: "I KNOW?", artist: "Travis Scott"},
  { title: "Ilomilo", artist: "Billie Eilish"}
];

// ===== TASKS (Todo Widget) =====
export type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export const TASKS: Task[] = [
  { id: 1, title: "Running high on Flutter", completed: false },
  { id: 2, title: "May God shed light when i debug", completed: false },
  { id: 3, title: "Coffee first, code second", completed: false },
  { id: 4, title: "Exploring 80's & 90's music", completed: false },
  { id: 5, title: "Reading & Movies", completed: false },
  { id: 6, title: "Open to freelance projects", completed: false },
];

// ===== HOBBIES =====
export type Hobby = string;

export const HOBBIES: Hobby[] = [
  "Coffee",
  "Reading",
  "80's & 90's Music",
  "Movies",
  "Exploring more...",
];

// ===== UTILITY FUNCTIONS =====

/**
 * Get project by slug or index
 */
export function getProject(identifier: string | number): Project | undefined {
  if (typeof identifier === 'number') {
    return PROJECTS[identifier - 1]; // 1-indexed
  }
  return PROJECTS.find(p => p.slug === identifier || p.name.toLowerCase().includes(identifier.toLowerCase()));
}

/**
 * Get all projects
 */
export function getAllProjects(): Project[] {
  return PROJECTS;
}

/**
 * Get all experience entries
 */
export function getAllExperience(): Experience[] {
  return EXPERIENCE;
}

/**
 * Get all awards
 */
export function getAwards(): Award[] {
  return AWARDS;
}

/**
 * Get resume information
 */
export function getResume(): Resume {
  return RESUME;
}

/**
 * Get profile information
 */
export function getProfile(): Profile {
  return PROFILE;
}

/**
 * Get projects count for dynamic text
 */
export function getProjectsCount(): number {
  return PROJECTS.length;
}

/**
 * Get all skills categories
 */
export function getAllSkills(): SkillCategory[] {
  return SKILLS;
}

/**
 * Get skills by category
 */
export function getSkillsByCategory(category: string): SkillCategory | undefined {
  return SKILLS.find(s => s.title.toLowerCase() === category.toLowerCase());
}

/**
 * Get all hobbies
 */
export function getHobbies(): Hobby[] {
  return HOBBIES;
}

/**
 * Get all songs for Now Listening widget
 */
export function getSongs(): Song[] {
  return SONGS;
}

/**
 * Get all tasks for Todo widget
 */
export function getTasks(): Task[] {
  return TASKS;
}
