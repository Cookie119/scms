"use client";

import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import { signOut } from "next-auth/react";
import ViewToComplaints from "@/app/components/ViewToComplaints";

// Theme Configuration
const theme = {
  primary: "#0B3C66",      // Deep Blue
  accent: "#F15A29",       // Vibrant Orange
  background: "#F8FAFC",   // Light gray
  textPrimary: "#1E293B",  // Dark slate
};

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.background }}>
        <div className="text-center">
          <div className="relative inline-flex">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent absolute top-0 left-0" style={{ borderTopColor: theme.accent }}></div>
          </div>
          <p className="mt-4 font-medium" style={{ color: theme.textPrimary }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    signIn();
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.background }}>
        <p className="font-medium" style={{ color: theme.textPrimary }}>Redirecting to login...</p>
      </div>
    );
  }

  if (session.user.role !== "user") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.background }}>
        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full" style={{ backgroundColor: `${theme.accent}20` }}>
            <svg className="w-8 h-8" style={{ color: theme.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-xl font-bold" style={{ color: theme.textPrimary }}>Access Denied</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.background }}>
      
      {/* Header - Mobile Optimized */}
      <header 
        className="sticky top-0 z-50 shadow-lg backdrop-blur-md border-b-2"
        style={{ 
          backgroundColor: `${theme.background}f0`,
          borderBottomColor: `${theme.primary}20`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Header Bar */}
          <div className="flex items-center justify-between h-20 sm:h-24">
            
            {/* Logo Section */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <img 
                src="https://z-cdn-media.chatglm.cn/files/192a4fdb-d4cb-46f4-8758-a5e126e6f439.png?auth_key=1869672679-7040aa52e74141bcacba84068b6a23f9-0-21c361a18cc05c193484bd480fbf9c4f" 
                alt="Resolve Logo" 
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 font-bold text-sm transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
                style={{
                  borderColor: theme.primary,
                  color: theme.primary,
                  backgroundColor: "transparent"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.primary;
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = theme.primary;
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
              
              <a 
                href="user/complaint"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
                style={{ backgroundColor: theme.accent }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                <span>New Complaint</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 active:scale-95"
              style={{
                backgroundColor: mobileMenuOpen ? theme.primary : "transparent",
                color: mobileMenuOpen ? "white" : theme.primary,
                border: `2px solid ${theme.primary}`
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-3 border-t" style={{ borderTopColor: `${theme.primary}20` }}>
              <a 
                href="user/complaint"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-bold text-white shadow-md active:scale-95 transition-all duration-200"
                style={{ backgroundColor: theme.accent }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                <span>New Complaint</span>
              </a>
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border-2 font-bold text-sm active:scale-95 transition-all duration-200"
                style={{
                  borderColor: theme.primary,
                  color: theme.primary,
                  backgroundColor: "transparent"
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <ViewToComplaints />
        </div>
      </main>

    </div>
  );
}