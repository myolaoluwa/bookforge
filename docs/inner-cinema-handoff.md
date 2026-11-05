# Cinematic inner pages

5 November 2026. Photographic introductions now accompany Services, Portfolio, About, Process, Resources and all eight individual services. Editing and discovery use the editorial desk; covers use cloth; interiors and reader presence use the open book; hardcover and studio craft use binding. Inquiry, legal and long-form reading pages retain their simpler introductions.

`CinematicIntro` is a server-rendered component selected through the optional `PageIntro.scene` prop. Desktop uses a protected dark text field fading into photography. On phones, copy and imagery stack in normal document flow so longer service descriptions and quote buttons remain readable. Images have responsive local sources, dimensions and descriptive alternatives. The images are static and carry no added motion controls. Existing header and quote navigation is retained.

The new editorial image was made with the built-in image_gen tool. Delivered assets are `public/craft/editing.webp` and `public/craft/editing-mobile.webp`. Other introductions reuse the original illustrative studio scenes. Captions distinguish AI-created studio imagery from client work. The supplied logo is unchanged.

Final generation prompt:

> Create one original cinematic editorial photograph for a premium independent book publishing studio website. Wide landscape 16:9 composition. Close view of an editor's quiet desk, cream manuscript pages with faint realistic but unreadable typescript, a few restrained pencil annotations, a beautiful sharpened graphite pencil laid diagonally, a closed deep forest-green clothbound book, warm copper light falling across thick paper. No people, no hands, no screens, no brand logos, no legible words, no watermarks. Tactile paper grain, realistic materials, sophisticated documentary film still, 50mm lens, subtle film grain, shallow focus with important manuscript details sharp. Rich ink-green shadows and amber sidelight, natural light from right. Editorial still life concentrated in right two thirds, dark shadowed wood at left, suitable for dark ivory-and-copper literary website. Actual photograph style, never mockup UI, no ornate decorations.

Local browser review artifacts are under ignored `outputs/review/inner-cinema/`. The review covers eight representative routes at desktop, phone, narrow phone and tablet sizes, checking decoded images, horizontal overflow, browser errors and introduction accessibility. Screenshots were inspected for the desktop and mobile compositions. TypeScript and a production build are checked before publication.
