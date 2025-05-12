"use client";

import React, { useState } from "react";
import BASE_URL from "@/baseUrl/baseUrl";
import { FaPlane, FaClock, FaUserFriends } from "react-icons/fa";
import { useAuth } from "../AuthContext";

export default function PaymentStep({
  bookingData,
  travelerDetails,
  handlePreviousStep,
  onConfirm,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { authState } = useAuth();

  // 1) Grab the JWT (from context or localStorage)
  const token =
    authState.token ||
    (typeof window !== "undefined" && localStorage.getItem("token")) ||
    "";

  if (!token) {
    alert("Authentication error: please log in again.");
    return null;
  }

  const commonOpts = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const totalPassengers = travelerDetails.length;
  const isAdmin = String(authState.userRole) === "1";
  const userId = authState.user?.id;
  if (!userId) {
    alert("No user ID found. Please log in again.");
    return null;
  }

  // helper: ₹ → paise
  const toPaise = (rs) => Math.round(parseFloat(rs) * 100);

  // dynamically load Razorpay script
  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleConfirmBooking = async () => {
    setIsProcessing(true);
    try {
      // 1️⃣ Check seats
      const seatResp = await fetch(
        `${BASE_URL}/flight-schedules?user=true&date=${bookingData.selectedDate}`,
        commonOpts
      );
      if (!seatResp.ok) throw new Error("Failed to verify seat availability");
      const schedules = await seatResp.json();
      const fs = schedules.find((f) => f.id === +bookingData.id);
      if (!fs || fs.availableSeats < totalPassengers) {
        throw new Error(`Only ${fs?.availableSeats || 0} seats left`);
      }

      // 2️⃣ Fetch a PNR
      const pnrResp = await fetch(
        `${BASE_URL}/bookings/generate-pnr`,
        commonOpts
      );
      if (!pnrResp.ok) throw new Error("Failed to generate PNR");
      const { pnr } = await pnrResp.json();

      // 3️⃣ Build the shared payload
      const types = [
        ...Array(bookingData.passengers.adults).fill("Adult"),
        ...Array(bookingData.passengers.children).fill("Child"),
        ...Array(bookingData.passengers.infants).fill("Infant"),
      ];
      const payload = {
        bookedSeat: {
          bookDate: bookingData.selectedDate,
          schedule_id: +bookingData.id,
          booked_seat: totalPassengers,
        },
        booking: {
          pnr,
          bookingNo: `BOOK${Date.now()}`,
          contact_no: travelerDetails[0].phone,
          email_id: travelerDetails[0].email,
          noOfPassengers: totalPassengers,
          bookDate: bookingData.selectedDate,
          schedule_id: +bookingData.id,
          totalFare: parseFloat(bookingData.totalPrice),
          bookedUserId: userId,
          paymentStatus: isAdmin ? "SUCCESS" : "PENDING",
          bookingStatus: isAdmin ? "CONFIRMED" : "PENDING",
        },
        billing: {
          billing_name: `${travelerDetails[0].title} ${travelerDetails[0].fullName}`,
          billing_email: travelerDetails[0].email,
          billing_number: travelerDetails[0].phone,
          billing_address: travelerDetails[0].address || "N/A",
          billing_country: "India",
          billing_state: "N/A",
          billing_pin_code: "000000",
          GST_Number: travelerDetails[0].gstNumber || null,
          user_id: userId,
        },
        payment: {
          transaction_id: `TXN${Date.now()}`,
          payment_id: isAdmin ? `ADMINPAY_${Date.now()}` : null,
          order_id: isAdmin ? `ADMINORD_${Date.now()}` : null,
          razorpay_signature: isAdmin
            ? `ADMINSIG_${Math.random().toString(36).slice(2)}`
            : null,
          payment_status: isAdmin ? "SUCCESS" : "PENDING",
          payment_mode: isAdmin ? "ADMIN" : "RAZORPAY",
          payment_amount: parseFloat(bookingData.totalPrice),
          message: isAdmin ? "Admin booking" : "Initiating payment",
          user_id: userId,
        },
        passengers: travelerDetails.map((t, i) => ({
          title: t.title,
          name: t.fullName,
          type: types[i],
          dob: t.dateOfBirth || new Date().toISOString().slice(0, 10),
          age: (() => {
            const b = new Date(t.dateOfBirth || "");
            return b.getTime()
              ? Math.floor((Date.now() - b.getTime()) / 31557600000)
              : 0;
          })(),
        })),
      };

      // 4️⃣ Admin → bypass Razorpay entirely
      if (isAdmin) {
        const bookResp = await fetch(
          `${BASE_URL}/bookings/complete-booking`,
          {
            method: "POST",
            ...commonOpts,
            body: JSON.stringify(payload),
          }
        );
        if (!bookResp.ok) {
          const err = await bookResp.json();
          throw new Error(err.error || "Admin booking failed");
        }
        onConfirm(await bookResp.json());
        setIsProcessing(false);
        return;
      }

      // 5️⃣ Non-admin → Razorpay checkout
      if (!(await loadRazorpay())) {
        throw new Error("Failed to load payment gateway");
      }

      // create Razorpay order
      const orderResp = await fetch(
        `${BASE_URL}/payments/create-order`,
        {
          method: "POST",
          ...commonOpts,
          body: JSON.stringify({ amount: toPaise(bookingData.totalPrice) }),
        }
      );
      if (!orderResp.ok) {
        const err = await orderResp.json();
        throw new Error(err.error || "Order creation failed");
      }
      const { order_id } = await orderResp.json();
      payload.payment.order_id = order_id;

      // open the checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: toPaise(bookingData.totalPrice),
        currency: "INR",
        order_id,
        name: "Flyola Aviation",
        description: `${bookingData.departure} → ${bookingData.arrival}`,
        prefill: {
          name: `${travelerDetails[0].title} ${travelerDetails[0].fullName}`,
          email: travelerDetails[0].email,
          contact: travelerDetails[0].phone,
        },
        theme: { color: "#4F46E5" },
        handler: async (resp) => {
          // on success, finalize booking
          payload.payment.payment_id = resp.razorpay_payment_id;
          payload.payment.razorpay_signature = resp.razorpay_signature;
          payload.payment.payment_status = "SUCCESS";
          payload.payment.message = "Payment successful";
          payload.booking.paymentStatus = "SUCCESS";
          payload.booking.bookingStatus = "CONFIRMED";

          const bookResp2 = await fetch(
            `${BASE_URL}/bookings/complete-booking`,
            {
              method: "POST",
              ...commonOpts,
              body: JSON.stringify(payload),
            }
          );
          if (!bookResp2.ok) {
            const err = await bookResp2.json();
            throw new Error(err.error || "Final booking failed");
          }
          onConfirm(await bookResp2.json());
        },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on("payment.failed", (err) => {
        alert(`Payment failed: ${err.error.description}`);
        setIsProcessing(false);
      });
    } catch (err) {
      alert(err.message || "Something went wrong");
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
        Make Payment
      </h2>

      <div className="bg-gray-50 p-4 rounded mb-6 space-y-2">
        <p className="flex items-center gap-2">
          <FaPlane /> {bookingData.departure} → {bookingData.arrival}
        </p>
        <p className="flex items-center gap=2">
          <FaClock /> {bookingData.selectedDate}
        </p>
        <p className="flex items-center gap=2">
          <FaClock /> {bookingData.departureTime} – {bookingData.arrivalTime}
        </p>
        <p className="flex items-center gap=2">
          <FaUserFriends /> Passengers: {totalPassengers}
        </p>
      </div>

      <div className="bg-gray-100 p-4 rounded mb-6">
        <p className="text-xl">
          Total:{" "}
          <span className="font-bold text-green-600">
            ₹ {bookingData.totalPrice}
          </span>
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handlePreviousStep}
          disabled={isProcessing}
          className="px-6 py-2 bg-gray-600 text-white rounded"
        >
          Previous
        </button>
        <button
          onClick={handleConfirmBooking}
          disabled={isProcessing}
          className="px-6 py-2 bg-blue-600 text-white rounded"
        >
          {isProcessing
            ? "Processing…"
            : isAdmin
            ? "Confirm Booking"
            : `Pay ₹${bookingData.totalPrice}`}
        </button>
      </div>
    </div>
  );
}
