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
import MaintState from './MaintState'
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

    const styles = {
    high: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md",
    urgent: "bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg animate-pulse",
    medium: "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md",
    low: "bg-gradient-to-r from-[#0B3C66] to-blue-600 text-white shadow-sm",
    normal: "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-sm"
  };

  return (
    <div className="min-h-screen bg-gray-50">
  
<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  
  {/* Stats/Info Bar */}
  <div className="mb-8 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="h-10 w-1 bg-[#F15A29] rounded-full"></div>
      <div>
        <p className="text-sm text-gray-500">Verified Open Requests</p>
        <p className="text-2xl font-bold text-[#0B3C66]">
          {listdata.filter(data => data.verification_status === 1 && data.status_id === 1).length}
        </p>
      </div>
    </div>

        {/* User Stats Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Work Summary</h2>
          <MaintState></MaintState>
        </div>
    
    {/* Optional filters or actions */}
    {/* <div className="flex gap-2">
      <button className="px-4 py-2 text-sm font-medium text-[#0B3C66] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        Filter
      </button>
    </div> */}
  </div>

  {/* Loading State */}
  {loading ? (
    <div className="flex justify-center items-center py-20">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#F15A29] border-t-transparent absolute top-0 left-0"></div>
      </div>
    </div>
  ) : (
    /* Grid Layout - Only show verified complaints (verification_status = 1) */
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listdata
        .filter(data => data.verification_status === 1 && data.status_id === 1)
        .map((data) => (
        <div
          key={data.complaint_id}
          className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#0B3C66]/20 transition-all duration-300 flex flex-col h-full group"
        >
          {/* Card Header with Accent and Verification Badge */}
          <div className="relative p-6 pb-4">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0B3C66] via-[#F15A29] to-[#0B3C66]"></div>
            
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    VERIFIED
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[#1E293B] line-clamp-2 group-hover:text-[#0B3C66] transition-colors">
                  {data.title}
                </h3>
              </div>
              
              {/* Badge Stack */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                {/* Priority Badge */}
                {data.priority_request && (
                  <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${getPriorityStyles(data.priority_request)}`}>
                    {data.priority_request}
                  </span>
                )}
                {/* Assigned Status Badge */}
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${getAssignedStatusStyles(data.assigned_to)}`}>
                  {data.assigned_to ? "Assigned" : "Open"}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {data.description && (
            <div className="px-6 pb-4">
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                {data.description}
              </p>
            </div>
          )}

          {/* Flat Info Display */}
          {data.flat_number && (
            <div className="px-6 pb-4">
              <div className="flex items-center gap-2 text-sm bg-[#F8FAFC] rounded-lg px-3 py-2 border border-gray-100">
                <svg className="w-4 h-4 text-[#F15A29]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-gray-500 font-medium">Flat:</span>
                <span className="font-bold text-[#1E293B]">
                  {data.flat_number}
                  {data.floor_number && <span className="text-gray-500 font-normal"> • Floor {data.floor_number}</span>}
                </span>
              </div>
            </div>
          )}

          {/* Images Preview */}
          {data.images && data.images.length > 0 && (
            <div className="px-6 pb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Attachments ({data.images.length})
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {data.images.map((imageUrl: string, index: number) => (
                  <div key={index} className="flex-shrink-0">
                    <a
                      href={imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative group/image"
                    >
                      <img
                        src={imageUrl}
                        alt={`Complaint ${data.complaint_id} - Image ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 group-hover/image:border-[#F15A29] transition-all group-hover/image:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 rounded-lg transition-all"></div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spacer to push action to bottom */}
          <div className="flex-grow"></div>

          {/* Action Section */}
          <div className="p-6 pt-4 border-t border-gray-100 bg-gradient-to-b from-transparent to-gray-50/50">
            {data.assigned_to === null ? (
              // Assign button
              <button
                onClick={() => handleAssign(data.complaint_id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#0B3C66] to-[#0B3C66]/90 text-white text-sm font-bold rounded-xl hover:from-[#F15A29] hover:to-[#F15A29]/90 focus:outline-none focus:ring-2 focus:ring-[#F15A29] focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                Assign to Me
              </button>
            ) : (
              // Already assigned state
              <div className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 text-emerald-700 text-sm font-bold rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Already Assigned
              </div>
            )}
            
            {/* ID Display */}
            <div className="text-center mt-3">
              <span className="text-xs text-gray-400 font-semibold tracking-wider">
                ID: <span className="text-[#0B3C66]">#{data.complaint_id}</span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}

  {/* Empty State - Only show if no verified complaints */}
  {!loading && listdata.filter(data => data.verification_status === 1).length === 0 && (
    <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200 shadow-sm">
      <div className="bg-gradient-to-br from-[#0B3C66]/10 to-[#F15A29]/10 p-6 rounded-full mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0B3C66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      </div>
      <h3 className="text-xl font-bold text-[#1E293B] mb-2">No Verified Complaints</h3>
      <p className="text-gray-500 max-w-sm">
        {listdata.length > 0 
          ? `There are ${listdata.length} unverified complaints pending verification.` 
          : "There are no complaints to display at the moment."}
      </p>
      {listdata.length > 0 && listdata.filter(data => data.verification_status !== 1).length > 0 && (
        <div className="mt-4 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm">
          <span className="font-medium">{listdata.filter(data => data.verification_status !== 1).length} complaint(s) awaiting verification</span>
        </div>
      )}
      <div className="mt-6 h-1 w-24 bg-gradient-to-r from-[#0B3C66] via-[#F15A29] to-[#0B3C66] rounded-full"></div>
    </div>
  )}
</main>    </div>
  );
}