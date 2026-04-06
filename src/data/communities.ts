import type { Community } from './types';

// populations keyed by snapshot year
// [70, 200, 500, 700, 1000, 1170, 1300, 1492, 1550, 1650, 1800, 1850, 1900, 1939, 1948, 1970, 2000, 2024]

export const COMMUNITIES: Community[] = [
  // ── Ancient Heartland ──────────────────────────────────────────────────────
  {
    id: 'jerusalem',
    name: 'Jerusalem',
    lat: 31.78,
    lng: 35.22,
    culturalType: 'Mixed',
    significance: 'Holy city and spiritual center of the Jewish people for three millennia.',
    populations: {
      70: 80000, 200: 20000, 500: 15000, 700: 12000, 1000: 8000,
      1170: 7000, 1300: 5000, 1492: 5000, 1550: 12000, 1650: 8000,
      1800: 8000, 1850: 15000, 1900: 40000, 1939: 85000, 1948: 100000,
      1970: 195000, 2000: 450000, 2024: 570000,
    },
  },
  {
    id: 'tel-aviv',
    name: 'Tel Aviv–Jaffa',
    lat: 32.08,
    lng: 34.78,
    culturalType: 'Mixed',
    significance: 'Founded 1909; Israel\'s largest metropolitan center and cultural capital.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 0, 1492: 0, 1550: 0, 1650: 0,
      1800: 0, 1850: 0, 1900: 5000, 1939: 150000, 1948: 250000,
      1970: 650000, 2000: 1200000, 2024: 1500000,
    },
  },
  {
    id: 'haifa',
    name: 'Haifa',
    lat: 32.82,
    lng: 34.99,
    culturalType: 'Mixed',
    significance: 'Northern Israeli port city; hub of Aliyah absorption.',
    populations: {
      70: 5000, 200: 3000, 500: 2000, 700: 2000, 1000: 2000,
      1170: 2000, 1300: 1000, 1492: 800, 1550: 1000, 1650: 1000,
      1800: 2000, 1850: 4000, 1900: 10000, 1939: 65000, 1948: 120000,
      1970: 220000, 2000: 380000, 2024: 550000,
    },
  },
  // ── Babylonia / Iraq ────────────────────────────────────────────────────────
  {
    id: 'baghdad',
    name: 'Baghdad (Babylon)',
    lat: 33.34,
    lng: 44.4,
    culturalType: 'Mizrahi',
    significance: 'Seat of the great yeshivot (Sura, Pumbedita) and Gaonic leadership for centuries.',
    populations: {
      70: 150000, 200: 200000, 500: 300000, 700: 250000, 1000: 200000,
      1170: 150000, 1300: 120000, 1492: 100000, 1550: 80000, 1650: 80000,
      1800: 70000, 1850: 80000, 1900: 80000, 1939: 90000, 1948: 80000,
      1970: 6000, 2000: 100, 2024: 5,
    },
  },
  // ── Egypt ───────────────────────────────────────────────────────────────────
  {
    id: 'alexandria',
    name: 'Alexandria',
    lat: 31.2,
    lng: 29.92,
    culturalType: 'Sephardic',
    significance: 'Home to a large Hellenistic Jewish community; Philo wrote here.',
    populations: {
      70: 100000, 200: 60000, 500: 30000, 700: 20000, 1000: 15000,
      1170: 12000, 1300: 10000, 1492: 8000, 1550: 8000, 1650: 8000,
      1800: 12000, 1850: 18000, 1900: 30000, 1939: 65000, 1948: 55000,
      1970: 1000, 2000: 100, 2024: 50,
    },
  },
  // ── Persia / Iran ───────────────────────────────────────────────────────────
  {
    id: 'isfahan',
    name: 'Isfahan (Persia)',
    lat: 32.66,
    lng: 51.68,
    culturalType: 'Mizrahi',
    significance: 'Ancient Persian Jewish community; thrived under Achaemenid and Safavid rule.',
    populations: {
      70: 40000, 200: 50000, 500: 70000, 700: 60000, 1000: 50000,
      1170: 50000, 1300: 45000, 1492: 45000, 1550: 40000, 1650: 45000,
      1800: 50000, 1850: 60000, 1900: 90000, 1939: 110000, 1948: 100000,
      1970: 80000, 2000: 15000, 2024: 8000,
    },
  },
  // ── Yemen ────────────────────────────────────────────────────────────────────
  {
    id: 'sanaa',
    name: "San'a (Yemen)",
    lat: 15.35,
    lng: 44.2,
    culturalType: 'Yemenite',
    significance: "One of the oldest continuous Jewish diaspora communities, maintaining ancient traditions.",
    populations: {
      70: 30000, 200: 35000, 500: 40000, 700: 45000, 1000: 50000,
      1170: 55000, 1300: 50000, 1492: 48000, 1550: 45000, 1650: 45000,
      1800: 35000, 1850: 35000, 1900: 30000, 1939: 55000, 1948: 45000,
      1970: 2000, 2000: 400, 2024: 50,
    },
  },
  // ── North Africa ─────────────────────────────────────────────────────────────
  {
    id: 'fez',
    name: 'Fez (Morocco)',
    lat: 34.04,
    lng: -5.0,
    culturalType: 'Sephardic',
    significance: 'Major center of Sephardic life after 1492; home to Maimonides\'s family.',
    populations: {
      70: 0, 200: 5000, 500: 15000, 700: 20000, 1000: 30000,
      1170: 40000, 1300: 50000, 1492: 60000, 1550: 80000, 1650: 90000,
      1800: 100000, 1850: 150000, 1900: 200000, 1939: 260000, 1948: 240000,
      1970: 80000, 2000: 5000, 2024: 2500,
    },
  },
  {
    id: 'tunis',
    name: 'Tunis (Tunisia)',
    lat: 36.82,
    lng: 10.18,
    culturalType: 'Sephardic',
    significance: 'Cosmopolitan Mediterranean Jewish hub; absorbed Spanish exiles after 1492.',
    populations: {
      70: 5000, 200: 15000, 500: 20000, 700: 25000, 1000: 25000,
      1170: 25000, 1300: 30000, 1492: 35000, 1550: 45000, 1650: 50000,
      1800: 55000, 1850: 60000, 1900: 65000, 1939: 100000, 1948: 90000,
      1970: 25000, 2000: 2000, 2024: 1000,
    },
  },
  {
    id: 'tripoli',
    name: 'Tripoli (Libya)',
    lat: 32.9,
    lng: 13.18,
    culturalType: 'Sephardic',
    significance: 'Ancient Jewish community; largely emigrated to Israel after 1948.',
    populations: {
      70: 10000, 200: 12000, 500: 12000, 700: 12000, 1000: 15000,
      1170: 20000, 1300: 22000, 1492: 22000, 1550: 25000, 1650: 28000,
      1800: 25000, 1850: 25000, 1900: 25000, 1939: 32000, 1948: 28000,
      1970: 1000, 2000: 0, 2024: 0,
    },
  },
  // ── Roman Empire / Italy ─────────────────────────────────────────────────────
  {
    id: 'rome',
    name: 'Rome',
    lat: 41.9,
    lng: 12.5,
    culturalType: 'Sephardic',
    significance: 'Oldest continuous Jewish community in Europe; the Trastevere ghetto dates to antiquity.',
    populations: {
      70: 40000, 200: 50000, 500: 30000, 700: 18000, 1000: 15000,
      1170: 15000, 1300: 12000, 1492: 10000, 1550: 12000, 1650: 14000,
      1800: 10000, 1850: 12000, 1900: 15000, 1939: 15000, 1948: 14000,
      1970: 20000, 2000: 25000, 2024: 22000,
    },
  },
  {
    id: 'venice',
    name: 'Venice',
    lat: 45.44,
    lng: 12.33,
    culturalType: 'Mixed',
    significance: 'First ghetto in history (1516); center of Hebrew printing and Sephardic trade.',
    populations: {
      70: 0, 200: 0, 500: 1000, 700: 1500, 1000: 2000,
      1170: 3000, 1300: 4000, 1492: 5000, 1550: 8000, 1650: 6000,
      1800: 4000, 1850: 4000, 1900: 2000, 1939: 1600, 1948: 1200,
      1970: 2500, 2000: 2500, 2024: 2000,
    },
  },
  // ── Spain / Iberia ───────────────────────────────────────────────────────────
  {
    id: 'toledo',
    name: 'Toledo (Spain)',
    lat: 39.86,
    lng: -4.03,
    culturalType: 'Sephardic',
    significance: 'Crown of Castile\'s Jewish capital; major center until the 1391 pogroms and 1492 expulsion.',
    populations: {
      70: 0, 200: 3000, 500: 12000, 700: 18000, 1000: 30000,
      1170: 50000, 1300: 60000, 1492: 0, 1550: 0, 1650: 0,
      1800: 0, 1850: 0, 1900: 0, 1939: 0, 1948: 0,
      1970: 0, 2000: 0, 2024: 0,
    },
  },
  {
    id: 'cordoba',
    name: 'Córdoba (Spain)',
    lat: 37.88,
    lng: -4.78,
    culturalType: 'Sephardic',
    significance: 'Birthplace of Maimonides (1138); epicenter of the Andalusian Golden Age.',
    populations: {
      70: 0, 200: 0, 500: 8000, 700: 12000, 1000: 40000,
      1170: 5000, 1300: 3000, 1492: 0, 1550: 0, 1650: 0,
      1800: 0, 1850: 0, 1900: 0, 1939: 0, 1948: 0,
      1970: 0, 2000: 0, 2024: 0,
    },
  },
  // ── France ───────────────────────────────────────────────────────────────────
  {
    id: 'paris',
    name: 'Paris',
    lat: 48.85,
    lng: 2.35,
    culturalType: 'Ashkenazi',
    significance: 'Rashi lived in Troyes nearby; largest Jewish community in Europe today.',
    populations: {
      70: 2000, 200: 3000, 500: 5000, 700: 8000, 1000: 15000,
      1170: 20000, 1300: 10000, 1492: 5000, 1550: 5000, 1650: 8000,
      1800: 30000, 1850: 65000, 1900: 120000, 1939: 200000, 1948: 160000,
      1970: 300000, 2000: 450000, 2024: 500000,
    },
  },
  // ── Germany / Rhine Valley ────────────────────────────────────────────────────
  {
    id: 'frankfurt',
    name: 'Frankfurt',
    lat: 50.11,
    lng: 8.68,
    culturalType: 'Ashkenazi',
    significance: 'Rothschilds\' city; major center of Ashkenazi life and the Reform movement.',
    populations: {
      70: 0, 200: 500, 500: 2000, 700: 4000, 1000: 8000,
      1170: 12000, 1300: 18000, 1492: 10000, 1550: 12000, 1650: 15000,
      1800: 20000, 1850: 28000, 1900: 26000, 1939: 11000, 1948: 0,
      1970: 6000, 2000: 40000, 2024: 35000,
    },
  },
  {
    id: 'worms',
    name: 'Worms–Mainz (Rhineland)',
    lat: 49.63,
    lng: 8.36,
    culturalType: 'Ashkenazi',
    significance: 'Birthplace of Ashkenazi Jewry (ShUM communities); destroyed in First Crusade massacres (1096).',
    populations: {
      70: 0, 200: 500, 500: 2000, 700: 3000, 1000: 5000,
      1170: 10000, 1300: 8000, 1492: 6000, 1550: 4000, 1650: 3000,
      1800: 3000, 1850: 4000, 1900: 4000, 1939: 1500, 1948: 0,
      1970: 500, 2000: 1000, 2024: 800,
    },
  },
  // ── Eastern Europe ────────────────────────────────────────────────────────────
  {
    id: 'krakow',
    name: 'Kraków (Poland)',
    lat: 50.06,
    lng: 19.94,
    culturalType: 'Ashkenazi',
    significance: 'Royal capital with Kazimierz Jewish quarter; seat of the Council of Four Lands.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 5000, 1492: 15000, 1550: 25000, 1650: 40000,
      1800: 10000, 1850: 22000, 1900: 28000, 1939: 68000, 1948: 9000,
      1970: 8000, 2000: 8000, 2024: 7000,
    },
  },
  {
    id: 'warsaw',
    name: 'Warsaw',
    lat: 52.23,
    lng: 21.01,
    culturalType: 'Ashkenazi',
    significance: 'Largest Jewish city in Europe pre-WWII; site of the 1943 Ghetto Uprising.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 0, 1492: 2000, 1550: 5000, 1650: 10000,
      1800: 20000, 1850: 50000, 1900: 300000, 1939: 380000, 1948: 5000,
      1970: 15000, 2000: 8000, 2024: 10000,
    },
  },
  {
    id: 'vilna',
    name: 'Vilna (Vilnius)',
    lat: 54.69,
    lng: 25.28,
    culturalType: 'Ashkenazi',
    significance: 'The "Jerusalem of Lithuania" — seat of the Vilna Gaon; center of Haskalah and Bundism.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 0, 1492: 1000, 1550: 5000, 1650: 15000,
      1800: 25000, 1850: 65000, 1900: 85000, 1939: 60000, 1948: 0,
      1970: 5000, 2000: 5000, 2024: 3000,
    },
  },
  {
    id: 'lublin',
    name: 'Lublin (Poland)',
    lat: 51.25,
    lng: 22.57,
    culturalType: 'Ashkenazi',
    significance: 'Home of the Council of Four Lands and the Maharal\'s students; center of Polish Torah study.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 2000, 1492: 8000, 1550: 15000, 1650: 7000,
      1800: 12000, 1850: 22000, 1900: 45000, 1939: 40000, 1948: 0,
      1970: 3000, 2000: 3000, 2024: 2000,
    },
  },
  // ── Ukraine / Russia ──────────────────────────────────────────────────────────
  {
    id: 'odessa',
    name: 'Odessa',
    lat: 46.48,
    lng: 30.72,
    culturalType: 'Ashkenazi',
    significance: 'Cosmopolitan port city; birthplace of Zionism\'s Ahad Ha\'am and Ze\'ev Jabotinsky.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 0, 1492: 0, 1550: 0, 1650: 0,
      1800: 15000, 1850: 50000, 1900: 160000, 1939: 200000, 1948: 60000,
      1970: 120000, 2000: 100000, 2024: 45000,
    },
  },
  {
    id: 'kiev',
    name: 'Kyiv',
    lat: 50.45,
    lng: 30.52,
    culturalType: 'Ashkenazi',
    significance: 'Major center of the Pale of Settlement; site of the Babi Yar massacre (1941).',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 0, 1492: 0, 1550: 0, 1650: 0,
      1800: 5000, 1850: 25000, 1900: 100000, 1939: 175000, 1948: 50000,
      1970: 150000, 2000: 200000, 2024: 100000,
    },
  },
  {
    id: 'minsk',
    name: 'Minsk',
    lat: 53.9,
    lng: 27.57,
    culturalType: 'Ashkenazi',
    significance: 'Heart of the Pale of Settlement; devastated in the Holocaust.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 0, 1492: 0, 1550: 0, 1650: 5000,
      1800: 12000, 1850: 28000, 1900: 50000, 1939: 75000, 1948: 5000,
      1970: 50000, 2000: 15000, 2024: 10000,
    },
  },
  // ── Ottoman Empire ────────────────────────────────────────────────────────────
  {
    id: 'istanbul',
    name: 'Istanbul (Constantinople)',
    lat: 41.01,
    lng: 28.97,
    culturalType: 'Sephardic',
    significance: 'Ottoman capital welcomed Spanish exiles in 1492; major Sephardic metropolis.',
    populations: {
      70: 10000, 200: 15000, 500: 10000, 700: 15000, 1000: 20000,
      1170: 25000, 1300: 30000, 1492: 40000, 1550: 60000, 1650: 70000,
      1800: 65000, 1850: 65000, 1900: 80000, 1939: 80000, 1948: 80000,
      1970: 40000, 2000: 22000, 2024: 15000,
    },
  },
  {
    id: 'thessaloniki',
    name: 'Thessaloniki',
    lat: 40.64,
    lng: 22.94,
    culturalType: 'Sephardic',
    significance: 'Majority-Jewish city for centuries; "Mother of Israel" — almost entirely destroyed in the Holocaust.',
    populations: {
      70: 5000, 200: 6000, 500: 5000, 700: 5000, 1000: 5000,
      1170: 5000, 1300: 6000, 1492: 15000, 1550: 35000, 1650: 55000,
      1800: 60000, 1850: 70000, 1900: 80000, 1939: 56000, 1948: 0,
      1970: 1000, 2000: 1200, 2024: 1000,
    },
  },
  {
    id: 'safed',
    name: 'Safed (Tzfat)',
    lat: 32.96,
    lng: 35.5,
    culturalType: 'Sephardic',
    significance: 'Kabbalistic center; Rabbi Karo codified Jewish law here (Shulchan Aruch, 1563).',
    populations: {
      70: 5000, 200: 5000, 500: 4000, 700: 4000, 1000: 4000,
      1170: 5000, 1300: 5000, 1492: 6000, 1550: 15000, 1650: 10000,
      1800: 4000, 1850: 8000, 1900: 12000, 1939: 12000, 1948: 15000,
      1970: 30000, 2000: 70000, 2024: 110000,
    },
  },
  // ── Netherlands ───────────────────────────────────────────────────────────────
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    lat: 52.37,
    lng: 4.9,
    culturalType: 'Sephardic',
    significance: '"Dutch Jerusalem" — haven for Sephardic refugees; Spinoza and Rembrandt lived here.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 0, 1492: 0, 1550: 5000, 1650: 20000,
      1800: 20000, 1850: 25000, 1900: 100000, 1939: 90000, 1948: 25000,
      1970: 30000, 2000: 28000, 2024: 30000,
    },
  },
  // ── United Kingdom ────────────────────────────────────────────────────────────
  {
    id: 'london',
    name: 'London',
    lat: 51.5,
    lng: -0.12,
    culturalType: 'Ashkenazi',
    significance: 'Jews expelled 1290, readmitted 1656; Balfour Declaration signed here in 1917.',
    populations: {
      70: 0, 200: 500, 500: 500, 700: 0, 1000: 3000,
      1170: 4000, 1300: 0, 1492: 0, 1550: 1000, 1650: 5000,
      1800: 20000, 1850: 65000, 1900: 200000, 1939: 330000, 1948: 280000,
      1970: 290000, 2000: 270000, 2024: 250000,
    },
  },
  // ── Americas ──────────────────────────────────────────────────────────────────
  {
    id: 'new-york',
    name: 'New York City',
    lat: 40.71,
    lng: -74.0,
    culturalType: 'Ashkenazi',
    significance: 'Largest Jewish diaspora city in history; hub of Yiddish culture, Zionism, and American Judaism.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 0, 1492: 0, 1550: 0, 1650: 0,
      1800: 5000, 1850: 35000, 1900: 600000, 1939: 1800000, 1948: 2000000,
      1970: 1900000, 2000: 1600000, 2024: 1400000,
    },
  },
  {
    id: 'chicago',
    name: 'Chicago',
    lat: 41.88,
    lng: -87.63,
    culturalType: 'Ashkenazi',
    significance: 'Second-largest American Jewish city; center of Conservative Judaism and labor Zionism.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 0, 1492: 0, 1550: 0, 1650: 0,
      1800: 0, 1850: 5000, 1900: 80000, 1939: 350000, 1948: 350000,
      1970: 300000, 2000: 260000, 2024: 220000,
    },
  },
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    lat: 34.05,
    lng: -118.24,
    culturalType: 'Mixed',
    significance: 'Major postwar Jewish center; large Sephardic, Israeli, and Iranian communities.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 0, 1492: 0, 1550: 0, 1650: 0,
      1800: 0, 1850: 0, 1900: 5000, 1939: 100000, 1948: 180000,
      1970: 450000, 2000: 600000, 2024: 650000,
    },
  },
  {
    id: 'buenos-aires',
    name: 'Buenos Aires',
    lat: -34.6,
    lng: -58.38,
    culturalType: 'Mixed',
    significance: 'Largest Latin American Jewish community; refuge for European Jews fleeing pogroms and the Holocaust.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 0, 1492: 0, 1550: 0, 1650: 0,
      1800: 0, 1850: 2000, 1900: 50000, 1939: 200000, 1948: 260000,
      1970: 310000, 2000: 250000, 2024: 200000,
    },
  },
  // ── India ────────────────────────────────────────────────────────────────────
  {
    id: 'cochin',
    name: 'Cochin (India)',
    lat: 9.93,
    lng: 76.27,
    culturalType: 'Mizrahi',
    significance: 'Ancient Jewish community traditionally dating to the time of King Solomon.',
    populations: {
      70: 2000, 200: 3000, 500: 5000, 700: 7000, 1000: 8000,
      1170: 8000, 1300: 8000, 1492: 8000, 1550: 8000, 1650: 7000,
      1800: 6000, 1850: 5000, 1900: 5000, 1939: 5000, 1948: 3000,
      1970: 1000, 2000: 50, 2024: 30,
    },
  },
  // ── Ethiopia ─────────────────────────────────────────────────────────────────
  {
    id: 'gondar',
    name: 'Gondar (Ethiopia)',
    lat: 12.6,
    lng: 37.47,
    culturalType: 'Ethiopian',
    significance: 'Center of the Beta Israel (Falasha) — ancient Jewish community practicing Torah-based faith. Airlifted to Israel 1984–1991.',
    populations: {
      70: 0, 200: 0, 500: 5000, 700: 10000, 1000: 15000,
      1170: 20000, 1300: 25000, 1492: 25000, 1550: 22000, 1650: 20000,
      1800: 15000, 1850: 15000, 1900: 50000, 1939: 65000, 1948: 60000,
      1970: 50000, 2000: 8000, 2024: 2000,
    },
  },
  // ── China (Kaifeng) ───────────────────────────────────────────────────────────
  {
    id: 'kaifeng',
    name: 'Kaifeng (China)',
    lat: 34.8,
    lng: 114.35,
    culturalType: 'Mizrahi',
    significance: 'Remote Jewish community established by Silk Road merchants; largely assimilated by 19th century.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 1000, 1300: 3000, 1492: 3000, 1550: 2500, 1650: 2000,
      1800: 1000, 1850: 500, 1900: 200, 1939: 100, 1948: 0,
      1970: 0, 2000: 0, 2024: 0,
    },
  },
  // ── South Africa ─────────────────────────────────────────────────────────────
  {
    id: 'johannesburg',
    name: 'Johannesburg',
    lat: -26.2,
    lng: 28.04,
    culturalType: 'Ashkenazi',
    significance: 'Largest Jewish community in Africa; largely Lithuanian origin (Litvaks).',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 0, 1492: 0, 1550: 0, 1650: 0,
      1800: 0, 1850: 0, 1900: 15000, 1939: 90000, 1948: 110000,
      1970: 120000, 2000: 80000, 2024: 55000,
    },
  },
  // ── Australia ─────────────────────────────────────────────────────────────────
  {
    id: 'sydney',
    name: 'Sydney / Melbourne',
    lat: -33.87,
    lng: 151.21,
    culturalType: 'Mixed',
    significance: 'Thriving postwar diaspora; absorbed large Holocaust survivor community.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 0, 1492: 0, 1550: 0, 1650: 0,
      1800: 0, 1850: 3000, 1900: 18000, 1939: 30000, 1948: 50000,
      1970: 80000, 2000: 100000, 2024: 120000,
    },
  },
  // ── Canada ────────────────────────────────────────────────────────────────────
  {
    id: 'montreal',
    name: 'Montréal / Toronto',
    lat: 45.5,
    lng: -73.57,
    culturalType: 'Ashkenazi',
    significance: 'Canada\'s main Jewish centers; Montréal was early, Toronto surged postwar.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 0, 1492: 0, 1550: 0, 1650: 0,
      1800: 0, 1850: 2000, 1900: 30000, 1939: 170000, 1948: 200000,
      1970: 305000, 2000: 375000, 2024: 400000,
    },
  },

  // ── Hungary ──────────────────────────────────────────────────────────────────
  {
    id: 'budapest',
    name: 'Budapest (Hungary)',
    lat: 47.5,
    lng: 19.05,
    culturalType: 'Ashkenazi',
    significance: 'Hungary\'s Jews, emancipated in 1867, built a brilliant bourgeois culture; 565,000 were deported and killed in 1944 — the last and fastest mass deportation of the Holocaust.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 5000,
      1170: 8000, 1300: 12000, 1492: 10000, 1550: 15000, 1650: 20000,
      1800: 80000, 1850: 250000, 1900: 700000, 1939: 825000, 1948: 260000,
      1970: 100000, 2000: 54000, 2024: 45000,
    },
  },

  // ── Austria / Vienna ─────────────────────────────────────────────────────────
  {
    id: 'vienna',
    name: 'Vienna',
    lat: 48.21,
    lng: 16.37,
    culturalType: 'Ashkenazi',
    significance: 'Habsburg capital and crossroads of Ashkenazi culture; Herzl, Freud, and Mahler lived here. After the 1938 Anschluss, 185,000 Jews were stripped of rights and forced to flee or face deportation.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 2000, 1492: 1000, 1550: 3000, 1650: 5000,
      1800: 15000, 1850: 50000, 1900: 175000, 1939: 91000, 1948: 7000,
      1970: 10000, 2000: 12000, 2024: 15000,
    },
  },

  // ── Bohemia / Czech ───────────────────────────────────────────────────────────
  {
    id: 'prague',
    name: 'Prague (Bohemia–Moravia)',
    lat: 50.08,
    lng: 14.44,
    culturalType: 'Ashkenazi',
    significance: 'Home of the Maharal and the Golem legend; Josefov (Jewish Quarter) is one of Europe\'s oldest; Kafka and Werfel were Praguers. Most Czech Jews perished in Theresienstadt and Auschwitz.',
    populations: {
      70: 0, 200: 0, 500: 1000, 700: 2000, 1000: 5000,
      1170: 8000, 1300: 10000, 1492: 8000, 1550: 12000, 1650: 15000,
      1800: 20000, 1850: 35000, 1900: 90000, 1939: 118000, 1948: 44000,
      1970: 15000, 2000: 10000, 2024: 10000,
    },
  },

  // ── Berlin / Germany ─────────────────────────────────────────────────────────
  {
    id: 'berlin',
    name: 'Berlin',
    lat: 52.52,
    lng: 13.4,
    culturalType: 'Ashkenazi',
    significance: 'Capital of the Haskalah (Jewish Enlightenment); Moses Mendelssohn\'s city. Grew to 160,000 Jews by 1933, most of whom fled or were murdered. Now a surprising new hub for Israeli and Russian Jewish immigrants.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 0, 1492: 0, 1550: 1000, 1650: 2000,
      1800: 10000, 1850: 28000, 1900: 100000, 1939: 75000, 1948: 7000,
      1970: 6000, 2000: 25000, 2024: 45000,
    },
  },

  // ── Łódź / Poland ────────────────────────────────────────────────────────────
  {
    id: 'lodz',
    name: 'Łódź (Poland)',
    lat: 51.77,
    lng: 19.46,
    culturalType: 'Ashkenazi',
    significance: 'Second-largest Jewish city in Europe by 1939; the textile industry capital drew hundreds of thousands. The Łódź Ghetto held 200,000 Jews — its last 70,000 were deported to Auschwitz-Birkenau in 1944.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 0, 1492: 0, 1550: 0, 1650: 0,
      1800: 12000, 1850: 50000, 1900: 170000, 1939: 250000, 1948: 5000,
      1970: 10000, 2000: 1000, 2024: 500,
    },
  },

  // ── Lwów / Lviv ──────────────────────────────────────────────────────────────
  {
    id: 'lwow',
    name: 'Lwów / Lviv (Galicia)',
    lat: 49.84,
    lng: 24.03,
    culturalType: 'Ashkenazi',
    significance: 'Capital of Galicia and a great center of Hasidism, Zionism, and Hebrew literature. 110,000 Jews were systematically murdered in the Janowska camp and mass shootings of 1941–44.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 2000, 1492: 3000, 1550: 8000, 1650: 15000,
      1800: 20000, 1850: 40000, 1900: 55000, 1939: 110000, 1948: 2000,
      1970: 2000, 2000: 1500, 2024: 1000,
    },
  },

  // ── Białystok ────────────────────────────────────────────────────────────────
  {
    id: 'bialystok',
    name: 'Białystok (Poland)',
    lat: 53.13,
    lng: 23.16,
    culturalType: 'Ashkenazi',
    significance: 'Major textile center where Jews were 50% of the population; the 1906 pogrom shocked the world. The ghetto\'s 50,000 Jews were deported to Treblinka in 1943.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 0, 1492: 0, 1550: 0, 1650: 0,
      1800: 5000, 1850: 20000, 1900: 50000, 1939: 50000, 1948: 1200,
      1970: 500, 2000: 200, 2024: 100,
    },
  },

  // ── Riga / Latvia ────────────────────────────────────────────────────────────
  {
    id: 'riga',
    name: 'Riga (Latvia)',
    lat: 56.95,
    lng: 24.11,
    culturalType: 'Ashkenazi',
    significance: 'Capital of Baltic Jewish life; 95,000 Latvian Jews — including almost all of Riga\'s community — were murdered in the Rumbula and Bikernieki forests in late 1941.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 0, 1492: 0, 1550: 0, 1650: 2000,
      1800: 12000, 1850: 30000, 1900: 70000, 1939: 95000, 1948: 7000,
      1970: 40000, 2000: 12000, 2024: 7000,
    },
  },

  // ── Chernivtsi / Czernowitz ───────────────────────────────────────────────────
  {
    id: 'chernivtsi',
    name: 'Chernivtsi (Czernowitz)',
    lat: 48.29,
    lng: 25.94,
    culturalType: 'Ashkenazi',
    significance: 'The "Vienna of the East" and capital of German-language Jewish literature; birthplace of poet Paul Celan. Jews were half the city\'s population. Romanian occupation killed tens of thousands; survivors were deported to Transnistria.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 0, 1492: 0, 1550: 0, 1650: 0,
      1800: 10000, 1850: 25000, 1900: 35000, 1939: 55000, 1948: 15000,
      1970: 25000, 2000: 3000, 2024: 1500,
    },
  },

  // ── Romania / Bucharest ──────────────────────────────────────────────────────
  {
    id: 'bucharest',
    name: 'Bucharest (Romania)',
    lat: 44.43,
    lng: 26.1,
    culturalType: 'Ashkenazi',
    significance: 'Romania harbored the third-largest Jewish population in Europe. Romanian forces murdered 280,000 Jews in Moldova and Transnistria; Transylvanian Jews were killed by Hungary. Postwar Romania uniquely sold emigration visas to Israel.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 0, 1492: 5000, 1550: 10000, 1650: 20000,
      1800: 60000, 1850: 200000, 1900: 500000, 1939: 760000, 1948: 430000,
      1970: 100000, 2000: 15000, 2024: 10000,
    },
  },

  // ── Bulgaria / Sofia ─────────────────────────────────────────────────────────
  {
    id: 'sofia',
    name: 'Sofia (Bulgaria)',
    lat: 42.7,
    lng: 23.32,
    culturalType: 'Sephardic',
    significance: 'Descendants of 1492 Spanish exiles welcomed by Suleiman the Magnificent. In a rare act of resistance, the Bulgarian Orthodox Church, parliament, and public refused to allow deportation of Bulgarian Jews — 50,000 were saved.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 0, 1492: 5000, 1550: 10000, 1650: 15000,
      1800: 15000, 1850: 20000, 1900: 40000, 1939: 50000, 1948: 44000,
      1970: 5000, 2000: 2500, 2024: 2000,
    },
  },

  // ── Yugoslavia / Belgrade ────────────────────────────────────────────────────
  {
    id: 'belgrade',
    name: 'Belgrade (Yugoslavia)',
    lat: 44.82,
    lng: 20.46,
    culturalType: 'Sephardic',
    significance: 'Sephardic community descended from 1492 exiles; Yugoslavia\'s Jews were 80% killed by Nazi-allied Ustasha in Croatia and German forces in Serbia — one of the highest percentage losses in Europe.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 0, 1492: 2000, 1550: 5000, 1650: 8000,
      1800: 10000, 1850: 15000, 1900: 25000, 1939: 70000, 1948: 12000,
      1970: 7000, 2000: 3000, 2024: 2000,
    },
  },

  // ── Hamburg ──────────────────────────────────────────────────────────────────
  {
    id: 'hamburg',
    name: 'Hamburg',
    lat: 53.55,
    lng: 10.0,
    culturalType: 'Sephardic',
    significance: 'Germany\'s great port and earliest site of Sephardic settlement; Portuguese converso merchants arrived in 1590. The city\'s Jews were major figures in the Hamburg Stock Exchange and the Reform movement.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 0, 1492: 0, 1550: 0, 1650: 2000,
      1800: 8000, 1850: 15000, 1900: 18000, 1939: 14000, 1948: 2000,
      1970: 3000, 2000: 10000, 2024: 8000,
    },
  },

  // ── Syria / Aleppo ───────────────────────────────────────────────────────────
  {
    id: 'aleppo',
    name: 'Aleppo (Syria)',
    lat: 36.2,
    lng: 37.16,
    culturalType: 'Mizrahi',
    significance: 'One of the great ancient Jewish cities; home of the Aleppo Codex (Keter Aram Tzova), the most authoritative Hebrew manuscript. The community absorbed 1492 Sephardic exiles and maintained distinct minhagim into the 20th century.',
    populations: {
      70: 5000, 200: 8000, 500: 10000, 700: 12000, 1000: 12000,
      1170: 12000, 1300: 10000, 1492: 15000, 1550: 15000, 1650: 12000,
      1800: 10000, 1850: 12000, 1900: 12000, 1939: 12000, 1948: 8000,
      1970: 2000, 2000: 200, 2024: 0,
    },
  },

  // ── Syria / Damascus ─────────────────────────────────────────────────────────
  {
    id: 'damascus',
    name: 'Damascus (Syria)',
    lat: 33.51,
    lng: 36.29,
    culturalType: 'Mizrahi',
    significance: 'Ancient community with roots in the First Temple period; center of the Damascus Rite liturgy. The 1840 Damascus Affair (blood libel) was the first modern international human-rights campaign on behalf of Jews.',
    populations: {
      70: 10000, 200: 12000, 500: 10000, 700: 10000, 1000: 10000,
      1170: 10000, 1300: 8000, 1492: 12000, 1550: 12000, 1650: 10000,
      1800: 8000, 1850: 10000, 1900: 15000, 1939: 30000, 1948: 20000,
      1970: 5000, 2000: 500, 2024: 0,
    },
  },

  // ── Algeria / Algiers ────────────────────────────────────────────────────────
  {
    id: 'algiers',
    name: 'Algiers (Algeria)',
    lat: 36.74,
    lng: 3.06,
    culturalType: 'Sephardic',
    significance: 'Ancient North African community; the 1870 Crémieux Decree made Algerian Jews French citizens, uniquely assimilating them into French culture. Almost the entire community of 130,000 emigrated to France after Algerian independence in 1962.',
    populations: {
      70: 5000, 200: 10000, 500: 15000, 700: 20000, 1000: 25000,
      1170: 30000, 1300: 35000, 1492: 40000, 1550: 50000, 1650: 55000,
      1800: 70000, 1850: 80000, 1900: 100000, 1939: 130000, 1948: 140000,
      1970: 10000, 2000: 500, 2024: 100,
    },
  },

  // ── Djerba / Tunisia ─────────────────────────────────────────────────────────
  {
    id: 'djerba',
    name: 'Djerba (Tunisia)',
    lat: 33.87,
    lng: 10.85,
    culturalType: 'Sephardic',
    significance: 'Island community claiming descent from priests who fled Jerusalem in 586 BCE; the El Ghriba synagogue is among the oldest in the world. The annual Lag B\'Omer pilgrimage still draws thousands of Jewish visitors.',
    populations: {
      70: 2000, 200: 3000, 500: 4000, 700: 4000, 1000: 5000,
      1170: 5000, 1300: 6000, 1492: 7000, 1550: 7000, 1650: 7000,
      1800: 8000, 1850: 10000, 1900: 12000, 1939: 12000, 1948: 12000,
      1970: 8000, 2000: 1500, 2024: 1200,
    },
  },

  // ── Bukhara / Uzbekistan ─────────────────────────────────────────────────────
  {
    id: 'bukhara',
    name: 'Bukhara (Central Asia)',
    lat: 39.77,
    lng: 64.42,
    culturalType: 'Mizrahi',
    significance: 'Ancient Silk Road community speaking Judeo-Tajik (Bukhori); maintained distinct liturgy and traditions for two millennia under Persian, Arab, Mongol, and Russian rule. Most emigrated to Israel and Queens, New York after 1991.',
    populations: {
      70: 5000, 200: 8000, 500: 10000, 700: 15000, 1000: 18000,
      1170: 20000, 1300: 18000, 1492: 15000, 1550: 15000, 1650: 12000,
      1800: 10000, 1850: 12000, 1900: 15000, 1939: 20000, 1948: 22000,
      1970: 40000, 2000: 10000, 2024: 3000,
    },
  },

  // ── Georgia / Tbilisi ────────────────────────────────────────────────────────
  {
    id: 'tbilisi',
    name: 'Tbilisi (Georgia)',
    lat: 41.69,
    lng: 44.83,
    culturalType: 'Mizrahi',
    significance: 'Georgian Jews are among the most ancient diaspora communities, with 2,600 years of continuous settlement. They maintained a unique Georgian-language liturgy and were largely unaffected by both medieval persecutions and the Holocaust.',
    populations: {
      70: 10000, 200: 12000, 500: 20000, 700: 25000, 1000: 25000,
      1170: 22000, 1300: 20000, 1492: 18000, 1550: 18000, 1650: 18000,
      1800: 22000, 1850: 35000, 1900: 55000, 1939: 65000, 1948: 65000,
      1970: 85000, 2000: 8000, 2024: 6000,
    },
  },

  // ── Philadelphia ─────────────────────────────────────────────────────────────
  {
    id: 'philadelphia',
    name: 'Philadelphia',
    lat: 39.95,
    lng: -75.17,
    culturalType: 'Ashkenazi',
    significance: 'One of America\'s oldest Jewish communities (Congregation Mikveh Israel, 1740); major center of Jewish publication, religious leadership, and later, immigrant absorption from Eastern Europe.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 0, 1492: 0, 1550: 0, 1650: 0,
      1800: 2500, 1850: 8000, 1900: 75000, 1939: 270000, 1948: 300000,
      1970: 350000, 2000: 270000, 2024: 240000,
    },
  },

  // ── Miami / South Florida ────────────────────────────────────────────────────
  {
    id: 'miami',
    name: 'Miami / South Florida',
    lat: 25.77,
    lng: -80.19,
    culturalType: 'Mixed',
    significance: 'Transformed after WWII from a resort town into the third-largest American Jewish community; home to large Cuban-Sephardic, Israeli, and South American Jewish populations.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 0, 1492: 0, 1550: 0, 1650: 0,
      1800: 0, 1850: 0, 1900: 1000, 1939: 8000, 1948: 25000,
      1970: 150000, 2000: 350000, 2024: 400000,
    },
  },

  // ── São Paulo / Brazil ───────────────────────────────────────────────────────
  {
    id: 'sao-paulo',
    name: 'São Paulo (Brazil)',
    lat: -23.55,
    lng: -46.63,
    culturalType: 'Mixed',
    significance: 'Brazil hosts the largest Jewish community in Latin America; Syrian (Aleppo) and Eastern European Jews built the community. São Paulo\'s Higienópolis neighborhood was known as "Higienolândia" for its Jewish character.',
    populations: {
      70: 0, 200: 0, 500: 0, 700: 0, 1000: 0,
      1170: 0, 1300: 0, 1492: 0, 1550: 0, 1650: 0,
      1800: 0, 1850: 1000, 1900: 5000, 1939: 80000, 1948: 100000,
      1970: 150000, 2000: 130000, 2024: 120000,
    },
  },

  // ── Beer Sheva / Negev ────────────────────────────────────────────────────────
  {
    id: 'beer-sheva',
    name: 'Beer Sheva (Negev)',
    lat: 31.25,
    lng: 34.79,
    culturalType: 'Mixed',
    significance: 'Abraham\'s city in Genesis; refounded as a modern city in 1948 and transformed by mass immigration from North Africa, the Soviet Union, and Ethiopia into a major Israeli metropolis and technology hub.',
    populations: {
      70: 2000, 200: 1000, 500: 500, 700: 500, 1000: 0,
      1170: 0, 1300: 0, 1492: 0, 1550: 0, 1650: 0,
      1800: 0, 1850: 0, 1900: 0, 1939: 3000, 1948: 5000,
      1970: 90000, 2000: 160000, 2024: 210000,
    },
  },
];
