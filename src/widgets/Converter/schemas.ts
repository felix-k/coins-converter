import { z } from "zod";

export const inputSchema = z.object({
  pairId: z.number(),
  inAmount: z.number().nullable(),
  outAmount: z.number().nullable(),
});

export const outputSchema = z.object({
  inAmount: z.string(),
  outAmount: z.string(),
  isStraight: z.boolean(),
  counter: z.number(),
  price: z.tuple([z.string(), z.string()]),
});
