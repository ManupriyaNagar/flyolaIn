/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { debounce } from "lodash";
import BASE_URL from "@/baseUrl/baseUrl";

const BOOKINGS_PER_PAGE = 50;

export default function Booking() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("Confirmed");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  /** @type {{[key:number]:string}} */
  const [airportMap, setAirportMap] = useState({});

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  /** Fetch & merge data */
  useEffect(() => {
    async function fetchAll() {
      setIsLoading(true);
      try {
        const [bookingsRes, seatRes, paxRes, airportRes] = await Promise.all([
          fetch(`${BASE_URL}/bookings?status=${status}`),
          fetch(`${BASE_URL}/booked-seat`),
          fetch(`${BASE_URL}/passenger`),
          fetch(`${BASE_URL}/airport`),
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

        // Build airport id -> name map
        const map = {};
        airportData.forEach((a) => {
          map[a.id] = a.airport_name;
        });
        setAirportMap(map);

        // Merge datasets
        const merged = bookingsData.map((b) => {
          const matchSeat = seatData.find(
            (s) => s.schedule_id === b.schedule_id && s.bookDate === b.bookDate
          );
          const pax = paxData.filter((p) => p.bookingId === b.id);

          const depId = matchSeat?.FlightSchedule?.departure_airport_id;
          const arrId = matchSeat?.FlightSchedule?.arrival_airport_id;

          return {
            ...b,
            FlightSchedule: matchSeat?.FlightSchedule ?? {},
            booked_seat: matchSeat?.booked_seat ?? null, // Kept for potential future use
            passengers: pax,
            departureAirportName: map[depId] ?? depId ?? "N/A",
            arrivalAirportName: map[arrId] ?? arrId ?? "N/A",
          };
        });

        merged.sort(
          (a, b) => new Date(b.bookDate).getTime() - new Date(a.bookDate).getTime()
        );
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
  }, [status]);

  /** Search filtering */
  const filteredBookings = useMemo(() => {
    if (!searchTerm.trim()) return bookings;
    const term = searchTerm.toLowerCase();
    return bookings.filter((b) => {
      const bookingNo = b.bookingNo?.toString().toLowerCase() ?? "";
      const pnr = b.pnr?.toLowerCase() ?? "";
      const email = b.email_id?.toLowerCase() ?? "";
      const contact = b.contact_no?.toString().toLowerCase() ?? "";
      const passengerNames = b.passengers?.map((p) => p.name.toLowerCase()).join(" ") ?? "";
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
  const totalPages = Math.ceil(filteredBookings.length / BOOKINGS_PER_PAGE) || 1;

  const currentBookings = useMemo(() => {
    const start = (currentPage - 1) * BOOKINGS_PER_PAGE;
    return filteredBookings.slice(start, start + BOOKINGS_PER_PAGE);
  }, [filteredBookings, currentPage]);

  /** Excel export */
  const exportToExcel = useCallback(() => {
    const data = currentBookings.map((b) => ({
      BookingId: b.bookingNo,
      PNR: b.pnr,
      FlyDate: new Date(b.bookDate).toLocaleDateString(),
      Email: b.email_id,
      Number: b.contact_no,
      Passenger: b.noOfPassengers,
      PassengerNames: b.passengers.map((p) => p.name).join(", "),
      Sector: b.schedule_id,
      Price: parseFloat(b.totalFare).toFixed(2),
      Status: b.bookingStatus,
      DepartureTime: b.FlightSchedule?.departure_time ?? "N/A",
      ArrivalTime: b.FlightSchedule?.arrival_time ?? "N/A",
      DepartureAirport: b.departureAirportName,
      ArrivalAirport: b.arrivalAirportName,
      BookedSeats: b.noOfPassengers, // Changed from b.booked_seat to b.noOfPassengers
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bookings");
    XLSX.writeFile(wb, `Bookings_Page_${currentPage}.xlsx`);
    toast.success("Excel file downloaded successfully!");
  }, [currentBookings]);


    /** Total seats booked in the (filtered) list */
    const totalSeatsBooked = useMemo(() => {
      return filteredBookings.reduce((sum, b) => sum + (b.noOfPassengers || 0), 0);
    }, [filteredBookings]);
  











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

    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) items.push("...");
      items.push(totalPages);
    }

    return items;
  };

  /** UI */
  return (
    <div className="px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Booking Management</h2>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {["Confirmed", "Pending", "Cancelled", "All Booking"].map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setStatus(filter);
              setSearchTerm("");
            }}
            className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
              status === filter ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            aria-pressed={status === filter}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative mb-8">
        <input
          type="text"
          onChange={(e) => debouncedSearch(e.target.value)}
          placeholder="Search by ID, PNR, email, phone, or passenger name..."
          className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm"
          aria-label="Search bookings"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm("");
              setCurrentPage(1);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Export and Info */}
            {/* Export and Info */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <button
          onClick={exportToExcel}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm flex items-center gap-2"
          aria-label="Download current page as Excel"
        >
          …Download Excel…
        </button>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <span className="text-sm text-gray-600">
            Showing {(currentPage - 1) * BOOKINGS_PER_PAGE + 1}–
            {Math.min(currentPage * BOOKINGS_PER_PAGE, filteredBookings.length)}
            {" of "}{filteredBookings.length} bookings
          </span>
          <span className="text-sm text-gray-600">
            Total seats booked: <strong>{totalSeatsBooked}</strong>
          </span>
        </div>
      </div>


      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["BookingId", "PNR", "Fly Date", "Email", "Number", "Passenger", "Passenger Names", "Sector", "Price", "Status", "Departure Time", "Arrival Time", "Departure Airport", "Arrival Airport", "Booked Seats", "Action"].map((h) => (
                <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={16} className="px-6 py-8 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <svg className="animate-spin h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                    </svg>
                    <span className="text-gray-500">Loading bookings...</span>
                  </div>
                </td>
              </tr>
            ) : currentBookings.length ? (
              currentBookings.map((b) => (
                <tr key={b.bookingNo} className="hover:bg-gray-50 transition-colors duration-100">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {b.bookingNo}
                  </th>
                  <td className="px-6 py-4 whitespace-nowrap">{b.pnr}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(b.bookDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{b.email_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{b.contact_no}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{b.noOfPassengers}</td>
                  <td className="px-6 py-4">{b.passengers.map((p) => p.name).join(", ") || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{b.schedule_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">Rs {parseFloat(b.totalFare).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
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
                  <td className="px-6 py-4 whitespace-nowrap">{b.FlightSchedule?.departure_time || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{b.FlightSchedule?.arrival_time || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{b.departureAirportName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{b.arrivalAirportName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{b.noOfPassengers || "N/A"}</td> {/* Changed from b.booked_seat to b.noOfPassengers */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                      aria-label={`View booking ${b.bookingNo}`}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={16} className="px-6 py-8 text-center text-gray-500">
                  {searchTerm ? "No bookings match your search." : "No bookings available."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Previous page"
          >
            Previous
          </button>
          {getPaginationItems().map((item, index) =>
            item === "..." ? (
              <span key={`ellipsis-${index}`} className="px-4 py-2 text-gray-500">
                ...
              </span>
            ) : (
              <button
                key={item}
                onClick={() => setCurrentPage(item)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === item ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                aria-label={`Page ${item}`}
              >
                {item}
              </button>
            )
          )}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}