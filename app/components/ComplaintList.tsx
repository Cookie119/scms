"use client";

import { useState, useEffect } from "react";
import { showcomplaints, updateComplaintStatus, verifyComplaint } from "../actions/complaintAction.action";

export default function ComplaintList() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all"); // 'all', '0', '1', '2', '3'

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const data = await showcomplaints();
      setComplaints(data || []);
    } catch (error) {
      console.error("Error loading complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (complaint_id: number, status: number) => {
    try {
      const formData = new FormData();
      formData.append("complaint_id", complaint_id.toString());
      formData.append("status", status.toString());
      
      await updateComplaintStatus(formData);
      await loadComplaints(); 
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleVerification = async (complaint_id: number, is_real: boolean) => {
    try {
      const formData = new FormData();
      formData.append("complaint_id", complaint_id.toString());
      formData.append("is_real", is_real.toString());
      
      await verifyComplaint(formData);
      await loadComplaints(); 
    } catch (error) {
      console.error("Error verifying complaint:", error);
    }
  };

  // Status Helpers
  const getStatusInfo = (status: number) => {
    switch(status) {
      case 0: return { label: "Pending", color: "bg-yellow-50 text-yellow-700 ring-yellow-600/20" };
      case 1: return { label: "In Process", color: "bg-blue-50 text-blue-700 ring-blue-600/20" };
      case 2: return { label: "Resolved", color: "bg-green-50 text-green-700 ring-green-600/20" };
      case 3: return { label: "Rejected", color: "bg-red-50 text-red-700 ring-red-600/20" };
      default: return { label: "Unknown", color: "bg-gray-50 text-gray-600 ring-gray-500/10" };
    }
  };

  const getPriorityInfo = (priority: string) => {
    switch(priority?.toLowerCase()) {
      case "high": return "bg-red-50 text-red-700 border-red-200";
      case "medium": return "bg-amber-50 text-amber-700 border-amber-200";
      case "low": return "bg-green-50 text-green-700 border-green-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getVerificationInfo = (verification: number | null) => {
    switch(verification) {
      case 1: return { text: "Verified Real", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
      case 0: return { text: "Verified Fake", color: "text-rose-600 bg-rose-50 border-rose-200" };
      default: return { text: "Unverified", color: "text-gray-500 bg-gray-50 border-gray-200" };
    }
  };

  // Filter Logic
  const filteredComplaints = activeTab === 'all' 
    ? complaints 
    : complaints.filter((c) => c.status_id === parseInt(activeTab));

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Complaint Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage statuses and verify requests</p>
          </div>
          <button
            onClick={loadComplaints}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-gray-700 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
            {[
              { id: 'all', label: 'All' },
              { id: '0', label: 'Pending' },
              { id: '1', label: 'In Process' },
              { id: '2', label: 'Resolved' },
              { id: '3', label: 'Rejected' },
            ].map((tab) => {
              const count = tab.id === 'all' 
                ? complaints.length 
                : complaints.filter(c => c.status_id === parseInt(tab.id)).length;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
                >
                  {tab.label}
                  <span className={`${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  } py-0.5 px-2 rounded-full text-xs`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-gray-500">No complaints found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredComplaints.map((c) => {
              const statusInfo = getStatusInfo(c.status_id);
              const verificationInfo = getVerificationInfo(c.verification_status);

              return (
                <div
                  key={c.complaint_id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col"
                >
                  {/* Card Header */}
                  <div className="p-5 pb-3">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{c.title}</h3>
                        <p className="text-xs text-gray-400 mt-1">ID: #{c.complaint_id}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="px-5 py-3 bg-gray-50/50 border-y border-gray-100">
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {c.description}
                    </p>
                    
                    {/* Meta Tags */}
                    <div className="flex flex-wrap gap-2 mt-3">
                        <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-medium ${getPriorityInfo(c.priority)}`}>
                           Priority: {c.priority_request || 'Normal'}
                        </span>
                        <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-medium ${verificationInfo.color}`}>
                           {verificationInfo.text}
                        </span>
                    </div>
                  </div>

                  {/* Images
                  {c.images && c.images.length > 0 && (
                    <div className="px-5 py-3 border-b border-gray-100">
                      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {c.images.map((img: string) => (
                          <img
                            key={img}
                            src={img}
                            alt="Attachment"
                            className="h-16 w-16 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                          />
                        ))}
                      </div>
                    </div>
                  )} */}

{/* Flat Info Display */}
{c.flat_number && (
  <div className="pl-6 mt-4 flex items-center gap-2 text-sm">
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
    <span className="text-gray-600">Flat:</span>
    <span className="font-medium text-gray-800">
      {c.flat_number}
      {c.floor_number && ` (Floor ${c.floor_number})`}
    </span>
  </div>
)}

                              {/* Images Preview */}
            {c.images && c.images.length > 0 && (
              <div className="p-5 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-3">Attachments ({c.images.length})</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {c.images.map((imageUrl:string, index:number) => (
                    <div key={index} className="flex-shrink-0">
                      <a
                        href={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img
                          src={imageUrl}
                          alt={`Complaint ${c.complaint_id} - Image ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200 hover:border-blue-400 transition-colors"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                          }}
                        />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
                  {/* Actions Footer */}
                  <div className="p-4 bg-white">
                    {/* Verification Section */}
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Verification</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVerification(c.complaint_id, true)}
                          disabled={c.verification_status === 1}
                          className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex justify-center items-center gap-1
                            ${c.verification_status === 1 
                              ? 'bg-emerald-100 text-emerald-700 border-emerald-200 cursor-default' 
                              : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'}`}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          Real
                        </button>
                        <button
                          onClick={() => handleVerification(c.complaint_id, false)}
                          disabled={c.verification_status === 0}
                          className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex justify-center items-center gap-1
                            ${c.verification_status === 0 
                              ? 'bg-rose-100 text-rose-700 border-rose-200 cursor-default' 
                              : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'}`}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                          Fake
                        </button>
                      </div>
                    </div>

                    {/* Status Update Section */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Update Status</p>
                      <div className="grid grid-cols-3 gap-2">
                        {c.status_id !== 1 && (
                          <button
                            onClick={() => handleStatusUpdate(c.complaint_id, 1)}
                            className="text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                          >
                            In Process
                          </button>
                        )}
                        {c.status_id !== 2 && (
                          <button
                            onClick={() => handleStatusUpdate(c.complaint_id, 2)}
                            className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Resolve
                          </button>
                        )}
                        {c.status_id !== 3 && (
                          <button
                            onClick={() => handleStatusUpdate(c.complaint_id, 3)}
                            className="text-red-700 bg-red-50 hover:bg-red-100 border border-red-100 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}