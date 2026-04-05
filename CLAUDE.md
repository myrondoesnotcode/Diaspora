# Diaspora — Claude Code Guidelines

## Important: Do Not Read Binary Image Files

Do **not** use the Read tool on binary image files in this repository (`.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.ico`). Reading these files embeds them as base64 in the conversation history without the required `media_type` field, which causes all subsequent API calls to fail with:

```
API Error: 400 — messages.N.content.M.image.source.base64.media_type: Field required
```

Affected files to avoid reading:
- `src/assets/hero.png`
- `src/assets/react.svg` (safe as SVG is text, but avoid if not needed)
- `src/assets/vite.svg`
- `public/favicon.svg`
- `public/icons.svg`

If you need to understand what an image contains, rely on its filename and surrounding code context instead.

## Project Overview

This is a React + TypeScript + Vite app that renders an interactive historical map of the Jewish Diaspora using D3 and TopoJSON.

- **Map rendering**: `src/components/DiasporaMap.tsx`
- **Timeline / epoch bar**: `src/components/Timeline.tsx`, `src/components/EpochBar.tsx`
- **Data**: `src/data/` — communities, epochs, migrations, types
- **World topology**: `public/countries-110m.json`

## Commands

```bash
npm run dev      # Start dev server
npm run build    # TypeScript check + Vite build
npm run lint     # ESLint
npm run deploy   # Build and deploy to GitHub Pages
```
