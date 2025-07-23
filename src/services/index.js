/**
 * Services Index
 * Central export point for all API services
 */

// Main API service
export { default as API } from './api';

// Individual services
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
} from './api';

// API hooks
export * from '../hooks/useApi';

// Constants and utilities
export { default as ApiConstants } from './apiConstants';
export { default as ApiUtils } from './apiUtils';

// Re-export specific constants for convenience
export {
  API_ENDPOINTS,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from './apiConstants';

// Re-export specific utilities for convenience
export {
  handleApiError,
  buildUrl,
  formatDateForApi,
  debounce,
  throttle,
} from './apiUtils';