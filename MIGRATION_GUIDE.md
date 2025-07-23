# API Migration Guide

## Files That Need to Be Updated

Based on the search results, here are the files that still use the old `fetch` + `BASE_URL` pattern and need to be migrated to use the new API service:

### ✅ Already Updated:
- `src/components/AuthModal.jsx`
- `src/components/ScheduledFlight/FlightCard.jsx`
- `src/app/scheduled-flight/page.jsx`
- `src/app/admin-dashboard/add-flight/page.jsx` (partially updated)

### 🔄 Need to Update:

#### Authentication Pages:
1. `src/app/sign-in/page.jsx`
2. `src/app/sign-up/page.jsx`
3. `src/app/forgot-password/page.jsx`
4. `src/app/reset-password/reset-password.jsx`

#### Components:
5. `src/components/SignIn.jsx`
6. `src/components/AuthContext.js`
7. `src/components/Home/FlightBooking.jsx`
8. `src/components/Home/MobileFlightBooking.jsx`
9. `src/components/FlightBookingPopup.jsx`

#### Admin Dashboard:
10. `src/app/admin-dashboard/add-airport/page.jsx`
11. `src/app/admin-dashboard/all-joyride-slots/page.jsx`
12. `src/app/admin-dashboard/booking-data/page.jsx`
13. `src/app/admin-dashboard/bookid-joyride/page.jsx`
14. `src/app/admin-dashboard/test-api/page.jsx`

#### Agent Dashboard:
15. `src/app/agent-dashboard/get-tickets/page.jsx`

#### Combined Booking Components:
16. `src/components/CombinedBookingPage/FlightRecommendations.jsx`
17. `src/components/CombinedBookingPage/BookingSummary.jsx`
18. `src/components/CombinedBookingPage/PaymentStep.jsx`
19. `src/components/CombinedBookingPage/AirportServices.jsx`
20. `src/components/CombinedBookingPage/RelatedFlights.jsx`
21. `src/components/CombinedBookingPage/FlightInsights.jsx`

#### Test/Debug Components:
22. `src/components/ApiTestComponent.jsx`
23. `src/components/AdminDebugPanel.jsx`
24. `src/app/api-test/page.jsx`
25. `src/app/server-test/page.jsx`

## Migration Pattern

### Before (Old Pattern):
```javascript
import BASE_URL from "@/baseUrl/baseUrl";

// Fetch call
const response = await fetch(`${BASE_URL}/flights`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
});

if (!response.ok) {
  throw new Error('API call failed');
}

const data = await response.json();
```

### After (New Pattern):
```javascript
import API from "@/services/api";

// Simple API call
const data = await API.flights.getFlights();
```

## Common Replacements

### Authentication:
```javascript
// Old
fetch(`${BASE_URL}/users/login`, { method: 'POST', ... })
// New
API.auth.login(credentials)

// Old
fetch(`${BASE_URL}/users/register`, { method: 'POST', ... })
// New
API.auth.register(userData)
```

### Flights:
```javascript
// Old
fetch(`${BASE_URL}/flights`)
// New
API.flights.getFlights()

// Old
fetch(`${BASE_URL}/flight-schedules`)
// New
API.flights.getFlightSchedules()
```

### Airports:
```javascript
// Old
fetch(`${BASE_URL}/airport`)
// New
API.airports.getAirports()
```

### Bookings:
```javascript
// Old
fetch(`${BASE_URL}/bookings`, { method: 'POST', ... })
// New
API.bookings.createBooking(bookingData)

// Old
fetch(`${BASE_URL}/booked-seat/available-seats`)
// New
API.bookings.getAvailableSeats(scheduleId, date)
```

### Admin Operations:
```javascript
// Old
fetch(`${BASE_URL}/flights/${id}`, { method: 'DELETE' })
// New
API.admin.deleteFlight(id)

// Old
fetch(`${BASE_URL}/flights/${id}`, { method: 'PUT', ... })
// New
API.admin.updateFlight(id, data)
```

## Step-by-Step Migration Process

1. **Add Import**: Replace `import BASE_URL from "@/baseUrl/baseUrl";` with `import API from "@/services/api";`

2. **Replace Fetch Calls**: Convert each fetch call to use the appropriate API service method

3. **Remove Error Handling**: The API service handles errors automatically with toast notifications

4. **Test**: Verify that the functionality still works correctly

## Priority Order

Update in this order for maximum impact:

1. **Authentication files** (sign-in, sign-up, forgot-password)
2. **Core components** (AuthContext, FlightBooking)
3. **Admin dashboard** (most used admin features)
4. **Booking components** (critical user flow)
5. **Test/debug components** (lowest priority)

## Benefits After Migration

- ✅ Centralized API management
- ✅ Automatic error handling
- ✅ Consistent loading states
- ✅ Built-in retry logic
- ✅ Token management
- ✅ Caching support
- ✅ Better maintainability
- ✅ Type safety ready

## Need Help?

If you encounter any issues during migration:

1. Check the API service documentation in `API_SERVICE_DOCUMENTATION.md`
2. Look at already migrated files for examples
3. Use the React hooks from `src/hooks/useApi.js` for component integration