import { urlBase64ToUint8Array } from "./urlBase64ToUint8Array";

export async function subscribeUser() {
  if (!("serviceWorker" in navigator)) return;

  // 👉 ASK permission first
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.warn("🔕 Notification permission not granted");
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });

    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });

    console.log("✅ Push subscription successful");
  } catch (err) {
    console.error("❌ Push subscription failed:", err);
  }
}
