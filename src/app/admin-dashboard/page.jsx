"use client";

import BASE_URL from "@/baseUrl/baseUrl";
import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CalendarDaysIcon,
  MapPinIcon,
  ClockIcon,
  UserIcon,
  StarIcon,
  CurrencyRupeeIcon,
  TicketIcon,
  UsersIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaAccessibleIcon } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardPage() {
  const [flights, setFlights] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [airports, setAirports] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]); // Still maintained for compatibility
  const [passengers, setPassengers] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [billings, setBillings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authState.isLoggedIn) {
      console.log("[DashboardPage] Not logged in, redirecting to /sign-in");
      router.push("/sign-in");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoints = [
          "flights",
          "flight-schedules",
          "airport",
          "bookings",
          // "booked-seat" removed as per instruction
          "passenger",
          "users",
          "reviews",
          "billings",
          "payments",
        ];

        const responses = await Promise.all(
          endpoints.map((endpoint) =>
            fetch(`${BASE_URL}/${endpoint}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              credentials: 'include', // Support cookies for cross-origin
            })
          )
        );

        const errors = responses
          .map((res, index) => ({ res, endpoint: endpoints[index] }))
          .filter(({ res }) => !res.ok);

        if (errors.length > 0) {
          const errorDetails = await Promise.all(
            errors.map(async ({ res, endpoint }) => ({
              endpoint,
              url: res.url,
              status: res.status,
              error: (await res.json()).error || "Unknown error",
            }))
          );
          console.error("[DashboardPage] Fetch errors:", errorDetails);
          const errorMessage = errorDetails
            .map((e) => `Failed to fetch ${e.endpoint}: ${e.error} (Status: ${e.status})`)
            .join("; ");
          throw new Error(
            errorDetails.some((e) => e.status === 401)
              ? "Authentication failed: Please log in again"
              : errorMessage
          );
        }

        const [
          flightsData,
          schedulesData,
          airportsData,
          bookingsData,
          passengersData,
          usersData,
          reviewsData,
          billingsData,
          paymentsData,
        ] = await Promise.all(responses.map((res) => res.json()));

        setFlights(flightsData);
        setSchedules(schedulesData);
        setAirports(airportsData);
        setBookings(bookingsData);
        setBookedSeats([]); // Set to empty array since endpoint is skipped
        setPassengers(passengersData);
        setUsers(usersData);
        setReviews(reviewsData);
        setBillings(billingsData);
        setPayments(paymentsData);
        console.log("[DashboardPage] Data fetched successfully:", {
          flights: flightsData.length,
          bookings: bookingsData.length,
        });
      } catch (err) {
        console.error("[DashboardPage] Error fetching dashboard data:", err);
        setError(err.message);
        toast.error(err.message);
        if (err.message.includes("Authentication failed")) {
          router.push("/sign-in");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authState, router]);

  // Calculate metrics for cards
  const totalFlights = flights.length;
  const totalSchedules = schedules.length;
  const totalAirports = airports.length;
  const activeSchedules = schedules.filter((s) => s.status === 1).length;
  const totalBookings = bookings.length;
  const totalPassengers = passengers.length;
  const totalUsers = users.length;
  const totalReviews = reviews.length;
  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : "N/A";
  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  // Prepare data for Bar chart (bookings by day)
  const bookingsByDay = useMemo(() => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const counts = days.map((day, index) =>
      bookings.filter((b) => {
        const bookingDate = new Date(b.created_at || b.updated_at);
        return bookingDate.getDay() === ((index + 1) % 7);
      }).length
    );

    return {
      labels: days,
      datasets: [
        {
          label: "Bookings by Day",
          data: counts,
          backgroundColor: "rgba(79, 70, 229, 0.6)",
          borderColor: "rgba(79, 70, 229, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [bookings]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { font: { size: 14, weight: "bold" } },
      },
      title: {
        display: true,
        text: "Bookings by Day of Week",
        font: { size: 18, weight: "bold" },
        padding: { top: 10, bottom: 20 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Number of Bookings" },
        ticks: { stepSize: 1 },
      },
      x: {
        title: { display: true, text: "Day of Week" },
      },
    },
  };

  const bookingsOnSelectedDate = useMemo(() => {
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.created_at || booking.updated_at);
      return (
        bookingDate.getDate() === selectedDate.getDate() &&
        bookingDate.getMonth() === selectedDate.getMonth() &&
        bookingDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  }, [bookings, selectedDate]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Admin Dashboard - Testing Mode</h1>
      <p className="text-gray-600 mb-8">
        Monitor flights, schedules, bookings, and more in one place.
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
          {error.includes("Authentication failed") && (
            <button
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => router.push("/sign-in")}
            >
              Sign In
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Total Flights",
            value: totalFlights,
            icon: FaAccessibleIcon,
            color: "bg-indigo-600",
          },
          {
            title: "Total Schedules",
            value: totalSchedules,
            icon: ClockIcon,
            color: "bg-green-600",
          },
          {
            title: "Active Schedules",
            value: activeSchedules,
            icon: CalendarDaysIcon,
            color: "bg-blue-600",
          },
          {
            title: "Total Airports",
            value: totalAirports,
            icon: MapPinIcon,
            color: "bg-purple-600",
          },
          {
            title: "Total Bookings",
            value: totalBookings,
            icon: TicketIcon,
            color: "bg-teal-600",
          },
          {
            title: "Total Passengers",
            value: totalPassengers,
            icon: UsersIcon,
            color: "bg-orange-600",
          },
          {
            title: "Total Users",
            value: totalUsers,
            icon: UserIcon,
            color: "bg-pink-600",
          },
          {
            title: "Total Reviews",
            value: totalReviews,
            icon: StarIcon,
            color: "bg-yellow-600",
            subValue: `Avg: ${averageRating}/5`,
          },
          {
            title: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString("en-IN")}`,
            icon: CurrencyRupeeIcon,
            color: "bg-red-600",
          },
          {
            title: "Total Payments",
            value: payments.length,
            icon: CreditCardIcon,
            color: "bg-gray-600",
          },
        ].map((metric, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-4 hover:shadow-xl transition-shadow duration-200"
          >
            <div
              className={`p-3 rounded-full ${metric.color} text-white flex-shrink-0`}
            >
              <metric.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  metric.value
                )}
              </p>
              {metric.subValue && (
                <p className="text-sm text-gray-500">{metric.subValue}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Bookings Overview
          </h3>
          <div className="h-80">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <svg
                  className="animate-spin h-6 w-6 text-indigo-500"
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
                <span className="ml-2 text-gray-500">Loading chart...</span>
              </div>
            ) : bookings.length ? (
              <Bar data={bookingsByDay} options={chartOptions} />
            ) : (
              <p className="text-center text-gray-500">
                No bookings available to display.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Bookings Calendar
          </h3>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="border-none w-full"
            tileContent={({ date }) => {
              const hasBookings = bookings.some((b) => {
                const bookingDate = new Date(b.created_at || b.updated_at);
                return (
                  bookingDate.getDate() === date.getDate() &&
                  bookingDate.getMonth() === date.getMonth() &&
                  bookingDate.getFullYear() === date.getFullYear()
                );
              });
              return hasBookings ? (
                <div className="h-1 w-1 bg-indigo-600 rounded-full mx-auto mt-1" />
              ) : null;
            }}
            aria-label="Select a date to view bookings"
          />
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-600">
              Bookings on {selectedDate.toLocaleDateString("en-GB")}
            </h4>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : bookingsOnSelectedDate.length ? (
              <ul className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                {bookingsOnSelectedDate.map((booking) => {
                  const schedule = schedules.find((s) => s.id === booking.flight_schedule_id);
                  const flight = schedule
                    ? flights.find((f) => f.id === schedule.flight_id)
                    : null;
                  const startAirport = flight
                    ? airports.find((a) => a.id === flight.start_airport_id)
                    : null;
                  const endAirport = flight
                    ? airports.find((a) => a.id === flight.end_airport_id)
                    : null;
                  return (
                    <li key={booking.id} className="text-sm text-gray-700">
                      Booking #{booking.id}: {flight?.flight_number || "N/A"} (
                      {startAirport?.airport_code || "N/A"} →{" "}
                      {endAirport?.airport_code || "N/A"})
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500">No bookings on this date.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}