/** Simple sequential rate limiter between connector fetches (MVP). */
export async function rateLimitDelay(ms = 250): Promise<void> {
  if (ms <= 0) return;
  await new Promise((resolve) => setTimeout(resolve, ms));
}
