"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { FaPlane, FaGlobe, FaCompass, FaHeadset, FaArrowRight } from "react-icons/fa";

// Enhanced features array with modern aviation theme
const features = [
  {
    icon: FaPlane,
    title: "Easy Booking",
    description: "Streamlined booking process with instant confirmations and secure payments. Experience hassle-free flight reservations in just a few clicks.",
    gradient: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-50 to-indigo-50",
    iconColor: "text-blue-600",
    delay: 0.1,
  },
  {
    icon: FaGlobe,
    title: "Global Destinations",
    description: "Access to premium destinations worldwide with our extensive network of aviation partners and exclusive routes.",
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50",
    iconColor: "text-emerald-600",
    delay: 0.2,
  },
  {
    icon: FaCompass,
    title: "Expert Guidance",
    description: "Professional travel consultation and personalized flight recommendations tailored to your specific needs and preferences.",
    gradient: "from-purple-500 to-pink-600",
    bgGradient: "from-purple-50 to-pink-50",
    iconColor: "text-purple-600",
    delay: 0.3,
  },
  {
    icon: FaHeadset,
    title: "24/7 Support",
    description: "Round-the-clock customer support with dedicated aviation specialists ready to assist you at every step of your journey.",
    gradient: "from-orange-500 to-red-600",
    bgGradient: "from-orange-50 to-red-50",
    iconColor: "text-orange-600",
    delay: 0.4,
  },
];

/**
 * Enhanced FeatureCards Component with modern design and animations
 * @returns {JSX.Element} Professional grid of feature cards
 */
const FeatureCards = memo(() => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-indigo-300 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-blue-300 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-purple-300 rounded-full"></div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Why Choose Flyola?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience premium aviation services with our comprehensive suite of features designed for modern travelers
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: feature.delay }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className={`bg-gradient-to-br ${feature.bgGradient} p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 backdrop-blur-sm h-full flex flex-col`}>
                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="text-white text-2xl" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FaArrowRight className="text-gray-400 text-xs absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <h3 className={`text-xl lg:text-2xl font-bold ${feature.iconColor} mb-4 group-hover:text-gray-800 transition-colors duration-300`}>
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <button className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-indigo-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            Explore Our Services
          </button>
        </motion.div>
      </div>
    </section>
  );
});

FeatureCards.displayName = "FeatureCards";

export default FeatureCards;