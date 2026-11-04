> Historical cinematic implementation record. The following describes the earlier composition and its original local evidence. The later editorial pass removed the blurred still extension, and Sites access was restored with a successful private publication. Current trust features and owner inputs are recorded in `implementation-status.md`, `design-system.md` and `owner-content-checklist.md`. Earlier performance samples do not measure the trust release.

﻿# Cinematic implementation handoff

## Preserved assets and component

- `public/reference/city-loop.mp4`: the existing 20-second H.264 portrait video, 800 × 1200, 4,131,451 bytes. SHA-256 `3bdaefe8e19059d7e0c9d89c5c28f2bb051ff8d7b434449d5241055b407ad987` matches the previously committed `dist/assets/city-loop.mp4` exactly.
- `public/reference/ambience.mp3`: the existing 20.053-second soundtrack, 415,289 bytes. Peak scan −0.2 dB, average −18.9 dB. This is a technical level check, not a claim of a human listening review. Confirm artistic suitability and web usage rights before public launch.
- `ReferenceFilm` in `components/bookforge/shell.tsx`: retained and extended with cinematic mode, responsive sources, poster, callbacks and a ref. Default controlled-interlude mode remains supported.
- The original 61,143,756-byte 2000 × 3000 upload was not modified, replaced or regenerated. It is not served as the hero download.

## Exact implementation files changed in this refinement

| File | Change |
|---|---|
| `app/page.tsx` | Existing homepage now opens with the film; relief section and book study retain the rest of the site |
| `app/layout.tsx` | Cinematic stylesheet and shared persistent audio control; skip link remains first |
| `app/cinematic.css` | Full viewport composition, still extension, masks, mobile/tablet/ultrawide layouts and reduced motion |
| `app/loading.tsx` | Removed the global suspense fallback that hid content without JavaScript |
| `components/bookforge/cinematic-hero.tsx` | Immediate heading/CTA, film lifecycle, timed story and keyboard-accessible controls |
| `components/bookforge/shell.tsx` | Preserved ReferenceFilm; shared sound state; accessible navigation/control labels |
| `components/bookforge/sound.ts` | One soundtrack, deliberate enable, continuous loop, bounded fade and shared control state |
| `lib/bookforge/cinema.ts` | Playback-time story beats, responsibility labels and volume interpolation |
| `components/bookforge/admin.tsx` | Private media upload UI, honest draft and failure feedback |
| `app/admin/[section]/page.tsx` | Media form integration with existing authorization |
| `lib/bookforge/http.ts` | Bounded streaming JSON reads |
| `lib/bookforge/mail.ts` | Do not report delivered mail when provider success cannot be recorded |
| `lib/bookforge/validation.ts` | Literal file extension validation correction |
| `lib/bookforge/seo.ts` | Raster sharing image |
| `public/reference/city-loop-mobile.mp4` | New 480 × 720 derivative of the same film, 759,413 bytes |
| `public/reference/poster.webp` | Optimized still from the existing poster, 85,070 bytes |
| `public/brand/social.png` | Raster version of the existing original brand sharing graphic |
| `tests/unit/cinema.test.ts`, `tests/unit/http.test.ts` | Timeline/fade and bounded request regression tests |
| `tests/integration/cms.test.ts`, `tests/integration/mail.test.ts` | Role/publication and provider/outbox failure tests |
| `tests/e2e/studio.spec.ts` | Desktop/mobile route, proposal, navigation, a11y, no-JS, media and responsive checks |
| `tests/database/bootstrap.sql`, `tests/database/security.sql` | Disposable PostgreSQL migration, RLS and transaction tests |
| `scripts/media-inventory.mjs`, `scripts/performance-review.mjs` | Reproducible asset integrity and production lab inspection |
| `README.md`, `docs/implementation-status.md`, `docs/qa-checklist.md`, `docs/deployment-runbook.md`, `docs/seo-audit.md`, `docs/design-system.md`, `docs/content-inventory.md`, `docs/cinematic-handoff.md` | Current implementation, evidence and blockers |

The original film, soundtrack, services, Goodreads packages, proposal flow, database migration and existing CMS were retained. Generated `dist/` output is refreshed by the production build; it is not the authored source.

## Widescreen and responsive treatment

The foreground keeps the portrait ratio and uses its full vertical composition on desktop. Its side mask blends into a blurred, enlarged still from the same footage. Solid/soft dark overlays create readable space on the left. The extension costs one small poster rather than another full-resolution video decode. On mobile, the same character is centered in a portrait crop with readable text, immediately available actions and supporting story copy below. There is no forced video loader or locked scroll sequence.

The dark scene gives way to ivory editorial content headed “From finished manuscript to publication-ready book.” The original illustrative book study appears later as the calm production outcome. It is clearly labeled as a studio illustration, not approved client work.

## Audio and storytelling

Muted automatic playback runs only when user preferences permit. The separate existing soundtrack begins through a real click or keyboard activation; it loops independently at 35% volume. Fade values are clamped even when an animation-frame timestamp precedes its initialization. The persistent toggle works across page navigation and can fade/mute the soundtrack. It does not request or bypass browser audio permissions.

Supporting copy progresses at 0, 3.5, 8.5, 13 and 17 seconds: completion, overwhelm, relief, Bookforge, and readiness. Responsibility labels appear one at a time. This duplicate visual storytelling is hidden from screen readers to avoid repeated announcements; the permanent H1, service explanation and CTA are always available. Reduced-motion mode holds the relief message and a still until explicit play.

## Evidence and launch limits

Lint, strict TypeScript, the final production build, 43 unit/mocked integration tests and all 28 desktop/mobile browser tests passed. The PostgreSQL migration/RLS/idempotency suite also passed on a disposable local database. Automated axe checks passed on the homepage, Goodreads, proposal and paperback pages. Keyboard navigation, all service routes, all three Goodreads scope mappings, media controls, reduced motion, no-JavaScript content and 360–2560 px widths were verified.

The isolated production lab run measured desktop LCP 1,484 ms and throttled mobile LCP 1,276 ms, both CLS 0. Earlier cold/concurrent desktop samples missed the target and are documented in `docs/qa-checklist.md`. These are local lab samples, not field Core Web Vitals or physical-device results. Screenshots and JSON artifacts are under ignored `outputs/review/`. Hosted Supabase Auth/Storage and actual email delivery remain unverified.

The original Site ID returns `project_not_found` in this session. No new deployment is claimed. Real Supabase credentials, Turnstile hostname configuration, sender/inbox verification, domain ownership/DNS/TLS, policies and approved business assets remain launch gates. No live messages were sent and no replacement site was created.

