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

---

## What This App Is

**Diaspora** is an interactive historical map of the Jewish Diaspora — a single-page React application that visualizes 4,000 years of Jewish history through geography, migration, and population data. It renders an interactive D3/TopoJSON world map where users can scrub through time from 1800 BCE to 2024 CE, watching Jewish communities appear, grow, shrink, and vanish as history unfolds.

**Live at:** `https://myrondoesnotcode.github.io/Diaspora/`

### Core Experience

Users interact with the app in three ways:

1. **Map Tab** — An interactive world map showing:
   - **Community circles** sized by population, colored by cultural tradition (Ashkenazi=blue, Sephardic=orange, Mizrahi=green, Yemenite=purple, Ethiopian=rust, Mixed=gray, Ancient=gold)
   - **Migration arcs** animated between communities (red=forced, blue=voluntary)
   - **Ghost trails** — faint gold dots for communities that once existed but are now extinct
   - **Catastrophe shockwaves** — expanding red circles at Jerusalem for the Temple destructions (-586 BCE, 70 CE)
   - A bottom control bar with play/pause, epoch navigation, year slider, world Jewish population counter, and active migration count

2. **Explore Tab** — A scrollable reference view showing each epoch as a card with:
   - Start/end population snapshots with percentage of world population
   - Population change percentage (green=growth, red=decline)
   - Long-form historical narrative
   - Key events timeline
   - Notable figures with initials, dates, and roles
   - Top communities by population
   - Academic sources
   - Geographic center label

3. **Story Mode** — A cinematic auto-advancing narrative with 19 story beats, each panning the map to a location while displaying narration text. Activated from the intro modal.

### The Historical Narrative

The app tells the story of the Jewish people through 13 historical epochs:

| Epoch | Period | Key Theme |
|-------|--------|-----------|
| Patriarchs & Tribes | 1800–1001 BCE | Abraham, Exodus, settlement of Canaan |
| First Temple & Kingdom | 1000–587 BCE | David, Solomon, kingdom split, Assyrian/Babylonian conquest |
| Babylonian Exile & Return | 586–167 BCE | Exile, Cyrus decree, Second Temple, Hellenism |
| Hasmonean & Roman Judea | 166 BCE–69 CE | Maccabees, Hanukkah, Herod, Rome's grip, Great Revolt |
| Roman Diaspora | 70–399 CE | Temple destruction, Bar Kokhba, Mishnah, rabbinic Judaism born |
| Geonic Era | 400–999 CE | Babylonian academies, Talmud, Islamic golden age |
| Golden Age of Spain | 1000–1148 CE | Convivencia, philosophy, poetry, Maimonides born |
| Era of Expulsions | 1149–1549 CE | Crusades, Black Death, Spain 1492, Portugal 1497 |
| Polish-Ottoman Axis | 1550–1788 CE | Twin centers, Council of Four Lands, Khmelnytsky, Hasidism |
| Emancipation | 1789–1879 CE | French Revolution, citizenship, Haskalah, Reform Judaism |
| Mass Migration | 1880–1932 CE | Pogroms, 2M to Americas, Zionism, Balfour Declaration |
| Holocaust & Founding | 1933–1952 CE | 6M murdered, State of Israel, displaced persons |
| Israeli Era | 1953–2024 CE | Ingathering, Six-Day War, Soviet Jewry, Ethiopian Aliyah |

---

## Technical Architecture

### Stack
- **React 19** — functional components, hooks, no state management library
- **TypeScript** — strict mode, ES2023 target
- **Vite 8** — build tool, dev server, GitHub Pages base path `/Diaspora/`
- **D3.js 7** — geographic projections, scales, zoom/pan, SVG rendering
- **TopoJSON** — world map geometry from `public/countries-110m.json`
- **Tailwind CSS 3** + custom CSS + inline React styles

### Component Hierarchy

```
ErrorBoundary
└── App (state: currentYear, isPlaying, activeTab, showIntro, storyMode)
    ├── DiasporaMap (D3 SVG map, zoom, community circles, migration arcs)
    │   ├── EventCard (top-left: active migrations)
    │   └── Tooltip (on hover: community details + sparkline)
    ├── StoryMode (cinematic narrative playback)
    ├── MapOverlay (bottom bar: play, epoch nav, slider, stats)
    ├── ExploreTab (scrollable epoch cards with history)
    │   └── EpochBar (epoch pill buttons)
    └── IntroModal (welcome screen + legend)
```

### Data Model

All historical data lives in `src/data/` as typed TypeScript arrays:

**`types.ts`** — Core interfaces:
```typescript
type CulturalType = 'Ashkenazi' | 'Sephardic' | 'Mizrahi' | 'Yemenite' | 'Ethiopian' | 'Mixed' | 'Ancient'
type MigrationType = 'forced' | 'voluntary'

interface Community {
  id: string; name: string; lat: number; lng: number
  culturalType: CulturalType
  populations: Partial<Record<number, number>>  // keyed by snapshot year
  significance: string
}

interface Migration {
  id: string; from: string; to: string  // community IDs
  startYear: number; endYear: number
  type: MigrationType; description: string
}

interface Epoch {
  name: string; startYear: number; endYear: number; color: string
  description: string; longDescription?: string
  keyEvents?: { year: number; label: string }[]
  notableFigures?: { name: string; years: string; role: string }[]
  geographicCenter?: string; sources?: string[]
  mapFocus?: { lng: number; lat: number; zoom: number }
}

// 23 snapshot years spanning 3,800 years:
const SNAPSHOT_YEARS = [-1800, -1000, -586, -516, -167, 70, 200, 500, 700,
  1000, 1170, 1300, 1492, 1550, 1650, 1800, 1850, 1900, 1939, 1948, 1970, 2000, 2024]
```

**`communities.ts`** — 60+ communities with population data at every snapshot year
**`migrations.ts`** — 65+ migration routes (forced/voluntary) with date ranges
**`epochs.ts`** — 13 epochs with key events, notable figures, sources, map focus points
**`worldStats.ts`** — World Jewish population + world total population at each snapshot year
**`storyBeats.ts`** — 19 narrative beats for story mode (year, map focus, narration text)

### Data Relationships

- Migrations reference communities by `id` (from/to fields)
- Communities have populations keyed by snapshot year — the map interpolates between these
- Epochs define time ranges; the ExploreTab finds the nearest snapshot years to each epoch's boundaries
- Story beats reference snapshot years and map focus coordinates
- World stats provide the denominator for "% of world population" calculations

### Key Rendering Logic

**DiasporaMap.tsx:**
- Loads TopoJSON on mount, renders countries as SVG paths via D3 geoNaturalEarth1 projection
- Community circles: radius = sqrt scale of population at current year (range 4-22px)
- Migration arcs: quadratic Bezier curves with 28% vertical offset, dashed animation
- Ghost trails: faint gold dots for communities with population > 0 at any earlier snapshot but 0 now
- Catastrophe shockwave: CSS-animated expanding circle at Jerusalem for years -586 and 70
- Zoom/pan via D3 zoom behavior

**ExploreTab.tsx:**
- For each epoch, finds nearest snapshot years to start/end boundaries
- Shows population comparison boxes with growth/decline percentage
- Displays top 4 communities by population at the epoch's start snapshot
- Renders key events, notable figures, long descriptions, and academic sources

**MapOverlay.tsx:**
- Play button auto-advances through snapshot years every 1500ms
- Epoch prev/next buttons jump to epoch boundaries
- Population counter shows world Jewish population with flash effect on >20% drops

### Styling

- **Map background**: dark radial gradient (`#0d1b3e` → `#020510`)
- **App background**: warm cream (`#f5f0e8`)
- **Text**: dark brown (`#1a1410`)
- **Accent**: orange (`#e07b39`)
- Cultural type colors: Ashkenazi `#4a9eff`, Sephardic `#f5a623`, Mizrahi `#7ed321`, Yemenite `#bd10e0`, Ethiopian `#e86c2c`, Mixed `#9b9b9b`, Ancient `#d4af37`
- Migration colors: forced `#ff4444`, voluntary `#44aaff`
- Animations: shockwave expand (1.8s), migration dash, tooltip fade-in, epoch pill hover

---

## Data Integrity Notes

### Population Data
- World Jewish population figures sourced from DellaPergola (American Jewish Year Book), Baron, and Barnavi
- Modern figures (1900+) are well-established from census data; ancient/medieval figures are scholarly estimates with uncertainty
- Community populations are illustrative samples of major centers — they sum to 20-60% of world totals (the rest is in smaller untracked settlements)
- The 23 snapshot years were chosen to capture critical inflection points in Jewish history

### Historical Accuracy
- All key events, notable figures, and epoch descriptions are sourced from academic works cited in each epoch's `sources` field
- Migration types (forced/voluntary) follow scholarly consensus
- Population trajectories reflect known catastrophes (Temple destructions, Bar Kokhba, Crusades, Black Death, Khmelnytsky, Holocaust) and recoveries

### Known Limitations
- Ancient period community coverage is ~12-25% of world total (many small settlements untracked)
- Some population figures for ancient communities are rough scholarly estimates
- The app tracks ~60 major communities; hundreds of smaller ones (shtetls, rural settlements) are not individually represented
- Snapshot years create discrete jumps — the app does not interpolate population between snapshots

---

## Commands

```bash
npm run dev      # Start dev server (Vite, hot reload)
npm run build    # TypeScript check + Vite production build
npm run lint     # ESLint with React hooks/refresh rules
npm run deploy   # Build + deploy to GitHub Pages via gh-pages
```

## File Structure

```
src/
├── main.tsx                    # Entry point, React root + ErrorBoundary
├── App.tsx                     # Main app: state, tabs, playback, story mode
├── ErrorBoundary.tsx           # Crash handler
├── index.css                   # Global styles, animations, map styling
├── components/
│   ├── DiasporaMap.tsx         # D3 interactive world map (main visual)
│   ├── MapOverlay.tsx          # Bottom control bar (play, timeline, stats)
│   ├── ExploreTab.tsx          # Epoch cards with history and statistics
│   ├── EpochBar.tsx            # Epoch pill navigation buttons
│   ├── EventCard.tsx           # Active migration display (top-left)
│   ├── IntroModal.tsx          # Welcome screen with legend
│   ├── StoryMode.tsx           # Cinematic narrative playback
│   ├── Tooltip.tsx             # Community hover tooltip + sparkline
│   └── Timeline.tsx            # Full timeline panel (legacy, unused)
└── data/
    ├── types.ts                # TypeScript interfaces + SNAPSHOT_YEARS
    ├── communities.ts          # 60+ communities with population data
    ├── migrations.ts           # 65+ migration routes
    ├── epochs.ts               # 13 epochs with events, figures, sources
    ├── worldStats.ts           # World Jewish + total population estimates
    └── storyBeats.ts           # 19 story mode narrations

public/
├── countries-110m.json         # TopoJSON world map geometry
├── favicon.svg                 # Browser tab icon
└── icons.svg                   # SVG icon sprite
```
