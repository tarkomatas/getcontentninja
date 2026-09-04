# `/hu/chatgpt-ads/` feliratkozás – hogyan működik

**Állapot:** ✅ **él** (app-oldal élesítve 2026-09-04) · **Honlap:** `src/pages/hu/chatgpt-ads.astro`

Ez a fájl eredetileg teendő-brief volt az app csapatának; azóta megvalósult, ezért mostantól a
**megvalósult szerződést** rögzíti. Aki az űrlaphoz hozzányúl, ezt olvassa el előbb.

A ChatGPT hirdetéskezelő modul még nem éles, ezért az oldal nem bemutatóra jelentkeztet, hanem
**értesítést kér az indulásról** — és ezt a hírlevél-végponton (`POST /api/newsletter/subscribe`)
küldi, `source_form: "chatgpt_ads"` kulccsal. **Nem lead:** a lead-intake-re semmi nem megy erről
az oldalról, és a lead-adminban nem jelenik meg.

---

## 1. Mi történik a beküldéssel (app-oldal)

| Amit a látogató bepipált | Hová kerül |
|---|---|
| csak adatkezelés (kötelező) | **CN ChatGPT Ads érdeklődők** |
| adatkezelés + hírlevél | az Ads-csoportba **és** a hírlevél-listára |

⚠️ **A hírlevél-ág nem vakon az „érdeklődőkbe" tesz:** az app megnézi, ismeri-e a címet — meglévő
ügyfél az *előfizetők*, lejárt előfizetésű a *volt előfizetők* csoportba kerül. Így nem állítunk egy
fizető ügyfélről, hogy még nem fizetett elő. Aki csak az értesítést kérte, **általános hírlevelet nem
kap**.

A `has_webshop` és a `timing` **eltárolódik** — az indulási levél szegmentálható boltmotor és
időzítés szerint. A válaszlista bővíthető: az app az új értékeket is elfogadja, nem esik ki némán
semmi.

## 2. A payload, amit a honlap küld

```jsonc
{
  "submission_id": "uuid",              // idempotencia-kulcs, retry-nál ugyanaz
  "email": "anna@webshopom.hu",
  "source_form": "chatgpt_ads",
  "source_url": "https://getcontentninja.com/hu/chatgpt-ads/?utm_...",
  "locale": "hu",
  "website": "",                        // honeypot – ha nem üres, bot

  // KÖTELEZŐ pipa. Az indulási értesítés jogalapja EZ, nem a hírlevél-hozzájárulás.
  "adatkezeles": true,
  "adatkezeles_consent_text": "Az Adatkezelési Tájékoztatóban foglaltakat elolvastam, megértettem és tudomásul vettem.",

  // OPCIONÁLIS pipa. Ha nincs bepipálva: false + consent_text: null.
  "hirlevel_feliratkozas": true,
  "consent_text": "Az e-mail címem megadásával feliratkozom a Content Ninja hírlevelére, és elfogadom az Adatkezelési tájékoztatót.",

  "has_webshop": "UNAS",                // UNAS | Shoprenter
  "timing": "Azonnal"                   // Azonnal | 1 hónapon belül
}
```

**A válasz mindig `200 {"ok": true}`**, akkor is, ha a cím már fent volt a listán — különben az
űrlapból ki lehetne találni, ki szerepel rajta. `5xx` csak valódi mentési hibára jön; a honlap
kizárólag arra próbálkozik újra (3 próba, növekvő várakozás, ugyanazzal a `submission_id`-vel).

### ⚠️ A hírlevél-pipa a MONDATA nélkül nem ér semmit

Ha valaha `hirlevel_feliratkozas: true` menne `consent_text` nélkül, az app befogadja a beküldést
(az értesítést megkapja), de **hírlevélre nem írja fel** — bizonyíthatatlan hozzájárulásra nem megy
reklám. A mai kódban a két mező **ugyanabból a jelölőnégyzetből** származik, egy kifejezésben, tehát
nem tudnak elcsúszni. Ha valaki szétszedi őket, ezt a szabályt sérti meg.

## 3. Amit a honlap kiszűr (az appba el sem jut)

A beküldés **el sem indul**, ha a látogató ezt választja:

- boltmotor: `Egyéb` vagy `Még nincs webshopom`
- időzítés: `2-3 hónapon belül` vagy `Még csak érdeklődöm`

A szabályt a MARKUP hordozza (`<option data-reject="hard">`), mint a lead-űrlapokon — ha valaki
átfogalmaz egy választ, a szabály vele együtt mozog. Kiszűrés esetén köszönő-képernyő jön, és
**semmit nem küldünk el** (se feliratkozás, se e-mail-tárolás).

## 4. Történeti megjegyzés

Az app-oldali élesítés **előtt** beérkezett beküldések elvesztek: a végpont akkor még kötelezőnek
vette a hírlevél-pipát, és a pipa nélküli beküldéseket eldobta. Ezek a címek nem visszaszerezhetők.
A honlap kb. fél napig volt élesben ebben az állapotban (2026-09-03 este – 2026-09-04).

## 5. Kapcsolódó fájlok

- [`src/pages/hu/chatgpt-ads.astro`](../src/pages/hu/chatgpt-ads.astro) — az oldal és az űrlap
- [`src/data/newsletter.ts`](../src/data/newsletter.ts) — a végpont + a `chatgpt_ads` forráskulcs
- A modul specje az app repóban: `docs/features/chatgpt-ads.md`
