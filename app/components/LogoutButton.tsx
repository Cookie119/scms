"use client";

import { signOut } from "next-auth/react";

interface LogoutButtonProps {
  variant?: 'primary' | 'accent';
  className?: string;
}

export default function LogoutButton({ variant = 'primary', className = '' }: LogoutButtonProps) {
  if (variant === 'accent') {
    return (
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 ${className}`}
        style={{ backgroundColor: "#F15A29" }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Logout</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 font-bold text-sm transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 ${className}`}
      style={{
        borderColor: "#0B3C66",
        color: "#0B3C66",
        backgroundColor: "transparent"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#0B3C66";
        e.currentTarget.style.color = "white";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = "#0B3C66";
      }}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      <span>Logout</span>
    </button>
  );
}