import type { Migration } from '../data/types';

interface Props {
  year: number;
  migrations: Migration[];
}

const ARC_COLORS: Record<string, string> = {
  forced: '#ff4444',
  voluntary: '#44aaff',
};

export default function EventCard({ year, migrations }: Props) {
  if (migrations.length === 0) return null;

  // Newly-started migrations first, then most recently started, forced before voluntary
  const sorted = [...migrations].sort((a, b) => {
    const aNew = a.startYear === year ? 0 : 1;
    const bNew = b.startYear === year ? 0 : 1;
    if (aNew !== bNew) return aNew - bNew;
    if (a.startYear !== b.startYear) return b.startYear - a.startYear;
    if (a.type !== b.type) return a.type === 'forced' ? -1 : 1;
    return 0;
  });

  const shown = sorted.slice(0, 3);
  const extra = migrations.length - shown.length;

  return (
    <div
      style={{
        position: 'absolute', top: 12, left: 12,
        maxWidth: 'min(270px, calc(100vw - 24px))',
        background: 'rgba(245,240,232,0.93)',
        border: '1px solid rgba(0,0,0,0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: 12,
        padding: '10px 12px',
        animation: 'fadeIn 0.25s ease',
      }}
    >
      <div style={{
        fontSize: 9, fontWeight: 700, color: '#9a8a7a',
        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 7,
      }}>
        What's happening
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {shown.map((m) => (
          <div key={m.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              flexShrink: 0, marginTop: 3,
              background: ARC_COLORS[m.type],
            }} />
            <span style={{ fontSize: 11, color: '#3a2a1a', lineHeight: 1.45 }}>
              {m.description}
            </span>
          </div>
        ))}
      </div>

      {extra > 0 && (
        <div style={{ fontSize: 9, color: '#9a8a7a', marginTop: 6 }}>
          +{extra} more active
        </div>
      )}
    </div>
  );
}
