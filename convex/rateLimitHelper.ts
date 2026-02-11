import { MutationCtx } from "./_generated/server";

/**
 * Database-backed rate limiter for Convex mutations.
 * Tracks request timestamps per user+endpoint and enforces sliding window limits.
 * Throws an error if the rate limit is exceeded.
 */
export async function enforceRateLimit(
  ctx: MutationCtx,
  userId: string,
  endpoint: string,
  maxRequests: number,
  windowMs: number
) {
  const now = Date.now();
  const windowStart = now - windowMs;

  const existing = await ctx.db
    .query("rateLimits")
    .withIndex("by_user_endpoint", (q) =>
      q.eq("userId", userId).eq("endpoint", endpoint)
    )
    .first();

  if (existing) {
    // Filter to only timestamps within the current window
    const recentTimestamps = existing.timestamps.filter(
      (ts) => ts > windowStart
    );

    if (recentTimestamps.length >= maxRequests) {
      throw new Error(
        `Too many requests — please wait a moment and try again.`
      );
    }

    // Update with new timestamp, keeping only recent ones
    await ctx.db.patch(existing._id, {
      timestamps: [...recentTimestamps, now],
    });
  } else {
    await ctx.db.insert("rateLimits", {
      userId,
      endpoint,
      timestamps: [now],
    });
  }
}
