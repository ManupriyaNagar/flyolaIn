"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "@/baseUrl/baseUrl";
import {
  MagnifyingGlassIcon,
  UsersIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  ExclamationTriangleIcon,
  ArrowsUpDownIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { debounce } from "lodash";

const pageSizeOptions = [10, 25, 50, 100];

const getInitials = (name = "") => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const AllUsersPage = () => {
  const { authState } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Redirect if not admin
  useEffect(() => {
    if (!authState.isLoading && (!authState.isLoggedIn || authState.userRole !== "1")) {
      router.push("/sign-in");
    }
  }, [authState.isLoading, authState.isLoggedIn, authState.userRole, router]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  // Fetch users
  useEffect(() => {
    if (authState.isLoading || !authState.isLoggedIn || authState.userRole !== "1") return;

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token") || authState.token || "";
        if (!token) {
          throw new Error("No authentication token found. Please log in again.");
        }

        console.log("[AllUsersPage] Fetching users with token:", token ? "present" : "missing");
        console.log("[AllUsersPage] Request URL:", `${BASE_URL}/users/all`);
        
        const res = await fetch(`${BASE_URL}/users/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log("[AllUsersPage] Response status:", res.status);
        
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Authentication failed. Please log in again.");
          } else if (res.status === 403) {
            throw new Error("Access denied. Admin privileges required.");
          } else if (res.status === 404) {
            throw new Error("Users endpoint not found.");
          } else {
            throw new Error(`Server error: ${res.status} ${res.statusText}`);
          }
        }
        
        const data = await res.json();
        console.log("[AllUsersPage] Users data received:", data);
        
        setUsers(Array.isArray(data) ? data : []);
        toast.success(`Successfully loaded ${Array.isArray(data) ? data.length : 0} users`);
      } catch (err) {
        console.error("[AllUsersPage] Error fetching users:", err);
        setError(`Failed to load users: ${err.message}`);
        toast.error(`Failed to load users: ${err.message}`);
        
        if (err.message.includes("Authentication") || err.message.includes("Access denied")) {
          setTimeout(() => router.push("/sign-in"), 2000);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [authState, router]);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filtered and sorted users
  const filteredUsers = useMemo(() => {
    let filtered = users.filter((user) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        user.name?.toLowerCase().includes(term) || 
        user.email?.toLowerCase().includes(term);
      
      const matchesRole = roleFilter === "all" || 
        (roleFilter === "admin" && user.role === 1) ||
        (roleFilter === "user" && user.role !== 1);
      
      return matchesSearch && matchesRole;
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [users, searchTerm, roleFilter, sortConfig]);

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
      const left = Math.max(2, currentPage - 1); // start from 2 to avoid duplicate 1
      const right = Math.min(totalPages - 1, currentPage + 1); // end at totalPages-1 to avoid duplicate totalPages
      pages.push(1);
      if (left > 2) pages.push("…");
      for (let i = left; i <= right; i++) pages.push(i);
      if (right < totalPages - 1) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  };

  // Action handlers
  const handleShow = (user) => {
    toast.info(`Viewing details for ${user.name}`);
    // TODO: Implement user details modal or navigation
  };

  const handleEdit = (user) => {
    toast.info(`Editing ${user.name}`);
    // TODO: Implement user edit functionality
  };

  const handleDelete = async () => {
    if (!showDeleteConfirm) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(`${BASE_URL}/users/${showDeleteConfirm.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      
      setUsers(users.filter(u => u.id !== showDeleteConfirm.id));
      toast.success(`User ${showDeleteConfirm.name} deleted successfully!`);
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user. Please try again.");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(null);
    }
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowsUpDownIcon className="w-4 h-4 text-slate-400" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowsUpDownIcon className="w-4 h-4 text-blue-500 rotate-180" /> :
      <ArrowsUpDownIcon className="w-4 h-4 text-blue-500" />;
  };

  const getRoleBadge = (role) => {
    if (role === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <ShieldCheckIcon className="w-3 h-3" />
          Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <UserCircleIcon className="w-3 h-3" />
        User
      </span>
    );
  };

  return (
    <div className="space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
              <UsersIcon className="w-8 h-8 text-white" />
            </div>
            User Management
          </h1>
          <p className="text-slate-600 mt-2">Manage and monitor all system users</p>
        </div>
        
        <button
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg font-semibold"
          onClick={() => toast.info("Add user functionality coming soon!")}
          disabled={loading}
        >
          <UserPlusIcon className="w-5 h-5" />
          Add New User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                onChange={(e) => debouncedSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Search users by name or email..."
                disabled={loading}
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins Only</option>
              <option value="user">Users Only</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {pageSizeOptions.map((num) => (
                <option key={num}>{num}</option>
              ))}
            </select>
            <span className="text-sm text-slate-600">entries</span>
          </div>
        </div>
      </div>

      {/* API Test Component - Only show when there's an error */}
      {error && (
        <>
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-red-800 font-semibold mb-2">Error Loading Users</h3>
                <p className="text-red-700 text-sm mb-4">{error}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Retry Loading
                  </button>
                  <button
                    onClick={() => {
                      console.log("Debug info:");
                      console.log("Auth State:", authState);
                      console.log("Token:", localStorage.getItem("token"));
                      console.log("Base URL:", BASE_URL);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Debug Info
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Debug Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="text-yellow-800 font-semibold mb-3">Debug Information</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Base URL:</strong> {BASE_URL}</div>
              <div><strong>Auth Token:</strong> {localStorage.getItem("token") ? "Present" : "Missing"}</div>
              <div><strong>User Role:</strong> {authState.userRole}</div>
              <div><strong>Is Logged In:</strong> {authState.isLoggedIn ? "Yes" : "No"}</div>
              <div><strong>Is Loading:</strong> {authState.isLoading ? "Yes" : "No"}</div>
            </div>
          </div>
        </>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-indigo-50 px-6 py-4 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <UsersIcon className="w-6 h-6 text-indigo-600" />
            System Users ({filteredUsers.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {[
                  { key: 'id', label: '#', sortable: false },
                  { key: 'name', label: 'User', sortable: true },
                  { key: 'email', label: 'Email', sortable: true },
                  { key: 'role', label: 'Role', sortable: true },
                  { key: 'created_at', label: 'Joined', sortable: true },
                  { key: 'actions', label: 'Actions', sortable: false },
                ].map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider ${
                      column.sortable ? 'cursor-pointer hover:bg-slate-100 transition-colors' : ''
                    }`}
                    onClick={column.sortable ? () => handleSort(column.key) : undefined}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && getSortIcon(column.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-slate-500">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : currentUsers.length ? (
                currentUsers.map((user, idx) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {idx + 1 + indexOfFirstUser}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <img 
                            src={user.avatarUrl} 
                            alt={user.name} 
                            className="w-10 h-10 rounded-full object-cover border-2 border-slate-200" 
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-sm border-2 border-indigo-200">
                            {getInitials(user.name)}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-slate-900">{user.name}</div>
                          <div className="text-sm text-slate-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <CalendarDaysIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleShow(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          disabled={loading}
                          title="View user details"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          disabled={loading}
                          title="Edit user"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(user)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          disabled={loading}
                          title="Delete user"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <UsersIcon className="w-12 h-12 text-slate-300" />
                      <div>
                        <p className="text-slate-500 font-medium">No users found</p>
                        <p className="text-slate-400 text-sm">
                          {searchTerm ? "Try adjusting your search terms" : "No users available"}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-6 border-t border-slate-200">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {getPages().map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-slate-400">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    disabled={loading}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      currentPage === p
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    } disabled:opacity-50`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || loading}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* Results info */}
        {filteredUsers.length > 0 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
            <span className="text-sm text-slate-600">
              Showing {rangeLabel(currentPage, pageSize, filteredUsers.length)} users
            </span>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Confirm Delete</h3>
            </div>
            
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete user <strong>{showDeleteConfirm.name}</strong>? 
              This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
                onClick={() => setShowDeleteConfirm(null)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <UsersIcon className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-indigo-800 mb-2">User Management</h3>
            <ul className="text-indigo-700 text-sm space-y-1">
              <li>• View and manage all system users</li>
              <li>• Filter users by role (Admin/User)</li>
              <li>• Search users by name or email</li>
              <li>• Sort users by different criteria</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUsersPage;
