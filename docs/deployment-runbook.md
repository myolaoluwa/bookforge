# Bookforge deployment and operations

## Run locally

Use Node 22.13+ and `npm ci`. Run `npm run dev -- --hostname 127.0.0.1 --port 5173`. The app uses Next App Router APIs on the supplied Sites Vinext runtime. `npm run build` creates a Worker artifact; `npm start -- --port 5177` previews that artifact locally. The old static Folio entry points are preserved in `archive/folio-v1` and Git history.

## Configuration

Copy `.env.example` to an ignored local environment file. Configure hosted values through the hosting platform's secret store, never Git. Keys:

| Key | Purpose |
|---|---|
| `SITE_ORIGIN` | Real validated HTTPS canonical origin; local default is localhost |
| `SITE_INDEXABLE` | Keep `false` on staging. Set `true` only after content, domain and launch gates pass |
| `SUPABASE_URL`, `SUPABASE_ANON_KEY` | Provisioned project URL and public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only inquiry RPC, mail outbox and approved media access |
| `RATE_LIMIT_SALT` | Long random secret for hashing trusted incoming IP information |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Matching widget/site secret; configure allowed hostnames and action `proposal` |
| `RESEND_API_KEY`, `MAIL_FROM`, `AGENCY_INBOX` | Verified transactional account, sender and real studio inbox |
| `CONTACT_EMAIL` | Verified public contact address; never assume a proposed address is active |

## Database and first owner

Apply `supabase/migrations/202611040001_bookforge.sql` with Supabase migrations. It creates the content resources, profiles, private inquiries/notes, transactional outbox, revisions, audit records and private image bucket. Do not enable broad anonymous table writes or storage reads. The migration has been tested on disposable local PostgreSQL with minimal Supabase platform schemas; this is not a substitute for hosted Auth/Storage verification.

Disable public signup, configure Supabase password security/rate limits, and create Adele's account through a trusted owner-controlled administration channel. Do not invent an account or password. Insert the actual Auth user UUID in `public.profiles` with `display_name`, `role='owner'`, `status='active'`. Only the owner can change an existing role; no self-registration profile policy exists. Sign in at `/admin/login`. Create editor/viewer accounts only when requested. Never grant owner based solely on a visitor header or email string.

Verify owner/editor/viewer and anonymous behavior against the real Supabase project. The server validates the user and re-reads their active role on every admin request. Public data uses an anonymous client, not the privileged service key.

## Content workflow

Start with drafts. Add plain text paragraphs, specific summaries and source/permission notes. Publishing client work requires permission, a cover path, descriptive alt text and deliverables. Reviews require an original source URL. Keep published slugs stable. The current CMS provides manual draft save, protected preview, publish/archive, owner deletion, revision records and an audit trail. Autosave, rollback UI, scheduled publishing, richer article blocks and automatic slug redirect management remain future work.

For media, upload only prepared web preview images (JPEG/PNG/WebP under 2 MB). No SVG, manuscript or document uploads are accepted. The upload is private and draft by default. Review rights and metadata, then explicitly publish the media before using `/media/<entry-id>` in a project. The public image route rechecks publication and permission on every uncached request. Strip private metadata from assets before approving public use; a dedicated image re-encoding/scanning pipeline is not yet part of this implementation. Media caching is limited to one minute; CDN/image optimizer caches must be considered when withdrawing an asset.

## Inquiry and email verification

1. Configure the real database, Turnstile widget and trusted ingress IP header. On Sites, `cf-connecting-ip` is provided by the edge; another host must overwrite untrusted client headers before reaching the app.
2. Verify sender ownership, SPF/DKIM, DMARC and the receiving inbox. No email was sent during local tests.
3. Submit one real test inquiry. Confirm one private database row and exactly two outbox jobs, one for the author receipt and one for the agency notification. Keep personal manuscript details out of notifications and analytics.
4. Retry the same request: verify the same reference and no duplicate row/mail. A changed payload using an existing idempotency key returns a conflict.
5. Simulate provider failure. The inquiry must remain saved and the UI must report a pending receipt. Review outbox status and use the owner-only retry route `/api/admin/inquiries/<id>/retry` with same-origin POST.
6. A provider success with failed local recording remains pending. Stable Resend keys permit safe retries within its 24-hour retention window; SQL conservatively stops retry claims after 23 hours for attempted jobs. Reconcile old uncertain jobs in the provider dashboard before any manual resend. Do not blindly reset attempt counters.

No inquiry attachments are accepted. Rate limiting and idempotency are transactional in PostgreSQL, with a five-per-hour key limit. Confirm those controls, provider behavior and Turnstile on the deployed host before enabling live submissions.

## Hosting and DNS

Preserve `.openai/hosting.json` project ID `appgprj_6aeaf6fc3100819187e3dd9f5fec722c`. Access was restored and the cinematic refinement was privately published. Obtain fresh source credentials, use the Sites source helper to push/package the checked tree, and publish the matching saved version. Preserve the current owner-only audience unless the owner requests otherwise. Do not create a replacement project.

For this trust release, apply `202611040002_inquiry_platform.sql` after the foundation migration. Set an approved HTTPS `CONSULTATION_URL` or the public profile's consultation URL only when the real calendar is ready. Supply prices and actual business policies through `content/studio-profile.json`. See `owner-content-checklist.md`.

The proposed `bookforgepublishing.ink` domain is not verified. Before custom-domain launch confirm ownership, supported hosting/domain binding, authoritative DNS and TLS, then update `SITE_ORIGIN`. Confirm public email provisioned; do not claim the domain is live merely from a local DNS answer. Check robots, sitemap, canonical tags and all redirects on the deployed origin. Public indexing remains off by default.

## Backups, recovery and monitoring

Enable appropriate Supabase database backups/PITR and separate private Storage backups. Rehearse restoration to a disposable project, including Auth mappings, policies, object permissions and outbox state. Never replay pending notification jobs after a restore without provider reconciliation. Record the owner, retention periods and recovery objectives before launch.

Use hosting error logs and non-PII health checks. `/api/health` reports configuration flags only, not database connectivity or mail deliverability. Add error monitoring and privacy-reviewed analytics only with real accounts; neither is configured now. Do not log request bodies, names, emails, manuscript titles or tokens.

Before launch, run the commands in `docs/qa-checklist.md`, verify approved biographies/portfolio/testimonials and legal policies, test real screen readers and mobile hardware, and record a production performance baseline. No field Core Web Vitals or ranking claims are made.
