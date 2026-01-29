import UserComplaintsClient from "@/app/components/UserComplaintsClient";
import { getUserComplaints } from "@/app/actions/usercomplaintlist";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import VisitorEntryForm from "@/app/components/VisitorEntryForm";
import LogoutButton from "@/app/components/LogoutButton";

// Theme Configuration
const theme = {
  primary: "#0B3C66",      // Deep Blue
  accent: "#F15A29",       // Vibrant Orange
  background: "#F8FAFC",   // Light gray
  textPrimary: "#1E293B",  // Dark slate
};

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/api/auth/signin");

  if (session.user.role !== "Security") {
    return <p>Access Denied</p>;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.background }}>
      
      {/* Header - Styled with Primary Deep Blue */}
      <header 
        className="sticky top-0 z-10 shadow-sm transition-all"
        style={{ backgroundColor: theme.background
        
         }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Title Group */}
          <div className="flex items-center gap-3">
             <img 
              src="https://z-cdn-media.chatglm.cn/files/192a4fdb-d4cb-46f4-8758-a5e126e6f439.png?auth_key=1869672679-7040aa52e74141bcacba84068b6a23f9-0-21c361a18cc05c193484bd480fbf9c4f" 
              alt="Resolve Logo" 
              className="h-10 w-auto object-contain"
            />
            <div>
              <h1 className="text-xl font-bold  leading-tight">Security Board</h1>
              <p className="text-xs ">Manage visitors and gate entries</p>
            </div>
          </div>

          <LogoutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <VisitorEntryForm />
        </div>
      </main>

    </div>
  );
}