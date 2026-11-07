<script lang="ts">
  interface Props {
    accent: string;
  }

  interface Rgb {
    r: number;
    g: number;
    b: number;
  }

  interface Ribbon {
    readonly y: number;
    readonly amp: number;
    readonly freq: number;
    readonly speed: number;
    readonly phase: number;
    readonly alpha: number;
    readonly lift: number;
  }

  const RIBBONS: readonly Ribbon[] = [
    { y: 0.62, amp: 0.07, freq: 0.9, speed: 0.00018, phase: 0.0, alpha: 0.2, lift: 0.0 },
    { y: 0.7, amp: 0.06, freq: 1.3, speed: -0.00022, phase: 1.7, alpha: 0.18, lift: 0.15 },
    { y: 0.78, amp: 0.08, freq: 0.7, speed: 0.00014, phase: 3.1, alpha: 0.2, lift: 0.3 },
    { y: 0.55, amp: 0.05, freq: 1.7, speed: 0.00026, phase: 4.4, alpha: 0.12, lift: 0.45 },
    { y: 0.86, amp: 0.05, freq: 1.1, speed: -0.00016, phase: 5.2, alpha: 0.16, lift: 0.1 },
  ];

  const RESOLUTION_SCALE = 0.5;
  const TAU: number = Math.PI * 2;

  function hexToRgb(hex: string): Rgb {
    const value: number = Number.parseInt(hex.replace('#', ''), 16);
    return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
  }

  // Mutable animation state, deliberately not reactive: the draw loop reads it every frame.
  const current: Rgb = { r: 120, g: 140, b: 255 };

  let { accent }: Props = $props();
  let canvas: HTMLCanvasElement | undefined = $state();

  $effect(() => {
    const el: HTMLCanvasElement | undefined = canvas;
    const target: Rgb = hexToRgb(accent);
    if (el === undefined) return;
    const ctx: CanvasRenderingContext2D | null = el.getContext('2d');
    if (ctx === null) return;
    const reduced: boolean = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let raf = 0;

    const resize = (): void => {
      width = Math.max(2, Math.floor(el.clientWidth * RESOLUTION_SCALE));
      height = Math.max(2, Math.floor(el.clientHeight * RESOLUTION_SCALE));
      el.width = width;
      el.height = height;
    };

    const mix = (c: Rgb, lift: number): string => {
      const r: number = Math.round(c.r + (255 - c.r) * lift);
      const g: number = Math.round(c.g + (255 - c.g) * lift);
      const b: number = Math.round(c.b + (255 - c.b) * lift);
      return `${r} ${g} ${b}`;
    };

    const draw = (time: number): void => {
      const ease: number = reduced ? 1 : 0.05;
      current.r += (target.r - current.r) * ease;
      current.g += (target.g - current.g) * ease;
      current.b += (target.b - current.b) * ease;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      for (const ribbon of RIBBONS) {
        const base: number = height * ribbon.y;
        const amplitude: number = height * ribbon.amp;
        const rgb: string = mix(current, ribbon.lift);
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 5) {
          const nx: number = x / width;
          const wave: number =
            Math.sin(nx * ribbon.freq * TAU + time * ribbon.speed * 6 + ribbon.phase) * amplitude +
            Math.sin(nx * ribbon.freq * 2.3 * TAU - time * ribbon.speed * 3.5) * amplitude * 0.5;
          ctx.lineTo(x, base + wave);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        const gradient: CanvasGradient = ctx.createLinearGradient(0, base - amplitude * 1.6, 0, height);
        gradient.addColorStop(0, `rgb(${rgb} / ${ribbon.alpha})`);
        gradient.addColorStop(1, `rgb(${rgb} / 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    resize();
    const observer = new ResizeObserver((): void => {
      resize();
      if (reduced) draw(0);
    });
    observer.observe(el);
    raf = requestAnimationFrame(draw);

    return (): void => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  });
</script>

<canvas bind:this={canvas} aria-hidden="true"></canvas>

<style>
  canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    filter: blur(6px) saturate(1.2);
    pointer-events: none;
  }
</style>
