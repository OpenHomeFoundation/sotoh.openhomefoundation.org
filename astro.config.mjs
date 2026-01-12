// @ts-check
import { defineConfig } from "astro/config";
import { imageBreakpoints } from "./src/lib/breakpoints";

// https://astro.build/config
export default defineConfig({
  image: {
    breakpoints: imageBreakpoints,
    responsiveStyles: true,
  },
});
