/**
 * „Melyik funkció érdekel a leginkább?" – a lead-űrlapok közös kérdése (EGY forrás).
 *
 * 2026-11-18 óta MINDEN lead-űrlapon (`LeadFormScript`) ott van, ugyanezzel a
 * hét opcióval, korlát nélkül (legalább egy pipa kötelező). Korábban csak a
 * `bookDemo` (max. 2) és az `allInOne` (max. 3) oldalpár kérdezte, oldalanként
 * más opciókkal.
 *
 * ⚠️ **A `value`-k mindig magyarok és változatlanok** – az app egy
 * `module_interest` oszlopban szűri őket, a két nyelv válaszai együtt. Csak a
 * látható címke fordul. Átnevezés kettévágná a régi és az új leadeket – ezért
 * viszik a 2026-11-18 előtti értékeket ott is, ahol a címke már más
 * (pl. „Posztolás" → `Automata posztolás`). Új érték: `Kategóriaoldal átírás`.
 *
 * Az „Egyéb" mellé szövegmező nyílik; a leírás külön mezőben megy
 * (`module_interest_egyeb`), hogy a `module_interest` értékei szűrhetők maradjanak.
 */
export const MODULE_INTEREST_OTHER = 'Egyéb';

export const MODULE_INTEREST_OPTIONS: { value: string; hu: string; en: string }[] = [
  { value: 'Automata posztolás', hu: 'Posztolás', en: 'Social posting' },
  { value: 'AI hírlevél', hu: 'Hírlevelezés', en: 'Newsletters' },
  { value: 'Blogcikk író', hu: 'Blogcikk írás', en: 'Blog writing' },
  { value: 'Termékleírás írás (Shopgrade)', hu: 'Termék átírás', en: 'Product description rewriting' },
  { value: 'Kategóriaoldal átírás', hu: 'Kategóriaoldal átírás', en: 'Category page rewriting' },
  { value: 'Meta hirdetések', hu: 'Meta hirdetéskezelés', en: 'Meta ads management' },
  { value: MODULE_INTEREST_OTHER, hu: 'Egyéb, leírom', en: "Other – I'll describe it" },
];
