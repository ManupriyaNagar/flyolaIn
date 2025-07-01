/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { debounce } from "lodash";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BASE_URL from "@/baseUrl/baseUrl";

const BOOKINGS_PER_PAGE = 50;

export default function AllBookingsPage() {
  const { authState } = useAuth();
  const router = useRouter();

  const [allData, setAllData] = useState([]);
  const [status, setStatus] = useState("Confirmed");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [airportMap, setAirportMap] = useState({});
  const [paymentMap, setPaymentMap] = useState({});
  const [agentMap, setAgentMap] = useState({});
  const [userRoleMap, setUserRoleMap] = useState({});
  const [selectedAgent, setSelectedAgent] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [downloadRange, setDownloadRange] = useState("page");
  const [error, setError] = useState(null);
  const [bookingDateRange, setBookingDateRange] = useState([null, null]);

  const [startBookingDate, endBookingDate] = bookingDateRange;

  // Redirect if not admin
  useEffect(() => {
    if (!authState.isLoading && (!authState.isLoggedIn || authState.userRole !== "1")) {
      router.push("/sign-in");
    }
  }, [authState.isLoading, authState.isLoggedIn, authState.userRole]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  // Fetch data
  useEffect(() => {
    if (authState.isLoading || !authState.isLoggedIn || authState.userRole !== "1") return;

   const fetchAllData = async () => {
  setIsLoading(true);
  setError(null);

  try {
    const token = localStorage.getItem("token") || "";
    if (!token) {
      throw new Error("No authentication token found. Please log in again.");
    }

    const commonOpts = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const endpoints = [
      `${BASE_URL}/bookings?status=${status}`,
      `${BASE_URL}/booked-seat`,
      `${BASE_URL}/passenger`,
      `${BASE_URL}/airport`,
      `${BASE_URL}/agents`,
      `${BASE_URL}/payments`,
      `${BASE_URL}/flights`,
      `${BASE_URL}/users`,
    ];

    const responses = await Promise.all(
      endpoints.map((url) =>
        fetch(url, commonOpts).catch((err) => {
          console.error(`Fetch error for ${url}:`, err);
          return { ok: false, status: 404 };
        })
      )
    );

    const data = await Promise.all(
      responses.map((res, index) =>
        res.ok
          ? index === 2
            ? res.json().then((result) => result.data || []) // Extract .data for passengers
            : res.json()
          : [1, 2].includes(index)
          ? []
          : Promise.reject(new Error(`Fetch failed: ${endpoints[index]} - ${res.status}`))
      )
    );

    console.log('Fetched bookings data:', data[0]);
    console.log('Fetched passenger data:', data[2]);
    console.log('Fetched booked-seat data:', data[1]);
    console.log('Fetched airport data:', data[3]);
    console.log('Fetched agent data:', data[4]);
    console.log('Fetched payment data:', data[5]);
    console.log('Fetched flights data:', data[6]);
    console.log('Fetched users data:', data[7]);

    const [bookingsData, seatData, paxData, airportData, agentData, paymentData, flightsData, usersData] = data;

    // Build userRoleMap
    const userRoleMap = Object.fromEntries(
      (Array.isArray(usersData) ? usersData : []).map((user) => [user.id, String(user.role)])
    );

    // Create mappings with safety checks
    const flightMap = Object.fromEntries(
      (Array.isArray(flightsData) ? flightsData : [])
        .filter((f) => f?.id && f?.flight_number && f?.status === 1)
        .map((f) => [f.id, f.flight_number])
    );
    const airportMap = Object.fromEntries(
      (Array.isArray(airportData) ? airportData : [])
        .filter((a) => a?.id && a?.airport_name)
        .map((a) => [a.id, a.airport_name])
    );
    const agentMap = Object.fromEntries(
      (Array.isArray(agentData) ? agentData : [])
        .filter((a) => a?.id && a?.agentId)
        .map((a) => [a.id, a.agentId])
    );
    const paymentMap = Object.fromEntries(
      (Array.isArray(paymentData) ? paymentData : [])
        .filter((p) => p?.booking_id && p?.transaction_id)
        .map((p) => [p.booking_id, p.transaction_id])
    );

    setAirportMap(airportMap);
    setPaymentMap(paymentMap);
    setAgentMap(agentMap);
    setUserRoleMap(userRoleMap);

   
      // In the fetchAllData function, enhance passenger handling
const merged = (Array.isArray(bookingsData) ? bookingsData : [])
  .map((booking) => {
    const matchSeat = (Array.isArray(seatData) ? seatData : []).find(
      (s) => s?.schedule_id === booking?.schedule_id && s?.bookDate === booking?.bookDate
    ) || {};
    const passengers = Array.isArray(booking.Passengers)
      ? booking.Passengers.filter(p => p && p.name) // Filter valid passengers
      : (Array.isArray(paxData) ? paxData : []).filter(
          (p) => p && p.bookingId && String(p.bookingId) === String(booking.id)
        );

    // Debug passenger data
    if (booking.id === 2407 || !passengers.length) {
      console.log(`Booking ${booking.id} passenger details:`, {
        bookingId: booking.id,
        bookingNo: booking.bookingNo,
        passengers,
        source: Array.isArray(booking.Passengers) ? "booking.Passengers" : "paxData",
      });
    }

    const seatLabels = Array.isArray(booking.BookedSeats)
      ? booking.BookedSeats.map((s) => s.seat_label).join(", ")
      : "N/A";

    return {
      ...booking,
      FlightSchedule: booking.FlightSchedule || matchSeat.FlightSchedule || {},
      booked_seat: seatLabels,
      passengers,
      flightNumber: flightMap[booking.schedule_id] || "N/A",
      billingName: booking.billing?.billing_name || "N/A",
      paymentMode: booking.Payments?.[0]?.payment_mode || booking.pay_mode || "N/A",
      agentId: agentMap[booking.agentId] || "FLYOLA",
      userRole: userRoleMap[booking.bookedUserId] || "Unknown",
      paymentId: booking.Payments?.[0]?.payment_id || booking.paymentId || "N/A",
      transactionId: booking.transactionId || paymentMap[booking.id] || "N/A",
      departureAirportName: airportMap[booking.FlightSchedule?.departure_airport_id] || "N/A",
      arrivalAirportName: airportMap[booking.FlightSchedule?.arrival_airport_id] || "N/A",
    };
  })
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    console.log('Merged bookings:', merged);
    setAllData(merged);
    setCurrentPage(1);
  } catch (err) {
    console.error("Error fetching data:", err.message);
    setError("Failed to load data. Please try again.");
    toast.error("Failed to load data. Please try again.");
  } finally {
    setIsLoading(false);
  }
};
    fetchAllData();
  }, [status, authState.isLoggedIn, authState.userRole]);

  // Date filter helper
  const getDateFilterRange = (filter) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    switch (filter) {
      case "today": return { start: today, end: today };
      case "tomorrow": return { start: tomorrow, end: tomorrow };
      case "yesterday": return { start: yesterday, end: yesterday };
      case "custom": return startBookingDate && endBookingDate ? { start: startBookingDate, end: endBookingDate } : null;
      default: return null;
    }
  };

  // Filtered data
  const filteredData = useMemo(() => {
    let data = allData;

    // Agent filter
    if (selectedAgent !== "all") {
      data = data.filter((item) => item.agentId === selectedAgent);
    }

    // Role filter
    if (selectedRole !== "all") {
      data = data.filter((item) => item.userRole === selectedRole);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      data = data.filter((item) =>
        [
          item.bookingNo?.toString().toLowerCase(),
          item.pnr?.toLowerCase(),
          item.email_id?.toLowerCase(),
          item.contact_no?.toString().toLowerCase(),
          item.passengers?.map((p) => p.name?.toLowerCase()).join(" "),
          item.billingName?.toLowerCase(),
          item.transactionId?.toLowerCase(),
          item.agentId?.toLowerCase(),
          item.userRole?.toLowerCase(),
        ].some((field) => field?.includes(term))
      );
    }

    if (["today", "tomorrow", "yesterday", "custom"].includes(downloadRange)) {
      const dateRange = getDateFilterRange(downloadRange);
      if (dateRange) {
        data = data.filter((item) => {
          const createdAt = new Date(item.created_at);
          createdAt.setHours(0, 0, 0, 0);
          return (
            createdAt.getTime() >= dateRange.start.getTime() &&
            createdAt.getTime() <= dateRange.end.getTime()
          );
        });
      }
    } else if (downloadRange.startsWith("month-")) {
      const [, year, month] = downloadRange.split("-");
      data = data.filter(
        (item) =>
          new Date(item.created_at).getFullYear() === parseInt(year) &&
          new Date(item.created_at).getMonth() === parseInt(month) - 1
      );
    } else if (downloadRange.startsWith("year-")) {
      const [, year] = downloadRange.split("-");
      data = data.filter((item) => new Date(item.created_at).getFullYear() === parseInt(year));
    }

    return data;
  }, [allData, searchTerm, downloadRange, startBookingDate, endBookingDate, selectedAgent, selectedRole]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / BOOKINGS_PER_PAGE) || 1;
  const currentData = useMemo(
    () => filteredData.slice((currentPage - 1) * BOOKINGS_PER_PAGE, currentPage * BOOKINGS_PER_PAGE),
    [filteredData, currentPage]
  );

 const exportToExcel = useCallback(() => {
  let exportData = downloadRange === "page" ? currentData : filteredData;
  let filename = `AllBookings_${downloadRange === "page" ? `Page_${currentPage}` : downloadRange}${selectedAgent !== "all" ? `_Agent_${selectedAgent}` : ""}${selectedRole !== "all" ? `_Role_${selectedRole}` : ""}.xlsx`;

  if (!exportData.length) {
    toast.warn("No data available for the selected range.");
    return;
  }

  const data = exportData.map((item) => {
    const passengerNames = item.passengers?.length
      ? item.passengers.map((p) => p.name || "Unknown").join(", ")
      : "N/A";
    console.log(`Exporting Booking ${item.bookingNo}: PassengerNames = ${passengerNames}`);
    return {
      BookingId: item.bookingNo || "N/A",
      PNR: item.pnr || "N/A",
      FlyDate: item.bookDate ? new Date(item.bookDate).toLocaleDateString() : "N/A",
      BookingDate: item.created_at ? new Date(item.created_at).toLocaleString() : "N/A",
      Email: item.email_id || "N/A",
      ContactNumber: item.contact_no || "N/A",
      Passengers: item.noOfPassengers || 0,
      PassengerNames: passengerNames,
      BillingName: item.billingName || "N/A",
      Sector: item.schedule_id || "N/A",
      FlightNumber: item.flightNumber || "N/A",
      BookedSeats: item.booked_seat || "N/A",
      TotalFare: item.totalFare ? parseFloat(item.totalFare).toFixed(2) : "N/A",
      BookingStatus: item.bookingStatus || "N/A",
      PaymentMode: item.paymentMode || "N/A",
      TransactionId: item.transactionId || "N/A",
      AgentId: item.agentId || "FLYOLA",
      UserRole: item.userRole || "Unknown",
      DepartureTime: item.FlightSchedule?.departure_time || "N/A",
      ArrivalTime: item.FlightSchedule?.arrival_time || "N/A",
      Departure : item.departureAirportName || "N/A",
      ArrivalAirport: item.arrivalAirportName || "N/A",
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "AllBookings");
  XLSX.writeFile(wb, filename);
  toast.success("Excel file downloaded successfully!");
}, [currentData, filteredData, downloadRange, startBookingDate, endBookingDate, selectedAgent, selectedRole]);

  // Download options
  const downloadOptions = useMemo(() => {
    const options = [
      { value: "page", label: "Current Page" },
      { value: "all", label: "All Data" },
      { value: "today", label: "Today" },
      { value: "tomorrow", label: "Tomorrow" },
      { value: "yesterday", label: "Yesterday" },
      { value: "custom", label: "Custom Date Range" },
    ];

    const yearMonthMap = new Map();
    filteredData.forEach((item) => {
      const date = new Date(item.created_at);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      if (!yearMonthMap.has(year)) yearMonthMap.set(year, new Set());
      yearMonthMap.get(year).add(month);
    });

    yearMonthMap.forEach((months, year) => {
      options.push({ value: `year-${year}`, label: `Year ${year}` });
      months.forEach((month) => {
        const monthName = new Date(0, month - 1).toLocaleString("default", { month: "long" });
        options.push({ value: `month-${year}-${month}`, label: `${monthName} ${year}` });
      });
    });

    return options;
  }, [filteredData]);

  // Agent options
  const agentOptions = useMemo(() => {
    const options = [{ value: "all", label: "All Agents" }];
    Object.entries(agentMap).forEach(([id, agentId]) => {
      options.push({ value: agentId, label: agentId });
    });
    return options;
  }, [agentMap]);

  // Role options
  const roleOptions = useMemo(() => [
    { value: "all", label: "All Roles" },
    { value: "1", label: "Admin (Role 1)" },
    { value: "2", label: "Booking Agent (Role 2)" },
    { value: "3", label: "Regular User (Role 3)" },
    { value: "Unknown", label: "Unknown Role" },
  ], []);

  // Pagination UI
  const getPaginationItems = () => {
    const items = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    if (startPage > 1) items.push(1);
    if (startPage > 2) items.push("...");
    for (let i = startPage; i <= endPage; i++) items.push(i);
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) items.push("...");
      items.push(totalPages);
    }
    return items;
  };

  // View booking handler
  const handleViewBooking = (bookingId) => {
    router.push(`/booking-details/${bookingId}`);
  };

  return (
    <div className="px-4 py-8 max-w-[100vw] overflow-x-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold mb-8 text-gray-900">All Bookings Data</h2>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {["Confirmed", "Pending", "Cancelled", "All Booking"].map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setStatus(filter);
              setSearchTerm("");
              setSelectedAgent("all");
              setSelectedRole("all");
              setCurrentPage(1);
              setDownloadRange("page");
              setBookingDateRange([null, null]);
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

      {/* Search, Agent, and Role Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-2xl">
          <input
            type="text"
            onChange={(e) => debouncedSearch(e.target.value)}
            placeholder="Search by ID, PNR, email, phone, passenger name, billing name, transaction ID, agent ID, or user role..."
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
        <select
          value={selectedAgent}
          onChange={(e) => {
            setSelectedAgent(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Select agent"
        >
          {agentOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Select user role"
        >
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range Picker and Export */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <select
            value={downloadRange}
            onChange={(e) => {
              setDownloadRange(e.target.value);
              setCurrentPage(1);
              if (e.target.value !== "custom") setBookingDateRange([null, null]);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select download range"
          >
            {downloadOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {downloadRange === "custom" && (
            <div className="flex gap-2">
              <DatePicker
                selected={startBookingDate}
                onChange={(date) => setBookingDateRange([date, endBookingDate])}
                selectsStart
                startDate={startBookingDate}
                endDate={endBookingDate}
                maxDate={endBookingDate || new Date()}
                placeholderText="Start Booking Date"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Select start booking date"
              />
              <DatePicker
                selected={endBookingDate}
                onChange={(date) => setBookingDateRange([startBookingDate, date])}
                selectsEnd
                startDate={startBookingDate}
                endDate={endBookingDate}
                minDate={startBookingDate}
                maxDate={new Date()}
                placeholderText="End Booking Date"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Select end booking date"
              />
            </div>
          )}
          <button
            onClick={exportToExcel}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm flex items-center gap-2"
            aria-label="Download as Excel"
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
        </div>
        <span className="text-sm text-gray-600">
          Showing {(currentPage - 1) * BOOKINGS_PER_PAGE + 1}–
          {Math.min(currentPage * BOOKINGS_PER_PAGE, filteredData.length)} of {filteredData.length} records
        </span>
      </div>

      {/* Error Message and Retry Button */}
      {error && (
        <div className="text-center py-4">
          <p className="text-red-600">{error}</p>
          {error.includes("Failed to load data") && (
            <button
              onClick={() => fetchAllData()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-2"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                { label: "Booking ID", width: "min-w-[120px]" },
                { label: "PNR", width: "min-w-[100px]" },
                { label: "Fly Date", width: "min-w-[120px]" },
                { label: "Booking Date", width: "min-w-[160px]" },
                { label: "Email", width: "min-w-[200px]" },
                { label: "Phone", width: "min-w-[120px]" },
                { label: "Passengers", width: "min-w-[100px]" },
                { label: "Names", width: "min-w-[320px]" },
                { label: "Billing Name", width: "min-w-[200px]" },
                { label: "Sector", width: "min-w-[100px]" },
                { label: "Seats", width: "min-w-[120px]" },
                { label: "Price", width: "min-w-[100px]" },
                { label: "Status", width: "min-w-[120px]" },
                { label: "Payment", width: "min-w-[120px]" },
                { label: "Transaction ID", width: "min-w-[140px]" },
                { label: "Payment ID", width: "min-w-[140px]" },
                { label: "Agent ID", width: "min-w-[120px]" },
                { label: "User Role", width: "min-w-[120px]" },
                { label: "Dep Time", width: "min-w-[120px]" },
                { label: "Arr Time", width: "min-w-[120px]" },
                { label: "From", width: "min-w-[160px]" },
                { label: "To", width: "min-w-[160px]" },
                { label: "Action", width: "min-w-[100px]" },
              ].map((h) => (
                <th
                  key={h.label}
                  className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${h.width}`}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {!error && isLoading ? (
              <tr>
                <td colSpan={22} className="px-6 py-8 text-center">
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
              currentData.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <th
                    scope="row"
                    className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {b.bookingNo || "N/A"}
                  </th>
                  <td className="px-4 py-2 whitespace-nowrap">{b.pnr || "N/A"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {b.bookDate ? new Date(b.bookDate).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {b.created_at ? new Date(b.created_at).toLocaleString() : "N/A"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{b.email_id || "N/A"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{b.contact_no || "N/A"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{b.noOfPassengers || "0"}</td>
                  <td className="px-4 py-2 whitespace-nowrap w-80">{b.passengers?.map((p) => p.name).join(", ") || "N/A"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{b.billingName || "N/A"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{b.schedule_id || "N/A"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{b.booked_seat || "N/A"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {b.totalFare ? `₹${parseFloat(b.totalFare).toFixed(2)}` : "N/A"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        b.bookingStatus === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : b.bookingStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : b.bookingStatus === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {b.bookingStatus || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        b.paymentMode === "ADMIN"
                          ? "bg-green-100 text-green-800"
                          : b.paymentMode === "DUMMY"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {b.paymentMode || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{b.transactionId || "N/A"}</td>
                  
<td className="px-4 py-2 whitespace-nowrap">{b.paymentId || "N/A"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{b.agentId}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        b.userRole === "1"
                          ? "bg-purple-100 text-purple-800"
                          : b.userRole === "2"
                          ? "bg-blue-100 text-blue-800"
                          : b.userRole === "3"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {b.userRole === "1" ? "Admin" : b.userRole === "2" ? "Booking Agent" : b.userRole === "3" ? "Regular User" : "Unknown"}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{b.FlightSchedule?.departure_time || "N/A"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{b.FlightSchedule?.arrival_time || "N/A"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{b.departureAirportName || "N/A"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{b.arrivalAirportName || "N/A"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <button
                      onClick={() => handleViewBooking(b.id)}
                      className="px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                      aria-label={`View booking ${b.bookingNo || "N/A"}`}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={22} className="px-6 py-8 text-center text-gray-500">
                  {searchTerm || downloadRange !== "page" || selectedAgent !== "all" || selectedRole !== "all" ? "No records match your filters." : "No records available."}
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
          {getPaginationItems().map((item, idx) =>
            item === "..." ? (
              <span key={`ellipsis-${idx}`} className="px-4 py-2 text-gray-500">
                …
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