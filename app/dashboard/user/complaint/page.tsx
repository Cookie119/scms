"use client";
import { useSession, signIn } from "next-auth/react";
import ComplaintList from "@/app/components/ComplaintList";
import ComplaintForm from "@/app/components/ComplaintForm";
export default function NewComplaintPage(){
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    // Not logged in → redirect
    signIn();
    return <p>Redirecting to login...</p>;
  }

  if (session.user.role !== "user") {
    return <p>Access Denied</p>;
  }

  // Theme Configuration
const theme = {
  primary: "#0B3C66",      // Deep Blue
  accent: "#F15A29",       // Vibrant Orange
  background: "#F8FAFC",   // Light gray
  textPrimary: "#1E293B",  // Dark slate
};


  return (
   <>
           {/* Header - Mobile Optimized */}
           <header 
             className="sticky top-0 z-50 shadow-lg backdrop-blur-md border-b-2"
             style={{ 
               backgroundColor: `${theme.background}f0`,
               borderBottomColor: `${theme.primary}20`
             }}
           >
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               {/* Main Header Bar */}
               <div className="flex items-center justify-between h-20 sm:h-24">
                 {/* Logo Section */}
                 <div className="flex items-center gap-3 flex-shrink-0">
                   <img 
                     src="https://z-cdn-media.chatglm.cn/files/192a4fdb-d4cb-46f4-8758-a5e126e6f439.png?auth_key=1869672679-7040aa52e74141bcacba84068b6a23f9-0-21c361a18cc05c193484bd480fbf9c4f" 
                     alt="Resolve Logo" 
                     className="h-10 sm:h-12 w-auto object-contain"
                   />
                 </div>
               </div>
                 </div>
           </header>
     
    <ComplaintForm></ComplaintForm>
    </> 
  )
}