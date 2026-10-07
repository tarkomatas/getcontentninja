import type { Locale, PageKey } from '../i18n/routes';
import { pathFor } from '../i18n/routes';
import { platformsWith } from './platforms';

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
      desc: 'Az AI a termékeidből posztokat ír, képet és videót készít hozzájuk, majd időzítve publikálja Facebookra, Instagramra és TikTokra.',
    },
    en: {
      title: 'Automated posting',
      desc: 'The AI writes posts from your products, creates images and videos for them, then publishes them on a schedule to Facebook, Instagram and TikTok.',
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
      desc: 'Az Unas, Shoprenter vagy WooCommerce áruházad bekötve: az AI látja az összes terméked és blogcikked, és mindig friss adatokból dolgozik.',
    },
    en: {
      title: 'Deep store integration',
      desc: 'With your Unas, Shoprenter or WooCommerce store connected, the AI sees all your products and blog posts, and always works from fresh data.',
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
      desc: 'A termékfotóidból és egy rövid utasításból akár 30 másodperces termékvideót készít – álló, négyzetes vagy fekvő formátumban.',
    },
    en: {
      title: 'AI video generator',
      desc: 'Turns your product photos and a short instruction into product videos of up to 30 seconds – in portrait, square or landscape format.',
    },
  },
  {
    id: 'narration',
    icon: 'record_voice_over',
    hu: {
      title: 'Narrátorvideó',
      desc: 'Terméklinkből vagy blogcikkből kész videót készít – AI hanggal, felirattal, beszélő szereplővel és mozgó grafikával.',
    },
    en: {
      title: 'Narrated video',
      desc: 'Builds a finished video from a product link or blog post – with an AI voice, captions, a speaking presenter and motion graphics.',
    },
  },
  {
    id: 'metaAds',
    icon: 'ads_click',
    // Csak magyarul van oldala (`metaAds` → `en: null`), az EN kártya link nélküli.
    page: 'metaAds',
    hu: {
      title: 'Meta hirdetések',
      desc: 'Facebook és Instagram hirdetési kreatívok és szövegek automatikusan, a termékadataidból. Hamarosan a posztjaid kiemelésével is.',
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
  /** Még nem élő funkció: a menü „Hamarosan" jelvényt tesz mellé. */
  soon?: boolean;
}

export interface NavGroup {
  label: string;
  /** A csoportcím linkje (gyűjtőoldal), ha van. */
  href?: string;
  /** A két hasáb ALATT, teljes szélességben fut, az elemei egymás mellett. */
  wide?: boolean;
  items: NavModule[];
}

interface NavItemDef {
  page: PageKey;
  icon: string;
  soon?: boolean;
  hu: { label: string; desc: string };
  en: { label: string; desc: string };
}

interface NavGroupDef {
  hu: string;
  en: string;
  /** A csoportcím maga is vihet egy gyűjtőoldalra. */
  page?: PageKey;
  wide?: boolean;
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
 * - A **leírás EGY sor** (user-kérés, 2026-10-03): kb. 32 karakter, különben a
 *   lenyíló hasábjában két sorra törne (a fejléc `truncate`-tel le is vágja).
 * - A **hirdetéskezelés** csoport `wide`: a két hasáb alatt, teljes szélességben
 *   fut, a két eleme egymás mellett, „Hamarosan" jelvénnyel (`soon`).
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
        hu: { label: 'Blogcikk író', desc: 'Kulcsszókutatás + kész blogcikk' },
        en: { label: 'Blog writer', desc: 'Keyword research + full article' },
      },
      {
        page: 'shopgrade',
        icon: 'edit_document',
        hu: { label: 'Termékleírás író', desc: 'Egyedi leírás a gyártói helyett' },
        en: { label: 'Product description writer', desc: "Your own copy, not the maker's" },
      },
      {
        page: 'shopgrade',
        icon: 'category',
        hu: { label: 'Kategóriaoldal író', desc: 'Keresésre hangolt kategóriaszöveg' },
        en: { label: 'Category page writer', desc: 'Category copy tuned for search' },
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
        hu: { label: 'Automata posztolás', desc: 'Posztok a webshopod nevében' },
        en: { label: 'Automated posting', desc: 'Posts on behalf of your webshop' },
      },
      {
        page: 'newsletter',
        icon: 'mail',
        hu: { label: 'AI hírlevél küldés', desc: 'Megírja, megtervezi, kiküldi' },
        en: { label: 'AI newsletter sending', desc: 'Writes, designs and sends it' },
      },
      {
        page: 'blogWriter',
        icon: 'article',
        hu: { label: 'Blogcikk író', desc: 'Rendszeres cikk a blogodba' },
        en: { label: 'Blog writer', desc: 'Regular articles for your blog' },
      },
    ],
  },
  {
    hu: 'Hirdetéskezelés',
    en: 'Ad management',
    wide: true,
    items: [
      {
        // Csak magyarul (`metaAds` → `en: null`); a posztkiemelés még nem él.
        page: 'metaAds',
        icon: 'campaign',
        soon: true,
        hu: { label: 'Meta hirdetéskezelő', desc: 'Facebook- és Instagram-kiemelés' },
        en: { label: 'Meta ad manager', desc: 'Boost Facebook & Instagram posts' },
      },
      {
        // A cél-oldal csak magyarul van (`chatgptAds` → `en: null`), az EN menüből
        // a `navGroupsFor` szűrője veszi ki; a csoport ilyenkor elem nélkül marad,
        // és ki sem kerül. A „Hamarosan" jelvény 2026-10-03 óta a menüben is ott
        // van (user-kérés), nem csak a céloldalon.
        page: 'chatgptAds',
        icon: 'ads_click',
        soon: true,
        hu: { label: 'ChatGPT hirdetéskezelő', desc: 'Termékkampány a ChatGPT-ben' },
        en: { label: 'ChatGPT ad manager', desc: 'Product campaigns in ChatGPT' },
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
  // A webshop-motorok a közös platformlistából (mind szóvédjegy, ezért elég a kép).
  logos: platformsWith('products').map((p) => ({ src: p.logo, alt: p.name })),
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
    wide: g.wide,
    items: g.items
      .map((i) => ({
        icon: i.icon,
        href: pathFor(i.page, locale),
        label: i[locale].label,
        desc: i[locale].desc,
        soon: i.soon,
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
    soon: 'Hamarosan',
  },
  en: {
    details: 'Details',
    wholeSystem: 'See the full system',
    allSolutions: 'All solutions',
    soon: 'Coming soon',
  },
} as const;
