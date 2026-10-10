// Márka-strukturált adat (schema.org WebSite + Organization) – EGY forrás.
//
// Miért kell: 2026 októberében a Google a találatokban a webhely neveként
// „getcontentninja.com”-ot írt ki, nem „Content Ninja”-t, és a magyar főoldal
// címéből levágta a márkanevet. Vagyis nem kötötte össze a nevet a domainnel –
// ezért nem jöttünk ki a „content ninja” keresésre. A Google a webhely nevét a
// főoldal `WebSite` adatából veszi (`name` + `alternateName`), a márkát pedig az
// `Organization`-ből (`logo`, `sameAs`).
//
// A `BaseLayout` a két nyelvi főoldalra (`page === 'home'`), a `src/pages/index.astro`
// a gyökérre teszi ki – mindkettő innen olvas, tehát nem tudnak elcsúszni.
// Új közösségi profilnál csak a `sameAs` listát kell bővíteni.

const SITE = 'https://getcontentninja.com/';

export const BRAND_NAME = 'Content Ninja';

export const brandJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE}#website`,
      name: BRAND_NAME,
      alternateName: ['ContentNinja', 'getcontentninja.com'],
      url: SITE,
      inLanguage: ['hu', 'en'],
      // Szándékosan NINCS `publisher: { '@id': …#organization }`: azzal az
      // Organization a WebSite alá ágyazódik, és a Google Rich Results Test nem
      // listázza önálló elemként (2026-10-08). Két független elem kell.
    },
    {
      '@type': 'Organization',
      '@id': `${SITE}#organization`,
      name: BRAND_NAME,
      alternateName: 'ContentNinja',
      url: SITE,
      logo: `${SITE}icon.png`,
      sameAs: [
        'https://www.facebook.com/profile.php?id=61582389145717',
        'https://www.instagram.com/contentninjahu/',
        'https://www.tiktok.com/@tamasmarko',
        'https://www.youtube.com/@ContentNinja_HU',
        'https://wordpress.org/plugins/content-ninja/',
      ],
    },
  ],
};
