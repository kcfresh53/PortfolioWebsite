<script lang="ts">
  import { profile } from '../data/profile';

  let done: boolean = $state(false);

  function onAnimationEnd(event: AnimationEvent): void {
    // Child animations bubble; only the splash itself finishing should dismiss it.
    if (event.target === event.currentTarget) done = true;
  }
</script>

{#if !done}
  <div class="boot" aria-hidden="true" onanimationend={onAnimationEnd}>
    <div class="logo">{profile.short}</div>
    <p>{profile.name}</p>
  </div>
{/if}

<style>
  .boot {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: grid;
    place-content: center;
    justify-items: center;
    gap: 18px;
    background: radial-gradient(70% 60% at 50% 45%, #1a2158, #060818 70%);
    animation: boot-out 1.7s var(--ease) forwards;
    pointer-events: none;
  }
  .logo {
    display: grid;
    place-items: center;
    width: 96px;
    height: 96px;
    border-radius: 30px;
    background: linear-gradient(145deg, #ff2e43, var(--red));
    font-weight: 900;
    font-size: 2.2rem;
    box-shadow:
      0 18px 60px rgb(230 0 18 / 55%),
      inset 0 2px 0 rgb(255 255 255 / 40%);
    animation: pop 0.8s var(--ease-pop) backwards;
  }
  p {
    margin: 0;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-size: 0.85rem;
    color: var(--ink-dim);
    animation: rise 0.8s var(--ease) 0.2s backwards;
  }
  @keyframes pop {
    from {
      transform: scale(0.4) rotate(-12deg);
      opacity: 0;
    }
  }
  @keyframes rise {
    from {
      transform: translateY(12px);
      opacity: 0;
    }
  }
  @keyframes boot-out {
    0%,
    60% {
      opacity: 1;
      transform: none;
    }
    100% {
      opacity: 0;
      transform: scale(1.06);
    }
  }
</style>
