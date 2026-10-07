import type { Locale } from '../i18n/routes';

/**
 * A Content Ninja által generált mintavideók – a `VideoGallery` lapozó EGY forrása.
 *
 * A fájlok a `public/assets/`-ben vannak, tömörítve (H.264, CRF 26, 128k AAC,
 * faststart), a nyers forrás a gitignore-olt `video-forras/` mappában. A borítókép
 * a videó egy kockája (`ffmpeg … -c:v libwebp`).
 *
 * A cím nem jelenik meg a videó alatt (user-kérés), de a képernyőolvasó ezt
 * olvassa fel. A sorrend a megjelenítési sorrend: az elején a leglátványosabbak.
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
  hu: { title: string };
  en: { title: string };
}

export const DEMO_VIDEOS: DemoVideoDef[] = [
  {
    id: 'epitokocka',
    src: '/assets/video-narrator.mp4',
    poster: '/assets/video-narrator-poster.webp',
    format: '9:16',
    hu: { title: 'Fa építőkocka – termékreklám' },
    en: { title: 'Wooden building blocks – product ad' },
  },
  {
    id: 'atultetes',
    src: '/assets/video-atultetes.mp4',
    poster: '/assets/video-atultetes-poster.webp',
    format: '3:4',
    hu: { title: 'Szobanövény átültetése – tippvideó' },
    en: { title: 'Repotting a houseplant – tips video' },
  },
  {
    id: 'kave',
    src: '/assets/video-termekreklam.mp4',
    poster: '/assets/video-termekreklam-poster.webp',
    format: '9:16',
    hu: { title: 'French press – termékreklám' },
    en: { title: 'French press – product ad' },
  },
  {
    id: 'jogaszonyeg',
    src: '/assets/video-jogaszonyeg.mp4',
    poster: '/assets/video-jogaszonyeg-poster.webp',
    format: '9:16',
    hu: { title: 'Jógaszőnyeg-választás – tippvideó' },
    en: { title: 'Choosing a yoga mat – tips video' },
  },
  {
    id: 'tetovalas',
    src: '/assets/video-tetovalas.mp4',
    poster: '/assets/video-tetovalas-poster.webp',
    format: '9:16',
    hu: { title: 'Friss tetoválás ápolása – tippvideó' },
    en: { title: 'Caring for a new tattoo – tips video' },
  },
  {
    id: 'fejleszto-jatek',
    src: '/assets/video-fejleszto-jatek.mp4',
    poster: '/assets/video-fejleszto-jatek-poster.webp',
    format: '1:1',
    hu: { title: 'Kézügyesség-fejlesztés – tippvideó' },
    en: { title: 'Building fine motor skills – tips video' },
  },
  {
    id: 'alvas',
    src: '/assets/video-alvas.mp4',
    poster: '/assets/video-alvas-poster.webp',
    format: '9:16',
    hu: { title: 'Alvást segítő roll-on – termékajánló' },
    en: { title: 'Sleep roll-on – product recommendation' },
  },
];

export function demoVideosFor(locale: Locale) {
  return DEMO_VIDEOS.map((v) => ({ ...v, ...v[locale] }));
}
