"use client"
import React from "react";
// import { useSortBy, useFilters } from "react-table";
import { useReactTable } from "@tanstack/react-table";

const flightData = [
  { day: "Friday", from: "JABALPUR", to: "SINGRAULI", etd: "11:30 AM", eta: "01:45 PM", price: "4,500.00" },
  { day: "Friday", from: "JABALPUR", to: "REWA", etd: "11:30 AM", eta: "12:15 PM", price: "2,500.00" },
  { day: "Friday", from: "REWA", to: "SINGRAULI", etd: "01:00 PM", eta: "01:45 PM", price: "2,000.00" },
  { day: "Friday", from: "BHOPAL", to: "JABALPUR", etd: "10:00 AM", eta: "11:00 AM", price: "3,300.00" },
  { day: "Friday", from: "BHOPAL", to: "SINGRAULI", etd: "10:00 AM", eta: "01:45 PM", price: "7,800.00" },
  { day: "Friday", from: "BHOPAL", to: "REWA", etd: "10:00 AM", eta: "12:15 PM", price: "5,800.00" },
  { day: "Friday", from: "SINGRAULI", to: "REWA", etd: "02:00 PM", eta: "02:45 PM", price: "2,000.00" },
  { day: "Friday", from: "REWA", to: "JABALPUR", etd: "03:00 PM", eta: "03:50 PM", price: "2,500.00" },
  { day: "Friday", from: "JABALPUR", to: "BHOPAL", etd: "04:00 PM", eta: "05:20 PM", price: "3,300.00" },
  { day: "Friday", from: "REWA", to: "BHOPAL", etd: "03:00 PM", eta: "05:20 PM", price: "5,800.00" },
];

const FlightSchedule = () => {
  const columns = React.useMemo(
    () => [
      { Header: "Day", accessor: "day" },
      { Header: "From", accessor: "from" },
      { Header: "To", accessor: "to" },
      { Header: "ETD", accessor: "etd" },
      { Header: "ETA", accessor: "eta" },
      { Header: "Actual Price", accessor: "price" },
    ],
    []
  );

  const table = useReactTable({ columns, data: flightData });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-4">View Weekly Flight Schedule</h2>
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="w-full border-collapse shadow-lg">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200">
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="p-3 text-left border cursor-pointer"
                  >
                    {column.render("Header")} {column.isSorted ? (column.isSortedDesc ? "🔽" : "🔼") : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white">
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="border hover:bg-gray-100">
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="p-3 border">
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FlightSchedule;