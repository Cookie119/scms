import { NextResponse } from "next/server";
import webpush from "web-push";
import { subscriptions } from "@/app/api/subscribe/route";

webpush.setVapidDetails(
  "mailto:test@cms.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST() {
  console.log("🔔 Sending push test");

  for (const [userId, sub] of subscriptions) {
    await webpush.sendNotification(
      sub,
      JSON.stringify({
        title: "Server Push ✅",
        body: "This came from the backend!",
      })
    );
  }

  return NextResponse.json({ ok: true });
}
