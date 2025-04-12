"use client";

import React, { useState, useEffect, useMemo } from "react";
import BASE_URL from "@/baseUrl/baseUrl";

const pageSizeOptions = [10, 25, 50, 100];

const User = () => {
  // ----------------------- state -----------------------
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // ----------------------- fetch -----------------------
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/users`);
        if (!res.ok) throw new Error("Error fetching users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // ----------------------- derived -----------------------
  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return users.filter(
      (u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const indexOfLastUser = currentPage * pageSize;
  const indexOfFirstUser = indexOfLastUser - pageSize;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // reset page if filter or page‑size changes
  useEffect(() => setCurrentPage(1), [searchTerm, pageSize]);

  // ----------------------- helpers -----------------------
  const rangeLabel = (page, size, total) => {
    const start = (page - 1) * size + 1;
    const end = Math.min(page * size, total);
    return `${start}–${end} of ${total}`; // en‑dash
  };

  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const left = Math.max(1, currentPage - 1);
      const right = Math.min(totalPages, currentPage + 1);
      pages.push(1);
      if (left > 2) pages.push("…");
      for (let i = left; i <= right; i++) pages.push(i);
      if (right < totalPages - 1) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  };

  // ----------------------- action handlers -----------------------
  const handleShow = (id) => console.log("Show", id);
  const handleEdit = (id) => console.log("Edit", id);
  const handleDelete = (id) => console.log("Delete", id);

  // ----------------------- render -----------------------
  return (
    <div className="container mx-auto px-4 py-8">
      {/* header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search users…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n}/page
              </option>
            ))}
          </select>
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition duration-300">
            <span className="mr-2 text-lg">+</span> Add New User
          </button>
        </div>
      </div>

      {/* error */}
      {error && (
        <div className="bg-red-100 text-red-800 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
      )}

      {/* table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto ">
          <table className="min-w-full">
            <thead className="bg-blue-600 sticky top-0">
              <tr>
                <th className="py-3 px-6 text-left text-white font-semibold">#</th>
                <th className="py-3 px-6 text-left text-white font-semibold">Name</th>
                <th className="py-3 px-6 text-left text-white font-semibold">Email</th>
                <th className="py-3 px-6 text-left text-white font-semibold">Role</th>
                <th className="py-3 px-6 text-left text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // skeleton rows
                Array.from({ length: pageSize }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-6 bg-gray-100">&nbsp;</td>
                    <td className="py-4 px-6 bg-gray-100">&nbsp;</td>
                    <td className="py-4 px-6 bg-gray-100">&nbsp;</td>
                    <td className="py-4 px-6 bg-gray-100">&nbsp;</td>
                    <td className="py-4 px-6 bg-gray-100">&nbsp;</td>
                  </tr>
                ))
              ) : currentUsers.length ? (
                currentUsers.map((user, idx) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50 transition duration-200">
                    <td className="py-4 px-6 text-gray-700">{idx + 1 + indexOfFirstUser}</td>
                    <td className="py-4 px-6 text-gray-700">{user.name}</td>
                    <td className="py-4 px-6 text-gray-700">{user.email}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          user.role === 1 ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role === 1 ? "Super Admin" : "User"}
                      </span>
                    </td>
                    <td className="py-4 px-6 flex gap-3">
                      <button
                        onClick={() => handleShow(user.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        title="Edit User"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                        title="Delete User"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 px-6 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        {filteredUsers.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
            <span className="text-sm text-gray-600">
              {rangeLabel(currentPage, pageSize, filteredUsers.length)}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded-md ${
                  currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-gray-100"
                }`}
              >
                Prev
              </button>
              {getPages().map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className="px-2">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`px-3 py-1 border rounded-md ${
                      currentPage === p ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded-md ${
                  currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-gray-100"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;
