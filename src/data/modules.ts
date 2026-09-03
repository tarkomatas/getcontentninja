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
    },
    en: {
      title: 'Automated posting',
      desc: 'The AI writes posts from your products, creates images and videos for them, then publishes them on a schedule to Facebook and Instagram.',
    },
  },
  {
    id: 'blogWriter',
    icon: 'article',
    page: 'blogWriter',
    hu: {
      title: 'Blogcikk író',
      desc: 'Kikutatja, mire keresnek a vásárlóid, megírja rá a SEO- és GEO-barát blogcikket, majd publikálja is a webshopod blogjában.',
    },
    en: {
      title: 'Blog writer',
      desc: 'It researches what your customers search for, writes the SEO- and GEO-friendly article, then publishes it straight to your webshop blog.',
    },
  },
  {
    id: 'shopgrade',
    icon: 'edit_document',
    page: 'shopgrade',
    hu: {
      title: 'Shopgrade – tartalomoptimalizálás',
      desc: 'A meglévő termékleírásaidat és kategóriaoldalaid szövegét írja át SEO- és GEO-barát, értékesítési fókuszú szöveggé, majd vissza is tölti a webshopodba.',
    },
    en: {
      title: 'Shopgrade – content optimization',
      desc: 'It rewrites your existing product descriptions and category page copy into SEO- and GEO-friendly, sales-focused text, then uploads it back to your webshop.',
    },
  },
  {
    id: 'newsletter',
    icon: 'mail',
    page: 'newsletter',
    hu: {
      title: 'AI hírlevél',
      desc: 'Kész hírlevél szöveggel, dizájnnal és termékképekkel – a saját MailerLite vagy Salesautopilot fiókodból, a meglévő listáidra.',
    },
    en: {
      title: 'AI newsletter',
      desc: 'Ready-made newsletters with copy, design and product images – from your own MailerLite or Salesautopilot account, to your existing lists.',
    },
  },
  {
    id: 'storeIntegration',
    icon: 'storefront',
    page: 'webshopIntegration',
    hu: {
      title: 'Webshop mélyintegráció',
      desc: 'Az Unas vagy Shoprenter áruházad bekötve: az AI látja az összes terméked és blogcikked, és mindig friss adatokból dolgozik.',
    },
    en: {
      title: 'Deep store integration',
      desc: 'With your Unas or Shoprenter store connected, the AI sees all your products and blog posts, and always works from fresh data.',
    },
  },
  {
    id: 'international',
    icon: 'public',
    page: 'international',
    hu: {
      title: 'Nemzetközi terjeszkedés',
      desc: 'Írd meg egyszer magyarul – a rendszer natív minőségben lefordítja, és minden piacod fiókjába kiküldi.',
    },
    en: {
      title: 'International expansion',
      desc: "Write it once in your own language – the system translates it at native quality and sends it to every market's account.",
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
  /** Rövid állapotjelző a címke mellett (pl. „Hamarosan”). Üres/hiányzó = nincs. */
  badge?: string;
}

export interface NavGroup {
  label: string;
  /** A csoportcím linkje (gyűjtőoldal), ha van. */
  href?: string;
  items: NavModule[];
}

interface NavItemDef {
  page: PageKey;
  icon: string;
  hu: { label: string; desc: string; badge?: string };
  en: { label: string; desc: string; badge?: string };
}

interface NavGroupDef {
  hu: string;
  en: string;
  /** A csoportcím maga is vihet egy gyűjtőoldalra. */
  page?: PageKey;
  items: NavItemDef[];
}

/**
 * A "Megoldások" menü – **saját, kézzel írt lista**, nem a `MODULES` leképezése.
 *
 * Ez szándékos: a menü nem a modulokat sorolja fel, hanem azt, amit a látogató
 * KERES, és a kettő nem fedi egymást.
 *
 * - A **blogcikk író kétszer** szerepel: keresőtartalomként és
 *   tartalommarketingként is – mindkét fejben ott a helye, és ugyanarra az
 *   oldalra visz.
 * - A **Shopgrade két néven** jelenik meg („Termékleírás író", „Kategóriaoldal
 *   író"), mert a modul neve önmagában nem mond semmit, a két funkcióra viszont
 *   külön-külön keresnek. Mindkettő a `shopgrade` oldalra megy.
 * - A **webshop-integráció** nem megoldás, hanem előfeltétel, ezért kikerült a
 *   csoportokból a panel alján futó saját sávba (`NAV_INTEGRATION`).
 * - Ami **nincs itt, az sem tűnik el**: a `navModulesFor` a lábléchez hozzáfűzi
 *   az összes olyan modult, aminek van kampányoldala, de a menübe nem fért be
 *   (ilyen a nemzetközi terjeszkedés) – így egy indexelhető oldal sem marad
 *   belső hivatkozás nélkül.
 *
 * A modulrács (`ModuleGrid`) ettől függetlenül továbbra is a `MODULES`-ból épül.
 */
export const NAV_GROUPS: NavGroupDef[] = [
  {
    hu: 'Kereső- és AI-optimalizálás',
    en: 'Search & AI optimization',
    page: 'webshopSeoGeo',
    items: [
      {
        page: 'blogWriter',
        icon: 'article',
        hu: { label: 'Blogcikk író', desc: 'Kulcsszókutatás és kész cikk a blogodba' },
        en: { label: 'Blog writer', desc: 'Keyword research and a finished article' },
      },
      {
        page: 'shopgrade',
        icon: 'edit_document',
        hu: { label: 'Termékleírás író', desc: 'A gyártói szöveg helyett egyedi leírás' },
        en: { label: 'Product description writer', desc: "Your own copy, not the maker's" },
      },
      {
        page: 'shopgrade',
        icon: 'category',
        hu: { label: 'Kategóriaoldal író', desc: 'A kategóriaszövegek keresésre hangolva' },
        en: { label: 'Category page writer', desc: 'Category copy tuned to what people search' },
      },
    ],
  },
  {
    hu: 'Tartalommarketing',
    en: 'Content marketing',
    items: [
      {
        page: 'demo',
        icon: 'auto_awesome',
        hu: { label: 'Automata posztolás', desc: 'AI-tartalom a webshopod nevében, nonstop' },
        en: { label: 'Automated posting', desc: 'AI content on behalf of your webshop, 24/7' },
      },
      {
        page: 'newsletter',
        icon: 'mail',
        hu: { label: 'AI hírlevél küldés', desc: 'Az AI megírja, megtervezi és kiküldi' },
        en: { label: 'AI newsletter sending', desc: 'The AI writes, designs and sends it' },
      },
      {
        page: 'blogWriter',
        icon: 'article',
        hu: { label: 'Blogcikk író', desc: 'Rendszeres tartalom a webshop blogjába' },
        en: { label: 'Blog writer', desc: 'Regular content for your webshop blog' },
      },
    ],
  },
  {
    hu: 'Hirdetés',
    en: 'Advertising',
    items: [
      {
        // A modul még nem éles – ezért a `badge`. A cél-oldal csak magyarul van
        // (`chatgptAds` → `en: null`), az EN menüből a `navGroupsFor` szűrője
        // veszi ki; a csoport ilyenkor elem nélkül marad, és ki sem kerül.
        page: 'chatgptAds',
        icon: 'ads_click',
        hu: {
          label: 'ChatGPT hirdetéskezelő',
          desc: 'Kampány a ChatGPT-ben, a termékeidből',
          badge: 'Hamarosan',
        },
        en: {
          label: 'ChatGPT ad manager',
          desc: 'Campaigns in ChatGPT, from your products',
          badge: 'Coming soon',
        },
      },
    ],
  },
];

/**
 * A lenyíló alján futó külön sáv: a webshop-integráció + a támogatott
 * boltmotorok logója. Nem csoportelem, mert nem választható megoldás, hanem az
 * a feltétel, amitől a többi működik – a két logó pedig azonnal megválaszolja a
 * leggyakoribb néma kérdést („az én rendszeremmel működik?").
 */
export const NAV_INTEGRATION = {
  page: 'webshopIntegration' as PageKey,
  icon: 'storefront',
  logos: [
    { src: '/assets/unas_logo.png', alt: 'Unas' },
    { src: '/assets/shoprenter-logo.png', alt: 'Shoprenter' },
  ],
  hu: { label: 'Webshop mélyintegráció' },
  en: { label: 'Deep store integration' },
} as const;

/**
 * A "Megoldások" menü csoportjai egy adott nyelven.
 *
 * ⚠️ **Az adott nyelven nem létező oldalak kiesnek** (`pathFor` üres stringet ad,
 * ha a `routes.ts`-ben `null` az érték – ilyen a csak magyarul élő ChatGPT
 * hirdetéskezelő). Enélkül az angol menübe egy `href=""` kerülne, ami a saját
 * oldalára navigál vissza. Ha egy csoport így kiürül, maga a csoport is kimarad.
 */
export function navGroupsFor(locale: Locale): NavGroup[] {
  return NAV_GROUPS.map((g) => ({
    label: g[locale],
    href: g.page ? pathFor(g.page, locale) : undefined,
    items: g.items
      .map((i) => ({
        icon: i.icon,
        href: pathFor(i.page, locale),
        label: i[locale].label,
        desc: i[locale].desc,
        badge: i[locale].badge,
      }))
      .filter((i) => i.href !== ''),
  })).filter((g) => g.items.length > 0);
}

/**
 * Ugyanaz lapos listaként (lábléc "Megoldások" hasáb), a csoportok sorrendjében,
 * plusz a lenyíló alján futó integrációs sáv.
 *
 * **Duplikátumszűrés kell:** a blogcikk író két csoportban is szerepel, a
 * láblécben viszont egyszer akarjuk látni. A kulcs a link ÉS a címke együtt –
 * így a Shopgrade két külön néven futó bejegyzése (termékleírás / kategóriaoldal)
 * megmarad, hiába visz mindkettő ugyanarra az oldalra.
 */
export function navModulesFor(locale: Locale): NavModule[] {
  const out: NavModule[] = [];
  const seen = new Set<string>();

  // 1. A menü elemei + az integrációs sáv. A blogcikk író két csoportban is ott
  //    van, ezért kell a link+címke kulcs; a Shopgrade két bejegyzése viszont
  //    külön címkével fut, tehát megmarad mind a kettő.
  const listed = [
    ...navGroupsFor(locale).flatMap((g) => g.items),
    {
      icon: NAV_INTEGRATION.icon,
      href: pathFor(NAV_INTEGRATION.page, locale),
      label: NAV_INTEGRATION[locale].label,
      desc: '',
    },
  ];
  for (const item of listed) {
    const key = `${item.href}|${item.label}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }

  // 2. Amit a menü nem sorol fel, de van saját kampányoldala (ma: nemzetközi
  //    terjeszkedés) – hogy egy indexelhető oldal se maradjon belső hivatkozás
  //    nélkül, még ha a fejlécből ki is vettük.
  const linked = new Set(out.map((i) => i.href));
  for (const m of MODULES) {
    if (!m.page) continue;
    const href = pathFor(m.page, locale);
    if (!href || linked.has(href)) continue;
    linked.add(href);
    out.push({ icon: m.icon, href, label: m[locale].title, desc: m[locale].desc });
  }

  return out;
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
