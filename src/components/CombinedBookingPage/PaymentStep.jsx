"use client";

import BASE_URL from '@/baseUrl/baseUrl';
import React, { useState } from 'react';
import { FaPlane, FaClock, FaUserFriends } from 'react-icons/fa';

const PaymentStep = ({ bookingData, travelerDetails, handlePreviousStep, onConfirm }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPassengers = bookingData.passengers.adults + bookingData.passengers.children + bookingData.passengers.infants;

  // Function to calculate age from dateOfBirth
  const calculateAge = (dob) => {
    if (!dob) return null; // Return null if dob is missing
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age : null; // Ensure age is non-negative
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Load Razorpay SDK
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error('Failed to load Razorpay SDK');

      // Prepare passenger data
      const passengers = [
        {
          fullName: travelerDetails.fullName,
          dateOfBirth: travelerDetails.dateOfBirth,
          title: travelerDetails.title,
          type: 'Adult',
          age: calculateAge(travelerDetails.dateOfBirth) || 30, // Default to 30 if calculation fails
        },
        ...(bookingData.passengers.children > 0
          ? Array(bookingData.passengers.children)
              .fill()
              .map((_, index) => ({
                fullName: `Child ${index + 1}`,
                dateOfBirth: new Date().toISOString().split('T')[0], // Placeholder
                title: 'Master',
                type: 'Child',
                age: 10, // Default age for children
              }))
          : []),
        ...(bookingData.passengers.infants > 0
          ? Array(bookingData.passengers.infants)
              .fill()
              .map((_, index) => ({
                fullName: `Infant ${index + 1}`,
                dateOfBirth: new Date().toISOString().split('T')[0], // Placeholder
                title: 'Infant',
                type: 'Infant',
                age: 1, // Default age for infants
              }))
          : []),
      ];

      // Create Razorpay order
      const orderResponse = await fetch(`${BASE_URL}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(bookingData.totalPrice) }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.details || errorData.error || 'Failed to create order');
      }
      const { order_id } = await orderResponse.json();

      // Razorpay options
      const options = {
        key: 'rzp_live_ZkjTCpioNNhl3g', // Replace with your Razorpay key_id
        amount: parseFloat(bookingData.totalPrice) * 100, // Convert to paise
        currency: 'INR',
        order_id: order_id,
        name: 'Flyola Aviation',
        description: `Flight Booking from ${bookingData.departure} to ${bookingData.arrival}`,
        handler: async (response) => {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

          // Prepare booking payload
          const bookingPayload = {
            bookedSeat: {
              bookDate: bookingData.selectedDate,
              schedule_id: bookingData.id,
              booked_seat: totalPassengers,
            },
            booking: {
              pnr: Math.random().toString(36).substring(2, 8).toUpperCase(),
              bookingNo: `BOOK${Date.now()}`,
              contact_no: travelerDetails.phone,
              email_id: travelerDetails.email,
              noOfPassengers: totalPassengers,
              bookDate: bookingData.selectedDate,
              schedule_id: bookingData.id,
              totalFare: parseFloat(bookingData.totalPrice),
              bookedUserId: 1,
            },
            billing: {
              billing_name: `${travelerDetails.title} ${travelerDetails.fullName}`,
              billing_email: travelerDetails.email,
              billing_number: travelerDetails.phone,
              billing_address: travelerDetails.address || 'Unknown',
              billing_country: 'India',
              billing_state: 'Unknown',
              billing_pin_code: '000000',
              GST_Number: travelerDetails.gstNumber || null,
              user_id: 1,
            },
            payment: {
              transaction_id: `TXN${Date.now()}`,
              payment_id: razorpay_payment_id,
              order_id: razorpay_order_id,
              razorpay_signature: razorpay_signature,
              payment_status: 'PAYMENT_SUCCESS',
              payment_mode: 'RAZORPAY',
              payment_amount: parseFloat(bookingData.totalPrice),
              message: 'Payment successful via Razorpay',
              user_id: 1,
            },
            passengers,
          };

          // Complete booking
          const bookingResponse = await fetch(`${BASE_URL}/bookings/complete-booking`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingPayload),
          });

          if (!bookingResponse.ok) {
            const errorData = await bookingResponse.json();
            throw new Error(errorData.error || 'Failed to complete booking');
          }

          const data = await bookingResponse.json();
          console.log('Booking completed:', data);
          alert('Payment successful! Booking confirmed.');
          onConfirm();
        },
        prefill: {
          name: `${travelerDetails.title} ${travelerDetails.fullName}`,
          email: travelerDetails.email,
          contact: travelerDetails.phone,
        },
        theme: { color: '#4F46E5' },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on('payment.failed', (response) => {
        throw new Error(`Payment failed: ${response.error.description}`);
      });
    } catch (error) {
      console.error('Error during payment process:', error);
      alert(`Payment failed: ${error.message}. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Make Payment</h2>
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <h3 className="text-xl font-medium text-gray-800">Flight Summary</h3>
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <FaPlane className="text-indigo-500" />
            From: <span className="font-semibold">{bookingData.departure}</span> To:{' '}
            <span className="font-semibold">{bookingData.arrival}</span>
          </p>
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <FaClock className="text-gray-500" />
            Date: <span className="font-semibold">{bookingData.selectedDate}</span>
          </p>
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <FaClock className="text-gray-500" />
            Departure: <span className="font-semibold">{bookingData.departureTime}</span> - Arrival:{' '}
            <span className="font-semibold">{bookingData.arrivalTime}</span>
          </p>
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <FaUserFriends className="text-gray-500" />
            Passengers:{' '}
            <span className="font-semibold">
              Adults: {bookingData.passengers.adults}, Children: {bookingData.passengers.children}, Infants:{' '}
              {bookingData.passengers.infants}
            </span>
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-xl font-medium text-gray-800">Price Summary</h3>
          <p className="text-sm text-gray-700 mt-2">
            Total Price: <span className="text-xl font-bold text-green-600">INR {bookingData.totalPrice}</span>
          </p>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Payment Method</label>
          <select className="w-full p-2 border border-gray-300 rounded-md" disabled>
            <option value="Razorpay">Razorpay</option>
          </select>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousStep}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg"
            disabled={isProcessing}
          >
            Previous
          </button>
          <button
            onClick={handlePayment}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : `Pay Now INR ${bookingData.totalPrice}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;

