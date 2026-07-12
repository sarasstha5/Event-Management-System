import Cookies from 'js-cookie';

const API_BASE = 'http://localhost:5000';

async function request(endpoint, options = {}) {
  const token = Cookies.get('accessToken');
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type to JSON if body is not FormData
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { message: text || 'An error occurred' };
  }

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  register: (fullname, email, phone, password) =>
    request('/auth/register', { method: 'POST', body: { fullname, email, phone, password } }),

  // User profile
  getProfile: () => request('/api/users/profile'),
  updateProfile: (fullname, phone) => request('/api/users/profile', { method: 'PUT', body: { fullname, phone } }),
  uploadProfileImage: (formData) => request('/api/users/profile-image', { method: 'POST', body: formData }),

  // Users (Admin operations)
  getUsers: () => request('/api/users'),
  deleteUser: (id) => request(`/api/users/${id}`, { method: 'DELETE' }),
  // PUT /api/users/:id/role - Update user's privileges/role (e.g. promoting them to 'admin')
  updateUserRole: (id, role) => request(`/api/users/${id}/role`, { method: 'PUT', body: { role } }),

  // Categories
  getCategories: () => request('/api/categories'),
  addCategory: (category_name) => request('/api/categories', { method: 'POST', body: { category_name } }),
  editCategory: (id, category_name) => request(`/api/categories/${id}`, { method: 'PUT', body: { category_name } }),
  deleteCategory: (id) => request(`/api/categories/${id}`, { method: 'DELETE' }),

  // Events
  getEvents: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request(`/api/events${queryString}`);
  },
  getSingleEvent: (id) => request(`/api/events/${id}`),
  createEvent: (formData) => request('/api/events', { method: 'POST', body: formData }),
  editEvent: (id, formData) => request(`/api/events/${id}`, { method: 'PUT', body: formData }),
  deleteEvent: (id) => request(`/api/events/${id}`, { method: 'DELETE' }),

  // Registrations
  registerForEvent: (event_id) => request('/api/registrations', { method: 'POST', body: { event_id } }),
  getRegistrations: () => request('/api/registrations'),
  updateRegistrationStatus: (id, status) => request(`/api/registrations/${id}`, { method: 'PUT', body: { status } }),
  deleteRegistration: (id) => request(`/api/registrations/${id}`, { method: 'DELETE' }),
  getEventParticipants: (eventId) => request(`/api/registrations/event/${eventId}`),

  // Asset helper
  getAssetUrl: (filename) => filename ? `${API_BASE}/public/images/${filename}` : null,
};
