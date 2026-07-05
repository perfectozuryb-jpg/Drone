# DroneViet.vn

Website thương hiệu cho bộ giải pháp drone nghiên cứu và giáo dục từ cấp 1 đến đại học của Drone Việt.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Zod
- gray-matter
- Vitest + Testing Library

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Content Editing

Main source content lives in:

- `src/content/data/site.ts`: brand copy, navigation, drone catalog, curriculum, services, partners.
- `src/content/articles/*.md`: article frontmatter and Markdown body.

The UI reads content through `src/lib/content/index.ts`. Keep pages and components using the loader functions so the source can later move to an admin/database layer.

## Verification

```bash
npm run lint
npm run test
npm run build
```

## Vercel Deploy

Use the default Vercel Next.js preset.

- Build command: `npm run build`
- Install command: `npm install`
- Output directory: managed by Next.js/Vercel
