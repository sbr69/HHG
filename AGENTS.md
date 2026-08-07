# HH Goa 2026

Client-side builder-pass generator built on TanStack Start + React 19 + Tailwind v4.
The badge is rendered to `<canvas>` in the browser; nothing is uploaded.

## Commands

- `bun run dev` — start the dev server
- `bun run build` — production build (Cloudflare via nitro)
- `bun run lint` — eslint
- `bun run format` — prettier

## Layout

- File-based routing via TanStack Router. `src/routeTree.gen.ts` is generated — don't edit it.
- `src/server.ts` is the SSR entry (error wrapper around TanStack's server entry).
- `src/lib/badge.ts` renders the pass to canvas; `src/lib/image-input.ts` handles photo intake (incl. HEIC).
- Path alias `@/` maps to `src/`.
