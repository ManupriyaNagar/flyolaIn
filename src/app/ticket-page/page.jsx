"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfessionalTicket from "./../../components/SingleTicket/ProfessionalTicket";

const TicketPage = () => {
  const [ticketData, setTicketData] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTicketData = () => {
      try {
        const storedData = localStorage.getItem("ticketData");
        if (!storedData) {
          console.error("No ticket data found in localStorage");
          setError("No booking data found. Please complete the booking process or use the 'Get Ticket' page to retrieve your ticket.");
          return;
        }
        const data = JSON.parse(storedData);
        
        // Validate and fix the data structure
        const validatedData = {
          bookingData: data.bookingData || {
            id: "N/A",
            departure: "Departure City",
            arrival: "Arrival City",
            departureCode: "DEP",
            arrivalCode: "ARR",
            departureTime: "09:00",
            arrivalTime: "11:00",
            selectedDate: new Date().toISOString().split('T')[0],
            totalPrice: 0
          },
          travelerDetails: Array.isArray(data.travelerDetails) ? data.travelerDetails : [{
            title: "Mr.",
            fullName: "Passenger Name",
            email: "contact@flyolaindia.com",
            phone: "+91-9876543210",
            address: "Address not provided"
          }],
          bookingResult: data.bookingResult || {
            booking: {
              pnr: "N/A",
              bookingNo: "N/A",
              bookingStatus: "CONFIRMED",
              paymentStatus: "COMPLETED"
            },
            passengers: [{
              age: "25",
              type: "Adult"
            }]
          }
        };
        
        setTicketData(validatedData);
      } catch (err) {
        console.error("Error parsing ticket data:", err);
        setError("Failed to load booking data. The stored data may be corrupted. Please try retrieving your ticket using the 'Get Ticket' page.");
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