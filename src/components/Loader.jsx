"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Loader({ onLoadingComplete }) {
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: { repeat: Infinity, duration: 1.2, ease: "linear" },
    },
  };

  const containerVariants = {
    initial: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      exit="exit"
      className="fixed inset-0 flex flex-col items-center justify-center bg-pink-400 z-50"
      onAnimationComplete={onLoadingComplete}
    >
      <Image
        src="/background2.png"
        alt="Sky background"
        fill
        className="object-cover"
        priority
      />
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.9 }}
        className="mb-10"
      >
        <Image src="/logo-04.png" alt="Flyola Logo" width={180} height={90} />
      </motion.div>

      {/* Spinner */}
      <motion.div
        variants={spinnerVariants}
        animate="animate"
        className="relative w-20 h-20"
      >
        {/* Gradient border */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-tr from-indigo-400 to-yellow-400 p-[2px]">
          <div className="w-full h-full bg-gray-900 rounded-full" />
        </div>

        {/* Rotating airplane icon */}
        <motion.svg
          className="absolute top-1/2 left-1/2 w-8 h-8 text-yellow-400"
          viewBox="0 0 24 24"
          initial={{ rotate: -45 }}
          animate={{ rotate: 315 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        >
          <path fill="currentColor" d="M2.5 19L13 12 2.5 5v14zM13 12l8.5-7v14L13 12z" />
        </motion.svg>
      </motion.div>

      {/* Loading Text */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-8 text-white text-xl font-semibold tracking-wide"
      >
        Preparing for Takeoff…
      </motion.p>
    </motion.div>
  );
}
