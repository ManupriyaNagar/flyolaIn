"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthContext";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // Check for admin-dashboard, user-dashboard, or agent-dashboard routes
  const isDashboard =
    pathname.startsWith("/admin-dashboard") ||
    pathname.startsWith("/user-dashboard") ||
    pathname.startsWith("/agent-dashboard");

  return (
    <AuthProvider>
      {/* Show Header for non-dashboard pages */}
      {!isDashboard && <Header />}

      {/* Main content, adding padding only if not on a dashboard */}
      <main className={!isDashboard ? "pt-20" : ""}>
        {children}
      </main>

      {/* Show Footer for non-dashboard pages */}
      {!isDashboard && <Footer />}
    </AuthProvider>
  );
}
