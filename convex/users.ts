import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Sync user from Clerk to Convex database.
 * Called on user sign-up/sign-in to ensure user exists in our database.
 * Sets default role to "user" for new users.
 */
export const syncUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
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
      clerkId: args.clerkId,
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
 */
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});
