"use client";
import BASE_URL from "@/baseUrl/baseUrl";
import React, { useState, useEffect } from "react";

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("Confirmed");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/bookings?status=${status}`);
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchBookings();
  }, [status]);
  

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Booking Management</h2>

      {/* Status Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["Confirmed", "Pending", "Cancelled", "All Booking"].map((filter) => (
          <button
            key={filter}
            className={`px-4 py-2 rounded-md border transition-colors ${
              status === filter
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => setStatus(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {["BookingId", "PNR", "Fly Date", "Email", "Number", "Passenger", "Sector", "Price", "Status", "Action"].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="10" className="px-6 py-4 text-center text-gray-500">
                  Loading bookings...
                </td>
              </tr>
            ) : bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.bookingNo} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{booking.bookingNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.pnr}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(booking.bookDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.email_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.contact_no}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.noOfPassengers}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.schedule_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${parseFloat(booking.totalFare).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.bookingStatus === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : booking.bookingStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {booking.bookingStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="px-6 py-4 text-center text-gray-500">
                  No bookings available for this status.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Booking;