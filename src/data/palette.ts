// Shared color language for explore mode — harmonized with the story's
// "light on dark ink" system (see chapters.ts palettes).

import type { CulturalType } from './types';

export const CULTURAL_COLORS: Record<CulturalType, string> = {
  Ancient: '#e8b54d', // temple gold
  Ashkenazi: '#6fb4ff', // dawn blue
  Sephardic: '#ffc24d', // amber gold
  Mizrahi: '#57e0a6', // emerald
  Yemenite: '#c891ff', // violet
  Ethiopian: '#ff9a5c', // ember
  Mixed: '#aeb6c4', // silver
};

export const ARC_COLORS: Record<string, string> = {
  forced: '#ff6252',
  voluntary: '#ffe3a1',
};
