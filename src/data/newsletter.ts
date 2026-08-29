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
 * Melyik űrlapról jött a feliratkozás. Ebből látszik, melyik elhelyezés hoz
 * feliratkozót – az UTM-eket NEM külön mezőben küldjük, hanem a `source_url`
 * query-stringjéből olvassa ki az app.
 */
export type NewsletterSource =
  /** A `/hu/hirlevel-feliratkozas/` oldal hero-űrlapja. */
  | 'hirlevel_oldal'
  /** Ugyanannak az oldalnak a záró CTA-sávja. */
  | 'hirlevel_oldal_alja'
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
  hu: 'Kérem a Content Ninja hírlevelét: havonta 1 levél új funkciókról és tippekkel. Bármikor leiratkozhatok.',
  en: 'I would like to receive the Content Ninja newsletter: 1 email a month with new features and tips. I can unsubscribe at any time.',
};

/**
 * Újrapróbálkozás **ugyanazzal a `submission_id`-vel** (az adja az
 * idempotenciát, tehát a retry nem csinál duplikátumot). Csak 5xx-re és
 * hálózati hibára – a 4xx kliens-hiba, azt újrapróbálni értelmetlen.
 */
export const NEWSLETTER_MAX_ATTEMPTS = 3;
export const NEWSLETTER_RETRY_BASE_MS = 500;
