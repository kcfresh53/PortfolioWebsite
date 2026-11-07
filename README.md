# KC Portfolio

Two views of the same content, from one data source (`src/data/`).

| URL | What it is |
| --- | --- |
| `/` | **Interactive mode**: a game-console style shelf UI with a pseudo-3D card stack |
| `/plain/` | **Plain mode**: clean, static, no-JS page. Send this link when applying for jobs |

## Develop

```sh
npm install
npm run dev      # http://localhost:5173/ and /plain/
npm run check    # svelte-check, strict TypeScript
npm run build    # outputs dist/
```

## Deploy (GitHub Pages)

1. Push to `main`.
2. Repo **Settings → Pages → Source: GitHub Actions**.
3. `.github/workflows/deploy.yml` builds and publishes `dist/`.

The site uses a relative base, so it works at `user.github.io/` or `user.github.io/repo/`.

## Editing content

Everything lives in `src/data/`: `projects.ts` (games, tools, graphics, systems), `profile.ts` (bio, experience, skills, awards, links), `catalog.ts` (shelves and their order).
Local images go in `public/img/` and are referenced as `img/name.webp`; remote images are plain URLs.
Deep links: `/#games/sword-and-sail` opens a card, `/#games/sword-and-sail/open` opens its detail sheet; `/plain/#aqct` jumps to an entry.

## Controls (interactive mode)

Arrows / WASD browse · Enter opens · Esc goes back · P switches to plain mode · mouse wheel, touch swipe and gamepad (D-pad, A/B, LB/RB) also work.
