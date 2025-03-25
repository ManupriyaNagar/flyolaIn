"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

export default function CautionNoticePage() {
  const [isVisible, setIsVisible] = useState(true);

  // Close the notice
  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-indigo-900 p-4 mt-30">
      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-8 text-white"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300"
          aria-label="Close notice"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        {/* Header */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-yellow-400 mb-6"
        >
          Caution Notice
        </motion.h1>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-6 text-gray-200 text-lg leading-relaxed"
        >
          <p>
            Please be informed that joyride bookings are exclusively available
            through the official{" "}
            <span className="font-semibold text-white">
              Jet Serve Aviation Pvt. Ltd
            </span>{" "}
            Company Portal -{" "}
            <a
              href="https://www.flyola.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:underline transition-colors duration-300"
            >
              www.flyola.in
            </a>{" "}
            (online booking).
          </p>

          <p>
            No other website, app, or third-party source is authorized to accept
            bookings on our behalf.
          </p>

          <p>
            Be cautious while making online bookings and avoid trusting any
            unauthorized platforms or intermediaries.
          </p>

          {/* Highlighted Section */}
          <div className="border-l-4 border-yellow-400 pl-4">
            <p className="text-xl font-semibold text-white">
              Jet Serve Aviation Pvt. Ltd is the only authorized provider of
              these services.
            </p>
          </div>

          <p>
            For a safe and genuine booking experience, always use our official
            portal.
          </p>

          {/* Disclaimer */}
          <div className="text-sm text-gray-400">
            <p>
              <span className="font-semibold text-white">Disclaimer:</span> Jet
              Serve Aviation Pvt. Ltd shall not be responsible for any kind of
              loss, financial or otherwise, arising from bookings made through
              unauthorized sources. Please ensure all bookings are made only
              through our official portal for a safe and secure experience.
            </p>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8"
        >
          <a
            href="https://www.flyola.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full text-center px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Visit Official Portal
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}