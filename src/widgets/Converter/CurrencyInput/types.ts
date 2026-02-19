import type { TICKERS } from "./constants";

export type TickersType = (typeof TICKERS)[keyof typeof TICKERS];
