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
          setError("No booking data found. Please complete the booking process.");
          return;
        }
        const data = JSON.parse(storedData);
        if (!Array.isArray(data.travelerDetails)) {
          console.error("Invalid travelerDetails:", data.travelerDetails);
          setError("Invalid booking data: Traveler details missing.");
          return;
        }
        setTicketData(data);
      } catch (err) {
        console.error("Error parsing ticket data:", err);
        setError("Failed to load booking data. Please try again.");
      }
    };
    fetchTicketData();
  }, []);

  if (error) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 16px", marginTop: "80px", backgroundColor: "#ffffff", color: "#1f2937" }}>
        <p style={{ color: "#dc2626" }}>{error}</p>
        <button
          onClick={() => router.push("/booking")}
          style={{ marginTop: "16px", padding: "8px 24px", backgroundColor: "#2563eb", color: "#ffffff", borderRadius: "8px" }}
        >
          Return to Booking
        </button>
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