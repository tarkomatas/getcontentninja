import { defineConfig } from 'astro/config';

// Kanonikus domain. A régi contentninja.hu -> ide irányít (külső redirect).
// A sitemap.xml-t kézzel generáljuk (public/sitemap.xml) a teljes hreflang
// kontroll és a verzió-stabilitás miatt.
const SITE = 'https://getcontentninja.com';

export default defineConfig({
  site: SITE,
  // A GitHub Pages a könyvtár-alapú buildből MINDIG a záró perjeles URL-t
  // szolgálja ki (a perjel nélkülit 301-gyel odairányítja), ezért a canonical,
  // a hreflang, a sitemap és a belső linkek is a perjeles alakot használják
  // (`src/i18n/routes.ts`). Így egyetlen deklarált URL sem fut redirectbe.
  trailingSlash: 'always',
  // A /hu/aszf 2026 augusztusától VALÓDI magyar ÁSZF-oldal (src/pages/hu/aszf.astro),
  // ezért a korábbi /hu/aszf -> /en/terms/ átirányítás megszűnt. Ne tedd vissza.
  // A bemutató oldal új slugja /hu/posztolas — a régi /hu/bemutato ide redirectel.
  redirects: {
    '/hu/bemutato': '/hu/posztolas/',
    // A régi UNAS-slugok az új, általános webshop-mélyintegráció oldalra.
    '/hu/unas': '/hu/webshop-integracio/',
    '/en/unas': '/en/store-integration/',
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
