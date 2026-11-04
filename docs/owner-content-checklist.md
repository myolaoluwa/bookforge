# Bookforge: what to provide for the trust and booking release

The website now has explicitly labeled slots for real work, team introductions and author feedback. It does not invent identities, testimonials, prices or appointment availability. The original film and sound behavior are preserved.

## 1. Work samples — start with two to four projects

For each project, provide:

- Book title, author/pen name, genre and public book/author link if available.
- Exactly what Bookforge did: editing, cover, interior, EPUB, publishing preparation or author research. Do not claim work performed by someone else.
- Approved cover image: JPEG, PNG or WebP, ideally at least 1200px tall. Prepared public previews must be under 2 MB for the current uploader.
- Two to four readable interior spreads/chapter pages, with confidential content removed and permission for every excerpt. A PDF can be supplied for preparing web images; the public gallery uses approved images.
- A short brief, the design/production decisions and the final deliverables. State the actual formats/platforms.
- Permission to display the author name, cover and excerpts, plus image descriptions (alt text).
- Optional before/after material only if both versions are cleared for public use.

Placement: home selected work, `/portfolio`, `/portfolio/[slug]`. The interactive “Open the book” viewer currently uses original Bookforge demonstration text and artwork, visibly labeled as demonstrations. Real client evidence is published separately.

When the CMS is configured: upload each web image under Media as a private draft, record permission, publish the media, then add the published `/media/...` path to the project. Use the project editor's interior/detail image field in the form `path | image description`, one image per line. Publish only after the permission and content checks pass. Associate service slugs to support filtering.

## 2. People

For each person: public name, role, approved portrait, short introduction, fuller biography, relevant experience/credentials with evidence, genre or production specialty, and consent to publish. Do not provide sensitive identity documents.

Placement: home, `/about`, `/team/[slug]`. CMS Team uses title/name, summary, body, role, cover/portrait and image description. Team publication requires recorded permission.

## 3. Author feedback

Provide the exact approved quote, author name/pen name, book title, service supplied, public source URL and permission to publish. Specific feedback about communication, quality, scope or handoff is useful. Avoid unsupported sales claims.

Placement: home, matching service pages, `/testimonials`. CMS Testimonials: title is attribution; summary identifies the book/service; body is the approved quote; source is the original public review/author page; associated service slugs enable relevant service-page placement. If the quote is not public, agree a genuinely verifiable source and permission record before publishing.

## 4. Prices and working policies

Complete `content/studio-profile.json` with approved public details. It contains no secrets.

- Business name, location, timezone and an actual response-time commitment.
- For each pricing entry: `from` as a number, `currency` as an ISO currency code, and `scope` explaining what the starting price covers. A price displays only when the amount and scope are present. Leave `from` as null to retain “Tailored quote.” No placeholder currency is displayed as a published rate.
- `turnaround` and `revisions`: approved, service-specific text. Include when the clock starts and how feedback affects timing.
- `paymentPolicy`, `cancellationPolicy`, `supportPolicy`, `retentionPolicy`, `artworkPolicy`: real terms covering payment stages, cancellation, corrections, private-file retention, licenses/source files, and AI/subcontractor disclosure.
- Confirm the legal/privacy wording with appropriate business review before public launch. The sample proposal is an illustrative structure, not a binding agreement.

Placement: `/pricing`, service scope panels, `/working-together`, consultation information. The booking page and working terms remain honest when a field is blank.

## 5. Consultation calendar

Provide an approved HTTPS booking link and the actual conversation duration. Set `consultationUrl`/`consultationLength` in the public profile, or set `CONSULTATION_URL` in the server environment. HTTPS URLs with embedded credentials are rejected.

Configure timezone display, real availability, confirmation, rescheduling/cancellation and any charges at the provider. The site does not invent appointments or claim an external booking succeeded. Without a URL, `/consultation` shows an availability-pending state and links to the project brief.

## 6. Live inquiry setup — enter credentials privately

Use `.env.example` and `docs/deployment-runbook.md`. Do not paste secrets into public content or this checklist.

- Supabase project URL, anonymous key, service-role key and authorized owner account.
- Apply both migrations in order, including `202611040002_inquiry_platform.sql` for the new platform field.
- Turnstile site/secret keys configured for the real hostname and a rate-limit salt.
- Resend API key, verified sender, agency inbox and monitored `CONTACT_EMAIL`.
- Confirm the live save/receipt/notification and failure/retry paths. Until configured, the form remains in preview mode and offers a downloadable local brief; it never pretends to send.

## Delivery features still gated by real operations

The public trust and inquiry release does not include an authenticated author project workspace, live checkout/invoicing, or full-manuscript uploads. Those later roadmap items require approved contracts/payment rules, author identity/access design, private storage, file security, retention and provider setup. No empty portal or fake payment flow is exposed as a working feature.

Analytics is not installed. The later measurement plan should count quote starts/completions, real consultations, qualified inquiries and accepted projects without collecting manuscript text or personal project details in analytics.
