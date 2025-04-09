"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    router.push("/sign-in");
  };

  return (
    <div className="  flex justify-center items-center">
      <div className="bg-white  rounded-lg w-full  p-8">
        <h1 className="text-3xl font-semibold text-blue-900">Booking History</h1>
        
        <div className="flex justify-between mt-8">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md w-1/3">
            <h2 className="text-xl font-bold text-blue-900">Total Booking</h2>
            <p className="text-3xl font-semibold text-green-600">0</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg shadow-md w-1/3">
            <h2 className="text-xl font-bold text-blue-900">Pending</h2>
            <p className="text-3xl font-semibold text-green-600">0</p>
          </div>
        </div>
        
        
      </div>
    </div>
  );
};

export default Page;
