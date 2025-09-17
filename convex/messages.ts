import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Send direct message
export const sendDirectMessage = mutation({
  args: {
    receiverId: v.id("users"),
    content: v.string(),
    mediaId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const messageId = await ctx.db.insert("directMessages", {
      senderId: userId,
      receiverId: args.receiverId,
      content: args.content,
      mediaId: args.mediaId,
      isRead: false,
      createdAt: Date.now(),
    });

    // Create notification
    await ctx.db.insert("notifications", {
      userId: args.receiverId,
      type: "message",
      fromUserId: userId,
      isRead: false,
      createdAt: Date.now(),
    });

    return messageId;
  },
});

// Get direct messages between two users
export const getDirectMessages = query({
  args: { otherUserId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const messages = await ctx.db
      .query("directMessages")
      .filter((q) =>
        q.or(
          q.and(q.eq(q.field("senderId"), userId), q.eq(q.field("receiverId"), args.otherUserId)),
          q.and(q.eq(q.field("senderId"), args.otherUserId), q.eq(q.field("receiverId"), userId))
        )
      )
      .order("asc")
      .collect();

    return await Promise.all(
      messages.map(async (message) => {
        const mediaUrl = message.mediaId ? await ctx.storage.getUrl(message.mediaId) : null;
        return { ...message, mediaUrl };
      })
    );
  },
});

// Mark messages as read
export const markMessagesAsRead = mutation({
  args: { senderId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const messages = await ctx.db
      .query("directMessages")
      .withIndex("by_conversation", (q) => q.eq("senderId", args.senderId).eq("receiverId", userId))
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();

    await Promise.all(
      messages.map((message) =>
        ctx.db.patch(message._id, { isRead: true })
      )
    );
  },
});

// Get conversations list
export const getConversations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const messages = await ctx.db
      .query("directMessages")
      .filter((q) =>
        q.or(
          q.eq(q.field("senderId"), userId),
          q.eq(q.field("receiverId"), userId)
        )
      )
      .collect();

    // Group by conversation partner
    const conversationMap = new Map();
    
    messages.forEach((message) => {
      const partnerId = message.senderId === userId ? message.receiverId : message.senderId;
      const existing = conversationMap.get(partnerId);
      
      if (!existing || message.createdAt > existing.createdAt) {
        conversationMap.set(partnerId, {
          ...message,
          partnerId,
          unreadCount: 0,
        });
      }
    });

    // Get unread counts
    for (const [partnerId, conversation] of conversationMap) {
      const unreadMessages = await ctx.db
        .query("directMessages")
        .withIndex("by_conversation", (q) => q.eq("senderId", partnerId).eq("receiverId", userId))
        .filter((q) => q.eq(q.field("isRead"), false))
        .collect();
      
      conversation.unreadCount = unreadMessages.length;
    }

    // Get partner details
    const conversations = await Promise.all(
      Array.from(conversationMap.values()).map(async (conversation) => {
        const partner = await ctx.db.get(conversation.partnerId);
        const partnerProfile = await ctx.db
          .query("profiles")
          .withIndex("by_user_id", (q) => q.eq("userId", conversation.partnerId))
          .unique();

        return {
          ...conversation,
          partner: { ...partner, profile: partnerProfile },
        };
      })
    );

    return conversations.sort((a, b) => b.createdAt - a.createdAt);
  },
});
