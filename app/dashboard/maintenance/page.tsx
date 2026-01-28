"use client";

import LogoutButton from "@/app/components/LogoutButton";
import Maintenancelist from "@/app/components/Maintenancelist";
import { useSession, signIn } from "next-auth/react";

export default function MaintenanceDashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    signIn();
    return <p>Redirecting to login...</p>;
  }

  if (session.user.role !== "maintenance") {
    return <p>Access Denied</p>;
  }

  return (
    <>
      <Maintenancelist />
    </>
  );
}
