import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/app/backend/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);
    const client = await pool.connect();

    try {
      // Get total assigned to current user
      const assignedResult = await client.query(
        `SELECT COUNT(*) as count 
         FROM public.complaints 
         WHERE assigned_to = $1 AND deleted_at IS NULL`,
        [userId]
      );

      // Get in-progress complaints (status_id = 2)
      const inProgressResult = await client.query(
        `SELECT COUNT(*) as count 
         FROM public.complaints 
         WHERE assigned_to = $1 AND status_id = 1 AND deleted_at IS NULL`,
        [userId]
      );

      // Get completed complaints (status_id = 3)
      const completedResult = await client.query(
        `SELECT COUNT(*) as count 
         FROM public.complaints 
         WHERE assigned_to = $1 AND status_id = 2 AND deleted_at IS NULL`,
        [userId]
      );

      const stats = {
        totalAssigned: parseInt(assignedResult.rows[0]?.count || "0"),
        inProgress: parseInt(inProgressResult.rows[0]?.count || "0"),
        completed: parseInt(completedResult.rows[0]?.count || "0")
      };

      return NextResponse.json({
        success: true,
        data: stats
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user statistics' },
      { status: 500 }
    );
  }
}