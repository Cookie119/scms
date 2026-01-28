import { NextResponse } from 'next/server';
import { pool } from '@/app/backend/db';

export async function GET() {
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      "SELECT category_id, category_name FROM categories ORDER BY category_name"
    );
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}