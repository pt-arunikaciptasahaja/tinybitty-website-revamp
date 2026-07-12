"use client";

import { type FormEvent, useState } from "react";
import { siteConfig } from "@/content/site-config";
import type { CorporatePackage } from "@/content/schemas";
import { Button } from "@/components/ui/Button";
import {
  buildCorporateWhatsAppMessage,
  validateCorporateEnquiry,
} from "@/features/corporate/corporate-enquiry";
import { trackEvent } from "@/lib/analytics";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type CorporateEnquiryFormProps = {
  packages: CorporatePackage[];
};

const mobileNumberMaxLength = 13;
const estimatedQuantityMaxLength = 6;

function formatMobileNumberInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, mobileNumberMaxLength);

  if (!digits) {
    return "";
  }

  if (digits === "0" || digits.startsWith("08")) {
    return digits;
  }

  if (digits.startsWith("0")) {
    return "0";
  }

  return "";
}

function formatEstimatedQuantityInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, estimatedQuantityMaxLength);
}

function formatDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDesiredDateMin(): string {
  return formatDateInputValue(new Date());
}

function TextInput({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  inputMode,
  autoComplete,
  min,
  max,
  maxLength,
  type = "text",
  required = false,
  name,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | undefined;
  placeholder?: string | undefined;
  inputMode?: "text" | "search" | "email" | "tel" | "url" | "none" | "numeric" | "decimal";
  autoComplete?: string | undefined;
  min?: string | undefined;
  max?: string | undefined;
  maxLength?: number | undefined;
  type?: string;
  required?: boolean;
  name?: string;
}) {
  const errorId = `${id}-error`;

  return (
    <div className="grid gap-2 text-sm font-semibold text-ink">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        className="min-h-11 rounded-md border border-line bg-surface px-3 text-base text-ink"
        type={type}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        min={min}
        max={max}
        maxLength={maxLength}
        required={required}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <span id={errorId} className="text-sm text-ink-muted">
          {error}
        </span>
      ) : null}
    </div>
  );
}

type FormValues = {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  packageSlug: string;
  estimatedQuantity: string;
  desiredDate: string;
  customization: string;
  notes: string;
};

const initialValues: FormValues = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  packageSlug: "",
  estimatedQuantity: "",
  desiredDate: "",
  customization: "",
  notes: "",
};

export function CorporateEnquiryForm({ packages }: CorporateEnquiryFormProps) {
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState<Partial<FormValues>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const desiredDateMin = getDesiredDateMin();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setErrorMessage(null);

    const validation = validateCorporateEnquiry({ ...values, website: "" });

    if (!validation.success) {
      setFieldErrors(validation.fieldErrors);
      setErrorMessage(validation.formError);
      return;
    }

    const selectedPackage = packages.find((packageTier) => packageTier.slug === values.packageSlug);

    trackEvent("corporate_enquiry", {
      source: "corporate_gifts_form",
      items: [
        {
          item_id: values.packageSlug,
          item_name: selectedPackage?.name || "",
          item_category: "corporate_package",
          quantity: validation.data.estimatedQuantity,
        },
      ],
    });

    const whatsappUrl = buildWhatsAppUrl(
      siteConfig.whatsappNumber,
      buildCorporateWhatsAppMessage(validation.data),
    );

    if (whatsappUrl) {
      window.open(whatsappUrl, "_blank");
    }
    
    setValues(initialValues);
  }

  return (
    <section className="max-w-2xl mx-auto rounded-lg border border-line bg-surface-raised p-5 shadow-soft">
      <h2 className="text-xl font-semibold text-ink">Request a quotation</h2>
      <p className="mt-2 text-sm leading-6 text-ink-muted">
        This form sends an enquiry only. MOQ, lead time, stock, delivery fee, schedule, and payment
        require confirmation.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4" noValidate>
        <TextInput
          id="corporate-company-name"
          label="Company name"
          name="companyName"
          value={values.companyName}
          error={fieldErrors.companyName}
          onChange={(value: string) => setValues((current) => ({ ...current, companyName: value }))}
          required
        />
        <TextInput
          id="corporate-contact-name"
          label="Contact name"
          name="contactName"
          value={values.contactName}
          error={fieldErrors.contactName}
          onChange={(value: string) => setValues((current) => ({ ...current, contactName: value }))}
          required
        />
        <TextInput
          id="corporate-email"
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          error={fieldErrors.email}
          onChange={(value: string) => setValues((current) => ({ ...current, email: value }))}
          required
        />
        <TextInput
          id="corporate-phone-number"
          label="Phone or WhatsApp"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={values.phone}
          error={fieldErrors.phone}
          onChange={(value: string) =>
            setValues((current) => ({
              ...current,
              phone: formatMobileNumberInput(value),
            }))
          }
          placeholder="08..."
          required
        />
        <div className="grid gap-2 text-sm font-semibold text-ink">
          <label htmlFor="corporate-packageSlug">Package tier</label>
          <select
            id="corporate-packageSlug"
            name="packageSlug"
            className="min-h-11 rounded-md border border-line bg-surface px-3 text-base text-ink"
            value={values.packageSlug}
            required
            aria-invalid={fieldErrors.packageSlug ? "true" : undefined}
            aria-describedby={
              fieldErrors.packageSlug ? "corporate-packageSlug-error" : undefined
            }
            onChange={(event) =>
              setValues((current) => ({ ...current, packageSlug: event.target.value }))
            }
          >
            <option value="">Choose a tier</option>
            {packages.map((packageTier) => (
              <option key={packageTier.id} value={packageTier.slug}>
                {packageTier.name}
              </option>
            ))}
          </select>
          {fieldErrors.packageSlug ? (
            <span id="corporate-packageSlug-error" className="text-sm text-ink-muted">
              {fieldErrors.packageSlug}
            </span>
          ) : null}
        </div>
        <TextInput
          id="corporate-estimated-quantity"
          label="Estimated quantity"
          name="estimatedQuantity"
          type="text"
          inputMode="numeric"
          maxLength={estimatedQuantityMaxLength}
          value={values.estimatedQuantity}
          error={fieldErrors.estimatedQuantity}
          onChange={(value: string) =>
            setValues((current) => ({
              ...current,
              estimatedQuantity: formatEstimatedQuantityInput(value),
            }))
          }
          required
        />
        <TextInput
          id="corporate-desired-date"
          label="Desired date"
          name="desiredDate"
          type="date"
          min={desiredDateMin}
          value={values.desiredDate}
          error={fieldErrors.desiredDate}
          onChange={(value: string) => setValues((current) => ({ ...current, desiredDate: value }))}
          required
        />
        <TextInput
          id="corporate-customization"
          label="Customization request"
          name="customization"
          value={values.customization}
          onChange={(value: string) =>
            setValues((current) => ({ ...current, customization: value }))
          }
        />
        <label htmlFor="corporate-notes" className="grid gap-2 text-sm font-semibold text-ink">
          Notes
          <textarea
            id="corporate-notes"
            name="notes"
            className="min-h-24 rounded-md border border-line bg-surface px-3 py-2 text-base text-ink"
            value={values.notes}
            onChange={(event) =>
              setValues((current) => ({ ...current, notes: event.target.value }))
            }
          />
        </label>
        {errorMessage ? (
          <p
            id="corporate-form-error"
            role="alert"
            className="rounded-md border border-line bg-surface-muted p-3 text-sm text-ink-muted"
          >
            {errorMessage}
          </p>
        ) : null}

        <Button type="submit">
          Continue to WhatsApp
        </Button>
      </form>
    </section>
  );
}
