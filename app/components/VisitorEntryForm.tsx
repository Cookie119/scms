"use client";

import { useState, useEffect } from "react";
import { addEntryForm, markVisitorExit, getVisitorsIn, getTodaysEntries, searchEntries, getEntryStats } from "@/app/actions/entryRegister";

export default function VisitorEntryForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [entries, setEntries] = useState<any[]>([]);
  const [view, setView] = useState<"current" | "today" | "all">("current");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState<any>(null);

  async function loadEntries() {
    try {
      let data;
      switch(view) {
        case "current":
          data = await getVisitorsIn();
          break;
        case "today":
          data = await getTodaysEntries();
          break;
        case "all":
          data = await searchEntries(searchTerm);
          break;
        default:
          data = await getVisitorsIn();
      }
      setEntries(data);
    } catch (error) {
      console.error("FRONTEND DEBUG: Failed to load entries:", error);
    }
  }

  async function loadStats() {
    try {
      const statsData = await getEntryStats();
      setStats(statsData);
    } catch (error) {
      console.error("FRONTEND DEBUG: Failed to load stats:", error);
    }
  }

  useEffect(() => { 
    loadEntries(); 
    loadStats();
  }, [view, searchTerm]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  const form = e.currentTarget; // store reference
  const formData = new FormData(form);
  const result = await addEntryForm(formData);

  if (result.success) {
    setMessage("Visitor entry recorded successfully!");
    (form as HTMLFormElement).reset(); // safe
    loadEntries();
    loadStats();
  } else {
    setMessage(`Error: ${result.error}`);
  }
  setLoading(false);
};


  const handleExit = async (entry_id: number) => {
    if (!confirm("Mark this visitor as exited?")) return;
    
    try { 
      await markVisitorExit(entry_id); 
      setMessage("Visitor marked as exited.");
      loadEntries();
      loadStats();
    } catch (error: any) { 
      setMessage(`Error: ${error.message}`);
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header with Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-600">Today's Total</div>
            <div className="text-2xl font-bold">{stats.total_entries || 0}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-sm text-green-600">Currently Inside</div>
            <div className="text-2xl font-bold">{stats.visitors_in || 0}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">Checked Out Today</div>
            <div className="text-2xl font-bold">{stats.visitors_out || 0}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-sm text-purple-600">Visitor Types</div>
            <div className="text-2xl font-bold">{stats.unique_visitor_types || 0}</div>
          </div>
        </div>
      )}

      {/* Entry Form */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-bold mb-4 text-gray-800">📝 New Visitor Entry</h2>
        
        {message && (
          <div className={`p-3 rounded mb-4 ${message.includes("Error") ? "bg-red-50 text-red-800 border border-red-200" : "bg-green-50 text-green-800 border border-green-200"}`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visitor Name *
              </label>
              <input 
                name="visitor_name" 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter visitor name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input 
                name="visitor_contact_no" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter contact number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visitor Type *
              </label>
              <select 
                name="visitor_type" 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue=""
              >
                <option value="" disabled>Select type</option>
                <option value="Client">Client</option>
                <option value="Vendor">Vendor</option>
                <option value="Guest">Guest</option>
                <option value="Contractor">Contractor</option>
                <option value="Delivery">Delivery</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purpose of Visit
              </label>
              <input 
                name="purpose" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Meeting, delivery, etc."
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-[#F15A29] hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg disabled:bg-gray-400 transition duration-200 flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Recording...
                </>
              ) : (
                "✅ Record Entry"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Entries List */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">👥 Visitor Log</h2>
          
          <div className="flex flex-col md:flex-row gap-3">
            {/* View Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setView("current")}
                className={`px-4 py-2 text-sm font-medium ${view === "current" ? "bg-[#0B3C66] text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
              >
                Currently Inside
              </button>
              <button
                onClick={() => setView("today")}
                className={`px-4 py-2 text-sm font-medium ${view === "today" ? "bg-[#0B3C66] text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
              >
                Today's Log
              </button>
              <button
                onClick={() => setView("all")}
                className={`px-4 py-2 text-sm font-medium ${view === "all" ? "bg-[#0B3C66] text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
              >
                All Entries
              </button>
            </div>
            
            {/* Search Box */}
            {view === "all" && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or contact..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Name</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Contact</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Type</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Purpose</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Entry Time</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Exit Time</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Status</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.entry_id} className="hover:bg-gray-50 border-b">
                  <td className="p-3">{entry.visitor_name}</td>
                  <td className="p-3">{entry.visitor_contact_no || "-"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      entry.visitor_type === "Client" ? "bg-blue-100 text-blue-800" :
                      entry.visitor_type === "Vendor" ? "bg-green-100 text-green-800" :
                      entry.visitor_type === "Guest" ? "bg-purple-100 text-purple-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {entry.visitor_type}
                    </span>
                  </td>
                  <td className="p-3">{entry.purpose || "-"}</td>
                  <td className="p-3 text-sm">{formatDateTime(entry.entry_time)}</td>
                  <td className="p-3 text-sm">{entry.exit_time ? formatDateTime(entry.exit_time) : "-"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      entry.status === "IN" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {entry.status === "IN" && (
                      <button 
                        onClick={() => handleExit(entry.entry_id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition duration-200 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        Mark Exit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                    </svg>
                    <p className="text-lg">No visitors found</p>
                    <p className="text-sm">Add a new visitor using the form above</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Entry Count */}
        <div className="mt-4 text-sm text-gray-500">
          Showing {entries.length} visitor{entries.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}