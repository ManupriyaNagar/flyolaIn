import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaAccessibleIcon, FaAirbnb, FaFacebook } from "react-icons/fa";

const Exp = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center mt-20 "
      style={{ backgroundImage: "url('/background6.png')" }}
    >
      <Card className="w-96 p-6 shadow-lg rounded-2xl bg-white bg-opacity-10 backdrop-blur-lg">
        <CardContent>
            <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-left mb-4 text-gray-100">Find Flights</h2>
           <FaAirbnb className="text-2xl text-gray-100"/>
           </div>
           <div className="bg-white rounded-lg p-4 content-center">
            <h2>Class</h2>
            <div className="flex items-center justify-between gap-2 ">
                <div className="bg-gray-100 rounded-lg p-2 bg-sky-100 ">
                    <h3>Economy class</h3>
                    <h3>$3000</h3>
                </div>
                <div className="bg-gray-100 rounded-lg p-2 bg-yellow-100 ">
                    <h3>Business class</h3>
                    <h3>$3000</h3>
                </div>
                <div className="bg-gray-100 rounded-lg p-2 bg-pink-100 ">
                    <h3>First class</h3>
                    <h3>$3000</h3>
                </div>
                <div className="bg-gray-100 rounded-lg p-2 bg-red-100 ">
                    <h3>Premium economy</h3>
                    <h3>$3000</h3>
                </div>
            </div>
            <div className="flex items-center justify-between gap-2">
            <input type="search" name="" id="" placeholder="Search" className="bg-gray-100 rounded-lg p-2 bg-sky-100"/>
            <button className="rounded-lg p-2 bg-blue-800 text-white">Search</button>
            </div>

           </div>
          <p className="text-center text-sm text-gray-300 mt-4">
            Already have an account? <a href="/SignIn" className="text-blue-500">Sign In</a>
          </p>

        </CardContent>
      </Card>
    </div>
  );
};

export default Exp;