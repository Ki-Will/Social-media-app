import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Create a new group
export const createGroup = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    isPrivate: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("groups", {
      name: args.name,
      description: args.description,
      creatorId: userId,
      members: [userId],
      isPrivate: args.isPrivate,
      createdAt: Date.now(),
    });
  },
});

// Get user's groups
export const getUserGroups = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const allGroups = await ctx.db.query("groups").collect();
    const groups = allGroups.filter(group => group.members.includes(userId));

    return await Promise.all(
      groups.map(async (group) => {
        const creator = await ctx.db.get(group.creatorId);
        const creatorProfile = await ctx.db
          .query("profiles")
          .withIndex("by_user_id", (q) => q.eq("userId", group.creatorId))
          .unique();

        // Get latest message
        const latestMessage = await ctx.db
          .query("groupMessages")
          .withIndex("by_group", (q) => q.eq("groupId", group._id))
          .order("desc")
          .first();

        return {
          ...group,
          creator: { ...creator, profile: creatorProfile },
          latestMessage,
          memberCount: group.members.length,
        };
      })
    );
  },
});

// Join a group
export const joinGroup = mutation({
  args: { groupId: v.id("groups") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const group = await ctx.db.get(args.groupId);
    if (!group) throw new Error("Group not found");

    if (group.members.includes(userId)) {
      throw new Error("Already a member");
    }

    await ctx.db.patch(args.groupId, {
      members: [...group.members, userId],
    });
  },
});

// Send group message
export const sendGroupMessage = mutation({
  args: {
    groupId: v.id("groups"),
    content: v.string(),
    mediaId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const group = await ctx.db.get(args.groupId);
    if (!group || !group.members.includes(userId)) {
      throw new Error("Not a member of this group");
    }

    return await ctx.db.insert("groupMessages", {
      groupId: args.groupId,
      senderId: userId,
      content: args.content,
      mediaId: args.mediaId,
      createdAt: Date.now(),
    });
  },
});

// Get group messages
export const getGroupMessages = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const group = await ctx.db.get(args.groupId);
    if (!group || !group.members.includes(userId)) {
      throw new Error("Not a member of this group");
    }

    const messages = await ctx.db
      .query("groupMessages")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .order("asc")
      .collect();

    return await Promise.all(
      messages.map(async (message) => {
        const sender = await ctx.db.get(message.senderId);
        const senderProfile = await ctx.db
          .query("profiles")
          .withIndex("by_user_id", (q) => q.eq("userId", message.senderId))
          .unique();

        const mediaUrl = message.mediaId ? await ctx.storage.getUrl(message.mediaId) : null;

        return {
          ...message,
          sender: { ...sender, profile: senderProfile },
          mediaUrl,
        };
      })
    );
  },
});

// Search public groups
export const searchGroups = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const groups = await ctx.db
      .query("groups")
      .collect();
    
    const publicGroups = groups.filter(group => !group.isPrivate);

    const filtered = publicGroups.filter(group =>
      group.name.toLowerCase().includes(args.query.toLowerCase())
    );

    return await Promise.all(
      filtered.slice(0, 10).map(async (group) => {
        const creator = await ctx.db.get(group.creatorId);
        const creatorProfile = await ctx.db
          .query("profiles")
          .withIndex("by_user_id", (q) => q.eq("userId", group.creatorId))
          .unique();

        return {
          ...group,
          creator: { ...creator, profile: creatorProfile },
          memberCount: group.members.length,
        };
      })
    );
  },
});
