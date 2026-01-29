"use client";

import { useState, useEffect } from "react";
import { showEntries, getVisitorsIn, getTodaysEntries, searchEntries, getEntryStats } from "@/app/actions/entryRegister";

export default function AdminVisitorLog() {
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  const [view, setView] = useState<"current" | "today" | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);
  const [totalEntries, setTotalEntries] = useState(0);

  async function loadEntries() {
    try {
      setLoading(true);
      let data;
      switch(view) {
        case "current":
          data = await getVisitorsIn();
          break;
        case "today":
          data = await getTodaysEntries();
          break;
        case "all":
          if (searchTerm.trim()) {
            data = await searchEntries(searchTerm);
          } else {
            data = await showEntries();
          }
          break;
        default:
          data = await showEntries();
      }
      setEntries(data);
      setTotalEntries(data.length);
      // Reset to first page when data changes
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to load entries:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const statsData = await getEntryStats();
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  }

  useEffect(() => { 
    loadEntries(); 
    loadStats();
  }, [view, searchTerm]);

  // Calculate pagination values
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = entries.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle previous page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleViewDetails = (entry: any) => {
    setSelectedEntry(entry);
    setShowDetails(true);
  };

  const exportToCSV = () => {
    const headers = ["ID", "Name", "Contact", "Type", "Purpose", "Entry Time", "Exit Time", "Status", "Security User ID"];
    const csvData = entries.map(entry => [
      entry.entry_id,
      `"${entry.visitor_name}"`,
      entry.visitor_contact_no || "",
      entry.visitor_type,
      `"${entry.purpose || ""}"`,
      new Date(entry.entry_time).toLocaleString(),
      entry.exit_time ? new Date(entry.exit_time).toLocaleString() : "",
      entry.status,
      entry.security_user_id || ""
    ].join(","));

    const csvContent = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `visitor-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const calculateDuration = (entryTime: string, exitTime: string | null) => {
    if (!exitTime) return "Still inside";
    const start = new Date(entryTime);
    const end = new Date(exitTime);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;
    
    if (diffHours > 0) {
      return `${diffHours}h ${remainingMins}m`;
    }
    return `${diffMins}m`;
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📊 Admin - Visitor Management</h1>
          <p className="text-gray-600 mt-1">View and manage all visitor entries in the system</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-blue-600 font-medium">Total Today</div>
                <div className="text-2xl font-bold text-gray-800">{stats.total_entries || 0}</div>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-green-600 font-medium">Currently Inside</div>
                <div className="text-2xl font-bold text-gray-800">{stats.visitors_in || 0}</div>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 font-medium">Checked Out</div>
                <div className="text-2xl font-bold text-gray-800">{stats.visitors_out || 0}</div>
              </div>
              <div className="bg-gray-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-purple-600 font-medium">Visitor Types</div>
                <div className="text-2xl font-bold text-gray-800">{stats.unique_visitor_types || 0}</div>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-orange-600 font-medium">Total Entries</div>
                <div className="text-2xl font-bold text-gray-800">{entries.length || 0}</div>
              </div>
              <div className="bg-orange-100 p-2 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800">Visitor Records</h2>
          
          <div className="flex flex-col md:flex-row gap-3">
            {/* View Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setView("all")}
                className={`px-4 py-2 text-sm font-medium ${view === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
              >
                All Entries
              </button>
              <button
                onClick={() => setView("current")}
                className={`px-4 py-2 text-sm font-medium ${view === "current" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
              >
                Currently Inside
              </button>
              <button
                onClick={() => setView("today")}
                className={`px-4 py-2 text-sm font-medium ${view === "today" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
              >
                Today Only
              </button>
            </div>
            
            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search visitors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>

            {/* Export Button */}
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">ID</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Visitor Details</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Visit Info</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Timings</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Duration</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : currentEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                    </svg>
                    <p className="text-lg">No visitor records found</p>
                    <p className="text-sm">Try changing your search or filter criteria</p>
                  </td>
                </tr>
              ) : (
                currentEntries.map((entry) => (
                  <tr key={entry.entry_id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-mono text-sm text-gray-500">#{entry.entry_id}</div>
                    </td>
                    
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{entry.visitor_name}</div>
                      {entry.visitor_contact_no && (
                        <div className="text-sm text-gray-600 mt-1">
                          📱 {entry.visitor_contact_no}
                        </div>
                      )}
                    </td>
                    
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${
                          entry.visitor_type === "Client" ? "bg-blue-100 text-blue-800" :
                          entry.visitor_type === "Vendor" ? "bg-green-100 text-green-800" :
                          entry.visitor_type === "Guest" ? "bg-purple-100 text-purple-800" :
                          entry.visitor_type === "Contractor" ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {entry.visitor_type}
                        </span>
                        {entry.purpose && (
                          <div className="text-sm text-gray-600 mt-1">
                            📝 {entry.purpose}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="text-gray-500">In:</span> {formatDateTime(entry.entry_time)}
                        </div>
                        {entry.exit_time && (
                          <div className="text-sm">
                            <span className="text-gray-500">Out:</span> {formatDateTime(entry.exit_time)}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="text-sm">
                        {calculateDuration(entry.entry_time, entry.exit_time)}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          entry.status === "IN" ? "bg-green-500" : "bg-gray-400"
                        }`}></div>
                        <span className={`text-sm font-medium ${
                          entry.status === "IN" ? "text-green-700" : "text-gray-700"
                        }`}>
                          {entry.status}
                        </span>
                      </div>
                      {entry.security_user_id && (
                        <div className="text-xs text-gray-500 mt-1">
                          ID: {entry.security_user_id}
                        </div>
                      )}
                    </td>
                    
                    <td className="p-4">
                      <button
                        onClick={() => handleViewDetails(entry)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalEntries > entriesPerPage && !loading && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-4 sm:mb-0">
              Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, totalEntries)} of {totalEntries} entries
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center gap-1 ${
                  currentPage === 1
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-3 py-1.5 text-gray-500">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page as number)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg min-w-[40px] ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center gap-1 ${
                  currentPage === totalPages
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Page Size Selector (Optional - you can add this if needed) */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <span>Show:</span>
              <select
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white"
                value={entriesPerPage}
                onChange={(e) => {
                  // You can add logic to change entries per page here
                }}
                disabled
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span>per page</span>
            </div>
          </div>
        )}

        {/* Footer - Updated with pagination info */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500">
          <div>
            Page {currentPage} of {totalPages} • Showing {currentEntries.length} entries on this page
          </div>
          <div className="mt-2 sm:mt-0">
            Data as of {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Visitor Details</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Visitor Information</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-gray-500">Full Name</div>
                        <div className="font-medium">{selectedEntry.visitor_name}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Contact Number</div>
                        <div className="font-medium">{selectedEntry.visitor_contact_no || "Not provided"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Visitor Type</div>
                        <div className="font-medium">{selectedEntry.visitor_type}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Visit Information</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-gray-500">Purpose of Visit</div>
                        <div className="font-medium">{selectedEntry.purpose || "Not specified"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Security ID</div>
                        <div className="font-medium">{selectedEntry.security_user_id || "Not recorded"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Status</div>
                        <div className="font-medium">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            selectedEntry.status === "IN" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {selectedEntry.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-4">Timeline</h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-lg mr-4">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Entry Time</div>
                        <div className="text-sm text-gray-600">{formatDateTime(selectedEntry.entry_time)}</div>
                      </div>
                    </div>

                    {selectedEntry.exit_time && (
                      <div className="flex items-start">
                        <div className="bg-green-100 p-2 rounded-lg mr-4">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">Exit Time</div>
                          <div className="text-sm text-gray-600">{formatDateTime(selectedEntry.exit_time)}</div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start">
                      <div className="bg-purple-100 p-2 rounded-lg mr-4">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Visit Duration</div>
                        <div className="text-sm text-gray-600">
                          {calculateDuration(selectedEntry.entry_time, selectedEntry.exit_time)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6 flex justify-end">
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}