# WooCommerce + WordPress integráció – honlap-módosítási terv

*2026-09-15 · forrás: az app `docs/features/wordpress.md` és `docs/features/woocommerce.md` specje + a felhasználó válaszai*

> **Kiindulás:** a WooCommerce- és a WordPress-integrációt **élőnek vesszük**, a spec teljes hatókörével
> (a felhasználó döntése, 2026-09-15). Az app repóban ekkor a WordPress-kód kész volt, a WooCommerce-kód még nem –
> a honlap élesítésének időzítése üzleti döntés.

## Mit tud az integráció (ezt kommunikáljuk)

**Bekötés – EGY kapcsolat WordPressre és WooCommerce-re:** a saját **„Content Ninja" WordPress-bővítmény**.
Webcím → bővítmény telepítése → „Csatlakozás" → „Jóváhagyás" a WordPress-adminban → kész. Jelszót nem kell
másolni, tehát **a „pár kattintás" igaz**. Ha az oldalon WooCommerce fut, ugyanez a kapcsolat hozza a termékeket is.

| | Képességek |
|---|---|
| **WordPress** | a Blogcikk író **bármely saját tárhelyes WordPress oldalra** publikál (webshop nélkül is): kategória, képek a médiatárba, kiemelt kép, azonnal / időzítve / piszkozatként, Yoast / Rank Math cím + leírás. A WP-blogcikkekből és -oldalakból posztok készülnek. |
| **WooCommerce** | termékek → posztolás, hírlevél, képgenerálás, Meta-hirdetés (szűrés: kategória, csak készleten, legnépszerűbb / legfrissebb) · **Shopgrade visszaírás** (termékleírás, rövid leírás, kategória-leírás, Yoast / Rank Math) · kulcsszókutatás · **ChatGPT-hirdetés feed** · Search Console · **termékleírás-diagnózis** · több bolt vegyesen egy fiókban (Woo + Unas + Shoprenter) |

**Amit a honlap NE ígérjen:**
- **WordPress.com-on futó oldalt** – nem köthető be (csak saját tárhelyes WordPress).
- **Címkéket (tags), szerzőválasztást, WPML/Polylang-ot**, a termékvariációk mélyebb kezelését.
- **Ár vagy készlet visszaírását** a Woo-ba. (Az olvasás élő – a termékeket, az árat és a készletet minden
  használatkor a boltból kéri le –, tehát a „mindig friss adatokból dolgozik" állítás igaz.)
- **Bővítménytár-linket**, amíg a wordpress.org-beadás el nem készül (1–4 hét) – addig a súgóból tölthető le.

---

## 1. Egy forrás a platformoknak (első commit)

- **Új: `src/data/platforms.ts`** – `STORE_PLATFORMS`: `id`, `name`, `logo`, `alt` + képességjelzők (`products`,
  `writeBack`, `audit`, `blog`, `chatgptFeed`). Unas, Shoprenter és WooCommerce mindenben `true`; a **WordPress**
  csak `blog`. Így egy oldal a saját témájára szűrhet: a Blogcikk író logósorában ott a WordPress is, a Shopgrade-ében nem.
- **Új: `src/components/PlatformLogos.astro`** – a logósor, képesség szerinti szűréssel. Kiváltja a 24 kézi
  `unas_logo.png` + `shoprenter-logo.png` párt (16 fájlban).
- **`src/data/modules.ts`** – `NAV_INTEGRATION.logos` a `platforms.ts`-ből (a fejléc lenyílója minden oldalon) +
  a `storeIntegration` `desc`-je (101., 105. sor).
- **Új logók:** `public/assets/woocommerce-logo.svg`, `wordpress-logo.svg` (az app is vendorolja:
  `public/integrations/wordpress.svg`). A WooCommerce és a WordPress Foundation védjegy-irányelveit ellenőrizni kell.

## 2. Integrációs gyűjtőoldal – `hu/webshop-integracio.astro` + `en/store-integration.astro`

- `title` / `description` (13–15.), „Támogatott rendszerek" (235–244.) → `PlatformLogos`.
- Összekötés szekció (512–523.): szöveg + kép-`alt`. Woo-nál a bekötés leírása: bővítmény → Jóváhagyás.
- Kétirányú kapcsolat (544–546.): a platformlista bővül (Woo-nál is visszaír).
- Blog szekció (620–669.): + WordPress-blog.
- Több webáruház (777–811.): „Unas és Shoprenter vegyesen" → + WooCommerce.
- Hogyan működik, 1. lépés (893.).
- Űrlap: `<option value="WooCommerce">WooCommerce</option>`.

## 3. Modul- és kampányoldalak (HU + EN párban)

| Oldalpár | Mit kell cserélni |
|---|---|
| `shopgrade` | **H1** (173.: „Unas és Shoprenter webshopoknak" – page-copy skill szerint), `title` (12.), `description` (14.), logósor (180–183.), 589., 773., **GYIK** (997.), űrlap-opció |
| `blogcikk-iro` / `blog-writer` | `description` (14.), logósor (157–160., itt a WordPress is), 469., 608.; **új WordPress-blokk** (kiemelt kép, kategória, Yoast/Rank Math, azonnal vagy piszkozatként); **GYIK** (708.) → + bármely saját tárhelyes WordPress oldal, a WordPress.com kivétel; űrlap-opciók (lásd 6. pont) |
| `webshop-seo-geo` | `description` (26. / 21.), logósor (212. / 192.), 667. / 635., 738. / 707., **GYIK** (909. / 878.), űrlap-opció |
| `posztolas` / `demo` | logósor (280.), 836., 1053., 1207. |
| `nemzetkozi` / `international` | 980. / 968. |
| `teljes-rendszer` / `all-in-one` | logósor (238.), **GYIK** (875. / 877.: „Nem Unas vagy Shoprenter webshopom van…" – a kérdést is át kell írni) |
| `index` (HU + EN) | hero logók (122.), Carousel-kártyák logói (232., 252., 313.), „Webáruház" forráslista (427–429.), hub-kép `alt` (477.), **GYIK** (869.) – ha az `index` FAQPage JSON-LD-jében is szerepel, ott is |
| `ninja-ai` | 97. (FAQPage JSON-LD), 847., 961.: „nem tud integrációt bekötni (Unas, Shoprenter, Meta…)" → + WordPress / WooCommerce; űrlap-opció |
| `chatgpt-ads` | 173. („CSAK UNAS-t és Shoprentert ismer"), 181–182. (űrlap), 284. → + WooCommerce |

## 4. Termékleírás-diagnózis – `hu/termekleiras-diagnozis.astro`

- Űrlap-opció (244–245.).
- **`CN_ENGINES`** (804.): `WooCommerce: 'woocommerce'` – az app `engine` mezője már elfogadja
  (app `docs/shopgrade-audit-landing-integracio.md`, 78.).
- A kiszűrés indoklása: 49. komment, 272. („ma UNAS és Shoprenter webáruházaknál tudjuk"), GYIK 709–715.

## 5. Hub-kép – `public/assets/integraciok-hub-portrait.webp`

A feliratok bele vannak égetve (Unas, Shoprenter, Sitemap, RSS), tehát az `alt` cseréje nem elég. Két út van:
újragenerálás WooCommerce- és WordPress-csomóponttal (`generate-image` skill), vagy csere HTML/SVG ábrára – utóbbi a
következő integrációnál is olcsó. A többi érintett kép és az OG-képek logó nélküliek, maradnak.

## 6. Lead-űrlapok és minősítés

- **`WooCommerce` opció** (`data-reject` nélkül, a `value` mindkét nyelven `WooCommerce`) mind a 10 űrlapon, amelyik
  platformot kérdez: `blogcikk-iro`, `blog-writer`, `shopgrade` (HU + EN), `webshop-seo-geo` (HU + EN),
  `webshop-integracio`, `store-integration`, `ninja-ai`, `termekleiras-diagnozis`, `chatgpt-ads`.
  A többi 7 űrlap igen/nem kérdést tesz fel – azokhoz nem kell nyúlni.
- **Csak a `blogcikk-iro` / `blog-writer` űrlapon:** új opció `<option value="WordPress (webshop nélkül)">`
  (EN címke: „WordPress site (no webshop)"), `data-reject` nélkül – a webshop nélküli WordPress-tulajdonost átengedjük.
  A „Más típusú vállalkozásom van" hard reject maradhat: akinek WordPress-oldala van, az új opciót választja.
- ⚠️ **`QUALIFY_KEY` → `cn_qualify_v3`** (`src/data/forms.ts`, 129.). Aki az elmúlt 30 napban WooCommerce- vagy
  WordPress-oldallal az „Egyéb"-et választotta, azt hard rejecttel jegyeztük meg; a kulcs emelése nélkül még 30 napig
  kizárva maradna.
- Mellékes régi hiba: az `en/shopgrade` és az `en/store-integration` `has_webshop` értékei angolok (`Other`, …),
  a többi EN oldalé magyar (`Egyéb`). Ha már úgyis hozzányúlunk, egységesíthető.
- App oldalon: a két új `has_webshop` érték a lead-adminban.

## 7. Jogi oldalak

**Azonnal, verzió nélkül:**
- Adatkezelés: `hu/adatkezeles.astro` 454–457., `en/privacy-policy.astro` 453. → + a WooCommerce boltod /
  WordPress-oldalad (a te saját rendszered, a te tárhelyeden). Érdemes kimondani: a bővítmény a jóváhagyáskor
  alkalmazásjelszót hoz létre, ezt titkosítva tároljuk, és leválasztáskor visszavonjuk.
- Adattörlés: `hu/adattorles.astro` 140., `en/data-deletion.astro` 137. → a hozzáférési kulcsok listája + WooCommerce, WordPress.

**ÁSZF v1-2** (a CLAUDE.md három lépése):
1. Élő oldal: `hu/aszf.astro` 102–103. és 331., `en/terms.astro` 99. és 327. Zárt felsorolás helyett általános
   megfogalmazás („a Szolgáltatás által támogatott webáruház-motorok és tartalomkezelők, aktuális listájuk a
   honlapon"), így a következő integráció nem kényszerít ki újabb verziót. A 102. sor külön figyelmet érdemel: a
   blogpublikálás már nem csak „saját webáruházának blogjába" mehet. Verziószám, hatálybalépés, egysoros változásnapló.
2. Új archív fájl: `src/pages/hu/aszf/v1-2.astro` + `src/pages/en/terms/v1-2.astro`.
3. Link a „Korábbi verziók" sorban.
- Hatálybalépés: legalább 15 nap (12.2 pont). Ha 2026-09-15-én élesítjük, legkorábban 2026-09-30.
- Hatálybalépéskor `web.archive.org/save` pillanatkép – kifelé menő lépés, előtte rákérdezni.

## 8. Új WooCommerce oldal (SEO/GEO)

**Igen, érdemes megcsinálni** – egyelőre **csak magyarul**: `/hu/woocommerce/`, indexelhető, FAQPage JSON-LD-vel
(a `ninja-ai` mintájára).
- **Keresés:** önálló keresési szándék („WooCommerce termékleírás AI", „WooCommerce AI bővítmény", „WooCommerce
  marketing automatizálás"), amire a „webshop mélyintegráció" című gyűjtőoldal nem fog rangsorolni.
- **GEO:** az AI-keresők a „működik-e a Content Ninja WooCommerce-szel?" kérdésre olyan oldalból válaszolnak, ami ezt
  már a címében kimondja.
- **Saját tartalom:** a bővítményes bekötés lépései, mi olvasódik és mi íródik vissza, Yoast/Rank Math, és egy GYIK
  (WordPress.com, szükséges jogosultság – Szerkesztő / bolt-kezelő –, Elementor, bővítmény nélküli kézi bekötés).
- **Angol változat: később.** A spec a Woo-t magyar opcióként pozicionálja, és az app felülete nem angol.
- **Teendők:** `routes.ts` (`woocommerce` kulcs, `en: null`), `sitemap.xml`, `lead_forras: 'woocommerce'`
  (+ az app `FORM_LABELS` / `PATH_TO_FORRAS`), link a gyűjtőoldalról és a fejléc integrációs sávjából.

**WordPress: külön oldal nem kell.** Elég a Blogcikk író oldalán a WordPress-blokk és a GYIK. Az „AI blogíró
WordPress" kifejezésért nagy, általános eszközök versenyeznek, a termék pedig webshop-fókuszú marad.

## 9. Dokumentáció

- `CLAUDE.md`: a `webshopIntegration` / `shopgradeAudit` leírás, a `platforms.ts` mint egy forrás, a `QUALIFY_KEY` v3,
  az új `woocommerce` route.
- Kommentek: `src/i18n/routes.ts` (57., 76.), `public/sitemap.xml` (78.).

## Sorrend (commitok)

1. `platforms.ts` + `PlatformLogos` + logók + `modules.ts`.
2. Az összes szöveg (2–4. pont) + az űrlap-opciók + `QUALIFY_KEY` **egy commitban** – hogy ne legyen olyan
   állapot, amikor a szöveg WooCommerce-t ígér, az űrlap viszont kiszűri.
3. Adatkezelés + adattörlés; ÁSZF v1-2 (a 15 napos határidő miatt minél hamarabb).
4. Hub-kép.
5. `/hu/woocommerce/` oldal.
