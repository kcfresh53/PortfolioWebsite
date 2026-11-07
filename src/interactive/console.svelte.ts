import { categories, categoryIndexOf, entriesByCategory } from '../data/catalog';
import type { Category, Entry } from '../data/types';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** All navigation state for the console UI: which shelf, which card, and whether the detail sheet is open. */
export class ConsoleState {
  categoryIndex: number = $state(0);
  itemIndices: number[] = $state(categories.map((): number => 0));
  detailOpen: boolean = $state(false);
  galleryIndex: number = $state(0);

  get category(): Category {
    return categories[this.categoryIndex];
  }

  get entries(): readonly Entry[] {
    return entriesByCategory[this.category.id];
  }

  get itemIndex(): number {
    return this.itemIndices[this.categoryIndex];
  }

  get entry(): Entry {
    return this.entries[this.itemIndex];
  }

  /** Shareable location, e.g. `#games/sword-and-sail/open`. */
  get hash(): string {
    return `#${this.category.id}/${this.entry.id}${this.detailOpen ? '/open' : ''}`;
  }

  setCategory(index: number): void {
    this.categoryIndex = clamp(index, 0, categories.length - 1);
  }

  moveCategory(delta: number): void {
    this.setCategory(this.categoryIndex + delta);
  }

  selectItem(index: number): void {
    this.itemIndices[this.categoryIndex] = clamp(index, 0, this.entries.length - 1);
  }

  moveItem(delta: number): void {
    this.selectItem(this.itemIndex + delta);
  }

  open(): void {
    this.galleryIndex = 0;
    this.detailOpen = true;
  }

  close(): void {
    this.detailOpen = false;
  }

  selectGallery(index: number): void {
    const count: number = this.entry.media.length;
    this.galleryIndex = count === 0 ? 0 : clamp(index, 0, count - 1);
  }

  moveGallery(delta: number): void {
    this.selectGallery(this.galleryIndex + delta);
  }

  /** Restores state from `#category/entry[/open]`. Unknown values are ignored. */
  applyHash(hash: string): void {
    const [categoryId, entryId, flag]: string[] = hash.replace(/^#/, '').split('/');
    const categoryIndex: number = categoryIndexOf(categoryId ?? '');
    if (categoryIndex < 0) return;
    this.categoryIndex = categoryIndex;
    const itemIndex: number = this.entries.findIndex((e: Entry): boolean => e.id === entryId);
    if (itemIndex >= 0) this.itemIndices[categoryIndex] = itemIndex;
    this.detailOpen = itemIndex >= 0 && flag === 'open';
  }
}
