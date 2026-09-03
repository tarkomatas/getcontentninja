import type { Locale } from '../i18n/routes';

/**
 * A **hírlevél-feliratkozás** egyetlen igazságforrása (a `forms.ts` mintájára).
 *
 * Ez NEM a lead-űrlapok útja: a feliratkozás saját végpontra megy, mert az app
 * itt mást csinál (napló → megerősítő levél → csak megerősítés után MailerLite).
 * A meglévő 16 lead-űrlap változatlanul az `INTAKE_ENDPOINT`-ra küld, és
 * továbbra is a `hirlevel_feliratkozas` pipával viszi a hozzájárulást.
 *
 * A MailerLite API-kulcs SOHA nem kerülhet ebbe a repóba: a honlap statikus
 * (Astro + GitHub Pages), tehát nem tud titkot tartani – a kulcsot bárki
 * kiolvasná a forrásból. Ezért megy minden az appon keresztül.
 */
export const NEWSLETTER_ENDPOINT =
  'https://app.getcontentninja.com/api/newsletter/subscribe';

/**
 * 🟢 **KIKAPCSOLÓ – jelenleg `true`: a feliratkozás él.**
 *
 * Előzmény: 2026-08-29-én az app csapata jelezte, hogy a
 * `POST /api/newsletter/subscribe` még nem létezik, ezért az űrlapot
 * kikapcsoltuk (minden beküldés 404-re futott volna). A végpont azóta él.
 *
 * Amíg `false`:
 *   - a `NewsletterForm` NEM rendereli ki sem az űrlapot, sem a küldő scriptet
 *     (nem lehet olyan oldalt csinálni, ami véletlenül a semmibe küld),
 *   - a `/hu/hirlevel-feliratkozas/` oldal `noindex`,
 *   - és a `public/sitemap.xml`-ben ki kell kommentelni a bejegyzését.
 *
 * A kettőt **együtt** kell mozgatni: a flag és a sitemap-blokk.
 */
export const NEWSLETTER_LIVE = true;

/**
 * Melyik űrlapról jött a feliratkozás. Ebből látszik, melyik elhelyezés hoz
 * feliratkozót – az UTM-eket NEM külön mezőben küldjük, hanem a `source_url`
 * query-stringjéből olvassa ki az app.
 */
export type NewsletterSource =
  /** A `/hu/hirlevel-feliratkozas/` oldal hero-űrlapja. */
  | 'hirlevel_oldal'
  /** Ugyanannak az oldalnak a záró CTA-sávja. */
  | 'hirlevel_oldal_alja'
  /**
   * A `/hu/chatgpt-ads/` kampányoldal hero-űrlapja. A modul még nem éles, ezért
   * ott nem bemutatóra jelentkezik a látogató, hanem a hírlevelünkre iratkozik
   * fel – azon megy majd ki az indulás híre. Külön kulcs, hogy mérhető legyen,
   * hoz-e feliratkozót a „hamarosan" kampányoldal.
   */
  | 'chatgpt_ads'
  /** Lábléc-űrlap (minden oldalon) – még nincs kitéve. */
  | 'footer'
  /** Blogcikkek alja – még nincs kitéve. */
  | 'blog_alja';

/**
 * ⚠️ **A `consent_text` mező tartalma – és pontosan ez a mondat áll a gomb
 * fölött is.** Nem összefoglaló és nem azonosító: betűhű szöveg, mert ha egy év
 * múlva megkérdezik, mire mondott igent a feliratkozó, a napló önmagában
 * bizonyít – a mai szöveg addigra már más lehet.
 *
 * Ezért él EGY helyen: a `NewsletterForm.astro` ugyanezt a konstanst rendereli
 * ki a látogatónak ÉS küldi el a payloadban, tehát a kettő nem tud elcsúszni.
 * **Ha átírod, a látogató által látott szöveg is vele változik – ez a szándék.**
 */
export const NEWSLETTER_CONSENT_TEXT: Record<Locale, string> = {
  hu: 'Az e-mail címem megadásával feliratkozom a Content Ninja hírlevelére, és elfogadom az Adatkezelési tájékoztatót.',
  en: 'By providing my email address I subscribe to the Content Ninja newsletter and accept the Privacy Policy.',
};

/**
 * A fenti mondat azon SZÓ SZERINTI részlete, amit hivatkozásként rendereljük az
 * adatkezelési tájékoztatóra. A `NewsletterForm` ez mentén vágja három részre a
 * mondatot – így a látogató által látott szöveg **karakterre azonos** marad
 * azzal, amit naplózunk (a link nem változtat a szavakon), és nem kell a
 * mondatot kétszer leírni.
 *
 * Ha átírod a `NEWSLETTER_CONSENT_TEXT`-et, ügyelj rá, hogy ez a részlet
 * továbbra is szerepeljen benne – ha nem található, a komponens a mondatot
 * link nélkül írja ki, és külön sorban teszi ki a hivatkozást.
 */
export const NEWSLETTER_CONSENT_LINK_TEXT: Record<Locale, string> = {
  hu: 'Adatkezelési tájékoztatót',
  en: 'Privacy Policy',
};

/**
 * Újrapróbálkozás **ugyanazzal a `submission_id`-vel** (az adja az
 * idempotenciát, tehát a retry nem csinál duplikátumot). Csak 5xx-re és
 * hálózati hibára – a 4xx kliens-hiba, azt újrapróbálni értelmetlen.
 */
export const NEWSLETTER_MAX_ATTEMPTS = 3;
export const NEWSLETTER_RETRY_BASE_MS = 500;
