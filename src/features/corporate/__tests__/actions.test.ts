import { describe, expect, it, vi } from "vitest";
import {
  initialCorporateEnquiryActionState,
  submitCorporateEnquiryWithDependencies,
} from "@/features/corporate/action-core";

describe("corporate enquiry action", () => {
  it("returns success when validation, rate limit, and delivery pass", async () => {
    const deliver = vi.fn(async () => ({ ok: true as const, referenceId: "CORP-1" }));
    const result = await submitCorporateEnquiryWithDependencies(makeFormData(), {
      leadDeliveryAdapter: { deliver },
    });

    expect(result).toEqual({
      status: "success",
      message:
        "Thank you. Tiny Bitty will confirm corporate gifting details before anything is final.",
      fieldErrors: {},
      referenceId: "CORP-1",
    });
    expect(deliver).toHaveBeenCalledWith(
      expect.objectContaining({
        companyName: "Acme",
        contactName: "Ayu",
      }),
    );
  });

  it("returns recoverable errors for invalid input, rate limits, and delivery failures", async () => {
    const invalidResult = await submitCorporateEnquiryWithDependencies(
      makeFormData({ companyName: "" }),
    );

    expect(invalidResult.status).toBe("error");
    expect(invalidResult.fieldErrors.companyName).toBe("Company name is required.");

    const rateLimitedResult = await submitCorporateEnquiryWithDependencies(makeFormData(), {
      rateLimiter: {
        async check() {
          return { allowed: false, retryAfterSeconds: 60 };
        },
      },
    });

    expect(rateLimitedResult.message).toBe("Please try again in 60 seconds.");

    const deliveryFailureResult = await submitCorporateEnquiryWithDependencies(makeFormData(), {
      leadDeliveryAdapter: {
        async deliver() {
          return { ok: false, error: "Adapter unavailable" };
        },
      },
    });

    expect(deliveryFailureResult.message).toBe(
      "We could not submit the enquiry right now. Please try WhatsApp instead.",
    );
  });

  it("does not acknowledge delivery when no lead adapter is configured", async () => {
    const result = await submitCorporateEnquiryWithDependencies(makeFormData());

    expect(result).toEqual({
      status: "error",
      message: "We could not submit the enquiry right now. Please try WhatsApp instead.",
      fieldErrors: {},
    });
  });

  it("exposes an idle initial state", () => {
    expect(initialCorporateEnquiryActionState.status).toBe("idle");
  });
});

function makeFormData(overrides: Record<string, string> = {}): FormData {
  const formData = new FormData();
  const values = {
    companyName: "Acme",
    contactName: "Ayu",
    email: "ayu@example.com",
    phone: "081112010160",
    packageSlug: "starter-gift-box",
    estimatedQuantity: "24",
    desiredDate: "2026-08-01",
    customization: "Ribbon",
    notes: "For event guests",
    website: "",
    ...overrides,
  };

  Object.entries(values).forEach(([key, value]) => {
    formData.set(key, value);
  });

  return formData;
}
