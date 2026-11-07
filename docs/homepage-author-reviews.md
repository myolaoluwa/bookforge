# Homepage author reviews

The author reviews section follows the moving publishing platforms directly. It replaces the introductory manuscript copy and service list. The later homepage AuthorProof block is removed to avoid repetition. The hero's #craft link now targets the book design study section.

`components/bookforge/author-reviews.tsx` reads the existing published testimonials collection. It shows up to six entries with permission approval, nonempty feedback and an HTTP(S) source link. Review text and author credits are rendered as plain text. No ratings, client identities or review text are fabricated.

The owner supplied Adele Affie's Fiverr gig URL for review import. On 2026-11-07, public reviewer usernames, countries, individual ratings and four short excerpts were checked against that gig, including its indexed older reviews for returning client tmthomas007. The excerpts are stored in `lib/bookforge/featured-reviews.ts` and used when the CMS has no approved testimonials. They are explicitly labelled selected Fiverr feedback about Adele's formatting service, with a link to the full review collection. No reviewer photos, invented identities, aggregate ratings or claims of reviewer permission are added. The four excerpts total 23 words; do not expand them without reviewing quotation limits. Existing CMS reviews still require permission approval and a source URL. Desktop uses two columns; mobile uses one.

Source: https://www.fiverr.com/verifiled_aff/book-formatting-amazon-kdp-paperback-or-kindle-ebook-formatting

Validation: TypeScript and production build passed. Local Edge checks at 320, 390 and 1440 pixels confirmed section order, removal of the old introduction and duplicate feedback block, a working craft anchor, portfolio link and no horizontal overflow. Screenshots are in ignored outputs/review/author-reviews-*.png.
