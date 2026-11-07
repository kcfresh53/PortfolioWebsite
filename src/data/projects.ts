import type { CategoryId, Entry, EntryLink, IconName, MediaItem, Section } from './types';

interface EntryInput {
  readonly id: string;
  readonly category: CategoryId;
  readonly title: string;
  readonly tagline: string;
  readonly role: string;
  readonly period: string;
  readonly status: string;
  readonly summary: string;
  readonly highlights?: readonly string[];
  readonly tech?: readonly string[];
  readonly links?: readonly EntryLink[];
  readonly cover?: string | null;
  readonly coverFit?: 'cover' | 'contain';
  readonly media?: readonly MediaItem[];
  readonly accent: string;
  readonly icon: IconName;
  readonly sections?: readonly Section[];
}

export function defineEntry(input: EntryInput): Entry {
  return {
    ...input,
    highlights: input.highlights ?? [],
    tech: input.tech ?? [],
    links: input.links ?? [],
    cover: input.cover ?? null,
    coverFit: input.coverFit ?? 'cover',
    media: input.media ?? [],
  };
}

const img = (src: string, alt: string): MediaItem => ({ type: 'image', src, alt });
const yt = (id: string, alt: string): MediaItem => ({ type: 'youtube', src: id, alt });

// ───────────────────────── remote media ─────────────────────────
const STEAM: string = 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/5026810';
const SQS: string = 'https://images.squarespace-cdn.com/content/v1/605012537c48962521eb0481';
const VELOX: string = 'https://www.veloxeditor.com';
const ASSET_STORE: string = 'https://asset-store-prod.fra1.digitaloceanspaces.com/assets/1128';
const GODOT_SHADERS: string = 'https://godotshaders.com/wp-content/uploads/2021/01';

const FRESH_STACKER_HEADER: string = `${STEAM}/59b03086abb68551790a36dd7cb3384d3e68a869/header.jpg`;
const FRESH_STACKER_SHOT: string = `${STEAM}/717c0c1eb12ccbd793d44d1ecd304d24deb613d1/ss_717c0c1eb12ccbd793d44d1ecd304d24deb613d1.1920x1080.jpg`;

const SWORD_TITLE: string = `${SQS}/ca1cecd3-c160-4090-921a-20f819faef36/SSStitle.png`;

export const games: readonly Entry[] = [
  defineEntry({
    id: 'fresh-stacker',
    category: 'games',
    title: 'Fresh Stacker',
    tagline: 'A fast-paced, highly customizable tetromino stacking game.',
    role: 'Developer',
    period: '2026',
    status: 'Live on Steam',
    summary:
      'A competitive stacking game released on Steam through Kc Tech Studios. It pairs tight, tunable handling with online versus play and a deep practice toolkit for people who want to get better at the genre.',
    highlights: [
      'Online 1v1 matchmaking and friend lobbies, plus VS Bot (three difficulties), local co-op and Bot vs Bot.',
      'Opener Practice with 138 openers and 631 variations, a Custom Lab, Zen, Marathon, Sprint and 4-Wide modes.',
      'Handling options, fully remappable controls, controller support and a built-in level editor.',
      'Ships on Windows, macOS and Linux/SteamOS.',
    ],
    tech: ['Steam', 'Windows', 'macOS', 'Linux'],
    links: [
      { label: 'View on Steam', href: 'https://store.steampowered.com/app/5026810/Fresh_Stacker/', kind: 'store' },
    ],
    cover: FRESH_STACKER_SHOT,
    media: [img(FRESH_STACKER_SHOT, 'Fresh Stacker gameplay screenshot'), img(FRESH_STACKER_HEADER, 'Fresh Stacker store header')],
    accent: '#ff4d6d',
    icon: 'gamepad',
  }),
  defineEntry({
    id: 'sword-and-sail',
    category: 'games',
    title: 'Sword & Sail',
    tagline: 'An open-zone pirate adventure across the shores of Turtle Isle.',
    role: 'Lead Programmer',
    period: '2025',
    status: 'GameCon 2025 · Best Tech winner',
    summary:
      'An open-zone pirate adventure by Icarus Entertainment, built by a team of seven for GameCon 2025. Players explore the islands of Turtle Isle and take on the tyrants who control them. Each island has its own setting and items, and the way those items are used changes from island to island. I led the programming.',
    highlights: [
      'Winner: Best Tech and Ubisoft’s Choice at GameCon 2025.',
      'Nominated for Best Second Year and Best Sound.',
      'Led the programming on a seven-person team of programmers, designers and artists.',
    ],
    tech: ['Team of 7', 'Lead programmer', 'GameCon 2025'],
    links: [
      { label: 'GameCon page', href: 'https://www.gamecon.ca/2025/second/icarus-entertianment', kind: 'site' },
      { label: 'Award results', href: 'https://www.gamecon.ca/gamecon2025awards', kind: 'site' },
    ],
    cover: SWORD_TITLE,
    media: [
      img(SWORD_TITLE, 'Sword & Sail title art'),
      img(`${SQS}/935bcb1d-af8b-4e1e-bdc1-384c92a84263/Screenshot+2025-03-21+011951.png`, 'Sword & Sail screenshot 1'),
      img(`${SQS}/417a3623-6cf2-4360-adb0-ba24fe4458c5/Screenshot+2025-03-21+012414.png`, 'Sword & Sail screenshot 2'),
      img(`${SQS}/382e43c3-3a3b-4e14-ae85-12c47f3c6cdf/Screenshot+2025-03-21+012300.png`, 'Sword & Sail screenshot 3'),
      img(`${SQS}/dec7293b-9949-4b83-bfc4-0955eb8bfac0/Screenshot+2025-03-21+012145.png`, 'Sword & Sail screenshot 4'),
      img(`${SQS}/eab5451e-d6cf-4394-bca9-3e60b44dd894/Screenshot+2025-03-21+012034.png`, 'Sword & Sail screenshot 5'),
    ],
    accent: '#ff9f43',
    icon: 'gamepad',
  }),
  defineEntry({
    id: 'project-overcharge',
    category: 'games',
    title: 'Project Overcharge',
    tagline: 'A high-energy racing game, currently in development.',
    role: 'Lead Developer',
    period: '',
    status: 'In development',
    summary:
      'A racing game I’m building with my team as lead developer. The current build runs on a seaside street circuit with AI opponents, an authored track route, an atmosphere controller and coastal water rendering.',
    highlights: [
      'AI-driven opponents racing along an authored track route.',
      'Dedicated atmosphere controller, wind and coastal water systems.',
      'Baked, instanced foliage to keep a palm-lined street course fast.',
      'Gameplay UI rig and race start/finish flow already wired into the scene.',
    ],
    tech: ['Unity', 'C#', 'Team project'],
    cover: 'img/project-overcharge.webp',
    media: [img('img/project-overcharge.webp', 'Project Overcharge track in the Unity editor')],
    accent: '#ff6b9d',
    icon: 'gamepad',
  }),
  defineEntry({
    id: 'masked-out',
    category: 'games',
    title: 'Masked Out',
    tagline: 'Mask shapes out of the world to dig toward precious ore.',
    role: 'Team member',
    period: '2026',
    status: 'Global Game Jam 2026',
    summary:
      'A short single-player 2D puzzle platformer made during Global Game Jam 2026 in Godot with Bnuey and MaxFreya. A magic staff masks shapes out of the world to open paths to ore; five levels, no single required solution.',
    highlights: [
      'Built in Godot within the jam window.',
      'Five levels designed around open-ended solutions rather than one intended path.',
      'Playable in the browser, or on Windows and Linux.',
    ],
    tech: ['Godot', 'GDScript', 'Game jam', 'HTML5'],
    links: [{ label: 'Play on itch.io', href: 'https://bnuey.itch.io/masked-out', kind: 'play' }],
    cover: 'https://img.itch.zone/aW1nLzI1MzM2ODA5LnBuZw==/original/5X4l1j.png',
    media: [img('https://img.itch.zone/aW1nLzI1MzM2ODA5LnBuZw==/original/5X4l1j.png', 'Masked Out cover art')],
    accent: '#ffd23f',
    icon: 'gamepad',
  }),
  defineEntry({
    id: 'type-heist',
    category: 'games',
    title: 'TYPE//HEIST',
    tagline: 'A spy-themed typing trainer disguised as an arcade game.',
    role: 'Developer',
    period: '',
    status: 'Playable in browser',
    summary:
      'A browser game framed as a “Phantom Typist Training Program”. Four trials test typing speed, accuracy and reaction under pressure.',
    highlights: [
      'Speed Test, Accuracy Test (no backspace), timer-free Free Type, and the Word Attack arcade mode.',
      'Word Attack: falling words, HP, combo and wave tracking, plus repair, jackpot and slow-motion power-ups.',
      'Fully keyboard-driven menu, with music and SFX toggles.',
    ],
    tech: ['Web', 'Keyboard-first', 'Arcade'],
    links: [{ label: 'Play now', href: 'https://kcfresh53.github.io/TypeHeist/', kind: 'play' }],
    cover: 'img/typeheist-menu.webp',
    media: [img('img/typeheist-menu.webp', 'TYPE//HEIST trial select menu'), img('img/typeheist-free.webp', 'TYPE//HEIST Free Type mode')],
    accent: '#f9d342',
    icon: 'gamepad',
  }),
];

export const tools: readonly Entry[] = [
  defineEntry({
    id: 'hedgehog2d',
    category: 'tools',
    title: 'Hedgehog2D',
    tagline: 'An editor-first 2D engine for Sonic-style momentum platformers.',
    role: 'Creator',
    period: '2026',
    status: 'Working editor prototype',
    summary:
      'A game engine written in modern C# on .NET 10 with SDL3 and Box2D v3. Dependencies flow one way and the core has no third-party dependencies, so it can be unit-tested in isolation. Scenes, UI and behaviour are authored through purpose-built visual tools.',
    highlights: [
      'Entity–component–system with packed, cache-friendly sparse-set component stores and a fixed-timestep loop with render interpolation.',
      'QuillScript: a statically-typed, GDScript-flavoured scripting language that transpiles to C#, with a full compiler pipeline and an integrated script editor.',
      'Docked editor with a WYSIWYG UI designer, a Scene Flow transition graph, undo/redo and a live viewport.',
      'Sonic momentum character controller, gamepad input, audio and Box2D physics behind interface seams.',
      'Effect-stack editor with layered glow, outline and hue-cycle effects previewed live on a sprite.',
      'Covered by automated test suites.',
    ],
    tech: ['C#', '.NET 10', 'SDL3', 'Box2D v3', 'ECS', 'Custom language'],
    cover: 'img/hedgehog2d-editor.webp',
    media: [img('img/hedgehog2d-editor.webp', 'Hedgehog2D effect stack editor'), img('img/hedgehog2d-logo.webp', 'Hedgehog2D logo')],
    accent: '#19c9a0',
    icon: 'cube',
  }),
  defineEntry({
    id: 'velox-editor',
    category: 'tools',
    title: 'Velox Editor',
    tagline: 'The video editor that speaks your language.',
    role: 'Creator',
    period: '',
    status: 'Available for $20',
    summary:
      'A multi-track video editor for macOS, Windows and Linux whose headline feature is Script FX: write JavaScript to generate animated graphs, live waveforms and lower-thirds that render straight into your export.',
    highlights: [
      'Script FX clips run in a sandboxed worker with no network or DOM access.',
      'Multi-track timeline with snapping and undo/redo, keyframes with cubic-bezier easing, and motion tracking.',
      'Colour correction, chroma key with spill suppression, transitions and non-destructive cropping.',
      'Whisper-based automatic subtitles, plus MP4/WebM/MOV export with GPU acceleration across VideoToolbox, NVENC, VA-API, QSV and AMF.',
    ],
    tech: ['JavaScript', 'Whisper', 'ffprobe', 'GPU encode', 'Cross-platform'],
    links: [
      { label: 'veloxeditor.com', href: 'https://www.veloxeditor.com/', kind: 'site' },
      { label: 'YouTube channel', href: 'https://www.youtube.com/@kcfresh53/videos', kind: 'video' },
    ],
    cover: `${VELOX}/image9.webp`,
    media: ['image9', 'image4', 'image6', 'image5', 'image7', 'image8', 'image10'].map(
      (name: string): MediaItem => img(`${VELOX}/${name}.webp`, `Velox Editor screenshot (${name})`),
    ),
    accent: '#5b8cff',
    icon: 'cube',
  }),
  defineEntry({
    id: 'nesfab-studio',
    category: 'tools',
    title: 'NESFab Studio',
    tagline: 'An IDE for making Nintendo Entertainment System games.',
    role: 'Creator',
    period: '',
    status: 'v0.1 on itch.io',
    summary:
      'A graphical environment for the NESFab language: write, edit and build NES homebrew with an integrated code editor, CHR sprite editor and level tools, then export a playable .nes ROM in one click.',
    highlights: [
      'CHR editor for 8×8 tiles across banks, with palettes and live preview.',
      'Metatile composer and a nametable/level editor with separate tile and object layers.',
      'Typed object system for placing entities on the map.',
      'One-click build: generates data from maps, compiles NESFab to 6502 assembly and outputs a ROM.',
    ],
    tech: ['NESFab', '6502', 'Desktop IDE', 'macOS', 'Linux'],
    links: [
      { label: 'Get it on itch.io', href: 'https://kcfresh53.itch.io/nesfab-studio', kind: 'store' },
      { label: 'Project site', href: 'https://kcfresh53.github.io/NESFabStudioWebsite/', kind: 'site' },
    ],
    cover: 'img/nesfab-studio.webp',
    media: [
      img('img/nesfab-studio.webp', 'NESFab Studio metatile editor'),
      yt('g4zzqUnPiHE', 'NESFab Studio showcase video'),
      img('https://kcfresh53.github.io/NESFabStudioWebsite/NESFabStudio-iOS-Dark-1024x1024_1x.png', 'NESFab Studio icon'),
    ],
    accent: '#ff5a5a',
    icon: 'cube',
  }),
  defineEntry({
    id: 'spritesheet-unpacker',
    category: 'tools',
    title: 'KC’s Sprite Sheet Unpacker',
    tagline: 'Cross-platform splitting of irregular sprite sheets.',
    role: 'Creator',
    period: '',
    status: 'Name-your-price on itch.io',
    summary:
      'Splits irregular sprite sheets into tile sheets for engines like Godot and batch-exports images. I built it because I wanted a cross-platform unpacker, and because I enjoy making interactive user interfaces.',
    highlights: [
      'Handles irregular layouts, not just uniform grids.',
      'Batch image export.',
      'Native builds for Windows, macOS (Apple Silicon and Intel) and Linux.',
    ],
    tech: ['Desktop', 'Cross-platform', 'Godot-friendly'],
    links: [{ label: 'Download on itch.io', href: 'https://kcfresh53.itch.io/kcs-spritesheet-unpacker', kind: 'store' }],
    cover: 'https://img.itch.zone/aW1hZ2UvNDk3NzI3Mi8yOTc5MjAxOC5wbmc=/original/kZ9qBH.png',
    media: [
      img('https://img.itch.zone/aW1hZ2UvNDk3NzI3Mi8yOTc5MjAxOC5wbmc=/original/kZ9qBH.png', 'Sprite Sheet Unpacker drop screen'),
      img('https://img.itch.zone/aW1hZ2UvNDk3NzI3Mi8yOTc5MjAyOC5wbmc=/original/W9VOae.png', 'Sprite Sheet Unpacker screenshot'),
      img('https://img.itch.zone/aW1nLzI5NzkyMDE2LnBuZw==/original/TkoukB.png', 'Sprite Sheet Unpacker cover art'),
    ],
    accent: '#c58bff',
    icon: 'cube',
  }),
];

export const graphics: readonly Entry[] = [
  defineEntry({
    id: 'rendering-research',
    category: 'graphics',
    title: 'Real-Time GI Research',
    tagline: 'A new real-time global illumination technique. Paper in preparation.',
    role: 'Author · Researcher',
    period: '2026',
    status: 'Unpublished research',
    summary:
      'A rendering technique I developed for real-time diffuse global illumination in dynamic scenes, with a research paper currently in preparation. I’ll share the details here once it is published.',
    highlights: [
      'Runs in real time on consumer hardware, with moving lights, objects and camera.',
      'Built as a standalone research renderer and checked against a reference path tracer.',
      'Full write-up coming soon.',
    ],
    tech: ['Rust', 'wgpu', 'Global illumination', 'Real-time rendering'],
    cover: 'img/rendering-research.webp',
    media: [img('img/rendering-research.webp', 'Sponza scene rendered in real time with the technique')],
    accent: '#b78cff',
    icon: 'sparkles',
  }),
  defineEntry({
    id: 'procedural-city',
    category: 'graphics',
    title: 'Procedural City Generator',
    tagline: 'Generated skylines you can still fine-tune by hand.',
    role: 'Creator',
    period: '',
    status: 'Prototype',
    summary:
      'A procedural city generation system that you can fine-tune by hand after it generates, so a designer keeps control of the final layout instead of fighting the generator.',
    highlights: [
      'Distinct districts in the generated result: low-rise coloured blocks near the waterfront and glass towers behind them.',
      'Roads, trees and terrain generated together on a coastal island, with animated water.',
      'Hand-finetuning layered on top of the generated result.',
    ],
    tech: ['Procedural generation', 'Tools', 'Real-time 3D'],
    cover: 'img/procedural-city.webp',
    media: [img('img/procedural-city.webp', 'Generated island city with towers and a coastline')],
    accent: '#38d6ff',
    icon: 'sparkles',
  }),
  defineEntry({
    id: 'shader-plasma-waves',
    category: 'graphics',
    title: 'Plasma Waves',
    tagline: 'Animated plasma lines over a soft blue grid.',
    role: 'Author',
    period: 'Sep 2023',
    status: 'Godot Shaders',
    summary:
      'A Godot 4 canvas_item shader, ported from Shadertoy. Sixteen-line groups of wavy plasma with small circles travelling along each line, over a blue gradient with faded edges and a faint grid.',
    highlights: ['Driven entirely by TIME with sums of cosine functions.', 'Drop-in animated background for UI and menus.'],
    tech: ['GLSL / Godot shading language', 'canvas_item'],
    links: [{ label: 'View on Godot Shaders', href: 'https://godotshaders.com/shader/plasma-waves/', kind: 'code' }],
    cover: `${GODOT_SHADERS}/Screenshot-2023-09-26-172133.jpg`,
    media: [img(`${GODOT_SHADERS}/Screenshot-2023-09-26-172133.jpg`, 'Plasma Waves shader preview')],
    accent: '#4d7cff',
    icon: 'sparkles',
  }),
  defineEntry({
    id: 'shader-diamond-pattern',
    category: 'graphics',
    title: 'Animated Diamond Pattern',
    tagline: 'Pulsing diamond bands for backgrounds.',
    role: 'Author',
    period: 'Sep 2023',
    status: 'Godot Shaders',
    summary:
      'A Godot canvas_item background shader ported from Shadertoy. It rotates screen coordinates by 45°, tiles them, and draws diamond bands that pulse outward from white to light blue with alpha following the pattern.',
    highlights: ['Semi-transparent output, easy to layer behind UI.'],
    tech: ['Godot shading language', 'canvas_item'],
    links: [{ label: 'View on Godot Shaders', href: 'https://godotshaders.com/shader/animated-diamond-pattern/', kind: 'code' }],
    cover: `${GODOT_SHADERS}/Screenshot-2023-09-26-111418.png`,
    media: [img(`${GODOT_SHADERS}/Screenshot-2023-09-26-111418.png`, 'Animated Diamond Pattern shader preview')],
    accent: '#7fe0ff',
    icon: 'sparkles',
  }),
  defineEntry({
    id: 'shader-page-flip',
    category: 'graphics',
    title: 'Page Flip, Transparent Background',
    tagline: 'A page-turn shader that finally respects alpha.',
    role: 'Author',
    period: 'Sep 2023',
    status: 'Godot Shaders · CC0',
    summary:
      'An edited version of an existing page-turn shader that fixes its transparency issue, so a turning page can sit over anything. Set a scale uniform to match the node and drive mouse_pos from the cursor or an animation.',
    highlights: ['Released CC0.', 'Community-tested workaround for turning from other corners via a SubViewport.'],
    tech: ['Godot shading language', 'canvas_item'],
    links: [{ label: 'View on Godot Shaders', href: 'https://godotshaders.com/shader/page-flip-with-transparent-background/', kind: 'code' }],
    cover: `${GODOT_SHADERS}/Screenshot-2023-09-25-224425.png`,
    media: [img(`${GODOT_SHADERS}/Screenshot-2023-09-25-224425.png`, 'Page flip shader preview')],
    accent: '#ffb86b',
    icon: 'sparkles',
  }),
];

export const systems: readonly Entry[] = [
  defineEntry({
    id: 'storyblocks-editor',
    category: 'systems',
    title: 'StoryBlocks Editor',
    tagline: 'Tell your story with motion.',
    role: 'Engine Developer (contract)',
    period: '2024 – 2026',
    status: 'Sign-in required',
    summary:
      'A web tool for creating motion-based stories, built by Full Circle CS. I worked there as engine developer, building their bespoke 2D/3D interactive media engine for the web and other portable environments, and handling web and Godot porting work.',
    highlights: [
      'Built the full interactive media engine (2D/3D) for web and portable targets.',
      'Developed a 2D game framework in Godot and ported an existing game onto it.',
      'The editor itself is behind a login; request access from its sign-in page.',
    ],
    tech: ['Web', 'Interactive media engine', 'Godot'],
    links: [{ label: 'Open the editor', href: 'https://storyblockseditor-production.up.railway.app/', kind: 'site' }],
    accent: '#ffb347',
    icon: 'layers',
  }),
  defineEntry({
    id: 'lab-login-portal',
    category: 'systems',
    title: 'Game Dev Lab Portal',
    tagline: 'Check-in and usage analytics for a university game lab.',
    role: 'Designer · Developer',
    period: '2024 – 2026',
    status: 'Previous version',
    summary:
      'Software I made for the game development lab at Ontario Tech University to track student lab and equipment usage while I worked as a lab monitor. Students sign in with Google; staff get an admin dashboard and spreadsheet export.',
    highlights: [
      'Google OAuth sign-in with signed session tokens, plus admin sign-up and login flows.',
      'Admin dashboard for lab analytics, with XLSX export.',
      'Full-stack TypeScript on SvelteKit, with a Drizzle ORM + libSQL data layer.',
      'Sign-in and sign-out sound cues, and campus-at-night background art.',
    ],
    tech: ['SvelteKit', 'Svelte 5', 'TypeScript', 'Tailwind 4', 'Drizzle', 'libSQL', 'OAuth'],
    cover: 'img/lab-portal-bg.webp',
    media: [img('img/lab-portal-bg.webp', 'Lab portal landing background')],
    accent: '#4cd9a6',
    icon: 'layers',
  }),
  defineEntry({
    id: 'gamecon-2024',
    category: 'systems',
    title: 'GameCon 2024 Website',
    tagline: 'The showcase site for a student game-dev convention, with 3D visuals.',
    role: 'Web Developer',
    period: '2024',
    status: 'Archived',
    summary:
      'I built the 2024 website for GameCon, the annual showcase run by the Game Development Students Association at Ontario Tech University, including its 3D visuals. The site hosts each year’s games, pamphlet and awards.',
    highlights: [
      'Year-by-year game pages for first to fourth-year teams, a pamphlet and an awards page.',
      '3D visual treatment for the 2024 edition.',
      'The GDSA advances the Game Development program and runs GameCon.',
    ],
    tech: ['Web', '3D', 'Event site'],
    links: [
      { label: 'GameCon 2024', href: 'https://www.gamecon.ca/archives/2024', kind: 'site' },
      { label: 'About the GDSA', href: 'https://www.gamecon.ca/the-gdsa', kind: 'site' },
    ],
    cover: `${SQS}/f8186b6d-bbde-4d2a-9fc2-b07cd52c3daf/Inperson+Showcase.png`,
    media: [img(`${SQS}/f8186b6d-bbde-4d2a-9fc2-b07cd52c3daf/Inperson+Showcase.png`, 'GameCon in-person showcase banner')],
    accent: '#ff7ac6',
    icon: 'layers',
  }),
  defineEntry({
    id: 'scalable-vector-shapes-2d',
    category: 'systems',
    title: 'Scalable Vector Shapes 2D',
    tagline: 'Vector graphics, animation and rigging inside Godot 4.',
    role: 'Contributor',
    period: '',
    status: 'Open source · MIT',
    summary:
      'A Godot 4 addon by René van der Ark for drawing and animating vector shapes with an Inkscape-style path editor. I’m part of the team that worked on it.',
    highlights: [
      'ScalableVectorShape2D node, keyframe animation through AnimationPlayer and Skeleton2D rigging.',
      'SVG import as real vector shapes, with strokes, gradients, collision polygons and export to PNG and 3D mesh.',
      'Supports Godot 4.4 through 4.8.',
    ],
    tech: ['Godot 4', 'GDScript', 'Addon', 'SVG'],
    links: [
      {
        label: 'Godot Asset Store',
        href: 'https://store.godotengine.org/asset/renevanderark/scalable-vector-shapes-2d/',
        kind: 'store',
      },
    ],
    cover: `${ASSET_STORE}/main-thumbnail.webp`,
    media: ['main-thumbnail', 'preview-2', 'preview2', 'preview3'].map(
      (name: string): MediaItem => img(`${ASSET_STORE}/${name}.webp`, `Scalable Vector Shapes 2D (${name})`),
    ),
    accent: '#6fe3ff',
    icon: 'layers',
  }),
];
