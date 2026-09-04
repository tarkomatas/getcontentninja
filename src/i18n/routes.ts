export const LOCALES = ['hu', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'hu';

export type PageKey =
  | 'home'
  | 'demo'
  | 'bookDemo'
  | 'allInOne'
  | 'international'
  | 'webshopIntegration'
  | 'shopgrade'
  | 'shopgradeAudit'
  | 'blogWriter'
  | 'webshopSeoGeo'
  | 'chatgptAds'
  | 'newsletter'
  | 'newsletterSignup'
  | 'pricing'
  | 'onlineDemo'
  | 'contact'
  | 'thanks'
  | 'privacy'
  | 'terms'
  | 'imprint'
  | 'dataDeletion';

/**
 * Logikai oldal -> nyelvenkénti teljes path (locale prefixszel, fordított sluggal).
 * `null` = az adott oldalnak nincs verziója az adott nyelven.
 *
 * A jogi oldalak 2026 augusztusától MINDKÉT nyelven teljes szöveggel léteznek
 * (ÁSZF, adatkezelési tájékoztató, adattörlési útmutató). A magyar szöveg az
 * elsődleges és irányadó, az angol a Meta App Review és a külföldi ügyfelek
 * miatt marad. Korábban a /hu/aszf a /en/terms-re redirectelt és a
 * /hu/adatkezeles csak egy rövid, angolra mutató hivatkozó oldal volt — ezt a
 * `astro.config.mjs` redirects listájából is kivezettük.
 */
export const PAGES: Record<PageKey, Record<Locale, string | null>> = {
  home: { hu: '/hu/', en: '/en/' },
  // Az "Automata posztolás" megoldás-oldal (a Megoldások menüből érhető el).
  demo: { hu: '/hu/posztolas/', en: '/en/demo/' },
  // Általános "Bemutatót kérek" kampányoldal – a teljes rendszerről szól
  // (posztolás ÉS hírlevél), a fejléc/lábléc/főoldali CTA-k ide mutatnak.
  bookDemo: { hu: '/hu/online-bemutato/', en: '/en/book-demo/' },
  // "Teljes rendszer" kampányoldal: ugyanaz az AJÁNLAT, mint a bookDemo (online
  // bemutató, ugyanaz az űrlap és minősítés), de más a SZÖG — nem a bemutató
  // eseménye, hanem az all-in-one ígéret a horog. Külön `lead_forras`
  // ('teljes-rendszer'), hogy mérhető legyen, melyik szög hoz több bemutatót.
  // Tisztán fizetett landing: `noindex` + robots.txt Disallow, nem versenyez
  // sem a főoldallal, sem az online-bemutatóval ugyanarra az ígéretre.
  allInOne: { hu: '/hu/teljes-rendszer/', en: '/en/all-in-one/' },
  // Nemzetközi terjeszkedés kampányoldal – kétnyelvű, rövid slug.
  international: { hu: '/hu/nemzetkozi/', en: '/en/international/' },
  // Webshop mélyintegráció kampányoldal (Unas + Shoprenter) – kétnyelvű.
  webshopIntegration: { hu: '/hu/webshop-integracio/', en: '/en/store-integration/' },
  // Shopgrade modul: a webáruház meglévő tartalmát optimalizálja (termékleírás- ÉS
  // kategóriaoldal-újraírás + visszatöltés; hamarosan termékkép-szerkesztő és nyelvesítés).
  // A slug szándékosan a modul neve, hogy a későbbi almodulok is beleférjenek.
  shopgrade: { hu: '/hu/shopgrade/', en: '/en/shopgrade/' },
  // Opt-in (squeeze) oldal a Shopgrade-hez: a csali maga a TERMÉK egy darabja —
  // az app ingyenes, belépés nélküli termékleírás-diagnózisa. Az űrlap után a
  // látogató NEM a köszönőoldalra megy, hanem egyenesen az app diagnózis-oldalára
  // (`AUDIT_START_URL`), mert egy opt-in oldal ígéretét azonnal be kell váltani.
  //
  // **Csak magyarul.** Az app diagnózis-oldala egynyelvű (a több nyelv a v1-ből
  // kimaradt), egy angol opt-in tehát magyar diagnózisra vinne. `en: null` →
  // a nyelvváltó az EN főoldalra esik vissza.
  //
  // Tisztán fizetett landing: `noindex` + robots.txt Disallow — nem versenyzik a
  // `/hu/shopgrade/` oldallal ugyanarra a kifejezésre (`allInOne` mintája).
  shopgradeAudit: { hu: '/hu/termekleiras-diagnozis/', en: null },
  // Blogcikk író modul: kulcsszókutatás -> SEO/GEO-barát blogcikk -> publikálás
  // közvetlenül a webshop blogjába (Unas + Shoprenter).
  blogWriter: { hu: '/hu/blogcikk-iro/', en: '/en/blog-writer/' },
  // **Gyűjtő (hub) kampányoldal a keresőtartalomra.** A `shopgrade` (termékleírás +
  // kategóriaoldal) és a `blogWriter` (blogcikk) külön-külön egy-egy modul, SEO/GEO
  // szempontból viszont EGY egész: a kereső és az AI nem egy oldalt pontoz, hanem a
  // webshop egészét. Ez az oldal ezt az összefüggést adja el, és onnan oszt tovább a
  // két modul-oldalra — vagyis a saját honlapunkon is egy tematikus klasztert épít
  // (hub + 2 spoke), pont azt, amit a termék csinál.
  //
  // A slug SZÁNDÉKOSAN mondja ki mind a kettőt: a GEO (az AI-keresőkre való
  // optimalizálás) önálló ígéret, nem a SEO lábjegyzete — egy csak-„seo" URL a
  // fele terméket hirdetné.
  //
  // Indexelhető (nem `noindex`, mint az `allInOne`): más kifejezésre megy
  // („webshop SEO + GEO"), mint a modul-oldalak („termékleírás író", „blogcikk
  // író"), ezért nem kannibalizál. Hirdetési forgalmat is ide terelünk (`?type=ld`).
  webshopSeoGeo: { hu: '/hu/webshop-seo-geo/', en: '/en/webshop-seo-geo/' },
  // **ChatGPT hirdetések modul – VÁRÓLISTA-oldal, a modul még nem éles.**
  // A modul a webshop termékeiből feedet épít, abból kampányt indít az OpenAI
  // hirdetési rendszerében, naponta behúzza a számokat, és az AI egy kattintással
  // jóváhagyható javaslatokat készít elő (app: `docs/features/chatgpt-ads.md`).
  //
  // ⚠️ Az élesítés a GDPR-bejelentéstől számított 30 naphoz kötött, ezért az oldal
  // **jelen időben semmit nem ígérhet**: „Hamarosan" jelvény + értesítéskérő űrlap.
  //
  // Az űrlap NEM a lead-intake-re megy, hanem a hírlevél-végpontra
  // (`src/data/newsletter.ts`, `source_form: 'chatgpt_ads'`) — a feliratkozó az
  // indulás hírét várja, nem bemutatót kér. A teljes szerződés (MailerLite-csoportok,
  // hozzájárulás-szabály): `docs/chatgpt-ads-hirlevel-feliratkozas.md`.
  // Amikor a modul élesedik, a hero űrlapja a szokásos minősítő lead-űrlapra
  // cserélhető (`LeadFormScript`) — akkor kell majd `lead_forras` kulcs a
  // `forms.ts`-be is.
  //
  // A slug SZÁNDÉKOSAN az OpenAI terméknevét viszi (`chatgpt-ads`), nem a magyar
  // fordítást: ez a felület hivatalos neve, és a keresés is így stabil marad, ha
  // később megjön az EN változat.
  //
  // **Csak magyarul** (`en: null`): a modul UI-ja és az AI-elemzése magyar, a
  // várólista-levél is az lesz. Ha megjelenik angolul, egy `/en/chatgpt-ads/`
  // fájllal bővíthető.
  chatgptAds: { hu: '/hu/chatgpt-ads/', en: null },
  // Hírlevél-generálás kampányoldal – kétnyelvű, rövid slug.
  newsletter: { hu: '/hu/hirlevel/', en: '/en/newsletter/' },
  // **A MI hírlevelünkre való feliratkozás** – nem összekeverendő a fenti
  // `newsletter`-rel, ami a TERMÉK hírlevél-moduljának kampányoldala. A rövid
  // `/hu/hirlevel/` slugot az foglalja, ezért lett ez `-feliratkozas`; a cím
  // egyben pontosabb is (nem a modulról szól, hanem a feliratkozásról).
  //
  // Indexelhető, nyilvános céloldal: ide linkelünk a levelekből, a supportból
  // és a közösségi profilokból, ezért kifejezetten meg kell találni.
  //
  // **Csak magyarul** (`en: null`): a hírlevél maga magyar nyelvű, és a
  // megerősítő levelet is az app küldi – egy angol feliratkozó magyar levelet
  // kapna. Ha a hírlevél megjelenik angolul, ez egy `/en/newsletter-signup/`
  // fájllal bővíthető (a `NewsletterForm` már tud angolul).
  newsletterSignup: { hu: '/hu/hirlevel-feliratkozas/', en: null },
  // Részletes ároldal: csomag, teljes kreditdíj-táblázat (#kreditek), extra
  // kreditvásárlás, fizetés/számlázás és árazási GYIK. A landing oldalak
  // "Részletes kreditdíjak" linkje ide mutat (korábban egy Notion doksira).
  pricing: { hu: '/hu/arak/', en: '/en/pricing/' },
  // Önálló, nyelvi prefix nélküli kampány-link online konzultációhoz (Fillout-űrlap).
  // Szándékosan csak egy nyelven (HU) és prefix nélkül él – ez a brief kérése.
  onlineDemo: { hu: '/online-demo/', en: null },
  // Kapcsolat: cégadatok, közvetlen elérhetőségek (e-mail, telefon) és
  // általános kapcsolatfelvételi űrlap. A fejléc/lábléc "Kapcsolat" linkje ide visz.
  contact: { hu: '/hu/kapcsolat/', en: '/en/contact/' },
  thanks: { hu: '/hu/koszonjuk/', en: '/en/thank-you/' },
  privacy: { hu: '/hu/adatkezeles/', en: '/en/privacy-policy/' },
  terms: { hu: '/hu/aszf/', en: '/en/terms/' },
  imprint: { hu: '/hu/impresszum/', en: '/en/imprint/' },
  dataDeletion: { hu: '/hu/adattorles/', en: '/en/data-deletion/' },
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
