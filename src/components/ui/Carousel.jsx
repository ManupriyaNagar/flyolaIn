"use client";

import { useState } from "react";

export default function Carousel({ slides, options, className }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className={`relative ${className}`}>
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.src}
            alt={slide.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white transition-transform duration-300 hover:-translate-y-2">
            <h3 className="text-3xl font-bold mb-2">{slide.title}</h3>
            <p className="text-gray-200 mb-4">{slide.description}</p>
            <button className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-white font-medium hover:bg-white/30 transition-all duration-300 border border-white/30">
              {slide.button}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}