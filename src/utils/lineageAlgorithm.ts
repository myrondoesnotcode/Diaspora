import type { Community, CulturalType, Migration } from '../data/types';
import type { Epoch } from '../data/types';
import { COMMUNITIES } from '../data/communities';
import { MIGRATIONS } from '../data/migrations';
import { EPOCHS } from '../data/epochs';

export interface LineageResult {
  destination: Community;
  path: Community[];       // origin → ... → destination
  migrations: Migration[]; // one per path step, length = path.length - 1
  relevantEpochs: Epoch[]; // up to 6 epochs that overlap with the journey
  primaryCulturalType: CulturalType;
}

export interface SearchResult {
  community: Community;
  score: number;
  matchedOn: 'name' | 'alias' | 'partial';
}

// Map of normalized query terms to community IDs
const COUNTRY_ALIASES: Record<string, string[]> = {
  'israel': ['tel-aviv', 'jerusalem', 'haifa', 'safed'],
  'palestine': ['jerusalem', 'tel-aviv', 'hebron'],
  'holy land': ['jerusalem', 'tel-aviv'],
  'united states': ['new-york', 'chicago', 'los-angeles'],
  'united states of america': ['new-york', 'chicago', 'los-angeles'],
  'america': ['new-york', 'chicago', 'los-angeles'],
  'usa': ['new-york', 'chicago', 'los-angeles'],
  'new york': ['new-york'],
  'los angeles': ['los-angeles'],
  'tel aviv': ['tel-aviv'],
  'buenos aires': ['buenos-aires'],
  'sao paulo': ['sao-paulo'],
  'south africa': ['johannesburg'],
  'poland': ['warsaw', 'krakow', 'vilna', 'lodz', 'lublin'],
  'germany': ['frankfurt', 'worms', 'berlin'],
  'france': ['paris'],
  'england': ['london'],
  'uk': ['london'],
  'britain': ['london'],
  'great britain': ['london'],
  'russia': ['odessa', 'kiev', 'minsk'],
  'ukraine': ['kiev', 'odessa'],
  'belarus': ['minsk'],
  'byelorussia': ['minsk'],
  'morocco': ['fez', 'casablanca'],
  'tunisia': ['tunis'],
  'algeria': ['algiers'],
  'egypt': ['cairo', 'alexandria'],
  'iraq': ['baghdad'],
  'babylon': ['baghdad'],
  'mesopotamia': ['baghdad'],
  'iran': ['tehran', 'isfahan'],
  'persia': ['isfahan', 'tehran'],
  'turkey': ['istanbul'],
  'ottoman': ['istanbul', 'thessaloniki'],
  'ottoman empire': ['istanbul', 'thessaloniki'],
  'greece': ['thessaloniki'],
  'spain': ['toledo', 'cordoba'],
  'iberia': ['toledo', 'cordoba'],
  'sephardic': ['toledo', 'cordoba', 'istanbul', 'thessaloniki'],
  'ashkenazi': ['worms', 'frankfurt', 'warsaw', 'vilna'],
  'italy': ['rome', 'venice'],
  'argentina': ['buenos-aires'],
  'australia': ['sydney'],
  'canada': ['montreal'],
  'brazil': ['sao-paulo'],
  'india': ['mumbai', 'cochin'],
  'netherlands': ['amsterdam'],
  'holland': ['amsterdam'],
  'dutch': ['amsterdam'],
  'hungary': ['budapest'],
  'romania': ['bucharest'],
  'austria': ['vienna'],
  'czech': ['prague'],
  'bohemia': ['prague'],
  'moravia': ['prague'],
  'slovakia': ['prague'],
  'lithuania': ['vilna'],
  'georgia': ['tbilisi'],
  'azerbaijan': ['quba'],
  'uzbekistan': ['bukhara'],
  'central asia': ['bukhara', 'tbilisi', 'quba'],
  'syria': ['aleppo', 'damascus'],
  'lebanon': ['beirut'],
  'yemen': ['sanaa'],
  'ethiopia': ['gondar'],
  'china': ['kaifeng'],
  'shanghai': ['shanghai'],
  'singapore': ['mumbai'],
  'libya': ['tripoli'],
  'ancient israel': ['jerusalem', 'hebron', 'samaria'],
  'canaan': ['hebron', 'jerusalem'],
  'mizrahi': ['baghdad', 'isfahan', 'tehran', 'mumbai'],
  'yemenite': ['sanaa'],
  'ethiopian': ['gondar'],
};

// Community lookup by ID
const communityIndex: Record<string, Community> = {};
for (const c of COMMUNITIES) {
  communityIndex[c.id] = c;
}

export function searchCommunities(query: string): SearchResult[] {
  if (!query.trim()) return [];

  const normalized = query.toLowerCase().replace(/['']/g, '').trim();
  const results: SearchResult[] = [];
  const seen = new Set<string>();

  // 1. Check alias table — exact alias match first, then substring
  for (const [alias, ids] of Object.entries(COUNTRY_ALIASES)) {
    if (normalized === alias) {
      for (const id of ids) {
        if (!seen.has(id) && communityIndex[id]) {
          results.push({ community: communityIndex[id], score: 90, matchedOn: 'alias' });
          seen.add(id);
        }
      }
    }
  }
  for (const [alias, ids] of Object.entries(COUNTRY_ALIASES)) {
    if (normalized !== alias && (alias.startsWith(normalized) || normalized.startsWith(alias))) {
      for (const id of ids) {
        if (!seen.has(id) && communityIndex[id]) {
          results.push({ community: communityIndex[id], score: 82, matchedOn: 'alias' });
          seen.add(id);
        }
      }
    }
  }
  for (const [alias, ids] of Object.entries(COUNTRY_ALIASES)) {
    if (!alias.startsWith(normalized) && !normalized.startsWith(alias) && alias.includes(normalized)) {
      for (const id of ids) {
        if (!seen.has(id) && communityIndex[id]) {
          results.push({ community: communityIndex[id], score: 75, matchedOn: 'alias' });
          seen.add(id);
        }
      }
    }
  }

  // 2. Community name matching
  for (const community of COMMUNITIES) {
    if (seen.has(community.id)) continue;
    const name = community.name.toLowerCase();
    if (name === normalized) {
      results.push({ community, score: 100, matchedOn: 'name' });
      seen.add(community.id);
    } else if (name.startsWith(normalized)) {
      results.push({ community, score: 80, matchedOn: 'name' });
      seen.add(community.id);
    } else if (name.includes(normalized)) {
      results.push({ community, score: 70, matchedOn: 'partial' });
      seen.add(community.id);
    } else if (community.significance.toLowerCase().includes(normalized)) {
      results.push({ community, score: 50, matchedOn: 'partial' });
      seen.add(community.id);
    }
  }

  return results
    .filter(r => r.score >= 50)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export function buildLineage(destinationId: string): LineageResult | null {
  const destination = communityIndex[destinationId];
  if (!destination) return null;

  // Build incoming-edges index: incomingEdges[X] = migrations whose .to === X
  const incomingEdges = new Map<string, Migration[]>();
  for (const m of MIGRATIONS) {
    const list = incomingEdges.get(m.to) ?? [];
    list.push(m);
    incomingEdges.set(m.to, list);
  }

  // Degenerate case: no incoming migrations
  if ((incomingEdges.get(destinationId) ?? []).length === 0) {
    return {
      destination,
      path: [destination],
      migrations: [],
      relevantEpochs: [],
      primaryCulturalType: destination.culturalType,
    };
  }

  // Reverse BFS from destination, building pathTree
  // pathTree[X] = { parentId: Y, migration: M } means:
  //   "X was discovered when we explored Y's incoming edges; M goes FROM X TO Y"
  const visited = new Set<string>([destinationId]);
  const pathTree = new Map<string, { parentId: string; migration: Migration }>();
  const queue: string[] = [destinationId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const migration of incomingEdges.get(current) ?? []) {
      if (!visited.has(migration.from)) {
        visited.add(migration.from);
        pathTree.set(migration.from, { parentId: current, migration });
        queue.push(migration.from);
      }
    }
  }

  // Find origin nodes: visited nodes that have no incoming edges within the visited set
  // (i.e., no other visited node "sends" to them)
  const origins: string[] = [];
  for (const nodeId of visited) {
    if (nodeId === destinationId) continue;
    const nodeIncoming = incomingEdges.get(nodeId) ?? [];
    const hasVisitedSource = nodeIncoming.some(m => visited.has(m.from) && m.from !== nodeId);
    if (!hasVisitedSource) {
      origins.push(nodeId);
    }
  }

  if (origins.length === 0) {
    return {
      destination,
      path: [destination],
      migrations: [],
      relevantEpochs: [],
      primaryCulturalType: destination.culturalType,
    };
  }

  // Reconstruct path from each origin, pick the one with the earliest first migration
  let bestPath: Community[] = [];
  let bestMigrations: Migration[] = [];
  let bestScore = Infinity; // lower startYear = better (more ancient)

  for (const originId of origins) {
    const path: Community[] = [];
    const migs: Migration[] = [];
    let current = originId;
    const guardSet = new Set<string>();
    let valid = true;

    while (current !== destinationId) {
      if (guardSet.has(current)) { valid = false; break; }
      guardSet.add(current);
      path.push(communityIndex[current]);
      const entry = pathTree.get(current);
      if (!entry) { valid = false; break; }
      migs.push(entry.migration);
      current = entry.parentId;
    }
    if (!valid) continue;
    path.push(destination);

    // Prefer the path whose first migration is oldest
    const firstYear = migs[0]?.startYear ?? 9999;
    if (firstYear < bestScore) {
      bestScore = firstYear;
      bestPath = path;
      bestMigrations = migs;
    }
  }

  if (bestPath.length === 0) {
    return {
      destination,
      path: [destination],
      migrations: [],
      relevantEpochs: [],
      primaryCulturalType: destination.culturalType,
    };
  }

  // Find epochs that overlap any migration in the path
  const relevantEpochs = EPOCHS.filter(epoch =>
    bestMigrations.some(
      m => epoch.startYear <= m.endYear && epoch.endYear >= m.startYear
    )
  ).slice(0, 6);

  // Determine cultural type — unwrap 'Mixed' by walking backward in path
  let primaryCulturalType: CulturalType = destination.culturalType;
  if (primaryCulturalType === 'Mixed') {
    for (let i = bestPath.length - 2; i >= 0; i--) {
      if (bestPath[i].culturalType !== 'Mixed') {
        primaryCulturalType = bestPath[i].culturalType;
        break;
      }
    }
  }

  return {
    destination,
    path: bestPath,
    migrations: bestMigrations,
    relevantEpochs,
    primaryCulturalType,
  };
}

export function getPeakPopulation(community: Community): number {
  return Math.max(0, ...Object.values(community.populations).filter((v): v is number => v !== undefined));
}

export function getEarliestYear(community: Community): number {
  const years = Object.keys(community.populations)
    .map(Number)
    .filter(y => (community.populations[y] ?? 0) > 0);
  return years.length > 0 ? Math.min(...years) : 0;
}

export function formatYear(y: number): string {
  if (y < 0) return `${Math.abs(y)} BCE`;
  if (y < 1000) return `${y} CE`;
  return `${y}`;
}

export function fmtPop(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return Math.round(n / 1000) + 'k';
  return n.toString();
}
