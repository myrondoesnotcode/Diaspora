import { CHAPTERS } from '../data/chapters';

export interface FeedMoment {
  year: number;
  label: string;
  kind: 'light' | 'dark';
}

interface Props {
  year: number;
  population: number;
  chapterIndex: number; // -1 during hero
  accent: string;
  visible: boolean;
  progress: number; // 0..1 through the whole story
}

function formatYear(y: number): string {
  const yr = Math.round(y);
  return yr < 1000 ? `${yr} CE` : `${yr}`;
}

function formatPop(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + ' million';
  if (n >= 1_000) return Math.round(n / 1000).toLocaleString() + ',000';
  return Math.round(n).toString();
}

// Fixed heads-up display: era progress bar, live year + population readout,
// chapter rail, and the bottom-left feed of moments and active migrations.
export default function StoryHUD({
  year,
  population,
  chapterIndex,
  accent,
  visible,
  progress,
}: Props) {
  const chapter = chapterIndex >= 0 ? CHAPTERS[chapterIndex] : null;

  const jumpTo = (id: string) => {
    document.getElementById(`chapter-${id}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  const gradient = `linear-gradient(to right, ${CHAPTERS.map(
    (c, i) => `${c.palette.accent} ${(i / (CHAPTERS.length - 1)) * 100}%`
  ).join(', ')})`;

  return (
    <div className={`story-hud ${visible ? '' : 'hud-hidden'}`}>
      {/* Era progress bar */}
      <div className="hud-progress-track">
        <div
          className="hud-progress-fill"
          style={{ width: `${progress * 100}%`, backgroundImage: gradient }}
        />
      </div>

      <div className="hud-top" style={{ ['--accent' as string]: accent }}>
        <div className="hud-era">{chapter ? chapter.kicker : 'The Jewish Diaspora'}</div>
        <div className="hud-year">{formatYear(year)}</div>
        <div className="hud-pop">
          <span className="hud-pop-num">~{formatPop(population)}</span> Jews worldwide
        </div>
      </div>

      <nav className="hud-rail" aria-label="Chapters">
        {CHAPTERS.map((c, i) => (
          <button
            key={c.id}
            className={`rail-dot ${i === chapterIndex ? 'is-active' : ''} ${i < chapterIndex ? 'is-past' : ''}`}
            style={{ ['--dot' as string]: c.palette.accent }}
            onClick={() => jumpTo(c.id)}
            title={`${c.kicker} · ${c.dates}`}
            aria-label={c.kicker}
          />
        ))}
      </nav>

    </div>
  );
}

// Bottom-left feed of moments + active migrations. Rendered as its own fixed
// layer BELOW the scrolling chapter cards so passing content covers it.
export function StoryFeed({
  moments,
  migrations,
  visible,
}: {
  moments: FeedMoment[];
  migrations: string[];
  visible: boolean;
}) {
  return (
    <div className={`hud-feed ${visible ? '' : 'hud-hidden'}`}>
      {moments.map((m) => (
        <div key={`${m.year}-${m.label.slice(0, 12)}`} className={`feed-moment feed-${m.kind}`}>
          <span className="feed-year">{formatYear(m.year)}</span>
          <span className="feed-label">{m.label}</span>
        </div>
      ))}
      {migrations.map((d) => (
        <div key={d} className="feed-migration">
          <span className="feed-arrow">⇢</span>
          <span className="feed-label">{d}</span>
        </div>
      ))}
    </div>
  );
}
