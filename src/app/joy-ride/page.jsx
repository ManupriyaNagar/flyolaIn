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
  };

  const handleBookingSubmit = async (data) => {
    if (!authState.user?.id) {
      console.error('[JoyrideBookingPage] User ID missing in authState:', authState);
      setError('User not authenticated');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('[JoyrideBookingPage] No token found in localStorage');
      setError('Authentication token missing. Please sign in again.');
      router.push('/sign-in');
      return;
    }

    setError('');
    try {
      console.log('[JoyrideBookingPage] Sending booking request:', {
        slotId: selectedSlot.id,
        email: data.email,
        phone: data.phone,
        passengers: data.passengers,
        totalPrice: data.totalPrice,
        token: token.slice(0, 20) + '...',
        authState,
      });
      const response = await fetch('http://localhost:4000/api/joyride-slots/joyride-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include', // Include cookies for backend authentication
        body: JSON.stringify({
          slotId: selectedSlot.id,
          email: data.email,
          phone: data.phone,
          passengers: data.passengers,
          totalPrice: data.totalPrice,
        }),
      });
      const resData = await response.json();
      console.log('[JoyrideBookingPage] Booking response:', { status: response.status, data: resData });

      if (response.ok) {
        alert(
          `Booking confirmed for ${data.passengers[0].name} and ${data.passengers.length} passenger(s) on ${selectedSlot.date} at ${selectedSlot.time} for ₹${data.totalPrice.toFixed(2)}`
        );
        setSelectedSlot(null);
      } else {
        setError(resData.error || 'Failed to confirm booking');
      }
    } catch (err) {
      console.error('[JoyrideBookingPage] Booking request failed:', err);
      setError('An error occurred while confirming the booking');
    }
  };

  if (!authState.isLoggedIn) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Book Your Helicopter Joyride</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {selectedSlot ? (
          <PassengerSelection selectedSlot={selectedSlot} onSubmit={handleBookingSubmit} />
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