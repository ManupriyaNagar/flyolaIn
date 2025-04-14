// app/layout.jsx (❌ NO "use client" here)

import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata = {
  title: "Flyola",
  icons: {
    icon: "/pp.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
