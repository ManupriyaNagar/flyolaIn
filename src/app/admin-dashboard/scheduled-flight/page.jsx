'use client';

import BASE_URL from '@/baseUrl/baseUrl';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PlusIcon, TrashIcon, PencilIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { debounce } from 'lodash';

const ENTRIES_PER_PAGE = [10, 25, 50, 100];

const FlightSchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [filterDay, setFilterDay] = useState('All Days');
  const [filterStatus, setFilterStatus] = useState('All');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    flight_id: '',
    departure_airport_id: '',
    arrival_airport_id: '',
    departure_time: '',
    arrival_time: '',
    price: '',
    status: 1,
  });

  // Fetch data with validation
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [flightsRes, schedulesRes, airportsRes] = await Promise.all([
        fetch(`${BASE_URL}/flights`),
        fetch(`${BASE_URL}/flight-schedules`),
        fetch(`${BASE_URL}/airport`),
      ]);
      if (!flightsRes.ok || !schedulesRes.ok || !airportsRes.ok) throw new Error('Failed to fetch data');
      const [flightsData, schedulesData, airportsData] = await Promise.all([
        flightsRes.json(),
        schedulesRes.json(),
        airportsRes.json(),
      ]);
  
      // Validate data
      const flightIds = new Set(flightsData.map((f) => f.id));
      const airportIds = new Set(airportsData.map((a) => a.id));
      schedulesData.forEach((schedule) => {
        if (!flightIds.has(schedule.flight_id)) {
          console.warn(`Invalid flight_id ${schedule.flight_id} in schedule ${schedule.id}`);
        }
        if (!airportIds.has(schedule.departure_airport_id)) {
          console.warn(`Invalid departure_airport_id ${schedule.departure_airport_id} in schedule ${schedule.id}`);
        }
        if (!airportIds.has(schedule.arrival_airport_id)) {
          console.warn(`Invalid arrival_airport_id ${schedule.arrival_airport_id} in schedule ${schedule.id}`);
        }
        try {
          const viaStopIds = schedule.via_stop_id ? JSON.parse(schedule.via_stop_id || '[]') : [];
          viaStopIds.forEach((id) => {
            if (!airportIds.has(id)) {
              console.warn(`Invalid via_stop_id ${id} in schedule ${schedule.id}`);
            }
          });
        } catch (error) {
          console.error(`Invalid via_stop_id in schedule ${schedule.id}:`, schedule.via_stop_id);
        }
      });
  
      setFlights(flightsData);
      setAirports(airportsData);
      setSchedules(
        schedulesData.map((schedule) => {
          const flight = flightsData.find((f) => f.id === schedule.flight_id) || {};
          const stops = schedule.via_stop_id
            ? JSON.parse(schedule.via_stop_id || '[]').length > 0
              ? JSON.parse(schedule.via_stop_id)
                  .map((id) => airportsData.find((a) => a.id === id)?.airport_name || `Invalid ID: ${id}`)
                  .join(', ')
              : 'Direct'
            : 'Direct';
          return {
            ...schedule,
            flight_number: flight.flight_number || 'N/A',
            departure_day: flight.departure_day || 'N/A',
            startAirport: airportsData.find((a) => a.id === schedule.departure_airport_id)?.airport_name || `Invalid ID: ${schedule.departure_airport_id}`,
            endAirport: airportsData.find((a) => a.id === schedule.arrival_airport_id)?.airport_name || `Invalid ID: ${schedule.arrival_airport_id}`,
            stops,
            status: schedule.status === 1 ? 'Active' : 'Inactive',
            date: schedule.updated_at ? new Date(schedule.updated_at).toLocaleDateString('en-GB') : 'N/A',
          };
        })
      );
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Failed to load data.');
    } finally {
      setLoading(false);
    }
  }, []);
  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'status' || name.includes('airport_id') ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `${BASE_URL}/flight-schedules/${formData.id}` : `${BASE_URL}/flight-schedules`;
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          via_stop_id: formData.via_stop_id, // Include via_stop_id
        }),
      });
      if (!response.ok) throw new Error('Error saving schedule');
      setShowModal(false);
      setFormData({
        flight_id: '',
        departure_airport_id: '',
        arrival_airport_id: '',
        departure_time: '',
        arrival_time: '',
        price: '',
        status: 1,
        via_stop_id: '[]',
      });
      setIsEdit(false);
      toast.success(isEdit ? 'Schedule updated!' : 'Schedule added!');
      await fetchData(); // Refetch data after submission
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to save schedule.');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (schedule) => {
    setIsEdit(true);
    setFormData({
      id: schedule.id,
      flight_id: schedule.flight_id,
      departure_airport_id: schedule.departure_airport_id,
      arrival_airport_id: schedule.arrival_airport_id,
      departure_time: schedule.departure_time,
      arrival_time: schedule.arrival_time,
      price: schedule.price,
      status: schedule.status === 'Active' ? 1 : 0,
      via_stop_id: schedule.via_stop_id || '[]',
    });
    setShowModal(true);
  };
  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/flight-schedules/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error deleting schedule');
      await fetchData();
      toast.success('Schedule deleted!');
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to delete schedule.');
    } finally {
      setLoading(false);
    }
  };
  // Handle status toggle
  const handleStatusToggle = async (schedule) => {
    setLoading(true);
    const newStatus = schedule.status === 'Active' ? 0 : 1;
    try {
      const response = await fetch(`${BASE_URL}/flight-schedules/${schedule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flight_id: schedule.flight_id,
          departure_airport_id: schedule.departure_airport_id,
          arrival_airport_id: schedule.arrival_airport_id,
          departure_time: schedule.departure_time,
          arrival_time: schedule.arrival_time,
          price: schedule.price,
          status: newStatus,
        }),
      });
      if (!response.ok) throw new Error('Error updating status');
      await fetchData(); // Refetch data after status update
      toast.success(`Schedule ${newStatus === 1 ? 'activated' : 'deactivated'}!`);
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to update status.');
    } finally {
      setLoading(false);
    }
  };

  // Filter schedules
  const filteredSchedules = useMemo(() => {
    return schedules.filter((schedule) => {
      const matchesDay = filterDay === 'All Days' || schedule.departure_day === filterDay;
      const matchesStatus = filterStatus === 'All' || filterStatus === schedule.status;
      const matchesSearch =
        schedule.flight_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.startAirport.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.endAirport.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesDay && matchesStatus && matchesSearch;
    });
  }, [schedules, filterDay, filterStatus, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredSchedules.length / entriesPerPage) || 1;
  const paginatedSchedules = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredSchedules.slice(start, start + entriesPerPage);
  }, [filteredSchedules, currentPage, entriesPerPage]);

  // Pagination items
  const getPaginationItems = () => {
    const items = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    if (endPage - startPage + 1 < maxButtons) startPage = Math.max(1, endPage - maxButtons + 1);
    if (startPage > 1) items.push(1);
    if (startPage > 2) items.push('...');
    for (let i = startPage; i <= endPage; i++) items.push(i);
    if (endPage < totalPages - 1) items.push('...');
    if (endPage < totalPages) items.push(totalPages);
    return items;
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Flight Schedule Management</h2>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
            value={filterDay}
            onChange={(e) => {
              setFilterDay(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            aria-label="Filter by day"
          >
            <option>All Days</option>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <option key={day}>{day}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            aria-label="Filter by status"
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm"
          onClick={() => {
            setIsEdit(false);
            setFormData({
              flight_id: '',
              departure_airport_id: '',
              arrival_airport_id: '',
              departure_time: '',
              arrival_time: '',
              price: '',
              status: 1,
            });
            setShowModal(true);
          }}
          disabled={loading}
        >
          <PlusIcon className="w-5 h-5" />
          Add Schedule
        </button>
      </div>

      {/* Table Controls */}
      <div className="bg-white rounded-xl shadow-lg mb-6">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
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
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                placeholder="Search schedules..."
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50">
                  {['S#', 'Flight', 'Airports', 'Time', 'Price', 'Stops', 'Status', 'Action'].map((header) => (
                    <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : paginatedSchedules.length ? (
                  paginatedSchedules.map((schedule, index) => (
                    <tr key={schedule.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(currentPage - 1) * entriesPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{schedule.flight_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                        <span title={`${schedule.startAirport} - ${schedule.endAirport}`}>
                          {schedule.startAirport} - {schedule.endAirport}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          title={`${
                            new Date(`1970-01-01T${schedule.departure_time}`).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          } - ${
                            new Date(`1970-01-01T${schedule.arrival_time}`).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          }`}
                        >
                          {new Date(`1970-01-01T${schedule.departure_time}`).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          -{' '}
                          {new Date(`1970-01-01T${schedule.arrival_time}`).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">INR {schedule.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-3xl">
                        <span title={schedule.stops}>{schedule.stops}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={schedule.status === 'Active'}
                          onChange={() => handleStatusToggle(schedule)}
                          disabled={loading}
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                        <button
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                          onClick={() => handleEdit(schedule)}
                          disabled={loading}
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                          onClick={() => handleDelete(schedule.id)}
                          disabled={loading}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      No schedules available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition-colors shadow-sm"
          >
            Previous
          </button>
          {getPaginationItems().map((item, index) => (
            <React.Fragment key={`page-${item}-${index}`}>
              {item === '...' ? (
                <span className="px-4 py-2 text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => setCurrentPage(item)}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === item
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50 transition-colors shadow-sm`}
                >
                  {item}
                </button>
              )}
            </React.Fragment>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || loading}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition-colors shadow-sm"
          >
            Next
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h5 className="text-xl font-semibold">{isEdit ? 'Edit Schedule' : 'Add Schedule'}</h5>
        <button
          className="text-gray-400 hover:text-gray-600 transition-colors"
          onClick={() => setShowModal(false)}
          disabled={loading}
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Flight</label>
          <select
            name="flight_id"
            value={formData.flight_id}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white shadow-sm disabled:opacity-50"
            required
            disabled={loading}
          >
            <option value="">Select a flight</option>
            {flights.map((flight) => (
              <option key={flight.id} value={flight.id}>
                {flight.flight_number}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Departure Airport</label>
          <select
            name="departure_airport_id"
            value={formData.departure_airport_id}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white shadow-sm disabled:opacity-50"
            required
            disabled={loading}
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
          <label className="block text-sm font-medium text-gray-700">Arrival Airport</label>
          <select
            name="arrival_airport_id"
            value={formData.arrival_airport_id}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white shadow-sm disabled:opacity-50"
            required
            disabled={loading}
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
                    checked={JSON.parse(formData.via_stop_id || '[]').includes(airport.id)}
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      const currentStops = JSON.parse(formData.via_stop_id || '[]');
                      let updatedStops;
                      if (checked) {
                        updatedStops = [...currentStops, Number(value)];
                      } else {
                        updatedStops = currentStops.filter((id) => id !== Number(value));
                      }
                      setFormData({
                        ...formData,
                        via_stop_id: JSON.stringify(updatedStops),
                      });
                    }}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                    disabled={loading}
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
          <label className="block text-sm font-medium text-gray-700">Departure Time</label>
          <input
            type="time"
            name="departure_time"
            value={formData.departure_time}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white shadow-sm disabled:opacity-50"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Arrival Time</label>
          <input
            type="time"
            name="arrival_time"
            value={formData.arrival_time}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white shadow-sm disabled:opacity-50"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price (INR)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white shadow-sm disabled:opacity-50"
            required
            min="0"
            step="0.01"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white shadow-sm disabled:opacity-50"
            disabled={loading}
          >
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
          disabled={loading}
        >
          {loading ? (
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
              {isEdit ? 'Update Schedule' : 'Add Schedule'}
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

export default FlightSchedulePage;

