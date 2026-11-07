<script lang="ts">
  import type { EntryLink, IconName, LinkKind } from '../data/types';
  import { isExternal, resolveAsset } from '../lib/assets';
  import Icon from '../lib/Icon.svelte';

  interface Props {
    link: EntryLink;
    root: string;
    primary?: boolean;
  }

  const KIND_ICON: Readonly<Record<LinkKind, IconName>> = {
    play: 'play',
    store: 'cart',
    site: 'globe',
    code: 'code',
    paper: 'doc',
    video: 'video',
    mail: 'mail',
  };

  let { link, root, primary = false }: Props = $props();
  const external: boolean = $derived(isExternal(link.href));
</script>

<a
  class="btn"
  class:primary
  href={resolveAsset(link.href, root)}
  target={external ? '_blank' : undefined}
  rel={external ? 'noopener noreferrer' : undefined}
>
  <span class="ico"><Icon name={KIND_ICON[link.kind]} size={18} /></span>
  <span class="text">{link.label}</span>
  {#if external}<Icon name="external" size={16} />{/if}
</a>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    max-width: 100%;
    padding: 10px 18px 10px 10px;
    border-radius: 999px;
    background: var(--glass-strong);
    border: 1px solid var(--glass-line);
    font-weight: 800;
    font-size: 0.95rem;
    text-decoration: none;
    transition:
      transform 0.22s var(--ease-pop),
      background 0.2s;
  }
  .btn:hover {
    transform: translateY(-2px) scale(1.02);
    background: rgb(255 255 255 / 20%);
  }
  .ico {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    flex: none;
    border-radius: 50%;
    background: rgb(255 255 255 / 14%);
  }
  .text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .primary {
    background: #fff;
    color: #11142a;
    border-color: transparent;
    box-shadow: 0 8px 24px color-mix(in srgb, var(--sheet-accent) 45%, transparent);
  }
  .primary:hover {
    background: #fff;
  }
  .primary .ico {
    background: var(--sheet-accent);
    color: #fff;
  }
</style>
