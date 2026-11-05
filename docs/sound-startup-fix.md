# Sound startup investigation

Live Cloudflare testing reproduced `NotAllowedError` on initial audio playback under a browser policy requiring user activation. The same deployed build immediately played at volume 0.35 with autoplay allowed; the media was loaded and had no decode error. Thus the audio asset and Cloudflare hosting were functional.

The old saved mute could also suppress playback indefinitely within a tab. A fresh external/direct opening or reload now clears that saved mute and requests default sound again. Mute continues to persist during same-site link navigation. A mute made during the current page is never undone by subsequent interactions.

Gesture retry now covers pointer release, touch end, click and keydown as well as pointerdown. This supports browsers that grant media activation on release rather than at initial touch. Listeners use capture so another component's event handling cannot swallow the retry; the sound control itself remains excluded to avoid double toggles. The audio preloads automatically for faster startup.

Eight sound unit tests and eight desktop/mobile browser checks pass, covering blocked playback, real playback after gestures, a release-only activation scenario, stale mute on fresh entry, reload and internal navigation. Browser policy still governs immediate audible autoplay on a first visit; website code cannot grant itself that permission.
