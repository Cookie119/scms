"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard/user",
    });
    setIsLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
      
      {/* Login Card */}
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0B3C66]/10">
            <svg
              className="h-6 w-6 text-[#0B3C66]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 11c0 1.657-1.343 3-3 3S6 12.657 6 11s1.343-3 3-3 3 1.343 3 3z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11c0 3.866-3.582 7-8 7s-8-3.134-8-7 3.582-7 8-7 8 3.134 8 7z"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-[#1E293B]">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to continue to your dashboard
          </p>
        </div>

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
            <label className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[#0B3C66] focus:ring-[#0B3C66]"
              />
              Remember me
            </label>

            <a href="#" className="font-medium text-[#0B3C66] hover:underline">
              Forgot password?
            </a>
          </div>

          {/* CTA Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-lg bg-[#F15A29] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#d94f22] disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          © 2026 Creative Studio. All rights reserved.
        </p>
      </div>
    </div>
  );
}
