import type { Epoch } from './types';

export const EPOCHS: Epoch[] = [
  {
    name: 'Roman Diaspora',
    startYear: 70,
    endYear: 399,
    color: '#c0392b',
    description: 'Destruction of the Second Temple scatters Jewish communities across the Roman Empire and beyond.',
    longDescription: 'The Roman legions\' destruction of Jerusalem\'s Second Temple in 70 CE ended two thousand years of Temple-based Judaism in a single catastrophic campaign. General Titus marched over a million Jewish captives through Rome in a triumph whose arch still stands today. Jewish communities already existed from Spain to Babylonia — now they would be the primary centers of a religion reinventing itself around text and prayer rather than sacrifice. The great rabbis, led by Yohanan ben Zakkai, rebuilt Judaism at Yavneh by codifying oral law into what would become the Mishnah. By the end of this era, Jews in Babylonia under Parthian rule were actually more numerous and more prosperous than those still living in Roman Palestine.',
    keyEvents: [
      { year: 70, label: 'Titus destroys Jerusalem and the Second Temple; 97,000 captives enslaved' },
      { year: 73, label: 'Masada falls; last Jewish military resistance ends' },
      { year: 100, label: 'Yohanan ben Zakkai founds rabbinic academy at Yavneh; Judaism reorganizes without Temple' },
      { year: 132, label: 'Bar Kokhba revolt — last major Jewish uprising against Rome' },
      { year: 135, label: 'Hadrian crushes revolt; renames Judea "Syria Palaestina," bans Jews from Jerusalem' },
      { year: 200, label: 'Rabbi Judah HaNasi compiles the Mishnah, fixing the Oral Torah in writing' },
    ],
    sources: [
      'Josephus, *The Jewish War*, c. 75 CE',
      'Schäfer, Peter, *The History of the Jews in the Greco-Roman World*, 2003',
      'Cohen, Shaye J.D., *From the Maccabees to the Mishnah*, 1987',
    ],
  },
  {
    name: 'Geonic Era',
    startYear: 400,
    endYear: 999,
    color: '#d4a017',
    description: 'Babylonian academies (yeshivot) flourish under Sasanian and later Islamic rule. The Geonim lead world Jewry.',
    longDescription: 'For six centuries, the great academies of Sura and Pumbedita in Babylonia served as the undisputed intellectual and spiritual capital of world Jewry. Their leaders, the Geonim (from the Hebrew for "eminences"), issued thousands of legal responsa that shaped Jewish practice from Spain to India. Under Sasanian Persian rule, Jews enjoyed relative autonomy governed by the Exilarch (Resh Galuta), a hereditary prince claiming descent from King David. The Arab conquests of the 7th century initially changed little — the Abbasid caliphate, ruling from nearby Baghdad, proved broadly tolerant and even employed Jewish scholars at court. The Babylonian Talmud, compiled and edited during this period, became the definitive guide to Jewish law for all future generations, superseding even the Jerusalem Talmud.',
    keyEvents: [
      { year: 500, label: 'Babylonian Talmud reaches its final edited form at Sura academy' },
      { year: 589, label: 'Khosrow II of Persia grants Jews expanded rights; Babylonian Jewry peaks at ~800,000' },
      { year: 638, label: 'Arab conquest of Mesopotamia; Abbasid tolerance keeps academies thriving' },
      { year: 762, label: 'Anan ben David founds Karaite movement, rejecting rabbinic authority — a major schism' },
      { year: 882, label: 'Saadia Gaon born; his *Emunot ve-Deot* pioneers Jewish rationalist philosophy' },
      { year: 960, label: 'Hai Gaon becomes last great Gaon; soon after, Babylonian supremacy begins to wane' },
    ],
    sources: [
      'Brody, Robert, *The Geonim of Babylonia and the Shaping of Medieval Jewish Culture*, 1998',
      'Gil, Moshe, *Jews in Islamic Countries in the Middle Ages*, 2004',
      'Neusner, Jacob, *A History of the Jews in Babylonia*, 5 vols., 1965–1970',
    ],
  },
  {
    name: 'Golden Age of Spain',
    startYear: 1000,
    endYear: 1148,
    color: '#f39c12',
    description: 'Umayyad Iberia witnesses an extraordinary flowering of Jewish philosophy, poetry, science, and culture.',
    longDescription: 'The Umayyad caliphate of Córdoba created a unique convivencia — a coexistence of Muslim, Christian, and Jewish scholars — that produced one of the most dazzling intellectual flowerings in human history. Jewish courtiers rose to the highest levels of government: Samuel ibn Naghrillah served as vizier and military commander of Granada; his son Joseph succeeded him. Poets like Judah Halevi composed Hebrew verse of heartbreaking beauty, while thinkers like Solomon ibn Gabirol (Avicebron) wrote philosophy that influenced both Islamic and scholastic Christian thought. Medicine, astronomy, and mathematics flowed freely across religious lines. The great Maimonides, though born as this golden age collapsed, was its direct intellectual heir. The period ended violently when the Almohad dynasty invaded from Morocco in 1148 — fanatically intolerant, they forced Jews to convert, flee, or die.',
    keyEvents: [
      { year: 1013, label: 'Samuel ibn Naghrillah becomes vizier of Granada — peak of Jewish political power in Islamic Spain' },
      { year: 1058, label: 'Judah Halevi born in Tudela; will write the *Kuzari* and the greatest Hebrew poetry of the age' },
      { year: 1085, label: 'Christian reconquest of Toledo; some Jews shift northward under Christian kings' },
      { year: 1110, label: 'Abraham ibn Ezra born; travels Europe spreading Spanish-Jewish learning' },
      { year: 1135, label: 'Maimonides (Moses ben Maimon) born in Córdoba' },
      { year: 1148, label: 'Almohad invasion; mass forced conversions and exile end the Golden Age' },
    ],
    sources: [
      'Menocal, Maria Rosa, *The Ornament of the World*, 2002',
      'Ashtor, Eliyahu, *The Jews of Moslem Spain*, 3 vols., 1973–1984',
      'Cole, Peter (ed.), *The Dream of the Poem: Hebrew Poetry from Muslim and Christian Spain*, 2007',
    ],
  },
  {
    name: 'Era of Expulsions',
    startYear: 1149,
    endYear: 1549,
    color: '#e74c3c',
    description: 'Crusades, the Black Death, and rising Christian nationalism drive waves of expulsions across Western Europe.',
    longDescription: 'Four centuries of escalating persecution systematically dismantled the Jewish communities of Western Europe. The Crusades, beginning in 1096, turned crowds of holy warriors against Jewish communities in the Rhineland before they ever reached the Holy Land. Jews were expelled from England in 1290, France in 1306 and 1394, and countless German cities repeatedly between the 13th and 15th centuries. The Black Death of 1348–1351 triggered continent-wide massacres — Jews were accused of poisoning wells, and entire communities were murdered. The worst came in 1492, when Ferdinand and Isabella expelled all 200,000 Jews from Spain with 90 days\' notice. Portugal followed in 1497. The refugees — Sephardic Jews (from the Hebrew for "Spain") — flooded into the Ottoman Empire, North Africa, the Netherlands, and Italy, carrying Spanish-Jewish culture intact to new homes across the Mediterranean.',
    keyEvents: [
      { year: 1096, label: 'First Crusade; Rhineland massacres destroy communities at Worms, Mainz, and Cologne' },
      { year: 1290, label: 'Edward I expels all ~16,000 Jews from England' },
      { year: 1306, label: 'Philip IV expels Jews from France; 100,000 forced out' },
      { year: 1348, label: 'Black Death: Jews across Europe massacred on false charges of well-poisoning' },
      { year: 1478, label: 'Spanish Inquisition established; targets Jewish converts (*conversos*) for heresy' },
      { year: 1492, label: 'Alhambra Decree: ~200,000 Jews expelled from Spain within 90 days' },
    ],
    sources: [
      'Chazan, Robert, *European Jewry and the First Crusade*, 1987',
      'Netanyahu, Benzion, *The Origins of the Inquisition in Fifteenth Century Spain*, 1995',
      'Beinart, Haim, *The Expulsion of the Jews from Spain*, 2002',
    ],
  },
  {
    name: 'Polish–Ottoman Axis',
    startYear: 1550,
    endYear: 1788,
    color: '#8e44ad',
    description: 'Poland-Lithuania and the Ottoman Empire become twin centers of Jewish life, each harboring hundreds of thousands.',
    longDescription: 'After the expulsions from Western Europe, two great powers welcomed Jewish refugees and created the twin pillars of early modern Jewish civilization. The Polish-Lithuanian Commonwealth, governed by a unique nobility-republic (the Szlachta), gave Jews legal protections, autonomy, and economic roles as trade intermediaries — by 1650, Poland housed over half of world Jewry. The Council of Four Lands (Va\'ad Arba Aratzot), a Jewish parliamentary body, governed Polish Jews with real legal authority. Meanwhile the Ottoman sultans, particularly Bayezid II, actively recruited Sephardic refugees, famously asking: "How can you call Ferdinand a wise king? He is impoverishing his country and enriching mine." Ottoman Jewish communities in Salonika, Istanbul, Safed, and Cairo thrived. Safed briefly became the world center of Jewish mysticism under the Kabbalists. This era ended in catastrophe for Polish Jewry: the Khmelnytsky Cossack uprising of 1648–1657 killed 100,000–500,000 Jews in eastern Poland — the greatest mass slaughter of Jews before the Holocaust.',
    keyEvents: [
      { year: 1567, label: 'Council of Four Lands established; Jewish self-governance in Poland at its peak' },
      { year: 1570, label: 'Isaac Luria (the Ari) in Safed creates Lurianic Kabbalah — Jewish mysticism transformed' },
      { year: 1648, label: 'Khmelnytsky Cossack massacres devastate Polish-Ukrainian Jewry; up to 500,000 killed' },
      { year: 1665, label: 'Sabbatai Zevi proclaimed Messiah in Smyrna; mass messianic movement sweeps world Jewry' },
      { year: 1666, label: 'Sabbatai Zevi converts to Islam under Ottoman pressure; movement shatters' },
      { year: 1700, label: 'Israel Ba\'al Shem Tov born; founds Hasidic movement that revives Polish Jewry' },
    ],
    sources: [
      'Weinryb, Bernard D., *The Jews of Poland*, 1973',
      'Shaw, Stanford, *The Jews of the Ottoman Empire and the Turkish Republic*, 1991',
      'Rosman, Moshe, *Founder of Hasidism: A Quest for the Historical Ba\'al Shem Tov*, 1996',
    ],
  },
  {
    name: 'Emancipation',
    startYear: 1789,
    endYear: 1879,
    color: '#2980b9',
    description: 'The French Revolution triggers a century-long struggle for legal equality in Western and Central Europe.',
    longDescription: 'The Enlightenment\'s ideas of universal rights crashed into centuries of Jewish exclusion and produced a century of transformation. France granted Jews full citizenship in 1791 — the first country in Europe to do so. Napoleon convened a Great Sanhedrin in 1807 to ask Jewish leaders whether Jewish law was compatible with French citizenship; the answer, carefully crafted, was yes. German Jews navigated the difficult bargain of the *Haskalah* (Jewish Enlightenment): secular education and German cultural integration in exchange for legal rights. Moses Mendelssohn translated the Torah into German and argued Jews could be both fully Jewish and fully German. Reform Judaism, born in Hamburg in 1810, modernized liturgy and theology to fit bourgeois German life. By 1871, unification gave German Jews full legal equality. Yet emancipation bred its own backlash: as Jews entered universities, professions, and public life, modern racial antisemitism emerged to replace the old religious anti-Judaism.',
    keyEvents: [
      { year: 1791, label: 'French National Assembly grants full citizenship to Jews — first in Europe' },
      { year: 1807, label: 'Napoleon\'s Sanhedrin: Jewish leaders declare loyalty to France compatible with Jewish law' },
      { year: 1810, label: 'Hamburg Temple founded; Reform Judaism movement begins, revolutionizing Jewish worship' },
      { year: 1829, label: 'Catholic Emancipation in Britain opens path for Jewish legal rights' },
      { year: 1858, label: 'Jews admitted to British Parliament; Lionel de Rothschild takes his seat' },
      { year: 1871, label: 'German unification; full legal emancipation for German Jews at last' },
    ],
    sources: [
      'Katz, Jacob, *Out of the Ghetto: The Social Background of Jewish Emancipation 1770–1870*, 1973',
      'Meyer, Michael A., *Response to Modernity: A History of the Reform Movement in Judaism*, 1988',
      'Sorkin, David, *The Transformation of German Jewry, 1780–1840*, 1987',
    ],
  },
  {
    name: 'Mass Migration',
    startYear: 1880,
    endYear: 1932,
    color: '#27ae60',
    description: 'Pogroms and poverty propel two million Jews from Eastern Europe to the Americas and Palestine.',
    longDescription: 'Czar Alexander II\'s assassination in 1881 unleashed a wave of pogroms across the Russian Pale of Settlement that triggered the largest Jewish migration in history. Over fifty years, more than two million Jews left the Pale — a region covering parts of today\'s Ukraine, Belarus, Poland, and Lithuania — for new lives in the Americas and Palestine. New York\'s Lower East Side became the world\'s largest Jewish city by 1910, its streets a cacophony of Yiddish, ambition, and labor organizing. The garment industry, the Bund, the Forverts newspaper, and Yiddish theater all flourished. At the same time, Zionist pioneers (the First, Second, and Third Aliyot) began draining swamps, founding kibbutzim, and reviving Hebrew as a spoken language in Ottoman and British Palestine. The era produced two visions of Jewish redemption: universal socialist brotherhood and national self-determination in the ancestral homeland.',
    keyEvents: [
      { year: 1881, label: 'Russian pogroms begin after Alexander II\'s assassination; mass emigration accelerates' },
      { year: 1882, label: 'First Aliyah to Palestine begins; Rishon LeZion and Petah Tikva founded' },
      { year: 1897, label: 'First Zionist Congress in Basel; Theodor Herzl founds the World Zionist Organization' },
      { year: 1903, label: 'Kishinev pogrom; 49 killed, hundreds injured — shocks world opinion' },
      { year: 1911, label: 'Triangle Shirtwaist fire kills 146 garment workers, mostly Jewish immigrant women; spurs labor movement' },
      { year: 1917, label: 'Balfour Declaration: Britain endorses "a national home for the Jewish people" in Palestine' },
    ],
    sources: [
      'Howe, Irving, *World of Our Fathers*, 1976',
      'Hertzberg, Arthur, *The Zionist Idea*, 1959',
      'Frankel, Jonathan, *Prophecy and Politics: Socialism, Nationalism, and the Russian Jews 1862–1917*, 1981',
    ],
  },
  {
    name: 'Holocaust & Founding',
    startYear: 1933,
    endYear: 1952,
    color: '#888888',
    description: 'Nazi genocide destroys European Jewry. Survivors and refugees help establish the State of Israel in 1948.',
    longDescription: 'In twelve years, the Nazi regime murdered six million Jews — two thirds of European Jewry and one third of world Jewry — in history\'s most systematic genocide. Ancient communities that had survived a thousand years were annihilated entirely: Polish Jewry (3.3 million), Ukrainian Jewry (1.5 million), Dutch Jewry (100,000). The Nuremberg Laws (1935) stripped German Jews of citizenship; Kristallnacht (1938) announced the shift from persecution to physical destruction; the Wannsee Conference (1942) coordinated the "Final Solution." Six million died in gas chambers, shootings, and starvation. Yet out of catastrophe came an act of historical transformation: the founding of Israel in 1948. Holocaust survivors in displaced persons camps formed the core of Zionist immigration. The United Nations voted partition in November 1947; David Ben-Gurion declared independence on May 14, 1948. Within hours, five Arab armies attacked. Israel survived — and immediately began absorbing hundreds of thousands of refugees.',
    keyEvents: [
      { year: 1935, label: 'Nuremberg Laws strip German Jews of citizenship and civil rights' },
      { year: 1938, label: 'Kristallnacht: state-organized pogrom destroys 7,500 Jewish businesses and 1,400 synagogues' },
      { year: 1942, label: 'Wannsee Conference coordinates the "Final Solution to the Jewish Question"' },
      { year: 1945, label: 'Liberation of the death camps; 6 million Jews murdered, a third of world Jewry' },
      { year: 1947, label: 'UN Partition Plan for Palestine passes; Arab-Jewish conflict intensifies' },
      { year: 1948, label: 'State of Israel declared, May 14; Arab-Israeli War begins immediately after' },
    ],
    sources: [
      'Hilberg, Raul, *The Destruction of the European Jews*, 3 vols., 1961',
      'Bauer, Yehuda, *A History of the Holocaust*, 1982',
      'Morris, Benny, *1948: A History of the First Arab-Israeli War*, 2008',
    ],
  },
  {
    name: 'Israeli Era',
    startYear: 1953,
    endYear: 2024,
    color: '#2563eb',
    description: 'Israel absorbs waves of Jewish immigrants from the Arab world, Soviet Union, and Ethiopia while diaspora communities reshape.',
    longDescription: 'The seven decades since Israel\'s founding have been defined by extraordinary ingathering and equally extraordinary geopolitical transformation. Operation Magic Carpet (1949–1950) airlifted virtually the entire Yemenite Jewish community to Israel. Waves of Jews from Iraq, Morocco, Tunisia, Libya, and Egypt followed through the 1950s–1970s as Arab nationalism made Jewish life untenable across the Middle East. The Six-Day War of 1967 brought Jerusalem and the West Bank under Israeli control and transformed world Jewish identity. The Soviet Jewry movement of the 1970s–1980s, championed by diaspora communities worldwide, culminated in over a million emigrants after the USSR\'s collapse. Operation Solomon (1991) airlifted the Beta Israel community from Ethiopia in 36 hours. Today Israel\'s 7 million Jews live alongside a diaspora of roughly equal size — concentrated in the United States (6 million), France (500,000), Canada, Argentina, and the UK. Both communities wrestle with assimilation, identity, and the relationship between Jewish peoplehood and the Jewish state.',
    keyEvents: [
      { year: 1948, label: 'Operation Magic Carpet begins airlifting 49,000 Yemenite Jews to Israel' },
      { year: 1967, label: 'Six-Day War; Israel captures Jerusalem, West Bank, Sinai, and Golan Heights' },
      { year: 1973, label: 'Yom Kippur War; Egypt and Syria launch surprise attack; Israel survives at great cost' },
      { year: 1991, label: 'Operation Solomon: 14,325 Ethiopian Jews airlifted to Israel in 36 hours' },
      { year: 1990, label: 'Soviet collapse triggers emigration of ~1 million Jews to Israel (1990–2000)' },
      { year: 2024, label: 'Israel\'s Jewish population: ~7 million; world diaspora: ~8 million' },
    ],
    sources: [
      'Laqueur, Walter, *A History of Zionism*, 1972',
      'DellaPergola, Sergio, *World Jewish Population*, American Jewish Year Book, 2020',
      'Shapira, Anita, *Israel: A History*, 2012',
    ],
  },
];

export function getEpochForYear(year: number): Epoch {
  return (
    EPOCHS.find((e) => year >= e.startYear && year <= e.endYear) ?? EPOCHS[EPOCHS.length - 1]
  );
}

export function getEpochIndex(epoch: Epoch): number {
  return EPOCHS.findIndex((e) => e.name === epoch.name);
}
