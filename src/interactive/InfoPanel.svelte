<script lang="ts">
  import type { Category, Entry } from '../data/types';
  import Icon from '../lib/Icon.svelte';

  interface Props {
    entry: Entry;
    category: Category;
    position: number;
    total: number;
    onopen: () => void;
  }

  const MAX_CHIPS = 5;

  let { entry, category, position, total, onopen }: Props = $props();

  const facts: readonly (readonly [string, string])[] = $derived(
    ([['Role', entry.role], ['When', entry.period], ['Status', entry.status]] as const).filter(
      (fact: readonly [string, string]): boolean => fact[1].length > 0,
    ),
  );
</script>

{#key entry.id}
  <section class="info" style:--info-accent={entry.accent} aria-label="Selected entry">
    <p class="kicker">
      <span class="dot"></span>{category.label}
      <b>{String(position).padStart(2, '0')} / {String(total).padStart(2, '0')}</b>
    </p>
    <h2>{entry.title}</h2>
    <p class="tagline">{entry.tagline}</p>

    <dl class="facts">
      {#each facts as [label, value] (label)}
        <div>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      {/each}
    </dl>

    {#if entry.tech.length > 0}
      <ul class="chips" aria-label="Technologies">
        {#each entry.tech.slice(0, MAX_CHIPS) as chip (chip)}
          <li>{chip}</li>
        {/each}
      </ul>
    {/if}

    <button class="cta" onclick={onopen}>
      <kbd aria-hidden="true">↵</kbd>
      <span>{entry.sections !== undefined || entry.links.length === 0 ? 'Open' : 'View details'}</span>
      <Icon name="chevron-right" size={20} />
    </button>
  </section>
{/key}

<style>
  .info {
    align-self: center;
    animation: slide-in 0.55s var(--ease) backwards;
    min-width: 0;
  }
  @keyframes slide-in {
    from {
      opacity: 0;
      transform: translateX(26px);
    }
  }
  .kicker {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 0 10px;
    font-weight: 800;
    font-size: 0.85rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-dim);
  }
  .kicker b {
    margin-left: auto;
    font-family: var(--font-mono);
    font-weight: 600;
    letter-spacing: 0.04em;
  }
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--info-accent);
    box-shadow: 0 0 14px var(--info-accent);
  }
  h2 {
    margin: 0;
    font-size: clamp(1.7rem, 3.4vw, 2.8rem);
    line-height: 1.05;
    font-weight: 900;
    letter-spacing: -0.02em;
    text-wrap: balance;
  }
  .tagline {
    margin: 12px 0 18px;
    font-size: clamp(1rem, 1.5vw, 1.2rem);
    line-height: 1.45;
    color: var(--ink-dim);
    font-weight: 600;
    max-width: 38ch;
  }
  .facts {
    display: grid;
    gap: 8px;
    margin: 0 0 16px;
  }
  .facts div {
    display: grid;
    grid-template-columns: 64px 1fr;
    gap: 12px;
    align-items: baseline;
  }
  dt {
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-faint);
  }
  dd {
    margin: 0;
    font-weight: 800;
    font-size: 0.98rem;
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
    font-size: 0.74rem;
    font-weight: 600;
    color: var(--ink-dim);
  }
  .cta {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 12px 22px 12px 14px;
    border-radius: 999px;
    background: #fff;
    color: #11142a;
    font-weight: 900;
    font-size: 1.02rem;
    box-shadow:
      0 10px 28px color-mix(in srgb, var(--info-accent) 45%, transparent),
      0 0 0 0 transparent;
    transition:
      transform 0.25s var(--ease-pop),
      box-shadow 0.25s;
  }
  .cta:hover {
    transform: translateY(-2px) scale(1.03);
  }
  .cta kbd {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: var(--info-accent);
    color: #fff;
    font-family: var(--font-ui);
    font-weight: 900;
    font-size: 1rem;
  }

  @media (max-width: 900px) {
    .info {
      text-align: center;
      justify-self: center;
      width: min(92vw, 560px);
    }
    .kicker {
      justify-content: center;
    }
    .kicker b,
    .facts,
    .chips {
      display: none;
    }
    .tagline {
      margin: 8px auto 14px;
    }
    h2 {
      font-size: 1.5rem;
    }
  }
</style>
