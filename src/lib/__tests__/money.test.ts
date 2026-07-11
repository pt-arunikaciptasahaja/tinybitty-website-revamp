import { describe, expect, it } from "vitest";
import { formatRupiah } from "@/lib/money";

describe("formatRupiah", () => {
  it("formats integer rupiah amounts", () => {
    expect(formatRupiah(25000)).toBe("Rp25.000");
  });

  it("rejects decimal currency values", () => {
    expect(() => formatRupiah(10.5)).toThrow("non-negative integer");
  });
});
