import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { enforceRateLimit } from "./rateLimitHelper";

const genreValidator = v.union(
  v.literal("horror"),
  v.literal("action"),
  v.literal("comedy"),
  v.literal("drama"),
  v.literal("scifi"),
  v.literal("documentary"),
  v.literal("other")
);

const MAX_QUERY_LIMIT = 50;
const MAX_ALL_RECOMMENDATIONS = 200;

/**
 * Get public recommendations for the landing page.
 * No authentication required.
 * Returns latest recommendations sorted by creation date (newest first).
 */
export const getPublicRecommendations = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(1, args.limit ?? 10), MAX_QUERY_LIMIT);

    const recommendations = await ctx.db
      .query("recommendations")
      .withIndex("by_creation")
      .order("desc")
      .take(limit);

    return recommendations;
  },
});

/**
 * Get all recommendations with optional filtering.
 * Supports genre filtering and staff picks filtering.
 * No authentication required to view.
 */
export const getAllRecommendations = query({
  args: {
    genre: v.optional(v.string()),
    staffPicksOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let recommendations;

    // If filtering by staff picks only
    if (args.staffPicksOnly) {
      recommendations = await ctx.db
        .query("recommendations")
        .withIndex("by_staff_pick", (q) => q.eq("isStaffPick", true))
        .order("desc")
        .take(MAX_ALL_RECOMMENDATIONS);
    } else {
      recommendations = await ctx.db
        .query("recommendations")
        .withIndex("by_creation")
        .order("desc")
        .take(MAX_ALL_RECOMMENDATIONS);
    }

    // Filter by genre if specified and not "all"
    if (args.genre && args.genre !== "all") {
      recommendations = recommendations.filter((rec) => rec.genre === args.genre);
    }

    return recommendations;
  },
});

/**
 * Create a new recommendation.
 * Requires authentication.
 * Validates inputs and auto-adds user info from Clerk identity.
 */
export const createRecommendation = mutation({
  args: {
    title: v.string(),
    genre: genreValidator,
    link: v.string(),
    blurb: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to create a recommendation");
    }

    await enforceRateLimit(ctx, identity.subject, "createRecommendation", 10, 60_000);

    // Validate inputs
    if (!args.title.trim()) {
      throw new Error("Title cannot be empty");
    }
    if (args.title.length > 200) {
      throw new Error(`Title is too long (${args.title.length}/200 characters)`);
    }
    if (!args.blurb.trim()) {
      throw new Error("Blurb cannot be empty");
    }
    if (args.blurb.length > 1000) {
      throw new Error(`Blurb is too long (${args.blurb.length}/1000 characters)`);
    }
    if (!args.link.trim()) {
      throw new Error("Link cannot be empty");
    }
    if (args.link.length > 2000) {
      throw new Error(`Link is too long (${args.link.length}/2000 characters)`);
    }

    // URL validation — reject dangerous protocols
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(args.link);
    } catch {
      throw new Error("Please provide a valid URL");
    }

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      throw new Error("Only http and https URLs are allowed");
    }

    const recommendationId = await ctx.db.insert("recommendations", {
      title: args.title.trim(),
      genre: args.genre,
      link: args.link.trim(),
      blurb: args.blurb.trim(),
      userId: identity.subject,
      userName: identity.name ?? identity.email ?? "Anonymous",
      userImage: identity.pictureUrl,
      isStaffPick: false,
      createdAt: Date.now(),
    });

    return recommendationId;
  },
});

/**
 * Delete a recommendation.
 * Security: Only the owner OR an admin can delete.
 * Requires authentication.
 */
export const deleteRecommendation = mutation({
  args: { id: v.id("recommendations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to delete a recommendation");
    }

    await enforceRateLimit(ctx, identity.subject, "deleteRecommendation", 10, 60_000);

    const recommendation = await ctx.db.get(args.id);
    if (!recommendation) {
      throw new Error("Recommendation not found");
    }

    // Check if user is the owner
    const isOwner = recommendation.userId === identity.subject;

    // Check if user is admin
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    const isAdmin = user?.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new Error("You don't have permission to delete this recommendation");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

/**
 * Toggle staff pick status on a recommendation.
 * Security: Admin only.
 * Returns the new isStaffPick value.
 */
export const toggleStaffPick = mutation({
  args: { id: v.id("recommendations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to toggle staff pick");
    }

    await enforceRateLimit(ctx, identity.subject, "toggleStaffPick", 20, 60_000);

    // Check if user is admin
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (user?.role !== "admin") {
      throw new Error("Only admins can toggle staff picks");
    }

    const recommendation = await ctx.db.get(args.id);
    if (!recommendation) {
      throw new Error("Recommendation not found");
    }

    const newStaffPickStatus = !recommendation.isStaffPick;
    await ctx.db.patch(args.id, { isStaffPick: newStaffPickStatus });

    return { isStaffPick: newStaffPickStatus };
  },
});
