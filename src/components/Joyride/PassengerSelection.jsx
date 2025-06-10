
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

const PassengerSelection = ({ selectedSlot, onSubmit, userId, showPopup }) => {
  const [passengerCount, setPassengerCount] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    passengers: [{ name: '', weight: '' }],
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const router = useRouter();

  // Load Razorpay script dynamically
  useEffect(() => {
    const loadRazorpayScript = () => {
      if (window.Razorpay) {
        setIsRazorpayLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        setIsRazorpayLoaded(true);
        console.log('[PassengerSelection] Razorpay script loaded successfully');
      };
      script.onerror = () => {
        console.error('[PassengerSelection] Failed to load Razorpay script');
        setIsRazorpayLoaded(false);
        showPopup('Failed to load payment system. Please try again.', true);
      };
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    };

    loadRazorpayScript();
  }, [showPopup]);

  // Update passengers array when passengerCount changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      passengers: Array.from({ length: passengerCount }, (_, i) =>
        prev.passengers[i] || { name: '', weight: '' }
      ),
    }));
  }, [passengerCount]);

  // Calculate total price
  const calculatedTotalPrice = useMemo(() => {
    if (!selectedSlot || !selectedSlot.price) return 0;
    const basePrice = selectedSlot.price * passengerCount;
    const extraWeightCharges = formData.passengers.reduce((total, passenger) => {
      const weight = parseFloat(passenger.weight) || 0;
      return total + (weight > 75 ? (weight - 75) * 500 : 0);
    }, 0);
    return basePrice + extraWeightCharges;
  }, [passengerCount, formData.passengers, selectedSlot?.price]);

  useEffect(() => {
    setTotalPrice(calculatedTotalPrice);
  }, [calculatedTotalPrice]);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name.startsWith('passenger')) {
      const field = name.split('-')[1];
      const updatedPassengers = [...formData.passengers];
      updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
      setFormData({ ...formData, passengers: updatedPassengers });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Initiate Razorpay order and open payment modal
  const initiatePayment = async (bookingId) => {
    try {
      if (!isRazorpayLoaded || !window.Razorpay) {
        throw new Error('Payment system not loaded. Please try again.');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/sign-in');
        throw new Error('Please sign in to confirm your booking.');
      }

      // Call backend to create Razorpay order
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/joyride-slots/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: totalPrice, payment_mode: 'RAZORPAY' }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to create order');

      const { order_id } = result;

      // Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: totalPrice * 100,
        currency: 'INR',
        name: 'Flyola Aviation',
        description: 'Joyride Booking Payment',
        order_id,
        handler: async (response) => {
          try {
            const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/joyride-slots/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                booking_id: bookingId,
                user_id: userId,
                payment_amount: totalPrice,
              }),
            });
            const verifyResult = await verifyResponse.json();
            if (!verifyResponse.ok) throw new Error(verifyResult.error || 'Payment verification failed');

            // Notify parent component
            onSubmit({ ...formData, totalPrice, bookingId, payment: verifyResult.payment });
          } catch (err) {
            showPopup('Payment verification failed: ' + err.message, true);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: '#2563EB' },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', () => {
        setLoading(false);
        showPopup('Payment failed. Please try again.', true);
      });
      razorpay.open();
    } catch (err) {
      setLoading(false);
      showPopup(err.message, true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.phone || passengerCount < 1 || passengerCount > selectedSlot.seats) {
      showPopup(`Please fill all fields and ensure 1-${selectedSlot.seats} passengers.`, true);
      return;
    }
    for (let i = 0; i < passengerCount; i++) {
      if (!formData.passengers[i].name || !formData.passengers[i].weight) {
        showPopup('Please fill all passenger details.', true);
        return;
      }
      const weight = parseFloat(formData.passengers[i].weight);
      if (isNaN(weight) || weight <= 0) {
        showPopup(`Please enter a valid weight for passenger ${i + 1}.`, true);
        return;
      }
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        showPopup('Please sign in to confirm your booking.', true);
        router.push('/sign-in');
        return;
      }

      const bookingResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/joyride-slots/joyride-bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          email: formData.email,
          phone: formData.phone,
          passengers: formData.passengers,
          totalPrice,
        }),
      });
      const bookingResult = await bookingResponse.json();
      if (!bookingResponse.ok) throw new Error(bookingResult.error || 'Failed to create booking');

      await initiatePayment(bookingResult.booking.id);
    } catch (err) {
      setLoading(false);
      showPopup('Booking creation failed: ' + err.message, true);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Passenger Details</h2>
      <div className="bg-yellow-100 p-4 rounded-lg mb-4">
        <p className="text-sm">
          <strong>Note:</strong> Maximum {selectedSlot.seats} passengers per slot, with a weight limit of 70-75 kg per person. Heavier passengers (over 75 kg) incur ₹500 per kg extra.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Number of Passengers (Max {selectedSlot.seats})</label>
          <input
            type="number"
            value={passengerCount}
            onChange={(e) => setPassengerCount(Math.min(selectedSlot.seats, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-full p-2 border rounded"
            required
            min="1"
            max={selectedSlot.seats}
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Main Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleInputChange(e)}
            className="w-full p-2 border rounded"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange(e)}
            className="w-full p-2 border rounded"
            required
            disabled={loading}
          />
        </div>
        {formData.passengers.map((passenger, index) => (
          <div key={index} className="border-t pt-4">
            <h3 className="text-sm font-medium">Passenger {index + 1}</h3>
            <div className="mt-2">
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name={`passenger-name-${index}`}
                value={passenger.name}
                onChange={(e) => handleInputChange(e, index)}
                className="w-full p-2 border rounded"
                required
                disabled={loading}
              />
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium">Weight (kg)</label>
              <input
                type="number"
                name={`passenger-weight-${index}`}
                value={passenger.weight}
                onChange={(e) => handleInputChange(e, index)}
                className="w-full p-2 border rounded"
                required
                min="1"
                step="0.1"
                disabled={loading}
              />
            </div>
          </div>
        ))}
        <div className="mt-4">
          <p className="text-lg font-semibold">
            Total Price: ₹{isNaN(totalPrice) ? '0.00' : totalPrice.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            (Base price: ₹{selectedSlot.price} × {passengerCount} passenger(s) + extra weight charges)
          </p>
        </div>
        <button
          type="submit"
          className={`w-full p-2 rounded ${loading || !isRazorpayLoaded ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          disabled={loading || !isRazorpayLoaded}
        >
          {loading ? 'Processing...' : !isRazorpayLoaded ? 'Loading Payment...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

export default PassengerSelection;
