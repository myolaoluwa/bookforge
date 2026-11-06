# Transactional email connection

Configured 6 November 2026. The supplied Resend API key authenticates successfully. The local environment and Cloudflare Worker secrets now include:

- MAIL_FROM: BookForge <hello@bookforge.ink>
- AGENCY_INBOX: hello@bookforge.ink
- CONTACT_EMAIL: hello@bookforge.ink
- RESEND_API_KEY: stored privately; never include its value in source or documentation.

The live /api/health endpoint reports emailConfigured: true, and /contact renders the correct mail link. No delivery test email has been sent. Domain verification must complete before claiming delivery is ready. Required Resend records are the DKIM TXT, rsend CNAME to rsend-euw1.forge.rmta.net, and send CNAME to send.forge.rmta.net. CNAME records must be DNS only, not proxied.

After the user disabled proxying, both CNAMEs were confirmed directly against the domain's authoritative Cloudflare nameserver. Resend then verified DKIM and send; its rsend verification remained pending at the last check. No further DNS value change was indicated.

The receiving domain currently has Namecheap forwarding MX records. This confirms routing is published, but does not verify the hello mailbox/forwarding destination or prove receipt.

Website inquiry submission separately requires the Supabase schema and production credentials plus Cloudflare Turnstile. Those integrations are not enabled by uploading the email settings. The live health response still reports databaseConfigured: false and inquiriesConfigured: false.

Future normal Worker deployments preserve the uploaded secrets. Do not put credentials into vite.config.ts or commit .env.local.
