"use server";

import { pool } from "@/app/backend/db";

export async function getDashboardStats() {
  const client = await pool.connect();
  
  try {
    // Get table names from your schema to check what exists
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const tables = tableCheck.rows.map(row => row.table_name);
    
    // Fetch stats based on available tables
    const queries = [];
    
    // Always fetch these if tables exist
    if (tables.includes('complaints')) {
      queries.push(client.query(`SELECT COUNT(*) as count FROM public.complaints WHERE deleted_at IS NULL`));
      queries.push(client.query(`SELECT COUNT(*) as count FROM public.complaints WHERE status = 'pending' AND deleted_at IS NULL`));
      queries.push(client.query(`SELECT COUNT(*) as count FROM public.complaints WHERE status = 'resolved' AND deleted_at IS NULL`));
      queries.push(client.query(`SELECT COUNT(*) as count FROM public.complaints WHERE status = 'in_progress' AND deleted_at IS NULL`));
      queries.push(client.query(`SELECT COUNT(*) as count FROM public.complaints WHERE priority = 'high' AND deleted_at IS NULL`));
    } else {
      // Add dummy queries to maintain array length
      for (let i = 0; i < 5; i++) {
        queries.push(Promise.resolve({ rows: [{ count: "0" }] }));
      }
    }
    
    if (tables.includes('users')) {
      queries.push(client.query(`SELECT COUNT(*) as count FROM public.users WHERE deleted_at IS NULL`));
    } else {
      queries.push(Promise.resolve({ rows: [{ count: "0" }] }));
    }
    
    if (tables.includes('categories')) {
      queries.push(client.query(`SELECT COUNT(*) as count FROM public.categories WHERE deleted_at IS NULL`));
    } else {
      queries.push(Promise.resolve({ rows: [{ count: "0" }] }));
    }
    
    // Check for entry_register or maintenance_logs or similar
    let entryRegisterQuery = Promise.resolve({ rows: [{ count: "0" }] });
    if (tables.includes('entry_register')) {
      entryRegisterQuery = client.query(`SELECT COUNT(*) as count FROM public.entry_register WHERE deleted_at IS NULL`);
    } else if (tables.includes('maintenance_logs')) {
      entryRegisterQuery = client.query(`SELECT COUNT(*) as count FROM public.maintenance_logs WHERE deleted_at IS NULL`);
    } else if (tables.includes('visitor_logs')) {
      entryRegisterQuery = client.query(`SELECT COUNT(*) as count FROM public.visitor_logs WHERE deleted_at IS NULL`);
    }
    queries.push(entryRegisterQuery);
    
    // Execute all queries
    const results = await Promise.all(queries);
    
    // Parse results - adjust indexes based on query order above
    let index = 0;
    const stats = {
      totalComplaints: tables.includes('complaints') ? parseInt(results[index++].rows[0]?.count || "0") : 0,
      pendingComplaints: tables.includes('complaints') ? parseInt(results[index++].rows[0]?.count || "0") : 0,
      resolvedComplaints: tables.includes('complaints') ? parseInt(results[index++].rows[0]?.count || "0") : 0,
      inProgressComplaints: tables.includes('complaints') ? parseInt(results[index++].rows[0]?.count || "0") : 0,
      highPriorityComplaints: tables.includes('complaints') ? parseInt(results[index++].rows[0]?.count || "0") : 0,
      totalUsers: tables.includes('users') ? parseInt(results[index++].rows[0]?.count || "0") : 0,
      totalCategories: tables.includes('categories') ? parseInt(results[index++].rows[0]?.count || "0") : 0,
      totalEntryRegister: parseInt(results[index].rows[0]?.count || "0")
    };

    return {
      success: true,
      data: stats
    };
    
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    
    // Return fallback data
    return {
      success: false,
      error: "Failed to fetch dashboard statistics",
      data: {
        totalComplaints: 142,
        totalUsers: 89,
        totalCategories: 24,
        totalEntryRegister: 56,
        pendingComplaints: 42,
        resolvedComplaints: 78,
        inProgressComplaints: 22,
        highPriorityComplaints: 15
      }
    };
  } finally {
    client.release();
  }
}