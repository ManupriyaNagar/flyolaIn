"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfessionalTicket from "./../../../components/SingleTicket/ProfessionalTicket";
import BASE_URL from "@/baseUrl/baseUrl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  TicketIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  EyeIcon, 
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";

const Page = () => {
  const { authState } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [airportMap, setAirportMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("all");
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [startDate, endDate] = dateRange;
  const itemsPerPage = 10;

  // Redirect if not admin
  useEffect(() => {
    if (!authState.isLoading && (!authState.isLoggedIn || String(authState.userRole) !== "1")) {
      router.push("/sign-in");
    }
  }, [authState, router]);

  // Fetch bookings
  useEffect(() => {
    if (
      authState.isLoading ||
      !authState.isLoggedIn ||
      String(authState.userRole) !== "1"
    ) {
      return;
    }

    async function fetchBookings() {
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

        const [
          bookingsRes,
          passengersRes,
          bookedSeatRes,
          billingsRes,
          paymentsRes,
          airportRes,
        ] = await Promise.all([
          fetch(`${BASE_URL}/bookings`, commonOpts).catch(() => ({ ok: false, status: 404 })),
          fetch(`${BASE_URL}/passenger`, commonOpts).catch(() => ({ ok: false, status: 404 })),
          fetch(`${BASE_URL}/booked-seat`, commonOpts).catch(() => ({ ok: false, status: 404 })),
          fetch(`${BASE_URL}/billings`, commonOpts).catch(() => ({ ok: false, status: 404 })),
          fetch(`${BASE_URL}/payments`, commonOpts).catch(() => ({ ok: false, status: 404 })),
          fetch(`${BASE_URL}/airport`, commonOpts).catch(() => ({ ok: false, status: 404 })),
        ]);

        const [
          bookingsData,
          passengersData,
          bookedSeatData,
          billingsData,
          paymentsData,
          airportData,
        ] = await Promise.all([
          bookingsRes.ok ? bookingsRes.json() : [],
          passengersRes.ok ? (await passengersRes.json()).data || [] : [],
          bookedSeatRes.ok ? bookedSeatRes.json() : [],
          billingsRes.ok ? billingsRes.json() : [],
          paymentsRes.ok ? paymentsRes.json() : [],
          airportRes.ok ? airportRes.json() : [],
        ]);

        // Build airport map
        const map = {};
        (Array.isArray(airportData) ? airportData : []).forEach((a) => {
          if (a?.id && a?.airport_name) map[a.id] = a.airport_name;
        });
        setAirportMap(map);

        // Merge & sort bookings with supporting data
        const merged = (Array.isArray(bookingsData) ? bookingsData : [])
          .map((booking) => {
            const matchingSeat = (Array.isArray(bookedSeatData) ? bookedSeatData : []).find(
              (seat) =>
                seat?.schedule_id === booking?.schedule_id &&
                seat?.bookDate === booking?.bookDate
            ) || {};
            const matchingPassengers = Array.isArray(passengersData)
              ? passengersData.filter((p) => p?.bookingId === booking?.id)
              : [];
            const matchingPayment = (Array.isArray(paymentsData) ? paymentsData : []).find(
              (p) => p?.booking_id === booking?.id
            );
            const matchingBilling = (Array.isArray(billingsData) ? billingsData : []).find(
              (b) => b?.user_id === booking?.bookedUserId
            );

            const flightSchedule = booking.FlightSchedule || matchingSeat.FlightSchedule || {};
            const depId = flightSchedule.departure_airport_id;
            const arrId = flightSchedule.arrival_airport_id;

            return {
              ...booking,
              FlightSchedule: flightSchedule,
              booked_seat: booking.seatLabels || booking.booked_seat || matchingSeat?.booked_seat || "N/A",
              passengers: matchingPassengers,
              payment: matchingPayment || {},
              billing: matchingBilling || {},
              departureAirportName: depId && map[depId] ? map[depId] : "Unknown Airport",
              arrivalAirportName: arrId && map[arrId] ? map[arrId] : "Unknown Airport",
            };
          })
          .sort(
            (a, b) =>
              new Date(b.bookDate).getTime() - new Date(a.bookDate).getTime()
          );

        setBookings(merged);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        if (err.message.includes("No authentication token")) {
          setError("Please log in again to view bookings.");
          router.push("/sign-in");
        } else {
          setError(`Failed to load bookings: ${err.message}`);
          toast.error(`Failed to load bookings: ${err.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchBookings();
  }, [authState.isLoggedIn, authState.userRole, authState.isLoading]);

  // Helper function to get date boundaries
  const getDateFilterRange = (filter) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    switch (filter) {
      case "today":
        return { start: today, end: today };
      case "tomorrow":
        return { start: tomorrow, end: tomorrow };
      case "yesterday":
        return { start: yesterday, end: yesterday };
      case "custom":
        return startDate && endDate ? { start: startDate, end: endDate } : null;
      default:
        return null;
    }
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter bookings by date and search
  const filteredBookings = React.useMemo(() => {
    let data = bookings;

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      data = data.filter((booking) =>
        [
          booking.bookingNo?.toString().toLowerCase(),
          booking.pnr?.toLowerCase(),
          booking.passengers?.map((p) => p.name?.toLowerCase()).join(" "),
          booking.departureAirportName?.toLowerCase(),
          booking.arrivalAirportName?.toLowerCase(),
        ].some((field) => field?.includes(term))
      );
    }

    // Apply date filter
    if (["today", "tomorrow", "yesterday", "custom"].includes(dateFilter)) {
      const dateRange = getDateFilterRange(dateFilter);
      if (dateRange) {
        data = data.filter((booking) => {
          const bookDate = new Date(booking.bookDate);
          bookDate.setHours(0, 0, 0, 0);
          return (
            bookDate.getTime() >= dateRange.start.getTime() &&
            bookDate.getTime() <= dateRange.end.getTime()
          );
        });
      }
    }

    // Apply sorting
    if (sortConfig.key) {
      data.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'bookDate') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return data;
  }, [bookings, dateFilter, startDate, endDate, searchTerm, sortConfig]);

  // Calculate paginated bookings
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Transform booking data for ProfessionalTicket component
  const transformBookingData = (booking) => {
    console.log("Transforming booking data for ticket display:", {
      bookingId: booking.id,
      pnr: booking.pnr,
      totalFare: booking.totalFare,
      passengers: booking.passengers?.length || 0,
      flightSchedule: booking.FlightSchedule ? 'Present' : 'Missing',
      bookedSeat: booking.booked_seat,
      seatLabels: booking.seatLabels,
      BookedSeats: booking.BookedSeats
    }); // Debug log
    
    const flightSchedule = booking.FlightSchedule || {};
    const payment = booking.payment || {};
    const billing = booking.billing || {};
    const passengers = booking.passengers || [];
    
    // Get contact info from booking first, then passengers, then billing
    const primaryContact = passengers[0] || {};
    const contactEmail = booking.email_id || primaryContact.email || billing.email || "contact@flyolaindia.com";
    const contactPhone = booking.contact_no || primaryContact.phone || billing.phone || primaryContact.number || "+91-XXXXXXXXXX";
    
    // Calculate total price from various sources
    const totalPrice = parseFloat(booking.totalFare) || 
                      parseFloat(booking.totalPrice) || 
                      parseFloat(booking.total_price) || 
                      parseFloat(payment.amount) || 
                      parseFloat(booking.amount) || 
                      0; // Don't use fallback calculation, show 0 if no real data
    
    // Get flight number from flight schedule
    const flightNumber = flightSchedule.Flight?.flight_number || 
                        `FL${flightSchedule.flight_id || booking.schedule_id || '001'}`;
    
    // Parse booked seats
    const bookedSeats = booking.booked_seat ? booking.booked_seat.split(', ') : [];
    
    return {
      bookingData: {
        id: booking.id || booking.schedule_id,
        departure: booking.departureAirportName || "Departure City",
        arrival: booking.arrivalAirportName || "Arrival City", 
        departureCode: booking.departureAirportName?.substring(0, 3).toUpperCase() || "DEP",
        arrivalCode: booking.arrivalAirportName?.substring(0, 3).toUpperCase() || "ARR",
        departureTime: flightSchedule.departure_time || "09:00",
        arrivalTime: flightSchedule.arrival_time || "11:00",
        selectedDate: booking.bookDate || booking.book_date,
        bookDate: booking.bookDate || booking.book_date,
        totalPrice: totalPrice,
        flightNumber: flightNumber,
        bookedSeats: booking.booked_seat || 'Not Assigned'
      },
      travelerDetails: passengers.length > 0 ? passengers.map((passenger, index) => ({
        title: passenger.title || (passenger.gender === 'Female' ? "Ms." : "Mr."),
        fullName: passenger.name || passenger.passenger_name || `Passenger ${index + 1}`,
        email: contactEmail,
        phone: contactPhone,
        address: passenger.address || billing.address || "Address not provided",
        seat: bookedSeats[index] || 'Not Assigned'
      })) : [{
        title: "Mr.",
        fullName: "Passenger Name",
        email: contactEmail,
        phone: contactPhone,
        address: "Address not provided",
        seat: bookedSeats[0] || 'Not Assigned'
      }],
      bookingResult: {
        booking: {
          pnr: booking.pnr || `PNR${booking.bookingNo || booking.id}`,
          bookingNo: booking.bookingNo || booking.booking_no || booking.id,
          bookingStatus: booking.bookingStatus || booking.booking_status || "CONFIRMED",
          paymentStatus: payment.status || payment.payment_status || booking.paymentStatus || "COMPLETED",
          totalFare: totalPrice,
          noOfPassengers: booking.noOfPassengers || passengers.length || 1,
          contact_no: contactPhone,
          email_id: contactEmail,
          bookedSeats: bookedSeats
        },
        passengers: passengers.length > 0 ? passengers.map((passenger, index) => ({
          age: passenger.age || "25",
          type: passenger.type || passenger.passenger_type || "Adult",
          seat: bookedSeats[index] || 'Not Assigned'
        })) : [{
          age: "25",
          type: "Adult",
          seat: bookedSeats[0] || 'Not Assigned'
        }]
      }
    };
  };

  const handleViewTicket = (booking) => {
    setSelectedBooking(booking);
    setShowTicketModal(true);
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowsUpDownIcon className="w-4 h-4 text-slate-400" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowsUpDownIcon className="w-4 h-4 text-blue-500 rotate-180" /> :
      <ArrowsUpDownIcon className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl">
              <TicketIcon className="w-8 h-8 text-white" />
            </div>
            Ticket Management
          </h1>
          <p className="text-slate-600 mt-2">View and manage flight tickets</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by booking ID, PNR, passenger name..."
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <select
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
              if (e.target.value !== "custom") {
                setDateRange([null, null]);
              }
            }}
            className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="yesterday">Yesterday</option>
            <option value="custom">Custom Date Range</option>
          </select>
          
          {dateFilter === "custom" && (
            <div className="flex gap-2">
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setDateRange([date, endDate]);
                  setCurrentPage(1);
                }}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={endDate || new Date()}
                placeholderText="Start Date"
                className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => {
                  setDateRange([startDate, date]);
                  setCurrentPage(1);
                }}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={new Date()}
                placeholderText="End Date"
                className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-pink-50 px-6 py-4 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <TicketIcon className="w-6 h-6 text-pink-600" />
            Flight Tickets ({filteredBookings.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {[
                  { key: 'bookingNo', label: 'Booking ID', sortable: true },
                  { key: 'pnr', label: 'PNR', sortable: true },
                  { key: 'passengers', label: 'Passenger Names', sortable: false },
                  { key: 'bookDate', label: 'Flight Date', sortable: true },
                  { key: 'departureAirportName', label: 'Route', sortable: false },
                  { key: 'actions', label: 'Actions', sortable: false },
                ].map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider ${
                      column.sortable ? 'cursor-pointer hover:bg-slate-100 transition-colors' : ''
                    }`}
                    onClick={column.sortable ? () => handleSort(column.key) : undefined}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && getSortIcon(column.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-slate-500">Loading tickets...</span>
                    </div>
                  </td>
                </tr>
              ) : currentBookings.length === 0 && !error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <TicketIcon className="w-12 h-12 text-slate-300" />
                      <div>
                        <p className="text-slate-500 font-medium">No tickets found</p>
                        <p className="text-slate-400 text-sm">
                          {dateFilter !== "all" || searchTerm ? "Try adjusting your filters" : "No tickets available"}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                currentBookings.map((booking) => (
                  <tr key={booking.bookingNo} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">
                      {booking.bookingNo || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                      {booking.pnr || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 max-w-[250px]">
                        <UserGroupIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span 
                          className="text-slate-700 truncate" 
                          title={booking.passengers?.map((p) => p.name).join(", ") || "N/A"}
                        >
                          {booking.passengers?.map((p) => p.name).join(", ") || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <CalendarDaysIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">
                          {booking.bookDate ? new Date(booking.bookDate).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-slate-700 max-w-[200px]">
                        <div className="font-medium truncate" title={booking.departureAirportName}>
                          {booking.departureAirportName}
                        </div>
                        <div className="text-sm text-slate-500 truncate" title={`to ${booking.arrivalAirportName}`}>
                          to {booking.arrivalAirportName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewTicket(booking)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-200 shadow-sm font-medium"
                      >
                        <EyeIcon className="w-4 h-4" />
                        View Ticket
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-6 border-t border-slate-200">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Professional Ticket Modal */}
      {selectedBooking && showTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => {
                setShowTicketModal(false);
                setSelectedBooking(null);
              }}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              ×
            </button>
            <ProfessionalTicket
              {...transformBookingData(selectedBooking)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;