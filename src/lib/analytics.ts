export type AnalyticsEventName =
  | "view_item_list"
  | "select_item"
  | "view_item"
  | "add_to_cart"
  | "remove_from_cart"
  | "view_cart"
  | "begin_checkout"
  | "generate_lead"
  | "whatsapp_click"
  | "corporate_enquiry";

export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
};

export type AnalyticsPayload = {
  currency?: "IDR";
  value?: number;
  items?: AnalyticsItem[];
  source?: string;
};

export type NormalizedAnalyticsEvent = {
  name: AnalyticsEventName;
  payload: AnalyticsPayload;
};

type AnalyticsProvider = {
  name: "ga4" | "meta" | "tiktok";
  isConfigured: () => boolean;
  track: (event: NormalizedAnalyticsEvent) => void;
};

type BrowserWindowWithAnalytics = Window & {
  gtag?: (command: "event", eventName: string, payload: Record<string, unknown>) => void;
  fbq?: (
    command: "track" | "trackCustom",
    eventName: string,
    payload?: Record<string, unknown>,
  ) => void;
  ttq?: {
    track?: (eventName: string, payload?: Record<string, unknown>) => void;
  };
};

const DEDUPE_WINDOW_MS = 750;
const recentEvents = new Map<string, number>();

const eventNameMap = {
  view_item_list: {
    ga4: "view_item_list",
    meta: "ViewContent",
    tiktok: "ViewContent",
  },
  select_item: {
    ga4: "select_item",
    meta: "CustomizeProduct",
    tiktok: "ClickButton",
  },
  view_item: {
    ga4: "view_item",
    meta: "ViewContent",
    tiktok: "ViewContent",
  },
  add_to_cart: {
    ga4: "add_to_cart",
    meta: "AddToCart",
    tiktok: "AddToCart",
  },
  remove_from_cart: {
    ga4: "remove_from_cart",
    meta: "RemoveFromCart",
    tiktok: "ClickButton",
  },
  view_cart: {
    ga4: "view_cart",
    meta: "ViewContent",
    tiktok: "ViewContent",
  },
  begin_checkout: {
    ga4: "begin_checkout",
    meta: "InitiateCheckout",
    tiktok: "InitiateCheckout",
  },
  generate_lead: {
    ga4: "generate_lead",
    meta: "Lead",
    tiktok: "SubmitForm",
  },
  whatsapp_click: {
    ga4: "whatsapp_click",
    meta: "Contact",
    tiktok: "Contact",
  },
  corporate_enquiry: {
    ga4: "corporate_enquiry",
    meta: "Lead",
    tiktok: "SubmitForm",
  },
} satisfies Record<AnalyticsEventName, Record<AnalyticsProvider["name"], string>>;

export function trackEvent(name: AnalyticsEventName, payload: AnalyticsPayload = {}): void {
  if (typeof window === "undefined") {
    return;
  }

  const event = normalizeAnalyticsEvent(name, payload);

  if (isDuplicateEvent(event)) {
    return;
  }

  dispatchInternalAnalyticsEvent(event);
  getAnalyticsProviders().forEach((provider) => {
    if (provider.isConfigured()) {
      provider.track(event);
    }
  });
  logDevelopmentEvent(event);
}

export function normalizeAnalyticsEvent(
  name: AnalyticsEventName,
  payload: AnalyticsPayload = {},
): NormalizedAnalyticsEvent {
  const normalizedPayload: AnalyticsPayload = {};

  if (payload.currency) {
    normalizedPayload.currency = payload.currency;
  }

  if (typeof payload.value === "number" && Number.isFinite(payload.value)) {
    normalizedPayload.value = payload.value;
  }

  if (payload.source) {
    normalizedPayload.source = payload.source;
  }

  if (payload.items) {
    normalizedPayload.items = payload.items.map(normalizeAnalyticsItem);
  }

  return {
    name,
    payload: normalizedPayload,
  };
}

export function toGa4Payload(event: NormalizedAnalyticsEvent): Record<string, unknown> {
  return {
    ...(event.payload.currency ? { currency: event.payload.currency } : {}),
    ...(typeof event.payload.value === "number" ? { value: event.payload.value } : {}),
    ...(event.payload.source ? { source: event.payload.source } : {}),
    ...(event.payload.items ? { items: event.payload.items } : {}),
  };
}

export function toMetaPayload(event: NormalizedAnalyticsEvent): Record<string, unknown> {
  return {
    ...(event.payload.currency ? { currency: event.payload.currency } : {}),
    ...(typeof event.payload.value === "number" ? { value: event.payload.value } : {}),
    ...(event.payload.items ? { contents: toProviderContents(event.payload.items) } : {}),
    ...(event.payload.items
      ? { content_ids: event.payload.items.map((item) => item.item_id) }
      : {}),
    ...(event.payload.items ? { content_type: "product" } : {}),
    ...(event.payload.source ? { source: event.payload.source } : {}),
  };
}

export function toTikTokPayload(event: NormalizedAnalyticsEvent): Record<string, unknown> {
  return {
    ...(event.payload.currency ? { currency: event.payload.currency } : {}),
    ...(typeof event.payload.value === "number" ? { value: event.payload.value } : {}),
    ...(event.payload.items ? { contents: toProviderContents(event.payload.items) } : {}),
    ...(event.payload.source ? { source: event.payload.source } : {}),
  };
}

export function resetAnalyticsDedupeForTests(): void {
  recentEvents.clear();
}

function normalizeAnalyticsItem(item: AnalyticsItem): AnalyticsItem {
  return {
    item_id: item.item_id,
    item_name: item.item_name,
    ...(item.item_category ? { item_category: item.item_category } : {}),
    ...(item.item_variant ? { item_variant: item.item_variant } : {}),
    ...(typeof item.price === "number" && Number.isFinite(item.price) ? { price: item.price } : {}),
    ...(typeof item.quantity === "number" && Number.isFinite(item.quantity)
      ? { quantity: item.quantity }
      : {}),
  };
}

function getAnalyticsProviders(): AnalyticsProvider[] {
  return [ga4Provider, metaProvider, tiktokProvider];
}

function getBrowserWindow(): BrowserWindowWithAnalytics {
  return window as BrowserWindowWithAnalytics;
}

const ga4Provider: AnalyticsProvider = {
  name: "ga4",
  isConfigured: () => Boolean(process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID),
  track: (event) => {
    const browserWindow = getBrowserWindow();
    browserWindow.gtag?.("event", eventNameMap[event.name].ga4, toGa4Payload(event));
  },
};

const metaProvider: AnalyticsProvider = {
  name: "meta",
  isConfigured: () => Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID),
  track: (event) => {
    const browserWindow = getBrowserWindow();
    browserWindow.fbq?.("track", eventNameMap[event.name].meta, toMetaPayload(event));
  },
};

const tiktokProvider: AnalyticsProvider = {
  name: "tiktok",
  isConfigured: () => Boolean(process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID),
  track: (event) => {
    const browserWindow = getBrowserWindow();
    browserWindow.ttq?.track?.(eventNameMap[event.name].tiktok, toTikTokPayload(event));
  },
};

function toProviderContents(items: AnalyticsItem[]): Array<Record<string, unknown>> {
  return items.map((item) => ({
    id: item.item_id,
    name: item.item_name,
    ...(item.item_category ? { category: item.item_category } : {}),
    ...(item.item_variant ? { variant: item.item_variant } : {}),
    ...(typeof item.price === "number" ? { price: item.price } : {}),
    ...(typeof item.quantity === "number" ? { quantity: item.quantity } : {}),
  }));
}

function dispatchInternalAnalyticsEvent(event: NormalizedAnalyticsEvent): void {
  window.dispatchEvent(
    new CustomEvent("tinybitty:analytics", {
      detail: event,
    }),
  );
}

function isDuplicateEvent(event: NormalizedAnalyticsEvent): boolean {
  const fingerprint = JSON.stringify(event);
  const now = Date.now();
  const lastSeenAt = recentEvents.get(fingerprint);

  if (lastSeenAt && now - lastSeenAt < DEDUPE_WINDOW_MS) {
    return true;
  }

  recentEvents.set(fingerprint, now);
  pruneRecentEvents(now);
  return false;
}

function pruneRecentEvents(now: number): void {
  recentEvents.forEach((seenAt, fingerprint) => {
    if (now - seenAt > DEDUPE_WINDOW_MS) {
      recentEvents.delete(fingerprint);
    }
  });
}

function logDevelopmentEvent(event: NormalizedAnalyticsEvent): void {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  console.info("[analytics]", event.name, event.payload);
}
