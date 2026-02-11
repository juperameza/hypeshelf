import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  recommendations: defineTable({
    title: v.string(),
    genre: v.union(
      v.literal("horror"),
      v.literal("action"),
      v.literal("comedy"),
      v.literal("drama"),
      v.literal("scifi"),
      v.literal("documentary"),
      v.literal("other")
    ),
    link: v.string(),
    blurb: v.string(),
    userId: v.string(),
    userName: v.string(),
    userImage: v.optional(v.string()),
    isStaffPick: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_genre", ["genre"])
    .index("by_creation", ["createdAt"])
    .index("by_staff_pick", ["isStaffPick"]),

  users: defineTable({
    clerkId: v.string(),
    role: v.union(v.literal("admin"), v.literal("user")),
    email: v.string(),
    name: v.string(),
  }).index("by_clerk_id", ["clerkId"]),

  rateLimits: defineTable({
    userId: v.string(),
    endpoint: v.string(),
    timestamps: v.array(v.number()),
  }).index("by_user_endpoint", ["userId", "endpoint"]),
});
