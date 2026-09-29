/**
 * YouTube videó-azonosítók a beágyazott bemutatókhoz.
 *
 * Az azonosító a YouTube URL `?v=` utáni része (pl.
 * `https://www.youtube.com/watch?v=abc123XYZ_0` → `abc123XYZ_0`, vagy a
 * `https://youtu.be/abc123XYZ_0` rövid linkben a `/` utáni rész).
 * Ez az egyetlen hely, ahol cserélni kell őket.
 *
 * Mindegyik az oldala „Hogyan működik?" blokkjában ül, a `HowItWorksVideo`
 * kerettel (a cím és a lépéskártyák között, széles sávban).
 *
 * A videók **magyar nyelvűek**, ezért csak a `/hu/` oldalakba vannak beágyazva.
 * Az `/en/` megfelelőikbe csak akkor kerüljenek be, ha készül angol verzió.
 */
export const videos = {
    /** Általános termékbemutató – főoldal. */
    overview: '-8vW2pDfLZU',
    /** Automata posztolás – `/hu/posztolas/`. */
    posting: '2a3zK7zjBdw',
    /** AI hírlevél – `/hu/hirlevel/`. */
    newsletter: 'hgL6ho7idN4',
    /** Shopgrade – `/hu/shopgrade/`. */
    shopgrade: 'xy_byJtOwYo',
    /** Blogcikk író – `/hu/blogcikk-iro/`. */
    blogWriter: 'k4iSUFKfzl4',
} as const;

/**
 * Igaz, ha az azonosító már valódi. Amíg `TODO_`-val kezdődik, a videós
 * szekciók kimaradnak a buildből – így egy korai deploy sem tesz ki törött
 * lejátszót az élesre.
 */
export const hasVideo = (id: string): boolean => !id.startsWith('TODO_');
