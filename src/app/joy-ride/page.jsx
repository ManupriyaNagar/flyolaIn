
"use client";

import { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import PassengerSelection from './../../components/Joyride/PassengerSelection';
import CalendarAndSlots from './../../components/Joyride/CalendarAndSlots';

export default function JoyrideBookingPage() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState('');
  const [popup, setPopup] = useState({ show: false, message: '', isError: false });
  const { authState } = useAuth();
  const router = useRouter();

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setError('');
  };

  const showPopup = (message, isError = false) => {
    setPopup({ show: true, message, isError });
    setTimeout(() => setPopup({ show: false, message: '', isError: false }), 3000); // Auto-close after 3s
  };

  const handleBookingSubmit = async (data) => {
    if (!authState.isLoggedIn || !authState.user?.id) {
      console.log('[JoyrideBookingPage] User not logged in:', authState);
      setError('Please sign in to confirm your booking.');
      router.push('/sign-in');
      return;
    }

    setError('');
    try {
      console.log('[JoyrideBookingPage] Booking confirmed:', {
        bookingId: data.bookingId,
        payment: data.payment,
        passengers: data.passengers,
      });

      showPopup(
        `Booking confirmed for ${data.passengers[0].name} and ${data.passengers.length} passenger(s) on ${selectedSlot.date} at ${selectedSlot.time} for ₹${data.totalPrice.toFixed(2)}`
      );

      // Save booking data to localStorage
      const bookingData = {
        bookingId: data.bookingId,
        slot: {
          date: selectedSlot.date,
          time: selectedSlot.time,
        },
        passengers: data.passengers,
        total_price: data.totalPrice,
      };
      localStorage.setItem('recentBooking', JSON.stringify(bookingData));

      setSelectedSlot(null); // Reset to show CalendarAndSlots

      // Redirect to /joy-ride-ticket after successful booking
      setTimeout(() => router.push('/joy-ride-ticket'), 3000); // Wait for popup
    } catch (err) {
      console.error('[JoyrideBookingPage] Error processing booking:', err.message);
      showPopup('An error occurred while confirming the booking', true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Book Your Helicopter Joyride</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {selectedSlot ? (
          <PassengerSelection
            selectedSlot={selectedSlot}
            onSubmit={handleBookingSubmit}
            userId={authState.user?.id}
            showPopup={showPopup}
          />
        ) : (
          <CalendarAndSlots onSlotSelect={handleSlotSelect} />
        )}
        <div className="text-center text-sm text-gray-600 mt-6">
          <p>Flights operate between 4:00 PM and 6:00 PM. Please arrive 15 minutes early.</p>
          <p>Contact us for rescheduling or refunds. Partnered with Delhi NCR influencers!</p>
        </div>
      </div>
      {popup.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div
            className={`p-6 rounded-lg shadow-lg max-w-sm w-full text-center animate-fadeIn ${
              popup.isError ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            <p>{popup.message}</p>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
