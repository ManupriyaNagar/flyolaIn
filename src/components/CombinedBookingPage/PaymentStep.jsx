import BASE_URL from '@/baseUrl/baseUrl';
import React, { useState } from 'react';
import { FaPlane, FaClock, FaUserFriends } from 'react-icons/fa';



const PaymentStep = ({ bookingData, travelerDetails, handlePreviousStep, onConfirm }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPassengers = bookingData.passengers.adults + bookingData.passengers.children + bookingData.passengers.infants;

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch(`${BASE_URL}/bookings/complete-booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookedSeat: {
            bookDate: bookingData.selectedDate, // Use selectedDate
            schedule_id: bookingData.id,
            booked_seat: totalPassengers,
          },
          booking: {
            pnr: Math.random().toString(36).substring(2, 8).toUpperCase(),
            bookingNo: `BOOK${Date.now()}`,
            contact_no: travelerDetails.phone,
            email_id: travelerDetails.email,
            noOfPassengers: totalPassengers,
            bookDate: bookingData.selectedDate, // Use selectedDate
            schedule_id: bookingData.id,
            totalFare: parseFloat(bookingData.totalPrice),
            bookedUserId: 1, // Replace with auth user ID
          },
          billing: {
            billing_name: `${travelerDetails.title} ${travelerDetails.fullName}`,
            billing_email: travelerDetails.email,
            billing_number: travelerDetails.phone,
            billing_address: travelerDetails.address,
            billing_country: 'India',
            billing_state: 'Unknown',
            billing_pin_code: '000000',
            GST_Number: travelerDetails.gstNumber || null,
            user_id: 1, // Replace with auth user ID
          },
          payment: {
            transaction_id: `TXN${Date.now()}`,
            payment_id: `PAY${Date.now()}`,
            payment_status: 'PAYMENT_SUCCESS',
            payment_mode: 'DUMMY',
            payment_amount: parseFloat(bookingData.totalPrice),
            message: 'Payment successful (dummy)',
            user_id: 1, // Replace with auth user ID
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete booking');
      }

      const data = await response.json();
      console.log('Booking completed:', data);

      alert('Payment successful! Booking confirmed.');
      onConfirm();
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
            From: <span className="font-semibold">{bookingData.departure}</span> To: <span className="font-semibold">{bookingData.arrival}</span>
          </p>
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <FaClock className="text-gray-500" />
            Date: <span className="font-semibold">{bookingData.selectedDate}</span>
          </p>
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <FaClock className="text-gray-500" />
            Departure: <span className="font-semibold">{bookingData.departureTime}</span> - Arrival: <span className="font-semibold">{bookingData.arrivalTime}</span>
          </p>
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <FaUserFriends className="text-gray-500" />
            Passengers: <span className="font-semibold">
              Adults: {bookingData.passengers.adults}, Children: {bookingData.passengers.children}, Infants: {bookingData.passengers.infants}
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
            <option value="Dummy">Dummy Payment</option>
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