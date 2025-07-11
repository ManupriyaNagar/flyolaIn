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
  isAdmin,
  isAgent,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState(
    Array.isArray(bookingData.selectedSeats) ? bookingData.selectedSeats : []
  );
  const [availableSeats, setAvailableSeats] = useState([]);
  const [error, setError] = useState(null);
  const { authState } = useAuth();
  const router = useRouter();
  const token = localStorage.getItem("token");

  // Log auth state for debugging
  console.log("[PaymentStep] authState:", authState);
  console.log("[PaymentStep] isAdmin:", isAdmin, "User role:", authState.user?.role, "userRole:", authState.userRole);

  // Redirect to sign-in if no token
  if (!token) {
    alert("Authentication error: please log in again.");
    router.push("/sign-in");
    return null;
  }

  // Check for Razorpay key (only for non-admin)
  if (!RAZORPAY_KEY && !isAdmin) {
    console.error("[PaymentStep] Missing RAZORPAY_KEY");
    setError("Payment configuration missing. Please contact support.");
    return null;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const totalPassengers = travelerDetails.length;
  const userId = authState.user?.id;

  // Validate userId early
  if (!userId) {
    console.error("[PaymentStep] Missing userId in authState:", authState);
    setError("Authentication error: User ID missing. Please log in again.");
    router.push("/sign-in");
    return null;
  }

  // Fetch available seats
  useEffect(() => {
    async function fetchSeats() {
      try {
        if (!bookingData.id || !/^\d{4}-\d{2}-\d{2}$/.test(bookingData.selectedDate)) {
          throw new Error("Invalid schedule_id or bookDate");
        }
        const url = `${BASE_URL}/booked-seat/available-seats?schedule_id=${bookingData.id}&bookDate=${bookingData.selectedDate}`;
        console.log('[PaymentStep] Fetching seats from:', url);
        const resp = await fetch(url, { headers });
        if (!resp.ok) {
          const errorText = await resp.text();
          throw new Error(`Failed to fetch seats: ${resp.status} ${resp.statusText} - ${errorText}`);
        }
        const data = await resp.json();
        if (!Array.isArray(data.availableSeats)) {
          throw new Error("Invalid seat data received");
        }
        console.log('[PaymentStep] Available seats:', data.availableSeats);
        setAvailableSeats(data.availableSeats);
        setSelectedSeats((prev) =>
          prev.filter((seat) => data.availableSeats.includes(seat)).slice(0, totalPassengers)
        );
        setError(null);
      } catch (err) {
        console.error('[PaymentStep] Seat fetch error:', err.message);
        setError(`Failed to load seats: ${err.message}. Please try again or select another flight.`);
        setAvailableSeats([]);
      }
    }
    fetchSeats();
  }, [bookingData.id, bookingData.selectedDate, totalPassengers]);

  // WebSocket for real-time seat updates
  useEffect(() => {
    let socket;
    let retryCount = 0;
    const maxRetries = 3;

    const connectSocket = () => {
      console.log("[PaymentStep] WebSocket connecting to:", BASE_URL);
      import("socket.io-client")
        .then(({ io }) => {
          socket = io(BASE_URL, {
            transports: ["websocket", "polling"],
            reconnectionAttempts: maxRetries,
            auth: { token },
          });
          socket.on("connect", () => {
            console.log("[PaymentStep] WebSocket connected");
            retryCount = 0;
          });
          socket.on("seats-updated", ({ schedule_id, bookDate, availableSeats }) => {
            console.log("[PaymentStep] Received seats-updated:", { schedule_id, bookDate, availableSeats });
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
          socket.on("connect_error", (err) => {
            console.error("[PaymentStep] WebSocket connect_error:", err.message);
            if (retryCount < maxRetries) {
              retryCount++;
              console.log(`[PaymentStep] Retrying WebSocket connection (${retryCount}/${maxRetries})`);
            } else {
              setError("Real-time seat updates unavailable. Please refresh to see latest seats.");
            }
          });
          socket.on("error", (err) => {
            console.error("[PaymentStep] WebSocket error:", err.message);
            setError("Real-time seat updates failed. Please refresh.");
          });
        })
        .catch((err) => {
          console.error("[PaymentStep] Failed to load socket.io-client:", err);
          setError("Real-time seat updates unavailable. Please refresh to see latest seats.");
        });
    };

    connectSocket();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [bookingData.id, bookingData.selectedDate, totalPassengers, token]);

  // Load Razorpay script
  async function loadRazorpay() {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  // Handle booking and payment
async function validateAgentId(userId) {
  try {
    const response = await fetch(`${BASE_URL}/agents/${userId}`, { headers });
    if (!response.ok) {
      console.warn("[PaymentStep] User is not a valid agent:", userId);
      return null;
    }
    return userId;
  } catch (err) {
    console.error("[PaymentStep] Error validating agentId:", err);
    return null;
  }
}

async function handleBooking() {
  if (selectedSeats.length !== totalPassengers) {
    alert(`Please select exactly ${totalPassengers} seat(s).`);
    return;
  }
  if (availableSeats.length < totalPassengers) {
    alert("Not enough seats available. Please select another flight.");
    return;
  }

  const totalPrice = parseFloat(bookingData.totalPrice);
  if (!isFinite(totalPrice) || totalPrice <= 0) {
    console.error("[PaymentStep] Invalid totalPrice:", totalPrice);
    setError("Invalid total price. Please try again.");
    return;
  }

  // Validate travelerDetails
  if (!travelerDetails[0]?.phone || !travelerDetails[0]?.email || !travelerDetails[0]?.fullName) {
    console.error("[PaymentStep] Invalid travelerDetails:", travelerDetails);
    setError("Missing traveler information. Please go back and fill in all details.");
    return;
  }

  // Validate bookingData
  if (!bookingData.id || !bookingData.selectedDate) {
    console.error("[PaymentStep] Invalid bookingData:", bookingData);
    setError("Missing flight schedule or date. Please select a flight.");
    return;
  }

  setIsProcessing(true);
  try {
    const amountInPaise = Math.round(totalPrice * 1); // Convert to paise
    if (!Number.isInteger(amountInPaise) || amountInPaise <= 0) {
      throw new Error("Invalid payment amount");
    }

    // Fetch PNR
    async function fetchPNR() {
      try {
        const response = await fetch(`${BASE_URL}/bookings/generate-pnr`, { headers });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to generate PNR: ${response.status} ${errorText}`);
        }
        const { pnr } = await response.json();
        if (!pnr) {
          throw new Error("PNR not returned from server");
        }
        console.log("[PaymentStep] Generated PNR:", pnr);
        return pnr;
      } catch (err) {
        console.error("[PaymentStep] fetchPNR error:", err);
        throw err;
      }
    }

    // Prepare payload for booking
    const payload = {
      bookedSeat: {
        bookDate: bookingData.selectedDate,
        schedule_id: Number(bookingData.id),
        booked_seat: totalPassengers,
        seat_labels: selectedSeats,
      },
      booking: {
        pnr: await fetchPNR(),
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
        agentId: isAgent ? await validateAgentId(userId) : null,
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
        razorpay_signature: null,
        payment_status: isAdmin ? "SUCCESS" : "PENDING",
        payment_mode: isAdmin ? "ADMIN" : "RAZORPAY",
        payment_amount: totalPrice.toString(),
        message: isAdmin ? "Admin booking (no payment required)" : "Initiating payment",
        user_id: userId,
      },
      passengers: travelerDetails.map((t, i) => ({
        title: t.title,
        name: t.fullName,
        type: i < bookingData.passengers.adults ? "Adult" : i < bookingData.passengers.adults + bookingData.passengers.children ? "Child" : "Infant",
        dob: t.dateOfBirth || null,
        age: t.dateOfBirth
          ? Math.floor((Date.now() - new Date(t.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
          : 0,
      })),
    };

    console.log("[PaymentStep] Prepared payload:", JSON.stringify(payload, null, 2));

    if (isAdmin) {
      // Admin booking: Skip payment
      const response = await fetch(`${BASE_URL}/bookings/complete-booking`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("[PaymentStep] Admin booking failed:", response.status, errorText);
        throw new Error(`Failed to create admin booking: ${response.status} ${errorText}`);
      }
      const result = await response.json();
      console.log("[PaymentStep] Admin booking result:", result);
      setIsProcessing(false);
      onConfirm(result);
    } else {
      // Load Razorpay SDK
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) {
        throw new Error("Failed to load Razorpay SDK");
      }

      // Create Razorpay order
      const orderResponse = await fetch(`${BASE_URL}/payments/create-order`, {
        method: "POST",
        headers,
        body: JSON.stringify({ amount: amountInPaise, payment_mode: "RAZORPAY" }),
      });
      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error("[PaymentStep] Create order failed:", orderResponse.status, errorText);
        throw new Error(`Failed to create payment order: ${orderResponse.status} ${errorText}`);
      }
      const { order_id } = await orderResponse.json();
      console.log("[PaymentStep] Razorpay order_id:", order_id);
      payload.payment.order_id = order_id;

      // Razorpay payment options
      const options = {
        key: RAZORPAY_KEY,
        amount: amountInPaise,
        currency: "INR",
        order_id,
        name: "Flight Booking",
        description: `Flight from ${bookingData.departure} to ${bookingData.arrival}`,
        prefill: {
          name: travelerDetails[0].fullName,
          email: travelerDetails[0].email,
          contact: travelerDetails[0].phone,
        },
        handler: async (response) => {
          try {
            console.log("[PaymentStep] Razorpay response:", response);
            payload.payment.payment_id = response.razorpay_payment_id;
            payload.payment.razorpay_signature = response.razorpay_signature;
            payload.payment.payment_status = "SUCCESS";
            payload.payment.message = "Payment successful";
            payload.booking.paymentStatus = "SUCCESS";
            payload.booking.bookingStatus = "CONFIRMED";

            console.log("[PaymentStep] Sending booking payload:", JSON.stringify(payload, null, 2));

            const bookingResponse = await fetch(`${BASE_URL}/bookings/complete-booking`, {
              method: "POST",
              headers,
              body: JSON.stringify(payload),
            });
            if (!bookingResponse.ok) {
              const errorText = await bookingResponse.text();
              console.error("[PaymentStep] Booking failed:", bookingResponse.status, errorText);
              // Initiate refund
              const refundResponse = await fetch(`${BASE_URL}/payments/refund`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                  payment_id: response.razorpay_payment_id,
                  amount: payload.payment.payment_amount * 100, // In paise
                }),
              });
              if (!refundResponse.ok) {
                console.error("[PaymentStep] Refund failed:", refundResponse.status, await refundResponse.text());
              } else {
                console.log("[PaymentStep] Refund initiated successfully");
              }
              throw new Error(`Failed to complete booking: ${bookingResponse.status} ${errorText}`);
            }
            const result = await bookingResponse.json();
            console.log("[PaymentStep] Booking result:", result);
            setIsProcessing(false);
            onConfirm(result);
          } catch (err) {
            console.error("[PaymentStep] Booking error in handler:", err);
            setError(`Booking failed: ${err.message}`);
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            console.log("[PaymentStep] Payment modal dismissed");
            setIsProcessing(false);
            setError("Payment cancelled by user");
          },
        },
        theme: { color: "#1E3A8A" },
      };

      console.log("[PaymentStep] Opening Razorpay with options:", options);
      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on("payment.failed", (response) => {
        console.error("[PaymentStep] Payment failed:", response.error);
        setError(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });
    }
  } catch (err) {
    console.error("[PaymentStep] handleBooking error:", err);
    setError(`Booking error: ${err.message}`);
    setIsProcessing(false);
  }
}
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Payment</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {isProcessing && <div className="text-gray-600 mb-4">Processing...</div>}

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Select Seats ({selectedSeats.length}/{totalPassengers})</h3>
        <div className="grid grid-cols-6 gap-2">
          {availableSeats.map((seat) => (
            <button
              key={seat}
              className={`p-2 border rounded ${
                selectedSeats.includes(seat)
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              disabled={selectedSeats.length >= totalPassengers && !selectedSeats.includes(seat)}
              onClick={() =>
                setSelectedSeats((prev) =>
                  prev.includes(seat)
                    ? prev.filter((s) => s !== seat)
                    : [...prev, seat]
                )
              }
            >
              {seat}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Booking Details</h3>
        <p>
          <FaPlane className="inline mr-2" /> {bookingData.departure} → {bookingData.arrival}
        </p>
        <p>
          <FaClock className="inline mr-2" /> {bookingData.selectedDate}
        </p>
        <p>
          <FaUserFriends className="inline mr-2" /> {totalPassengers} Passengers
        </p>
        <p>Selected Seats: {selectedSeats.join(", ") || "None"}</p>
        <p className="mt-2 text-lg">
          Total: <span className="font-bold">₹{bookingData.totalPrice}</span>
        </p>
      </div>

      <div className="flex justify-between">
        <button
          onClick={handlePreviousStep}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          disabled={isProcessing}
        >
          Back
        </button>
        <button
          onClick={handleBooking}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          disabled={isProcessing || selectedSeats.length !== totalPassengers}
        >
          {isAdmin ? "Confirm Booking" : isAgent ? "Agent Booking" : "Pay Now"}
        </button>
      </div>
    </div>
  );
}