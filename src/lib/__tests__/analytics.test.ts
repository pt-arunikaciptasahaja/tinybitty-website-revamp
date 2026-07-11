import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  normalizeAnalyticsEvent,
  resetAnalyticsDedupeForTests,
  toGa4Payload,
  toMetaPayload,
  toTikTokPayload,
  trackEvent,
  type AnalyticsPayload,
} from "@/lib/analytics";

type AnalyticsWindow = Window & {
  gtag?: ReturnType<typeof vi.fn>;
  fbq?: ReturnType<typeof vi.fn>;
  ttq?: {
    track: ReturnType<typeof vi.fn>;
  };
};

describe("analytics", () => {
  beforeEach(() => {
    resetAnalyticsDedupeForTests();
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    vi.stubEnv("NEXT_PUBLIC_GA4_MEASUREMENT_ID", "");
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "");
    vi.stubEnv("NEXT_PUBLIC_TIKTOK_PIXEL_ID", "");
    vi.stubEnv("NODE_ENV", "test");
    delete (window as AnalyticsWindow).gtag;
    delete (window as AnalyticsWindow).fbq;
    delete (window as AnalyticsWindow).ttq;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    resetAnalyticsDedupeForTests();
  });

  it("normalizes event payloads to the allowed analytics shape", () => {
    const payload = {
      currency: "IDR",
      value: 50000,
      source: "test",
      customerName: "Do not include",
      phone: "6281112010160",
      notes: "Do not include",
      items: [
        {
          item_id: "cookie",
          item_name: "Cookie",
          item_category: "cookies",
          item_variant: "Box",
          price: 25000,
          quantity: 2,
          privateNote: "Do not include",
        },
      ],
    } as unknown as AnalyticsPayload & Record<string, unknown>;

    expect(normalizeAnalyticsEvent("add_to_cart", payload)).toEqual({
      name: "add_to_cart",
      payload: {
        currency: "IDR",
        value: 50000,
        source: "test",
        items: [
          {
            item_id: "cookie",
            item_name: "Cookie",
            item_category: "cookies",
            item_variant: "Box",
            price: 25000,
            quantity: 2,
          },
        ],
      },
    });
  });

  it("builds GA4, Meta, and TikTok payloads consistently", () => {
    const event = normalizeAnalyticsEvent("begin_checkout", {
      currency: "IDR",
      value: 50000,
      source: "cart",
      items: [
        {
          item_id: "cookie",
          item_name: "Cookie",
          item_category: "cookies",
          item_variant: "Box",
          price: 25000,
          quantity: 2,
        },
      ],
    });

    expect(toGa4Payload(event)).toEqual({
      currency: "IDR",
      value: 50000,
      source: "cart",
      items: event.payload.items,
    });
    expect(toMetaPayload(event)).toEqual({
      currency: "IDR",
      value: 50000,
      source: "cart",
      content_ids: ["cookie"],
      content_type: "product",
      contents: [
        {
          id: "cookie",
          name: "Cookie",
          category: "cookies",
          variant: "Box",
          price: 25000,
          quantity: 2,
        },
      ],
    });
    expect(toTikTokPayload(event)).toEqual({
      currency: "IDR",
      value: 50000,
      source: "cart",
      contents: [
        {
          id: "cookie",
          name: "Cookie",
          category: "cookies",
          variant: "Box",
          price: 25000,
          quantity: 2,
        },
      ],
    });
  });

  it("dispatches an internal event and no-ops providers when IDs are absent", () => {
    const listener = vi.fn();
    window.addEventListener("tinybitty:analytics", listener);
    (window as AnalyticsWindow).gtag = vi.fn();
    (window as AnalyticsWindow).fbq = vi.fn();
    (window as AnalyticsWindow).ttq = { track: vi.fn() };

    trackEvent("view_item", {
      currency: "IDR",
      items: [{ item_id: "cookie", item_name: "Cookie", item_category: "cookies" }],
    });

    expect(listener).toHaveBeenCalledTimes(1);
    expect((window as AnalyticsWindow).gtag).not.toHaveBeenCalled();
    expect((window as AnalyticsWindow).fbq).not.toHaveBeenCalled();
    expect((window as AnalyticsWindow).ttq?.track).not.toHaveBeenCalled();
    window.removeEventListener("tinybitty:analytics", listener);
  });

  it("tracks configured providers and avoids duplicate events", () => {
    vi.stubEnv("NEXT_PUBLIC_GA4_MEASUREMENT_ID", "G-TEST");
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "123");
    vi.stubEnv("NEXT_PUBLIC_TIKTOK_PIXEL_ID", "456");
    (window as AnalyticsWindow).gtag = vi.fn();
    (window as AnalyticsWindow).fbq = vi.fn();
    (window as AnalyticsWindow).ttq = { track: vi.fn() };

    trackEvent("generate_lead", { source: "corporate_gifts_form" });
    trackEvent("generate_lead", { source: "corporate_gifts_form" });

    expect((window as AnalyticsWindow).gtag).toHaveBeenCalledTimes(1);
    expect((window as AnalyticsWindow).gtag).toHaveBeenCalledWith("event", "generate_lead", {
      source: "corporate_gifts_form",
    });
    expect((window as AnalyticsWindow).fbq).toHaveBeenCalledWith("track", "Lead", {
      source: "corporate_gifts_form",
    });
    expect((window as AnalyticsWindow).ttq?.track).toHaveBeenCalledWith("SubmitForm", {
      source: "corporate_gifts_form",
    });
  });

  it("logs in development and stays quiet in production", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined);

    vi.stubEnv("NODE_ENV", "development");
    trackEvent("whatsapp_click", { source: "cart" });
    expect(info).toHaveBeenCalledWith("[analytics]", "whatsapp_click", { source: "cart" });

    resetAnalyticsDedupeForTests();
    info.mockClear();
    vi.stubEnv("NODE_ENV", "production");
    trackEvent("whatsapp_click", { source: "cart" });
    expect(info).not.toHaveBeenCalled();
  });
});
