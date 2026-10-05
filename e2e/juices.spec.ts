import { expect, test } from "@playwright/test";

test("juice and cookie enquiries preserve quantities and confirmed pricing", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/cookies/golden-crunch");
  await page.getByRole("button", { name: "Add to cart", exact: true }).click();
  await page.goto("/juices/mango-chia");
  await page.getByRole("button", { name: "Increase quantity" }).click();
  await expect(page.getByLabel("Selected quantity")).toHaveText("2");
  await expect(page.getByText("Rp20.000", { exact: true })).toBeVisible();
  await expect(page.getByText("Choose a variant")).toHaveCount(0);
  await page.getByRole("button", { name: "Add to enquiry" }).click();
  await page.getByRole("link", { name: "Review enquiry" }).click();
  await expect(page).toHaveURL(/\/cart$/);
  await page.reload();
  await expect(page.getByLabel("Quantity for Mango & Chia")).toHaveValue("2");
  await page.getByLabel("Customer name").fill("Ayu");
  await page.getByLabel("Mobile number").fill("081234567890");
  await page.getByLabel("Detailed delivery address").fill("Jl. Melati No. 12, Jakarta Selatan");
  const date = await page.getByLabel("Desired date").getAttribute("min");
  await page.getByLabel("Desired date").fill(date!);
  await page.getByLabel("Notes").fill("Please confirm juice ingredients");
  await page.getByRole("button", { name: "Review order enquiry" }).click();
  const href = await page
    .getByRole("link", { name: "Open WhatsApp to Confirm" })
    .getAttribute("href");
  const message = decodeURIComponent(href!);
  expect(message).toContain("wa.me/6281112010160");
  expect(message).toContain("Golden Crunch");
  expect(message).toContain("Mango & Chia - 250 ml - Qty 2 - Rp20.000 each - Rp40.000");
  expect(message).toContain("Please confirm juice ingredients");
  expect(message).not.toContain("Flat delivery");
  expect(message).toContain("Subtotal: Rp260.000");
  expect(errors).toEqual([]);
});

for (const width of [320, 375, 414, 768, 1440]) {
  test("juice launch layout at " + width, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/juices", "/juices/mango-chia"]) {
      await page.goto(route);
      const image = page.getByRole("img", {
        name:
          route === "/juices/mango-chia"
            ? "Mango & Chia Tiny Bitty juice bottle"
            : "Four Tiny Bitty juice bottles displayed together in the juice collection launch image",
      });
      if (route === "/juices") {
        const video = page.getByLabel("Tiny Bitty juice collection launch video");
        await expect(video).toBeVisible();
        await expect(video).toHaveAttribute("controls", "");
        await expect(video).not.toHaveAttribute("autoplay", "");
        await expect(video).toHaveAttribute(
          "poster",
          "/Gemini_Generated_Image_nl64ldnl64ldnl64.jpg",
        );
        await expect(page.getByRole("link", { name: "Open video", exact: true })).toHaveAttribute(
          "href",
          "/Four_bottles_filled_with_fruit_20261002141901.mp4",
        );
      } else {
        await expect(image).toBeVisible();
        await expect
          .poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth))
          .toBeGreaterThan(0);
      }
      if (route === "/" || route === "/juices") {
        const bottles = page.locator(".juice-card__image");
        await expect(bottles).toHaveCount(4);
        for (const bottle of await bottles.all()) {
          await bottle.scrollIntoViewIfNeeded();
          await expect
            .poll(() => bottle.evaluate((el: HTMLImageElement) => el.naturalWidth))
            .toBeGreaterThan(0);
        }
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
      expect(await page.locator("body").innerText()).not.toContain("OWNER_INPUT_REQUIRED");
    }
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Explore juices", exact: true })).toHaveAttribute(
      "href",
      "/juices",
    );
    await expect(page.getByRole("link", { name: "Shop cookies", exact: true })).toHaveAttribute(
      "href",
      "/cookies",
    );
    expect(await page.locator("#juices").evaluate((el) => el.nextElementSibling?.id)).toBe(
      "cookies",
    );
    if (width < 1024) await page.getByRole("button", { name: "Open navigation menu" }).click();
    await page.getByRole("link", { name: "Juice", exact: true }).click();
    await expect(page).toHaveURL(/\/juices$/);
    await page.screenshot({ path: "test-results/juice-preview-" + width + ".png", fullPage: true });
  });
}

test("all juice details and missing slug", async ({ page }) => {
  for (const slug of ["mango-chia", "strawberry-delight", "guava-glow", "soursop-cloud"]) {
    const response = await page.goto("/juices/" + slug);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("button", { name: "Add to enquiry" })).toBeVisible();
    await expect(page.getByText("Rp20.000", { exact: true })).toBeVisible();
    await expect(page.getByText("250 ml", { exact: true })).toBeVisible();
    expect(
      await page.locator('script[type="application/ld+json"]').allTextContents(),
    ).not.toContain('"@type":"Product"');
  }
  const response = await page.goto("/juices/not-a-juice");
  expect(response?.status()).toBe(404);
});

test("cookie bundle still adds to the enquiry", async ({ page }) => {
  await page.goto("/bundles/sweet-sharing-bundle");
  await page.getByRole("button", { name: "Add bundle", exact: true }).click();
  await page.goto("/cart");
  await expect(page.getByText("Sweet Sharing Mini Bundle", { exact: true })).toBeVisible();
});

test("juice navigation and quantity controls work from the keyboard", async ({ page }) => {
  await page.goto("/");
  const explore = page.getByRole("link", { name: "Explore juices", exact: true });
  await explore.focus();
  await expect(explore).toBeFocused();
  expect(await explore.evaluate((el) => getComputedStyle(el).outlineStyle)).not.toBe("none");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/juices$/);
  await page.getByRole("link", { name: "Enquire about Guava Glow" }).focus();
  await page.keyboard.press("Enter");
  const increase = page.getByRole("button", { name: "Increase quantity" });
  await increase.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Selected quantity")).toHaveText("2");
});
