import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useIsMobile } from "../hooks/useIsMobile";

export function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  const conversations = useQuery(api.messages.getConversations);
  const searchResults = useQuery(api.users.searchUsers, 
    searchQuery ? { query: searchQuery } : "skip"
  );

  // Show loading state
  if (conversations === undefined) {
    return (
      <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto mb-2"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading messages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* On mobile: show either conversations or chat window */}
      {isMobile ? (
        selectedConversation ? (
          <div className="h-full flex flex-col">
            <button
              className="p-3 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors border-b border-gray-200 dark:border-gray-700"
              onClick={() => setSelectedConversation(null)}
            >
              ←
            </button>
            <div className="flex-1 overflow-hidden">
              <ChatWindow userId={selectedConversation} />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Messages
              </h2>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {searchQuery && searchResults ? (
                <div className="p-2">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
                    Search Results
                  </h3>
                  {searchResults.map((user) => (
                    <button
                      key={user._id}
                      onClick={() => {
                        setSelectedConversation(user._id!);
                        setSearchQuery("");
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-semibold">
                        {user.profile?.username?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {user.profile?.username || "Unknown User"}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-2">
                  {conversations.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">💬</div>
                      <p className="text-gray-500 dark:text-gray-400">No conversations yet</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">Search for users to start messaging</p>
                    </div>
                  ) : (
                    conversations.map((conversation) => (
                      <ConversationItem
                        key={conversation.partnerId}
                        conversation={conversation}
                        isSelected={selectedConversation === conversation.partnerId}
                        onClick={() => setSelectedConversation(conversation.partnerId)}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )
      ) : (
        // On desktop: show both
        <div className="h-full flex">
          <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Messages
              </h2>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {searchQuery && searchResults ? (
                <div className="p-2">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
                    Search Results
                  </h3>
                  {searchResults.map((user) => (
                    <button
                      key={user._id}
                      onClick={() => {
                        setSelectedConversation(user._id!);
                        setSearchQuery("");
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-semibold">
                        {user.profile?.username?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {user.profile?.username || "Unknown User"}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-2">
                  {conversations.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">💬</div>
                      <p className="text-gray-500 dark:text-gray-400">No conversations yet</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">Search for users to start messaging</p>
                    </div>
                  ) : (
                    conversations.map((conversation) => (
                      <ConversationItem
                        key={conversation.partnerId}
                        conversation={conversation}
                        isSelected={selectedConversation === conversation.partnerId}
                        onClick={() => setSelectedConversation(conversation.partnerId)}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedConversation ? (
              <ChatWindow userId={selectedConversation} />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">💬</div>
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ConversationItem({ conversation, isSelected, onClick }: {
  conversation: any;
  isSelected: boolean;
  onClick: () => void;
}) {
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
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
        isSelected
          ? "bg-black/10 dark:bg-white/10"
          : "hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      <div className="relative">
        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-semibold">
          {conversation.partner?.profile?.username?.[0]?.toUpperCase() || "U"}
        </div>
        {conversation.partner?.profile?.isOnline && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
        )}
      </div>
      <div className="flex-1 text-left">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900 dark:text-white">
            {conversation.partner?.profile?.username || "Unknown User"}
          </h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(conversation.createdAt)}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {conversation.content}
        </p>
        {conversation.unreadCount > 0 && (
          <div className="inline-flex items-center justify-center w-5 h-5 bg-black text-white text-xs rounded-full mt-1">
            {conversation.unreadCount}
          </div>
        )}
      </div>
    </button>
  );
}

export default function ChatWindow({ userId }: ChatWindowProps) {
  const { data: messagesData } = api.messages.getDirectMessages.useQuery({ otherUserId: userId });
  const sendMessage = api.messages.sendDirectMessage.useMutation();
  const markAsRead = api.messages.markMessagesAsRead.useMutation();
  const { data: currentUser } = api.users.getCurrentProfile.useQuery();

  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesData]);

  // Auto-resize textarea
  useEffect(() => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    el.style.height = "auto";
    const maxHeight = 160; // ~max-h-40
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, [messageText]);

  // Send message
  const doSend = async () => {
    if (!messageText.trim()) return;
    try {
      await sendMessage.mutateAsync({
        receiverId: userId,
        content: messageText,
      });
      setMessageText("");
      await markAsRead.mutateAsync({ senderId: userId });
    } catch {
      toast.error("Failed to send message");
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    await doSend();
  };

  // Loading state
  if (!messagesData) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-semibold">
              U
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Chat</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        </div>
        {/* Spinner */}
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      </div>
    );
  }

  const messages = messagesData;

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-semibold">
            U
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Chat</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {messages.length} {messages.length === 1 ? "message" : "messages"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageBubble
              key={message._id || message.id}
              message={message}
              isOwn={message.senderId === currentUser?._id}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">No messages yet</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <form onSubmit={handleSend} className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none"
            rows={1}
          />
          <button
            type="submit"
            disabled={!messageText.trim()}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80 dark:bg-white dark:text-black hover:dark:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[60px]"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

function MessageBubble({ message, isOwn }: { message: any; isOwn: boolean }) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwn
            ? "bg-black text-white"
            : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
        }`}
      >
        <p>{message.content}</p>
        {message.mediaUrl && (
          <div className="mt-2">
            <img
              src={message.mediaUrl}
              alt="Message media"
              className="max-w-full rounded"
            />
          </div>
        )}
        <p className={`text-xs mt-1 ${isOwn ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}>
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
