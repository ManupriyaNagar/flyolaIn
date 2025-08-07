"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfessionalTicket from "./../../components/SingleTicket/ProfessionalTicket";
import BASE_URL from "@/baseUrl/baseUrl";

const TicketPage = () => {
  const [ticketData, setTicketData] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        // First try to get data from localStorage (for completed bookings)
        const storedData = localStorage.getItem("ticketData");
        if (storedData) {
          const data = JSON.parse(storedData);
          console.log("Using stored ticket data:", data);
          setTicketData(data);
          return;
        }

        // If no stored data, try to fetch the latest booking from API
        console.log("No stored data found, fetching latest booking from API...");
        const response = await fetch(`${BASE_URL}/tickets/get-ticket`);
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log("API Response:", result);

        if (!result.success || !result.data) {
          throw new Error(result.message || "No booking data available");
        }

        // Transform API data to match component expectations
        const apiData = result.data;
        const transformedData = {
          bookingData: {
            id: apiData.booking.id,
            departure: apiData.flight.departure,
            arrival: apiData.flight.arrival,
            departureCode: apiData.flight.departureCode,
            arrivalCode: apiData.flight.arrivalCode,
            departureTime: apiData.flight.departureTime,
            arrivalTime: apiData.flight.arrivalTime,
            selectedDate: apiData.flight.selectedDate,
            bookDate: apiData.booking.bookDate,
            totalPrice: apiData.flight.totalPrice,
            flightNumber: apiData.flight.flightNumber,
            bookedSeats: apiData.seats?.labels || 'Not Assigned'
          },
          travelerDetails: apiData.passengers.map((passenger, index) => ({
            title: passenger.title || "Mr.",
            fullName: passenger.fullName || passenger.name,
            email: passenger.email || "contact@flyolaindia.com",
            phone: passenger.phone || "+91-9876543210",
            address: "Address not provided",
            seat: passenger.seat || apiData.seats?.details?.[index]?.label || 'Not Assigned'
          })),
          bookingResult: {
            booking: {
              pnr: apiData.booking.pnr,
              bookingNo: apiData.booking.bookingNo,
              bookingStatus: apiData.booking.bookingStatus || "CONFIRMED",
              paymentStatus: apiData.booking.paymentStatus || "COMPLETED",
              totalFare: apiData.booking.totalFare,
              contact_no: apiData.booking.contact_no,
              email_id: apiData.booking.email_id,
              bookedSeats: apiData.seats?.details?.map(seat => seat.label) || []
            },
            passengers: apiData.passengers.map((passenger, index) => ({
              age: passenger.age || "25",
              type: passenger.type || "Adult",
              seat: passenger.seat || apiData.seats?.details?.[index]?.label || 'Not Assigned'
            }))
          }
        };

        console.log("Transformed ticket data:", transformedData);
        setTicketData(transformedData);

      } catch (err) {
        console.error("Error fetching ticket data:", err);
        setError(`Failed to load booking data: ${err.message}. Please use the 'Get Ticket' page to retrieve your ticket with PNR.`);
      }
    };
    
    fetchTicketData();
  }, []);

  if (error) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 16px", marginTop: "80px", backgroundColor: "#ffffff", color: "#1f2937" }}>
        <p style={{ color: "#dc2626" }}>{error}</p>
        <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
          <button
            onClick={() => router.push("/get-ticket")}
            style={{ padding: "8px 24px", backgroundColor: "#2563eb", color: "#ffffff", borderRadius: "8px", border: "none", cursor: "pointer" }}
          >
            Get Ticket
          </button>
          <button
            onClick={() => router.push("/booking")}
            style={{ padding: "8px 24px", backgroundColor: "#6b7280", color: "#ffffff", borderRadius: "8px", border: "none", cursor: "pointer" }}
          >
            New Booking
          </button>
        </div>
      </div>
    );
  }

  if (!ticketData) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 16px", marginTop: "80px", backgroundColor: "#ffffff", color: "#6b7280" }}>
        <p>Loading ticket data...</p>
      </div>
    );
  }

  return (
    <div style={{ margin: "0 auto", marginTop: "80px" }}>
      <ProfessionalTicket
        bookingData={ticketData.bookingData}
        travelerDetails={ticketData.travelerDetails}
        bookingResult={ticketData.bookingResult}
      />
    </div>
  );
};

export default TicketPage;