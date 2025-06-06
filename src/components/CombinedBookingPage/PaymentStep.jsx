"use client";
import React, { useState, useEffect } from "react";
import BASE_URL from "@/baseUrl/baseUrl";
import { FaPlane, FaClock, FaUserFriends } from "react-icons/fa";
import { useAuth } from "../AuthContext";
import { useRouter } from "next/navigation";

const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY;

export default function PaymentStep({
  bookingData,
  travelerDetails,
  handlePreviousStep,
  onConfirm,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState(
    Array.isArray(bookingData.selectedSeats) ? bookingData.selectedSeats : []
  );
  const [availableSeats, setAvailableSeats] = useState([]);
  const [error, setError] = useState(null);
  const { authState } = useAuth();
  const router = useRouter();

  const token = authState.token || localStorage.getItem("token");
  if (!token) {
    alert("Authentication error: please log in again.");
    router.push("/sign-in");
    return null;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const totalPassengers = travelerDetails.length;
  const userId = authState.user?.id;
  const isAdmin = authState.user?.role === 1; // Updated to use number comparison

  useEffect(() => {
    async function fetchSeats() {
      try {
        if (!bookingData.id || !/^\d{4}-\d{2}-\d{2}$/.test(bookingData.selectedDate)) {
          throw new Error("Invalid schedule_id or bookDate");
        }
        const resp = await fetch(
          `${BASE_URL}/booked-seat/available-seats?schedule_id=${bookingData.id}&bookDate=${bookingData.selectedDate}`,
          { headers }
        );
        if (!resp.ok) {
          throw new Error(`Failed to fetch seats: ${resp.status}`);
        }
        const data = await resp.json();
        if (!Array.isArray(data.availableSeats)) {
          throw new Error("Invalid seat data received");
        }
        setAvailableSeats(data.availableSeats);
        setSelectedSeats((prev) =>
          prev.filter((seat) => data.availableSeats.includes(seat)).slice(0, totalPassengers)
        );
        setError(null);
      } catch (err) {
        console.error("Seat fetch error:", err.message);
        setError(`Failed to load seats: ${err.message}. Please try again or select another flight.`);
        setAvailableSeats([]);
      }
    }
    fetchSeats();
  }, [bookingData.id, bookingData.selectedDate, totalPassengers]);

  useEffect(() => {
    let socket;
    import("socket.io-client")
      .then(({ io }) => {
        socket = io(BASE_URL, { transports: ["websocket"] });
        socket.on("connect", () => console.log("WebSocket connected for PaymentStep"));
        socket.on("seats-updated", ({ schedule_id, bookDate, availableSeats }) => {
          console.log("Received seats-updated:", { schedule_id, bookDate, availableSeats });
          if (
            schedule_id === Number(bookingData.id) &&
            bookDate === bookingData.selectedDate &&
            Array.isArray(availableSeats)
          ) {
            setAvailableSeats(availableSeats);
            setSelectedSeats((prev) =>
              prev.filter((seat) => availableSeats.includes(seat)).slice(0, totalPassengers)
            );
            setError(null);
          }
        });
        socket.on("connect_error", (err) => console.error("WebSocket error:", err.message));
      })
      .catch((err) => {
        console.error("Failed to load socket.io-client:", err);
        setError("Real-time seat updates unavailable. Please refresh to see latest seats.");
      });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [bookingData.id, bookingData.selectedDate, totalPassengers]);

  function toPaise(rs) {
    return Math.round(parseFloat(rs) * 100); // Fixed: Convert rupees to paise correctly
  }

  async function loadRazorpay() {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function handleConfirmBooking(mode = "RAZORPAY") {
    if (selectedSeats.length !== totalPassengers) {
      alert(`Please select exactly ${totalPassengers} seat(s).`);
      return;
    }
    if (availableSeats.length < totalPassengers) {
      alert("Not enough seats available. Please select another flight.");
      return;
    }

    const totalPrice = parseFloat(bookingData.totalPrice);
    if (!Number.isFinite(totalPrice) || totalPrice <= 0) {
      alert("Error: Total price must be a positive number.");
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    console.log(`Processing booking with mode: ${isAdmin ? "ADMIN" : "RAZORPAY"}`);

    try {
      const seatResp = await fetch(
        `${BASE_URL}/flight-schedules?user=true&date=${bookingData.selectedDate}`,
        { headers }
      );
      if (!seatResp.ok) throw new Error(`Seat check failed: ${await seatResp.text()}`);
      const schedules = await seatResp.json();
      const schedule = schedules.find((f) => f.id === Number(bookingData.id));
      if (!schedule || schedule.availableSeats < totalPassengers) {
        throw new Error(`Only ${schedule?.availableSeats || 0} seats available`);
      }

      const pnrResp = await fetch(`${BASE_URL}/bookings/generate-pnr`, { headers });
      if (!pnrResp.ok) throw new Error(`PNR generation failed: ${await pnrResp.text()}`);
      const { pnr } = await pnrResp.json();

      const types = [
        ...Array(bookingData.passengers.adults).fill("Adult"),
        ...Array(bookingData.passengers.children).fill("Child"),
        ...Array(bookingData.passengers.infants).fill("Infant"),
      ];
      const payload = {
        bookedSeat: {
          bookDate: bookingData.selectedDate,
          schedule_id: Number(bookingData.id),
          booked_seat: totalPassengers,
          seat_labels: selectedSeats,
        },
        booking: {
          pnr,
          bookingNo: `BOOK${Date.now()}`,
          contact_no: travelerDetails[0].phone,
          email_id: travelerDetails[0].email,
          noOfPassengers: totalPassengers,
          bookDate: bookingData.selectedDate,
          schedule_id: Number(bookingData.id),
          totalFare: totalPrice.toString(),
          bookedUserId: userId,
          paymentStatus: isAdmin ? "SUCCESS" : "PENDING",
          bookingStatus: isAdmin ? "CONFIRMED" : "PENDING",
          agentId: 1, // Default to IRCTC agent
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
          payment_id: isAdmin ? `ADMIN_${Date.now()}` : null,
          order_id: isAdmin ? `ADMIN_${Date.now()}` : null,
          razorpay_signature: isAdmin ? null : null,
          payment_status: isAdmin ? "SUCCESS" : "PENDING",
          payment_mode: isAdmin ? "ADMIN" : "RAZORPAY",
          payment_amount: totalPrice.toString(),
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

      if (isAdmin) {
        const finalResp = await fetch(
          `${BASE_URL}/bookings/complete-booking`,
          {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
          }
        );
        if (!finalResp.ok) {
          const errorText = await finalResp.text();
          throw new Error(`Booking failed: ${errorText}`);
        }
        const result = await finalResp.json();
        setIsProcessing(false);
        onConfirm(result);
      } else {
        if (!(await loadRazorpay())) {
          throw new Error("Failed to load payment gateway");
        }

        const orderResp = await fetch(
          `${BASE_URL}/payments/create-order`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({ amount: toPaise(totalPrice), payment_mode: "RAZORPAY" }),
          }
        );
        if (!orderResp.ok) throw new Error(`Order creation failed: ${await orderResp.text()}`);
        const { order_id } = await orderResp.json();
        payload.payment.order_id = order_id;

        const options = {
          key: RAZORPAY_KEY,
          amount: toPaise(totalPrice),
          currency: "INR",
          order_id,
          name: "Flyola Aviation",
          description: `${bookingData.departure} → ${bookingData.arrival}`,
          prefill: {
            name: `${travelerDetails[0].title} ${travelerDetails[0].fullName}`,
            email: travelerDetails[0].email,
            contact: travelerDetails[0].phone,
          },
          handler: async (resp) => {
            try {
              payload.payment.payment_id = resp.razorpay_payment_id;
              payload.payment.razorpay_signature = resp.razorpay_signature;
              payload.payment.payment_status = "SUCCESS";
              payload.payment.message = "Payment successful";
              payload.booking.paymentStatus = "SUCCESS";
              payload.booking.bookingStatus = "CONFIRMED";

              const finalResp = await fetch(
                `${BASE_URL}/bookings/complete-booking`,
                {
                  method: "POST",
                  headers,
                  body: JSON.stringify(payload),
                }
              );
              if (!finalResp.ok) throw new Error(`Booking failed: ${await finalResp.text()}`);
              const result = await finalResp.json();
              setIsProcessing(false);
              onConfirm(result);
            } catch (err) {
              alert(`Booking error: ${err.message}`);
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
              alert("Payment cancelled");
            },
          },
          theme: {
            color: "#1E3A8A",
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
        rzp.on("payment.failed", (err) => {
          alert(`Payment failed: ${err.error.description}`);
          setIsProcessing(false);
        });
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
      setIsProcessing(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Make Payment</h2>
      {isProcessing && (
        <div className="text-center text-gray-600 mb-4">
          Processing your {isAdmin ? "booking" : "payment"}, please wait...
        </div>
      )}
      {error && (
        <div className="text-red-600 mb-4">{error}</div>
      )}
      <div className="mb-6">
        <h3 className="font-medium text-gray-800">Select Seats ({selectedSeats.length}/{totalPassengers})</h3>
        {availableSeats.length === 0 && !error ? (
          <p className="text-gray-600 mt-2">Loading seats...</p>
        ) : availableSeats.length === 0 ? (
          <p className="text-red-600 mt-2">No seats available. Please select another flight.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {availableSeats.map((seat) => (
              <button
                key={seat}
                disabled={
                  !availableSeats.includes(seat) ||
                  (!selectedSeats.includes(seat) && selectedSeats.length >= totalPassengers)
                }
                onClick={() => {
                  if (selectedSeats.includes(seat)) {
                    setSelectedSeats(selectedSeats.filter((s) => s !== seat));
                  } else if (selectedSeats.length < totalPassengers) {
                    setSelectedSeats([...selectedSeats, seat]);
                  }
                }}
                className={`p-2 border rounded ${
                  selectedSeats.includes(seat)
                    ? "bg-green-600 text-white"
                    : availableSeats.includes(seat)
                    ? "bg-gray-100 hover:bg-gray-200"
                    : "bg-red-100 cursor-not-allowed"
                }`}
              >
                {seat}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="bg-gray-50 p-4 rounded mb-6 space-y-2">
        <p className="flex items-center gap-2">
          <FaPlane /> {bookingData.departure} → {bookingData.arrival}
        </p>
        <p className="flex items-center gap-2">
          <FaClock /> {bookingData.selectedDate}
        </p>
        <p className="flex items-center gap-2">
          <FaClock /> {bookingData.departureTime} – {bookingData.arrivalTime}
        </p>
        <p className="flex items-center gap-2">
          <FaUserFriends /> Passengers: {totalPassengers}
        </p>
        <p className="flex items-center gap-2">
          Seats: {selectedSeats.join(", ") || "None selected"}
        </p>
      </div>
      <div className="bg-gray-100 p-4 rounded mb-6">
        <p className="text-xl">
          Total: <span className="font-bold text-green-600">₹ {bookingData.totalPrice}</span>
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
          onClick={() => handleConfirmBooking(isAdmin ? "ADMIN" : "RAZORPAY")}
          disabled={isProcessing || selectedSeats.length !== totalPassengers || availableSeats.length === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          {isProcessing ? "Processing…" : isAdmin ? "Confirm Booking" : `Pay ₹${bookingData.totalPrice}`}
        </button>
      </div>
    </div>
  );
}