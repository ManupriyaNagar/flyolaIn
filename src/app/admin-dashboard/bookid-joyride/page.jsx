"use client";

import React, { useState } from 'react';
import Head from 'next/head';

const AdminJoyrideSlotsPage = () => {
  const [slotData, setSlotData] = useState({
    startDate: '',
    endDate: '',
    time: '',
    seats: 1,
    price: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle changes to form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSlotData({ ...slotData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate inputs
    if (!slotData.startDate || !slotData.endDate || !slotData.time || slotData.seats < 0 || slotData.price <= 0) {
      setError('Start date, end date, time, seats, and price are required, and seats must be non-negative, price must be positive');
      return;
    }

    // Validate startDate is not after endDate
    if (new Date(slotData.startDate) > new Date(slotData.endDate)) {
      setError('Start date must not be after end date');
      return;
    }

    try {
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/joyride-slots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: slotData.startDate,
          endDate: slotData.endDate,
          time: slotData.time,
          seats: parseInt(slotData.seats),
          price: parseFloat(slotData.price),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(data.message || 'Joyride slots created successfully!');
        setSlotData({ startDate: '', endDate: '', time: '', seats: 1, price: '' });
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create joyride slots');
      }
    } catch (err) {
      setError('An error occurred while creating the joyride slots');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
     
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Create Joyride Slots</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={slotData.startDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">End Date</label>
            <input
              type="date"
              name="endDate"
              value={slotData.endDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Time</label>
            <input
              type="time"
              name="time"
              value={slotData.time}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Number of Seats</label>
            <input
              type="number"
              name="seats"
              value={slotData.seats}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Price per Seat (INR)</label>
            <input
              type="number"
              name="price"
              value={slotData.price}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
              min="0.01"
              step="0.01"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Create Joyride Slots
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminJoyrideSlotsPage;