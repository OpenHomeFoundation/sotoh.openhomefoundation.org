// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { imageBreakpoints } from "./src/lib/breakpoints";

// https://astro.build/config
export default defineConfig({
  site: "https://sotoh.openhomefoundation.org",
  integrations: [sitemap()],
  image: {
    breakpoints: imageBreakpoints,
    responsiveStyles: true,
  },
});
