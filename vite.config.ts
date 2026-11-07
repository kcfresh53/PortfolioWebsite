import { createServer, defineConfig, type Plugin, type ViteDevServer } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'node:path';

const OUTLET = '<!--ssr-outlet-->';

interface PlainModule {
  render: () => string;
}

/**
 * Pre-renders the plain page into static HTML (dev + build) so that it works
 * without JavaScript, is crawlable, and loads instantly when shared as a link.
 */
function plainPrerender(): Plugin {
  return {
    name: 'plain-prerender',
    transformIndexHtml: {
      order: 'pre',
      async handler(html: string, ctx): Promise<string> {
        if (!html.includes(OUTLET)) return html;
        const temp: ViteDevServer | null = ctx.server
          ? null
          : await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' });
        const server: ViteDevServer | null = ctx.server ?? temp;
        if (server === null) return html;
        try {
          const mod = (await server.ssrLoadModule('/src/plain/entry-server.ts')) as PlainModule;
          return html.replace(OUTLET, mod.render());
        } finally {
          await temp?.close();
        }
      },
    },
  };
}

export default defineConfig({
  // Relative base: works on any GitHub Pages path (user site or project site).
  base: './',
  plugins: [svelte(), plainPrerender()],
  build: {
    target: 'es2022',
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        plain: resolve(import.meta.dirname, 'plain/index.html'),
      },
    },
  },
});
