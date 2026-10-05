import { describe, expect, it } from "vitest";
import { juiceProducts, juiceSchema, juiceVolumeLabel } from "@/content/juices";
import { products } from "@/content/products";
import { bundles } from "@/content/bundles";
import {
  createJuiceCartItem,
  createProductCartItem,
  createBundleCartItem,
  calculateCartSubtotal,
  parseStoredCart,
  serializeCart,
  toWhatsAppLineItems,
} from "@/features/cart/cart-utils";
import { buildWhatsAppMessage } from "@/lib/whatsapp";
import sitemap from "@/app/sitemap";
const juice = juiceProducts[0]!;
describe("juice enquiries", () => {
  it("validates enquiry-only content with owner-confirmed prices and volumes without cookie options", () => {
    expect(juiceProducts).toHaveLength(4);
    for (const item of juiceProducts) {
      expect(item.pricing).toEqual({ status: "confirmed", amount: 20000 });
      expect(item.volumeMl).toBe(250);
      expect(item.availability).toBe("enquiry_only");
      expect(item).not.toHaveProperty("variants");
    }
    expect(
      juiceSchema.safeParse({
        ...juice,
        ownerInput: {},
        pricing: { status: "ask_for_price", amount: 0 },
      }).success,
    ).toBe(false);
    expect(juiceVolumeLabel({ volumeMl: 250 })).toBe("250 ml");
  });
  it("persists mixed items with juice prices without changing cookie or bundle prices", () => {
    const cookie = createProductCartItem(products[0]!, products[0]!.variants[0]!, 2);
    const bundle = createBundleCartItem(bundles[0]!, 1)!;
    const items = [cookie, bundle, createJuiceCartItem(juice, 3)];
    expect(parseStoredCart(serializeCart({ items })).items).toEqual(items);
    expect(calculateCartSubtotal(items)).toBe(cookie.unitPrice! * 2 + bundle.unitPrice! + 60000);
    expect(toWhatsAppLineItems(items)[2]).toMatchObject({
      quantity: 3,
      unitPrice: 20000,
      subtotal: 60000,
    });
  });
  it("revalidates stored juice details against the catalogue", () => {
    const item = {
      ...createJuiceCartItem(juice, 2),
      label: "old name",
      detail: "wrong volume",
      unitPrice: null,
    };
    expect(parseStoredCart(serializeCart({ items: [item] })).items[0]).toEqual(
      createJuiceCartItem(juice, 2),
    );
  });
  it("includes quantity, confirmed volume and notes without a fake zero price or final payment total", () => {
    const item = createJuiceCartItem({ ...juice, volumeMl: 250 }, 3);
    const message = buildWhatsAppMessage({
      orderId: "test",
      customer: {
        customerName: "Ayu",
        mobileNumber: "081234567890",
        deliveryAddress: "Jakarta",
        desiredDate: "2026-10-02",
        notes: "Please confirm allergens",
      },
      items: toWhatsAppLineItems([item]),
      subtotal: 60000,
      deliveryFee: null,
    });
    expect(message).toContain("Mango & Chia - 250 ml - Qty 3 - Rp20.000 each - Rp60.000");
    expect(message).toContain("Please confirm allergens");
    expect(message).not.toContain("Rp0");
    expect(message).not.toContain("Flat delivery");
  });
  it("keeps unpriced items out of totals without inventing zero prices", () => {
    const unpriced = createJuiceCartItem(
      { ...juice, pricing: { status: "ask_for_price", amount: null } },
      2,
    );
    const priced = createJuiceCartItem(juice, 3);
    expect(calculateCartSubtotal([unpriced, priced])).toBe(60000);
    expect(toWhatsAppLineItems([unpriced])[0]).toMatchObject({ unitPrice: null, subtotal: null });
  });
  it("includes juice category and all detail routes in the sitemap", () => {
    const urls = sitemap().map((item) => item.url);
    expect(urls).toContain("https://tinybitty.shop/juices");
    for (const item of juiceProducts)
      expect(urls).toContain("https://tinybitty.shop/juices/" + item.slug);
  });
});
