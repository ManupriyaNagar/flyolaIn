"use client";
import { FaUserFriends, FaClock, FaPlane } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";

const BookingPopup = ({ closePopup, passengerData, departure, arrival, selectedDate, flightSchedule }) => {
  const router = useRouter();

  // Default passenger counts (can be overridden by props)
  const [passengers, setPassengers] = useState({
    adults: passengerData.adults || 1,
    children: passengerData.children || 0,
    infants: passengerData.infants || 0,
  });

  // Assume flightSchedule contains price, departure_time, and arrival_time
  const basePrice = parseFloat(flightSchedule.price || 0); // Base price per adult
  const childDiscount = 0.5; // 50% discount for children
  const infantFee = 10; // Small fee for infants

  // Calculate total price
  const calculateTotalPrice = () => {
    const adultPrice = basePrice * passengers.adults;
    const childPrice = basePrice * passengers.children * childDiscount;
    const infantPrice = passengers.infants * infantFee;
    return (adultPrice + childPrice + infantPrice).toFixed(2);
  };

  const handlePassengerChange = (type, value) => {
    setPassengers((prev) => ({
      ...prev,
      [type]: parseInt(value) || 0,
    }));
  };

  const handleConfirmBooking = () => {
    try {
      // Log the start of the function
      console.log("handleConfirmBooking started", {
        departure,
        arrival,
        selectedDate,
        passengers,
        totalPrice: calculateTotalPrice(),
        flightSchedule,
      });

      // Prepare booking data
      const bookingData = {
        departure,
        arrival,
        selectedDate: selectedDate ? new Date(selectedDate).toLocaleDateString("en-US") : "Invalid Date",
        passengers,
        totalPrice: calculateTotalPrice(),
        flightSchedule,
      };
      console.log("Booking data to store:", bookingData);

      // Store booking data in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("bookingData", JSON.stringify(bookingData));
        console.log("Booking data stored in localStorage");
      } else {
        console.warn("localStorage is not available");
      }

      // Attempt navigation
      closePopup();
      console.log("Attempting to navigate to /combined-booking-page");
      router.push("/combined-booking-page");

      // Fallback navigation if router.push fails
      setTimeout(() => {
        console.log("Checking if navigation succeeded");
        if (window.location.pathname !== "/combined-booking-page") {
          console.error("Navigation failed, forcing redirect");
          window.location.href = "/combined-booking-page";
        }
      }, 100);
    } catch (error) {
      console.error("Error in handleConfirmBooking:", error);
      alert("An error occurred while processing your booking. Please check the console for details.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg transform scale-100 transition-all duration-300 mb-44">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Book Your Flight</h2>
        <button
          className="text-gray-500 hover:text-gray-800 transition-colors duration-200"
          onClick={closePopup}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-6">
        {/* Flight Info */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <FaPlane className="text-indigo-500" /> 
            From: <span className="font-semibold">{departure}</span>
          </p>
          <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
            To: <span className="font-semibold">{arrival}</span>
          </p>
          <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Date: <span className="font-semibold">{new Date(selectedDate).toLocaleDateString("en-US")}</span>
          </p>
          <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <FaClock className="text-gray-500" /> 
            Departure Time: <span className="font-semibold">{flightSchedule.departure_time}</span>
          </p>
          <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <FaClock className="text-gray-500" /> 
            Arrival Time: <span className="font-semibold">{flightSchedule.arrival_time}</span>
          </p>
          <p className="text-sm font-medium text-gray-700">
            Base Price (per adult): <span className="font-semibold">INR {basePrice.toFixed(2)}</span>
          </p>
        </div>

        {/* Passenger Selection */}
        <div>
          <p className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-3">
            <FaUserFriends className="text-indigo-500" /> Select Passengers
          </p>
          <div className="grid grid-cols-3 gap-4">
            {["adults", "children", "infants"].map((type) => (
              <div key={type} className="flex flex-col">
                <span className="text-xs text-gray-600 capitalize">{type}</span>
                <select
                  value={passengers[type]}
                  onChange={(e) => handlePassengerChange(type, e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-md bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                >
                  {Array.from({ length: 6 }, (_, i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Total Price and Confirm Button */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm font-semibold text-gray-800">
            Total Price: <span className="text-indigo-600 font-bold">INR {calculateTotalPrice()}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            (Includes base price, child discount, and infant fees)
          </p>
        </div>

        <button
          onClick={handleConfirmBooking}
          className="w-full px-5 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg text-sm font-semibold hover:from-indigo-600 hover:to-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        >
          Confirm Booking (INR {calculateTotalPrice()})
        </button>
      </div>
    </div>
  );
};

export default BookingPopup;