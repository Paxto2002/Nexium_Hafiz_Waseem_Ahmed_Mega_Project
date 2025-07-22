// app/layout.jsx
import './globals.css';
import { Suspense } from 'react';
import LayoutContent from '@/components/LayoutContent';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Suspense>
          <LayoutContent>{children}</LayoutContent>
        </Suspense>
      </body>
    </html>
  );
}
