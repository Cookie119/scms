"use client"
import { addCategory } from "../actions/category";
import { getRoles } from "../actions/role";

export default async function AddCategoryPage() {
  const roles = await getRoles();

  return (
    <form action={addCategory} className="space-y-4">
      <input
        type="text"
        name="category_name"
        placeholder="Category name"
        required
        className="border p-2"
      />

      <select
        name="handler_role_id"
        required
        className="border p-2"
      >
        <option value="">Select handler role</option>
        {roles.map((role: any) => (
          <option key={role.role_id} value={role.role_id}>
            {role.role_name}
          </option>
        ))}
      </select>

      <button type="submit" className="bg-black text-white px-4 py-2">
        Add Category
      </button>
    </form>
  );
}
