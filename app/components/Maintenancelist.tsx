// "use client";

// import { useEffect, useState } from "react";
// import { signOut } from "next-auth/react";
// import { showcomplaints, assignComplaint } from "../actions/complaintAction.action";

// // --- Logout Button Component ---
// function LogoutButton() {
//   return (
//     <button
//       onClick={() => signOut({ callbackUrl: "/" })}
//       className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
//     >
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="18"
//         height="18"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//         <polyline points="16 17 21 12 16 7" />
//         <line x1="21" y1="12" x2="9" y2="12" />
//       </svg>
//       Logout
//     </button>
//   );
// }

// export default function Maintenancelist() {
//   const [listdata, setListdata] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadComplaints();
//   }, []);

//   const loadComplaints = async () => {
//     setLoading(true);
//     const data = await showcomplaints();
//     setListdata(data);
//     setLoading(false);
//   };

//   const handleAssign = async (complaint_id: number) => {
//     const ok = confirm("Are you sure you want to take this complaint?");
//     if (!ok) return;

//     // Optimistic update or just set loading state could be added here
//     await assignComplaint(complaint_id);
//     loadComplaints();
//   };

//   // Helper for priority styling
//   const getPriorityStyles = (priority: string) => {
//     switch (priority) {
//       case "high":
//         return "bg-red-50 text-red-700 border-red-100 ring-1 ring-inset ring-red-600/20";
//       case "medium":
//         return "bg-amber-50 text-amber-700 border-amber-100 ring-1 ring-inset ring-amber-600/20";
//       case "low":
//         return "bg-emerald-50 text-emerald-700 border-emerald-100 ring-1 ring-inset ring-emerald-600/20";
//       default:
//         return "bg-gray-50 text-gray-600 border-gray-200";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
//           <div>
//             <h1 className="text-xl font-bold text-gray-900">Maintenance Board</h1>
//             <p className="text-xs text-gray-500">View and assign pending complaints</p>
//           </div>
//           <LogoutButton />
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
//         {/* Stats/Info Bar */}
//         <div className="mb-8">
//           <p className="text-sm text-gray-500">
//             Open Requests: <span className="font-bold text-gray-900">{listdata.length}</span>
//           </p>
//         </div>

//         {/* Loading State */}
//         {loading ? (
//           <div className="flex justify-center items-center py-20">
//              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
//           </div>
//         ) : (
//           /* Grid Layout */
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {listdata.map((data) => (
//               <div
//                 key={data.complaint_id}
//                 className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full"
//               >
//                 {/* Card Header */}
//                 <div className="flex items-start justify-between mb-4">
//                   <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
//                     {data.title}
//                   </h3>
//                   {/* Assuming priority exists in data, if not, hide this block */}
//                   {data.priority_request && (
//                     <span className={`text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${getPriorityStyles(data.priority_request)}`}>
//                       {data.priority_request}
//                     </span>
//                   )}
//                 </div>

//                 {/* Description (Optional based on your data model) */}
//                 {data.description && (
//                   <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
//                     {data.description}
//                   </p>
//                 )}

//                 {/* Images Section */}
//                 {data.images && data.images.length > 0 && (
//                   <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
//                     {data.images.map((img: string) => (
//                       <div key={img} className="flex-shrink-0 relative">
//                         <img
//                           src={img}
//                           alt="Complaint image"
//                           className="w-20 h-20 object-cover rounded-lg border border-gray-100 bg-gray-50"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {/* Action Section */}
//                 <div className="mt-auto pt-4 border-t border-gray-100">
//                   <button
//                     onClick={() => handleAssign(data.complaint_id)}
//                     className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                       <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
//                       <circle cx="8.5" cy="7" r="4"></circle>
//                       <line x1="20" y1="8" x2="20" y2="14"></line>
//                       <line x1="23" y1="11" x2="17" y2="11"></line>
//                     </svg>
//                     Assign to Me
//                   </button>
//                   <div className="text-center mt-2">
//                     <span className="text-xs text-gray-400 font-medium">ID: #{data.complaint_id}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Empty State */}
//         {!loading && listdata.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
//             <div className="bg-blue-50 p-4 rounded-full mb-4">
//               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
//                 <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
//               </svg>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900">All caught up!</h3>
//             <p className="text-gray-500 max-w-sm mt-1">There are no pending complaints to assign at the moment.</p>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { showcomplaints, assignComplaint } from "../actions/complaintAction.action";

// --- Logout Button Component ---
function LogoutButton() {
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

export default function Maintenancelist() {
  const [listdata, setListdata] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    setLoading(true);
    const data = await showcomplaints();
    setListdata(data);
    setLoading(false);
  };

  const handleAssign = async (complaint_id: number) => {
    const ok = confirm("Are you sure you want to take this complaint?");
    if (!ok) return;

    // Optimistic update or just set loading state could be added here
    await assignComplaint(complaint_id);
    loadComplaints();
  };

  // Helper for priority styling
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

  // Helper for assigned status styling
  const getAssignedStatusStyles = (assigned_to: any) => {
    if (assigned_to) {
      return "bg-purple-50 text-purple-700 border-purple-100 ring-1 ring-inset ring-purple-600/20";
    }
    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Maintenance Board</h1>
            <p className="text-xs text-gray-500">View and assign pending complaints</p>
          </div>
          <LogoutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats/Info Bar */}
        <div className="mb-8">
          <p className="text-sm text-gray-500">
            Open Requests: <span className="font-bold text-gray-900">{listdata.length}</span>
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          /* Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listdata.map((data) => (
              <div
                key={data.complaint_id}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                    {data.title}
                  </h3>
                  <div className="flex flex-col items-end gap-2">
                    {/* Priority Badge */}
                    {data.priority_request && (
                      <span className={`text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${getPriorityStyles(data.priority_request)}`}>
                        {data.priority_request}
                      </span>
                    )}
                    {/* Assigned Status Badge */}
                    <span className={`text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${getAssignedStatusStyles(data.assigned_to)}`}>
                      {data.assigned_to ? "Assigned" : "Unassigned"}
                    </span>
                  </div>
                </div>

                {/* Description (Optional based on your data model) */}
                {data.description && (
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {data.description}
                  </p>
                )}

                {/* Images Section */}
                {data.images && data.images.length > 0 && (
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    {data.images.map((img: string) => (
                      <div key={img} className="flex-shrink-0 relative">
                        <img
                          src={img}
                          alt="Complaint image"
                          className="w-20 h-20 object-cover rounded-lg border border-gray-100 bg-gray-50"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Section */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                  {data.assigned_to === null ? (
                    // Show Assign button only when assigned_to is null
                    <button
                      onClick={() => handleAssign(data.complaint_id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <line x1="20" y1="8" x2="20" y2="14"></line>
                        <line x1="23" y1="11" x2="17" y2="11"></line>
                      </svg>
                      Assign to Me
                    </button>
                  ) : (
                    // Show already assigned message
                    <div className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg cursor-not-allowed">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      Already Assigned
                    </div>
                  )}
                  <div className="text-center mt-2">
                    <span className="text-xs text-gray-400 font-medium">ID: #{data.complaint_id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && listdata.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="bg-blue-50 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">All caught up!</h3>
            <p className="text-gray-500 max-w-sm mt-1">There are no pending complaints to assign at the moment.</p>
          </div>
        )}
      </main>
    </div>
  );
}