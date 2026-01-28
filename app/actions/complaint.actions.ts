"use server";

import { put } from '@vercel/blob';
import { pool } from "@/app/backend/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

// Validation helper
function validateComplaint(data: {
  title: string;
  description: string;
  category_id: number;
  priority: string;
}) {
  if (!data.title?.trim()) throw new Error("Title is required");
  if (!data.description?.trim()) throw new Error("Description is required");
  if (!data.category_id || data.category_id <= 0) throw new Error("Category is required");
  if (!["low", "medium", "high"].includes(data.priority)) {
    throw new Error("Invalid priority");
  }
}

export async function addComplaint(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user_id = Number(session.user.id);
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category_id = Number(formData.get("category_id"));
  const priority = formData.get("priority") as string;

  // Validate input
  validateComplaint({ title, description, category_id, priority });

  // 🔹 Upload images to Vercel Blob
  const files = formData.getAll("images") as File[];
  const imageUrls: string[] = [];

  // Only process if there are actual files
  if (files.length > 0 && files[0].size > 0) {
    // Upload up to 5 images (limit as needed)
    const filesToUpload = files.slice(0, 5);
    
    const uploadPromises = filesToUpload.map(async (file) => {
      if (!file || file.size === 0) return null;
      
      try {
        const blob = await put(`complaints/${Date.now()}-${file.name}`, file, {
          access: 'public',
          addRandomSuffix: true,
        });
        return blob.url;
      } catch (error) {
        console.error("Failed to upload file:", file.name, error);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    imageUrls.push(...results.filter((url): url is string => url !== null));
  }

  // 🔹 INSERT INTO DATABASE
  const client = await pool.connect();
  
  try {
    await client.query(
      `
      INSERT INTO complaints
        (user_id, category_id, title, description, priority_request, images, created_at)
      VALUES
        ($1, $2, $3, $4, $5, $6, NOW())
      `,
      [
        user_id,
        category_id,
        title.trim(),
        description.trim(),
        priority,
        imageUrls,
      ]
    );
  } finally {
    client.release();
  }

  redirect('/dashboard/user');
}

// Add this function in the same file
export async function getCategories() {
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      "SELECT category_id, category_name FROM categories ORDER BY category_name"
    );
    return result.rows;
  } finally {
    client.release();
  }
}