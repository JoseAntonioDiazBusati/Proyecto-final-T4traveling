/**
 * Configuración de entorno de producción
 * Usa URLs del backend desplegado en Render
 */
export const environment = {
  production: true,
  // appUrl usa window.location.origin para detectar automáticamente el dominio
  appUrl: '', // Se detecta dinámicamente en runtime
  apiUrl: 'https://t4traveling-backend.onrender.com/api', // URL del backend en Render
  apiTimeout: 30000,
  enableLogging: false,
  retryAttempts: 2,
  retryDelay: 1000
};

