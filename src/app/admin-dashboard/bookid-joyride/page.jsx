"use client";

import React, { useState } from 'react';
import Head from 'next/head';

const AdminJoyrideSlotsPage = () => {
  const [slotData, setSlotData] = useState({
    date: '',
    time: '',
    seats: 1,
    price: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSlotData({ ...slotData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!slotData.date || !slotData.time || slotData.seats < 0 || slotData.price <= 0) {
      setError('Date, time, seats, and price are required, and seats must be non-negative, price must be positive');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/joyride-slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: slotData.date,
          time: slotData.time,
          seats: parseInt(slotData.seats),
          price: parseFloat(slotData.price),
        }),
      });

      if (response.ok) {
        setSuccess('Joyride slot created successfully!');
        setSlotData({ date: '', time: '', seats: 1, price: '' });
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create joyride slot');
      }
    } catch (err) {
      setError('An error occurred while creating the joyride slot');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <Head>
        <title>Admin - Create Joyride Slots</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      </Head>
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Create Joyride Slot</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={slotData.date}
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
            Create Joyride Slot
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminJoyrideSlotsPage;