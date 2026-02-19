import { API_HEADERS, API_URL } from "./constants";
import { inputSchema, outputSchema } from "./schemas";
import type { PairInputType, PairOutputType } from "./types";

export const calculatePair = async (
  params: PairInputType,
): Promise<PairOutputType> => {
  const input = inputSchema.parse(params);

  const response = await fetch(API_URL, {
    method: "POST",
    headers: API_HEADERS,
    body: JSON.stringify(input),
  }).catch((err) => {
    throw new Error("Network request failed", { cause: err });
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const json = (await response.json().catch(() => {
    throw new Error("Invalid JSON response");
  })) as unknown;

  const parsed = outputSchema.safeParse(json);

  if (!parsed.success) {
    throw new Error(`Invalid response schema: ${parsed.error.message}`, {
      cause: parsed.error,
    });
  }

  return parsed.data;
};
