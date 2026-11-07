<script lang="ts">
  import type { IconName } from '../data/types';
  import { resolveAsset } from '../lib/assets';
  import Icon from '../lib/Icon.svelte';

  interface Props {
    src: string | null;
    root: string;
    accent: string;
    icon: IconName;
    fit?: 'cover' | 'contain';
    alt?: string;
    eager?: boolean;
  }

  let { src, root, accent, icon, fit = 'cover', alt = '', eager = false }: Props = $props();

  let failedSrc: string | null = $state(null);
  const showImage: boolean = $derived(src !== null && failedSrc !== src);
</script>

<div class="cover" class:contain={fit === 'contain'} style:--cover-accent={accent}>
  {#if src !== null && showImage}
    <img src={resolveAsset(src, root)} {alt} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable="false" onerror={(): void => void (failedSrc = src)} />
  {:else}
    <div class="fallback"><Icon name={icon} size={64} /></div>
  {/if}
</div>

<style>
  .cover {
    position: absolute;
    inset: 0;
    overflow: hidden;
    background:
      radial-gradient(120% 90% at 20% 0%, color-mix(in srgb, var(--cover-accent) 55%, #0b1030), transparent 70%),
      linear-gradient(160deg, color-mix(in srgb, var(--cover-accent) 28%, #0b1030), #0a0e24);
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    user-select: none;
  }
  .contain img {
    object-fit: contain;
    padding: 12%;
    filter: drop-shadow(0 12px 28px rgb(0 0 0 / 45%));
  }
  .fallback {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    color: color-mix(in srgb, var(--cover-accent) 60%, white);
    opacity: 0.85;
  }
</style>
