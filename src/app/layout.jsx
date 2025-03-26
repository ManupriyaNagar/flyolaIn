"use client";
import "./globals.css";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion"; // Add motion import here
import Loader from "@/components/Loader";
import Header from "@/components/Header"; // Assuming you have the Header component
import Footer from "@/components/Footer"; // Assuming you have the Footer component
export default function RootLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <body className="bg-gray-100">
        <AnimatePresence>
          {isLoading ? (
            <Loader key="loader" onLoadingComplete={() => setIsLoading(false)} />
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Header className="mb-10"/>
              {children}
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>
      </body>
    </html>
  );
}