# DroneViet Brand Solution Catalog Design

## Goal

Build the first public version of `droneviet.vn`: a high-tech education drone brand website that presents Drone Viet as a credible provider of drone education solutions for schools, STEM centers, parents, and students.

The primary call to action is "Xem bo giai phap drone giao duc".

## Audience

- School leadership and education administrators evaluating a structured drone education program.
- STEM centers and training providers looking for drone kits, curriculum, and deployment services.
- Parents and students looking for a clear learning pathway and evidence of practical outcomes.

## Scope

### In scope for v1

- Landing page with brand positioning, hero, solution CTA, proof points, and service overview.
- Education drone solution catalog with sample drone models and use cases.
- Curriculum and document section showing completed drone education materials by learning level.
- Services section for consultation, curriculum deployment, teacher training, workshop setup, and custom drone education products.
- Partners and credibility section.
- Blog/news preview using source content files.
- Content source files in Markdown/MDX or typed data files, structured so they can later be replaced by a database-backed admin.
- Vercel-ready Next.js application.

### Out of scope for v1

- Real admin dashboard.
- Database integration.
- Student, teacher, or school login.
- Online course progress tracking.
- Payment or checkout.

## Product Structure

### Main pages

- `/`: brand landing page and primary conversion page.
- `/giai-phap`: catalog of drone education solutions.
- `/giao-trinh`: curriculum and completed document library by level.
- `/dich-vu`: services for education drone deployment.
- `/tin-tuc`: article listing.
- `/tin-tuc/[slug]`: article detail.

### Landing page sections

1. Navigation with links to main sections and CTA.
2. Hero with high-tech drone lab direction, primary CTA, and secondary CTA to view curriculum.
3. Audience pathways for schools, STEM centers, and families.
4. Featured education drone models.
5. Completed curriculum and document proof section.
6. Services overview.
7. Deployment process.
8. Partners and trust signals.
9. Latest articles.
10. Final CTA.

## Content Model

The app will read local source content first. The data layer must hide whether content comes from files or a future CMS.

### Drone model

- `slug`
- `name`
- `summary`
- `level`
- `useCases`
- `learningOutcomes`
- `specs`
- `image`
- `featured`

### Curriculum item

- `slug`
- `title`
- `level`
- `format`
- `summary`
- `modules`
- `outcomes`
- `status`
- `downloadLabel`

### Service

- `slug`
- `title`
- `summary`
- `deliverables`
- `audience`
- `ctaLabel`

### Partner

- `name`
- `type`
- `summary`

### Article

- `slug`
- `title`
- `date`
- `summary`
- `category`
- `readingTime`
- `content`

## Visual Direction

The design direction is "cong nghe cao / drone lab": precise, technical, dark-to-light contrast, strong device presentation, and subtle motion.

### Palette

- Lab graphite: `#0B1117`
- Flight teal: `#00D1C1`
- Signal amber: `#FFB020`
- Surface white: `#F7FAFC`
- Slate text: `#24313D`
- Circuit line: `#6B7C8F`

### Typography

- Display and body: modern sans-serif suitable for Vietnamese text. Use `Inter` or `Geist Sans` as the default, with strong weight contrast.
- Utility/data labels: monospace style via `Geist Mono` or a CSS monospace stack for specs and technical labels.

### Signature element

The landing hero should feel like a drone lab console: a large drone solution panel with telemetry-style metrics, curriculum chips, and controlled hover/motion states. This gives the brand a technology-forward identity without requiring final product photography in v1.

## Architecture

### Tech stack

- Next.js App Router with TypeScript.
- React current stable version from `create-next-app`.
- Tailwind CSS current setup from `create-next-app`.
- Local Markdown/data content loaded at build time.
- Zod for content schema validation.
- Lucide React for UI icons.
- Vitest for unit tests.
- Playwright or Next build smoke checks for release confidence.
- Deploy target: Vercel.

### Code boundaries

- `src/content`: source data and Markdown files.
- `src/lib/content`: content loading, parsing, and validation.
- `src/components`: reusable UI components.
- `src/app`: routes and page composition.
- `src/styles` or `src/app/globals.css`: global design tokens and Tailwind theme usage.

The UI should consume typed content functions, not import raw Markdown directly in page components.

## Data Flow

1. Content files live in the repo.
2. Content loader reads and validates them during build/server rendering.
3. Page routes request typed collections such as `getDroneModels()`, `getCurriculumItems()`, and `getArticles()`.
4. Components render typed content and remain independent from the storage format.

## Error Handling

- Invalid source content should fail fast in development/build with clear Zod validation errors.
- Missing optional images should fall back to polished placeholder panels.
- Article slugs that do not exist should call Next.js `notFound()`.

## SEO And Performance

- Use static metadata for every main page.
- Use structured page headings and descriptive Vietnamese copy.
- Keep the first version mostly static for fast Vercel builds.
- Use CSS-based placeholders instead of heavy image dependencies until real assets are available.

## Testing

- Unit tests for content loading and schema validation.
- Component smoke tests for major page sections.
- `npm run lint`.
- `npm run test`.
- `npm run build`.

## Deployment

The project must deploy on Vercel using default Next.js settings. The expected production build command is `npm run build`.

