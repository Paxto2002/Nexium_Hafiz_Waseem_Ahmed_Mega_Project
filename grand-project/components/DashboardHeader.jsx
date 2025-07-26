'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function DashboardHeader() {
  return (
    <header className="w-full bg-white border-b-green-300 shadow-sm py-3 px-4 flex justify-center items-center">
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/chef_logo.png"
          alt="Chef Paxto Logo"
          width={40}
          height={40}
        />
        <span className="text-xl font-bold text-green-600 whitespace-nowrap">Chef Paxto</span>
      </Link>
    </header>
  );
}
