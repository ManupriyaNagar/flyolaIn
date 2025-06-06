"use client";

import Head from 'next/head';
import { useState, useEffect } from 'react';

// Custom Calendar component for month view
const CustomCalendar = ({ selectedDate, setSelectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const [language, setLanguage] = useState('EN');

  // Days of the week
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Get the first day of the month and total days in the month
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startingDay = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1; // Adjust for Monday start
  const totalDays = lastDayOfMonth.getDate();

  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < startingDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="p-2"></div>);
  }
  for (let day = 1; day <= totalDays; day++) {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isSelected = dateStr === selectedDate;

    calendarDays.push(
      <div
        key={day}
        onClick={() => setSelectedDate(dateStr)}
        className={`p-2 text-center cursor-pointer ${
          isSelected ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
        }`}
      >
        <div>{day}</div>
      </div>
    );
  }

  // Navigation handlers
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    );
  };

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Select language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-1 border rounded"
          >
            <option value="EN">EN</option>
            {/* Add more languages if needed */}
          </select>
        </div>
        <div className="flex space-x-2">
          <button onClick={goToPreviousMonth} className="px-4 py-2 bg-blue-600 text-white rounded">
            Previous
          </button>
          <button onClick={goToToday} className="px-4 py-2 bg-blue-600 text-white rounded">
            Today
          </button>
          <button onClick={goToNextMonth} className="px-4 py-2 bg-blue-600 text-white rounded">
            Next
          </button>
        </div>
        <div className="text-lg font-semibold">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {daysOfWeek.map((day) => (
          <div key={day} className="p-2 text-center font-semibold border-b">
            {day}
          </div>
        ))}
        {calendarDays}
      </div>
    </div>
  );
};

// Time Slots component for displaying available slots
const TimeSlots = ({ availableSlots, selectedSlot, handleSlotSelect }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Available Time Slots</h2>
      {availableSlots.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {availableSlots.map((slot, index) => (
            <button
              key={index}
              onClick={() => handleSlotSelect(slot)}
              disabled={slot.seats === 0}
              className={`p-4 rounded-lg text-left ${
                selectedSlot?.time === slot.time && selectedSlot?.date === slot.date
                  ? 'bg-blue-600 text-white'
                  : slot.seats === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-100 hover:bg-blue-200'
              }`}
            >
              <p className="font-semibold">{slot.time} PM</p>
              <p>{slot.seats} seat{slot.seats !== 1 ? 's' : ''} available</p>
              <p>₹{slot.price} per seat</p>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-red-500">No slots available for this date. Please choose another date.</p>
      )}
    </div>
  );
};

// Booking Form component for passenger details
const BookingForm = ({ selectedSlot, formData, handleInputChange, handleSubmit }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Passenger Details</h2>
      <div className="bg-yellow-100 p-4 rounded-lg mb-4">
        <p className="text-sm">
          <strong>Note:</strong> Maximum 3 passengers per slot, with a weight limit of 70-75 kg per person. Heavier passengers may reduce capacity, and extra charges may apply.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Number of Passengers (Max 3)</label>
          <input
            type="number"
            name="passengers"
            value={formData.passengers}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
            min="1"
            max={selectedSlot.seats}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

// Footer Info component
const FooterInfo = () => {
  return (
    <div className="text-center text-sm text-gray-600 mt-6">
      <p>Flights operate between 4:00 PM and 6:00 PM. Please arrive 15 minutes early.</p>
      <p>Contact us for rescheduling or refunds. Partnered with Delhi NCR influencers!</p>
    </div>
  );
};

// Main component
export default function JoyrideBookingPage() {
  const [selectedDate, setSelectedDate] = useState('2025-06-05');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    weight: '',
    passengers: 1,
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch slots when selectedDate changes
  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('http://localhost:4000/api/joyride-slots');
        if (!response.ok) {
          throw new Error('Failed to fetch slots');
        }
        const slots = await response.json();
        const filteredSlots = slots.filter(
          (slot) => slot.date === selectedDate && slot.seats > 0
        );
        setAvailableSlots(filteredSlots);
      } catch (err) {
        setError('Error fetching available slots');
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [selectedDate]);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Mock API call for booking (replace with actual endpoint)
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          name: formData.name,
          email: formData.email,
          weight: parseFloat(formData.weight),
          passengers: parseInt(formData.passengers),
        }),
      });
      if (response.ok) {
        alert(`Booking confirmed for ${formData.name} on ${selectedSlot.date} at ${selectedSlot.time}`);
        setFormData({ name: '', email: '', weight: '', passengers: 1 });
        setSelectedSlot(null);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to confirm booking');
      }
    } catch (err) {
      setError('An error occurred while confirming the booking');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <Head>
        <title>Helicopter Joyride Booking</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      </Head>
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Book Your Helicopter Joyride</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading && <p className="text-gray-500 mb-4">Loading slots...</p>}

        {/* Custom Calendar for Date Selection */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Select Date</h2>
          <CustomCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>

        {/* Available Time Slots */}
        <TimeSlots
          availableSlots={availableSlots}
          selectedSlot={selectedSlot}
          handleSlotSelect={handleSlotSelect}
        />

        {/* Booking Form */}
        {selectedSlot && (
          <BookingForm
            selectedSlot={selectedSlot}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        )}

        {/* Footer Info */}
        <FooterInfo />
      </div>
    </div>
  );
}