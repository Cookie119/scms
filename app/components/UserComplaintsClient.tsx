"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import {subscribeUser} from "@/app/lib/subscribePush"


 
// --- Components ---

// 1. Logout Button Component
export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      Logout
    </button>
  );
}

// 2. Main Complaints Page Component
export default function UserComplaintsClient({ complaints }: { complaints: any[] }) {
  const { data: session } = useSession();


// useEffect(() => {
//   if (!session?.user?.id) return;

//   fetch("/api/push/subscribe", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       userId: session.user.id,
//     }),
//   });
// }, [session]);



//   useEffect(() => {
//   if (!session?.user?.id) return;

//   subscribeUserToPush(Number(session.user.id));
// }, [session]);


useEffect(() => {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    subscribeUser();
  }
}, []);




  // Helper to determine priority styles
  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-100 ring-1 ring-inset ring-red-600/20";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-100 ring-1 ring-inset ring-amber-600/20";
      case "low":
        return "bg-emerald-50 text-emerald-700 border-emerald-100 ring-1 ring-inset ring-emerald-600/20";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">My Complaints</h1>
            <p className="text-xs text-gray-500">Manage and track your requests</p>
          </div>
          <LogoutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-sm text-gray-500">
            Total Complaints: <span className="font-medium text-gray-900">{complaints.length}</span>
          </p>
          <a
            href="/dashboard/user/complaints/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            New Complaint
          </a>
        </div>

        {/* Empty State */}
        {!complaints || complaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="bg-blue-50 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No complaints found</h3>
            <p className="text-gray-500 max-w-sm mt-1">You haven't submitted any complaints yet. Click the button above to create a new one.</p>
          </div>
        ) : (
          /* Grid Layout for Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.map((c) => (
              <div
                key={c.complaint_id}
                className="group bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {c.title}
                  </h3>
                  <span className={`text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${getPriorityStyles(c.priority_request)}`}>
                    {c.priority_request}
                  </span>
                </div>

                {/* Card Body */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                  {c.description}
                </p>

                {/* Card Footer: Images & ID */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                  
                  {/* Images Grid */}
                  {c.images && c.images.length > 0 && (
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                      {c.images.map((img: string) => (
                        <div key={img} className="flex-shrink-0 relative">
                            <img
                              src={img}
                              alt="Complaint attachment"
                              className="w-20 h-20 object-cover rounded-lg border border-gray-100 bg-gray-50"
                            />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                    <span className="flex items-center gap-1">
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                       User ID: {session?.user?.id}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      #{c.complaint_id}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}