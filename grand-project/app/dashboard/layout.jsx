// app/dashboard/layout.jsx
// This is a Client Component that provides the layout for the dashboard.
// It includes a sidebar and handles client-side navigation and sign-out.

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
import { createClient } from "@/lib/supabase/client"; // Client-side Supabase client
import InsertUserIfNeeded from "@/app/components/server-only/InsertUserIfNeeded"; // Server Component import

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Effect to handle sidebar visibility based on screen size.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleResize = () => setSidebarOpen(!mediaQuery.matches);

    // Set initial state based on current media query
    handleResize();
    // Add event listener for changes in media query
    mediaQuery.addEventListener("change", handleResize);
    // Cleanup function to remove event listener when component unmounts
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  // Handler for user sign out.
  const handleSignOut = async () => {
    const supabase = createClient(); // Get client-side Supabase instance
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      // Optionally display an error message to the user (e.g., using a toast notification)
    } else {
      router.push("/"); // Redirect to the home page after successful sign out
    }
  };

  return (
    <SidebarProvider>
      {/* InsertUserIfNeeded is a Server Component. It runs on the server
          and its output (which is 'null' in this case) is passed to the client.
          It's placed here to ensure the server-side user profile creation logic runs
          during the initial render of the dashboard layout.
      */}
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

          <main className="p-6 bg-muted/50 flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
