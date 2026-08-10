import type { Locale } from '../i18n/routes';

/**
 * Az űrlap-beküldés EGYETLEN igazságforrása (a `modules.ts` mintájára).
 *
 * A honlap mind a 16 űrlapja ide küld – a korábbi Make.com webhook helyett.
 * A végpont, a `lead_forras` kulcsok és a belső levél tárgya KIZÁRÓLAG itt él;
 * az oldalak csak a `LeadFormScript` / `ContactFormScript` komponenst teszik ki.
 *
 * A fogadó oldal szerződését az app repó `docs/honlap-urlap-kuldes-feladat.md`
 * doksija írja le; a honlap-oldali terv: `docs/urlap-kuldes-terv.md`.
 */
export const INTAKE_ENDPOINT = 'https://app.getcontentninja.com/api/leads/intake';

/**
 * Az app **ingyenes termékleírás-diagnózisa** — a `termekleiras-diagnozis` opt-in
 * oldal csalija. A látogató sikeres beküldés után ide megy tovább (nem a
 * köszönőoldalra): egy opt-in oldal ígéretét azonnal be kell váltani.
 *
 * ⚠️ **Átadás (`handoff`) nélkül linkeljük, és ez szándékos.** Az app kínál egy
 * `POST /api/shopgrade-audit/handoff` végpontot, amivel a termékszám előre
 * kitölthető és az e-mail is átadható — de az `Authorization: Bearer <titok>`-ot
 * kér, és a titok **szerver-oldali**. Ez a honlap statikus (Astro, GitHub Pages,
 * nincs szerver), tehát a hívás csak a böngészőből mehetne, ami kiszivárogtatná a
 * titkot. Az app doksija (`docs/shopgrade-audit-landing-integracio.md`) kimondja,
 * hogy a diagnózis-oldal **átadás nélkül is működik** — a látogatónak csak eggyel
 * több kérdésre kell válaszolnia (a termékszámra), a leadet pedig mi amúgy is
 * elküldjük a saját `INTAKE_ENDPOINT`-unkra. Ha valaha kell az átadás, az app
 * oldalán kell egy böngészőből is hívható (origin-ellenőrzött, rate-limitelt)
 * változat — az `intake` végpont mintájára.
 */
export const AUDIT_START_URL = 'https://app.getcontentninja.com/shopgrade-audit';

/**
 * A beküldés forrása. **Az angol oldal is a magyar kulcsot küldi**
 * (`/en/shopgrade` → `shopgrade`) – a nyelvet a külön `nyelv` mező hordozza,
 * így egy szűrővel látszik a téma összes érdeklődője, nyelvtől függetlenül.
 */
export type FormSource =
  | 'posztolas'
  | 'online-bemutato'
  | 'teljes-rendszer'
  | 'hirlevel'
  | 'shopgrade'
  | 'termekleiras-diagnozis'
  | 'nemzetkozi'
  | 'blogcikk-iro'
  | 'webshop-integracio'
  | 'kapcsolat';

/**
 * A belső értesítő tárgya (`<előtag>: <név>`). Az app maga is épít tárgyat,
 * ezt a mezőt a visszafelé kompatibilitás miatt küldjük tovább.
 */
export const SUBJECT_PREFIX: Record<FormSource, Record<Locale, string>> = {
  posztolas: { hu: '🚀 Automata posztolás jelentkezés', en: '🚀 Automated posting lead' },
  'online-bemutato': { hu: '🚀 Bemutató jelentkezés', en: '🚀 Demo request' },
  // Ugyanaz az ajánlat, mint az `online-bemutato` — a külön kulcs csak azért
  // van, hogy az all-in-one kampány eredménye elkülönüljön az általános
  // bemutató-forgalomtól. Az app az ismeretlen forrást nyersen tárolja és
  // jeleníti meg; ha a kampány marad, érdemes felvenni az app oldalán a
  // `FORM_LABELS`/`PATH_TO_FORRAS` táblákba is.
  'teljes-rendszer': { hu: '🧩 Teljes rendszer jelentkezés', en: '🧩 All-in-one lead' },
  hirlevel: { hu: '✉️ Hírlevél jelentkezés', en: '✉️ Newsletter lead' },
  shopgrade: { hu: '✍️ Shopgrade jelentkezés', en: '✍️ Shopgrade application' },
  // Opt-in oldal az ingyenes diagnózisra. Külön kulcs, hogy elkülönüljön a
  // `shopgrade` bemutató-forgalomtól: itt a lead a csaliért jött, nem bemutatóért.
  'termekleiras-diagnozis': {
    hu: '🔍 Ingyenes diagnózis jelentkezés',
    en: '🔍 Free audit lead',
  },
  nemzetkozi: {
    hu: '🌍 Nemzetközi terjeszkedés jelentkezés',
    en: '🌍 International expansion application',
  },
  'blogcikk-iro': { hu: '📝 Blogcikk író jelentkezés', en: '📝 Blog writer lead' },
  'webshop-integracio': { hu: '🛒 Webshop integráció jelentkezés', en: '🛒 Store integration lead' },
  kapcsolat: { hu: '✉️ Kapcsolat űrlap', en: '✉️ Contact form' },
};

/**
 * A kliens-oldali retry-sor kulcsa. A be nem küldött beküldés itt várakozik,
 * amíg a következő oldalbetöltés (vagy `online` esemény) újra nem próbálja –
 * mindig UGYANAZZAL a `submission_id`-vel, ezért nem lesz belőle duplikátum.
 */
export const QUEUE_KEY = 'cn_intake_queue_v1';

/** A sorban álló beküldések maximális kora és próbálkozásszáma. */
export const QUEUE_MAX_AGE_MS = 3 * 24 * 60 * 60 * 1000;
export const QUEUE_MAX_ATTEMPTS = 5;

/**
 * A minősítés kimenetének emlékezete (a régi „Már elküldve” zár helyett).
 * Nem a beküldést, hanem a MINŐSÍTÉS EREDMÉNYÉT jegyzi meg, hogy a kiszűrt
 * látogató ne tudja újratöltéssel, más válaszokkal végigpróbálni az űrlapot.
 * Témánként (`lead_forras`) érvényes, hogy egy félrekattintás ne zárja ki a
 * teljes honlapról. Kliens-oldali emlékezet: inkognitóval megkerülhető – a cél
 * a súrlódás, nem a szándékos megkerülés kizárása.
 *
 * A kulcs VERZIÓSZÁMÁT akkor emeljük, ha a kiszűrés szabálya lazul: a régi
 * kimenetel különben 30 napig kizárva tartaná azt is, akit már átengednénk.
 * (v1 → v2: a „Külsős ügynökség" már nem hard reject.)
 */
export const QUALIFY_KEY = 'cn_qualify_v2';
export const QUALIFY_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
