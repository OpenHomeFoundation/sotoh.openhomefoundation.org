// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import netlify from "@astrojs/netlify";
import { imageBreakpoints } from "./src/lib/breakpoints";

// https://astro.build/config
export default defineConfig({
  site: "https://sotoh.openhomefoundation.org",
  output: "static",
  // Astro 7 defaults to JSX whitespace rules ("jsx"), which drops the spaces
  // that Prettier-wrapped text relies on (e.g. "visit <a>…</a>" → "visit<a>").
  // `true` keeps the lossless compression behaviour from Astro 5.
  compressHTML: true,
  adapter: netlify(),
  integrations: [sitemap()],
  image: {
    breakpoints: imageBreakpoints,
    responsiveStyles: true,
  },
});
