import { NextResponse } from "next/server";
import { pool } from "@/app/backend/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await req.json();

    if (!subscription?.endpoint) {
      return NextResponse.json(
        { error: "Invalid subscription" },
        { status: 400 }
      );
    }

    await pool.query(
      `
      INSERT INTO push_subscriptions (user_id, subscription)
      VALUES ($1, $2)
      ON CONFLICT (user_id)
      DO UPDATE SET subscription = EXCLUDED.subscription
      `,
      [session.user.id, subscription]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Push subscribe error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
