"use client";

import React, { useState, useEffect } from "react";
import BASE_URL from "@/baseUrl/baseUrl";
import { 
  FaPlane, 
  FaClock, 
  FaUserFriends, 
  FaCreditCard, 
  FaShieldAlt, 
  FaExclamationTriangle,
  FaSpinner
} from "react-icons/fa";
import { useAuth } from "../AuthContext";
import { useRouter } from "next/navigation";

// Add missing chair icon as a simple component
const FaChair = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"/>
  </svg>
);

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
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
          <FaCreditCard className="text-green-600 text-xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Complete Payment</h2>
          <p className="text-gray-600">Secure your booking with our encrypted payment system</p>
        </div>
      </div>

      {/* Error and Processing States */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-600 mr-3" />
            <div className="text-red-800">{error}</div>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <div className="text-blue-800">Processing your booking...</div>
          </div>
        </div>
      )}

      {/* Seat Selection */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaChair className="mr-2 text-blue-600" />
          Select Your Seats ({selectedSeats.length}/{totalPassengers})
        </h3>
        
        {availableSeats.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FaSpinner className="animate-spin mx-auto mb-2 text-2xl" />
            Loading available seats...
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                  Available
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                  Selected
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-400 rounded mr-2"></div>
                  Occupied
                </div>
              </div>
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {availableSeats.map((seat) => (
                <button
                  key={seat}
                  className={`p-3 border-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedSeats.includes(seat)
                      ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                  disabled={selectedSeats.length >= totalPassengers && !selectedSeats.includes(seat)}
                  onClick={() =>
                    setSelectedSeats((prev) =>
                      prev.includes(seat)
                        ? prev.filter((s) => s !== seat)
                        : prev.length < totalPassengers
                        ? [...prev, seat]
                        : prev
                    )
                  }
                >
                  {seat}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Booking Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center text-gray-700">
              <FaPlane className="mr-2 text-blue-600" />
              Route
            </span>
            <span className="font-medium">{bookingData.departure} → {bookingData.arrival}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center text-gray-700">
              <FaClock className="mr-2 text-green-600" />
              Date & Time
            </span>
            <span className="font-medium">{bookingData.selectedDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center text-gray-700">
              <FaUserFriends className="mr-2 text-purple-600" />
              Passengers
            </span>
            <span className="font-medium">{totalPassengers}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center text-gray-700">
              <FaChair className="mr-2 text-orange-600" />
              Selected Seats
            </span>
            <span className="font-medium">{selectedSeats.join(", ") || "None selected"}</span>
          </div>
          <div className="border-t pt-3 flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-800">Total Amount</span>
            <span className="text-2xl font-bold text-blue-600">₹{bookingData.totalPrice}</span>
          </div>
        </div>
      </div>

      {/* Payment Security */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <FaShieldAlt className="text-green-600 mr-3" />
          <div>
            <div className="font-semibold text-green-800">Secure Payment</div>
            <div className="text-sm text-green-700">Your payment is protected by 256-bit SSL encryption</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={handlePreviousStep}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
          disabled={isProcessing}
        >
          ← Back to Traveler Info
        </button>
        <button
          onClick={handleBooking}
          className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
            isAdmin 
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
              : isAgent
              ? "bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700"
              : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
          }`}
          disabled={isProcessing || selectedSeats.length !== totalPassengers}
        >
          {isProcessing ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            <>
              {isAdmin ? "Confirm Admin Booking" : isAgent ? "Process Agent Booking" : "Complete Payment"}
              {!isAdmin && " →"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}