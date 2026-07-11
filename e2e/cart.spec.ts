import { expect, test } from "@playwright/test";

test("cart builds an encoded WhatsApp checkout URL without navigating", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "tinybitty.cart.v1",
      JSON.stringify({
        items: [
          {
            id: "product:cookie:box",
            kind: "product",
            label: "Cookie Box",
            detail: "Small",
            unitPrice: 25000,
            quantity: 2,
          },
        ],
      }),
    );
  });

  await page.goto("/cart");
  await page.getByLabel("Customer name").fill("Ayu");
  await page.getByLabel("Area").fill("Jakarta Selatan");
  await page.getByLabel("Desired date").fill("2026-07-12");
  await page.getByLabel("Time window").fill("10:00-12:00");
  await page.getByLabel("Notes").fill("No peanuts, please.");
  await page.getByRole("button", { name: "Prepare WhatsApp message" }).click();

  const whatsappLink = page.getByRole("link", { name: "Open WhatsApp" });
  await expect(whatsappLink).toBeVisible();

  const href = await whatsappLink.getAttribute("href");

  expect(href).toContain("https://wa.me/6281112010160?text=");
  expect(decodeURIComponent(href ?? "")).toContain("Cookie Box - Small - Qty 2");
  expect(decodeURIComponent(href ?? "")).toContain("Subtotal: Rp50.000");
  expect(decodeURIComponent(href ?? "")).toContain(
    "stok, delivery fee, jadwal, dan pembayaran masih perlu konfirmasi",
  );
});
