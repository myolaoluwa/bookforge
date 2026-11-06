# Supplied BF/open-book logo

Replaces the ribbon identity in header, footer, empty-state emblem, favicon, touch icon and six social sharing cards. The homepage logo remains a native home link.

User supplied a horizontal cream-background design: copper book spine and pages combined with a dark serif BF emblem beside the BookForge wordmark. Built-in imagegen prepared a transparent higher-resolution source with the instruction to preserve this geometry, type appearance, spelling and spacing, improve fine-edge clarity, and use deep ink/copper without mockups or added elements. Generated source: exec-fb3adf11-b3cc-405d-a000-09b701d5a276.png. The project copy is public/brand/bookforge-bf-source.png.

scripts/prepare-bf-logo.mjs prepares a 3200-pixel master with Lanczos resizing, web lockups, a cropped emblem and browser icons. The dark-background lockup renders the same supplied geometry with ivory ink using the established brand SVG filter while retaining copper. Transparency is preserved; no CSS blur or brightness filter is applied to the final header/footer PNG.

Sharing cards are regenerated using scripts/generate-social-previews.mjs and versioned v3 PNG URLs to refresh artwork references. Older assets remain available for cached links.
