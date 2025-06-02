
"use client";

import Head from 'next/head';
import { useState } from 'react';


// Mock data for available slots (replace with API call in production)
const mockSlots = [
  { date: '2025-05-28', time: '16:00', seats: 3 },
  { date: '2025-05-28', time: '16:30', seats: 2 },
  { date: '2025-05-28', time: '17:00', seats: 0 },
  { date: '2025-05-29', time: '16:00', seats: 1 },
  { date: '2025-05-29', time: '16:30', seats: 3 },
];

// Calendar component for date selection
const Calendar = ({ selectedDate, setSelectedDate }) => {
  const dates = ['2025-05-28', '2025-05-29', '2025-05-30', '2025-05-31', '2025-06-01'];
  return (
    <div className="flex flex-wrap gap-2">
      {dates.map((date) => (
        <button
          key={date}
          onClick={() => setSelectedDate(date)}
          className={`px-4 py-2 rounded ${selectedDate === date ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </button>
      ))}
    </div>
  );
};

// Main component
export default function Home() {
  const [selectedDate, setSelectedDate] = useState('2025-05-28');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    weight: '',
    passengers: 1,
  });

  const availableSlots = mockSlots.filter((slot) => slot.date === selectedDate && slot.seats > 0);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submission logic (replace with API call)
    alert(`Booking confirmed for ${formData.name} on ${selectedSlot.date} at ${selectedSlot.time}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <Head>
        <title>Helicopter Joyride Booking</title>
        <script src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      </Head>
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Book Your Helicopter Joyride</h1>
        
        {/* Calendar for Date Selection */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Select Date</h2>
          <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>

        {/* Available Time Slots */}
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
                </button>
              ))}
            </div>
          ) : (
            <p className="text-red-500">No slots available for this date. Please choose another date.</p>
          )}
        </div>

        {/* Booking Form */}
        {selectedSlot && (
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
        )}

        {/* Footer Info */}
        <div className="text-center text-sm text-gray-600 mt-6">
          <p>Flights operate between 4:00 PM and 6:00 PM. Please arrive 15 minutes early.</p>
          <p>Contact us for rescheduling or refunds. Partnered with Delhi NCR influencers!</p>
        </div>
      </div>
    </div>
  );
}