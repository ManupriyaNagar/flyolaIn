"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const Hero = () => {
  // Sparkle animation variants
  const sparkleVariants = {
    animate: {
      scale: [0, 1.2, 0],
      opacity: [0, 1, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatDelay: Math.random() * 2,
      },
    },
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/private-jet.jpg"
          alt="Private Jet Background"
          fill
          className="object-cover object-center"
          priority
          quality={85}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black"></div>
      </div>

      {/* Sparkles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          variants={sparkleVariants}
          animate="animate"
          initial={{ scale: 0, opacity: 0 }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          GET THE BEST & PREMIUM <br />
          <span className="bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">
            IN AVIATION INDUSTRY
          </span>
        </motion.h1>
        <motion.button
          className="mt-8 px-8 py-4 bg-white text-gray-900 font-semibold text-lg rounded-xl shadow-lg
            hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-300
            focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Request A Call
        </motion.button>
      </div>
    </section>
  );
};

export default Hero;