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
    // Brief wait for initial render
    await page.waitForTimeout(500);

    // Smooth scroll to bottom using CSS scroll-behavior
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "smooth";
      window.scrollTo(0, document.documentElement.scrollHeight);
    });

    // Wait for scroll to complete (check every 100ms)
    await page.waitForFunction(
      () => {
        const atBottom =
          window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 10;
        return atBottom;
      },
      { timeout: 30000, polling: 100 }
    );

    // Brief hold at bottom
    await page.waitForTimeout(500);
  });
});
