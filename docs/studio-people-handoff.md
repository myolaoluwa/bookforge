# The minds behind your book

The homepage and `/about` share a curved portrait gallery inspired by the image arrangement and movement on the [Meech213 homepage](https://www.meech213.com/). The scope is its photo gallery, not its navigation or whole-page design. Bookforge uses its own paper, ink and local Cormorant/Manrope typography.

## Owner content

For each real person, provide their approved public name, actual role, a portrait you may publish, and a short introduction of about 35?60 words. An optional longer biography appears on the individual profile page. Portraits around 1200 ? 1500 pixels work well. Leave room around the face: the gallery crops portraits into several tall proportions, centred on the image. Supply accurate portrait alternative text and permission to publish.

Five labelled content slots demonstrate the gallery while portraits are missing. Their suggested disciplines do not establish team size, staffing or credentials. Publishing real team records replaces the entire placeholder set. No stock or generated people are presented as team members.

Use the existing admin Team area: title = public name, summary = short introduction, body = biography, data fields = `role`, `cover` (portrait URL) and `alt`. Published records link to `/team/{slug}`. The existing database/admin configuration must be available to publish. Photos stay in website assets or the configured storage provider. Nothing is uploaded to Animorio.

## Motion and fallback

`components/bookforge/portrait-dome.ts` is an original, dependency-free WebGL renderer. Subdivided photo surfaces follow a cylinder, vary in height and proportion, and flex slightly with velocity. Dragging and native touch swipes add momentum, which slows and settles on a portrait. Buttons and arrow keys select profiles. Horizontal trackpad movement or Shift + wheel also rotates the gallery; ordinary vertical scrolling remains available.

The renderer loads when the gallery approaches the viewport, caps pixel density, loads real textures as their surfaces become visible, and stops drawing at rest, offscreen or in a hidden tab. Resources and listeners are released on cleanup. No external animation service, Three.js package, copied reference artwork, or continuously running idle loop is required.

Reduced motion bypasses the canvas and presents a native horizontal portrait list. That list is also the server-rendered, JavaScript-free, unsupported-WebGL and failed-image/CORS fallback. It remains keyboard focusable even before hydration. External portrait URLs need CORS permission for WebGL; without it the native image list is used. Standard published storage URLs are preferable.

The primary reference is the Meech213 homepage gallery. The [developer interview](https://www.commarts.com/webpicks/meech213) and [published motion analysis](https://animorio.com/en/journal/meech213-how-its-made/) helped identify its spatial arrangement and momentum. Bookforge's geometry, interaction code and placeholder artwork were authored independently. This is an adaptation for a small team section, not a claim of an exact reproduction of its full spherical portfolio.

## Verification

Results are recorded in `implementation-status.md`. Local ignored evidence is under `outputs/review/dome-*`. Focused browser checks cover actual canvas rendering, keyboard/button selection, mouse dragging, emulated native touch swiping, momentum settling, vertical scrolling, reduced motion changes, missing graphics support, local asset textures, failure recovery, page accessibility, and narrow/wide layouts. These are Chromium/Edge checks, not physical-device or Safari certification.
