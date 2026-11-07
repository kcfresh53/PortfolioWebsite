<script lang="ts">
  import type { Entry } from '../data/types';
  import Icon from '../lib/Icon.svelte';
  import Gallery from './Gallery.svelte';
  import LinkButton from './LinkButton.svelte';

  interface Props {
    entry: Entry;
    root: string;
    galleryIndex: number;
    onclose: () => void;
    ongallery: (index: number) => void;
  }

  let { entry, root, galleryIndex, onclose, ongallery }: Props = $props();
  let sheet: HTMLElement | undefined = $state();

  const meta: readonly string[] = $derived([entry.role, entry.period, entry.status].filter((m: string): boolean => m.length > 0));
  const hasVisual: boolean = $derived(entry.media.length > 0 || entry.cover !== null);
  const paragraphs: readonly string[] = $derived(entry.summary.split('\n\n').filter((p: string): boolean => p.length > 0));

  // Move focus into the sheet on open and hand it back to the card on close.
  $effect(() => {
    const previous: Element | null = document.activeElement;
    sheet?.focus({ preventScroll: true });
    return (): void => {
      if (previous instanceof HTMLElement) previous.focus({ preventScroll: true });
    };
  });
</script>

<div class="layer" style:--sheet-accent={entry.accent}>
  <button class="scrim" tabindex="-1" aria-label="Close details" onclick={onclose}></button>

  <div class="sheet" bind:this={sheet} tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="detail-title">
    <button class="close" onclick={onclose}>
      <Icon name="chevron-left" size={18} />
      <span>Back</span>
      <kbd>Esc</kbd>
    </button>

    <div class="grid" class:single={!hasVisual}>
      {#if hasVisual}
        <Gallery
          media={entry.media}
          index={galleryIndex}
          {root}
          accent={entry.accent}
          icon={entry.icon}
          title={entry.title}
          onselect={ongallery}
        />
      {/if}

      <article class="text">
        <h2 id="detail-title">{entry.title}</h2>
        <p class="tagline">{entry.tagline}</p>

        <ul class="meta">
          {#each meta as item (item)}
            <li>{item}</li>
          {/each}
        </ul>

        {#each paragraphs as paragraph (paragraph)}
          <p class="summary">{paragraph}</p>
        {/each}

        {#if entry.links.length > 0}
          <div class="links">
            {#each entry.links as link, i (link.href)}
              <LinkButton {link} {root} primary={i === 0} />
            {/each}
          </div>
        {/if}

        {#if entry.highlights.length > 0}
          <ul class="points">
            {#each entry.highlights as point (point)}
              <li>{point}</li>
            {/each}
          </ul>
        {/if}

        {#if entry.sections !== undefined}
          {#each entry.sections as section (section.heading)}
            <section class="block">
              <h3>{section.heading}</h3>
              <ul class="points">
                {#each section.lines as line (line)}
                  <li>{line}</li>
                {/each}
              </ul>
            </section>
          {/each}
        {/if}

        {#if entry.tech.length > 0}
          <ul class="chips" aria-label="Technologies">
            {#each entry.tech as chip (chip)}
              <li>{chip}</li>
            {/each}
          </ul>
        {/if}

      </article>
    </div>
  </div>
</div>

<style>
  .layer {
    position: fixed;
    inset: 0;
    z-index: 20;
    display: grid;
    place-items: center;
    padding: clamp(10px, 3vw, 36px);
    animation: layer-in 0.3s var(--ease);
  }
  @keyframes layer-in {
    from {
      opacity: 0;
    }
  }
  .scrim {
    position: absolute;
    inset: 0;
    width: 100%;
    background: rgb(4 6 20 / 62%);
    backdrop-filter: blur(10px);
    cursor: default;
  }
  .sheet {
    position: relative;
    width: min(1180px, 100%);
    max-height: 100%;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: clamp(16px, 3vw, 34px);
    border-radius: clamp(22px, 3vw, 36px);
    background:
      radial-gradient(90% 60% at 0% 0%, color-mix(in srgb, var(--sheet-accent) 26%, transparent), transparent 70%),
      linear-gradient(180deg, #151b3f, #0b1030);
    border: 1px solid var(--glass-line);
    box-shadow:
      0 40px 120px -20px rgb(0 0 0 / 80%),
      inset 0 1px 0 rgb(255 255 255 / 14%);
    animation: sheet-in 0.5s var(--ease-pop);
    scrollbar-width: thin;
  }
  .sheet:focus {
    outline: none;
  }
  @keyframes sheet-in {
    from {
      opacity: 0;
      transform: translateY(40px) scale(0.96);
    }
  }
  .close {
    position: sticky;
    top: 0;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 14px;
    padding: 7px 10px 7px 8px;
    border-radius: 999px;
    background: rgb(8 10 28 / 70%);
    backdrop-filter: blur(10px);
    border: 1px solid var(--glass-line);
    font-weight: 800;
    font-size: 0.9rem;
  }
  .close:hover {
    background: rgb(255 255 255 / 16%);
  }
  .close kbd {
    padding: 2px 8px;
    border-radius: 8px;
    background: var(--glass-strong);
    font-family: var(--font-ui);
    font-size: 0.72rem;
    font-weight: 900;
  }
  .grid {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
    gap: clamp(18px, 3vw, 40px);
    align-items: start;
  }
  .text {
    min-width: 0;
  }
  h2 {
    margin: 0;
    font-size: clamp(1.7rem, 3.2vw, 2.6rem);
    line-height: 1.08;
    font-weight: 900;
    letter-spacing: -0.02em;
  }
  .tagline {
    margin: 10px 0 14px;
    font-size: 1.1rem;
    font-weight: 700;
    line-height: 1.4;
    color: var(--ink-dim);
  }
  .meta {
    list-style: none;
    margin: 0 0 18px;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .meta li {
    padding: 5px 13px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--sheet-accent) 30%, transparent);
    border: 1px solid color-mix(in srgb, var(--sheet-accent) 60%, transparent);
    font-weight: 800;
    font-size: 0.85rem;
  }
  .summary {
    margin: 0 0 14px;
    line-height: 1.6;
    font-size: 1.02rem;
  }
  .block h3 {
    margin: 18px 0 8px;
    font-size: 0.82rem;
    font-weight: 900;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-dim);
  }
  .points {
    margin: 0 0 18px;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 9px;
  }
  .points li {
    position: relative;
    padding-left: 22px;
    line-height: 1.5;
    color: rgb(244 246 255 / 88%);
    font-size: 0.97rem;
  }
  .points li::before {
    content: '';
    position: absolute;
    left: 2px;
    top: 0.55em;
    width: 9px;
    height: 9px;
    border-radius: 3px;
    transform: rotate(45deg);
    background: var(--sheet-accent);
    box-shadow: 0 0 10px var(--sheet-accent);
  }
  .chips {
    list-style: none;
    margin: 0 0 22px;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
  }
  .chips li {
    padding: 4px 11px;
    border-radius: 999px;
    background: var(--glass);
    border: 1px solid var(--glass-line);
    font-family: var(--font-mono);
    font-size: 0.76rem;
    font-weight: 600;
    color: var(--ink-dim);
  }
  .links {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 0 0 22px;
  }
  .grid.single {
    grid-template-columns: minmax(0, 760px);
    justify-content: center;
  }

  @media (max-width: 860px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
