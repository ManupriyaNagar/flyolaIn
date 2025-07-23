/**
 * Centralized API Service Layer
 * Professional API management for Flyola application
 */

import BASE_URL from '@/baseUrl/baseUrl';

// API Configuration
const API_CONFIG = {
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Token management utilities
const TokenManager = {
  getToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  },
  
  setToken: (token, remember = false) => {
    if (typeof window === 'undefined') return;
    if (remember) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
  },
  
  removeToken: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  },
  
  getAuthHeaders: () => {
    const token = TokenManager.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};

// HTTP Client with interceptors
class HttpClient {
  constructor(config = {}) {
    this.config = { ...API_CONFIG, ...config };
  }

  async request(endpoint, options = {}) {
    const url = `${this.config.baseURL}${endpoint}`;
    const config = {
      method: 'GET',
      headers: {
        ...this.config.headers,
        ...TokenManager.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      // Handle different response types
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new ApiError(data.message || data.error || 'Request failed', response.status, data);
      }

      return { data, status: response.status, headers: response.headers };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError('Network error', 0, error);
    }
  }

  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Custom API Error class
class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Create HTTP client instance
const httpClient = new HttpClient();

// API Service Classes
class AuthService {
  static async login(credentials) {
    const response = await httpClient.post('/users/login', credentials);
    return response.data;
  }

  static async register(userData) {
    const response = await httpClient.post('/users/register', userData);
    return response.data;
  }

  static async forgotPassword(email) {
    const response = await httpClient.post('/users/forgot-password', { email });
    return response.data;
  }

  static async resetPassword(token, password) {
    const response = await httpClient.post('/users/reset-password', { token, password });
    return response.data;
  }

  static async refreshToken() {
    const response = await httpClient.post('/users/refresh-token');
    return response.data;
  }

  static async logout() {
    try {
      await httpClient.post('/users/logout');
    } finally {
      TokenManager.removeToken();
    }
  }
}

class FlightService {
  static async getFlights(params = {}) {
    const response = await httpClient.get('/flights', { user: true, ...params });
    return response.data;
  }

  static async getFlightSchedules(params = {}) {
    const response = await httpClient.get('/flight-schedules', { user: true, ...params });
    return response.data;
  }

  static async getFlightById(id) {
    const response = await httpClient.get(`/flights/${id}`);
    return response.data;
  }

  static async searchFlights(searchParams) {
    const response = await httpClient.get('/flights/search', searchParams);
    return response.data;
  }
}

class AirportService {
  static async getAirports() {
    const response = await httpClient.get('/airport');
    return response.data;
  }

  static async getAirportById(id) {
    const response = await httpClient.get(`/airport/${id}`);
    return response.data;
  }

  static async searchAirports(query) {
    const response = await httpClient.get('/airport/search', { q: query });
    return response.data;
  }
}

class BookingService {
  static async createBooking(bookingData) {
    const response = await httpClient.post('/api/booking/ticket', bookingData);
    return response.data;
  }

  static async getBookings(params = {}) {
    const response = await httpClient.get('/bookings', params);
    return response.data;
  }

  static async getBookingById(id) {
    const response = await httpClient.get(`/bookings/${id}`);
    return response.data;
  }

  static async updateBooking(id, data) {
    const response = await httpClient.put(`/bookings/${id}`, data);
    return response.data;
  }

  static async cancelBooking(id) {
    const response = await httpClient.delete(`/bookings/${id}`);
    return response.data;
  }

  static async getAvailableSeats(scheduleId, bookDate) {
    const response = await httpClient.get('/booked-seat/available-seats', {
      schedule_id: scheduleId,
      bookDate: bookDate,
    });
    return response.data;
  }
}

class PaymentService {
  static async createPayment(paymentData) {
    const response = await httpClient.post('/payments', paymentData);
    return response.data;
  }

  static async getPaymentStatus(paymentId) {
    const response = await httpClient.get(`/payments/${paymentId}/status`);
    return response.data;
  }

  static async processRefund(paymentId, amount) {
    const response = await httpClient.post(`/payments/${paymentId}/refund`, { amount });
    return response.data;
  }
}

class UserService {
  static async getProfile() {
    const response = await httpClient.get('/users/profile');
    return response.data;
  }

  static async updateProfile(profileData) {
    const response = await httpClient.put('/users/profile', profileData);
    return response.data;
  }

  static async changePassword(passwordData) {
    const response = await httpClient.put('/users/change-password', passwordData);
    return response.data;
  }

  static async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await httpClient.request('/users/avatar', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    });
    return response.data;
  }
}

class AdminService {
  static async getDashboardStats() {
    const response = await httpClient.get('/admin/dashboard/stats');
    return response.data;
  }

  static async getUsers(params = {}) {
    const response = await httpClient.get('/admin/users', params);
    return response.data;
  }

  static async createFlight(flightData) {
    const response = await httpClient.post('/admin/flights', flightData);
    return response.data;
  }

  static async updateFlight(id, flightData) {
    const response = await httpClient.put(`/admin/flights/${id}`, flightData);
    return response.data;
  }

  static async deleteFlight(id) {
    const response = await httpClient.delete(`/admin/flights/${id}`);
    return response.data;
  }

  static async createAirport(airportData) {
    const response = await httpClient.post('/admin/airports', airportData);
    return response.data;
  }
}

class JoyRideService {
  static async getJoyRides(params = {}) {
    const response = await httpClient.get('/joy-rides', params);
    return response.data;
  }

  static async bookJoyRide(bookingData) {
    const response = await httpClient.post('/joy-rides/book', bookingData);
    return response.data;
  }

  static async getJoyRideSlots(date) {
    const response = await httpClient.get('/joy-rides/slots', { date });
    return response.data;
  }
}

class CharterService {
  static async getCharterOptions() {
    const response = await httpClient.get('/charter/options');
    return response.data;
  }

  static async requestCharter(charterData) {
    const response = await httpClient.post('/charter/request', charterData);
    return response.data;
  }

  static async getCharterQuote(quoteData) {
    const response = await httpClient.post('/charter/quote', quoteData);
    return response.data;
  }
}

// Main API object - single point of access
const API = {
  // Services
  auth: AuthService,
  flights: FlightService,
  airports: AirportService,
  bookings: BookingService,
  payments: PaymentService,
  users: UserService,
  admin: AdminService,
  joyRides: JoyRideService,
  charter: CharterService,

  // Utilities
  token: TokenManager,
  client: httpClient,
  
  // Error handling
  isApiError: (error) => error instanceof ApiError,
  
  // Configuration
  setBaseURL: (url) => {
    API_CONFIG.baseURL = url;
    httpClient.config.baseURL = url;
  },
  
  setTimeout: (timeout) => {
    API_CONFIG.timeout = timeout;
    httpClient.config.timeout = timeout;
  },
};

// Export everything
export default API;
export {
  AuthService,
  FlightService,
  AirportService,
  BookingService,
  PaymentService,
  UserService,
  AdminService,
  JoyRideService,
  CharterService,
  TokenManager,
  ApiError,
  httpClient,
};