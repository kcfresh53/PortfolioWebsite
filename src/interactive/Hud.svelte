<script lang="ts">
  import { profile } from '../data/profile';

  import Icon from '../lib/Icon.svelte';

  interface Props {
    plainHref: string;
    soundOn: boolean;
    ontogglesound: () => void;
  }

  let { plainHref, soundOn, ontogglesound }: Props = $props();
  let now: Date = $state(new Date());

  $effect(() => {
    const id: number = window.setInterval((): void => void (now = new Date()), 15_000);
    return (): void => window.clearInterval(id);
  });

  const clock: string = $derived(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
</script>

<header class="hud">
  <div class="profile">
    <span class="badge" aria-hidden="true">{profile.short}</span>
    <div class="who">
      <strong>{profile.name}</strong>
      <span>{profile.role}</span>
    </div>
  </div>

  <div class="right">
    <button class="sound" aria-pressed={soundOn} aria-label={soundOn ? 'Mute sound effects' : 'Unmute sound effects'} title="Sound effects (M)" onclick={ontogglesound}>
      <Icon name={soundOn ? 'volume' : 'volume-off'} size={20} />
    </button>
    <time class="clock" datetime={now.toISOString()}>{clock}</time>
    <nav class="mode" aria-label="Portfolio mode">
      <span class="seg on" aria-current="page"><i aria-hidden="true"></i>Interactive</span>
      <a class="seg" href={plainHref} title="Switch to the plain version (shortcut: P)">Plain</a>
    </nav>
  </div>
</header>

<style>
  .hud {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: max(14px, env(safe-area-inset-top)) clamp(16px, 4vw, 48px) 0;
    height: 72px;
  }
  .profile {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }
  .badge {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: linear-gradient(145deg, #ff2e43, var(--red));
    font-weight: 900;
    font-size: 1rem;
    box-shadow:
      0 6px 18px rgb(230 0 18 / 40%),
      inset 0 1px 0 rgb(255 255 255 / 35%);
    flex: none;
  }
  .who {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
    min-width: 0;
  }
  .who strong {
    font-weight: 900;
    font-size: 1.05rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .who span {
    color: var(--ink-dim);
    font-size: 0.85rem;
    font-weight: 700;
  }
  .right {
    display: flex;
    align-items: center;
    gap: 18px;
  }
  .clock {
    font-family: var(--font-mono);
    font-weight: 600;
    font-size: 1.05rem;
    color: var(--ink-dim);
    letter-spacing: 0.02em;
  }
  .sound {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--glass);
    border: 1px solid var(--glass-line);
    backdrop-filter: blur(14px);
    color: var(--ink-dim);
    transition:
      background 0.2s,
      color 0.2s,
      transform 0.25s var(--ease-pop);
  }
  .sound:hover {
    background: var(--glass-strong);
    color: #fff;
    transform: scale(1.08);
  }
  .sound[aria-pressed='false'] {
    opacity: 0.6;
  }
  .mode {
    display: flex;
    padding: 4px;
    gap: 2px;
    border-radius: 999px;
    background: var(--glass);
    border: 1px solid var(--glass-line);
    backdrop-filter: blur(14px);
  }
  .seg {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 16px;
    border-radius: 999px;
    font-weight: 800;
    font-size: 0.88rem;
    text-decoration: none;
    color: var(--ink-dim);
    transition:
      background 0.2s,
      color 0.2s;
  }
  .seg.on {
    background: #fff;
    color: #11142a;
    box-shadow: 0 4px 14px rgb(0 0 0 / 30%);
  }
  .seg.on i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--red);
    box-shadow: 0 0 10px var(--red);
  }
  a.seg:hover {
    background: var(--glass-strong);
    color: #fff;
  }
  @media (max-width: 640px) {
    .clock,
    .who span {
      display: none;
    }
  }
  @media (max-width: 520px) {
    .who {
      display: none;
    }
    .hud {
      justify-content: space-between;
    }
  }
</style>
