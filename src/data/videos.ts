/**
 * YouTube videó-azonosítók a beágyazott bemutatókhoz.
 *
 * Az azonosító a YouTube URL `?v=` utáni része (pl.
 * `https://www.youtube.com/watch?v=abc123XYZ_0` → `abc123XYZ_0`).
 * Ez az egyetlen hely, ahol cserélni kell őket.
 *
 * A videók **magyar nyelvűek**, ezért csak a `/hu/` oldalakba vannak beágyazva.
 * Az `/en/` megfelelőikbe csak akkor kerüljenek be, ha készül angol verzió.
 */
export const videos = {
    /** Általános termékbemutató – főoldal. */
    overview: 'eiLqekvP6JU',
    /** Hírlevél-bemutató – hírlevél kampányoldal. */
    newsletter: '0hQn1N--QhY',
} as const;

/**
 * Igaz, ha az azonosító már valódi. Amíg `TODO_`-val kezdődik, a videós
 * szekciók kimaradnak a buildből – így egy korai deploy sem tesz ki törött
 * lejátszót az élesre.
 */
export const hasVideo = (id: string): boolean => !id.startsWith('TODO_');
