"use client";

import { useEffect, useState } from "react";

let deferredPrompt: any = null;

// Theme Configuration
const theme = {
  primary: "#0B3C66",      // Deep Blue
  accent: "#F15A29",       // Vibrant Orange
  background: "#F8FAFC",   // Light gray
  textPrimary: "#1E293B",  // Dark slate
};

export default function InstallPWA() {
  const [showInstall, setShowInstall] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      deferredPrompt = e;
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("PWA installed");
    } else {
      console.log("PWA install dismissed");
    }

    deferredPrompt = null;
    setShowInstall(false);
    setIsInstalling(false);
  };

  const dismissPrompt = () => {
    setShowInstall(false);
  };

  if (!showInstall) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998] animate-fadeIn"
        onClick={dismissPrompt}
      />

      {/* Installation Card */}
      <div
        className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-auto md:right-6 md:max-w-md z-[9999] animate-slideUp md:animate-slideIn"
        style={{
          background: "white",
          borderRadius: "24px 24px 0 0",
          boxShadow: "0 -10px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
        }}
      >
        {/* Decorative top bar (mobile drag indicator) */}
        <div className="md:hidden flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header with gradient accent */}
        <div
          className="relative overflow-hidden px-6 pt-6 pb-4 rounded-t-3xl"
          style={{
            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primary}dd 100%)`
          }}
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 opacity-20 rounded-full blur-xl -ml-12 -mb-12" style={{ backgroundColor: theme.accent }}></div>
          
          <div className="relative z-10 flex items-start gap-4">
            {/* App Icon */}
            <div className="flex-shrink-0 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center p-2">
              <img 
                src="https://z-cdn-media.chatglm.cn/files/192a4fdb-d4cb-46f4-8758-a5e126e6f439.png?auth_key=1869672679-7040aa52e74141bcacba84068b6a23f9-0-21c361a18cc05c193484bd480fbf9c4f" 
                alt="Resolve" 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Title & Description */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">
                Install Resolve App
              </h3>
              <p className="text-blue-100 text-sm">
                Quick access from your home screen
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={dismissPrompt}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all active:scale-95"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {/* Features List */}
          <div className="space-y-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${theme.accent}15` }}>
                <svg className="w-5 h-5" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: theme.textPrimary }}>Instant Access</p>
                <p className="text-xs text-gray-500">Launch directly from home screen</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${theme.primary}15` }}>
                <svg className="w-5 h-5" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: theme.textPrimary }}>Works Offline</p>
                <p className="text-xs text-gray-500">Access key features without internet</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-50">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: theme.textPrimary }}>Push Notifications</p>
                <p className="text-xs text-gray-500">Stay updated on complaint status</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={dismissPrompt}
              className="flex-1 px-4 py-3 rounded-xl font-bold text-sm border-2 transition-all active:scale-95"
              style={{
                borderColor: `${theme.primary}30`,
                color: theme.textPrimary,
                backgroundColor: "transparent"
              }}
            >
              Not Now
            </button>
            
            <button
              onClick={installApp}
              disabled={isInstalling}
              className="flex-1 px-4 py-3 rounded-xl font-bold text-sm text-white shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent}dd 100%)`
              }}
            >
              {isInstalling ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Installing...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Install App</span>
                </>
              )}
            </button>
          </div>

          {/* Small print */}
          <p className="text-xs text-gray-400 text-center mt-4">
            No app store needed • Takes only a few seconds
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-slideIn {
          animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
}