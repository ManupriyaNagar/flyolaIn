// app/layout.jsx
"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthContext";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/admin-dashboard") || pathname.startsWith("/user-dashboard");

  return (
    <html lang="en">
      <body className="bg-gray-100">
        <AuthProvider>
          <Header className="mb-10" />
          {children}
          {!isDashboard && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}