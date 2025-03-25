"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { FaPlaneDeparture, FaUser } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

// Destination cards data (same as previous PopularDestinations)
const destinations = [
  {
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=3540&auto=format&fit=crop",
    tilt: -10,
    zIndex: 1,
  },
  {
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=3540&auto=format&fit=crop",
    tilt: 5,
    zIndex: 2,
  },
  {
    image:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=3540&auto=format&fit=crop",
    tilt: 0,
    zIndex: 3,
  },
  {
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=3540&auto=format&fit=crop",
    tilt: -5,
    zIndex: 2,
  },
  {
    image:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=3540&auto=format&fit=crop",
    tilt: 10,
    zIndex: 1,
  },
];

// Partner logos (mock data)
const partners = [
  { name: "Scotol", logo: "https://via.placeholder.com/100x40?text=Scotol" },
  { name: "Emben", logo: "https://via.placeholder.com/100x40?text=Emben" },
  { name: "Apex", logo: "https://via.placeholder.com/100x40?text=Apex" },
  { name: "Alex", logo: "https://via.placeholder.com/100x40?text=Alex" },
];

export default function Photu() {
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [date, setDate] = useState("");
  const [passengerData, setPassengerData] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [isPassengerDropdownOpen, setIsPassengerDropdownOpen] = useState(false);

  // Animation controls for destination cards
  const controls = useAnimation();

  // Calculate total passengers
  const totalPassengers =
    passengerData.adults + passengerData.children + passengerData.infants;

  // Handle passenger count changes
  const handlePassengerChange = (type, action) => {
    setPassengerData((prev) => {
      const newValue =
        action === "increment"
          ? prev[type] + 1
          : Math.max(0, prev[type] - 1);
      return { ...prev, [type]: newValue };
    });
  };

  // Animate destination cards from right to left
  useEffect(() => {
    const animateCards = async () => {
      await controls.start((i) => ({
        x: [-1000, 0], // Start from far right and move to position
        opacity: [0, 1],
        transition: {
          duration: 1.5,
          delay: i * 0.3,
          ease: "easeOut",
        },
      }));
    };
    animateCards();
  }, [controls]);

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507521628349-dee6c568a64c?q=80&w=3540&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-16 px-4">
        {/* Main Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl"
        >
          <Card className="bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl border border-gray-200">
            <CardContent className="p-8 flex flex-col gap-6">
              <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
                Search Flights
              </h1>
              <p className="text-center text-gray-600 text-lg">
                Discover the best flights for your journey
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Origin Input */}
                <Input
                  type="text"
                  placeholder="Origin"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-300"
                />

                {/* Destination Input */}
                <Input
                  type="text"
                  placeholder="Destination"
                  value={arrival}
                  onChange={(e) => setArrival(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-300"
                />

                {/* Date Input */}
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-300"
                />

                {/* Passenger Selection */}
                <div className="relative">
                  <div
                    className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-3 cursor-pointer bg-white shadow-sm hover:shadow-md transition-all duration-300"
                    onClick={() =>
                      setIsPassengerDropdownOpen(!isPassengerDropdownOpen)
                    }
                  >
                    <FaUser className="text-indigo-500" />
                    <span className="text-gray-700 font-medium">
                      {totalPassengers} Passenger
                      {totalPassengers !== 1 ? "s" : ""}
                    </span>
                    <svg
                      className={`w-4 h-4 ml-auto text-gray-500 transition-transform duration-300 ${
                        isPassengerDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {/* Passenger Dropdown */}
                  {isPassengerDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-14 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-4"
                    >
                      {/* Adults */}
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="text-gray-800 font-semibold">Adults</p>
                          <p className="text-sm text-gray-500">(12+ yrs)</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              handlePassengerChange("adults", "decrement")
                            }
                            className="w-9 h-9 flex items-center justify-center bg-indigo-50 rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={passengerData.adults === 0}
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium text-gray-800">
                            {passengerData.adults}
                          </span>
                          <button
                            onClick={() =>
                              handlePassengerChange("adults", "increment")
                            }
                            className="w-9 h-9 flex items-center justify-center bg-indigo-50 rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors duration-200"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Children */}
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="text-gray-800 font-semibold">Children</p>
                          <p className="text-sm text-gray-500">(2-12 yrs)</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              handlePassengerChange("children", "decrement")
                            }
                            className="w-9 h-9 flex items-center justify-center bg-indigo-50 rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={passengerData.children === 0}
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium text-gray-800">
                            {passengerData.children}
                          </span>
                          <button
                            onClick={() =>
                              handlePassengerChange("children", "increment")
                            }
                            className="w-9 h-9 flex items-center justify-center bg-indigo-50 rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors duration-200"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Infants */}
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-gray-800 font-semibold">Infant(s)</p>
                          <p className="text-sm text-gray-500">(0-2 yrs)</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              handlePassengerChange("infants", "decrement")
                            }
                            className="w-9 h-9 flex items-center justify-center bg-indigo-50 rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={passengerData.infants === 0}
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium text-gray-800">
                            {passengerData.infants}
                          </span>
                          <button
                            onClick={() =>
                              handlePassengerChange("infants", "increment")
                            }
                            className="w-9 h-9 flex items-center justify-center bg-indigo-50 rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors duration-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Search Button */}
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 text-lg font-semibold rounded-lg flex items-center justify-center gap-3 hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg">
                <FaPlaneDeparture className="text-xl" /> Search Flights
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Popular Destinations Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-12 w-full"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Popular Destinations
            </h2>
            <a
              href="#"
              className="text-indigo-300 font-medium hover:underline transition-colors duration-300"
            >
              See More
            </a>
          </div>

          {/* Destination Cards (Moving Right to Left) */}
          <div className="relative flex justify-center items-center gap-4 md:gap-8 overflow-hidden">
            {destinations.map((destination, index) => (
              <motion.div
                key={index}
                custom={index}
                animate={controls}
                className="relative w-64 h-96 bg-white rounded-2xl shadow-xl overflow-hidden"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl" />
                </div>

                {/* Circular Icon */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Partner Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-12 flex justify-center gap-6 flex-wrap"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              className="bg-white/90 backdrop-blur-md rounded-lg p-2 shadow-md"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={100}
                height={40}
                className="object-contain"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}