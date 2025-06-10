"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import PassengerSelection from './../../components/Joyride/PassengerSelection';
import CalendarAndSlots from './../../components/Joyride/CalendarAndSlots';

export default function JoyrideBookingPage() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState('');
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authState.isLoggedIn || authState.userRole !== '3') {
      console.log('[JoyrideBookingPage] User not logged in or incorrect role:', authState);
      router.push('/sign-in');
    }
  }, [authState, router]);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setError('');
  };

  const handleBookingSubmit = async (data) => {
    if (!authState.user?.id) {
      console.error('[JoyrideBookingPage] User ID missing in authState:', authState);
      setError('User not authenticated. Please sign in again.');
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

      alert(
        `Booking and payment confirmed for ${data.passengers[0].name} and ${data.passengers.length} passenger(s) on ${selectedSlot.date} at ${selectedSlot.time} for ₹${data.totalPrice.toFixed(2)}`
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
      router.push('/joy-ride-ticket');
    } catch (err) {
      console.error('[JoyrideBookingPage] Error processing booking:', err.message);
      setError('An error occurred while confirming the booking');
    }
  };

  if (!authState.isLoggedIn) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Book Your Helicopter Joyride</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {selectedSlot ? (
          <PassengerSelection
            selectedSlot={selectedSlot}
            onSubmit={handleBookingSubmit}
            userId={authState.user.id}
          />
        ) : (
          <CalendarAndSlots onSlotSelect={handleSlotSelect} />
        )}
        <div className="text-center text-sm text-gray-600 mt-6">
          <p>Flights operate between 4:00 PM and 6:00 PM. Please arrive 15 minutes early.</p>
          <p>Contact us for rescheduling or refunds. Partnered with Delhi NCR influencers!</p>
        </div>
      </div>
    </div>
  );
}