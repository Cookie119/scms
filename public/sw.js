self.addEventListener("push", (event) => {
  let data = { title: "Notification", body: "You have an update" };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (err) {
    console.error("❌ Push payload parse failed", err);
    return;
  }

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
  });
});
