"use client";

import { useEffect, useState } from "react";

let deferredPrompt: any = null;

export default function InstallPWA() {
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault(); // stop auto prompt
      deferredPrompt = e;
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("PWA installed");
    } else {
      console.log("PWA install dismissed");
    }

    deferredPrompt = null;
    setShowInstall(false);
  };

  if (!showInstall) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        padding: "12px 16px",
        background: "#000",
        color: "#fff",
        borderRadius: "8px",
        zIndex: 9999,
      }}
    >
      <p style={{ marginBottom: 8 }}>Install this app?</p>
      <button
        onClick={installApp}
        style={{
          background: "#4CAF50",
          border: "none",
          padding: "6px 12px",
          color: "#fff",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Install
      </button>
    </div>
  );
}
