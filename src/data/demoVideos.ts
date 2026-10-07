import type { Locale } from '../i18n/routes';

/**
 * A Content Ninja által generált mintavideók – a `VideoGallery` lapozó EGY forrása.
 *
 * A fájlok a `public/assets/`-ben vannak, tömörítve (H.264, CRF 26, 128k AAC,
 * faststart), a nyers forrás a gitignore-olt `video-forras/` mappában. A borítókép
 * a videó egy kockája (`ffmpeg … -c:v libwebp`).
 *
 * A címkék (`tags`) csak azt mondják, ami a videón tényleg látszik – új videónál
 * nézd meg, van-e benne beszélő szereplő, animáció, és melyik feliratstílus.
 * A sorrend a megjelenítési sorrend: az elején a leglátványosabbak.
 *
 * ⚠️ Több videó valódi ügyfélbolt termékével készült (tetoválásápolás, roll-on,
 * jógaszőnyeg) – a megjelenítésükről a tulajdonos döntött (2026-10-07).
 */
export interface DemoVideoDef {
  id: string;
  src: string;
  poster: string;
  /** A videó SAJÁT képaránya – a galéria kerete mindig 9:16, a többi sávval jelenik meg. */
  format: '9:16' | '3:4' | '1:1';
  hu: { title: string; tags: string[] };
  en: { title: string; tags: string[] };
}

export const DEMO_VIDEOS: DemoVideoDef[] = [
  {
    id: 'epitokocka',
    src: '/assets/video-narrator.mp4',
    poster: '/assets/video-narrator-poster.webp',
    format: '9:16',
    hu: { title: 'Fa építőkocka – termékreklám', tags: ['Beszélő szereplő', 'Animáció', 'Merész felirat'] },
    en: { title: 'Wooden building blocks – product ad', tags: ['Speaking presenter', 'Animation', 'Bold captions'] },
  },
  {
    id: 'atultetes',
    src: '/assets/video-atultetes.mp4',
    poster: '/assets/video-atultetes-poster.webp',
    format: '3:4',
    hu: { title: 'Szobanövény átültetése – tippvideó', tags: ['Beszélő szereplő', 'Animáció', 'Merész felirat'] },
    en: { title: 'Repotting a houseplant – tips video', tags: ['Speaking presenter', 'Animation', 'Bold captions'] },
  },
  {
    id: 'kave',
    src: '/assets/video-termekreklam.mp4',
    poster: '/assets/video-termekreklam-poster.webp',
    format: '9:16',
    hu: { title: 'French press – termékreklám', tags: ['Animáció', 'Merész felirat'] },
    en: { title: 'French press – product ad', tags: ['Animation', 'Bold captions'] },
  },
  {
    id: 'jogaszonyeg',
    src: '/assets/video-jogaszonyeg.mp4',
    poster: '/assets/video-jogaszonyeg-poster.webp',
    format: '9:16',
    hu: { title: 'Jógaszőnyeg-választás – tippvideó', tags: ['Beszélő szereplő', 'Animáció', 'Klasszikus felirat'] },
    en: { title: 'Choosing a yoga mat – tips video', tags: ['Speaking presenter', 'Animation', 'Classic captions'] },
  },
  {
    id: 'tetovalas',
    src: '/assets/video-tetovalas.mp4',
    poster: '/assets/video-tetovalas-poster.webp',
    format: '9:16',
    hu: { title: 'Friss tetoválás ápolása – tippvideó', tags: ['Beszélő szereplő', 'Klasszikus felirat'] },
    en: { title: 'Caring for a new tattoo – tips video', tags: ['Speaking presenter', 'Classic captions'] },
  },
  {
    id: 'fejleszto-jatek',
    src: '/assets/video-fejleszto-jatek.mp4',
    poster: '/assets/video-fejleszto-jatek-poster.webp',
    format: '1:1',
    hu: { title: 'Kézügyesség-fejlesztés – tippvideó', tags: ['Beszélő szereplő', 'Merész felirat'] },
    en: { title: 'Building fine motor skills – tips video', tags: ['Speaking presenter', 'Bold captions'] },
  },
  {
    id: 'alvas',
    src: '/assets/video-alvas.mp4',
    poster: '/assets/video-alvas-poster.webp',
    format: '9:16',
    hu: { title: 'Alvást segítő roll-on – termékajánló', tags: ['Beszélő szereplő', 'Klasszikus felirat'] },
    en: { title: 'Sleep roll-on – product recommendation', tags: ['Speaking presenter', 'Classic captions'] },
  },
];

export function demoVideosFor(locale: Locale) {
  return DEMO_VIDEOS.map((v) => ({ ...v, ...v[locale] }));
}
