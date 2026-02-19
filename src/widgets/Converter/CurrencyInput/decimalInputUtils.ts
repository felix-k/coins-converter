import Decimal from "decimal.js";

/** Tolerant parse: returns Decimal or null for invalid/temporary input */
export function parseDecimalInput(
  str: string,
  allowNegative: boolean
): Decimal | null {
  const trimmed = str.trim();
  if (trimmed === "") return null;
  // Temporary states during typing
  if (trimmed === "." || trimmed === "0.") return null;
  if (trimmed === "-" && allowNegative) return null;

  try {
    const d = new Decimal(trimmed.replace(/,/g, "").replace(/\s/g, ""));
    if (d.isNaN() || !d.isFinite()) return null;
    if (!allowNegative && d.isNegative()) return null;
    return d;
  } catch {
    return null;
  }
}

/** Get decimal places from step for formatting */
export function getStepPrecision(step: Decimal): number {
  const stepStr = step.toString();
  const dotIndex = stepStr.indexOf(".");
  if (dotIndex === -1) return 0;
  return stepStr.length - dotIndex - 1;
}

/** Clamp value to [min, max] using Decimal */
export function clampDecimal(
  value: Decimal,
  min: Decimal,
  max: Decimal
): Decimal {
  return Decimal.min(Decimal.max(value, min), max);
}

/**
 * Normalize value: clamp + align to step.
 * Formula: min + round((value - min) / step) * step
 *
 * Both min and max are always valid snap targets, even when max
 * doesn't fall exactly on the step grid starting from min.
 */
export function normalizeToStep(
  value: Decimal,
  min: Decimal,
  max: Decimal,
  step: Decimal
): Decimal {
  const clamped = clampDecimal(value, min, max);

  const normalized = min.plus(
    clamped.minus(min).div(step).round().times(step)
  );

  if (normalized.gt(max)) {
    const floorSteps = max.minus(min).div(step).floor();
    const floorValue = min.plus(floorSteps.times(step));

    return clamped.minus(max).abs().lte(clamped.minus(floorValue).abs())
      ? max
      : floorValue;
  }

  if (normalized.lt(min)) {
    return min;
  }

  return normalized;
}

/** Full normalization: empty → min, then clamp + step align */
export function normalizeValue(
  parsed: Decimal | null,
  min: Decimal,
  max: Decimal,
  step: Decimal
): Decimal {
  const value = parsed ?? min;
  return normalizeToStep(value, min, max, step);
}

/** Format Decimal for display with step precision (no floating artifacts) */
export function formatForDisplay(value: Decimal, precision: number): string {
  return value.toFixed(precision);
}
