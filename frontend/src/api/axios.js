import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Interceptor para adjuntar el token a cada solicitud
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas con error (401 no autorizado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const esLogin = error.config?.url?.includes('/auth/login');

    if (
      error.response &&
      error.response.status === 401 &&
      window.location.pathname !== '/'
    ) {
      // Solo redirige si NO estás en el login
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      localStorage.removeItem('nombre');
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

export default api;
