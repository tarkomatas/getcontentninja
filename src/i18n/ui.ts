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
      international: 'Nemzetközi',
      solutions: 'Megoldások',
      autoPosting: 'Automata posztolás',
      autoPostingDesc: 'AI-tartalom a webshopod nevében, nonstop',
      internationalExpansion: 'Nemzetközi terjeszkedés',
      internationalExpansionDesc: 'Több nyelven, több piacra egyszerre',
      unasIntegration: 'UNAS integráció',
      unasIntegrationDesc: 'Kösd be a webshopod, az AI látja a termékeid',
      newsletter: 'AI hírlevél',
      newsletterDesc: 'Az AI megírja, megtervezi és kiküldi a hírleveleid',
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
      international: 'International',
      solutions: 'Solutions',
      autoPosting: 'Automated posting',
      autoPostingDesc: 'AI content on behalf of your webshop, 24/7',
      internationalExpansion: 'International expansion',
      internationalExpansionDesc: 'Multiple languages, more markets at once',
      unasIntegration: 'Webshop integration',
      unasIntegrationDesc: 'Connect your store, the AI sees your products',
      newsletter: 'AI newsletters',
      newsletterDesc: 'The AI writes, designs and sends your newsletters',
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
