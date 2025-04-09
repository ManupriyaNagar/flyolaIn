'use client';

import BASE_URL from '@/baseUrl/baseUrl';
import React, { useState, useEffect } from 'react';

const FlightsPage = () => {
  // State for flights data (keeping all the previous state and functions unchanged)
  const [flights, setFlights] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentFlight, setCurrentFlight] = useState(null);
  const [formData, setFormData] = useState({
    flight_number: '',
    departure_day: 'Monday',
    seat_limit: 6,
    status: 1,
  });



  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await fetch(`${BASE_URL}/flights`);
      const data = await response.json();
      setFlights(data);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `${BASE_URL}/flights/${currentFlight.id}` : `${BASE_URL}/flights`;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchFlights();
        setShowModal(false);
        setFormData({ flight_number: '', departure_day: 'Monday', seat_limit: 6, status: 1 });
        setIsEdit(false);
      } else {
        console.error('Error saving flight');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this flight?')) {
      try {
        const response = await fetch(`${BASE_URL}/flights/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchFlights();
        } else {
          console.error('Error deleting flight');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleEdit = (flight) => {
    setIsEdit(true);
    setCurrentFlight(flight);
    setFormData({
      flight_number: flight.flight_number,
      departure_day: flight.departure_day,
      seat_limit: flight.seat_limit,
      status: flight.status,
    });
    setShowModal(true);
  };

  const handleStatusToggle = async (flight) => {
    const updatedFlight = { ...flight, status: flight.status === 1 ? 0 : 1 };
    try {
      const response = await fetch(`${BASE_URL}/flights/${flight.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFlight),
      });
      if (response.ok) {
        fetchFlights();
      } else {
        console.error('Error updating status');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 mt-4">
      {/* Filters */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <select className="border rounded p-2">
            <option>ALL DAYS</option>
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
            <option>Saturday</option>
            <option>Sunday</option>
          </select>
          <select className="border rounded p-2">
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => {
            setIsEdit(false);
            setFormData({ flight_number: '', departure_day: 'Monday', seat_limit: 6, status: 1 });
            setShowModal(true);
          }}
        >
          + Add Flights
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              Show
              <select className="border rounded p-2 mx-2 inline-block">
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
              entries
            </div>
            <div>
              Search: <input type="text" className="border rounded p-2 inline-block w-64" />
            </div>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">S#</th>
                <th className="border p-2">Number</th>
                <th className="border p-2">Day</th>
                <th className="border p-2">Seat Limit</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight, index) => (
                <tr key={flight.id} className="hover:bg-gray-50">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{flight.flight_number}</td>
                  <td className="border p-2">{flight.departure_day}</td>
                  <td className="border p-2">{flight.seat_limit}</td>
                  <td className="border p-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600"
                        checked={flight.status === 1}
                        onChange={() => handleStatusToggle(flight)}
                      />
                    </div>
                  </td>
                  <td className="border p-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                      onClick={() => handleEdit(flight)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDelete(flight.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit Flight */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-xl font-semibold">
                {isEdit ? 'Edit Flight' : 'Add New Flight'}
              </h5>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="flight_number" className="block mb-1">
                    Flight Number
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded p-2"
                    id="flight_number"
                    name="flight_number"
                    value={formData.flight_number}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="departure_day" className="block mb-1">
                    Choose Day
                  </label>
                  <select
                    className="w-full border rounded p-2"
                    id="departure_day"
                    name="departure_day"
                    value={formData.departure_day}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="seat_limit" className="block mb-1">
                    Seat Limit
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded p-2"
                    id="seat_limit"
                    name="seat_limit"
                    value={formData.seat_limit}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block mb-1">
                    Status
                  </label>
                  <select
                    className="w-full border rounded p-2"
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  {isEdit ? 'Update Flight' : 'Add Flight'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightsPage;