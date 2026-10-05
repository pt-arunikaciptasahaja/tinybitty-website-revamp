import { expect, test } from "@playwright/test";

test("homepage exposes primary journeys", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: "Tiny Bitty", exact: true }).first()).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Little bites. Refreshing sips." }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore juices" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Shop cookies" })).toBeVisible();
});
