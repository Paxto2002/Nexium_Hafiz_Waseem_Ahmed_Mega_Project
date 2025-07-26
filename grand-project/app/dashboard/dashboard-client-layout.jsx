"use client";

import {
  Sidebar,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Home,
  User,
  LogOut,
  Menu,
  X,
  FileText,
  Star,
  DollarSign,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardClientLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isActive = (path) => pathname === path;

  if (!hasMounted) return <div className="w-full min-h-screen bg-white" />;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleSidebar}
          className="cursor-pointer md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen || hasMounted ? 0 : -300 }}
          transition={{ type: "spring", stiffness: 250, damping: 30 }}
          className={`
            bg-green-50 border-r border-green-300 w-64
            fixed md:static z-40 h-full px-4 pt-6
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <SidebarMenu className="space-y-4 mt-12 md:mt-0">
            {[{
              href: "/dashboard",
              label: "Dashboard",
              icon: Home
            }, {
              href: "/dashboard/profile",
              label: "Profile",
              icon: User
            }, {
              href: "/docs",
              label: "Documentation",
              icon: FileText
            }, {
              href: "/features",
              label: "Features",
              icon: Star
            }, {
              href: "/pricing",
              label: "Pricing",
              icon: DollarSign
            }].map(({ href, label, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  onClick={() => router.push(href)}
                  className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200
                    ${isActive(href)
                      ? "bg-[#4fa740] text-white hover:bg-[#388e3c] hover:text-white shadow"
                      : "hover:bg-green-200 hover:text-[#1a1a1a] text-gray-800"}
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="transition-transform group-hover:translate-x-1">{label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleSignOut}
                className="cursor-pointer text-red-600 hover:text-red-800 flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </motion.aside>

        {/* Main Content */}
        <main
          className={`
            flex-1 transition-all duration-300
            ${sidebarOpen ? "ml-64" : "ml-0"}
            p-4 md:p-6
          `}
        >
          {children}
        </main>

        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="cursor-pointer md:hidden fixed inset-0 bg-black/50 z-30"
              onClick={toggleSidebar}
            />
          )}
        </AnimatePresence>
      </div>
    </SidebarProvider>
  );
}
