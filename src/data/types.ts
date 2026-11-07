export type CategoryId = 'games' | 'tools' | 'graphics' | 'systems' | 'profile';

export type IconName =
  | 'gamepad'
  | 'cube'
  | 'sparkles'
  | 'layers'
  | 'user'
  | 'play'
  | 'cart'
  | 'globe'
  | 'code'
  | 'doc'
  | 'video'
  | 'external'
  | 'trophy'
  | 'mail'
  | 'close'
  | 'chevron-left'
  | 'chevron-right';

export type LinkKind = 'play' | 'store' | 'site' | 'code' | 'paper' | 'video' | 'mail';

export interface Category {
  readonly id: CategoryId;
  readonly label: string;
  readonly blurb: string;
  readonly icon: IconName;
  /** Hex colour, e.g. "#ff4d6d". Drives glow + backdrop tint. */
  readonly accent: string;
}

export interface EntryLink {
  readonly label: string;
  readonly href: string;
  readonly kind: LinkKind;
}

/** For `youtube`, `src` is the video id. For `image`, an absolute URL or a site-relative path. */
export interface MediaItem {
  readonly type: 'image' | 'youtube';
  readonly src: string;
  readonly alt: string;
}

export interface Section {
  readonly heading: string;
  readonly lines: readonly string[];
}

export interface Entry {
  readonly id: string;
  readonly category: CategoryId;
  readonly title: string;
  readonly tagline: string;
  readonly role: string;
  readonly period: string;
  readonly status: string;
  readonly summary: string;
  readonly highlights: readonly string[];
  readonly tech: readonly string[];
  readonly links: readonly EntryLink[];
  readonly cover: string | null;
  readonly coverFit: 'cover' | 'contain';
  readonly media: readonly MediaItem[];
  readonly accent: string;
  readonly icon: IconName;
  /** Profile entries (experience, skills…) render these instead of highlights. */
  readonly sections?: readonly Section[];
}
