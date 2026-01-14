import { test } from "@playwright/test";

/**
 * Visual test - captures full-page screenshots for comparison across browsers
 */

test.describe("Visual Screenshot Test", () => {
  test("full page screenshot", async ({ page }, testInfo) => {
    await page.goto("http://localhost:4321/");
    await page.waitForLoadState("networkidle");

    // Brief wait for animations to settle
    await page.waitForTimeout(500);

    // Capture full-page screenshot
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach("full-page", {
      body: screenshot,
      contentType: "image/png",
    });
  });
});
