"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { siteConfig } from "@/content/site-config";
import type { CorporatePackage } from "@/content/schemas";
import { Button } from "@/components/ui/Button";
import { initialCorporateEnquiryActionState } from "@/features/corporate/action-core";
import { submitCorporateEnquiry } from "@/features/corporate/actions";
import { buildCorporateWhatsAppMessage } from "@/features/corporate/corporate-enquiry";
import { trackEvent } from "@/lib/analytics";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type CorporateEnquiryFormProps = {
  packages: CorporatePackage[];
};

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
  const [state, formAction, isPending] = useActionState(
    submitCorporateEnquiry,
    initialCorporateEnquiryActionState,
  );
  const [values, setValues] = useState(initialValues);
  const whatsappUrl = useMemo(() => {
    const message = buildCorporateWhatsAppMessage({
      ...values,
      estimatedQuantity: Number.parseInt(values.estimatedQuantity, 10) || 1,
    });

    return buildWhatsAppUrl(siteConfig.whatsappNumber, message);
  }, [values]);

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    trackEvent("corporate_enquiry", {
      source: "corporate_gifts_form",
    });
  }, [state.status]);

  return (
    <section className="rounded-lg border border-line bg-surface-raised p-5 shadow-soft">
      <h2 className="text-xl font-semibold text-ink">Request a quotation</h2>
      <p className="mt-2 text-sm leading-6 text-ink-muted">
        This form sends an enquiry only. MOQ, lead time, stock, delivery fee, schedule, and payment
        require confirmation.
      </p>

      <form action={formAction} className="mt-5 grid gap-4">
        <TextInput
          label="Company name"
          name="companyName"
          value={values.companyName}
          error={state.fieldErrors.companyName}
          onChange={(value) => setValues((current) => ({ ...current, companyName: value }))}
          required
        />
        <TextInput
          label="Contact name"
          name="contactName"
          value={values.contactName}
          error={state.fieldErrors.contactName}
          onChange={(value) => setValues((current) => ({ ...current, contactName: value }))}
          required
        />
        <TextInput
          label="Email"
          name="email"
          type="email"
          value={values.email}
          error={state.fieldErrors.email}
          onChange={(value) => setValues((current) => ({ ...current, email: value }))}
          required
        />
        <TextInput
          label="Phone or WhatsApp"
          name="phone"
          value={values.phone}
          error={state.fieldErrors.phone}
          onChange={(value) => setValues((current) => ({ ...current, phone: value }))}
          required
        />
        <label
          htmlFor="corporate-packageSlug"
          className="grid gap-2 text-sm font-semibold text-ink"
        >
          Package tier
          <select
            id="corporate-packageSlug"
            className="min-h-11 rounded-md border border-line bg-surface px-3 text-base text-ink"
            name="packageSlug"
            value={values.packageSlug}
            required
            aria-invalid={state.fieldErrors.packageSlug ? "true" : undefined}
            aria-describedby={
              state.fieldErrors.packageSlug ? "corporate-packageSlug-error" : undefined
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
          {state.fieldErrors.packageSlug ? (
            <span id="corporate-packageSlug-error" className="text-sm text-ink-muted">
              {state.fieldErrors.packageSlug}
            </span>
          ) : null}
        </label>
        <TextInput
          label="Estimated quantity"
          name="estimatedQuantity"
          type="number"
          min="1"
          value={values.estimatedQuantity}
          error={state.fieldErrors.estimatedQuantity}
          onChange={(value) => setValues((current) => ({ ...current, estimatedQuantity: value }))}
          required
        />
        <TextInput
          label="Desired date"
          name="desiredDate"
          type="date"
          value={values.desiredDate}
          error={state.fieldErrors.desiredDate}
          onChange={(value) => setValues((current) => ({ ...current, desiredDate: value }))}
          required
        />
        <TextInput
          label="Customization request"
          name="customization"
          value={values.customization}
          onChange={(value) => setValues((current) => ({ ...current, customization: value }))}
        />
        <label htmlFor="corporate-notes" className="grid gap-2 text-sm font-semibold text-ink">
          Notes
          <textarea
            id="corporate-notes"
            className="min-h-24 rounded-md border border-line bg-surface px-3 py-2 text-base text-ink"
            name="notes"
            value={values.notes}
            onChange={(event) =>
              setValues((current) => ({ ...current, notes: event.target.value }))
            }
          />
        </label>
        <label className="hidden" aria-hidden="true">
          Website
          <input
            tabIndex={-1}
            autoComplete="off"
            name="website"
            value=""
            onChange={() => undefined}
          />
        </label>

        {state.message ? (
          <p
            id="corporate-form-status"
            role={state.status === "error" ? "alert" : "status"}
            className="rounded-md border border-line bg-surface-muted p-3 text-sm text-ink-muted"
          >
            {state.message}
            {state.referenceId ? ` Reference: ${state.referenceId}` : ""}
          </p>
        ) : null}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit quotation request"}
        </Button>
      </form>

      {whatsappUrl ? (
        <Button
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          className="mt-4 w-full"
          onClick={() =>
            trackEvent("whatsapp_click", {
              source: "corporate_gifts_alternative",
            })
          }
        >
          Continue via WhatsApp instead
        </Button>
      ) : (
        <p className="mt-4 rounded-md border border-dashed border-line bg-surface-muted p-3 text-sm text-ink-muted">
          WhatsApp alternative requires the configured WhatsApp number.
        </p>
      )}
    </section>
  );
}

function TextInput({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  required = false,
  min,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | undefined;
  type?: string;
  required?: boolean;
  min?: string;
}) {
  const id = `corporate-${name}`;
  const errorId = `${id}-error`;

  return (
    <label htmlFor={id} className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      <input
        id={id}
        className="min-h-11 rounded-md border border-line bg-surface px-3 text-base text-ink"
        name={name}
        type={type}
        value={value}
        required={required}
        min={min}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <span id={errorId} className="text-sm text-ink-muted">
          {error}
        </span>
      ) : null}
    </label>
  );
}
