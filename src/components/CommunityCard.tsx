import { COMMUNITIES } from '../data/communities';
import { CULTURAL_COLORS } from '../data/palette';
import { populationAt } from '../utils/story';

interface Props {
  communityId: string;
  year: number;
  onClose: () => void;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return Math.round(n / 1000) + ',000';
  return Math.round(n).toString();
}

// Story-mode detail card: click any light on the map to read its story.
export default function CommunityCard({ communityId, year, onClose }: Props) {
  const community = COMMUNITIES.find((c) => c.id === communityId);
  if (!community) return null;
  const color = CULTURAL_COLORS[community.culturalType];
  const pop = populationAt(community, year);
  const peak = Math.max(0, ...Object.values(community.populations).map(Number));

  return (
    <aside className="community-card" style={{ ['--accent' as string]: color }}>
      <button className="community-card-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <div className="community-card-head">
        <span className="community-card-dot" />
        <h3>{community.name}</h3>
      </div>
      <div className="community-card-meta">
        <span className="community-card-type">{community.culturalType}</span>
        <span className="community-card-pop">
          {pop > 0 ? `~${fmt(pop)} in ${Math.round(year)}` : 'No community this year'}
          {peak > 0 && pop < peak && ` · peak ~${fmt(peak)}`}
        </span>
      </div>
      <p>{community.significance}</p>
    </aside>
  );
}
