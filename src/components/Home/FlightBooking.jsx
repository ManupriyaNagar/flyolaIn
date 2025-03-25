"use client";

import { useState, useEffect, useRef } from "react";
import { FaPlaneDeparture, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function FlightBooking() {
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [date, setDate] = useState("");
  const [passengerData, setPassengerData] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [isPassengerDropdownOpen, setIsPassengerDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Calculate total passengers
  const totalPassengers =
    passengerData.adults + passengerData.children + passengerData.infants;

  // Handle passenger count changes
  const handlePassengerChange = (type, action) => {
    setPassengerData((prev) => {
      const newValue =
        action === "increment"
          ? prev[type] + 1
          : Math.max(0, prev[type] - 1); // Prevent negative values
      return { ...prev, [type]: newValue };
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPassengerDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 mt-30"
      style={{
        backgroundImage: "url('/back.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Overlay for better contrast */}
      {/* <div className="absolute inset-0 bg-black/50"  /> */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-5xl"
      >
        <Card className="bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl border border-gray-200 m-30">
          <CardContent className="p-8 flex flex-col gap-6">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
              Book Your Flight with Flyola
            </h1>
            <p className="text-center text-gray-600 text-lg">
              Find the best flights for your journey in just a few clicks
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Departure Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Input
                  type="text"
                  placeholder="Departure From"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-300"
                />
              </motion.div>

              {/* Arrival Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Input
                  type="text"
                  placeholder="Arrival To"
                  value={arrival}
                  onChange={(e) => setArrival(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-300"
                />
              </motion.div>

              {/* Date Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-300"
                />
              </motion.div>

              {/* Passenger Selection */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="relative"
                ref={dropdownRef}
              >
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
              </motion.div>
            </div>

            {/* Search Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 text-lg font-semibold rounded-lg flex items-center justify-center gap-3 hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg">
                <FaPlaneDeparture className="text-xl" /> Search Flights
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}