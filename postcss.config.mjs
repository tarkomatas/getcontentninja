// A Tailwind csak a `@tailwind` direktívát tartalmazó CSS-be ír
// (`src/styles/tailwind.css`); a többi stílust érintetlenül hagyja.
import tailwindcss from 'tailwindcss';

export default {
  plugins: [tailwindcss()],
};
