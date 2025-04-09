"use client";
import BASE_URL from "@/baseUrl/baseUrl";
import React, { useState, useEffect } from "react";

const AddAirport = () => {
  const [city, setCity] = useState("");
  const [airportCode, setAirportCode] = useState("");
  const [airportName, setAirportName] = useState("");
  const [airports, setAirports] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/airport`)
      .then((res) => res.json())
      .then((data) => setAirports(data))
      .catch((error) => console.error("Error fetching airports:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const airportData = { city, airport_code: airportCode, airport_name: airportName };

    if (editMode) {
      fetch(`${BASE_URL}/airport/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(airportData),
      })
        .then((response) => response.json())
        .then(() => {
          setEditMode(false);
          setCity("");
          setAirportCode("");
          setAirportName("");
          setAirports((prevAirports) =>
            prevAirports.map((airport) =>
              airport.id === editId ? { ...airport, ...airportData } : airport
            )
          );
        })
        .catch((error) => console.error("Error updating airport:", error));
    } else {
      fetch(`${BASE_URL}/airport`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(airportData),
      })
        .then((response) => response.json())
        .then((newAirport) => {
          setAirports([...airports, { ...airportData, id: newAirport.id }]);
          setCity("");
          setAirportCode("");
          setAirportName("");
        })
        .catch((error) => console.error("Error adding airport:", error));
    }
  };

  const handleEdit = (airport) => {
    setCity(airport.city);
    setAirportCode(airport.airport_code);
    setAirportName(airport.airport_name);
    setEditMode(true);
    setEditId(airport.id);
  };

  const handleDelete = (id) => {
    fetch(`${BASE_URL}/airport/${id}`, { method: "DELETE" })
      .then((response) => response.json())
      .then(() => {
        setAirports(airports.filter((airport) => airport.id !== id));
      })
      .catch((error) => console.error("Error deleting airport:", error));
  };

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {editMode ? "Edit Airport" : "Add Airport"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter city name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Airport Code</label>
            <input
              type="text"
              value={airportCode}
              onChange={(e) => setAirportCode(e.target.value)}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., JFK"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Airport Name</label>
            <input
              type="text"
              value={airportName}
              onChange={(e) => setAirportName(e.target.value)}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter airport name"
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              editMode ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"
            } transition`}
          >
            {editMode ? "Update Airport" : "Add Airport"}
          </button>
        </form>
      </div>

      {/* Airport List Section */}
      {airports.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Airport List</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-left">
                  <th className="p-3">City</th>
                  <th className="p-3">Code</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {airports.map((airport) => (
                  <tr key={airport.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{airport.city}</td>
                    <td className="p-3">{airport.airport_code}</td>
                    <td className="p-3">{airport.airport_name}</td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => handleEdit(airport)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(airport.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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
      )}
    </div>
  );
};

export default AddAirport;