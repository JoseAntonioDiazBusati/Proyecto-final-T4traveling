import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Interceptor de logging para peticiones HTTP
 *
 * Registra información de las peticiones y respuestas HTTP
 * para facilitar el debugging durante el desarrollo.
 *
 * Características:
 * - Solo activo en modo desarrollo (environment.enableLogging)
 * - Registra método, URL y tiempo de respuesta
 * - Registra headers y body de las peticiones (opcional)
 * - Usa colores en consola para diferenciar tipos de respuesta
 */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  // Solo registrar si está habilitado en el entorno
  if (!environment.enableLogging) {
    return next(req);
  }

  const startTime = Date.now();
  const requestId = generateRequestId();

  // Log de la petición saliente
  console.group(`🌐 HTTP Request [${requestId}]`);
  console.log(`📤 ${req.method} ${req.urlWithParams}`);

  if (req.body) {
    console.log('📦 Body:', req.body);
  }

  console.groupEnd();

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          const duration = Date.now() - startTime;
          const statusColor = getStatusColor(event.status);

          console.group(`🌐 HTTP Response [${requestId}]`);
          console.log(
            `${statusColor} ${event.status} ${req.method} ${req.url} (${duration}ms)`
          );

          if (event.body && environment.enableLogging) {
            console.log('📥 Response:', event.body);
          }

          console.groupEnd();
        }
      },
      error: (error) => {
        const duration = Date.now() - startTime;

        console.group(`🌐 HTTP Error [${requestId}]`);
        console.error(
          `❌ ${error.status || 'Network Error'} ${req.method} ${req.url} (${duration}ms)`
        );
        console.error('Error details:', error);
        console.groupEnd();
      }
    })
  );
};

/**
 * Genera un ID único para cada petición
 */
function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Retorna el emoji de color según el código de estado
 */
function getStatusColor(status: number): string {
  if (status >= 200 && status < 300) {
    return '✅'; // Success
  } else if (status >= 300 && status < 400) {
    return '↪️'; // Redirect
  } else if (status >= 400 && status < 500) {
    return '⚠️'; // Client Error
  } else if (status >= 500) {
    return '🔥'; // Server Error
  }
  return 'ℹ️'; // Unknown
}

