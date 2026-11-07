<script lang="ts">
  import type { IconName } from '../data/types';

  interface Props {
    name: IconName;
    size?: number;
  }

  const PATHS: Readonly<Record<IconName, string>> = {
    gamepad:
      'M6 12h4m-2-2v4M15 13h.01M18 11h.01M17.32 5H6.68a4 4 0 0 0-3.98 3.59C2.6 9.42 2 14.46 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.41-1.41A2 2 0 0 1 9.83 16h4.34a2 2 0 0 1 1.41.59L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.55-.6-6.58-.68-7.26A4 4 0 0 0 17.32 5z',
    cube: 'M21 8l-9-5-9 5v8l9 5 9-5V8zM3.3 7.5L12 12.5l8.7-5M12 22V12.5',
    sparkles:
      'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z',
    layers: 'M12 2l10 5-10 5L2 7l10-5zM2 12l10 5 10-5M2 17l10 5 10-5',
    user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    play: 'M7 4l13 8-13 8V4z',
    cart: 'M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.5L20 8H6M10 21h.01M17 21h.01',
    globe: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z',
    code: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
    doc: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6M8 13h8M8 17h8',
    video: 'M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zM10 9l5 3-5 3V9z',
    external: 'M7 17L17 7M8 7h9v9',
    trophy: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3',
    mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6',
    close: 'M18 6L6 18M6 6l12 12',
    'chevron-left': 'M15 18l-6-6 6-6',
    'chevron-right': 'M9 18l6-6-6-6',
  };

  let { name, size = 20 }: Props = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
  focusable="false"
>
  <path d={PATHS[name]} />
</svg>
