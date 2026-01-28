// 

// app/api/push/send/route.ts
import webpush from "web-push";
import { NextResponse } from "next/server";
import { pool } from "@/app/backend/db";

webpush.setVapidDetails(
  "mailto:test@example.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: Request) {
  try {
    const { user_id, title, body } = await req.json();

    const result = await pool.query(
      "SELECT subscription FROM push_subscriptions WHERE user_id = $1",
      [user_id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      );
    }

    const subscription = result.rows[0].subscription;

    await webpush.sendNotification(
      subscription,
      JSON.stringify({ title, body })
    );

    console.log("🔔 Push sent to user:", user_id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Push error:", err);
    return NextResponse.json({ error: "Push failed" }, { status: 500 });
  }
}
