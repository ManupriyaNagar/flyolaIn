"use client";

import React, { useState } from 'react';
import BASE_URL from '@/baseUrl/baseUrl';

export default function TestCancellationPage() {
  const [bookingId, setBookingId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testCancellationDetails = async () => {
    if (!bookingId) {
      alert('Please enter a booking ID');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/cancellation/details/${bookingId}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testCancelBooking = async () => {
    if (!bookingId) {
      alert('Please enter a booking ID');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/cancellation/cancel/${bookingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ reason: 'Test cancellation' })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testGetRefunds = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/cancellation/refunds`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Test Cancellation API</h1>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Booking ID:</label>
          <input
            type="text"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter booking ID to test"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={testCancellationDetails}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Loading...' : 'Test Cancellation Details'}
          </button>
          
          <button
            onClick={testCancelBooking}
            disabled={loading}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300"
          >
            {loading ? 'Loading...' : 'Test Cancel Booking'}
          </button>
          
          <button
            onClick={testGetRefunds}
            disabled={loading}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300"
          >
            {loading ? 'Loading...' : 'Test Get Refunds'}
          </button>
        </div>

        {result && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">API Response:</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}