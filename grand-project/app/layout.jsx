import "./globals.css";
import { Suspense } from "react";
import LayoutContent from "@/components/LayoutContent";
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Suspense>
          <LayoutContent>
            {children}
            <Toaster richColors position="top-right" />
          </LayoutContent>
        </Suspense>
      </body>
    </html>
  );
}
