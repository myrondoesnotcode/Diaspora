import type { SnapshotYear } from './types';

/**
 * World Jewish population estimates by snapshot year.
 * Sources: DellaPergola, Sergio. "World Jewish Population." American Jewish Year Book, 2020.
 *          Baron, Salo. "A Social and Religious History of the Jews." 1971.
 *          Barnavi, Eli. "A Historical Atlas of the Jewish People." 1992.
 *
 * Note: The year 200 CE reflects the severe population decline caused by the
 * Bar Kokhba revolt (132–135 CE), Hadrian's destruction of Judea, and mass
 * enslavement/exile — reducing world Jewry by roughly 35% from the 70 CE baseline.
 */
export const WORLD_JEWISH_POP: Record<SnapshotYear, number> = {
  [-1800]: 5_000,       // Patriarchal clan; proto-Israelite families in Canaan
  [-1000]: 250_000,     // United Monarchy under David and Solomon; kingdom at its height
  [-586]: 500_000,      // Pre-exile Judean and diaspora population combined
  [-516]: 350_000,      // Post-exile; many remain in Babylon; returnees rebuild Temple
  [-167]: 2_500_000,    // Late Second Temple period; large communities in Egypt, Babylon, Judea
  70:   5_000_000,   // Peak diaspora just after Temple destruction; large communities in Babylon, Egypt, Rome
  200:  3_200_000,   // ~35% drop: Bar Kokhba revolt (132–135 CE) devastated Judean Jewry
  500:  1_500_000,   // Major decline under Byzantine restrictions and Christianization (DellaPergola ~1–1.5M)
  700:  1_200_000,   // Further decline; early Islamic rule beginning to stabilize communities (DellaPergola ~1–1.5M)
  1000: 1_500_000,   // Recovery under Abbasid caliphate; Rhineland Ashkenazi settlement beginning
  1170: 1_500_000,   // First Crusade (1096) massacres; stagnation in Western Europe
  1300: 1_500_000,   // Before the Black Death (1347–51); pre-expulsion from England (1290)
  1492: 1_000_000,   // Year of Spanish expulsion; major communities expelled from Iberia
  1550: 1_100_000,   // Sephardic refugees settling in Ottoman Empire, North Africa
  1650: 1_500_000,   // Polish-Lithuanian & Ottoman communities at height; pre-Khmelnytsky
  1800: 2_500_000,   // Post-Enlightenment; growth in Eastern Europe (Pale of Settlement)
  1850: 5_000_000,   // Rapid growth in Europe; Emancipation era
  1900: 10_600_000,  // Mass migration era; 8M+ in Eastern Europe
  1939: 16_500_000,  // Pre-Holocaust peak; ~9M in Europe alone
  1948: 11_500_000,  // Post-Holocaust: ~6M murdered; Israel founded
  1970: 13_500_000,  // Recovery and Israeli growth; Soviet Jewry still largely trapped
  2000: 13_300_000,  // Slight decline due to assimilation in diaspora
  2026: 16_000_000,  // Growth driven by Israel (~7.2M) and global diaspora (~8.8M)
};

/**
 * World total population estimates by snapshot year.
 * Sources: UN Population Division (2022); McEvedy & Jones, "Atlas of World Population
 *          History," 1978; Livi-Bacci, "A Concise History of World Population," 2017.
 *
 * Note: World population was broadly stable 70–700 CE (around 200–300M), fell
 * during the collapse of Western Rome and the Plague of Justinian (541 CE),
 * then recovered steadily from 700 CE onward.
 */
export const WORLD_TOTAL_POP: Record<SnapshotYear, number> = {
  [-1800]: 30_000_000,     // Early Bronze Age; Mesopotamian civilizations
  [-1000]: 50_000_000,     // Iron Age; Egyptian, Mesopotamian, Chinese civilizations
  [-586]: 100_000_000,     // Neo-Babylonian period; rise of Persia
  [-516]: 100_000_000,     // Achaemenid Persian Empire at its height
  [-167]: 200_000_000,     // Hellenistic world; Roman Republic expanding
  70:   300_000_000,    // Roman Empire at its height; estimates range 250–300M
  200:  260_000_000,    // Antonine Plague (165–180 CE) caused significant decline
  500:  190_000_000,    // Fall of Western Rome; Plague of Justinian precursors; demographic nadir
  700:  210_000_000,    // Slow recovery under Islamic expansion
  1000: 280_000_000,    // Medieval growth; recovery well underway
  1170: 370_000_000,    // Agricultural advances; population expansion in Europe and Asia
  1300: 430_000_000,    // Pre-Black Death peak
  1492: 440_000_000,    // Just before Columbian Exchange (Americas depopulation follows)
  1550: 430_000_000,    // Americas depopulation (~50M deaths) offset by Eurasian growth
  1650: 550_000_000,    // Recovery; Americas partially repopulated
  1800: 900_000_000,    // Industrial Revolution beginning; global growth accelerating
  1850: 1_200_000_000,  // Industrial and agricultural revolutions driving growth
  1900: 1_600_000_000,  // Modern medicine beginning; global pop accelerating
  1939: 2_300_000_000,  // Interwar population; WWII about to cause major disruption
  1948: 2_400_000_000,  // Immediate post-WWII
  1970: 3_700_000_000,  // Population explosion in full swing
  2000: 6_100_000_000,  // Near 6B; growth slowing in developed world
  2026: 8_300_000_000,  // Current world population
};

export function getWorldJewishPercent(year: SnapshotYear): number {
  return (WORLD_JEWISH_POP[year] / WORLD_TOTAL_POP[year]) * 100;
}
