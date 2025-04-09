"use client";
import { useState, useEffect } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";

const FilterSidebar = ({
  airports,
  sortOption,
  setSortOption,
  filterDepartureCity,
  setFilterDepartureCity,
  filterArrivalCity,
  setFilterArrivalCity,
  filterStatus,
  setFilterStatus,
  filterMinSeats,
  setFilterMinSeats,
  filterStops,
  setFilterStops, // New prop for stop filter
  isFilterOpen,
  setIsFilterOpen,
  authState,
  setAuthState,
  dates,
  selectedDate,
  setSearchCriteria,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(authState.isLoggedIn);

  useEffect(() => {
    setIsLoggedIn(authState.isLoggedIn);
  }, [authState.isLoggedIn]);



  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSearchCriteria((prev) => ({ ...prev, date: newDate }));
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 transform ${isFilterOpen ? "translate-x-0" : "-translate-x-full"} w-64 bg-white shadow-lg p-6 transition-transform duration-300 ease-in-out z-20 md:static md:translate-x-0`}
    >
      <button
        className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        onClick={() => setIsFilterOpen(false)}
      >
        <FaTimes size={20} />
      </button>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Filters</h2>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
        <select
          value={selectedDate || dates[0]?.date}
          onChange={handleDateChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {dates.map((dateObj, index) => (
            <option key={index} value={dateObj.date}>
              {dateObj.date} ({dateObj.day})
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Departure</label>
        <select
          value={filterDepartureCity}
          onChange={(e) => setFilterDepartureCity(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All</option>
          {airports.map((airport) => (
            <option key={airport.id} value={airport.city}>
              {airport.city} ({airport.airport_code})
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Arrival</label>
        <select
          value={filterArrivalCity}
          onChange={(e) => setFilterArrivalCity(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All</option>
          {airports.map((airport) => (
            <option key={airport.id} value={airport.city}>
              {airport.city} ({airport.airport_code})
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Departed">Departed</option>
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Min Seats</label>
        <input
          type="number"
          value={filterMinSeats}
          onChange={(e) => setFilterMinSeats(parseInt(e.target.value) || 0)}
          min="0"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Stops</label>
        <select
          value={filterStops}
          onChange={(e) => setFilterStops(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All</option>
          <option value="0">0 Stops</option>
          <option value="1">1 Stop</option>
          <option value="2">2 Stops</option>
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="Price: Low to High">Price: Low to High</option>
          <option value="Price: High to Low">Price: High to Low</option>
          <option value="Departure Time">Departure Time</option>
        </select>
      </div>
    
    </aside>
  );
};

export default FilterSidebar;