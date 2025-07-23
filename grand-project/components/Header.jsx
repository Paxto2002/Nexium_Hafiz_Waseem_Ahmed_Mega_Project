'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import Image from 'next/image';

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const navItemClass = (href) =>
    pathname === href
      ? 'bg-[#4fa740] text-white px-3 py-1 rounded transition'
      : 'text-green-600 hover:text-green-900 transition';

  const mobileNavItemClass = (href) =>
    pathname === href
      ? 'block bg-[#4fa740] text-white px-3 py-1 rounded transition'
      : 'block text-green-600 hover:text-green-900 transition';

  if (loading) {
    return (
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image 
              src="/chef_logo.png" 
              alt="Chef Paxto Logo" 
              width={40} 
              height={40}
              className="mr-2"
            />
            <span className="text-xl font-bold text-green-600">Chef Paxto</span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image 
            src="/chef_logo.png" 
            alt="Chef Paxto Logo" 
            width={40} 
            height={40}
            className="mr-2"
          />
          <span className="text-xl font-bold text-green-600">Chef Paxto</span>
        </Link>

        {/* Hamburger Icon */}
        <button
          className="lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex space-x-6 items-center">
          {session ? (
            <>
              <Link href="/dashboard" className={navItemClass('/dashboard')}>Dashboard</Link>
              <Link href="/profile" className={navItemClass('/profile')}>Profile</Link>
              <button onClick={handleSignOut} className="text-red-500 hover:text-red-600 transition">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/features" className={navItemClass('/features')}>Features</Link>
              <Link href="/pricing" className={navItemClass('/pricing')}>Pricing</Link>
              <Link href="/docs" className={navItemClass('/docs')}>Docs</Link>
              <Link href="/signin" className={navItemClass('/signin')}>Sign In</Link>
              <Link href="/signup" className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">Sign Up</Link>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="lg:hidden px-4 pb-4 space-y-2 bg-white shadow-md">
          {session ? (
            <>
              <Link href="/dashboard" className={mobileNavItemClass('/dashboard')}>Dashboard</Link>
              <Link href="/profile" className={mobileNavItemClass('/profile')}>Profile</Link>
              <button onClick={handleSignOut} className="block text-red-500 hover:text-red-600 transition">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/features" className={mobileNavItemClass('/features')}>Features</Link>
              <Link href="/pricing" className={mobileNavItemClass('/pricing')}>Pricing</Link>
              <Link href="/docs" className={mobileNavItemClass('/docs')}>Docs</Link>
              <Link href="/signin" className={mobileNavItemClass('/signin')}>Sign In</Link>
              <Link href="/signup" className="block bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">Sign Up</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
