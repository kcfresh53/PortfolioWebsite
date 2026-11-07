<script lang="ts">
  interface Props {
    detailOpen: boolean;
  }

  let { detailOpen }: Props = $props();
</script>

<footer class="hints" aria-label="Controls">
  <ul class="keys">
    {#if detailOpen}
      <li><kbd>←</kbd><kbd>→</kbd><span>Gallery</span></li>
      <li><kbd>Esc</kbd><span>Back</span></li>
    {:else}
      <li><kbd>←</kbd><kbd>→</kbd><span>Shelf</span></li>
      <li><kbd>↑</kbd><kbd>↓</kbd><span>Browse</span></li>
      <li><kbd class="wide">Enter</kbd><span>Open</span></li>
      <li><kbd>P</kbd><span>Plain mode</span></li>
    {/if}
  </ul>
  <p class="touch">{detailOpen ? 'Tap outside to go back' : 'Swipe to browse · Tap the front card to open'}</p>
</footer>

<style>
  .hints {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    padding: 0 16px max(6px, env(safe-area-inset-bottom));
    color: var(--ink-dim);
  }
  .keys {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px 26px;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 800;
    font-size: 0.85rem;
  }
  li span {
    margin-left: 4px;
  }
  kbd {
    display: inline-grid;
    place-items: center;
    min-width: 28px;
    height: 28px;
    padding: 0 6px;
    border-radius: 9px;
    background: var(--glass-strong);
    border: 1px solid var(--glass-line);
    box-shadow: 0 2px 0 rgb(0 0 0 / 35%);
    font-family: var(--font-ui);
    font-weight: 900;
    font-size: 0.78rem;
    color: #fff;
  }
  .touch {
    display: none;
    margin: 0;
    font-weight: 700;
    font-size: 0.85rem;
  }
  @media (hover: none) {
    .keys {
      display: none;
    }
    .touch {
      display: block;
    }
  }
</style>
