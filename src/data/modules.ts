import type { Locale, PageKey } from '../i18n/routes';
import { pathFor } from '../i18n/routes';

/**
 * A Content Ninja moduljainak EGYETLEN forrása.
 *
 * Korábban minden kampányoldal kézzel másolta a "mit tud még a rendszer"
 * kártyákat, ezért az új modulok (blogcikk író, Shopgrade) sehol nem jelentek
 * meg. Új modul felvételéhez innentől ELÉG EZT A FÁJLT bővíteni — a
 * `ModuleGrid.astro` minden oldalon automatikusan kirakja.
 *
 * A sorrend a megjelenítési sorrend. A 10 modulból minden oldal a sajátját
 * kihagyja (`exclude`), így 9 kártya = tiszta 3×3 rács.
 */
export type ModuleId =
  | 'posting'
  | 'blogWriter'
  | 'shopgrade'
  | 'newsletter'
  | 'storeIntegration'
  | 'international'
  | 'image'
  | 'video'
  | 'narration'
  | 'metaAds';

interface ModuleText {
  title: string;
  desc: string;
  /** Rövidebb név a fejléc "Megoldások" menüjéhez (ha a `title` túl hosszú oda). */
  navLabel?: string;
  /** Egysoros leírás a "Megoldások" menü sorai alá. */
  navDesc?: string;
}

export interface ModuleDef {
  id: ModuleId;
  /** Material Symbols ikonnév. */
  icon: string;
  /** Saját kampányoldal (routes.ts kulcs). Ha nincs, a kártya link nélküli. */
  page?: PageKey;
  hu: ModuleText;
  en: ModuleText;
}

export const MODULES: ModuleDef[] = [
  {
    id: 'posting',
    icon: 'auto_awesome',
    page: 'demo',
    hu: {
      title: 'Automata posztolás',
      desc: 'Az AI a termékeidből posztokat ír, képet és videót készít hozzájuk, majd időzítve publikálja Facebookra és Instagramra.',
      navDesc: 'AI-tartalom a webshopod nevében, nonstop',
    },
    en: {
      title: 'Automated posting',
      desc: 'The AI writes posts from your products, creates images and videos for them, then publishes them on a schedule to Facebook and Instagram.',
      navDesc: 'AI content on behalf of your webshop, 24/7',
    },
  },
  {
    id: 'blogWriter',
    icon: 'article',
    page: 'blogWriter',
    hu: {
      title: 'Blogcikk író',
      desc: 'Kikutatja, mire keresnek a vásárlóid, megírja rá a SEO- és GEO-barát blogcikket, majd publikálja is a webshopod blogjában.',
      navDesc: 'Kulcsszókutatás és SEO-cikk a webshop blogjába',
    },
    en: {
      title: 'Blog writer',
      desc: 'It researches what your customers search for, writes the SEO- and GEO-friendly article, then publishes it straight to your webshop blog.',
      navDesc: 'Keyword research and SEO articles for your blog',
    },
  },
  {
    id: 'shopgrade',
    icon: 'edit_document',
    page: 'shopgrade',
    hu: {
      title: 'Shopgrade – tartalomoptimalizálás',
      desc: 'A meglévő termékleírásaidat írja át SEO- és GEO-barát, értékesítési fókuszú szöveggé, majd vissza is tölti a webshopodba.',
      // A menüben a funkció vezet, a modul neve utána jön – a "Shopgrade" név
      // önmagában nem érthető annak, aki most találkozik vele.
      navLabel: 'Termékleírás újraírás',
      navDesc: 'Shopgrade – a meglévő leírásaid felturbózva',
    },
    en: {
      title: 'Shopgrade – content optimization',
      desc: 'It rewrites your existing product descriptions into SEO- and GEO-friendly, sales-focused copy, then uploads them back to your webshop.',
      navLabel: 'Product description rewriting',
      navDesc: 'Shopgrade – your existing descriptions, upgraded',
    },
  },
  {
    id: 'newsletter',
    icon: 'mail',
    page: 'newsletter',
    hu: {
      title: 'AI hírlevél',
      desc: 'Kész hírlevél szöveggel, dizájnnal és termékképekkel – a saját MailerLite vagy Salesautopilot fiókodból, a meglévő listáidra.',
      navDesc: 'Az AI megírja, megtervezi és kiküldi a hírleveleid',
    },
    en: {
      title: 'AI newsletter',
      desc: 'Ready-made newsletters with copy, design and product images – from your own MailerLite or Salesautopilot account, to your existing lists.',
      navDesc: 'The AI writes, designs and sends your newsletters',
    },
  },
  {
    id: 'storeIntegration',
    icon: 'storefront',
    page: 'webshopIntegration',
    hu: {
      title: 'Webshop mélyintegráció',
      desc: 'Az Unas vagy Shoprenter áruházad bekötve: az AI látja az összes terméked és blogcikked, és mindig friss adatokból dolgozik.',
      navDesc: 'Unas, Shoprenter – az AI látja a termékeid',
    },
    en: {
      title: 'Deep store integration',
      desc: 'With your Unas or Shoprenter store connected, the AI sees all your products and blog posts, and always works from fresh data.',
      navDesc: 'Connect Unas or Shoprenter, the AI sees your products',
    },
  },
  {
    id: 'international',
    icon: 'public',
    page: 'international',
    hu: {
      title: 'Nemzetközi terjeszkedés',
      desc: 'Írd meg egyszer magyarul – a rendszer natív minőségben lefordítja, és minden piacod fiókjába kiküldi.',
      navDesc: 'Több nyelven, több piacra egyszerre',
    },
    en: {
      title: 'International expansion',
      desc: "Write it once in your own language – the system translates it at native quality and sends it to every market's account.",
      navDesc: 'Multiple languages, more markets at once',
    },
  },
  {
    id: 'image',
    icon: 'image',
    hu: {
      title: 'AI képgeneráló',
      desc: 'Brandazonos, logózott kreatívokat és termékképeket generál egyetlen kattintással, stúdió nélkül.',
    },
    en: {
      title: 'AI image generator',
      desc: 'Generates on-brand, logo-stamped creatives and product images in a single click, without a studio.',
    },
  },
  {
    id: 'video',
    icon: 'movie_filter',
    hu: {
      title: 'AI videógeneráló',
      desc: 'Statikus termékfotókból mozgó videókat és animációkat készít kameramozgásokkal és effektekkel.',
    },
    en: {
      title: 'AI video generator',
      desc: 'Turns static product photos into moving videos and animations with camera moves and effects.',
    },
  },
  {
    id: 'narration',
    icon: 'record_voice_over',
    hu: {
      title: 'Narrátorvideó',
      desc: 'Terméklinkből percek alatt teljes narrátorvideót készít – AI hanggal, felirattal és a saját termékképeiddel.',
    },
    en: {
      title: 'Narrated video',
      desc: 'Builds a full narrated video from a product link in minutes – with an AI voice, captions and your own product images.',
    },
  },
  {
    id: 'metaAds',
    icon: 'ads_click',
    hu: {
      title: 'Meta hirdetésgeneráló',
      desc: 'Facebook és Instagram hirdetési kreatívok és szövegek automatikusan, ugyanazokból a termékadatokból.',
    },
    en: {
      title: 'Meta ad generator',
      desc: 'Facebook and Instagram ad creatives and copy generated automatically from the same product data.',
    },
  },
];

export interface ModuleCard {
  id: ModuleId;
  icon: string;
  title: string;
  desc: string;
  /** Üres string, ha a modulnak nincs saját oldala az adott nyelven. */
  href: string;
}

/** A modulkártyák egy adott nyelven, a megadott id-k kihagyásával. */
export function modulesFor(locale: Locale, exclude: ModuleId[] = []): ModuleCard[] {
  return MODULES.filter((m) => !exclude.includes(m.id)).map((m) => ({
    id: m.id,
    icon: m.icon,
    title: m[locale].title,
    desc: m[locale].desc,
    href: m.page ? pathFor(m.page, locale) : '',
  }));
}

export interface NavModule {
  icon: string;
  href: string;
  label: string;
  desc: string;
}

/**
 * A fejléc "Megoldások" menüjének elemei: azok a modulok, amiknek van saját
 * kampányoldala. A sorrend a `MODULES` sorrendje.
 */
export function navModulesFor(locale: Locale): NavModule[] {
  return MODULES.filter((m) => m.page).map((m) => ({
    icon: m.icon,
    href: pathFor(m.page as PageKey, locale),
    label: m[locale].navLabel ?? m[locale].title,
    desc: m[locale].navDesc ?? m[locale].desc,
  }));
}

/** A kártyalink és a záró CTA szövege nyelvenként. */
export const MODULE_UI = {
  hu: {
    details: 'Részletek',
    wholeSystem: 'Nézd meg a teljes rendszert',
    allSolutions: 'Összes megoldás',
  },
  en: {
    details: 'Details',
    wholeSystem: 'See the full system',
    allSolutions: 'All solutions',
  },
} as const;
