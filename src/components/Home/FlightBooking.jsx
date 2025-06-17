"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaPlaneDeparture, FaUser, FaSpinner, FaHelicopter, FaCalendarCheck, FaPlane } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { motion } from "framer-motion";
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
import {

  FaHotel,
  FaHome,
  FaUmbrellaBeach,
  FaTrain,
  FaBus,
  FaTaxi,
  FaPassport,
  FaMoneyBillWave,
  FaShieldAlt,
} from "react-icons/fa";

export default function FlightBooking() {



  const services = [
    { label: "Flights",       value: "flights",    icon: FaPlane },
    { label: "Hotels",        value: "hotels",     icon: FaHotel },
    { label: "Homestays ", value: "homestays",  icon: FaHome },
    { label: "Holiday ",  value: "packages",   icon: FaUmbrellaBeach },
    { label: "Trains",        value: "trains",     icon: FaTrain },
    { label: "Buses",         value: "buses",      icon: FaBus },
    { label: "Cabs",          value: "cabs",       icon: FaTaxi },
    { label: "Visa",          value: "visa",       icon: FaPassport },
 
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
        <div className="absolute inset-0 " />
      </div>





  <div className="overflow-x-auto hide-scrollbar bg-white py-3 max-w-xl w-auto absolute mb-[26rem] z-20  px-96 rounded-2xl mx-auto hidden md:block">
          <ul className="flex space-x-10 mx-auto items-center justify-center">
            {services.map(({ label, value, icon: Icon }) => {
              const isActive = selectedService === value;
              return (
                <li
                  key={value}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => setSelectedService(value)}
                >
                  <Icon
                    className={`text-2xl ${
                      isActive ? "text-indigo-600" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`mt-1 text-xs whitespace-nowrap ${
                      isActive ? "text-indigo-600 font-semibold" : "text-gray-600"
                    }`}
                  >
                    {label}
                  </span>
                  {isActive && (
                    <span className="w-2 h-1 bg-indigo-600 rounded-full mt-1" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>






      
      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">




        {/* ← NEW: services nav */}
      










        <Card className="bg-white backdrop-blur-lg shadow-2xl rounded-3xl border border-gray-200/50 mx-4 sm:mx-6 md:mx-20 lg:mx-32 py-6 sm:py-8 px-4 sm:px-6">
          <CardContent className="p-4 sm:p-6 flex flex-col gap-6">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl uppercase font-bold text-gray-800">
                Book Your Flight
              </h1>
              <p className="mt-2 text-gray-600 text-sm sm:text-base">
                with{" "}
                <span className="font-semibold text-indigo-600">
                  MP Connectivity
                </span>{" "}
                - Your journey starts here!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Departure Airport Dropdown */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col"
              >
                <label
                  htmlFor="departure-airport"
                  className="mb-1 text-sm font-medium text-gray-700"
                >
                  Departure
                </label>
                <Select
                  value={departure}
                  onValueChange={setDeparture}
                  disabled={isLoadingAirports || !!airportFetchError}
                >
                  <SelectTrigger
                    id="departure-airport"
                    className="w-full h-16 py-[1.2rem] text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 shadow-sm hover:border-gray-400 transition-colors"
                  >
                    <SelectValue placeholder="Select Departure Airport" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingAirports ? (
                      <SelectItem
                        value="loading"
                        disabled
                        className="flex items-center justify-center"
                      >
                        <FaSpinner className="animate-spin mr-2" /> Loading
                        airports...
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
                transition={{ delay: 0.2 }}
                className="flex flex-col"
              >
                <label
                  htmlFor="arrival-airport"
                  className="mb-1 text-sm font-medium text-gray-700"
                >
                  Arrival
                </label>
                <Select
                  value={arrival}
                  onValueChange={setArrival}
                  disabled={isLoadingAirports || !!airportFetchError}
                >
                  <SelectTrigger
                    id="arrival-airport"
                    className="w-full h-16 py-[1.2rem] text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 shadow-sm hover:border-gray-400 transition-colors"
                  >
                    <SelectValue placeholder="Select Arrival Airport" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingAirports ? (
                      <SelectItem
                        value="loading"
                        disabled
                        className="flex items-center justify-center"
                      >
                        <FaSpinner className="animate-spin mr-2" /> Loading
                        airports...
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
                transition={{ delay: 0.3 }}
                className="flex flex-col"
              >
                <label
                  htmlFor="flight-date"
                  className="mb-1 text-sm font-medium text-gray-700"
                >
                  Date
                </label>
                <Input
                  id="flight-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full h-10 text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 shadow-sm hover:border-gray-400 transition-colors"
                />
              </motion.div>

              {/* Passenger Selection */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="relative flex flex-col"
                ref={dropdownRef}
              >
                <label
                  htmlFor="passengers"
                  className="mb-1 text-sm font-medium text-gray-700"
                >
                  Passengers
                </label>
                <div
                  id="passengers"
                  onClick={() =>
                    setIsPassengerDropdownOpen(!isPassengerDropdownOpen)
                  }
                  className={`flex items-center gap-2 border rounded-lg px-3 py-2 text-sm cursor-pointer bg-white shadow-sm hover:border-gray-400 transition-all duration-300 h-10 ${
                    isPassengerDropdownOpen
                      ? "border-indigo-500 ring-2 ring-indigo-500"
                      : "border-gray-300"
                  }`}
                >
                  <FaUser className="text-indigo-600" />
                  <span className="text-gray-700 font-medium flex-grow">
                    {totalPassengers} Passenger
                    {totalPassengers !== 1 ? "s" : ""}
                  </span>
                  <svg
                    className={`w-5 h-5 ml-auto text-gray-500 transition-transform duration-300 ${
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

                {isPassengerDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="absolute top-full mt-2 left-0 w-full min-w-[250px] max-w-[90vw] bg-white border border-gray-200 rounded-xl shadow-xl z-20 p-4 space-y-3 overflow-y-auto max-h-[50vh]"
                  >
                    {/* Adults */}
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-gray-800 font-semibold text-sm">
                          Adults
                        </p>
                        <p className="text-xs text-gray-500">(12+ yrs)</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handlePassengerChange("adults", "decrement")
                          }
                          className="w-8 h-8 rounded-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 disabled:opacity-50"
                          disabled={
                            passengerData.adults ===
                              (passengerData.children > 0 ||
                              passengerData.infants > 0
                                ? 1
                                : 0) && totalPassengers === passengerData.adults
                          }
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-medium text-gray-800 text-sm">
                          {passengerData.adults}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handlePassengerChange("adults", "increment")
                          }
                          className="w-8 h-8 rounded-full text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <Separator className="my-1" />
                    {/* Children */}
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-gray-800 font-semibold text-sm">
                          Children
                        </p>
                        <p className="text-xs text-gray-500">(2-12 yrs)</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handlePassengerChange("children", "decrement")
                          }
                          className="w-8 h-8 rounded-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 disabled:opacity-50"
                          disabled={passengerData.children === 0}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-medium text-gray-800 text-sm">
                          {passengerData.children}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handlePassengerChange("children", "increment")
                          }
                          className="w-8 h-8 rounded-full text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                          disabled={passengerData.adults === 0}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <Separator className="my-1" />
                    {/* Infants */}
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-gray-800 font-semibold text-sm">
                          Infant(s)
                        </p>
                        <p className="text-xs text-gray-500">(0-2 yrs)</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handlePassengerChange("infants", "decrement")
                          }
                          className="w-8 h-8 rounded-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 disabled:opacity-50"
                          disabled={passengerData.infants === 0}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center font-medium text-gray-800 text-sm">
                          {passengerData.infants}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handlePassengerChange("infants", "increment")
                          }
                          className="w-8 h-8 rounded-full text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                          disabled={passengerData.adults === 0}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    {passengerData.adults === 0 &&
                      (passengerData.children > 0 ||
                        passengerData.infants > 0) && (
                        <p className="text-xs text-red-500 pt-2">
                          An adult must accompany children and infants.
                        </p>
                      )}
                  </motion.div>
                )}
              </motion.div>
            </div>

            {airportFetchError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-lg text-sm"
              >
                <MdErrorOutline className="inline mr-2 text-lg" />
                Failed to load airport data: {airportFetchError}. Please refresh
                or try again later.
              </motion.div>
            )}

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
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 px-4 text-sm font-semibold rounded-lg flex items-center gap-2 hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl focus:ring-4 focus:ring-indigo-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                  disabled={isSearchDisabled}
                >
                  <a>
                    <FaPlaneDeparture className="text-base" /> Search Flights
                  </a>
                </Button>
              </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className=" flex flex-col gap-3 sm:flex-row justify-between"
            >
              <Button
                variant="outline"
                onClick={() =>
                  window.open("https://jetserveaviation.com/chardham/", "_blank")
                }
                className="w-full sm:w-auto border-orange-500 text-orange-600 hover:bg-orange-50 hover:text-orange-700 py-3 px-4 sm:px-20 text-sm font-semibold rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-orange-300"
              >
                <FaPlaneDeparture className="text-base" /> CHARDHAM YATRA
              </Button>

              <Button
                asChild
                className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 text-sm font-semibold rounded-lg flex items-center gap-2 hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl focus:ring-4 focus:ring-green-300"
              >
                <a>
                  <FaHelicopter className="text-base" /> Hire Private Charter
                </a>
              </Button>

              <Button
                asChild
                className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 px-4 text-sm font-semibold rounded-lg flex items-center gap-2 hover:from-pink-700 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl focus:ring-4 focus:ring-pink-300"
              >
                <a>
                  <FaCalendarCheck className="text-base" /> For Marriage Event
                </a>
              </Button>

         <Button
  asChild
  className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-500 text-white py-3 px-4 text-sm font-semibold rounded-lg flex items-center gap-2 hover:from-yellow-500 hover:to-red-600 transition-all shadow-lg hover:shadow-xl focus:ring-4 focus:ring-pink-300"
>
  <Link href="/joy-ride">
    <FaCalendarCheck className="text-lg" /> Joy Ride Booking
  </Link>
</Button>


            </motion.div>




            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}