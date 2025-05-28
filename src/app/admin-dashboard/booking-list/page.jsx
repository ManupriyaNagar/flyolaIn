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
  const [status, setStatus] = useState("CONFIRMED");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [airportMap, setAirportMap] = useState({});

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  useEffect(() => {
    if (authState.isLoading || !authState.isLoggedIn || authState.userRole !== "1") {
      if (!authState.isLoading && !authState.isLoggedIn) {
        router.push("/sign-in");
      }
      return;
    }

    async function fetchAll() {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token") || "";
        // Validate token
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          if (payload.exp * 1000 < Date.now()) {
            toast.error("Session expired. Please log in again.");
            localStorage.removeItem("token");
            router.push("/sign-in");
            return;
          }
        } catch (err) {
          console.error("Invalid token:", err);
          toast.error("Invalid token. Please log in again.");
          router.push("/sign-in");
          return;
        }

        const commonOpts = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        // Fetch bookings
        const bookingsRes = await fetch(
          `${BASE_URL}/bookings${status !== "All Booking" ? `?status=${status}` : ""}`,
          commonOpts
        );
        if (!bookingsRes.ok) {
          throw new Error(`Failed to fetch bookings: ${bookingsRes.status}`);
        }
        const bookingsData = await bookingsRes.json();

        // Fetch airports (with fallback)
        let airportData = [];
        try {
          const airportRes = await fetch(`${BASE_URL}/airports`, commonOpts);
          if (airportRes.ok) {
            airportData = await airportRes.json();
          } else {
            console.warn(`Airports API returned ${airportRes.status}. Using empty airport data.`);
          }
        } catch (err) {
          console.warn("Failed to fetch airports:", err.message);
        }

        // Build airport id → name map
        const map = {};
        (Array.isArray(airportData) ? airportData : []).forEach((a) => {
          map[a.id] = a.airport_name || a.airport_code || "N/A";
        });
        setAirportMap(map);

        // Process bookings
        const merged = (Array.isArray(bookingsData) ? bookingsData : []).map((b) => {
          const flightSchedule = b.FlightSchedule || {};
          const depId = flightSchedule.departure_airport_id;
          const arrId = flightSchedule.arrival_airport_id;

          // Safely handle seatLabels
          const seatLabels = Array.isArray(b.seatLabels)
            ? b.seatLabels.join(", ")
            : typeof b.seatLabels === "string"
            ? b.seatLabels
            : "N/A";

          return {
            ...b,
            seatLabels,
            departureAirportName: depId && map[depId] ? map[depId] : "N/A",
            arrivalAirportName: arrId && map[arrId] ? map[arrId] : "N/A",
          };
        }).sort((a, b) => new Date(b.bookDate) - new Date(a.bookDate));

        setBookings(merged);
        setCurrentPage(1);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        toast.error("Failed to load bookings. Please try again.");
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAll();
  }, [status, authState]);

  // Search filtering
  const filteredBookings = useMemo(() => {
    if (!searchTerm.trim()) return bookings;
    const term = searchTerm.toLowerCase();
    return bookings.filter((b) => {
      const bookingNo = b.bookingNo?.toString().toLowerCase() ?? "";
      const pnr = b.pnr?.toLowerCase() ?? "";
      const email = b.email_id?.toLowerCase() ?? "";
      const contact = b.contact_no?.toString().toLowerCase() ?? "";
      const passengerNames = b.passengers
        ?.map((p) => p.name.toLowerCase())
        .join(" ") ?? "";
      const seatLabels = b.seatLabels?.toLowerCase() ?? "";
      return (
        bookingNo.includes(term) ||
        pnr.includes(term) ||
        email.includes(term) ||
        contact.includes(term) ||
        passengerNames.includes(term) ||
        seatLabels.includes(term)
      );
    });
  }, [bookings, searchTerm]);

  // Pagination helpers
  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / BOOKINGS_PER_PAGE));
  const currentBookings = useMemo(() => {
    const start = (currentPage - 1) * BOOKINGS_PER_PAGE;
    return filteredBookings.slice(start, start + BOOKINGS_PER_PAGE);
  }, [filteredBookings, currentPage]);

  // Total seats booked
  const totalSeatsBooked = useMemo(() => {
    return filteredBookings.reduce((sum, b) => sum + (b.noOfPassengers || 0), 0);
  }, [filteredBookings]);

  // Excel export
  const exportToExcel = useCallback(() => {
    const data = currentBookings.map((b) => ({
      BookingID: b.bookingNo,
      PNR: b.pnr,
      FlyDate: new Date(b.bookDate).toLocaleDateString(),
      Email: b.email_id,
      Phone: b.contact_no,
      Passengers: b.noOfPassengers,
      PassengerNames: b.passengers?.map((p) => p.name).join(", ") || "N/A",
      Sector: b.schedule_id,
      Seats: b.seatLabels,
      Price: parseFloat(b.totalFare).toFixed(2),
      Status: b.bookingStatus,
      PaymentMode: b.Payment?.payment_mode || "N/A",
      DepartureTime: b.FlightSchedule?.departure_time || "N/A",
      ArrivalTime: b.FlightSchedule?.arrival_time || "N/A",
      DepartureAirport: b.departureAirportName,
      ArrivalAirport: b.arrivalAirportName,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bookings");
    XLSX.writeFile(wb, `Bookings_${status}_Page_${currentPage}.xlsx`);
    toast.success("Excel file downloaded successfully!");
  }, [currentBookings, currentPage, status]);

  // Pagination with ellipsis
  function getPaginationItems() {
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
  }

  // View booking handler
  function handleViewBooking(bookingId) {
    router.push(`/booking-details/${bookingId}`);
  }

  return (
    <div className="px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="text-3xl font-bold mb-8 text-green-700">Booking Management</h2>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        {["CONFIRMED", "PENDING", "CANCELLED", "All Booking"].map((f) => (
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
          placeholder="Search by ID, PNR, email, phone, passenger name, or seat..."
          className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
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
          Showing {(currentPage - 1) * BOOKINGS_PER_PAGE + 1}–
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
                "Booking ID",
                "PNR",
                "Fly Date",
                "Email",
                "Phone",
                "Passengers",
                "Names",
                "Sector",
                "Seats",
                "Price",
                "Status",
                "Payment",
                "Dep Time",
                "Arr Time",
                "From",
                "To",
                "Action",
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
                <td colSpan={17} className="py-8 text-center">
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
                    {b.passengers?.map((p) => p.name).join(", ") || "N/A"}
                  </td>
                  <td className="px-4 py-2">{b.schedule_id}</td>
                  <td className="px-4 py-2">{b.seatLabels}</td>
                  <td className="px-4 py-2">₹{parseFloat(b.totalFare).toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        b.bookingStatus === "CONFIRMED"
                          ? "bg-green-100 text-green-800"
                          : b.bookingStatus === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        b.Payment?.payment_mode === "ADMIN"
                          ? "bg-green-100 text-green-800"
                          : b.Payment?.payment_mode === "DUMMY"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {b.Payment?.payment_mode || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {b.FlightSchedule?.departure_time || "N/A"}
                  </td>
                  <td className="px-4 py-2">
                    {b.FlightSchedule?.arrival_time || "N/A"}
                  </td>
                  <td className="px-4 py-2">{b.departureAirportName}</td>
                  <td className="px-4 py-2">{b.arrivalAirportName}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleViewBooking(b.id)}
                      className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={17} className="py-8 text-center text-gray-500">
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
                  currentPage === item ? "bg-green-600 text-white" : "bg-gray-100"
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