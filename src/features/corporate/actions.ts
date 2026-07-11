"use server";

import {
  submitCorporateEnquiryWithDependencies,
  type CorporateEnquiryActionState,
} from "@/features/corporate/action-core";

export async function submitCorporateEnquiry(
  _previousState: CorporateEnquiryActionState,
  formData: FormData,
): Promise<CorporateEnquiryActionState> {
  return submitCorporateEnquiryWithDependencies(formData);
}
