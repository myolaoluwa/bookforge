# The people behind the pages

The homepage and `/about` share an editorial studio section. A portrait stage pairs with a selectable roster and a short introduction. On phones the roster comes before the portrait so a tap reveals the selected introduction immediately below it. There is no automatic carousel or additional video download. The existing hero film and soundtrack remain the main cinematic experience.

## Content needed from the owner

For each person you want to introduce, provide:

- Their approved public name and actual role.
- A portrait you have permission to publish, ideally 1200 × 1500 pixels or larger, with some space around the face. The desktop frame uses 4:5 and the mobile frame uses a square crop, so keep the face near the centre.
- A short introduction of about 35–60 words, plus an optional longer biography for the profile page.
- Accurate portrait alternative text and permission to publish the introduction.

The three empty introduction slots suggest a founder, editorial craft, and book design. They are explicitly labelled placeholders and do not establish the team size or staffing. Replace or remove them according to the real team. No stock people, fabricated names, qualifications or testimonials were added.

## Adding approved profiles

The section reads the existing published `team` records. In the admin Team area use the person's name as the title, their short introduction as the summary, their biography as the body, and the data fields `role`, `cover` (portrait URL), and `alt`. Each published record links to `/team/{slug}`. When any real records are published, the placeholder set is replaced entirely; a missing portrait remains clearly marked. Database/admin configuration is required to publish records.

## Design references

- [Kreativy by Illiyin Studio](https://dribbble.com/shots/25996696-Kreativy-Our-Team-Agency-Website): portrait-led hierarchy, concise biographies and editorial scale.
- [Agency Website Team Section by Fazle Rabbi Bishal](https://dribbble.com/shots/27089685-Agency-Website-Team-Section): restrained dark palette reference.
- [Awwwards animation collection](https://www.awwwards.com/websites/animation/): reference research for deliberate transitions. One investigated individual Awwwards page was inaccessible; no claims about its implementation are made.

Bookforge uses its own ink, ivory and copper palette, local Cormorant and Manrope fonts, and original typographic portrait placeholders. References are not copied assets.

## Behavior and accessibility

Selection uses native buttons with `aria-pressed`, an associated labelled region, visible keyboard focus, and hydration readiness. Enter or Space selects the focused button. Portrait and copy changes use a short shutter reveal and fade, disabled under `prefers-reduced-motion`. No timed rotation, scroll interception, or hover-only content is used.

## Verification

Verification evidence and results are recorded in `docs/implementation-status.md`. Review screenshots and geometry reports are stored locally under ignored `outputs/review/ensemble-*` files. These are layout checks in Chromium/Edge, not certification on physical devices.
