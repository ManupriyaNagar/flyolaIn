"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const cities = [
  { code: "BKK", image: "/back.jpg" },
  { code: "BLR", image: "/back.jpg" },
  { code: "DEL", image: "/back.jpg" },
  { code: "GOI", image: "/back.jpg" },
  { code: "HYD", image: "/back.jpg" },
  { code: "IXL", image: "/back.jpg" },
  { code: "BOM", image: "/back.jpg" },
  { code: "PNQ", image: "/back.jpg" },
  { code: "SXR", image: "/back.jpg" },
];

// Double the cities array to create a seamless loop
const infiniteCities = [...cities, ...cities];

export default function CityCarousel() {
  return (
    <div className="max-w-5xl mx-auto py-6 overflow-hidden">
      <motion.div 
        className="flex gap-4"
        animate={{
          x: [0, -100 * cities.length],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {infiniteCities.map((city, index) => (
          <div key={index} className="flex-shrink-0">
            <motion.div
              className="relative w-32 h-24 md:w-30 md:h-40 rounded-full border-4 border-blue-700 flex items-center justify-center overflow-hidden"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={city.image}
                alt={city.code}
                layout="fill"
                objectFit="cover"
              />
              <span className="absolute bottom-2 text-white font-bold text-lg bg-black/50 px-2 py-1 rounded">
                {city.code}
              </span>
            </motion.div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
