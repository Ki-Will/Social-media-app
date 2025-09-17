import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // User profiles extending auth users
  profiles: defineTable({
    userId: v.id("users"),
    username: v.string(),
    bio: v.optional(v.string()),
    profilePicture: v.optional(v.id("_storage")),
    isOnline: v.boolean(),
    lastSeen: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_username", ["username"]),

  // Posts with media support
  posts: defineTable({
    authorId: v.id("users"),
    content: v.string(),
    mediaId: v.optional(v.id("_storage")),
    mediaType: v.optional(v.union(v.literal("image"), v.literal("video"))),
    likes: v.array(v.id("users")),
    createdAt: v.number(),
  })
    .index("by_author", ["authorId"])
    .index("by_created_at", ["createdAt"]),

  // Comments on posts
  comments: defineTable({
    postId: v.id("posts"),
    authorId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_author", ["authorId"]),

  // Groups/Channels
  groups: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    creatorId: v.id("users"),
    members: v.array(v.id("users")),
    isPrivate: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_creator", ["creatorId"])
    .index("by_name", ["name"]),

  // Direct messages between users
  directMessages: defineTable({
    senderId: v.id("users"),
    receiverId: v.id("users"),
    content: v.string(),
    mediaId: v.optional(v.id("_storage")),
    isRead: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_conversation", ["senderId", "receiverId"])
    .index("by_receiver", ["receiverId"])
    .index("by_created_at", ["createdAt"]),

  // Group messages
  groupMessages: defineTable({
    groupId: v.id("groups"),
    senderId: v.id("users"),
    content: v.string(),
    mediaId: v.optional(v.id("_storage")),
    createdAt: v.number(),
  })
    .index("by_group", ["groupId"])
    .index("by_sender", ["senderId"]),

  // Notifications
  notifications: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("like"),
      v.literal("comment"),
      v.literal("message"),
      v.literal("group_invite"),
      v.literal("follow")
    ),
    fromUserId: v.id("users"),
    postId: v.optional(v.id("posts")),
    groupId: v.optional(v.id("groups")),
    isRead: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_read_status", ["userId", "isRead"]),

  // User follows/connections
  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
