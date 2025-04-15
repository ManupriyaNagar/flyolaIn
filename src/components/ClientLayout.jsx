"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthContext";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isDashboard =
    pathname.startsWith("/admin-dashboard") ||
    pathname.startsWith("/user-dashboard");

  return (
    <AuthProvider>

{!isDashboard && <Header />}
      {children}
      {!isDashboard && <Footer />}
    </AuthProvider>
  );
}
