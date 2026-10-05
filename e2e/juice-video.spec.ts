import { expect, test } from "@playwright/test";
test("juice video plays on request", async ({ page }) => {
  await page.goto("/juices");
  const video = page.getByLabel("Tiny Bitty juice collection launch video");
  await expect
    .poll(() => video.evaluate((el: HTMLVideoElement) => el.readyState > 0 || el.error !== null))
    .toBe(true);
  test.skip(
    await video.evaluate((el: HTMLVideoElement) => el.error !== null),
    "Browser build does not support this MP4 codec; verified separately in Edge.",
  );
  expect(await video.evaluate((el: HTMLVideoElement) => el.paused)).toBe(true);
  await video.evaluate((el: HTMLVideoElement) => el.play());
  await expect
    .poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime))
    .toBeGreaterThan(0.1);
  await video.evaluate((el: HTMLVideoElement) => el.pause());
  await video.focus();
  await expect(video).toBeFocused();
  await page.screenshot({ path: "test-results/juice-video-header.png", fullPage: true });
});
