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
      features: 'Funkciók',
      how: 'Hogyan működik?',
      pricing: 'Árazás',
      testimonials: 'Vélemények',
    },
    cta: {
      login: 'Belépek',
      loginApp: 'Belépek az appba',
      demo: 'Bemutatót kérek',
    },
    footer: {
      tagline:
        'Egy AI-alapú rendszer, ami a webshopod nevében készít marketing tartalmakat – automatikusan, nonstop.',
      legalHeading: 'Jogi információk',
      privacy: 'Adatkezelési tájékoztató',
      imprint: 'Impresszum',
      terms: 'ÁSZF (Terms of Service)',
      dataDeletion: 'Adatok törlése (Data Deletion)',
      startHeading: 'Kezdd el most',
      copyright: 'Copyright © contentninja.hu | 2026',
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
      features: 'Features',
      how: 'How it works',
      pricing: 'Pricing',
      testimonials: 'Reviews',
    },
    cta: {
      login: 'Log in',
      loginApp: 'Log in to the app',
      demo: 'Book a demo',
    },
    footer: {
      tagline:
        'An AI-powered system that creates marketing content on behalf of your webshop – automatically, around the clock.',
      legalHeading: 'Legal',
      privacy: 'Privacy policy',
      imprint: 'Imprint',
      terms: 'Terms of Service',
      dataDeletion: 'Data Deletion Instructions',
      startHeading: 'Get started now',
      copyright: 'Copyright © contentninja.hu | 2026',
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
