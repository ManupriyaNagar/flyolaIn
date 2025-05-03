"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  FaPlane,
  FaClock,
  FaUserFriends,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaDownload,
  FaInfoCircle,
  FaLuggageCart,
  FaExclamationTriangle,
} from "react-icons/fa";
import BASE_URL from "@/baseUrl/baseUrl";

const TicketView = ({ isOpen, onClose, booking, isDownload = false, onDownload }) => {
  const ticketRef = useRef(null);

  if (!booking) return null;

  const bookingData = {
    departure: booking.departureAirportName,
    arrival: booking.arrivalAirportName,
    selectedDate: booking.bookDate,
    id: booking.schedule_id,
    departureTime: booking.FlightSchedule?.departure_time || "N/A",
    arrivalTime: booking.FlightSchedule?.arrival_time || "N/A",
    totalPrice: parseFloat(booking.totalFare).toFixed(2),
  };

  const travelerDetails = booking.passengers.map((p, idx) => ({
    title: p.title || "N/A",
    fullName: p.name || "N/A",
    dateOfBirth: p.dob || "N/A",
    email: idx === 0 ? booking.email_id : null,
    phone: idx === 0 ? booking.contact_no : null,
    address: idx === 0 ? booking.billing?.billing_address : null,
    age: p.age || "N/A",
    type: p.passenger_type || "Adult",
  }));

  const bookingResult = {
    booking: {
      pnr: booking.pnr,
      bookingNo: booking.bookingNo,
    },
  };

  const totalPassengers = travelerDetails.length;
  const ticketNumber = bookingResult.booking.pnr || `TICKET-${Date.now().toString(36).toUpperCase()}`;

  const handleDownload = () => {
    // Dynamically load jsPDF
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });
  
      // Colors
      const primaryColor = [79, 70, 229]; // RGB for #4f46e5
      const textColor = [31, 41, 55]; // RGB for #1f2937
      const mutedColor = [107, 114, 128]; // RGB for #6b7280
      const greenColor = [22, 163, 74]; // RGB for #16a34a
      const linkColor = [37, 99, 235]; // RGB for #2563eb
  
      // Fonts
      doc.setFont("Helvetica");
  
      // Header
      let y = 40;
      doc.setFontSize(24);
      doc.setTextColor(...primaryColor);
      doc.text("Jet Serveaviation", 40, y);
      y += 30;
      doc.setFontSize(18);
      doc.setTextColor(...textColor);
      doc.text("E-Ticket", 40, y);
      y += 20;
      doc.setFontSize(12);
      doc.setTextColor(...mutedColor);
      doc.text(`Ticket Number: ${bookingResult.booking.pnr || "NEL4QS"}`, 40, y);
      y += 15;
      doc.text(`Booking No: ${bookingResult.booking.bookingNo || "BOOK1746250235353"}`, 40, y);
      y += 30;
  
      // Flight Information Section
      doc.setFillColor(249, 250, 251); // #f9fafb
      doc.rect(40, y - 10, 515, 90, 'F');
      doc.setDrawColor(229, 231, 235); // #e5e7eb
      doc.rect(40, y - 10, 515, 90);
      doc.setFontSize(16);
      doc.setTextColor(...textColor);
      doc.text("Flight Information", 50, y);
      y += 20;
      doc.setFontSize(12);
      doc.setTextColor(...textColor);
      doc.text(`From: ${bookingData.departure || "Khajuraho Airport"}`, 50, y);
      doc.text(`To: ${bookingData.arrival || "Singrauli Airport"}`, 300, y);
      y += 15;
      doc.text(`Date: ${bookingData.selectedDate || "2025-05-04"}`, 50, y);
      doc.text(`Flight ID: ${bookingData.id || "498"}`, 300, y);
      y += 15;
      doc.text(`Departure: ${bookingData.departureTime || "11:30:00"}`, 50, y);
      doc.text(`Arrival: ${bookingData.arrivalTime || "13:45:00"}`, 300, y);
      y += 15;
      doc.text(`Passengers: ${totalPassengers || "3"}`, 50, y);
      y += 40;
  
      // Traveller Details Section
      doc.setFillColor(249, 250, 251);
      doc.rect(40, y - 10, 515, 150, 'F');
      doc.setDrawColor(229, 231, 235);
      doc.rect(40, y - 10, 515, 150);
      doc.setFontSize(16);
      doc.setTextColor(...textColor);
      doc.text("Traveller(s)", 50, y);
      y += 20;
      doc.setFontSize(12);
      if (Array.isArray(travelerDetails) && travelerDetails.length > 0) {
        travelerDetails.forEach((t, idx) => {
          doc.setTextColor(...textColor);
          doc.setFont("Helvetica", "bold");
          doc.text(`#${idx + 1} – ${t.title} ${t.fullName} (${t.type})`, 50, y);
          y += 15;
          doc.setFont("Helvetica", "normal");
          doc.setTextColor(...mutedColor);
          doc.text(`DOB: ${t.dateOfBirth}`, 50, y);
          y += 15;
          doc.text(`Age: ${t.age}`, 50, y);
          if (idx === 0) {
            y += 15;
            doc.text(`${t.email || "hariom987650@gmail.com"}`, 50, y);
            y += 15;
            doc.text(`${t.phone || "7000916904"}`, 50, y);
            y += 15;
            doc.text(`${t.address || "Delhi"}`, 50, y);
          }
          y += 20;
          doc.setDrawColor(229, 231, 235);
          doc.line(50, y - 10, 545, y - 10); // Separator line
        });
      } else {
        doc.setTextColor(...textColor);
        doc.setFont("Helvetica", "bold");
        doc.text("#1 – Mrs. Tushti Singh (Adult)", 50, y);
        y += 15;
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(...mutedColor);
        doc.text("DOB: 1983-10-02", 50, y);
        y += 15;
        doc.text("Age: 41", 50, y);
        y += 15;
        doc.text("hariom987650@gmail.com", 50, y);
        y += 15;
        doc.text("7000916904", 50, y);
        y += 15;
        doc.text("Delhi", 50, y);
        y += 20;
        doc.setDrawColor(229, 231, 235);
        doc.line(50, y - 10, 545, y - 10);
        y += 10;
        doc.setTextColor(...textColor);
        doc.setFont("Helvetica", "bold");
        doc.text("#2 – Mr. Shakti Singh (Adult)", 50, y);
        y += 15;
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(...mutedColor);
        doc.text("DOB: 1983-09-02", 50, y);
        y += 15;
        doc.text("Age: 41", 50, y);
        y += 20;
        doc.line(50, y - 10, 545, y - 10);
        y += 10;
        doc.setTextColor(...textColor);
        doc.setFont("Helvetica", "bold");
        doc.text("#3 – Mr. Sarvagya Singh (Adult)", 50, y);
        y += 15;
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(...mutedColor);
        doc.text("DOB: 2016-12-06", 50, y);
        y += 15;
        doc.text("Age: 8", 50, y);
        y += 20;
      }
      y += 30;
  
      // Price Summary Section
      doc.setFillColor(249, 250, 251);
      doc.rect(40, y - 10, 515, 50, 'F');
      doc.setDrawColor(229, 231, 235);
      doc.rect(40, y - 10, 515, 50);
      doc.setFontSize(16);
      doc.setTextColor(...textColor);
      doc.text("Price Summary", 50, y);
      y += 20;
      doc.setFontSize(12);
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(["Total Price:"], 50, y);
      
      doc.setTextColor(...greenColor);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(14);
      doc.text([`INR ${bookingData.totalPrice || "13500.00"}`], 120, y); // place price with spacing
      y += 40;
      
  
      // Important Information Section
      doc.setFillColor(249, 250, 251);
      doc.rect(40, y - 10, 515, 300, 'F');
      doc.setDrawColor(229, 231, 235);
      doc.rect(40, y - 10, 515, 300);
      doc.setFontSize(16);
      doc.setTextColor(...textColor);
      doc.text("Important Information", 50, y);
      y += 20;
      doc.setFontSize(12);
  
      // Check-in
      doc.setTextColor(...textColor);
      doc.setFont("Helvetica", "bold");
      doc.text("Check-in", 50, y);
      y += 15;
      doc.setFont("Helvetica", "normal");
      doc.setTextColor(...textColor);
      doc.text("Passengers must check-in 1 hour prior to scheduled departure.", 50, y);
      y += 15;
      doc.text("All passengers (including children and infants) must present valid ID", 50, y);
      y += 15;
      doc.text("(Passport, PAN Card, Election Card, or any photo ID) at check-in.", 50, y);
      y += 20;
  
      // Baggage Policy
      doc.setFont("Helvetica", "bold");
      doc.text("Baggage Policy", 50, y);
      y += 15;
      doc.setFont("Helvetica", "normal");
      doc.text("Only cabin baggage is allowed, subject to restrictions:", 50, y);
      y += 15;
      doc.text("• Maximum size: 115cm (length + width + height)", 60, y);
      y += 15;
      doc.text("• Maximum weight: 7kg", 60, y);
      y += 15;
      doc.text("Extra baggage may be offloaded or allowed at INR 1000/- per kg, subject", 50, y);
      y += 15;
      doc.text("to space availability.", 50, y);
      y += 20;
  
      // Cancellation Procedure
      doc.setFont("Helvetica", "bold");
      doc.text("Cancellation Procedure", 50, y);
      y += 15;
      doc.setFont("Helvetica", "normal");
      doc.text("E-Tickets can only be cancelled via email at booking@flyolaindia.com.", 50, y);
      y += 15;
      doc.text("Cancellations are not permitted at face-to-face counters.", 50, y);
      y += 15;
      doc.text("Cancellations are allowed up to 12 hours before departure.", 50, y);
      y += 15;
      doc.text("Cancellations will be confirmed online, and refunds will be credited to", 50, y);
      y += 15;
      doc.text("the original payment account.", 50, y);
      y += 20;
  
      // Refund Policy
      doc.setFont("Helvetica", "bold");
      doc.text("Refund Policy", 50, y);
      y += 15;
      doc.setFont("Helvetica", "normal");
      doc.text("• More than 96 hours before departure: INR 400/- per seat cancellation fee.", 60, y);
      y += 15;
      doc.text("• 48–96 hours before departure: 25% of booking amount deducted.", 60, y);
      y += 15;
      doc.text("• 12–48 hours before departure: 50% of booking amount deducted.", 60, y);
      y += 15;
      doc.text("• Less than 12 hours before departure: No refund issued.", 60, y);
      y += 40;
  
      // Support Contact
      doc.setFontSize(12);
      doc.setTextColor(...mutedColor);
      doc.text("Please carry a valid ID and this ticket for boarding.", 40, y, { align: "center" });
      y += 15;
      doc.text("For support, contact support@flyola.in.", 40, y, { align: "center" });
  
      // Save the PDF
      doc.save(`flight_ticket_${ticketNumber}.pdf`);
    }).catch((error) => {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    });
  };
  

  if (!isOpen && !isDownload) return null;

  return (
    <div
      style={{
        position: isDownload ? "absolute" : "fixed",
        top: isDownload ? "-9999px" : 0,
        left: isDownload ? "-9999px" : 0,
        right: isDownload ? "auto" : 0,
        bottom: isDownload ? "auto" : 0,
        backgroundColor: isDownload ? "transparent" : "rgba(0,0,0,0.5)",
        display: isDownload ? "block" : "flex",
        alignItems: isDownload ? "none" : "center",
        justifyContent: isDownload ? "none" : "center",
        zIndex: isDownload ? -1 : 1000,
        overflow: isDownload ? "hidden" : "auto",
        padding: isDownload ? 0 : "20px",
      }}
    >
      <div
        ref={ticketRef}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "896px",
          maxHeight: isDownload ? "none" : "90vh",
          overflowY: isDownload ? "hidden" : "auto",
          padding: "24px",
          position: "relative",
          boxShadow: isDownload ? "none" : "0 4px 6px rgba(0, 0, 0, 0.1)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {!isDownload && (
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: "#4f46e5",
            }}
            aria-label="Close modal"
          >
            ✕
          </button>
        )}

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "30px", fontWeight: "bold", color: "#4f46e5" }}>Jet Serveaviation</h1>
          <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#1f2937", marginTop: "8px" }}>E-Ticket</h2>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            Ticket Number: <span style={{ fontWeight: "bold" }}>{bookingResult.booking.pnr || "NEL4QS"}</span>
          </p>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            Booking No: <span style={{ fontWeight: "bold" }}>{bookingResult.booking.bookingNo || "BOOK1746250235353"}</span>
          </p>
        </div>

        {/* Flight Information */}
        <section style={{ backgroundColor: "#f9fafb", padding: "24px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <FaPlane style={{ color: "#6366f1" }} /> Flight Information
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "14px", color: "#374151" }}>
            <p><span style={{ fontWeight: "600" }}>From:</span> {bookingData.departure || "Khajuraho Airport"}</p>
            <p><span style={{ fontWeight: "600" }}>To:</span> {bookingData.arrival || "Singrauli Airport"}</p>
            <p><span style={{ fontWeight: "600" }}>Date:</span> {bookingData.selectedDate || "2025-05-04"}</p>
            <p><span style={{ fontWeight: "600" }}>Flight ID:</span> {bookingData.id || "498"}</p>
            <p><span style={{ fontWeight: "600" }}>Departure:</span> {bookingData.departureTime || "11:30:00"}</p>
            <p><span style={{ fontWeight: "600" }}>Arrival:</span> {bookingData.arrivalTime || "13:45:00"}</p>
            <p><span style={{ fontWeight: "600" }}>Passengers:</span> {totalPassengers || "3"}</p>
          </div>
        </section>

        {/* Traveller Details */}
        <section style={{ backgroundColor: "#f9fafb", padding: "24px", borderRadius: "8px", border: "1px solid #e5e7eb", marginTop: "32px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <FaUserFriends style={{ color: "#6366f1" }} /> Traveller(s)
          </h3>
          <div style={{ marginTop: "16px" }}>
            {Array.isArray(travelerDetails) && travelerDetails.length > 0 ? (
              travelerDetails.map((t, idx) => (
                <div key={idx} style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: "16px", marginBottom: "16px" }}>
                  <p style={{ fontWeight: "600", color: "#1f2937" }}>
                    #{idx + 1} – {t.title} {t.fullName} ({t.type})
                  </p>
                  <p style={{ fontSize: "14px", color: "#6b7280" }}>DOB: {t.dateOfBirth}</p>
                  <p style={{ fontSize: "14px", color: "#6b7280" }}>Age: {t.age}</p>
                  {idx === 0 && (
                    <div style={{ marginTop: "8px", fontSize: "14px", color: "#6b7280", lineHeight: "1.5" }}>
                      <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaEnvelope style={{ color: "#6366f1" }} /> {t.email || "hariom987650@gmail.com"}
                      </p>
                      <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaPhone style={{ color: "#6366f1" }} /> {t.phone || "7000916904"}
                      </p>
                      {t.address && (
                        <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <FaMapMarkerAlt style={{ color: "#6366f1" }} /> {t.address || "Delhi"}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <>
                <div style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: "16px", marginBottom: "16px" }}>
                  <p style={{ fontWeight: "600", color: "#1f2937" }}>#1 – Mrs. Tushti Singh (Adult)</p>
                  <p style={{ fontSize: "14px", color: "#6b7280" }}>DOB: 1983-10-02</p>
                  <p style={{ fontSize: "14px", color: "#6b7280" }}>Age: 41</p>
                  <div style={{ marginTop: "8px", fontSize: "14px", color: "#6b7280", lineHeight: "1.5" }}>
                    <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <FaEnvelope style={{ color: "#6366f1" }} /> hariom987650@gmail.com
                    </p>
                    <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <FaPhone style={{ color: "#6366f1" }} /> 7000916904
                    </p>
                    <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <FaMapMarkerAlt style={{ color: "#6366f1" }} /> Delhi
                    </p>
                  </div>
                </div>
                <div style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: "16px", marginBottom: "16px" }}>
                  <p style={{ fontWeight: "600", color: "#1f2937" }}>#2 – Mr. Shakti Singh (Adult)</p>
                  <p style={{ fontSize: "14px", color: "#6b7280" }}>DOB: 1983-09-02</p>
                  <p style={{ fontSize: "14px", color: "#6b7280" }}>Age: 41</p>
                </div>
                <div style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: "16px", marginBottom: "16px" }}>
                  <p style={{ fontWeight: "600", color: "#1f2937" }}>#3 – Mr. Sarvagya Singh (Adult)</p>
                  <p style={{ fontSize: "14px", color: "#6b7280" }}>DOB: 2016-12-06</p>
                  <p style={{ fontSize: "14px", color: "#6b7280" }}>Age: 8</p>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Price Summary */}
        <section style={{ backgroundColor: "#f9fafb", padding: "24px", borderRadius: "8px", border: "1px solid #e5e7eb", marginTop: "32px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <FaInfoCircle style={{ color: "#6366f1" }} /> Price Summary
          </h3>
          <p style={{ fontSize: "14px", color: "#374151" }}>
            Total Price:{" "}
            <span style={{ fontSize: "24px", fontWeight: "bold", color: "#16a34a" }}>
              INR {bookingData.totalPrice || "13500.00"}
            </span>
          </p>
        </section>

        {/* Policies */}
        <section style={{ backgroundColor: "#f9fafb", padding: "24px", borderRadius: "8px", border: "1px solid #e5e7eb", marginTop: "32px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <FaInfoCircle style={{ color: "#6366f1" }} /> Important Information
          </h3>
          <div style={{ marginTop: "16px", fontSize: "14px", color: "#374151", lineHeight: "1.5" }}>
            <div>
              <h4 style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaClock style={{ color: "#6366f1" }} /> Check-in
              </h4>
              <p>Passengers must check-in 1 hour prior to scheduled departure.</p>
              <p>
                All passengers (including children and infants) must present valid ID
                (Passport, PAN Card, Election Card, or any photo ID) at check-in.
              </p>
            </div>
            <div style={{ marginTop: "16px" }}>
              <h4 style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaLuggageCart style={{ color: "#6366f1" }} /> Baggage Policy
              </h4>
              <p>Only cabin baggage is allowed, subject to restrictions:</p>
              <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                <li>Maximum size: 115cm (length + width + height)</li>
                <li>Maximum weight: 7kg</li>
              </ul>
              <p>
                Extra baggage may be offloaded or allowed at INR 1000/- per kg, subject
                to space availability.
              </p>
            </div>
            <div style={{ marginTop: "16px" }}>
              <h4 style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaExclamationTriangle style={{ color: "#6366f1" }} /> Cancellation Procedure
              </h4>
              <p>
                E-Tickets can only be cancelled via email at{" "}
                <a href="mailto:booking@flyolaindia.com" style={{ color: "#2563eb", textDecoration: "underline" }}>
                  booking@flyolaindia.com
                </a>.
              </p>
              <p>Cancellations are not permitted at face-to-face counters.</p>
              <p>Cancellations are allowed up to 12 hours before departure.</p>
              <p>
                Cancellations will be confirmed online, and refunds will be credited to
                the original payment account.
              </p>
            </div>
            <div style={{ marginTop: "16px" }}>
              <h4 style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaInfoCircle style={{ color: "#6366f1" }} /> Refund Policy
              </h4>
              <ul style={{ listStyleType: "disc", paddingLeft: "20px", marginTop: "8px" }}>
                <li>More than 96 hours before departure: INR 400/- per seat cancellation fee.</li>
                <li>48–96 hours before departure: 25% of booking amount deducted.</li>
                <li>12–48 hours before departure: 50% of booking amount deducted.</li>
                <li>Less than 12 hours before departure: No refund issued.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Support Contact */}
        <section style={{ textAlign: "center", fontSize: "14px", color: "#6b7280", marginTop: "32px" }}>
          <p>Please carry a valid ID and this ticket for boarding.</p>
          <p>
            For support, contact{" "}
            <a href="mailto:support@flyola.in" style={{ color: "#2563eb", textDecoration: "underline" }}>
              support@flyola.in
            </a>.
          </p>
        </section>

        {!isDownload && (
          <button
            onClick={handleDownload}
            style={{
              marginTop: "24px",
              width: "100%",
              backgroundColor: "#4f46e5",
              color: "#ffffff",
              padding: "12px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              cursor: "pointer",
              border: "none",
              fontSize: "16px",
              fontWeight: "500",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4338ca")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4f46e5")}
            disabled={!bookingResult}
            aria-label="Download ticket PDF"
          >
            <FaDownload /> Download Ticket PDF
          </button>
        )}
      </div>
    </div>
  );
};

const Page = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [airportMap, setAirportMap] = useState({});
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchBookings() {
      setIsLoading(true);
      try {
        const [bookingsRes, passengersRes, bookedSeatRes, billingsRes, paymentsRes, airportRes] = await Promise.all([
          fetch(`${BASE_URL}/bookings`),
          fetch(`${BASE_URL}/passenger`),
          fetch(`${BASE_URL}/booked-seat`),
          fetch(`${BASE_URL}/billings`),
          fetch(`${BASE_URL}/payments`),
          fetch(`${BASE_URL}/airport`),
        ]);

        if (!bookingsRes.ok || !passengersRes.ok || !bookedSeatRes.ok || !billingsRes.ok || !paymentsRes.ok || !airportRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [bookingsData, passengersData, bookedSeatData, billingsData, paymentsData, airportData] = await Promise.all([
          bookingsRes.json(),
          passengersRes.json(),
          bookedSeatRes.json(),
          billingsRes.json(),
          paymentsRes.json(),
          airportRes.json(),
        ]);

        const map = {};
        airportData.forEach((a) => {
          map[a.id] = a.airport_name;
        });
        setAirportMap(map);

        const merged = bookingsData.map((booking) => {
          const matchingSeat = bookedSeatData.find(
            (seat) => seat.schedule_id === booking.schedule_id && seat.bookDate === booking.bookDate
          );
          const matchingPassengers = passengersData.filter((p) => p.bookingId === booking.id);
          const matchingPayment = paymentsData.find((p) => p.booking_id === booking.id);
          const matchingBilling = billingsData.find((b) => b.user_id === booking.bookedUserId);

          const depId = matchingSeat?.FlightSchedule?.departure_airport_id;
          const arrId = matchingSeat?.FlightSchedule?.arrival_airport_id;

          return {
            ...booking,
            FlightSchedule: matchingSeat?.FlightSchedule ?? {},
            booked_seat: matchingSeat?.booked_seat ?? null,
            passengers: matchingPassengers,
            payment: matchingPayment ?? {},
            billing: matchingBilling ?? {},
            departureAirportName: map[depId] ?? depId ?? "N/A",
            arrivalAirportName: map[arrId] ?? arrId ?? "N/A",
          };
        });

        merged.sort((a, b) => new Date(b.bookDate).getTime() - new Date(a.bookDate).getTime());
        setBookings(merged);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        alert("Failed to load bookings. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchBookings();
  }, []);

  // Calculate paginated bookings
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = bookings.slice(startIndex, startIndex + itemsPerPage);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", padding: "24px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "600", color: "#1f2937", marginBottom: "24px", textAlign: "center" }}>
        Booking List
      </h1>

      <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 10px 15px rgba(0,0,0,0.1)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#f9fafb" }}>
            <tr>
              <th style={{ padding: "16px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#374151" }}>Passenger Name</th>
              <th style={{ padding: "16px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#374151" }}>Date of Flight</th>
              <th style={{ padding: "16px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#374151" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} style={{ padding: "24px", textAlign: "center", color: "#6b7280" }}>
                  Loading bookings...
                </td>
              </tr>
            ) : currentBookings.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: "24px", textAlign: "center", color: "#6b7280" }}>
                  No bookings found.
                </td>
              </tr>
            ) : (
              currentBookings.map((booking) => {
                const ticketNumber = booking.pnr || `TICKET-${Date.now().toString(36).toUpperCase()}`;

                return (
                  <tr key={booking.bookingNo} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "16px", fontSize: "14px", color: "#374151" }}>
                      {booking.passengers.map((p) => p.name).join(", ") || "N/A"}
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px", color: "#374151" }}>
                      {new Date(booking.bookDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          style={{
                            backgroundColor: "#4f46e5",
                            color: "#ffffff",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "500",
                            border: "none",
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4338ca")}
                          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4f46e5")}
                          aria-label={`View ticket for booking ${booking.bookingNo}`}
                        >
                          <FaPlane /> View Ticket
                        </button>
                      </div>
                      {/* Render TicketView off-screen for download */}
                      <TicketView
                        isOpen={false}
                        onClose={() => {}}
                        booking={booking}
                        isDownload={true}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div style={{ textAlign: "center", marginTop: "24px" }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ padding: "8px 16px", marginRight: "8px", backgroundColor: "#4f46e5", color: "#ffffff", borderRadius: "8px", cursor: "pointer" }}
        >
          Previous
        </button>
        <span style={{ fontSize: "16px", fontWeight: "500", color: "#374151" }}>
          Page {currentPage}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={bookings.length <= currentPage * itemsPerPage}
          style={{ padding: "8px 16px", marginLeft: "8px", backgroundColor: "#4f46e5", color: "#ffffff", borderRadius: "8px", cursor: "pointer" }}
        >
          Next
        </button>
      </div>

      {selectedBooking && (
        <TicketView
          isOpen={true}
          onClose={() => setSelectedBooking(null)}
          booking={selectedBooking}
        />
      )}
    </div>
  );
};

export default Page;