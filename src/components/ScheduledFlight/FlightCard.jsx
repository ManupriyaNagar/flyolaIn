"use client";
import { useState } from "react";
import { FaPlane, FaClock, FaUserFriends, FaCheckCircle } from "react-icons/fa";
import BookingPopup from "./BookingPopup";

function getNextWeekday(weekday) {
  const weekdayMap = {
    Sunday: 0, Monday: 1, Tuesday: 2,
    Wednesday: 3, Thursday: 4,
    Friday: 5, Saturday: 6
  };

  const now = new Date();
  const currentDay = now.getDay();
  const targetDay = weekdayMap[weekday];

  let daysToAdd = targetDay - currentDay;
  if (daysToAdd < 0) {
    daysToAdd += 7;
  }

  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + daysToAdd);
  return nextDate;
}

function combineDateAndTime(dateObj, timeString) {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  const combined = new Date(dateObj);
  combined.setHours(hours, minutes, seconds || 0, 0);
  return combined;
}

const FlightCard = ({ flightSchedule, flights, airports, authState, dates, selectedDate }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCardActive, setIsCardActive] = useState(false);

  const flight = flights.find((f) => f.id === flightSchedule.flight_id) || {
    id: flightSchedule.flight_id,
    flight_number: "Unknown",
    seat_limit: 0,
    status: flightSchedule.status || 0,
    stops: [],
  };

  const departureAirport = airports.find((airport) => airport.id === flightSchedule.departure_airport_id) || {
    city: "Unknown",
    airport_code: "UNK",
  };
  const arrivalAirport = airports.find((airport) => airport.id === flightSchedule.arrival_airport_id) || {
    city: "Unknown",
    airport_code: "UNK",
  };

  const calculateFlightDate = () => {
    const flight = flights.find((f) => f.id === flightSchedule.flight_id);
    if (!flight || !flight.departure_day) return "Loading date...";

    const nextDate = getNextWeekday(flight.departure_day);
    return nextDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  const isNonStop = Array.isArray(flightSchedule.stops) && flightSchedule.stops.length === 0;
  const stopText = isNonStop ? "Non-Stop" : `${flightSchedule.stops.length} Stop(s)`;

  const handleBookNowClick = () => {
    if (!authState.isLoggedIn) {
      alert("Please log in to book a flight. Only logged-in users can book.");
      return;
    }
    if (flight.status === 1) {
      alert("This flight has already departed and cannot be booked.");
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
    <div
      className={`relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 p-6 transform hover:-translate-y-1 ${isCardActive ? "bg-gray-50" : ""}`}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 gap-6">
        <div className="flex items-center gap-4">
          <img src="/flyola-logo.png" alt="Flyola Logo" className="w-16 h-auto object-contain" />
          <div>
            <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <FaPlane className="text-indigo-500" /> {flight.flight_number}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Departs: <span className="font-medium text-indigo-600">{calculateFlightDate()}</span>
            </p>
          </div>
        </div>

        <div className="flex-1 text-center space-y-3">
          <p className="text-sm font-medium text-gray-800 flex items-center justify-center gap-2">
            <FaClock className="text-gray-500" /> {flightSchedule.departure_time} -{" "}
            {flightSchedule.arrival_time}
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-2">
              {flightSchedule.status === 0 ? "Scheduled" : "Departed"}
            </span>
          </p>
          <div className="flex items-center justify-center gap-4 text-gray-800">
            <span className="font-medium">{departureAirport.city} ({departureAirport.airport_code})</span>
            <span className="text-gray-400">→</span>
            <span className="text-indigo-500 font-medium">{stopText}</span>
            <span className="text-gray-400">→</span>
            <span className="font-medium">{arrivalAirport.city} ({arrivalAirport.airport_code})</span>
          </div>
          {flightSchedule.isMultiStop && (
            <p className="text-xs text-gray-500 italic">
              Route: {flightSchedule.routeCities.join(" → ")}
            </p>
          )}
          <p className="text-xs text-green-600 font-medium flex items-center justify-center gap-1">
            <FaCheckCircle /> {stopText}
          </p>
        </div>

        <div className="text-right space-y-4">
          <div>
            <p className="text-sm text-gray-600 flex items-center justify-end gap-2">
              <FaUserFriends className="text-gray-500" /> Seats: {flight.seat_limit}
            </p>
            <p className="text-xl font-bold text-gray-900 flex items-center justify-end gap-2">
              INR {parseFloat(flightSchedule.price || 0).toFixed(2)}
              <span className="text-xs text-gray-500">Refundable</span>
            </p>
          </div>
          <button
            onClick={handleBookNowClick}
            disabled={flight.status === 1}
            className="w-full px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg text-sm font-semibold hover:from-indigo-600 hover:to-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {flight.status === 1 ? "Departed" : "Book Now"}
          </button>
        </div>
      </div>

      {isPopupOpen && (
        <div className="absolute inset-0 flex justify-center items-center z-10 mb-96">
          <BookingPopup
            closePopup={closePopup}
            passengerData={{ adults: 1, children: 0, infants: 0 }}
            departure={departureAirport.city}
            arrival={arrivalAirport.city}
            selectedDate={flightSchedule.departure_date || new Date().toISOString()} // Ensure valid date
            flightSchedule={flightSchedule}
          />
        </div>
      )}
    </div>
  );
};

export default FlightCard;