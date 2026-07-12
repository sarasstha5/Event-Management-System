import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

const API_BASE = 'http://localhost:5000';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Utility function to retrieve the access token from cookies using js-cookie
const getAuthTokenFromCookies = () => {
  return Cookies.get("accessToken");
};

// Function to handle GET requests
export const get = async (endpoint, params = {}) => {
  try {
    const token = getAuthTokenFromCookies();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await client.get(endpoint, { params, headers });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Function to handle POST requests
export const post = async (endpoint, body = {}, config = {}) => {
  try {
    const token = getAuthTokenFromCookies();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await client.post(endpoint, body, {
      ...config,
      headers: { ...headers, ...config.headers },
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Function to handle PUT requests
export const put = async (endpoint, body = {}, config = {}) => {
  try {
    const token = getAuthTokenFromCookies();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await client.put(endpoint, body, {
      ...config,
      headers: { ...headers, ...config.headers },
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Function to handle DELETE requests
export const del = async (endpoint) => {
  try {
    const token = getAuthTokenFromCookies();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await client.delete(endpoint, { headers });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Utility function for handling errors
const handleError = (error) => {
  console.error("API Error:", error.response || error.message);
  const errMsg = error.response?.data?.message || error.response?.data || error.message || "An error occurred. Please try again.";
  toast.error(errMsg);
};

export const api = {
  // Auth
  login: (email, password) => post('/auth/login', { email, password }),
  register: (fullname, email, phone, password) => 
    post('/auth/register', { fullname, email, phone, password }),

  // User profile
  getProfile: () => get('/api/users/profile'),
  updateProfile: (fullname, phone) => put('/api/users/profile', { fullname, phone }),
  uploadProfileImage: (formData) => post('/api/users/profile-image', formData),

  // Users (Admin operations)
  getUsers: () => get('/api/users'),
  deleteUser: (id) => del(`/api/users/${id}`),
  updateUserRole: (id, role) => put(`/api/users/${id}/role`, { role }),

  // Categories
  getCategories: () => get('/api/categories'),
  addCategory: (category_name) => post('/api/categories', { category_name }),
  editCategory: (id, category_name) => put(`/api/categories/${id}`, { category_name }),
  deleteCategory: (id) => del(`/api/categories/${id}`),

  // Events
  getEvents: (filters = {}) => {
    const cleanFilters = {};
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        cleanFilters[key] = filters[key];
      }
    });
    return get('/api/events', cleanFilters);
  },
  getSingleEvent: (id) => get(`/api/events/${id}`),
  createEvent: (formData) => post('/api/events', formData),
  editEvent: (id, formData) => put(`/api/events/${id}`, formData),
  deleteEvent: (id) => del(`/api/events/${id}`),

  // Registrations
  registerForEvent: (event_id) => post('/api/registrations', { event_id }),
  getRegistrations: () => get('/api/registrations'),
  updateRegistrationStatus: (id, status) => put(`/api/registrations/${id}`, { status }),
  deleteRegistration: (id) => del(`/api/registrations/${id}`),
  getEventParticipants: (eventId) => get(`/api/registrations/event/${eventId}`),

  // Asset helper
  getAssetUrl: (filename) => filename ? `${API_BASE}/public/images/${filename}` : null,
};
