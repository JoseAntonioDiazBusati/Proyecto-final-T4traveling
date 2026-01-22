/**
 * Configuración de entorno de desarrollo
 * Usa localhost para desarrollo local
 */
export const environment = {
  production: false,
  appUrl: 'http://localhost:4200',
  apiUrl: 'http://localhost:8080/api',
  apiTimeout: 30000,
  enableLogging: true,
  retryAttempts: 3,
  retryDelay: 1000
};

