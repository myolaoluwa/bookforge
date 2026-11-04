# Bookforge implementation status

Source of truth: `website vision.md` and the supplied Bookforge execution prompt. Existing Folio implementation is preserved under `archive/folio-v1` and its media under `public/reference`.

## Plan and acceptance gates

- [x] P0: Read complete source, inspect repository, inventory assets and unknowns. No genuine portfolio, team bios, portraits or endorsements supplied. No Supabase or mail credentials configured. Original Sites access was initially unavailable and was restored during the editorial refinement; the existing identity is retained. Domain lookup returns synthetic/private addresses, so ownership and DNS are unverified.
- [x] P1 local foundation: Next App Router-compatible TypeScript/Vinext, tokens, self-hosted licensed fonts, route/metadata framework, validation and tests. Database migrations successfully applied to disposable PostgreSQL. This is not a deployed Supabase instance.
- [x] P2 local marketing implementation: home, eight services, process, about, contact, policy and empty-state pages. Public routes have server-rendered headings and unique metadata. No invented biographies, client projects or endorsements.
- [ ] P3 production CMS gate: server-side Auth/role checks, draft/preview/publication/archive controls, private media upload, notes and audit/revision records implemented. Local PostgreSQL role/RLS tests and server permission tests pass. Hosted Auth/Storage, real admin CRUD flow and approved portfolio assets still require configuration. Autosave, rollback UI and automatic slug history remain future work.
- [ ] P4 launch SEO/content gate: Goodreads tiers and all three inquiry scope mappings implemented, server metadata/robots/sitemap and honest empty states present. Query spot-check recorded in `docs/seo-audit.md`; no keyword volume claims. Real specialist-reviewed articles, people and case studies await approval. Indexing remains disabled.
- [ ] P5 live-delivery gate: staged form, readiness state, download fallback, streaming request limits, consent, server validation, transactional rate limit/idempotency and mail outbox implemented and locally tested. Provider failures and uncertain delivery states remain pending rather than fake success. Real DB/Turnstile/sender/inbox verification still required. No public manuscript attachments.
- [x] P6 cinematic refinement: the original `ReferenceFilm` and film are preserved, now the centerpiece of a full-viewport hero. A solid ink canvas and side mask avoid duplicate video downloads; mobile receives a 759 KB derivative of the same footage. Persistent H1/CTA, playback-time storytelling, preference-aware muted autoplay, explicit pause/play and one deliberately enabled looping soundtrack. Hero and service content are visible without JavaScript; no scroll hijacking.
- [ ] P7 public launch: local browser, a11y, migration and production-build checks are recorded in `docs/qa-checklist.md`. Original Sites access is restored; this checked source is prepared for staging publication. Publication outcome is reported in the session handoff. Hosted integration tests, canonical domain/TLS, mail verification, approved business content, policy review, backup restore and monitoring remain external gates.
- [ ] P8: Post-launch measurement. Requires a real launch and baseline data.

## Reporting rule

Implemented code is distinct from a verified integration. A feature depending on unavailable credentials is not production complete. Do not claim live email, deployed migrations, CMS readiness, launch performance or custom-domain publication without evidence.

## Current handoff

See `docs/cinematic-handoff.md` for preserved asset hashes, exact files changed, composition/audio details and configuration blockers. Run instructions are in `README.md` and `docs/deployment-runbook.md`. The old static implementation remains archived. No source permission, client identity, business fact or infrastructure credential was invented to close an external gate.

## Professional editorial refinement

The homepage was recomposed around the existing film, with a clearer ivory/copper headline hierarchy, 16px explanatory copy, quieter narrative captions, clean section boundaries, larger labeled cover/interior studies, a simplified Goodreads section and consistent proposal calls to action. Shared page typography, service listings, packages, empty states and footer were also refined. Responsive and accessibility verification is recorded in the QA checklist.
