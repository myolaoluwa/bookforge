# Bookforge social sharing kit

Prepared 4 November 2026. Designed for the existing ink/ivory/copper studio identity, using the licensed local Manrope and Cormorant fonts. The book illustration is original brand artwork, not a client publication. No invented authors, endorsements, results or social handles appear.

## Website link previews

The metadata helper emits server-rendered Open Graph title, description, type, canonical URL, site name, locale, image URL, PNG type, image dimensions and descriptive alt text. HTTPS images also include the secure URL. Twitter/X metadata explicitly includes a large-image card, title, description, image and alt text.

The chosen landscape design is 1200 × 630 pixels. Each graphic is under 300 KB. Critical copy remains large, with whitespace around the edges. Assets use versioned filenames so future artwork can have a new URL when refreshing cached previews.

| Page | Artwork under `public/brand/share/` |
|---|---|
| Homepage and general studio pages | `bookforge-home-v1.png` |
| Ebook, paperback, hardcover and KDP preparation | `bookforge-formatting-v1.png` |
| Manuscript editing | `bookforge-editing-v1.png` |
| Cover design | `bookforge-covers-v1.png` |
| Goodreads and marketing | `bookforge-discovery-v1.png` |
| Author resources and insights | `bookforge-resources-v1.png` |

The homepage share title is “You wrote the book. We’ll handle what comes next.” Its description names the actual services and invites a proposal. Service pages use relevant benefit-led copy while preserving the existing search titles. Goodreads copy preserves the independent-service/free-program distinction and does not promise verification.

`lib/bookforge/social.ts` owns artwork selection and share copy; `lib/bookforge/seo.ts` emits the metadata. Metadata does not require JavaScript, playback, sound or form interaction. The root metadata supplies a branded fallback.

## Instagram creative exports

- Feed artwork: `public/brand/share/bookforge-instagram-feed-v1.png`, 1080 × 1350.
- Story artwork: `public/brand/share/bookforge-instagram-story-v1.png`, 1080 × 1920.

These are separate uploadable graphics, not extra `og:image` candidates. This prevents portrait artwork being selected unexpectedly for a landscape link preview. Platform previews, crops and clickable surfaces remain controlled by each social app.

For the Story, add Instagram’s native Link sticker pointing to the live website or relevant service page. The design leaves a blank area around x=76–700, y=1416–1496 for the sticker. This is a composition guide, not a guarantee about every device’s interface crop. Preview the Story in the actual account before posting. The image contains no fake clickable button.

For the feed artwork, add the website to the profile’s external links and use the caption to direct readers there. Check the actual account’s available linking features; do not assume that typed caption URLs behave as universal clickable links. No Instagram or Facebook post was created or sent by this task.

Suggested caption:

> You wrote the book. Now there are margins, covers, file formats and a whole new set of decisions. Bookforge brings editing, formatting, cover design and publishing preparation into one considered brief. Explore the studio and request a proposal shaped around your book. Website link in our profile.

Suggested Story Link sticker text: “Explore Bookforge” or “Discuss your book”.

## Launch steps

1. Set `SITE_ORIGIN` to the final public HTTPS origin. The safe fallback is the existing hosted Site URL, not localhost. Configured origins are normalized to scheme/host; credentials, invalid URLs and executable schemes are rejected. For local development, an explicit localhost origin is still supported.
2. Keep the Site private/noindex until the owner approves public launch. Public sharing crawlers cannot validate a private authenticated Site. This task does not change the audience or enable indexing.
3. When the public site and domain are ready, confirm that the page and each referenced PNG return HTTP 200 to an unauthenticated request. Confirm no access gate, robots restriction or infrastructure rule blocks the platform crawler.
4. Inspect the HTML source, not only the browser DOM: absolute `og:url`/`og:image`, one intended primary image, the correct route copy and matching image dimensions.
5. Use [Meta Sharing Debugger](https://developers.facebook.com/tools/debug/) on the final URL. Review the fetched title, description, image and canonical URL. Request a fresh scrape if the platform shows an older cached version. Live Meta preview/cache validation remains a launch step.
6. Make a real private/draft sharing check in Facebook and inspect the final Instagram feed/Story composition in the app. Check links on a phone. Final rendering and linking behavior can vary by platform, account and placement.
7. When replacing artwork, regenerate it with a new versioned filename, update `social.ts`, deploy and refresh the platform cache. Retain the old file while existing shares may reference it.

No Facebook app ID, social profile or analytics identifier was fabricated. Supply actual handles if organization/profile metadata is added later.

## Regenerating the graphics

Run `node scripts/generate-social-cards.mjs` from the project. It renders code-native HTML/CSS with local font bytes through the installed Edge/Chromium channel. It has no external asset dependency or API key requirement. Source is editable and deterministic; PNG files are committed for deployment. Preview exports using the local image viewer before publication.

## Sources and verification limits

- [Open Graph protocol](https://ogp.me/): core metadata and structured image properties.
- [Meta developer sharing guidance](https://developers.facebook.com/docs/sharing/webmasters/) and [image guidance](https://developers.facebook.com/docs/sharing/webmasters/images/): launch references. These pages returned HTTP 429 during this task; no successful current scrape of their detailed requirements is claimed.
- [Meta announcement of Instagram Link stickers](https://about.fb.com/ja/news/2021/10/linkaccessstickers/): describes adding a URL through the native sticker and opening it from a Story. The official Japanese page was accessible; the English Instagram announcement returned HTTP 429. This is not a claim that every current account has identical availability.

Local checks validate server HTML, file presence, image dimensions/type/size, route selection and URL handling. They do not establish real Facebook cache behavior, account-level Instagram capabilities or click-through performance. No improvement in click-through rate is claimed without measurement.
