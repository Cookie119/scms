import { NextResponse } from "next/server";

const subscriptions = new Map<number, PushSubscription>();

export async function POST(req: Request) {
  const { userId, subscription } = await req.json();

  subscriptions.set(userId, subscription);

  return NextResponse.json({ success: true });
}

export { subscriptions };
