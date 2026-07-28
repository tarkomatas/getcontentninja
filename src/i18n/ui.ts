import type { Locale } from './routes';

/**
 * Megosztott chrome-szövegek (Header, Footer, cookie banner, nyelvváltó).
 * Az oldalankénti prózai tartalom NEM ide kerül — az a page-fájlokban él nyelvenként.
 */
export const UI = {
  hu: {
    htmlLang: 'hu',
    logoAlt: 'Content Ninja logó',
    nav: {
      aria: 'Főnavigáció',
      mobileAria: 'Mobil navigáció',
      menuAria: 'Menü',
      pricing: 'Árazás',
      testimonials: 'Vélemények',
      contact: 'Kapcsolat',
      // A "Megoldások" menü elemei (modulnév + egysoros leírás) a
      // `src/data/modules.ts`-ből jönnek, nem innen – egy modul = egy helyen.
      solutions: 'Megoldások',
    },
    cta: {
      login: 'Belépek',
      loginApp: 'Belépek az appba',
      demo: 'Bemutatót kérek',
      /** Rövid változat a mobil fejlécbe (landing módban ott is látszik a CTA). */
      demoShort: 'Bemutató',
    },
    footer: {
      tagline:
        'Egy AI-alapú rendszer, ami a webshopod nevében készít marketing tartalmakat – automatikusan, nonstop.',
      legalHeading: 'Jogi információk',
      contact: 'Kapcsolat',
      privacy: 'Adatkezelési tájékoztató',
      imprint: 'Impresszum',
      terms: 'ÁSZF (Terms of Service)',
      dataDeletion: 'Adatok törlése (Data Deletion)',
      startHeading: 'Kezdd el most',
      copyright: 'Copyright © getcontentninja.com | 2026',
    },
    cookie: {
      title: 'Sütiket (cookie-kat) használunk',
      body: 'a legjobb felhasználói élmény és analitikai mérések biztosításához (Meta Pixel).',
      link: 'Adatkezelési tájékoztató',
      accept: 'Elfogadom',
      reject: 'Elutasítom',
    },
    langSwitch: { label: 'English', flag: 'gb', aria: 'Switch to English' },
  },
  en: {
    htmlLang: 'en',
    logoAlt: 'Content Ninja logo',
    nav: {
      aria: 'Main navigation',
      mobileAria: 'Mobile navigation',
      menuAria: 'Menu',
      pricing: 'Pricing',
      testimonials: 'Reviews',
      contact: 'Contact',
      // A "Megoldások" menü elemei a `src/data/modules.ts`-ből jönnek.
      solutions: 'Solutions',
    },
    cta: {
      login: 'Log in',
      loginApp: 'Log in to the app',
      demo: 'Book a demo',
      /** Short variant for the mobile header (in landing mode the CTA shows there too). */
      demoShort: 'Demo',
    },
    footer: {
      tagline:
        'An AI-powered system that creates marketing content on behalf of your webshop – automatically, around the clock.',
      legalHeading: 'Legal',
      contact: 'Contact',
      privacy: 'Privacy policy',
      imprint: 'Imprint',
      terms: 'Terms of Service',
      dataDeletion: 'Data Deletion Instructions',
      startHeading: 'Get started now',
      copyright: 'Copyright © getcontentninja.com | 2026',
    },
    cookie: {
      title: 'We use cookies',
      body: 'to ensure the best user experience and analytics measurement (Meta Pixel).',
      link: 'Privacy policy',
      accept: 'Accept',
      reject: 'Decline',
    },
    langSwitch: { label: 'Magyar', flag: 'hu', aria: 'Váltás magyarra' },
  },
} as const;

export function t(locale: Locale) {
  return UI[locale];
}
