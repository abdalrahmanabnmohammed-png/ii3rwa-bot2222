"use client"; // أضف هذا السطر في الأعلى
import { SessionProvider } from "next-auth/react";
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
