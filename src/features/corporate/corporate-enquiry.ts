import { z } from "zod";

const mobileNumberMinLength = 10;
const mobileNumberMaxLength = 13;

function formatDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTodayInputValue(): string {
  return formatDateInputValue(new Date());
}

export const corporateEnquirySchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required."),
  contactName: z.string().trim().min(1, "Contact name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim()
    .min(1, "Enter your mobile number.")
    .refine((val) => val.length <= mobileNumberMaxLength, {
      message: `Mobile number must be ${mobileNumberMaxLength} digits or fewer.`,
    })
    .refine((val) => val.startsWith("08"), {
      message: "Mobile number must start with 08.",
    })
    .refine((val) => val.length >= mobileNumberMinLength, {
      message: `Mobile number must be at least ${mobileNumberMinLength} digits.`,
    }),
  packageSlug: z.string().trim().min(1, "Choose a package tier."),
  estimatedQuantity: z.coerce
    .number()
    .int("Estimated quantity must be a whole number.")
    .positive("Estimated quantity is required."),
  desiredDate: z.string().trim()
    .min(1, "Desired date is required.")
    .refine((val) => val >= getTodayInputValue(), {
      message: "Choose a desired date from today onward.",
    }),
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
