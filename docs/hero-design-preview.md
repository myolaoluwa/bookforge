# Hero concept awaiting review

Latest direction: retain the original live hero copy and composition. The preview now uses `CinematicHero captionTop` with `caption-position.css`; the changing film caption is near the top right on desktop and above the main message in normal flow on mobile. The default homepage is unchanged. Eight viewport checks passed for header clearance, text separation and horizontal overflow (320, 390, 768, 1024, 1440, 1920, 568 landscape and 844 landscape widths). Current images: outputs/review/caption-top-1440.png and caption-top-390.png. Earlier refinement details below describe the previous concept only.

User requested a more attractive hero and explicitly requested a preview before going live. This concept is local only. Do not deploy or replace the homepage hero until the user approves it.

Preview route: http://127.0.0.1:5173/hero-preview

The user preferred the existing cinematic hero over the proposed split layout. The preview now uses CinematicHero with its optional refined prop and route-scoped refinement.css. The homepage continues to use the original default. It retains the film treatment, logo, soundtrack, responsive composition, story beats and controls. Only preview copy, typography, colour emphasis, action styling and spacing are refined. The headline is now 'You wrote the story. We’ll shape what comes next.' Supporting copy describes the services and the benefit of making room for the author. The unused split concept component and styles were removed.

Validated with TypeScript, production build, six local Edge viewport checks (320, 390, 768, 844, 1024 and 1440 widths), hero-scoped axe scan (zero violations), play/pause controls, quote navigation, review anchor and confirmation that the original homepage is unchanged. Reduced motion stops automatic film playback. These checks do not certify every browser or physical device.

Current screenshots: outputs/review/hero-refined-1440.png and hero-refined-390.png. Local preview runs from the built production artifact, without deploying to Cloudflare. The six viewport checks also verified that the new copy does not overlap story captions or the header and that the primary quote button is visible within each tested viewport.
