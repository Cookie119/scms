import UserComplaintsClient from "@/app/components/UserComplaintsClient";
import { getUserComplaints } from "@/app/actions/usercomplaintlist";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);


  

  if (!session) redirect("/api/auth/signin");

  if (session.user.role !== "user") {
    return <p>Access Denied</p>;
  }

  const complaints = await getUserComplaints(); // ✅ ACTION CALLED HERE

  return <UserComplaintsClient complaints={complaints} />;
}
