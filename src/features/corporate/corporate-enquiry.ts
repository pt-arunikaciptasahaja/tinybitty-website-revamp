import { z } from "zod";

export const corporateEnquirySchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required."),
  contactName: z.string().trim().min(1, "Contact name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().min(6, "Phone or WhatsApp number is required."),
  packageSlug: z.string().trim().min(1, "Choose a package tier."),
  estimatedQuantity: z.coerce
    .number()
    .int("Estimated quantity must be a whole number.")
    .positive("Estimated quantity is required."),
  desiredDate: z.string().trim().min(1, "Desired date is required."),
  customization: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  website: z.string().trim().optional(),
});

export type CorporateEnquiryInput = z.infer<typeof corporateEnquirySchema>;

export type CorporateEnquiryValidation =
  | {
      success: true;
      data: CorporateEnquiryInput;
    }
  | {
      success: false;
      fieldErrors: Partial<Record<keyof CorporateEnquiryInput, string>>;
      formError: string;
    };

export function validateCorporateEnquiry(
  input: FormData | Record<string, FormDataEntryValue | string>,
): CorporateEnquiryValidation {
  const rawInput = input instanceof FormData ? Object.fromEntries(input.entries()) : input;
  const result = corporateEnquirySchema.safeParse(rawInput);

  if (!result.success) {
    return {
      success: false,
      fieldErrors: result.error.issues.reduce<Partial<Record<keyof CorporateEnquiryInput, string>>>(
        (errors, issue) => {
          const fieldName = issue.path[0];

          if (typeof fieldName === "string") {
            errors[fieldName as keyof CorporateEnquiryInput] = issue.message;
          }

          return errors;
        },
        {},
      ),
      formError: "Please review the highlighted fields.",
    };
  }

  if (result.data.website) {
    return {
      success: false,
      fieldErrors: {},
      formError: "We could not submit this enquiry. Please try WhatsApp instead.",
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

export function buildCorporateWhatsAppMessage(input: CorporateEnquiryInput): string {
  return [
    "Halo Tiny Bitty, saya ingin bertanya tentang corporate gifting.",
    "",
    `Perusahaan: ${input.companyName}`,
    `Nama kontak: ${input.contactName}`,
    `Email: ${input.email}`,
    `No. WhatsApp/telepon: ${input.phone}`,
    `Paket: ${input.packageSlug}`,
    `Estimasi jumlah: ${input.estimatedQuantity}`,
    `Tanggal dibutuhkan: ${input.desiredDate}`,
    `Customization: ${input.customization || "-"}`,
    `Catatan: ${input.notes || "-"}`,
    "",
    "Mohon konfirmasi MOQ, lead time, stok, delivery fee, jadwal, dan pembayaran.",
  ].join("\n");
}
