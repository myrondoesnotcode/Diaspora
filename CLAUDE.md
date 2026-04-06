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

### Key Files

- **Map rendering**: `src/components/DiasporaMap.tsx` — D3 geoNaturalEarth1 projection, ResizeObserver for container sizing, D3 zoom behavior
- **Playback controls**: `src/components/MapControls.tsx` — play/pause, year slider, tick marks
- **EXPLORE tab**: `src/components/HistoryPanel.tsx` — epoch info, population stats, sparkline, legend, sources
- **Epoch pills**: `src/components/EpochBar.tsx`
- **Data**: `src/data/` — communities, epochs, migrations, types
- **World topology**: `public/countries-110m.json`

### Architecture

- **Tab navigation**: `src/App.tsx` manages `'map' | 'explore'` tab state
- **Layout**: `#root { position: fixed; inset: 0 }` (stable layout viewport, prevents iOS Safari URL-bar shifts)
- **Map + controls**: `.map-view` is a flex column — `DiasporaMap` fills flex:1, `MapControls` sits below
- **Color scheme**: Warm tan/cream palette throughout — both MAP and EXPLORE tabs share the same colors
  - Ocean: radial gradient `#c8b99a → #b09070`
  - Countries: `#d4c4a8` fill, `#b8a888` stroke
  - Controls bar: `var(--cream-card)` background (`#ece4d2`)
  - CSS design tokens: `--cream-bg`, `--cream-card`, `--cream-border`, `--cream-text`, `--cream-muted`, `--accent`, `--tab-bg`, `--tab-active`
- **Initial mobile zoom**: `useLayoutEffect` + `hasInitialZoomedRef` zooms to Middle East (lon 35, lat 32) before first paint on screens < 768px wide

### Data

- `SNAPSHOT_YEARS` — 21 historical snapshots from −500 to 2024
- `WORLD_TOTALS` — estimated global Jewish population per snapshot year (DellaPergola)
- Asset URL pattern: `fetch(import.meta.env.BASE_URL + 'countries-110m.json')` (base path is `/Diaspora/`)

## Commands

```bash
npm run dev      # Start dev server
npm run build    # TypeScript check + Vite build
npm run lint     # ESLint
npm run deploy   # Build and deploy to GitHub Pages
```
