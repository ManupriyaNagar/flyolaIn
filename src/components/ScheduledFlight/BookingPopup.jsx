"use client";
import { FaUserFriends, FaClock, FaPlane } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import BASE_URL from "@/baseUrl/baseUrl";

const tz = "Asia/Kolkata";
const BookingPopup = ({ closePopup, passengerData, departure, arrival, selectedDate, flightSchedule }) => {
  const router = useRouter();
  const [passengers] = useState({
    adults: passengerData.adults || 1,
    children: passengerData.children || 0,
    infants: passengerData.infants || 0,
  });
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const basePrice = parseFloat(flightSchedule.price || 2000);
  const childDiscount = 0.5;
  const infantFee = 10;
  const totalPassengers = passengers.adults + passengers.children;
  const allSeats = flightSchedule.allSeats || ["S1", "S2", "S3", "S4", "S5", "S6"];

  const isValidISODate = useCallback((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), []);
  const formattedDate = useMemo(
    () => (isValidISODate(selectedDate) ? selectedDate : new Date().toISOString().split("T")[0]),
    [selectedDate, isValidISODate]
  );

  const formatTime = useCallback((t) => {
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
  }, []);

  const departureTime = useMemo(() => formatTime(flightSchedule.departure_time), [flightSchedule.departure_time, formatTime]);
  const arrivalTime = useMemo(() => formatTime(flightSchedule.arrival_time), [flightSchedule.arrival_time, formatTime]);

  const fetchAvailableSeats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/booked-seat/available-seats?schedule_id=${flightSchedule.id}&bookDate=${formattedDate}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Seats API failed: ${response.status}`);
      }
      const data = await response.json();
      const seats = Array.isArray(data.availableSeats)
        ? data.availableSeats.filter((seat) => allSeats.includes(seat))
        : allSeats;
      setAvailableSeats(seats);
      setSelectedSeats(seats.slice(0, totalPassengers));
      setError(null);
    } catch (err) {
      console.warn(`Failed to fetch seats for schedule ${flightSchedule.id}: ${err.message}`);
      setError(`Unable to load seats: ${err.message}. Using all seats.`);
      setAvailableSeats(allSeats);
      setSelectedSeats([]);
    } finally {
      setLoading(false);
    }
  }, [flightSchedule.id, formattedDate, allSeats, totalPassengers]);

  useEffect(() => {
    const timer = setTimeout(() => fetchAvailableSeats(), 100);
    return () => clearTimeout(timer);
  }, [fetchAvailableSeats, retryCount]);

  const handleSeatToggle = useCallback((seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : prev.length < totalPassengers
        ? [...prev, seat]
        : prev
    );
  }, [totalPassengers]);

  const calculateTotalPrice = useMemo(() => {
    const adultPrice = basePrice * passengers.adults;
    const childPrice = basePrice * passengers.children * childDiscount;
    const infantPrice = passengers.infants * infantFee;
    return (adultPrice + childPrice + infantPrice).toFixed(2);
  }, [basePrice, passengers]);

  const handleConfirmBooking = useCallback(() => {
    if (selectedSeats.length !== totalPassengers) {
      alert(`Please select exactly ${totalPassengers} seat(s) for all passengers.`);
      return;
    }
    try {
      const bookingData = {
        departure,
        arrival,
        selectedDate: formattedDate,
        passengers,
        totalPrice: calculateTotalPrice,
        flightSchedule,
        selectedSeats,
      };
      localStorage.setItem("bookingData", JSON.stringify(bookingData));
      closePopup();
      router.push("/combined-booking-page");
    } catch (error) {
      console.error("Error in handleConfirmBooking:", error);
      alert("An error occurred while processing your booking. Please try again.");
    }
  }, [closePopup, router, departure, arrival, formattedDate, passengers, calculateTotalPrice, flightSchedule, selectedSeats, totalPassengers]);

  const handleRetry = useCallback(() => {
    setError(null);
    setRetryCount((prev) => prev + 1);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Book Your Flight</h2>
          <button
            className="text-gray-500 hover:text-gray-800 transition-colors"
            onClick={closePopup}
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg space-y-3">
            <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FaPlane className="text-green-500" />
              From: <span className="font-semibold">{departure}</span>
            </p>
            <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
              To: <span className="font-semibold">{arrival}</span>
            </p>
            <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
              Date: <span className="font-semibold">{new Date(formattedDate).toLocaleDateString("en-US")}</span>
            </p>
            <p className="text-base font-medium text-gray-800 flex items-center gap-3 bg-green-100 px-2 py-1 rounded-md">
              <FaClock className="text-gray-600" />
              Departure: <span className="font-bold">{departureTime}</span>
            </p>
            <p className="text-base font-medium text-gray-800 flex items-center gap-3 bg-green-100 px-2 py-1 rounded-md">
              <FaClock className="text-gray-600" />
              Arrival: <span className="font-bold">{arrivalTime}</span>
            </p>
            <p className="text-sm font-medium text-gray-700">
              Base Price: <span className="font-semibold">INR {basePrice.toFixed(2)}</span>
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <FaUserFriends className="text-green-500" /> Passengers
            </p>
            <div className="space-y-2">
              <p className="text-sm">Adults: {passengers.adults}</p>
              <p className="text-sm">Children: {passengers.children}</p>
              <p className="text-sm">Infants: {passengers.infants}</p>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-800 mb-2">
              Select Seats ({selectedSeats.length}/{totalPassengers})
            </p>
            {loading ? (
              <p className="text-sm text-gray-500">Loading seats...</p>
            ) : error && availableSeats.length === 0 ? (
              <div className="text-sm text-red-500">
                <p>{error}</p>
                <button
                  onClick={handleRetry}
                  className="mt-2 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {allSeats.map((seat) => (
                  <button
                    key={seat}
                    onClick={() => handleSeatToggle(seat)}
                    className={`w-12 h-12 rounded-md text-sm font-medium transition-colors ${
                      selectedSeats.includes(seat)
                        ? "bg-green-600 text-white"
                        : availableSeats.includes(seat)
                        ? "bg-green-200 text-gray-800 hover:bg-green-300"
                        : "bg-red-200 text-gray-800 cursor-not-allowed"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    disabled={selectedSeats.length >= totalPassengers && !selectedSeats.includes(seat) || !availableSeats.includes(seat)}
                  >
                    {seat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-800">
              Total: <span className="text-green-600 font-bold">INR {calculateTotalPrice}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">Includes all fees</p>
          </div>

          <button
            onClick={handleConfirmBooking}
            className="w-full py-3 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading || (error && availableSeats.length === 0) || selectedSeats.length !== totalPassengers}
          >
            Confirm Booking (INR {calculateTotalPrice})
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPopup;