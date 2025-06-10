"use client";

import { useState, useEffect } from 'react';

// Custom Calendar component
const CustomCalendar = ({ selectedDate, setSelectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const [language, setLanguage] = useState('EN');

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startingDay = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;
  const totalDays = lastDayOfMonth.getDate();

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
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Select language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-1 border rounded"
          >
            <option value="EN">EN</option>
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

// Time Slots component
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
              <p>₹{slot.price} per seat (base price)</p>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-red-500">No slots available for this date. Please choose another date.</p>
      )}
    </div>
  );
};

// Main Calendar and Slots component
const CalendarAndSlots = ({ onSlotSelect }) => {
  const [selectedDate, setSelectedDate] = useState('2025-06-05');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

useEffect(() => {
  const fetchSlots = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/joyride-slots?date=${selectedDate}`);
      if (!response.ok) {
        throw new Error('Failed to fetch slots');
      }
      const slots = await response.json();
      setAvailableSlots(slots);
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
  onSlotSelect(slot);
};


  return (
    <div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-500 mb-4">Loading slots...</p>}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Select Date</h2>
        <CustomCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      </div>
      <TimeSlots
        availableSlots={availableSlots}
        selectedSlot={selectedSlot}
        handleSlotSelect={handleSlotSelect}
      />
    </div>
  );
};

export default CalendarAndSlots;