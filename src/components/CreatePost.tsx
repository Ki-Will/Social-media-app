import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { CameraIcon } from "./icons/CameraIcon";

export function CreatePost() {
  const [content, setContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const createPost = useMutation(api.posts.createPost);
  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Restrict file size (e.g., 100MB max)
      if (file.size > 100 * 1024 * 1024) {
        toast.error("File is too large (max 100MB)");
        return;
      }
      // If video or audio, check duration
      if (file.type.startsWith("video/") || file.type.startsWith("audio/")) {
        const url = URL.createObjectURL(file);
        const media = document.createElement(file.type.startsWith("video/") ? "video" : "audio");
        media.preload = "metadata";
        media.src = url;
        media.onloadedmetadata = () => {
          if (media.duration > 300) { // 5 minutes = 300 seconds
            toast.error("Media must be 5 minutes or less");
            URL.revokeObjectURL(url);
            return;
          }
          setSelectedFile(file);
          setPreviewUrl(url);
        };
        media.onerror = () => {
          toast.error("Failed to load media file");
          URL.revokeObjectURL(url);
        };
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !selectedFile) return;

    setIsUploading(true);
    try {
      let mediaId = undefined;
      let mediaType = undefined;

      if (selectedFile) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": selectedFile.type },
          body: selectedFile,
        });

        if (!result.ok) {
          throw new Error("Upload failed");
        }

        const { storageId } = await result.json();
        mediaId = storageId;
        mediaType = selectedFile.type.startsWith("image/") ? "image" as const : "video" as const;
      }

      await createPost({
        content: content.trim(),
        mediaId,
        mediaType,
      });

      setContent("");
      removeFile();
      toast.success("Post created!");
    } catch (error) {
      toast.error("Failed to create post");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          rows={3}
        />

        {previewUrl && (
          <div className="mt-3 relative">
            {selectedFile?.type.startsWith("image/") ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-lg"
              />
            ) : selectedFile?.type.startsWith("video/") ? (
              <VideoPreview src={previewUrl} />
            ) : selectedFile?.type.startsWith("audio/") ? (
              <AudioPreview src={previewUrl} />
            ) : null}
            <button
              type="button"
              onClick={removeFile}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2 px-3 py-1 text-primary hover:bg-primary/10 rounded-lg transition-colors">
              <span><CameraIcon className="w-7 h-7" /></span>
              <span className="text-sm">Photo/Video</span>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={(!content.trim() && !selectedFile) || isUploading}
            className="px-6 py-2 bg-primary text-secondary rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function VideoIcon({ className = "" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <rect x="3" y="7" width="13" height="10" rx="2" stroke="currentColor" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 9l5-3v12l-5-3" />
    </svg>
  );
}

function VideoPreview({ src }: { src: string }) {
  const [current, setCurrent] = useState(0);
  return (
    <div>
      <video
        src={src}
        controls
        className="w-full max-h-64 rounded-lg"
        onTimeUpdate={e => setCurrent((e.target as HTMLVideoElement).currentTime)}
      >
        Your browser does not support the video tag.
      </video>
      <div className="text-xs text-gray-500 mt-1">{formatTime(current)}</div>
    </div>
  );
}

function AudioPreview({ src }: { src: string }) {
  const [current, setCurrent] = useState(0);
  return (
    <div>
      <audio
        src={src}
        controls
        className="w-full rounded-lg"
        onTimeUpdate={e => setCurrent((e.target as HTMLAudioElement).currentTime)}
      >
        Your browser does not support the audio tag.
      </audio>
      <div className="text-xs text-gray-500 mt-1">{formatTime(current)}</div>
    </div>
  );
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
