"use client"
import React, { useState } from 'react';
import flightData from './../../data/Flight.json'; 

// Flight Card Component
const FlightCard = ({ flight }) => {
  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 overflow-hidden">
      <div className="flex items-center p-6 transform group-hover:scale-[1.01] transition-transform duration-300">
        {/* Route Info */}
        <div className="flex-1 min-w-[150px] space-y-1">
          <h3 className="text-xl font-semibold text-gray-900 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
            {flight.departure} → {flight.arrival}
          </h3>
          <p className="text-sm text-gray-600"><strong>Flight:</strong> {flight.flightNumber}</p>
          <p className="text-sm text-gray-600"><strong>Date:</strong> {flight.date}</p>
        </div>

        {/* Time Info */}
        <div className="flex-1 min-w-[200px] space-y-1">
          <p className="text-sm text-gray-600">
            <strong>Time:</strong> {flight.departureTime} - {flight.arrivalTime}
            <span className="ml-2 text-xs text-gray-400">({flight.duration})</span>
          </p>
          <p className="text-sm text-gray-600">
            <strong>Stops:</strong> 
            <span className="ml-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs">
              {flight.stops}
            </span>
          </p>
        </div>

        {/* Availability */}
        <div className="flex-1 min-w-[120px] text-center space-y-1">
          <p className="text-sm text-gray-600"><strong>Seats:</strong> {flight.availableSeats}</p>
          <p className="text-sm text-gray-600">
            <strong>Status:</strong>{' '}
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              flight.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
              flight.status === 'Flight Departed' ? 'bg-green-100 text-green-700' :
              flight.status === 'Boarding' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {flight.status}
            </span>
          </p>
        </div>

        {/* Price */}
        <div className="flex-1 min-w-[150px] text-right space-y-1">
          <p className="text-xl font-bold text-indigo-600">
            {flight.price} <span className="text-sm text-gray-500">{flight.currency}</span>
          </p>
          <p className={`text-sm font-medium ${
            flight.refundable ? 'text-green-600' : 'text-red-600'
          }`}>
            {flight.refundable ? 'Refundable' : 'Non-Refundable'}
          </p>
          <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-700">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 mt-40">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Premium Flight Selection</h1>
          <p className="text-gray-600 mt-1">Choose your perfect journey</p>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto py-8 px-6 gap-6">
        {/* Sidebar - Filters */}
        <aside className={`md:w-1/4 w-80 bg-white rounded-r-2xl shadow-lg p-6 transition-transform duration-300 z-20
  fixed md:sticky top-0 h-screen overflow-y-auto`}>
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-semibold text-gray-800">Flight Filters</h2>
    <button className="md:hidden" onClick={() => setIsFilterOpen(false)}>
      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>

  <div className="space-y-6 overflow-y-auto h-[calc(100vh-80px)]">
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Sort By</h3>
      <select className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all">
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
        <option>Departure Time</option>
      </select>
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Refundable</h3>
      <label className="flex items-center">
        <input type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
        <span className="ml-2 text-sm text-gray-600">Yes</span>
      </label>
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
      {['Scheduled', 'Boarding'].map(status => (
        <label key={status} className="flex items-center mt-2">
          <input type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
          <span className="ml-2 text-sm text-gray-600">{status}</span>
        </label>
      ))}
    </div>
  </div>
</aside>

        {/* Main Content - Flight Cards */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Available Flights ({flightData.length})</h2>
            <button className="md:hidden px-4 py-2 bg-indigo-600 text-white rounded-lg" onClick={() => setIsFilterOpen(true)}>
              Filters
            </button>
          </div>
          <div className="space-y-6">
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