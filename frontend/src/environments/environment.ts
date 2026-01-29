/**
 * Configuración de entorno de desarrollo
 * Usa localhost para desarrollo local
 */
export const environment = {
  production: false,
  appUrl: 'https://t4traveling-backend.onrender.com',
  apiUrl: 'https://t4traveling-backend.onrender.com/api',
  apiTimeout: 30000,
  enableLogging: true,
  retryAttempts: 3,
  retryDelay: 1000
};

