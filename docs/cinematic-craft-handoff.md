# Supplied logo and cinematic craft imagery

5 November 2026. The restored layout and original city hero film are retained. This update replaces empty visual slots, rather than restoring the rejected design collection.

## Logo

The exact supplied PNG is preserved at `public/brand/bookforge-supplied-original.png`. Header and footer use source-pixel crops of its ribbon and its original BookForge wordmark, on an ivory backing for contrast against the dark navigation. The favicon uses the same supplied ribbon. No vector approximation or newly typeset wordmark is used. `scripts/prepare-craft-assets.mjs` makes the resize/crop derivatives with Sharp, without redrawing the artwork.

A transparent extraction was generated and inspected, but its edge treatment was inferior; it was not used in the website. The original artwork and source-pixel derivatives are the delivered logo assets.

## Replacement experiences

- Empty selected-work images: cinematic cloth-cover and open-book scenes, moving light, pause/resume controls and a native detail dialog.
- Empty team portrait gallery: three actual craft images in the retained curved WebGL gallery; drag, touch, buttons, momentum and keyboard controls remain. Without published team profiles, headings describe bookmaking rather than implying staff identities. Published team records remain supported; missing portrait files use an explicitly described craft scene.
- Empty author-feedback panel: a binding scene and working-process invitation. Real published testimonials still render when available; no reviews or authors are invented.
- Old CSS cover stand-in in the sample viewer: the cloth scene and inspection experience. Existing readable print and digital sample tabs remain.

The shared components apply these changes to home, portfolio, about, service and feedback pages. Empty real client and article data remain honest content states. These are illustrations of the service, not claims that depicted books are client publications or that physical bookbinding is included in a service proposal.

Motion uses a restrained 8.8-second raking-light cycle across the original image, driven by the browser animation API and clipped to its frame. It pauses offscreen, when the tab is hidden, after a visitor pauses it, and for reduced motion. Images remain still and legible for reduced-motion visitors. Dialogs provide scene selection and service-specific proposal links. No camera movement is added to the photographic background.

## Assets and prompts

Built-in image generation created three original landscape scenes, then the results were optimized to desktop/mobile WebP. No external image licensing or stock assets were used. `public/craft/provenance.json` records their illustrative status. Final files:

- `public/craft/cloth.webp` and `cloth-mobile.webp`: forest-green linen book with cream page edges, abstract blind-debossed line, dark work surface, warm amber macro light; no lettering or logo.
- `public/craft/reading.webp` and `reading-mobile.webp`: open cream literary book, naturally curved turning page, chapter opening “A quiet beginning”, ink-green surface, warm grazing light.
- `public/craft/binding.webp` and `binding-mobile.webp`: anonymous hands guiding copper linen thread through cream paper signatures, documentary macro composition, dark wood and warm side light.

The prompts specified realistic materials/proportions, shallow-focus cinema photography, the existing ink/ivory/copper palette, no watermarks and no invented staff identities. The unoptimized generated originals remain in the local generated-image history; website assets are copied into the repository. All three desktop WebPs total about 553 KB; all three mobile versions total about 105 KB.

The Runway video connector returned `UNAUTHORIZED` and required reauthentication. No video task was created and no generated footage is claimed. The delivered experiences use original still imagery, genuine browser motion and the retained interactive gallery. Existing hero video and soundtrack remain intact.

## Verification

- TypeScript and production build pass.
- 84 existing unit/integration tests pass.
- 18 final desktop/mobile scene and gallery browser tests pass: motion controls/offscreen/reduced motion, modal service links, keyboard/touch/momentum, WebGL fallback and accessibility.
- All 12 existing trust/inquiry browser tests pass, with intentional expectations updated for the replacement visuals.
- 25 route/viewport checks report no horizontal overflow, empty visual placeholders or browser page errors. Desktop/mobile screenshots were inspected; lazy images are decoded before final screenshots.
- Browser checks use installed Microsoft Edge/Chromium and emulated phones, not physical Safari certification.

Screenshots and results are under ignored `outputs/review/craft/`. Deployment outcome is recorded in the session delivery. Existing inquiry/mail/CMS launch configuration requirements are unchanged, as is private access.
