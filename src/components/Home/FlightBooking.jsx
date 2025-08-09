"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FaPlaneDeparture,
  FaUser,
  FaHelicopter,
  FaCalendarCheck,
  FaPlane,
  FaHotel,
  FaHome,
  FaUmbrellaBeach,
  FaTrain,
  FaBus,
  FaTaxi,
  FaPassport,
  FaExchangeAlt,
  FaMapMarkerAlt,
  FaClock
} from "react-icons/fa";
import { MdErrorOutline, MdFlightTakeoff, MdFlightLand } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import BASE_URL from "@/baseUrl/baseUrl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/Loader";

// Modern Loading Components
const SkeletonLoader = ({ className = "" }) => (
  <div className={`animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded-xl ${className}`} />
);

const PulsingDot = ({ delay = 0 }) => (
  <div
    className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"
    style={{ animationDelay: `${delay}ms`, animationDuration: '1s' }}
  />
);

const ModernSpinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="relative w-full h-full">
        <div className="absolute inset-0 border-2 border-indigo-200 rounded-full"></div>
        <div className="absolute inset-0 border-2 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

// Comprehensive Skeleton Loading Component
const FlightBookingSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="relative z-10 w-full"
  >
    <Card className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/20 mx-4 sm:mx-6 md:mx-20 lg:mx-32 overflow-visible">
      <CardContent className="p-6 sm:p-8 flex flex-col gap-8">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <SkeletonLoader className="w-16 h-16 rounded-full" />
            <SkeletonLoader className="h-12 w-80" />
          </div>
          <SkeletonLoader className="h-6 w-96 mx-auto" />
          <SkeletonLoader className="h-4 w-64 mx-auto" />
        </div>

        {/* Form Skeleton */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Form Fields Skeleton */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex flex-col space-y-2">
                <SkeletonLoader className="h-4 w-20" />
                <SkeletonLoader className="h-24 w-full" />
              </div>
            ))}

            {/* Search Button Skeleton */}
            <div className="flex justify-center">
              <SkeletonLoader className="h-14 w-full mt-7 sm:w-40 rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[1, 2, 3, 4].map((item) => (
            <SkeletonLoader key={item} className="h-16 rounded-2xl" />
          ))}
        </div>

        {/* Loading Indicator */}
        <div className="flex items-center justify-center gap-4 py-8">
          <ModernSpinner size="lg" />
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-700">Loading Flight Booking</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <PulsingDot delay={0} />
              <PulsingDot delay={200} />
              <PulsingDot delay={400} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function FlightBooking() {



  const services = [
    { label: "Flights", value: "flights", icon: FaPlane },
    { label: "Hotels", value: "hotels", icon: FaHotel },
    { label: "Homestays ", value: "homestays", icon: FaHome },
    { label: "Holiday ", value: "packages", icon: FaUmbrellaBeach },
    { label: "Trains", value: "trains", icon: FaTrain },
    { label: "Buses", value: "buses", icon: FaBus },
    { label: "Cabs", value: "cabs", icon: FaTaxi },
    { label: "Visa", value: "visa", icon: FaPassport },

  ];
  const [selectedService, setSelectedService] = useState("flights");










  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [date, setDate] = useState("");
  const [passengerData, setPassengerData] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [airports, setAirports] = useState([]);
  const [isLoadingAirports, setIsLoadingAirports] = useState(true);
  const [airportFetchError, setAirportFetchError] = useState(null);
  const [isPassengerDropdownOpen, setIsPassengerDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchAirports = async () => {
      setIsLoadingAirports(true);
      setAirportFetchError(null);
      try {
        const response = await fetch(`${BASE_URL}/airport`);
        if (!response.ok) {
          throw new Error(`Failed to fetch airports: ${response.status}`);
        }
        const data = await response.json();
        setAirports(data);
      } catch (error) {
        setAirportFetchError(error.message);
      } finally {
        setIsLoadingAirports(false);
      }
    };
    fetchAirports();
  }, []);

  const totalPassengers =
    passengerData.adults + passengerData.children + passengerData.infants;

  const handlePassengerChange = (type, action) => {
    setPassengerData((prev) => {
      let newValue = prev[type];
      if (action === "increment") {
        newValue = prev[type] + 1;
      } else {
        newValue = Math.max(0, prev[type] - 1);
      }

      if (
        type === "adults" &&
        newValue === 0 &&
        (prev.children > 0 ||
          prev.infants > 0 ||
          (prev.adults === 1 && prev.children === 0 && prev.infants === 0))
      ) {
        return prev;
      }
      if (
        newValue === 0 &&
        prev.adults === 0 &&
        type !== "adults" &&
        totalPassengers - prev[type] === 0
      ) {
        return prev;
      }

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

  const isSearchDisabled =
    !departure ||
    !arrival ||
    !date ||
    totalPassengers === 0 ||
    isLoadingAirports ||
    airportFetchError;

    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen p-4">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute min-w-full min-h-full object-cover"
          >
            <source src="/backgroundvideo.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/30" />
        </div>
    
        {/* Show skeleton loading when airports are loading */}
        <AnimatePresence mode="wait">
          {isLoadingAirports ? (
            <FlightBookingSkeleton key="skeleton" />
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 w-full"
            >
              {/* Main Booking Card */}
              <Card className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/20 mx-4 sm:mx-6 md:mx-20 lg:mx-32 overflow-visible">
                <CardContent className="p-6 sm:p-8 flex flex-col gap-8">
                  {/* Header Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="p-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full">
                        <FaPlane className="text-2xl text-white" />
                      </div>
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                        Book Your Flight
                      </h1>
                    </div>
                    <p className="text-gray-600 text-lg">
                      Experience premium aviation services with{" "}
                      <span className="font-bold text-indigo-600 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                        Jet Serve Aviation
                      </span>
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500">
                      <FaClock className="text-indigo-500" />
                      <span>Your journey starts here - Safe, Comfortable, Reliable</span>
                    </div>
                  </motion.div>
    
                  {/* Flight Search Form */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      {/* Departure Airport Dropdown */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col"
                      >
                        <label
                          htmlFor="departure-airport"
                          className="mb-2 text-sm font-semibold text-gray-700 flex items-center gap-2"
                        >
                          <MdFlightTakeoff className="text-indigo-500" />
                          From
                        </label>
                        <Select
                          value={departure}
                          onValueChange={setDeparture}
                          disabled={isLoadingAirports || !!airportFetchError}
                        >
                          <SelectTrigger
                            id="departure-airport"
                            className="w-full h-24 py-[1.6rem] text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:border-indigo-300 transition-all duration-300 bg-white"
                          >
                            <SelectValue placeholder="Select departure city" />
                          </SelectTrigger>
                          <SelectContent>
                            {isLoadingAirports ? (
                              <SelectItem
                                value="loading"
                                disabled
                                className="flex items-center justify-center py-4"
                              >
                                <div className="flex items-center gap-3">
                                  <ModernSpinner size="sm" />
                                  <span className="text-gray-600">Loading airports...</span>
                                  <div className="flex gap-1">
                                    <PulsingDot delay={0} />
                                    <PulsingDot delay={200} />
                                    <PulsingDot delay={400} />
                                  </div>
                                </div>
                              </SelectItem>
                            ) : airportFetchError ? (
                              <SelectItem
                                value="error"
                                disabled
                                className="flex items-center text-red-600"
                              >
                                <MdErrorOutline className="mr-2" /> Error loading data.
                              </SelectItem>
                            ) : (
                              airports.map((airport) => (
                                <SelectItem
                                  key={`dep-${airport.id}`}
                                  value={airport.airport_code}
                                >
                                  {airport.airport_name} ({airport.city})
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </motion.div>
    
                      {/* Arrival Airport Dropdown */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col"
                      >
                        <label
                          htmlFor="arrival-airport"
                          className="mb-2 text-sm font-semibold text-gray-700 flex items-center gap-2"
                        >
                          <MdFlightLand className="text-indigo-500" />
                          To
                        </label>
                        <Select
                          value={arrival}
                          onValueChange={setArrival}
                          disabled={isLoadingAirports || !!airportFetchError}
                        >
                          <SelectTrigger
                            id="arrival-airport"
                            className="w-full h-24 py-[1.6rem] text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:border-indigo-300 transition-all duration-300 bg-white"
                          >
                            <SelectValue placeholder="Select destination city" />
                          </SelectTrigger>
                          <SelectContent>
                            {isLoadingAirports ? (
                              <SelectItem
                                value="loading"
                                disabled
                                className="flex items-center justify-center py-4"
                              >
                                <div className="flex items-center gap-3">
                                  <ModernSpinner size="sm" />
                                  <span className="text-gray-600">Loading airports...</span>
                                  <div className="flex gap-1">
                                    <PulsingDot delay={0} />
                                    <PulsingDot delay={200} />
                                    <PulsingDot delay={400} />
                                  </div>
                                </div>
                              </SelectItem>
                            ) : airportFetchError ? (
                              <SelectItem
                                value="error"
                                disabled
                                className="flex items-center text-red-600"
                              >
                                <MdErrorOutline className="mr-2" /> Error loading data.
                              </SelectItem>
                            ) : (
                              airports.map((airport) => (
                                <SelectItem
                                  key={`arr-${airport.id}`}
                                  value={airport.airport_code}
                                >
                                  {airport.airport_name} ({airport.city})
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </motion.div>
    
                      {/* Date Input */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex flex-col"
                      >
                        <label
                          htmlFor="flight-date"
                          className="mb-2 text-sm font-semibold text-gray-700 flex items-center gap-2"
                        >
                          <FaCalendarCheck className="text-indigo-500" />
                          Departure Date
                        </label>
                        <Input
                          id="flight-date"
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full h-14 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:border-indigo-300 transition-all duration-300 bg-white"
                        />
                      </motion.div>
    
                      {/* Passenger Selection */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="relative flex flex-col"
                        ref={dropdownRef}
                      >
                        <label
                          htmlFor="passengers"
                          className="mb-2 text-sm font-semibold text-gray-700 flex items-center gap-2"
                        >
                          <FaUser className="text-indigo-500" />
                          Passengers
                        </label>
                        <div
                          id="passengers"
                          onClick={() => setIsPassengerDropdownOpen(!isPassengerDropdownOpen)}
                          className={`flex items-center gap-3 border-2 rounded-xl px-4 py-4 text-sm cursor-pointer bg-white shadow-sm hover:border-indigo-300 transition-all duration-300 h-14 ${
                            isPassengerDropdownOpen
                              ? "border-indigo-500 ring-2 ring-indigo-500"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <FaUser className="text-indigo-600" />
                          </div>
                          <span className="text-gray-700 font-semibold flex-grow">
                            {totalPassengers} Passenger{totalPassengers !== 1 ? "s" : ""}
                          </span>
                          <svg
                            className={`w-5 h-5 ml-auto text-indigo-500 transition-transform duration-300 ${
                              isPassengerDropdownOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                        <AnimatePresence>
                          {isPassengerDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -10, scale: 0.95 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="absolute top-full mt-2 left-0 w-full min-w-[330px] max-w-[90vw] bg-white border-2 border-gray-100 rounded-2xl shadow-2xl z-30 p-6 space-y-4 overflow-y-auto max-h-[50vh]"
                            >
                              {/* Adults */}
                              <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <div>
                                  <p className="text-gray-800 font-semibold">Adults</p>
                                  <p className="text-xs text-gray-500">(12+ years)</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePassengerChange("adults", "decrement")}
                                    className="w-10 h-10 rounded-full text-indigo-600 border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 transition-all"
                                    disabled={
                                      passengerData.adults ===
                                        (passengerData.children > 0 || passengerData.infants > 0
                                          ? 1
                                          : 0) && totalPassengers === passengerData.adults
                                    }
                                  >
                                    -
                                  </Button>
                                  <span className="w-10 text-center font-bold text-gray-800 text-lg">
                                    {passengerData.adults}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePassengerChange("adults", "increment")}
                                    className="w-10 h-10 rounded-full text-indigo-600 border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                              <Separator className="my-2" />
                              {/* Children */}
                              <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <div>
                                  <p className="text-gray-800 font-semibold">Children</p>
                                  <p className="text-xs text-gray-500">(2-12 years)</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePassengerChange("children", "decrement")}
                                    className="w-10 h-10 rounded-full text-indigo-600 border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 transition-all"
                                    disabled={passengerData.children === 0}
                                  >
                                    -
                                  </Button>
                                  <span className="w-10 text-center font-bold text-gray-800 text-lg">
                                    {passengerData.children}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePassengerChange("children", "increment")}
                                    className="w-10 h-10 rounded-full text-indigo-600 border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 transition-all"
                                    disabled={passengerData.adults === 0}
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                              <Separator className="my-2" />
                              {/* Infants */}
                              <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <div>
                                  <p className="text-gray-800 font-semibold">Infants</p>
                                  <p className="text-xs text-gray-500">(0-2 years)</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePassengerChange("infants", "decrement")}
                                    className="w-10 h-10 rounded-full text-indigo-600 border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 transition-all"
                                    disabled={passengerData.infants === 0}
                                  >
                                    -
                                  </Button>
                                  <span className="w-10 text-center font-bold text-gray-800 text-lg">
                                    {passengerData.infants}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePassengerChange("infants", "increment")}
                                    className="w-10 h-10 rounded-full text-indigo-600 border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-50 transition-all"
                                    disabled={passengerData.adults === 0}
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                              {passengerData.adults === 0 &&
                                (passengerData.children > 0 || passengerData.infants > 0) && (
                                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600 font-medium">
                                      ⚠️ An adult must accompany children and infants.
                                    </p>
                                  </div>
                                )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
    
                      {/* Search Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="flex justify-center"
                      >
                        <Link
                          href={{
                            pathname: "/scheduled-flight",
                            query: {
                              departure: getCityFromCode(departure) || "",
                              arrival: getCityFromCode(arrival) || "",
                              departure_code: departure || "",
                              arrival_code: arrival || "",
                              date: date || "",
                              adults: passengerData.adults,
                              children: passengerData.children,
                              infants: passengerData.infants,
                              passengers: totalPassengers,
                            },
                          }}
                          passHref
                          legacyBehavior
                        >
                          <Button
                            asChild
                            className={`w-full mt-7 sm:w-auto h-14 px-8 text-lg font-bold rounded-2xl flex items-center gap-3 transition-all duration-300 border shadow-3xl transform hover:-translate-y-1 ${
                              isSearchDisabled
                                ? "bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600"
                                : "bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-700 hover:via-blue-700 hover:to-purple-700 text-white"
                            }`}
                            disabled={isSearchDisabled}
                          >
                            <a className="flex items-center gap-3">
                              {isLoadingAirports ? (
                                <div className="flex items-center gap-2">
                                  <ModernSpinner size="sm" className="text-white" />
                                  <span>Loading...</span>
                                </div>
                              ) : (
                                <>
                                  <FaPlaneDeparture className="text-xl" />
                                  <span>Search Flights</span>
                                </>
                              )}
                            </a>
                          </Button>
                        </Link>
                      </motion.div>
                    </div>
                  </div>
    
                  {/* Error Message */}
                  {airportFetchError && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg"
                    >
                      <div className="flex items-center">
                        <MdErrorOutline className="text-red-500 text-xl mr-3" />
                        <div>
                          <p className="text-red-800 font-semibold">Connection Error</p>
                          <p className="text-red-600 text-sm">
                            Failed to load airport data: {airportFetchError}. Please refresh or try again later.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
    
                  {/* Quick Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8"
                  >
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open("https://jetserveaviation.com/chardham/", "_blank")
                      }
                      className="h-16 border-2 border-orange-400 text-orange-600 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-500 font-bold rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <FaPlaneDeparture className="text-lg" />
                      </div>
                      <span>CHARDHAM YATRA</span>
                    </Button>
    
                    <Button
                      asChild
                      className="h-16 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-2xl flex items-center gap-3 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <a href="#" onClick={(e) => e.preventDefault()}>
                        <div className="p-2 bg-white/20 rounded-lg">
                          <FaHelicopter className="text-lg" />
                        </div>
                        <span>Private Charter</span>
                      </a>
                    </Button>
    
                    <Button
                      asChild
                      className="h-16 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-2xl flex items-center gap-3 hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <a href="#" onClick={(e) => e.preventDefault()}>
                        <div className="p-2 bg-white/20 rounded-lg">
                          <FaCalendarCheck className="text-lg" />
                        </div>
                        <span>Marriage Events</span>
                      </a>
                    </Button>
    
                    <Button
                      asChild
                      className="h-16 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold rounded-2xl flex items-center gap-3 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <Link href="/joy-ride">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <FaPlane className="text-lg" />
                        </div>
                        <span>Joy Rides</span>
                      </Link>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
}