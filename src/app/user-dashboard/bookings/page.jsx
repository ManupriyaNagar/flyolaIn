"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import BASE_URL from "@/baseUrl/baseUrl";

export default function UserBookingsPage() {
  const { authState } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect non-users or while loading
  useEffect(() => {
    if (!authState.isLoading && !authState.isLoggedIn) {
      router.push("/sign-in");
    }
  }, [authState, router]);

  // Fetch “my” bookings
  useEffect(() => {
    if (authState.isLoading || !authState.isLoggedIn) return;

    const fetchMyBookings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/bookings/my`, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${await res.text()}`);
        }
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Failed to load your bookings:", err);
        setError("Could not load bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [authState]);

  if (authState.isLoading || loading) {
    return <div className="p-8 text-center">Loading your bookings…</div>;
  }
  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Your Booking History</h1>
      {bookings.length === 0 ? (
        <div>No bookings found.</div>
      ) : (
        <table className="w-full table-auto bg-white rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">PNR</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Passengers</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Total Fare</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="even:bg-gray-50">
                <td className="px-4 py-2">{b.pnr}</td>
                <td className="px-4 py-2">
                  {new Date(b.bookDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">{b.noOfPassengers}</td>
                <td className="px-4 py-2">{b.bookingStatus}</td>
                <td className="px-4 py-2">₹{b.totalFare}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
