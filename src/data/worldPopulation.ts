/**
 * Historically-researched world Jewish population and total world population
 * at each snapshot year. Used for the timeline counter and percentage display.
 *
 * Jewish population sources: Salo Baron, Sergio DellaPergola (Hebrew University),
 * American Jewish Year Book, and the Institute for Jewish Policy Research.
 *
 * World population sources: UN estimates, McEvedy & Jones, and Maddison Project.
 */

import type { SnapshotYear } from './types';

/** Authoritative total world Jewish population at each snapshot year */
export const WORLD_JEWISH_POP: Record<SnapshotYear, number> = {
  70:   5_000_000,  // Before Bar Kokhba — Jewish pop near its ancient peak
  200:  4_200_000,  // Post-Bar Kokhba revolt losses and enslavement
  500:  2_500_000,  // Late Antiquity decline under Christian Rome
  700:  1_500_000,  // Continued contraction; Babylonian community largest
  1000: 1_000_000,  // Medieval nadir; crusades and persecutions to come
  1170: 1_000_000,  // Roughly stable; Rhineland & Iberia flourishing
  1300: 1_500_000,  // Modest recovery in Poland-Lithuania and Ottoman lands
  1492:   900_000,  // Alhambra Decree and converso losses gut Iberian Jewry
  1550: 1_000_000,  // Sephardic diaspora resettles in Ottoman Empire
  1650: 1_500_000,  // Polish-Lithuanian Commonwealth peak before Khmelnytsky
  1800: 2_500_000,  // Emancipation era begins; Eastern European growth
  1850: 4_500_000,  // 19th-century demographic surge in Russia and Austria
  1900: 10_600_000, // Mass migration era; Russia's Pale of Settlement
  1939: 16_600_000, // Pre-Holocaust peak; largest Jewish pop in history
  1948: 11_500_000, // After the Shoah — 6 million murdered 1941–1945
  1970: 12_800_000, // Slow recovery; Soviet Jews largely behind Iron Curtain
  2000: 13_100_000, // Soviet aliyah absorbed; Ethiopian Jews in Israel
  2024: 15_800_000, // Israeli population surpasses US as largest Jewish community
};

/** Total world human population at each snapshot year */
export const WORLD_TOTAL_POP: Record<SnapshotYear, number> = {
  70:     300_000_000,
  200:    200_000_000,
  500:    190_000_000,
  700:    210_000_000,
  1000:   310_000_000,
  1170:   360_000_000,
  1300:   400_000_000,  // Black Death (1347–51) not yet
  1492:   420_000_000,
  1550:   450_000_000,
  1650:   500_000_000,
  1800:   900_000_000,
  1850: 1_200_000_000,
  1900: 1_650_000_000,
  1939: 2_300_000_000,
  1948: 2_500_000_000,
  1970: 3_700_000_000,
  2000: 6_100_000_000,
  2024: 8_200_000_000,
};
