"use client";
import BASE_URL from "@/baseUrl/baseUrl";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("Confirmed");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        // Fetch bookings data
        const bookingsResponse = await fetch(`${BASE_URL}/bookings?status=${status}`);
        const bookingsData = await bookingsResponse.json();

        // Fetch booked-seat data
        const bookedSeatResponse = await fetch(`${BASE_URL}/booked-seat`);
        const bookedSeatData = await bookedSeatResponse.json();

        // Fetch passenger data
        const passengersResponse = await fetch(`${BASE_URL}/passenger`);
        const passengersData = await passengersResponse.json();

        // Merge data
        const mergedBookings = bookingsData.map((booking) => {
          const matchingSeat = bookedSeatData.find(
            (seat) =>
              seat.schedule_id === booking.schedule_id &&
              seat.bookDate === booking.bookDate
          );
          const bookingPassengers = passengersData.filter(
            (passenger) => passenger.bookingId === booking.id
          );
          return {
            ...booking,
            FlightSchedule: matchingSeat ? matchingSeat.FlightSchedule : {},
            booked_seat: matchingSeat ? matchingSeat.booked_seat : null,
            passengers: bookingPassengers,
          };
        });

        // Sort bookings by booking date in descending order
        const sortedBookings = mergedBookings.sort(
          (a, b) => new Date(b.bookDate) - new Date(a.bookDate)
        );
        setBookings(sortedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [status]);

  // Function to export data as Excel
  const exportToExcel = () => {
    const exportData = bookings.map((booking) => ({
      BookingId: booking.bookingNo,
      PNR: booking.pnr,
      FlyDate: new Date(booking.bookDate).toLocaleDateString(),
      Email: booking.email_id,
      Number: booking.contact_no,
      Passenger: booking.noOfPassengers,
      PassengerNames: booking.passengers.map((p) => p.name).join(", "),
      Sector: booking.schedule_id,
      Price: parseFloat(booking.totalFare).toFixed(2),
      Status: booking.bookingStatus,
      DepartureTime: booking.FlightSchedule?.departure_time || "N/A",
      ArrivalTime: booking.FlightSchedule?.arrival_time || "N/A",
      DepartureAirport: booking.FlightSchedule?.departure_airport_id || "N/A",
      ArrivalAirport: booking.FlightSchedule?.arrival_airport_id || "N/A",
      BookedSeats: booking.booked_seat || "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bookings");
    XLSX.writeFile(wb, "Bookings.xlsx");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Booking Management</h2>

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

      <div className="mb-6">
        <button
          onClick={exportToExcel}
          className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Download as Excel
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {[
                "BookingId",
                "PNR",
                "Fly Date",
                "Email",
                "Number",
                "Passenger",
                "Passenger Names",
                "Sector",
                "Price",
                "Status",
                "Departure Time",
                "Arrival Time",
                "Departure Airport",
                "Arrival Airport",
                "Booked Seats",
                "Action",
              ].map((header) => (
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
                <td colSpan="16" className="px-6 py-4 text-center text-gray-500">
                  Loading bookings...
                </td>
              </tr>
            ) : bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.bookingNo} className="hover:bg-gray-50">
                {/* Use either td with removed scope (if not needed) or th for header cell */}
                <th scope="row" className="px-6 py-4 whitespace-nowrap">{booking.bookingNo}</th>
                <td className="px-6 py-4 whitespace-nowrap">{booking.pnr}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(booking.bookDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.email_id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.contact_no}</td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.noOfPassengers}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {booking.passengers.map((p) => p.name).join(", ") || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.schedule_id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  Rs {parseFloat(booking.totalFare).toFixed(2)}
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
                  {booking.FlightSchedule?.departure_time || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {booking.FlightSchedule?.arrival_time || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {booking.FlightSchedule?.departure_airport_id || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {booking.FlightSchedule?.arrival_airport_id || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {booking.booked_seat || "N/A"}
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
                <td colSpan="16" className="px-6 py-4 text-center text-gray-500">
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