# Professional API Service Layer Documentation

## Overview

This is a comprehensive, enterprise-level API service layer for the Flyola application. It provides a centralized, consistent, and maintainable way to handle all API operations throughout the application.

## 🏗️ Architecture

### Core Components

1. **API Service (`/src/services/api.js`)** - Main API client with service classes
2. **API Hooks (`/src/hooks/useApi.js`)** - React hooks for API operations
3. **API Constants (`/src/services/apiConstants.js`)** - Centralized constants and endpoints
4. **API Utils (`/src/services/apiUtils.js`)** - Utility functions for API operations
5. **Services Index (`/src/services/index.js`)** - Central export point

## 🚀 Features

### ✅ Professional Features
- **Centralized API Management** - All API calls in one place
- **Type Safety** - Consistent error handling and response types
- **Token Management** - Automatic token handling and refresh
- **Request Interceptors** - Automatic headers, auth, and error handling
- **Caching System** - Built-in response caching
- **Retry Logic** - Automatic retry for failed requests
- **Request Deduplication** - Prevent duplicate requests
- **File Upload Support** - Multipart form data handling
- **Real-time Updates** - WebSocket integration ready

### ✅ Developer Experience
- **React Hooks** - Easy integration with React components
- **TypeScript Ready** - Full TypeScript support structure
- **Error Boundaries** - Comprehensive error handling
- **Loading States** - Built-in loading state management
- **Toast Notifications** - Automatic success/error notifications
- **Development Tools** - Logging and debugging utilities

## 📁 File Structure

```
src/
├── services/
│   ├── api.js              # Main API service
│   ├── apiConstants.js     # Constants and endpoints
│   ├── apiUtils.js         # Utility functions
│   └── index.js           # Export point
├── hooks/
│   └── useApi.js          # React hooks
└── components/
    └── AuthModal.jsx      # Updated to use API service
```

## 🔧 Usage Examples

### Basic API Usage

```javascript
import API from '@/services/api';

// Authentication
const loginResult = await API.auth.login({ email, password });
const user = await API.auth.register({ name, email, password });

// Flights
const flights = await API.flights.getFlights();
const schedules = await API.flights.getFlightSchedules({ month: '2024-01' });

// Bookings
const booking = await API.bookings.createBooking(bookingData);
const seats = await API.bookings.getAvailableSeats(scheduleId, date);
```

### Using React Hooks

```javascript
import { useFlights, useCreateBooking, useAuth } from '@/hooks/useApi';

function FlightList() {
  const { data: flights, loading, error, refetch } = useFlights();
  const { createBooking, loading: bookingLoading } = useCreateBooking();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {flights.map(flight => (
        <FlightCard 
          key={flight.id} 
          flight={flight}
          onBook={(data) => createBooking(data)}
        />
      ))}
    </div>
  );
}
```

### Error Handling

```javascript
import { API, handleApiError } from '@/services';

try {
  const result = await API.flights.getFlights();
} catch (error) {
  const message = handleApiError(error);
  toast.error(message);
}
```

## 🔐 Authentication

### Token Management

```javascript
import { TokenManager } from '@/services/api';

// Set token
TokenManager.setToken('your-token', true); // true for remember me

// Get token
const token = TokenManager.getToken();

// Remove token
TokenManager.removeToken();

// Get auth headers
const headers = TokenManager.getAuthHeaders();
```

### Authentication Hooks

```javascript
import { useAuth } from '@/hooks/useApi';

function LoginForm() {
  const { login, register, logout, loading } = useAuth();
  
  const handleLogin = async (credentials) => {
    try {
      await login(credentials, true); // true for remember me
      // Success handled automatically
    } catch (error) {
      // Error handled automatically with toast
    }
  };
}
```

## 📊 Service Classes

### AuthService
- `login(credentials)` - User login
- `register(userData)` - User registration
- `forgotPassword(email)` - Password reset request
- `resetPassword(token, password)` - Password reset
- `logout()` - User logout

### FlightService
- `getFlights(params)` - Get flight list
- `getFlightSchedules(params)` - Get flight schedules
- `getFlightById(id)` - Get single flight
- `searchFlights(searchParams)` - Search flights

### BookingService
- `createBooking(bookingData)` - Create new booking
- `getBookings(params)` - Get user bookings
- `getAvailableSeats(scheduleId, date)` - Get available seats
- `cancelBooking(id)` - Cancel booking

### PaymentService
- `createPayment(paymentData)` - Process payment
- `getPaymentStatus(paymentId)` - Check payment status
- `processRefund(paymentId, amount)` - Process refund

## 🎣 React Hooks

### Data Fetching Hooks
- `useFlights(params)` - Fetch flights
- `useFlightSchedules(params)` - Fetch flight schedules
- `useAirports()` - Fetch airports
- `useBookings(params)` - Fetch bookings

### Mutation Hooks
- `useCreateBooking()` - Create booking
- `useUpdateProfile()` - Update user profile
- `usePayment()` - Process payments

### Utility Hooks
- `useApi(apiCall, deps, options)` - Generic API hook
- `useMutation(mutationFn, options)` - Generic mutation hook
- `usePolling(apiCall, interval)` - Real-time data polling

## ⚙️ Configuration

### API Configuration

```javascript
import API from '@/services/api';

// Set base URL
API.setBaseURL('https://api.flyola.com');

// Set timeout
API.setTimeout(60000); // 60 seconds
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.flyola.com
NEXT_PUBLIC_WS_URL=wss://ws.flyola.com
```

## 🛠️ Advanced Features

### Caching

```javascript
import { getCachedData, setCachedData } from '@/services/apiUtils';

// Cache data
setCachedData('flights', flightData, 5 * 60 * 1000); // 5 minutes

// Get cached data
const cachedFlights = getCachedData('flights');
```

### Request Retry

```javascript
import { withRetry } from '@/services/apiUtils';

const result = await withRetry(
  () => API.flights.getFlights(),
  3, // max attempts
  1000 // delay between attempts
);
```

### File Upload

```javascript
import { createFormData } from '@/services/apiUtils';

const formData = createFormData(
  { name: 'John', email: 'john@example.com' },
  { avatar: fileInput.files[0] }
);

const result = await API.users.uploadAvatar(formData);
```

## 🔍 Error Handling

### Error Types

```javascript
import { ApiError, API } from '@/services/api';

try {
  await API.auth.login(credentials);
} catch (error) {
  if (API.isApiError(error)) {
    console.log('Status:', error.status);
    console.log('Message:', error.message);
    console.log('Data:', error.data);
  }
}
```

### Global Error Handling

```javascript
// In your app root
import { handleApiError } from '@/services/apiUtils';

window.addEventListener('unhandledrejection', (event) => {
  if (API.isApiError(event.reason)) {
    const message = handleApiError(event.reason);
    toast.error(message);
    event.preventDefault();
  }
});
```

## 📈 Performance Optimizations

### Request Deduplication

```javascript
import { withDeduplication } from '@/services/apiUtils';

// Multiple calls to the same endpoint will be deduplicated
const flights1 = await withDeduplication('flights', () => API.flights.getFlights());
const flights2 = await withDeduplication('flights', () => API.flights.getFlights());
// Only one actual API call is made
```

### Debounced Search

```javascript
import { debounce } from '@/services/apiUtils';

const debouncedSearch = debounce(async (query) => {
  const results = await API.flights.searchFlights({ query });
  setSearchResults(results);
}, 300);
```

## 🧪 Testing

### Mock API for Testing

```javascript
// In your test files
import API from '@/services/api';

// Mock API calls
jest.mock('@/services/api', () => ({
  auth: {
    login: jest.fn().mockResolvedValue({ token: 'mock-token', user: {} }),
  },
  flights: {
    getFlights: jest.fn().mockResolvedValue([]),
  },
}));
```

## 🚀 Migration Guide

### From Direct Fetch to API Service

**Before:**
```javascript
const response = await fetch(`${BASE_URL}/flights`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
const flights = await response.json();
```

**After:**
```javascript
const flights = await API.flights.getFlights();
```

### From useEffect to Hooks

**Before:**
```javascript
const [flights, setFlights] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchFlights();
}, []);

const fetchFlights = async () => {
  try {
    const response = await fetch('/api/flights');
    const data = await response.json();
    setFlights(data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

**After:**
```javascript
const { data: flights, loading } = useFlights();
```

## 📋 Best Practices

1. **Always use the API service** instead of direct fetch calls
2. **Use React hooks** for component integration
3. **Handle errors gracefully** with try-catch blocks
4. **Use TypeScript** for better type safety
5. **Cache frequently accessed data** to improve performance
6. **Implement loading states** for better UX
7. **Use debouncing** for search functionality
8. **Test API integrations** thoroughly

## 🔄 Future Enhancements

- [ ] GraphQL support
- [ ] Real-time subscriptions
- [ ] Offline support with service workers
- [ ] Request/response interceptors
- [ ] API versioning support
- [ ] Rate limiting implementation
- [ ] Request analytics and monitoring

## 📞 Support

For questions or issues with the API service layer, please:

1. Check this documentation first
2. Look at the code examples in `/src/services/`
3. Review the React hooks in `/src/hooks/useApi.js`
4. Create an issue with detailed information

---

This professional API service layer provides a solid foundation for scalable, maintainable API management in your React application.