"use client";

import { useState } from "react";
import { FaPlaneDeparture, FaUser } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function FlightBooking() {
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-4xl bg-white shadow-lg rounded-2xl">
        <CardContent className="p-6 flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-center">Book Your Flight</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="text"
              placeholder="Departure From"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Arrival To"
              value={arrival}
              onChange={(e) => setArrival(e.target.value)}
            />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <FaUser className="text-gray-500" />
            <Input
              type="number"
              min="1"
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
            />
          </div>
          <Button className="w-full bg-blue-600 text-white flex items-center justify-center gap-2">
            <FaPlaneDeparture /> Search Flights
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
