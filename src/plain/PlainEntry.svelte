<script lang="ts">
  import type { Entry } from '../data/types';
  import { isExternal, resolveAsset } from '../lib/assets';

  interface Props {
    entry: Entry;
    root: string;
  }

  let { entry, root }: Props = $props();

  const meta: string = $derived([entry.role, entry.period, entry.status].filter((part: string): boolean => part.length > 0).join(' · '));
  const hero: string | null = $derived(entry.cover === null ? null : resolveAsset(entry.cover, root));
</script>

<article class="entry" id={entry.id} style:--accent={entry.accent}>
  {#if hero !== null}
    <a class="entry-media" class:contain={entry.coverFit === 'contain'} href={`#${entry.id}`} tabindex="-1" aria-hidden="true">
      <img src={hero} alt="" loading="lazy" decoding="async" />
    </a>
  {/if}
  <div class="entry-body">
    <h4>{entry.title}</h4>
    <p class="meta">{meta}</p>
    <p class="summary">{entry.summary}</p>
    {#if entry.highlights.length > 0}
      <ul class="points">
        {#each entry.highlights as point (point)}
          <li>{point}</li>
        {/each}
      </ul>
    {/if}
    {#if entry.tech.length > 0}
      <ul class="chips" aria-label="Technologies">
        {#each entry.tech as chip (chip)}
          <li>{chip}</li>
        {/each}
      </ul>
    {/if}
    {#if entry.links.length > 0}
      <p class="links">
        {#each entry.links as link (link.href)}
          <a
            href={resolveAsset(link.href, root)}
            target={isExternal(link.href) ? '_blank' : undefined}
            rel={isExternal(link.href) ? 'noopener noreferrer' : undefined}
          >
            {link.label} <span aria-hidden="true">↗</span>
          </a>
        {/each}
      </p>
    {/if}
  </div>
</article>
