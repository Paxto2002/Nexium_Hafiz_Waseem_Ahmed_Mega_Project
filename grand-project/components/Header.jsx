"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { error } = await supabase.auth.signOut();

    if (!error) {
      window.location.href = "/";
    } else {
      console.error("Sign out error:", error);
    }
  };

  const navItemClass = (href) =>
    pathname === href
      ? "bg-[#4fa740] text-white px-3 py-1 rounded transition"
      : "text-green-600 hover:text-green-900 transition";

  const mobileNavItemClass = (href) =>
    pathname === href
      ? "block w-full text-left bg-[#4fa740] text-white px-4 py-3 rounded transition"
      : "block w-full text-left text-green-600 hover:text-green-900 px-4 py-3 transition";

  const CommonLinks = (
    <>
      <Link href="/features" className={navItemClass("/features")}>
        Features
      </Link>
      <Link href="/pricing" className={navItemClass("/pricing")}>
        Pricing
      </Link>
      <Link href="/docs" className={navItemClass("/docs")}>
        Docs
      </Link>
    </>
  );

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
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
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
        </motion.div>

        {/* Hamburger Icon */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="lg:hidden p-2 -mr-2 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-green-600" />
          ) : (
            <Menu className="w-6 h-6 text-green-600" />
          )}
        </motion.button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex space-x-6 items-center">
          {CommonLinks}
          {session ? (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/dashboard" className={navItemClass("/dashboard")}>
                  Dashboard
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/dashboard/profile" className={navItemClass("/profile")}>
                  Profile
                </Link>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="text-red-500 cursor-pointer hover:text-red-600 transition"
              >
                Sign Out
              </motion.button>
            </>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/signin" className={navItemClass("/signin")}>
                  Sign In
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/signup"
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                >
                  Sign Up
                </Link>
              </motion.div>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Nav with enhanced animations */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
              transition: { duration: 0.3, ease: "easeInOut" },
            }}
            exit={{
              opacity: 0,
              height: 0,
              transition: { duration: 0.2, ease: "easeInOut" },
            }}
            className="lg:hidden bg-white shadow-lg overflow-hidden"
          >
            <motion.nav
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="flex flex-col space-y-1 px-4 py-2"
            >
              {[
                { href: "/features", label: "Features" },
                { href: "/pricing", label: "Pricing" },
                { href: "/docs", label: "Docs" },
                ...(session
                  ? [
                      { href: "/dashboard", label: "Dashboard" },
                      { href: "/dashboard/profile", label: "Profile" },
                    ]
                  : [{ href: "/signin", label: "Sign In" }]),
              ].map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: { delay: 0.1 + index * 0.05 },
                  }}
                >
                  <Link
                    href={item.href}
                    className={mobileNavItemClass(item.href)}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {session ? (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: { delay: 0.25 },
                  }}
                >
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left text-red-500 hover:text-red-600 px-4 py-3 transition"
                  >
                    Sign Out
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: { delay: 0.2 },
                  }}
                >
                  <Link
                    href="/signup"
                    className="block w-full text-left bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </motion.div>
              )}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}