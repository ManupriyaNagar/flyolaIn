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
      <Header className="mb-10" />
      {children}
      {!isDashboard && <Footer />}
    </AuthProvider>
  );
}
