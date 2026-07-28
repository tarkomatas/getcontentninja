# Terv: az űrlapok küldjenek közvetlenül az appnak (Make kivezetése)

> **Mire válasz:** `Content Ninja/docs/honlap-urlap-kuldes-feladat.md` (a feladat leírása, az app-oldali
> csapattól). Ez a doksi a **honlap-oldali megvalósítás terve** — mit építünk, milyen sorrendben, és
> mikor tekintjük késznek. Kód még nem készült hozzá.
>
> **Elfogadott döntés (megrendelő):** a Make **teljeskörűen kivezetésre kerül** — nem lesz átmeneti
> párhuzamos küldés (lásd [7. Élesítés](#7-élesítés-és-visszagörgetés), ahol ezt pilot-oldallal váltjuk ki).
>
> **Állapot: KÉSZ (kódban).** Mind a 16 űrlap átállt, a Make-hívás sehol nincs a repóban. A `docs`-ban
> maradt terv innentől a *miért így* dokumentációja; a napi működést a `CLAUDE.md` írja le. Ami hátra van:
> az élő ellenőrzés a [6. Tesztlista](#6-tesztlista-a-feladat-doksi-8-honlap-oldali-vetülete) szerint, és a
> Make-forgatókönyv leállítása (megrendelői feladat).

## 1. Mit kell elérni

Ma mind a 16 űrlap a `https://hook.eu1.make.com/ihohtlulor66lvhouyoty9azbut7lzx7` webhookra küld.
Helyette:

```
POST https://app.getcontentninja.com/api/leads/intake
```

A legfontosabb elvárás a briefből: **soha ne vesszen el beküldés.** Inkább menjen el kétszer — az app a
`submission_id` alapján kiszűri a duplikátumot.

Ehhez a honlapnak három új dolgot kell tudnia, amit ma nem tud:

1. **`submission_id`** (kliensen generált UUID) — enélkül nincs idempotencia, tehát nincs biztonságos újraküldés.
2. **Kliens-oldali retry-sor** — hálózati hiba / offline / 5xx esetén a beküldés `localStorage`-ba kerül,
   és a következő oldalbetöltéskor magától újramegy, **ugyanazzal az id-vel**.
3. **`nyelv` + `website` (honeypot)** mező minden űrlapon.

## 2. Kiindulási állapot (mért, nem becsült)

| Tény | Részlet |
| --- | --- |
| A webhook-URL **44 helyen** van beégetve, **16 fájlban** | 14 lead-oldal × 3 ág (hard reject / soft reject / sikeres) + 2 kapcsolat-oldal × 1 |
| A küldő-logika teljes másolat oldalanként | `qualifyAndNext()`, `submitSoftReject()`, a `submit` handler — csak a `lead_forras`, a minősítő mezőnevek, a tárgy-emoji és a nyelvi szövegek térnek el |
| **Hiányzó `lead_forras`** | `src/pages/hu/posztolas.astro` és `src/pages/en/demo.astro` — egyik ágban sincs (a brief is jelzi; pótlandó: `posztolas`) |
| **Nincs `nyelv`** a lead-űrlapokon | csak a kapcsolat-űrlap küldi (`kapcsolat.astro:242`, `contact.astro`) |
| **Nincs honeypot, nincs `submission_id`** sehol | |
| A duplikáció-védelem `sessionStorage` | `<téma>_form_submitted` kulcsok. **A CLAUDE.md ezt ma tévesen `localStorage`-ként dokumentálja** — javítandó |
| A HU és EN oldalpár **ugyanazt a kulcsot** használja | pl. `shopgrade_form_submitted` mindkettőn; a posztolás/demo párosé ráadásul a régi `ai_tartalomgyartas_form_submitted` |
| A hiba **elnyelődik** | a lead-űrlapok `catch`-e üres, és siker nélkül is a köszönőoldalra visznek → néma lead-vesztés (a kapcsolat-űrlap az egyetlen, ami hibaüzenetet mutat) |

**Az app-oldal kész**, ellenőriztem a fogadó végpontot (`src/app/api/leads/intake/route.ts` az app repóban):
`OPTIONS` + CORS-allowlist megvan (`getcontentninja.com`, `www.`, `contentninja.hu`, `www.`,
`http://localhost:4321`), a `text/plain` törzs elfogadott, a nyers mentés a válasz előtt történik, a
feldolgozás `after()`-ben. A **hírlevél-feliratkozást is az app intézi** (`onNewsletterOptInFromLead`) —
tehát a Make leállításával ez nem esik ki. Ez volt a brief egyetlen nyitva hagyott „mit csinál még a Make"
kockázata a honlap felől.

⚠️ Egy fontos részlet: ha nem küldünk `submission_id`-t, **a szerver generál egyet** — ilyenkor viszont
nincs duplikátum-szűrés. Az idempotencia tehát **kizárólag** azon múlik, hogy mi küldjük.

## 3. Célarchitektúra — négy új fájl, egy forrás

A minta a már bevált `src/data/modules.ts` → `ModuleGrid.astro` felállás: **adat egy helyen, kirakás
egy helyen.**

```
src/data/forms.ts             ← az egyetlen igazságforrás: endpoint, lead_forras-ok, minősítő mezők
src/components/IntakeClient.astro ← a "szállítás": window.cnIntake (send + retry-sor), BaseLayout-ba
src/components/LeadFormScript.astro ← a többlépcsős lead-űrlap logikája, oldalanként paraméterezve
src/components/HoneypotField.astro  ← a rejtett `website` input
```

### 3.1 `src/data/forms.ts`

```ts
export const INTAKE_ENDPOINT = 'https://app.getcontentninja.com/api/leads/intake';

export type FormSource =
  | 'posztolas' | 'online-bemutato' | 'hirlevel' | 'shopgrade'
  | 'nemzetkozi' | 'blogcikk-iro' | 'webshop-integracio' | 'kapcsolat';

/** Oldalanként eltérő minősítő mezők: DOM-id → payload-kulcs. */
export const QUALIFIERS: Record<FormSource, Record<string, string>> = { … };
```

Ide kerül a téma → `lead_forras` leképezés is. **Az EN oldal is a magyar kulcsot küldi**
(`/en/shopgrade` → `shopgrade`), a nyelvet a `nyelv` mező hordozza — így egy szűrővel látszik a téma
összes érdeklődője.

### 3.2 `IntakeClient.astro` — a mentőöv

`is:inline` script a `BaseLayout` végén (a `cookie.js` mellett), **minden oldalon** — beleértve a
köszönőoldalakat. Ez a kulcs: a sikeres beküldés után azonnal átirányítunk, tehát a retry-sort **a
köszönőoldalnak kell leürítenie**.

Publikál egy globált:

```js
window.cnIntake.send(payload)   // → { ok, duplicate?, retryable }
```

Amit csinál:

1. `payload.submission_id ||= crypto.randomUUID()` (fallback nem-secure kontextusra).
2. **Küldés előtt** beteszi a sorba: `localStorage['cn_intake_queue_v1']`.
3. `fetch(INTAKE_ENDPOINT, { method:'POST', keepalive:true, headers:{'Content-Type':'application/json'}, body })`.
4. A válasz szerint (a feladat-doksi §4 táblája alapján):

   | Válasz | Teendő |
   | --- | --- |
   | `200 {ok:true}` / `duplicate:true` | ki a sorból, kész |
   | `200 {skipped:"invalid_json"}` / `413` | ki a sorból — **nem** retry-zunk, ez kódhiba |
   | `500 storage_failed`, hálózati hiba, timeout | **marad a sorban** |

5. `flush()` — `DOMContentLoaded`-kor és `online` eseménykor újraküldi a bent maradtakat, **ugyanazzal az
   id-vel**. Max. ~5 próbálkozás elemenként, 3 napnál régebbi elemek takarítása.
6. Lapelhagyáskor (`visibilitychange` → `hidden`) a sorban maradtakra `navigator.sendBeacon` (`text/plain`
   törzs — az app ezt is fogadja).

**Időzítés a sikeres ágon:** nem várjuk meg a választ korlátlanul. `Promise.race(fetch, 2s timeout)` →
utána mindenképp megy az átirányítás a köszönőoldalra. Ha a válasz beért, kikerül a sorból; ha nem, a
`keepalive` miatt a kérés így is elmegy, és a köszönőoldal `flush()`-a lezárja a kört. A felhasználó
**semmilyen esetben nem vár és nem lát hibát** a lead-ágon.

### 3.3 `LeadFormScript.astro`

A ma 14-szer lemásolt űrlaplogika egy fájlban. Props: `locale`, `source`, opcionálisan a hard/soft reject
szabályok és a tárgy-előtag.

Fontos megkötés: a `nextStep()` / `qualifyAndNext()` / `submitSoftReject()` függvényeket az `onclick`
attribútumok hívják, tehát **globálisnak kell maradniuk** → a script `is:inline` marad, a konfigurációt
`define:vars` adja át (a `define:vars` amúgy is implicit inline-osít). Ha ES-modulra váltanánk, az összes
`onclick` elszállna — ez a repo CLAUDE.md-jében is rögzített csapda.

A payload-építés így egy helyre kerül; a három ág (`hard_reject`, `soft_reject`, `sikeres`) ugyanazt a
`window.cnIntake.send()`-et hívja.

### 3.4 Minősítés-emlékezet (a mai „Már elküldve" zár helyett)

**Megrendelői döntés:** a cél nem a duplikátum megakadályozása (azt az app már megoldja `submission_id`
alapon), hanem az, hogy **a kiszűrt látogató ne tudja újratölteni az oldalt és más válaszokkal átcsúszni**
a minősítésen.

A mai `sessionStorage['<téma>_form_submitted']` zár erre alkalmatlan: a *beküldés* gombot tiltja, a
minősítő kérdéseket nem, és fülbezárásig él. Helyette:

- `localStorage['cn_qualify_v1']` → `{ "<lead_forras>": { outcome: "hard_reject" | "soft_reject", at: "<ISO>" } }`
- A minősítés **kimenetét** rögzítjük, amint megszületik (nem a beküldést)
- Oldalbetöltéskor: ha az adott témára van érvényes `hard_reject` bejegyzés, az űrlap **egyből a lezáró
  lépésen nyílik** — a kérdésekhez vissza sem lehet lépni. `soft_reject` esetén a soft-reject lépés jön
  (ha ott már otthagyta az e-mailjét, a köszönő-állapot)
- **Érvényesség: 30 nap**, utána újra kitöltheti (fél év múlva már lehet, hogy tényleg van webshopja)
- **Hatókör: témánként**, nem az egész oldalra. Aki a shopgrade-en kiesett, a hírlevél-oldalon még
  próbálkozhat — egy félrekattintás ne zárja ki a teljes honlapról

A **sikeres** beküldés után nincs többé zár: a gomb csak a küldés idejére tiltódik (dupla kattintás ellen).
Aki elgépelte a telefonszámát, újraküldheti — az app a `submission_id` alapján egy leadként kezeli.

> **Őszintén a korlátairól:** ez kliens-oldali emlékezet, tehát inkognitó ablakkal vagy a böngésző
> tárhelyének törlésével megkerülhető. Nem is lehet másképp: a honlap statikus, nincs bejelentkezés, amihez
> köthetnénk. A cél a **súrlódás** — hogy ne a véletlen újratöltés vigye át a kiszűrt látogatót —, nem a
> szándékos megkerülés kizárása.

### 3.5 `HoneypotField.astro`

Valódi `<input name="website">`, **nem** `type="hidden"` (azt a botok kiszűrik): `position:absolute;
left:-9999px`, `tabindex="-1"`, `autocomplete="off"`, `aria-hidden="true"`. Az osztály a
`src/styles/global.css`-be kerül (`.hp-field`), a mező mindhárom űrlaptípusra.

## 4. A küldött payload

A mai magyar mezőnevek **maradnak**, csak bővülnek. Minden beküldésben:
`submission_id`, `statusz`, `lead_forras`, `nyelv`, `source_url`, `submission_date`, `website` (üres),
és ahol van kötelező adatkezelési checkbox, ott **`adatkezeles: "Igen"`** (a hozzájárulás naplózásához;
a `hard_reject` ágban nincs, mert ott nincs checkbox).

Ágankénti mezők változatlanul: `sikeres` → `nev`/`email`/`telefonszam`/`hirlevel_feliratkozas` + minősítők;
`soft_reject` → `email`/`hirlevel_feliratkozas` + minősítők; `hard_reject` → csak minősítők;
`kapcsolat` → `nev`/`email`/`uzenet`/`subject`.

A minősítő válaszok **teljes mondatok maradnak** (`"Igen, van működő webshopom"`) — nem kódoljuk enumra.

## 5. Munkafázisok

### F0 — Alapok (kód, még nulla oldal átállítva)

- `src/data/forms.ts`, `IntakeClient.astro`, `LeadFormScript.astro`, `HoneypotField.astro`
- `IntakeClient` bekötése a `BaseLayout`-ba, `.hp-field` a `global.css`-be
- **Kész, ha:** `npm run build` hibátlan, és a konzolból kézzel hívott `window.cnIntake.send({...})`
  megjelenik az app admin **Beküldések** nézetében.

### F1 — Pilot: egy oldalpár (`/hu/online-bemutato` + `/en/book-demo`)

A legrövidebb űrlapfájlok (765 sor), és ez a fő „Bemutatót kérek" landing — itt látszik leghamarabb, ha baj van.

- A Make-hívás **törölve**, helyette `cnIntake`
- Mind a három ág + honeypot + `nyelv` + `submission_id`
- **Kész, ha:** élesben mindhárom ág átmegy, az admin nézetben látszik a forrás/nyelv/nyers JSON, és
  megjön a belső e-mail a `support@`-ra. **Ezt megvárjuk, mielőtt a többi oldalhoz nyúlnánk.**

### F2 — A maradék 6 lead-téma (12 oldal)

`posztolas`/`demo` · `hirlevel`/`newsletter` · `shopgrade` · `nemzetkozi`/`international` ·
`blogcikk-iro`/`blog-writer` · `webshop-integracio`/`store-integration`

Ezzel együtt javítandó:

- **`lead_forras: 'posztolas'` pótlása** a posztolás/demo páron (ma teljesen hiányzik)
- **A régi `sessionStorage` zár leváltása** a 3.4 szerinti minősítés-emlékezetre — ezzel eltűnik a maradék
  `ai_tartalomgyartas_form_submitted`, és megszűnik az is, hogy a HU és EN oldalpár közös kulcson kizárja
  egymást
- A shopgrade / blogcikk-író / nemzetközi eltérő minősítői (`product_count`, `blog_frequency`, `markets`)
  a `forms.ts`-ből jönnek, nem beégetve

### F3 — Kapcsolat-űrlap (2 oldal)

Rövidebb ág: nincs átirányítás, marad a mai inline siker-/hibablokk. A `cnIntake` retryable válasza itt
**látható hibaüzenetet** kap (ez ma is így van), de a sorba akkor is bekerül.

### F4 — Takarítás és dokumentáció

- Ellenőrzés: `grep -r "hook.eu1.make.com" src/` → **nulla találat**
- `CLAUDE.md` „Lead form flow" szakasz újraírása (endpoint, `submission_id`, retry-sor, honeypot), és a
  téves `localStorage` → `sessionStorage` javítása
- A Make-forgatókönyv **leállítása, nem törlése** (megrendelői feladat, appon kívül)
- Mérlegelendő: az adatkezelési tájékoztatóba egy mondat arról, hogy a be nem küldött űrlapadat átmenetileg
  a böngésző `localStorage`-ában marad (funkcionális tárolás, nem sütiengedély-köteles, de tisztább kimondani)

## 6. Tesztlista (a feladat-doksi §8 honlap-oldali vetülete)

- [ ] Mind a 16 oldalról átmegy a beküldés élesben
- [ ] Mind a 4 `statusz` ág: megjelenik az admin Beküldések nézetben **és** megjön a belső e-mail
- [ ] A CORS-preflight átmegy valódi böngészőből a `getcontentninja.com`-ról (nincs konzol-hiba)
- [ ] `npm run dev` (localhost:4321) → szintén átmegy (az allowlistán rajta van)
- [ ] Hálózat kikapcsolva → beküldés → a felhasználó a köszönőoldalra jut, a sor tartalmazza a beküldést
- [ ] Hálózat vissza → oldalbetöltés → magától felmegy, **egy** sorral és **egy** levéllel (ugyanaz az id)
- [ ] Ugyanaz a beküldés kétszer (retry szimuláció) → `duplicate:true`, nincs második levél
- [ ] Honeypot kitöltve (konzolból) → az app spamnek jelöli, nincs lead
- [ ] Hard reject (nincs benne e-mail/név) → nem hasal el
- [ ] Hard reject → oldal újratöltése → **egyből a lezáró lépés jön**, a kérdésekhez nem lehet visszalépni
- [ ] Soft reject → újratöltés → a soft-reject lépés jön (ha már megadta az e-mailjét, a köszönő-állapot)
- [ ] Másik téma oldalán (pl. shopgrade után a hírlevélen) **továbbra is kitölthető** az űrlap
- [ ] Sikeres beküldés után az űrlap **újra kitölthető** (nincs „Már elküldve" zár), és egy leadként landol
- [ ] `?type=ld` (lp-mód) és UTM-es URL → a `source_url` a teljes query-t viszi
- [ ] EN oldal → `nyelv: 'en'`, de a `lead_forras` a magyar kulcs
- [ ] Régi domainről (`contentninja.hu` redirect) érkező látogató beküldése is átmegy

## 7. Élesítés és visszagörgetés

A brief eredetileg 1-2 nap **párhuzamos küldést** javasolt (Make + app egyszerre), hogy a két oldal
összevethető legyen. A megrendelői döntés szerint a Make teljeskörűen kivezetésre kerül, ezért ezt
**az F1 pilot-fázis váltja ki**: egy oldalpár megy át előbb, azt élesben ellenőrizzük, és csak utána jön a
többi 14. Így a kockázat egy oldalpárra korlátozódik, párhuzamos küldés nélkül.

**Visszagörgetés:** minden fázis külön commit, tehát egy `git revert` visszaállítja a Make-hívást. Ezért is
fontos, hogy a Make-forgatókönyv leállítva, de **bekapcsolható** állapotban maradjon.

Deploy: push `main`-re → GitHub Actions (a repo szokásos menete).

## 8. Kockázatok

| Kockázat | Kezelés |
| --- | --- |
| Nincs párhuzamos küldés → ha az app-oldal hibázik, az élő leadek érintettek | F1 pilot egy oldalpáron, élő ellenőrzés az admin nézetben, commitonkénti revert |
| `crypto.randomUUID` nem secure kontextusban nem elérhető | fallback UUID-generátor (élesben https, dev-ben localhost — mindkettő secure, ez csak öv+nadrágtartó) |
| A `keepalive` fetch törzse böngészőnként max. 64 kB | a payloadjaink ~1 kB — nem korlát |
| Reklámblokkolók blokkolhatják a más-domainre menő XHR-t | a cél saját aldomain (`app.getcontentninja.com`), nem tracker-lista; a retry-sor + `sendBeacon` a tartalék |
| A retry-sor személyes adatot tárol a böngészőben | rövid TTL (3 nap), sikeres küldés után azonnali törlés, említés az adatkezelési tájékoztatóban |

## 8/a. Amit a megvalósítás közben találtunk

1. **A `define:vars` IIFE-be csomagolja az inline scriptet.** Az `is:inline` önmagában kevés volt: a
   `qualifyAndNext()` és társai így nem lettek globálisak, és **az összes `onclick` némán elszállt** — az
   űrlap első lépésén megrekedt. A `LeadFormScript` ezért kézzel teszi ki a három függvényt a `window`-ra.
   Ezt egy jsdom-os füstteszt fogta ki, nem a build (a build hibátlan volt). A csapda bekerült a `CLAUDE.md`-be.
2. **HU/EN eltérés a kiszűrésben (korábbi, nem most keletkezett).** A `shopgrade` és a
   `webshop-integracio` **angol** oldalán a „csak tervezek webshopot indítani" válasz nem soft reject,
   a magyaron igen. A migráció ezt **változatlanul hagyta** (nem akartunk némán lead-minősítést
   átszabni). A `data-reject` attribútummal ez már egy sor, ha egységesíteni akarjuk — döntés kérdése.
3. **A hírlevél-feliratkozást az app intézi** (`onNewsletterOptInFromLead`), tehát a Make leállításával
   nem esik ki — ez volt a brief egyetlen nyitva hagyott kockázata a honlap felől.

## 9. Eldöntött kérdések (megrendelői válaszok)

1. **Ágankénti köszönőoldalak: NEM.** A soft és a hard reject marad az oldalon belüli, inline lezárás,
   ahogy ma. A feladat-doksi §6 javaslata ezzel tudatosan elutasítva.
2. **A minősítés-zár megmarad, de új alapon.** A cél nem a duplikátum, hanem hogy a kiszűrt látogató ne
   tudja újratöltéssel, más válaszokkal végigpróbálni az űrlapot → lásd [3.4](#34-minősítés-emlékezet-a-mai-már-elküldve-zár-helyett).
   A sikeres beküldés utáni „Már elküldve" tiltás ezzel együtt kiesik.
3. **A régi, forrás nélküli beküldésekhez nem kell visszamenőleg pótolni** a `lead_forras`-t — elég, hogy
   mostantól helyes.
