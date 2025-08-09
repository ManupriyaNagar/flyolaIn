"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlane } from "react-icons/fa";
import Image from "next/image";

export default function Loader({ onLoadingComplete = () => { }, inline = false, size = "md" }) {
  // Inline loader for small loading states
  if (inline) {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-6 h-6", 
      lg: "w-8 h-8"
    };

    return (
      <motion.div
        animate={{ 
          rotate: 360,
          x: [0, 5, 0, -5, 0]
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          x: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }}
        className={`${sizeClasses[size]} text-indigo-500 inline-block`}
      >
        <FaPlane className="w-full h-full" />
      </motion.div>
    );
  }

  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Smooth progress animation using CSS transitions instead of RAF
    const timer = setTimeout(() => {
      setProgress(100);
    }, 100);

    // Auto-complete after animation
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onLoadingComplete, 500); // Wait for exit animation
    }, 1500); // Reduced time for better UX

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 z-50"
        >
          {/* Animated Background Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                  scale: 0
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.6, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Main Content Container */}
          <div className="relative z-10 flex flex-col items-center">

            {/* Plane Animation Container */}
            <div className="relative w-80 h-32 mb-8 flex items-center justify-center">

              {/* Flight Path */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 128">
                <defs>
                  <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                    <stop offset="50%" stopColor="rgba(255,255,255,0.6)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
                  </linearGradient>
                </defs>
                <path
                  d="M20 64 Q160 20 300 64"
                  stroke="url(#pathGradient)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="8 4"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0;-24"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>

              {/* Animated Plane */}
              <motion.div
                className="absolute"
                initial={{ x: -40, y: 0 }}
                animate={{
                  x: 40,
                  y: [0, -15, 0, 15, 0]
                }}
                transition={{
                  x: { duration: 2, ease: "easeInOut", repeat: Infinity },
                  y: { duration: 2, ease: "easeInOut", repeat: Infinity }
                }}
              >
                <div className="relative">
                  <FaPlane className="text-white text-4xl drop-shadow-lg transform rotate-12" />

                  {/* Plane Trail */}
                  <motion.div
                    className="absolute -left-8 top-1/2 w-6 h-0.5 bg-gradient-to-r from-transparent to-white/60 rounded-full"
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
              </motion.div>

              {/* Floating Clouds */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${10 + i * 15}%`
                  }}
                  animate={{
                    x: [-10, 10, -10],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <svg width="24" height="16" viewBox="0 0 24 16" fill="white" opacity="0.4">
                    <path d="M6 10a3 3 0 100-6h12a3 3 0 100 6H6z" />
                  </svg>
                </motion.div>
              ))}
            </div>

            {/* Logo with Elegant Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl" />
                <div className="relative bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                  <Image
                    src="/logoo-04.png"
                    alt="Flyola Logo"
                    width={120}
                    height={60}
                    priority
                    className="drop-shadow-lg"
                  />
                </div>
              </div>
            </motion.div>

            {/* Modern Progress Bar */}
            <div className="w-64 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/80 text-sm font-medium">Loading Experience</span>
                <span className="text-white text-sm font-bold">{Math.round(progress)}%</span>
              </div>

              <div className="relative h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 1.8, ease: "easeOut" }}
                />

                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>

            {/* Loading Text with Typewriter Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <motion.h2
                className="text-white text-xl font-bold mb-2"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Preparing Your Flight Experience
              </motion.h2>

              <motion.p
                className="text-white/70 text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                {progress < 30 && "Initializing systems..."}
                {progress >= 30 && progress < 60 && "Loading flight data..."}
                {progress >= 60 && progress < 90 && "Preparing interface..."}
                {progress >= 90 && "Almost ready!"}
              </motion.p>
            </motion.div>

            {/* Pulsing Dots */}
            <div className="flex space-x-2 mt-6">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-white/60 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}