import { useEffect, useRef, useState } from 'react';
import type { Chapter } from '../data/chapters';

interface Props {
  chapter: Chapter;
}

// Hebrew numerals for the chapter index — alef through tet.
const HEBREW_NUMERALS = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];

// A tall scroll section. The narrative card and image reveal themselves as
// they enter the viewport; the map continues evolving behind them.
export default function ChapterSection({ chapter }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setShown(true);
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const side = chapter.index % 2 === 0 ? 'left' : 'right';

  return (
    <section className="chapter" id={`chapter-${chapter.id}`} style={{ ['--accent' as string]: chapter.palette.accent }}>
      <div ref={ref} className={`chapter-inner chapter-${side} ${shown ? 'is-shown' : ''}`}>
        <div className="chapter-card">
          <div className="chapter-kicker">
            <span className="chapter-number" aria-hidden="true">
              {HEBREW_NUMERALS[chapter.index] ?? String(chapter.index + 1)}
            </span>
            {chapter.kicker}
          </div>
          <h2 className="chapter-title">{chapter.title}</h2>
          <div className="chapter-dates">{chapter.dates}</div>
          {chapter.narrative.map((p, i) => (
            <p className="chapter-para" key={i}>{p}</p>
          ))}
          <div className="chapter-facts">
            {chapter.facts.map((f, i) => (
              <div className="fact-chip" key={i} style={{ transitionDelay: `${0.15 + i * 0.12}s` }}>
                <div className="fact-value">{f.value}</div>
                <div className="fact-label">{f.label}</div>
              </div>
            ))}
          </div>
        </div>

        <figure className="chapter-figure">
          <div className="chapter-image-frame">
            <img
              src={`${import.meta.env.BASE_URL}${chapter.image}`}
              alt={chapter.imageAlt}
              loading="lazy"
            />
          </div>
          <figcaption>
            {chapter.imageCaption}
            <span className="image-credit">{chapter.imageCredit}</span>
          </figcaption>
        </figure>
      </div>

      {/* Giant translucent date over the clean-map stretch of the chapter */}
      <div className="chapter-ghost-year" aria-hidden="true">
        {chapter.ghostYear}
      </div>
    </section>
  );
}
