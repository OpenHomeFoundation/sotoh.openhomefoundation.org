# State of the Open Home

Website for **State of the Open Home**, the annual event organized by the [Open Home Foundation](https://www.openhomefoundation.org/) celebrating the open home community. The event takes place in Utrecht, The Netherlands at the TivoliVredenburg venue.

Live at: [sotoh.openhomefoundation.org](https://sotoh.openhomefoundation.org)

## Tech Stack

- [Astro](https://astro.build/) — static site generator
- [Sass](https://sass-lang.com/) — styling
- [GSAP](https://gsap.com/) — animations
- [Matter.js](https://brm.io/matter-js/) — physics simulations
- [Netlify](https://www.netlify.com/) — hosting and deployment

## Prerequisites

- Node.js 22 (see `.nvmrc`)
- npm

## Getting Started

```sh
npm install
npm run dev
```

The dev server starts at `localhost:4321`.

## Commands

| Command             | Description                                      |
| :------------------ | :----------------------------------------------- |
| `npm run dev`       | Start local dev server                           |
| `npm run build`     | Build the production site to `./dist/`           |
| `npm run preview`   | Preview the production build locally             |
| `npm run astro ...` | Run Astro CLI commands (e.g. `astro add`)        |

## Project Structure

Each edition's look and feel lives in its own folder, so a new edition can be
designed without changing the archive of a previous one.

```
src/
  editions/
    2026/            # Everything that makes up the 2026 design
      layouts/       # Layout, TextLayout
      components/    # Reusable UI (Button, Header, FullImage, LinkCard, Marquee, …)
      sections/      # Homepage sections, plus archive/ for the /2026/ page
      data/          # Content as data: navigation, plus archive/ (one file per archived year)
      lib/           # Icons, logos, footer physics, YouTube helpers
      styles/        # Variables, typography, mixins
      assets/        # Images and SVG icons (optimised by astro:assets)
  lib/               # Design-neutral utilities shared by every edition
  pages/
    index.astro          # Homepage (currently uses editions/2026)
    [year]/index.astro   # Archive pages (/2026/, /2025/, /2024/) – always use editions/2026
public/              # Favicons, manifest, ticket and speaker-card artwork
```

Import edition code with the `@2026/*` path alias (see `tsconfig.json`).

### Starting a new edition

1. Create `src/editions/<year>/` (copy `2026` as a starting point if the design is similar).
2. Point `src/pages/index.astro` at the new edition.
3. Leave `src/pages/[year]/` untouched – the archive pages keep the 2026 design.

### Adding or updating an archived year

Each archived year is one file in `src/editions/2026/data/archive/` (see
`types.ts`), listed in `data/archive/index.ts`. Listing it creates `/<year>/`
and adds it to the menu, footer and other years' "past editions" section.

- **Gallery photos:** for 2025/2024, drop images into
  `src/editions/2026/assets/archive/<year>/gallery/` (prefix names `01-`, `02-`…
  to set the order).
- **Speaker cards:** add picture-only cards to that year's `speakers.photos`.
- Until either exists, the page shows placeholders and the build prints a TODO.
