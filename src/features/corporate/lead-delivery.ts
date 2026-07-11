import type { CorporateEnquiryInput } from "@/features/corporate/corporate-enquiry";

export type LeadDeliveryResult =
  | {
      ok: true;
      referenceId: string;
    }
  | {
      ok: false;
      error: string;
    };

export type LeadDeliveryAdapter = {
  deliver: (input: CorporateEnquiryInput) => Promise<LeadDeliveryResult>;
};

export const noStorageLeadDeliveryAdapter: LeadDeliveryAdapter = {
  async deliver() {
    return {
      ok: false,
      error: "No lead delivery adapter configured.",
    };
  },
};
