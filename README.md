# Bookforge Publishing Studio

The existing Folio project, expanded into Bookforge and refined around the original author-overwhelm animation. This is a full-stack Next App Router-compatible application using the supplied Sites Vinext runtime, TypeScript, Supabase integration, Zod, Vitest, Playwright and axe. The previous static page is preserved under `archive/folio-v1` and in Git history.

## Run and check

```text
npm ci
npm run dev -- --hostname 127.0.0.1 --port 5173
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
npm start -- --port 5177
```

Browser tests use the installed Microsoft Edge Chromium channel. The production build uses the portable Sites starter; no Bash is needed. Do not serve the old `dist/index.html`: `dist/` is now generated Worker output.

## Cinematic implementation

`public/reference/city-loop.mp4` is the same 800 × 1200, 20-second derivative used by the original site. Its SHA-256 matches the previous committed asset. No new film was generated. The 480 × 720 mobile derivative is 759,413 bytes; the preserved desktop derivative is 4,131,451 bytes. The original 2000 × 3000 upload remains outside the repository at its user-supplied Downloads path.

The existing `ReferenceFilm` component supports the full-viewport hero. One sharp video is blended into a solid ink canvas using a monochromatic side mask; there is no duplicate background video. A poster and immediate server-rendered headline/CTA make playback optional. `prefers-reduced-motion` and data saving suppress automatic playback; explicit play remains available. Film playback pauses outside the viewport and while the tab is hidden. There is no scroll hijacking.

The soundtrack is the preserved `ambience.mp3`, extracted earlier from the original video. It stays separate so it can loop continuously when the film is paused. “Experience with sound” and the persistent mute toggle require deliberate interaction. Volume fades over 450 ms to a restrained 35%; the audio is never enabled automatically. Both controls share one audio state. Story beats follow actual video time and pause with it.

## Pages and data

The app includes eight service pages, Goodreads scopes with query preselection, a staged proposal, portfolio search/filters and case study routes, about/process/contact, permissioned team/article/testimonial routes, policy pages and admin content/inquiry screens. Empty galleries are honest; studio illustrations are labeled and never presented as client work.

Supabase migrations provide RLS-backed roles, content, private inquiries, notes, revisions, audit records, storage policies and an idempotent transactional mail outbox. Admin authorization is checked on the server and in RLS. Inquiry and email code remains unavailable until real configuration is supplied; preview mode can download a local brief and never pretends to send one.

## Configuration and remaining launch gates

Use `.env.example` and [the deployment runbook](docs/deployment-runbook.md). Credentials stay server-side and out of source. The app defaults to noindex staging. The custom domain, contact address, real team biographies, client asset permissions, testimonials and legal policies need owner confirmation. Original Sites access was restored on 4 November 2026; the existing Site ID and private audience are preserved. See implementation status for the latest publication result.

See [implementation status](docs/implementation-status.md), [QA evidence](docs/qa-checklist.md), [cinematic handoff](docs/cinematic-handoff.md), [content inventory](docs/content-inventory.md) and [SEO notes](docs/seo-audit.md). The local PostgreSQL suite uses disposable test identities and minimal Supabase platform schemas; hosted Auth/Storage and real transactional mail still need end-to-end verification.

## Author trust and booking features

The public release adds `/pricing`, `/consultation`, `/sample-proposal`, `/working-together`, `/resources` and three checklist detail routes. Home and service pages connect samples, scope, FAQs, people and relevant author feedback to the quote flow. The sample viewer is an original labeled demonstration; real projects use the existing permissioned CMS and approved media.

Use [the owner content checklist](docs/owner-content-checklist.md) to supply work, biographies, feedback and approved commercial details. Edit `content/studio-profile.json` for public pricing, timing and policies. A rate appears only when amount, currency and qualifying scope are supplied. Set an approved HTTPS consultation URL in that file or `CONSULTATION_URL`; blank configuration shows an honest pending state.

Apply both SQL migrations in order. `202611040002_inquiry_platform.sql` adds the private platform selection used by the updated form. Format choices, platform and manuscript stage survive review/back navigation and the local brief download. The existing save/outbox pipeline is retained; real delivery still requires credentials and end-to-end verification.

The CMS project editor now accepts interior/detail images as `published-media-path | descriptive alt text`, one per line. Images remain permissioned and must be published as Media before public use. No manuscript upload, author account portal, payment collection or analytics has been exposed as working functionality.

## Social sharing

Six versioned 1200 x 630 social preview cards are selected by page category. Open Graph and large-image Twitter/X metadata are server-rendered with explicit image URL, PNG type, dimensions and alt text. The safe origin fallback is the existing hosted Site URL; set `SITE_ORIGIN` to the final public HTTPS domain at launch. No social accounts or app IDs are invented.

Instagram feed (1080 x 1350) and Story (1080 x 1920) graphics are separate exports under `public/brand/share`. Story graphics leave space for a native Link sticker. See [the sharing guide](docs/social-sharing-guide.md) for file mapping, captions and launch checks. Regenerate artwork with `node scripts/generate-social-cards.mjs`. Current access remains private, so real Facebook crawler/cache validation remains a public-launch step.
