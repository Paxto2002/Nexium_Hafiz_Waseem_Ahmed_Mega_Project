"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-green-50 border-t mt-15 border-green-200 py-8 px-4 text-green-800">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-sm">
        <div>
          <h4 className="font-semibold mb-2">Explore</h4>
          <ul className="space-y-1">
            <li><Link href="/features" className="hover:underline">Features</Link></li>
            <li><Link href="/pricing" className="hover:underline">Pricing</Link></li>
            <li><Link href="/docs" className="hover:underline">Docs</Link></li>
            <li><Link href="/signin" className="hover:underline">Sign In</Link></li>
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
          <Link href="/">
            <Image
              src="/chef_logo.png"
              alt="Chef Paxto Logo"
              width={100}
              height={40}
              style={{ height: "auto", width: "auto" }}
              className="inline-block mx-auto md:mx-0"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}