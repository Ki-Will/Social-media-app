import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";

// Create a new post
export const createPost = mutation({
  args: {
    content: v.string(),
    mediaId: v.optional(v.id("_storage")),
    mediaType: v.optional(v.union(v.literal("image"), v.literal("video"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("posts", {
      authorId: userId,
      content: args.content,
      mediaId: args.mediaId,
      mediaType: args.mediaType,
      likes: [],
      createdAt: Date.now(),
    });
  },
});

// Get posts with pagination
export const getPosts = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_created_at")
      .order("desc")
      .paginate(args.paginationOpts);

    const postsWithDetails = await Promise.all(
      posts.page.map(async (post) => {
        const author = await ctx.db.get(post.authorId);
        const authorProfile = await ctx.db
          .query("profiles")
          .withIndex("by_user_id", (q) => q.eq("userId", post.authorId))
          .unique();

        const comments = await ctx.db
          .query("comments")
          .withIndex("by_post", (q) => q.eq("postId", post._id))
          .collect();

        const mediaUrl = post.mediaId ? await ctx.storage.getUrl(post.mediaId) : null;

        return {
          ...post,
          author: { ...author, profile: authorProfile },
          commentsCount: comments.length,
          mediaUrl,
        };
      })
    );

    return {
      ...posts,
      page: postsWithDetails,
    };
  },
});

// Like/unlike a post
export const toggleLike = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    const isLiked = post.likes.includes(userId);
    const newLikes = isLiked
      ? post.likes.filter(id => id !== userId)
      : [...post.likes, userId];

    await ctx.db.patch(args.postId, { likes: newLikes });

    // Create notification if liking
    if (!isLiked && post.authorId !== userId) {
      await ctx.db.insert("notifications", {
        userId: post.authorId,
        type: "like",
        fromUserId: userId,
        postId: args.postId,
        isRead: false,
        createdAt: Date.now(),
      });
    }
  },
});

// Add comment to post
export const addComment = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    const commentId = await ctx.db.insert("comments", {
      postId: args.postId,
      authorId: userId,
      content: args.content,
      createdAt: Date.now(),
    });

    // Create notification
    if (post.authorId !== userId) {
      await ctx.db.insert("notifications", {
        userId: post.authorId,
        type: "comment",
        fromUserId: userId,
        postId: args.postId,
        isRead: false,
        createdAt: Date.now(),
      });
    }

    return commentId;
  },
});

// Get comments for a post
export const getComments = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .order("asc")
      .collect();

    return await Promise.all(
      comments.map(async (comment) => {
        const author = await ctx.db.get(comment.authorId);
        const authorProfile = await ctx.db
          .query("profiles")
          .withIndex("by_user_id", (q) => q.eq("userId", comment.authorId))
          .unique();

        return {
          ...comment,
          author: { ...author, profile: authorProfile },
        };
      })
    );
  },
});

// Generate upload URL for media
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    return await ctx.storage.generateUploadUrl();
  },
});
