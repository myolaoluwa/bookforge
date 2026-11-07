# Service-specific quote stages

The quote form now changes “Where is your book now?” for all eight service categories. The underlying stage values remain stable, with labels tailored to editorial, formatting, cover, publishing, marketing or Goodreads work. Selecting a new service resets its stage, Goodreads package and format/platform choices while retaining the author's contact details.

Both service and stage offer an Other option with required custom text. Review and browser download show readable answers. Going back preserves them; changing the selection clears hidden custom answers.

The API validates custom field lengths and their relationship to Other. The selected stage label and any custom help are incorporated into the private project description before saving, so the existing inquiry schema retains the full context without a new migration. The combined description remains subject to the database's 6000-character limit. The form reserves room for context by limiting the main project description to 5000 characters.

Validation includes saved API payloads, missing/stale/oversized custom answers, all eight dropdown mappings, review/back/download behavior, Goodreads packages and accessibility. Live delivery continues to depend on the existing Supabase and Turnstile configuration.
