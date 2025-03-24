import React from 'react';
import flightData from './../../data/Flight.json'; 

// Flight Card Component
const FlightCard = ({ flight }) => {
  return (
    <div className="flex items-center border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-200 w-full">
      <div className="flex-1 min-w-[150px]">
        <h3 className="text-lg font-semibold text-gray-800">
          {flight.departure} → {flight.arrival}
        </h3>
        <p className="text-sm text-gray-600">
          <strong>Flight:</strong> {flight.flightNumber}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Date:</strong> {flight.date}
        </p>
      </div>
      <div className="flex-1 min-w-[200px]">
        <p className="text-sm text-gray-600">
          <strong>Time:</strong> {flight.departureTime} - {flight.arrivalTime}
          <span className="ml-2 text-gray-500 text-xs">({flight.duration})</span>
        </p>
        <p className="text-sm text-gray-600">
          <strong>Stops:</strong> {flight.stops}
        </p>
      </div>
      <div className="flex-1 min-w-[120px] text-center">
        <p className="text-sm text-gray-600">
          <strong>Seats:</strong> {flight.availableSeats}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Status:</strong>{' '}
          <span
            className={`font-bold ${
              flight.status === 'Scheduled' ? 'text-blue-600' :
              flight.status === 'Flight Departed' ? 'text-green-600' :
              flight.status === 'Boarding' ? 'text-yellow-600' :
              'text-red-600'
            }`}
          >
            {flight.status}
          </span>
        </p>
      </div>
      <div className="flex-1 min-w-[150px] text-right">
        <p className="text-lg font-bold text-gray-800">
          {flight.price} {flight.currency}
        </p>
        <p
          className={`text-sm ${
            flight.refundable ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {flight.refundable ? 'Refundable' : 'Non-Refundable'}
        </p>
      </div>
    </div>
  );
};

// Main Page Component
const Page = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Section - 3/4 Width for Flight Cards */}
      <div className="w-3/4 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Available Flights</h1>
        <div className="space-y-4">
          {flightData.map((flight) => (
            <FlightCard key={flight.id} flight={flight} />
          ))}
        </div>
      </div>

      {/* Right Section - 1/4 Width for Sidebar */}
      <div className="w-1/4 bg-white border-l border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Flight Filters</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Sort By</h3>
            <select className="mt-1 w-full p-2 border border-gray-300 rounded-md">
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Departure Time</option>
            </select>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Refundable</h3>
            <label className="flex items-center mt-1">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-600">Yes</span>
            </label>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Status</h3>
            <label className="flex items-center mt-1">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-600">Scheduled</span>
            </label>
            <label className="flex items-center mt-1">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-600">Boarding</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;