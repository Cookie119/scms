"use client";

import { useState, useEffect } from 'react';
import { getDashboardStats } from '@/app/actions/stats';

// --- Icons (SVG) ---
const IconFileText = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const IconUsers = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const IconTags = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>;
const IconClipboard = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M9 14h6"></path><path d="M9 10h6"></path><path d="M9 18h6"></path></svg>;

// --- Theme Configuration ---
const theme = {
  primary: "#0B3C66",      // Deep Blue
  accent: "#F15A29",       // Vibrant Orange
  background: "#F8FAFC",   // Light gray
  textPrimary: "#1E293B",  // Dark slate
};

// Define the stats type
type DashboardStats = {
  totalComplaints: number;
  totalUsers: number;
  totalCategories: number;
  totalEntryRegister: number;
  pendingComplaints?: number;
  resolvedComplaints?: number;
  inProgressComplaints?: number;
  highPriorityComplaints?: number;
};

export function StatsCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const result = await getDashboardStats();
        
        if (result.success && result.data) {
          setStats(result.data);
        } else {
          setError(result.error || "Failed to fetch statistics");
          setStats({
            totalComplaints: 142,
            totalUsers: 89,
            totalCategories: 24,
            totalEntryRegister: 56,
            pendingComplaints: 42,
            resolvedComplaints: 78,
            inProgressComplaints: 22,
            highPriorityComplaints: 15
          });
        }
      } catch (err) {
        setError("An unexpected error occurred");
        setStats({
          totalComplaints: 142,
          totalUsers: 89,
          totalCategories: 24,
          totalEntryRegister: 56,
          pendingComplaints: 42,
          resolvedComplaints: 78,
          inProgressComplaints: 22,
          highPriorityComplaints: 15
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2 border border-red-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          {error} <span className="font-semibold opacity-75">(showing demo data)</span>
        </div>
      )}
      
      {/* MAIN STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Complaints */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Complaints</h3>
              <p className="text-3xl font-bold mt-1" style={{ color: theme.primary }}>
                {loading ? '...' : stats?.totalComplaints || 0}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <IconFileText />
            </div>
          </div>
        </div>
        
        {/* Total Users */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Users</h3>
              <p className="text-3xl font-bold mt-1" style={{ color: theme.primary }}>
                {loading ? '...' : stats?.totalUsers || 0}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
              <IconUsers />
            </div>
          </div>
        </div>
        
        {/* Total Categories */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Categories</h3>
              <p className="text-3xl font-bold mt-1" style={{ color: theme.primary }}>
                {loading ? '...' : stats?.totalCategories || 0}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-teal-50 text-teal-600 group-hover:scale-110 transition-transform">
              <IconTags />
            </div>
          </div>
        </div>
        
        {/* Total Register */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Register</h3>
              <p className="text-3xl font-bold mt-1" style={{ color: theme.primary }}>
                {loading ? '...' : stats?.totalEntryRegister || 0}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
              <IconClipboard />
            </div>
          </div>
        </div>
      </div>
      
      {/* STATUS / SUB STATS ROW */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Pending */}
          <div className="bg-white p-4 rounded-xl border-l-4 border-amber-400 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending</h3>
              <div className="h-2 w-2 rounded-full bg-amber-400"></div>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2">{stats.pendingComplaints || 0}</p>
          </div>

          {/* In Progress */}
          <div className="bg-white p-4 rounded-xl border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">In Progress</h3>
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2">{stats.inProgressComplaints || 0}</p>
          </div>

          {/* Resolved */}
          <div className="bg-white p-4 rounded-xl border-l-4 border-emerald-500 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Resolved</h3>
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2">{stats.resolvedComplaints || 0}</p>
          </div>

          {/* High Priority (Themed with Accent Orange) */}
          <div 
            className="rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden relative group"
            style={{ backgroundColor: '#FFF4ED', borderColor: '#FFEDD5', border: '1px solid #FFEDD5' }}
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-100 to-transparent opacity-50 rounded-bl-full group-hover:opacity-100 transition-opacity"></div>
            
            <div className="p-4 relative">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#C2410C' }}>
                  High Priority
                </h3>
                <svg className="w-4 h-4" style={{ color: '#C2410C' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <p className="text-2xl font-bold mt-1" style={{ color: '#F15A29' }}>
                {stats.highPriorityComplaints || 0}
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}