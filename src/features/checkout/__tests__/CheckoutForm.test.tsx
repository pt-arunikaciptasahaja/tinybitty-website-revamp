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

function formatDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const nextDate = new Date(date);

  nextDate.setDate(date.getDate() + days);

  return nextDate;
}

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
      "Please fill in your name, mobile number, detailed delivery address, and desired date.",
    );
    expect(screen.getByLabelText(/Customer name/)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText(/Customer name/)).toHaveAccessibleDescription("Enter your name.");
    expect(screen.getByLabelText(/Mobile number/)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText(/Mobile number/)).toHaveAccessibleDescription(
      "Enter your mobile number.",
    );
    expect(screen.getByLabelText(/Detailed delivery address/)).toHaveAccessibleDescription(
      "Enter your full delivery address.",
    );
    expect(screen.queryByLabelText(/Delivery or pickup/)).not.toBeInTheDocument();

    const today = new Date();
    expect(screen.getByLabelText(/Desired date/)).toHaveAttribute(
      "min",
      formatDateInputValue(today),
    );
    expect(screen.getByLabelText(/Desired date/)).toHaveAttribute(
      "max",
      formatDateInputValue(addDays(today, 3)),
    );
  });

  it("requires a detailed delivery address", async () => {
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
    fireEvent.change(screen.getByLabelText("Customer name"), { target: { value: "Ayu" } });
    fireEvent.change(screen.getByLabelText("Mobile number"), { target: { value: "081234567890" } });
    fireEvent.change(screen.getByLabelText("Detailed delivery address"), {
      target: { value: "Jakarta" },
    });
    fireEvent.change(screen.getByLabelText("Desired date"), {
      target: { value: formatDateInputValue(new Date()) },
    });
    fireEvent.submit(container.querySelector("form") as HTMLFormElement);

    expect(screen.getByLabelText(/Detailed delivery address/)).toHaveAccessibleDescription(
      "Add more address details, such as street, building number, district, and city.",
    );
  });

  it("requires a valid Indonesian mobile number", async () => {
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
    fireEvent.change(screen.getByLabelText("Customer name"), { target: { value: "Ayu" } });
    fireEvent.change(screen.getByLabelText("Mobile number"), { target: { value: "07" } });
    fireEvent.change(screen.getByLabelText("Detailed delivery address"), {
      target: { value: "Jl. Melati No. 12, Kebayoran Baru, Jakarta Selatan" },
    });
    fireEvent.change(screen.getByLabelText("Desired date"), {
      target: { value: formatDateInputValue(new Date()) },
    });
    fireEvent.submit(container.querySelector("form") as HTMLFormElement);

    expect(screen.getByLabelText(/Mobile number/)).toHaveAccessibleDescription(
      "Mobile number must start with 08.",
    );
  });

  it("keeps the mobile number field numeric and capped at 13 digits", async () => {
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

    render(
      <CartProvider>
        <CheckoutForm />
      </CartProvider>,
    );

    await waitFor(() => expect(screen.getByText("Cookie")).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText("Mobile number"), {
      target: { value: "0812abc34567890" },
    });
    expect(screen.getByLabelText("Mobile number")).toHaveValue("081234567890");

    fireEvent.change(screen.getByLabelText("Mobile number"), {
      target: { value: "0812345678901234567890" },
    });
    expect(screen.getByLabelText("Mobile number")).toHaveValue("0812345678901");
  });

  it("prevents mobile numbers from starting with anything other than 08", async () => {
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

    render(
      <CartProvider>
        <CheckoutForm />
      </CartProvider>,
    );

    await waitFor(() => expect(screen.getByText("Cookie")).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText("Mobile number"), {
      target: { value: "4565645654654" },
    });
    expect(screen.getByLabelText("Mobile number")).toHaveValue("");

    fireEvent.change(screen.getByLabelText("Mobile number"), {
      target: { value: "6281234567890" },
    });
    expect(screen.getByLabelText("Mobile number")).toHaveValue("");

    fireEvent.change(screen.getByLabelText("Mobile number"), {
      target: { value: "07" },
    });
    expect(screen.getByLabelText("Mobile number")).toHaveValue("0");
  });

  it("rejects delivery dates before today", async () => {
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
    fireEvent.change(screen.getByLabelText("Customer name"), { target: { value: "Ayu" } });
    fireEvent.change(screen.getByLabelText("Mobile number"), { target: { value: "081234567890" } });
    fireEvent.change(screen.getByLabelText("Detailed delivery address"), {
      target: { value: "Jl. Melati No. 12, Kebayoran Baru, Jakarta Selatan" },
    });
    fireEvent.change(screen.getByLabelText("Desired date"), {
      target: { value: formatDateInputValue(addDays(new Date(), -1)) },
    });
    fireEvent.submit(container.querySelector("form") as HTMLFormElement);

    expect(screen.getByLabelText(/Desired date/)).toHaveAccessibleDescription(
      "Choose a delivery date from today up to 3 days ahead.",
    );
  });

  it("opens an order summary modal before WhatsApp confirmation", async () => {
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
    fireEvent.change(screen.getByLabelText("Mobile number"), { target: { value: "081234567890" } });
    fireEvent.change(screen.getByLabelText("Detailed delivery address"), {
      target: { value: "Jl. Melati No. 12, Kebayoran Baru, Jakarta Selatan" },
    });
    fireEvent.change(screen.getByLabelText("Desired date"), {
      target: { value: formatDateInputValue(new Date()) },
    });
    fireEvent.submit(container.querySelector("form") as HTMLFormElement);

    expect(
      await screen.findByRole("dialog", { name: "Review before opening WhatsApp" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Order enquiry")).toBeInTheDocument();
    expect(screen.getByText(/^TB-\d{8}-\d{6}$/)).toBeInTheDocument();
    expect(screen.getByText("081234567890")).toBeInTheDocument();
    expect(
      screen.getByText("Jl. Melati No. 12, Kebayoran Baru, Jakarta Selatan"),
    ).toBeInTheDocument();
    expect(screen.getByText("Flat delivery")).toBeInTheDocument();
    expect(screen.getByText("Total to pay")).toBeInTheDocument();
    expect(screen.getByText("Rp125.000")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Bank transfer details are included in the WhatsApp message. Stock and final schedule are confirmed in WhatsApp before the order is final.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open WhatsApp to Confirm" })).toHaveAttribute(
      "href",
      expect.stringContaining("https://wa.me/"),
    );
    expect(trackEvent).toHaveBeenCalledWith(
      "begin_checkout",
      expect.objectContaining({ value: 125000, source: "cart" }),
    );

    fireEvent.click(screen.getByRole("link", { name: "Open WhatsApp to Confirm" }));

    expect(trackEvent).toHaveBeenCalledWith(
      "generate_lead",
      expect.objectContaining({ value: 125000, source: "whatsapp_order_enquiry" }),
    );
    expect(trackEvent).toHaveBeenCalledWith(
      "whatsapp_click",
      expect.objectContaining({ value: 125000, source: "whatsapp_order_enquiry" }),
    );
  });

  it("shows a 144 character counter for optional notes", async () => {
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

    render(
      <CartProvider>
        <CheckoutForm />
      </CartProvider>,
    );

    await waitFor(() => expect(screen.getByText("Cookie")).toBeInTheDocument());
    expect(screen.getByText("0/144")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Notes/), {
      target: { value: "Please pack this as a gift" },
    });

    expect(screen.getByText("26/144")).toBeInTheDocument();
    expect(screen.getByLabelText(/Notes/)).toHaveAttribute("maxLength", "144");
  });
});
