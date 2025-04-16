'use client';

import BASE_URL from '@/baseUrl/baseUrl';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PlusIcon, TrashIcon, PencilIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { debounce } from 'lodash';

const ENTRIES_PER_PAGE = [10, 25, 50, 100];

const FlightsPage = () => {
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentFlight, setCurrentFlight] = useState(null);
  const [formData, setFormData] = useState({
    flight_number: '',
    departure_day: 'Monday',
    start_airport_id: '',
    end_airport_id: '',
    airport_stop_ids: '[]',
    seat_limit: 6,
    status: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [dayFilter, setDayFilter] = useState('ALL DAYS');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // Store flight ID for deletion

  // Fetch flights and airports with validation
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [flightsRes, airportsRes] = await Promise.all([
          fetch(`${BASE_URL}/flights`),
          fetch('http://localhost:4000/airport'),
        ]);
        if (!flightsRes.ok || !airportsRes.ok) throw new Error('Failed to fetch data');
        const [flightsData, airportsData] = await Promise.all([
          flightsRes.json(),
          airportsRes.json(),
        ]);

        // Validate airport IDs
        const airportIds = new Set(airportsData.map((a) => a.id));
        flightsData.forEach((flight) => {
          if (!airportIds.has(flight.start_airport_id)) {
            console.warn(`Invalid start_airport_id ${flight.start_airport_id} in flight ${flight.id}`);
          }
          if (!airportIds.has(flight.end_airport_id)) {
            console.warn(`Invalid end_airport_id ${flight.end_airport_id} in flight ${flight.id}`);
          }
          try {
            JSON.parse(flight.airport_stop_ids || '[]').forEach((id) => {
              if (!airportIds.has(id)) {
                console.warn(`Invalid stop_airport_id ${id} in flight ${flight.id}`);
              }
            });
          } catch (error) {
            console.error(`Invalid airport_stop_ids in flight ${flight.id}:`, flight.airport_stop_ids);
          }
        });

        console.log('Flights:', flightsData);
        console.log('Airports:', airportsData);
        setFlights(flightsData);
        setAirports(airportsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'seat_limit' || name.includes('airport_id') ? Number(value) : value,
    });
  };

  // Handle airport stops change (for multi-select)
  const handleStopsChange = (e) => {
    const { value, checked } = e.target;
    const currentStops = JSON.parse(formData.airport_stop_ids || '[]');
    let updatedStops;
    if (checked) {
      updatedStops = [...currentStops, Number(value)];
    } else {
      updatedStops = currentStops.filter((id) => id !== Number(value));
    }
    setFormData({
      ...formData,
      airport_stop_ids: JSON.stringify(updatedStops),
    });
  };
  

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `${BASE_URL}/flights/${currentFlight.id}` : `${BASE_URL}/flights`;
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          airport_stop_ids: JSON.parse(formData.airport_stop_ids || '[]'),
        }),
      });
      if (response.ok) {
        setShowModal(false);
        setFormData({
          flight_number: '',
          departure_day: 'Monday',
          start_airport_id: '',
          end_airport_id: '',
          airport_stop_ids: '[]',
          seat_limit: 6,
          status: 1,
        });
        setIsEdit(false);
        toast.success(isEdit ? 'Flight updated!' : 'Flight added!');
        const flightsRes = await fetch(`${BASE_URL}/flights`);
        setFlights(await flightsRes.json());
      } else {
        throw new Error('Error saving flight');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save flight.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete initiation
  const handleDelete = (id) => {
    setShowDeleteConfirm(id); // Show confirmation modal
  };

  // Confirm delete action
 // Handle delete confirmation
const confirmDelete = async () => {
  if (!showDeleteConfirm) return;
  setIsLoading(true);
  try {
    const response = await fetch(`${BASE_URL}/flights/${showDeleteConfirm}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication header if needed, e.g.:
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 400 && errorData.error.includes('foreign key')) {
        throw new Error('Cannot delete flight because it has associated bookings or dependencies.');
      }
      if (response.status === 404) {
        throw new Error('Flight not found.');
      }
      throw new Error(errorData.error || `Failed to delete flight (Status: ${response.status})`);
    }

    setFlights(flights.filter((f) => f.id !== showDeleteConfirm));
    toast.success('Flight deleted successfully!');
  } catch (error) {
    console.error('Error deleting flight:', error);
    toast.error(error.message || 'Failed to delete flight.');
  } finally {
    setIsLoading(false);
    setShowDeleteConfirm(null); // Close modal
  }
};

  // Handle edit
  const handleEdit = (flight) => {
    setIsEdit(true);
    setCurrentFlight(flight);
    setFormData({
      flight_number: flight.flight_number,
      departure_day: flight.departure_day,
      start_airport_id: flight.start_airport_id,
      end_airport_id: flight.end_airport_id,
      airport_stop_ids: flight.airport_stop_ids || '[]',
      seat_limit: flight.seat_limit,
      status: flight.status,
    });
    setShowModal(true);
  };

  // Handle status toggle
  const handleStatusToggle = async (flight) => {
    setIsLoading(true);
    const updatedFlight = { ...flight, status: flight.status === 1 ? 0 : 1 };
    try {
      const response = await fetch(`${BASE_URL}/flights/${flight.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFlight),
      });
      if (response.ok) {
        setFlights(flights.map((f) => (f.id === flight.id ? updatedFlight : f)));
        toast.success(`Flight ${updatedFlight.status === 1 ? 'activated' : 'deactivated'}!`);
      } else {
        throw new Error('Error updating status');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update status.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get airport name by ID with improved error handling
  const getAirportName = (id) => {
    const airport = airports.find((a) => a.id === id);
    if (!airport) {
      console.warn(`Airport ID ${id} not found`);
      return `Invalid ID: ${id}`;
    }
    return airport.airport_name;
  };

  // Filtered and paginated flights
  const filteredFlights = useMemo(() => {
    return flights.filter((flight) => {
      const matchesSearch = flight.flight_number.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDay = dayFilter === 'ALL DAYS' || flight.departure_day === dayFilter;
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && flight.status === 1) ||
        (statusFilter === 'Inactive' && flight.status === 0);
      return matchesSearch && matchesDay && matchesStatus;
    });
  }, [flights, searchTerm, dayFilter, statusFilter]);

  const totalPages = Math.ceil(filteredFlights.length / entries) || 1;
  const paginatedFlights = useMemo(() => {
    const start = (currentPage - 1) * entries;
    return filteredFlights.slice(start, start + entries);
  }, [filteredFlights, currentPage, entries]);

  // Pagination items
  const getPaginationItems = () => {
    const items = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    if (endPage - startPage + 1 < maxButtons) startPage = Math.max(1, endPage - maxButtons + 1);
    if (startPage > 1) {
      items.push(1);
      if (startPage > 2) items.push('...');
    }
    for (let i = startPage; i <= endPage; i++) items.push(i);
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) items.push('...');
      items.push(totalPages);
    }
    return items;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Flight Management</h2>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
            value={dayFilter}
            onChange={(e) => {
              setDayFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by day"
          >
            <option>ALL DAYS</option>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <option key={day}>{day}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by status"
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          onClick={() => {
            setIsEdit(false);
            setFormData({
              flight_number: '',
              departure_day: 'Monday',
              start_airport_id: '',
              end_airport_id: '',
              airport_stop_ids: '[]',
              seat_limit: 6,
              status: 1,
            });
            setShowModal(true);
          }}
          disabled={isLoading}
          aria-label="Add new flight"
        >
          <PlusIcon className="w-5 h-5" />
          Add Flight
        </button>
      </div>

      {/* Table Controls */}
      <div className="bg-white rounded-xl shadow-lg mb-8">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Show</span>
              <select
                value={entries}
                onChange={(e) => {
                  setEntries(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                aria-label="Select number of entries"
              >
                {ENTRIES_PER_PAGE.map((num) => (
                  <option key={num}>{num}</option>
                ))}
              </select>
              <span className="text-gray-600">entries</span>
            </div>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                onChange={(e) => debouncedSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Search flights..."
                aria-label="Search flights"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50">
                  {[
                    'S#',
                    'Number',
                    'Day',
                    'Start Airport',
                    'End Airport',
                    'Stops',
                    'Seats',
                    'Status',
                    'Action',
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : paginatedFlights.length ? (
                  paginatedFlights.map((flight, index) => (
                    <tr key={flight.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(currentPage - 1) * entries + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {flight.flight_number || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {flight.departure_day || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                        <span title={getAirportName(flight.start_airport_id)}>
                          {getAirportName(flight.start_airport_id)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                        <span title={getAirportName(flight.end_airport_id)}>
                          {getAirportName(flight.end_airport_id)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                        <span
                          title={
                            JSON.parse(flight.airport_stop_ids || '[]')
                              .map((id) => getAirportName(id))
                              .join(', ') || 'No stops'
                          }
                        >
                          {(() => {
                            try {
                              const stops = JSON.parse(flight.airport_stop_ids || '[]');
                              return stops.map((id) => getAirportName(id)).join(', ') || 'No stops';
                            } catch (error) {
                              console.error('Invalid airport_stop_ids:', flight.airport_stop_ids);
                              return 'Invalid stops';
                            }
                          })()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{flight.seat_limit}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-blue-600"
                          checked={flight.status === 1}
                          onChange={() => handleStatusToggle(flight)}
                          disabled={isLoading}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                        <button
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                          onClick={() => handleEdit(flight)}
                          disabled={isLoading}
                          aria-label="Edit flight"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                          onClick={() => handleDelete(flight.id)}
                          disabled={isLoading}
                          aria-label="Delete flight"
                        >
                          {isLoading && showDeleteConfirm === flight.id ? (
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
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
                          ) : (
                            <TrashIcon className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                      No flights available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h5 className="text-lg font-semibold mb-4">Confirm Delete</h5>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this flight?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                onClick={() => setShowDeleteConfirm(null)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                onClick={confirmDelete}
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
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
                ) : (
                  'Delete'
                )}
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isLoading}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>
          {getPaginationItems().map((item, index) =>
            item === '...' ? (
              <span key={`ellipsis-${index}`} className="px-4 py-2 text-gray-500">
                ...
              </span>
            ) : (
              <button
                key={item}
                onClick={() => setCurrentPage(item)}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === item
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                {item}
              </button>
            )
          )}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isLoading}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h5 className="text-xl font-semibold">{isEdit ? 'Edit Flight' : 'Add Flight'}</h5>
        <button
          className="text-gray-400 hover:text-gray-600"
          onClick={() => setShowModal(false)}
          disabled={isLoading}
          aria-label="Close modal"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Flight Number</label>
          <input
            type="text"
            name="flight_number"
            value={formData.flight_number}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Departure Day</label>
          <select
            name="departure_day"
            value={formData.departure_day}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            required
            disabled={isLoading}
          >
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
              (day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              )
            )}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Airport</label>
          <select
            name="start_airport_id"
            value={formData.start_airport_id}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            required
            disabled={isLoading}
          >
            <option value="">Select Airport</option>
            {airports.map((airport) => (
              <option key={airport.id} value={airport.id}>
                {airport.airport_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Airport</label>
          <select
            name="end_airport_id"
            value={formData.end_airport_id}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            required
            disabled={isLoading}
          >
            <option value="">Select Airport</option>
            {airports.map((airport) => (
              <option key={airport.id} value={airport.id}>
                {airport.airport_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Stop Airports</label>
          <div className="max-h-40 overflow-y-auto border rounded-lg px-4 py-2 bg-gray-50">
            {airports.length > 0 ? (
              airports.map((airport) => (
                <div key={airport.id} className="flex items-center py-1">
                  <input
                    type="checkbox"
                    id={`stop-airport-${airport.id}`}
                    value={airport.id}
                    checked={JSON.parse(formData.airport_stop_ids || '[]').includes(airport.id)}
                    onChange={handleStopsChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor={`stop-airport-${airport.id}`}
                    className="ml-2 text-sm text-gray-700 cursor-pointer"
                  >
                    {airport.airport_name}
                  </label>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No airports available</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Seat Limit</label>
          <input
            type="number"
            name="seat_limit"
            value={formData.seat_limit}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            required
            min="1"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={isLoading}
          >
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
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
          ) : (
            <>
              <PlusIcon className="w-5 h-5" />
              {isEdit ? 'Update Flight' : 'Add Flight'}
            </>
          )}
        </button>
      </form>
    </div>
  </div>
)}



    </div>
  );
};

export default FlightsPage;