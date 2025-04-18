"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const cities = [
  { code: "BHO", image: "/f1.png", name: "Raja Bhoj Airport" },
  { code: "JLR", image: "/f2.png", name: "Jabalpur Airport" },
  { code: "HJR", image: "/f3.png", name: "Khajuraho Airport" },
  { code: "GWL", image: "/f4.png", name: "Gwalior Airport" },
  { code: "IDR", image: "/f5.png", name: "Devi Ahilyabai Holkar Airport" },
  { code: "SGR", image: "/f6.png", name: "Singrauli Airport" },
  { code: "REW", image: "/f7.png", name: "Rewari Airport" },
  { code: "UJN", image: "/f8.png", name: "Ujjain Airport" },
  { code: "TNI", image: "/f9.png", name: "Bharhut Airport Satna" },


  
];

// Double the cities array for seamless looping
const infiniteCities = [...cities, ...cities];

export default function CityCarousel() {
  return (
    <div className=" py-12 overflow-hidden bg-gray-50">
      <h1 className="text-center text-4xl font-bold mb-10">Find Your Next Destination</h1>
      <motion.div
        className="flex gap-6"
        animate={{
          x: [0, -cities.length * 180], // Adjusted based on card width + gap
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {infiniteCities.map((city, index) => (
          <motion.div
            key={`${city.code}-${index}`}
            className="flex-shrink-0 w-40 md:w-56"
            whileHover={{ y: -10, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="relative h-48 md:h-64 rounded-xl overflow-hidden shadow-lg border-2 border-blue-600/20 group">
              <Image
                src={city.image}
                alt={`${city.name} (${city.code})`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                quality={75}
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/30 to-transparent"></div>
              
              {/* City Info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <span className="block text-xl md:text-2xl font-bold tracking-wide">
                  {city.code}
                </span>
                <span className="block text-sm md:text-base font-medium opacity-90">
                  {city.name}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}