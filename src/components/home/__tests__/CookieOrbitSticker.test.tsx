import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CookieOrbitSticker } from "@/components/home/CookieOrbitSticker";

describe("CookieOrbitSticker", () => {
  it("restarts the animation on pointer hover and click", () => {
    const { container } = render(<CookieOrbitSticker />);
    const button = screen.getByRole("button", { name: "Play cookie sparkle" });
    const initialBurst = container.querySelector(".cookie-orbit__cookie-burst");

    fireEvent.pointerEnter(button);
    const hoverBurst = container.querySelector(".cookie-orbit__cookie-burst");

    expect(hoverBurst).toBe(initialBurst);
    expect(hoverBurst).toHaveClass("is-replay-a");

    fireEvent.click(button);
    const clickBurst = container.querySelector(".cookie-orbit__cookie-burst");

    expect(clickBurst).toBe(hoverBurst);
    expect(clickBurst).toHaveClass("is-replay-b");
  });
});
