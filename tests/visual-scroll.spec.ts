import { test } from "@playwright/test";

/**
 * Visual scroll test for comparing across browsers
 * Records video while scrolling through the page for visual comparison
 */

test.describe("Visual Scroll Test", () => {
  // Increase timeout for slow scrolling through tall pages
  test.setTimeout(120_000);
  test.beforeEach(async ({ page }) => {
    // Disable GSAP ScrollSmoother for Playwright compatibility
    // ScrollSmoother intercepts scroll events which breaks video playback
    await page.addInitScript(() => {
      // @ts-ignore
      window.__PLAYWRIGHT_TEST__ = true;
    });

    await page.goto("http://localhost:4321/");

    // Wait for page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Give GSAP time to initialize, then disable ScrollSmoother if present
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          // @ts-ignore - GSAP globals
          if (window.ScrollSmoother) {
            // @ts-ignore
            const smoother = window.ScrollSmoother.get();
            if (smoother) {
              smoother.kill();
            }
          }
          // Also disable ScrollTrigger's smooth scrolling
          // @ts-ignore
          if (window.ScrollTrigger) {
            // @ts-ignore
            window.ScrollTrigger.normalizeScroll(false);
          }
          resolve();
        }, 500);
      });
    });
  });

  test("scroll through entire page", async ({ page }) => {
    // Wait for initial render
    await page.waitForTimeout(1000);

    // Get page dimensions
    const scrollHeight = await page.evaluate(
      () => document.documentElement.scrollHeight - window.innerHeight
    );

    // Scroll at fixed rate: 300px per second
    const pixelsPerSecond = 300;
    const stepSize = 5; // pixels per step
    const stepDelay = (stepSize / pixelsPerSecond) * 1000; // ms between steps

    let currentPosition = 0;

    while (currentPosition < scrollHeight) {
      currentPosition = Math.min(currentPosition + stepSize, scrollHeight);
      await page.evaluate((y) => window.scrollTo(0, y), currentPosition);
      await page.waitForTimeout(stepDelay);
    }

    // Hold at bottom for 2 seconds before video ends
    await page.waitForTimeout(2000);
  });
});
