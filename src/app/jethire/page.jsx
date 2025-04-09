"use client";

import Carousel from "@/components/ui/Carousel";
import { motion } from "framer-motion";

function JetHirePage() {  // Renamed from CarouselDemo to be more specific to the page
  const slideData = [
    {
      title: "Mystic Mountains",
      button: "Explore Now",
      src: "https://images.unsplash.com/photo-1494806812796-244fe51b774d?q=80&w=3534&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Discover the serene beauty of untouched peaks",
    },
    {
      title: "Urban Dreams",
      button: "Discover City",
      src: "https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Experience the pulse of metropolitan life",
    },
    {
      title: "Neon Nights",
      button: "Night Tour",
      src: "https://images.unsplash.com/photo-1590041794748-2d8eb73a571c?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Immerse in the vibrant city nightlife",
    },
    {
      title: "Desert Whispers",
      button: "Journey Now",
      src: "https://images.unsplash.com/photo-1679420437432-80cfbf88986c?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Unravel the mysteries of endless sands",
    },
  ];

  return (
    <section className="relative w-full min-h-screen py-20 bg-gradient-to-b from-gray-900 to-gray-800 mt-30">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="container mx-auto px-4"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Explore Your Next Adventure
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Journey through breathtaking destinations with our interactive carousel
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
          <Carousel 
            slides={slideData}
            options={{
              autoPlay: true,
              interval: 5000,
              pauseOnHover: true,
              showIndicators: true,
              showArrows: true,
            }}
            className="h-[600px] w-full"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
            {slideData.map((_, index) => (
              <button
                key={index}
                className="w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-all duration-300"
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default JetHirePage;  // Added default exports