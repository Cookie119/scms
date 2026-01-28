"use client";

import { useState, useEffect } from "react";
import { checkComplaintAction, getStatuses } from "@/app/actions/checkcomplaint";
import ComplaintForm from "@/app/components/ComplaintForm";
 import ViewRegister from "@/app/components/ViewRegister"
import CategoryManagement from "@/app/components/CategoryManagement";
import ComplaintList from "@/app/components/ComplaintList";
import LogoutButton from "@/app/components/LogoutButton";
// import RolePage from "@/app/components/RolePage";
import { useSession, signIn } from "next-auth/react";
import AddCategoryPage from "@/app/components/Addcategory";
import UserManagement from "@/app/components/UserManagement";

export default function AdminDashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    // Not logged in → redirect
    signIn();
    return <p>Redirecting to login...</p>;
  }

  if (session.user.role !== "admin") {
    return <p>Access Denied</p>;
  }

  return (
   <>
     <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Board</h1>
            <p className="text-xs text-gray-500">View and assign pending complaints</p>
          </div>
          <LogoutButton />
        </div>
      </header>

    <ViewRegister></ViewRegister> 
    <UserManagement></UserManagement>
    {/* <RolePage></RolePage> */}
   <CategoryManagement></CategoryManagement>
    <ComplaintList></ComplaintList>
    </> 
  )
}
