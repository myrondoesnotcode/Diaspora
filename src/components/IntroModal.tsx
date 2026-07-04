interface Props {
  onClose: () => void;
  onStoryMode: () => void;
}

export default function IntroModal({ onClose, onStoryMode }: Props) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: 16, paddingBottom: 24,
        background: 'rgba(10, 15, 40, 0.6)',
        backdropFilter: 'blur(6px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#f5f0e8',
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: 20,
          width: '100%', maxWidth: 400,
          padding: '20px 22px 26px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
          animation: 'introSlideUp 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div style={{ width: 36, height: 4, background: 'rgba(0,0,0,0.12)', borderRadius: 2, margin: '0 auto 18px' }} />

        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1410', marginBottom: 3 }}>
            The Jewish Diaspora
          </div>
          <div style={{ fontSize: 12, color: '#9a8a7a' }}>
            4,000 years of history · 1800 BCE to 2026
          </div>
        </div>

        <p style={{ fontSize: 14, color: '#3a2a1a', lineHeight: 1.6, marginBottom: 18 }}>
          Watch Jewish communities form, grow, and scatter across the world. Press{' '}
          <strong>play</strong> to let history unfold, or drag the timeline to any era.
          Tap a circle to learn about a community.
        </p>

        {/* Legend guide */}
        <div style={{
          background: 'rgba(0,0,0,0.04)',
          border: '1px solid rgba(0,0,0,0.06)',
          borderRadius: 12,
          padding: '12px 14px',
          marginBottom: 20,
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
              {([['#4a9eff', 14], ['#f5a623', 10], ['#7ed321', 7]] as [string, number][]).map(([c, s]) => (
                <div key={c} style={{ width: s, height: s, borderRadius: '50%', background: c, flexShrink: 0 }} />
              ))}
            </div>
            <span style={{ fontSize: 12, color: '#3a2a1a' }}>Circles = communities, sized by population</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 2, background: '#ff4444', borderRadius: 1, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: '#3a2a1a' }}>Red arcs = forced expulsion or flight</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 2, background: '#44aaff', borderRadius: 1, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: '#3a2a1a' }}>Blue arcs = voluntary migration</span>
          </div>
        </div>

        <button
          onClick={onStoryMode}
          style={{
            width: '100%', padding: '13px 0',
            background: '#e07b39', color: 'white',
            border: 'none', borderRadius: 12,
            fontSize: 15, fontWeight: 600, cursor: 'pointer',
            marginBottom: 8,
          }}
        >
          Watch the Story →
        </button>
        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '12px 0',
            background: 'rgba(0,0,0,0.06)', color: '#3a2a1a',
            border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12,
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Explore Freely
        </button>
      </div>

      <style>{`
        @keyframes introSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
