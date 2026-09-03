# Teendők az app oldalán – `/hu/chatgpt-ads/` feliratkozás

**Kinek:** az app (`C:\DEV\Content Ninja`) csapatának · **Dátum:** 2026-09-03
**Honlap-oldali állapot:** ✅ kész, él a `main`-en (a `/hu/chatgpt-ads/` oldal hero-űrlapja)

A ChatGPT hirdetéskezelő modulhoz készült egy „hamarosan indul" kampányoldal. A modul még nem éles,
ezért az oldal nem bemutatóra jelentkeztet, hanem **értesítést kér az indulásról** — és ezt a
meglévő hírlevél-végponton (`POST /api/newsletter/subscribe`) küldi, `source_form: "chatgpt_ads"`
kulccsal. **Nem lead**: a lead-intake-re semmi nem megy erről az oldalról.

---

## 1. MailerLite-csoportok (ez a tényleges kérés)

| Feltétel | MailerLite group |
|---|---|
| Minden beküldés innen (`source_form === "chatgpt_ads"`) | **CN ChatGPT Ads érdeklődők** |
| ÉS ha `hirlevel_feliratkozas === true` | **Content Ninja érdeklődők** (is) |

- A csoport **nem vagylagos**: aki a hírlevelet is kéri, **mindkét** csoportba felkerül.
- A „CN ChatGPT Ads érdeklődők" csoportot létre kell hozni, ha még nincs.
- Aki csak az értesítést kéri (hírlevél-pipa nélkül), az **kizárólag** a ChatGPT Ads csoportba
  kerülhet — általános hírlevelet nem kaphat, mert arra nem adott hozzájárulást.

## 2. A payload, amit a honlap küld

```jsonc
{
  "submission_id": "uuid",              // idempotencia-kulcs, retry-nál ugyanaz
  "email": "anna@webshopom.hu",
  "source_form": "chatgpt_ads",         // ÚJ forráskulcs
  "source_url": "https://getcontentninja.com/hu/chatgpt-ads/?utm_...",
  "locale": "hu",
  "website": "",                        // honeypot – ha nem üres, bot

  // KÖTELEZŐ pipa. Az indulási értesítés jogalapja EZ, nem a hírlevél-hozzájárulás.
  "adatkezeles": true,
  "adatkezeles_consent_text": "Az Adatkezelési Tájékoztatóban foglaltakat elolvastam, megértettem és tudomásul vettem.",

  // OPCIONÁLIS pipa. Ha nincs bepipálva: false + consent_text: null.
  "hirlevel_feliratkozas": true,
  "consent_text": "Az e-mail címem megadásával feliratkozom a Content Ninja hírlevelére, és elfogadom az Adatkezelési tájékoztatót.",

  // Szűrőkérdések – ma valószínűleg eldobja a végpont, lásd §3.
  "has_webshop": "UNAS",                // UNAS | Shoprenter
  "timing": "Azonnal"                   // Azonnal | 1 hónapon belül
}
```

**Három dolog, ami eltér a `/hu/hirlevel-feliratkozas/` oldal payloadjától:**

1. **`consent_text` lehet `null`** — aki csak az értesítést kéri, nem adott hírlevél-hozzájárulást.
   A végpont ma feltehetően kötelezőnek veszi ezt a mezőt; ilyenkor az
   `adatkezeles_consent_text` a bizonyíték, és **azt** kell naplózni.
2. **`adatkezeles` + `adatkezeles_consent_text`** — új mezők, ma nem ismeri a végpont.
3. **`has_webshop` + `timing`** — új mezők, lásd lent.

## 3. Amit érdemes eltárolni

A `has_webshop` és a `timing` a napló-táblában értékes: ebből látszik, hány UNAS-os és hány
shoprenteres várja a modult, és mennyien akarnak *azonnal* indulni. Az indulási levél
szegmentálásához is ez kell. Ha a végpont ma eldobja az ismeretlen mezőket, ezek elvesznek.

## 4. Amit a honlap már kiszűr (nem kell az app oldalán kezelni)

A beküldés **el sem indul**, ha a látogató ezt választja:

- boltmotor: `Egyéb` vagy `Még nincs webshopom`
- időzítés: `2-3 hónapon belül` vagy `Még csak érdeklődöm`

Ilyenkor a honlap egy köszönő-kiszűrő képernyőt mutat, és **semmit nem küld el** — se
feliratkozás, se e-mail-tárolás. Vagyis az appba érkező minden `chatgpt_ads` beküldés eleve
UNAS/Shoprenter bolt, aki 1 hónapon belül indulna.

## 5. Kapcsolódó honlap-oldali fájlok

- [`src/pages/hu/chatgpt-ads.astro`](../src/pages/hu/chatgpt-ads.astro) — az oldal és az űrlap
- [`src/data/newsletter.ts`](../src/data/newsletter.ts) — a végpont + az új `chatgpt_ads` forráskulcs
- A modul specje az app repóban: `docs/features/chatgpt-ads.md`
