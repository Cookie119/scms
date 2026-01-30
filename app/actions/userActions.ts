"use server";

import { pool } from "@/app/backend/db";
import bcrypt from 'bcrypt';

// Set salt rounds for password hashing
const SALT_ROUNDS = 10;

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

/* ===== PASSWORD HELPER FUNCTIONS ===== */

// Hash password
async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// Verify password
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Check if password needs re-hashing (if using older hash)
async function needsRehash(password: string): Promise<boolean> {
  // Check if password is already hashed
  const bcryptHashRegex = /^\$2[aby]\$[0-9]{2}\$[./A-Za-z0-9]{53}$/;
  return !bcryptHashRegex.test(password);
}

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
    
    // Remove password from response for security
    const usersWithoutPasswords = result.rows.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    return usersWithoutPasswords;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Get user by email for authentication
export async function getUserByEmail(email: string) {
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      `SELECT 
        u.id,
        u.email,
        u.password,
        u.role_id,
        u.name,
        u.phone_number,
        u.flat_id,
        r.role_name
      FROM public.users u
      LEFT JOIN public.roles r ON u.role_id = r.role_id
      WHERE u.email = $1 AND u.deleted_at IS NULL`,
      [email.toLowerCase().trim()]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Get user by ID
export async function getUserById(id: number) {
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      `SELECT 
        u.id,
        u.email,
        u.role_id,
        u.name,
        u.phone_number,
        u.flat_id,
        u.created_at,
        u.updated_at,
        r.role_name,
        f.flat_number,
        f.floor_number
      FROM public.users u
      LEFT JOIN public.roles r ON u.role_id = r.role_id
      LEFT JOIN public.flats f ON u.flat_id = f.id
      WHERE u.id = $1 AND u.deleted_at IS NULL`,
      [id]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
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

// Add new user with password hashing
export async function addusers(userData: UserInput) {
  const client = await pool.connect();
  
  try {
    // Validate required fields
    if (!userData.email?.trim()) throw new Error("Email is required");
    if (!userData.password?.trim()) throw new Error("Password is required");
    if (!userData.name?.trim()) throw new Error("Name is required");
    if (!userData.role_id) throw new Error("Role is required");
    
    // Validate password strength
    if (userData.password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
    
    // Check if email exists
    const existingUser = await client.query(
      `SELECT id FROM public.users 
       WHERE email = $1 AND deleted_at IS NULL`,
      [userData.email.toLowerCase().trim()]
    );
    
    if (existingUser.rows.length > 0) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

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
      RETURNING id, email, name, role_id, created_at`,
      [
        userData.email.toLowerCase().trim(),
        hashedPassword,
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

// Update user with password hashing
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
      // Validate new password strength
      if (updates.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }
      
      // Hash new password
      const hashedPassword = await hashPassword(updates.password);
      updateFields.push(`password = $${paramIndex}`);
      values.push(hashedPassword);
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
      RETURNING id, email, name, role_id, updated_at
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

// Verify user credentials for login
export async function verifyCredentials(email: string, password: string) {
  const client = await pool.connect();
  
  try {
    // Get user with password
    const result = await client.query(
      `SELECT 
        u.id,
        u.email,
        u.password,
        u.role_id,
        u.name,
        r.role_name
      FROM public.users u
      LEFT JOIN public.roles r ON u.role_id = r.role_id
      WHERE u.email = $1 AND u.deleted_at IS NULL`,
      [email.toLowerCase().trim()]
    );
    
    if (result.rows.length === 0) {
      return { success: false, error: "Invalid email or password" };
    }
    
    const user = result.rows[0];
    
    // Verify password
    const passwordMatches = await verifyPassword(password, user.password);
    
    if (!passwordMatches) {
      return { success: false, error: "Invalid email or password" };
    }
    
    // Check if password needs re-hashing (for older hashes)
    if (await needsRehash(user.password)) {
      const newHashedPassword = await hashPassword(password);
      
      // Update password in database
      await client.query(
        `UPDATE public.users 
         SET password = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [newHashedPassword, user.id]
      );
    }
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    return { 
      success: true, 
      user: userWithoutPassword 
    };
  } catch (error) {
    console.error("Error verifying credentials:", error);
    return { 
      success: false, 
      error: "Authentication failed" 
    };
  } finally {
    client.release();
  }
}

// Get user statistics
export async function getUserStats() {
  const client = await pool.connect();
  
  try {
    // Get total users
    const totalUsersResult = await client.query(
      `SELECT COUNT(*) as count FROM public.users WHERE deleted_at IS NULL`
    );
    
    // Get users by role
    const usersByRoleResult = await client.query(`
      SELECT 
        r.role_name,
        COUNT(u.id) as count
      FROM public.roles r
      LEFT JOIN public.users u ON r.role_id = u.role_id AND u.deleted_at IS NULL
      WHERE r.deleted_at IS NULL
      GROUP BY r.role_id, r.role_name
      ORDER BY r.role_id
    `);
    
    // Get recent users (last 30 days)
    const recentUsersResult = await client.query(
      `SELECT COUNT(*) as count 
       FROM public.users 
       WHERE created_at >= CURRENT_DATE - INTERVAL '30 days' 
       AND deleted_at IS NULL`
    );
    
    return {
      totalUsers: parseInt(totalUsersResult.rows[0].count) || 0,
      usersByRole: usersByRoleResult.rows,
      recentUsers: parseInt(recentUsersResult.rows[0].count) || 0
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Get dashboard statistics (for your stat cards)
export async function getDashboardStats() {
  const client = await pool.connect();
  
  try {
    // Get total complaints
    const totalComplaintsResult = await client.query(
      `SELECT COUNT(*) as count FROM public.complaints WHERE deleted_at IS NULL`
    );
    
    // Get active users (users with recent activity or status active)
    const activeUsersResult = await client.query(
      `SELECT COUNT(DISTINCT u.id) as count
       FROM public.users u
       WHERE u.deleted_at IS NULL 
       AND (u.last_login_at >= CURRENT_DATE - INTERVAL '30 days' OR u.last_login_at IS NULL)`
    );
    
    // Get total categories
    const totalCategoriesResult = await client.query(
      `SELECT COUNT(*) as count FROM public.categories WHERE deleted_at IS NULL`
    );
    
    // Get total users
    const totalUsersResult = await client.query(
      `SELECT COUNT(*) as count FROM public.users WHERE deleted_at IS NULL`
    );
    
    // Get pending complaints
    const pendingComplaintsResult = await client.query(
      `SELECT COUNT(*) as count 
       FROM public.complaints 
       WHERE status = 'pending' AND deleted_at IS NULL`
    );
    
    // Get in progress complaints
    const inProgressComplaintsResult = await client.query(
      `SELECT COUNT(*) as count 
       FROM public.complaints 
       WHERE status = 'in_progress' AND deleted_at IS NULL`
    );
    
    // Get resolved complaints
    const resolvedComplaintsResult = await client.query(
      `SELECT COUNT(*) as count 
       FROM public.complaints 
       WHERE status = 'resolved' AND deleted_at IS NULL`
    );
    
    // Get high priority complaints
    const highPriorityComplaintsResult = await client.query(
      `SELECT COUNT(*) as count 
       FROM public.complaints 
       WHERE priority = 'high' AND deleted_at IS NULL`
    );
    
    return {
      totalComplaints: parseInt(totalComplaintsResult.rows[0].count) || 0,
      totalRegisterCount: parseInt(activeUsersResult.rows[0].count) || 0,
      totalCategory: parseInt(totalCategoriesResult.rows[0].count) || 0,
      totalUsers: parseInt(totalUsersResult.rows[0].count) || 0,
      pendingComplaints: parseInt(pendingComplaintsResult.rows[0].count) || 0,
      inProgressComplaints: parseInt(inProgressComplaintsResult.rows[0].count) || 0,
      resolvedComplaints: parseInt(resolvedComplaintsResult.rows[0].count) || 0,
      highPriorityComplaints: parseInt(highPriorityComplaintsResult.rows[0].count) || 0,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  } finally {
    client.release();
  }
}