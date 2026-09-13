// Centralized data management for portfolio
// This file contains all the data that needs to be updated across the application

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  name: string;
  slug: string;
  desc: string; // one-line summary used on cards and in the terminal
  summary?: string; // longer prose for the detail view
  highlights?: string[]; // what was actually built / solved
  role?: string;
  period?: string;
  tech: string[];
  /**
   * Screenshots for the detail gallery, 2-3 per project.
   * Drop files in public/projects/<slug>/ — the gallery renders a generated
   * placeholder for any path that does not resolve yet.
   */
  images?: string[];
  repo?: string;
  demo?: string;
  links?: ProjectLink[]; // extra links: backend repo, live site, thesis
  sourcePrivate?: boolean; // company-owned repo, no public link
  featured?: boolean;
};

export type Experience = {
  title: string;
  company: string;
  period: string;
  location?: string;
  description: string;
  type: 'internship' | 'education' | 'volunteer' | 'project' | 'work';
  achievements?: string[];
  tech?: string[];
  current?: boolean;
};

export type Education = {
  degree: string;
  institution: string;
  period: string;
  note?: string; // EQF level, CGPA
  thesis?: string;
};

/** Headline metric shown on the About window. */
export type Stat = {
  value: string;
  label: string;
};

/** One of the disciplines the work spans. */
export type FocusArea = {
  title: string;
  summary: string;
  tools: string[];
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
  note?: string; // short framing line, e.g. depth or context
  skills: string[];
};

export type Language = {
  name: string;
  level: string; // CEFR level, or "Native"
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
  location?: string;
  locationNote?: string; // e.g. "Remote · Open to Relocation"
  socials: {
    github: string;
    linkedin: string;
    twitter?: string;
    instagram?: string;
    portfolio?: string;
    website?: string;
    xing?: string;
    medium?: string;
    stackoverflow?: string;
    discord?: string;
    resume?: string;
  };
  education: { summary: string };
  roles?: string[];
  languages?: Language[];
};


// ===== PROJECTS =====
export const PROJECTS: Project[] = [
  {
    name: "PassAnda — Secure Password Manager",
    slug: "passanda",
    period: "Jul 2024 – Present",
    role: "Solo — architecture, backend and mobile",
    featured: true,
    desc: "Zero-knowledge password manager with encrypted backup and recovery, built end to end.",
    summary:
      "PassAnda stores credentials with zero-knowledge encryption: the server never holds a key that could decrypt a user's vault. I designed and built the entire backend independently on Laravel and Supabase, alongside the Flutter client. It won 1st Place at the Astro NACSA Coding Challenge 2024, with the award presented by the Prime Minister of Malaysia.",
    highlights: [
      "The hard problem was recovery. A user who loses their device must be able to restore their vault, but I must never be able to read it. Solved with AES-256-GCM encryption, PBKDF2 key derivation and a BIP-39-style recovery phrase held only by the user.",
      "OAuth2 authentication via Laravel Passport, layered with multi-factor auth using OTP and PIN verification.",
      "Controller-Service-Repository architecture across 25+ documented API endpoints, deployed on serverless infrastructure with GitHub CI/CD.",
      "Integrated VirusTotal and Gemini AI for automated file and threat scanning on stored attachments.",
      "Designed against GDPR/CCPA requirements from the start rather than retrofitting compliance.",
    ],
    tech: ["Flutter", "GetX", "Hive", "Laravel", "PHP", "Supabase", "VirusTotal API", "Gemini API", "AES-256-GCM"],
    images: ["/projects/passanda/1.png", "/projects/passanda/2.png", "/projects/passanda/3.png"],
    demo: "https://drive.google.com/file/d/1gAgKljqwl6hbAWfGT__WKBL81AXR6wM7/view?usp=sharing",
  },
  {
    name: "UMPSA Campus SuperApp",
    slug: "umpsa-superapp",
    period: "Jun 2025 – Jan 2026",
    role: "Backend architect · led a team of 8",
    featured: true,
    desc: "Campus super-app for 20,000+ university users, backed by Laravel microservices over Oracle.",
    summary:
      "A single app centralising hostel registration, semester payments, course applications, exam results, attendance, calendar, notifications and an e-wallet for Universiti Malaysia Pahang Al-Sultan Abdullah. Flutter client, Laravel API and web admin, integrated with UMPSA's internal SSO. I designed the entire backend architecture and led the eight-person team delivering it.",
    highlights: [
      "Features were originally tightly coupled through one shared data layer, so a slowdown in payments could cascade into unrelated features like course applications. I split each domain into its own service boundary with its own data access layer and API contract, cutting cross-feature regressions and letting each module deploy on its own schedule.",
      "Built shared conventions reused across every microservice: versioned routing (/api/v1/{module}/...), per-user/IP rate limiting at 60 req/min, and a ForceJsonRequestHeader middleware so even validation errors return JSON — keeping mobile-side error handling consistent.",
      "Custom Sanctum setup mapping personal access tokens to an Oracle WEBAPP_TOKENS table instead of Laravel's default token store.",
      "Designed OptionalSanctumAuth middleware so one endpoint can serve public visitors, students and staff with different data visibility, without duplicating routes or controllers.",
      "Standardised every response through a shared ApiResponse trait and a global exception handler, so all services return the same JSON contract and status codes.",
      "Worked across three Oracle schemas in one Laravel project, using Form Requests and API Resources so raw Oracle column names never leaked to the frontend.",
      "Containerised each service with Docker Compose and owned staging deployment, verified against Laravel Scramble API docs before handoff.",
      "Wrote the backend onboarding and handover documentation so developers new to Laravel microservices could ramp up independently.",
      "Result: 35% faster response times and crash rate down from 2.5% to 0.3% across 40+ endpoints.",
    ],
    tech: ["Flutter", "Laravel", "Oracle", "Riverpod", "Provider", "Laravel Sanctum", "Docker", "Nginx", "Laravel Scramble", "GitLab"],
    images: ["/projects/umpsa-superapp/1.png", "/projects/umpsa-superapp/2.png", "/projects/umpsa-superapp/3.png"],
    sourcePrivate: true,
  },
  {
    name: "Cargozaa — Container Booking System",
    slug: "cargozaa",
    period: "Feb 2026 – Present",
    role: "Solo — full stack and infrastructure",
    featured: true,
    desc: "Container-leasing marketplace with AI-powered search, GPS tracking and Stripe payments.",
    summary:
      "A marketplace connecting shipping-container owners with customers who need to rent them, covering the full lease lifecycle: listings, booking, payments, tracking and search. Built entirely in Laravel, including the infrastructure — I configured and deployed the VPS and Docker setup personally.",
    highlights: [
      "End-to-end lease management: container listings, booking flow, payments and GPS tracking in one platform.",
      "AI-powered search built on a locally hosted Ollama model rather than a paid API.",
      "Stripe integration for booking payments.",
      "Self-configured VPS and Docker infrastructure, deployed and maintained without a platform team.",
    ],
    tech: ["Laravel", "PHP", "Livewire", "FilamentPHP", "MySQL", "Stripe", "Ollama", "MQTT", "Docker", "VPS"],
    images: ["/projects/cargozaa/1.png", "/projects/cargozaa/2.png"],
    sourcePrivate: true,
  },
  {
    name: "Sistem e-IPTS 2.0",
    slug: "e-ipts",
    period: "Mar 2024 – Jun 2025",
    role: "Backend developer, team of 6",
    desc: "Ministry of Higher Education platform managing student records and eligibility nationwide.",
    summary:
      "A government system under Malaysia's Ministry of Higher Education (KPT) for managing student records and eligibility across the higher education sector. The project rewrote a legacy CodeIgniter application running on SQL Server into a modern Laravel 9 codebase, delivered by a team of six.",
    highlights: [
      "Integrated three separate government bodies: the Malaysian Immigration Department for visa status, PTPTN for student loan data, and JPA for scholarship data.",
      "Each body exposes data through its own systems, formats and access rules — reconciling eligibility, loan and scholarship status across all three without conflicting or stale records was the core difficulty.",
      "Built on a standardised architecture: Spatie laravel-permission for group-based access, Laravel Policies for per-action authorization, and laravel-activitylog for full audit trails recording before/after values on every write.",
      "Paired email and in-app notifications through Laravel Notifications.",
    ],
    tech: ["Laravel 9", "PHP 8.1", "MySQL", "SQL Server", "Spatie Permission", "Spatie Activitylog", "GitLab"],
    images: ["/projects/e-ipts/1.png", "/projects/e-ipts/2.png"],
    sourcePrivate: true,
  },
  {
    name: "PSOH — Digitalisation of Forest Resources",
    slug: "psoh",
    period: "May 2025 – Dec 2025",
    role: "Developer · payment gateway owner",
    desc: "Ministry of Natural Resources platform digitalising Malaysian forestry operations.",
    summary:
      "Pendigitalan Sumber dan Operasi Hutan digitally manages forestry activities across Malaysia for the Ministry of Natural Resources, built on the same standardised Laravel 9 architecture used across the department's government projects.",
    highlights: [
      "Personally implemented the payment gateway integration, handling the full payment flow for forestry permits and services.",
      "Processing 500+ monthly forestry permit transactions, replacing a manual five-day cycle with real-time payment.",
      "Role and permission management via Spatie, with activity logging and policy-based authorization throughout.",
    ],
    tech: ["Laravel 9", "PHP 8.1", "Livewire", "Tailwind CSS", "Spatie Permission", "iBayar", "Postman"],
    images: ["/projects/psoh/1.png", "/projects/psoh/2.png"],
    demo: "https://www.forestry.gov.my/my/",
    sourcePrivate: true,
  },
  {
    name: "Platinum — IoT & Workflow Management",
    slug: "piwms",
    period: "Sep 2024 – Feb 2025",
    role: "Full stack developer",
    desc: "IoT device, job workflow and asset tracking portal built on FilamentPHP with MQTT telemetry.",
    summary:
      "An internal portal for managing IoT devices, job workflows, client information and asset tracking, built on FilamentPHP with Filament Shield for role-based admin access and Filament Logger for activity logging.",
    highlights: [
      "The core challenge was unreliable MQTT connections — devices dropping offline mid-transmission, then duplicating or losing messages on reconnect.",
      "Solved with structured topic hierarchies, retained messages, quality-of-service levels tuned per data type, and idempotent backend handling so a duplicated message from a reconnecting device never corrupted state.",
      "Role and permission-based admin access via Filament Shield, with full activity logging.",
    ],
    tech: ["Laravel", "FilamentPHP", "Filament Shield", "Livewire", "MySQL", "Tailwind CSS", "MQTT"],
    images: ["/projects/piwms/1.png", "/projects/piwms/2.png"],
    sourcePrivate: true,
  },
  {
    name: "NADI Meditech",
    slug: "nadi-meditech",
    role: "Freelance — mobile and backend",
    desc: "Telehealth app with live video consultation, offline booking and medical product ordering.",
    summary:
      "A healthcare platform supporting online consultations, offline appointment booking and medical product ordering, with an MLM-style agent commission structure. Handles 1,000+ daily medical records with role-based access control across three user tiers.",
    highlights: [
      "Real-time video and voice consultation implemented with the Agora RTC Engine.",
      "SignalR for real-time messaging and events, paired with Firebase Cloud Messaging and local notifications for appointment reminders and order status.",
      "Connectivity Plus used to detect and gracefully degrade in low-connectivity conditions, so booking and record access stay usable offline with background sync on reconnect.",
      "Role-based access control across three user tiers over 1,000+ daily medical records.",
    ],
    tech: ["Flutter", "Riverpod", "Dio", "Agora RTC", "SignalR", "Firebase Cloud Messaging", "Laravel", "PHP"],
    images: ["/projects/nadi-meditech/1.png", "/projects/nadi-meditech/2.png"],
    sourcePrivate: true,
  },
  {
    name: "MyHSE App",
    slug: "myhse",
    role: "Solo — Flutter client and Laravel API",
    desc: "Health, safety and environment compliance app with an offline-first Flutter client.",
    summary:
      "A Flutter application for managing occupational safety and health services — subscriptions, profiles, bookings, payments and reviews — paired with a dedicated Laravel API backend. Built as a complete frontend/backend pair, both of which are public.",
    highlights: [
      "Laravel Sanctum for token-based API authentication, with Pusher broadcasting real-time events to the app.",
      "Offline resilience through Hive local storage and Connectivity Plus, so field users keep working without signal.",
      "Shorebird for over-the-air code push, shipping fixes without a full app store release cycle.",
      "Syncfusion PDF viewer and Table Calendar for compliance documents and scheduling.",
    ],
    tech: ["Flutter", "GetX", "Riverpod", "Dio", "Hive", "Shorebird", "Laravel 9", "Sanctum", "Pusher"],
    images: ["/projects/myhse/1.png", "/projects/myhse/2.png"],
    repo: "https://github.com/satiyaganes06/myhse_app",
    links: [{ label: "Backend repo", href: "https://github.com/satiyaganes06/myhse_app_backend/tree/v3" }],
  },
  {
    name: "InviteKami — Magic Guestbook",
    slug: "invitekami",
    role: "Solo — full stack",
    desc: "Digital wedding invitation, RSVP and guestbook platform built in React and Supabase.",
    summary:
      "InviteKami replaces paper invitations and manual guest-list tracking with a web app guests interact with directly. Built end to end: a React/TypeScript frontend with a wedding-appropriate design system, Supabase-backed auth, database and storage, and host-facing analytics.",
    highlights: [
      "RSVP flow with React Hook Form and Zod schema validation.",
      "A \u201cmagic guestbook\u201d feature using rich text input so guests can leave formatted messages.",
      "OTP/code-based guest access, so invitations stay private without requiring accounts.",
      "Host-facing Recharts dashboards for RSVP and guest data.",
      "Custom typography system (Playfair Display, Great Vibes, Dancing Script) deployed on Vercel.",
    ],
    tech: ["React 18", "TypeScript", "Vite", "shadcn/ui", "Tailwind CSS", "Supabase", "TanStack Query", "Zod", "Recharts"],
    images: ["/projects/invitekami/1.png", "/projects/invitekami/2.png", "/projects/invitekami/3.png"],
    demo: "https://www.invitekami.com/",
    repo: "https://github.com/satiyaganes06/invitekami-magic-guestbook",
  },
  {
    name: "GooLancer — Freelance Services Platform",
    slug: "goolancer",
    period: "Oct 2023 – Jun 2024",
    role: "Solo — Bachelor thesis project",
    desc: "Freelance marketplace connecting Malaysian clients with service providers. Silver Award, iCE-CInno 2024.",
    summary:
      "A marketplace connecting clients with freelance service providers: job posting, hiring, project management, messaging and secure payments. This was my Bachelor's degree thesis project, and went on to take Silver at the International Competition and Exhibition on Computing Innovation 2024.",
    highlights: [
      "Full marketplace flow: job listings, hiring, project management and in-app messaging.",
      "Secure payment integration between clients and freelancers.",
      "Published live on the Huawei App Gallery.",
    ],
    tech: ["Flutter", "GetX", "Laravel", "PHP", "MySQL", "REST API", "Hive", "Stripe"],
    images: ["/projects/goolancer/1.png", "/projects/goolancer/2.png"],
    demo: "https://appgallery.huawei.com/#/app/C111169041",
  },
  {
    name: "everBrain — Secure Password Manager",
    slug: "everbrain",
    role: "Lead developer",
    desc: "Password manager published to the Huawei App Gallery. Winner, UMP Huawei Competition 2023.",
    summary:
      "An earlier take on secure credential storage, built for and winning first place at the UMP Huawei Competition 2023, then published to the Huawei App Gallery through HMS Core.",
    highlights: [
      "Led development of the app end to end.",
      "Local-first encrypted storage using Hive.",
      "Published through HMS Core to the Huawei App Gallery.",
    ],
    tech: ["Flutter", "Dart", "Hive", "Firebase", "HMS Core"],
    images: ["/projects/everbrain/1.png", "/projects/everbrain/2.png"],
    repo: "https://github.com/satiyaganes06/everbrain-v1.0",
    demo: "https://appgallery.huawei.com/app/C109257151",
  },
  {
    name: "lastPiece — M-Commerce App",
    slug: "lastpiece",
    period: "Oct 2020 – Jun 2021",
    role: "Solo — Diploma thesis project",
    desc: "Marketplace for university students to buy and sell second-hand textbooks. Gold Award FYP.",
    summary:
      "An app letting UMP students find and buy second-hand books directly from their phones. Built in Kotlin as my Diploma thesis project, and awarded Gold for excellence in the Diploma in Computer Science programme.",
    highlights: [
      "Native Android build in Kotlin with Material UI.",
      "Firebase for authentication, data and storage.",
      "Stripe integration for in-app purchases between students.",
    ],
    tech: ["Kotlin", "Firebase", "Material UI", "Stripe"],
    images: ["/projects/lastpiece/1.png", "/projects/lastpiece/2.png"],
    repo: "https://github.com/satiyaganes06/last-piece-v1.0",
  },
  {
    name: "MOBE Sistem E-Kilang",
    slug: "mobe-e-kilang",
    role: "Backend developer",
    desc: "MPOB platform monitoring licensed biodiesel and refinery plant operations.",
    summary:
      "A digital platform to manage and monitor the operations of licensed biodiesel and refinery plants under the Malaysian Palm Oil Board, delivered as one of four concurrent government projects.",
    highlights: [
      "Operations monitoring and reporting for licensed plants under MPOB.",
      "Deployed and maintained over SSH with VPN-gated access to government infrastructure.",
    ],
    tech: ["Laravel", "PHP", "Cyberduck", "SSH", "Pritunl VPN"],
    images: ["/projects/mobe-e-kilang/1.png"],
    sourcePrivate: true,
  },
];

// ===== EXPERIENCE =====
export const EXPERIENCE: Experience[] = [
  {
    title: "Mobile Security Engineer",
    company: "Vigilant Asia Sdn. Bhd.",
    period: "Jan 2026 – Present",
    location: "Kuala Lumpur, Malaysia",
    description:
      "Mobile threat defense for banking-grade applications. Integrating Zimperium's MTD platform, hardening runtime behaviour, and running pentests before release.",
    type: "work",
    current: true,
    tech: ["Java", "Flutter", "Zimperium zDefend", "zScan", "zShield", "Frida", "Magisk", "Android", "Native Platform Channels"],
    achievements: [
      "Integrated Zimperium's Mobile Threat Defense into the Maybank mobile banking app, serving 20M+ active users across Malaysia, Singapore and Indonesia.",
      "Built a callback-based security SDK over native bridging, cutting threat detection time from 30 seconds to under 2 seconds.",
      "Reduced mobile security vulnerabilities by 85% via runtime application protection and real-time malware detection, holding banking-grade compliance.",
      "Performed pentesting and reverse engineering with Frida to surface vulnerabilities pre-deployment, documented with actionable remediation.",
      "Drove a threat monitoring dashboard tracking 200+ daily security events at 99.7% accuracy, replacing manual log review and saving 8+ hours weekly.",
      "Established the real-time threat monitoring and incident response process used to triage critical threats at source.",
    ],
  },
  {
    title: "Full Stack Mobile Developer / Lead Developer",
    company: "Two Q Alliance Sdn. Bhd.",
    period: "Mar 2025 – Dec 2025",
    location: "Putrajaya, Malaysia",
    description:
      "Led mobile and backend delivery across four concurrent Malaysian government platforms, owning architecture, API design and stakeholder communication.",
    type: "work",
    tech: ["Flutter", "Dart", "GetX", "Provider", "Riverpod", "Laravel", "PHP", "Oracle", "MySQL", "PostgreSQL", "Docker", "Livewire", "Tailwind CSS", "GitLab"],
    achievements: [
      "Led an 8-member mobile and backend team delivering the UMPSA SuperApp to 20,000+ university users on an offline-first architecture.",
      "Delivered 4 concurrent government projects (EIPTS, PSOH, MOBE, UMPSA) serving 100,000+ users across 3 ministries (KPT, JPSM, MPOB).",
      "Restructured a tightly coupled backend into microservice-style domain boundaries, each with its own data layer and API contract, cutting cross-feature regressions.",
      "Integrated the iBayar payment gateway, processing 500+ monthly transactions and collapsing the payment cycle from 5 days to real time.",
      "Shipped 12 features and integrated 40+ APIs: 35% faster response times, crash rate down from 2.5% to 0.3%.",
      "Fixed 15+ critical production bugs within a 48-hour SLA, reducing data errors by 90% and downtime by 60%.",
      "Translated architecture decisions into terms non-technical leadership could act on, coordinating across product, backend and infrastructure.",
    ],
  },
  {
    title: "Freelance Developer",
    company: "Self-Employed",
    period: "Apr 2022 – Oct 2025",
    location: "Kuala Lumpur, Malaysia",
    description:
      "Independent practice building mobile and web products end to end for healthcare, logistics and IoT clients — scoping, architecture, delivery and deployment.",
    type: "work",
    tech: ["Flutter", "Dart", "Laravel", "FilamentPHP", "Livewire", "PHP", "MySQL", "PostgreSQL", "Firebase", "Docker", "Kotlin", "MQTT", "Stripe"],
    achievements: [
      "Built RESTful APIs for 8+ mobile and web applications at 99.5% uptime and sub-200ms average response time.",
      "Built NADI Meditech: online consultation, offline booking and medical product ordering, handling 1,000+ daily records with RBAC across 3 user tiers.",
      "Built Cargozaa, a container-leasing marketplace in Laravel with GPS tracking, Stripe payments and Ollama-powered AI search; configured the VPS and Docker infrastructure personally.",
      "Implemented real-time sensor sync over MQTT, reducing sync conflicts by 75% across distributed systems.",
      "Delivered the Platinum and Femo projects at 95% client satisfaction with zero critical post-launch bugs.",
      "Ran a structured delivery process: scoping meeting up front, weekly check-ins, documented deliverables throughout.",
    ],
  },
  {
    title: "Full Stack Developer (Internship)",
    company: "TriSquare Technology (M) Sdn. Bhd.",
    period: "Jul 2024 – Feb 2025",
    location: "Kuala Lumpur, Malaysia",
    description:
      "Laravel backend work with a security and AI slant — production APIs, third-party threat scanning, and zero-downtime deployment.",
    type: "internship",
    tech: ["Laravel", "PHP", "FilamentPHP", "Flutter", "Kotlin", "MySQL", "PostgreSQL", "Tailwind CSS", "JavaScript"],
    achievements: [
      "Built Laravel APIs serving 10,000+ requests per day at a 99.2% success rate.",
      "Integrated Gemini AI and the VirusTotal API, reducing manual security checks by 80%.",
      "Deployed 3 applications to production using a zero-downtime strategy.",
      "Optimized database queries, cutting page load time by 40% (1.5s to 0.9s).",
    ],
  },
  {
    title: "Junior Mobile App Developer",
    company: "Mahiran Digital Sdn. Bhd.",
    period: "Oct 2022 – May 2023",
    location: "Pahang, Malaysia",
    description:
      "Flutter delivery with Clean Architecture, plus self-directed expansion into Laravel Livewire and Tailwind on the frontend.",
    type: "work",
    tech: ["Flutter", "Dart", "GetX", "Provider", "Clean Architecture", "REST APIs", "OAuth 2.0"],
    achievements: [
      "Developed 5 Flutter apps with GetX/Provider state management, reaching 15,000+ total users.",
      "Applied Clean Architecture principles, reducing code complexity by 50%.",
      "Integrated 8 third-party APIs at 99% reliability, averaging 2 days per integration.",
      "Delivered projects 15% ahead of schedule with a 98% bug-free rate in production.",
      "Built REST APIs with OAuth 2.0 token authentication for Femo, a social web application.",
      "Self-taught Laravel Livewire and Tailwind CSS on the job to broaden contribution beyond mobile.",
    ],
  },
  {
    title: "Web Developer",
    company: "Zeto Sdn. Bhd.",
    period: "Aug 2021 – Jan 2022",
    location: "Kuala Lumpur, Malaysia",
    description:
      "First professional role — responsive frontend delivery from client mockups, with a focus on performance budgets.",
    type: "internship",
    tech: ["HTML", "CSS", "JavaScript", "Bootstrap", "PHP", "MySQL"],
    achievements: [
      "Built 12+ responsive web pages with 100% mobile compatibility across 5 device sizes.",
      "Reduced page load time by 45% through optimized HTML/CSS/JS.",
      "Achieved a 95/100 Google Lighthouse performance score across all delivered pages.",
    ],
  },
];

// ===== SKILLS =====
export const SKILLS: SkillCategory[] = [
  {
    title: "Mobile",
    note: "4+ years — primary discipline",
    skills: [
      "Flutter", "Dart", "Kotlin", "Java", "Native Platform Channels",
      "Riverpod", "Provider", "GetX", "Clean Architecture",
      "Hive", "SQLite", "Dio", "GetIt", "Flutter Secure Storage",
      "Connectivity Plus", "Shorebird (OTA)", "Agora RTC", "SignalR",
      "Firebase Cloud Messaging", "Syncfusion PDF", "Flutter Quill",
      "Widget & integration testing", "Background services",
    ],
  },
  {
    title: "Backend & APIs",
    note: "Laravel from architecture through deployment",
    skills: [
      "PHP", "Laravel", "Livewire", "FilamentPHP",
      "Laravel Sanctum", "Laravel Passport", "Laravel Policies",
      "Spatie Permission", "Spatie Activitylog", "Filament Shield", "Filament Logger",
      "REST API design", "Microservice architecture", "Controller-Service-Repository",
      "API rate limiting", "Laravel Scramble", "Swagger", "Pusher",
    ],
  },
  {
    title: "Databases",
    note: "Including multi-schema Oracle in production",
    skills: [
      "Oracle", "PostgreSQL", "MySQL", "SQL Server",
      "Firebase", "Supabase", "Adminer",
    ],
  },
  {
    title: "Mobile Security",
    note: "Banking-grade threat defense and pentesting",
    skills: [
      "Zimperium zDefend", "Zimperium zScan", "Zimperium zShield",
      "Mobile pentesting", "Frida", "Magisk", "Reverse engineering",
      "RASP", "Malware detection", "AES-256-GCM", "PBKDF2", "OAuth2",
      "OWASP-aligned practices", "GDPR/CCPA-aware design",
    ],
  },
  {
    title: "Web Frontend",
    note: "Lighter and more recent than mobile — one shipped product",
    skills: [
      "React 18", "TypeScript", "JavaScript", "Vite",
      "Tailwind CSS", "shadcn/ui", "Radix UI", "Framer Motion",
      "TanStack Query", "React Hook Form", "Zod", "React Router",
      "HTML5", "CSS", "Bootstrap",
    ],
  },
  {
    title: "Infrastructure & DevOps",
    note: "Self-managed VPS deployments, not managed cloud",
    skills: [
      "Docker", "Linux", "Nginx", "VPS configuration",
      "CI/CD pipelines", "Git", "GitHub", "GitLab", "Postman", "Agile/Scrum",
    ],
  },
  {
    title: "AI in the workflow",
    note: "Daily practice, and shipped inside products",
    skills: ["Claude Code", "Claude Cowork", "Gemini AI", "Ollama"],
  },
  {
    title: "Integrations",
    skills: [
      "Stripe", "iBayar", "Payment gateways",
      "MQTT", "GPS SDK", "Real-time data sync",
      "Jira", "Trello", "SharePoint",
    ],
  },
];

/**
 * Deliberately listed so the skill claims above stay credible.
 * Sourced from the master profile's "not in background" section.
 */
export const NOT_MY_STACK: string[] = [
  "Node.js as a primary backend",
  "MongoDB, DynamoDB, Cassandra",
  "Redis / Memcached",
  "Spring Boot, Symfony",
  "Managed cloud (AWS, GCP, OVH)",
  "Kafka, RabbitMQ, SQS",
  "BLE / Bluetooth in Flutter",
  "BLoC / Cubit — I use GetX, Provider and Riverpod instead",
];

// ===== EDUCATION =====
export const EDUCATION: Education[] = [
  {
    degree: "BSc Computer Science (Software Engineering), Honours",
    institution: "Universiti Malaysia Pahang Al-Sultan Abdullah",
    period: "Feb 2022 – Jun 2024",
    note: "EQF level 6 · CGPA 3.62",
    thesis: "GooLancer: A Mobile App Enhancing Freelancer-Client Collaborations in Malaysia's Creative Gig Economy",
  },
  {
    degree: "Diploma in Computer Science",
    institution: "Universiti Malaysia Pahang Al-Sultan Abdullah",
    period: "Jun 2019 – Jan 2022",
    note: "EQF level 5 · CGPA 3.62",
    thesis: "lastPiece M-Commerce Application",
  },
];

// ===== HEADLINE STATS =====
export const STATS: Stat[] = [
  { value: "4+", label: "Years building software" },
  { value: "20M+", label: "Users on apps I secure" },
  { value: "100K+", label: "Users on gov platforms shipped" },
  { value: "8", label: "Engineers led" },
];

// ===== FOCUS AREAS =====
export const FOCUS_AREAS: FocusArea[] = [
  {
    title: "Mobile Development",
    summary:
      "Production Flutter apps with offline-first architecture, clean separation of concerns, and native platform channels where the SDK ends and the OS begins.",
    tools: ["Flutter", "Dart", "Riverpod", "GetX", "Hive", "Kotlin"],
  },
  {
    title: "Backend Engineering",
    summary:
      "Laravel APIs designed as bounded services rather than one monolith — versioned routes, consistent JSON contracts, and audit logging built in from the start.",
    tools: ["Laravel", "PHP", "Oracle", "PostgreSQL", "Docker", "Sanctum"],
  },
  {
    title: "Mobile Security",
    summary:
      "Runtime application self-protection and threat detection for banking-grade apps, plus the pentesting side — Frida, reverse engineering, remediation write-ups.",
    tools: ["Zimperium", "Frida", "Magisk", "RASP", "AES-256-GCM", "OAuth2"],
  },
];

// ===== WORKING STYLE =====
export const WORKING_STYLE: string[] = [
  "T-shaped by choice — I move between Flutter and Laravel rather than specialising narrowly, which means I can own a feature from the screen to the database.",
  "I run Dart/Flutter and Laravel PHP workshops for students and fresh graduates. Teaching a thing is how I find out whether I actually understand it.",
  "Structured delivery: a scoping meeting before anything is built, weekly check-ins to reprioritise, and documentation written as I go rather than at the end.",
  "I translate architecture decisions into terms non-technical stakeholders can act on — that was most of the job while leading a team of eight.",
  "AI coding tools (Claude Code, Gemini, Ollama) are part of my normal workflow for review and refactoring, and ship inside my products for threat analysis and search.",
  "Comfortable without close supervision, and most useful in fast-moving, resource-constrained teams.",
];

// ===== AWARDS =====
export const AWARDS: Award[] = [
  { title: "1st Place, Astro NACSA Coding Challenge 2024", subtitle: "PassAnda secure password manager; award presented by the Prime Minister of Malaysia, Dato Seri Anwar Ibrahim", year: "2024" },
  { title: "Gold Award, Final Year Project", subtitle: "lastPiece M-Commerce app; Diploma in Computer Science", year: "2021" },
  { title: "Winner, UMP Huawei Competition 2023", subtitle: "everBrain mobile app; first place", year: "2023" },
  { title: "Silver Award, iCE-CInno 2024", subtitle: "GooLancer freelance platform; International Competition and Exhibition on Computing Innovation", year: "2024" },
  { title: "Best Project & 5th Place Overall, DICRATHON 2024", subtitle: "MySihat telehealth platform; AI-driven tools for healthcare in rural areas", year: "2024" },
];

// ===== RESUME =====
export const RESUME: Resume = {
  // Served from public/. Spaces in the filename are percent-encoded.
  url: "/CV%20-%20Shatthiya.pdf",
  filename: "Shatthiya-Ganes-CV.pdf", // name the browser saves it as
  lastUpdated: "2026",
};

// ===== PROFILE =====
export const PROFILE: Profile = {
  name: "Shatthiya Ganes",
  handle: "satiyaganes06",
  tagline: "Software Developer · Flutter · Laravel · API · Mobile Security",
  about: "Full Stack Mobile Developer specialising in Mobile Security, with four years of experience building production-grade Flutter applications and Laravel backends from government platforms serving 100,000+ users to fintech and banking apps securing 20 million+ active users. Currently at Vigilant Asia integrating Zimperium's Mobile Threat Defense into Maybank's mobile banking app, and the builder of PassAnda, a zero-knowledge offline-first password manager that won 1st Place at the Astro NACSA Coding Challenge 2024 (National cyber security Agency), presented by the Prime Minister of Malaysia.",
  contact: {
    email_masked: "satiyaganes.sg@gmail.com",
    phone_masked: "+601163348685",
    open_to: "Open to Overseas Roles",
  },
  location: "Kuala Lumpur, Malaysia",
  locationNote: "Relocating to Germany / EU · Visa sponsorship required",
  socials: {
    github: "https://github.com/satiyaganes06",
    linkedin: "https://www.linkedin.com/in/satiya-ganes-b0a315209",
    twitter: "https://twitter.com/satiyaganes06",
    website: "https://www.satiyaganes.site",
    xing: "https://xing.com/satiyaganes06",
    medium: "https://medium.com/@satiyaganes.sg",
    resume: "/CV%20-%20Shatthiya.pdf",
  },
  education: { summary: "Universiti Malaysia Pahang Al-Sultan Abdullah — Bachelor of Computer Science (Software Engineering) with Honours, CGPA 3.62; Diploma in Computer Science, CGPA 3.62." },
  roles: ["Mobile Security Engineer", "Full Stack Mobile Developer", "Flutter Developer", "Laravel Developer"],
  languages: [
    { name: "Tamil", level: "Native" },
    { name: "Malay", level: "C1" },
    { name: "English", level: "B2" },
    { name: "German", level: "A1" },
    { name: "Spanish", level: "A1" },
  ],
};


// ===== SONGS (Now Listening Widget) =====
export type Song = {
  title: string;
  artist: string;
};

export const SONGS: Song[] = [
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
  { id: 3, title: "Eat first, code second", completed: false },
  { id: 4, title: "Exploring 80's & 90's music", completed: false },
  { id: 5, title: "Reading & Movies", completed: false },
  { id: 6, title: "Open to overseas & remote roles", completed: false },
];

// ===== HOBBIES =====
export type Hobby = string;

export const HOBBIES: Hobby[] = [
  "Complex Lego sets — the Van Gogh Starry Night build is the favourite",
  "Puzzle and mystery-style builds",
  "Small wood-working projects",
  "Football",
  "Badminton",
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
 * Get education entries
 */
export function getEducation(): Education[] {
  return EDUCATION;
}

/**
 * Get headline stats
 */
export function getStats(): Stat[] {
  return STATS;
}

/**
 * Get focus areas
 */
export function getFocusAreas(): FocusArea[] {
  return FOCUS_AREAS;
}

/**
 * Get working style notes
 */
export function getWorkingStyle(): string[] {
  return WORKING_STYLE;
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
