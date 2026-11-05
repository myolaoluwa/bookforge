# Navigation and default sound

The earlier header-only change left client-routed links throughout page bodies and the footer, including “Visit the project gallery.” All remaining application `next/link` usages now use native anchors. This covers gallery links, service directories and recommendations, resource cards, pricing, package proposals, footer links, recovery pages and studio administration. Existing URLs, query parameters, downloads, external-link targets and anchor destinations are retained.

`tests/e2e/navigation-audit.spec.ts` crawls every public route, validates local section anchors and clicks every distinct visible body/footer destination. It checks destination URL, HTTP status and a visible destination heading, with an explicit regression for the reported gallery link. Header, service finder, inquiry steps, local brief download and accessibility checks run alongside it on desktop and mobile.

Sound is requested automatically at 35% volume. If the browser denies audible autoplay, a page pointer or keyboard interaction retries it. A visitor can mute at any point; the choice persists for the tab through native page navigation. Native media errors and browser denial remain accurately represented by the sound control. Tests cover default playback, browser denial, gesture retry, late promise rejection and persisted mute.

The local preview watcher excludes review artifacts and test reports to prevent Windows file-lock crashes while browser verification writes those files. This does not affect production routing.
