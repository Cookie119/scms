"use server";
import {sql} from "@/app/backend/db2";

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

  try {
    const data = await sql`
      INSERT INTO entry_register
      (visitor_name, visitor_contact_no, visitor_type, purpose, security_user_id, status)
      VALUES
      (${visitor_name}, ${visitor_contact_no}, ${visitor_type}, ${purpose}, ${userId}, 'IN')
      RETURNING *
    `;
    console.log("DEBUG: Entry created:", data?.[0]);
    return data;
  } catch (error) {
    console.error("DEBUG: Error in addEntry:", error);
    throw error;
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

  try {
    const data = await sql`
      UPDATE entry_register
      SET exit_time = NOW(), status = 'OUT'
      WHERE entry_id = ${entry_id} AND status = 'IN'
      RETURNING *
    `;
    
    if (data.length === 0) {
      throw new Error("Entry not found or visitor already checked out");
    }
    
    console.log("DEBUG: Visitor exited:", data[0]);
    return data[0];
  } catch (error) {
    console.error("DEBUG: Error in markVisitorExit:", error);
    throw error;
  }
}

/* Show All Entries */
export async function showEntries() {
  try {
    const data = await sql`
      SELECT 
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
      ORDER BY entry_time DESC
    `;
    return data;
  } catch (error) {
    console.error("DEBUG: Error in showEntries:", error);
    throw error;
  }
}

/* Get Visitors Currently IN */
export async function getVisitorsIn() {
  try {
    const data = await sql`
      SELECT * FROM entry_register 
      WHERE status = 'IN' 
      ORDER BY entry_time DESC
    `;
    return data;
  } catch (error) {
    console.error("DEBUG: Error in getVisitorsIn:", error);
    throw error;
  }
}

/* Get Entry by ID */
export async function getEntryById(entry_id: number) {
  if (!entry_id || entry_id <= 0) {
    throw new Error("Invalid entry ID");
  }

  try {
    const data = await sql`
      SELECT * FROM entry_register 
      WHERE entry_id = ${entry_id}
    `;
    
    if (data.length === 0) {
      throw new Error("Entry not found");
    }
    
    return data[0];
  } catch (error) {
    console.error("DEBUG: Error in getEntryById:", error);
    throw error;
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

  try {
    // Build dynamic update query
    const updateFields: string[] = [];
    const values: any[] = [];
    
    if (updates.visitor_name !== undefined) {
      updateFields.push("visitor_name = $1");
      values.push(updates.visitor_name);
    }
    if (updates.visitor_contact_no !== undefined) {
      updateFields.push("visitor_contact_no = $2");
      values.push(updates.visitor_contact_no);
    }
    if (updates.visitor_type !== undefined) {
      updateFields.push("visitor_type = $3");
      values.push(updates.visitor_type);
    }
    if (updates.purpose !== undefined) {
      updateFields.push("purpose = $4");
      values.push(updates.purpose);
    }
    if (updates.security_user_id !== undefined) {
      updateFields.push("security_user_id = $5");
      values.push(updates.security_user_id);
    }
    
    if (updateFields.length === 0) {
      throw new Error("No fields to update");
    }
    
    values.push(entry_id);
    
    const query = `
      UPDATE entry_register 
      SET ${updateFields.join(", ")} 
      WHERE entry_id = $${values.length} AND status = 'IN'
      RETURNING *
    `;
    
    const data = await sql.unsafe(query, values);
    
    if (data.length === 0) {
      throw new Error("Entry not found or visitor already checked out");
    }
    
    return data[0];
  } catch (error) {
    console.error("DEBUG: Error in updateEntry:", error);
    throw error;
  }
}

/* Get Today's Entries */
export async function getTodaysEntries() {
  try {
    const data = await sql`
      SELECT * FROM entry_register 
      WHERE DATE(entry_time) = CURRENT_DATE
      ORDER BY entry_time DESC
    `;
    return data;
  } catch (error) {
    console.error("DEBUG: Error in getTodaysEntries:", error);
    throw error;
  }
}

/* Search Entries by Name or Contact */
export async function searchEntries(searchTerm: string) {
  if (!searchTerm?.trim()) {
    return showEntries();
  }

  try {
    const term = `%${searchTerm}%`;
    const data = await sql`
      SELECT * FROM entry_register 
      WHERE 
        visitor_name ILIKE ${term} OR
        visitor_contact_no ILIKE ${term}
      ORDER BY entry_time DESC
    `;
    return data;
  } catch (error) {
    console.error("DEBUG: Error in searchEntries:", error);
    throw error;
  }
}

/* Get Entry Statistics */
export async function getEntryStats() {
  try {
    const data = await sql`
      SELECT 
        COUNT(*) as total_entries,
        COUNT(CASE WHEN status = 'IN' THEN 1 END) as visitors_in,
        COUNT(CASE WHEN status = 'OUT' THEN 1 END) as visitors_out,
        COUNT(DISTINCT visitor_type) as unique_visitor_types
      FROM entry_register
      WHERE DATE(entry_time) = CURRENT_DATE
    `;
    return data[0];
  } catch (error) {
    console.error("DEBUG: Error in getEntryStats:", error);
    throw error;
  }
}