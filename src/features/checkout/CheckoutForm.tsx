"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { siteConfig } from "@/content/site-config";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { useCart } from "@/features/cart/CartProvider";
import { toWhatsAppLineItems } from "@/features/cart/cart-utils";
import { trackEvent } from "@/lib/analytics";
import { buildWhatsAppMessage, buildWhatsAppUrl, type FulfillmentMethod } from "@/lib/whatsapp";

type CheckoutFormState = {
  customerName: string;
  fulfillmentMethod: FulfillmentMethod;
  area: string;
  desiredDate: string;
  timeWindow: string;
  notes: string;
};

type CheckoutField = keyof Pick<
  CheckoutFormState,
  "customerName" | "area" | "desiredDate" | "timeWindow"
>;

type CheckoutFieldErrors = Partial<Record<CheckoutField, string>>;

const initialFormState: CheckoutFormState = {
  customerName: "",
  fulfillmentMethod: "delivery",
  area: "",
  desiredDate: "",
  timeWindow: "",
  notes: "",
};

export function CheckoutForm() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const [formState, setFormState] = useState(initialFormState);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<CheckoutFieldErrors>({});
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState<string | null>(null);
  const analyticsItems = useMemo(
    () =>
      items.map((item) => ({
        item_id: item.id,
        item_name: item.label,
        item_category: item.kind,
        ...(item.detail ? { item_variant: item.detail } : {}),
        price: item.unitPrice,
        quantity: item.quantity,
      })),
    [items],
  );

  useEffect(() => {
    trackEvent("view_cart", {
      currency: "IDR",
      value: subtotal,
      items: analyticsItems,
      source: "cart",
    });
  }, [analyticsItems, subtotal]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGeneratedWhatsAppUrl(null);
    setFieldErrors({});

    if (items.length === 0) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    const nextFieldErrors = validateCheckoutFields(formState);

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setErrorMessage("Please fill in your name, area, desired date, and time window.");
      return;
    }

    trackEvent("begin_checkout", {
      currency: "IDR",
      value: subtotal,
      items: analyticsItems,
      source: "cart",
    });

    const message = buildWhatsAppMessage({
      orderId: createEnquiryId(),
      customer: formState,
      items: toWhatsAppLineItems(items),
      subtotal,
    });
    const url = buildWhatsAppUrl(siteConfig.whatsappNumber, message);

    if (!url) {
      setErrorMessage(
        "WhatsApp checkout is not configured yet. Please contact Tiny Bitty directly.",
      );
      return;
    }

    trackEvent("generate_lead", {
      currency: "IDR",
      value: subtotal,
      items: analyticsItems,
      source: "whatsapp_checkout",
    });
    setErrorMessage("");
    setGeneratedWhatsAppUrl(url);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
      <section className="rounded-lg border border-line bg-surface-raised p-5 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-ink">Cart</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Stock, delivery fee, schedule, and payment require confirmation.
            </p>
          </div>
          {items.length > 0 ? (
            <button
              type="button"
              className="text-sm font-semibold text-brand-green underline"
              onClick={clearCart}
            >
              Clear
            </button>
          ) : null}
        </div>

        {items.length > 0 ? (
          <ul className="mt-5 grid gap-4">
            {items.map((item) => (
              <li key={item.id} className="rounded-md border border-line bg-surface p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-ink">{item.label}</p>
                    {item.detail ? <p className="text-sm text-ink-muted">{item.detail}</p> : null}
                    <p className="mt-1 text-sm text-ink-muted">
                      <Price amount={item.unitPrice} /> each
                    </p>
                  </div>
                  <p className="font-semibold text-brand-green">
                    <Price amount={item.unitPrice * item.quantity} />
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <label className="text-sm font-semibold text-ink">
                    Qty
                    <input
                      aria-label={`Quantity for ${item.label}`}
                      className="ml-2 h-10 w-20 rounded-md border border-line bg-surface px-3 text-base"
                      type="number"
                      min="1"
                      inputMode="numeric"
                      value={item.quantity}
                      onChange={(event) =>
                        updateQuantity(item.id, Number.parseInt(event.target.value, 10) || 1)
                      }
                    />
                  </label>
                  <button
                    type="button"
                    className="text-sm font-semibold text-brand-green underline"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 rounded-md border border-dashed border-line bg-surface-muted p-4 text-sm text-ink-muted">
            Your cart is empty.
          </p>
        )}
      </section>

      <section className="rounded-lg border border-line bg-surface-raised p-5 shadow-soft">
        <h2 className="text-xl font-semibold text-ink">WhatsApp checkout</h2>
        <p className="mt-2 text-sm leading-6 text-ink-muted">
          This creates a WhatsApp enquiry only. It is not a purchase until Tiny Bitty confirms
          stock, delivery fee, schedule, and payment.
        </p>
        <p className="mt-5 text-lg font-semibold text-brand-green">
          Subtotal: <Price amount={subtotal} />
        </p>

        <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
          <TextInput
            id="checkout-customer-name"
            label="Customer name"
            value={formState.customerName}
            error={fieldErrors.customerName}
            onChange={(value) => setFormState((current) => ({ ...current, customerName: value }))}
            required
          />
          <label
            htmlFor="checkout-fulfillment-method"
            className="grid gap-2 text-sm font-semibold text-ink"
          >
            Delivery or pickup
            <select
              id="checkout-fulfillment-method"
              className="min-h-11 rounded-md border border-line bg-surface px-3 text-base text-ink"
              value={formState.fulfillmentMethod}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  fulfillmentMethod: event.target.value as FulfillmentMethod,
                }))
              }
            >
              <option value="delivery">Delivery</option>
              <option value="pickup">Pickup</option>
            </select>
          </label>
          <TextInput
            id="checkout-area"
            label="Area"
            value={formState.area}
            error={fieldErrors.area}
            onChange={(value) => setFormState((current) => ({ ...current, area: value }))}
            required
          />
          <TextInput
            id="checkout-desired-date"
            label="Desired date"
            type="date"
            value={formState.desiredDate}
            error={fieldErrors.desiredDate}
            onChange={(value) => setFormState((current) => ({ ...current, desiredDate: value }))}
            required
          />
          <TextInput
            id="checkout-time-window"
            label="Time window"
            value={formState.timeWindow}
            error={fieldErrors.timeWindow}
            onChange={(value) => setFormState((current) => ({ ...current, timeWindow: value }))}
            required
          />
          <label htmlFor="checkout-notes" className="grid gap-2 text-sm font-semibold text-ink">
            Notes
            <textarea
              id="checkout-notes"
              className="min-h-24 rounded-md border border-line bg-surface px-3 py-2 text-base text-ink"
              value={formState.notes}
              onChange={(event) =>
                setFormState((current) => ({ ...current, notes: event.target.value }))
              }
            />
          </label>

          {errorMessage ? (
            <p
              id="checkout-form-error"
              role="alert"
              className="rounded-md border border-line bg-surface-muted p-3 text-sm text-ink-muted"
            >
              {errorMessage}
            </p>
          ) : null}

          <Button type="submit" disabled={items.length === 0}>
            Prepare WhatsApp message
          </Button>
        </form>

        {generatedWhatsAppUrl ? (
          <Button
            href={generatedWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full"
            onClick={() =>
              trackEvent("whatsapp_click", {
                currency: "IDR",
                value: subtotal,
                items: analyticsItems,
                source: "whatsapp_checkout",
              })
            }
          >
            Open WhatsApp
          </Button>
        ) : null}
      </section>
    </div>
  );
}

function TextInput({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  required = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | undefined;
  type?: string;
  required?: boolean;
}) {
  const errorId = `${id}-error`;

  return (
    <label htmlFor={id} className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      <input
        id={id}
        className="min-h-11 rounded-md border border-line bg-surface px-3 text-base text-ink"
        type={type}
        value={value}
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
    </label>
  );
}

function validateCheckoutFields(formState: CheckoutFormState): CheckoutFieldErrors {
  const errors: CheckoutFieldErrors = {};

  if (!formState.customerName.trim()) {
    errors.customerName = "Enter your name.";
  }

  if (!formState.area.trim()) {
    errors.area = "Enter your delivery or pickup area.";
  }

  if (!formState.desiredDate) {
    errors.desiredDate = "Choose a desired date.";
  }

  if (!formState.timeWindow.trim()) {
    errors.timeWindow = "Enter a time window.";
  }

  return errors;
}

function createEnquiryId(): string {
  return `TB-${Date.now().toString(36).toUpperCase()}`;
}
