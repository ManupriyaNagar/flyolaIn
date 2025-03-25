"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Loader({ onLoadingComplete }) {
  // Animation variants for the spinner
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "linear",
      },
    },
  };

  // Animation for the entire loader
  const containerVariants = {
    initial: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      exit="exit"
      className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-gray-900 z-50"
      onAnimationComplete={() => onLoadingComplete()} // Callback when animation completes
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Image
          src="/logo.png" // Ensure this matches your logo path
          alt="Flyola Logo"
          width={150}
          height={75}
          className="object-contain"
        />
      </motion.div>

      {/* Spinner */}
      <motion.div
        variants={spinnerVariants}
        animate="animate"
        className="relative w-16 h-16"
      >
        {/* Outer Circle */}
        <div className="absolute inset-0 border-4 border-t-transparent border-indigo-400 rounded-full" />
        {/* Inner Circle (Airplane Effect) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-lg" />
        </div>
      </motion.div>

      {/* Loading Text */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-6 text-white text-lg font-medium"
      >
        Preparing for Takeoff...
      </motion.p>
    </motion.div>
  );
}