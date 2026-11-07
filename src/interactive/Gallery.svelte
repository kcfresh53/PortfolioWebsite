<script lang="ts">
  import type { IconName, MediaItem } from '../data/types';
  import { resolveAsset, youtubeEmbed, youtubeThumb } from '../lib/assets';
  import Icon from '../lib/Icon.svelte';
  import Cover from './Cover.svelte';

  interface Props {
    media: readonly MediaItem[];
    index: number;
    root: string;
    accent: string;
    icon: IconName;
    title: string;
    onselect: (index: number) => void;
  }

  let { media, index, root, accent, icon, title, onselect }: Props = $props();

  /** Index of the video that has been clicked to play. Videos only load an iframe on demand. */
  let playingIndex: number | null = $state(null);
  let failed: Set<string> = $state(new Set<string>());

  const current: MediaItem | undefined = $derived(media[index]);
  const isPlaying: boolean = $derived(current?.type === 'youtube' && playingIndex === index);

  function thumbOf(item: MediaItem): string {
    return item.type === 'youtube' ? youtubeThumb(item.src) : resolveAsset(item.src, root);
  }

  function markFailed(src: string): void {
    failed = new Set<string>([...failed, src]);
  }
</script>

<div class="gallery" style:--g-accent={accent}>
  <div class="viewport">
    {#if current === undefined}
      <Cover src={null} {root} {accent} {icon} />
    {:else if current.type === 'youtube'}
      {#if isPlaying}
        <iframe
          src={youtubeEmbed(current.src)}
          title={current.alt}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowfullscreen
          loading="lazy"
        ></iframe>
      {:else}
        <button class="video" onclick={(): void => void (playingIndex = index)} aria-label={`Play video: ${current.alt}`}>
          <img src={youtubeThumb(current.src)} alt="" draggable="false" />
          <span class="play"><Icon name="play" size={34} /></span>
        </button>
      {/if}
    {:else if failed.has(resolveAsset(current.src, root))}
      <Cover src={null} {root} {accent} {icon} />
    {:else}
      {#key current.src}
        <img class="shot" src={resolveAsset(current.src, root)} alt={current.alt} draggable="false" onerror={(): void => markFailed(resolveAsset(current.src, root))} />
      {/key}
    {/if}

    {#if media.length > 1}
      <button class="nav prev" aria-label="Previous image" disabled={index === 0} onclick={(): void => onselect(index - 1)}>
        <Icon name="chevron-left" size={22} />
      </button>
      <button class="nav next" aria-label="Next image" disabled={index === media.length - 1} onclick={(): void => onselect(index + 1)}>
        <Icon name="chevron-right" size={22} />
      </button>
    {/if}
  </div>

  {#if media.length > 1}
    <ul class="thumbs" aria-label={`${title} media`}>
      {#each media as item, i (item.src)}
        <li>
          <button class="thumb" class:on={i === index} aria-label={item.alt} aria-current={i === index} onclick={(): void => onselect(i)}>
            {#if !failed.has(thumbOf(item))}
              <img src={thumbOf(item)} alt="" loading="lazy" draggable="false" onerror={(): void => markFailed(thumbOf(item))} />
            {:else}
              <span class="thumb-fallback"><Icon name={icon} size={20} /></span>
            {/if}
            {#if item.type === 'youtube'}<span class="badge"><Icon name="play" size={12} /></span>{/if}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .gallery {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }
  .viewport {
    position: relative;
    aspect-ratio: 16 / 10;
    border-radius: 22px;
    overflow: hidden;
    background:
      radial-gradient(100% 80% at 30% 0%, color-mix(in srgb, var(--g-accent) 40%, #0b1030), transparent 70%),
      #070a1c;
    box-shadow:
      0 0 0 1px var(--glass-line),
      0 20px 50px -20px rgb(0 0 0 / 70%);
  }
  .shot {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    animation: fade 0.35s var(--ease);
  }
  @keyframes fade {
    from {
      opacity: 0;
      transform: scale(1.02);
    }
  }
  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
  .video {
    position: absolute;
    inset: 0;
    width: 100%;
  }
  .video img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: brightness(0.75);
  }
  .play {
    position: absolute;
    inset: 0;
    margin: auto;
    width: 76px;
    height: 76px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #fff;
    color: var(--g-accent);
    box-shadow: 0 10px 40px rgb(0 0 0 / 50%);
    transition: transform 0.25s var(--ease-pop);
  }
  .video:hover .play {
    transform: scale(1.1);
  }
  .nav {
    position: absolute;
    top: 50%;
    translate: 0 -50%;
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: rgb(8 10 28 / 65%);
    backdrop-filter: blur(8px);
    border: 1px solid var(--glass-line);
    transition:
      opacity 0.2s,
      transform 0.2s var(--ease-pop);
  }
  .nav:hover:not(:disabled) {
    transform: scale(1.1);
  }
  .nav:disabled {
    opacity: 0;
    pointer-events: none;
  }
  .prev {
    left: 12px;
  }
  .next {
    right: 12px;
  }
  .thumbs {
    display: flex;
    gap: 8px;
    list-style: none;
    margin: 0;
    padding: 4px 4px 8px;
    overflow-x: auto;
    scrollbar-width: thin;
  }
  .thumb {
    position: relative;
    display: block;
    width: 84px;
    aspect-ratio: 16 / 10;
    flex: none;
    border-radius: 12px;
    overflow: hidden;
    background: #0b1030;
    opacity: 0.55;
    outline: 2px solid transparent;
    outline-offset: 2px;
    transition:
      opacity 0.2s,
      outline-color 0.2s,
      transform 0.25s var(--ease-pop);
  }
  .thumb:hover {
    opacity: 0.9;
  }
  .thumb.on {
    opacity: 1;
    outline-color: #fff;
    transform: translateY(-2px);
  }
  .thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .thumb-fallback {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    color: color-mix(in srgb, var(--g-accent) 60%, white);
  }
  .badge {
    position: absolute;
    right: 5px;
    bottom: 5px;
    width: 20px;
    height: 20px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #fff;
    color: #11142a;
  }
</style>
