"use client";

import { useState, useEffect } from "react";
import { FaPlane, FaClock, FaUserFriends, FaCheckCircle } from "react-icons/fa";
import BookingPopup from "./BookingPopup";
import { motion } from "framer-motion";
import BASE_URL from "@/baseUrl/baseUrl";

const tz = "Asia/Kolkata";
const fmtTime = (t) =>
  new Date(`1970-01-01T${t}`).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: tz,
  });

const fmtDateLong = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: tz,
  });

const FlightCard = ({ flightSchedule, flights, airports, authState, dates, selectedDate, passengers }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCardActive, setIsCardActive] = useState(false);
  const [availableSeats, setAvailableSeats] = useState(flightSchedule.availableSeats ?? 6);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/flight-schedules?user=true&date=${selectedDate}`
        );
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch flight schedules`);
        }
        const schedules = await response.json();
        const updated = schedules.find((fs) => fs.id === flightSchedule.id);
        const seats = updated
          ? Math.max(0, updated.availableSeats ?? 6)
          : 6;
        setAvailableSeats(seats);
      } catch {
        setAvailableSeats(6);
      }
    };
    fetchSeats();
  }, [flightSchedule.id, selectedDate]);

  useEffect(() => {
    const handleSeatUpdate = (e) => {
      const { schedule_id, bookDate, seatsLeft } = e.detail;
      if (schedule_id === flightSchedule.id && bookDate === selectedDate) {
        const seatsAfter = Math.max(0, seatsLeft ?? availableSeats);
        setAvailableSeats(seatsAfter);
      }
    };
    window.addEventListener("seats-updated", handleSeatUpdate);
    return () => window.removeEventListener("seats-updated", handleSeatUpdate);
  }, [flightSchedule.id, selectedDate, availableSeats]);

  const flight =
    flights.find((f) => f.id === flightSchedule.flight_id) || {
      id: flightSchedule.flight_id,
      flight_number: "Unknown",
      seat_limit: 6,
      status: flightSchedule.status || 0,
      stops: [],
    };

  if (flight.status !== 1 || flightSchedule.status !== 1) {
    return null;
  }

  const departureAirport =
    airports.find((a) => a.id === flightSchedule.departure_airport_id) || {
      city: "Unknown",
      airport_code: "UNK",
    };
  const arrivalAirport =
    airports.find((a) => a.id === flightSchedule.arrival_airport_id) || {
      city: "Unknown",
      airport_code: "UNK",
    };

  const stopCount = flightSchedule.stops?.length ?? 0;
  const isNonStop = stopCount === 0;
  const stopText = isNonStop
    ? "Non-Stop"
    : `${stopCount} Stop${stopCount > 1 ? "s" : ""}`;
  const isSoldOut = availableSeats === 0;

  const handleBookNowClick = () => {
    if (!authState.isLoggedIn) {
      alert("Please log in to book a flight.");
      return;
    }
    if (isSoldOut) {
      alert("This flight is sold out. Please select another flight.");
      return;
    }
    if (availableSeats < passengers) {
      alert(`Only ${availableSeats} seat(s) left. Please reduce passengers.`);
      return;
    }
    setIsCardActive(true);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsCardActive(false);
    setIsPopupOpen(false);
  };

  return (
    <motion.div
      className={`relative w-full md:max-w-full max-w-2xl mx-auto rounded-xl shadow-lg transition-all duration-300 border border-gray-100 
        ${isSoldOut
          ? "bg-gray-100 opacity-80"
          : "bg-gradient-to-b from-purple-50 to-indigo-50 md:bg-gradient-to-br md:from-white md:to-gray-50"} 
        p-6 transform ${!isSoldOut && "hover:-translate-y-2"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:justify-center md:items-center space-y-6 md:space-y-0 md:gap-6">
        <div className="flex items-center gap-4">
          <motion.img
            src="./pp.svg"
            alt="Flyola Logo"
            className="w-16 h-auto object-contain"
            whileHover={{ scale: isSoldOut ? 1 : 1.1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="text-center md:text-left">
            <p className="text-base font-bold text-gray-800 flex items-center gap-2">
              <FaPlane className="text-indigo-600" /> {flight.flight_number}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Departs: <span className="font-medium text-indigo-700">{fmtDateLong(selectedDate)}</span>
            </p>
          </div>
        </div>
        <div className="flex-1 text-center space-y-3">
          <p className="text-base font-semibold text-gray-800 flex items-center justify-center gap-2 bg-white/90 p-2 rounded-lg shadow-inner">
            <FaClock className="text-gray-600" />
            {fmtTime(flightSchedule.departure_time)} - {fmtTime(flightSchedule.arrival_time)}
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full ml-2">
              Scheduled
            </span>
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-800">
            <span className="font-medium text-base">
              {departureAirport.city} ({departureAirport.airport_code})
            </span>
            <span className="text-gray-400 text-lg">→</span>
            <span className="text-indigo-600 font-medium text-base">{stopText}</span>
            <span className="text-gray-400 text-lg">→</span>
            <span className="font-medium text-base">
              {arrivalAirport.city} ({arrivalAirport.airport_code})
            </span>
          </div>
          {flightSchedule.isMultiStop && (
            <p className="text-sm text-gray-600 italic bg-white/70 p-1 rounded">
              Route: {flightSchedule.routeCities.join(" → ")}
            </p>
          )}
          <p className="text-sm text-green-700 font-medium flex items-center justify-center gap-1 bg-green-50 p-1 rounded">
            <FaCheckCircle /> {stopText}
          </p>
        </div>
        <div className="text-right space-y-4">
          <div className="bg-white/90 p-3 rounded-lg shadow-inner">
            <p className="text-sm text-gray-600 flex items-center justify-end gap-2">
              <FaUserFriends className="text-gray-500" />
              {isSoldOut ? (
                <span className="text-red-600 font-medium">Sold Out</span>
              ) : (
                `Seats left: ${availableSeats}`
              )}
            </p>
            <p className="text-xl font-bold text-gray-900 flex items-center justify-end gap-2">
              INR {parseFloat(flightSchedule.price || 0).toFixed(2)}
              <span className="text-sm text-gray-500">Refundable</span>
            </p>
          </div>
          <motion.button
            onClick={handleBookNowClick}
            className={`w-full md:w-auto px-4 py-3 text-white rounded-lg text-base font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 
              ${isSoldOut
                ? "bg-gray-500 cursor-not-allowed opacity-90"
                : "bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700"}`}
            whileHover={{ scale: isSoldOut ? 1 : 1.05 }}
            whileTap={{ scale: isSoldOut ? 1 : 0.95 }}
            disabled={isSoldOut || availableSeats < passengers}
          >
            {isSoldOut ? "Sold Out" : "Book Now"}
          </motion.button>
        </div>
      </div>
      {isPopupOpen && (
        <div className="inset-0 relative flex justify-center items-center z-50">
          <BookingPopup
            closePopup={closePopup}
            passengerData={{ adults: passengers, children: 0, infants: 0 }}
            departure={departureAirport.city}
            arrival={arrivalAirport.city}
            selectedDate={flightSchedule.departure_date || selectedDate}
            flightSchedule={{ ...flightSchedule, availableSeats }}
          />
        </div>
      )}
    </motion.div>
  );
};

export default FlightCard;
