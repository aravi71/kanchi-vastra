/**
 * The opening moment: the whole screen is a length of red-and-gold paisley
 * silk that drifts for a breath, then is drawn away diagonally from the
 * bottom-right corner to reveal the shop. Styles: .silk-intro in globals.css.
 *
 * - Plays once per browser session. The inline script runs before the
 *   first paint; on a repeat visit it marks <html data-intro-seen>, which
 *   hides the silk (and zeroes the hero's wait) without any flash.
 * - Skipped entirely for visitors who ask their device for reduced motion.
 * - Decorative only: hidden from screen readers and never blocks clicks.
 */
const markSeen = `try{if(sessionStorage.getItem('kv-intro')){document.documentElement.dataset.introSeen='1'}else{sessionStorage.setItem('kv-intro','1')}}catch(e){}`;

export function SilkIntro() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: markSeen }} />
      <div className="silk-intro" aria-hidden="true">
        <div className="silk-intro__cloth">
          <div className="silk-intro__pattern" />
          <div className="silk-intro__sheen" />
        </div>
      </div>
    </>
  );
}
