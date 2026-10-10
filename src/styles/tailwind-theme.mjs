/**
 * A Tailwind-téma – EGY helyen.
 *
 * Két fogyasztója van, ezért nem szabad máshol másolatban tartani:
 * - a `BaseLayout` inline `tailwind.config`-ja (a CDN-es Tailwindhez, ezt
 *   használja ma szinte minden oldal),
 * - a `tailwind.config.mjs` (a build-lépéses Tailwindhez, amit az oldal a
 *   `tailwindCdn={false}` proppal kér – lásd `BaseLayout`).
 */
export const tailwindTheme = {
  extend: {
    colors: {
      primary: '#6c5ce7',
      'primary-hover': '#5a4bd6',
      dark: '#1e1e2f',
      body: '#4a4a68',
      light: '#f8f9fb',
      card: '#ffffff',
      success: '#22c55e',
      border: '#e8e8ef',
      muted: '#9090a7',
    },
    // 'Inter Fallback': méretre hangolt Arial a betöltés idejére (global.css).
    fontFamily: {
      display: ['Inter', 'Inter Fallback', 'sans-serif'],
      body: ['Inter', 'Inter Fallback', 'sans-serif'],
    },
    boxShadow: {
      card: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
      'card-hover': '0 4px 6px rgba(0,0,0,0.05), 0 10px 24px rgba(0,0,0,0.08)',
      'primary-glow': '0 8px 30px rgba(108,92,231,0.18)',
    },
  },
};
