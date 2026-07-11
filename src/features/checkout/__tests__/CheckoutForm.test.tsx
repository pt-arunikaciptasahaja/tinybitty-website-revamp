import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CartProvider } from "@/features/cart/CartProvider";
import { CART_STORAGE_KEY } from "@/features/cart/cart-utils";
import { CheckoutForm } from "@/features/checkout/CheckoutForm";
import { trackEvent } from "@/lib/analytics";

vi.mock("@/lib/analytics", async () => {
  const actual = await vi.importActual<typeof import("@/lib/analytics")>("@/lib/analytics");

  return {
    ...actual,
    trackEvent: vi.fn(),
  };
});

describe("CheckoutForm", () => {
  it("validates required checkout fields", async () => {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        items: [
          {
            id: "product:test:variant",
            kind: "product",
            label: "Cookie",
            detail: "Box",
            unitPrice: 25000,
            quantity: 1,
          },
        ],
      }),
    );

    const { container } = render(
      <CartProvider>
        <CheckoutForm />
      </CartProvider>,
    );

    await waitFor(() => expect(screen.getByText("Cookie")).toBeInTheDocument());
    fireEvent.submit(container.querySelector("form") as HTMLFormElement);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Please fill in your name, area, desired date, and time window.",
    );
    expect(screen.getByLabelText(/Customer name/)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText(/Customer name/)).toHaveAccessibleDescription("Enter your name.");
    expect(screen.getByLabelText(/Area/)).toHaveAccessibleDescription(
      "Enter your delivery or pickup area.",
    );
  });

  it("handles missing WhatsApp configuration safely", async () => {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        items: [
          {
            id: "bundle:test",
            kind: "bundle",
            label: "Bundle",
            detail: "Bundle",
            unitPrice: 50000,
            quantity: 2,
          },
        ],
      }),
    );

    const { container } = render(
      <CartProvider>
        <CheckoutForm />
      </CartProvider>,
    );

    await waitFor(() => expect(screen.getByLabelText("Quantity for Bundle")).toHaveValue(2));
    fireEvent.change(screen.getByLabelText("Customer name"), { target: { value: "Ayu" } });
    fireEvent.change(screen.getByLabelText("Area"), { target: { value: "Jakarta Selatan" } });
    fireEvent.change(screen.getByLabelText("Desired date"), { target: { value: "2026-07-12" } });
    fireEvent.change(screen.getByLabelText("Time window"), { target: { value: "10:00-12:00" } });
    fireEvent.submit(container.querySelector("form") as HTMLFormElement);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "WhatsApp checkout is not configured yet",
    );
    expect(trackEvent).toHaveBeenCalledWith(
      "begin_checkout",
      expect.objectContaining({ value: 100000, source: "cart" }),
    );
    expect(screen.queryByRole("link", { name: "Open WhatsApp" })).not.toBeInTheDocument();
  });
});
