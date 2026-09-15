import type { Locale } from '../i18n/routes';

/**
 * A támogatott webáruház-motorok és tartalomkezelők EGYETLEN forrása.
 *
 * Korábban az "Unas + Shoprenter" logópár 16 fájlban, 24 helyen volt kézzel
 * beégetve, ezért egy új integráció (WooCommerce, WordPress) mindenhol kézi
 * keresgélést jelentett. Innentől a logósorokat a `PlatformLogos.astro` rakja
 * ki ebből a listából, képesség szerint szűrve – új platformnál ELÉG EZT A
 * FÁJLT bővíteni. (A folyó szövegben – címek, GYIK – a platformnevek továbbra is
 * kézzel állnak, azokat egy új integrációnál a `platforms` szóra rákeresve kell
 * végignézni.)
 *
 * A képességjelzők az app tényleges tudását írják le (app repó:
 * `docs/features/woocommerce.md`, `wordpress.md`). Ha egy képesség még nem él,
 * a jelző `false` – ilyenkor a platform a hozzá tartozó logósorból is kimarad.
 *
 * A WooCommerce és a WordPress EGY kapcsolat az appban (a „Content Ninja"
 * WordPress-bővítménnyel): a Woo-bolt blogja maga a WordPress. Ezért a
 * blog-publikálásnál a WordPress áll, a WooCommerce nem.
 */
export type PlatformId = 'unas' | 'shoprenter' | 'woocommerce' | 'wordpress';

export type PlatformCapability =
  /** Termékek beolvasása: posztolás, hírlevél, képgenerálás, Meta-hirdetés. */
  | 'products'
  /** Shopgrade: termékleírás és kategóriaszöveg visszaírása a boltba. */
  | 'writeBack'
  /** Az ingyenes termékleírás-diagnózis (termekleiras-diagnozis oldal). */
  | 'audit'
  /** A Blogcikk író közvetlenül ide publikál. */
  | 'blog'
  /** A ChatGPT hirdetéskezelő termékfeedje. */
  | 'chatgptFeed';

export interface PlatformDef {
  id: PlatformId;
  name: string;
  logo: string;
  /**
   * A logófájl tartalmazza-e a nevet (szóvédjegy). Ha nem – a WordPress „W"
   * jele ilyen –, a `PlatformLogos` mellé írja a nevet, különben a sorban egy
   * felirat nélküli kör állna a többi szóvédjegy mellett.
   */
  wordmark: boolean;
  caps: Record<PlatformCapability, boolean>;
}

export const PLATFORMS: PlatformDef[] = [
  {
    id: 'unas',
    name: 'Unas',
    logo: '/assets/unas_logo.png',
    wordmark: true,
    caps: { products: true, writeBack: true, audit: true, blog: true, chatgptFeed: true },
  },
  {
    id: 'shoprenter',
    name: 'Shoprenter',
    logo: '/assets/shoprenter-logo.png',
    wordmark: true,
    caps: { products: true, writeBack: true, audit: true, blog: true, chatgptFeed: true },
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    logo: '/assets/woocommerce-logo.svg',
    wordmark: true,
    caps: { products: true, writeBack: true, audit: true, blog: false, chatgptFeed: true },
  },
  {
    id: 'wordpress',
    name: 'WordPress',
    logo: '/assets/wordpress-logo.svg',
    wordmark: false,
    caps: { products: false, writeBack: false, audit: false, blog: true, chatgptFeed: false },
  },
];

/** A platformok, amelyek tudják az adott képességet (képesség nélkül: a webshop-motorok). */
export function platformsWith(cap: PlatformCapability = 'products'): PlatformDef[] {
  return PLATFORMS.filter((p) => p.caps[cap]);
}

/** A platformnevek felsorolva, pl. „Unas, Shoprenter és WooCommerce". */
export function platformNames(locale: Locale, cap: PlatformCapability = 'products'): string {
  const names = platformsWith(cap).map((p) => p.name);
  if (names.length <= 1) return names.join('');
  const and = locale === 'hu' ? ' és ' : ' and ';
  return `${names.slice(0, -1).join(', ')}${and}${names[names.length - 1]}`;
}
