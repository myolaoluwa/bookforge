# BookForge custom domain

Connected 6 November 2026. Namecheap remains the registrar; Cloudflare is authoritative DNS. Zone bookforge.ink is active.

Both https://bookforge.ink and https://www.bookforge.ink route to the existing bookforge-publishing-studio Worker. The primary canonical and social metadata origin is https://bookforge.ink. Cloudflare provisions HTTPS for the custom domains. The workers.dev address remains available.

Production domain routes and public origin are declared in vite.config.ts and emitted into dist/server/wrangler.json when building. This keeps future deployments from dropping the custom domains or restoring the old sharing URL.

Deploy from the project directory:

```powershell
npm.cmd run build
npx.cmd wrangler deploy --config dist/server/wrangler.json
```

SITE_INDEXABLE remains false until a separate launch decision. Local .env.local retains its localhost URL. Domain connection does not configure the domain's mailbox or Resend sender verification.
