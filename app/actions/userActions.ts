"use server";

import { sql } from "@/app/backend/db2";

export type UserInput = {
  email: string;
  password: string;
  role_id: number;
  name: string;
  phone_number?: string;
  flat_id?: number;
};

export type UserUpdate = Partial<UserInput> & {
  id: number;
};

/* ===== USER CRUD OPERATIONS ===== */

// Get all users with role and flat info
export async function showusers() {
  try {
    const users = await sql`
      SELECT 
        u.id,
        u.email,
        u.password,
        u.role_id,
        u.name,
        u.phone_number,
        u.flat_id,
        u.created_at,
        u.updated_at,
        u.deleted_at,
        r.role_name,
        f.flat_number,
        f.floor_number
      FROM public.users u
      LEFT JOIN public.roles r ON u.role_id = r.role_id
      LEFT JOIN public.flats f ON u.flat_id = f.id
      ORDER BY u.created_at DESC
    `;
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

// Get all roles
export async function getRoles() {
  try {
    const roles = await sql`
      SELECT role_id, role_name 
      FROM public.roles 
      WHERE deleted_at IS NULL
      ORDER BY role_id
    `;
    return roles;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
}

// Get all flats
export async function getFlats() {
  try {
    const flats = await sql`
      SELECT id, flat_number, floor_number 
      FROM public.flats 
      ORDER BY floor_number, flat_number
    `;
    return flats;
  } catch (error) {
    console.error("Error fetching flats:", error);
    throw error;
  }
}

// Add new user
export async function addusers(userData: UserInput) {
  try {
    // Validate required fields
    if (!userData.email?.trim()) throw new Error("Email is required");
    if (!userData.password?.trim()) throw new Error("Password is required");
    if (!userData.name?.trim()) throw new Error("Name is required");
    if (!userData.role_id) throw new Error("Role is required");
    
    // Check if email exists
    const existingUser = await sql`
      SELECT id FROM public.users 
      WHERE email = ${userData.email.toLowerCase().trim()} 
        AND deleted_at IS NULL
    `;
    
    if (existingUser.length > 0) {
      throw new Error("User with this email already exists");
    }

    const result = await sql`
      INSERT INTO public.users (
        email, 
        password, 
        role_id, 
        name,
        phone_number,
        flat_id,
        created_at,
        updated_at
      ) VALUES (
        ${userData.email.toLowerCase().trim()},
        ${userData.password},
        ${userData.role_id},
        ${userData.name.trim()},
        ${userData.phone_number?.trim() || null},
        ${userData.flat_id || null},
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      ) RETURNING id, email, name, role_id
    `;
    
    return result[0];
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
}

// Form action for adding user
export async function addUserForm(formData: FormData) {
  try {
    const email = formData.get("email")?.toString().trim() || '';
    const password = formData.get("password")?.toString() || '';
    const name = formData.get("name")?.toString().trim() || '';
    const phone_number = formData.get("phone_number")?.toString() || '';
    const role_id_raw = formData.get("role_id");
    const flat_id_raw = formData.get("flat_id");
    
    // Validation
    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");
    if (!name) throw new Error("Name is required");
    if (!role_id_raw) throw new Error("Role is required");
    
    // Parse numbers
    const role_id = parseInt(role_id_raw.toString());
    const flat_id = flat_id_raw ? parseInt(flat_id_raw.toString()) : undefined;

    if (isNaN(role_id) || role_id <= 0) {
      throw new Error("Invalid role selected");
    }

    const result = await addusers({
      email,
      password,
      role_id,
      name,
      phone_number: phone_number || undefined,
      flat_id
    });

    return { 
      success: true, 
      data: result, 
      message: "User created successfully" 
    };
  } catch (error) {
    console.error("addUserForm error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to add user" 
    };
  }
}

// Update user
export async function updateusers({ id, ...updates }: UserUpdate) {
  try {
    // Check if user exists
    const existingUser = await sql`
      SELECT id FROM public.users 
      WHERE id = ${id} AND deleted_at IS NULL
    `;
    
    if (existingUser.length === 0) {
      throw new Error("User not found");
    }

    // Check for duplicate email
    if (updates.email) {
      const duplicateEmail = await sql`
        SELECT id FROM public.users 
        WHERE email = ${updates.email.toLowerCase().trim()} 
          AND id != ${id} 
          AND deleted_at IS NULL
      `;
      
      if (duplicateEmail.length > 0) {
        throw new Error("Email already exists");
      }
    }

    // Build update query
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.email !== undefined) {
      updateFields.push(`email = $${paramIndex}`);
      values.push(updates.email.toLowerCase().trim());
      paramIndex++;
    }
    
    if (updates.name !== undefined) {
      updateFields.push(`name = $${paramIndex}`);
      values.push(updates.name.trim());
      paramIndex++;
    }
    
    if (updates.phone_number !== undefined) {
      updateFields.push(`phone_number = $${paramIndex}`);
      values.push(updates.phone_number.trim() || null);
      paramIndex++;
    }
    
    if (updates.role_id !== undefined) {
      updateFields.push(`role_id = $${paramIndex}`);
      values.push(updates.role_id);
      paramIndex++;
    }
    
    if (updates.flat_id !== undefined) {
      updateFields.push(`flat_id = $${paramIndex}`);
      values.push(updates.flat_id || null);
      paramIndex++;
    }
    
    if (updates.password !== undefined && updates.password.trim() !== '') {
      updateFields.push(`password = $${paramIndex}`);
      values.push(updates.password);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    
    const query = `
      UPDATE public.users 
      SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${values.length} AND deleted_at IS NULL
      RETURNING id, email, name, role_id
    `;
    
    const result = await sql.unsafe(query, values);
    
    if (result.length === 0) {
      throw new Error("Failed to update user");
    }
    
    return result[0];
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

// Form action for updating user
export async function updateUserForm(formData: FormData) {
  try {
    const id_raw = formData.get("id");
    const email = formData.get("email")?.toString().trim() || '';
    const password = formData.get("password")?.toString() || '';
    const name = formData.get("name")?.toString().trim() || '';
    const phone_number = formData.get("phone_number")?.toString() || '';
    const role_id_raw = formData.get("role_id");
    const flat_id_raw = formData.get("flat_id");
    
    // Validation
    if (!id_raw) throw new Error("User ID is required");
    if (!email) throw new Error("Email is required");
    if (!name) throw new Error("Name is required");
    if (!role_id_raw) throw new Error("Role is required");
    
    // Parse numbers
    const id = parseInt(id_raw.toString());
    const role_id = parseInt(role_id_raw.toString());
    const flat_id = flat_id_raw ? parseInt(flat_id_raw.toString()) : undefined;

    if (isNaN(id) || id <= 0) throw new Error("Invalid user ID");
    if (isNaN(role_id) || role_id <= 0) throw new Error("Invalid role selected");

    const updateData: any = {
      id,
      email,
      name,
      phone_number: phone_number || undefined,
      role_id,
      flat_id
    };

    // Only update password if provided
    if (password.trim()) {
      updateData.password = password;
    }

    const result = await updateusers(updateData);

    return { 
      success: true, 
      data: result, 
      message: "User updated successfully" 
    };
  } catch (error) {
    console.error("updateUserForm error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update user" 
    };
  }
}

// Delete user (soft delete)
export async function deleteusers(id: number) {
  if (!id || id <= 0) {
    throw new Error("Invalid user ID");
  }

  try {
    const result = await sql`
      UPDATE public.users 
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND deleted_at IS NULL
      RETURNING id, email, name
    `;
    
    if (result.length === 0) {
      throw new Error("User not found or already deleted");
    }
    
    return result[0];
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

// Search users
export async function searchUsers(searchTerm: string) {
  try {
    const term = `%${searchTerm}%`;
    const users = await sql`
      SELECT 
        u.id,
        u.email,
        u.name,
        u.phone_number,
        u.role_id,
        r.role_name,
        u.flat_id,
        f.flat_number,
        u.created_at
      FROM public.users u
      LEFT JOIN public.roles r ON u.role_id = r.role_id
      LEFT JOIN public.flats f ON u.flat_id = f.id
      WHERE u.deleted_at IS NULL 
        AND (
          u.name ILIKE ${term} 
          OR u.email ILIKE ${term} 
          OR u.phone_number ILIKE ${term}
        )
      ORDER BY u.name
    `;
    return users;
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
}