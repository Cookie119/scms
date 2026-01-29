// app/api/push/send/route.ts
import webpush from "web-push";
import { NextResponse } from "next/server";
import { pool } from "@/app/backend/db";

// Log environment variables (in development only)
console.log("VAPID Keys check:", {
  hasPublicKey: !!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  hasPrivateKey: !!process.env.VAPID_PRIVATE_KEY,
});

webpush.setVapidDetails(
  "mailto:test@example.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: Request) {
  try {
    const { user_id, title, body } = await req.json();

    console.log("🔔 Attempting to send push to user_id:", user_id);

    // First, verify the user exists - FIXED QUERY
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE id = $1",  // <-- FIXED: Use parameter
      [user_id]
    );

    if (userCheck.rowCount === 0) {
      console.log("❌ User not found:", user_id);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    console.log("✅ User exists:", userCheck.rows[0]);

    // Try to get subscription
    let result;
    try {
      result = await pool.query(
        "SELECT subscription FROM push_subscriptions WHERE user_id = $1",
        [user_id]
      );
    } catch (dbError: any) {
      console.error("❌ Database error:", dbError.message);
      
      // Check if it's a permission error
      if (dbError.message.includes('permission denied') || 
          dbError.message.includes('RLS')) {
        return NextResponse.json(
          { 
            error: "Database permission denied",
            details: "Check RLS policies on push_subscriptions table"
          },
          { status: 403 }
        );
      }
      
      throw dbError;
    }

    console.log("📊 Subscription query result:", {
      rowCount: result.rowCount,
      rows: result.rows
    });

    if (result.rowCount === 0) {
      console.log("❌ No subscription found for user:", user_id);
      return NextResponse.json(
        { 
          error: "No subscription found",
          suggestion: "User needs to grant notification permission"
        },
        { status: 404 }
      );
    }

    const subscription = result.rows[0].subscription;
    
    if (!subscription) {
      console.log("❌ Subscription data is null/empty for user:", user_id);
      return NextResponse.json(
        { error: "Invalid subscription data" },
        { status: 400 }
      );
    }

    console.log("📱 Found subscription for user:", user_id);

    // Send push notification
    try {
      await webpush.sendNotification(
        subscription,
        JSON.stringify({ 
          title, 
          body,
          icon: '/notification-icon.png',
          badge: '/badge.png',
          timestamp: Date.now()
        })
      );
      
      console.log("✅ Push sent successfully to user:", user_id);
      
      // Log the notification
      await pool.query(
        "INSERT INTO notifications (user_id, title, message, type, created_at) VALUES ($1, $2, $3, 'push', NOW())",
        [user_id, title, body]
      );

      return NextResponse.json({ 
        success: true,
        message: "Push notification sent"
      });
      
    } catch (webpushError: any) {
      console.error("❌ WebPush error:", webpushError.message);
      
      // If subscription is invalid, delete it
      if (webpushError.statusCode === 410) {
        await pool.query(
          "DELETE FROM push_subscriptions WHERE user_id = $1",
          [user_id]
        );
        console.log("🗑️ Deleted expired subscription for user:", user_id);
      }
      
      return NextResponse.json(
        { 
          error: "Push notification failed",
          details: webpushError.message
        },
        { status: 500 }
      );
    }
    
  } catch (err: any) {
    console.error("❌ General error:", err);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: err.message 
      },
      { status: 500 }
    );
  }
}