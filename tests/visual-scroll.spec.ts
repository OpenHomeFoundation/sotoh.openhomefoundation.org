import { test } from "@playwright/test";

/**
 * Visual test - captures full-page screenshots for comparison across browsers
 */

test.describe("Visual Screenshot Test", () => {
  test.setTimeout(60_000);

  test("full page screenshot", async ({ page }, testInfo) => {
    await page.goto("http://localhost:4321/");
    await page.waitForLoadState("networkidle");

    // Scroll through page slowly to trigger lazy-loaded components
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    let lastScrollHeight = 0;
    let currentScrollHeight = await page.evaluate(
      () => document.documentElement.scrollHeight
    );

    // Keep scrolling until we've seen the full page (height may grow as content loads)
    while (lastScrollHeight < currentScrollHeight) {
      for (
        let y = lastScrollHeight;
        y < currentScrollHeight;
        y += viewportHeight / 2
      ) {
        await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
        await page.waitForTimeout(300);
        await page.waitForLoadState("domcontentloaded");
      }

      lastScrollHeight = currentScrollHeight;
      await page.waitForLoadState("networkidle");
      currentScrollHeight = await page.evaluate(
        () => document.documentElement.scrollHeight
      );
    }

    // Final wait at bottom for any remaining lazy content
    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight)
    );
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Scroll back to top for screenshot
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Capture full-page screenshot
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach("full-page", {
      body: screenshot,
      contentType: "image/png",
    });
  });
});
