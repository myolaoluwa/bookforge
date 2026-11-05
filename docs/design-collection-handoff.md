# BookForge design collection

Implemented 5 November 2026 in the existing application. The homepage remains the entrance; the full exhibition has its own pages. Existing service, CMS, portfolio search, inquiry and soundtrack flows remain in place. The original hero component and video assets were not edited.

## Routes and behavior

- `/portfolio/concepts`: six original specimens, genre filtering and links to complete book studies.
- `/portfolio/concepts/[slug]`: flat, physical, spine and back cover views; edition and surface controls; native modal detail inspection; opening, reading and editorial-detail spreads; format previews; relevant service selection in the existing proposal flow.
- `/portfolio/concepts/interiors`: six editorial systems and a browsable literary specimen. Desktop uses facing pages; mobile uses a readable single page with left/right selection.
- `/portfolio/concepts/transformation`: fiction, nonfiction and poetry comparisons. Before and after use identical source strings.
- `/portfolio/concepts/formats`: paperback, hardcover, reflowable EPUB simulation and large print. The actual HTML text reflows with reader width and text size. Relevant studies also demonstrate fixed layout.

Home adds a compact collection introduction. `/portfolio` keeps the real, permissioned project gallery and its search/filters, and provides an obvious path into the separately labeled concepts. New routes enter the sitemap only when the existing indexable configuration permits it. Private access and staging indexing policy are retained.

## Original specimens and provenance

| Book | Genre | System |
| --- | --- | --- |
| The Unquiet Coast | Literary fiction | The Classic |
| Ash & Aster | Fantasy | The Expressive |
| A Clearer Kind of Thinking | Business nonfiction | The Contemporary |
| What the Rain Kept | Poetry | The Literary |
| Salt, Fire & Sundays | Cookbook | The Illustrated |
| A Small Practice of Attention | Guided journal | The Practical |

All cover compositions, SVG illustrations, poems, fiction passages and editorial specimen writing were authored for this implementation. The bylines are BookForge studio imprints, not invented client authors. No external book covers, stock photography, customer commissions or testimonials are implied. The two more generic suggested titles were replaced. Web spot searches for the supplied suggestions were performed; these are illustrative identities, not a claim of exclusive title rights or legal clearance.

Cover lettering and interior text remain live HTML. SVG artwork stays crisp without added bitmap downloads. The existing self-hosted Manrope and Cormorant fonts retain their repository OFL license files. The shared ribbon mark and favicon are a simplified vector interpretation of the supplied BookForge logo reference, using the existing ivory/copper palette. No image generation or external artwork service was used.

## Main implementation files

- `lib/bookforge/specimens.ts`: identities, original writing, palettes, formats and design rationale.
- `components/bookforge/design-collection.tsx`: reusable cover artwork, gallery, cover explorer, spread viewer, comparison, format explorer, modal inspection and homepage teaser.
- `app/collection.css`: exhibition, print specimens, responsive behavior and reduced-motion handling.
- `app/portfolio/concepts/**/page.tsx`: collection and ten page destinations (four index/exploration pages plus six dynamic studies).
- `app/page.tsx`, `app/portfolio/page.tsx`, `app/layout.tsx`, `app/sitemap.ts`: integration and discovery.
- `components/bookforge/ui.tsx`, `public/brand/bookforge-ribbon.svg`: vector brand mark.
- `tests/e2e/collection.spec.ts`, `scripts/collection-review.mjs`: interaction, accessibility and visual review coverage.

## Verification

- TypeScript: passed.
- Existing unit/integration suite: 9 files, 84 tests passed.
- Existing author-trust browser suite: 12 desktop/mobile tests passed, including service selection, brief download, form choices, existing samples and honest configuration states.
- New collection browser suite: final 10 desktop/mobile tests passed, including spine view, filtering, modal focus, identical comparison text, real reflow, service routing and accessibility across all ten new destinations.
- Production build: passed; rebuilt during publication packaging after final edits.
- Geometry and screenshot review: final 36 page/viewport combinations, no horizontal overflow or browser page errors. Additional desktop/mobile reading/detail spread checks across all six books found no content crossing the folio safe region.
- Browser: installed Microsoft Edge/Chromium, with desktop and emulated mobile viewports. This is not physical-device or Safari certification.

Local screenshots and results are in ignored `outputs/review/collection/`: desktop and mobile home, covers, case study, interior library, comparison, print formats, EPUB, physical book and selected detailed spreads. Screenshots were inspected and used to fix clipped recipe/business content, weak contrast, undersized mobile text and accessibility labels/heading order. Controls are disabled until hydration so early clicks cannot silently disappear. Native dialogs provide focus containment, Escape dismissal and return focus.

## Scope and limits

These are service demonstrations, not a formatting app or publishing-file generator. Material finishes, dimensions and pagination are illustrative. Physical proofing, actual paper and binding specifications, complete EPUB validation and platform/device verification remain project-specific production work. No production PDF/EPUB downloads are advertised by the collection.

Existing external configuration requirements remain: real inquiry delivery, mail, approved CMS work, team profiles, commercial policies and a public launch are separate gates. No new third-party dependencies, database migration, account credentials or paid services were introduced. Pre-existing portrait-gallery edits in the working tree were preserved.

The publication uses the existing Site identity and owner-only audience. The session delivery reports the actual deployment outcome; a local build alone does not establish publication.
