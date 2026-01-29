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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Complaints</h2>
          <p className="text-gray-600">Track and manage your submitted complaints</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">Total</div>
          <div className="text-xl font-bold text-gray-800">{totalComplaints}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">Pending</div>
          <div className="text-xl font-bold text-yellow-600">{pendingCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">In Progress</div>
          <div className="text-xl font-bold text-blue-600">{inProgressCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">Resolved</div>
          <div className="text-xl font-bold text-green-600">{resolvedCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">Rejected</div>
          <div className="text-xl font-bold text-red-600">{rejectedCount}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 py-4 px-6 text-center font-medium text-sm ${
                activeTab === "all"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All Complaints ({totalComplaints})
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`flex-1 py-4 px-6 text-center font-medium text-sm ${
                activeTab === "active"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setActiveTab("resolved")}
              className={`flex-1 py-4 px-6 text-center font-medium text-sm ${
                activeTab === "resolved"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              History ({resolvedCount})
            </button>
          </nav>
        </div>

        {/* Complaints List */}
        <div className="p-6">
          {filteredComplaints.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {activeTab === "resolved" ? "No Resolved Complaints" : 
                 activeTab === "active" ? "No Active Complaints" : "No Complaints Found"}
              </h3>
              <p className="text-gray-600 mb-4">
                {activeTab === "resolved" 
                  ? "You don't have any resolved complaints yet."
                  : activeTab === "active"
                  ? "All your complaints have been resolved!"
                  : "You haven't submitted any complaints yet."}
              </p>
              {activeTab !== "all" && (
                <button
                  onClick={() => setActiveTab("all")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  View All Complaints
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Resolved Complaints Banner */}
              {activeTab === "resolved" && resolvedCount > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-green-800">Resolved Complaints</h3>
                  </div>
                  <p className="text-green-700 text-sm">
                    These issues have been successfully addressed and closed. 
                    You have {resolvedCount} resolved complaint{resolvedCount !== 1 ? 's' : ''}.
                  </p>
                </div>
              )}

              {/* Complaints Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredComplaints.map((complaint) => (
                  <div
                    key={complaint.complaint_id}
                    className={`bg-white rounded-xl border ${
                      complaint.status_id === 2 
                        ? "border-green-200" 
                        : complaint.status_id === 3
                        ? "border-red-200"
                        : "border-gray-200"
                    } shadow-sm hover:shadow-md transition-shadow overflow-hidden`}
                  >
                    {/* Card Header */}
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-gray-800 text-lg truncate pr-2">
                          {complaint.title}
                        </h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          #{complaint.complaint_id}
                        </span>
                      </div>
                      
                      <div className="flex gap-2 mb-3">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          PRIORITY_MAP[complaint.priority_request as keyof typeof PRIORITY_MAP]?.color || 
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {complaint.priority_request}
                        </span>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          STATUS_MAP[complaint.status_id as keyof typeof STATUS_MAP]?.color || 
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {STATUS_MAP[complaint.status_id as keyof typeof STATUS_MAP]?.text || "Unknown"}
                        </span>
                      </div>
                      
                      
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {complaint.description}
                      </p>
                    </div>

{/* Flat Info Display */}
{complaint.flat_number && (
  <div className="mt-2 flex items-center gap-2 text-sm">
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
    <span className="text-gray-600">Flat:</span>
    <span className="font-medium text-gray-800">
      {complaint.flat_number}
      {complaint.floor_number && ` (Floor ${complaint.floor_number})`}
    </span>
  </div>
)}

                    {/* Images Preview */}
                    {complaint.images && complaint.images.length > 0 && (
                      <div className="px-5 pb-5">
                        <p className="text-xs text-gray-500 mb-2">Attachments: {complaint.images.length}</p>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {complaint.images.map((imageUrl, index) => (
                            <a
                              key={index}
                              href={imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0"
                            >
                              <img
                                src={imageUrl}
                                alt={`Complaint ${complaint.complaint_id} - Image ${index + 1}`}
                                className="w-16 h-16 object-cover rounded-lg border border-gray-200 hover:border-blue-400 transition-colors"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                                }}
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Card Footer */}
                    <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Submitted</span>
                          <span className="font-medium text-gray-800">
                            {formatDate(complaint.created_at)}
                          </span>
                        </div>
                        
                        {/* {complaint.updated_at && complaint.updated_at !== complaint.created_at && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">Last Updated</span>
                            <span className="font-medium text-gray-800">
                              {formatDate(complaint.updated_at)}
                            </span>
                          </div>
                        )} */}

                        {complaint.assigned_to && (
                          <div className="pt-2 border-t border-gray-200">
                            <span className="text-gray-500">Assigned to: Staff #{complaint.assigned_to}</span>
                          </div>
                        )}

                        {/* Verification Status */}
                        {/* {complaint.verification_status && (
                          <div className={`text-xs px-2 py-1 rounded inline-block ${
                            complaint.verification_status === "verified" 
                              ? "bg-green-100 text-green-800"
                              : complaint.verification_status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {complaint.verification_status.charAt(0).toUpperCase() + complaint.verification_status.slice(1)}
                          </div>
                        )} */}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                        {/* <button
                          onClick={() => alert(`View details for complaint #${complaint.complaint_id}`)}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                        >
                          View Details
                        </button> */}

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Quick Overview</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Resolved Rate</span>
              <span className="text-sm font-medium text-gray-800">
                {totalComplaints > 0 ? Math.round((resolvedCount / totalComplaints) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${totalComplaints > 0 ? (resolvedCount / totalComplaints) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Average Resolution Time</div>
              <div className="font-medium text-gray-800">-</div>
            </div>
            <div>
              <div className="text-gray-500">Active Complaints</div>
              <div className="font-medium text-blue-600">{activeCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}