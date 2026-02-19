import type z from "zod";

import type { inputSchema, outputSchema } from "./schemas";

export type PairInputType = z.infer<typeof inputSchema>;
export type PairOutputType = z.infer<typeof outputSchema>;
