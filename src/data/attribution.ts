/**
 * Kampány-forrás (UTM) megjegyzése oldalváltáson át – az EGYETLEN igazságforrás.
 *
 * A gond, amit megold: az app a lead forrását a `source_url`-ből olvassa, az
 * pedig a BEKÜLDÉS oldala. Aki hírlevélből érkezik a főoldalra, és a
 * `/hu/online-bemutato/`-n tölt ki űrlapot, annak a `source_url`-jéből az UTM
 * már hiányzik. Ezért az ÉRKEZÉSKORI forrást egy első féltől származó sütiben
 * tartjuk, és a `cnIntake.send()` minden beküldéshez `attribution` mezőként
 * hozzáfűzi (`IntakeClient.astro`). A `source_url` jelentése NEM változik.
 *
 * A süti tartalma `{ first, last }`:
 *   - `last`  – minden új érkezés felülírja (ez hozta vissza végül a látogatót),
 *   - `first` – csak üresen íródik, utána SOHA.
 * Érkezés = olyan oldalbetöltés, amelynek URL-jében van legalább egy `ATTR_PARAMS`.
 * UTM nélküli látogatás (közvetlen, Google-találat, belső kattintás) semmit nem ír.
 *
 * Miért süti és nem localStorage: a `.getcontentninja.com` domainre írt sütit az
 * `app.getcontentninja.com` is kiolvashatja regisztrációkor – így a forrás az
 * app-regisztrációhoz is hozzáköthető, honlapmunka nélkül.
 *
 * ⚠️ Marketing-mérés → hozzájárulás-köteles. Hozzájárulás nélkül nem írjuk, és a
 * beküldés `{ first: null, last: null }`-t visz. Az adatkezelési tájékoztató
 * 10.2. pontja sorolja fel. Szerződés: az app repó UTM-briefje (2026-09-29).
 */
export const ATTR_COOKIE = 'cn_attr';

/** A süti `Domain=.getcontentninja.com`-mal megy ki (www + csupasz domain + app). Dev-ben host-only. */
export const ATTR_COOKIE_DOMAIN = 'getcontentninja.com';

/** 30 nap; minden új érkezés újraindítja. */
export const ATTR_MAX_AGE_S = 30 * 24 * 60 * 60;

/** Ezek közül legalább egy az URL-ben = érkezés. */
export const ATTR_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'fbclid',
] as const;

/** Mezőnkénti plafon (karakter), hogy a süti kicsi maradjon. */
export const ATTR_FIELD_MAX = 200;

/**
 * A süti kódolt hosszának plafonja. A böngésző a ~4 KB fölötti sütit szó nélkül
 * eldobja – e fölött előbb a `first`, majd a `last` hosszú mezőit (referrer,
 * landing_url) ürítjük, a kampány-paraméterek maradnak.
 */
export const ATTR_MAX_ENCODED = 3800;

/**
 * A süti-hozzájárulás localStorage-kulcsa. Ugyanez a literál áll a
 * `public/assets/cookie.js`-ben (az statikus fájl, nem importál) – a kettő együtt mozog.
 */
export const CONSENT_KEY = 'contentninja_cookie_consent_v1';
