"use client";

import BASE_URL from '@/baseUrl/baseUrl';
import React, { useState, useEffect } from 'react';

const User = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);
  

  const handleShow = (id) => console.log('Show user with id:', id);
  const handleEdit = (id) => console.log('Edit user with id:', id);
  const handleDelete = (id) => console.log('Delete user with id:', id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
        <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition duration-300">
          <span className="mr-2 text-lg">+</span> Add New User
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-blue-600">
            <tr>
              <th className="py-3 px-6 text-left text-white font-semibold">#</th>
              <th className="py-3 px-6 text-left text-white font-semibold">Name</th>
              <th className="py-3 px-6 text-left text-white font-semibold">Email</th>
              <th className="py-3 px-6 text-left text-white font-semibold">Role</th>
              <th className="py-3 px-6 text-left text-white font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr 
                  key={user.id} 
                  className="border-b hover:bg-gray-50 transition duration-200"
                >
                  <td className="py-4 px-6 text-gray-700">{index + 1}</td>
                  <td className="py-4 px-6 text-gray-700">{user.name}</td>
                  <td className="py-4 px-6 text-gray-700">{user.email}</td>
                  <td className="py-4 px-6">
                    <span 
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === 1 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {user.role === 1 ? 'Super Admin' : 'User'}
                    </span>
                  </td>
                  <td className="py-4 px-6 flex gap-3">
                    <button 
                      onClick={() => handleShow(user.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition duration-300"
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button 
                      onClick={() => handleEdit(user.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md transition duration-300"
                      title="Edit User"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition duration-300"
                      title="Delete User"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan="5" 
                  className="py-4 px-6 text-center text-gray-500"
                >
                  No users available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;