"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FilterSidebar from "@/components/ScheduledFlight/FilterSidebar";
import FlightCard from "@/components/ScheduledFlight/FlightCard";
import Header2 from "@/components/ScheduledFlight/Header";
import { useAuth } from "@/components/AuthContext";
import BASE_URL from "@/baseUrl/baseUrl";

const ScheduledFlightsPage = () => {
  const router = useRouter();
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isValidDate = (dateStr) => {
    if (!dateStr) return false;
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  };

  const fetchData = async (date) => {
    try {
      if (!isValidDate(date)) {
        console.error(`fetchData - Invalid date: ${date}`);
        return;
      }

      const today = new Date(date);
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");

      const [flightSchedulesResponse, flightsResponse, airportsResponse] = await Promise.all([
        fetch(`${BASE_URL}/flight-schedules?user=true&month=${year}-${month}&date=${date}`).then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch schedules`);
          return res.json();
        }),
        fetch(`${BASE_URL}/flights?user=true`).then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch flights`);
          return res.json();
        }),
        fetch(`${BASE_URL}/airport`).then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch airports`);
          return res.json();
        }),
      ]);

      const normalizedFlightSchedules = Array.isArray(flightSchedulesResponse)
        ? flightSchedulesResponse.map((schedule) => {
            const departureDate = schedule.departure_date
              ? new Date(schedule.departure_date).toLocaleDateString("en-CA", {
                  timeZone: "Asia/Kolkata",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }).split("/").reverse().join("-")
              : date;
            return {
              ...schedule,
              departure_date: departureDate,
              availableSeats: schedule.availableSeats !== undefined ? schedule.availableSeats : 0,
            };
          })
        : [];

      console.log(`fetchData - date=${date}, schedules:`, normalizedFlightSchedules);
      setFlightSchedules(normalizedFlightSchedules);
      setFlights(Array.isArray(flightsResponse) ? flightsResponse : []);
      setAirports(Array.isArray(airportsResponse) ? airportsResponse : []);
    } catch (error) {
      console.error(`fetchData - Error for date=${date}:`, error.message);
      setFlightSchedules([]);
      setFlights([]);
      setAirports([]);
    }
  };

  useEffect(() => {
    if (!isClient) return;

    const getMonthDates = () => {
      const today = new Date();
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const dates = [];
      for (let d = new Date(today); d <= lastDayOfMonth; d.setDate(d.getDate() + 1)) {
        const formattedDate = d.toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).split("/").reverse().join("-");
        dates.push({
          date: formattedDate,
          day: d.toLocaleDateString("en-US", { weekday: "long", timeZone: "Asia/Kolkata" }),
        });
      }
      return dates;
    };

    const searchParams = new URLSearchParams(window.location.search);
    const departure = searchParams.get("departure") || "";
    const arrival = searchParams.get("arrival") || "";
    const date = searchParams.get("date") || new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    const passengers = parseInt(searchParams.get("passengers")) || 1;

    console.log(`ScheduledFlightsPage - Init: date=${date}, passengers=${passengers}`);

    if (!isValidDate(date)) {
      console.error(`ScheduledFlightsPage - Invalid date: ${date}`);
      return;
    }

    setFilterDepartureCity(departure);
    setFilterArrivalCity(arrival);
    setFilterMinSeats(passengers);
    setSearchCriteria({
      departure,
      arrival,
      date,
      passengers,
    });

    setDates(getMonthDates());
    fetchData(date);
  }, [isClient]);

  useEffect(() => {
    if (!isClient || !searchCriteria.date || !isValidDate(searchCriteria.date)) return;
    const interval = setInterval(() => fetchData(searchCriteria.date), 30000);
    return () => clearInterval(interval);
  }, [isClient, searchCriteria.date]);

  useEffect(() => {
    function handleSeatUpdate(e) {
      const { schedule_id, bookDate, seatsLeft } = e.detail;
      if (!isValidDate(bookDate)) {
        console.error(`ScheduledFlightsPage - Invalid bookDate: ${bookDate}`);
        return;
      }
      console.log(
        `ScheduledFlightsPage - seats-updated: schedule_id=${schedule_id}, bookDate=${bookDate}, seatsLeft=${seatsLeft}`
      );
      if (seatsLeft === 0) {
        console.warn(
          `ScheduledFlightsPage - seatsLeft=0 for schedule ${schedule_id}, bookDate=${bookDate}. ` +
          `Verify sumSeats, booked_seats, and flight seat_limit.`
        );
      }
      setFlightSchedules((prev) => {
        const updatedSchedules = prev.map((fs) =>
          fs.id === schedule_id && fs.departure_date === bookDate
            ? { ...fs, availableSeats: seatsLeft >= 0 ? seatsLeft : fs.availableSeats || 6 }
            : fs
        );
        console.log(`ScheduledFlightsPage - Updated schedules:`, updatedSchedules);
        return updatedSchedules;
      });
    }
    window.addEventListener("seats-updated", handleSeatUpdate);
    return () => window.removeEventListener("seats-updated", handleSeatUpdate);
  }, []);

  const getFilteredAndSortedFlightSchedules = () => {
    if (!Array.isArray(flightSchedules) || !Array.isArray(flights) || !Array.isArray(airports)) {
      console.warn("getFilteredAndSortedFlightSchedules - Invalid data arrays");
      return [];
    }

    const filteredSchedules = flightSchedules
      .map((flightSchedule) => {
        const flight = flights.find((f) => f.id === flightSchedule.flight_id) || {};
        const departureAirport = airports.find((a) => a.id === flightSchedule.departure_airport_id) || { city: "Unknown" };
        const arrivalAirport = airports.find((a) => a.id === flightSchedule.arrival_airport_id) || { city: "Unknown" };

        const formattedDate = flightSchedule.departure_date;

        const departureTimeIST = new Date(`1970-01-01T${flightSchedule.departure_time}`)
          .toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Kolkata",
          });
        const arrivalTimeIST = new Date(`1970-01-01T${flightSchedule.arrival_time}`)
          .toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Kolkata",
          });

        const stopIds = flightSchedule.via_stop_id ? JSON.parse(flightSchedule.via_stop_id) : [];
        const routeCities = stopIds.map((id) => airports.find((a) => a.id === id)?.city || "Unknown");

        const isMultiStop = stopIds.length > 0;
        const fullRoute = [departureAirport.city, ...routeCities, arrivalAirport.city];

        return {
          ...flightSchedule,
          flight_number: flight.flight_number || "Unknown",
          seat_limit: flight.seat_limit || 0,
          availableSeats: flightSchedule.availableSeats !== undefined ? flightSchedule.availableSeats : 0,
          status: flight.status !== undefined ? flight.status : flightSchedule.status,
          stops: stopIds,
          departure_day: flight.departure_day || "Monday",
          routeCities: fullRoute,
          departureCity: departureAirport.city,
          arrivalCity: arrivalAirport.city,
          isMultiStop,
          departure_date: formattedDate,
          departure_time_formatted: departureTimeIST,
          arrival_time_formatted: arrivalTimeIST,
        };
      })
      .filter((flightSchedule) => {
        const { departureCity, arrivalCity, routeCities, status, availableSeats, isMultiStop, stops, departure_date } = flightSchedule;

        const isValidDeparture = !filterDepartureCity || routeCities.includes(filterDepartureCity);
        const isValidArrival = !filterArrivalCity || routeCities.includes(filterArrivalCity) || arrivalCity === filterArrivalCity;

        const matchesDepartureCity = !filterDepartureCity || departureCity === filterDepartureCity;
        const matchesArrivalCity = !filterArrivalCity || arrivalCity === filterArrivalCity;
        const matchesStatus = filterStatus === "All" || (filterStatus === "Scheduled" && status === 0) || (filterStatus === "Departed" && status === 1);
        const matchesSeats = availableSeats >= 0; // Relaxed filter for debugging
        const matchesStops = filterStops === "All" || (filterStops !== "All" && stops.length === parseInt(filterStops));
        const matchesSearchCriteria =
          (!searchCriteria.departure || departureCity === searchCriteria.departure) &&
          (!searchCriteria.arrival || arrivalCity === searchCriteria.arrival) &&
          (!searchCriteria.date || departure_date === searchCriteria.date);

        const passesFilter =
          (matchesDepartureCity || (isMultiStop && isValidDeparture)) &&
          (matchesArrivalCity || (isMultiStop && isValidArrival)) &&
          matchesStatus &&
          matchesSeats &&
          matchesStops &&
          matchesSearchCriteria;

        console.log(
          `Filtering schedule ${flightSchedule.id}: ` +
          `availableSeats=${availableSeats}, filterMinSeats=${filterMinSeats}, ` +
          `matchesSeats=${matchesSeats}, passesFilter=${passesFilter}, ` +
          `departure_date=${departure_date}, searchCriteria.date=${searchCriteria.date}`
        );

        return passesFilter;
      })
      .sort((a, b) => {
        if (sortOption === "Price: Low to High") return parseFloat(a.price || 0) - parseFloat(b.price || 0);
        else if (sortOption === "Price: High to Low") return parseFloat(b.price || 0) - parseFloat(a.price || 0);
        else if (sortOption === "Departure Time") return new Date(a.departure_time) - new Date(b.departure_time);
        return 0;
      });

    console.log("getFilteredAndSortedFlightSchedules - Result:", filteredSchedules);
    return filteredSchedules;
  };

  const filteredAndSortedFlightSchedules = getFilteredAndSortedFlightSchedules();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row mt-20">
      <div className="w-full md:w-72 md:flex-shrink-0 overflow-y-auto h-auto md:h-screen bg-white shadow-lg md:sticky top-20">
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

      <div className="flex-1 overflow-y-auto h-auto">
        <div className="px-4 sm:px-6 lg:px-8">
          <Header2 />
        </div>

        <main className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
              Available Flights ({filteredAndSortedFlightSchedules.length})
            </h2>
            <button
              className="md:hidden w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg text-sm font-semibold hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2"
              onClick={() => setIsFilterOpen(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              Filters
            </button>
          </div>

          {filteredAndSortedFlightSchedules.length > 0 ? (
            <div className="space-y-6">
              {filteredAndSortedFlightSchedules.map((flightSchedule) => (
                <FlightCard
                  key={`${flightSchedule.id}-${flightSchedule.departure_date}`}
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
            <div className="text-center py-6 sm:py-12">
              <p className="text-gray-500 text-base sm:text-lg">No active flights available matching your criteria.</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ScheduledFlightsPage;