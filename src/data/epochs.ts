import type { Epoch } from './types';

export const EPOCHS: Epoch[] = [
  {
    name: 'Roman Diaspora',
    startYear: 70,
    endYear: 399,
    color: '#c0392b',
    description: 'Destruction of the Second Temple scatters Jewish communities across the Roman Empire and beyond.',
    longDescription:
      'The Roman legions\' destruction of Jerusalem\'s Second Temple in 70 CE ended two thousand years of Temple-based Judaism in a single catastrophic campaign. General Titus marched Jewish captives through Rome in a triumph whose arch still stands today. Jewish communities already existed from Spain to Babylonia — now they would be the primary centers of a religion reinventing itself around text and prayer rather than sacrifice. The great rabbis, led by Yohanan ben Zakkai, rebuilt Judaism at Yavneh by codifying oral law into what would become the Mishnah. By the end of this era, Jews in Babylonia under Parthian rule were actually more numerous and more prosperous than those still living in Roman Palestine.',
  },
  {
    name: 'Geonic Era',
    startYear: 400,
    endYear: 999,
    color: '#d4a017',
    description: 'Babylonian academies (yeshivot) flourish under Sasanian and later Islamic rule. The Geonim lead world Jewry.',
    longDescription:
      'For six centuries, the great academies of Sura and Pumbedita in Babylonia served as the undisputed intellectual capital of the Jewish world. Under Sasanian and then Islamic rule, the Geonim — the academy heads — answered legal queries from Jewish communities stretching from Spain to India, creating a global network of Jewish law and learning. The Babylonian Talmud was compiled and edited during this period, becoming the authoritative text for all of rabbinic Judaism. The Islamic conquests of the 7th century paradoxically opened new opportunities: Jewish merchants followed Arab trade routes across North Africa and into Iberia, establishing the foundation for the Golden Age to come. By 900 CE, Baghdad alone housed over 200,000 Jews.',
  },
  {
    name: 'Golden Age of Spain',
    startYear: 1000,
    endYear: 1148,
    color: '#f39c12',
    description: 'Umayyad Iberia witnesses an extraordinary flowering of Jewish philosophy, poetry, science, and culture.',
    longDescription:
      'Under the relatively tolerant rule of the Umayyad caliphate in al-Andalus, Jewish civilization experienced one of its greatest flowerings. Scholars like Samuel ha-Nagid served as viziers and military commanders while writing Hebrew poetry. Shlomo ibn Gabirol fused Neoplatonism with Jewish thought. Judah Halevi composed verse of such beauty it is still recited today. And in Córdoba, Moses ben Maimon — Maimonides — would be born in 1138 to a community that balanced Talmudic learning with Greek philosophy, Arabic medicine, and courtly culture. The Almohad invasion from North Africa ended this era abruptly, forcing communities into Christian Spain or across the Mediterranean, but the intellectual legacy of Andalusian Jewry shaped Jewish thought for the next millennium.',
  },
  {
    name: 'Era of Expulsions',
    startYear: 1149,
    endYear: 1549,
    color: '#e74c3c',
    description: 'Crusades, the Black Death, and rising Christian nationalism drive waves of expulsions across Western Europe.',
    longDescription:
      'The four centuries following the Almohad invasion were marked by relentless displacement. The Crusades brought mob violence to the Rhine Valley in 1096, killing thousands and driving survivors eastward into Poland. England expelled its entire Jewish population in 1290; France followed in 1306 and again in 1394. The Black Death of 1348 triggered massacres across hundreds of European towns as Jews were falsely blamed for poisoning wells. The pogroms of 1391 devastated Spanish Jewry, forcing hundreds of thousands to convert or flee. The catastrophe culminated in 1492: Ferdinand and Isabella\'s Alhambra Decree expelled all remaining Jews from Spain — perhaps 200,000 people — in the same month Columbus sailed west. Sultan Bayezid II of the Ottoman Empire welcomed the exiles, famously remarking that Ferdinand had impoverished his own kingdom while enriching the Ottomans.',
  },
  {
    name: 'Polish–Ottoman Axis',
    startYear: 1550,
    endYear: 1788,
    color: '#8e44ad',
    description: 'Poland-Lithuania and the Ottoman Empire become twin centers of Jewish life, each harboring hundreds of thousands.',
    longDescription:
      'By the mid-16th century, world Jewry had reorganized around two great poles. In the Ottoman Empire, Sephardic exiles from Spain transformed cities like Thessaloniki, where Jews became the majority, and established vibrant communities in Istanbul, Safed, and Jerusalem. In Safed, Rabbi Joseph Karo codified all of Jewish law in the Shulchan Aruch (1563), and the Kabbalists around Isaac Luria gave mysticism a systematic form that would spread everywhere. In Poland-Lithuania, Casimir the Great\'s protections had created a refuge that grew into the world\'s largest Jewish population — perhaps 500,000 by 1650. The Council of Four Lands functioned as a quasi-parliament of Jewish autonomy. But the Cossack uprising of Bohdan Khmelnytsky (1648–49) massacred up to 100,000 Jews and shattered the Polish golden age. The false messiah Shabbetai Zevi\'s movement (1665–66) swept a traumatized diaspora with messianic fever before his conversion to Islam broke it.',
  },
  {
    name: 'Emancipation',
    startYear: 1789,
    endYear: 1879,
    color: '#2980b9',
    description: 'The French Revolution triggers a century-long struggle for legal equality in Western and Central Europe.',
    longDescription:
      'The French Revolution of 1789 posed a radical question to Europe: if all men are born equal, what does that mean for the Jews? France granted full citizenship to its Jewish subjects in 1791 — the first European nation to do so — and Napoleon\'s armies carried this principle across the continent. The 19th century became a slow, contested struggle for civil emancipation: Jews gained rights in Prussia (1812, then revoked, then restored), the German states, Austria-Hungary, and finally Britain. With emancipation came the Haskalah — the Jewish Enlightenment — and new religious movements: Reform Judaism tried to modernize worship; Orthodox Judaism hardened in response; Conservative Judaism sought a middle path. Jews flooded into universities, the professions, and cultural life. But emancipation was uneven and contested, and in Russia, where most of the world\'s Jews lived confined to the Pale of Settlement, it never truly arrived at all.',
  },
  {
    name: 'Mass Migration',
    startYear: 1880,
    endYear: 1932,
    color: '#27ae60',
    description: 'Pogroms and poverty propel two million Jews from Eastern Europe to the Americas and Palestine.',
    longDescription:
      'The assassination of Tsar Alexander II in 1881 triggered a wave of government-sanctioned pogroms across the Pale of Settlement that would recur in 1903–06 and again in 1918–21. Combined with crushing poverty and legal discrimination, these pogroms set in motion the largest Jewish migration in history. Between 1880 and 1924, approximately two million Jews crossed the Atlantic to the United States — most passing through Ellis Island to the tenements of Manhattan\'s Lower East Side, where Yiddish newspapers, labor unions, and political movements flourished. Smaller but significant streams reached Argentina, South Africa, Canada, and Australia. A different kind of migrant — the idealistic Zionist pioneer — headed to Ottoman and later British Palestine, draining the swamps and building the infrastructure of a future state. The U.S. Immigration Act of 1924 largely closed the American door, redirecting the remaining stream toward Palestine just as Hitler was rising to power.',
  },
  {
    name: 'Holocaust & Founding',
    startYear: 1933,
    endYear: 1952,
    color: '#888888',
    description: 'Nazi genocide destroys European Jewry. Survivors and refugees help establish the State of Israel in 1948.',
    longDescription:
      'Adolf Hitler\'s appointment as German Chancellor in January 1933 began a systematic escalation — boycotts, the Nuremberg Laws, Kristallnacht — that culminated in the Wannsee Conference of 1942, where the "Final Solution" was coordinated across occupied Europe. By 1945, six million Jews had been murdered — two-thirds of European Jewry and one-third of the entire world Jewish population. Whole communities were annihilated: 91% of Polish Jews, 86% of Dutch Jews, 77% of Greek Jews. The survivors, numbering perhaps 250,000 in Displaced Persons camps, had nowhere to return to. Their pressure to reach Palestine, combined with the moral weight of the Holocaust and decades of Zionist groundwork, moved the United Nations to vote for partition in November 1947. The State of Israel declared independence on May 14, 1948. Within four years, 700,000 Jews from the DP camps and the Arab world had arrived, transforming a besieged new nation into the demographic center of world Jewry for the first time in nineteen centuries.',
  },
  {
    name: 'Israeli Era',
    startYear: 1953,
    endYear: 2024,
    color: '#2563eb',
    description: 'Israel absorbs waves of Jewish immigrants from the Arab world, Soviet Union, and Ethiopia while diaspora communities reshape.',
    longDescription:
      'The decades after Israel\'s founding saw the near-total emptying of ancient Jewish communities across the Arab world — over 850,000 Mizrahi and Sephardic Jews fled or were expelled from Iraq, Morocco, Yemen, Egypt, Libya, and elsewhere between 1948 and 1972. Israel absorbed them all, creating a genuinely multi-ethnic Jewish society. The Six-Day War of 1967 transformed Jewish confidence worldwide and accelerated American Jewish identity around Israel. The Soviet Aliyah of 1990–2000 brought over a million Jews from the former USSR, reshaping Israeli politics and culture. Operation Moses (1984) and Operation Solomon (1991) airlifted Ethiopian Jews in dramatic missions. Meanwhile, the American Jewish community — numerically the world\'s largest diaspora — became increasingly complex: deeply tied to Israel yet increasingly distant from it, navigating rising antisemitism, intermarriage, and identity questions that would have been unrecognizable to the immigrants of 1910. By 2024, for the first time in nearly two millennia, more Jews live in the Land of Israel than anywhere else on earth.',
  },
];

export function getEpochForYear(year: number): Epoch {
  return (
    EPOCHS.find((e) => year >= e.startYear && year <= e.endYear) ?? EPOCHS[EPOCHS.length - 1]
  );
}
