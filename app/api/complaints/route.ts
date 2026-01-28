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

    // Upload images
    const imageUrls: string[] = [];
    
    for (const file of files) {
      if (!file.size) continue;
      
      const blob = await put(file.name, file, {
        access: 'public',
        addRandomSuffix: true,
      });
      
      imageUrls.push(blob.url);
    }

    // Insert into DB
    const client = await pool.connect();
    
    try {
      await client.query(
        `INSERT INTO complaints 
         (user_id, category_id, title, description, priority_request, images)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [user_id, category_id, title, description, priority, imageUrls]
      );
    } finally {
      client.release();
    }

    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('Error submitting complaint:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}