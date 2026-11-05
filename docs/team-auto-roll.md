# Slow automatic team gallery

The same WebGL gallery now advances automatically on desktop and mobile at roughly one portrait every 20 seconds (a full three-person loop in about a minute). A three-second opening hold keeps Adele centred initially. The movement is frame-time based; it does not change speed with display refresh rate.

Existing mobile arrows, swipe, desktop dragging, horizontal wheel and keyboard controls remain. Manual selection/dragging defers automatic movement for eight seconds. Desktop hover and keyboard focus pause it. The animation clock stops while the gallery is offscreen or the document is hidden, and respects reduced motion by retaining the selectable still gallery. Automatic cycling does not continuously announce changing biographies to screen readers.

Desktop/mobile browser checks cover slow autonomous progress, hover pause, arrow selection and delayed resumption, offscreen stopping, reduced-motion fallback, keyboard controls, swiping, responsive sizes and graphics loss. Existing portrait resolution and image assets are unchanged.
