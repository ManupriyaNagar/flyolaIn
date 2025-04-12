'use client';

import BASE_URL from '@/baseUrl/baseUrl';
import React, { useState, useEffect, useMemo } from 'react';

// Helper components for modals can be extracted out later for reusability.
const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close modal">×</button>
      </div>
      {children}
    </div>
  </div>
);

const FlightSchedulePage = () => {
  // State declarations
  const [schedules, setSchedules] = useState([]);
  const [flights, setFlights] = useState([]);
  const [filterDay, setFilterDay] = useState('All Days');
  const [filterStatus, setFilterStatus] = useState('Active');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state for add/edit schedule
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [formData, setFormData] = useState({
    flight_id: '',
    departure_time: '',
    arrival_time: '',
    price: '',
    status: 1,
  });

  // Modal state for bulk editing schedules
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [bulkPrice, setBulkPrice] = useState('');

  // Fetch flights and schedules on first render
  useEffect(() => {
    fetchData();
  }, []);

  // Function to fetch both flights and flight schedules from the API
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch flights and schedules concurrently
      const [flightsRes, schedulesRes] = await Promise.all([
        fetch(`${BASE_URL}/flights`),
        fetch(`${BASE_URL}/flight-schedules`),
      ]);

      if (!flightsRes.ok || !schedulesRes.ok) {
        throw new Error('Failed to fetch data from one or more endpoints');
      }

      const flightsData = await flightsRes.json();
      const schedulesData = await schedulesRes.json();

      // Save flights to state for use in add/edit dropdown
      setFlights(flightsData);

      // Combine schedule data with flight information
      const combinedData = schedulesData.map(schedule => {
        // Find the flight details using flight_id from schedule
        const flight = flightsData.find(f => f.id === schedule.flight_id) || {};

        // Determine the stops information; adjust your logic if needed
        const stops = flight.airport_stop_ids && flight.airport_stop_ids.length > 2 
          ? 'REW, JABALPUR' 
          : 'Direct';

        return {
          ...schedule,
          flight_number: flight.flight_number || 'N/A',
          departure_day: flight.departure_day || 'N/A',
          startAirport: flight.start_airport_id ? `Airport ${flight.start_airport_id}` : 'N/A',
          endAirport: flight.end_airport_id ? `Airport ${flight.end_airport_id}` : 'N/A',
          price: schedule.price || 'N/A',
          stops: stops,
          status: schedule.status === 1 ? 'Active' : 'Inactive',
          date: schedule.updated_at ? new Date(schedule.updated_at).toLocaleDateString('en-GB') : 'N/A',
          departure_time: schedule.departure_time || 'N/A',
          arrival_time: schedule.arrival_time || 'N/A',
        };
      });

      setSchedules(combinedData);
    } catch (err) {
      console.error('Error fetching data:', err.message);
      setError('Failed to load data. Please check the server or try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes for add/edit modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // If numeric fields, convert the value to a number
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'status' ? Number(value) : value,
    }));
  };

  // Handle form submission for adding or editing a schedule
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit 
      ? `${BASE_URL}/flight-schedules/${currentSchedule.id}` 
      : `${BASE_URL}/flight-schedules`;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error saving schedule');
      // Refresh the schedules list
      await fetchData();
      setShowModal(false);
      setIsEdit(false);
      setFormData({
        flight_id: '',
        departure_time: '',
        arrival_time: '',
        price: '',
        status: 1,
      });
    } catch (err) {
      console.error('Error:', err.message);
      alert('Failed to save schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Prepare to edit a specific schedule
  const handleEdit = (schedule) => {
    setIsEdit(true);
    setCurrentSchedule(schedule);
    setFormData({
      flight_id: schedule.flight_id,
      departure_time: schedule.departure_time,
      arrival_time: schedule.arrival_time,
      price: schedule.price,
      status: schedule.status === 'Active' ? 1 : 0,
    });
    setShowModal(true);
  };

  // Bulk actions
  const activateAllSchedules = async () => {
    if (!window.confirm('Are you sure you want to activate all schedules?')) return;
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/flight-schedules/activate-all`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Bulk activation failed');
      await fetchData();
    } catch (err) {
      console.error('Error activating all schedules:', err.message);
      alert('Error activating all schedules.');
    } finally {
      setLoading(false);
    }
  };

  // Bulk edit: update price for all schedules
  const editAllSchedules = async () => {
    // Open bulk edit modal which asks for a new price value
    setShowBulkEditModal(true);
  };

  const handleBulkEditSubmit = async (e) => {
    e.preventDefault();
    if (!bulkPrice || isNaN(bulkPrice)) {
      alert('Please enter a valid numeric price.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/flight-schedules/edit-all`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: parseFloat(bulkPrice) }),
      });
      if (!response.ok) throw new Error('Bulk edit failed');
      await fetchData();
      setShowBulkEditModal(false);
      setBulkPrice('');
    } catch (err) {
      console.error('Error editing all schedules:', err.message);
      alert('Error editing all schedules.');
    } finally {
      setLoading(false);
    }
  };

  // Bulk deletion of schedules
  const deleteAllSchedules = async () => {
    if (!window.confirm('Are you sure you want to delete all schedules?')) return;
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/flight-schedules/delete-all`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Bulk delete failed');
      await fetchData();
    } catch (err) {
      console.error('Error deleting all schedules:', err.message);
      alert('Error deleting all schedules.');
    } finally {
      setLoading(false);
    }
  };

  // Filter schedules based on day, status and search term using useMemo for performance
  const filteredSchedules = useMemo(() => {
    return schedules.filter(schedule => {
      const matchesDay = filterDay === 'All Days' || schedule.departure_day === filterDay;
      const matchesStatus = filterStatus === 'All' ||
        (filterStatus === 'Active' && schedule.status === 'Active') ||
        (filterStatus === 'Inactive' && schedule.status === 'Inactive');
      const matchesSearch = schedule.flight_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.startAirport.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.endAirport.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesDay && matchesStatus && matchesSearch;
    });
  }, [schedules, filterDay, filterStatus, searchTerm]);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredSchedules.length / entriesPerPage);

  // Slice the filtered schedules based on the current page (zero-index math)
  const paginatedSchedules = filteredSchedules.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  // --- Render ---

  // Show loading or error before rendering the main content
  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      {/* Header with Filters & Bulk Action Buttons */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex space-x-4">
          <select
            className="border rounded p-2"
            value={filterDay}
            onChange={(e) => {
              setFilterDay(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option>All Days</option>
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
            <option>Saturday</option>
            <option>Sunday</option>
          </select>
          <select
            className="border rounded p-2"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option>Active</option>
            <option>Inactive</option>
            <option>All</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={activateAllSchedules}>
            Activate All
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={editAllSchedules}>
            Edit All
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={deleteAllSchedules}>
            Delete All
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => {
              // Prepare for adding a new schedule
              setIsEdit(false);
              setFormData({
                flight_id: '',
                departure_time: '',
                arrival_time: '',
                price: '',
                status: 1,
              });
              setShowModal(true);
            }}
          >
            + Add Schedule
          </button>
        </div>
      </div>

      {/* Controls for Pagination & Search */}
      <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-2">
          <span>Show</span>
          <select
            className="border rounded p-2"
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
          <span>entries</span>
        </div>
        <div>
          <span>Search: </span>
          <input
            type="text"
            className="border rounded p-2 ml-2"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Flight Schedules Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border-b">S#</th>
              <th className="p-2 border-b">Flight</th>
              <th className="p-2 border-b">Airport</th>
              <th className="p-2 border-b">Time</th>
              <th className="p-2 border-b">Price</th>
              <th className="p-2 border-b">Stops</th>
              <th className="p-2 border-b">Status</th>
              <th className="p-2 border-b">Date</th>
              <th className="p-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSchedules.map((schedule, index) => (
              <tr key={schedule.id} className="hover:bg-gray-50">
                <td className="p-2 border-b">{(currentPage - 1) * entriesPerPage + index + 1}</td>
                <td className="p-2 border-b">{schedule.flight_number}</td>
                <td className="p-2 border-b">
                  {schedule.startAirport} - {schedule.endAirport}
                </td>
                <td className="p-2 border-b">
                  {new Date(`1970-01-01T${schedule.departure_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                  {new Date(`1970-01-01T${schedule.arrival_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="p-2 border-b">INR {schedule.price}</td>
                <td className="p-2 border-b">{schedule.stops}</td>
                <td className="p-2 border-b">
                  <input type="checkbox" checked={schedule.status === 'Active'} readOnly className="form-checkbox h-5 w-5 text-blue-600" />
                </td>
                <td className="p-2 border-b">{schedule.date}</td>
                <td className="p-2 border-b">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                    onClick={() => handleEdit(schedule)}
                  >
                    ✏️
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <span>
          Showing {(currentPage - 1) * entriesPerPage + 1} to {Math.min(currentPage * entriesPerPage, filteredSchedules.length)} of {filteredSchedules.length} entries
        </span>
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal for Add/Edit Schedule */}
      {showModal && (
        <Modal title={isEdit ? 'Edit Schedule' : 'Add New Schedule'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="flight_id" className="block text-sm font-medium mb-1">Flight</label>
              <select
                id="flight_id"
                name="flight_id"
                value={formData.flight_id}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Select a flight</option>
                {flights.map(flight => (
                  <option key={flight.id} value={flight.id}>{flight.flight_number}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="departure_time" className="block text-sm font-medium mb-1">Departure Time</label>
              <input
                type="time"
                id="departure_time"
                name="departure_time"
                value={formData.departure_time}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label htmlFor="arrival_time" className="block text-sm font-medium mb-1">Arrival Time</label>
              <input
                type="time"
                id="arrival_time"
                name="arrival_time"
                value={formData.arrival_time}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-1">Price (INR)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              {isEdit ? 'Update Schedule' : 'Add Schedule'}
            </button>
          </form>
        </Modal>
      )}

      {/* Modal for Bulk Editing (Price Update) */}
      {showBulkEditModal && (
        <Modal title="Edit All Schedules" onClose={() => setShowBulkEditModal(false)}>
          <form onSubmit={handleBulkEditSubmit} className="space-y-4">
            <div>
              <label htmlFor="bulkPrice" className="block text-sm font-medium mb-1">New Price for All Schedules (INR)</label>
              <input
                type="number"
                id="bulkPrice"
                value={bulkPrice}
                onChange={(e) => setBulkPrice(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
                min="0"
                step="0.01"
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              Update Prices
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default FlightSchedulePage;
