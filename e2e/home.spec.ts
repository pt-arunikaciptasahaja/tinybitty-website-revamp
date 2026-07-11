import { expect, test } from "@playwright/test";

test("homepage exposes primary journeys", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Tiny Bitty" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Shop Best Sellers" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Corporate Orders" })).toBeVisible();
});
