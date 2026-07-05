# DroneViet Brand Solution Catalog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Vercel-ready Next.js brand website for Drone Viet with a high-tech education drone landing page, solution catalog, curriculum library, services, partners, and article content loaded from local source files.

**Architecture:** Use Next.js App Router with TypeScript. Keep content access behind typed loader functions so local Markdown/data files can later be replaced by an admin/database source without rewriting page components.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Zod, gray-matter, Lucide React, Vitest, Testing Library, Vercel.

## Global Constraints

- No admin dashboard or database in v1.
- Content must load from local Markdown/data source files.
- UI direction must be high-tech drone lab, not a generic education landing page.
- Primary CTA text must be "Liên hệ tư vấn ngay" and open Zalo at `https://zalo.me/0384070636`.
- The site must be deployable to Vercel with `npm run build`.
- Page components must consume typed content loader functions instead of importing raw Markdown/data directly.
- Real images are not available; use structured visual placeholders that can be replaced later.

---

## File Structure

- Create `package.json`, Next.js config, TypeScript config, Tailwind/global CSS, and app files through `create-next-app`.
- Create `src/content/data/site.ts` for typed source data covering drones, curriculum, services, partners, and landing content.
- Create `src/content/articles/*.md` for article source files.
- Create `src/lib/content/schema.ts` for Zod schemas and exported TypeScript types.
- Create `src/lib/content/index.ts` for content loader functions.
- Create `src/components/*` for reusable visual sections and cards.
- Create `src/app/*` routes for landing, solutions, curriculum, services, and articles.
- Create `src/lib/content/content.test.ts` for data loader tests.
- Create `src/components/home-page.test.tsx` for page/component smoke tests.

## Task 1: Scaffold And Tooling

**Files:**
- Create: Next.js project files
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`

**Interfaces:**
- Produces: runnable commands `npm run dev`, `npm run lint`, `npm run test`, `npm run build`

- [ ] Scaffold a Next.js TypeScript App Router project in the repo root.
- [ ] Install runtime packages: `zod`, `gray-matter`, `lucide-react`.
- [ ] Install test packages: `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`.
- [ ] Configure Vitest with jsdom and `src/test/setup.ts`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.

## Task 2: Content Layer

**Files:**
- Create: `src/content/data/site.ts`
- Create: `src/content/articles/drone-giao-duc-stem.md`
- Create: `src/content/articles/giao-trinh-drone-theo-cap-hoc.md`
- Create: `src/lib/content/schema.ts`
- Create: `src/lib/content/index.ts`
- Test: `src/lib/content/content.test.ts`

**Interfaces:**
- Produces:
  - `getSiteContent(): SiteContent`
  - `getDroneModels(): DroneModel[]`
  - `getCurriculumItems(): CurriculumItem[]`
  - `getServices(): Service[]`
  - `getPartners(): Partner[]`
  - `getArticles(): ArticleSummary[]`
  - `getArticleBySlug(slug: string): Article | null`

- [ ] Write failing tests that assert content collections load, validate, and articles can be found by slug.
- [ ] Run tests and confirm they fail because the content layer does not exist.
- [ ] Implement schemas, source content, Markdown articles, and loader functions.
- [ ] Run tests and confirm they pass.

## Task 3: Design System And Shared Components

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/components/site-header.tsx`
- Create: `src/components/site-footer.tsx`
- Create: `src/components/section-shell.tsx`
- Create: `src/components/drone-card.tsx`
- Create: `src/components/curriculum-card.tsx`
- Create: `src/components/service-card.tsx`
- Create: `src/components/lab-visual.tsx`
- Test: `src/components/home-page.test.tsx`

**Interfaces:**
- Consumes: content types from `src/lib/content/schema.ts`
- Produces: reusable presentational components for pages

- [ ] Write failing render tests for header navigation, primary CTA, and featured content cards.
- [ ] Run tests and confirm they fail because components do not exist.
- [ ] Implement design tokens, layout primitives, cards, header, footer, and lab visual.
- [ ] Run tests and confirm they pass.

## Task 4: Public Routes

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/giai-phap/page.tsx`
- Create: `src/app/giao-trinh/page.tsx`
- Create: `src/app/dich-vu/page.tsx`
- Create: `src/app/tin-tuc/page.tsx`
- Create: `src/app/tin-tuc/[slug]/page.tsx`

**Interfaces:**
- Consumes: loader functions from `src/lib/content/index.ts`
- Produces: public website routes

- [ ] Write failing smoke tests or build checks for route-level content expectations.
- [ ] Run tests and confirm the expected route content is missing.
- [ ] Implement landing page and all public routes.
- [ ] Run tests and confirm they pass.

## Task 5: Verification And Vercel Readiness

**Files:**
- Modify: `README.md`

**Interfaces:**
- Produces: documented local and Vercel deployment commands

- [ ] Add README instructions for development, content editing, tests, build, and Vercel deployment.
- [ ] Run `npm run lint`.
- [ ] Run `npm run test`.
- [ ] Run `npm run build`.
- [ ] Start local dev server and inspect the rendered site.
