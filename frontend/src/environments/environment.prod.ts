/**
 * Configuración de entorno de producción
 */
export const environment = {
  production: true,
  apiUrl: '/api', // URL relativa en producción
  apiTimeout: 30000,
  enableLogging: false,
  retryAttempts: 2,
  retryDelay: 1000
};

