import webpush from "web-push";
import { subscriptions } from "@/app/api/subscribe/route";

webpush.setVapidDetails(
  "mailto:admin@cms.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendPushToUser(
  userId: number,
  payload: {
    title: string;
    body: string;
    url?: string;
  }
) {
  const sub = subscriptions.get(userId);
  if (!sub) return;

  await webpush.sendNotification(sub, JSON.stringify(payload));
}
