import { expect, test } from "@playwright/test";

test("cart builds an encoded WhatsApp checkout URL without navigating", async ({ page }) => {
  const desiredDate = new Date().toISOString().slice(0, 10);

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
  await page.getByLabel("Mobile number").fill("081234567890");
  await page.getByLabel("Detailed delivery address").fill("Jl. Melati No. 12, Jakarta Selatan");
  await page.getByLabel("Desired date").fill(desiredDate);
  await page.getByLabel("Notes").fill("No peanuts, please.");
  await page.getByRole("button", { name: "Review order enquiry" }).click();

  await expect(
    page.getByRole("dialog", { name: "Review before opening WhatsApp" }),
  ).toBeVisible();
  await expect(page.getByText("081234567890")).toBeVisible();

  const whatsappLink = page.getByRole("link", { name: "Open WhatsApp to Confirm" });
  await expect(whatsappLink).toBeVisible();

  const href = await whatsappLink.getAttribute("href");

  expect(href).toContain("https://wa.me/6281112010160?text=");
  expect(decodeURIComponent(href ?? "")).toContain("Cookie Box - Small - Qty 2");
  expect(decodeURIComponent(href ?? "")).toContain("No. HP: 081234567890");
  expect(decodeURIComponent(href ?? "")).toContain("Subtotal: Rp50.000");
  expect(decodeURIComponent(href ?? "")).toContain("Delivery service: Flat delivery - Rp25.000");
  expect(decodeURIComponent(href ?? "")).toContain("Total pembayaran: Rp75.000");
  expect(decodeURIComponent(href ?? "")).toContain("Luckyta Aryandini");
  expect(decodeURIComponent(href ?? "")).toContain("A/C BCA 1281458294");
  expect(decodeURIComponent(href ?? "")).toContain(
    "Saya siap melanjutkan pembayaran setelah Tiny Bitty mengonfirmasi stok dan jadwal pengiriman.",
  );
});
