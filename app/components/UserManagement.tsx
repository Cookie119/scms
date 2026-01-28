"use client";

import { useState, useEffect } from "react";
import { 
  showusers, 
  getRoles, 
  getFlats, 
  addUserForm, 
  updateUserForm, 
  deleteusers, 
  searchUsers 
} from "@/app/actions/userActions";

type User = {
  id: number;
  email: string;
  password?: string;
  role_id: number;
  name: string;
  phone_number?: string;
  flat_id?: number;
  flat_number?: string;
  floor_number?: number;
  role_name?: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
};

type Role = {
  role_id: number;  // Changed from id to role_id
  role_name: string;
};

type Flat = {
  id: number;
  flat_number: string;
  floor_number: number;
};

export default function UserManagement() {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [flats, setFlats] = useState<Flat[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    password: "",
    name: "",
    phone_number: "",
    role_id: "",
    flat_id: ""
  });

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const [usersData, rolesData, flatsData] = await Promise.all([
        showusers(),
        getRoles(),
        getFlats()
      ]);
      
      // Filter out deleted users
      const activeUsers = usersData.filter((user: any) => !user.deleted_at);
      setUsers(activeUsers);
      setRoles(rolesData);
      setFlats(flatsData);
    } catch (error) {
      console.error("Failed to load data:", error);
      setMessage({ type: 'error', text: "Failed to load data. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    if (!search.trim()) {
      loadData();
      return;
    }
    
    setLoading(true);
    try {
      const results = await searchUsers(search);
      setUsers(results);
      setMessage({ 
        type: 'success', 
        text: `Found ${results.length} user(s) matching "${search}"` 
      });
    } catch (error) {
      console.error("Search failed:", error);
      setMessage({ type: 'error', text: "Search failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      email: "",
      password: "",
      name: "",
      phone_number: "",
      role_id: "",
      flat_id: ""
    });
    setEditingUserId(null);
    setShowForm(false);
    setMessage(null);
  };

  const handleAddUser = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (user: User) => {
    setFormData({
      id: user.id.toString(),
      email: user.email,
      password: "",
      name: user.name,
      phone_number: user.phone_number || "",
      role_id: user.role_id.toString(), // role_id is a number
      flat_id: user.flat_id?.toString() || ""
    });
    
    setEditingUserId(user.id);
    setShowForm(true);
    setMessage(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user? This action can be undone.")) return;
    
    try {
      await deleteusers(id);
      setMessage({ type: 'success', text: "User deleted successfully!" });
      loadData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || "Failed to delete user" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (!formData.email.trim()) {
      setMessage({ type: 'error', text: "Email is required" });
      return;
    }
    
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: "Name is required" });
      return;
    }
    
    if (!formData.role_id) {
      setMessage({ type: 'error', text: "Role is required" });
      return;
    }

    if (!editingUserId && !formData.password.trim()) {
      setMessage({ type: 'error', text: "Password is required for new users" });
      return;
    }

    try {
      if (editingUserId) {
        // UPDATE EXISTING USER
        const updateForm = new FormData();
        updateForm.append("id", formData.id);
        updateForm.append("email", formData.email.trim());
        updateForm.append("name", formData.name.trim());
        updateForm.append("phone_number", formData.phone_number.trim());
        updateForm.append("role_id", formData.role_id); // This should be a number string like "2"
        updateForm.append("flat_id", formData.flat_id);
        
        if (formData.password.trim()) {
          updateForm.append("password", formData.password);
        }

        const result = await updateUserForm(updateForm);
        
        if (!result.success) {
          throw new Error(result.error);
        }
        
        setMessage({ type: 'success', text: "User updated successfully!" });
      } else {
        // ADD NEW USER
        const form = new FormData();
        form.append("email", formData.email.trim());
        form.append("password", formData.password);
        form.append("name", formData.name.trim());
        form.append("phone_number", formData.phone_number.trim());
        form.append("role_id", formData.role_id); // This should be a number string like "2"
        form.append("flat_id", formData.flat_id);

        const result = await addUserForm(form);
        
        if (!result.success) {
          throw new Error(result.error);
        }
        
        setMessage({ type: 'success', text: "User created successfully!" });
      }

      resetForm();
      loadData();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || "Operation failed. Please try again." });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get role name by role_id
  const getRoleName = (roleId: number) => {
    const role = roles.find(r => r.role_id === roleId);
    return role ? role.role_name : `Role ${roleId}`;
  };

  // Get role color by role_id
  const getRoleColor = (roleId: number) => {
    const colors: Record<number, string> = {
      1: "bg-red-100 text-red-800",
      2: "bg-blue-100 text-blue-800",
      3: "bg-green-100 text-green-800",
      4: "bg-purple-100 text-purple-800",
      5: "bg-yellow-100 text-yellow-800",
    };
    return colors[roleId] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">👥 User Management</h1>
        <p className="text-gray-600">Manage all system users, roles, and flat assignments</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-2xl font-bold text-gray-800">{users.length}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">Roles Available</div>
          <div className="text-2xl font-bold text-gray-800">{roles.length}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">Flats Available</div>
          <div className="text-2xl font-bold text-gray-800">{flats.length}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">Action</div>
          <button
            onClick={handleAddUser}
            className="mt-2 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New User
          </button>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Search and Controls */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <form onSubmit={handleSearch} className="flex-1 w-full">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search users by name, email or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button 
                type="submit" 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Search
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setSearch("");
                  loadData();
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {editingUserId ? "✏️ Edit User" : "➕ Add New User"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {editingUserId ? "Update user details" : "Fill in the user information below"}
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Hidden ID field for editing */}
                {editingUserId && (
                  <input type="hidden" name="id" value={formData.id} />
                )}

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="user@example.com"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password {!editingUserId && <span className="text-red-500">*</span>}
                    {editingUserId && (
                      <span className="text-gray-500 text-xs ml-2">(leave blank to keep current)</span>
                    )}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={editingUserId ? "New password (optional)" : "Enter password"}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required={!editingUserId}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    placeholder="+1234567890"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a role</option>
                    {roles.map(role => (
                      <option key={role.role_id} value={role.role_id}>
                        {role.role_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Flat Assignment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Flat Assignment (Optional)
                  </label>
                  <select
                    name="flat_id"
                    value={formData.flat_id}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">No flat assigned</option>
                    {flats.map(flat => (
                      <option key={flat.id} value={flat.id}>
                        Flat {flat.flat_number} (Floor {flat.floor_number})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    {editingUserId ? "Update User" : "Create User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Users List</h2>
            <div className="text-sm text-gray-500">
              Total: {users.length} user(s)
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Loading users...</span>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first user</p>
            <button
              onClick={handleAddUser}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Your First User
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">User Details</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Flat</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Created</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    {/* User Details */}
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 mt-1">{user.email}</div>
                        {user.phone_number && (
                          <div className="text-sm text-gray-500 mt-1">📞 {user.phone_number}</div>
                        )}
                      </div>
                    </td>

                    {/* Role */}
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role_id)}`}>
                        {user.role_name || getRoleName(user.role_id)}
                      </span>
                    </td>

                    {/* Flat */}
                    <td className="p-4">
                      {user.flat_number ? (
                        <div className="text-sm">
                          <span className="font-medium">Flat {user.flat_number}</span>
                          {user.floor_number && (
                            <span className="text-gray-500 ml-2">(Floor {user.floor_number})</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Not assigned</span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="p-4">
                      <div className="text-sm text-gray-500">
                        {formatDate(user.created_at)}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}