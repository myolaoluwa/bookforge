# QA evidence

Local validation distinguishes implemented code from a configured service. All test identities and mail recipients are fixtures; no live mail was sent.

## Commands and evidence

| Check | Command / mechanism | State |
|---|---|---|
| Lint | `npm run lint` | Passed |
| TypeScript | `npm run typecheck` | Passed |
| Unit + mocked server integration | `npm test` | 43 tests passed |
| Browser | `npm run test:e2e` | 28 passed (1.9 minutes) |
| Production artifact | `node <Sites plugin>/scripts/build-site.mjs` | Passed on final source |
| PostgreSQL migration/RLS | `psql` with bootstrap, migration and `tests/database/security.sql` | Passed on isolated local PostgreSQL 18 |
| Media integrity | `node scripts/media-inventory.mjs` | Passed: original desktop derivative byte-identical to prior commit |
| Production lab | `node scripts/performance-review.mjs` against local built Worker | Final built-Worker measurements collected; see local samples below |

The PostgreSQL suite provisions a dedicated disposable test database with minimal `auth` and `storage` platform schemas. It checks anonymous published-only reads, hidden drafts/private inquiries/profiles/revisions/storage, rejected anonymous writes, viewer restrictions, no self-role escalation, editor publication checks, owner deletion/audit, transactional inquiry idempotency and duplicate mail-claim locking. It does not emulate the Supabase Auth API, Storage server or actual mail delivery.

The browser suite uses installed Edge/Chromium in desktop and mobile emulation. It covers meaningful HTML and distinct metadata on all public routes, 404 behavior, anonymous admin closure, inquiry readiness, all three Goodreads tier mappings, portfolio filters, sound enable/mute, one muted film, reduced motion, no-JavaScript content, keyboard navigation, initial CTA visibility and 360/768/1440/2560 widths. It fails on unhandled script errors. Axe checks homepage, Goodreads, proposal and paperback pages.

## Resolved failures

- Ivory-on-sage small text narrowly missed contrast; brighter paper text now meets the automated check.
- Navigation/control accessible names did not include the visible labels; corrected.
- The root suspense fallback hid meaningful HTML when scripting was off; removed that blanket boundary.
- Native form submission could occur before client readiness; controls now wait for hydration and the form uses POST rather than exposing fields in a URL.
- Sound could be clicked before handlers were ready; controls wait for hydration and share one soundtrack state.
- A requestAnimationFrame timestamp could precede initialization and produce negative volume; fade progress/output are clamped and regression tested.
- Mail provider success with a failed database update could be overstated; that case now remains pending.

## Production lab samples

An initial 1440 × 900 desktop request included local Worker startup: LCP 3,672 ms, CLS 0.00035. A later sample taken while the full browser suite was also running measured desktop LCP 6,024 ms and mobile LCP 1,380 ms, both CLS 0. Those desktop samples missed the 2.5-second target. The concurrent-run JSON is retained rather than discarded.

After the final build, poster preload and completion of the competing browser suite, an isolated local run measured:

| Mode | LCP | CLS | Resource transfer |
|---|---|---|---|
| Desktop 1440 × 900, unthrottled | 1,484 ms (video candidate) | 0 | 4,417,516 bytes |
| Mobile 390 × 844, 4× CPU, 150 ms latency, 200 KiB/s download | 1,276 ms (H1 candidate) | 0 | 1,045,478 bytes |

Both chose the intended source and had no horizontal overflow. These are single Chromium lab samples from a local production Worker, with a warm server and fresh browser contexts, not field Core Web Vitals or a promise that every cold start/device meets the target. No field INP was measured. Artifacts: `outputs/review/performance.json`, `performance-concurrent-run.json`, and final production screenshots.

One desktop film source: 4,131,451 bytes. Mobile source: 759,413 bytes. Poster: 85,070 bytes. Audio: 415,289 bytes, downloaded only after explicit enable. No 61 MB source or duplicate background video is served. The hero foreground preserves the portrait ratio on desktop and uses a responsive character-centered crop on mobile.

Screenshots and machine-readable media/performance evidence are under ignored `outputs/review/`. No physical mobile hardware, Safari/Firefox, field INP, real screen reader certification or cross-region network measurements are claimed.

## Remaining external acceptance

- Real Supabase Auth, Storage, media withdrawal/cache behavior and owner/admin browser flow.
- Real Turnstile verification, trusted host ingress and live rate-limiting behavior.
- Verified Resend sender/inbox, author receipt, notification, delivery failure/reconciliation.
- Approved team bios, client media/permissions, testimonials, original articles and legal policies.
- Verified canonical domain, TLS, production indexing, backups/restore, monitoring and analytics baselines.


## Editorial refinement review

Full-page screenshots at 1440 ? 900 and 390 ? 844 are retained at `outputs/review/refined-desktop.png` and `refined-mobile.png`. Inspected the hero, service hierarchy, cover/interior study, process, Goodreads content, final invitation and footer. Corrected an apostrophe encoding issue and desktop sound-control overlap. No horizontal overflow in either reviewed layout. The CTA fits in the first viewport. These captures use reduced motion so composition can be reviewed independently of the film. Earlier performance figures above describe the earlier build and are not a new performance claim for this refinement.

Validation after the refinement: TypeScript passed, ESLint passed, 43 unit/integration tests passed, and 28 Playwright tests passed across desktop/mobile Chromium. The browser suite includes axe checks, no-JavaScript content, keyboard navigation, deliberate sound activation, reduced-motion playback and hero checks at narrow mobile, tablet, laptop and ultrawide widths.
