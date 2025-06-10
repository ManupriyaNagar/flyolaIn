"use client";

import React, { useState, useEffect } from 'react';
import Head from 'next/head';

const AdminJoyrideSlotsManager = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingSlot, setEditingSlot] = useState(null);
  const [editFormData, setEditFormData] = useState({
    date: '',
    time: '',
    seats: '',
    price: '',
  });

  // Fetch all joyride slots
const fetchSlots = async () => {
  setLoading(true);
  setError('');
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/joyride-slots`);
    if (!response.ok) {
      throw new Error('Failed to fetch slots');
    }
    const data = await response.json();
    setSlots(data);
  } catch (err) {
    setError('Error fetching joyride slots');
  } finally {
    setLoading(false);
  }
};


  // Load slots on component mount
  useEffect(() => {
    fetchSlots();
  }, []);

  // Handle edit button click
  const handleEditClick = (slot) => {
    setEditingSlot(slot);
    setEditFormData({
      date: slot.date,
      time: slot.time,
      seats: slot.seats,
      price: slot.price,
    });
  };

  // Handle edit form input change
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (
      !editFormData.date ||
      !editFormData.time ||
      editFormData.seats < 0 ||
      editFormData.price <= 0
    ) {
      setError('Date, time, seats, and price are required, and seats must be non-negative, price must be positive');
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/joyride-slots/${editingSlot.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: editFormData.date,
          time: editFormData.time,
          seats: parseInt(editFormData.seats),
          price: parseFloat(editFormData.price),
        }),
      });

      if (response.ok) {
        const updatedSlot = await response.json();
        setSlots(slots.map((slot) => (slot.id === editingSlot.id ? updatedSlot.slot : slot)));
        setEditingSlot(null);
        setEditFormData({ date: '', time: '', seats: '', price: '' });
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update joyride slot');
      }
    } catch (err) {
      setError('An error occurred while updating the joyride slot');
    }
  };

  // Handle delete button click
  const handleDeleteClick = async (slotId) => {
    if (!confirm('Are you sure you want to delete this slot?')) return;
    setError('');
    try {
      const response = await fetch(`http://localhost:4000/api/joyride-slots/${slotId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setSlots(slots.filter((slot) => slot.id !== slotId));
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete joyride slot');
      }
    } catch (err) {
      setError('An error occurred while deleting the joyride slot');
    }
  };

  // Close edit modal
  const handleCloseEdit = () => {
    setEditingSlot(null);
    setEditFormData({ date: '', time: '', seats: '', price: '' });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
    
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Manage Joyride Slots</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading && <p className="text-gray-500 mb-4">Loading slots...</p>}

        {/* Slots Table */}
        {slots.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Time</th>
                  <th className="p-2 border">Seats</th>
                  <th className="p-2 border">Price (INR)</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <tr key={slot.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{slot.date}</td>
                    <td className="p-2 border">{slot.time}</td>
                    <td className="p-2 border">{slot.seats}</td>
                    <td className="p-2 border">₹{slot.price}</td>
                    <td className="p-2 border">
                      <button
                        onClick={() => handleEditClick(slot)}
                        className="mr-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(slot.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && <p className="text-gray-500">No joyride slots available.</p>
        )}

        {/* Edit Modal */}
        {editingSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Edit Joyride Slot</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={editFormData.date}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={editFormData.time}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Number of Seats</label>
                  <input
                    type="number"
                    name="seats"
                    value={editFormData.seats}
                    onChange={handleEditInputChange}
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
                    value={editFormData.price}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border rounded"
                    required
                    min="0.01"
                    step="0.01"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseEdit}
                    className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminJoyrideSlotsManager;