import {
  validateCorporateEnquiry,
  type CorporateEnquiryValidation,
} from "@/features/corporate/corporate-enquiry";
import {
  noStorageLeadDeliveryAdapter,
  type LeadDeliveryAdapter,
} from "@/features/corporate/lead-delivery";
import { passThroughRateLimiter, type RateLimiter } from "@/features/corporate/rate-limit";

export type CorporateEnquiryActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: Record<string, string>;
  referenceId?: string;
};

export const initialCorporateEnquiryActionState: CorporateEnquiryActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

type CorporateActionDependencies = {
  rateLimiter?: RateLimiter;
  leadDeliveryAdapter?: LeadDeliveryAdapter;
  rateLimitKey?: string;
};

export async function submitCorporateEnquiryWithDependencies(
  formData: FormData,
  dependencies: CorporateActionDependencies = {},
): Promise<CorporateEnquiryActionState> {
  const validation: CorporateEnquiryValidation = validateCorporateEnquiry(formData);

  if (!validation.success) {
    return {
      status: "error",
      message: validation.formError,
      fieldErrors: validation.fieldErrors as Record<string, string>,
    };
  }

  const rateLimiter = dependencies.rateLimiter ?? passThroughRateLimiter;
  const rateLimitResult = await rateLimiter.check(dependencies.rateLimitKey ?? "corporate-enquiry");

  if (!rateLimitResult.allowed) {
    return {
      status: "error",
      message: `Please try again in ${rateLimitResult.retryAfterSeconds} seconds.`,
      fieldErrors: {},
    };
  }

  const adapter = dependencies.leadDeliveryAdapter ?? noStorageLeadDeliveryAdapter;
  const deliveryResult = await adapter.deliver(validation.data);

  if (!deliveryResult.ok) {
    return {
      status: "error",
      message: "We could not submit the enquiry right now. Please try WhatsApp instead.",
      fieldErrors: {},
    };
  }

  return {
    status: "success",
    message:
      "Thank you. Tiny Bitty will confirm corporate gifting details before anything is final.",
    fieldErrors: {},
    referenceId: deliveryResult.referenceId,
  };
}
