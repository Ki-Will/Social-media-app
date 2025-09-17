import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

export function Feed() {
  const [cursor, setCursor] = useState<string | null>(null);
  const posts = useQuery(api.posts.getPosts, { 
    paginationOpts: { numItems: 10, cursor } 
  });
  const toggleLike = useMutation(api.posts.toggleLike);

  const handleLike = async (postId: any) => {
    try {
      await toggleLike({ postId });
    } catch (error) {
      toast.error("Failed to like post");
    }
  };

  const loadMore = () => {
    if (posts?.continueCursor) {
      setCursor(posts.continueCursor);
    }
  };

  if (!posts) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-1"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/6"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.page.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onLike={() => handleLike(post._id)}
        />
      ))}
      
      {!posts.isDone && (
        <button
          onClick={loadMore}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Load More
        </button>
      )}
    </div>
  );
}

function PostCard({ post, onLike }: { post: any; onLike: () => void }) {
  const [showComments, setShowComments] = useState(false);
  const comments = useQuery(api.posts.getComments, 
    showComments ? { postId: post._id } : "skip"
  );
  const addComment = useMutation(api.posts.addComment);
  const [commentText, setCommentText] = useState("");

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await addComment({ postId: post._id, content: commentText });
      setCommentText("");
      toast.success("Comment added!");
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Post Header */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {post.author?.profile?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {post.author?.profile?.username || "Unknown User"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatTime(post.createdAt)}
            </p>
          </div>
        </div>

        {/* Post Content */}
        <p className="text-gray-900 dark:text-white mb-3">{post.content}</p>

        {/* Post Media */}
        {post.mediaUrl && (
          <div className="mb-3">
            {post.mediaType === "image" ? (
              <img
                src={post.mediaUrl}
                alt="Post media"
                className="w-full rounded-lg max-h-96 object-cover"
              />
            ) : (
              <video
                src={post.mediaUrl}
                controls
                className="w-full rounded-lg max-h-96"
              />
            )}
          </div>
        )}

        {/* Post Actions */}
        <div className="flex items-center gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onLike}
            className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${
              post.likes?.length > 0
                ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <span>{post.likes?.length > 0 ? "❤️" : "🤍"}</span>
            <span className="text-sm">{post.likes?.length || 0}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-3 py-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span>💬</span>
            <span className="text-sm">{post.commentsCount || 0}</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="p-4">
            {/* Add Comment Form */}
            <form onSubmit={handleComment} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Post
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {comments?.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {comment.author?.profile?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                        {comment.author?.profile?.username || "Unknown User"}
                      </h4>
                      <p className="text-gray-900 dark:text-white">{comment.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatTime(comment.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
