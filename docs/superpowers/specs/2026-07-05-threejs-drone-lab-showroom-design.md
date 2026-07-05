# Three.js Drone Lab Showroom Design

## Goal

Replace the current static hero visual with a full-scene Three.js drone lab showroom on the homepage. The scene should feel premium, technical, and spatial: a dark research lab with shelves, benches, illuminated drone stations, and scroll-driven camera motion.

## User Experience

- The first viewport shows the brand headline, CTA, and a 3D lab room.
- Three drones are visible near the front when the page first loads.
- Scrolling down or up moves the camera laterally through the lab and focuses each drone station.
- Pointer movement adds subtle parallax to the camera target.
- The CTA remains HTML overlay text and opens Zalo at `https://zalo.me/0384070636`.
- Mobile uses the same scene with a tighter camera path and reduced object density if needed.
- Reduced-motion users see a stable lab scene without scroll-driven camera jumps.

## Visual Direction

- Dark graphite lab room, glass-like display shelves, teal edge lighting, amber status markers.
- Drone models are stylized procedural 3D objects for v1: body, arms, rotors, sensor pod, glow accents.
- Later versions can replace procedural drones with `.glb` product assets without changing the page structure.

## Technical Design

- Use `three`, `@react-three/fiber`, and `@react-three/drei`.
- Create `DroneLabShowroom` as a client component.
- Keep the scene full-bleed and unframed.
- Drive camera progress from the scroll position of the hero section.
- Use HTML overlay for copy, CTA, active station metadata, and accessibility.
- Add a test-mode fallback so Vitest/jsdom does not require WebGL.

## Verification

- Unit/render tests for CTA, station labels, and homepage integration.
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm audit --omit=dev`
- Playwright desktop and mobile screenshots.
- Canvas pixel check to verify the WebGL scene is not blank.

