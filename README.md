# State of the Open Home

Website for **State of the Open Home**, the annual event organized by the [Open Home Foundation](https://www.openhomefoundation.org/) celebrating the open home community. The event takes place in Utrecht, The Netherlands at the TivoliVredenburg venue.

Live at: [sotoh.openhomefoundation.org](https://sotoh.openhomefoundation.org)

## Tech Stack

- [Astro](https://astro.build/) — static site generator
- [Sass](https://sass-lang.com/) — styling
- [GSAP](https://gsap.com/) — animations
- [Matter.js](https://brm.io/matter-js/) — physics simulations
- [Playwright](https://playwright.dev/) — end-to-end testing
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
| `npm run test`      | Run Playwright end-to-end tests                  |
| `npm run astro ...` | Run Astro CLI commands (e.g. `astro add`)        |

## Project Structure

```
src/
  components/   # Reusable UI components (Hero, Countdown, Ticket, FAQ, etc.)
  sections/     # Page sections (Building, Speakers, BePart, Footer, etc.)
  layouts/      # Page layouts (Layout, TextLayout)
  pages/        # Astro file-based routing (index, FAQ, venue, invite, etc.)
  lib/          # Shared utilities and data (icons, speakers, countdown, etc.)
  styles/       # Global styles, variables, and mixins
  images/       # Static images and carousel slides
public/         # Favicons, manifest, and other static assets
tests/          # Playwright test specs
```
