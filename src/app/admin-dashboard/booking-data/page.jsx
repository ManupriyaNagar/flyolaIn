/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { debounce } from "lodash";
import BASE_URL from "@/baseUrl/baseUrl";

const BOOKINGS_PER_PAGE = 50;


export default function AllBookingsPage() {
  const [allData, setAllData] = useState([]);
  const [status, setStatus] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  // Fetch and merge all data
  useEffect(() => {
    async function fetchAllData() {
        setIsLoading(true);
        try {
          const [bookingsRes, billingsRes, paymentsRes, passengersRes, bookedSeatRes] = await Promise.all([
            fetch(`${BASE_URL}/bookings${status !== "All" ? `?status=${status}` : ""}`),
            fetch(`${BASE_URL}/billings`),
            fetch(`${BASE_URL}/payments`),
            fetch(`${BASE_URL}/passenger`),
            fetch(`${BASE_URL}/booked-seat`),
          ]);
      
          if (
            !bookingsRes.ok ||
            !billingsRes.ok ||
            !paymentsRes.ok ||
            !passengersRes.ok ||
            !bookedSeatRes.ok
          ) {
            throw new Error("Failed to fetch data");
          }
      
          const [bookingsData, billingsData, paymentsData, passengersData, bookedSeatData] = await Promise.all([
            bookingsRes.json(),
            billingsRes.json(),
            paymentsRes.json(),
            passengersRes.json(),
            bookedSeatRes.json(), // <--- Fixed: Use bookedSeatRes instead of bookedSeatData
          ]);
      
          // Rest of the merging logic remains the same
          const merged = bookingsData.map((booking) => {
            const matchingSeat = bookedSeatData.find(
              (seat) => seat.schedule_id === booking.schedule_id && seat.bookDate === booking.bookDate
            );
            const matchingPassengers = passengersData.filter((p) => p.bookingId === booking.id);
            const matchingPayment = paymentsData.find((p) => p.booking_id === booking.id);
            const matchingBilling = billingsData.find((b) => b.user_id === booking.bookedUserId);
      
            return {
              ...booking,
              FlightSchedule: matchingSeat?.FlightSchedule ?? {},
              booked_seat: matchingSeat?.booked_seat ?? null,
              passengers: matchingPassengers,
              payment: matchingPayment ?? {},
              billing: matchingBilling ?? {},
              departureAirportId: matchingSeat?.FlightSchedule?.departure_airport_id ?? "N/A",
              arrivalAirportId: matchingSeat?.FlightSchedule?.arrival_airport_id ?? "N/A",
            };
          });
      
          merged.sort(
            (a, b) => new Date(b.bookDate).getTime() - new Date(a.bookDate).getTime()
          );
          setAllData(merged);
          setCurrentPage(1);
        } catch (err) {
          console.error("Error fetching data", err);
          toast.error("Failed to load data. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    fetchAllData();
  }, [status]);

  // Search filtering
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return allData;
    const term = searchTerm.toLowerCase();
    return allData.filter((item) => {
      const bookingNo = item.bookingNo?.toString().toLowerCase() ?? "";
      const pnr = item.pnr?.toLowerCase() ?? "";
      const email = item.email_id?.toLowerCase() ?? "";
      const contact = item.contact_no?.toString().toLowerCase() ?? "";
      const passengerNames = item.passengers?.map((p) => p.name.toLowerCase()).join(" ") ?? "";
      const billingName = item.billing?.billing_name?.toLowerCase() ?? "";
      const paymentId = item.payment?.payment_id?.toLowerCase() ?? "";
      return (
        bookingNo.includes(term) ||
        pnr.includes(term) ||
        email.includes(term) ||
        contact.includes(term) ||
        passengerNames.includes(term) ||
        billingName.includes(term) ||
        paymentId.includes(term)
      );
    });
  }, [allData, searchTerm]);

  // Pagination helpers
  const totalPages = Math.ceil(filteredData.length / BOOKINGS_PER_PAGE) || 1;

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * BOOKINGS_PER_PAGE;
    return filteredData.slice(start, start + BOOKINGS_PER_PAGE);
  }, [filteredData, currentPage]);

  // Excel export
  const exportToExcel = useCallback(() => {
    const data = currentData.map((item) => ({
      BookingId: item.bookingNo,
      PNR: item.pnr,
      FlyDate: new Date(item.bookDate).toLocaleDateString(),
      Email: item.email_id,
      ContactNumber: item.contact_no,
      Passengers: item.noOfPassengers,
      PassengerNames: item.passengers.map((p) => p.name).join(", "),
      Sector: item.schedule_id,
      TotalFare: parseFloat(item.totalFare).toFixed(2),
      BookingStatus: item.bookingStatus,
      DepartureTime: item.FlightSchedule?.departure_time ?? "N/A",
      ArrivalTime: item.FlightSchedule?.arrival_time ?? "N/A",
      DepartureAirportId: item.departureAirportId,
      ArrivalAirportId: item.arrivalAirportId,
      BookedSeats: item.booked_seat ?? "N/A",
      PaymentId: item.payment?.payment_id ?? "N/A",
      PaymentStatus: item.payment?.payment_status ?? "N/A",
      PaymentAmount: item.payment?.payment_amount ?? "N/A",
      PaymentMode: item.payment?.payment_mode ?? "N/A",
      BillingName: item.billing?.billing_name ?? "N/A",
      BillingEmail: item.billing?.billing_email ?? "N/A",
      BillingNumber: item.billing?.billing_number ?? "N/A",
      BillingAddress: item.billing?.billing_address ?? "N/A",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "AllBookings");
    XLSX.writeFile(wb, `AllBookings_Page_${currentPage}.xlsx`);
    toast.success("Excel file downloaded successfully!");
  }, [currentData]);

  // Pagination with ellipsis
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

  // UI
  return (
    <div className="px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold mb-8 text-gray-900">All Bookings Data</h2>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {["All", "Confirmed", "Pending", "Flight Cancelled"].map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setStatus(filter);
              setSearchTerm("");
            }}
            className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
              status === filter
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
          placeholder="Search by ID, PNR, email, phone, passenger name, billing name, or payment ID..."
          className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm"
          aria-label="Search all bookings"
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
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <button
          onClick={exportToExcel}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm flex items-center gap-2"
          aria-label="Download current page as Excel"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H3a2 2 0 01-2-2V3a2 2 0 012-2h18a2 2 0 012 2v16a2 2 0 01-2 2z"
            />
          </svg>
          Download Excel
        </button>
        <span className="text-sm text-gray-600">
          Showing {(currentPage - 1) * BOOKINGS_PER_PAGE + 1}–
          {Math.min(currentPage * BOOKINGS_PER_PAGE, filteredData.length)} of {filteredData.length} records
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "BookingId",
                "PNR",
                "Fly Date",
                "Email",
                "Number",
                "Passengers",
                "Passenger Names",
                "Sector",
                "Total Fare",
                "Status",
                "Departure Time",
                "Arrival Time",
                "Departure Airport",
                "Arrival Airport",
                "Booked Seats",
                "Payment ID",
                "Payment Status",
                "Payment Amount",
                "Payment Mode",
                "Billing Name",
                "Billing Email",
                "Billing Number",
                "Billing Address",
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={24} className="px-6 py-8 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <svg
                      className="animate-spin h-6 w-6 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                      />
                    </svg>
                    <span className="text-gray-500">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : currentData.length ? (
              currentData.map((item) => (
                <tr
                  key={item.bookingNo}
                  className="hover:bg-gray-50 transition-colors duration-100"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {item.bookingNo}
                  </th>
                  <td className="px-6 py-4 whitespace-nowrap">{item.pnr}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(item.bookDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.email_id}</td>
                  <td className="px- by-4 whitespace-nowrap">{item.contact_no}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.noOfPassengers}</td>
                  <td className="px-6 py-4">
                    {item.passengers.map((p) => p.name).join(", ") || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.schedule_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    Rs {parseFloat(item.totalFare).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        item.bookingStatus === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : item.bookingStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.bookingStatus === "Flight Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.bookingStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.FlightSchedule?.departure_time || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.FlightSchedule?.arrival_time || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.departureAirportId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.arrivalAirportId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.booked_seat || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.payment?.payment_id || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.payment?.payment_status || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.payment?.payment_amount || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.payment?.payment_mode || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.billing?.billing_name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.billing?.billing_email || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.billing?.billing_number || "N/A"}
                  </td>
                  <td className="px-6 py-4">{item.billing?.billing_address || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                      aria-label={`View booking ${item.bookingNo}`}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={24} className="px-6 py-8 text-center text-gray-500">
                  {searchTerm ? "No records match your search." : "No records available."}
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
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                  currentPage === item
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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