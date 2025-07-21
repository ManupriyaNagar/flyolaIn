"use client";

import React, { useRef } from "react";
import {
  FaPlane,
  FaClock,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaDownload,
  FaLuggageCart,
  FaExclamationTriangle,
  FaQrcode,
  FaBarcode,
  FaUser,
  FaInfoCircle,
} from "react-icons/fa";
import jsPDF from "jspdf";
import domToImage from "dom-to-image";

const ProfessionalTicket = ({ bookingData, travelerDetails, bookingResult }) => {
  // Debug logging
  console.log("ProfessionalTicket received data:", {
    bookingData,
    travelerDetails,
    bookingResult
  });

  const totalPassengers = Array.isArray(travelerDetails) ? travelerDetails.length : 0;
  const ticketNumber = bookingResult?.booking?.pnr || `FLYOLA-${Date.now().toString(36).toUpperCase()}`;
  const bookingNumber = bookingResult?.booking?.bookingNo || `BK-${Date.now().toString(36).toUpperCase()}`;
  const ticketRef = useRef(null);

  // Format departure and arrival codes
  const departureCode = bookingData?.departureCode || bookingData?.departure?.substring(0, 3).toUpperCase() || "DBG";
  const arrivalCode = bookingData?.arrivalCode || bookingData?.arrival?.substring(0, 3).toUpperCase() || "DEL";

  const downloadTicket = () => {
    if (!ticketRef.current) {
      console.error("Ticket content element not found");
      alert("Failed to generate PDF. Please try again.");
      return;
    }

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

    // Set safe colors for PDF generation
    clonedElement.style.backgroundColor = "#ffffff";
    clonedElement.style.color = "#000000";
    clonedElement.querySelectorAll("*").forEach((node) => {
      if (node.style.backgroundColor && node.style.backgroundColor.includes("gradient")) {
        node.style.backgroundColor = "#1e293b";
      }
    });

    domToImage
      .toPng(clonedElement, { quality: 1 })
      .then((imgData) => {
        const pdf = new jsPDF();
        const width = pdf.internal.pageSize.getWidth();
        const height = (clonedElement.offsetHeight * width) / clonedElement.offsetWidth;
        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save(`flyola_ticket_${ticketNumber}.pdf`);
      })
      .catch((error) => {
        console.error("PDF generation failed:", error);
        alert("Failed to generate PDF. Please try again.");
      })
      .finally(() => {
        document.body.removeChild(container);
      });
  };

  return (
    <div style={{
      backgroundColor: "#f9fafb",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{ width: "100%", maxWidth: "800px" }}>
        {/* Professional Ticket Container */}
        <div
          ref={ticketRef}
          style={{
            backgroundColor: "#ffffee",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
            overflow: "hidden",
            border: "1px solid #e5e7eb"
          }}
        >
          {/* Header with Logo */}
          <div style={{
            background: "#000000",
            padding: "24px",
            position: "relative",
            borderBottom: "1px solid #335155"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flexDirection: "column", alignItems: "center" }}>
                <img
                  src="/logoo-04.png"
                  alt="FlyOla Logo"
                  style={{ width: "180px", height: "48px", marginRight: "16px" }}
                />

                <div>


                </div>
              </div>
              <div style={{ textAlign: "right", color: "#ffffff" }}>
                <p style={{
                  fontSize: "11px",
                  margin: 0,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Ticket No.
                </p>
                <p style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  margin: "2px 0 0 0"
                }}>
                  {ticketNumber}
                </p>
                {bookingResult?.booking?.bookingNo && (
                  <>
                    <p style={{
                      fontSize: "11px",
                      margin: "8px 0 0 0",
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      Booking ID
                    </p>
                    <p style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      margin: "2px 0 0 0"
                    }}>
                      {bookingNumber}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Flight Information */}
          <div style={{
            padding: "24px",
            borderBottom: "1px solid #e5e7eb",
            backgroundColor: "#f8fafc"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px"
            }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{
                  backgroundColor: "#eff6ff",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "12px"
                }}>
                  <FaPlane style={{ color: "#2563eb", fontSize: "14px" }} />
                </div>
                <h2 style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#0f172a",
                  margin: 0
                }}>
                  Flight Information
                </h2>
              </div>
              <div style={{
                backgroundColor: "#f1f5f9",
                padding: "6px 12px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "500",
                color: "#475569",
                border: "1px solid #e2e8f0"
              }}>
                {bookingData?.selectedDate ? new Date(bookingData.selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) :
                  bookingData?.bookDate ? new Date(bookingData.bookDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) :
                    new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              {/* Departure */}
              <div style={{ textAlign: "center", flex: "1" }}>
                <p style={{
                  fontSize: "12px",
                  color: "#64748b",
                  margin: "0 0 4px 0",
                  fontWeight: "500"
                }}>
                  FROM
                </p>
                <h3 style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#0f172a",
                  margin: "0 0 4px 0"
                }}>
                  {departureCode}
                </h3>
                <p style={{
                  fontSize: "14px",
                  color: "#334155",
                  margin: "0 0 8px 0",
                  fontWeight: "500"
                }}>
                  {bookingData?.departure || "Departure City"}
                </p>
                <p style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#0f172a",
                  margin: 0
                }}>
                  {bookingData?.departureTime ?
                    (bookingData.departureTime.length > 5 ?
                      bookingData.departureTime.substring(0, 5) :
                      bookingData.departureTime) : "00:00"}
                </p>
              </div>

              {/* Flight Path */}
              <div style={{
                flex: "0 0 120px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 16px"
              }}>
                <div style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "#cbd5e1",
                  position: "relative",
                  margin: "8px 0"
                }}>
                  <div style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-4px",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#2563eb"
                  }}></div>
                  <div style={{
                    position: "absolute",
                    top: "-4px",
                    left: "-4px",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#2563eb"
                  }}></div>
                </div>
                <p style={{
                  fontSize: "12px",
                  color: "#64748b",
                  margin: "8px 0 0 0",
                  textAlign: "center"
                }}>
                  Direct Flight
                </p>
              </div>

              {/* Arrival */}
              <div style={{ textAlign: "center", flex: "1" }}>
                <p style={{
                  fontSize: "12px",
                  color: "#64748b",
                  margin: "0 0 4px 0",
                  fontWeight: "500"
                }}>
                  TO
                </p>
                <h3 style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#0f172a",
                  margin: "0 0 4px 0"
                }}>
                  {arrivalCode}
                </h3>
                <p style={{
                  fontSize: "14px",
                  color: "#334155",
                  margin: "0 0 8px 0",
                  fontWeight: "500"
                }}>
                  {bookingData?.arrival || "Arrival City"}
                </p>
                <p style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#0f172a",
                  margin: 0
                }}>
                  {bookingData?.arrivalTime ?
                    (bookingData.arrivalTime.length > 5 ?
                      bookingData.arrivalTime.substring(0, 5) :
                      bookingData.arrivalTime) : "00:00"}
                </p>
              </div>
            </div>

            {/* Flight Details */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "24px",
              padding: "16px",
              backgroundColor: "#ffffff",
              borderRadius: "4px",
              border: "1px solid #e5e7eb"
            }}>
              <div>
                <p style={{
                  fontSize: "11px",
                  color: "#64748b",
                  margin: "0 0 2px 0",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Flight
                </p>
                <p style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#0f172a",
                  margin: 0
                }}>
                  JS-{bookingData?.id || "001"}
                </p>
              </div>
              <div>
                <p style={{
                  fontSize: "11px",
                  color: "#64748b",
                  margin: "0 0 2px 0",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Class
                </p>
                <p style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#0f172a",
                  margin: 0
                }}>
                  Economy
                </p>
              </div>
              <div>
                <p style={{
                  fontSize: "11px",
                  color: "#64748b",
                  margin: "0 0 2px 0",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Passengers
                </p>
                <p style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#0f172a",
                  margin: 0
                }}>
                  {totalPassengers}
                </p>
              </div>
              <div>
                <p style={{
                  fontSize: "11px",
                  color: "#64748b",
                  margin: "0 0 2px 0",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Status
                </p>
                <p style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: bookingResult?.booking?.bookingStatus === "CONFIRMED" ? "#15803d" :
                    bookingResult?.booking?.bookingStatus === "PENDING" ? "#d97706" : "#dc2626",
                  margin: 0
                }}>
                  {bookingResult?.booking?.bookingStatus || "Confirmed"}
                </p>
              </div>
            </div>
          </div>

          {/* Passenger Details */}
          <div style={{ padding: "24px", borderBottom: "1px solid #e5e7eb" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px"
            }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{
                  backgroundColor: "#f0fdf4",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "12px"
                }}>
                  <FaUser style={{ color: "#16a34a", fontSize: "14px" }} />
                </div>
                <h2 style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#0f172a",
                  margin: 0
                }}>
                  Passenger Details
                </h2>
              </div>
            </div>

            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px"
            }}>
              <thead>
                <tr style={{
                  backgroundColor: "#f8fafc",
                  borderBottom: "1px solid #e5e7eb"
                }}>
                  <th style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#475569",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    Passenger Name
                  </th>
                  <th style={{
                    padding: "12px 16px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#475569",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    Age
                  </th>
                  <th style={{
                    padding: "12px 16px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#475569",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    Type
                  </th>
                  <th style={{
                    padding: "12px 16px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#475569",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    Seat
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(travelerDetails) && travelerDetails.length > 0 ? (
                  travelerDetails.map((traveler, idx) => (
                    <tr key={idx} style={{
                      borderBottom: idx < travelerDetails.length - 1 ? "1px solid #e5e7eb" : "none"
                    }}>
                      <td style={{
                        padding: "12px 16px",
                        fontWeight: "500",
                        color: "#0f172a"
                      }}>
                        {traveler.title || ""} {traveler.fullName || "N/A"}
                      </td>
                      <td style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        color: "#334155"
                      }}>
                        {bookingResult?.passengers?.[idx]?.age || "N/A"}
                      </td>
                      <td style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        color: "#334155"
                      }}>
                        {bookingResult?.passengers?.[idx]?.type || "Adult"}
                      </td>
                      <td style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        fontWeight: "600",
                        color: "#2563eb"
                      }}>
                        {String.fromCharCode(65 + idx)}{Math.floor(Math.random() * 30) + 1}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        padding: "16px",
                        textAlign: "center",
                        color: "#64748b"
                      }}
                    >
                      No passenger details available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Contact Information */}
            {travelerDetails && travelerDetails[0] && (
              <div style={{
                marginTop: "16px",
                padding: "16px",
                backgroundColor: "#f8fafc",
                borderRadius: "4px",
                border: "1px solid #e5e7eb",
                fontSize: "14px"
              }}>
                <h4 style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#475569",
                  margin: "0 0 12px 0",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Contact Information
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaEnvelope style={{ color: "#64748b", fontSize: "12px" }} />
                    <span style={{ color: "#334155" }}>{travelerDetails[0].email || "N/A"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaPhone style={{ color: "#64748b", fontSize: "12px" }} />
                    <span style={{ color: "#334155" }}>{travelerDetails[0].phone || "N/A"}</span>
                  </div>
                </div>
                {travelerDetails[0].address && (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "8px"
                  }}>
                    <FaMapMarkerAlt style={{ color: "#64748b", fontSize: "12px" }} />
                    <span style={{ color: "#334155" }}>{travelerDetails[0].address}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Price and Important Information */}
          <div style={{ padding: "24px", borderBottom: "1px solid #e5e7eb" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start"
            }}>
              <div style={{ flex: "1" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px"
                }}>
                  <div style={{
                    backgroundColor: "#fff1f2",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "12px"
                  }}>
                    <FaInfoCircle style={{ color: "#e11d48", fontSize: "14px" }} />
                  </div>
                  <h2 style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#0f172a",
                    margin: 0
                  }}>
                    Important Information
                  </h2>
                </div>

                <div style={{ fontSize: "13px", color: "#475569" }}>
                  <div style={{ marginBottom: "12px" }}>
                    <p style={{
                      fontWeight: "600",
                      color: "#334155",
                      margin: "0 0 4px 0"
                    }}>
                      Check-in Policy
                    </p>
                    <p style={{ margin: 0 }}>
                      Report 1 hour before departure with valid photo ID (Passport/PAN/Election Card).
                    </p>
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <p style={{
                      fontWeight: "600",
                      color: "#334155",
                      margin: "0 0 4px 0"
                    }}>
                      Baggage Policy
                    </p>
                    <p style={{ margin: 0 }}>
                      Cabin baggage only: Max 7kg, 115cm total dimensions. Extra baggage: ₹1000/kg.
                    </p>
                  </div>
                  <div>
                    <p style={{
                      fontWeight: "600",
                      color: "#334155",
                      margin: "0 0 4px 0"
                    }}>
                      Cancellation Policy
                    </p>
                    <p style={{ margin: 0 }}>
                      Email booking@flyolaindia.com up to 12 hours before departure for cancellations.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{
                width: "200px",
                marginLeft: "24px",
                backgroundColor: "#f8fafc",
                padding: "16px",
                borderRadius: "4px",
                border: "1px solid #e5e7eb"
              }}>
                <h4 style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#475569",
                  margin: "0 0 12px 0",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  textAlign: "center"
                }}>
                  Price Summary
                </h4>
                <div style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#0f172a",
                  textAlign: "center"
                }}>
                  ₹ {bookingData?.totalPrice ? parseFloat(bookingData.totalPrice).toFixed(2) : "0.00"}
                </div>
                <div style={{
                  fontSize: "12px",
                  color: "#64748b",
                  textAlign: "center",
                  marginTop: "4px"
                }}>
                  Total Amount Paid
                </div>
                {bookingResult?.booking?.paymentStatus && (
                  <div style={{
                    fontSize: "11px",
                    color: bookingResult.booking.paymentStatus === "COMPLETED" ? "#15803d" : "#d97706",
                    textAlign: "center",
                    marginTop: "4px",
                    fontWeight: "600",
                    textTransform: "uppercase"
                  }}>
                    {bookingResult.booking.paymentStatus}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: "16px 24px",
            backgroundColor: "#f8fafc",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #e5e7eb"
          }}>
            <div>
              <p style={{
                fontSize: "12px",
                color: "#64748b",
                margin: 0
              }}>
                Please carry valid ID and this ticket for boarding
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <FaBarcode style={{ fontSize: "40px", color: "#334155" }} />
              <div style={{
                backgroundColor: "#ffffff",
                padding: "4px",
                borderRadius: "4px",
                border: "1px solid #e5e7eb"
              }}>
                <FaQrcode style={{ fontSize: "32px", color: "#334155" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={downloadTicket}
          style={{
            marginTop: "24px",
            width: "100%",
            backgroundColor: "#1e40af",
            color: "#ffffff",
            padding: "12px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            cursor: "pointer",
            border: "none",
            fontSize: "14px",
            fontWeight: "500",
            transition: "background-color 0.2s"
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1e3a8a"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1e40af"}
        >
          <FaDownload style={{ fontSize: "14px" }} />
          Download Ticket PDF
        </button>
      </div>
    </div>
  );
};

export default ProfessionalTicket;