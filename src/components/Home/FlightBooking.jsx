"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaPlaneDeparture, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import BASE_URL from "@/baseUrl/baseUrl";

export default function FlightBooking() {
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [date, setDate] = useState("");
  const [passengerData, setPassengerData] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [airports, setAirports] = useState([]);
  const [isPassengerDropdownOpen, setIsPassengerDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await fetch(`${BASE_URL}/airport`);
        const data = await response.json();
        setAirports(data);
      } catch (error) {
        console.error("Error fetching airports:", error);
      }
    };
    fetchAirports();
  }, []);

  const totalPassengers =
    passengerData.adults + passengerData.children + passengerData.infants;

  const handlePassengerChange = (type, action) => {
    setPassengerData((prev) => {
      const newValue =
        action === "increment"
          ? prev[type] + 1
          : Math.max(0, prev[type] - 1);
      return { ...prev, [type]: newValue };
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPassengerDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCityFromCode = (code) => {
    const airport = airports.find((a) => a.airport_code === code);
    return airport ? airport.city : "";
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen p-4 mt-20 bg-gradient-to-br from-gray-900 to-gray-800"
      style={{
        backgroundImage: "url('/back.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-7xl mx-auto"
      >
        <Card className="bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl border border-gray-200 m-6 md:m-40 py-8 md:py-14 px-6 md:px-14">
          <CardContent className="p-4 sm:p-8 flex flex-col gap-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-800">
              Book Your Flight with Flyola
            </h1>
            <p className="text-center text-gray-600 text-sm sm:text-base">
              Find the best flights for your journey in just a few clicks
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Departure Airport Dropdown */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <select
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  className="w-full h-12 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-300"
                >
                  <option value="">Select Departure Airport</option>
                  {airports.map((airport) => (
                    <option key={airport.id} value={airport.airport_code}>
                      {airport.airport_name} ({airport.city})
                    </option>
                  ))}
                </select>
              </motion.div>

              {/* Arrival Airport Dropdown */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <select
                  value={arrival}
                  onChange={(e) => setArrival(e.target.value)}
                  className="w-full h-12 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-300"
                >
                  <option value="">Select Arrival Airport</option>
                  {airports.map((airport) => (
                    <option key={airport.id} value={airport.airport_code}>
                      {airport.airport_name} ({airport.city})
                    </option>
                  ))}
                </select>
              </motion.div>

              {/* Date Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Input
                  type="date"
                  placeholder="dd/mm/yyyy"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full h-12 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-300"
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
                  onClick={() => setIsPassengerDropdownOpen(!isPassengerDropdownOpen)}
                  className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer bg-white shadow-sm hover:shadow-md transition-all duration-300 h-12"
                >
                  <FaUser className="text-indigo-500" />
                  <span className="text-gray-700 font-medium">
                    {totalPassengers} Passenger{totalPassengers !== 1 ? "s" : ""}
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

                {isPassengerDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-12 left-0 w-48 sm:w-60 bg-white border border-gray-200 rounded-lg shadow-xl z-10 p-3 sm:p-4"
                  >
                    {/* Adults */}
                    <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100">
                      <div>
                        <p className="text-gray-800 font-semibold text-xs sm:text-sm">
                          Adults
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">(12+ yrs)</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePassengerChange("adults", "decrement")}
                          className="w-7 h-7 flex items-center justify-center bg-indigo-50 rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={passengerData.adults === 0}
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-medium text-gray-800 text-xs sm:text-base">
                          {passengerData.adults}
                        </span>
                        <button
                          onClick={() => handlePassengerChange("adults", "increment")}
                          className="w-7 h-7 flex items-center justify-center bg-indigo-50 rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors duration-200"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100">
                      <div>
                        <p className="text-gray-800 font-semibold text-xs sm:text-sm">
                          Children
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">(2-12 yrs)</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePassengerChange("children", "decrement")}
                          className="w-7 h-7 flex items-center justify-center bg-indigo-50 rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={passengerData.children === 0}
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-medium text-gray-800 text-xs sm:text-base">
                          {passengerData.children}
                        </span>
                        <button
                          onClick={() => handlePassengerChange("children", "increment")}
                          className="w-7 h-7 flex items-center justify-center bg-indigo-50 rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors duration-200"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Infants */}
                    <div className="flex items-center justify-between py-2 sm:py-3">
                      <div>
                        <p className="text-gray-800 font-semibold text-xs sm:text-sm">
                          Infant(s)
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">(0-2 yrs)</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePassengerChange("infants", "decrement")}
                          className="w-7 h-7 flex items-center justify-center bg-indigo-50 rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={passengerData.infants === 0}
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-medium text-gray-800 text-xs sm:text-base">
                          {passengerData.infants}
                        </span>
                        <button
                          onClick={() => handlePassengerChange("infants", "increment")}
                          className="w-7 h-7 flex items-center justify-center bg-indigo-50 rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors duration-200"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* CHARDHAM YATRA Button */}
           

            {/* Search Flights Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href={{
                  pathname: "/scheduled-flight",
                  query: {
                    departure: getCityFromCode(departure) || "",
                    arrival: getCityFromCode(arrival) || "",
                    date: date || "",
                    passengers: totalPassengers,
                  },
                }}
              >
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 sm:py-4 text-lg font-semibold rounded-lg flex items-center justify-center gap-3 hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg">
                  <FaPlaneDeparture className="text-xl sm:text-2xl" /> Search Flights
                </Button>
              </Link>
            </motion.div>




            <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5 }}
>
<button
  onClick={() => window.open("https://flyola.in/chardham/", "_blank")}
  className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 text-white py-2 text-xs md:text-sm font-semibold rounded-lg flex items-center justify-center gap-3 hover:from-orange-400 hover:to-red-400 transition-all duration-300 shadow-md hover:shadow-lg"
>
  <FaPlaneDeparture className="md:text-xl" /> CHARDHAM YATRA 
</button>

</motion.div>





          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
