"use client";
import { FaUserFriends, FaClock, FaPlane } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";

const BookingPopup = ({ closePopup, passengerData, departure, arrival, selectedDate, flightSchedule }) => {
  const router = useRouter();

  const [passengers] = useState({
    adults: passengerData.adults || 1,
    children: passengerData.children || 0,
    infants: passengerData.infants || 0,
  });

  const basePrice = parseFloat(flightSchedule.price || 0);
  const childDiscount = 0.5;
  const infantFee = 10;

  const calculateTotalPrice = () => {
    const adultPrice = basePrice * passengers.adults;
    const childPrice = basePrice * passengers.children * childDiscount;
    const infantPrice = passengers.infants * infantFee;
    return (adultPrice + childPrice + infantPrice).toFixed(2);
  };

  const handleConfirmBooking = () => {
    try {
      const bookingData = {
        departure,
        arrival,
        selectedDate: selectedDate,
        passengers,
        totalPrice: calculateTotalPrice(),
        flightSchedule,
      };
      console.log("Storing booking data:", bookingData);

      localStorage.setItem("bookingData", JSON.stringify(bookingData));
      closePopup();
      router.push("/combined-booking-page");
    } catch (error) {
      console.error("Error in handleConfirmBooking:", error);
      alert("An error occurred while processing your booking.");
    }
  };

  return (
    <div className="rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300">
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

        <div>
          <p className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-3">
            <FaUserFriends className="text-indigo-500" /> Passengers (Fixed)
          </p>
          <div className="space-y-2">
            <p className="flex items-center">
              <span className="font-medium">Adults:</span> {passengers.adults}
            </p>
            <p className="flex items-center">
              <span className="font-medium">Children:</span> {passengers.children}
            </p>
            <p className="flex items-center">
              <span className="font-medium">Infants:</span> {passengers.infants}
            </p>
          </div>
        </div>

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