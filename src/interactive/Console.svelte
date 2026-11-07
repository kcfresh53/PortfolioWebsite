<script lang="ts">
  import { onMount } from 'svelte';
  import { categories } from '../data/catalog';
  import Backdrop from './Backdrop.svelte';
  import BootSplash from './BootSplash.svelte';
  import CategoryRail from './CategoryRail.svelte';
  import { ConsoleState } from './console.svelte';
  import Detail from './Detail.svelte';
  import HintBar from './HintBar.svelte';
  import Hud from './Hud.svelte';
  import InfoPanel from './InfoPanel.svelte';
  import { attachInput, attachSwipe } from './input';
  import Stack from './Stack.svelte';

  interface Props {
    /** Path from this page to the site root. */
    root: string;
  }

  let { root }: Props = $props();

  const nav: ConsoleState = new ConsoleState();
  const plainHref: string = $derived(`${root}plain/`);
  let stageEl: HTMLElement | undefined = $state();

  nav.applyHash(window.location.hash);

  // Keep the URL shareable: #games/sword-and-sail, plus /open when the sheet is up.
  $effect(() => {
    window.history.replaceState(null, '', nav.hash);
  });

  onMount((): (() => void) =>
    attachInput({
      move(dx: number, dy: number): boolean {
        if (nav.detailOpen) {
          // Up/down scroll the sheet natively; left/right flip through the gallery.
          if (dx === 0) return false;
          nav.moveGallery(dx);
          return true;
        }
        if (dx !== 0) nav.moveCategory(dx);
        if (dy !== 0) nav.moveItem(dy);
        return true;
      },
      confirm(): void {
        if (!nav.detailOpen) nav.open();
      },
      back(): void {
        nav.close();
      },
      shoulder(delta: number): void {
        if (!nav.detailOpen) nav.moveCategory(delta);
      },
      toggleMode(): void {
        window.location.assign(plainHref);
      },
      canBrowse(): boolean {
        return !nav.detailOpen;
      },
    }),
  );

  $effect(() => {
    if (stageEl === undefined) return;
    return attachSwipe(stageEl, (dx: number, dy: number): void => {
      if (nav.detailOpen) return;
      if (dx !== 0) nav.moveCategory(dx);
      if (dy !== 0) nav.moveItem(dy);
    });
  });
</script>

<div class="console" style:--accent={nav.category.accent} style:--accent-2={nav.entry.accent}>
  <Backdrop accent={nav.entry.accent} />

  <div class="shell" inert={nav.detailOpen}>
    <Hud {plainHref} />
    <CategoryRail {categories} index={nav.categoryIndex} onselect={(index: number): void => nav.setCategory(index)} />

    <main class="stage" bind:this={stageEl}>
      {#key nav.categoryIndex}
        <Stack
          entries={nav.entries}
          active={nav.itemIndex}
          {root}
          onselect={(index: number): void => nav.selectItem(index)}
          onopen={(): void => nav.open()}
        />
      {/key}
      <InfoPanel
        entry={nav.entry}
        category={nav.category}
        position={nav.itemIndex + 1}
        total={nav.entries.length}
        onopen={(): void => nav.open()}
      />
    </main>

    <HintBar detailOpen={nav.detailOpen} />
  </div>

  {#if nav.detailOpen}
    <Detail
      entry={nav.entry}
      {root}
      galleryIndex={nav.galleryIndex}
      onclose={(): void => nav.close()}
      ongallery={(index: number): void => nav.selectGallery(index)}
    />
  {/if}

  <BootSplash />
  <p class="sr" aria-live="polite">{nav.entry.title}, {nav.itemIndex + 1} of {nav.entries.length} in {nav.category.label}</p>
</div>

<style>
  .console {
    position: relative;
    height: 100dvh;
    overflow: hidden;
    background:
      radial-gradient(1100px 640px at 72% 8%, color-mix(in srgb, var(--accent-2) 24%, transparent), transparent 62%),
      radial-gradient(900px 600px at 5% 95%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 60%),
      linear-gradient(180deg, #0c1233, #060818);
    transition: --accent 0.7s var(--ease), --accent-2 0.7s var(--ease);
  }
  .shell {
    position: relative;
    z-index: 1;
    height: 100%;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto auto minmax(0, 1fr) auto;
    transition:
      transform 0.5s var(--ease),
      filter 0.5s var(--ease),
      opacity 0.5s var(--ease);
  }
  .shell[inert] {
    transform: scale(0.95);
    filter: blur(6px) brightness(0.55);
  }
  .stage {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.7fr);
    align-items: center;
    gap: clamp(16px, 3vw, 56px);
    padding: 0 clamp(16px, 5vw, 80px);
    min-height: 0;
    touch-action: none;
  }

  @media (max-width: 900px) {
    .stage {
      grid-template-columns: 1fr;
      grid-template-rows: minmax(0, 1fr) auto;
      align-content: start;
      gap: 12px;
    }
  }
</style>
