"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { siteConfig } from "@/content/site-config";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { useCart } from "@/features/cart/CartProvider";
import { toWhatsAppLineItems } from "@/features/cart/cart-utils";
import { trackEvent } from "@/lib/analytics";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

type CheckoutFormState = {
  customerName: string;
  mobileNumber: string;
  deliveryAddress: string;
  desiredDate: string;
  notes: string;
};

type CheckoutField = keyof CheckoutFormState;

type CheckoutFieldErrors = Partial<Record<CheckoutField, string>>;

const initialFormState: CheckoutFormState = {
  customerName: "",
  mobileNumber: "",
  deliveryAddress: "",
  desiredDate: "",
  notes: "",
};

const customerNameMaxLength = 80;
const mobileNumberMinLength = 10;
const mobileNumberMaxLength = 13;
const deliveryAddressMaxLength = 180;
const notesMaxLength = 144;
const flatDeliveryFee = 25000;
const unsafeControlCharacterPattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

function formatDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDeliveryDateRange() {
  const today = new Date();
  const maxDate = new Date(today);

  maxDate.setDate(today.getDate() + 3);

  return {
    min: formatDateInputValue(today),
    max: formatDateInputValue(maxDate),
  };
}

export function CheckoutForm() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const orderTotal = subtotal + flatDeliveryFee;
  const deliveryDateRange = useMemo(() => getDeliveryDateRange(), []);
  const [formState, setFormState] = useState(initialFormState);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<CheckoutFieldErrors>({});
  const [reviewState, setReviewState] = useState<{ orderId: string; whatsappUrl: string } | null>(
    null,
  );
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
    setReviewState(null);
    setFieldErrors({});

    if (items.length === 0) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    const nextFieldErrors = validateCheckoutFields(formState);

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setErrorMessage(
        "Please fill in your name, mobile number, detailed delivery address, and desired date.",
      );
      return;
    }

    trackEvent("begin_checkout", {
      currency: "IDR",
      value: orderTotal,
      items: analyticsItems,
      source: "cart",
    });

    const orderId = createEnquiryId();
    const message = buildWhatsAppMessage({
      orderId,
      customer: formState,
      items: toWhatsAppLineItems(items),
      subtotal,
      deliveryFee: flatDeliveryFee,
    });
    const url = buildWhatsAppUrl(siteConfig.whatsappNumber, message);

    if (!url) {
      setErrorMessage(
        "WhatsApp order enquiry is not configured yet. Please contact Tiny Bitty directly.",
      );
      return;
    }

    setErrorMessage("");
    setReviewState({ orderId, whatsappUrl: url });
  }

  function handleWhatsAppOpen() {
    trackEvent("generate_lead", {
      currency: "IDR",
      value: orderTotal,
      items: analyticsItems,
      source: "whatsapp_order_enquiry",
    });
    trackEvent("whatsapp_click", {
      currency: "IDR",
      value: orderTotal,
      items: analyticsItems,
      source: "whatsapp_order_enquiry",
    });
    // Close the review modal to prevent multiple clicks and show confirmation
    setReviewState(null);
    clearCart();
    // Reset all form fields to their initial state
    setFormState(initialFormState);
    setFieldErrors({});
    setErrorMessage("");
  };

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
                    <div className="ml-2 flex items-center gap-2">
                      <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-surface text-ink transition-colors duration-base ease-smooth hover:bg-surface-muted"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      >
                        -
                      </button>
                      <input
                        aria-label={`Quantity for ${item.label}`}
                        className="h-10 w-16 rounded-md border border-line bg-surface px-2 text-center text-base"
                        type="number"
                        min="1"
                        inputMode="numeric"
                        value={item.quantity}
                        onChange={(event) =>
                          updateQuantity(item.id, Math.max(1, Number.parseInt(event.target.value, 10) || 1))
                        }
                      />
                      <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-surface text-ink transition-colors duration-base ease-smooth hover:bg-surface-muted"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
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
        <h2 className="text-xl font-semibold text-ink">Send Order Enquiry</h2>
        <p className="mt-2 text-sm leading-6 text-ink-muted">
          This creates a delivery enquiry only. It is not a purchase until Tiny Bitty confirms
          stock, delivery fee, schedule, and payment through WhatsApp.
        </p>
        <p className="mt-5 text-lg font-semibold text-brand-green">
          Subtotal: <Price amount={subtotal} />
        </p>

        <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
          <TextInput
            id="checkout-customer-name"
            label="Customer name"
            maxLength={customerNameMaxLength}
            value={formState.customerName}
            error={fieldErrors.customerName}
            onChange={(value) => setFormState((current) => ({ ...current, customerName: value }))}
            required
          />
          <TextInput
            id="checkout-mobile-number"
            label="Mobile number"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={formState.mobileNumber}
            error={fieldErrors.mobileNumber}
            onChange={(value) =>
              setFormState((current) => ({
                ...current,
                mobileNumber: formatMobileNumberInput(value),
              }))
            }
            placeholder="08..."
            required
          />
          <TextInput
            id="checkout-delivery-address"
            label="Detailed delivery address"
            maxLength={deliveryAddressMaxLength}
            value={formState.deliveryAddress}
            error={fieldErrors.deliveryAddress}
            onChange={(value) =>
              setFormState((current) => ({ ...current, deliveryAddress: value }))
            }
            placeholder="Street, building/house number, district, city, and helpful notes"
            required
          />
          <TextInput
            id="checkout-desired-date"
            label="Desired date"
            type="date"
            min={deliveryDateRange.min}
            max={deliveryDateRange.max}
            value={formState.desiredDate}
            error={fieldErrors.desiredDate}
            onChange={(value) => setFormState((current) => ({ ...current, desiredDate: value }))}
            required
          />
          <label htmlFor="checkout-notes" className="grid gap-2 text-sm font-semibold text-ink">
            Notes <span className="font-normal text-ink-muted">(optional)</span>
            <textarea
              id="checkout-notes"
              className="min-h-24 rounded-md border border-line bg-surface px-3 py-2 text-base text-ink"
              maxLength={notesMaxLength}
              value={formState.notes}
              aria-invalid={fieldErrors.notes ? "true" : undefined}
              aria-describedby={fieldErrors.notes ? "checkout-notes-error" : undefined}
              onChange={(event) =>
                setFormState((current) => ({ ...current, notes: event.target.value }))
              }
            />
            <span
              className="flex items-center justify-between gap-3 text-xs text-ink-muted"
              aria-live="polite"
            >
              {fieldErrors.notes ? (
                <span id="checkout-notes-error">{fieldErrors.notes}</span>
              ) : (
                <span>Add delivery details, recipient notes, or a short gift message.</span>
              )}
              <span className="shrink-0 tabular-nums">
                {formState.notes.length}/{notesMaxLength}
              </span>
            </span>
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
            Review order enquiry
          </Button>
        </form>

        {reviewState ? (
          <OrderReviewModal
            formState={formState}
            items={items}
            orderId={reviewState.orderId}
            subtotal={subtotal}
            deliveryFee={flatDeliveryFee}
            whatsappUrl={reviewState.whatsappUrl}
            onClose={() => setReviewState(null)}
            onWhatsAppOpen={handleWhatsAppOpen}
          />
        ) : null}
      </section>
    </div>
  );
}

type OrderReviewModalProps = {
  formState: CheckoutFormState;
  items: ReturnType<typeof useCart>["items"];
  orderId: string;
  subtotal: number;
  deliveryFee: number;
  whatsappUrl: string;
  onClose: () => void;
  onWhatsAppOpen: () => void;
};

function OrderReviewModal({
  formState,
  items,
  orderId,
  subtotal,
  deliveryFee,
  whatsappUrl,
  onClose,
  onWhatsAppOpen,
}: OrderReviewModalProps) {
  const total = subtotal + deliveryFee;

  return (
    <div
      aria-labelledby="order-review-title"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-end bg-ink/45 p-0 sm:place-items-center sm:p-4"
      role="dialog"
    >
      <div className="max-h-[90svh] w-full overflow-y-auto rounded-t-xl border border-line bg-surface-raised p-5 shadow-raised sm:max-w-2xl sm:rounded-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-green">
              Order enquiry
            </p>
            <h2 id="order-review-title" className="mt-2 text-2xl font-bold text-ink">
              Review before opening WhatsApp
            </h2>
          </div>
          <button
            type="button"
            className="text-sm font-semibold text-brand-green underline"
            onClick={onClose}
          >
            Edit
          </button>
        </div>

        <div className="mt-5 grid gap-5">
          <section className="rounded-lg border border-line bg-surface p-4">
            <h3 className="font-semibold text-ink">Items</h3>
            <ul className="mt-3 grid gap-3 text-sm">
              {items.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-ink">{item.label}</p>
                    {item.detail ? <p className="text-ink-muted">{item.detail}</p> : null}
                    <p className="text-ink-muted">Qty {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-brand-green">
                    <Price amount={item.unitPrice * item.quantity} />
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-line pt-3 text-right font-semibold text-brand-green">
              Subtotal: <Price amount={subtotal} />
            </p>
            <dl className="mt-3 grid gap-2 border-t border-line pt-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="font-semibold text-ink">Delivery service</dt>
                <dd className="text-right text-ink-muted">Flat delivery</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="font-semibold text-ink">Delivery cost</dt>
                <dd className="font-semibold text-brand-green">
                  <Price amount={deliveryFee} />
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-line pt-3 text-base">
                <dt className="font-semibold text-ink">Total to pay</dt>
                <dd className="font-semibold text-brand-green">
                  <Price amount={total} />
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-line bg-surface p-4">
            <h3 className="font-semibold text-ink">Delivery details</h3>
            <dl className="mt-3 grid gap-3 text-sm text-ink-muted sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-ink">Order ID</dt>
                <dd className="mt-1">{orderId}</dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Customer</dt>
                <dd className="mt-1">{formState.customerName}</dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Mobile number</dt>
                <dd className="mt-1">{formState.mobileNumber}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-semibold text-ink">Address</dt>
                <dd className="mt-1">{formState.deliveryAddress}</dd>
              </div>
              <div>
                <dt className="font-semibold text-ink">Desired date</dt>
                <dd className="mt-1">{formState.desiredDate}</dd>
              </div>
              {formState.notes.trim() ? (
                <div className="sm:col-span-2">
                  <dt className="font-semibold text-ink">Notes</dt>
                  <dd className="mt-1">{formState.notes}</dd>
                </div>
              ) : null}
            </dl>
          </section>

          <p className="rounded-lg border border-line bg-surface-muted p-4 text-sm leading-6 text-ink-muted">
            Bank transfer details are included in the WhatsApp message. Stock and final schedule
            are confirmed in WhatsApp before the order is final.
          </p>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Edit details
          </Button>
          <Button
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onWhatsAppOpen}
          >
            Open WhatsApp to Confirm
          </Button>
        </div>
      </div>
    </div>
  );
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
    </label>
  );
}

function validateCheckoutFields(formState: CheckoutFormState): CheckoutFieldErrors {
  const errors: CheckoutFieldErrors = {};

  if (!formState.customerName.trim()) {
    errors.customerName = "Enter your name.";
  } else if (hasUnsafeControlCharacters(formState.customerName)) {
    errors.customerName = "Use letters, spaces, and standard punctuation only.";
  } else if (formState.customerName.trim().length > customerNameMaxLength) {
    errors.customerName = `Keep your name to ${customerNameMaxLength} characters or fewer.`;
  }

  if (!formState.mobileNumber.trim()) {
    errors.mobileNumber = "Enter your mobile number.";
  } else if (formState.mobileNumber.length > mobileNumberMaxLength) {
    errors.mobileNumber = `Mobile number must be ${mobileNumberMaxLength} digits or fewer.`;
  } else if (!formState.mobileNumber.startsWith("08")) {
    errors.mobileNumber = "Mobile number must start with 08.";
  } else if (formState.mobileNumber.length < mobileNumberMinLength) {
    errors.mobileNumber = `Mobile number must be at least ${mobileNumberMinLength} digits.`;
  }

  if (!formState.deliveryAddress.trim()) {
    errors.deliveryAddress = "Enter your full delivery address.";
  } else if (hasUnsafeControlCharacters(formState.deliveryAddress)) {
    errors.deliveryAddress = "Remove unusual characters from the delivery address.";
  } else if (formState.deliveryAddress.trim().length < 15) {
    errors.deliveryAddress =
      "Add more address details, such as street, building number, district, and city.";
  } else if (formState.deliveryAddress.trim().length > deliveryAddressMaxLength) {
    errors.deliveryAddress = `Keep the delivery address to ${deliveryAddressMaxLength} characters or fewer.`;
  }

  if (!formState.desiredDate) {
    errors.desiredDate = "Choose a desired date.";
  } else {
    const deliveryDateRange = getDeliveryDateRange();

    if (
      formState.desiredDate < deliveryDateRange.min ||
      formState.desiredDate > deliveryDateRange.max
    ) {
      errors.desiredDate = "Choose a delivery date from today up to 3 days ahead.";
    }
  }

  if (hasUnsafeControlCharacters(formState.notes)) {
    errors.notes = "Remove unusual characters from the notes.";
  } else if (formState.notes.length > notesMaxLength) {
    errors.notes = `Keep notes to ${notesMaxLength} characters or fewer.`;
  }

  return errors;
}

function createEnquiryId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `TB-${year}${month}${day}-${hours}${minutes}${seconds}`;
}

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

function hasUnsafeControlCharacters(value: string): boolean {
  return unsafeControlCharacterPattern.test(value);
}
