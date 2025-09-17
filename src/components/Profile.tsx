import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { CameraIcon } from "./icons/CameraIcon";
import { ProfileIcon } from "./icons/ProfileIcon";
import { useIsMobile } from "../hooks/useIsMobile";

export function Profile() {
  const currentUser = useQuery(api.users.getCurrentProfile);
  const updateProfile = useMutation(api.users.updateProfile);
  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const isMobile = useIsMobile();

  // Initialize form when user data loads
  useEffect(() => {
    if (currentUser?.profile) {
      setUsername(currentUser.profile.username || "");
      setBio(currentUser.profile.bio || "");
    }
  }, [currentUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }

    try {
      await updateProfile({
        username: username.trim(),
        bio: bio.trim() || undefined,
        profilePicture: currentUser?.profile?.profilePicture,
      });
      setIsEditing(false);
      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setIsUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await result.json();
      
      await updateProfile({
        username: currentUser?.profile?.username || "User",
        bio: currentUser?.profile?.bio,
        profilePicture: storageId,
      });

      toast.success("Profile picture updated!");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  // Add a handler for removing the profile picture
  const handleRemoveImage = async () => {
    try {
      await updateProfile({
        username: currentUser?.profile?.username || "User",
        bio: currentUser?.profile?.bio,
        profilePicture: undefined,
      });
      toast.success("Profile picture removed!");
      setShowImageModal(false);
    } catch (error) {
      toast.error("Failed to remove image");
    }
  };

  // Improved handler for capturing an image (mobile only)
  const handleCaptureImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("accept", "image/*");
      fileInputRef.current.setAttribute("capture", "user");
      fileInputRef.current.click();
    }
    setShowImageModal(false);
  };

  // Improved handler for uploading an image (all devices)
  const handleUploadImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("accept", "image/*");
      fileInputRef.current.removeAttribute("capture");
      fileInputRef.current.click();
    }
    setShowImageModal(false);
  };

  // We'll implement profile picture URL fetching later

  if (!currentUser) {
    return (
      <div className="animate-pulse">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modal for image actions */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-11/12 max-w-xs mx-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black dark:hover:text-white"
              onClick={() => setShowImageModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="flex flex-col gap-4 items-center">
              {/* Only show capture on mobile */}
              {isMobile && (
                <button
                  onClick={handleCaptureImage}
                  className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black justify-center hover:bg-black/80 hover:dark:bg-white/80 transition-colors"
                >
                  <CameraIcon className="w-5 h-5" /> Capture Image
                </button>
              )}
              {/* Visible file input for upload */}
              <label className="w-full flex flex-col items-center gap-2 px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black justify-center hover:bg-black/80 hover:dark:bg-white/80 transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 8l-4-4m4 4l4-4M4 20h16" /></svg>
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleRemoveImage}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white justify-center hover:bg-gray-300 hover:dark:bg-gray-600 transition-colors"
              >
                <ProfileIcon className="w-5 h-5" /> Remove Image
              </button>
              <button
                onClick={() => setShowImageModal(false)}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white justify-center hover:bg-gray-200 hover:dark:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Profile
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                  {currentUser.profile?.profilePictureUrl ? (
                    <img
                      src={currentUser.profile.profilePictureUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ProfileIcon className="w-10 h-10" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowImageModal(true)}
                  disabled={isUploading}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue text-white   rounded-full flex items-center justify-center hover:bg-black/80 hover:dark:bg-white/80 transition-colors disabled:opacity-50"
                >
                  {isUploading ? "..." : <CameraIcon />}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80 dark:bg-white dark:text-black hover:dark:bg-white/80 transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setUsername(currentUser.profile?.username || "");
                  setBio(currentUser.profile?.bio || "");
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                {currentUser.profile?.profilePictureUrl ? (
                  <img
                    src={currentUser.profile.profilePictureUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ProfileIcon className="w-10 h-10" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {currentUser.profile?.username || "Set your username"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {currentUser.email}
                </p>
                {currentUser.profile?.isOnline && (
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 dark:text-green-400">
                      Online
                    </span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowImageModal(true)}
                className="ml-2 w-8 h-8 bg-black text-white dark:bg-white dark:text-black rounded-full flex items-center justify-center hover:bg-black/80 hover:dark:bg-white/80 transition-colors"
              >
                <CameraIcon />
              </button>
            </div>

            {currentUser.profile?.bio && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  About
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentUser.profile.bio}
                </p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  0
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Posts
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  0
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Followers
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  0
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Following
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User's Posts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Your Posts
        </h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📝</div>
          <p className="text-gray-500 dark:text-gray-400">
            Your posts will appear here
          </p>
        </div>
      </div>
    </div>
  );
}
