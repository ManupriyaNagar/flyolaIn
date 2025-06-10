"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminJoyrideBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError('');

      try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/joyride-slots/joyride-bookings`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch bookings');
        }

        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching bookings');
        console.error('[AdminJoyrideBookingsPage] Fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [router]);

  const toggleRow = (bookingId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [bookingId]: !prev[bookingId],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">All Joyride Bookings</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {loading && <p className="text-gray-500 mb-4 text-center">Loading bookings...</p>}
        {!loading && bookings.length === 0 && !error && (
          <p className="text-gray-600 mb-4 text-center">No bookings found.</p>
        )}
        {!loading && bookings.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-3">Booking ID</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Passengers</th>
                  <th className="p-3">Total Price</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <>
                    <tr className="border-b hover:bg-gray-100">
                      <td className="p-3">{booking.id}</td>
                      <td className="p-3">{booking.user?.name || 'N/A'} ({booking.user?.email || 'N/A'})</td>
                      <td className="p-3">{booking.slot?.date || 'N/A'}</td>
                      <td className="p-3">{booking.slot?.time || 'N/A'}</td>
                      <td className="p-3">{booking.passengers?.length || 0}</td>
                      <td className="p-3">
                        ₹{booking.total_price != null ? Number(booking.total_price).toFixed(2) : '0.00'}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => toggleRow(booking.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          {expandedRows[booking.id] ? 'Hide Details' : 'Show Details'}
                        </button>
                      </td>
                    </tr>
                    {expandedRows[booking.id] && (
                      <tr>
                        <td colSpan="7" className="p-3 bg-gray-50">
                          <div className="space-y-2">
                            <div>
                              <h4 className="font-semibold">Passengers</h4>
                              <ul className="list-disc pl-5">
                                {booking.passengers?.map((passenger, index) => (
                                  <li key={index}>
                                    {passenger.name} (Weight: {passenger.weight} kg)
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold">Contact</h4>
                              <p>Email: {booking.email}</p>
                              <p>Phone: {booking.phone}</p>
                            </div>
                            {booking.billing && (
                              <div>
                                <h4 className="font-semibold">Billing</h4>
                                <p>Name: {booking.billing.billing_name || 'N/A'}</p>
                                <p>Email: {booking.billing.billing_email || 'N/A'}</p>
                                <p>Phone: {booking.billing.billing_number || 'N/A'}</p>
                                <p>Address: {booking.billing.billing_address || 'N/A'}</p>
                                <p>Country: {booking.billing.billing_country || 'N/A'}</p>
                                <p>State: {booking.billing.billing_state || 'N/A'}</p>
                                <p>Pin Code: {booking.billing.billing_pin_code || 'N/A'}</p>
                                <p>GST Number: {booking.billing.GST_Number || 'N/A'}</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="text-center text-sm text-gray-600 mt-6">
          <p>Need help? Contact support for assistance with bookings.</p>
          <p>
            <a href="/admin-joyride-slots" className="text-blue-600 underline">
              Manage joyride slots
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}