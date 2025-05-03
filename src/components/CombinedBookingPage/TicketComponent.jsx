"use client";

import React, { useEffect, useRef } from "react";
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
import jsPDF from "jspdf";
import domToImage from "dom-to-image";

const TicketComponent = ({ bookingData, travelerDetails, bookingResult }) => {
  const totalPassengers = Array.isArray(travelerDetails) ? travelerDetails.length : 0;
  const ticketNumber = bookingResult?.booking?.pnr || `TICKET-${Date.now().toString(36).toUpperCase()}`;
  const ticketRef = useRef(null);

  /* Preprocess styles to replace oklch colors as a fallback */
  const convertOklchToSafeColors = (element) => {
    const safeBackground = "#ffffff";
    const safeText = "#1f2937";

    const processElement = (node) => {
      const computedStyle = window.getComputedStyle(node);
      const backgroundColor = computedStyle.backgroundColor;
      const color = computedStyle.color;
      const borderColor = computedStyle.borderColor;

      if (backgroundColor.includes("oklch") || color.includes("oklch") || borderColor.includes("oklch")) {
        console.log("Found oklch in:", node.tagName, { backgroundColor, color, borderColor });
      }

      node.style.setProperty("background-color", safeBackground, "important");
      node.style.setProperty("color", safeText, "important");
      node.style.setProperty("border-color", "#e5e7eb", "important");

      node.style.background = "none";
      node.style.border = "none";
      if (node.style.backgroundColor === "") node.style.backgroundColor = safeBackground;
      if (node.style.color === "") node.style.color = safeText;
    };

    const elements = element.querySelectorAll("*");
    elements.forEach(processElement);
    processElement(element);

    element.style.backgroundColor = safeBackground;
    element.style.color = safeText;
    element.style.borderColor = "#e5e7eb";

    element.style.removeProperty("--background");
    element.style.removeProperty("--foreground");
    element.style.removeProperty("--primary");
    // Remove other CSS variables as needed
  };


  const downloadTicket = (retry = false) => {
    if (!ticketRef.current) {
      console.error("Ticket content element not found");
      alert("Failed to generate PDF. Please try again.");
      return;
    }

    // Create isolated container
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "-9999px";
    container.style.width = ticketRef.current.offsetWidth + "px";
    container.style.padding = "24px";
    container.appendChild(ticketRef.current.cloneNode(true));
    document.body.appendChild(container);

    const clonedElement = container.querySelector("div");
    if (!clonedElement) {
      console.error("Cloned element not found");
      document.body.removeChild(container);
      return;
    }

    // Preprocess styles
    convertOklchToSafeColors(clonedElement);

    // Simplify styles for retry
    if (retry) {
      clonedElement.style.backgroundColor = "#ffffff";
      clonedElement.style.color = "#000000";
      clonedElement.querySelectorAll("*").forEach((node) => {
        node.style.backgroundColor = "transparent";
        node.style.color = "#000000";
        node.style.border = "none";
      });
    }

    domToImage
      .toPng(clonedElement, { quality: 1 })
      .then((imgData) => {
        const pdf = new jsPDF();
        const width = pdf.internal.pageSize.getWidth();
        const height = (clonedElement.offsetHeight * width) / clonedElement.offsetWidth;
        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save(`flight_ticket_${ticketNumber}.pdf`);
      })
      .catch((error) => {
        console.error("PDF generation failed:", error);
        if (!retry && error.message && error.message.includes("oklch")) {
          console.warn("Retrying PDF generation with simplified styles...");
          downloadTicket(true);
        } else {
          alert("Failed to generate PDF. Please try again.");
        }
      })
      .finally(() => {
        document.body.removeChild(container);
      });
  };

  useEffect(() => {
    downloadTicket();
  }, []);

  return (
    <div style={{ backgroundColor: "#f3f4f6", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ width: "100%", maxWidth: "896px", backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 10px 15px rgba(0,0,0,0.1)", padding: "24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "30px", fontWeight: "bold", color: "#4f46e5" }}>FlyOla India</h1>
          <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#1f2937", marginTop: "8px" }}>E-Ticket</h2>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            Ticket Number: <span style={{ fontWeight: "bold" }}>{ticketNumber}</span>
          </p>
          {bookingResult?.booking?.bookingNo && (
            <p style={{ fontSize: "14px", color: "#6b7280" }}>
              Booking No: <span style={{ fontWeight: "bold" }}>{bookingResult.booking.bookingNo}</span>
            </p>
          )}
        </div>

        <div ref={ticketRef} style={{ marginTop: "32px" }}>
          {/* Flight Information */}
          <section style={{ backgroundColor: "#f9fafb", padding: "24px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <FaPlane style={{ color: "#6366f1" }} /> Flight Information
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "14px", color: "#374151" }}>
              <p><span style={{ fontWeight: "600" }}>From:</span> {bookingData?.departure || "N/A"}</p>
              <p><span style={{ fontWeight: "600" }}>To:</span> {bookingData?.arrival || "N/A"}</p>
              <p><span style={{ fontWeight: "600" }}>Date:</span> {bookingData?.selectedDate || "N/A"}</p>
              <p><span style={{ fontWeight: "600" }}>Flight ID:</span> {bookingData?.id || "N/A"}</p>
              <p><span style={{ fontWeight: "600" }}>Departure:</span> {bookingData?.departureTime || "N/A"}</p>
              <p><span style={{ fontWeight: "600" }}>Arrival:</span> {bookingData?.arrivalTime || "N/A"}</p>
              <p><span style={{ fontWeight: "600" }}>Passengers:</span> {totalPassengers}</p>
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
                      #{idx + 1} – {t.title || "N/A"} {t.fullName || "N/A"} ({bookingResult?.passengers?.[idx]?.type || "Adult"})
                    </p>
                    <p style={{ fontSize: "14px", color: "#6b7280" }}>DOB: {t.dateOfBirth || "N/A"}</p>
                    <p style={{ fontSize: "14px", color: "#6b7280" }}>
                      Age: {bookingResult?.passengers?.[idx]?.age || "N/A"}
                    </p>
                    {idx === 0 && (
                      <div style={{ marginTop: "8px", fontSize: "14px", color: "#6b7280", lineHeight: "1.5" }}>
                        <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <FaEnvelope style={{ color: "#6366f1" }} /> {t.email || "N/A"}
                        </p>
                        <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <FaPhone style={{ color: "#6366f1" }} /> {t.phone || "N/A"}
                        </p>
                        {t.address && (
                          <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <FaMapMarkerAlt style={{ color: "#6366f1" }} /> {t.address}
                          </p>
                        )}
                        {t.gstNumber && <p>GST: {t.gstNumber}</p>}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p style={{ fontSize: "14px", color: "#6b7280" }}>No traveler details available.</p>
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
                INR {bookingData?.totalPrice || "N/A"}
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
                  <FaExclamationTriangle style={{ color: "#6366f1" }} /> Cancellation
                  Procedure
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
        </div>

        {/* Download Button */}
        <button
          onClick={() => downloadTicket()}
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
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4338ca")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4f46e5")}
          disabled={!bookingResult}
          aria-label="Download ticket PDF"
        >
          <FaDownload /> Download Ticket PDF
        </button>
      </div>
    </div>
  );
};

export default TicketComponent;