<script lang="ts">
  import type { Entry } from '../data/types';
  import Icon from '../lib/Icon.svelte';
  import Cover from './Cover.svelte';

  interface Props {
    entries: readonly Entry[];
    active: number;
    root: string;
    onselect: (index: number) => void;
    onopen: () => void;
    onhover: () => void;
  }

  type Slot = 'past' | 'active' | 'behind' | 'far';

  /** How many cards peek out behind the active one before the rest fade away. */
  const VISIBLE_BEHIND = 4;
  const TILT_X_DEG = 6;
  const TILT_Y_DEG = 3;

  function slotOf(distance: number): Slot {
    if (distance < 0) return 'past';
    if (distance === 0) return 'active';
    return distance <= VISIBLE_BEHIND ? 'behind' : 'far';
  }

  let { entries, active, root, onselect, onopen, onhover }: Props = $props();

  let wrapEl: HTMLDivElement | undefined = $state();
  const reducedMotion: boolean = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let frame = 0;
  let pendingX = 0;
  let pendingY = 0;

  /** Parallax tilt is applied straight to CSS variables, so pointer movement never triggers a Svelte update. */
  function applyTilt(): void {
    frame = 0;
    wrapEl?.style.setProperty('--tilt-x', pendingX.toFixed(3));
    wrapEl?.style.setProperty('--tilt-y', pendingY.toFixed(3));
  }

  function onPointerMove(event: PointerEvent): void {
    if (reducedMotion || event.pointerType !== 'mouse') return;
    pendingX = (event.clientX / window.innerWidth) * 2 - 1;
    pendingY = (event.clientY / window.innerHeight) * 2 - 1;
    if (frame === 0) frame = requestAnimationFrame(applyTilt);
  }

  function onPointerLeave(): void {
    pendingX = 0;
    pendingY = 0;
    if (frame === 0) frame = requestAnimationFrame(applyTilt);
  }
</script>

<div
  class="wrap"
  bind:this={wrapEl}
  style:--max-peek={Math.min(VISIBLE_BEHIND, Math.max(0, entries.length - 1))}
  style:--tilt-deg-x={`${TILT_X_DEG}deg`}
  style:--tilt-deg-y={`${TILT_Y_DEG}deg`}
  onpointermove={onPointerMove}
  onpointerleave={onPointerLeave}
  role="presentation"
>
  <div class="stack" role="group" aria-label="Browse entries">
    {#each entries as entry, i (entry.id)}
      {@const distance = i - active}
      <div class="card" data-slot={slotOf(distance)} style:--d={distance} style:--i={i} style:--card-accent={entry.accent}>
        <div class="inner">
          <div class="face">
            <div class="tab">
              <span class="tab-icon"><Icon name={entry.icon} size={18} /></span>
              <span class="tab-title">{entry.title}</span>
              <span class="tab-status">{entry.status}</span>
            </div>
            <div class="art">
              <Cover src={entry.cover} {root} accent={entry.accent} icon={entry.icon} fit={entry.coverFit} eager={i <= 1} />
              <div class="shade"></div>
              <p class="tag">{entry.tagline}</p>
            </div>
          </div>
          <div class="ring"></div>
        </div>
        <button
          class="hit"
          tabindex={distance === 0 ? 0 : -1}
          aria-current={distance === 0 ? 'true' : undefined}
          aria-label={distance === 0 ? `${entry.title}. ${entry.tagline} Open details.` : `Select ${entry.title}`}
          onclick={(): void => (distance === 0 ? onopen() : onselect(i))}
          onpointerenter={(event: PointerEvent): void => {
            if (event.pointerType === 'mouse' && distance > 0) onhover();
          }}
        ></button>
      </div>
    {/each}
  </div>
</div>

<style>
  .wrap {
    --w: min(56vw, 780px, calc((100dvh - 490px) * 1.6));
    --tab-h: clamp(30px, calc(var(--w) * 0.07), 50px);
    --peek: calc(var(--tab-h) + 4px);
    --step: calc(var(--peek) * 1.12);
    --r: clamp(18px, calc(var(--w) * 0.035), 30px);
    width: max(var(--w), 280px);
    margin: calc(var(--step) * var(--max-peek)) auto 0;
    perspective: 1700px;
    perspective-origin: 50% 20%;
  }

  .stack {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 10;
    transform-style: preserve-3d;
    transform: rotateX(calc(var(--tilt-deg-x) + var(--tilt-y, 0) * var(--tilt-deg-y) * -1)) rotateY(calc(var(--tilt-x, 0) * var(--tilt-deg-x)));
    transition: transform 0.35s var(--ease);
  }

  .card {
    position: absolute;
    inset: 0;
    transform-style: preserve-3d;
    border-radius: var(--r);
    transition:
      transform 0.7s var(--ease),
      opacity 0.45s var(--ease),
      filter 0.45s var(--ease);
    animation: deal-in 0.85s var(--ease) backwards;
    animation-delay: calc(var(--i) * 70ms);
    will-change: transform;
  }

  .card[data-slot='active'] {
    transform: translate3d(0, 0, 0);
  }
  .card[data-slot='behind'] {
    transform: translate3d(calc(var(--d) * 1.1%), calc(var(--d) * var(--step) * -1), calc(var(--d) * -60px));
    opacity: calc(1 - (var(--d) - 1) * 0.22);
    filter: brightness(calc(1 - var(--d) * 0.12));
  }
  .card[data-slot='far'] {
    transform: translate3d(0, calc(var(--step) * -4.6), -420px);
    opacity: 0;
    pointer-events: none;
  }
  .card[data-slot='past'] {
    transform: translate3d(0, 58%, 240px) rotateX(-16deg);
    opacity: 0;
    pointer-events: none;
  }

  @keyframes deal-in {
    from {
      opacity: 0;
      transform: translate3d(0, 46%, 260px) rotateX(-22deg);
    }
  }

  .inner {
    position: absolute;
    inset: 0;
  }
  .card[data-slot='active'] .inner {
    animation: float 6.5s ease-in-out infinite;
  }
  @keyframes float {
    50% {
      transform: translateY(-5px);
    }
  }

  .face {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-rows: var(--tab-h) 1fr;
    border-radius: var(--r);
    overflow: hidden;
    background: #0b1030;
    box-shadow:
      0 40px 70px -28px rgb(0 0 0 / 80%),
      0 0 0 1px rgb(255 255 255 / 14%);
  }

  .tab {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 clamp(12px, 2vw, 20px);
    background: linear-gradient(180deg, color-mix(in srgb, var(--card-accent) 45%, #151a3c), color-mix(in srgb, var(--card-accent) 20%, #0e1331));
    border-bottom: 1px solid rgb(255 255 255 / 16%);
    min-width: 0;
  }
  .tab-icon {
    display: grid;
    flex: none;
    color: #fff;
  }
  .tab-title {
    font-weight: 900;
    font-size: clamp(0.8rem, calc(var(--w) * 0.024), 1.1rem);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tab-status {
    margin-left: auto;
    flex: none;
    font-family: var(--font-mono);
    font-size: clamp(0.6rem, calc(var(--w) * 0.015), 0.72rem);
    font-weight: 600;
    letter-spacing: 0.02em;
    padding: 3px 10px;
    border-radius: 999px;
    background: rgb(0 0 0 / 30%);
    color: var(--ink-dim);
    white-space: nowrap;
  }

  .art {
    position: relative;
    min-height: 0;
  }
  .shade {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 45%, rgb(5 8 22 / 88%));
    opacity: 0;
    transition: opacity 0.5s var(--ease);
  }
  .tag {
    position: absolute;
    left: clamp(14px, 3vw, 28px);
    right: clamp(14px, 3vw, 28px);
    bottom: clamp(12px, 2.4vw, 24px);
    margin: 0;
    font-weight: 800;
    font-size: clamp(0.85rem, calc(var(--w) * 0.026), 1.2rem);
    line-height: 1.3;
    text-shadow: 0 2px 12px rgb(0 0 0 / 60%);
    opacity: 0;
    transform: translateY(8px);
    transition:
      opacity 0.5s var(--ease) 0.1s,
      transform 0.5s var(--ease) 0.1s;
  }
  .card[data-slot='active'] .shade {
    opacity: 1;
  }
  .card[data-slot='active'] .tag {
    opacity: 1;
    transform: none;
  }

  .ring {
    position: absolute;
    inset: 0;
    border-radius: var(--r);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.35s;
  }
  .card[data-slot='active'] .ring {
    opacity: 1;
    box-shadow:
      0 0 0 4px #fff,
      0 0 0 9px color-mix(in srgb, var(--card-accent) 65%, transparent),
      0 0 70px 8px color-mix(in srgb, var(--card-accent) 45%, transparent);
    animation: pulse 2.6s ease-in-out infinite;
  }
  @keyframes pulse {
    50% {
      box-shadow:
        0 0 0 4px #fff,
        0 0 0 12px color-mix(in srgb, var(--card-accent) 40%, transparent),
        0 0 90px 12px color-mix(in srgb, var(--card-accent) 55%, transparent);
    }
  }

  .hit {
    position: absolute;
    inset: 0;
    border-radius: var(--r);
  }

  @media (max-width: 900px) {
    .wrap {
      --w: min(90vw, 640px, calc((100dvh - 540px) * 1.6));
    }
    .tab-status {
      display: none;
    }
  }
</style>
