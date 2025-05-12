/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { debounce } from "lodash";
import BASE_URL from "@/baseUrl/baseUrl";

const BOOKINGS_PER_PAGE = 50;

export default function Booking() {
  const { authState } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("Confirmed");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  /** @type {{[key:number]:string}} */
  const [airportMap, setAirportMap] = useState({});

  useEffect(() => {
    if (authState.isLoading || !authState.isLoggedIn || authState.userRole !== "1") {
      return;
    }
  
    async function fetchAll() {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token") || "";
        const commonOpts = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
  
        const [bookingsRes, seatRes, paxRes, airportRes] = await Promise.all([
          fetch(`${BASE_URL}/bookings?status=${status}`, commonOpts),
          fetch(`${BASE_URL}/booked-seat`,    commonOpts),
          fetch(`${BASE_URL}/passenger`,      commonOpts),
          fetch(`${BASE_URL}/airport`,        commonOpts),
        ]);
  
        if (!bookingsRes.ok || !seatRes.ok || !paxRes.ok || !airportRes.ok) {
          throw new Error("Failed to fetch data");
        }
  
        const [bookingsData, seatData, paxData, airportData] = await Promise.all([
          bookingsRes.json(),
          seatRes.json(),
          paxRes.json(),
          airportRes.json(),
        ]);
  
        // Build airport id → name map
        const map = {};
        airportData.forEach(a => {
          map[a.id] = a.airport_name;
        });
        setAirportMap(map);
  
        // Merge & sort
        const merged = bookingsData
          .map(b => {
            const matchSeat = seatData.find(
              s => s.schedule_id === b.schedule_id && s.bookDate === b.bookDate
            ) || { FlightSchedule: {} };
            const pax = paxData.filter(p => p.bookingId === b.id);
            const depId = matchSeat.FlightSchedule.departure_airport_id;
            const arrId = matchSeat.FlightSchedule.arrival_airport_id;
  
            return {
              ...b,
              FlightSchedule: matchSeat.FlightSchedule,
              passengers: pax,
              departureAirportName: map[depId] || "N/A",
              arrivalAirportName: map[arrId] || "N/A",
            };
          })
          .sort((a, b) => new Date(b.bookDate) - new Date(a.bookDate));
  
        setBookings(merged);
        setCurrentPage(1);
      } catch (err) {
        console.error("Error fetching bookings", err);
        toast.error("Failed to load bookings. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  
    fetchAll();
  }, [status, authState]);
  
  /** Search filtering */
  const filteredBookings = useMemo(() => {
    if (!searchTerm.trim()) return bookings;
    const term = searchTerm.toLowerCase();
    return bookings.filter((b) => {
      const bookingNo = b.bookingNo?.toString().toLowerCase() ?? "";
      const pnr = b.pnr?.toLowerCase() ?? "";
      const email = b.email_id?.toLowerCase() ?? "";
      const contact = b.contact_no?.toString().toLowerCase() ?? "";
      const passengerNames = b.passengers
        .map((p) => p.name.toLowerCase())
        .join(" ");
      return (
        bookingNo.includes(term) ||
        pnr.includes(term) ||
        email.includes(term) ||
        contact.includes(term) ||
        passengerNames.includes(term)
      );
    });
  }, [bookings, searchTerm]);

  /** Pagination helpers */
  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / BOOKINGS_PER_PAGE));
  const currentBookings = useMemo(() => {
    const start = (currentPage - 1) * BOOKINGS_PER_PAGE;
    return filteredBookings.slice(start, start + BOOKINGS_PER_PAGE);
  }, [filteredBookings, currentPage]);

  /** Total seats booked */
  const totalSeatsBooked = useMemo(() => {
    return filteredBookings.reduce((sum, b) => sum + (b.noOfPassengers || 0), 0);
  }, [filteredBookings]);

  /** Excel export */
  const exportToExcel = useCallback(() => {
    const data = currentBookings.map((b) => ({
      BookingId: b.bookingNo,
      PNR: b.pnr,
      FlyDate: new Date(b.bookDate).toLocaleDateString(),
      Email: b.email_id,
      Phone: b.contact_no,
      Passengers: b.noOfPassengers,
      PassengerNames: b.passengers.map((p) => p.name).join(", "),
      Sector: b.schedule_id,
      Price: parseFloat(b.totalFare).toFixed(2),
      Status: b.bookingStatus,
      DepartureTime: b.FlightSchedule?.departure_time || "N/A",
      ArrivalTime: b.FlightSchedule?.arrival_time || "N/A",
      DepartureAirport: b.departureAirportName,
      ArrivalAirport: b.arrivalAirportName,
      BookedSeats: b.noOfPassengers,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bookings");
    XLSX.writeFile(wb, `Bookings_Page_${currentPage}.xlsx`);
    toast.success("Excel file downloaded successfully!");
  }, [currentBookings, currentPage]);

  /** Pagination with ellipsis */
  const getPaginationItems = () => {
    const items = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    if (startPage > 1) {
      items.push(1);
      if (startPage > 2) items.push("...");
    }
    for (let i = startPage; i <= endPage; i++) items.push(i);
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) items.push("...");
      items.push(totalPages);
    }
    return items;
  };

  return (
    <div className="px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="text-3xl font-bold mb-8">Booking Management</h2>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        {["Confirmed", "Pending", "Cancelled", "All Booking"].map((f) => (
          <button
            key={f}
            onClick={() => {
              setStatus(f);
              setSearchTerm("");
            }}
            className={`px-4 py-2 rounded-full ${
              status === f
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Search & Export */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <input
          type="text"
          onChange={(e) => debouncedSearch(e.target.value)}
          placeholder="Search by ID, PNR, email, phone, or passenger name..."
          className="flex-1 px-4 py-2 border rounded"
        />
        <button
          onClick={exportToExcel}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Download Excel
        </button>
      </div>

      {/* Info */}
      <div className="flex justify-between mb-4 text-sm text-gray-700">
        <span>
          Showing{" "}
          {(currentPage - 1) * BOOKINGS_PER_PAGE + 1}–
          {Math.min(currentPage * BOOKINGS_PER_PAGE, filteredBookings.length)} of{" "}
          {filteredBookings.length}
        </span>
        <span>Total seats booked: {totalSeatsBooked}</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "BookingId", "PNR", "Fly Date", "Email", "Number",
                "Passenger", "Names", "Sector", "Price", "Status",
                "Dep Time", "Arr Time", "From", "To", "Seats", "Action"
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={16} className="py-8 text-center">
                  Loading…
                </td>
              </tr>
            ) : currentBookings.length ? (
              currentBookings.map((b) => (
                <tr key={b.bookingNo}>
                  <td className="px-4 py-2">{b.bookingNo}</td>
                  <td className="px-4 py-2">{b.pnr}</td>
                  <td className="px-4 py-2">
                    {new Date(b.bookDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{b.email_id}</td>
                  <td className="px-4 py-2">{b.contact_no}</td>
                  <td className="px-4 py-2">{b.noOfPassengers}</td>
                  <td className="px-4 py-2">
                    {b.passengers.map((p) => p.name).join(", ")}
                  </td>
                  <td className="px-4 py-2">{b.schedule_id}</td>
                  <td className="px-4 py-2">₹{b.totalFare}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        b.bookingStatus === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : b.bookingStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {b.FlightSchedule.departure_time || "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    {b.FlightSchedule.arrival_time || "N/A"}
                  </td>
                  <td className="px-4 py-2">{b.departureAirportName}</td>
                  <td className="px-4 py-2">{b.arrivalAirportName}</td>
                  <td className="px-4 py-2">{b.noOfPassengers}</td>
                  <td className="px-4 py-2">
                    <button className="px-2 py-1 bg-blue-600 text-white rounded">
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={16} className="py-8 text-center text-gray-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {getPaginationItems().map((item, idx) =>
            item === "..." ? (
              <span key={idx}>…</span>
            ) : (
              <button
                key={item}
                onClick={() => setCurrentPage(item)}
                className={`px-3 py-1 rounded ${
                  currentPage === item ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {item}
              </button>
            )
          )}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
