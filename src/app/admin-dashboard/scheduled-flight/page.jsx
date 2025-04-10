'use client';

import BASE_URL from '@/baseUrl/baseUrl';
import React, { useState, useEffect } from 'react';

const FlightSchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [filterDay, setFilterDay] = useState('All Days');
  const [filterStatus, setFilterStatus] = useState('Active');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [flightsResponse, schedulesResponse] = await Promise.all([
        fetch(`${BASE_URL}/flights`),
        fetch(`${BASE_URL}/flight-schedules`),
      ]);

      if (!flightsResponse.ok || !schedulesResponse.ok) {
        throw new Error('Failed to fetch data from one or more endpoints');
      }

      const flights = await flightsResponse.json();
      const schedules = await schedulesResponse.json();

      const combinedData = schedules.map(schedule => {
        const flight = flights.find(f => f.id === schedule.flight_id) || {};
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

  // Bulk activate all schedules
// Bulk activate all schedules
const activateAllSchedules = async () => {
  if (confirm('Are you sure you want to activate all schedules?')) {
    try {
      const response = await fetch(`${BASE_URL}/flight-schedules/activate-all`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) fetchData();
    } catch (error) {
      console.error('Error activating all schedules:', error);
    }
  }
};

// Bulk edit all schedules
const editAllSchedules = async () => {
  const newPrice = prompt('Enter new price for all schedules:');
  if (newPrice && !isNaN(newPrice)) {
    try {
      const response = await fetch(`${BASE_URL}/flight-schedules/edit-all`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: parseFloat(newPrice) }),
      });
      if (response.ok) fetchData();
    } catch (error) {
      console.error('Error editing all schedules:', error);
    }
  }
};

// Bulk delete all schedules
const deleteAllSchedules = async () => {
  if (confirm('Are you sure you want to delete all schedules?')) {
    try {
      const response = await fetch(`${BASE_URL}/flight-schedules/delete-all`, {
        method: 'DELETE',
      });
      if (response.ok) fetchData();
    } catch (error) {
      console.error('Error deleting all schedules:', error);
    }
  }
};

  const filteredSchedules = schedules.filter(schedule => {
    const matchesDay = filterDay === 'All Days' || schedule.departure_day === filterDay;
    const matchesStatus = filterStatus === 'All' || 
      (filterStatus === 'Active' && schedule.status === 'Active') || 
      (filterStatus === 'Inactive' && schedule.status === 'Inactive');
    const matchesSearch = schedule.flight_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.startAirport.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.endAirport.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDay && matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredSchedules.length / entriesPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const paginatedSchedules = filteredSchedules.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex space-x-4">
          <select
            className="border rounded p-2"
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
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
            onChange={(e) => setFilterStatus(e.target.value)}
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
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            + Add Schedule
          </button>
        </div>
      </div>
      {/* Rest of the component remains the same */}
      <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-2">
          <span>Show</span>
          <select
            className="border rounded p-2"
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
          >
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
          <span>entries</span>
        </div>
        <div>
          <span>Search:</span>
          <input
            type="text"
            className="border rounded p-2 ml-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
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
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600"
                      checked={schedule.status === 'Active'}
                      readOnly
                    />
                  </div>
                </td>
                <td className="p-2 border-b">{schedule.date}</td>
                <td className="p-2 border-b">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600">
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
      <div className="flex justify-between items-center mt-4">
        <span>
          Showing {(currentPage - 1) * entriesPerPage + 1} to{' '}
          {Math.min(currentPage * entriesPerPage, filteredSchedules.length)} of {filteredSchedules.length} entries
        </span>
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightSchedulePage;