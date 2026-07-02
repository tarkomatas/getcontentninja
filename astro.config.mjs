import { defineConfig } from 'astro/config';

// Kanonikus domain. A régi contentninja.hu -> ide irányít (külső redirect).
// A sitemap.xml-t kézzel generáljuk (public/sitemap.xml) a teljes hreflang
// kontroll és a verzió-stabilitás miatt.
const SITE = 'https://getcontentninja.com';

export default defineConfig({
  site: SITE,
  // Trailing slash konzisztencia a GitHub Pages-hez.
  trailingSlash: 'ignore',
  // A régi magyar ÁSZF URL az új, kizárólag angol nyelvű Terms oldalra irányít.
  redirects: {
    '/hu/aszf': '/en/terms',
  },
  i18n: {
    defaultLocale: 'hu',
    locales: ['hu', 'en'],
    routing: {
      // Nincs default-locale nélküli útvonal: MINDKÉT nyelv prefixet kap (/hu/, /en/).
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [],
});
