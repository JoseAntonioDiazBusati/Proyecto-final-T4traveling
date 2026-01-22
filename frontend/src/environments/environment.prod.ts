/**
 * Configuración de entorno de producción
 * Usa URLs relativas o dinámicas que funcionan en cualquier dominio
 * Compatible con Render, Netlify, Vercel, etc.
 */
export const environment = {
  production: true,
  // appUrl usa window.location.origin para detectar automáticamente el dominio
  appUrl: '', // Se detecta dinámicamente en runtime
  apiUrl: '/api', // URL relativa en producción
  apiTimeout: 30000,
  enableLogging: false,
  retryAttempts: 2,
  retryDelay: 1000
};

