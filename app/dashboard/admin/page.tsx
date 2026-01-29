"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import ComplaintList from "@/app/components/ComplaintList";
import ViewRegister from "@/app/components/ViewRegister";
import CategoryManagement from "@/app/components/CategoryManagement";
import UserManagement from "@/app/components/UserManagement";
import LogoutButton from "@/app/components/LogoutButton";

// Navigation items with icons
const navItems = [
  { id: "complaints", label: "Complaint List", icon: "📋", description: "View and assign pending complaints" },
  { id: "register", label: "View Register", icon: "📝", description: "View Registration Details" },
  { id: "categories", label: "Category Management", icon: "🏷️", description: "Manage Complaint Categories" },
  { id: "users", label: "User Management", icon: "👥", description: "Manage System Users" },
];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<string>("complaints");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-textPrimary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    signIn();
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-textPrimary">Redirecting to login...</p>
      </div>
    );
  }

  if (session.user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-red-200 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H8m9-6V6a3 3 0 00-3-3H6a3 3 0 00-3 3v6h12z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-textPrimary mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  const activeNavItem = navItems.find(item => item.id === activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left side: Logo and Mobile Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <span className="text-xl">✕</span>
              ) : (
                <span className="text-xl">☰</span>
              )}
            </button>

            <div className="flex items-center gap-3">
              {/* Logo */}
          <div className="flex items-center gap-2">
  {/* Logo Image from public folder */}
  <img 
    src="/logo.png" 
    alt="Resolve Logo" 
    className="w-10 h-10 object-contain"
    onError={(e) => {
      // Fallback if logo doesn't exist
      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%230B3C66' rx='8'/%3E%3Ctext x='20' y='25' font-family='Arial, sans-serif' font-size='18' font-weight='bold' fill='white' text-anchor='middle'%3ER%3C/text%3E%3C/svg%3E";
    }}
  />
  
</div>
              
              <div className="hidden md:block h-6 w-px bg-gray-300"></div>
              
              <div>
                <h1 className="text-lg font-bold text-textPrimary">{activeNavItem?.label}</h1>
                <p className="text-xs text-gray-500">{activeNavItem?.description}</p>
              </div>
            </div>
          </div>

          {/* Right side: User Profile and Logout */}
          <div className="flex items-center gap-4">
            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-textPrimary">{"Admin"}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white font-semibold">
                  {"A"}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="ml-2">
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <aside className={`
          ${sidebarOpen ? 'w-64' : 'w-20'} 
          hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300
        `}>
         {/* Sidebar Header */}
<div className="p-6 border-b border-gray-100">
  {sidebarOpen ? (
    <div className="flex items-center gap-3">
      <img 
        src="/logo.png" 
        alt="Resolve Logo" 
        className="w-10 h-10 object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%230B3C66' rx='8'/%3E%3Ctext x='20' y='25' font-family='Arial, sans-serif' font-size='18' font-weight='bold' fill='white' text-anchor='middle'%3ER%3C/text%3E%3C/svg%3E";
        }}
      />
      <div>
        <h2 className="font-bold text-textPrimary">Resolve Admin</h2>
        <p className="text-xs text-gray-500">Management Dashboard</p>
      </div>
    </div>
  ) : (
    <div className="flex justify-center">
      <img 
        src="/logo.png" 
        alt="Resolve Logo" 
        className="w-10 h-10 object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%230B3C66' rx='8'/%3E%3Ctext x='20' y='25' font-family='Arial, sans-serif' font-size='18' font-weight='bold' fill='white' text-anchor='middle'%3ER%3C/text%3E%3C/svg%3E";
        }}
      />
    </div>
  )}
</div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <NavButton
                key={item.id}
                label={item.label}
                icon={item.icon}
                isActive={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
                sidebarOpen={sidebarOpen}
              />
            ))}
          </nav>

          {/* Sidebar Toggle */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-lg hover:bg-gray-50 text-gray-600"
            >
              <span className="text-lg">⚙️</span>
              {sidebarOpen && <span className="text-sm">Settings</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-white text-lg font-bold">R</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-textPrimary">Resolve Admin</h2>
                    <p className="text-xs text-gray-500">Management Dashboard</p>
                  </div>
                </div>
              </div>
              
              <nav className="p-4 space-y-1">
                {navItems.map((item) => (
                  <MobileNavButton
                    key={item.id}
                    label={item.label}
                    icon={item.icon}
                    isActive={activeTab === item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                  />
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Stats Cards */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Complaints"
                value="1,234"
                change="+12%"
                icon="📋"
                color="primary"
              />
              <StatCard
                title="Pending"
                value="56"
                change="+5%"
                icon="📝"
                color="yellow"
              />
              <StatCard
                title="Resolved"
                value="1,178"
                change="+8%"
                icon="🏷️"
                color="green"
              />
              <StatCard
                title="Users"
                value="89"
                change="+3%"
                icon="👥"
                color="purple"
              />
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                {activeTab === "complaints" && <ComplaintList />}
                {activeTab === "register" && <ViewRegister />}
                {activeTab === "categories" && <CategoryManagement />}
                {activeTab === "users" && <UserManagement />}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, change, icon, color }: any) {
  const colorClasses = {
    primary: "bg-blue-50 text-primary border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  const colorBgClasses = {
    primary: "bg-primary/10",
    green: "bg-green-100",
    yellow: "bg-yellow-100",
    purple: "bg-purple-100",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorBgClasses[color as keyof typeof colorBgClasses]}`}>
          <span className="text-xl">{icon}</span>
        </div>
        <span className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-textPrimary mb-1">{value}</h3>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  );
}

// Desktop Nav Button
function NavButton({ label, icon, isActive, onClick, sidebarOpen }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center rounded-xl transition-all duration-200 group
        ${isActive 
          ? 'bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-primary' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-textPrimary'
        }
        ${sidebarOpen ? 'px-4 py-3 justify-start' : 'p-3 justify-center'}
      `}
    >
      <div className={`relative ${sidebarOpen ? 'mr-3' : ''}`}>
        <span className={`text-xl ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}`}>
          {icon}
        </span>
        {isActive && (
          <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"></div>
        )}
      </div>
      {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
}

// Mobile Nav Button
function MobileNavButton({ label, icon, isActive, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200
        ${isActive 
          ? 'bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-primary' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-textPrimary'
        }
      `}
    >
      <span className={`text-xl mr-3 ${isActive ? 'text-primary' : 'text-gray-400'}`}>
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}