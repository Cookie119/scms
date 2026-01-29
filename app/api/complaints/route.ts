import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { pool } from '@/app/backend/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const user_id = Number(session.user.id);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category_id = Number(formData.get('category_id'));
    const priority = formData.get('priority') as string;
    const files = formData.getAll('images') as File[];

    // Validate
    if (!['low', 'medium', 'high'].includes(priority)) {
      return NextResponse.json({ error: 'Invalid priority' }, { status: 400 });
    }

    // Get user's flat_id from users table
    const client = await pool.connect();
    let flat_id: number | null = null;
    
    try {
      // Get user's flat_id
      const userResult = await client.query(
        `SELECT flat_id FROM users WHERE id = $1 AND deleted_at IS NULL`,
        [user_id]
      );
      
      if (userResult.rows.length > 0) {
        flat_id = userResult.rows[0].flat_id;
        console.log(`User ${user_id} has flat_id: ${flat_id}`);
      }
    } catch (error) {
      console.error("Error fetching user flat_id:", error);
      // Continue without flat_id
    }

    // Upload images
    const imageUrls: string[] = [];
    
    for (const file of files) {
      if (!file.size) continue;
      
      const blob = await put(`complaints/${Date.now()}-${file.name}`, file, {
        access: 'public',
        addRandomSuffix: true,
      });
      
      imageUrls.push(blob.url);
    }

    // Insert into DB with flat_id
    try {
      await client.query(
        `INSERT INTO complaints 
         (user_id, category_id, title, description, priority_request, images, flat_id, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [user_id, category_id, title, description, priority, imageUrls, flat_id]
      );
    } finally {
      client.release();
    }

    return NextResponse.json({ 
      success: true,
      message: `Complaint submitted successfully${flat_id ? ' with flat reference' : ''}`
    });
    
  } catch (error: any) {
    console.error('Error submitting complaint:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add GET endpoint to fetch user's flat info (optional)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `
        SELECT 
          f.flat_number,
          f.floor_number
        FROM users u
        LEFT JOIN flats f ON u.flat_id = f.id
        WHERE u.id = $1 AND u.deleted_at IS NULL
        `,
        [session.user.id]
      );

      return NextResponse.json(result.rows[0] || null);
    } finally {
      client.release();
    }
    
  } catch (error: any) {
    console.error('Error fetching flat info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flat info' },
      { status: 500 }
    );
  }
}