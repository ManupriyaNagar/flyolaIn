"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';

export default function JoyrideTicketPage() {
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(''); // Add error state
  const router = useRouter();

  useEffect(() => {
    const bookingData = localStorage.getItem('recentBooking');
    if (bookingData) {
      setBooking(JSON.parse(bookingData));
    } else {
      setError('No booking data found. Please book a joyride first.');
      // Optionally redirect after a delay or not at all
      // setTimeout(() => router.push('/joyride-booking'), 3000);
    }

    // Removed the cleanup function to prevent clearing localStorage prematurely
    // If you want to clear localStorage, do it after downloading the PDF
  }, [router]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  };

  const downloadPDF = () => {
    if (!booking) return;

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Colors
    const blue = [0, 102, 204];
    const gray = [100, 100, 100];
    const lightGray = [243, 244, 246];
    const black = [0, 0, 0];

    doc.setFillColor(255, 255, 255);
    doc.rect(5, 5, 287, 200, 'F');
    doc.setLineWidth(1);
    doc.setDrawColor(...blue);
    doc.rect(5, 5, 287, 200);

    doc.setFillColor(...blue);
    doc.rect(5, 5, 287, 15, 'F');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('JOYRIDE TICKET', 10, 15);
    doc.setFontSize(10);
    doc.text('FlyJoy Rides', 270, 15, { align: 'right' });

    doc.setDrawColor(...blue);
    doc.setLineWidth(0.5);
    doc.line(40, 25, 70, 25);
    doc.line(55, 25, 55, 35);
    doc.line(50, 35, 60, 35);
    doc.line(45, 30, 50, 35);
    doc.line(45, 30, 45, 28);

    doc.setTextColor(...black);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('FROM', 10, 50);
    doc.setFontSize(14);
    doc.setTextColor(...blue);
    doc.text('JSA Helipad', 10, 57);
    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.setFont('helvetica', 'normal');
    doc.text(formatDate(booking.slot.date), 10, 63);
    doc.text(formatTime(booking.slot.time), 10, 68);

    doc.setFontSize(10);
    doc.setTextColor(...black);
    doc.setFont('helvetica', 'bold');
    doc.text('TO', 100, 50);
    doc.setFontSize(14);
    doc.setTextColor(...blue);
    doc.text('Sky Tour', 100, 57);
    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.setFont('helvetica', 'normal');
    doc.text(formatDate(booking.slot.date), 100, 63);
    doc.text(formatTime(booking.slot.time), 100, 68);

    doc.setFontSize(10);
    doc.setTextColor(...black);
    doc.setFont('helvetica', 'bold');
    doc.text('PASSENGER', 10, 80);
    doc.setFontSize(12);
    doc.setTextColor(...black);
    doc.setFont('helvetica', 'normal');
    doc.text(booking.passengers[0].name, 10, 87);

    doc.setDrawColor(...gray);
    doc.setLineWidth(0.3);
    doc.setLineDash([2, 2], 0);
    doc.line(190, 20, 190, 170);
    doc.setLineDash();

    doc.setFontSize(10);
    doc.setTextColor(...black);
    doc.setFont('helvetica', 'bold');
    doc.text('BOOKING ID', 200, 35);
    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.setFont('helvetica', 'normal');
    doc.text(String(booking.bookingId), 200, 41);

    doc.setFontSize(10);
    doc.setTextColor(...black);
    doc.setFont('helvetica', 'bold');
    doc.text('DATE', 200, 50);
    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.setFont('helvetica', 'normal');
    doc.text(formatDate(booking.slot.date), 200, 56);

    doc.setFontSize(10);
    doc.setTextColor(...black);
    doc.setFont('helvetica', 'bold');
    doc.text('START', 200, 65);
    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.setFont('helvetica', 'normal');
    doc.text(formatTime(booking.slot.time), 200, 71);

    doc.setFontSize(10);
    doc.setTextColor(...black);
    doc.setFont('helvetica', 'bold');
    doc.text('PRICE', 200, 80);
    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.setFont('helvetica', 'normal');
    doc.text(`RS ${Number(booking.total_price).toFixed(2)}`, 200, 86);

    doc.setFontSize(10);
    doc.setTextColor(...black);
    doc.setFont('helvetica', 'bold');
    doc.text('PASSENGERS', 200, 95);
    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.setFont('helvetica', 'normal');
    booking.passengers.forEach((passenger, index) => {
      doc.text(
        `${index + 1}. ${passenger.name} (Weight: ${passenger.weight} kg)`,
        200,
        101 + index * 6
      );
    });

    doc.setDrawColor(...black);
    doc.setLineWidth(0.5);
    for (let i = 0; i < 30; i++) {
      const x = 200 + i * 2;
      const width = Math.random() > 0.5 ? 1 : 0.5;
      doc.line(x, 130, x, 150);
    }

    doc.setFillColor(...lightGray);
    doc.rect(5, 170, 287, 35, 'F');
    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.text(
      'Thank you for choosing FlyJoy Rides! Arrive 15 minutes early. For support, contact us at support@flyolaindia.com.',
      148.5,
      180,
      { align: 'center' }
    );

    doc.save('joyride-ticket.pdf');

    // Clear localStorage after downloading the PDF
    localStorage.removeItem('recentBooking');
  };

  if (!booking && !error) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => router.push('/joyride-booking')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Booking Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex items-center justify-center py-8">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-blue-600">
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">JOYRIDE TICKET</h1>
          <p className="text-sm font-semibold">FlyJoy Rides</p>
        </div>

        <div className="p-6 flex">
          <div className="w-2/3 pr-6 border-r border-dashed border-gray-300">
            <div className="flex right-0  mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 12h-2l-1-3h-5v-2h3V5h-3V3h-2v2h-3v2h3v2H9l-1 3H6l-1 3H3" />
                <path d="M5 12h14" />
                <path d="M12 12v9" />
                <path d="M9 21h6" />
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-600 text-sm font-semibold">FROM</p>
                <p className="text-2xl font-bold text-blue-600">JSA Helipad</p>
                <p className="text-sm">{formatDate(booking.slot.date)}</p>
                <p className="text-sm">{formatTime(booking.slot.time)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold">TO</p>
                <p className="text-2xl font-bold text-blue-600">Sky Tour</p>
                <p className="text-sm">{formatDate(booking.slot.date)}</p>
                <p className="text-sm">{formatTime(booking.slot.time)}</p>
              </div>
            </div>

            <div>
              <p className="text-gray-600 text-sm font-semibold">PASSENGER</p>
              <p className="text-lg font-bold">{booking.passengers[0].name}</p>
            </div>
          </div>

          <div className="w-1/3 pl-6 flex flex-col justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">BOOKING ID</p>
              <p className="text-sm">{booking.bookingId}</p>

              <p className="text-gray-600 text-sm font-semibold mt-4">DATE</p>
              <p className="text-sm">{formatDate(booking.slot.date)}</p>

              <p className="text-gray-600 text-sm font-semibold mt-4">START</p>
              <p className="text-sm">{formatTime(booking.slot.time)}</p>

              <p className="text-gray-600 text-sm font-semibold mt-4">PRICE</p>
              <p className="text-sm">₹{Number(booking.total_price).toFixed(2)}</p>

              <p className="text-gray-600 text-sm font-semibold mt-4">PASSENGERS</p>
              <ul className="list-disc pl-5 text-sm">
                {booking.passengers.map((passenger, index) => (
                  <li key={index}>
                    {passenger.name} (Weight: {passenger.weight} kg)
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <svg
                className="w-full h-12"
                viewBox="0 0 100 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="0" y="0" width="2" height="40" fill="black" />
                <rect x="4" y="0" width="1" height="40" fill="black" />
                <rect x="7" y="0" width="3" height="40" fill="black" />
                <rect x="12" y="0" width="1" height="40" fill="black" />
                <rect x="15" y="0" width="2" height="40" fill="black" />
                <rect x="19" y="0" width="1" height="40" fill="black" />
                <rect x="22" y="0" width="3" height="40" fill="black" />
                <rect x="27" y="0" width="2" height="40" fill="black" />
                <rect x="31" y="0" width="1" height="40" fill="black" />
                <rect x="34" y="0" width="2" height="40" fill="black" />
                <rect x="38" y="0" width="3" height="40" fill="black" />
                <rect x="43" y="0" width="1" height="40" fill="black" />
                <rect x="46" y="0" width="2" height="40" fill="black" />
                <rect x="50" y="0" width="1" height="40" fill="black" />
                <rect x="53" y="0" width="3" height="40" fill="black" />
                <rect x="58" y="0" width="2" height="40" fill="black" />
                <rect x="62" y="0" width="1" height="40" fill="black" />
                <rect x="65" y="0" width="2" height="40" fill="black" />
                <rect x="69" y="0" width="3" height="40" fill="black" />
                <rect x="74" y="0" width="1" height="40" fill="black" />
                <rect x="77" y="0" width="2" height="40" fill="black" />
                <rect x="81" y="0" width="1" height="40" fill="black" />
                <rect x="84" y="0" width="3" height="40" fill="black" />
                <rect x="89" y="0" width="2" height="40" fill="black" />
                <rect x="93" y="0" width="1" height="40" fill="black" />
                <rect x="96" y="0" width="2" height="40" fill="black" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 text-center border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">
            Thank you for choosing FlyJoy Rides! Arrive 15 minutes early. For support, contact us at{' '}
            <a href="mailto:support@flyolaindia.com" className="text-blue-600">
              support@flyolaindia.com
            </a>
            .
          </p>
          <div className="flex justify-center space-x-4">
           
            <button
              onClick={downloadPDF}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}