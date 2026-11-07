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

  /** The navigation methods return true when the selection actually changed (false at the ends of a shelf). */
  setCategory(index: number): boolean {
    const next: number = clamp(index, 0, categories.length - 1);
    const changed: boolean = next !== this.categoryIndex;
    this.categoryIndex = next;
    return changed;
  }

  moveCategory(delta: number): boolean {
    return this.setCategory(this.categoryIndex + delta);
  }

  selectItem(index: number): boolean {
    const next: number = clamp(index, 0, this.entries.length - 1);
    const changed: boolean = next !== this.itemIndex;
    this.itemIndices[this.categoryIndex] = next;
    return changed;
  }

  moveItem(delta: number): boolean {
    return this.selectItem(this.itemIndex + delta);
  }

  open(): void {
    this.galleryIndex = 0;
    this.detailOpen = true;
  }

  close(): void {
    this.detailOpen = false;
  }

  selectGallery(index: number): boolean {
    const count: number = this.entry.media.length;
    const next: number = count === 0 ? 0 : clamp(index, 0, count - 1);
    const changed: boolean = next !== this.galleryIndex;
    this.galleryIndex = next;
    return changed;
  }

  moveGallery(delta: number): boolean {
    return this.selectGallery(this.galleryIndex + delta);
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
