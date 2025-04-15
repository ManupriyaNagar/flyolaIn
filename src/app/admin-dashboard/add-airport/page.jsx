"use client";

import BASE_URL from "@/baseUrl/baseUrl";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { debounce } from "lodash";

const AddAirport = () => {
  const [city, setCity] = useState("");
  const [airportCode, setAirportCode] = useState("");
  const [airportName, setAirportName] = useState("");
  const [airports, setAirports] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch airports
  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/airport`);
      if (!response.ok) throw new Error("Failed to fetch airports");
      const data = await response.json();
      console.log("Fetched airports:", data);
      const validAirports = data.filter((airport) => airport.id);
      setAirports(validAirports);
    } catch (err) {
      console.error("Error fetching airports:", err);
      setError("Failed to load airports. Please try again.");
      toast.error("Failed to load airports.");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city || !airportCode || !airportName) {
      toast.error("All fields are required.");
      return;
    }
    if (airportCode.length !== 3) {
      toast.error("Airport code must be exactly 3 characters.");
      return;
    }

    setLoading(true);
    const airportData = { city, airport_code: airportCode, airport_name: airportName };

    try {
      if (editMode) {
        const response = await fetch(`${BASE_URL}/airport/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(airportData),
        });
        if (!response.ok) throw new Error("Failed to update airport");
        const updatedAirport = await response.json();
        setAirports((prev) =>
          prev.map((airport) =>
            airport.id === editId ? { ...airport, ...airportData, id: editId } : airport
          )
        );
        toast.success("Airport updated successfully!");
      } else {
        const response = await fetch(`${BASE_URL}/airport`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(airportData),
        });
        if (!response.ok) throw new Error("Failed to add airport");
        const newAirport = await response.json();
        setAirports((prev) => [
          ...prev,
          { ...airportData, id: newAirport.id || Date.now() },
        ]);
        toast.success("Airport added successfully!");
      }
      // Reset form
      setCity("");
      setAirportCode("");
      setAirportName("");
      setEditMode(false);
      setEditId(null);
    } catch (err) {
      console.error("Error saving airport:", err);
      toast.error(editMode ? "Failed to update airport." : "Failed to add airport.");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (airport) => {
    setCity(airport.city || "");
    setAirportCode(airport.airport_code || "");
    setAirportName(airport.airport_name || "");
    setEditMode(true);
    setEditId(airport.id);
  };

  // Handle delete
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/airport/${deleteId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete airport");
      setAirports((prev) => prev.filter((airport) => airport.id !== deleteId));
      toast.success("Airport deleted successfully!");
    } catch (err) {
      console.error("Error deleting airport:", err);
      toast.error("Failed to delete airport.");
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
      setDeleteId(null);
    }
  };

  // Filtered airports
  const filteredAirports = useMemo(() => {
    return airports.filter((airport) =>
      [
        airport.city,
        airport.airport_code,
        airport.airport_name,
      ].some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [airports, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Airport Management</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}

      {/* Add/Edit Form */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          {editMode ? "Edit Airport" : "Add New Airport"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              City
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm disabled:opacity-50"
              placeholder="Enter city name"
              required
              disabled={loading}
              aria-required="true"
            />
          </div>
          <div>
            <label
              htmlFor="airport_code"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Airport Code
            </label>
            <input
              id="airport_code"
              type="text"
              value={airportCode}
              onChange={(e) => setAirportCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm disabled:opacity-50"
              placeholder="e.g., JFK"
              required
              maxLength={3}
              disabled={loading}
              aria-required="true"
            />
          </div>
          <div>
            <label
              htmlFor="airport_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Airport Name
            </label>
            <input
              id="airport_name"
              type="text"
              value={airportName}
              onChange={(e) => setAirportName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm disabled:opacity-50"
              placeholder="Enter airport name"
              required
              disabled={loading}
              aria-required="true"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition-all duration-200 shadow-sm disabled:opacity-50 ${
                editMode
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              disabled={loading}
            >
              {loading ? (
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
                  {editMode ? "Update Airport" : "Add Airport"}
                </>
              )}
            </button>
            {(editMode || city || airportCode || airportName) && (
              <button
                type="button"
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 shadow-sm disabled:opacity-50"
                onClick={() => {
                  setCity("");
                  setAirportCode("");
                  setAirportName("");
                  setEditMode(false);
                  setEditId(null);
                }}
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Airport List */}
      {airports.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Airport List</h3>

          {/* Search Bar */}
          <div className="relative mb-6 w-full sm:w-64">
            <input
              type="text"
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm disabled:opacity-50"
              placeholder="Search airports..."
              disabled={loading}
              aria-label="Search airports"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            {searchTerm && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchTerm("")}
                disabled={loading}
                aria-label="Clear search"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <svg
                  className="animate-spin h-6 w-6 text-indigo-500"
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
                <span className="ml-2 text-gray-500">Loading airports...</span>
              </div>
            ) : filteredAirports.length ? (
              filteredAirports.map((airport) => (
                <div
                  key={airport.id}
                  className="p-4 bg-white rounded-lg shadow border border-gray-100"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">City:</span>
                    <span>{airport.city || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Code:</span>
                    <span>{airport.airport_code || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Name:</span>
                    <span>{airport.airport_name || "N/A"}</span>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      className="flex items-center gap-2 px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200 disabled:opacity-50"
                      onClick={() => handleEdit(airport)}
                      disabled={loading}
                      aria-label={`Edit airport ${airport.airport_code}`}
                    >
                      <PencilIcon className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 disabled:opacity-50"
                      onClick={() => {
                        setDeleteId(airport.id);
                        setShowConfirmModal(true);
                      }}
                      disabled={loading}
                      aria-label={`Delete airport ${airport.airport_code}`}
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? "No airports match your search." : "No airports available."}
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {["City", "Code", "Name", "Actions"].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <svg
                          className="animate-spin h-6 w-6 text-indigo-500"
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
                        <span className="text-gray-500">Loading airports...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredAirports.length ? (
                  filteredAirports.map((airport) => (
                    <tr
                      key={airport.id}
                      className="hover:bg-gray-50 transition-colors duration-100"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {airport.city || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {airport.airport_code || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {airport.airport_name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                        <button
                          className="flex items-center gap-2 px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200 disabled:opacity-50"
                          onClick={() => handleEdit(airport)}
                          disabled={loading}
                          aria-label={`Edit airport ${airport.airport_code}`}
                        >
                          <PencilIcon className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 disabled:opacity-50"
                          onClick={() => {
                            setDeleteId(airport.id);
                            setShowConfirmModal(true);
                          }}
                          disabled={loading}
                          aria-label={`Delete airport ${airport.airport_code}`}
                        >
                          <TrashIcon className="w-4 h-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      {searchTerm ? "No airports match your search." : "No airports available."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
                  Confirm Delete
                </Dialog.Title>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this airport?
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 disabled:opacity-50"
                    onClick={() => setShowConfirmModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50"
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    Delete
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

export default AddAirport;