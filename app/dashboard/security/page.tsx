import UserComplaintsClient from "@/app/components/UserComplaintsClient";
import { getUserComplaints } from "@/app/actions/usercomplaintlist";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import VisitorEntryForm from "@/app/components/VisitorEntryForm";
import LogoutButton from "@/app/components/LogoutButton";

export default async function Page() {
  const session = await getServerSession(authOptions);


  

  if (!session) redirect("/api/auth/signin");

  if (session.user.role !== "Security") {
    return <p>Access Denied</p>;
  }


  return(
    <>
    
  <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Security Board</h1>
            <p className="text-xs text-gray-500">View and assign pending complaints</p>
          </div>
          <LogoutButton />
        </div>
      </header>
<VisitorEntryForm></VisitorEntryForm>
    </>
  )
}
