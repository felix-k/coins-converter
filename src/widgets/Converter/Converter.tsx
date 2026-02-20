import { useCallback, useEffect, useState } from "react";
import { Box, Stack, Fade } from "@mui/material";
import Decimal from "decimal.js";

import { TICKERS } from "./constants";
import { calculatePair } from "./helpers";
import CurrencyInput from "./CurrencyInput";

const Converter = () => {
  const [rubAmount, setRubAmount] = useState(() => new Decimal(10000));
  const [rubMinAmount] = useState(() => new Decimal(10000));
  const [rubMaxAmount] = useState(() => new Decimal(70000000));
  const [rubStep] = useState(() => new Decimal(100));

  const [usdtAmount, setUsdtAmount] = useState(() => new Decimal(0));
  const [usdtMinAmount, setUsdtMinAmount] = useState(() => new Decimal(0));
  const [usdtMaxAmount, setUsdtMaxAmount] = useState(() => new Decimal(0));
  const [usdtStep] = useState(() => new Decimal(0.01));

  const getParams = (inAmount: Decimal | null, outAmount: Decimal | null) => ({
    pairId: 133,
    inAmount: inAmount?.toNumber() ?? null,
    outAmount: outAmount?.toNumber() ?? null,
  });

  const handleChangeRubAmount = useCallback(
    async (v: Decimal) => {
      const result = await calculatePair(getParams(v, null));

      setUsdtAmount(new Decimal(result.outAmount));
      setUsdtMinAmount(new Decimal(rubMinAmount.mul(result.price[0])));
      setUsdtMaxAmount(new Decimal(rubMaxAmount.mul(result.price[0])));
    },
    [rubMinAmount, rubMaxAmount],
  );

  const handleChangeUsdtAmount = useCallback(
    async (v: Decimal) => {
      const result = await calculatePair(getParams(null, v));

      const newInAmount = new Decimal(result.inAmount);
      const newUsdtMinAmount = new Decimal(rubMinAmount.mul(result.price[0]));
      const newUsdtMaxAmount = new Decimal(rubMaxAmount.mul(result.price[0]));

      if (newInAmount.lessThan(rubMinAmount)) {
        handleChangeRubAmount(rubMinAmount);
        return;
      }

      if (newInAmount.greaterThan(rubMaxAmount)) {
        handleChangeRubAmount(rubMaxAmount);
        return;
      }

      setRubAmount(newInAmount);
      setUsdtMinAmount(newUsdtMinAmount);
      setUsdtMaxAmount(newUsdtMaxAmount);
    },
    [rubMinAmount, rubMaxAmount, handleChangeRubAmount],
  );

  useEffect(() => {
    handleChangeRubAmount(rubAmount);
  }, []);

  return (
    <Fade in={!usdtMaxAmount.isZero()} timeout={400}>
      <Box
        sx={{
          width: 1,
          my: 4,
          px: { xs: 2, desktop: 4 },
          transition: "padding 0.2s ease",
          display: { xs: "flex", desktop: "block" },
        }}
      >
        <Stack
          gap={{ xs: 2, notebook: 4 }}
          sx={{
            mx: { xs: "auto", desktop: "none" },
            flexDirection: { xs: "column", notebook: "row" },
          }}
        >
          <CurrencyInput
            ticker={TICKERS.RUB}
            min={rubMinAmount}
            max={rubMaxAmount}
            step={rubStep}
            value={rubAmount}
            onChange={handleChangeRubAmount}
          />
          <CurrencyInput
            ticker={TICKERS.USDT}
            min={usdtMinAmount}
            max={usdtMaxAmount}
            step={usdtStep}
            value={usdtAmount}
            onChange={handleChangeUsdtAmount}
          />
        </Stack>
      </Box>
    </Fade>
  );
};

export default Converter;
