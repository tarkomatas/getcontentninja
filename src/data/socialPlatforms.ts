import type { Locale } from '../i18n/routes';

/**
 * A közösségi posztolási csatornák állapota – EGY forrás.
 *
 * `live`: a honlap élőként írhatja le (Facebook, Instagram, TikTok).
 * `soon`: az integráció elkészült, de az előfizetők még nem használhatják —
 * a honlap csak „hamarosan"-ként említheti, élőként SEHOL.
 *
 * - **TikTok:** 2026-10-02 óta él (a TikTok 2026-10-01-én jóváhagyta a Direct Post auditot).
 * - **YouTube (Shorts):** elkészült, a platform hivatalos átvizsgálása alatt áll.
 *
 * A logósorokban a `soon` platformok mellé a `SoonBadge.astro` jelvény kerül
 * (a logót magát NEM szürkítjük el: a TikTok/YouTube márkajel csak eredeti,
 * módosítatlan formában használható).
 *
 * ⚠️ **Élesedéskor** nem elég itt `live`-ra állítani: a folyó szöveg (címek,
 * meta description, GYIK, JSON-LD) kézzel áll. Keress rá a platform nevére
 * együtt a „hamarosan" / „coming soon" kifejezésekre, és a csatorna saját
 * oldalát (ha van) is írd vissza jelen időbe.
 */
export type SocialId = 'facebook' | 'instagram' | 'tiktok' | 'youtube';

export const SOCIAL_STATUS: Record<SocialId, 'live' | 'soon'> = {
  facebook: 'live',
  instagram: 'live',
  tiktok: 'live',
  youtube: 'soon',
};

export const isSoon = (id: SocialId) => SOCIAL_STATUS[id] === 'soon';

export const SOON_LABEL: Record<Locale, string> = {
  hu: 'Hamarosan',
  en: 'Coming soon',
};
