"use client";

import { motion } from "framer-motion";
import { WorldMap } from "../ui/WorldMap";
import { FaGlobe, FaPlane, FaMapMarkerAlt } from "react-icons/fa";

export default function WorldMapDemo() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-blue-300 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 border border-indigo-300 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-purple-300 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 text-blue-200 px-6 py-2 text-sm font-bold rounded-full shadow-sm mb-6 backdrop-blur-sm border border-white/10">
            <FaGlobe className="text-blue-400" />
            Global Network
          </div>
          
          <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6 leading-tight">
            Global Aviation{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {"Network".split("").map((letter, idx) => (
                <motion.span
                  key={idx}
                  className="inline-block"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.04 }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          </h2>
          
          <p className="text-lg text-blue-100 max-w-4xl mx-auto leading-relaxed">
            Connect to destinations worldwide with Flyola's extensive aviation network. 
            From business hubs to exotic getaways, we bridge continents with premium flight services 
            tailored for the modern traveler.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FaPlane className="text-white text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">500+</h3>
            <p className="text-blue-200 text-sm">Global Destinations</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FaMapMarkerAlt className="text-white text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">50+</h3>
            <p className="text-blue-200 text-sm">Countries Served</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FaGlobe className="text-white text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">24/7</h3>
            <p className="text-blue-200 text-sm">Global Support</p>
          </div>
        </motion.div>
      </div>

      {/* World Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <WorldMap
          dots={[
            {
              start: { lat: 28.6139, lng: 77.209 }, // New Delhi
              end: { lat: 40.7128, lng: -74.0060 }, // New York
            },
            {
              start: { lat: 28.6139, lng: 77.209 }, // New Delhi
              end: { lat: 51.5074, lng: -0.1278 }, // London
            },
            {
              start: { lat: 28.6139, lng: 77.209 }, // New Delhi
              end: { lat: 35.6762, lng: 139.6503 }, // Tokyo
            },
            {
              start: { lat: 28.6139, lng: 77.209 }, // New Delhi
              end: { lat: -33.8688, lng: 151.2093 }, // Sydney
            },
            {
              start: { lat: 28.6139, lng: 77.209 }, // New Delhi
              end: { lat: 25.2048, lng: 55.2708 }, // Dubai
            },
            {
              start: { lat: 28.6139, lng: 77.209 }, // New Delhi
              end: { lat: 1.3521, lng: 103.8198 }, // Singapore
            },
            {
              start: { lat: 51.5074, lng: -0.1278 }, // London
              end: { lat: 40.7128, lng: -74.0060 }, // New York
            },
            {
              start: { lat: 25.2048, lng: 55.2708 }, // Dubai
              end: { lat: 51.5074, lng: -0.1278 }, // London
            },
          ]}
        />
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-center mt-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Explore the World?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join our global network and experience seamless travel to any destination worldwide
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
            Explore Destinations
          </button>
        </div>
      </motion.div>
    </section>
  );
}