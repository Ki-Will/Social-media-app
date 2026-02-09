import { useQuery, useMutation } from "convex/react";
import { NotificationBadge } from "../App"
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function Notifications() {
  const notifications = useQuery(api.notifications.getNotifications);
  const markAsRead = useMutation(api.notifications.markNotificationAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);
  const unreadCount = notifications ? notifications.filter(n => !n.isRead).length : 0;

  const handleMarkAsRead = async (notificationId: any) => {
    try {
      await markAsRead({ notificationId });
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all notifications as read");
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
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getNotificationText = (notification: any) => {
    const username = notification.fromUser?.profile?.username || "Someone";
    
    switch (notification.type) {
      case "like":
        return `${username} liked your post`;
      case "comment":
        return `${username} commented on your post`;
      case "message":
        return `${username} sent you a message`;
      case "group_invite":
        return `${username} invited you to join ${notification.group?.name}`;
      case "follow":
        return `${username} started following you`;
      default:
        return "New notification";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return "❤️";
      case "comment":
        return "💬";
      case "message":
        return "📩";
      case "group_invite":
        return "👥";
      case "follow":
        return "👤";
      default:
        return "🔔";
    }
  };

  if (!notifications) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Notifications <NotificationBadge />
        </h2>
        {/* {unreadCount > 0 && (
    <span className="relative inline-block" style={{ minWidth: 20 }}>
      <NotificationBadge count={unreadCount} />
    </span>
  )} */}
        {notifications.some(n => !n.isRead) && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-primary hover:text-primary-hover"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔔</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No notifications yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            When you get notifications, they'll show up here
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                !notification.isRead ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {notification.fromUser?.profile?.username?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white">
                        {getNotificationText(notification)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
