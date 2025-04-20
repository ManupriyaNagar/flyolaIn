"use client";

import BASE_URL from "@/baseUrl/baseUrl";
import React, { useState } from "react";
import { FaPlane, FaClock, FaUserFriends } from "react-icons/fa";

export default function PaymentStep({
  bookingData,
  travelerDetails,
  handlePreviousStep,
  onConfirm,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const totalPassengers = travelerDetails.length;

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age : null;
  };

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle Razorpay payment and booking confirmation
  const handleConfirmBooking = async () => {
    setIsProcessing(true);
    try {
      // Validate seat availability
      const seatCheckResponse = await fetch(
        `${BASE_URL}/flight-schedules?user=true&date=${bookingData.selectedDate}`
      );
      if (!seatCheckResponse.ok) {
        const errorText = await seatCheckResponse.text();
        console.error("Seat check failed:", seatCheckResponse.status, errorText);
        throw new Error(`Failed to fetch flight schedules: ${errorText}`);
      }
      const schedules = await seatCheckResponse.json();
      const flightSchedule = schedules.find(
        (fs) => fs.id === parseInt(bookingData.id)
      );

      if (!flightSchedule || flightSchedule.availableSeats < totalPassengers) {
        throw new Error(
          `Only ${flightSchedule?.availableSeats || 0} seat(s) left on ${bookingData.selectedDate}. Please reduce passengers or select a different flight.`
        );
      }

      // Load Razorpay SDK
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay SDK");
      }

      // Create Razorpay order
      const orderResponse = await fetch(`${BASE_URL}/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(bookingData.totalPrice) }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        console.error("Order creation failed:", orderResponse.status, errorData);
        throw new Error(errorData.details || errorData.error || "Failed to create order");
      }
      const { order_id } = await orderResponse.json();

      // Assign passenger types
      const passengerTypes = [];
      for (let i = 0; i < bookingData.passengers.adults; i++) passengerTypes.push("Adult");
      for (let i = 0; i < bookingData.passengers.children; i++) passengerTypes.push("Child");
      for (let i = 0; i < bookingData.passengers.infants; i++) passengerTypes.push("Infant");

      // Razorpay options
      const options = {
        key: "rzp_live_ZkjTCpioNNhl3g", // Replace with your Razorpay key_id
        amount: parseFloat(bookingData.totalPrice) * 100, // Convert to paise
        currency: "INR",
        order_id: order_id,
        name: "Flyola Aviation",
        description: `Flight Booking from ${bookingData.departure} to ${bookingData.arrival}`,
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

          // Prepare booking payload
          const bookingPayload = {
            bookedSeat: {
              bookDate: bookingData.selectedDate,
              schedule_id: bookingData.id,
              booked_seat: totalPassengers,
            },
            booking: {
              pnr: Math.random().toString(36).slice(2, 8).toUpperCase(),
              bookingNo: `BOOK${Date.now()}`,
              contact_no: travelerDetails[0].phone,
              email_id: travelerDetails[0].email,
              noOfPassengers: totalPassengers,
              bookDate: bookingData.selectedDate,
              schedule_id: bookingData.id,
              totalFare: parseFloat(bookingData.totalPrice),
              bookedUserId: 1,
              paymentStatus: "SUCCESS",
              bookingStatus: "CONFIRMED",
            },
            billing: {
              billing_name: `${travelerDetails[0].title} ${travelerDetails[0].fullName}`,
              billing_email: travelerDetails[0].email,
              billing_number: travelerDetails[0].phone,
              billing_address: travelerDetails[0].address || "Unknown",
              billing_country: "India",
              billing_state: "Unknown",
              billing_pin_code: "000000",
              GST_Number: travelerDetails[0].gstNumber || null,
              user_id: 1,
            },
            payment: {
              transaction_id: `TXN${Date.now()}`,
              payment_id: razorpay_payment_id,
              order_id: razorpay_order_id,
              razorpay_signature: razorpay_signature,
              payment_status: "SUCCESS",
              payment_mode: "RAZORPAY",
              payment_amount: parseFloat(bookingData.totalPrice),
              message: "Payment successful via Razorpay",
              user_id: 1,
            },
            passengers: travelerDetails.map((t, index) => ({
              fullName: t.fullName || `Passenger ${index + 1}`,
              dateOfBirth: t.dateOfBirth || null,
              title: t.title,
              type: passengerTypes[index] || "Adult",
              age: t.dateOfBirth ? calculateAge(t.dateOfBirth) : 30,
            })),
          };

          console.log("Sending booking payload:", bookingPayload); // Debug

          // Complete booking
          const bookingResponse = await fetch(`${BASE_URL}/bookings/complete-booking`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingPayload),
          });

          if (!bookingResponse.ok) {
            const errorData = await bookingResponse.json();
            console.error("Booking API failed:", bookingResponse.status, errorData);
            throw new Error(errorData.error || "Failed to complete booking");
          }

          const data = await bookingResponse.json();
          console.log("Booking response:", data); // Debug

          // Broadcast updated seat count
          window.dispatchEvent(
            new CustomEvent("seats-updated", {
              detail: {
                schedule_id: data.schedule_id,
                bookDate: data.bookDate,
                seatsLeft: data.updatedSeatCounts[0]?.seatsLeft || 0,
              },
            })
          );

          alert("Payment and booking confirmed successfully!");
          onConfirm(data);
        },
        prefill: {
          name: `${travelerDetails[0].title} ${travelerDetails[0].fullName}`,
          email: travelerDetails[0].email,
          contact: travelerDetails[0].phone,
        },
        theme: { color: "#4F46E5" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      razorpay.on("payment.failed", function (response) {
        alert(`Payment failed: ${response.error.description}. Please try again.`);
      });
    } catch (error) {
      console.error("Payment error:", error);
      alert(`Error: ${error.message}. Please try again or contact support.`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-4 bg-white p-6 rounded-lg shadow-lg">
    <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
      Make Payment
    </h2>
  
    <div className="bg-gray-50 p-4 rounded-lg space-y-2 mb-6">
      <h3 className="text-xl font-medium">Flight Summary</h3>
      <p className="text-sm flex items-center gap-2">
        <FaPlane /> {bookingData.departure} → {bookingData.arrival}
      </p>
      <p className="text-sm flex items-center gap-2">
        <FaClock /> {bookingData.selectedDate}
      </p>
      <p className="text-sm flex items-center gap-2">
        <FaClock /> {bookingData.departureTime} - {bookingData.arrivalTime}
      </p>
      <p className="text-sm flex items-center gap-2">
        <FaUserFriends /> Passengers: {totalPassengers}
      </p>
    </div>
  
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
      <p className="text-xl">
        Total:{" "}
        <span className="font-bold text-green-600">
          ₹ {bookingData.totalPrice}
        </span>
      </p>
    </div>
  
    <div className="flex flex-col sm:flex-row gap-2">
      <button
        onClick={handlePreviousStep}
        className="px-6 py-2 bg-gray-600 text-white rounded-lg"
        disabled={isProcessing}
      >
        Previous
      </button>
      <button
        onClick={handleConfirmBooking}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg"
        disabled={isProcessing}
      >
        {isProcessing ? "Processing…" : `Pay Now ₹${bookingData.totalPrice}`}
      </button>
    </div>
  </div>
  
  );
}