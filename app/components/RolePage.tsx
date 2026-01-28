"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import {
  addRole,
  getRoles,
  updateRole,
  deleteRole,
} from "@/app/actions/role";

type Role = {
  role_id: number;
  role_name: string;
};

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  // Load roles on mount
  async function loadRoles() {
    const data = await getRoles();
    setRoles(data);
  }

  useEffect(() => {
    loadRoles();
  }, []);

  // --- HANDLERS ---

  // 1. Add Role: Triggered by pressing Enter in the "New Role" line
  const handleAddKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const formData = new FormData();
      formData.set("role_name", e.currentTarget.value);
      
      startTransition(async () => {
        await addRole(formData);
        e.currentTarget.value = ""; // Clear input
        await loadRoles();
      });
    }
  };

  // 2. Update Role: Triggered when clicking away (Blur) or pressing Enter
  const handleUpdate = (roleId: number, newName: string) => {
    const formData = new FormData();
    formData.set("role_id", String(roleId));
    formData.set("role_name", newName);

    startTransition(async () => {
      await updateRole(formData);
      // Note: We don't need to reloadRoles here because the DOM is already updated,
      // but we do it to ensure server/client sync.
      await loadRoles(); 
    });
  };

  // 3. Delete Role
  const handleDelete = async (roleId: number) => {
    if (confirm("Delete this role?")) {
      const formData = new FormData();
      formData.set("role_id", String(roleId));
      
      startTransition(async () => {
        await deleteRole(formData);
        await loadRoles();
      });
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center pt-20 pb-20 font-sans">
      
      <div className="w-full max-w-3xl px-8">
        
        {/* Header Section */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
            Roles
          </h1>
          <p className="text-gray-500">
            Type to add a new role. Click on any role to edit it. 
          </p>
        </header>

        {/* Editor Interface */}
        <div className="space-y-1">
          
          {/* "New Item" Row (Always at top) */}
          <div className="group flex items-center gap-4 py-2 border-b border-transparent hover:bg-gray-50 transition-colors rounded-md px-2">
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                name="new_role"
                placeholder="Add a new role (Press Enter to save)..."
                className="w-full bg-transparent border-none text-lg text-gray-900 placeholder:text-gray-300 focus:ring-0 p-0 outline-none h-10"
                onKeyDown={handleAddKeyDown}
                disabled={isPending}
              />
            </div>
            <div className="text-gray-300 text-sm select-none">
               {isPending && "Saving..."}
            </div>
          </div>

          {/* Existing Roles List */}
          {roles.map((role, index) => (
            <div 
              key={role.role_id} 
              className="group flex items-center gap-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-md px-2 -ml-2"
            >
              <div className="flex-1 relative">
                {/* ContentEditable makes it feel like a document editor */}
                <p
                  contentEditable
                  suppressContentEditableWarning
                  className="outline-none text-lg text-gray-700 p-0 m-0 min-h-[1.5em] focus:bg-white focus:shadow-[inset_0_0_0_2px_rgba(59,130,246,0.5)] focus:rounded transition-all"
                  onBlur={(e) => {
                    const text = e.currentTarget.innerText;
                    if (text !== role.role_name) {
                      handleUpdate(role.role_id, text);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.currentTarget.blur(); // Triggers onBlur -> Save
                    }
                  }}
                >
                  {role.role_name}
                </p>
              </div>

              {/* Delete Action (Hidden until hover, like many editors) */}
              <button
                onClick={() => handleDelete(role.role_id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-2 rounded-md hover:bg-red-50"
                title="Delete Role"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}

          {roles.length === 0 && !isPending && (
             <div className="py-12 text-center text-gray-400 italic">
               List is empty. Start typing above...
             </div>
          )}

        </div>

      </div>
    </div>
  );
}