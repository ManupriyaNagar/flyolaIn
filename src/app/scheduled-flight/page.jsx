"use client";
import React, { useState } from "react";
import flightData from "./../../data/Flight.json";

// Flight Card Component
const FlightCard = ({ flight }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5">
        {/* Route Info */}
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-800">
            {flight.departure} → {flight.arrival}
          </h3>
          <p className="text-sm text-gray-500">
            {flight.flightNumber} • {flight.date}
          </p>
        </div>

        {/* Time Info */}
        <div className="space-y-1">
          <p className="text-sm text-gray-600">
            {flight.departureTime} - {flight.arrivalTime}{" "}
            <span className="text-xs text-gray-400">({flight.duration})</span>
          </p>
          <p className="text-sm text-gray-600">
            <span className="inline-block px-2 py-1 bg-gray-100 rounded-full text-xs">
              {flight.stops}
            </span>
          </p>
        </div>

        {/* Availability */}
        <div className="space-y-1 text-center">
          <p className="text-sm text-gray-600">
            Seats: <span className="font-medium">{flight.availableSeats}</span>
          </p>
          <p
            className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${
              flight.status === "Scheduled"
                ? "bg-blue-50 text-blue-600"
                : flight.status === "Flight Departed"
                ? "bg-green-50 text-green-600"
                : flight.status === "Boarding"
                ? "bg-yellow-50 text-yellow-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {flight.status}
          </p>
        </div>

        {/* Price & Action */}
        <div className="text-right space-y-2">
          <p className="text-lg font-semibold text-gray-900">
            {flight.price} {flight.currency}
          </p>
          <p
            className={`text-xs font-medium ${
              flight.refundable ? "text-green-600" : "text-red-600"
            }`}
          >
            {flight.refundable ? "Refundable" : "Non-Refundable"}
          </p>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Page Component
const Page = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 mt-28">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900">Flight Options</h1>
          <p className="text-sm text-gray-500 mt-1">Explore available flights</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 flex gap-6">
        {/* Sidebar - Filters */}
        <aside
          className={`w-72 bg-white rounded-lg shadow-md p-5 transition-transform duration-300 fixed md:sticky top-0 h-screen z-20 ${
            isFilterOpen ? "translate-x-0" : "-translate-x-80 md:translate-x-0"
          }`}
        >
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
            <button
              className="md:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setIsFilterOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Sort By</h3>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Departure Time</option>
              </select>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Refundable</h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Yes</span>
              </label>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
              {["Scheduled", "Boarding"].map((status) => (
                <label key={status} className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">{status}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content - Flight Cards */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Flights ({flightData.length})
            </h2>
            <button
              className="md:hidden px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
              onClick={() => setIsFilterOpen(true)}
            >
              Filters
            </button>
          </div>
          <div className="space-y-4">
            {flightData.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;