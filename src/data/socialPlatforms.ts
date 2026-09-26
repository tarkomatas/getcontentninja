import type { Locale } from '../i18n/routes';

/**
 * A közösségi posztolási csatornák állapota – EGY forrás.
 *
 * `live`: a honlap élőként írhatja le (Facebook, Instagram).
 * `soon`: az integráció elkészült, de az előfizetők még nem használhatják —
 * a honlap csak „hamarosan"-ként említheti, élőként SEHOL.
 *
 * - **TikTok:** elkészült, hamarosan minden előfizetőnek elérhető.
 * - **YouTube (Shorts):** elkészült, a platform hivatalos átvizsgálása alatt áll.
 *
 * A logósorokban a `soon` platformok mellé a `SoonBadge.astro` jelvény kerül
 * (a logót magát NEM szürkítjük el: a TikTok/YouTube márkajel csak eredeti,
 * módosítatlan formában használható).
 *
 * ⚠️ **Élesedéskor** nem elég itt `live`-ra állítani: a folyó szöveg (címek,
 * meta description, GYIK, JSON-LD) kézzel áll. Keress rá a platform nevére
 * együtt a „hamarosan" / „coming soon" kifejezésekre, és a
 * `/hu/tiktok-posztolas/` oldal jövő idejű szövegét is írd vissza jelen időbe.
 */
export type SocialId = 'facebook' | 'instagram' | 'tiktok' | 'youtube';

export const SOCIAL_STATUS: Record<SocialId, 'live' | 'soon'> = {
  facebook: 'live',
  instagram: 'live',
  tiktok: 'soon',
  youtube: 'soon',
};

export const isSoon = (id: SocialId) => SOCIAL_STATUS[id] === 'soon';

export const SOON_LABEL: Record<Locale, string> = {
  hu: 'Hamarosan',
  en: 'Coming soon',
};
