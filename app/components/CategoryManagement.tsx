"use client";
import { useState, useEffect } from "react";
import {
  getCategories,
  deleteCategory,
  updateCategory,
  addCategory, // 1. Import the new action
} from "@/app/actions/category";
import { getRoles } from "@/app/actions/role";

export default function CategoryList() {
  const [categories, setCategories] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false); // 2. State for toggling the Add form

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [catData, roleData] = await Promise.all([
      getCategories(),
      getRoles(),
    ]);
    setCategories(catData);
    setRoles(roleData);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(id);
      loadData();
    }
  };

  const handleUpdate = async (formData: FormData) => {
    await updateCategory(formData);
    setEditId(null);
    loadData();
  };

  // 3. Handler for adding a new category
  const handleAdd = async (formData: FormData) => {
    await addCategory(formData);
    setIsAdding(false); // Close the form
    formData.set("category_name", ""); // Optional: clear inputs if needed manually, but DOM reload handles it usually
    loadData(); // Refresh the list
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage complaint categories and assign roles</p>
          </div>
          {/* 4. Updated Add Button */}
          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`${isAdding ? "bg-gray-200 text-gray-800" : "bg-blue-600 hover:bg-blue-700 text-white"} px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center gap-2`}
          >
            {isAdding ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                Cancel
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Add Category
              </>
            )}
          </button>
        </div>

        {/* 5. Add Category Form (Conditionally Rendered) */}
        {isAdding && (
          <div className="mb-8 bg-white rounded-xl border border-blue-200 shadow-[0_0_15px_rgba(37,99,235,0.1)] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-50 px-6 py-3 border-b border-blue-100 flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
               <span className="font-semibold text-blue-800">New Category Details</span>
            </div>
            <form action={handleAdd} className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="md:col-span-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  name="category_name"
                  placeholder="e.g. Technical Support"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                  autoFocus
                />
              </div>

              <div className="md:col-span-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Handler Role
                </label>
                <select
                  name="handler_role_id"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.role_id} value={role.role_id}>
                      {role.role_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Grid Layout */}
        {categories.length === 0 && !isAdding ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-gray-500">No categories found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.category_id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden relative"
              >
                {editId === cat.category_id ? (
                  /* EDIT MODE FORM */
                  <form action={handleUpdate} className="p-6 flex flex-col h-full">
                    <input
                      type="hidden"
                      name="category_id"
                      value={cat.category_id}
                    />
                    
                    <div className="flex-grow space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                          Category Name
                        </label>
                        <input
                          type="text"
                          name="category_name"
                          defaultValue={cat.category_name}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                          Handler Role
                        </label>
                        <select
                          name="handler_role_id"
                          defaultValue={cat.handler_role_id}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                          required
                        >
                          <option value="">Select Role</option>
                          {roles.map((role) => (
                            <option key={role.role_id} value={role.role_id}>
                              {role.role_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex justify-center items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditId(null)}
                        className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  /* VIEW MODE DISPLAY */
                  <div className="p-6 flex flex-col h-full relative">
                    {/* Background Decorative Icon */}
                    <div className="absolute top-4 right-4 text-gray-100 opacity-50 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                    </div>

                    <div className="flex items-start justify-between mb-4">
                        <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 relative z-10">
                      {cat.category_name}
                    </h3>

                    <div className="mb-auto">
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                        Assigned Handler
                      </p>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium bg-purple-50 text-purple-700 border border-purple-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        {cat.role_name || "Unassigned"}
                      </span>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between relative z-10">
                      <button
                        onClick={() => setEditId(cat.category_id)}
                        className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat.category_id)}
                        className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}