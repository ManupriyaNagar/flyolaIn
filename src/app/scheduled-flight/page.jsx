"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic"; // Import dynamic for client-side rendering
import FilterSidebar from "@/components/ScheduledFlight/FilterSidebar";
import FlightCard from "@/components/ScheduledFlight/FlightCard";
import Header2 from "@/components/ScheduledFlight/Header";
import { useAuth } from "@/components/AuthContext";
import { getNextWeekday } from "@/lib/utils2";
import BASE_URL from "@/baseUrl/baseUrl";

// Dynamically import useRouter to ensure it's only used client-side
const useRouter = dynamic(() => import("next/router").then((mod) => mod.useRouter), {
  ssr: false, // Disable server-side rendering for this import
});

const ScheduledFlightsPage = () => {
  const [isClient, setIsClient] = useState(false);
  const { authState, setAuthState } = useAuth();
  const [flightSchedules, setFlightSchedules] = useState([]);
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState("Price: Low to High");
  const [filterDepartureCity, setFilterDepartureCity] = useState("");
  const [filterArrivalCity, setFilterArrivalCity] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterMinSeats, setFilterMinSeats] = useState(0);
  const [filterStops, setFilterStops] = useState("All");
  const [dates, setDates] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    departure: "",
    arrival: "",
    date: "",
    passengers: 1,
  });

  // Initialize router only on client side
  const router = typeof window !== "undefined" ? useRouter() : null;

  useEffect(() => {
    setIsClient(true); // Mark as client-side after mount
  }, []);

  useEffect(() => {
    if (!isClient || !router) return; // Skip if not client-side or router is not available

    const { departure, arrival, date, passengers } = router.query;

    setFilterDepartureCity(departure || "");
    setFilterArrivalCity(arrival || "");
    setFilterMinSeats(parseInt(passengers) || 1);
    setSearchCriteria({
      departure: departure || "",
      arrival: arrival || "",
      date: date || "",
      passengers: parseInt(passengers) || 1,
    });

    const fetchData = async () => {
      try {
        const [flightSchedulesResponse, flightsResponse, airportsResponse] = await Promise.all([
          fetch(`${BASE_URL}/flight-schedules?user=true`).then((res) => res.json()),
          fetch(`${BASE_URL}/flights?user=true`).then((res) => res.json()),
          fetch(`${BASE_URL}/airport`).then((res) => res.json()),
        ]);

        setFlightSchedules(flightSchedulesResponse || []);
        setFlights(flightsResponse || []);
        setAirports(airportsResponse || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [router?.query, isClient]); // Use optional chaining to safely access router.query

  // Rest of your code remains the same...
  useEffect(() => {
    if (flightSchedules.length > 0 && flights.length > 0) {
      const uniqueDates = new Set();
      flightSchedules.forEach((flightSchedule) => {
        const flight = flights.find((f) => f.id === flightSchedule.flight_id);
        const departureDate = flight ? getNextWeekday(flight.departure_day) : new Date();
        const formattedDate = departureDate.toISOString().split("T")[0];
        uniqueDates.add(formattedDate);
      });
      setDates([...uniqueDates].map((date) => ({
        date,
        day: new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
      })));
    }
  }, [flightSchedules, flights]);

  const getFilteredAndSortedFlightSchedules = () => {
    return flightSchedules
      .map((flightSchedule) => {
        const flight = flights.find((f) => f.id === flightSchedule.flight_id) || {};
        const departureAirport = airports.find((a) => a.id === flightSchedule.departure_airport_id) || { city: "Unknown" };
        const arrivalAirport = airports.find((a) => a.id === flightSchedule.arrival_airport_id) || { city: "Unknown" };
        const departureDate = flight.departure_day ? getNextWeekday(flight.departure_day) : new Date();
        const formattedDate = departureDate.toISOString().split("T")[0];

        const stopIds = flightSchedule.via_stop_id ? JSON.parse(flightSchedule.via_stop_id) : [];
        const routeCities = stopIds.map((id) => airports.find((a) => a.id === id)?.city || "Unknown");

        const isMultiStop = stopIds.length > 0;
        const fullRoute = [departureAirport.city, ...routeCities, arrivalAirport.city];

        return {
          ...flightSchedule,
          flight_number: flight.flight_number || "Unknown",
          seat_limit: flight.seat_limit || 0,
          status: flight.status !== undefined ? flight.status : flightSchedule.status,
          stops: stopIds,
          departure_day: flight.departure_day || "Monday",
          routeCities: fullRoute,
          departureCity: departureAirport.city,
          arrivalCity: arrivalAirport.city,
          isMultiStop,
          departure_date: formattedDate,
        };
      })
      .filter((flightSchedule) => {
        const { departureCity, arrivalCity, routeCities, status, seat_limit: seatLimit, isMultiStop, stops } = flightSchedule;

        const isValidDeparture = !filterDepartureCity || routeCities.includes(filterDepartureCity);
        const isValidArrival = !filterArrivalCity || routeCities.includes(filterArrivalCity) || arrivalCity === filterArrivalCity;

        const matchesDepartureCity = !filterDepartureCity || departureCity === filterDepartureCity;
        const matchesArrivalCity = !filterArrivalCity || arrivalCity === filterArrivalCity;
        const matchesStatus = filterStatus === "All" || (filterStatus === "Scheduled" && status === 0) || (filterStatus === "Departed" && status === 1);
        const matchesSeats = seatLimit >= filterMinSeats;
        const matchesStops = filterStops === "All" || (filterStops !== "All" && stops.length === parseInt(filterStops));
        const matchesSearchCriteria =
          (!searchCriteria.departure || departureCity === searchCriteria.departure) &&
          (!searchCriteria.arrival || arrivalCity === searchCriteria.arrival) &&
          (!searchCriteria.date || flightSchedule.departure_date === searchCriteria.date);

        return (
          (matchesDepartureCity || (isMultiStop && isValidDeparture)) &&
          (matchesArrivalCity || (isMultiStop && isValidArrival)) &&
          matchesStatus &&
          matchesSeats &&
          matchesStops &&
          matchesSearchCriteria
        );
      })
      .sort((a, b) => {
        if (sortOption === "Price: Low to High") return parseFloat(a.price || 0) - parseFloat(b.price || 0);
        else if (sortOption === "Price: High to Low") return parseFloat(b.price || 0) - parseFloat(a.price || 0);
        else if (sortOption === "Departure Time") return new Date(a.departure_time) - new Date(b.departure_time);
        return 0;
      });
  };

  const filteredAndSortedFlightSchedules = getFilteredAndSortedFlightSchedules();

  return (
    <div className="min-h-screen bg-gray-50 flex mt-20">
      <div className="w-72 flex-shrink-0 overflow-y-auto h-screen">
        <FilterSidebar
          airports={airports}
          sortOption={sortOption}
          setSortOption={setSortOption}
          filterDepartureCity={filterDepartureCity}
          setFilterDepartureCity={setFilterDepartureCity}
          filterArrivalCity={filterArrivalCity}
          setFilterArrivalCity={setFilterArrivalCity}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterMinSeats={filterMinSeats}
          setFilterMinSeats={setFilterMinSeats}
          filterStops={filterStops}
          setFilterStops={setFilterStops}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          authState={authState}
          setAuthState={setAuthState}
          dates={dates}
          selectedDate={searchCriteria.date}
          setSearchCriteria={setSearchCriteria}
        />
      </div>

      <div className="flex-1 overflow-y-auto h-screen">
        <div className="px-6">
          <Header2 />
        </div>

        <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Available Flights ({filteredAndSortedFlightSchedules.length})
            </h2>
            <button
              className="md:hidden px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg text-sm font-semibold hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2"
              onClick={() => setIsFilterOpen(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filters
            </button>
          </div>

          {filteredAndSortedFlightSchedules.length > 0 ? (
            <div className="space-y-6">
              {filteredAndSortedFlightSchedules.map((flightSchedule, index) => (
                <FlightCard
                  key={index}
                  flightSchedule={flightSchedule}
                  flights={flights}
                  airports={airports}
                  authState={authState}
                  dates={dates.map((d) => d.date)}
                  selectedDate={searchCriteria.date}
                  passengers={searchCriteria.passengers}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No active flights available matching your criteria.</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ScheduledFlightsPage;