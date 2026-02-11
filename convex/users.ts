import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { enforceRateLimit } from "./rateLimitHelper";

/**
 * Sync user from Clerk to Convex database.
 * Called on user sign-up/sign-in to ensure user exists in our database.
 * Sets default role to "user" for new users.
 * Derives clerkId from auth identity — never trusts client-supplied values.
 */
export const syncUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to sync user data");
    }

    const clerkId = identity.subject;

    await enforceRateLimit(ctx, clerkId, "syncUser", 5, 60_000);

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    if (existingUser) {
      // Update existing user's info (email/name might have changed)
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
      });
      return existingUser._id;
    }

    // Create new user with default "user" role
    const userId = await ctx.db.insert("users", {
      clerkId,
      email: args.email,
      name: args.name,
      role: "user",
    });

    return userId;
  },
});

/**
 * Get the current authenticated user's role.
 * Returns "admin", "user", or null if not authenticated.
 */
export const getCurrentUserRole = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    return user?.role ?? null;
  },
});

/**
 * Get user by Clerk ID.
 * Used internally for permission checks.
 * Requires authentication.
 */
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to query user data");
    }

    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});
