"use client";

import { useSession, signIn } from "next-auth/react";
import CategoryManagement from "@/app/components/CategoryManagement";
import ComplaintList from "@/app/components/ComplaintList";
import LogoutButton from "@/app/components/LogoutButton";
import ComplaintForm from "@/app/components/ComplaintForm";
import UserComplaintsClient from "@/app/components/UserComplaintsClient";
import ViewToComplaints from "@/app/components/ViewToComplaints";

// Theme Configuration
const theme = {
  primary: "#0B3C66",      // Deep Blue
  accent: "#F15A29",       // Vibrant Orange
  background: "#F8FAFC",   // Light gray
  textPrimary: "#1E293B",  // Dark slate
};

export default function userDashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    signIn();
    return <p>Redirecting to login...</p>;
  }

  if (session.user.role !== "user") {
    return <p>Access Denied</p>;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.background }}>
      
      {/* Header - Styled with Primary Deep Blue */}
      <header 
        className="sticky top-0 z-10 shadow-sm transition-all"
        style={{ backgroundColor: theme.background }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Title Group */}
          <div className="flex items-center gap-3">
             <img 
              src="https://z-cdn-media.chatglm.cn/files/192a4fdb-d4cb-46f4-8758-a5e126e6f439.png?auth_key=1869672679-7040aa52e74141bcacba84068b6a23f9-0-21c361a18cc05c193484bd480fbf9c4f" 
              alt="Resolve Logo" 
              className="h-10 w-auto object-contain"
            />
 
          </div>

          {/* Action Buttons Group */}
          <div className="flex items-center gap-4">
            <LogoutButton />
            
            {/* New Complaint Button styled with Accent Orange */}
            <a 
              href="user/complaint"
              className="px-4 py-2 rounded-lg text-sm font-bold text-white shadow-md hover:shadow-lg hover:opacity-90 transition-all"
              style={{ backgroundColor: theme.accent }}
            >
              + New Complaint
            </a>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
           <ViewToComplaints />
        </div>
      </main>

    </div>
  );
}