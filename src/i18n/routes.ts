export const LOCALES = ['hu', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'hu';

export type PageKey =
  | 'home'
  | 'demo'
  | 'bookDemo'
  | 'international'
  | 'unas'
  | 'newsletter'
  | 'pricing'
  | 'onlineDemo'
  | 'thanks'
  | 'privacy'
  | 'terms'
  | 'imprint'
  | 'dataDeletion';

/**
 * Logikai oldal -> nyelvenkénti teljes path (locale prefixszel, fordított sluggal).
 * `null` = az adott oldalnak nincs verziója az adott nyelven.
 * Az adatvédelmi tájékoztató teljes szövege KIZÁRÓLAG angolul létezik (Meta App
 * Review követelmény) — a /hu/adatkezeles csak egy rá hivatkozó rövid oldal.
 * A terms (ÁSZF) kizárólag angolul létezik (Meta App Review követelmény) —
 * a régi /hu/aszf URL a /en/terms-re redirectel.
 * A dataDeletion (Meta által megkövetelt adattörlési tájékoztató) szándékosan
 * csak angolul létezik — a magyar oldalak erre hivatkoznak.
 */
export const PAGES: Record<PageKey, Record<Locale, string | null>> = {
  home: { hu: '/hu/', en: '/en/' },
  // Az "Automata posztolás" megoldás-oldal (a Megoldások menüből érhető el).
  demo: { hu: '/hu/posztolas', en: '/en/demo' },
  // Általános "Bemutatót kérek" kampányoldal – a teljes rendszerről szól
  // (posztolás ÉS hírlevél), a fejléc/lábléc/főoldali CTA-k ide mutatnak.
  bookDemo: { hu: '/hu/online-bemutato', en: '/en/book-demo' },
  // Nemzetközi terjeszkedés kampányoldal – kétnyelvű, rövid slug.
  international: { hu: '/hu/nemzetkozi', en: '/en/international' },
  // UNAS-integráció kampányoldal – kétnyelvű, rövid slug.
  unas: { hu: '/hu/unas', en: '/en/unas' },
  // Hírlevél-generálás kampányoldal – kétnyelvű, rövid slug.
  newsletter: { hu: '/hu/hirlevel', en: '/en/newsletter' },
  // Részletes ároldal: csomag, teljes kreditdíj-táblázat (#kreditek), extra
  // kreditvásárlás, fizetés/számlázás és árazási GYIK. A landing oldalak
  // "Részletes kreditdíjak" linkje ide mutat (korábban egy Notion doksira).
  pricing: { hu: '/hu/arak', en: '/en/pricing' },
  // Önálló, nyelvi prefix nélküli kampány-link online konzultációhoz (Fillout-űrlap).
  // Szándékosan csak egy nyelven (HU) és prefix nélkül él – ez a brief kérése.
  onlineDemo: { hu: '/online-demo', en: null },
  thanks: { hu: '/hu/koszonjuk', en: '/en/thank-you' },
  privacy: { hu: '/hu/adatkezeles', en: '/en/privacy-policy' },
  terms: { hu: null, en: '/en/terms' },
  imprint: { hu: '/hu/impresszum', en: '/en/imprint' },
  dataDeletion: { hu: null, en: '/en/data-deletion' },
};

/** Az adott oldal path-ja egy adott nyelven (üres string, ha nincs). */
export function pathFor(page: PageKey, locale: Locale): string {
  return PAGES[page][locale] ?? '';
}

/** A megadott nyelv főoldalának path-ja (a nav-anchorokhoz: `${home}#funkciok`). */
export function homeFor(locale: Locale): string {
  return PAGES.home[locale] as string;
}

/**
 * hreflang alternatívák egy adott oldalhoz.
 * Minden nyelvet felsorol, ahol az oldal létezik, plusz x-default (a HU verzió).
 */
export function alternatesFor(page: PageKey): { hreflang: string; path: string }[] {
  const out: { hreflang: string; path: string }[] = [];
  for (const loc of LOCALES) {
    const p = PAGES[page][loc];
    if (p) out.push({ hreflang: loc, path: p });
  }
  const xdefault = PAGES[page][DEFAULT_LOCALE];
  if (xdefault) out.push({ hreflang: 'x-default', path: xdefault });
  return out;
}

/**
 * A nyelvváltó cél-URL-je: az AKTUÁLIS oldal másik nyelvi verziója.
 * Ha az adott oldal nem létezik a másik nyelven (pl. jogi oldal), a másik
 * nyelv főoldalára esik vissza.
 */
export function switchTarget(page: PageKey, current: Locale): { locale: Locale; path: string } {
  const other: Locale = current === 'hu' ? 'en' : 'hu';
  const p = PAGES[page][other];
  return { locale: other, path: p ?? homeFor(other) };
}
