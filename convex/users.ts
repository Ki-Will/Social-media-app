import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get current logged in user (for auth)
export const loggedInUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }
    return user;
  },
});

// Get current user profile
export const getCurrentProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();

    // Get profile picture URL if exists
    let profilePictureUrl = null;
    if (profile?.profilePicture) {
      profilePictureUrl = await ctx.storage.getUrl(profile.profilePicture);
    }

    return {
      ...user,
      profile: profile ? { ...profile, profilePictureUrl } : null,
    };
  },
});

// Create or update user profile
export const updateProfile = mutation({
  args: {
    username: v.string(),
    bio: v.optional(v.string()),
    profilePicture: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, {
        username: args.username,
        bio: args.bio,
        profilePicture: args.profilePicture,
      });
    } else {
      await ctx.db.insert("profiles", {
        userId,
        username: args.username,
        bio: args.bio,
        profilePicture: args.profilePicture,
        isOnline: true,
        lastSeen: Date.now(),
      });
    }
  },
});

// Update online status
export const updateOnlineStatus = mutation({
  args: {
    isOnline: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();

    if (profile) {
      await ctx.db.patch(profile._id, {
        isOnline: args.isOnline,
        lastSeen: Date.now(),
      });
    }
  },
});

// Get user by username
export const getUserByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();

    if (!profile) return null;

    const user = await ctx.db.get(profile.userId);
    return { ...user, profile };
  },
});

// Search users
export const searchUsers = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const profiles = await ctx.db.query("profiles").collect();
    
    const filtered = profiles.filter(profile => 
      profile.username.toLowerCase().includes(args.query.toLowerCase())
    );

    const users = await Promise.all(
      filtered.map(async (profile) => {
        const user = await ctx.db.get(profile.userId);
        return { ...user, profile };
      })
    );

    return users.slice(0, 10); // Limit results
  },
});

// Create profile after user registration
export const createUserProfile = mutation({
  args: {
    username: v.string(),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();

    if (existingProfile) return existingProfile._id;

    const existingUsername = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();

    if (existingUsername) throw new Error("Username already taken");

    return await ctx.db.insert("profiles", {
      userId,
      username: args.username,
      bio: args.bio,
      isOnline: true,
      lastSeen: Date.now(),
    });
  },
});
