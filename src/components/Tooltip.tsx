import React from 'react';
import type { Community, CulturalType } from '../data/types';

const CULTURAL_COLORS: Record<CulturalType, string> = {
  Ashkenazi: '#4a9eff',
  Sephardic: '#f5a623',
  Mizrahi: '#7ed321',
  Yemenite: '#bd10e0',
  Ethiopian: '#e86c2c',
  Mixed: '#9b9b9b',
};

interface Props {
  community: Community;
  population: number;
  x: number;
  y: number;
  mapWidth: number;
  mapHeight: number;
  isMobile?: boolean;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return Math.round(n / 1000) + 'k';
  return n.toString();
}

function TooltipContent({ community, population, color }: { community: Community; population: number; color: string }) {
  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
        />
        <span className="font-semibold text-white text-sm leading-tight">{community.name}</span>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: color + '22', color, border: `1px solid ${color}44` }}
        >
          {community.culturalType}
        </span>
        {population > 0 && (
          <span className="text-white font-bold text-sm">
            {fmt(population)} Jews
          </span>
        )}
      </div>

      {population === 0 && (
        <div className="text-xs text-slate-400 mb-2 italic">Not yet established / destroyed</div>
      )}

      <p className="text-xs text-slate-300 leading-relaxed">{community.significance}</p>
    </>
  );
}

export default function Tooltip({ community, population, x, y, mapWidth, mapHeight, isMobile }: Props) {
  const color = CULTURAL_COLORS[community.culturalType];

  if (isMobile) {
    return (
      <div className="tooltip-sheet">
        <TooltipContent community={community} population={population} color={color} />
      </div>
    );
  }

  // Flip tooltip if too close to right or bottom edge
  const flip = x > mapWidth * 0.7;
  const flipY = y > mapHeight * 0.75;

  const style: React.CSSProperties = {
    left: flip ? undefined : x + 14,
    right: flip ? mapWidth - x + 14 : undefined,
    top: flipY ? undefined : y - 8,
    bottom: flipY ? mapHeight - y - 8 : undefined,
  };

  return (
    <div className="tooltip" style={style}>
      <TooltipContent community={community} population={population} color={color} />
    </div>
  );
}
