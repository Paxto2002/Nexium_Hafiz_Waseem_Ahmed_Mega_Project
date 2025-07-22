"use client";

import {
  Sidebar,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, Settings, LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import InsertUserIfNeeded from "@/app/components/server-only/InsertUserIfNeeded";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleResize = () => setSidebarOpen(!mediaQuery.matches);

    handleResize();
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <SidebarProvider>
      {/* ✅ Add server logic to insert user */}
      <InsertUserIfNeeded />

      <div className="flex min-h-screen w-full">
        {sidebarOpen && (
          <aside className="bg-green-50 border-r border-green-200 p-4 w-64 fixed md:static z-40 h-full transition-transform">
            <SidebarMenu className="space-y-4">
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleSignOut}
                  className="text-red-600 hover:text-red-800"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </aside>
        )}

        <div className="flex-1 flex flex-col ml-0 md:ml-0">
          <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-30">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="block md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          <main className="p-6 bg-muted/50">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
