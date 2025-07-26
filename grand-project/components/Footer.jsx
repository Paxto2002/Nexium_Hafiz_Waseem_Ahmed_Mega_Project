"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

function Footer() {
  return (
    <footer className="bg-green-50 border-t border-green-200 py-10 px-4 text-green-800">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-sm">
        <div>
          <h4 className="font-semibold mb-2">Explore</h4>
          <ul className="space-y-1">
            <li><a href="/features" className="hover:underline">Features</a></li>
            <li><a href="/pricing" className="hover:underline">Pricing</a></li>
            <li><a href="/docs" className="hover:underline">Docs</a></li>
            <li><a href="/signin" className="hover:underline">Sign In</a></li>
          </ul>
        </div>
        <div className="col-span-2 md:col-span-3">
          <h4 className="font-semibold mb-2">About Chef Paxto</h4>
          <p className="text-green-700 text-sm leading-relaxed">
            Chef Paxto is an AI-powered recipe generator built with Supabase, MongoDB, and n8n.
            Whether you're a beginner or an expert chef, Chef Paxto crafts tailored recipes just for you.
          </p>
        </div>
        <div className="md:text-right col-span-2 md:col-span-1 space-y-2">
          <p className="text-xs text-green-600">
            © {new Date().getFullYear()} <span className="font-semibold">Chef Paxto</span>. All rights reserved.
          </p>
          <a href="/">
            <Image
              src="/chef_logo.png"
              alt="Chef Paxto Logo"
              width={100}
              height={40}
              style={{ height: "auto", width: "auto" }}
              className="inline-block mx-auto md:mx-0"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function DashboardClientLayout({ children }) {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    } else {
      router.push("/signin");
    }
  };

  if (!hasMounted) return <div className="w-full min-h-screen bg-white" />;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 md:p-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
