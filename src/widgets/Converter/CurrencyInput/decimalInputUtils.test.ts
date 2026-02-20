import Decimal from "decimal.js";
import { describe, it, expect } from "vitest";

import {
  parseDecimalInput,
  getStepPrecision,
  clampDecimal,
  normalizeToStep,
  normalizeValue,
  formatForDisplay,
} from "./decimalInputUtils";

const d = (v: Decimal.Value) => new Decimal(v);

describe("parseDecimalInput", () => {
  it("returns null for empty string", () => {
    expect(parseDecimalInput("", false)).toBeNull();
  });

  it("returns null for temporary dot states", () => {
    expect(parseDecimalInput(".", false)).toBeNull();
    expect(parseDecimalInput("0.", false)).toBeNull();
  });

  it("returns null for lone minus when negative allowed", () => {
    expect(parseDecimalInput("-", true)).toBeNull();
  });

  it("parses valid positive number", () => {
    expect(parseDecimalInput("123.45", false)?.toNumber()).toBe(123.45);
  });

  it("strips commas and spaces", () => {
    expect(parseDecimalInput("1,000 000", false)?.toNumber()).toBe(1000000);
  });

  it("rejects negative when not allowed", () => {
    expect(parseDecimalInput("-5", false)).toBeNull();
  });

  it("accepts negative when allowed", () => {
    expect(parseDecimalInput("-5", true)?.toNumber()).toBe(-5);
  });

  it("returns null for NaN / Infinity", () => {
    expect(parseDecimalInput("NaN", false)).toBeNull();
    expect(parseDecimalInput("Infinity", false)).toBeNull();
  });

  it("returns null for non-numeric strings", () => {
    expect(parseDecimalInput("abc", false)).toBeNull();
  });
});

describe("getStepPrecision", () => {
  it("returns 0 for integer step", () => {
    expect(getStepPrecision(d(1))).toBe(0);
    expect(getStepPrecision(d(100))).toBe(0);
  });

  it("returns correct precision for decimal steps", () => {
    expect(getStepPrecision(d(0.1))).toBe(1);
    expect(getStepPrecision(d(0.01))).toBe(2);
    expect(getStepPrecision(d(0.001))).toBe(3);
  });
});

describe("clampDecimal", () => {
  it("returns value when within range", () => {
    expect(clampDecimal(d(50), d(0), d(100)).toNumber()).toBe(50);
  });

  it("clamps to min when below", () => {
    expect(clampDecimal(d(-10), d(0), d(100)).toNumber()).toBe(0);
  });

  it("clamps to max when above", () => {
    expect(clampDecimal(d(200), d(0), d(100)).toNumber()).toBe(100);
  });

  it("returns boundary value when on boundary", () => {
    expect(clampDecimal(d(0), d(0), d(100)).toNumber()).toBe(0);
    expect(clampDecimal(d(100), d(0), d(100)).toNumber()).toBe(100);
  });
});

describe("normalizeToStep", () => {
  describe("basic snapping", () => {
    it("snaps value to nearest step", () => {
      expect(normalizeToStep(d(47), d(0), d(100), d(5)).toNumber()).toBe(45);
    });

    it("snaps up when closer to next step", () => {
      expect(normalizeToStep(d(48), d(0), d(100), d(5)).toNumber()).toBe(50);
    });

    it("returns exact value when already on step", () => {
      expect(normalizeToStep(d(50), d(0), d(100), d(5)).toNumber()).toBe(50);
    });

    it("works with decimal step 0.01", () => {
      expect(
        normalizeToStep(d(1.005), d(0), d(10), d(0.01)).toNumber(),
      ).toBe(1.01);
    });

    it("works with step 0.1", () => {
      expect(normalizeToStep(d(3.14), d(0), d(10), d(0.1)).toNumber()).toBe(
        3.1,
      );
    });
  });

  describe("clamping", () => {
    it("clamps below min to min", () => {
      expect(normalizeToStep(d(-50), d(0), d(100), d(5)).toNumber()).toBe(0);
    });

    it("clamps above max to max", () => {
      expect(normalizeToStep(d(200), d(0), d(100), d(5)).toNumber()).toBe(100);
    });
  });

  describe("boundaries", () => {
    it("returns min for value equal to min", () => {
      expect(normalizeToStep(d(0), d(0), d(100), d(7)).toNumber()).toBe(0);
    });

    it("returns max for value equal to max when max is on step grid", () => {
      expect(normalizeToStep(d(100), d(0), d(100), d(5)).toNumber()).toBe(100);
    });

    it("snaps to nearest grid step when max is off-grid", () => {
      expect(normalizeToStep(d(100), d(0), d(100), d(7)).toNumber()).toBe(98);
    });
  });

  describe("max not on step grid", () => {
    it("snaps to max when rounding overshoots past max", () => {
      // step=8 > max=5: round(5/8)=1 -> 8 > 5 -> overshoot -> max wins
      expect(normalizeToStep(d(5), d(0), d(5), d(8)).toNumber()).toBe(5);
    });

    it("snaps to nearest grid step below max when no overshoot", () => {
      expect(normalizeToStep(d(99), d(0), d(100), d(7)).toNumber()).toBe(98);
    });

    it("handles non-zero min with off-grid max", () => {
      // min=10, step=7: grid 10, 17, ..., 94
      expect(normalizeToStep(d(95), d(10), d(100), d(7)).toNumber()).toBe(94);
    });
  });

  describe("edge cases", () => {
    it("works when min equals max", () => {
      expect(normalizeToStep(d(50), d(50), d(50), d(1)).toNumber()).toBe(50);
    });

    it("works with step larger than range", () => {
      expect(normalizeToStep(d(5), d(0), d(3), d(10)).toNumber()).toBe(0);
    });

    it("works with very small step", () => {
      expect(
        normalizeToStep(d("0.000055"), d(0), d(1), d("0.00001")).toNumber(),
      ).toBe(0.00006);
    });
  });
});

describe("normalizeValue", () => {
  it("returns min when parsed is null", () => {
    expect(normalizeValue(null, d(100), d(1000), d(1)).toNumber()).toBe(100);
  });

  it("normalizes parsed value to step", () => {
    expect(normalizeValue(d(47), d(0), d(100), d(5)).toNumber()).toBe(45);
  });
});

describe("formatForDisplay", () => {
  it("formats with zero precision", () => {
    expect(formatForDisplay(d(42), 0)).toBe("42");
  });

  it("formats with two decimal places", () => {
    expect(formatForDisplay(d(42), 2)).toBe("42.00");
  });

  it("rounds to requested precision", () => {
    expect(formatForDisplay(d(1.999), 2)).toBe("2.00");
  });
});
