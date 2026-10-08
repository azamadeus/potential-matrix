import { describe, expect, it } from "vitest";
import { clampQty, discountFor, formatTenge, isValidBin, isValidEmail, quote } from "./pricing";

describe("pricing", () => {
  it("charges 4 990 ₸ per person without discount for 1–2 people", () => {
    expect(quote(1)).toMatchObject({ qty: 1, discount: 0, unit: 4990, total: 4990, savings: 0 });
    expect(quote(2).total).toBe(9980);
  });

  it("gives 10% for 3–10 people and 15% for 11–20", () => {
    expect(discountFor(2)).toBe(0);
    expect(discountFor(3)).toBe(0.1);
    expect(discountFor(10)).toBe(0.1);
    expect(discountFor(11)).toBe(0.15);
    expect(discountFor(20)).toBe(0.15);
    expect(quote(3)).toMatchObject({ unit: 4491, total: 13473, savings: 1497 });
    expect(quote(11)).toMatchObject({ unit: 4242, total: 46657 });
    expect(quote(20).total).toBe(84830);
  });

  it("formats tenge with spaces", () => {
    expect(formatTenge(4990)).toBe("4\u00a0990\u00a0₸");
    expect(formatTenge(84830)).toBe("84\u00a0830\u00a0₸");
    expect(formatTenge(500)).toBe("500\u00a0₸");
  });

  it("keeps quantity within 1–20", () => {
    expect(clampQty(0)).toBe(1);
    expect(clampQty(25)).toBe(20);
    expect(clampQty(Number.NaN)).toBe(1);
  });

  it("validates BIN and email", () => {
    expect(isValidBin("123456789012")).toBe(true);
    expect(isValidBin("1234 5678 9012")).toBe(true);
    expect(isValidBin("12345")).toBe(false);
    expect(isValidEmail("a@b.kz")).toBe(true);
    expect(isValidEmail("a@b")).toBe(false);
  });
});
