import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const serverRoot = API_BASE_URL.replace('/api', '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${serverRoot}${normalizedPath}`;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (config.data instanceof FormData) delete config.headers['Content-Type'];
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  register: (userData) => api.post('/auth/register', userData),
};

export const coursesAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  // Accepts plain object OR FormData (for image uploads)
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  // Dedicated image upload endpoint
  uploadImage: (id, formData) => api.post(`/courses/${id}/image`, formData),
};

export const libraryAPI = {
  getAll: (params) => api.get('/library', { params }),
  getById: (id) => api.get(`/library/${id}`),
  download: (id) => api.get(`/library/${id}/download`),
  create: (data) => api.post('/library', data),
  update: (id, data) => api.put(`/library/${id}`, data),
  delete: (id) => api.delete(`/library/${id}`),
};

export const studyMaterialsAPI = {
  getAll: (params) => api.get('/study-materials', { params }),
  getById: (id) => api.get(`/study-materials/${id}`),
  download: (id) => api.get(`/study-materials/${id}/download`),
  create: (data) => api.post('/study-materials', data),
  update: (id, data) => api.put(`/study-materials/${id}`, data),
  delete: (id) => api.delete(`/study-materials/${id}`),
};

export const articlesAPI = {
  getAll: (params) => api.get('/articles', { params }),
  getById: (id) => api.get(`/articles/${id}`),
  create: (data) => api.post('/articles', data),
  update: (id, data) => api.put(`/articles/${id}`, data),
  delete: (id) => api.delete(`/articles/${id}`),
};

export const contactAPI = {
  submit: (data) => api.post('/contact', data),
  getAll: (params) => api.get('/contact', { params }),
  getById: (id) => api.get(`/contact/${id}`),
  updateStatus: (id, status) => api.put(`/contact/${id}/status`, { status }),
};

export const admissionAPI = {
  submit: (data) => api.post('/admission', data),
  getAll: (params) => api.get('/admission', { params }),
  getById: (id) => api.get(`/admission/${id}`),
  updateStatus: (id, status) => api.put(`/admission/${id}/status`, { status }),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getRecentActivity: (params) => api.get('/admin/recent-activity', { params }),
};

export default api;
