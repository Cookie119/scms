"use server";
import { pool } from "@/app/backend/db"; // Your pg pool import

export type EntryInput = {
  visitor_name: string;
  visitor_contact_no?: string;
  visitor_type: string;
  purpose?: string;
  security_user_id?: number;
};

export type EntryStatus = 'IN' | 'OUT';

/* Add Visitor Entry */
export async function addEntry({ 
  visitor_name, 
  visitor_contact_no, 
  visitor_type, 
  purpose, 
  security_user_id 
}: EntryInput) {
  console.log("DEBUG: addEntry() called");

  // Use a placeholder ID if none provided
  const userId = security_user_id ?? 0;
  const client = await pool.connect();

  try {
    const result = await client.query(
      `INSERT INTO entry_register
      (visitor_name, visitor_contact_no, visitor_type, purpose, security_user_id, status)
      VALUES
      ($1, $2, $3, $4, $5, 'IN')
      RETURNING *`,
      [visitor_name, visitor_contact_no, visitor_type, purpose, userId]
    );
    
    console.log("DEBUG: Entry created:", result.rows[0]);
    return result.rows;
  } catch (error) {
    console.error("DEBUG: Error in addEntry:", error);
    throw error;
  } finally {
    client.release();
  }
}

/* Form Action */
export async function addEntryForm(formData: FormData) {
  console.log("DEBUG: addEntryForm() called");

  try {
    const visitor_name = formData.get("visitor_name")?.toString().trim() || '';
    const visitor_contact_no = formData.get("visitor_contact_no")?.toString() || '';
    const visitor_type = formData.get("visitor_type")?.toString().trim() || '';
    const purpose = formData.get("purpose")?.toString() || '';
    const security_user_id_raw = formData.get("security_user_id");
    const security_user_id = security_user_id_raw ? Number(security_user_id_raw) : undefined;

    // Validation
    if (!visitor_name) throw new Error("Visitor name is required");
    if (!visitor_type) throw new Error("Visitor type is required");

    const result = await addEntry({ 
      visitor_name, 
      visitor_contact_no, 
      visitor_type, 
      purpose, 
      security_user_id 
    });

    return { 
      success: true, 
      data: result, 
      message: "Visitor entry recorded successfully" 
    };
  } catch (error) {
    console.error("DEBUG: addEntryForm error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to add entry" 
    };
  }
}

/* Mark Exit */
export async function markVisitorExit(entry_id: number) {
  console.log("DEBUG: markVisitorExit() called with:", entry_id);
  
  if (!entry_id || entry_id <= 0) {
    throw new Error("Invalid entry ID");
  }

  const client = await pool.connect();

  try {
    const result = await client.query(
      `UPDATE entry_register
      SET exit_time = NOW(), status = 'OUT'
      WHERE entry_id = $1 AND status = 'IN'
      RETURNING *`,
      [entry_id]
    );
    
    if (result.rows.length === 0) {
      throw new Error("Entry not found or visitor already checked out");
    }
    
    console.log("DEBUG: Visitor exited:", result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error("DEBUG: Error in markVisitorExit:", error);
    throw error;
  } finally {
    client.release();
  }
}

/* Show All Entries */
export async function showEntries() {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT 
        entry_id,
        visitor_name,
        visitor_contact_no,
        visitor_type,
        purpose,
        entry_time,
        exit_time,
        security_user_id,
        status
      FROM entry_register 
      ORDER BY entry_time DESC`
    );
    return result.rows;
  } catch (error) {
    console.error("DEBUG: Error in showEntries:", error);
    throw error;
  } finally {
    client.release();
  }
}

/* Get Visitors Currently IN */
export async function getVisitorsIn() {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT * FROM entry_register 
      WHERE status = 'IN' 
      ORDER BY entry_time DESC`
    );
    return result.rows;
  } catch (error) {
    console.error("DEBUG: Error in getVisitorsIn:", error);
    throw error;
  } finally {
    client.release();
  }
}

/* Get Entry by ID */
export async function getEntryById(entry_id: number) {
  if (!entry_id || entry_id <= 0) {
    throw new Error("Invalid entry ID");
  }

  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT * FROM entry_register 
      WHERE entry_id = $1`,
      [entry_id]
    );
    
    if (result.rows.length === 0) {
      throw new Error("Entry not found");
    }
    
    return result.rows[0];
  } catch (error) {
    console.error("DEBUG: Error in getEntryById:", error);
    throw error;
  } finally {
    client.release();
  }
}

/* Update Entry (only if visitor is still IN) */
export async function updateEntry(
  entry_id: number, 
  updates: Partial<EntryInput>
) {
  if (!entry_id || entry_id <= 0) {
    throw new Error("Invalid entry ID");
  }

  const client = await pool.connect();

  try {
    // Build dynamic update query
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    if (updates.visitor_name !== undefined) {
      updateFields.push(`visitor_name = $${paramIndex}`);
      values.push(updates.visitor_name);
      paramIndex++;
    }
    if (updates.visitor_contact_no !== undefined) {
      updateFields.push(`visitor_contact_no = $${paramIndex}`);
      values.push(updates.visitor_contact_no);
      paramIndex++;
    }
    if (updates.visitor_type !== undefined) {
      updateFields.push(`visitor_type = $${paramIndex}`);
      values.push(updates.visitor_type);
      paramIndex++;
    }
    if (updates.purpose !== undefined) {
      updateFields.push(`purpose = $${paramIndex}`);
      values.push(updates.purpose);
      paramIndex++;
    }
    if (updates.security_user_id !== undefined) {
      updateFields.push(`security_user_id = $${paramIndex}`);
      values.push(updates.security_user_id);
      paramIndex++;
    }
    
    if (updateFields.length === 0) {
      throw new Error("No fields to update");
    }
    
    values.push(entry_id);
    
    const query = `
      UPDATE entry_register 
      SET ${updateFields.join(", ")} 
      WHERE entry_id = $${paramIndex} AND status = 'IN'
      RETURNING *
    `;
    
    const result = await client.query(query, values);
    
    if (result.rows.length === 0) {
      throw new Error("Entry not found or visitor already checked out");
    }
    
    return result.rows[0];
  } catch (error) {
    console.error("DEBUG: Error in updateEntry:", error);
    throw error;
  } finally {
    client.release();
  }
}

/* Get Today's Entries */
export async function getTodaysEntries() {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT * FROM entry_register 
      WHERE DATE(entry_time) = CURRENT_DATE
      ORDER BY entry_time DESC`
    );
    return result.rows;
  } catch (error) {
    console.error("DEBUG: Error in getTodaysEntries:", error);
    throw error;
  } finally {
    client.release();
  }
}

/* Search Entries by Name or Contact */
export async function searchEntries(searchTerm: string) {
  if (!searchTerm?.trim()) {
    return showEntries();
  }

  const client = await pool.connect();

  try {
    const term = `%${searchTerm}%`;
    const result = await client.query(
      `SELECT * FROM entry_register 
      WHERE 
        visitor_name ILIKE $1 OR
        visitor_contact_no ILIKE $2
      ORDER BY entry_time DESC`,
      [term, term]
    );
    return result.rows;
  } catch (error) {
    console.error("DEBUG: Error in searchEntries:", error);
    throw error;
  } finally {
    client.release();
  }
}

/* Get Entry Statistics */
export async function getEntryStats() {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT 
        COUNT(*) as total_entries,
        COUNT(CASE WHEN status = 'IN' THEN 1 END) as visitors_in,
        COUNT(CASE WHEN status = 'OUT' THEN 1 END) as visitors_out,
        COUNT(DISTINCT visitor_type) as unique_visitor_types
      FROM entry_register
      WHERE DATE(entry_time) = CURRENT_DATE`
    );
    return result.rows[0];
  } catch (error) {
    console.error("DEBUG: Error in getEntryStats:", error);
    throw error;
  } finally {
    client.release();
  }
}