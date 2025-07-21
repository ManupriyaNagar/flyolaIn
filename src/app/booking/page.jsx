"use client";

import { FaUserFriends, FaClock, FaPlane, FaCalendarAlt, FaArrowLeft } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import BASE_URL from "@/baseUrl/baseUrl";

const tz = "Asia/Kolkata";

// Memoized seat button component to prevent unnecessary re-renders
const SeatButton = ({ seat, isSelected, isAvailable, onToggle, disabled }) => (
    <button
        onClick={() => onToggle(seat)}
        className={`h-12 rounded-lg text-sm font-bold transition-colors duration-150 ${isSelected
            ? "bg-green-500 text-white shadow-md"
            : isAvailable
                ? "bg-blue-200 text-gray-800 hover:bg-blue-300"
                : "bg-red-200 text-gray-500 cursor-not-allowed"
            }`}
        disabled={disabled || !isAvailable}
    >
        {seat}
    </button>
);

const BookingPageContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get booking data from URL parameters
    const departure = searchParams.get('departure') || '';
    const arrival = searchParams.get('arrival') || '';
    const selectedDate = searchParams.get('date') || '';
    const scheduleId = searchParams.get('scheduleId') || '';
    const price = searchParams.get('price') || '0';
    const departureTime = searchParams.get('departureTime') || '';
    const arrivalTime = searchParams.get('arrivalTime') || '';
    const passengers = parseInt(searchParams.get('passengers') || '1');

    const [passengerData] = useState({
        adults: passengers || 1,
        children: 0,
        infants: 0,
    });
    const [availableSeats, setAvailableSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Memoized constants to prevent recalculation
    const basePrice = useMemo(() => parseFloat(price || 2000), [price]);
    const childDiscount = 0.5;
    const infantFee = 10;
    const totalPassengers = useMemo(() => passengerData.adults + passengerData.children, [passengerData.adults, passengerData.children]);
    const allSeats = useMemo(() => ["S1", "S2", "S3", "S4", "S5", "S6"], []);

    // Optimized date validation
    const formattedDate = useMemo(() => {
        if (/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) return selectedDate;
        return new Date().toISOString().split("T")[0];
    }, [selectedDate]);

    // Optimized time formatting
    const formatTime = useCallback((t) => {
        if (!t) return "N/A";
        if (/^\d{6}$/.test(t)) return `${t.slice(0, 2)}:${t.slice(2, 4)}`;
        if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t.slice(0, 5);
        try {
            return new Date(`1970-01-01 ${t}`).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                timeZone: tz,
            });
        } catch {
            return "N/A";
        }
    }, []);

    const formattedDepartureTime = useMemo(() => formatTime(departureTime), [departureTime, formatTime]);
    const formattedArrivalTime = useMemo(() => formatTime(arrivalTime), [arrivalTime, formatTime]);

    const fetchAvailableSeats = useCallback(async () => {
        if (!scheduleId) {
            setError("Missing flight schedule information");
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token") || "";
            const response = await fetch(
                `${BASE_URL}/booked-seat/available-seats?schedule_id=${scheduleId}&bookDate=${formattedDate}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
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
            console.warn(`Failed to fetch seats for schedule ${scheduleId}: ${err.message}`);
            setError(`Unable to load seats. Using fallback.`);
            setAvailableSeats(allSeats);
            setSelectedSeats(allSeats.slice(0, totalPassengers));
        } finally {
            setLoading(false);
        }
    }, [scheduleId, formattedDate, allSeats, totalPassengers]);

    useEffect(() => {
        fetchAvailableSeats();
    }, [fetchAvailableSeats]);

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
        const adultPrice = basePrice * passengerData.adults;
        const childPrice = basePrice * passengerData.children * childDiscount;
        const infantPrice = passengerData.infants * infantFee;
        return (adultPrice + childPrice + infantPrice).toFixed(2);
    }, [basePrice, passengerData]);

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
                passengers: passengerData,
                totalPrice: calculateTotalPrice,
                flightSchedule: {
                    id: scheduleId,
                    price: basePrice,
                    departure_time: departureTime,
                    arrival_time: arrivalTime,
                },
                selectedSeats,
            };
            localStorage.setItem("bookingData", JSON.stringify(bookingData));
            router.push("/combined-booking-page");
        } catch (error) {
            console.error("Error in handleConfirmBooking:", error);
            alert("An error occurred while processing your booking. Please try again.");
        }
    }, [router, departure, arrival, formattedDate, passengerData, calculateTotalPrice, scheduleId, basePrice, departureTime, arrivalTime, selectedSeats, totalPassengers]);

    const handleRetry = useCallback(() => {
        setError(null);
        fetchAvailableSeats();
    }, [fetchAvailableSeats]);

    // Validate required parameters
    if (!departure || !arrival || !selectedDate || !scheduleId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Missing Booking Information</h1>
                    <p className="text-gray-600 mb-6">
                        Some required booking details are missing. Please go back and select a flight again.
                    </p>
                    <Link
                        href="/scheduled-flight"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <FaArrowLeft />
                        Back to Flights
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-3xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                <FaPlane className="text-yellow-300" />
                                Complete Your Booking
                            </h1>
                            <p className="text-blue-100 mt-2">Secure your seats in just a few clicks</p>
                        </div>
                        <Link
                            href="/scheduled-flight"
                            className="text-white/80 hover:text-white hover:bg-white/20 p-3 rounded-full transition-all flex items-center gap-2"
                        >
                            <FaArrowLeft />
                            <span className="hidden sm:inline">Back to Flights</span>
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-b-3xl shadow-xl p-6 space-y-6">
                    {/* Flight Details */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FaPlane className="text-blue-600" />
                            Flight Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">From:</span>
                                    <span className="font-semibold text-gray-800">{departure}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600">To:</span>
                                    <span className="font-semibold text-gray-800">{arrival}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaCalendarAlt className="text-blue-500" size={12} />
                                    <span className="text-sm text-gray-600">Date:</span>
                                    <span className="font-semibold text-gray-800">
                                        {new Date(formattedDate).toLocaleDateString("en-US", {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="bg-white p-3 rounded-xl border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 flex items-center gap-2">
                                            <FaClock className="text-green-500" />
                                            Departure
                                        </span>
                                        <span className="font-bold text-lg text-gray-800">{formattedDepartureTime}</span>
                                    </div>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 flex items-center gap-2">
                                            <FaClock className="text-blue-500" />
                                            Arrival
                                        </span>
                                        <span className="font-bold text-lg text-gray-800">{formattedArrivalTime}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Passenger Information */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FaUserFriends className="text-green-600" />
                            Passenger Details
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center bg-white p-4 rounded-xl border border-green-200">
                                <div className="text-2xl font-bold text-green-600">{passengerData.adults}</div>
                                <div className="text-sm text-gray-600">Adults</div>
                            </div>
                            <div className="text-center bg-white p-4 rounded-xl border border-green-200">
                                <div className="text-2xl font-bold text-blue-600">{passengerData.children}</div>
                                <div className="text-sm text-gray-600">Children</div>
                            </div>
                            <div className="text-center bg-white p-4 rounded-xl border border-green-200">
                                <div className="text-2xl font-bold text-purple-600">{passengerData.infants}</div>
                                <div className="text-sm text-gray-600">Infants</div>
                            </div>
                        </div>
                    </div>

                    {/* Seat Selection */}
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z" />
                            </svg>
                            Select Your Seats ({selectedSeats.length}/{totalPassengers})
                        </h3>

                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="ml-3 text-gray-600">Loading available seats...</span>
                            </div>
                        ) : error && availableSeats.length === 0 ? (
                            <div className="text-center py-6 bg-red-50 rounded-xl border border-red-200">
                                <p className="text-red-600 mb-3">{error}</p>
                                <button
                                    onClick={handleRetry}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div className="mb-4 flex items-center justify-center gap-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                                        <span>Selected</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-blue-200 rounded"></div>
                                        <span>Available</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-red-200 rounded"></div>
                                        <span>Occupied</span>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                    <div className="text-center mb-4">
                                        <div className="inline-block bg-gray-800 text-white px-4 py-1 rounded-full text-xs font-medium">
                                            ✈️ FRONT OF AIRCRAFT
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 max-w-[10rem] mx-auto">
                                        {allSeats.map((seat) => (
                                            <SeatButton
                                                key={seat}
                                                seat={seat}
                                                isSelected={selectedSeats.includes(seat)}
                                                isAvailable={availableSeats.includes(seat)}
                                                onToggle={handleSeatToggle}
                                                disabled={selectedSeats.length >= totalPassengers && !selectedSeats.includes(seat)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Price Summary */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Breakdown</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Base Price (Adults: {passengerData.adults})</span>
                                <span className="font-semibold">₹{(basePrice * passengerData.adults).toLocaleString('en-IN')}</span>
                            </div>
                            {passengerData.children > 0 && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Children ({passengerData.children}) - 50% off</span>
                                    <span className="font-semibold">₹{(basePrice * passengerData.children * childDiscount).toLocaleString('en-IN')}</span>
                                </div>
                            )}
                            {passengerData.infants > 0 && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Infants ({passengerData.infants})</span>
                                    <span className="font-semibold">₹{(passengerData.infants * infantFee).toLocaleString('en-IN')}</span>
                                </div>
                            )}
                            <div className="border-t border-gray-300 pt-3">
                                <div className="flex justify-between items-center text-xl font-bold">
                                    <span className="text-gray-800">Total Amount</span>
                                    <span className="text-green-600">₹{parseFloat(calculateTotalPrice).toLocaleString('en-IN')}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">✅ Includes all taxes and fees</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/scheduled-flight"
                            className="flex-1 py-4 px-6 bg-gray-100 text-gray-700 rounded-2xl text-lg font-bold hover:bg-gray-200 transition-colors text-center"
                        >
                            ← Back to Flights
                        </Link>
                        <button
                            onClick={handleConfirmBooking}
                            className="flex-1 py-4 px-6 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl text-lg font-bold hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
                            disabled={loading || (error && availableSeats.length === 0) || selectedSeats.length !== totalPassengers}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-3">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Processing...
                                </div>
                            ) : selectedSeats.length !== totalPassengers ? (
                                `Select ${totalPassengers - selectedSeats.length} more seat${totalPassengers - selectedSeats.length > 1 ? 's' : ''}`
                            ) : (
                                `🎫 Confirm Booking - ₹${parseFloat(calculateTotalPrice).toLocaleString('en-IN')}`
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BookingPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        }>
            <BookingPageContent />
        </Suspense>
    );
};

export default BookingPage;