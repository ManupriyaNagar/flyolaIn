"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { FaPlane, FaClock, FaUserFriends, FaCheckCircle } from "react-icons/fa";
import BookingPopup from "./BookingPopup";
import { motion } from "framer-motion";
import BASE_URL from "@/baseUrl/baseUrl";

const tz = "Asia/Kolkata";
const fmtTime = (t) => {
  if (!t) return "N/A";
  if (/^\d{6}$/.test(t)) {
    return `${t.slice(0, 2)}:${t.slice(2, 4)}`;
  }
  if (/^\d{2}:\d{2}:\d{2}$/.test(t)) {
    return t.slice(0, 5);
  }
  try {
    const date = new Date(`1970-01-01 ${t}`);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: tz,
    });
  } catch {
    console.warn(`Invalid time format: ${t}`);
    return "N/A";
  }
};

const fmtDateLong = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: tz,
  });

const generateSeatLabels = (seatLimit) => {
  return Array.from({ length: seatLimit }, (_, i) => `S${i + 1}`);
};

const FlightCard = ({ flightSchedule, flights, airports, authState, dates, selectedDate, passengers }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [isBookingDisabled, setIsBookingDisabled] = useState(false);
  const [isDeparted, setIsDeparted] = useState(false);

  const flight = useMemo(
    () =>
      flights.find((f) => f.id === flightSchedule.flight_id) || {
        id: flightSchedule.flight_id,
        flight_number: "Unknown",
        seat_limit: 6,
        status: flightSchedule.status || 0,
        stops: [],
      },
    [flights, flightSchedule.flight_id, flightSchedule.status]
  );

  const allSeats = useMemo(() => generateSeatLabels(flight.seat_limit || 6), [flight.seat_limit]);

  if ((flight.status !== 0 && flight.status !== 1) || (flightSchedule.status !== 0 && flightSchedule.status !== 1)) {
    return null;
  }

  const departureAirport = useMemo(
    () =>
      airports.find((a) => a.id === flightSchedule.departure_airport_id) || {
        city: "Unknown",
        airport_code: "UNK",
      },
    [airports, flightSchedule.departure_airport_id]
  );
  const arrivalAirport = useMemo(
    () =>
      airports.find((a) => a.id === flightSchedule.arrival_airport_id) || {
        city: "Unknown",
        airport_code: "UNK",
      },
    [airports, flightSchedule.arrival_airport_id]
  );

  const stopCount = flightSchedule.stops?.length ?? 0;
  const isNonStop = stopCount === 0;
  const stopText = isNonStop ? "Non-Stop" : `${stopCount} Stop${stopCount > 1 ? "s" : ""}`;
  const isSoldOut = availableSeats.length === 0;

  const fetchSeats = useCallback(async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/booked-seat/available-seats?schedule_id=${flightSchedule.id}&bookDate=${selectedDate}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.token || localStorage.getItem("token") || ""}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Seats API failed: ${response.status}`);
      }
      const data = await response.json();
      const seats = Array.isArray(data.availableSeats) ? data.availableSeats : allSeats;
      const validSeats = seats.filter((seat) => allSeats.includes(seat));
      setAvailableSeats(validSeats);
    } catch (err) {
      console.warn(`Failed to fetch seats for schedule ${flightSchedule.id}: ${err.message}`);
      setAvailableSeats(allSeats);
    }
  }, [flightSchedule.id, selectedDate, allSeats, authState.token]);

  useEffect(() => {
    const timer = setTimeout(() => fetchSeats(), 100);
    return () => clearTimeout(timer);
  }, [fetchSeats]);

  useEffect(() => {
    const handleSeatUpdate = (e) => {
      const { schedule_id, bookDate, availableSeats: updatedSeats } = e.detail;
      if (schedule_id === flightSchedule.id && bookDate === selectedDate) {
        const validSeats = Array.isArray(updatedSeats)
          ? updatedSeats.filter((seat) => allSeats.includes(seat))
          : allSeats;
        setAvailableSeats(validSeats);
      }
    };
    window.addEventListener("seats-updated", handleSeatUpdate);
    return () => window.removeEventListener("seats-updated", handleSeatUpdate);
  }, [flightSchedule.id, selectedDate, allSeats]);

  useEffect(() => {
    const checkBookingStatus = () => {
      const now = new Date();
      const istTime = new Date(now.toLocaleString("en-US", { timeZone: tz }));
      const hours = istTime.getHours();
      const minutes = istTime.getMinutes();
      const currentTimeInMinutes = hours * 60 + minutes;
      const currentDate = istTime.toISOString().split("T")[0];

      // Check if current date matches selected date and time is after 9 AM IST (09:00)
      const isAfter9AM = selectedDate === currentDate && currentTimeInMinutes >= 9 * 60;

      // Parse flight departure time
      let departureTimeInMinutes;
      try {
        const departureTime = fmtTime(flightSchedule.departure_time);
        const [depHours, depMinutes] = departureTime.split(":").map(Number);
        departureTimeInMinutes = depHours * 60 + depMinutes;
      } catch {
        departureTimeInMinutes = Infinity; // Fallback if time parsing fails
      }

      // Check if flight has departed
      const isFlightDeparted =
        selectedDate === currentDate && currentTimeInMinutes >= departureTimeInMinutes;

      setIsBookingDisabled(isAfter9AM || isFlightDeparted);
      setIsDeparted(isFlightDeparted);
    };

    checkBookingStatus();
    const interval = setInterval(checkBookingStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [flightSchedule.departure_time, selectedDate]);

  const handleBookNowClick = useCallback(() => {
    if (!authState.isLoggedIn) {
      alert("Please log in to book a flight.");
      return;
    }
    if (isSoldOut) {
      alert("This flight is sold out. Please select another flight.");
      return;
    }
    if (availableSeats.length < passengers) {
      alert(`Only ${availableSeats.length} seat(s) left. Please reduce passengers.`);
      return;
    }
    if (isBookingDisabled) {
      alert(isDeparted ? "This flight has departed." : "Booking is closed after 9 AM IST on the departure date.");
      return;
    }
    setIsPopupOpen(true);
  }, [authState.isLoggedIn, isSoldOut, availableSeats, passengers, isBookingDisabled, isDeparted]);

  const closePopup = useCallback(() => {
    setIsPopupOpen(false);
  }, []);

  return (
    <motion.div
      className={`w-full max-w-6xl mx-auto rounded-xl shadow-md border border-blue-100 bg-white p-6 transition-all ${
        isSoldOut || isBookingDisabled ? "opacity-80" : "hover:shadow-lg"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 md:gap-6">
        <div className="flex items-center gap-4">
          <img
            src="./pp.svg"
            alt="Flyola Logo"
            className="w-16 h-auto object-contain"
          />
          <div className="text-center md:text-left">
            <p className="text-base font-bold text-gray-800 flex items-center gap-2">
              <FaPlane className="text-green-500" /> {flight.flight_number}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Departs: <span className="font-medium text-green-700">{fmtDateLong(selectedDate)}</span>
            </p>
          </div>
        </div>
        <div className="flex-1 text-center space-y-3">
          <p className="flex items-center justify-center gap-3 bg-blue-50 px-4 py-2 rounded-lg text-gray-900 font-semibold text-lg">
            <FaClock className="text-gray-600" />
            {fmtTime(flightSchedule.departure_time)} - {fmtTime(flightSchedule.arrival_time)}
            <span className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded-full ml-3 font-medium">
              {isDeparted ? "Departed" : "Scheduled"}
            </span>
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-800">
            <span className="font-medium text-base">
              {departureAirport.city} ({departureAirport.airport_code})
            </span>
            <span className="text-gray-400 text-lg">→</span>
            <span className="text-green-600 font-medium text-base">{stopText}</span>
            <span className="text-gray-400 text-lg">→</span>
            <span className="font-medium text-base">
              {arrivalAirport.city} ({arrivalAirport.airport_code})
            </span>
          </div>
          {flightSchedule.isMultiStop && (
            <p className="text-sm text-gray-600 italic bg-white p-1 rounded">
              Route: {flightSchedule.routeCities.join(" → ")}
            </p>
          )}
          <p className="text-sm text-green-700 font-medium flex items-center justify-center gap-1 bg-blue-50 p-1 rounded">
            <FaCheckCircle /> {stopText}
          </p>
        </div>
        <div className="text-right space-y-4">
          <div className="bg-white p-3 rounded-lg">
            <p className="text-sm text-gray-600 flex items-center justify-end gap-2">
              <FaUserFriends className="text-gray-500" />
              {isSoldOut ? (
                <span className="text-red-600 font-medium">Sold Out</span>
              ) : (
                `Seats left: ${availableSeats.length}`
              )}
            </p>
            <p className="text-xl font-bold text-gray-900 flex items-center justify-end gap-2">
              INR {parseFloat(flightSchedule.price || 0).toFixed(2)}
              <span className="text-sm text-gray-500">Refundable</span>
            </p>
          </div>
          <button
            onClick={handleBookNowClick}
            className={`w-full md:w-auto px-4 py-3 text-white rounded-lg text-base font-semibold transition-colors ${
              isSoldOut || isBookingDisabled
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={isSoldOut || isBookingDisabled}
          >
            {isDeparted ? "Departed" : isSoldOut ? "Sold Out" : "Book Now"}
          </button>
        </div>
      </div>
      {isPopupOpen && (
        <BookingPopup
          closePopup={closePopup}
          passengerData={{ adults: passengers, children: 0, infants: 0 }}
          departure={departureAirport.city}
          arrival={arrivalAirport.city}
          selectedDate={flightSchedule.departure_date || selectedDate}
          flightSchedule={{ ...flightSchedule, availableSeats: availableSeats.length, allSeats }}
        />
      )}
    </motion.div>
  );
};

export default FlightCard;