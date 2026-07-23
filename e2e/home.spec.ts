import { expect, test } from "@playwright/test";

test("homepage exposes primary journeys", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Tiny Bitty" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Little bites that bring people together." }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Shop best sellers" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Corporate orders" })).toBeVisible();
});
