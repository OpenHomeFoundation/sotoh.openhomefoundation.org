import { test } from "@playwright/test";

/**
 * Visual test - captures full-page screenshots for comparison across browsers
 */

test.describe("Visual Screenshot Test", () => {
  test("full page screenshot", async ({ page }, testInfo) => {
    await page.goto("http://localhost:4321/");
    await page.waitForLoadState("networkidle");

    // Scroll through page to trigger lazy-loaded components
    const scrollHeight = await page.evaluate(
      () => document.documentElement.scrollHeight
    );
    const viewportHeight = await page.evaluate(() => window.innerHeight);

    for (let y = 0; y < scrollHeight; y += viewportHeight) {
      await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
      await page.waitForTimeout(100);
    }

    // Scroll to bottom and wait for lazy content to load
    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight)
    );
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    // Scroll back to top for screenshot
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);

    // Capture full-page screenshot
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach("full-page", {
      body: screenshot,
      contentType: "image/png",
    });
  });
});
