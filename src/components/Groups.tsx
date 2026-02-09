import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

export function Groups() {
  const [activeView, setActiveView] = useState<"my-groups" | "discover">("my-groups");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const userGroups = useQuery(api.groups.getUserGroups);
  const [searchQuery, setSearchQuery] = useState("");
  const searchResults = useQuery(api.groups.searchGroups, 
    searchQuery ? { query: searchQuery } : "skip"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Groups
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
        >
          Create Group
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => setActiveView("my-groups")}
          className={`flex-1 px-4 py-2 rounded-md transition-colors ${
            activeView === "my-groups"
              ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          My Groups
        </button>
        <button
          onClick={() => setActiveView("discover")}
          className={`flex-1 px-4 py-2 rounded-md transition-colors ${
            activeView === "discover"
              ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Discover
        </button>
      </div>

      {/* Content */}
      {activeView === "my-groups" ? (
        <MyGroups 
          groups={userGroups} 
          onSelectGroup={setSelectedGroup}
          selectedGroup={selectedGroup}
        />
      ) : (
        <DiscoverGroups 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
        />
      )}

      {/* Create Group Modal */}
      {showCreateForm && (
        <CreateGroupModal onClose={() => setShowCreateForm(false)} />
      )}
    </div>
  );
}

function MyGroups({ groups, onSelectGroup, selectedGroup }: {
  groups: any[] | undefined;
  onSelectGroup: (groupId: string) => void;
  selectedGroup: string | null;
}) {
  if (!groups) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">👥</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No groups yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {groups.map((group) => (
        <div
          key={group._id}
          className={`bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
            selectedGroup === group._id ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => onSelectGroup(group._id)}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
              {group.name[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {group.name}
                </h3>
                {group.isPrivate && (
                  <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                    Private
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {group.description || "No description"}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span>{group.memberCount} members</span>
                <span>Created by {group.creator?.profile?.username}</span>
              </div>
            </div>
          </div>
          {group.latestMessage && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                Latest: {group.latestMessage.content}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function DiscoverGroups({ searchQuery, setSearchQuery, searchResults }: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: any[] | undefined;
}) {
  const joinGroup = useMutation(api.groups.joinGroup);

  const handleJoinGroup = async (groupId: any) => {
    try {
      await joinGroup({ groupId });
      toast.success("Joined group!");
    } catch (error) {
      toast.error("Failed to join group");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search public groups..."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {searchQuery && searchResults ? (
        <div className="space-y-4">
          {searchResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No groups found matching "{searchQuery}"
              </p>
            </div>
          ) : (
            searchResults.map((group) => (
              <div
                key={group._id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {group.name[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {group.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {group.description || "No description"}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>{group.memberCount} members</span>
                        <span>Created by {group.creator?.profile?.username}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleJoinGroup(group._id)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                  >
                    Join
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Discover Groups
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Search for public groups to join
          </p>
        </div>
      )}
    </div>
  );
}

function CreateGroupModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const createGroup = useMutation(api.groups.createGroup);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsCreating(true);
    try {
      await createGroup({
        name: name.trim(),
        description: description.trim() || undefined,
        isPrivate,
      });
      toast.success("Group created!");
      onClose();
    } catch (error) {
      toast.error("Failed to create group");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Create New Group
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Group Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter group name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="What's this group about?"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPrivate"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="isPrivate" className="text-sm text-gray-700 dark:text-gray-300">
              Make this group private
            </label>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={!name.trim() || isCreating}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? "Creating..." : "Create Group"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
