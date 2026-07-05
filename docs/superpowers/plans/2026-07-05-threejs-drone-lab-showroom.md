# Three.js Drone Lab Showroom Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage hero with a full-bleed Three.js lab showroom whose camera moves through drone display stations as the user scrolls.

**Architecture:** Add a client-only `DroneLabShowroom` component that owns the canvas, scroll progress, pointer parallax, and scene objects. Keep copy and CTA in HTML overlay and pass existing typed content from `src/app/page.tsx`.

**Tech Stack:** Next.js App Router, React, TypeScript, Three.js, `@react-three/fiber`, `@react-three/drei`, Tailwind CSS, Vitest, Playwright.

## Global Constraints

- Primary CTA text must be "Liên hệ tư vấn ngay" and open Zalo at `https://zalo.me/0384070636`.
- The primary 3D scene must be full-bleed/unframed, not inside a decorative card.
- The first frame must show three drone models in the lab.
- Scroll up/down must move the camera through drone stations.
- Tests must not require a real WebGL context in jsdom.
- Production build must pass on Vercel with `npm run build`.

---

## Task 1: Tests And Dependencies

**Files:**
- Create: `src/components/drone-lab-showroom.test.tsx`
- Modify: `src/app/routes.test.tsx`
- Modify: `package.json`

**Interfaces:**
- Produces: `DroneLabShowroom` contract with props for content, drones, CTA, and station data.

- [ ] Write failing tests that import `DroneLabShowroom` and expect the hero heading, Zalo CTA, and station labels.
- [ ] Run `npm run test -- src/components/drone-lab-showroom.test.tsx src/app/routes.test.tsx` and confirm failure because the component does not exist.
- [ ] Install `three`, `@react-three/fiber`, and `@react-three/drei`.

## Task 2: Three.js Showroom Component

**Files:**
- Create: `src/components/drone-lab-showroom.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- `DroneLabShowroom(props: DroneLabShowroomProps): JSX.Element`
- Consumes existing `DroneModel[]` and CTA link objects.

- [ ] Implement jsdom/test fallback markup.
- [ ] Implement scroll progress and pointer parallax hooks.
- [ ] Implement lab scene primitives: room, shelves, lights, drone stations, active station telemetry.
- [ ] Replace homepage hero with `DroneLabShowroom`.
- [ ] Run targeted tests and make them pass.

## Task 3: Verification

**Files:**
- Modify as needed after visual QA.

**Interfaces:**
- Produces verified interactive homepage.

- [ ] Run `npm run lint`.
- [ ] Run `npm run test`.
- [ ] Run `npm run build`.
- [ ] Run `npm audit --omit=dev`.
- [ ] Capture Playwright desktop/mobile screenshots of `/`.
- [ ] Run a Playwright canvas pixel check confirming nonblank canvas pixels.
- [ ] Commit the implementation.

