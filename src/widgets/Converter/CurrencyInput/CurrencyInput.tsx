import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Divider, InputBase, Stack, Typography, useTheme } from "@mui/material";
import { useDebounceCallback, useEventCallback } from "usehooks-ts";
import Decimal from "decimal.js";

import {
  formatForDisplay,
  getStepPrecision,
  normalizeValue,
  parseDecimalInput,
} from "./decimalInputUtils";

import ProgressBar from "./ProgressBar";
import type { TickersType } from "./types";

type CurrencyInputProps = {
  min: Decimal.Value;
  max: Decimal.Value;
  step: Decimal.Value;
  value: Decimal.Value;
  ticker: TickersType;
  onChange?: (v: Decimal) => void;
};

const CurrencyInput = memo(
  ({ min, max, step, value, ticker, onChange }: CurrencyInputProps) => {
    const minD = useMemo(() => new Decimal(min), [min]);
    const maxD = useMemo(() => new Decimal(max), [max]);
    const stepD = useMemo(() => new Decimal(step), [step]);
    const valueD = useMemo(() => new Decimal(value), [value]);

    const duration = useTheme().transitions.duration.short;

    const precision = useMemo(
      () =>
        Math.max(
          getStepPrecision(stepD),
          // getStepPrecision(minD),
          // getStepPrecision(maxD),
        ),
      [stepD, minD, maxD],
    );

    const [raw, setRaw] = useState(() => formatForDisplay(valueD, precision));
    const inputRef = useRef<HTMLInputElement>(null);

    const normalizeRaw = (rawValue: string): Decimal =>
      normalizeValue(parseDecimalInput(rawValue, false), minD, maxD, stepD);

    useEffect(() => {
      const formatted = formatForDisplay(valueD, precision);
      setRaw((prev) => (prev === formatted ? prev : formatted));
    }, [valueD, precision]);

    const commitValue = useEventCallback((rawValue: string) => {
      const normalized = normalizeRaw(rawValue);
      const formatted = formatForDisplay(normalized, precision);

      if (formatted !== rawValue) {
        const caret = inputRef.current?.selectionStart ?? null;
        setRaw(formatted);

        requestAnimationFrame(() => {
          if (caret !== null && inputRef.current) {
            inputRef.current.setSelectionRange(caret, caret);
          }
        });
      }

      onChange?.(normalized);
    });

    const debouncedCommitValue = useDebounceCallback(commitValue, duration);

    const percent = useMemo(() => {
      if (maxD.eq(minD)) return 0;

      const parsed = parseDecimalInput(raw, false);
      const current = parsed
        ? Decimal.min(Decimal.max(parsed, minD), maxD)
        : minD;

      return current.minus(minD).div(maxD.minus(minD)).mul(100).toNumber();
    }, [raw, minD, maxD]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      if (!/^[0-9.]*$/.test(next)) return;

      setRaw(next);
      debouncedCommitValue(next);
    };

    const clickProgress = useEventCallback((percent: number) => {
      debouncedCommitValue.cancel();

      const val = minD.plus(maxD.minus(minD).mul(percent).div(100));
      const normalized = normalizeRaw(formatForDisplay(val, precision));
      const formatted = formatForDisplay(normalized, precision);

      setRaw(formatted);
      onChange?.(normalized);
    });

    const handleClickProgress = useDebounceCallback(clickProgress, duration);

    return (
      <Stack maxWidth={{ notebook: 450, desktop: "none" }} width={1}>
        <Stack direction="row" alignItems="center" gap={2}>
          <Typography variant="h3" color="primary">
            {ticker}
          </Typography>

          <InputBase
            inputRef={inputRef}
            value={raw}
            sx={(theme) => ({
              flex: 1,
              minWidth: 0,
              fontSize: theme.typography.h3.fontSize,
              lineHeight: theme.typography.h3.lineHeight,
              py: 0,
              "& input": { py: 0 },
            })}
            onChange={handleChange}
          />
        </Stack>
        <Divider />
        <ProgressBar percent={percent} onClick={handleClickProgress} />
      </Stack>
    );
  },
);

export default CurrencyInput;
