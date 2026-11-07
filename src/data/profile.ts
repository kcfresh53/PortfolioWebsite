import { defineEntry } from './projects';
import type { Entry, EntryLink } from './types';

export interface Job {
  readonly org: string;
  readonly title: string;
  readonly period: string;
  readonly place: string;
  readonly points: readonly string[];
}

export interface Award {
  readonly title: string;
  readonly issuer: string;
  readonly date: string;
}

export interface SocialLink extends EntryLink {
  readonly handle: string;
}

export const profile = {
  name: 'Kenechukwu Ozoemene',
  short: 'KC',
  role: 'Game & Software Developer',
  location: 'Oshawa, Ontario',
  tagline: 'I build the engines, tools and rendering tech that games run on, and ship the games on top.',
  about: [
    'Versatile software and game developer with a passion for efficient, creative solutions. My work spans engine and tools programming, real-time rendering, game design and technical leadership, from contract roles to executive positions.',
    'I design interactive experiences and system architecture for both 2D and 3D, with a focus on intuitive user experiences, clean code and performance in real-time environments. I also write the tutorials, docs and user-facing tools around my work, which feeds naturally into teaching.',
  ],
  email: 'kenechukwu.ozoemene@ontariotechu.net',
} as const;

export const socials: readonly SocialLink[] = [
  { label: 'GitHub', handle: 'kcfresh53', href: 'https://github.com/kcfresh53', kind: 'code' },
  { label: 'LinkedIn', handle: 'kenechukwu-ozoemene', href: 'https://www.linkedin.com/in/kenechukwu-ozoemene-392b80214/', kind: 'site' },
  { label: 'itch.io', handle: 'kcfresh53', href: 'https://kcfresh53.itch.io/', kind: 'play' },
  { label: 'YouTube', handle: '@kcfresh53', href: 'https://www.youtube.com/@kcfresh53', kind: 'video' },
  { label: 'Email', handle: profile.email, href: `mailto:${profile.email}`, kind: 'mail' },
];

export const experience: readonly Job[] = [
  {
    org: 'Ontario Tech University',
    title: 'Teaching Assistant',
    period: '09/2026 – Present',
    place: 'Oshawa, ON',
    points: [
      'Created and presented teaching material for Game Development Workshop III.',
      'Graded material for Game Engines Development.',
      'Taught material for and graded Game Development Workshop V.',
    ],
  },
  {
    org: 'Ontario Tech University',
    title: 'Lab Monitor',
    period: '09/2024 – 08/2026',
    place: 'Oshawa, ON',
    points: [
      'Developed and maintained lab analytics software for tracking student lab and equipment usage.',
      'Maintained and repaired 3D printers and other equipment; managed lab inventory.',
    ],
  },
  {
    org: 'Full Circle CS',
    title: 'Engine Developer (Contract)',
    period: '07/2024 – 06/2026',
    place: 'Whitby, ON',
    points: [
      'Built an entire bespoke 2D/3D interactive media engine for web and other portable environments.',
      'Developed a 2D game framework in Godot and ported a game onto it.',
      'Handled miscellaneous web and Godot porting tasks.',
    ],
  },
  {
    org: 'Datus AI',
    title: 'Chief Technical Officer',
    period: '03/2023 – 07/2023',
    place: 'Abuja, Nigeria',
    points: [
      'Spearheaded CombsAI, a legal-assistant chatbot for lawyers and law firms.',
      'Selected the company’s core technologies; built the tool used to train the language model and established the APIs.',
      'Negotiated directly with law firms during the initial investment phase.',
    ],
  },
  {
    org: 'Sprout',
    title: 'Chief Technical Officer',
    period: '02/2022 – 02/2023',
    place: 'Lagos, Nigeria',
    points: ['Formulated a novel framework and reconfigured an open-source language to meet the company’s developers’ needs.'],
  },
  {
    org: 'ScholarX',
    title: 'Animator and Voiceover Artist',
    period: '11/2021 – 01/2022',
    place: 'Lagos, Nigeria',
    points: ['Produced weekly animated course videos and delivered the professional narration for each script.'],
  },
];

export const education: readonly string[] = [
  'B.IT, Information Systems in Business and Game Development · Ontario Tech University',
  'B.Sc, Computer Science · American University of Nigeria',
];

export const languages: readonly string[] = [
  'C#', 'GDScript', 'TypeScript', 'JavaScript', 'Python', 'Rust', 'GLSL', 'Java', 'Delphi', 'R', 'Bash', 'LaTeX', 'YAML', 'Turbo Pascal',
];

export const technologies: readonly string[] = ['Godot', 'Unity', 'Svelte', 'wgpu', 'SDL3', 'Box2D', 'AI integration', 'APIs'];

export const otherSkills: readonly string[] = [
  '3D printing',
  'Design and color theory',
  'Photo editing',
  'Public speaking',
  'Robotics',
  'Strategic planning',
  'System analysis',
  'Web design',
  'Writing',
];

export const awards: readonly Award[] = [
  { title: 'Best Tech Award', issuer: 'GDSA (GameCon 2025, Sword & Sail)', date: '03/2025' },
  { title: 'Ubisoft’s Choice Award', issuer: 'Ubisoft (GameCon 2025, Sword & Sail)', date: '03/2025' },
  { title: '3rd place, ACM chapter programming competition', issuer: 'American University of Nigeria', date: '01/2022' },
  { title: 'COBIS Student Achievement Award', issuer: 'Council of British International Schools', date: '01/2021' },
];

/** The "Profile" shelf reuses the stack UI, so each résumé block becomes an entry. */
export const profileEntries: readonly Entry[] = [
  defineEntry({
    id: 'about',
    category: 'profile',
    title: 'About Me',
    tagline: profile.tagline,
    role: profile.role,
    period: '',
    status: profile.location,
    summary: profile.about.join('\n\n'),
    highlights: [],
    tech: ['Engines', 'Tools', 'Rendering', 'Teaching'],
    accent: '#ffc83d',
    icon: 'user',
  }),
  defineEntry({
    id: 'experience',
    category: 'profile',
    title: 'Experience',
    tagline: 'Engine developer, lab software author, teaching assistant, two-time CTO.',
    role: 'Work history',
    period: '2021 – now',
    status: 'Currently teaching at Ontario Tech',
    summary: '',
    accent: '#ffb02e',
    icon: 'user',
    sections: experience.map((job: Job) => ({
      heading: `${job.title} · ${job.org}`,
      lines: [`${job.period} · ${job.place}`, ...job.points],
    })),
  }),
  defineEntry({
    id: 'skills',
    category: 'profile',
    title: 'Skills & Education',
    tagline: 'C#, TypeScript, Rust, GDScript, GLSL, and more.',
    role: 'Toolbox',
    period: '',
    status: 'Ontario Tech · American University of Nigeria',
    summary: '',
    accent: '#ffd45e',
    icon: 'user',
    sections: [
      { heading: 'Languages', lines: [languages.join(' · ')] },
      { heading: 'Engines & technologies', lines: [technologies.join(' · ')] },
      { heading: 'Also', lines: [otherSkills.join(' · ')] },
      { heading: 'Education', lines: education },
    ],
  }),
  defineEntry({
    id: 'awards',
    category: 'profile',
    title: 'Awards',
    tagline: 'Best Tech, Ubisoft’s Choice, ACM, COBIS.',
    role: 'Recognition',
    period: '2021 – 2025',
    status: '4 awards',
    summary: '',
    accent: '#ffe08a',
    icon: 'user',
    sections: [
      {
        heading: 'Awards & certifications',
        lines: awards.map((a: Award) => `${a.title}: ${a.issuer} (${a.date})`),
      },
    ],
    links: [{ label: 'GameCon 2025 results', href: 'https://www.gamecon.ca/gamecon2025awards', kind: 'site' }],
  }),
  defineEntry({
    id: 'contact',
    category: 'profile',
    title: 'Contact',
    tagline: 'Open to game engine, tools and rendering roles.',
    role: 'Say hello',
    period: '',
    status: profile.location,
    summary: 'The fastest way to reach me is email. I’m always happy to talk engines, tools or rendering.',
    accent: '#ffc83d',
    icon: 'user',
    links: socials.map((s: SocialLink): EntryLink => ({ label: `${s.label} · ${s.handle}`, href: s.href, kind: s.kind })),
  }),
];
