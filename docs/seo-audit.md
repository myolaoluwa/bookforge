# SEO review

Public pages render meaningful headings and service copy in their initial response. No root loading boundary hides that content behind JavaScript. The emotional H1 is accompanied immediately by an explicit description of editing, formatting, covers and publishing support. Individual service pages carry the specific search intent rather than repeating a keyword list in the hero.

Every public route has a distinct title, description and canonical tag. The origin is configurable. Staging defaults to `noindex,nofollow` and an empty sitemap; the requested custom domain is not assumed active. Public project/article/team URLs require published data. Admin and proposal routes stay noindex. Unknown records return a genuine 404. No fabricated ratings, Person records, client works, FAQ rich-result promises or SEO performance claims are added.

## Live query spot-check, 4 November 2026

Queries checked: `professional book formatting services EPUB paperback authors`, `manuscript editing services independent authors`, `Goodreads author profile setup optimization service`. This is an exploratory, unlocalized search snapshot, not country-specific keyword research. No volume, difficulty or rank position is inferred.

Provider pages appearing in the returned results included [Author.Coach formatting](https://author.coach/products/book-formatting-services), [Writers Nest Studio layouts](https://writersneststudio.com/book-layout/), [Williams & Rose author services](https://www.williamsandrose.com/author-services) and [Archetype Editing](https://www.archetypeediting.com/). Their page descriptions distinguish print PDF, EPUB, platform preparation and editorial levels. These observations support keeping Bookforge's service intents distinct; they do not substantiate any Bookforge capability or serve as endorsements. No competitor copy was imported.

The Goodreads query did not provide enough reliable niche service evidence in the returned snapshot to validate demand. Treat that candidate as unverified and use [official Author Program information](https://www.goodreads.com/author/program) and [author guidelines](https://www.goodreads.com/author/guidelines) for factual platform distinctions.

Remaining: select target countries with the owner, conduct localized research, connect real Search Console, review original specialist-authored articles, approve portfolio evidence and validate the final origin, social sharing image and production indexing settings. A raster PNG variant of the existing brand sharing graphic is generated and referenced by metadata; real social-platform preview checks remain a launch task.



## Author-focused metadata, 6 November 2026

Search titles and descriptions for main routes, services and author checklists are maintained in lib/bookforge/metadata-copy.ts. Search copy names the service and its benefit to an independent author; social headlines use a warmer invitation with the same accurate description. Dynamic portfolio, article and team records keep their supplied metadata. No invented results, awards or endorsements are used.

The homepage search title is Book Editing, Formatting & Cover Design | BookForge. Existing service-specific 1200x630 PNG sharing images remain in use. The default canonical origin now points to the current Cloudflare deployment, with SITE_ORIGIN taking precedence for a future custom domain. Indexing remains controlled by SITE_INDEXABLE; this copy update does not enable it.


## Cinematic social preview artwork, 6 November 2026

Replaced the six v1 link-preview references with versioned v2 PNGs. Original 1200x630 editorial compositions combine the supplied BookForge symbol and wordmark, local Cormorant/Manrope fonts, and a generated photographic book still life. The homepage reads: Your story. Beautifully finished. Each service category has its own headline; alt descriptions match the new artwork. No client book or publication is implied.

Reproduce the cards with node scripts/generate-social-previews.mjs. The background is public/brand/share/bookforge-cinematic-still.webp. Source generation: built-in imagegen, exec-f4904999-43d9-4e20-92cb-5bd6e66f35bc.png; cinematic forest-green clothbound book, ivory book stack, open pages and fountain pen on walnut, warm copper light, dark negative space at left, no lettering or logos. Supplied logo is composited separately without redrawing it.

Fresh image URLs allow social crawlers to retrieve the redesign. Platforms can retain cached previews for previously shared page URLs.
