"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  CheckCircle, 
  Shield, 
  BarChart3, 
  ArrowRight
} from "lucide-react";

// Brand Colors
const BRAND = {
  primary: "#0B3C66",   // Deep Blue
  accent: "#F15A29",    // Orange
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      
      {/* =======================
           NAVIGATION (No Hamburger, Always Visible)
      ======================== */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            
            {/* Big Logo Only */}
            <Link href="/" className="flex items-center">
              <div className="relative w-40 h-16">
                <Image 
                  src="/logo.png" 
                  alt="ResolveX Logo" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Sign In Button (Visible on Mobile & Desktop) */}
            <div>
              <Link 
                href="/login" 
                className="px-6 md:px-8 py-3 rounded-lg bg-[#0B3C66] text-white text-sm font-semibold hover:bg-[#0B3C66]/90 transition-all shadow-sm"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* =======================
           HERO SECTION (Big Logo)
      ======================== */}
      <main className="flex-grow flex items-center justify-center bg-gradient-to-b from-[#F0F4F8] to-[#F8FAFC] px-4 py-16 md:py-24 relative overflow-hidden">
        
        {/* Decorative Blobs */}
        <div className="absolute top-10 left-0 w-48 h-48 md:w-96 md:h-96 bg-[#0B3C66]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-10 right-0 w-48 h-48 md:w-80 md:h-80 bg-[#F15A29]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          
          {/* Massive Hero Logo (Fixed height typo to md:h-64) */}
          <div className="w-40 h-40 md:w-64 md:h-14 mx-auto mb-8 md:mb-12 relative">
            <Image 
              src="/logo.png" 
              alt="ResolveX Logo" 
              fill
              className="object-contain drop-shadow-xl"
            />
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-[#0B3C66] mb-6 tracking-tight leading-tight">
            Efficient Complaint <br className="hidden md:block" />
            Management System
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
            Streamline feedback handling, track resolution in real-time, and improve transparency with ResolveX.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
            
            {/* Primary Button */}
            <Link
              href="/login"
              className="w-full sm:w-auto text-center rounded-xl bg-[#F15A29] px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-[#d94f22] hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Secondary Button */}
            <Link
              href="#features"
              className="w-full sm:w-auto text-center rounded-xl border-2 border-[#0B3C66] px-8 py-4 text-base font-bold text-[#0B3C66] hover:bg-[#0B3C66] hover:text-white transition-colors"
            >
              Learn More
            </Link>
            
          </div>
        </div>
      </main>

      {/* =======================
           FEATURES SECTION
      ======================== */}
      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0B3C66] mb-4">Why Choose ResolveX?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              Designed for modern teams to handle feedback with speed and clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className="p-6 md:p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#0B3C66]/10 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle className="w-6 h-6 text-[#0B3C66]" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-[#1E293B] mb-3">Real-time Tracking</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Monitor every complaint status from submission to resolution with instant updates.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 md:p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#F15A29]/10 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-[#F15A29]" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-[#1E293B] mb-3">Secure & Private</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Your data is encrypted and protected, ensuring that sensitive information remains confidential.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 md:p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-[#1E293B] mb-3">Deep Analytics</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                Gain insights with powerful reporting tools to identify trends and improve processes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =======================
           FOOTER
      ======================== */}
      <footer className="bg-[#0B3C66] text-white py-10 md:py-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Logo & Copyright */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <div className="relative w-8 h-8">
                  <Image 
                    src="/logo.png" 
                    alt="ResolveX Logo" 
                    fill
                    className="object-contain invert"
                  />
                </div>
                <span className="font-bold text-lg">ResolveX</span>
              </div>
              <p className="text-xs md:text-sm text-blue-200">
                © {new Date().getFullYear()} ResolveX Inc.
              </p>
            </div>
            
            {/* Links */}
            <div className="flex gap-4 md:gap-6 text-sm font-medium text-blue-100">
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div> 
  );
}