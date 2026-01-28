"use server";

import { pool } from "@/app/backend/db";

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
  const client = await pool.connect();
  
  try {
    const result = await client.query(`
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
    `);
    return result.rows;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Get all roles
export async function getRoles() {
  const client = await pool.connect();
  
  try {
    const result = await client.query(`
      SELECT role_id, role_name 
      FROM public.roles 
      WHERE deleted_at IS NULL
      ORDER BY role_id
    `);
    return result.rows;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Get all flats
export async function getFlats() {
  const client = await pool.connect();
  
  try {
    const result = await client.query(`
      SELECT id, flat_number, floor_number 
      FROM public.flats 
      ORDER BY floor_number, flat_number
    `);
    return result.rows;
  } catch (error) {
    console.error("Error fetching flats:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Add new user
export async function addusers(userData: UserInput) {
  const client = await pool.connect();
  
  try {
    // Validate required fields
    if (!userData.email?.trim()) throw new Error("Email is required");
    if (!userData.password?.trim()) throw new Error("Password is required");
    if (!userData.name?.trim()) throw new Error("Name is required");
    if (!userData.role_id) throw new Error("Role is required");
    
    // Check if email exists
    const existingUser = await client.query(
      `SELECT id FROM public.users 
       WHERE email = $1 AND deleted_at IS NULL`,
      [userData.email.toLowerCase().trim()]
    );
    
    if (existingUser.rows.length > 0) {
      throw new Error("User with this email already exists");
    }

    const result = await client.query(
      `INSERT INTO public.users (
        email, 
        password, 
        role_id, 
        name,
        phone_number,
        flat_id,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, email, name, role_id`,
      [
        userData.email.toLowerCase().trim(),
        userData.password,
        userData.role_id,
        userData.name.trim(),
        userData.phone_number?.trim() || null,
        userData.flat_id || null
      ]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  } finally {
    client.release();
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
  const client = await pool.connect();
  
  try {
    // Check if user exists
    const existingUser = await client.query(
      `SELECT id FROM public.users 
       WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );
    
    if (existingUser.rows.length === 0) {
      throw new Error("User not found");
    }

    // Check for duplicate email
    if (updates.email) {
      const duplicateEmail = await client.query(
        `SELECT id FROM public.users 
         WHERE email = $1 AND id != $2 AND deleted_at IS NULL`,
        [updates.email.toLowerCase().trim(), id]
      );
      
      if (duplicateEmail.rows.length > 0) {
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
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING id, email, name, role_id
    `;
    
    const result = await client.query(query, values);
    
    if (result.rows.length === 0) {
      throw new Error("Failed to update user");
    }
    
    return result.rows[0];
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  } finally {
    client.release();
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

  const client = await pool.connect();
  
  try {
    const result = await client.query(
      `UPDATE public.users 
       SET deleted_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id, email, name`,
      [id]
    );
    
    if (result.rows.length === 0) {
      throw new Error("User not found or already deleted");
    }
    
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Search users
export async function searchUsers(searchTerm: string) {
  const client = await pool.connect();
  
  try {
    const term = `%${searchTerm}%`;
    const result = await client.query(
      `SELECT 
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
          u.name ILIKE $1 
          OR u.email ILIKE $1 
          OR u.phone_number ILIKE $1
        )
      ORDER BY u.name`,
      [term]
    );
    return result.rows;
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  } finally {
    client.release();
  }
}