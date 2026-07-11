import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QuantitySelector } from "@/features/catalog/QuantitySelector";

describe("QuantitySelector", () => {
  it("increments and does not decrement below one", () => {
    render(<QuantitySelector />);

    expect(screen.getByLabelText("Selected quantity")).toHaveTextContent("1");
    expect(screen.getByRole("button", { name: "Decrease quantity" })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Increase quantity" }));

    expect(screen.getByLabelText("Selected quantity")).toHaveTextContent("2");
    expect(screen.getByRole("button", { name: "Decrease quantity" })).not.toBeDisabled();
  });

  it("disables controls when unavailable", () => {
    render(<QuantitySelector disabled />);

    expect(screen.getByRole("button", { name: "Decrease quantity" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Increase quantity" })).toBeDisabled();
  });
});
