# Bookforge visual direction

A sharp, blue-shadowed city film carries the weight of publishing overwhelm; warm ivory editorial sections provide the sense of order and relief that follows.

The latest cinematic brief takes precedence over the earlier static hero and decorative-motion bans in `design.md`. Monochromatic masks are used specifically to composite this existing portrait footage into a widescreen environment. They are not decorative background blobs or gradient text. Only one moving video is decoded. Text, navigation and the primary action are never gated by film progress.

Palette: Midnight Ink `#111B1D`, Ivory Paper `#F4F0E8`, Antique Copper `#BE9670`, Sage Slate `#63746C`, charcoal `#283032`. Supporting tokens in `app/globals.css` define borders, secondary text, brighter paper and errors. Copper is used on contrast-safe surfaces; brighter paper replaces ivory for small text on sage after automated contrast checks.

Cormorant Garamond provides editorial display typography. Manrope provides readable body text, controls and navigation. Latin subsets are self-hosted with OFL licenses under `public/fonts`. Typography is visible before motion or media initialization. Body copy and long-form service descriptions use a comfortable reading width; captions and secondary controls are smaller.

`app/cinematic.css` owns the film composition and responsive variants. Desktop and mobile use responsive, character-centered crops without stretching. A side mask blends the desktop footage into a solid ink canvas. No blurred duplicate background remains. Narrative beats use a short opacity/translation reveal tied to video time. User playback controls, reduced-motion/data-saving fallbacks, visibility pause and no-JavaScript content preserve access.

The following paper section introduces the deliverables and existing book study. Studio illustrations remain labeled. No real author, book, photo, quote or performance proof is invented to fill a layout.

## Editorial refinement, 4 November 2026

`app/editorial.css` refines the shared typography, service pages, proposal surfaces and footer. The home page moves from manuscript overwhelm to disciplines, original cover/interior studies, a clear process, Goodreads support and a final proposal invitation. The redundant book interlude and decorative shelf were removed. Cormorant display type and Manrope body type remain self-hosted. Main explanatory copy is 16px or larger, with smaller navigation and captions. Copper is the single active accent; ivory and ink carry the composition. All content remains visible with motion disabled.

The film is the only continuous visual motion. Supporting captions animate for 200?300ms on narrative changes; the five marks represent actual narrative beats. Hover movement is limited to links. No scroll reveals, glass, gradient text, invented proof or replacement film were added.

## Trust and booking surfaces

`app/trust.css` extends the existing paper/ink editorial system without replacing the cinematic hero. Work, team and endorsement slots are explicitly labeled; no stock portraits or counterfeit book credits simulate missing client evidence. Original demonstrations remain separate from real projects.

The sample viewer uses native pressed-state buttons and a labeled scrollable reading region. Enlarge mode increases reading type and presents print pages singly. Native form controls support the service finder and format choices. Controls wait for client readiness to prevent lost interactions. The booking journey remains accessible without an account; quote and resource links render on the server.

Pricing uses structured scope rows and honest unpublished-rate states. Terms, resources and the sample proposal favor readable editorial lists rather than repeated card grids. Calendar links appear only for a configured credential-free HTTPS destination. Reduced-motion and deliberate audio behavior are preserved.
