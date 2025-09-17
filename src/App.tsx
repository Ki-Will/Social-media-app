import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState, useEffect, useRef } from "react";
import { Feed } from "./components/Feed";
import { Messages } from "./components/Messages";
import { Groups } from "./components/Groups";
import { Profile } from "./components/Profile";
import { Notifications } from "./components/Notifications";
import { CreatePost } from "./components/CreatePost";
import { ProfileSetup } from "./components/ProfileSetup";
import { GroupsIcon } from "./components/icons/GroupsIcon";
import { ProfileIcon } from "./components/icons/ProfileIcon";
import { NotificationsIcon } from "./components/icons/NotificationsIcon";

export default function App() {
  const [activeTab, setActiveTab] = useState("feed");
  const prevTab = useRef(activeTab);
  const [slideIn, setSlideIn] = useState(true);

  const currentUser = useQuery(api.users.getCurrentProfile);

  useEffect(() => {
    if (prevTab.current !== activeTab) {
      setSlideIn(false);
      setTimeout(() => setSlideIn(true), 10);
      prevTab.current = activeTab;
    }
  }, [activeTab]);

  return (
    <div className={`min-h-screen dark`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Authenticated>
          {/* Show profile setup if user doesn't have a profile */}
          {currentUser && !currentUser.profile?.username ? (
            <ProfileSetup />
          ) : (
            <div className="flex flex-col h-screen">
              {/* Header */}
              <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between px-4 py-3">
                  <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    Dplted
                  </h1>
                  <div className="flex items-center gap-3">
                  
                    
                    
                    <SignOutButton />
                  </div>
                </div>
              </header>

              {/* Main Content */}
              <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - Hidden on mobile */}
                <nav className="hidden md:flex w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col">
                  <div className="p-4">
                    <NavButton
                      icon={<HomeIcon className="w-6 h-6" />}
                      label="Feed"
                      active={activeTab === "feed"}
                      onClick={() => setActiveTab("feed")}
                    />
                    <NavButton
                      icon={<MessageIcon className="w-6 h-6" />}
                      label="Messages"
                      active={activeTab === "messages"}
                      onClick={() => setActiveTab("messages")}
                    />
                    <NavButton
                      icon={<GroupsIcon className="w-7 h-7 text-blue dark:text-white" />}
                      label="Groups"
                      active={activeTab === "groups"}
                      onClick={() => setActiveTab("groups")}
                    />
                    <NavButton
                      icon={<NotificationsIcon className="w-7 h-7 text-blue dark:text-white" />}
                      label="Notifications"
                      active={activeTab === "notifications"}
                      onClick={() => setActiveTab("notifications")}
                    />
                    <NavButton
                      icon={<ProfileIcon className="w-7 h-7 text-blue dark:text-white" />}
                      label="Profile"
                      active={activeTab === "profile"}
                      onClick={() => setActiveTab("profile")}
                    />
                  </div>
                </nav>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto">
                  <div
                    key={activeTab}
                    className={`max-w-2xl mx-auto p-4 transition-all duration-500 ease-in-out transform
                      ${slideIn ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}
                    `}
                  >
                    {activeTab === "feed" && (
                      <>
                        <CreatePost />
                        <Feed />
                      </>
                    )}
                    {activeTab === "messages" && <Messages />}
                    {activeTab === "groups" && <Groups />}
                    {activeTab === "notifications" && <Notifications />}
                    {activeTab === "profile" && <Profile />}
                  </div>
                </main>
              </div>

              {/* Mobile Bottom Navigation */}
              <nav className="md:hidden  bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-around py-2">
                  <MobileNavButton
                    icon={<HomeIcon className="w-6 h-6" />}
                    active={activeTab === "feed"}
                    onClick={() => setActiveTab("feed")}
                  />
                  <MobileNavButton
                    icon={<MessageIcon className="w-6 h-6" />}
                    active={activeTab === "messages"}
                    onClick={() => setActiveTab("messages")}
                  />
                  <MobileNavButton
                    icon={<GroupsIcon className="w-7 h-7 text-blue dark:text-white" />}
                    active={activeTab === "groups"}
                    onClick={() => setActiveTab("groups")}
                  />
                  <MobileNavButton
                    icon={<NotificationsIcon className="w-7 h-7 text-blue dark:text-white" />}
                    active={activeTab === "notifications"}
                    onClick={() => setActiveTab("notifications")}
                  />
                  <MobileNavButton
                    icon={<ProfileIcon className="w-7 h-7 text-blue dark:text-white" />}
                    active={activeTab === "profile"}
                    onClick={() => setActiveTab("profile")}
                  />
                </div>
              </nav>
            </div>
          )}
        </Authenticated>

        <Unauthenticated>
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  Dplted
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Connect with friends and share your moments
                </p>
              </div>
              <SignInForm />
            </div>
          </div>
        </Unauthenticated>

        <Toaster />
      </div>
    </div>
  );
}

function NavButton({ icon, label, active, onClick }: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-all duration-300 ease-in-out transform
        ${active ? "bg-black/10 dark:bg-white/10 text-black dark:text-white scale-105" : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 scale-100"}
      `}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
      {label === "Notifications" && <NotificationBadge />}
    </button>
  );
}

function MobileNavButton({ icon, active, onClick }: {
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg transition-all duration-300 ease-in-out transform
        ${active ? "bg-black/10 dark:bg-white/10 text-black dark:text-white scale-110" : "text-gray-500 dark:text-gray-400 scale-100"}
      `}
    >
      <span className="text-xl">{icon}</span>
    </button>
  );
}

export function NotificationBadge({ count }: { count?: number }) {
  if (!count || count < 1) return null;

  return (
    <span
      className="
        absolute -top-1 -right-1
        flex items-center justify-center
        w-5 h-5 text-xs font-bold
        bg-red-500 text-white rounded-full
        shadow
        z-10
      "
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}

export function HomeIcon({ className = "" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12L12 4l9 8M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-4 0h4" />
    </svg>
  );
}

export function MessageIcon({ className = "" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

export function BellIcon({ className = "" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

export function UserIcon({ className = "" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

export function SunIcon({ className = "" }) {
  return (
    <svg className={className} fill="none" stroke="black" strokeWidth={2.5} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5" stroke="currentColor" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95l-1.414-1.414M6.464 6.464L5.05 5.05m13.9 0l-1.414 1.414M6.464 17.536l-1.414 1.414" />
    </svg>
  );
}

export function MoonIcon({ className = "" }) {
  return (
    <svg className={className} fill="none" stroke="white" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
    </svg>
  );
}