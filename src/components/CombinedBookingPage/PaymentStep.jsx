import BASE_URL from '@/baseUrl/baseUrl';
import React, { useState, useEffect } from 'react';

const PaymentStep = ({ bookingData, handlePreviousStep, onConfirm }) => {
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay Checkout.js dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      alert('Failed to load payment gateway. Please try again.');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCreateOrder = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/booking/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
          amount: parseFloat(bookingData.totalPrice), // Amount in INR (backend converts to paise)
          bookingId: bookingData.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create Razorpay order');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      alert('Failed to initiate payment. Please try again.');
      return null;
    }
  };

  const handlePayment = async () => {
    if (!razorpayLoaded || !window.Razorpay) {
      alert('Payment gateway is not loaded yet. Please wait or refresh the page.');
      return;
    }

    const orderData = await handleCreateOrder();
    if (!orderData) return;

    const options = {
      key: orderData.key, // Razorpay key_id from backend
      amount: orderData.amount, // Amount in paise
      currency: orderData.currency,
      name: 'Flyola Flights',
      description: 'Flight Booking Payment',
      order_id: orderData.orderId,
      handler: async (response) => {
        try {
          const verifyResponse = await fetch(`${BASE_URL}/api/booking/confirm`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
              bookingId: bookingData.id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              totalPrice: bookingData.totalPrice
            })
          });

          if (!verifyResponse.ok) {
            throw new Error('Payment verification failed');
          }

          const verifyData = await verifyResponse.json();
          alert(verifyData.message);
          onConfirm();
          window.location.href = '/booking-confirmation';
        } catch (error) {
          console.error('Error verifying payment:', error);
          alert('Payment verification failed. Please contact support.');
        }
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9999999999'
      },
      notes: {
        booking_id: bookingData.id
      },
      theme: {
        color: '#3399cc'
      }
    };

    const rzp1 = new window.Razorpay(options); // Use global Razorpay object
    rzp1.open();
  };

  return (
    <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
        Make Payment
      </h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-medium">Your Price Summary</h3>
          </div>
          <div className="text-xl font-bold text-green-600">INR {bookingData.totalPrice}</div>
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
          >
            Previous
          </button>
          <button
            onClick={handlePayment}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            disabled={!razorpayLoaded}
          >
            Pay Now INR {bookingData.totalPrice}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;