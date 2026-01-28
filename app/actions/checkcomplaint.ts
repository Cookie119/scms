"use server";


import { headers } from "next/headers";
import {sql} from "@/app/backend/db2";
import { revalidatePath } from "next/cache";

export async function checkComplaintAction(formData: FormData) {
  try {
    // Get session to check if user is admin/staff
    // const session = await auth.api.getSession({
    //   headers: await headers(),
    // });

    // if (!session?.user?.id) {
    //   return {
    //     success: false,
    //     message: "Authentication required"
    //   };
    // }

    // Extract form data
    const complaintId = Number(formData.get("complaintId"));
    const isReal = formData.get("isReal") === "true"; // "true" or "false" string
    const newStatusId = Number(formData.get("statusId")); // Now using status_id (number)
    const resolutionNotes = formData.get("resolutionNotes") as string || null;

    // Validate inputs
    if (!complaintId || complaintId <= 0) {
      return {
        success: false,
        message: "Invalid complaint ID"
      };
    }

    if (!newStatusId || newStatusId <= 0) {
      return {
        success: false,
        message: "Invalid status selected"
      };
    }

    // Check if user has permission (admin/staff)
    // const [userRole] = await sql`
    //   SELECT r.role_name 
    //   FROM "user" u
    //   JOIN roles r ON u.role_id = r.role_id
    //   WHERE u.id = ${session.user.id}
    //   AND r.role_name IN ('admin', 'staff')
    // `;

    // if (!userRole) {
    //   return {
    //     success: false,
    //     message: "Only admin or staff can check complaints"
    //   };
    // }

    // Check if complaint exists and is not deleted
    const [existingComplaint] = await sql`
      SELECT status_id 
      FROM complaints 
      WHERE complaint_id = ${complaintId}
      AND deleted_at IS NULL
    `;

    if (!existingComplaint) {
      return {
        success: false,
        message: "Complaint not found or already deleted"
      };
    }

    // Update the complaint with new status and verification
    await sql`
      UPDATE complaints 
      SET 
        status_id = ${newStatusId},
        is_real_or_not_check = ${isReal ? 1 : 2}, -- 1=real, 2=fake
        checked_at = NOW(),
        updated_at = NOW(),
        resolution_notes = ${resolutionNotes},
        resolved_at = ${newStatusId === 2 ? new Date() : null} -- Assuming status_id 2 = resolved
      WHERE complaint_id = ${complaintId}
    `;

    // Revalidate paths to update UI
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/checkcomplaint/${complaintId}`);
    revalidatePath("/admin/complaints");

    return {
      success: true,
      message: `Complaint ${isReal ? 'verified' : 'marked as fake'} and status updated`
    };

  } catch (error) {
    console.error("Error checking complaint:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update complaint"
    };
  }
}

// Get complaint details for the check page
export async function getComplaintDetails(complaintId: number) {
  try {
    const complaint = await sql`
      SELECT 
        c.complaint_id,
        c.title,
        c.description,
        c.status_id,
        c.priority_request,
        c.created_at,
        c.is_real_or_not_check,
        c.checked_at,
        c.resolution_notes,
        c.assigned_to,
        u.name as user_name,
        u.email as user_email,
        cat.category_name,
        ru.name as resolved_by_name,
        s.status_name
      FROM complaints c
      LEFT JOIN "user" u ON c.user_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.category_id
      LEFT JOIN "user" ru ON c.resolved_by = ru.id
      LEFT JOIN statuses s ON c.status_id = s.status_id
      WHERE c.complaint_id = ${complaintId}
      AND c.deleted_at IS NULL
    `;

    if (!complaint || complaint.length === 0) {
      return null;
    }

    return complaint[0];
  } catch (error) {
    console.error("Error fetching complaint details:", error);
    return null;
  }
}

// Get all complaints for admin review
export async function getComplaintsForReview() {
  try {
    const complaints = await sql`
      SELECT 
        c.complaint_id,
        c.title,
        c.description,
        c.status_id,
        c.priority_request,
        c.created_at,
        c.is_real_or_not_check,
        c.assigned_to,
        u.name as user_name,
        cat.category_name,
        s.status_name
      FROM complaints c
      LEFT JOIN "user" u ON c.user_id = u.id
      LEFT JOIN categories cat ON c.category_id = cat.category_id
      LEFT JOIN statuses s ON c.status_id = s.status_id
      WHERE c.deleted_at IS NULL
      AND c.status_id IN (1, 3) -- Assuming 1=pending, 3=in_review
      ORDER BY 
        CASE 
          WHEN c.priority_request = 4 THEN 1
          WHEN c.priority_request = 3 THEN 2
          WHEN c.priority_request = 2 THEN 3
          ELSE 4
        END,
        c.created_at ASC
      LIMIT 50
    `;

    return complaints;
  } catch (error) {
    console.error("Error fetching complaints for review:", error);
    return [];
  }
}

// Get all statuses for dropdown
export async function getStatuses() {
  try {
    const statuses = await sql`
      SELECT status_id, status_name 
      FROM statuses 
      ORDER BY status_id
    `;
    return statuses;
  } catch (error) {
    console.error("Error fetching statuses:", error);
    return [];
  }
}