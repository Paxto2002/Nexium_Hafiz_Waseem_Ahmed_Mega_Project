"use client";

import {
  Sidebar,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, User, LogOut, Menu, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardClientLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Helper to apply active style
  const isActive = (path) => pathname === path;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleSidebar}
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-green-600 text-white"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Sidebar */}
        <aside
          className={`
            bg-green-50 border-r border-green-300 border-t-green-300 w-64
            fixed md:static z-40 h-full transition-transform
            px-4 pt-6
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <SidebarMenu className="space-y-4 mt-12 md:mt-0">
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => router.push("/dashboard")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md 
                  ${isActive("/dashboard") ? "bg-[#4fa740] text-[#fff]" : "hover:bg-green-100 text-gray-800"}
                `}
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => router.push("/dashboard/profile")}
                className={`flex items-center gap-2 px-3 py-2 rounded-md 
                  ${isActive("/dashboard/profile") ? "bg-[#4fa740] text-[#fff]" : "hover:bg-green-100 text-gray-800"}
                `}
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleSignOut}
                className="text-red-600 hover:text-red-800 flex items-center gap-2 px-3 py-2 rounded-md"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </aside>

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
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-30"
            onClick={toggleSidebar}
          />
        )}
      </div>
    </SidebarProvider>
  );
}
