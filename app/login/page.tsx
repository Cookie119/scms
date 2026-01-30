"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define user roles
type UserRole = "admin" | "staff" | "user" | "maintenance" | "Security";

// Role-based redirect paths
const roleRedirectPaths: Record<UserRole, string> = {
  admin: "/dashboard/admin",
  staff: "/dashboard/staff",
  user: "/dashboard/user",
  maintenance: "/dashboard/maintenance",
  Security: "/dashboard/security",
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      const userRole = session.user.role as UserRole;
      const redirectPath = roleRedirectPaths[userRole] || "/dashboard";
      router.push(redirectPath);
    }
  }, [session, status, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      // If login successful, wait for session to update
      // The useEffect will handle the redirect based on role
      
    } catch (error) {
      setError("An error occurred during login");
      setIsLoading(false);
    }
  }

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#0B3C66] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
      {/* Login Card */}
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        {/* Header */}
        <div className="mb-8 text-center">
           <div className="w-36 h-36 md:w-60 md:h-14 mx-auto mb-8 md:mb-12 relative">
               <img 
                 src="/logo.png" 
                 alt="ResolveX Logo" 
                 className="object-contain drop-shadow-xl"
               />
             </div>

          <h2 className="text-3xl font-bold text-[#1E293B]">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to continue to your dashboard
          </p>
          
          {/* Role Information */}
          {/* <div className="mt-4 rounded-lg bg-gray-50 p-3 text-left">
            <p className="text-xs font-medium text-gray-600">Available Roles:</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {(["admin", "staff", "user", "maintenance", "security"] as UserRole[]).map((role) => (
                <span
                  key={role}
                  className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                >
                  {role}
                </span>
              ))}
            </div>
          </div> */}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {/* Form */}
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-[#1E293B]">
              Email address
            </label>
            <input
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-[#1E293B] focus:border-[#0B3C66] focus:ring-2 focus:ring-[#0B3C66]/30 outline-none"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1E293B]">
              Password
            </label>
            <input
              type="password"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-[#1E293B] focus:border-[#0B3C66] focus:ring-2 focus:ring-[#0B3C66]/30 outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            {/* <label className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[#0B3C66] focus:ring-[#0B3C66]"
              />
            </label>
              Remember me */}
{/* 
            <a href="#" className="font-medium text-[#0B3C66] hover:underline">
              Forgot password?
            </a> */}
          </div>

          {/* CTA Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-lg bg-[#F15A29] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#d94f22] disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>


        <p className="mt-6 text-center text-xs text-gray-500">
          © 2026 Creative Studio. All rights reserved.
        </p>
      </div>
    </div>
  );
}