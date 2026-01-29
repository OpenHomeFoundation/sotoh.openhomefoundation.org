// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import netlify from "@astrojs/netlify";
import { imageBreakpoints } from "./src/lib/breakpoints";

// https://astro.build/config
export default defineConfig({
  site: "https://sotoh.openhomefoundation.org",
  output: "static",
  adapter: netlify(),
  integrations: [sitemap()],
  image: {
    breakpoints: imageBreakpoints,
    responsiveStyles: true,
  },
});
