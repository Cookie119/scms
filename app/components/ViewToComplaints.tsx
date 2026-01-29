"use client";

import { useState, useEffect } from "react";
import { getUserComplaints } from "@/app/actions/usercomplaintlist";
import { useSession } from "next-auth/react";

type Complaint = {
  complaint_id: number;
  user_id: number;
  category_id: number;
  title: string;
  description: string;
  priority_request: string;
  status_id: number;
  assigned_to: number | null;
  images: string[];
  flat_id: number | null; // Add this
  flat_number: string | null; // Add this
  floor_number: number | null; // Add this
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  is_real_complaint: boolean;
  verification_status: string;
};

// Status mapping based on status_id
const STATUS_MAP = {
  1: { text: "In Progress", color: "bg-blue-50 text-blue-700 border-blue-200" },
  2: { text: "Resolved", color: "bg-green-50 text-green-700 border-green-200" },
  3: { text: "Rejected", color: "bg-red-50 text-red-700 border-red-200" },
  0: { text: "Pending", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
};

// Priority mapping
const PRIORITY_MAP = {
  high: { color: "bg-red-100 text-red-800 border-red-200" },
  medium: { color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  low: { color: "bg-green-100 text-green-800 border-green-200" },
};

export default function UserComplaintsList() {
  const { data: session } = useSession();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "resolved" | "active">("all");

  useEffect(() => {
    if (session?.user?.id) {
      fetchComplaints();
    }
  }, [session]);

  async function fetchComplaints() {
    setLoading(true);
    setError("");
    try {
      const data = await getUserComplaints();
      
      // Transform the data - handle images array format
      const transformedData = data.map((complaint: any) => {
        // Parse images from string to array if needed
        let imagesArray: string[] = [];
        if (complaint.images) {
          if (Array.isArray(complaint.images)) {
            imagesArray = complaint.images;
          } else {
            // Handle PostgreSQL array string format: "{url1,url2}"
            try {
              const imagesStr = complaint.images.toString();
              imagesArray = imagesStr
                .replace(/^{/, "")
                .replace(/}$/, "")
                .split(",")
                .filter((url: string) => url.trim() !== "")
                .map((url: string) => url.trim());
            } catch (err) {
              console.error("Error parsing images:", err);
              imagesArray = [];
            }
          }
        }
        
        return {
          ...complaint,
          images: imagesArray,
          // Add status text based on status_id number
          status_text: STATUS_MAP[complaint.status_id as keyof typeof STATUS_MAP]?.text || "Unknown"
        };
      });
      
      setComplaints(transformedData);
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
      setError("Failed to load complaints. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter complaints based on active tab
  const filteredComplaints = complaints.filter(complaint => {
    if (activeTab === "resolved") {
      return complaint.status_id === 2; // Resolved
    }
    if (activeTab === "active") {
      return complaint.status_id !== 2; // Not resolved
    }
    return true; // All complaints
  });

  // Statistics
  const totalComplaints = complaints.length;
  const resolvedCount = complaints.filter(c => c.status_id === 2).length;
  const activeCount = complaints.filter(c => c.status_id !== 2).length;
  const inProgressCount = complaints.filter(c => c.status_id === 1).length;
  const rejectedCount = complaints.filter(c => c.status_id === 3).length;
  const pendingCount = complaints.filter(c => c.status_id === 0).length;

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading complaints...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 border border-red-200 rounded-xl max-w-md">
          <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchComplaints}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
   <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {/* Header Section - More Visual */}
  <div className="relative overflow-hidden bg-gradient-to-br from-[#0B3C66] via-[#0B3C66] to-[#0e4d85] rounded-2xl p-8 shadow-xl">
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-12 w-1.5 bg-[#F15A29] rounded-full"></div>
        <div>
          <h2 className="text-3xl font-bold text-white">My Complaints</h2>
          <p className="text-blue-100 mt-1">Track your requests in real-time</p>
        </div>
      </div>
      
      {/* Quick Stats - Integrated into header */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="text-blue-100 text-sm font-medium mb-1">Total Requests</div>
          <div className="text-3xl font-bold text-white">{totalComplaints}</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="text-blue-100 text-sm font-medium mb-1">In Progress</div>
          <div className="text-3xl font-bold text-[#F15A29]">{inProgressCount}</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="text-blue-100 text-sm font-medium mb-1">Resolved</div>
          <div className="text-3xl font-bold text-emerald-300">{resolvedCount}</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="text-blue-100 text-sm font-medium mb-1">Success Rate</div>
          <div className="text-3xl font-bold text-white">
            {totalComplaints > 0 ? Math.round((resolvedCount / totalComplaints) * 100) : 0}%
          </div>
        </div>
      </div>
    </div>
    
    {/* Decorative elements */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-[#F15A29]/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl -ml-24 -mb-24"></div>
  </div>

  {/* Tabs - More Prominent */}
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
    <div className="border-b-2 border-gray-100">
      <nav className="flex">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-5 px-6 text-center font-bold text-base transition-all ${
            activeTab === "all"
              ? "bg-gradient-to-b from-[#0B3C66]/5 to-transparent border-b-4 border-[#0B3C66] text-[#0B3C66]"
              : "text-gray-500 hover:text-[#1E293B] hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span>All Requests</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              activeTab === "all" ? "bg-[#0B3C66] text-white" : "bg-gray-200 text-gray-600"
            }`}>
              {totalComplaints}
            </span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("active")}
          className={`flex-1 py-5 px-6 text-center font-bold text-base transition-all ${
            activeTab === "active"
              ? "bg-gradient-to-b from-[#F15A29]/5 to-transparent border-b-4 border-[#F15A29] text-[#F15A29]"
              : "text-gray-500 hover:text-[#1E293B] hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span>Active</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              activeTab === "active" ? "bg-[#F15A29] text-white" : "bg-gray-200 text-gray-600"
            }`}>
              {activeCount}
            </span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("resolved")}
          className={`flex-1 py-5 px-6 text-center font-bold text-base transition-all ${
            activeTab === "resolved"
              ? "bg-gradient-to-b from-emerald-500/5 to-transparent border-b-4 border-emerald-500 text-emerald-700"
              : "text-gray-500 hover:text-[#1E293B] hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span>History</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              activeTab === "resolved" ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-600"
            }`}>
              {resolvedCount}
            </span>
          </div>
        </button>
      </nav>
    </div>

    {/* Complaints Content */}
    <div className="p-8">
      {filteredComplaints.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#0B3C66]/10 to-[#F15A29]/10 mb-6">
            <svg className="w-12 h-12 text-[#0B3C66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-[#1E293B] mb-2">
            {activeTab === "resolved" ? "No Resolved Complaints Yet" : 
             activeTab === "active" ? "All Clear!" : "No Complaints Found"}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {activeTab === "resolved" 
              ? "Once your complaints are resolved, they'll appear here for your records."
              : activeTab === "active"
              ? "Great news! All your complaints have been successfully resolved."
              : "You haven't submitted any complaints yet. When you do, they'll show up here."}
          </p>
          <div className="h-1 w-32 bg-gradient-to-r from-[#0B3C66] via-[#F15A29] to-[#0B3C66] rounded-full mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Success Banner for Resolved Tab */}
          {activeTab === "resolved" && resolvedCount > 0 && (
            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-6">
              <div className="relative z-10 flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-emerald-900 mb-1">Successfully Resolved</h3>
                  <p className="text-emerald-700">
                    These {resolvedCount} complaint{resolvedCount !== 1 ? 's have' : ' has'} been successfully addressed and closed. Thank you for your patience!
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-300/20 rounded-full blur-2xl -mr-16 -mt-16"></div>
            </div>
          )}

          {/* Complaints Grid - Enhanced Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint.complaint_id}
                className="group bg-white rounded-2xl border-2 border-gray-200 shadow-sm hover:shadow-2xl hover:border-[#0B3C66]/30 transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                {/* Top Accent Bar - Dynamic based on status */}
                <div className={`h-2 ${
                  complaint.status_id === 2 
                    ? "bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600" 
                    : complaint.status_id === 3
                    ? "bg-gradient-to-r from-red-400 via-rose-500 to-red-600"
                    : "bg-gradient-to-r from-[#0B3C66] via-[#F15A29] to-[#0B3C66]"
                }`}></div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Header with ID */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-[#1E293B] text-xl flex-1 pr-3 group-hover:text-[#0B3C66] transition-colors line-clamp-2">
                      {complaint.title}
                    </h3>
                    <span className="flex-shrink-0 text-xs font-bold text-white bg-gradient-to-br from-[#0B3C66] to-[#0e4d85] px-3 py-1.5 rounded-full shadow-sm">
                      #{complaint.complaint_id}
                    </span>
                  </div>
                  
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-sm ${
                      PRIORITY_MAP[complaint.priority_request as keyof typeof PRIORITY_MAP]?.color || 
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {complaint.priority_request?.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-sm ${
                      STATUS_MAP[complaint.status_id as keyof typeof STATUS_MAP]?.color || 
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {STATUS_MAP[complaint.status_id as keyof typeof STATUS_MAP]?.text || "Unknown"}
                    </span>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                    {complaint.description}
                  </p>

                  {/* Flat Info */}
                  {complaint.flat_number && (
                    <div className="mb-4 flex items-center gap-2 bg-[#F8FAFC] rounded-xl px-4 py-3 border border-gray-100">
                      <svg className="w-5 h-5 text-[#F15A29] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <div className="text-sm">
                        <span className="text-gray-500 font-medium">Flat:</span>
                        <span className="font-bold text-[#1E293B] ml-2">
                          {complaint.flat_number}
                          {complaint.floor_number && <span className="text-gray-500 font-normal"> • Floor {complaint.floor_number}</span>}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Images Preview */}
                  {complaint.images && complaint.images.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                        Attachments ({complaint.images.length})
                      </p>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {complaint.images.map((imageUrl, index) => (
                          <a
                            key={index}
                            href={imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 group/img"
                          >
                            <div className="relative">
                              <img
                                src={imageUrl}
                                alt={`Complaint ${complaint.complaint_id} - Image ${index + 1}`}
                                className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200 group-hover/img:border-[#F15A29] transition-all group-hover/img:scale-110 shadow-sm"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                                }}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 rounded-xl transition-all pointer-events-none"></div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Spacer */}
                  <div className="flex-grow"></div>

                  {/* Footer Info */}
                  <div className="mt-auto pt-4 border-t-2 border-gray-100 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">Submitted</span>
                      <span className="font-bold text-[#1E293B]">
                        {formatDate(complaint.created_at)}
                      </span>
                    </div>

                    {complaint.assigned_to && (
                      <div className="flex items-center gap-2 bg-[#0B3C66]/5 rounded-lg px-3 py-2">
                        <svg className="w-4 h-4 text-[#0B3C66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-xs font-bold text-[#0B3C66]">
                          Assigned to Staff #{complaint.assigned_to}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
</div>  );
}