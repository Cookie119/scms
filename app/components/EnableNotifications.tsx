"use client";

export default function EnableNotifications() {
  const askPermission = async () => {
    if (!("Notification" in window)) {
      alert("Notifications not supported");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      alert("Notifications enabled ✅");
    }
  };


    
  return (
    <button
      onClick={askPermission}
      className="px-4 py-2 bg-black text-white rounded"
    >
      Enable Notifications
    </button>
  );
}
