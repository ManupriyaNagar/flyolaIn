// src/components/Home/FlightOffers.jsx
"use client";
import React, { useRef } from "react";
import Image from "next/image";

const flightData = [
  { departureCode: "JLR", departureCity: "Jabalpur", arrivalCode: "REW", arrivalCity: "Rewa", departureTime: "11:20 AM", date: "27 Mar 2025", arrivalTime: "11:30 AM - 12:15 PM", discount: "0% Discount" },
  { departureCode: "REW", departureCity: "Rewa", arrivalCode: "REW", arrivalCity: "Rewa", departureTime: "01:00 PM", date: "27 Mar 2025", arrivalTime: "01:00 PM - 01:45 PM", discount: "0% Discount" },
  { departureCode: "SGR", departureCity: "Singrauli", arrivalCode: "BHO", arrivalCity: "Bhopal", departureTime: "10:00 AM", date: "27 Mar 2025", arrivalTime: "10:00 AM - 12:40 PM", discount: "0% Discount" },
  { departureCode: "REW", departureCity: "Rewa", arrivalCode: "BHO", arrivalCity: "Bhopal", departureTime: "10:00 AM", date: "27 Mar 2025", arrivalTime: "10:00 AM", discount: "0% Discount" },
  { departureCode: "REW", departureCity: "Rewa", arrivalCode: "REW", arrivalCity: "Rewa", departureTime: "01:00 PM", date: "27 Mar 2025", arrivalTime: "01:00 PM - 01:45 PM", discount: "0% Discount" },
  { departureCode: "SGR", departureCity: "Singrauli", arrivalCode: "BHO", arrivalCity: "Bhopal", departureTime: "10:00 AM", date: "27 Mar 2025", arrivalTime: "10:00 AM - 12:40 PM", discount: "0% Discount" },
  { departureCode: "REW", departureCity: "Rewa", arrivalCode: "BHO", arrivalCity: "Bhopal", departureTime: "10:00 AM", date: "27 Mar 2025", arrivalTime: "10:00 AM", discount: "0% Discount" },
];

const FlightOffers = () => {
  const scrollRef = useRef(null);
  const scrollBy = dir => scrollRef.current?.scrollBy({ left: dir * 240, behavior: "smooth" });

  return (
    <section className="bg-gradient-to-b from-[#e6f0fa] to-white py-10 px-6">
      <header className="max-w-4xl mx-auto text-center mb-8">
        <h2 className="text-3xl font-extrabold text-[#1a3c5e]">Flight Route Offers</h2>
        <p className="text-gray-600 mt-2">Find unbeatable deals on your next flight route.</p>
      </header>

      <div className="relative max-w-5xl mx-auto">
      <button onClick={() => scrollBy(-1)} className="arrow left-0">&#10094;</button>
      <button onClick={() => scrollBy(1)} className="arrow right-0">&#10095;</button>
        <button onClick={() => scrollBy(-1)} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow hover:bg-gray-100 transition">&#10094;</button>
        <button onClick={() => scrollBy(1)} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow hover:bg-gray-100 transition">&#10095;</button>

        <div ref={scrollRef} className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
          {flightData.map((f, i) => (
            <article key={i} className="relative flex-shrink-0 w-60 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition p-[1px] bg-gradient-to-br from-[#1a3c5e] to-[#4ca1af]">
              <div className="bg-white rounded-3xl p-6 flex flex-col h-full relative">
                <span className={`absolute top-4 left-4 text-xs font-bold text-white py-1 px-3 rounded-full shadow-md ${f.discount === "0% Discount" ? "bg-yellow-400" : "bg-green-500"}`}>
                  {f.discount}
                </span>

                <div className="mt-6 grid grid-cols-2 text-center">
                  <div>
                    <p className="text-xl font-bold text-[#1a3c5e]">{f.departureCode}</p>
                    <p className="text-xs text-gray-500">{f.departureCity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{f.arrivalCity}</p>
                    <p className="text-xl font-bold text-[#1a3c5e]">{f.arrivalCode}</p>
                  </div>
                </div>

                <div className="text-center mt-4 space-y-1">
                  <p className="text-sm font-medium text-gray-700">{f.departureTime}</p>
                  <p className="text-xs text-gray-400">{f.date}</p>
                  <p className="text-sm font-medium text-gray-700">{f.arrivalTime}</p>
                </div>

                <Image src="/logo-04.png" alt="Flyola" width={80} height={20} className="mx-auto mt-auto" />

                <button className="mt-4 w-full py-2 font-semibold rounded-full bg-gradient-to-r from-[#4ca1af] to-[#1a3c5e] text-white hover:opacity-90 transition">
                  Book Now
                </button>

                <svg className="absolute top-0 right-0 w-16 h-16 opacity-10" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M2.5 19L13 12 2.5 5v14zM13 12l8.5-7v14L13 12z"/>
                </svg>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlightOffers;
