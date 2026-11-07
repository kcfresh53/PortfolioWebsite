<script lang="ts">
  import { entriesByCategory } from '../data/catalog';
  import type { Category } from '../data/types';
  import Icon from '../lib/Icon.svelte';

  interface Props {
    categories: readonly Category[];
    index: number;
    onselect: (index: number) => void;
    onhover: () => void;
  }

  let { categories, index, onselect, onhover }: Props = $props();
</script>

<div class="rail" role="tablist" aria-label="Shelves">
  {#each categories as category, i (category.id)}
    <button
      class="tile"
      class:active={i === index}
      role="tab"
      aria-selected={i === index}
      style:--tile-accent={category.accent}
      onclick={(): void => onselect(i)}
      onpointerenter={(event: PointerEvent): void => {
        if (event.pointerType === 'mouse' && i !== index) onhover();
      }}
    >
      <span class="icon"><Icon name={category.icon} size={i === index ? 30 : 24} /></span>
      <span class="label">{category.label}</span>
      <span class="count" aria-hidden="true">{entriesByCategory[category.id].length}</span>
    </button>
  {/each}
</div>

<style>
  .rail {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: clamp(6px, 1.6vw, 22px);
    padding: 14px clamp(8px, 3vw, 40px) 0;
    height: 124px;
  }
  .tile {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: clamp(62px, 11vw, 112px);
    opacity: 0.62;
    transition:
      opacity 0.3s var(--ease),
      transform 0.4s var(--ease-pop);
  }
  .tile:hover {
    opacity: 0.95;
  }
  .icon {
    display: grid;
    place-items: center;
    width: 54px;
    height: 54px;
    border-radius: 18px;
    background: var(--glass);
    border: 1px solid var(--glass-line);
    backdrop-filter: blur(10px);
    transition:
      width 0.35s var(--ease-pop),
      height 0.35s var(--ease-pop),
      background 0.3s,
      box-shadow 0.3s,
      border-radius 0.3s;
  }
  .label {
    font-weight: 800;
    font-size: 0.82rem;
    letter-spacing: 0.01em;
    white-space: nowrap;
  }
  .count {
    position: absolute;
    top: -4px;
    right: calc(50% - 38px);
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    display: grid;
    place-items: center;
    border-radius: 999px;
    background: #0b1030;
    border: 1px solid var(--glass-line);
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 700;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .tile.active {
    opacity: 1;
    transform: translateY(-2px);
  }
  .tile.active .icon {
    width: 68px;
    height: 68px;
    border-radius: 22px;
    background: linear-gradient(150deg, color-mix(in srgb, var(--tile-accent) 100%, white 15%), color-mix(in srgb, var(--tile-accent) 70%, black));
    border-color: rgb(255 255 255 / 55%);
    box-shadow:
      0 10px 28px color-mix(in srgb, var(--tile-accent) 55%, transparent),
      inset 0 1px 0 rgb(255 255 255 / 45%);
  }
  .tile.active .count {
    opacity: 1;
  }
  @media (max-width: 640px) {
    .label {
      display: none;
    }
    .tile.active .label {
      display: block;
      position: absolute;
      top: 78px;
    }
    .icon {
      width: 46px;
      height: 46px;
    }
    .tile.active .icon {
      width: 58px;
      height: 58px;
    }
    .count {
      display: none;
    }
  }
</style>
