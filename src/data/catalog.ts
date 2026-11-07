import { profileEntries } from './profile';
import { games, graphics, systems, tools } from './projects';
import type { Category, CategoryId, Entry } from './types';

export const categories: readonly Category[] = [
  { id: 'games', label: 'Games', blurb: 'Shipped, award-winning and in-progress games.', icon: 'gamepad', accent: '#ff4d6d' },
  { id: 'tools', label: 'Engines & Tools', blurb: 'Engines, editors and IDEs I made for makers.', icon: 'cube', accent: '#3b9dff' },
  { id: 'graphics', label: 'Graphics', blurb: 'Rendering research, procedural worlds and shaders.', icon: 'sparkles', accent: '#a56bff' },
  { id: 'systems', label: 'Web & Systems', blurb: 'Web apps, event sites and open-source work.', icon: 'layers', accent: '#2fd9a0' },
  { id: 'profile', label: 'Profile', blurb: 'About, experience, skills, awards and contact.', icon: 'user', accent: '#ffc83d' },
];

export const entriesByCategory: Readonly<Record<CategoryId, readonly Entry[]>> = {
  games,
  tools,
  graphics,
  systems,
  profile: profileEntries,
};

export const allProjects: readonly Entry[] = [...games, ...tools, ...graphics, ...systems];

export function categoryIndexOf(id: string): number {
  return categories.findIndex((c: Category): boolean => c.id === id);
}
