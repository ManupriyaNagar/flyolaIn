"use client"
export default function FlightSearchCard() {
    return (
      <div className="relative w-full p-6 bg-white rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-semibold">Search for Flights</h2>
        </div>
  
        {/* Top floating airplane */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
          <img src="/plane-top.png" alt="Plane" className="w-20" />
        </div>
  
        {/* Search panel */}
        <div className="mt-16 bg-gray-100 rounded-xl shadow-inner p-4 space-y-4 relative z-10">
          {/* Trip type */}
          <div className="flex justify-between">
            {['Round Trip','One Way','Multi-City','Add City'].map(label => (
              <button key={label} className="text-sm font-medium px-2 py-1 rounded-lg hover:bg-gray-200">
                {label}
              </button>
            ))}
          </div>
  
          {/* From → To */}
          <div className="flex items-center space-x-2">
            <input type="text" placeholder="From" className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none"/>
            <span>→</span>
            <input type="text" placeholder="To" className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none"/>
          </div>
  
          {/* Dates & Passengers */}
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center px-3 py-2 bg-white rounded-lg border border-gray-300">
              <span className="material-icons mr-1">calendar_today</span>
              Select Dates
            </button>
            <button className="flex items-center justify-center px-3 py-2 bg-white rounded-lg border border-gray-300">
              <span className="material-icons mr-1">person</span>
              1 Passenger
            </button>
          </div>
        </div>
  
        {/* Bottom floating airplane */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <img src="/plane-bottom.png" alt="Plane" className="w-20" />
        </div>
  
        {/* Footer nav */}
        <div className="mt-32 flex justify-around text-sm font-medium">
          <button>Hotels</button>
          <button>Cars</button>
          <button>Packages</button>
        </div>
      </div>
    )
  }
  