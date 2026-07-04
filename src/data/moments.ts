// Dated "moments" that ping on the story map as the years pass — births,
// books, massacres, foundings. Each appears at its real location when the
// scroll-year approaches it.

export interface Moment {
  year: number;
  lat: number;
  lng: number;
  label: string;
  kind: 'light' | 'dark'; // celebration vs catastrophe — tints the ping
}

export const MOMENTS: Moment[] = [
  { year: 70, lat: 31.78, lng: 35.22, label: 'The Second Temple is destroyed by Rome', kind: 'dark' },
  { year: 73, lat: 31.31, lng: 35.35, label: 'Masada falls — the last stronghold', kind: 'dark' },
  { year: 135, lat: 31.7, lng: 35.1, label: 'Bar Kokhba revolt crushed; Judaea renamed Syria Palaestina', kind: 'dark' },
  { year: 200, lat: 32.75, lng: 35.33, label: 'The Mishnah is compiled in Galilee (c. 200)', kind: 'light' },
  { year: 358, lat: 32.8, lng: 35.0, label: 'The fixed Hebrew calendar is instituted (traditional date)', kind: 'light' },
  { year: 500, lat: 32.5, lng: 44.4, label: 'The Babylonian Talmud takes final shape (c. 500)', kind: 'light' },
  { year: 589, lat: 31.9, lng: 44.4, label: 'The age of the Geonim begins at Sura and Pumbedita', kind: 'light' },
  { year: 740, lat: 46.0, lng: 47.0, label: 'The Khazar elite adopts Judaism (traditional account, c. 740)', kind: 'light' },
  { year: 882, lat: 30.0, lng: 31.2, label: 'Saadia Gaon, philosopher and translator, born in Egypt', kind: 'light' },
  { year: 950, lat: 37.88, lng: -4.78, label: 'Hasdai ibn Shaprut serves the Caliph of Córdoba (c. 950)', kind: 'light' },
  { year: 1008, lat: 30.05, lng: 31.25, label: 'The Leningrad Codex — oldest complete Hebrew Bible — is finished', kind: 'light' },
  { year: 1040, lat: 48.3, lng: 4.08, label: 'Rashi, prince of commentators, born in Troyes', kind: 'light' },
  { year: 1066, lat: 37.18, lng: -3.6, label: 'Massacre of the Jews of Granada', kind: 'dark' },
  { year: 1096, lat: 49.63, lng: 8.36, label: 'First Crusade: the Rhineland communities are massacred', kind: 'dark' },
  { year: 1135, lat: 37.88, lng: -4.78, label: 'Maimonides born in Córdoba (c. 1135)', kind: 'light' },
  { year: 1144, lat: 52.63, lng: 1.3, label: 'Norwich: the first blood libel', kind: 'dark' },
  { year: 1242, lat: 48.85, lng: 2.35, label: 'Cartloads of the Talmud are burned in Paris', kind: 'dark' },
  { year: 1290, lat: 51.51, lng: -0.13, label: 'England expels its Jews', kind: 'dark' },
  { year: 1348, lat: 47.56, lng: 7.59, label: 'Black Death pogroms sweep the Rhineland and beyond', kind: 'dark' },
  { year: 1394, lat: 48.85, lng: 2.35, label: 'France expels its Jews — finally and completely', kind: 'dark' },
  { year: 1492, lat: 37.18, lng: -3.6, label: 'The Alhambra Decree: Spain expels its Jews', kind: 'dark' },
  { year: 1497, lat: 38.72, lng: -9.14, label: 'Portugal forcibly converts its Jews', kind: 'dark' },
  { year: 1516, lat: 45.44, lng: 12.33, label: 'Venice walls in the world’s first ghetto', kind: 'dark' },
  { year: 1565, lat: 45.44, lng: 12.33, label: 'The Shulchan Aruch, written in Safed, is published in Venice', kind: 'light' },
  { year: 1580, lat: 51.25, lng: 22.57, label: 'The Council of Four Lands convenes in Lublin', kind: 'light' },
  { year: 1648, lat: 49.4, lng: 32.06, label: 'The Khmelnytsky massacres devastate Ukraine’s communities', kind: 'dark' },
  { year: 1654, lat: 40.7, lng: -74.01, label: 'Twenty-three refugees land in New Amsterdam — the first Jews of North America', kind: 'light' },
  { year: 1740, lat: 49.44, lng: 27.41, label: 'The Baal Shem Tov founds Hasidism in Medzhybizh (c. 1740)', kind: 'light' },
  { year: 1791, lat: 48.85, lng: 2.35, label: 'Revolutionary France grants Jews full citizenship — a European first', kind: 'light' },
  { year: 1807, lat: 48.85, lng: 2.35, label: 'Napoleon convenes the Grand Sanhedrin', kind: 'light' },
  { year: 1860, lat: 31.77, lng: 35.22, label: 'Jerusalem grows beyond its ancient walls', kind: 'light' },
  { year: 1881, lat: 46.48, lng: 30.73, label: 'Pogroms erupt across the Russian Empire; the great flight begins', kind: 'dark' },
  { year: 1897, lat: 47.56, lng: 7.59, label: 'Herzl convenes the First Zionist Congress in Basel', kind: 'light' },
  { year: 1903, lat: 47.03, lng: 28.83, label: 'The Kishinev pogrom shocks the world', kind: 'dark' },
  { year: 1909, lat: 32.08, lng: 34.78, label: 'Sixty families found Tel Aviv on empty dunes', kind: 'light' },
  { year: 1917, lat: 51.51, lng: -0.13, label: 'The Balfour Declaration promises a Jewish national home', kind: 'light' },
  { year: 1938, lat: 52.52, lng: 13.4, label: 'Kristallnacht: synagogues burn across Germany', kind: 'dark' },
  { year: 1943, lat: 52.24, lng: 21.0, label: 'The Warsaw Ghetto rises', kind: 'dark' },
  { year: 1948, lat: 32.08, lng: 34.78, label: 'Ben-Gurion proclaims the State of Israel', kind: 'light' },
  { year: 1950, lat: 15.37, lng: 44.19, label: 'Operation Magic Carpet airlifts Yemen’s Jews home', kind: 'light' },
  { year: 1967, lat: 31.78, lng: 35.23, label: 'Israeli paratroopers reach the Western Wall', kind: 'light' },
  { year: 1991, lat: 9.03, lng: 38.74, label: 'Operation Solomon: 14,000 Ethiopian Jews airlifted in 36 hours', kind: 'light' },
  { year: 1995, lat: 55.75, lng: 37.62, label: 'A million Jews leave the former Soviet Union for Israel', kind: 'light' },
];
