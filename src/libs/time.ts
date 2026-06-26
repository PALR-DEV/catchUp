import ms, { type StringValue } from "ms";

export function sinceDate(timeframe: StringValue): Date {
  const milliseconds = ms(timeframe);
  if (milliseconds === undefined) {
    throw new Error(`Invalid timeframe: "${timeframe}"`);
  }

  return new Date(Date.now() - milliseconds);
}

