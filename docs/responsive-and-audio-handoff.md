# Responsive layout and default-sound handoff

The latest user request takes precedence over the earlier deliberate-only sound behavior. The original film and extracted soundtrack files remain unchanged.

## Layout

`app/responsive.css` corrects the existing editorial system rather than replacing it. Narrow phones use a fluid display size, a lower portrait-film composition and narrative captions that occupy reserved layout space. The character has room below the principal message, and captions no longer overlap the quote links. Cropping uses `object-fit`/`object-position`, not stretching.

Short landscape layouts compact the heading with intact word spacing. At heights of 300px or less, the secondary explanatory paragraph yields to the headline and visible primary action. Full service detail remains in the next sections. The film retains its stage and explicit pause control. Tablet layouts remove excessive space above the message.

The footer reflows to one column on the narrowest phones. Mobile menus scroll within the available height even when the service list expands. Form fields, sample controls, grids, long text and tables remain within their containers. The form precedes supporting next-step copy on mobile. Safe-area insets protect the sound control, navigation and content around device cutouts. The viewport declares `viewport-fit=cover`.

No global `overflow-x:hidden` conceals layout problems. Film clipping is local to the cinematic composition.

## Sound

There is one persistent 48px soundtrack control, replacing the larger “Experience with sound” invitation. Its accessible name and icon reflect actual playback. It is enabled before the default playback request runs.

- Default startup calls `play()` at the intended audible volume of 35%, where programmatic volume is supported.
- Browser `NotAllowedError` produces a blocked/play state. The control does not claim audio is running. A tap/keyboard activation retries playback using the actual user gesture.
- The request never starts muted audio and silently unmutes it, changes browser policy, or captures unrelated interactions as an unlock.
- Pause is immediate and preserves the current position. Pausing is preserved during normal client-side route navigation. A fresh document load makes a fresh default-on request.
- Manual resume fades to the target volume over 450ms. Later native pause/error events update the displayed state. Operation IDs prevent an older rejected request from overwriting a newer user action.
- The soundtrack loops independently of the film. Film reduced-motion/data-saving and visibility behavior remain unchanged.

Audible autoplay is controlled by the browser, user settings and embedding context. It cannot be guaranteed on every browser, including social-app browsers. See [MDN's autoplay guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay). Actual physical-device and in-app-browser checks remain useful at public launch.

## Verification and artifacts

The geometry matrix covers 21 sizes from 320px narrow phones to 2560px monitors, and short landscape views down to 280px high. Public-route overflow checks cover every registered public page at 320, 540, 768 and 1024px widths. Assertions check the main CTA, sound-button bounds and minimum tap size, and collisions between the narrative caption and primary content.

Unit coverage checks allowed and denied audio startup, manual retry, immediate pause, stale rejected requests and native interruptions. Browser coverage simulates the denied autoplay path and verifies real playback after a user click, immediate pause, client-navigation persistence and a scrollable short-screen menu. The permitted startup branch is unit-tested with a media double; no claim is made that browser policy was changed in production.

Run `node scripts/responsive-review.mjs` against a local preview to save `outputs/review/responsive-final.json`, representative viewport screenshots and the narrow footer. The full QA result is recorded in `qa-checklist.md` and the session handoff. Chromium emulation is not a certification of every physical screen, Safari, Firefox or social-app WebView.
