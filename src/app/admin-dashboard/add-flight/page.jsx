'use client';

import BASE_URL from '@/baseUrl/baseUrl';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CheckCircleIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { debounce } from 'lodash';

const ENTRIES_PER_PAGE = [10, 25, 50, 100];

const FlightsPage = () => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [dayFilter, setDayFilter] = useState('ALL DAYS');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // Fetch flights
  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/flights`);
      if (!response.ok) throw new Error('Failed to fetch flights');
      const data = await response.json();
      setFlights(data);
    } catch (error) {
      console.error('Error fetching flights:', error);
      toast.error('Failed to load flights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
    setFormData({ ...formData, [name]: name === 'seat_limit' ? Number(value) : value });
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
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchFlights();
        setShowModal(false);
        setFormData({ flight_number: '', departure_day: 'Monday', seat_limit: 6, status: 1 });
        setIsEdit(false);
        toast.success(isEdit ? 'Flight updated successfully!' : 'Flight added successfully!');
      } else {
        throw new Error('Error saving flight');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save flight. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    setConfirmAction({
      fn: async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${BASE_URL}/flights/${id}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            await fetchFlights();
            toast.success('Flight deleted successfully!');
          } else {
            throw new Error('Error deleting flight');
          }
        } catch (error) {
          console.error('Error:', error);
          toast.error('Failed to delete flight.');
        } finally {
          setIsLoading(false);
        }
      },
      message: 'Are you sure you want to delete this flight?',
    });
    setShowConfirmModal(true);
  };

  // Handle edit
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
        await fetchFlights();
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

  // Bulk activate all flights
  const activateAllFlights = async () => {
    setConfirmAction({
      fn: async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${BASE_URL}/flights/activate-all`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
          });
          if (response.ok) {
            await fetchFlights();
            toast.success('All flights activated!');
          } else {
            throw new Error('Error activating flights');
          }
        } catch (error) {
          console.error('Error activating all flights:', error);
          toast.error('Failed to activate all flights.');
        } finally {
          setIsLoading(false);
        }
      },
      message: 'Are you sure you want to activate all flights?',
    });
    setShowConfirmModal(true);
  };

  // Bulk edit all flights
  const editAllFlights = async () => {
    const newSeatLimit = prompt('Enter new seat limit for all flights:');
    if (newSeatLimit && !isNaN(newSeatLimit)) {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/flights/edit-all`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seat_limit: parseInt(newSeatLimit) }),
        });
        if (response.ok) {
          await fetchFlights();
          toast.success('All flights updated!');
        } else {
          throw new Error('Error editing flights');
        }
      } catch (error) {
        console.error('Error editing all flights:', error);
        toast.error('Failed to edit all flights.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Bulk delete all flights
  const deleteAllFlights = async () => {
    setConfirmAction({
      fn: async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${BASE_URL}/flights/delete-all`, {
            method: 'DELETE',
          });
          if (response.ok) {
            await fetchFlights();
            toast.success('All flights deleted!');
          } else {
            throw new Error('Error deleting flights');
          }
        } catch (error) {
          console.error('Error deleting all flights:', error);
          toast.error('Failed to delete all flights.');
        } finally {
          setIsLoading(false);
        }
      },
      message: 'Are you sure you want to delete all flights?',
    });
    setShowConfirmModal(true);
  };

  // Filtered and paginated flights
  const filteredFlights = useMemo(() => {
    return flights.filter((flight) => {
      const matchesSearch = flight.flight_number
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesDay =
        dayFilter === 'ALL DAYS' || flight.departure_day === dayFilter;
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

  // Pagination items with ellipsis
  const getPaginationItems = () => {
    const items = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    if (startPage > 1) {
      items.push(1);
      if (startPage > 2) items.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }

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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            aria-label="Filter by day"
          >
            <option>ALL DAYS</option>
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
            <option>Saturday</option>
            <option>Sunday</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            aria-label="Filter by status"
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm disabled:opacity-50"
            onClick={activateAllFlights}
            disabled={isLoading}
            aria-label="Activate all flights"
          >
            <CheckCircleIcon className="w-5 h-5" />
            Activate All
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm disabled:opacity-50"
            onClick={editAllFlights}
            disabled={isLoading}
            aria-label="Edit all flights"
          >
            <PencilIcon className="w-5 h-5" />
            Edit All
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-sm disabled:opacity-50"
            onClick={deleteAllFlights}
            disabled={isLoading}
            aria-label="Delete all flights"
          >
            <TrashIcon className="w-5 h-5" />
            Delete All
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm disabled:opacity-50"
            onClick={() => {
              setIsEdit(false);
              setFormData({
                flight_number: '',
                departure_day: 'Monday',
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
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
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                placeholder="Search flights..."
                aria-label="Search flights"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              {searchTerm && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  aria-label="Clear search"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['S#', 'Number', 'Day', 'Seat Limit', 'Status', 'Action'].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <svg
                          className="animate-spin h-6 w-6 text-blue-500"
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
                        <span className="text-gray-500">Loading flights...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedFlights.length ? (
                  paginatedFlights.map((flight, index) => (
                    <tr
                      key={flight.id}
                      className="hover:bg-gray-50 transition-colors duration-100"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {(currentPage - 1) * entries + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {flight.flight_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {flight.departure_day}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {flight.seat_limit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                          checked={flight.status === 1}
                          onChange={() => handleStatusToggle(flight)}
                          disabled={isLoading}
                          aria-label={`Toggle status for flight ${flight.flight_number}`}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                        <button
                          className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
                          onClick={() => handleEdit(flight)}
                          disabled={isLoading}
                          aria-label={`Edit flight ${flight.flight_number}`}
                        >
                          <PencilIcon className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50"
                          onClick={() => handleDelete(flight.id)}
                          disabled={isLoading}
                          aria-label={`Delete flight ${flight.flight_number}`}
                        >
                          <TrashIcon className="w-4 h-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      {searchTerm || dayFilter !== 'ALL DAYS' || statusFilter !== 'All'
                        ? 'No flights match your filters.'
                        : 'No flights available.'}
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
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isLoading}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              currentPage === 1 || isLoading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label="Previous page"
          >
            Previous
          </button>
          {getPaginationItems().map((item, index) =>
            item === '...' ? (
              <span
                key={`ellipsis-${index}`}
                className="px-4 py-2 text-gray-500"
              >
                ...
              </span>
            ) : (
              <button
                key={item}
                onClick={() => setCurrentPage(item)}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === item
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label={`Page ${item}`}
              >
                {item}
              </button>
            )
          )}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isLoading}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              currentPage === totalPages || isLoading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-red-900 bg-opacity-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h5
                id="modal-title"
                className="text-xl font-semibold text-gray-900"
              >
                {isEdit ? 'Edit Flight' : 'Add New Flight'}
              </h5>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowModal(false)}
                disabled={isLoading}
                aria-label="Close modal"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="flight_number"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Flight Number
                </label>
                <input
                  type="text"
                  id="flight_number"
                  name="flight_number"
                  value={formData.flight_number}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm disabled:opacity-50"
                  required
                  disabled={isLoading}
                  aria-required="true"
                />
              </div>
              <div>
                <label
                  htmlFor="departure_day"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Departure Day
                </label>
                <select
                  id="departure_day"
                  name="departure_day"
                  value={formData.departure_day}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm disabled:opacity-50"
                  required
                  disabled={isLoading}
                  aria-required="true"
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
                <label
                  htmlFor="seat_limit"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Seat Limit
                </label>
                <input
                  type="number"
                  id="seat_limit"
                  name="seat_limit"
                  value={formData.seat_limit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm disabled:opacity-50"
                  required
                  min="1"
                  disabled={isLoading}
                  aria-required="true"
                />
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm disabled:opacity-50"
                  disabled={isLoading}
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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

      {/* Confirmation Modal */}
      <Transition show={showConfirmModal} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowConfirmModal(false)}
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
                  Confirm Action
                </Dialog.Title>
                <p className="text-gray-600 mb-6">
                  {confirmAction?.message || 'Are you sure?'}
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
                    onClick={() => setShowConfirmModal(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50"
                    onClick={async () => {
                      await confirmAction?.fn();
                      setShowConfirmModal(false);
                    }}
                    disabled={isLoading}
                  >
                    Confirm
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default FlightsPage;