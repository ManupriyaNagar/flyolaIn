"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const destinations = [
  {
    image:
      "f2.png",
    tilt: -10, // Tilt to the left
    zIndex: 1,
  },
  {
    image:
      "f6.png",
    tilt: 5, // Slight tilt to the right
    zIndex: 2,
  },
  {
    image:
      "f5.png",
    tilt: 0, // Straight (center card)
    zIndex: 3,
  },
  {
    image:
      "f4.png",
    tilt: -5, // Slight tilt to the left
    zIndex: 2,
  },
  {
    image:
      "f3.png",
    tilt: 10, // Tilt to the right
    zIndex: 1,
  },
];

export default function PopularDestinations() {
  return (
    <section className="py-16 bg-white px-10">
      <div className=" px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Popular Destinations
          </h2>
         
        </div>

        {/* Destinations Grid */}
        <div className="relative flex justify-center items-center gap-4 md:gap-8 ">
          {destinations.map((destination, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 20,
                rotateY: destination.tilt,
                rotateZ: destination.tilt / 2,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                rotateY: destination.tilt,
                rotateZ: destination.tilt / 2,
              }}
              whileHover={{
                scale: 1.05,
                rotateY: destination.tilt * 1.2,
                rotateZ: destination.tilt / 1.5,
                zIndex: 5,
              }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative w-64 h-50 bg-white rounded-2xl shadow-xl overflow-hidden"
              style={{
                zIndex: destination.zIndex,
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
            >
              {/* Image with Border */}
              <div className="relative w-full h-full border-4 border-white rounded-2xl">
                <Image
                  src={destination.image}
                  alt={`Destination ${index + 1}`}
                  fill
                  className="object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t h-6 from-black/40 to-transparent rounded-2xl" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}